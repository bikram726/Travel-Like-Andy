import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calculateBudget, calculateGroupSettlement, costCategories, defaultPlanning, validatePlanning, type CostLine } from '../src/budget.ts';
const trip = { start_date: '2026-11-01', end_date: '2026-11-05', currency: 'USD', budget_cents: 100000 };
const line = (change: Partial<CostLine> = {}): CostLine => ({ category: 'Food', label: 'Meals', amount_cents: 1000, unit: 'person-day', source: 'User estimate', source_note: '', checked_at: '', ...change });

test('cost units distinguish person-days, room-nights, and one-off party transport', () => {
  const plan = { ...defaultPlanning(), travelers: 2, rooms: 1, contingency_bps: 0, lines: [line(), line({ category: 'Accommodation', amount_cents: 20000, unit: 'room-night' }), line({ category: 'Transportation', amount_cents: 30000, unit: 'trip' })] };
  const result = calculateBudget(trip, plan);
  assert.deepEqual(result.lines.map(value => value.quantity), [10, 4, 1]);
  assert.equal(result.total, 120000); assert.equal(result.gap, -20000); assert.equal(result.share, 60000);
  assert.equal(result.categories.find(value => value.category === 'Accommodation')?.total, 80000);
});
test('missing categories and explicit unknowns never become an affordable verdict', () => {
  const result = calculateBudget({ ...trip, budget_cents: 0 }, { ...defaultPlanning(), lines: [line({ amount_cents: null })] });
  assert.equal(result.total, 0); assert.equal(result.complete, false); assert.equal(result.categories.filter(value => value.unknown).length, 7);
  const knownFree = costCategories.map(category => line({ category, amount_cents: 0, unit: 'trip' }));
  assert.equal(calculateBudget(trip, { ...defaultPlanning(), lines: knownFree }).complete, true);
});
test('contingency rounds once in minor units and per-person remainders remain visible', () => {
  const result = calculateBudget(trip, { ...defaultPlanning(), travelers: 3, contingency_bps: 1000, lines: [line({ amount_cents: 105, unit: 'trip' })] });
  assert.equal(result.contingency, 11); assert.equal(result.total, 116); assert.equal(result.share * 3 + result.remainder, 116);
});
test('date changes recalculate nights and days across daylight savings and same-day trips', () => {
  const plan = { ...defaultPlanning(), contingency_bps: 0, lines: [line({ amount_cents: 100, unit: 'room-night' }), line({ amount_cents: 100, unit: 'day' })] };
  assert.equal(calculateBudget(trip, plan).total, 900);
  assert.equal(calculateBudget({ ...trip, end_date: trip.start_date }, plan).total, 100);
  assert.equal(calculateBudget({ ...trip, end_date: '2026-11-06' }, plan).total, 1100);
});
test('currency totals remain in the trip currency, with unsupported currencies rejected', () => {
  for (const currency of ['USD', 'EUR', 'NPR']) assert.equal(calculateBudget({ ...trip, currency }, { ...defaultPlanning(), lines: [line({ amount_cents: 123, unit: 'trip' })], contingency_bps: 0 }).total, 123);
  assert.throws(() => calculateBudget({ ...trip, currency: 'JPY' }, defaultPlanning()), /Invalid trip/);
});
test('invalid amounts, party counts, provenance, and unsafe totals are rejected', () => {
  for (const change of [{ travelers: 0 }, { travelers: 2.5 }, { rooms: 51 }, { contingency_bps: 5001 }]) assert.throws(() => validatePlanning({ ...defaultPlanning(), ...change }));
  for (const change of [{ amount_cents: .1 }, { amount_cents: -1 }, { source: 'Supplier quote' as const }, { checked_at: '2026-02-30' }]) assert.throws(() => validatePlanning({ ...defaultPlanning(), lines: [line(change)] }));
  assert.throws(() => validatePlanning({ ...defaultPlanning(), owner: 'injected' }));
  assert.throws(() => validatePlanning({ ...defaultPlanning(), accommodation: '' }));
  assert.throws(() => validatePlanning({ ...defaultPlanning(), accessibility_notes: 'a'.repeat(501) }));
  const withPrefs = validatePlanning({ ...defaultPlanning(), accommodation: 'Hotel', accessibility_notes: 'Step-free access, nut allergy' });
  assert.equal(withPrefs.accommodation, 'Hotel');
  assert.equal(withPrefs.accessibility_notes, 'Step-free access, nut allergy');
  assert.throws(() => calculateBudget({ ...trip, end_date: '2199-12-31' }, { ...defaultPlanning(), travelers: 50, lines: [line({ amount_cents: 999999999999 })] }), /supported range/);
});

test('group settlement splits equal, room-weighted, and personal expenses to exact cents', () => {
  const members = ['Andy', 'Bea', 'Cam'];
  const settlement = calculateGroupSettlement(
    [
      { amount_cents: 10000, paid_by: 'Andy', split_mode: 'equal' }, // 3334, 3333, 3333
      { amount_cents: 30000, paid_by: 'Bea', split_mode: 'room', room_shares: { Andy: 2, Bea: 1 } }, // Andy 20000, Bea 10000
      { amount_cents: 2500, paid_by: 'Cam', split_mode: 'personal', participants: ['Andy'] }, // Andy owes Cam 2500
      { amount_cents: 1500, paid_by: 'Cam', split_mode: 'personal' }, // Cam for Cam -> nets 0
    ],
    members,
  );
  assert.equal(settlement.total_cents, 44000);
  assert.deepEqual(settlement.balances, {
    Andy: 10000 - 3334 - 20000 - 2500, // -15834
    Bea: 30000 - 3333 - 10000, // +16667
    Cam: 2500 + 1500 - 3333 - 1500, // -833
  });
  assert.equal(Object.values(settlement.balances).reduce((a, b) => a + b, 0), 0);
  assert.deepEqual(settlement.transfers, [
    { from: 'Andy', to: 'Bea', amount_cents: 15834 },
    { from: 'Cam', to: 'Bea', amount_cents: 833 },
  ]);
});

test('group settlement rejects invalid members, payers, split modes, and room shares', () => {
  assert.throws(() => calculateGroupSettlement([], []), /unique, non-empty/);
  assert.throws(() => calculateGroupSettlement([], ['Andy', 'Andy']), /unique, non-empty/);
  assert.throws(() => calculateGroupSettlement([{ amount_cents: 100, paid_by: 'Dan', split_mode: 'equal' }], ['Andy', 'Bea']), /valid amount, payer/);
  assert.throws(() => calculateGroupSettlement([{ amount_cents: 100, paid_by: 'Andy', split_mode: 'personal', participants: ['Andy', 'Bea'] }], ['Andy', 'Bea']), /single valid member/);
  assert.throws(() => calculateGroupSettlement([{ amount_cents: 100, paid_by: 'Andy', split_mode: 'room', room_shares: { Andy: 0 } }], ['Andy', 'Bea']), /positive integer weights/);
});
