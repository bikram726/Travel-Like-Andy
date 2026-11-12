import type { SQLiteDatabase } from 'expo-sqlite';

// Additive, idempotent migration for existing device databases. Keep the trip
// table and its identifiers intact; deleting a trip cascades its planning data.
export const planningMigration = `
CREATE TABLE IF NOT EXISTS trip_planning (
  trip_id INTEGER PRIMARY KEY REFERENCES trips(id) ON DELETE CASCADE,
  value TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT ''
);
CREATE TABLE IF NOT EXISTS app_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);`;

const PLAN_ITEMS_V2_COLUMNS: readonly [string, string][] = [
  ['status', "TEXT NOT NULL DEFAULT 'confirmed'"],
  ['option_group_id', 'TEXT'],
  ['vote_state', 'TEXT'],
  ['vote_tally_json', 'TEXT'],
  ['updated_at', "TEXT NOT NULL DEFAULT ''"],
  ['deleted_at', 'TEXT'],
];

// Enforce foreign keys and idempotently upgrade v1 tables to v2 schema.
export async function applyV2Migration(db: SQLiteDatabase): Promise<void> {
  await db.execAsync('PRAGMA foreign_keys = ON;');

  const planCols = await db.getAllAsync<{ name: string }>('PRAGMA table_info(plan_items)');
  for (const [name, definition] of PLAN_ITEMS_V2_COLUMNS) {
    if (!planCols.some(col => col.name === name)) {
      await db.execAsync(`ALTER TABLE plan_items ADD COLUMN ${name} ${definition};`);
    }
  }

  const planningCols = await db.getAllAsync<{ name: string }>('PRAGMA table_info(trip_planning)');
  if (!planningCols.some(col => col.name === 'updated_at')) {
    await db.execAsync("ALTER TABLE trip_planning ADD COLUMN updated_at TEXT NOT NULL DEFAULT '';");
  }

  const expenseCols = await db.getAllAsync<{ name: string }>('PRAGMA table_info(expenses)');
  if (!expenseCols.some(col => col.name === 'plan_item_id')) {
    await db.execAsync(`
      CREATE TABLE expenses_v2 (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        trip_id INTEGER NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
        plan_item_id INTEGER REFERENCES plan_items(id) ON DELETE SET NULL,
        day TEXT NOT NULL,
        category TEXT NOT NULL,
        label TEXT NOT NULL,
        amount_cents INTEGER NOT NULL CHECK(amount_cents > 0),
        amount_base INTEGER,
        fx_rate_locked TEXT,
        paid_by TEXT NOT NULL DEFAULT '',
        split_mode TEXT NOT NULL DEFAULT 'equal',
        conversion_json TEXT,
        updated_at TEXT NOT NULL DEFAULT '',
        deleted_at TEXT
      );
      INSERT INTO expenses_v2 (id, trip_id, day, category, label, amount_cents, conversion_json)
      SELECT id, trip_id, day, category, label, amount_cents, conversion_json FROM expenses;
      DROP TRIGGER IF EXISTS trip_dates_update;
      DROP TRIGGER IF EXISTS trip_currency_update;
      DROP TABLE expenses;
      ALTER TABLE expenses_v2 RENAME TO expenses;
      CREATE INDEX IF NOT EXISTS expense_trip_day ON expenses(trip_id, day);
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
  }
}
