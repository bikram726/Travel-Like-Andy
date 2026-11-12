import type { SQLiteDatabase } from 'expo-sqlite';
import { parseBackup, type Backup } from './backup.ts';
import { validateConversion, type ExpenseConversion } from './currency.ts';
import { defaultPlanning, validatePlanning, type Planning } from './budget.ts';
import { applyV2Migration, planningMigration } from './migrations.ts';
import { placeById } from './places.ts';

export type Trip = { id: number; title: string; destination: string; start_date: string; end_date: string; currency: string; budget_cents: number; created_at: string };
export type PlanItem = { id: number; trip_id: number; day: string; time: string; kind: string; title: string; place: string; note: string; duration_minutes: number; sort_order: number; completed: boolean };
export type PlanWrite = Omit<PlanItem, 'id' | 'duration_minutes' | 'sort_order' | 'completed'> & { duration_minutes?: number; sort_order?: number; completed?: boolean };
export type Expense = { id: number; trip_id: number; day: string; category: string; label: string; amount_cents: number; conversion?: ExpenseConversion | null };

// All app database access goes through this per-connection queue. Expo's async
// transactions otherwise allow unrelated awaited queries to join a transaction.
// Internal helpers bypass the queue only while a queued operation owns it.
const queues = new WeakMap<SQLiteDatabase, Promise<void>>();
function queued<Args extends unknown[], Result>(operation: (db: SQLiteDatabase, ...args: Args) => Promise<Result>) {
  return (db: SQLiteDatabase, ...args: Args): Promise<Result> => {
    const result = (queues.get(db) ?? Promise.resolve()).then(() => operation(db, ...args));
    const settled = result.then(() => undefined, () => undefined);
    queues.set(db, settled);
    void settled.then(() => { if (queues.get(db) === settled) queues.delete(db); });
    return result;
  };
}

async function initDatabaseInternal(db: SQLiteDatabase) {
  await db.execAsync(`PRAGMA foreign_keys = ON;
    CREATE TABLE IF NOT EXISTS trips (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL, destination TEXT NOT NULL,
      start_date TEXT NOT NULL, end_date TEXT NOT NULL,
      currency TEXT NOT NULL, budget_cents INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS plan_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT, trip_id INTEGER NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
      day TEXT NOT NULL, time TEXT NOT NULL, kind TEXT NOT NULL,
          title TEXT NOT NULL, place TEXT NOT NULL DEFAULT '', note TEXT NOT NULL DEFAULT '',
          duration_minutes INTEGER NOT NULL DEFAULT 0, sort_order INTEGER NOT NULL DEFAULT 0, completed INTEGER NOT NULL DEFAULT 0
        );
    CREATE TABLE IF NOT EXISTS expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT, trip_id INTEGER NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
      day TEXT NOT NULL, category TEXT NOT NULL, label TEXT NOT NULL,
      amount_cents INTEGER NOT NULL CHECK(amount_cents > 0), conversion_json TEXT
    );
    CREATE INDEX IF NOT EXISTS plan_trip_day ON plan_items(trip_id, day, time);
    CREATE INDEX IF NOT EXISTS expense_trip_day ON expenses(trip_id, day);
    CREATE TRIGGER IF NOT EXISTS plan_date_insert BEFORE INSERT ON plan_items
    WHEN NOT EXISTS (SELECT 1 FROM trips WHERE id = NEW.trip_id AND NEW.day BETWEEN start_date AND end_date)
    BEGIN SELECT RAISE(ABORT, 'Plan date must be within the trip.'); END;
    CREATE TRIGGER IF NOT EXISTS plan_date_update BEFORE UPDATE OF day, trip_id ON plan_items
    WHEN NOT EXISTS (SELECT 1 FROM trips WHERE id = NEW.trip_id AND NEW.day BETWEEN start_date AND end_date)
    BEGIN SELECT RAISE(ABORT, 'Plan date must be within the trip.'); END;
    CREATE TRIGGER IF NOT EXISTS expense_date_insert BEFORE INSERT ON expenses
    WHEN NOT EXISTS (SELECT 1 FROM trips WHERE id = NEW.trip_id AND NEW.day BETWEEN start_date AND end_date)
    BEGIN SELECT RAISE(ABORT, 'Expense date must be within the trip.'); END;
    CREATE TRIGGER IF NOT EXISTS expense_date_update BEFORE UPDATE OF day, trip_id ON expenses
    WHEN NOT EXISTS (SELECT 1 FROM trips WHERE id = NEW.trip_id AND NEW.day BETWEEN start_date AND end_date)
    BEGIN SELECT RAISE(ABORT, 'Expense date must be within the trip.'); END;
    CREATE TRIGGER IF NOT EXISTS trip_dates_update BEFORE UPDATE OF start_date, end_date ON trips
    WHEN EXISTS (SELECT 1 FROM plan_items WHERE trip_id = OLD.id AND (day < NEW.start_date OR day > NEW.end_date))
      OR EXISTS (SELECT 1 FROM expenses WHERE trip_id = OLD.id AND (day < NEW.start_date OR day > NEW.end_date))
    BEGIN SELECT RAISE(ABORT, 'These dates exclude existing plans or expenses.'); END;
    CREATE TRIGGER IF NOT EXISTS trip_currency_update BEFORE UPDATE OF currency ON trips
    WHEN NEW.currency <> OLD.currency AND EXISTS (SELECT 1 FROM expenses WHERE trip_id = OLD.id)
    BEGIN SELECT RAISE(ABORT, 'Currency cannot change while expenses exist.'); END;
  `);
  await db.execAsync(planningMigration);
  const columns = await db.getAllAsync<{ name: string }>('PRAGMA table_info(expenses)');
  if (!columns.some(column => column.name === 'conversion_json')) await db.execAsync('ALTER TABLE expenses ADD COLUMN conversion_json TEXT');
  const planColumns = await db.getAllAsync<{ name: string }>('PRAGMA table_info(plan_items)');
  // These fixed additive definitions preserve plans created before itinerary fields existed.
  for (const name of ['duration_minutes', 'sort_order', 'completed']) {
    if (!planColumns.some(column => column.name === name)) await db.execAsync(`ALTER TABLE plan_items ADD COLUMN ${name} INTEGER NOT NULL DEFAULT 0`);
  }
  await applyV2Migration(db);
}

const listTripsInternal = (db: SQLiteDatabase) => db.getAllAsync<Trip>('SELECT * FROM trips ORDER BY start_date ASC, id DESC');
const listPlanInternal = async (db: SQLiteDatabase, tripId: number): Promise<PlanItem[]> =>
  (await db.getAllAsync<PlanItem>('SELECT * FROM plan_items WHERE trip_id = ? ORDER BY day, sort_order, time, id', tripId)).map(item => ({ ...item, completed: Boolean(item.completed) }));
async function listExpensesInternal(db: SQLiteDatabase, tripId: number): Promise<Expense[]> {
  const rows = await db.getAllAsync<Expense & { conversion_json: string | null; trip_currency: string }>('SELECT expenses.*, trips.currency AS trip_currency FROM expenses JOIN trips ON trips.id = expenses.trip_id WHERE trip_id = ? ORDER BY day DESC, expenses.id DESC', tripId);
  return rows.map(({ conversion_json, trip_currency, ...expense }) => conversion_json === null ? expense : { ...expense, conversion: validateConversion(JSON.parse(conversion_json), trip_currency, expense.amount_cents) });
}

async function plannerSnapshotInternal(db: SQLiteDatabase, preferred: number | null) {
  const trips = await listTripsInternal(db);
  const tripId = trips.some(trip => trip.id === preferred) ? preferred : trips[0]?.id ?? null;
  const plans = tripId === null ? [] : await listPlanInternal(db, tripId);
  const expenses = tripId === null ? [] : await listExpensesInternal(db, tripId);
  return { trips, tripId, plans, expenses };
}

function validateStoredValues(trip: Omit<Trip, 'id' | 'created_at'>, plans: unknown[] = [], expenses: unknown[] = []) {
  parseBackup(JSON.stringify({ format: 'travel-like-andy', version: 2, trips: [{
    title: trip.title, destination: trip.destination, start_date: trip.start_date, end_date: trip.end_date,
    currency: trip.currency, budget_cents: trip.budget_cents, plans, expenses,
  }] }));
}
function validateTripWrite(value: Omit<Trip, 'id' | 'created_at'>) {
  try { validateStoredValues(value); }
  catch { throw Error('Enter valid trip details, supported currency, dates, and a budget within the supported limit.'); }
}
async function parentTrip(db: SQLiteDatabase, id: number, day: string, kind: string) {
  if (!Number.isSafeInteger(id) || id <= 0) throw Error('This trip no longer exists.');
  const trip = await db.getFirstAsync<Trip>('SELECT * FROM trips WHERE id = ?', id);
  if (!trip) throw Error('This trip no longer exists.');
  if (day < trip.start_date || day > trip.end_date) throw Error(kind + ' date must be within the trip.');
  return trip;
}
async function nextDayOrder(db: SQLiteDatabase, tripId: number, day: string) {
  const row = await db.getFirstAsync<{ max_order: number }>('SELECT COALESCE(MAX(sort_order), 0) AS max_order FROM plan_items WHERE trip_id = ? AND day = ?', tripId, day);
  return (row?.max_order ?? 0) > 0 ? Math.min(1_000_000, (row?.max_order ?? 0) + 1) : 0;
}
async function validatePlanWrite(db: SQLiteDatabase, value: PlanWrite) {
  const trip = await parentTrip(db, value.trip_id, value.day, 'Plan');
  const { day, time, kind, title, place, note, duration_minutes, sort_order, completed } = value;
  try { validateStoredValues(trip, [{ day, time, kind, title, place, note, duration_minutes: duration_minutes ?? 0, sort_order: sort_order ?? 0, completed: completed ?? false }]); }
  catch { throw Error('Enter a valid plan date, time, type, title, place, and notes within the supported limits.'); }
}
async function validateExpenseWrite(db: SQLiteDatabase, value: Omit<Expense, 'id'>) {
  const trip = await parentTrip(db, value.trip_id, value.day, 'Expense');
  const { day, category, label, amount_cents, conversion } = value;
  if (conversion != null) validateConversion(conversion, trip.currency, amount_cents);
  try { validateStoredValues(trip, [], [{ day, category, label, amount_cents, conversion: conversion ?? null }]); }
  catch { throw Error('Enter a valid expense date, category, label, and positive amount within the supported limits.'); }
  return conversion == null ? null : JSON.stringify(conversion);
}

async function createTripInternal(db: SQLiteDatabase, value: Omit<Trip, 'id' | 'created_at'>) {
  validateTripWrite(value);
  const result = await db.runAsync(
    'INSERT INTO trips(title,destination,start_date,end_date,currency,budget_cents) VALUES(?,?,?,?,?,?)',
    value.title, value.destination, value.start_date, value.end_date, value.currency, value.budget_cents,
  );
  return result.lastInsertRowId;
}

async function addPlanInternal(db: SQLiteDatabase, value: PlanWrite) {
  const sortOrder = value.sort_order ?? await nextDayOrder(db, value.trip_id, value.day);
  await validatePlanWrite(db, { ...value, sort_order: sortOrder });
  return db.runAsync(
    'INSERT INTO plan_items(trip_id,day,time,kind,title,place,note,duration_minutes,sort_order,completed) VALUES(?,?,?,?,?,?,?,?,?,?)',
    value.trip_id, value.day, value.time, value.kind, value.title, value.place, value.note, value.duration_minutes ?? 0, sortOrder, value.completed ? 1 : 0,
  );
}
async function addExpenseInternal(db: SQLiteDatabase, value: Omit<Expense, 'id'>) {
  const conversion = await validateExpenseWrite(db, value);
  return db.runAsync('INSERT INTO expenses(trip_id,day,category,label,amount_cents,conversion_json) VALUES(?,?,?,?,?,?)', value.trip_id, value.day, value.category, value.label, value.amount_cents, conversion);
}
const deletePlanInternal = (db: SQLiteDatabase, id: number) => db.runAsync('DELETE FROM plan_items WHERE id = ?', id);
const deleteExpenseInternal = (db: SQLiteDatabase, id: number) => db.runAsync('DELETE FROM expenses WHERE id = ?', id);
async function updatePlanInternal(db: SQLiteDatabase, id: number, value: PlanWrite) {
  const existing = Number.isSafeInteger(id) && id > 0 && Number.isSafeInteger(value.trip_id) && value.trip_id > 0
    ? await db.getFirstAsync<PlanItem>('SELECT * FROM plan_items WHERE id = ? AND trip_id = ?', id, value.trip_id)
    : null;
  const sortOrder = value.sort_order !== undefined
    ? value.sort_order
    : existing && existing.day === value.day
      ? existing.sort_order
      : await nextDayOrder(db, value.trip_id, value.day);
  await validatePlanWrite(db, { ...value, sort_order: sortOrder });
  const result = await db.runAsync(
    'UPDATE plan_items SET day = ?, time = ?, kind = ?, title = ?, place = ?, note = ?, duration_minutes = ?, sort_order = ?, completed = ? WHERE id = ? AND trip_id = ?',
    value.day, value.time, value.kind, value.title, value.place, value.note, value.duration_minutes ?? 0, sortOrder, value.completed ? 1 : 0, id, value.trip_id,
  );
  if (result.changes !== 1) throw Error('This plan no longer exists in the selected trip. Reopen the trip before editing.');
  return result;
}
async function reorderPlanInternal(db: SQLiteDatabase, tripId: number, planId: number, direction: 'up' | 'down'): Promise<boolean> {
  if (!Number.isSafeInteger(tripId) || tripId <= 0 || !Number.isSafeInteger(planId) || planId <= 0 || (direction !== 'up' && direction !== 'down')) {
    throw Error('Select a valid trip plan to reorder.');
  }
  let moved = false;
  await db.withTransactionAsync(async () => {
    const target = await db.getFirstAsync<PlanItem>('SELECT * FROM plan_items WHERE id = ? AND trip_id = ?', planId, tripId);
    if (!target) throw Error('This plan no longer exists in the selected trip. Reopen the trip before editing.');
    const dayItems = await db.getAllAsync<PlanItem>('SELECT * FROM plan_items WHERE trip_id = ? AND day = ? ORDER BY sort_order, time, id', tripId, target.day);
    const index = dayItems.findIndex(item => item.id === planId);
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    if (index < 0 || swapIndex < 0 || swapIndex >= dayItems.length) return;
    const temp = dayItems[index];
    dayItems[index] = dayItems[swapIndex];
    dayItems[swapIndex] = temp;
    for (let i = 0; i < dayItems.length; i++) {
      await db.runAsync('UPDATE plan_items SET sort_order = ? WHERE id = ? AND trip_id = ?', i + 1, dayItems[i].id, tripId);
    }
    moved = true;
  });
  return moved;
}
async function updateExpenseInternal(db: SQLiteDatabase, id: number, value: Omit<Expense, 'id'>) {
  const conversion = await validateExpenseWrite(db, value);
  const result = await db.runAsync(
  'UPDATE expenses SET day = ?, category = ?, label = ?, amount_cents = ?, conversion_json = ? WHERE id = ? AND trip_id = ?',
  value.day, value.category, value.label, value.amount_cents, conversion, id, value.trip_id,
);
  if (result.changes !== 1) throw Error('This expense no longer exists in the selected trip. Reopen the trip before editing.');
  return result;
}
const deleteTripInternal = (db: SQLiteDatabase, id: number) => db.runAsync('DELETE FROM trips WHERE id = ?', id);
async function updateTripInternal(db: SQLiteDatabase, id: number, value: Omit<Trip, 'id' | 'created_at'>) {
  validateTripWrite(value);
  const current = await db.getFirstAsync<Trip>('SELECT * FROM trips WHERE id = ?', id);
  if (current && current.currency !== value.currency && (await getPlanningInternal(db, id)).lines.length) throw Error('Currency cannot change while planned costs exist. Remove them first or create another trip.');
  // Do not silently orphan plans when the traveler shortens a trip.
  const outside = await db.getFirstAsync<{ count: number }>(
    'SELECT (SELECT COUNT(*) FROM plan_items WHERE trip_id = ? AND (day < ? OR day > ?)) + (SELECT COUNT(*) FROM expenses WHERE trip_id = ? AND (day < ? OR day > ?)) AS count',
    id, value.start_date, value.end_date, id, value.start_date, value.end_date,
  );
  if (outside?.count) throw Error('These dates exclude existing plans or expenses. Move or remove those entries first.');
  const result = await db.runAsync('UPDATE trips SET title = ?, destination = ?, start_date = ?, end_date = ?, currency = ?, budget_cents = ? WHERE id = ?', value.title, value.destination, value.start_date, value.end_date, value.currency, value.budget_cents, id);
  if (result.changes !== 1) throw Error('This trip no longer exists. Reopen the planner before editing.');
}
const deleteAllInternal = (db: SQLiteDatabase) => db.withTransactionAsync(async () => {
  await db.runAsync('DELETE FROM trips');
  await db.runAsync('DELETE FROM app_settings');
});

async function exportBackupInternal(db: SQLiteDatabase): Promise<string> {
  const backup: Backup = { format: 'travel-like-andy', version: 3, trips: [] };
  await db.withTransactionAsync(async () => {
    for (const trip of await listTripsInternal(db)) {
      const plans = (await listPlanInternal(db, trip.id)).map(({ day, time, kind, title, place, note, duration_minutes, sort_order, completed }) => ({ day, time, kind, title, place, note, duration_minutes, sort_order, completed: Boolean(completed) }));
      const expenses = (await listExpensesInternal(db, trip.id)).map(({ day, category, label, amount_cents, conversion }) => ({ day, category, label, amount_cents, conversion: conversion ?? null }));
      backup.trips.push({ title: trip.title, destination: trip.destination, start_date: trip.start_date, end_date: trip.end_date, currency: trip.currency, budget_cents: trip.budget_cents, plans, expenses, planning: await getPlanningInternal(db, trip.id) });
    }
  });
  const json = JSON.stringify(backup, null, 2);
  parseBackup(json); // Never produce a file that this version cannot restore.
  return json;
}

// Import adds new trips and never removes or overwrites existing ones.
async function importBackupInternal(db: SQLiteDatabase, raw: string): Promise<number> {
  const backup = parseBackup(raw);
  await db.withTransactionAsync(async () => {
    for (const { plans, expenses, planning, ...trip } of backup.trips) {
      const id = await createTripInternal(db, trip);
      if (planning) await savePlanningInternal(db, id, planning);
      for (const plan of plans) await addPlanInternal(db, { ...plan, trip_id: id });
      for (const expense of expenses) await addExpenseInternal(db, { ...expense, trip_id: id });
    }
  });
  return backup.trips.length;
}

export const initDatabase = queued(initDatabaseInternal);
export const plannerSnapshot = queued(plannerSnapshotInternal);
export const listTrips = queued(listTripsInternal);
export const listPlan = queued(listPlanInternal);
export const listExpenses = queued(listExpensesInternal);
export const createTrip = queued(createTripInternal);
export const addPlan = queued(addPlanInternal);
export const addExpense = queued(addExpenseInternal);
export const deletePlan = queued(deletePlanInternal);
export const deleteExpense = queued(deleteExpenseInternal);
export const updatePlan = queued(updatePlanInternal);
export const reorderPlan = queued(reorderPlanInternal);
export const updateExpense = queued(updateExpenseInternal);
export const deleteTrip = queued(deleteTripInternal);
export const updateTrip = queued(updateTripInternal);
export const deleteAll = queued(deleteAllInternal);
export const exportBackup = queued(exportBackupInternal);
export const importBackup = queued(importBackupInternal);

async function getPlanningInternal(db: SQLiteDatabase, tripId: number): Promise<Planning> {
  const row = await db.getFirstAsync<{ value: string }>('SELECT value FROM trip_planning WHERE trip_id = ?', tripId);
  return row ? validatePlanning(JSON.parse(row.value)) : defaultPlanning();
}
async function savePlanningInternal(db: SQLiteDatabase, tripId: number, input: Planning) {
  const value = validatePlanning(input);
  const trip = await db.getFirstAsync<Trip>('SELECT * FROM trips WHERE id = ?', tripId);
  if (!trip) throw Error('This trip no longer exists.');
  await db.runAsync('INSERT INTO trip_planning(trip_id,value) VALUES(?,?) ON CONFLICT(trip_id) DO UPDATE SET value=excluded.value', tripId, JSON.stringify(value));
}
async function createPlannedTripInternal(db: SQLiteDatabase, trip: Omit<Trip, 'id' | 'created_at'>, planning: Planning) {
  validateTripWrite(trip); validatePlanning(planning);
  let id = 0;
  await db.withTransactionAsync(async () => {
    id = await createTripInternal(db, trip);
    await savePlanningInternal(db, id, planning);
    await db.runAsync('DELETE FROM app_settings WHERE key = ?', 'trip-draft');
  });
  return id;
}
async function getSettingInternal(db: SQLiteDatabase, key: string) {
  return (await db.getFirstAsync<{ value: string }>('SELECT value FROM app_settings WHERE key = ?', key))?.value ?? null;
}
async function saveSettingInternal(db: SQLiteDatabase, key: string, value: string | null) {
  if (!['trip-draft', 'theme', 'consultations'].includes(key) || (value !== null && value.length > 20000)) throw Error('Invalid app setting.');
  if (value === null) await db.runAsync('DELETE FROM app_settings WHERE key = ?', key);
  else await db.runAsync('INSERT INTO app_settings(key,value) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value', key, value);
}
export const getPlanning = queued(getPlanningInternal);
export const savePlanning = queued(savePlanningInternal);
export const createPlannedTrip = queued(createPlannedTripInternal);
// One queued transaction keeps the stop and its unknown budget line together.
async function addPlaceToTripInternal(db: SQLiteDatabase, tripId: number, placeId: string, day: string) {
  const place = placeById(placeId);
  if (!place) throw Error('This photo idea is no longer available.');
  const marker = `Photo inspiration: ${place.id}.`;
  let added = false;
  await db.withTransactionAsync(async () => {
    await parentTrip(db, tripId, day, 'Plan');
    const existing = await db.getFirstAsync<{ id: number }>('SELECT id FROM plan_items WHERE trip_id = ? AND day = ? AND place = ?', tripId, day, place.title);
    if (existing) return;
    const plan = await getPlanningInternal(db, tripId);
    if (!plan.lines.some(line => line.source_note.startsWith(marker))) {
      await savePlanningInternal(db, tripId, { ...plan, lines: [...plan.lines, { category: place.kind === 'Stay' ? 'Accommodation' : 'Activities', label: place.title, amount_cents: null, unit: 'trip', source: 'User estimate', source_note: `${marker} ${place.budgetNote}`, checked_at: '' }] });
    }
    await addPlanInternal(db, { trip_id: tripId, title: place.title, place: place.title, day, time: '09:00', kind: place.kind, note: `${marker} Tentative stop from project photos; not an Andy-reviewed itinerary. ${place.budgetNote}`, duration_minutes: 0, completed: false });
    added = true;
  });
  return added;
}
export const addPlaceToTrip = queued(addPlaceToTripInternal);
export const getSetting = queued(getSettingInternal);
export const saveSetting = queued(saveSettingInternal);
