import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hashBackup, MAX_BACKUP_LENGTH, normalizeCurrencyFloat, parseBackup, sha256Hex } from '../src/backup.ts';

const sample = {
  format: 'travel-like-andy', version: 1,
  trips: [{ title: 'Sample', destination: 'Florence', start_date: '2026-11-01', end_date: '2026-11-05', currency: 'USD', budget_cents: 120000,
    plans: [{ day: '2026-11-01', time: '09:00', kind: 'Activity', title: "O'Brien walk", place: '', note: 'Bring shoes', duration_minutes: 0, sort_order: 0, completed: false }],
    expenses: [{ day: '2026-11-01', category: 'Food', label: 'Lunch', amount_cents: 2550 }],
  }],
};

test('backup preserves exact amounts and text without database identifiers', () => {
  assert.deepEqual(parseBackup(JSON.stringify(sample)), sample);
  assert.deepEqual(parseBackup(JSON.stringify({ format: 'travel-like-andy', version: 1, trips: [] })).trips, []);
});

test('backup rejects malformed structure, unsupported versions, and injected properties', () => {
  for (const value of [null, [], {}, { ...sample, version: 3 }, { ...sample, format: 'other' }, { ...sample, trips: null }, { ...sample, unexpected: true }]) {
    assert.throws(() => parseBackup(JSON.stringify(value)), /Invalid backup/);
  }
  assert.throws(() => parseBackup('{'), /not valid JSON/);
  assert.throws(() => parseBackup(' '.repeat(MAX_BACKUP_LENGTH + 1)), /too large/);
  assert.throws(() => parseBackup(JSON.stringify(sample).replace('"version":1', '"version":1,"__proto__":{}')), /Invalid backup/);
});

test('version 2 backups validate conversion provenance and reject inconsistent totals', () => {
  const conversion = { original_currency: 'EUR', original_cents: 10000, rate: '1.1217', rate_date: '2026-10-08', source: 'Frankfurter' };
  const expense = { ...sample.trips[0].expenses[0], amount_cents: 11217, conversion };
  const backup = { ...sample, version: 2, trips: [{ ...sample.trips[0], expenses: [expense] }] };
  assert.deepEqual(parseBackup(JSON.stringify(backup)), backup);
  for (const change of [{ amount_cents: 11218 }, { conversion: { ...conversion, original_currency: 'USD' } }, { conversion: { ...conversion, source: 'unknown' } }, { conversion: { ...conversion, hidden: true } }, { conversion: undefined }]) {
    assert.throws(() => parseBackup(JSON.stringify({ ...backup, trips: [{ ...backup.trips[0], expenses: [{ ...expense, ...change }] }] })), /Invalid backup/);
  }
});

test('backup rejects invalid dates, precision loss, excessive text, and out-of-trip entries', () => {
  const changes = [
    { start_date: '2026-02-29' }, { end_date: '2026-10-31' }, { currency: 'JPY' }, { currency: 'usd' },
    { budget_cents: -1 }, { budget_cents: 1.5 }, { title: ' '.repeat(5) }, { title: 'a'.repeat(121) },
    { plans: [{ ...sample.trips[0].plans[0], day: '2026-11-06' }] },
    { plans: [{ ...sample.trips[0].plans[0], time: '24:00' }] },
    { expenses: [{ ...sample.trips[0].expenses[0], amount_cents: 0 }] },
    { expenses: [{ ...sample.trips[0].expenses[0], amount_cents: Number.MAX_SAFE_INTEGER }] },
    { expenses: [{ ...sample.trips[0].expenses[0], category: 'Unknown' }] },
  ];
  for (const change of changes) {
    assert.throws(() => parseBackup(JSON.stringify({ ...sample, trips: [{ ...sample.trips[0], ...change }] })), /Invalid backup/);
  }
});

test('legacy itinerary fields default safely while invalid duration/order/completion are rejected', () => {
  const { duration_minutes: _duration, sort_order: _order, completed: _completed, ...legacy } = sample.trips[0].plans[0];
  const file = (plan: unknown) => JSON.stringify({ ...sample, trips: [{ ...sample.trips[0], plans: [plan] }] });
  assert.deepEqual(parseBackup(file(legacy)).trips[0].plans[0], sample.trips[0].plans[0]);
  assert.equal(parseBackup(file({ ...legacy, completed: 1 })).trips[0].plans[0].completed, true);
  for (const fields of [{ duration_minutes: -1 }, { duration_minutes: 1.5 }, { duration_minutes: 10000 }, { duration_minutes: null },
    { sort_order: -1 }, { sort_order: 1.5 }, { sort_order: Number.MAX_SAFE_INTEGER }, { completed: 'yes' }, { completed: 2 }, { hidden: true }]) {
    assert.throws(() => parseBackup(file({ ...legacy, ...fields })), /Invalid backup/);
  }
});

test('backup hashing normalizes currency floats before SHA-256 and preserves optional sync timestamps', async () => {
  assert.equal(normalizeCurrencyFloat(0.1 + 0.2), 0.3);
  assert.equal(normalizeCurrencyFloat(12.345), 12.35);
  const a = await sha256Hex({ amount: 0.1 + 0.2, label: 'Coffee' });
  const b = await sha256Hex({ label: 'Coffee', amount: 0.3 });
  assert.equal(a, b);
  assert.equal(a.length, 64);

  const parsed = parseBackup(JSON.stringify(sample));
  assert.equal((await hashBackup(parsed)).length, 64);

  const withSync = {
    ...sample,
    trips: [{
      ...sample.trips[0],
      updated_at: '2026-11-01T10:00:00Z',
      deleted_at: null,
      plans: [{ ...sample.trips[0].plans[0], updated_at: '2026-11-01T10:00:00Z', deleted_at: null }],
      expenses: [{ ...sample.trips[0].expenses[0], updated_at: '2026-11-01T10:00:00Z', deleted_at: '2026-11-01T11:00:00Z' }],
    }],
  };
  assert.deepEqual(parseBackup(JSON.stringify(withSync)), withSync);
});
