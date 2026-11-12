export type ProgressiveWebpEntry = {
  id: string;
  title: string;
  location: string;
  width: number;
  height: number;
  previewDataUri: string;
  webpUrl: string;
  fallbackAssetId: string;
};

const TINY_PLACEHOLDER = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 12"><rect width="16" height="12" fill="%23e5e7eb"/></svg>';
const BASE_WEBP_URL = 'https://media.travellikeandy.com/thailand/webp';

export const thailandHotelGalleryManifest: ProgressiveWebpEntry[] = [
  { id: 'thailand-chiang-mai-137-pillars-pavilion', title: 'Morning at 137 Pillars House', location: 'Chiang Mai, Thailand', width: 960, height: 720, previewDataUri: TINY_PLACEHOLDER, webpUrl: `${BASE_WEBP_URL}/thailand-chiang-mai-137-pillars-pavilion.webp`, fallbackAssetId: 'thailand-chiang-mai-137-pillars-pavilion' },
  { id: 'thailand-kanchanaburi-river-kwai-dawn', title: 'Dawn on the River Kwai', location: 'Kanchanaburi, Thailand', width: 960, height: 720, previewDataUri: TINY_PLACEHOLDER, webpUrl: `${BASE_WEBP_URL}/thailand-kanchanaburi-river-kwai-dawn.webp`, fallbackAssetId: 'thailand-kanchanaburi-river-kwai-dawn' },
  { id: 'thailand-kanchanaburi-riverfront-pool', title: 'Riverfront Sanctuary', location: 'Kanchanaburi, Thailand', width: 960, height: 720, previewDataUri: TINY_PLACEHOLDER, webpUrl: `${BASE_WEBP_URL}/thailand-kanchanaburi-riverfront-pool.webp`, fallbackAssetId: 'thailand-kanchanaburi-riverfront-pool' },
  { id: 'thailand-koh-yao-yai-infinity-pool', title: 'Anantara Koh Yao Yai', location: 'Koh Yao Yai, Thailand', width: 960, height: 720, previewDataUri: TINY_PLACEHOLDER, webpUrl: `${BASE_WEBP_URL}/thailand-koh-yao-yai-infinity-pool.webp`, fallbackAssetId: 'thailand-koh-yao-yai-infinity-pool' },
  { id: 'thailand-koh-yao-yai-sea-suite', title: 'Suite by the Sea', location: 'Koh Yao Yai, Thailand', width: 960, height: 720, previewDataUri: TINY_PLACEHOLDER, webpUrl: `${BASE_WEBP_URL}/thailand-koh-yao-yai-sea-suite.webp`, fallbackAssetId: 'thailand-koh-yao-yai-sea-suite' },
  { id: 'thailand-koh-yao-yai-sunrise-palms', title: 'First Light on the Island', location: 'Koh Yao Yai, Thailand', width: 960, height: 720, previewDataUri: TINY_PLACEHOLDER, webpUrl: `${BASE_WEBP_URL}/thailand-koh-yao-yai-sunrise-palms.webp`, fallbackAssetId: 'thailand-koh-yao-yai-sunrise-palms' },
];

export type WebpFetcher = (url: string) => Promise<string>;

async function defaultWebpFetcher(url: string): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) throw Error(`Failed to load ${url} (${res.status})`);
  return url;
}

/** On-demand LRU cache for progressive WebP Thailand hotel gallery photos. */
export function createGalleryCache(fetcher: WebpFetcher = defaultWebpFetcher, maxEntries = 24) {
  const cache = new Map<string, string>();
  const inflight = new Map<string, Promise<string>>();

  function getCachedUri(id: string): string | null {
    const hit = cache.get(id);
    if (!hit) return null;
    cache.delete(id);
    cache.set(id, hit);
    return hit;
  }

  async function prefetchPhoto(id: string): Promise<string> {
    const entry = thailandHotelGalleryManifest.find(item => item.id === id);
    if (!entry) throw Error(`Unknown gallery photo: ${id}`);
    const hit = getCachedUri(id);
    if (hit) return hit;

    const pending = inflight.get(id);
    if (pending) return pending;

    const task = fetcher(entry.webpUrl)
      .then(uri => {
        cache.set(id, uri);
        if (cache.size > maxEntries) {
          const oldest = cache.keys().next().value;
          if (oldest !== undefined) cache.delete(oldest);
        }
        return uri;
      })
      .catch(() => entry.previewDataUri)
      .finally(() => { inflight.delete(id); });

    inflight.set(id, task);
    return task;
  }

  return {
    getCachedUri,
    prefetchPhoto,
    size: () => cache.size,
    clear: () => { cache.clear(); inflight.clear(); },
  };
}
