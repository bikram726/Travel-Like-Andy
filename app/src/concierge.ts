import { defaultPlanning, type Planning } from './budget.ts';
import { destinationStarters } from './international.ts';
import { placeIdeas } from './places.ts';
import { currencyOK, dateOK, daysBetween } from './validation.ts';

export type CuratedCollection = {
  id: string;
  badge: string;
  title: string;
  destination: string;
  country: string;
  days: number;
  defaultTravelers: number;
  defaultBudgetCents: number;
  currency: string;
  photo: string;
  summary: string;
  practicalNote: string;
  stops: { dayOffset: number; time: string; kind: 'Activity' | 'Stay' | 'Food' | 'Transit'; title: string; place: string; note: string; duration_minutes: number }[];
};

export const curatedCollections: readonly CuratedCollection[] = [
  {
    id: 'thailand-signature',
    badge: 'GROUP & BESPOKE SIGNATURE · 14 DAYS',
    title: 'From Wisconsin to Thailand',
    destination: 'Thailand',
    country: 'Thailand',
    days: 14,
    defaultTravelers: 2,
    defaultBudgetCents: 680000,
    currency: 'USD',
    photo: 'thailand-bangkok-skyline-dawn',
    summary: 'Temples, history, mountains, and Andaman Sea islands across Bangkok, Kanchanaburi, Chiang Mai, and Koh Lanta / Koh Yao.',
    practicalNote: 'Local currency is THB (Thai Baht). Domestic flights and longtail transfers require separate confirmation; no live prices are attached.',
    stops: [
      { dayOffset: 0, time: '09:30', kind: 'Activity', title: 'Grand Palace, Wat Pho & Chao Phraya River', place: 'Bangkok', note: 'Stop I · Bangkok (3 Nights). Temple dress code applies; verify river boat piers.', duration_minutes: 210 },
      { dayOffset: 3, time: '10:00', kind: 'Activity', title: 'River Kwai Bridge & Erawan Valley Train', place: 'Kanchanaburi', note: 'Stop II · Kanchanaburi (2 Nights). Riverfront sanctuary stay and historical railway route.', duration_minutes: 240 },
      { dayOffset: 5, time: '09:00', kind: 'Activity', title: 'Wat Phra Singh, Lanna Temples & 137 Pillars', place: 'Chiang Mai', note: 'Stop III · Chiang Mai (4 Nights). Old-city temples, ethical elephant sanctuary, and Thai cooking class.', duration_minutes: 240 },
      { dayOffset: 9, time: '10:30', kind: 'Activity', title: 'Four-Islands Longtail Crossing & Andaman Sunset', place: 'Koh Lanta & Phang Nga Bay', note: 'Stop IV · Andaman Islands (4 Nights). Emerald Cave, limestone karsts, and quiet coastal rest.', duration_minutes: 240 },
    ],
  },
  {
    id: 'cabo-palmilla',
    badge: 'BESPOKE ESCAPE · 5 DAYS',
    title: 'Los Cabos & One&Only Palmilla',
    destination: 'Los Cabos',
    country: 'Mexico',
    days: 5,
    defaultTravelers: 2,
    defaultBudgetCents: 450000,
    currency: 'USD',
    photo: 'bespoke-onlyandonly-palmilla-entrance',
    summary: 'Oceanfront sanctuary stays, private chef table evenings, and Sea of Cortez coastal sails.',
    practicalNote: 'Local currency is MXN (USD widely quoted at resorts; verify resort service charges and airport transfers).',
    stops: [
      { dayOffset: 0, time: '15:00', kind: 'Stay', title: 'Arrival & Oceanfront Check-In', place: 'One&Only Palmilla', note: 'Request a dated room quote including taxes and resort fees.', duration_minutes: 120 },
      { dayOffset: 1, time: '18:30', kind: 'Food', title: 'Palm Table Coastal Dinner', place: 'San Jose del Cabo', note: 'Confirm dietary preferences and private table reservation window.', duration_minutes: 150 },
      { dayOffset: 3, time: '10:00', kind: 'Activity', title: 'Sea of Cortez Yacht & Cove Morning', place: 'Los Cabos Coast', note: 'Check marine conditions and private charter availability.', duration_minutes: 180 },
    ],
  },
  {
    id: 'nepal-pokhara',
    badge: 'HIMALAYAN & LAKESIDE · 7 DAYS',
    title: 'Pokhara & Phewa Lake Sanctuary',
    destination: 'Pokhara',
    country: 'Nepal',
    days: 7,
    defaultTravelers: 2,
    defaultBudgetCents: 340000,
    currency: 'USD',
    photo: 'leisure-pokhara-phewa-lake-boats',
    summary: 'Annapurna foothill mornings, wooden boats on Phewa Lake, and unhurried valley pacing.',
    practicalNote: 'Local currency is NPR. Verify domestic air/road transfers from Kathmandu and seasonal visibility.',
    stops: [
      { dayOffset: 0, time: '14:00', kind: 'Activity', title: 'Phewa Lake Wooden Boat Crossing', place: 'Phewa Lake', note: 'Check boat hire and lakeside access.', duration_minutes: 120 },
      { dayOffset: 2, time: '06:30', kind: 'Activity', title: 'Sarangkot Dawn Ridge Viewpoint', place: 'Pokhara Valley', note: 'Early departure for Himalayan ridge views.', duration_minutes: 150 },
      { dayOffset: 4, time: '10:00', kind: 'Activity', title: 'World Peace Pagoda & Lakeside Walk', place: 'Pokhara', note: 'Confirm walking grade and ferry return.', duration_minutes: 180 },
    ],
  },
  {
    id: 'costa-rica-rainforest',
    badge: 'NATURE & WELLNESS · 6 DAYS',
    title: 'La Fortuna Rainforest & Thermal Springs',
    destination: 'La Fortuna',
    country: 'Costa Rica',
    days: 6,
    defaultTravelers: 2,
    defaultBudgetCents: 320000,
    currency: 'USD',
    photo: 'about-la-fortuna-waterfall',
    summary: 'Arenal volcano views, rainforest waterfall trails, hanging bridges, and private thermal springs.',
    practicalNote: 'Verify step counts (~500 steps at La Fortuna Waterfall) and wet-season trail conditions.',
    stops: [
      { dayOffset: 0, time: '15:00', kind: 'Stay', title: 'Rainforest Lodge Settle-In & Thermal Springs', place: 'La Fortuna', note: 'Confirm accessibility and shuttle paths on lodge grounds.', duration_minutes: 120 },
      { dayOffset: 1, time: '08:30', kind: 'Activity', title: 'La Fortuna Waterfall & Canyon Trail', place: 'La Fortuna Waterfall', note: 'Check admission and trail footwear requirements.', duration_minutes: 180 },
      { dayOffset: 3, time: '09:00', kind: 'Activity', title: 'Mistico Hanging Bridges Canopy Walk', place: 'Arenal Reserve', note: 'Book guided naturalist slot in advance.', duration_minutes: 180 },
    ],
  },
] as const;

export type ConciergeProposal = {
  reply: string;
  title: string;
  destination: string;
  start_date: string;
  end_date: string;
  currency: string;
  budget_cents: number;
  planning: Planning;
  stops: { day: string; time: string; kind: 'Activity' | 'Stay' | 'Food' | 'Transit'; title: string; place: string; note: string; duration_minutes: number }[];
  practicalNote: string;
};

export const conciergePrompts = [
  'Plan the 14-day Thailand temple & island route for 2 travelers',
  '5 days in Los Cabos at a luxury oceanfront stay under $4,500',
  '7 days in Kyoto & Tokyo in November for 2 people with $5,000 budget',
  '6 days in Lisbon for 2 travelers at a relaxed pace with $3,600',
  '6 days in La Fortuna, Costa Rica with rainforest waterfalls',
] as const;

function futureDate(daysFromNow: number, baseDate = '2026-11-15'): string {
  const d = new Date(baseDate + 'T12:00:00Z');
  d.setUTCDate(d.getUTCDate() + daysFromNow);
  return d.toISOString().slice(0, 10);
}

export function buildConciergeProposal(promptText: string, today = '2026-11-10'): ConciergeProposal {
  const clean = promptText.replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, 400);
  if (!clean) throw Error('Enter a destination or travel idea so AndyGo can draft a route.');
  const lower = clean.toLowerCase();

  // Extract requested days (2..30)
  const dayMatch = /\b(\d{1,2})\s*(?:-\s*)?(?:day|days|night|nights)\b/i.exec(clean);
  // Extract travelers (1..14)
  const travMatch = /\b(\d{1,2})\s*(?:traveler|travelers|people|persons|guests|friends|adults|pax)\b/i.exec(clean);
  const travelers = travMatch ? Math.max(1, Math.min(20, Number(travMatch[1]))) : /\bcouple\b/i.test(clean) ? 2 : /\bsolo\b/i.test(clean) ? 1 : /\bgroup\b/i.test(clean) ? 8 : 2;
  const rooms = Math.max(1, Math.ceil(travelers / 2));

  // Extract budget ($3,500 or 3500 USD/EUR/GBP)
  const budgetMatch = /(?:\$\s*(\d[\d,]{2,7})|\b(\d[\d,]{2,7})\s*(usd|eur|gbp|cad|aud|chf|mxn|sgd)\b)/i.exec(clean);
  const requestedCur = budgetMatch?.[3]?.toUpperCase() ?? (/\beur\b|€/.test(lower) ? 'EUR' : /\bgbp\b|£/.test(lower) ? 'GBP' : /\bcad\b/.test(lower) ? 'CAD' : 'USD');
  const currency = currencyOK(requestedCur) ? requestedCur : 'USD';

  // Match curated collection first
  const collection = curatedCollections.find(c =>
    lower.includes(c.destination.toLowerCase()) ||
    lower.includes(c.country.toLowerCase()) ||
    (c.id === 'cabo-palmilla' && (lower.includes('cabo') || lower.includes('palmilla') || lower.includes('mexico'))) ||
    (c.id === 'thailand-signature' && (lower.includes('bangkok') || lower.includes('chiang mai') || lower.includes('koh lanta') || lower.includes('phang nga'))),
  );

  // Or match international/domestic starter
  const starter = destinationStarters.find(s =>
    s.aliases.some(a => lower.includes(a.toLowerCase())) || lower.includes(s.city.toLowerCase()),
  );

  const days = dayMatch ? Math.max(2, Math.min(28, Number(dayMatch[1]))) : (collection?.days ?? 5);
  const start_date = futureDate(14, dateOK(today) ? today : '2026-11-10');
  const end_date = futureDate(14 + days - 1, dateOK(today) ? today : '2026-11-10');
  const allDays = daysBetween(start_date, end_date);

  const rawDollars = budgetMatch ? Number((budgetMatch[1] || budgetMatch[2]).replace(/,/g, '')) : 0;
  const budget_cents = rawDollars >= 100 && rawDollars <= 500_000
    ? rawDollars * 100
    : collection
      ? Math.round((collection.defaultBudgetCents * travelers) / collection.defaultTravelers)
      : days * travelers * 35000;

  const pace = /\bslow|relax|unhurried|easy|calm\b/i.test(lower) ? 'Relaxed' : /\bpack|fast|active\b/i.test(lower) ? 'Active' : 'Balanced';
  const destination = collection?.destination ?? starter?.city ?? (clean.length <= 45 ? clean : 'Custom Destination');
  const title = collection
    ? `${collection.title} (${days} Days)`
    : `${destination} · ${days}-Day Curated Draft`;

  const stops = collection
    ? collection.stops.map(s => ({
        day: allDays[Math.min(allDays.length - 1, s.dayOffset)] ?? start_date,
        time: s.time,
        kind: s.kind,
        title: s.title,
        place: s.place,
        note: s.note,
        duration_minutes: s.duration_minutes,
      }))
    : [
        { day: allDays[0], time: '14:00', kind: 'Stay' as const, title: `Arrive in ${destination} & Neighborhood Orientation`, place: destination, note: starter?.practicalCheck ?? 'Confirm arrival transfer and check-in window.', duration_minutes: 120 },
        { day: allDays[Math.min(1, allDays.length - 1)], time: '09:30', kind: 'Activity' as const, title: `${destination} Cultural & Landmark Morning`, place: destination, note: starter?.text ?? 'Verify timed-entry tickets and opening hours before travel.', duration_minutes: 180 },
        { day: allDays[Math.min(2, allDays.length - 1)], time: '17:30', kind: 'Food' as const, title: `Local Market & Evening Dining in ${destination}`, place: destination, note: 'Keep dietary and seating notes in your trip preferences.', duration_minutes: 120 },
      ];

  const matchingPlace = placeIdeas.find(p => p.aliases.some(a => lower.includes(a.toLowerCase())));
  const planning: Planning = {
    ...defaultPlanning(),
    travelers,
    rooms,
    pace,
    interests: collection ? ['Culture', 'Food', 'Outdoors'] : ['Culture', 'Food'],
    lines: [
      { category: 'Accommodation', label: `${destination} Stays (${days - 1} nights, quote needed)`, unit: 'room-night', amount_cents: null, source: 'User estimate', source_note: 'AI draft placeholder — request dated hotel quote before committing.', checked_at: '' },
      { category: 'Transportation', label: `Round-trip airfare & local transfers to ${destination}`, unit: 'person', amount_cents: null, source: 'User estimate', source_note: 'AI draft placeholder — verify live carrier fares.', checked_at: '' },
      ...(matchingPlace ? [{ category: 'Activities' as const, label: matchingPlace.title, unit: 'trip' as const, amount_cents: null, source: 'User estimate' as const, source_note: matchingPlace.budgetNote, checked_at: '' }] : []),
    ],
  };

  const practicalNote = collection?.practicalNote ?? starter?.practicalCheck ?? 'Costs in this draft are intentionally marked unknown until verified with suppliers or Andy.';
  const reply = `I drafted a ${days}-day ${destination} blueprint (${start_date} to ${end_date}) for ${travelers} ${travelers === 1 ? 'traveler' : 'travelers'} (${rooms} ${rooms === 1 ? 'room' : 'rooms'}, ${pace.toLowerCase()} pace) with a target ceiling of ${(budget_cents / 100).toLocaleString('en-US', { style: 'currency', currency })}. Click "Save Draft to My Trips" to open it in the Planner, or book a consultation slot with Andy below.`;

  return { reply, title, destination, start_date, end_date, currency, budget_cents, planning, stops, practicalNote };
}

export const consultationTypes = [
  { id: 'discovery-20', label: '20-Min Discovery Call', minutes: 20, summary: 'Quick introduction to align on destination ideas, dates, and travel style.' },
  { id: 'bespoke-45', label: '45-Min Bespoke Journey Session', minutes: 45, summary: 'Deep-dive planning for couples, families, or solo luxury itineraries.' },
  { id: 'group-45', label: '45-Min Group Travel Briefing (8–14 Guests)', minutes: 45, summary: 'Dedicated session for friend circles, retreats, weddings, or Thailand-style departures.' },
  { id: 'access-30', label: '30-Min Access & Care Review', minutes: 30, summary: 'Focused walkthrough of mobility, pacing, dietary, and room-layout requirements.' },
] as const;

export const consultationSlots = ['09:30', '11:00', '13:30', '15:00', '16:30'] as const;

export type ConsultationBooking = {
  id: string;
  typeId: typeof consultationTypes[number]['id'];
  typeLabel: string;
  date: string;
  time: string;
  durationMinutes: number;
  clientName: string;
  clientEmail: string;
  tripTitle: string;
  tripSummary: string;
  notes: string;
  createdAt: string;
};

export function validateConsultation(input: {
  typeId: string;
  date: string;
  time: string;
  clientName: string;
  clientEmail: string;
  tripTitle?: string;
  tripSummary?: string;
  notes?: string;
}): ConsultationBooking {
  const kind = consultationTypes.find(t => t.id === input.typeId);
  if (!kind) throw Error('Select a consultation session type.');
  if (!dateOK(input.date)) throw Error('Select a valid consultation date on the calendar.');
  if (!(consultationSlots as readonly string[]).includes(input.time)) throw Error('Select an available consultation time slot.');
  const clientName = input.clientName.replace(/[\u0000-\u001f]/g, '').trim();
  const clientEmail = input.clientEmail.replace(/[\u0000-\u001f]/g, '').trim();
  if (!clientName || clientName.length > 100) throw Error('Enter your full name (up to 100 characters).');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientEmail) || clientEmail.length > 254) throw Error('Enter a valid email address for the calendar invite.');
  const tripTitle = (input.tripTitle ?? '').replace(/[\u0000-\u001f]/g, '').trim().slice(0, 120);
  const tripSummary = (input.tripSummary ?? '').replace(/[\u0000-\u001f]/g, '').trim().slice(0, 500);
  const notes = (input.notes ?? '').replace(/[\u0000-\u001f]/g, '').trim().slice(0, 500);
  return {
    id: `consult-${input.date}-${input.time.replace(':', '')}`,
    typeId: kind.id,
    typeLabel: kind.label,
    date: input.date,
    time: input.time,
    durationMinutes: kind.minutes,
    clientName,
    clientEmail,
    tripTitle,
    tripSummary,
    notes,
    createdAt: new Date().toISOString().slice(0, 19) + 'Z',
  };
}

function escapeIcs(text: string): string {
  return text.replace(/\\/g, '\\\\').replace(/\r?\n/g, '\\n').replace(/;/g, '\\;').replace(/,/g, '\\,');
}

export function buildConsultationIcs(booking: ConsultationBooking): string {
  const startUtc = new Date(`${booking.date}T${booking.time}:00Z`);
  const endUtc = new Date(startUtc.getTime() + booking.durationMinutes * 60_000);
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
  const details = [
    `Travel Like Andy — ${booking.typeLabel}`,
    `Traveler: ${booking.clientName} (${booking.clientEmail})`,
    booking.tripTitle ? `Attached Trip Draft: ${booking.tripTitle}` : '',
    booking.tripSummary ? `Trip Blueprint: ${booking.tripSummary}` : '',
    booking.notes ? `Notes for Andy: ${booking.notes}` : '',
    'Website: https://www.travellikeandy.com/contact',
  ].filter(Boolean).join('\n');

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Travel Like Andy//AndyGo Concierge//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${booking.id}@travellikeandy.com`,
    `DTSTAMP:${fmt(new Date())}`,
    `DTSTART:${fmt(startUtc)}`,
    `DTEND:${fmt(endUtc)}`,
    `SUMMARY:${escapeIcs(`Travel Like Andy: ${booking.typeLabel}`)}`,
    `DESCRIPTION:${escapeIcs(details)}`,
    'LOCATION:https://www.travellikeandy.com/contact',
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
    '',
  ].join('\r\n');
}
