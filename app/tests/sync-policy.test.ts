import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hashSyncPayload, prepareSyncMutation, resolveLwwRow, SyncPolicyError, type SyncRecord, type SyncView } from '../src/sync/policy.ts';
const tripId = '11111111-1111-4111-8111-111111111111';
const entryId = '22222222-2222-4222-8222-222222222222';
const operationId = '33333333-3333-4333-8333-333333333333';
const trip = { title: 'Private trip', destination: 'Florence', start_date: '2026-11-01', end_date: '2026-11-05', currency: 'USD', budget_cents: 120000 };
const record: SyncRecord = { id: tripId, entity: 'trip', tripId, owner: 'account-A', revision: 1, deleted: false, value: trip };
const operation = { operation_id: operationId, entity: 'plan', entity_id: entryId, trip_id: tripId, expected_revision: 0, action: 'put', value: { day: '2026-11-01', time: '09:00', kind: 'Activity', title: 'Walk', place: '', note: '' } };
const view: SyncView = { record: id => id === tripId ? record : undefined, children: () => [], receipt: () => undefined };
function status(expected: number) { return (error: unknown) => error instanceof SyncPolicyError && error.status === expected; }

test('sync policy derives ownership from the verified account and validates parent dates', () => {
  assert.equal(prepareSyncMutation('account-A', operation, view).nextRevision, 1);
  assert.throws(() => prepareSyncMutation(null, operation, view), status(401));
  assert.throws(() => prepareSyncMutation('account-B', operation, view), status(404));
  assert.throws(() => prepareSyncMutation('account-A', { ...operation, owner: 'account-B' }, view), status(422));
  assert.throws(() => prepareSyncMutation('account-A', { ...operation, value: { ...operation.value, day: '2026-11-06' } }, view), status(422));
  assert.throws(() => prepareSyncMutation('account-A', operation, { ...view, record: () => undefined }), status(404));
});

test('sync policy rejects revision conflicts and resurrection of tombstones', () => {
  const child: SyncRecord = { id: entryId, entity: 'plan', tripId, owner: 'account-A', revision: 2, deleted: false, value: operation.value };
  const current: SyncView = { ...view, record: id => id === entryId ? child : view.record(id) };
  assert.throws(() => prepareSyncMutation('account-A', operation, current), status(409));
  assert.equal(prepareSyncMutation('account-A', { ...operation, expected_revision: 2 }, current).nextRevision, 3);
  assert.throws(() => prepareSyncMutation('account-A', { ...operation, expected_revision: 2 }, { ...current, record: id => id === entryId ? { ...child, deleted: true } : view.record(id) }), status(409));
  assert.throws(() => prepareSyncMutation('account-A', operation, { ...view, record: () => ({ ...record, deleted: true }) }), status(404));
});

test('matching receipts replay once; reusing an operation ID for another edit is rejected', () => {
  const first = prepareSyncMutation('account-A', operation, view);
  const replayView: SyncView = { ...view, receipt: (account, id) => account === 'account-A' && id === operationId ? { request: first.request, revision: 1, deleted: false } : undefined };
  assert.equal(prepareSyncMutation('account-A', operation, replayView).replay, true);
  assert.equal(prepareSyncMutation('account-A', operation, { ...replayView, record: () => undefined }).replay, true);
  assert.throws(() => prepareSyncMutation('account-A', { ...operation, value: { ...operation.value, title: 'Different walk' } }, replayView), status(409));
  assert.throws(() => prepareSyncMutation('account-B', operation, replayView), status(404));
});

test('trip mutations validate existing children and reject currency changes with expenses', () => {
  const mutation = { ...operation, entity: 'trip', entity_id: tripId, expected_revision: 1, value: trip };
  assert.equal(prepareSyncMutation('account-A', mutation, view).nextRevision, 2);
  assert.equal(prepareSyncMutation('account-A', { ...mutation, expected_revision: 0 }, { ...view, record: () => undefined }).nextRevision, 1);
  const child: SyncRecord = { id: entryId, entity: 'expense', tripId, owner: 'account-A', revision: 1, deleted: false, value: { day: '2026-11-01', category: 'Food', label: 'Lunch', amount_cents: 2550, conversion: null } };
  const populated = { ...view, children: () => [child] };
  assert.throws(() => prepareSyncMutation('account-A', { ...mutation, value: { ...trip, start_date: '2026-11-02' } }, populated), status(422));
  assert.throws(() => prepareSyncMutation('account-A', { ...mutation, value: { ...trip, currency: 'EUR' } }, populated), status(409));
  assert.throws(() => prepareSyncMutation('account-A', { ...mutation, value: { ...trip, owner: 'account-B' } }, view), status(422));
});

test('sync hashing normalizes currency floats and LWW resolves row timestamps with deleted_at tombstones', async () => {
  assert.equal(
    await hashSyncPayload({ amount: 19.999999999999996, currency: 'USD' }),
    await hashSyncPayload({ currency: 'USD', amount: 20 }),
  );

  const localLive = { id: '1', updated_at: '2026-11-01T10:00:00Z', deleted_at: null };
  const remoteNewer = { id: '1', updated_at: '2026-11-01T12:00:00Z', deleted_at: null };
  assert.equal(resolveLwwRow(localLive, remoteNewer).winner, 'remote');

  const localTombstone = { id: '1', updated_at: '2026-11-01T10:00:00Z', deleted_at: '2026-11-01T12:00:00Z' };
  const tieResolution = resolveLwwRow(localTombstone, remoteNewer);
  assert.equal(tieResolution.winner, 'local');
  assert.equal(tieResolution.isTombstone, true);

  const child: SyncRecord = { id: entryId, entity: 'plan', tripId, owner: 'account-A', revision: 1, deleted: false, value: operation.value, updated_at: '2026-11-01T10:00:00Z', deleted_at: null };
  const del = prepareSyncMutation('account-A', { ...operation, action: 'delete', expected_revision: 1, value: null }, { ...view, record: id => id === entryId ? child : view.record(id) });
  assert.equal(del.deleted, true);
  assert.ok(typeof del.deletedAt === 'string' && del.deletedAt.length > 0);
});
