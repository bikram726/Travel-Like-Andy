# Research brief — taking travellikeandy.com international

**Written 2026-09-15.** What to investigate before building anything, and why
each question matters. Nothing here is a legal opinion — the legal items say who
to ask, not what the answer is.

**Andy's actual situation, which drives all of it:**

| | |
|---|---|
| Lives | Mexico (Mexico City — `+52 55` number) |
| Business base | California (`760` / `442` area codes) |
| Citizenship | US |
| Affiliation | Independent Affiliate of Fora Travel, Inc. |
| Seller of Travel | Fora's registration — CA `2151995-50`, FL `ST43973`, WA `605329242` |

---

# RESEARCH RESULTS — 2026-09-15

**The questions below were researched and answered. This section supersedes the
open questions in §1–§6; those sections are left intact as the record of what
was asked.** One of my own claims was wrong and is corrected here.

## ✗ I was wrong about Search Console country targeting

**My §6 said: "do NOT set a country target on a `.com` — it can suppress the site
in every other country."**

**That advice was based on a tool that no longer exists.** Google **retired the
International Targeting report and the country-targeting toggle in September
2022**. There is no manual override to set, so there is nothing to avoid setting.

Geographic relevance is now inferred entirely from signals the site already
emits: domain structure (`.com` is neutral; ccTLDs are the strongest signal),
`hreflang`, hosting location, and on-page cues — address, currency, phone format,
language.

**Consequence:** the `hreflang` work in §1 is not one lever among several. It is
**the** lever. Get it wrong and there is no dashboard setting to compensate.

## ⚠ Google Business Profile — this is now a decision, not a research item

**A single Service Area Business profile cannot span two countries.** Google's
guidelines explicitly prohibit adding countries as service areas; areas are
limited to cities or postal codes, and should not exceed roughly **two hours'
driving time** from the base.

Two profiles are possible but carry **duplicate-listing enforcement risk** —
consequences range from suspension of one or both to permanent removal.

**There is no clean compliant way to cover both countries with one profile.**

**Recommendation: one profile, California.** Reasons: the business is registered
there, Fora's Seller of Travel registrations are US-state registrations, and a
suspension risk on a primary listing is not worth a secondary market. **Mexico
gets served through the website, Spanish content and Instagram — not through
GBP.** Revisit only if Mexico becomes the larger revenue source.

## ⚠ Permanent establishment — the most serious finding in this document

Confirmed, and more concrete than §3 anticipated. Under the US–Mexico tax
treaty, a PE is created where a non-resident entity operates through an
individual **with authority to conclude contracts**. If Mexico's SAT finds a PE,
the US LLC becomes liable for Mexican corporate tax — **roughly 30%** — on
profits attributed to the Mexican operation, on top of US obligations.

Risk factors, and Andy matches the third outright:

- hiring Mexican employees or contractors
- renting commercial space in Mexico
- **living in Mexico full-time as the sole operating manager**

**This outranks everything else here in importance.** It is not an SEO question
and it will not be solved by reading. Buy an hour of a cross-border accountant's
time before any structural decision — and note that building Spanish-language
marketing aimed at Mexican residents is itself a fact pattern that makes the
Mexican operation look more substantive, not less.

## ✓ Weglot is viable — with a named failure mode

Squarespace still has **no native multilingual support**; a third-party tool is
required. Weglot works, but is **not automatically SEO-safe**:

- **Use subdomains or subdirectories.** Both give translated pages crawlable
  URLs. Squarespace's own guide recommends subdomains.
- **Known issue:** on Squarespace **subdomain** integrations, Weglot may fail to
  insert the complete translated path into the original page's `hreflang` tags.
- **Weglot does not create canonicals**, it only updates existing ones. The
  source page must already carry a self-referencing canonical.

**Verification requirement:** inspect the rendered source of **inner pages**, not
just the homepage, and confirm `hreflang` references are **reciprocal and
complete** in both directions. The homepage passing proves nothing about the
rest.

## ✓ Fora — commercial terms confirmed, one question still open

- Commission split **70/30** in the advisor's favour, rising to **80/20** after
  **$300,000** annual sales.
- Advisors in **150 countries**, though the model is built primarily for the US
  market.
- Registrations confirmed: California **2151995-50**, Florida **ST43973**,
  Washington.
- **Florida advisors are explicitly required to disclose Fora's SOT number in
  all advertising, including websites.**

**Still unanswered, and only Fora can answer it:** whether the Seller of Travel
text may appear in Spanish or must remain verbatim English.

**A relevant parallel surfaced during research:** under US trade-regulation
rules, where an offer is *promoted in Spanish*, required disclosures must be
provided **in the language the offer was conducted in**. That is a different
statute and not authority here — but it points toward Spanish marketing
requiring Spanish disclosure rather than exempting it. **Ask Fora; do not reason
from the parallel.**

## ✓ Spanish capability — already resolved, noted for completeness

The research restates the capacity gate as open. It was **closed on 2026-09-15**:
Andy speaks Spanish. See §4. The remaining distinction there — speaking Spanish
versus writing premium marketing copy in it — stands unchanged.

## The compliance gap is confirmed, not merely suspected

Florida's explicit "all advertising, including websites" requirement establishes
the pattern, and California's is consistent with it. The disclosure appearing
**only on `/about`** is a genuine gap.

`footer-content.html` holding a deliberate placeholder remains the correct state.
**Get the exact wording from Fora. Do not draft it.**

---

## What changed in the plan

| Item | Before | After research |
|---|---|---|
| Search Console country target | "don't set one" | **No such setting exists** — `hreflang` is the only lever |
| Google Business Profile | "research the rules" | **Decide: one profile, California** |
| Permanent establishment | "research it" | **Confirmed risk, ~30% — see an accountant first** |
| Weglot | "does it emit hreflang?" | **Yes, but verify inner pages reciprocally** |
| Fora Spanish disclosure | open | **Still open — one email, ask alongside the footer wording** |

## Revised order

1. **Cross-border accountant** — outranks all SEO work; may reshape the structure
2. **One email to Fora** — Spanish disclosure permissibility **and** exact footer wording
3. **Homepage title tag** — 5 minutes, unaffected by any of the above
4. **Sitewide Fora disclosure** — once Fora supplies the wording
5. **Google Business Profile, California only**
6. **Spanish build** — only after 1 and 2 come back clean

Items 3 and 5 are safe to do today. Item 6 is gated on the two items above it.

---

## 0. First, a strategic warning

**"Global" is the "travel" mistake at a larger scale.**

A site that targets everyone competes with everyone, in every language, against
companies with vastly more authority. Broad international targeting for a solo
advisor produces the same outcome as targeting the keyword *travel*: technically
live, practically invisible.

**But there is a real international play here, and it is specific.** Andy lives
in Mexico, banks and registers in California, and is a US citizen. That is not a
generic "global" business — it is a **US–Mexico corridor business**, and almost
nobody occupies that position credibly.

So the research below is organised around one question: *what does it take to
own the US–Mexico luxury travel corridor in two languages* — not *how do I rank
everywhere*.

---

## 1. The technical unknown: can Squarespace actually do multilingual?

**Research this first. It determines cost and feasibility for everything else.**

Squarespace has **no native multilingual support**. That is the single biggest
technical constraint on this site, and it is not obvious until you try.

Questions to answer:

- **What does Squarespace 7.1 support natively for multiple languages today?**
  Historically: nothing built in. Verify current state — this changes.
- **Weglot** is the usual answer for Squarespace. Research: pricing at this page
  count, whether it emits correct `hreflang` tags, whether translated URLs are
  crawlable and indexable (a JavaScript-only translation layer is invisible to
  Google and worthless for SEO).
- **The manual alternative:** duplicate page sets under `/es/` with `hreflang`
  injected via Code Injection HEADER. Research whether Squarespace's URL
  structure permits it cleanly.
- **`hreflang` fundamentals:** `en-US`, `es-MX`, and `x-default`. Research what
  happens when they are wrong — partial or asymmetric `hreflang` is worse than
  none.

**Decision this unlocks:** whether a Spanish version is a plugin subscription, a
manual build, or not worth doing yet.

## 2. The business unknown: what does Fora permit?

**Ask Fora directly. Do not infer this from their marketing.**

- **Territorial scope.** Can Andy sell to clients resident outside the US? Some
  host agencies restrict this by supplier contract or insurance.
- **Commission treatment** on non-US bookings and non-US clients.
- **The disclosure obligation.** Fora's Seller of Travel registration covers CA,
  FL and WA. Research: does advertising to Mexican residents create any
  obligation their registration does not cover?
- **Marketing rules.** What may Andy claim, in what languages, and is
  translated marketing subject to review?
- **Can Fora's disclosure be translated into Spanish at all**, or must the
  registration text appear verbatim in English?

That last one is a genuine blocker for a Spanish page and has no obvious answer.

## 3. The legal unknown: operating from Mexico

**This needs a cross-border accountant and probably a Mexican advisor. Research
the questions, then buy an hour of professional time — do not self-diagnose.**

- **Which entity sells?** A US LLC invoicing US clients while the principal
  resides in Mexico has tax implications in both countries. Permanent
  establishment is the term to research.
- **Does Mexico regulate travel agency services** performed from Mexican soil,
  and does it matter that the clients and the entity are American?
- **US–Mexico tax treaty**, residency tests, and where income is sourced.
- **Consumer-protection reach:** if a Spanish page markets to Mexican residents,
  does PROFECO or Mexican consumer law attach?

**Why this belongs in an SEO brief at all:** a Spanish-language page aimed at
Mexican residents is a marketing act in a second jurisdiction. Build the page
first and ask later, and the answer can force it down.

## 4. The language question — Spanish is viable, and it is not a translation job

**RESOLVED 2026-09-15: Andy speaks Spanish.** The blocking question — whether a
Spanish site would generate leads he cannot serve — is answered. It would not.
Combined with living in Mexico City, this makes the Spanish build worth doing
rather than merely worth considering.

**One distinction remains, and it is not a quibble.** Speaking Spanish with a
client and *writing premium marketing copy* in Spanish are different skills.
Luxury positioning lives or dies on register, and a fluent speaker can still
produce copy that reads as slightly-off to a native ear — which is worse on a
premium site than on an ordinary one. Andy should either write it himself with a
native editor reviewing, or brief a native writer. **Machine translation is out
of the question at this price point.**

### Do not translate the English site

This is the part that gets done wrong most often. Spanish keyword research is a
**separate exercise**, not a conversion of the English list. The clearest proof:

| English target | Literal translation | **What Mexicans actually search** |
|---|---|---|
| bespoke travel | *viaje a medida* (awkward) | **`viajes a la medida`** |
| luxury travel advisor | *consejero de viajes de lujo* (wrong register) | **`asesor de viajes de lujo`** |
| accessible travel | *viaje accesible* | **`turismo accesible`** |
| custom itinerary | *itinerario personalizado* | **`viajes personalizados`** |

*Asesor* not *consejero*. *A la medida* not *a medida*. *Turismo accesible* is
the established term in Spanish and a literal translation misses it entirely.
Translate the English list and you target phrases nobody types.

### Starting es-MX list — validate volumes before committing

Offered as a research starting point, not as verified demand. **Volumes still
need a real tool** (Google Keyword Planner set to Mexico, Spanish).

**Core service:**
- `asesor de viajes de lujo`
- `viajes a la medida`
- `viajes personalizados`
- `agencia de viajes de lujo`
- `asesor de viajes CDMX`

**Corporate — strong in Mexico:**
- `viajes de incentivo` (incentive travel is a large, established category)
- `viajes corporativos`
- `viajes de grupo empresariales`

**The accessibility moat, in Spanish:**
- `turismo accesible`
- `viajes para personas con discapacidad`
- `viajes accesibles México`

**High-intent occasion:**
- `luna de miel de lujo`
- `viajes de aniversario`

### Which Spanish

Target **`es-MX`**, not `es-ES` or generic `es`. Vocabulary and register differ
materially, and Mexico City Spanish is the market. Research the competitive
field on these terms before building — if established Mexican luxury agencies
dominate with real authority, the plan narrows to the accessibility and corridor
angles rather than the head terms.

## 5. Google Business Profile across two countries

- **Can a service-area business declare a service area spanning two countries?**
  Research GBP's rules — the base address determines the local pack, and Google
  is strict about it.
- **Which base address?** California gives US local visibility. A Mexico City
  address gives Mexican visibility. Research whether **two profiles** are
  permitted for genuinely separate locations, or whether that triggers a
  duplicate-listing penalty.
- **Verification** now generally requires video showing the premises. Research
  what that means for a location-independent advisor.

## 6. Search Console international targeting

- **International Targeting** in Search Console — research whether it still
  exists and whether it applies to a `.com` (it does not apply to ccTLDs).
- **Do NOT set a country target** on a `.com` serving two markets. Research why:
  it can suppress the site in every other country.
- Research whether **separate properties** for `/es/` paths are worth creating
  for reporting clarity.

## 7. Practical trust and conversion

- **Currency:** are prices quoted in USD, MXN, or neither? Most bespoke advisors
  quote nothing publicly — research whether that holds in the Mexican market.
- **Payment rails:** can Mexican clients pay a US entity easily? Research
  whether this is a real friction point.
- **Phone presentation:** the `+52 55` Mexico number is **not currently shown on
  the site** — `HANDOFF_NOTES.md` flags this. A Mexican client seeing only US
  numbers assumes he is not for them.
- **Time zones:** Mexico City is CST year-round; California observes DST. The
  offset changes twice a year. Research how to state availability without
  confusing either side.

## 8. Compliance gap found during this research

**Not international, but adjacent and worth closing.**

The Fora Seller of Travel disclosure — including California registration
`2151995-50` — appears **only on `/about`**. It is not in the footer and not
sitewide.

- Research California's Seller of Travel requirements on **where** the
  registration number must appear in advertising. "In advertising materials" is
  the phrase to investigate, and a website may count in full.
- `pages/footer-content.html` carries a deliberate placeholder because Andy has
  not supplied the exact required wording. **Get that wording from Fora and
  Andy.** Do not draft it — inventing affiliation or registration language is
  the one category of copy that must never be improvised.

---

## What to do in what order

| # | Research item | Blocks | Cost |
|---|---|---|---|
| 1 | Squarespace multilingual capability + Weglot | All Spanish work | Free to research |
| 2 | Fora territorial and disclosure rules | Whether any of this is permitted | One email |
| 3 | Cross-border tax / entity position | How the business is structured | ~1hr professional |
| 4 | Spanish keyword research (`es-MX`) | Whether the market is winnable | Free to research |
| 5 | Fora's exact footer disclosure wording | Closing the compliance gap | One email |
| 6 | GBP rules for two-country service areas | Local visibility | Free to research |

**Items 2 and 5 are both emails to Fora and should go in one message.**

---

## The recommendation underneath all this

Do not build a "global" site. Build a **bilingual US–Mexico corridor** site, and
only after items 1–3 come back clean.

That positioning is defensible because it describes Andy's actual life rather
than an aspiration — he lives it, which no competitor can copy by writing copy.
It is also narrow enough to rank in, which "global" never will be.

And sequence it behind the [`SEO_STRATEGY.md`](SEO_STRATEGY.md) basics. A
Spanish version of a site whose homepage title is still `travellikeandy` doubles
the pages without fixing the problem.
