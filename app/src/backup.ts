import { currencyOK, dateOK } from './validation.ts';
import type { Trip, PlanItem, Expense } from './data.ts';
import { validateConversion } from './currency.ts';
import { validatePlanning, type Planning } from './budget.ts';

export type BackupTrip = Omit<Trip, 'id' | 'created_at'> & {
  plans: (Omit<PlanItem, 'id' | 'trip_id'> & { duration_minutes?: number; sort_order?: number; completed?: boolean; updated_at?: string; deleted_at?: string | null })[];
  expenses: (Omit<Expense, 'id' | 'trip_id'> & { updated_at?: string; deleted_at?: string | null })[];
  planning?: Planning;
  updated_at?: string;
  deleted_at?: string | null;
};
export type Backup = { format: 'travel-like-andy'; version: 1 | 2 | 3; trips: BackupTrip[] };
export const MAX_BACKUP_LENGTH = 2_000_000;

export function normalizeCurrencyFloat(val: number): number {
  return Number.isFinite(val) ? Math.round(val * 100) / 100 : val;
}

function normalizeForHash(value: unknown): unknown {
  if (typeof value === 'number') return normalizeCurrencyFloat(value);
  if (Array.isArray(value)) return value.map(normalizeForHash);
  if (value && typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    return Object.fromEntries(Object.keys(obj).sort().map(key => [key, normalizeForHash(obj[key])]));
  }
  return value;
}

export async function sha256Hex(value: unknown): Promise<string> {
  const bytes = new TextEncoder().encode(JSON.stringify(normalizeForHash(value)));
  const digest = await globalThis.crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, '0')).join('');
}

export function hashBackup(backup: Backup): Promise<string> {
  return sha256Hex(backup);
}

function fail(): never { throw Error('Invalid backup. Use a Travel Like Andy version 1, 2, or 3 backup with valid trip dates and amounts.'); }
function object(value: unknown, keys: string[]): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return fail();
  const result = value as Record<string, unknown>;
  if (Object.keys(result).length !== keys.length || keys.some(key => !Object.hasOwn(result, key))) return fail();
  return result;
}
function text(value: unknown, limit: number, required = true): string {
  if (typeof value !== 'string' || value.length > limit || (required && !value.trim()) || /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(value)) return fail();
  return value;
}
function money(value: unknown, positive = false): number {
  if (typeof value !== 'number' || !Number.isSafeInteger(value) || value < (positive ? 1 : 0) || value > 999_999_999_999) return fail();
  return value;
}
function list(value: unknown, max: number): unknown[] {
  if (!Array.isArray(value) || value.length > max) return fail();
  return value;
}
function choice(value: unknown, choices: readonly string[]): string {
  if (typeof value !== 'string' || !choices.includes(value)) return fail();
  return value;
}
function syncTimestamps(source: Record<string, unknown>): { updated_at?: string; deleted_at?: string | null } {
  const out: { updated_at?: string; deleted_at?: string | null } = {};
  if (Object.hasOwn(source, 'updated_at')) out.updated_at = text(source.updated_at, 40);
  if (Object.hasOwn(source, 'deleted_at')) out.deleted_at = source.deleted_at === null ? null : text(source.deleted_at, 40);
  return out;
}

export function parseBackup(raw: string): Backup {
  if (raw.length > MAX_BACKUP_LENGTH) throw Error('Backup is too large. Maximum length is 2 million characters.');
  let input: unknown;
  try { input = JSON.parse(raw); } catch { throw Error('Backup is not valid JSON.'); }
  const source = object(input, ['format', 'version', 'trips']);
  if (source.format !== 'travel-like-andy' || (source.version !== 1 && source.version !== 2 && source.version !== 3)) return fail();
  let entries = 0;
  const trips = list(source.trips, 100).map(value => {
    const tripSyncKeys = value && typeof value === 'object' ? ['updated_at', 'deleted_at'].filter(key => Object.hasOwn(value, key)) : [];
    const trip = object(value, ['title', 'destination', 'start_date', 'end_date', 'currency', 'budget_cents', 'plans', 'expenses', ...(source.version === 3 ? ['planning'] : []), ...tripSyncKeys]);
    const start = text(trip.start_date, 10), end = text(trip.end_date, 10);
    if (!dateOK(start) || !dateOK(end) || end < start) return fail();
    const currency = text(trip.currency, 3);
    if (!currencyOK(currency) || currency !== currency.toUpperCase()) return fail();
    function day(value: unknown) {
      const result = text(value, 10);
      if (!dateOK(result) || result < start || result > end) return fail();
      return result;
    }
    const plans = list(trip.plans, 2000).map(value => {
      const optional = value && typeof value === 'object' ? ['duration_minutes', 'sort_order', 'completed', 'updated_at', 'deleted_at'].filter(key => Object.hasOwn(value, key)) : [];
      const plan = object(value, ['day', 'time', 'kind', 'title', 'place', 'note', ...optional]);
      const time = text(plan.time, 5);
      if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) return fail();
      const duration = plan.duration_minutes ?? 0, order = plan.sort_order ?? 0;
      if ((Object.hasOwn(plan, 'duration_minutes') && plan.duration_minutes == null) || !Number.isSafeInteger(duration) || (duration as number) < 0 || (duration as number) > 9999) return fail();
      if ((Object.hasOwn(plan, 'sort_order') && plan.sort_order == null) || !Number.isSafeInteger(order) || (order as number) < 0 || (order as number) > 1_000_000) return fail();
      // Earlier SQLite exports serialized the boolean column as 0/1.
      const completed = Object.hasOwn(plan, 'completed') ? plan.completed : false;
      if (typeof completed !== 'boolean' && completed !== 0 && completed !== 1) return fail();
      return { day: day(plan.day), time, kind: choice(plan.kind, ['Activity', 'Stay', 'Transport', 'Dining']), title: text(plan.title, 120), place: text(plan.place, 120, false), note: text(plan.note, 500, false), duration_minutes: duration as number, sort_order: order as number, completed: Boolean(completed), ...syncTimestamps(plan) };
    });
    const expenses = list(trip.expenses, 2000).map(value => {
      const expenseSyncKeys = value && typeof value === 'object' ? ['updated_at', 'deleted_at'].filter(key => Object.hasOwn(value, key)) : [];
      const expense = object(value, ['day', 'category', 'label', 'amount_cents', ...(source.version !== 1 ? ['conversion'] : []), ...expenseSyncKeys]);
      const result = { day: day(expense.day), category: choice(expense.category, ['Stay', 'Transport', 'Food', 'Experience', 'Other']), label: text(expense.label, 120), amount_cents: money(expense.amount_cents, true), ...syncTimestamps(expense) };
      if (source.version === 1) return result;
      try { return { ...result, conversion: expense.conversion === null ? null : validateConversion(expense.conversion, currency, result.amount_cents) }; }
      catch { return fail(); }
    });
    entries += plans.length + expenses.length;
    if (entries > 10000) return fail();
    return { title: text(trip.title, 120), destination: text(trip.destination, 120), start_date: start, end_date: end, currency, budget_cents: money(trip.budget_cents), plans, expenses, ...(source.version === 3 ? { planning: validatePlanning(trip.planning) } : {}), ...syncTimestamps(trip) };
  });
  return { format: 'travel-like-andy', version: source.version, trips };
}
