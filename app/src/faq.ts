// Grounded Q&A: every answer restates a fact already published on travellikeandy.com.
// Runs locally at $0 cost and optionally upgrades to Worker /api/chat (Cloudflare Workers AI / Gemini free tier).
import { LEGAL_DISCLOSURES } from './concierge.ts';

export type FaqEntry = { id: string; keywords: string[]; answer: string; source: string };

const SITE = 'https://www.travellikeandy.com';

export const faqEntries: readonly FaqEntry[] = [
  {
    id: 'group-size',
    keywords: ['group', 'groups', 'size', 'big', 'minimum', 'maximum', 'how many', 'friends', 'family', 'people', 'gather'],
    answer: 'Group journeys are built for a minimum of 8 and a maximum of 14 friends or family members. You gather the group, choose a destination, and Andy curates the journey around you.',
    source: `${SITE}/corporate`,
  },
  {
    id: 'thailand-tour',
    keywords: ['thailand', 'tour', 'itinerary', 'route', 'wisconsin', 'departure', 'bangkok', 'chiang mai', 'kanchanaburi', 'koh lanta', 'koh yao noi', 'dates', 'sold out', 'spots', '2027', 'waitlist'],
    answer: 'The first "From Wisconsin to Thailand" group departure (Oct 25 – Nov 7, 2027 for 8–14 travelers) is sold out, and upcoming 2027 departure cycles are open for interest-list inquiries. The route covers Bangkok (3 nights), Kanchanaburi (2), Chiang Mai (4), and Koh Lanta & Koh Yao Noi in the Andaman islands (4).',
    source: `${SITE}/corporate`,
  },
  {
    id: 'destinations',
    keywords: ['destination', 'destinations', 'where', 'countries', 'nepal', 'tahiti', 'mexico', 'greece', 'istanbul', 'go'],
    answer: 'Group destinations Andy loves include Thailand, Nepal, Tahiti, Hidden Mexico, Greece Mainland Coasts, and Istanbul for Beginners. Bespoke journeys are designed from places Andy has actually visited.',
    source: `${SITE}/corporate`,
  },
  {
    id: 'bespoke-services',
    keywords: ['bespoke', 'private', 'honeymoon', 'family vacation', 'cruise', 'resort', 'upgrade', 'services', 'offer', 'what do you do'],
    answer: 'Bespoke services include family vacations, honeymoons, cruises, resort stays, Fora hotel upgrades, and private access such as private dining and jet or charter coordination.',
    source: `${SITE}/bespoke`,
  },
  {
    id: 'process',
    keywords: ['process', 'how does it work', 'work', 'steps', 'start', 'begin', 'plan'],
    answer: 'Three steps: we talk (how you want to feel, not just where to go), Andy designs an itinerary from places he has visited, and you travel — Andy stays reachable across time zones for the whole journey.',
    source: `${SITE}/bespoke`,
  },
  {
    id: 'about-andy',
    keywords: ['andy', 'who', 'about', 'background', 'certified', 'fora', 'advisor', 'experience', 'performer'],
    answer: 'Andy Eisenmann came up as a concert performer and is now a Certified Fora Travel Partner. He has never planned a journey he would not take himself.',
    source: `${SITE}/about`,
  },
  {
    id: 'access-care',
    keywords: ['accessibility', 'accessible', 'mobility', 'wheelchair', 'dietary', 'allergy', 'medical', 'sensory', 'caregiver', 'disability'],
    answer: 'Mobility, dietary, sensory, and medical needs shape the plan from the first conversation — step-free access, transfer distances, rest built into the day, and caregivers planned as part of the itinerary. Discuss sensitive details directly with Andy rather than sending medical records.',
    source: `${SITE}/access-and-care`,
  },
  {
    id: 'price',
    keywords: ['price', 'cost', 'how much', 'fee', 'budget', 'expensive', 'quote', 'pay'],
    answer: 'Prices are not published. Each trip is quoted from dated supplier rates, and AndyGo drafts keep costs marked unknown until verified. Book a consultation below or use the contact form for a quote.',
    source: `${SITE}/contact`,
  },
  {
    id: 'consultation-calendar',
    keywords: ['calendar', 'schedule', 'appointment', 'appointments', 'slot', 'slots', 'time', 'times', 'availability', 'available', 'call', 'meeting', 'consultation', 'session', 'ics', 'central time'],
    answer: 'To book a session on the consultation calendar below: choose a meeting type (20-Min Discovery, 30-Min Access & Care, 45-Min Bespoke, or 45-Min Group), pick a date and Central Time slot (09:30, 11:00, 13:30, 15:00, or 16:30 CT), optionally attach a saved trip, then confirm to download your .ics calendar invite and email your brief to Andy.',
    source: `${SITE}/contact`,
  },
  {
    id: 'booking',
    keywords: ['book', 'booking', 'reserve', 'reservation', 'contract', 'confirm', 'deposit'],
    answer: LEGAL_DISCLOSURES.nonContractNotice + ' To move forward, schedule a consultation below or contact Andy directly.',
    source: `${SITE}/contact`,
  },
  {
    id: 'contact',
    keywords: ['contact', 'email', 'reach', 'talk', 'call', 'phone', 'message'],
    answer: `Use the contact form at ${SITE}/contact, email ${LEGAL_DISCLOSURES.privacyEmail}, or schedule a consultation on the calendar below.`,
    source: `${SITE}/contact`,
  },
  {
    id: 'collections',
    keywords: ['collection', 'collections', 'hosted', 'small group', 'interest list', 'upcoming', 'next trip'],
    answer: 'Hosted departures (Collections) are in interest-list mode — leave your details and Andy will reach out once the first departures are set. Andy travels each route himself first.',
    source: `${SITE}/collections`,
  },
  {
    id: 'legal',
    keywords: ['license', 'licensed', 'registered', 'registration', 'seller of travel', 'cst', 'legit', 'legal'],
    answer: `${LEGAL_DISCLOSURES.entity}. ${LEGAL_DISCLOSURES.californiaNotice} ${LEGAL_DISCLOSURES.foraRegistrations}`,
    source: `${SITE}/contact`,
  },
  {
    id: 'privacy',
    keywords: ['privacy', 'data', 'passport', 'card', 'secure', 'safe', 'stored', 'share'],
    answer: 'AndyGo keeps your trips on this device; nothing is sent unless you choose to email a consultation brief. Never include passport numbers, payment card details, or medical information in forms or notes.',
    source: LEGAL_DISCLOSURES.privacyUrl,
  },
];

const QUESTION_START = /^(what|how|when|where|who|why|which|do|does|did|is|are|can|could|will|would|should|may|tell me)\b/i;
export const isQuestion = (text: string) => text.trim().endsWith('?') || QUESTION_START.test(text.trim());

export const FAQ_FALLBACK = 'I don’t have a published answer to that yet, so I won’t guess. Ask Andy directly through the contact form or a consultation below — or describe a trip (destination, days, travelers) and I’ll draft a route.';

// Decides whether chat input is a site question or a trip-draft request.
export function routeConciergeInput(text: string): { kind: 'faq'; entry: FaqEntry } | { kind: 'fallback' } | { kind: 'draft' } {
  if (!isQuestion(text) || /\b\d{1,2}\s*-?\s*(day|days|night|nights)\b/i.test(text)) return { kind: 'draft' };
  const entry = answerQuestion(text);
  if (entry) return { kind: 'faq', entry };
  return /\b(plan|trip|itinerary|draft|route)\b/i.test(text) ? { kind: 'draft' } : { kind: 'fallback' };
}

export function answerQuestion(text: string): FaqEntry | null {
  const lower = ` ${text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ')} `;
  let best: FaqEntry | null = null, bestScore = 0;
  for (const entry of faqEntries) {
    // Whole-word/phrase matches only, so "go" does not match "good"; multi-word phrases weigh more.
    const score = entry.keywords.reduce((sum, k) => sum + (lower.includes(` ${k} `) ? k.split(' ').length : 0), 0);
    if (score > bestScore) { best = entry; bestScore = score; }
  }
  return best;
}

export async function askRemoteChat(
  message: string,
  fetchImpl: typeof fetch | undefined = typeof window !== 'undefined' && typeof globalThis.fetch === 'function' ? globalThis.fetch.bind(globalThis) : undefined,
): Promise<{ answer: string; provider: string } | null> {
  const clean = message.replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, 400);
  if (!clean || !fetchImpl) return null;
  try {
    const res = await fetchImpl('/api/chat', {
      method: 'POST',
      credentials: 'omit',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: clean }),
    });
    if (!res.ok) return null;
    const data = await res.json() as { answer?: unknown; provider?: unknown };
    if (typeof data?.answer !== 'string' || !data.answer.trim()) return null;
    return {
      answer: data.answer.trim().slice(0, 1500),
      provider: typeof data.provider === 'string' ? data.provider : 'free-tier-ai',
    };
  } catch {
    return null;
  }
}
