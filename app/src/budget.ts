import { currencyOK, dateOK, tripDays } from './validation.ts';

export const costCategories = ['Transportation', 'Accommodation', 'Food', 'Activities', 'Local transport', 'Fees and taxes', 'Miscellaneous'] as const;
export const costUnits = ['trip', 'person', 'day', 'person-day', 'room-night'] as const;
export const costSources = ['User estimate', 'AI estimate', 'Reference estimate', 'Supplier quote'] as const;
export const accommodationStyles = ['Decide later', 'Hotel', 'Vacation rental', 'Hostel or budget', 'Resort', 'Friends or family'] as const;
export type CostCategory = typeof costCategories[number];
export type CostLine = { category: CostCategory; label: string; unit: typeof costUnits[number]; amount_cents: number | null; source: typeof costSources[number]; source_note: string; checked_at: string };
export type Planning = {
  travelers: number;
  rooms: number;
  origin: string;
  interests: string[];
  pace: string;
  transport: string;
  contingency_bps: number;
  lines: CostLine[];
  accommodation?: string;
  accessibility_notes?: string;
};
export const defaultPlanning = (): Planning => ({ travelers: 1, rooms: 1, origin: '', interests: [], pace: 'Balanced', transport: 'Decide later', contingency_bps: 1000, lines: [] });
const MAX = 999_999_999_999;
const integer = (value: unknown, min: number, max: number): value is number => typeof value === 'number' && Number.isSafeInteger(value) && value >= min && value <= max;
function validText(value: unknown, max: number, required = false): value is string { return typeof value === 'string' && value.length <= max && (!required || !!value.trim()) && !/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(value); }
function exactObject(value: unknown, keys: string[]): value is Record<string, unknown> { return !!value && typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length === keys.length && keys.every(key => Object.hasOwn(value, key)); }

export function validatePlanning(input: unknown): Planning {
  const requiredKeys = ['travelers', 'rooms', 'origin', 'interests', 'pace', 'transport', 'contingency_bps', 'lines'];
  const optionalKeys = ['accommodation', 'accessibility_notes'].filter(
    key => !!input && typeof input === 'object' && Object.hasOwn(input, key),
  );
  if (
    !exactObject(input, [...requiredKeys, ...optionalKeys]) ||
    !integer(input.travelers, 1, 50) ||
    !integer(input.rooms, 1, 50) ||
    !validText(input.origin, 120) ||
    !validText(input.pace, 40, true) ||
    !validText(input.transport, 80, true) ||
    !integer(input.contingency_bps, 0, 5000) ||
    !Array.isArray(input.interests) ||
    input.interests.length > 12 ||
    !input.interests.every(v => validText(v, 40, true)) ||
    !Array.isArray(input.lines) ||
    input.lines.length > 200 ||
    (Object.hasOwn(input, 'accommodation') && !validText(input.accommodation, 80, true)) ||
    (Object.hasOwn(input, 'accessibility_notes') && !validText(input.accessibility_notes, 500, false))
  ) {
    throw Error('Enter 1-50 travelers and rooms, a contingency from 0-50%, and valid planning details.');
  }
  const lines = input.lines.map((line: unknown): CostLine => {
    if (!exactObject(line, ['category', 'label', 'unit', 'amount_cents', 'source', 'source_note', 'checked_at']) || !costCategories.includes(line.category as CostCategory) || !costUnits.includes(line.unit as CostLine['unit']) || !costSources.includes(line.source as CostLine['source']) || !validText(line.label, 120, true) || !(line.amount_cents === null || integer(line.amount_cents, 0, MAX)) || !validText(line.source_note, 500) || !validText(line.checked_at, 10) || (line.checked_at !== '' && !dateOK(line.checked_at)) || (line.source !== 'User estimate' && (!line.source_note.trim() || !line.checked_at))) throw Error('Each cost needs a category, unit, valid amount or unknown, and provenance for external estimates.');
    return { category: line.category as CostCategory, label: line.label, unit: line.unit as CostLine['unit'], amount_cents: line.amount_cents, source: line.source as CostLine['source'], source_note: line.source_note, checked_at: line.checked_at };
  });
  return {
    travelers: input.travelers,
    rooms: input.rooms,
    origin: input.origin,
    interests: [...input.interests],
    pace: input.pace,
    transport: input.transport,
    contingency_bps: input.contingency_bps,
    lines,
    ...(Object.hasOwn(input, 'accommodation') ? { accommodation: input.accommodation as string } : {}),
    ...(Object.hasOwn(input, 'accessibility_notes') ? { accessibility_notes: input.accessibility_notes as string } : {}),
  };
}

function safe(value: bigint) { if (value > BigInt(Number.MAX_SAFE_INTEGER) || value < 0n) throw Error('The calculated total exceeds the supported range.'); return Number(value); }
export function calculateBudget(trip: { start_date: string; end_date: string; budget_cents: number; currency: string }, raw: Planning) {
  const plan = validatePlanning(raw);
  if (!dateOK(trip.start_date) || !dateOK(trip.end_date) || trip.end_date < trip.start_date || !integer(trip.budget_cents, 0, MAX) || !currencyOK(trip.currency)) throw Error('Invalid trip dates, currency, or budget.');
  const days = tripDays(trip.start_date, trip.end_date), nights = days - 1;
  const quantities = { trip: 1, person: plan.travelers, day: days, 'person-day': plan.travelers * days, 'room-night': plan.rooms * nights };
  const lines = plan.lines.map(line => ({ ...line, quantity: quantities[line.unit], total: line.amount_cents === null ? null : safe(BigInt(line.amount_cents) * BigInt(quantities[line.unit])) }));
  const categories = costCategories.map(category => {
    const matching = lines.filter(line => line.category === category);
    return { category, total: safe(matching.reduce((sum, line) => sum + BigInt(line.total ?? 0), 0n)), unknown: matching.length === 0 || matching.some(line => line.total === null) };
  });
  const subtotal = safe(categories.reduce((sum, category) => sum + BigInt(category.total), 0n));
  // Round the reserve once, half up, on the known subtotal only.
  const contingency = safe((BigInt(subtotal) * BigInt(plan.contingency_bps) + 5000n) / 10000n);
  const total = safe(BigInt(subtotal) + BigInt(contingency));
  return { lines, categories, days, nights, subtotal, contingency, total, gap: trip.budget_cents - total, complete: categories.every(category => !category.unknown), share: Math.floor(total / plan.travelers), remainder: total % plan.travelers };
}

export const splitModes = ['equal', 'room', 'personal'] as const;
export type SplitMode = typeof splitModes[number];
export type GroupExpense = {
  amount_cents: number;
  paid_by: string;
  split_mode: SplitMode;
  participants?: string[];
  room_shares?: Record<string, number>;
};
export type SettlementTransfer = { from: string; to: string; amount_cents: number };
export type GroupSettlement = { balances: Record<string, number>; transfers: SettlementTransfer[]; total_cents: number };

function allocateShares(amount: number, targets: string[], weights?: number[]): number[] {
  if (!weights) {
    const base = Math.floor(amount / targets.length);
    const rem = amount % targets.length;
    return targets.map((_, i) => base + (i < rem ? 1 : 0));
  }
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  const shares = weights.map(w => safe((BigInt(amount) * BigInt(w)) / BigInt(totalWeight)));
  let rem = amount - shares.reduce((sum, s) => sum + s, 0);
  for (let i = 0; rem > 0 && i < shares.length; i++) {
    shares[i] += 1;
    rem -= 1;
  }
  return shares;
}

/** Calculate per-member net balances and minimal transfers for shared trip expenses. */
export function calculateGroupSettlement(expenses: GroupExpense[], members: string[]): GroupSettlement {
  if (!Array.isArray(members) || members.length === 0 || members.some(m => !validText(m, 80, true)) || new Set(members).size !== members.length) {
    throw Error('Enter unique, non-empty member names for group settlement.');
  }
  const memberSet = new Set(members);
  const balances: Record<string, number> = Object.fromEntries(members.map(m => [m, 0]));
  let total_cents = 0;

  for (const exp of expenses) {
    if (!integer(exp.amount_cents, 0, MAX) || !memberSet.has(exp.paid_by) || !splitModes.includes(exp.split_mode)) {
      throw Error('Each group expense needs a valid amount, payer, and split mode.');
    }
    total_cents = safe(BigInt(total_cents) + BigInt(exp.amount_cents));

    let targets: string[];
    let weights: number[] | undefined;
    if (exp.split_mode === 'personal') {
      targets = exp.participants?.length ? exp.participants : [exp.paid_by];
      if (targets.length !== 1 || !memberSet.has(targets[0])) throw Error('Personal expenses must target a single valid member.');
    } else if (exp.split_mode === 'room' && exp.room_shares) {
      const entries = Object.entries(exp.room_shares);
      if (entries.length === 0 || entries.some(([m, w]) => !memberSet.has(m) || !integer(w, 1, 50))) {
        throw Error('Room shares must assign positive integer weights to valid members.');
      }
      targets = entries.map(([m]) => m);
      weights = entries.map(([, w]) => w);
    } else {
      targets = exp.participants?.length ? exp.participants : members;
      if (new Set(targets).size !== targets.length || targets.some(m => !memberSet.has(m))) {
        throw Error('Participants must be unique valid members.');
      }
    }

    const shares = allocateShares(exp.amount_cents, targets, weights);
    balances[exp.paid_by] += exp.amount_cents;
    targets.forEach((member, i) => { balances[member] -= shares[i]; });
  }

  const debtors = members.filter(m => balances[m] < 0).map(m => ({ name: m, owes: -balances[m] }));
  const creditors = members.filter(m => balances[m] > 0).map(m => ({ name: m, owed: balances[m] }));
  const transfers: SettlementTransfer[] = [];
  let di = 0;
  let ci = 0;
  while (di < debtors.length && ci < creditors.length) {
    const amount_cents = Math.min(debtors[di].owes, creditors[ci].owed);
    if (amount_cents > 0) transfers.push({ from: debtors[di].name, to: creditors[ci].name, amount_cents });
    debtors[di].owes -= amount_cents;
    creditors[ci].owed -= amount_cents;
    if (debtors[di].owes === 0) di += 1;
    if (creditors[ci].owed === 0) ci += 1;
  }

  return { balances, transfers, total_cents };
}
