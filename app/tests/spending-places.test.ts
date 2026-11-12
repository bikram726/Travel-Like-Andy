import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spendingSnapshot, comparePlannedAndActualByCategory } from '../src/spending.ts';
import { defaultPlanning } from '../src/budget.ts';
import { destinationGuidance, findDestinationStarter } from '../src/international.ts';
import { placesForDestination, placeIdeas, photoForPlaceText } from '../src/places.ts';
import { createGalleryCache, thailandHotelGalleryManifest } from '../src/content/thailandGalleryCache.ts';
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';

test('spending uses only this trip, preserves cents and distinguishes an unset target', () => {
  const expenses = [{ trip_id: 1, amount_cents: 12345 }, { trip_id: 2, amount_cents: 99999 }];
  assert.deepEqual(spendingSnapshot({ id: 1, budget_cents: 20000 }, expenses), { spent: 12345, hasTarget: true, remaining: 7655, percent: 61, over: false });
  const unset = spendingSnapshot({ id: 1, budget_cents: 0 }, expenses);
  assert.equal(unset.hasTarget, false); assert.equal(unset.over, false); assert.equal(unset.percent, 0);
  const over = spendingSnapshot({ id: 1, budget_cents: 10000 }, expenses);
  assert.equal(over.over, true); assert.equal(over.remaining, -2345); assert.equal(over.percent, 100);

  const comparison = comparePlannedAndActualByCategory(
    { id: 1, start_date: '2026-11-01', end_date: '2026-11-03', budget_cents: 100000, currency: 'USD' },
    {
      ...defaultPlanning(),
      travelers: 2,
      rooms: 1,
      lines: [
        { category: 'Accommodation', label: 'Hotel', unit: 'room-night', amount_cents: 15000, source: 'User estimate', source_note: '', checked_at: '' },
        { category: 'Food', label: 'Meals', unit: 'person-day', amount_cents: 4000, source: 'User estimate', source_note: '', checked_at: '' },
      ],
    },
    [
      { trip_id: 1, category: 'Stay', amount_cents: 30000 },
      { trip_id: 1, category: 'Food', amount_cents: 8500 },
      { trip_id: 2, category: 'Food', amount_cents: 99999 },
    ],
  );
  const stayRow = comparison.find(row => row.group === 'Accommodation & Stay')!;
  assert.equal(stayRow.plannedCents, 30000);
  assert.equal(stayRow.plannedUnknown, false);
  assert.equal(stayRow.recordedCents, 30000);
  const foodRow = comparison.find(row => row.group === 'Food & Dining')!;
  assert.equal(foodRow.plannedCents, 24000);
  assert.equal(foodRow.recordedCents, 8500);
  const transportRow = comparison.find(row => row.group === 'Transportation & Local Transit')!;
  assert.equal(transportRow.plannedUnknown, true);
  assert.equal(transportRow.recordedCents, 0);
});

test('international destination guidance explains local currency, time zones, and zero-decimal currencies', () => {
  assert.equal(findDestinationStarter('Kyoto, Japan')?.localCurrency, 'JPY');
  const japanUsd = destinationGuidance('Tokyo & Kyoto, Japan', 'USD');
  assert.equal(japanUsd.matched, true);
  assert.equal(japanUsd.localCurrency, 'JPY');
  assert.equal(japanUsd.timeZone, 'Asia/Tokyo');
  assert.match(japanUsd.currencyNote, /JPY/);
  assert.match(japanUsd.currencyNote, /two-decimal minor units/);

  const lisbonUsd = destinationGuidance('Lisbon, Portugal', 'USD');
  assert.equal(lisbonUsd.localCurrency, 'EUR');
  assert.match(lisbonUsd.currencyNote, /Frankfurter reference rate/);

  const customDest = destinationGuidance('Reykjavik, Iceland', 'EUR');
  assert.equal(customDest.matched, false);
  assert.match(customDest.timeZoneNote, /local wall-clock time/);
});

test('place matching respects word boundaries, accents, and unsupported cities', () => {
  assert.equal(placesForDestination('Pokhara, Nepal')[0].id, 'phewa-lake');
  assert.equal(placesForDestination('San José del Cabo')[0].id, 'palmilla');
  for (const destination of ['Chicago', 'Zagreb', 'Indiana', '']) assert.deepEqual(placesForDestination(destination), []);
  assert.equal(photoForPlaceText('Taj Mahal, Agra')?.id, 'taj-mahal');
});

test('all supplied source images have an inventory decision and all places have real photo files', () => {
  const app = path.resolve(import.meta.dirname, '..');
  const inventory = JSON.parse(readFileSync(path.join(app, 'brand/travel-photo-inventory.json'), 'utf8'));
  assert.equal(inventory.photos.length, 39);
  for (const record of inventory.sources) assert.ok(record.output || record.excluded || record.duplicate_of, record.source);
  for (const place of placeIdeas) {
    const photo = inventory.photos.find((photo: { id: string }) => photo.id === place.photo);
    assert.ok(photo, place.id);
    assert.ok(existsSync(path.join(app, 'assets/travel', photo.file)));
  }
});

test('thailand hotel progressive WebP manifest and on-demand cache deduplicate and fall back offline', async () => {
  assert.ok(thailandHotelGalleryManifest.length >= 6);
  for (const entry of thailandHotelGalleryManifest) {
    assert.match(entry.webpUrl, /\.webp$/);
    assert.ok(entry.previewDataUri.startsWith('data:image/'));
    assert.ok(entry.fallbackAssetId.startsWith('thailand-'));
  }

  let calls = 0;
  const cache = createGalleryCache(async url => {
    calls += 1;
    return `${url}?cached=1`;
  }, 2);

  const id1 = thailandHotelGalleryManifest[0].id;
  const id2 = thailandHotelGalleryManifest[1].id;
  const id3 = thailandHotelGalleryManifest[2].id;

  const [a, b] = await Promise.all([cache.prefetchPhoto(id1), cache.prefetchPhoto(id1)]);
  assert.equal(a, b);
  assert.equal(calls, 1);
  assert.equal(cache.getCachedUri(id1), a);

  await cache.prefetchPhoto(id2);
  await cache.prefetchPhoto(id3);
  assert.equal(cache.size(), 2);
  assert.equal(cache.getCachedUri(id1), null);

  const offlineCache = createGalleryCache(async () => { throw Error('offline'); });
  const fallback = await offlineCache.prefetchPhoto(id1);
  assert.equal(fallback, thailandHotelGalleryManifest[0].previewDataUri);
  assert.equal(offlineCache.size(), 0);
});
