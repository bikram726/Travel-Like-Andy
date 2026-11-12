import { normalizeCurrencyFloat, parseBackup, sha256Hex, type BackupTrip } from '../backup.ts';

type Entity = 'trip' | 'plan' | 'expense';
type TripValue = Omit<BackupTrip, 'plans' | 'expenses'>;
export type SyncRecord = { id: string; entity: Entity; tripId: string; owner: string; revision: number; deleted: boolean; value: unknown; updated_at?: string; deleted_at?: string | null };
export type SyncReceipt = { request: string; revision: number; deleted: boolean };
export type SyncView = {
  record: (id: string) => SyncRecord | undefined;
  children: (trip: string) => readonly SyncRecord[];
  // Receipt lookup MUST be scoped to the verified account, never only operation ID.
  receipt: (account: string, operation: string) => SyncReceipt | undefined;
};
export class SyncPolicyError extends Error {
  status: 401 | 404 | 409 | 422;
  constructor(status: SyncPolicyError['status'], message: string) { super(message); this.status = status; }
}
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
function invalid(): never { throw new SyncPolicyError(422, 'Invalid sync operation.'); }
function missing(): never { throw new SyncPolicyError(404, 'Record unavailable.'); }
function canonical(value: unknown): string {
  try {
    const result = JSON.stringify(value, (_key, item) => {
      if (typeof item === 'number') return normalizeCurrencyFloat(item);
      if (item && typeof item === 'object' && !Array.isArray(item)) return Object.fromEntries(Object.keys(item).sort().map(key => [key, item[key]]));
      return item;
    });
    if (result.length > 2_000_000) return invalid();
    return result;
  } catch { return invalid(); }
}

export function hashSyncPayload(value: unknown): Promise<string> {
  return sha256Hex(value);
}

// Row-level Last-Write-Wins resolution with deleted_at tombstone precedence on ties.
export function resolveLwwRow<T extends { updated_at?: string; deleted_at?: string | null }>(local: T, remote: T) {
  const localTs = local.deleted_at ?? local.updated_at ?? '';
  const remoteTs = remote.deleted_at ?? remote.updated_at ?? '';
  let winner: 'local' | 'remote';
  if (remoteTs !== localTs) winner = remoteTs > localTs ? 'remote' : 'local';
  else if (Boolean(local.deleted_at) !== Boolean(remote.deleted_at)) winner = local.deleted_at ? 'local' : 'remote';
  else winner = 'remote';
  const row = winner === 'local' ? local : remote;
  return { winner, row, isTombstone: Boolean(row.deleted_at) };
}

// Server-side preparation only: this does not authenticate sessions or persist.
// The API must derive account from verified credentials, run this inside its
// database transaction, and atomically write the mutation and receipt.
export function prepareSyncMutation(account: string | null, input: unknown, view: SyncView) {
  if (!account || account.length > 256) throw new SyncPolicyError(401, 'Sign in again to synchronize.');
  if (!input || typeof input !== 'object' || Array.isArray(input)) return invalid();
  const operation = input as Record<string, unknown>;
  const keys = ['operation_id', 'entity', 'entity_id', 'trip_id', 'expected_revision', 'action', 'value'];
  if (Object.keys(operation).length !== keys.length || keys.some(key => !Object.hasOwn(operation, key))) return invalid();
  const { operation_id, entity, entity_id, trip_id, expected_revision, action, value } = operation;
  if (typeof operation_id !== 'string' || !uuid.test(operation_id) || typeof entity_id !== 'string' || !uuid.test(entity_id) || typeof trip_id !== 'string' || !uuid.test(trip_id) || typeof entity !== 'string' || !['trip', 'plan', 'expense'].includes(entity) || typeof action !== 'string' || !['put', 'delete'].includes(action) || !Number.isSafeInteger(expected_revision) || (expected_revision as number) < 0 || (expected_revision as number) >= Number.MAX_SAFE_INTEGER) return invalid();
  if (entity === 'trip' && entity_id !== trip_id) return invalid();
  if (action === 'delete' && value !== null) return invalid();
  const request = canonical(operation);
  const prior = view.receipt(account, operation_id);
  if (prior) {
    if (prior.request !== request) throw new SyncPolicyError(409, 'This operation ID was already used for a different edit.');
    // A successful old operation can be acknowledged after later edits/deletion.
    // Replaying its receipt does not execute the mutation again.
    return { operation, nextRevision: prior.revision, replay: true, deleted: prior.deleted, request };
  }
  const current = view.record(entity_id);
  // Hide existence equally for unknown IDs and records owned by another account.
  if (current && (current.owner !== account || current.entity !== entity || current.tripId !== trip_id)) return missing();
  let parent: SyncRecord | undefined;
  if (entity !== 'trip') {
    parent = view.record(trip_id);
    if (!parent || parent.owner !== account || parent.entity !== 'trip' || parent.deleted) return missing();
  }
  let validated: unknown = null;
  if (action === 'put') {
    try {
      const trip = entity === 'trip' ? value as TripValue : parent!.value as TripValue;
      if (entity === 'trip' && (!trip || typeof trip !== 'object' || Array.isArray(trip) || Object.keys(trip).length !== 6 || ['title', 'destination', 'start_date', 'end_date', 'currency', 'budget_cents'].some(key => !Object.hasOwn(trip, key)))) return invalid();
      const children = entity === 'trip' ? view.children(trip_id).filter(child => !child.deleted) : [];
      if (children.some(child => child.owner !== account || child.tripId !== trip_id || !['plan', 'expense'].includes(child.entity))) return missing();
      if (current && entity === 'trip' && (current.value as TripValue).currency !== trip.currency && children.some(child => child.entity === 'expense')) throw new SyncPolicyError(409, 'Trip currency cannot change while expenses exist.');
      // Reuse the complete bounded server input validation, including entry dates
      // inside their parent trip and exact currency-conversion provenance.
      const parsed = parseBackup(JSON.stringify({ format: 'travel-like-andy', version: 2, trips: [{ ...trip, plans: entity === 'plan' ? [value] : children.filter(child => child.entity === 'plan').map(child => child.value), expenses: entity === 'expense' ? [value] : children.filter(child => child.entity === 'expense').map(child => child.value) }] })).trips[0];
      if (entity === 'plan') validated = parsed.plans[0];
      else if (entity === 'expense') validated = parsed.expenses[0];
      else { const { plans: _plans, expenses: _expenses, ...metadata } = parsed; validated = metadata; }
    } catch (error) { if (error instanceof SyncPolicyError) throw error; return invalid(); }
  }
  const normalized = { operation_id, entity, entity_id, trip_id, expected_revision, action, value: validated };
  if (current?.deleted || current?.deleted_at) throw new SyncPolicyError(409, 'This record was deleted. Review the local edit before synchronizing.');
  if (!current && action === 'delete') return missing();
  if ((current?.revision ?? 0) !== expected_revision) throw new SyncPolicyError(409, 'Another device changed this record. Review both versions.');
  const deletedAt = action === 'delete' ? new Date().toISOString() : null;
  return { operation: normalized, nextRevision: (expected_revision as number) + 1, replay: false, deleted: action === 'delete', deletedAt, request };
}
