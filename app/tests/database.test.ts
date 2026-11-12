import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import type { SQLiteDatabase } from 'expo-sqlite';
import { initDatabase, createTrip, addPlan, addExpense, updatePlan, reorderPlan, updateExpense, updateTrip, createPlannedTrip, getPlanning, savePlanning, getSetting, saveSetting, listTrips, listPlan, listExpenses, deleteTrip, exportBackup, importBackup, plannerSnapshot, addPlaceToTrip } from '../src/data.ts';

function database() {
  const sql = new DatabaseSync(':memory:');
  const db = {
    withTransactionAsync: async (work: () => Promise<void>) => {
      sql.exec('BEGIN');
      try { await work(); sql.exec('COMMIT'); }
      catch (error) { sql.exec('ROLLBACK'); throw error; }
    },
    execAsync: async (query: string) => sql.exec(query),
    runAsync: async (query: string, ...params: (string | number)[]) => {
      const result = sql.prepare(query).run(...params);
      return { lastInsertRowId: Number(result.lastInsertRowid), changes: result.changes };
    },
    getAllAsync: async (query: string, ...params: (string | number)[]) => sql.prepare(query).all(...params),
    getFirstAsync: async (query: string, ...params: (string | number)[]) => sql.prepare(query).get(...params),
  } as unknown as SQLiteDatabase;
  return { db, close: () => sql.close() };
}
const trip = { title: 'Test journey', destination: 'Florence', start_date: '2026-11-01', end_date: '2026-11-05', currency: 'USD', budget_cents: 120000 };

test('photo stops and unknown estimates save together, without duplicate costs or double taps', async () => {
  const { db, close } = database();
  try {
    await initDatabase(db);
    const id = await createTrip(db, { ...trip, destination: 'Pokhara' });
    assert.deepEqual(await Promise.all([addPlaceToTrip(db, id, 'phewa-lake', trip.start_date), addPlaceToTrip(db, id, 'phewa-lake', trip.start_date)]), [true, false]);
    assert.equal((await listPlan(db, id)).length, 1);
    const planning = await getPlanning(db, id);
    assert.equal(planning.lines.length, 1); assert.equal(planning.lines[0].amount_cents, null);
    assert.equal(planning.lines[0].category, 'Activities');
    await addPlaceToTrip(db, id, 'phewa-lake', '2026-11-02');
    assert.equal((await listPlan(db, id)).length, 2);
    assert.equal((await getPlanning(db, id)).lines.length, 1);
    await assert.rejects(addPlaceToTrip(db, id, 'taj-mahal', '2026-12-01'));
    await assert.rejects(addPlaceToTrip(db, id, 'unrecognized-place', trip.start_date));
    assert.equal((await listPlan(db, id)).length, 2);
    const backup = JSON.parse(await exportBackup(db));
    assert.equal(backup.trips[0].planning.lines[0].amount_cents, null);
  } finally { close(); }
});

test('a full budget cannot leave a photo stop saved without its unknown cost', async () => {
  const { db, close } = database();
  try {
    await initDatabase(db); const id = await createTrip(db, trip);
    const planning = await getPlanning(db, id);
    planning.lines = Array.from({ length: 200 }, (_, i) => ({ category: 'Activities', label: `Existing ${i}`, unit: 'trip', amount_cents: null, source: 'User estimate', source_note: '', checked_at: '' }));
    await savePlanning(db, id, planning);
    await assert.rejects(addPlaceToTrip(db, id, 'taj-mahal', trip.start_date));
    assert.equal((await listPlan(db, id)).length, 0);
    assert.equal((await getPlanning(db, id)).lines.length, 200);
  } finally { close(); }
});

test('data helpers reject invalid values before writes and keep existing records exportable', async () => {
  const { db, close } = database();
  try {
    await initDatabase(db);
    for (const change of [{ title: 'a'.repeat(121) }, { title: 'invalid\u0000title' }, { budget_cents: 1.5 }, { budget_cents: 1_000_000_000_000 }, { currency: 'JPY' }, { start_date: '2026-02-29' }]) {
      await assert.rejects(createTrip(db, { ...trip, ...change }), /valid trip details/);
    }
    assert.equal((await listTrips(db)).length, 0);
    const id = await createTrip(db, trip);
    const plan = { trip_id: id, day: trip.start_date, time: '09:00', kind: 'Activity', title: 'Walk', place: '', note: 'Bring shoes' };
    const expense = { trip_id: id, day: trip.start_date, category: 'Food', label: 'Lunch', amount_cents: 2550 };
    for (const change of [{ time: '24:00' }, { kind: 'Unknown' }, { note: 'a'.repeat(501) }, { place: 'invalid\u0000place' }]) await assert.rejects(addPlan(db, { ...plan, ...change }), /valid plan/);
    for (const change of [{ amount_cents: 1.5 }, { amount_cents: 0 }, { category: 'Unknown' }, { label: 'a'.repeat(121) }]) await assert.rejects(addExpense(db, { ...expense, ...change }), /valid expense/);
    await addPlan(db, plan); await addExpense(db, expense);
    const [savedPlan] = await listPlan(db, id), [savedExpense] = await listExpenses(db, id);
    await assert.rejects(updatePlan(db, savedPlan.id, { ...plan, note: 'a'.repeat(501) }), /valid plan/);
    await assert.rejects(updateExpense(db, savedExpense.id, { ...expense, amount_cents: 1.5 }), /valid expense/);
    await assert.rejects(updateTrip(db, id, { ...trip, title: 'invalid\u0000title' }), /valid trip details/);
    assert.equal((await listPlan(db, id))[0].note, 'Bring shoes');
    assert.equal((await listExpenses(db, id))[0].amount_cents, 2550);
    const backup = JSON.parse(await exportBackup(db));
    assert.equal(backup.trips[0].title, trip.title);
    assert.equal(backup.trips[0].plans.length, 1);
    await updatePlan(db, savedPlan.id, { ...plan, completed: true });
    const completedBackup = JSON.parse(await exportBackup(db));
    assert.equal(completedBackup.trips[0].plans[0].completed, true);
    assert.equal(backup.trips[0].expenses.length, 1);
  } finally { close(); }
});

test('legacy expense tables migrate without losing rows and conversion provenance round-trips', async () => {
  const { db, close } = database();
  try {
    await db.execAsync(`CREATE TABLE trips (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, destination TEXT NOT NULL, start_date TEXT NOT NULL, end_date TEXT NOT NULL, currency TEXT NOT NULL, budget_cents INTEGER NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
      CREATE TABLE expenses (id INTEGER PRIMARY KEY AUTOINCREMENT, trip_id INTEGER NOT NULL REFERENCES trips(id) ON DELETE CASCADE, day TEXT NOT NULL, category TEXT NOT NULL, label TEXT NOT NULL, amount_cents INTEGER NOT NULL CHECK(amount_cents > 0));`);
    const original = await createTrip(db, trip);
    await db.runAsync('INSERT INTO expenses(trip_id,day,category,label,amount_cents) VALUES(?,?,?,?,?)', original, trip.start_date, 'Food', 'Existing lunch', 2550);
    await initDatabase(db);
    await initDatabase(db);
    assert.equal((await listExpenses(db, original))[0].amount_cents, 2550);
    const conversion = { original_currency: 'EUR', original_cents: 10000, rate: '1.1217', rate_date: '2026-10-08', source: 'Frankfurter' as const };
    const expense = { trip_id: original, day: trip.start_date, category: 'Stay', label: 'Hotel', amount_cents: 11217, conversion };
    await addExpense(db, expense);
    await assert.rejects(addExpense(db, { ...expense, amount_cents: 11218 }), /Invalid expense conversion/);
    const saved = (await listExpenses(db, original)).find(value => value.label === 'Hotel')!;
    assert.deepEqual(saved.conversion, conversion);
    await assert.rejects(updateExpense(db, saved.id, { ...expense, conversion: { ...conversion, rate: '2' } }), /Invalid expense conversion/);
    assert.equal((await listExpenses(db, original)).find(value => value.id === saved.id)?.amount_cents, 11217);
    const raw = await exportBackup(db);
    assert.equal(JSON.parse(raw).version, 3);
    await importBackup(db, raw);
    const restored = (await listTrips(db)).find(value => value.id !== original)!;
    assert.deepEqual((await listExpenses(db, restored.id)).find(value => value.label === 'Hotel')?.conversion, conversion);
    assert.equal((await listExpenses(db, restored.id)).find(value => value.label === 'Existing lunch')?.amount_cents, 2550);
  } finally { close(); }
});

test('legacy itinerary tables gain optional fields without replacing saved plans', async () => {
  const { db, close } = database();
  try {
    await db.execAsync(`CREATE TABLE trips (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, destination TEXT NOT NULL, start_date TEXT NOT NULL, end_date TEXT NOT NULL, currency TEXT NOT NULL, budget_cents INTEGER NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
      CREATE TABLE plan_items (id INTEGER PRIMARY KEY AUTOINCREMENT, trip_id INTEGER NOT NULL REFERENCES trips(id) ON DELETE CASCADE, day TEXT NOT NULL, time TEXT NOT NULL, kind TEXT NOT NULL, title TEXT NOT NULL, place TEXT NOT NULL DEFAULT '', note TEXT NOT NULL DEFAULT '');`);
    await db.runAsync('INSERT INTO trips(id,title,destination,start_date,end_date,currency,budget_cents) VALUES(?,?,?,?,?,?,?)', 1, 'Existing trip', 'Chicago', '2026-11-01', '2026-11-04', 'USD', 100000);
    await db.runAsync('INSERT INTO plan_items(id,trip_id,day,time,kind,title,place,note) VALUES(?,?,?,?,?,?,?,?)', 7, 1, '2026-11-01', '09:00', 'Activity', 'Existing walk', '', 'Keep this note');
    await initDatabase(db); await initDatabase(db);
    const [saved] = await listPlan(db, 1);
    assert.equal(saved.id, 7); assert.equal(saved.note, 'Keep this note');
    assert.equal(saved.duration_minutes, 0); assert.equal(saved.sort_order, 0); assert.equal(saved.completed, false);
    assert.equal(JSON.parse(await exportBackup(db)).trips[0].plans[0].title, 'Existing walk');
  } finally { close(); }
});

test('planner snapshots keep trip metadata and entries together during concurrent deletion', async () => {
  const { db, close } = database();
  try {
    await initDatabase(db);
    assert.deepEqual(await plannerSnapshot(db, null), { trips: [], tripId: null, plans: [], expenses: [] });
    const id = await createTrip(db, trip);
    await addPlan(db, { trip_id: id, day: trip.start_date, time: '09:00', kind: 'Activity', title: 'Walk', place: '', note: '' });
    let release!: () => void;
    let entered!: () => void;
    const pause = new Promise<void>(resolve => { release = resolve; });
    const started = new Promise<void>(resolve => { entered = resolve; });
    const originalRead = db.getAllAsync.bind(db);
    db.getAllAsync = (async (query: string, ...args: (string | number)[]) => {
      const rows = await originalRead(query, ...args);
      if (query.startsWith('SELECT * FROM trips')) { entered(); await pause; }
      return rows;
    }) as typeof db.getAllAsync;
    const reading = plannerSnapshot(db, 99999);
    await started;
    const deletion = deleteTrip(db, id);
    release();
    const snapshot = await reading;
    assert.equal(snapshot.tripId, id); // A missing/deleted route falls back to an existing trip.
    assert.equal(snapshot.plans.length, 1);
    assert.equal(snapshot.plans[0].trip_id, snapshot.tripId);
    await deletion;
    assert.equal((await plannerSnapshot(db, id)).tripId, null);
  } finally { close(); }
});

test('an unrelated save waits for a failing import and survives its rollback', async () => {
  const { db, close } = database();
  try {
    await initDatabase(db);
    const id = await createTrip(db, trip);
    await addExpense(db, { trip_id: id, day: trip.start_date, category: 'Food', label: 'Lunch', amount_cents: 2550 });
    const raw = await exportBackup(db);
    let release!: () => void;
    let entered!: () => void;
    const paused = new Promise<void>(resolve => { release = resolve; });
    const started = new Promise<void>(resolve => { entered = resolve; });
    const originalRun = db.runAsync.bind(db);
    db.runAsync = (async (query: string, ...args: (string | number)[]) => {
      if (query.startsWith('INSERT INTO expenses')) {
        entered(); await paused; throw Error('Simulated import failure');
      }
      return originalRun(query, ...args);
    }) as typeof db.runAsync;
    const rejectedImport = assert.rejects(importBackup(db, raw), /Simulated import failure/);
    await started;
    const independentSave = createTrip(db, { ...trip, title: 'Independent save' });
    const independentRead = listTrips(db);
    release();
    await rejectedImport;
    const savedId = await independentSave;
    const rows = await independentRead;
    assert.equal(rows.length, 2);
    assert.equal(rows.find(value => value.id === savedId)?.title, 'Independent save');
    assert.equal((await listExpenses(db, id)).length, 1);
  } finally { close(); }
});

test('entry edits update the original row and retain other trips', async () => {
  const { db, close } = database();
  try {
    await initDatabase(db);
    const id = await createTrip(db, trip);
    const otherId = await createTrip(db, { ...trip, title: 'Other' });
    await addPlan(db, { trip_id: id, day: trip.start_date, time: '09:00', kind: 'Activity', title: 'Walk', place: '', note: '' });
    await addExpense(db, { trip_id: id, day: trip.start_date, category: 'Food', label: 'Lunch', amount_cents: 2550 });
    const [plan] = await listPlan(db, id);
    const [expense] = await listExpenses(db, id);
    await updatePlan(db, plan.id, { ...plan, time: '10:30', note: 'Bring shoes' });
    await updateExpense(db, expense.id, { ...expense, amount_cents: 3075 });
    assert.equal((await listPlan(db, id)).length, 1);
    assert.equal((await listPlan(db, id))[0].time, '10:30');
    assert.equal((await listExpenses(db, id))[0].amount_cents, 3075);
    // Scoped mutations must not let an entry move to an unrelated trip.
    await assert.rejects(updatePlan(db, plan.id, { ...plan, trip_id: otherId }), /no longer exists in the selected trip/);
    await assert.rejects(updateExpense(db, expense.id, { ...expense, trip_id: otherId, amount_cents: 1 }), /no longer exists in the selected trip/);
    assert.equal((await listExpenses(db, id))[0].amount_cents, 3075);
    await assert.rejects(updateTrip(db, id, { ...trip, start_date: '2026-11-02' }), /exclude existing/);
    assert.equal((await listTrips(db)).find(t => t.id === id)?.start_date, trip.start_date);
    await deleteTrip(db, id);
    await assert.rejects(updatePlan(db, plan.id, plan), /no longer exists/);
    await assert.rejects(updateExpense(db, expense.id, expense), /no longer exists/);
    await assert.rejects(updateTrip(db, id, trip), /no longer exists/);
    assert.equal((await listPlan(db, id)).length, 0);
    assert.equal((await listExpenses(db, id)).length, 0);
    assert.equal((await listTrips(db))[0].id, otherId);
  } finally { close(); }
});

test('backup round-trip adds trips and rolls back every new row if an import fails', async () => {
  const { db, close } = database();
  try {
    await initDatabase(db);
    const id = await createTrip(db, trip);
    await addPlan(db, { trip_id: id, day: trip.start_date, time: '09:00', kind: 'Activity', title: 'Walk', place: '', note: '' });
    await addExpense(db, { trip_id: id, day: trip.start_date, category: 'Food', label: 'Lunch', amount_cents: 2550 });
    const raw = await exportBackup(db);
    assert.equal(await importBackup(db, raw), 1);
    const restored = (await listTrips(db)).find(value => value.id !== id)!;
    assert.equal((await listExpenses(db, restored.id))[0].amount_cents, 2550);
    assert.equal((await listPlan(db, restored.id))[0].title, 'Walk');
    await assert.rejects(importBackup(db, '{}'), /Invalid backup/);
    assert.equal((await listTrips(db)).length, 2);
    await db.execAsync("CREATE TRIGGER fail_import BEFORE INSERT ON expenses BEGIN SELECT RAISE(ABORT, 'Simulated disk failure'); END;");
    await assert.rejects(importBackup(db, raw), /Simulated disk failure/);
    assert.equal((await listTrips(db)).length, 2);
    assert.equal((await listPlan(db, id)).length, 1);
  } finally { close(); }
});

test('traveler input is bound as data, including SQL-like titles', async () => {
  const { db, close } = database();
  try {
    await initDatabase(db);
    const title = "O'Brien'); DROP TABLE trips; --";
    await createTrip(db, { ...trip, title });
    assert.equal((await listTrips(db))[0].title, title);
    await createTrip(db, trip);
    assert.equal((await listTrips(db)).length, 2);
  } finally { close(); }
});

test('database rejects out-of-trip entries and currency changes without changing saved data', async () => {
  const { db, close } = database();
  try {
    await initDatabase(db);
    const id = await createTrip(db, trip);
    const plan = { trip_id: id, day: trip.start_date, time: '09:00', kind: 'Activity', title: 'Walk', place: '', note: '' };
    const expense = { trip_id: id, day: trip.start_date, category: 'Food', label: 'Lunch', amount_cents: 2500 };
    await assert.rejects(addPlan(db, { ...plan, day: '2026-10-31' }), /within the trip/);
    await assert.rejects(addExpense(db, { ...expense, day: '2026-11-06' }), /within the trip/);
    await addPlan(db, plan);
    await addExpense(db, expense);
    const [savedPlan] = await listPlan(db, id);
    const [savedExpense] = await listExpenses(db, id);
    await assert.rejects(updatePlan(db, savedPlan.id, { ...plan, day: '2026-11-06' }), /within the trip/);
    await assert.rejects(updateExpense(db, savedExpense.id, { ...expense, day: '2026-10-31' }), /within the trip/);
    await assert.rejects(updateTrip(db, id, { ...trip, currency: 'EUR' }), /Currency cannot change/);
    // Direct writes also enforce the invariants, bypassing form and query helpers.
    await assert.rejects(db.runAsync('UPDATE trips SET start_date = ? WHERE id = ?', '2026-11-02', id), /exclude existing/);
    assert.equal((await listTrips(db))[0].currency, 'USD');
    assert.equal((await listPlan(db, id))[0].day, trip.start_date);
    assert.equal((await listExpenses(db, id))[0].amount_cents, 2500);
    await initDatabase(db); // Startup can safely apply these protections to existing data.
    assert.equal((await listExpenses(db, id)).length, 1);
    const emptyId = await createTrip(db, trip);
    await updateTrip(db, emptyId, { ...trip, currency: 'EUR' });
    assert.equal((await listTrips(db)).find(value => value.id === emptyId)?.currency, 'EUR');
  } finally { close(); }
});


test('planned trips preserve legacy records, round-trip v3 backups, and block currency relabeling', async () => {
  const { db, close } = database();
  const planning = { travelers: 2, rooms: 1, origin: 'Madison', interests: ['Food'], pace: 'Relaxed', transport: 'Walking and transit', contingency_bps: 1000, lines: [{ category: 'Accommodation' as const, label: 'Hotel', unit: 'room-night' as const, amount_cents: 10000, source: 'User estimate' as const, source_note: '', checked_at: '' }] };
  try {
    await initDatabase(db);
    const legacy = await createTrip(db, trip);
    await saveSetting(db, 'trip-draft', '{"draft":"sample"}');
    const id = await createPlannedTrip(db, { ...trip, title: 'Family trip' }, planning);
    assert.equal(await getSetting(db, 'trip-draft'), null);
    assert.deepEqual(await getPlanning(db, id), planning);
    assert.equal((await getPlanning(db, legacy)).travelers, 1);
    await assert.rejects(updateTrip(db, id, { ...trip, currency: 'EUR' }), /planned costs/);
    const backup = await exportBackup(db);
    assert.equal(JSON.parse(backup).version, 3);
    await importBackup(db, backup);
    const restored = (await listTrips(db)).find(value => value.id !== id && value.title === 'Family trip')!;
    assert.deepEqual(await getPlanning(db, restored.id), planning);
    const malformed = JSON.parse(backup); malformed.trips[0].planning.travelers = -1;
    const before = (await listTrips(db)).length;
    await assert.rejects(importBackup(db, JSON.stringify(malformed)));
    assert.equal((await listTrips(db)).length, before);
    await deleteTrip(db, id);
    assert.equal((await db.getAllAsync('SELECT * FROM trip_planning WHERE trip_id = ?', id)).length, 0);
  } finally { close(); }
});

test('failed planned-trip creation retains the draft and all existing trips', async () => {
  const { db, close } = database();
  try {
    await initDatabase(db);
    await createTrip(db, trip);
    await saveSetting(db, 'trip-draft', '{"draft":"keep"}');
    const invalid = { travelers: 0, rooms: 1, origin: '', interests: [], pace: 'Balanced', transport: 'Mixed', contingency_bps: 1000, lines: [] };
    await assert.rejects(createPlannedTrip(db, trip, invalid));
    assert.equal((await listTrips(db)).length, 1);
    assert.equal(await getSetting(db, 'trip-draft'), '{"draft":"keep"}');
    await assert.rejects(savePlanning(db, 999999, { ...invalid, travelers: 1 }), /no longer exists/);
  } finally { close(); }
});


test('reordering plans persists sort_order, preserves order across edits, and round-trips backups', async () => {
  const { db, close } = database();
  try {
    await initDatabase(db);
    const id = await createTrip(db, trip);
    const otherId = await createTrip(db, { ...trip, title: 'Other trip' });
    await addPlan(db, { trip_id: id, day: trip.start_date, time: '09:00', kind: 'Activity', title: 'Morning walk', place: '', note: '', duration_minutes: 60 });
    await addPlan(db, { trip_id: id, day: trip.start_date, time: '11:00', kind: 'Dining', title: 'Early lunch', place: '', note: '', duration_minutes: 90 });
    const initial = await listPlan(db, id);
    assert.deepEqual(initial.map(item => item.title), ['Morning walk', 'Early lunch']);

    // Boundary move up on first item returns false
    assert.equal(await reorderPlan(db, id, initial[0].id, 'up'), false);
    // Move second item up before first item
    assert.equal(await reorderPlan(db, id, initial[1].id, 'up'), true);
    const reordered = await listPlan(db, id);
    assert.deepEqual(reordered.map(item => item.title), ['Early lunch', 'Morning walk']);
    assert.deepEqual(reordered.map(item => item.sort_order), [1, 2]);

    // Editing title/duration without specifying sort_order preserves custom sort_order on the same day
    await updatePlan(db, reordered[0].id, {
      trip_id: id,
      day: reordered[0].day,
      time: reordered[0].time,
      kind: reordered[0].kind,
      title: 'Early lunch (updated)',
      place: 'Harbor',
      note: 'Reserved',
      duration_minutes: 75,
      completed: true,
    });
    const afterEdit = await listPlan(db, id);
    assert.deepEqual(afterEdit.map(item => item.title), ['Early lunch (updated)', 'Morning walk']);
    assert.equal(afterEdit[0].sort_order, 1);
    assert.equal(afterEdit[0].duration_minutes, 75);
    assert.equal(afterEdit[0].completed, true);

    // Adding a new plan to a day that has custom ordering appends at max_order + 1
    await addPlan(db, { trip_id: id, day: trip.start_date, time: '08:00', kind: 'Activity', title: 'Added later', place: '', note: '' });
    const afterAdd = await listPlan(db, id);
    assert.deepEqual(afterAdd.map(item => item.title), ['Early lunch (updated)', 'Morning walk', 'Added later']);
    assert.equal(afterAdd[2].sort_order, 3);

    // Cross-trip reorder is rejected
    await assert.rejects(reorderPlan(db, otherId, reordered[0].id, 'down'), /no longer exists in the selected trip/);

    // Backup round-trip preserves order, duration, and completion
    const backup = await exportBackup(db);
    await importBackup(db, backup);
    const restored = (await listTrips(db)).find(value => value.id !== id && value.id !== otherId)!;
    const restoredPlans = await listPlan(db, restored.id);
    assert.deepEqual(restoredPlans.map(item => item.title), ['Early lunch (updated)', 'Morning walk', 'Added later']);
    assert.equal(restoredPlans[0].duration_minutes, 75);
    assert.equal(restoredPlans[0].completed, true);
  } finally { close(); }
});

test('v2 migration enforces foreign_keys, adds v2 columns, and sets plan_item_id NULL on plan delete', async () => {
  const { db, close } = database();
  try {
    await initDatabase(db);
    const fk = await db.getFirstAsync<{ foreign_keys: number }>('PRAGMA foreign_keys');
    assert.equal(fk?.foreign_keys, 1);

    const planCols = (await db.getAllAsync<{ name: string }>('PRAGMA table_info(plan_items)')).map(c => c.name);
    for (const col of ['status', 'option_group_id', 'vote_state', 'vote_tally_json', 'updated_at', 'deleted_at']) {
      assert.ok(planCols.includes(col), `plan_items missing ${col}`);
    }
    const expenseCols = (await db.getAllAsync<{ name: string }>('PRAGMA table_info(expenses)')).map(c => c.name);
    for (const col of ['plan_item_id', 'amount_base', 'fx_rate_locked', 'paid_by', 'split_mode', 'updated_at', 'deleted_at']) {
      assert.ok(expenseCols.includes(col), `expenses missing ${col}`);
    }
    const planningCols = (await db.getAllAsync<{ name: string }>('PRAGMA table_info(trip_planning)')).map(c => c.name);
    assert.ok(planningCols.includes('updated_at'));

    const tripId = await createTrip(db, trip);
    await addPlan(db, { trip_id: tripId, day: trip.start_date, time: '09:00', kind: 'Activity', title: 'Walk', place: '', note: '' });
    const [plan] = await listPlan(db, tripId);
    await db.runAsync('INSERT INTO expenses(trip_id,plan_item_id,day,category,label,amount_cents) VALUES(?,?,?,?,?,?)', tripId, plan.id, trip.start_date, 'Food', 'Coffee', 450);
    await db.runAsync('DELETE FROM plan_items WHERE id = ?', plan.id);
    const exp = await db.getFirstAsync<{ plan_item_id: number | null }>('SELECT plan_item_id FROM expenses WHERE trip_id = ?', tripId);
    assert.equal(exp?.plan_item_id, null);
  } finally { close(); }
});
