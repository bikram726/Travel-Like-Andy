# SEO strategy — travellikeandy.com

**Written 2026-09-15.** Every finding below was measured against the live site,
not assumed. Ordered by leverage: do §1 first, it is the single biggest win.

---

## 0. What the audit actually found

| Element | Current state | Verdict |
|---|---|---|
| **Homepage `<title>`** | `travellikeandy` | **Critical.** 14 characters, no keywords, not even spaced words |
| Homepage `<h1>` | "Travel, conducted around you." | Beautiful brand copy, near-zero search value |
| Homepage word count | **~288 visible words** | Thin. Google has little to classify you on |
| Local signals | `addressLocality` 0, `addressRegion` 0, `telephone` 0, `areaServed` 0 | **Missing entirely** |
| `WebSite` schema description | **empty string** | Wasted slot |
| `TravelAgency` schema | Present, generic description, no address/phone/areaServed | Half-built |
| `/corporate` | URL says *corporate*, title says *Groups* | Mismatch |
| `/bespoke` | **Password-protected** | Flagship offering invisible to Google |
| Journal posts | *Redefine Success*, *Make Room for Growth* | Coaching copy on a travel site |

**The meta descriptions are genuinely good** — they name Andy Eisenmann, the Fora
partnership and the actual services. Whoever wrote those understood the job. The
title tags were never given the same attention.

---

## 1. Homepage title tag — fix this first

**Current:** `travellikeandy`

**Recommended:**

```
Bespoke Luxury Travel Advisor | Travel Like Andy
```

48 characters, safely inside the ~60-character display limit. Leads with what
people search, closes with the brand.

Once a service city is decided (see §7), the stronger version is:

```
Luxury Travel Advisor in [City] | Travel Like Andy
```

**Why this matters more than anything else on the page:** the title tag is the
clickable blue line in search results and one of the strongest on-page ranking
inputs. `travellikeandy` tells Google this page is about a brand nobody is
searching for yet. It cannot rank for travel terms because it does not contain
any.

### The other pages

| Page | Current title | Recommended |
|---|---|---|
| `/` | `travellikeandy` | `Bespoke Luxury Travel Advisor \| Travel Like Andy` |
| `/about` | `About — travellikeandy` | `Andy Eisenmann, Certified Fora Travel Advisor \| Travel Like Andy` |
| `/corporate` | `Groups — travellikeandy` | `Corporate & Group Travel Planning \| Travel Like Andy` |
| `/collections` | `Collections — travellikeandy` | `Small-Group Curated Departures \| Travel Like Andy` |
| `/access-and-care` | `Access & Care — travellikeandy` | `Accessible Luxury Travel Planning \| Travel Like Andy` |
| `/contact` | `Contact — travellikeandy` | `Plan Your Trip — Private Travel Inquiry \| Travel Like Andy` |
| `/journal` | `Journal — travellikeandy` | `Destination Intelligence & Travel Notes \| Travel Like Andy` |

Every one keeps the brand. None invents a claim the page does not support.

---

## 2. Homepage meta description

**Recommended (154 characters):**

```
Andy Eisenmann, Certified Fora Travel Partner, plans bespoke private trips,
small-group departures and corporate travel — designed around how you travel.
```

The existing description is already close to this. Keep the Fora credential —
it is a third-party trust signal, and those lift click-through rate.

A meta description does not directly affect ranking. It affects **whether anyone
clicks**, which is why it belongs in a conversion conversation rather than a
technical one.

---

## 3. Why "travel" alone is the wrong target

**"Travel" is not a keyword, it is a category.** Three reasons it cannot work:

**The intent is unreadable.** Someone searching *travel* might want flights, a
visa, insurance, a blog, a dictionary definition, or a job. Google cannot serve
one page that satisfies all of them, so it serves Expedia, Booking.com and
Wikipedia — brands with enormous authority and dozens of intents covered.

**The competition is structural, not beatable.** Ranking for *travel* means
outranking companies with millions of backlinks and twenty years of history. No
amount of on-page work closes that gap. It is not a hard target; it is an
unavailable one.

**It converts badly even if you win it.** A visitor searching *travel* is
nowhere near hiring a private advisor. A visitor searching *private travel
advisor for accessible luxury trips* is one decision away.

### The trade, stated plainly

| Query | Monthly demand | Realistic to rank? | Buyer intent |
|---|---|---|---|
| `travel` | Enormous | **No** | Near zero |
| `luxury travel` | Very high | **No** | Low |
| `luxury travel advisor` | Moderate | Hard, 12–18 months | High |
| `bespoke travel advisor [city]` | Low | **Yes** | **Very high** |
| `accessible luxury travel planner` | Low | **Yes** | **Very high** |
| `travel advisor for corporate retreats` | Low | **Yes** | **Very high** |

**A hundred visitors searching the last three rows are worth more than a hundred
thousand searching the first.** You are not selling a commodity at volume; you
are selling a small number of high-value relationships. You need the right
twenty people, not the most people.

---

## 4. Keyword targets, in priority order

### Tier 1 — win these first (low competition, high intent)

These are realistic for a new site within roughly 3–6 months:

- `accessible luxury travel planner`
- `travel advisor for mobility needs`
- `wheelchair accessible luxury travel`
- `travel planner for dietary restrictions`
- `private travel advisor [city]`
- `bespoke travel advisor [city]`
- `corporate retreat travel planner`
- `small group curated travel departures`

### Tier 2 — build toward (6–18 months)

- `luxury travel advisor`
- `private travel agency`
- `custom travel itineraries`
- `bespoke travel planning`
- `travel planner for couples`
- `Fora travel advisor`

### Tier 3 — do not target

- `travel`, `travel agent`, `luxury travel`, `vacation planning`

Not because they are undesirable, but because pursuing them produces no ranking
and consumes the effort Tier 1 would reward.

---

## 5. The strategic opportunity you are sitting on

**`/access-and-care` is your most valuable page and it is being treated as a
footnote.**

Accessibility in luxury travel is genuinely underserved. The searches are
specific, the intent is exceptionally high, the competition is thin, and the
people searching have usually been failed by a mainstream agent already. Someone
searching *travel advisor who understands mobility needs* is not comparison
shopping — they are looking for a person who will take it seriously.

Nobody else in this space leads with it. That is a moat, not a niche.

**Recommendation:** expand `/access-and-care` into the deepest page on the site —
1,200+ words, specific scenarios, real accommodations arranged, what the first
conversation covers. Then link it prominently from the homepage rather than
burying it in nav.

Your other real differentiators, in order of usefulness:

1. **Andy Eisenmann as a named person.** Solo advisors outrank agencies on trust.
   Personal-brand search is the one area where you start ahead.
2. **Certified Fora Travel Partner.** A verifiable third-party credential.
3. **The performing-arts background.** Genuinely distinctive and story-driven.

---

## 6. Page structure and headings

### What Google needs from a homepage

Your current `<h1>` — *"Travel, conducted around you."* — is excellent brand
copy and terrible SEO copy. **You do not have to choose.** Keep the line and
give it context:

```html
<h1>Travel, conducted around you.</h1>
<p class="tagline">Bespoke luxury travel planning and private trip design
   by Andy Eisenmann, Certified Fora Travel Partner.</p>
```

The `<h1>` keeps Andy's voice. The line beneath it tells Google what the business
is. Both audiences are served.

> **Copy caution:** Andy supplies page copy as near-verbatim requirements. Title
> tags and meta descriptions are **not** visible page copy — they are search
> surfaces, and changing them is low-risk. Changing an `<h1>` alters what
> visitors read. Run heading changes past him; run title tags yourself.

### Recommended H2 structure

Current H2s are evocative but opaque: *"I have circled the globe twice"*,
*"Four service behaviors"*. Google cannot classify a page from those.

Pair each with a plain-language descriptor:

| Keep (brand voice) | Add beneath (search legibility) |
|---|---|
| Curated Personally. | What a private travel advisor actually does |
| Where would you like to begin? | Bespoke trips, small-group departures, corporate travel |
| Four service behaviors. | How each journey is planned, advocated and accompanied |

---

## 7. Local and brand search

**You currently have no local signals at all.** No address, no region, no phone,
no `areaServed` in the structured data. For a travel advisor this is the largest
untapped source of qualified traffic.

**The single missing input is: which city or region does Andy serve from?**
Everything local depends on it and I cannot infer it from the site.

Once decided:

1. **Google Business Profile.** Free, and the fastest route to visibility for
   *travel advisor near me*. Category: *Travel Agency*. This alone often
   outperforms months of on-page work for a local service business.
2. **Add to the `TravelAgency` schema:** `addressLocality`, `addressRegion`,
   `telephone`, `areaServed`. The schema block already exists — these fields are
   simply absent.
3. **Fill the empty `WebSite` description.** It is currently an empty string.
4. **Name the region in copy** on the homepage and contact page.

**Brand search** will come to you regardless — anyone searching *Travel Like
Andy* will find you. The goal is to stop depending on it, which is what §4 Tier 1
is for.

---

## 8. Content strategy — and the journal problem

**Your journal is currently working against you.**

The four published posts are *Redefine Success*, *Small Steps Create Big Shifts*,
*Turn Intention Into Action*, *Make Room for Growth*. That is life-coaching
content on a luxury travel site. Google uses your content to decide what your
site is about, and right now the only substantial body of text on the domain is
telling it "personal development blog."

**This is a real ranking liability, not a tidiness issue.**

Two options — and note this is a content decision for Andy, not a cleanup task:

- **Preferred:** replace them with destination content. Even four genuinely
  useful posts would reclassify the site.
- **Acceptable:** keep them but publish travel content alongside, so travel
  becomes the dominant theme.

### What to publish instead

Write for Tier 1 intent, not for volume:

- *Planning an accessible trip to [destination]: what actually matters*
- *What a private travel advisor does that a booking site cannot*
- *Corporate retreat planning: the questions nobody asks until it's too late*
- *[Destination] for travellers with dietary restrictions*
- *How Fora advisor access changes what you pay and what you get*

**Depth beats frequency.** Four 1,500-word pieces that genuinely answer a
question will outperform twenty 300-word posts. One per month is a sustainable
and sufficient pace.

---

## 9. The honest timeline

The site was verified in Search Console this week. It has **no search history**.

| Window | Realistic outcome |
|---|---|
| Weeks 1–4 | Pages get indexed. Brand searches work. Little else |
| Months 2–3 | Long-tail Tier 1 phrases start appearing, positions 20–50 |
| Months 4–6 | Tier 1 reaches page one **if** content depth is addressed |
| Months 6–12 | Tier 2 becomes contestable |
| Ever | Tier 3 head terms — no |

Anyone promising faster than this on a new domain is selling something.

---

## 10. Do these in order

1. **Homepage title tag** — 5 minutes, largest single effect
2. **Remaining six title tags** — 20 minutes
3. **Unlock `/bespoke` or build a public version** — your flagship service is
   invisible to search behind a password
4. **Decide the service city** — everything local is blocked on this
5. **Google Business Profile** — free, high return for a local service business
6. **Complete the `TravelAgency` schema** — address, phone, `areaServed`; fill
   the empty `WebSite` description
7. **Expand `/access-and-care`** to 1,200+ words — biggest differentiated
   opportunity
8. **Fix the homepage word count** (~288 → 700+) with the descriptor lines in §6
9. **Resolve the journal** — travel content, or accept the miscategorisation
10. **Fix `/corporate`'s title/URL mismatch**

Items 1, 2 and 10 are pure title-tag work with no visible page change, so they
need no sign-off from Andy. Items 3, 7 and 9 are his decisions.

---

## 11. One thing that is not SEO but will cost more than any of it

`/bespoke` — the highest-value offering — is password-protected and therefore
**permanently invisible to Google**. No amount of optimisation reaches it.

If Bespoke is meant to be exclusive, keep the lock and build a **public** page
describing the service with an application route. Exclusivity and discoverability
are not in conflict; the lock should sit on the *content*, not on the *existence*
of the offer.
