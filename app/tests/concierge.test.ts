import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildConciergeProposal,
  buildConsultationIcs,
  curatedCollections,
  validateConsultation,
} from '../src/concierge.ts';
import { validatePlanning } from '../src/budget.ts';

test('buildConciergeProposal parses Thailand, Cabo, and custom prompts into valid trip blueprints', () => {
  const thailand = buildConciergeProposal('Plan the 14-day Thailand temple & island route for 4 travelers under $9,200', '2026-11-10');
  assert.equal(thailand.destination, 'Thailand');
  assert.equal(thailand.start_date, '2026-11-24');
  assert.equal(thailand.end_date, '2026-12-07');
  assert.equal(thailand.budget_cents, 920_000);
  assert.equal(thailand.planning.travelers, 4);
  assert.equal(thailand.planning.rooms, 2);
  assert.equal(thailand.stops.length, 4);
  assert.doesNotThrow(() => validatePlanning(thailand.planning));
  assert.ok(thailand.planning.lines.every(line => line.amount_cents === null));

  const lisbon = buildConciergeProposal('6 days in Lisbon for 2 people at a relaxed pace with 3600 EUR', '2026-11-10');
  assert.equal(lisbon.destination, 'Lisbon');
  assert.equal(lisbon.currency, 'EUR');
  assert.equal(lisbon.budget_cents, 360_000);
  assert.equal(lisbon.planning.pace, 'Relaxed');
  assert.equal(lisbon.stops.length, 3);

  assert.throws(() => buildConciergeProposal('   '), /Enter a destination/);
  assert.ok(curatedCollections.length >= 4);
});

test('validateConsultation and buildConsultationIcs enforce valid appointment fields and RFC 5545 output', () => {
  const booking = validateConsultation({
    typeId: 'group-45',
    date: '2026-11-20',
    time: '11:00',
    clientName: 'Alex Morgan',
    clientEmail: 'alex@example.com',
    tripTitle: 'From Wisconsin to Thailand (14 Days)',
    tripSummary: 'Thailand (2026-11-24 to 2026-12-07) · Target 6800 USD',
    notes: 'Group of 10 friends from Wisconsin',
  });
  assert.equal(booking.durationMinutes, 45);
  assert.equal(booking.id, 'consult-2026-11-20-1100');

  const ics = buildConsultationIcs(booking);
  assert.match(ics, /^BEGIN:VCALENDAR\r\n/);
  assert.match(ics, /DTSTART:20261120T110000Z\r\n/);
  assert.match(ics, /DTEND:20261120T114500Z\r\n/);
  assert.match(ics, /SUMMARY:Travel Like Andy: 45-Min Group Travel Briefing \(8–14 Guests\)\r\n/);
  assert.match(ics, /Attached Trip Draft: From Wisconsin to Thailand/);

  assert.throws(() => validateConsultation({
    typeId: 'invalid',
    date: '2026-11-20',
    time: '11:00',
    clientName: 'Alex',
    clientEmail: 'alex@example.com',
  }), /consultation session type/);

  assert.throws(() => validateConsultation({
    typeId: 'discovery-20',
    date: '2026-02-30',
    time: '11:00',
    clientName: 'Alex',
    clientEmail: 'alex@example.com',
  }), /valid consultation date/);

  assert.throws(() => validateConsultation({
    typeId: 'discovery-20',
    date: '2026-11-20',
    time: '11:00',
    clientName: 'Alex',
    clientEmail: 'not-an-email',
  }), /valid email address/);
});
