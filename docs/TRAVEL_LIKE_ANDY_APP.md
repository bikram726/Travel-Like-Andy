# AndyGo · Travel Like Andy Companion App (`TRAVEL_LIKE_ANDY_APP.md`)

Comprehensive technical, architecture, clean-room reverse-engineering, design, audit, and Antigravity operating specification for the [**Travel Like Andy**](https://www.travellikeandy.com/about) mobile and web application (**AndyGo** / `app/`).

## 1. Executive Summary, Brand Identity & Antigravity Workspace

**AndyGo** is the local-first travel planning companion for [**Travel Like Andy**](https://www.travellikeandy.com/) (`travellikeandy.com`), curated by former classical conductor and Certified Fora Travel Partner Andy Eisenmann ([About — travellikeandy](https://www.travellikeandy.com/about)). Developed and maintained inside your Antigravity IDE and Windows PowerShell workflow (`C:\Users\bikra\OneDrive\Github Repos\Travel-Like-Andy`), the application bridges Andy's boutique luxury travel advisory practice with an offline-capable, privacy-respecting digital ecosystem for bespoke clients, group travelers, and hosted departures.

### 1.1 Brand Positioning & Regulatory Guardrails

- **Operating Entity**: `travellikeandy LLC · CST 2174880-50` *(Registration as a seller of travel does not constitute approval by the State of California)* ([travellikeandy Homepage](https://www.travellikeandy.com/)).
- **Fora Host Agency Affiliations**: Operating as an independent affiliate of [Fora Travel, Inc.](https://www.insightpartners.com/portfolio/fora/) under California Registration No. `2151995-50`, Florida Seller of Travel Registration No. `ST43973`, and Washington UBI `605329242` ([About — travellikeandy](https://www.travellikeandy.com/about)).
- **Core Advisory Pillars**: *Anticipate, Advocate, Curate, Accompany* ([travellikeandy Homepage](https://www.travellikeandy.com/)).
- **Three Product Tracks**: *Bespoke* (private one-on-one journeys), *Groups* (friends, weddings, and corporate retreats), and *Collections* (small-group hosted departures led or endorsed by Andy Eisenmann) ([travellikeandy Homepage](https://www.travellikeandy.com/)).
- **Signature Phrase**: *"Curated Personally."*
- **Provisional Trademark Note**: The `AndyGo` application name is provisional pending formal mark clearance; the production fallback title is `Travel Like Andy Companion`.
- **Forbidden Brand Vocabulary**: Never use `"bucket list"`, `"book now"`, `"hidden gem"`, `"dream vacation"`, `"inner circle"`, or `"by invitation only"`. Andy's tone is warm, deliberate, direct, and unhurried.
- **No Virtuoso Affiliation**: [**Travel Like Andy**](https://www.travellikeandy.com/about) operates exclusively through [Fora Travel, Inc.](https://www.insightpartners.com/portfolio/fora/); never cite Virtuoso or unauthorized consortia in static source files (`docs/security-evidence/scan-source.cjs`) or LLM-generated concierge responses (`sanitizeLlmOutput`).

## 2. Clean-Room Reverse-Engineering Blueprint & Ecosystem Synthesis

Because no single commercial application unites high-touch luxury advisor curation with peer-to-peer group planning and offline multi-currency accounting, **AndyGo** (`app/`) is architected as a clean-room composite. It models **[Tern](https://tern.travel/advisors)** as the primary 70% structural and editorial foundation while grafting the highest-utility consumer patterns from **[Wanderlog](https://play.google.com/store/apps/details?id=com.wanderlog.android&hl=en)**, **[Splitwise](https://apps.apple.com/us/app/splitwise/id458023433)**, **[TripIt](https://apps.apple.com/us/app/tripit-travel-planner/id311035142)**, **[Tripsy](https://apps.apple.com/us/app/tripsy-travel-planner/id1429967544)**, and **[TripRelay](https://triprelay.app/faq)** (30%).

| AndyGo Module (`app/src/`) | Reference Platform Reverse-Engineered | Adopted UI/UX & Functional Mechanics | Competitor Bottleneck Resolved by AndyGo |
| :--- | :--- | :--- | :--- |
| **`app/src/app/index.tsx` & `app/src/content/`** | **[Tern for Travelers](https://help.tern.travel/en/articles/8451099-tern-for-travelers-mobile-app-overview)**, **[Fora Traveler App](https://apps.apple.com/us/app/fora-the-traveler-app/id6747694436)** & **[Vamoos](https://www.vamoos.com/for-travel-companies/tailormade/)** | Editorial trip storyboards, countdown timers, one-tap day-picker navigation, side-by-side [Option Blocks](https://help.tern.travel/en/articles/9449562-5-previewing-your-itineraries), and zero-login luxury client handoff ([Vamoos Itinerary Overview](https://www.vamoos.com/why-all-tour-operators-need-an-itinerary-management-app/)). | Replaces read-only advisor viewers ([Fora on Google Play](https://play.google.com/store/apps/details?id=com.foratravel.app&hl=en)) and paid B2B SaaS seats ([Tern Pricing](https://tern.travel/pricing)) with a free, interactive local-first SQLite companion. |
| **`app/src/itinerary.ts` & `PlaceIdeas.tsx`** | **[Wanderlog](https://play.google.com/store/apps/details?id=com.wanderlog.android&hl=en)** & **[AXUS Travel App](https://play.google.com/store/apps/details?id=com.axustravelapp.axus)** | Sequential `morning / afternoon / evening` day slots, unscheduled Place Ideas buckets, and transit/confirmation notes ([AppStoryOrg Wanderlog Overview](https://www.appstory.org/app-submission/wanderlog-travel-planner/)). | Delivers 100% free offline access via `expo-sqlite` / `wa-sqlite` OPFS rather than gating offline mode behind a paid Pro tier ([Stardrift 2026 Comparison](https://stardrift.ai/resources/travel-apps-organize-a-trip)) or splitting web/mobile logins ([AXUS Support FAQ](https://support.axustravelapp.com/hc/en-us/articles/23945879174811-Understanding-the-Difference-Between-AXUS-Website-and-AXUS-App-Logins)). |
| **`app/src/budget.ts`, `TripWizard.tsx` & `currency.ts`** | **[Splitwise](https://apps.apple.com/us/app/splitwise/id458023433)** | Multi-currency expense tracking, `person-days` and `room-nights` cost allocations, category pace gauges, and `calculateGroupSettlement` (`equal | room | personal`). | Eliminates [Splitwise's 4-expense-per-day free limit and ads](https://bilt.me/apps/splitwise) while fetching keyless European Central Bank reference rates via [Frankfurter](https://frankfurter.dev/v1/). |
| **`app/src/calendar.ts` & Confirmation Vault** | **[TripIt](https://apps.apple.com/us/app/tripit-travel-planner/id311035142)**, **[Tripsy](https://apps.apple.com/us/app/tripsy-travel-planner/id1429967544)** & **[Travefy Trip Plans](https://travefy.com/products/trip-plans-app)** | Chronological reservation timeline, offline voucher notes, and RFC 5545 `.ics` calendar synchronization ([TripNoted TripIt Guide](https://tripnoted.com/guides/tripit-free-vs-pro); [Tripsy for Web](https://tripsy.app/web)). | Keeps reservation data inside local SQLite storage without requiring full cloud inbox read permissions ([AreUGlobe Comparison](https://areuglobe.com/blog/globe-vs-wanderlog-vs-tripit)). |
| **`PlaceIdeas.tsx` (v2 Consensus Engine)** | **[TripRelay](https://triprelay.app/faq)** & **[Tern Group Travel Suite](https://tern.travel/blog/group-launch)** | Zero-account room join, `option_group_id` comparison blocks, 4-direction group voting (`super_yes`, `yes`, `no`, `opt_out`), and geographic day-coherence pacing for 8–14 person groups ([TripRelay Newsroom](https://triprelay.app/news)). | Unifies group voting directly inside the native/web itinerary and budget app instead of forcing travelers onto a separate web-only voting tool ([TripRelay Group Apps Comparison](https://triprelay.app/blog/best-group-trip-planning-apps)). |
| **`app/src/concierge.ts`, `faq.ts` & `worker/index.js`** | **[Tern AI Assist](https://help.tern.travel/en/articles/9274873-introduction-to-tern-s-ai-assist-feature)** | Grounded advisory Q&A, itinerary guidance, and one-tap advisor consultation handoff (`webmaster@travellikeandy.com`). | Runs on a zero-cost 4-tier failover (Local Rule Engine -> Cloudflare Workers AI `@cf/meta/llama-3.1-8b-instruct` -> Google Gemini Flash -> Local Suggestion) with client/edge PII redaction, per-IP rate limiting (`20 req/hr`), and `sanitizeLlmOutput`. |

## 3. Architecture & Technology Matrix

### 3.1 Core Technology Stack

- **Application Framework**: `Expo SDK 57` (`expo-router` file-based routing and `@react-navigation`), `React Native 0.86`, and `React 19`.
- **Language & Type Safety**: `TypeScript` (`strict: true`, `tsc --noEmit` passing with `0` errors) using modern ES modules and deterministic unit testing (`71/71` test suite passing across `205` scanned source files).
- **Local Storage Engine**: `expo-sqlite` providing native SQLite persistence on iOS and Android, paired with `wa-sqlite` WebAssembly (WASM) backed by the Origin Private File System (OPFS) lock and `DatabaseTabGate.web.tsx` (`BroadcastChannel('andygo_opfs_lock')` + `navigator.locks`) on Web.
- **Design System & Accessibility**: Custom design tokens (`app/src/themeColors.ts`, `app/src/global.css`) supporting system Light and Dark modes with verified WCAG AA `4.5:1` contrast compliance and editorial typography aligned with [**travellikeandy.com**](https://www.travellikeandy.com/).
- **Browser Security & Isolation Headers**:
  - `Cross-Origin-Embedder-Policy: credentialless`
  - `Cross-Origin-Opener-Policy: same-origin`
  - `Content-Security-Policy`: Restricts script execution and permits `'wasm-unsafe-eval'` strictly for WASM SQLite initialization.
- **External Network Endpoints**:
  - **Foreign Exchange Reference Rates**: [Frankfurter API](https://frankfurter.dev/v1/) (`https://api.frankfurter.dev`), serving open-source [European Central Bank reference rates](https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html) with no API keys, no quotas, and zero user tracking ([Frankfurter GitHub Repository](https://github.com/lineofflight/frankfurter)).
  - **Edge AI Concierge**: `POST /api/chat` hosted on Cloudflare Workers (`sites/travellikeandy-demo/worker/index.js`, committed at `6fd7b60`) with free-tier `@cf/meta/llama-3.1-8b-instruct` (`10,000 Neurons/day`), Google Gemini Flash fallback, `isRateLimited` (`20 req/hr` per IP returning `HTTP 429`), and `sanitizeLlmOutput`.

## 4. Core Screens & Feature Modules (`app/src/`)

### 4.1 Trip Dashboard & Overview (`app/src/app/index.tsx`)

- **Multi-Trip Summary Cards**: Displays active and upcoming journeys with destination headers, ISO date ranges, live trip countdowns, and active base currency indicators (inspired by [Tern for Travelers](https://help.tern.travel/en/articles/8451099-tern-for-travelers-mobile-app-overview)).
- **Real-Time Budget vs. Expenditure Gauge**: Computes live spend against planned budgets with per-category visual breakdowns across `Lodging`, `Transit`, `Dining`, `Activities`, and `Sundries`.
- **Single-Tap Quick Actions**: Provides instant routing to the sequential Itinerary Builder, Expense Logger, and AI Concierge.

### 4.2 Trip Wizard, Cost Architect & Group Settlement (`app/src/screens/TripWizard.tsx`, `app/src/budget.ts`)

- **Configurable Allocation Units**: Models solo, couple, and group budgets using `person-days`, `room-nights`, per-night lodging targets, and custom daily allowances.
- **Dynamic Pace Calculator**: Evaluates daily burn rates against remaining trip days to alert travelers before category overruns occur.
- **Multi-Currency Capture & Rate Locking**: Converts foreign-currency expenses in real time via [Frankfurter](https://frankfurter.dev/v1/) while storing both `amount_base` and `fx_rate_locked` so non-USD base budgets never drift offline.
- **Group Expense Settlement (`calculateGroupSettlement`)**: Supports `equal`, `room`, and `personal` split modes alongside `paid_by` tracking so 8–14 person groups settle balances offline without [Splitwise's](https://bilt.me/apps/splitwise) 4-expense/day paywall.

### 4.3 Itinerary, Option Blocks & 4-Way Group Voting (`app/src/itinerary.ts`, `app/src/components/PlaceIdeas.tsx`)

- **Sequential Day Planner**: Supports drag-and-drop and sort-ordered stops across `morning`, `afternoon`, `evening`, and `custom` time slots with transit notes and confirmation references (modeling [Wanderlog](https://play.google.com/store/apps/details?id=com.wanderlog.android&hl=en)).
- **Option Blocks & 4-Way Consensus**: Supports item `status` (`idea | option | confirmed`), `option_group_id` for competing lodging/activity choices ([Tern Option Blocks](https://help.tern.travel/en/articles/9449562-5-previewing-your-itineraries)), and 4-way `vote_state` (`super_yes | yes | no | opt_out`) with serialized `vote_tally_json` ([TripRelay](https://triprelay.app/faq)).
- **Pre-Loaded Thailand Signature Tour (`thailand-signature`)**: Ships with a grounded Thailand itinerary covering **Bangkok**, **Chiang Mai**, **Chiang Rai**, **Phuket**, and **Koh Yao Noi** (featured on [**travellikeandy.com**](https://www.travellikeandy.com/)), complete with ethical wildlife sanctuary guidelines, temple dress codes, and domestic transit notes.

### 4.4 AI Concierge & Grounded Q&A (`app/src/concierge.ts`, `app/src/faq.ts`)

- **14 Grounded FAQ Knowledge Bases**:
  1. **Group Sizes**: Exact `8–14` traveler thresholds for intimate group pacing on *Groups* and *Collections* departures.
  2. **Thailand Tour Status**: Updated for 2027 departure cycles (following the sold-out March 2026 benchmark) and active waitlist policies.
  3. **Featured Destinations**: Thailand (Koh Yao Noi, Bangkok, Chiang Mai, Chiang Rai, Phuket), India (Agra / Taj Palace Delhi), Mexico (Mexico City, Cabo San Lucas), Japan, Italy, Spain, and France ([travellikeandy Homepage](https://www.travellikeandy.com/)).
  4. **Bespoke Advisory Services**: Multi-tier planning fees and [Fora Travel](https://www.insightpartners.com/portfolio/fora/) partner hotel perks (room upgrades, daily breakfast, property credits).
  5. **3-Step Planning Process**: `Discovery -> Curation -> Concierge Execution` aligned with *Anticipate, Advocate, Curate, Accompany*.
  6. **Andy's Background**: Classical conductor and performer who sang opera for the King of Thailand and hiked the Himalayas before founding [**travellikeandy**](https://www.travellikeandy.com/about).
  7. **Pacing & Accessibility**: Unhurried schedules, vetted boutique properties, and tailored mobility accommodations.
  8. **Pricing Philosophy**: Transparent advisory fees, zero hidden wholesale markups, and direct supplier receipts.
  9. **Booking Policies & No-Contract Notice**: Explicit disclosure that app inquiries and cost estimates are non-binding exploratory requests.
  10. **Contact Details**: Direct routing to `webmaster@travellikeandy.com` and consultation scheduling.
  11. **Curated Collections**: *Food & Wine*, *Cultural Heritage*, *Natural Sanctuary*, and *Train & River* departures.
  12. **Legal & CST Licensing**: `travellikeandy LLC · CST 2174880-50` and [Fora Travel, Inc.](https://www.insightpartners.com/portfolio/fora/) state registrations (`CA 2151995-50 · FL ST43973 · WA UBI 605329242`).
  13. **Privacy & Storage**: Local-first SQLite architecture with zero cloud accounts, zero telemetry, and no data sale.
  14. **Consultation Scheduling**: `20-minute Discovery`, `30-minute Route Review`, and `45-minute Bespoke Planning` slots in Central Time (`America/Chicago`).
- **4-Stage Free-Tier Failover**: Automatically cascades from `Client Deterministic Rule Engine -> Cloudflare Workers AI (@cf/meta/llama-3.1-8b-instruct) -> Google Gemini Flash -> Local Rule Suggestion`.
- **PII, Rate Limiting & Brand Guardrails**: Client and edge regex filters strip email addresses, phone numbers, passport numbers, and payment card digits prior to network transmission; `isRateLimited` enforces `20 req/hr` per IP (`HTTP 429`); and `sanitizeLlmOutput` scrubs any forbidden vocabulary before returning responses.

### 4.5 Consultation Appointment Generator (`app/src/calendar.ts`, `app/src/concierge.ts`)

- **Time-Slot Picker**: Supports `20-min Discovery`, `30-min Route Review`, and `45-min Bespoke Planning` sessions at `09:30`, `11:00`, `13:30`, `15:00`, and `16:30` Central Time (`America/Chicago`).
- **Target-Date CST/CDT Conversion (`centralTimeToUtc`)**: Evaluates the exact UTC offset (`-06:00` Standard vs. `-05:00` Daylight) for the target appointment date across `America/Chicago` DST boundaries to generate RFC 5545 compliant `.ics` calendar invitations.
- **Email Handoff (`buildConsultationMailtoUrl`)**: Launches the traveler's default mail client pre-addressed to `webmaster@travellikeandy.com` with structured trip parameters.

### 4.6 Curated Collections & LRU Cloud Media Cache (`app/src/content/`, `app/src/content/thailandGalleryCache.ts`)

- **Bundled Baseline Assets**: Ships with 12 high-resolution, EXIF-sanitized photography assets covering Bangkok temples, Chiang Mai night bazaars, and Andaman coastlines to mirror `pages/groups.html`.
- **Progressive WebP Manifest & LRU Cache (`thailandGalleryCache.ts`)**: Implements `thailandHotelGalleryManifest` and `createGalleryCache` for on-demand LRU fetching with offline fallback, connecting to your cloud archives in [Travel Like Andy - Thailand Hotels (New Photos)](https://drive.google.com/drive/folders/101VPttf7sb3ZbJQn6vTMeIc_gIntWIEO) (housing the 291 Thailand hotel photos indexed in [Travel Like Andy - New Thailand Hotels Photos (Access & Reference)](https://docs.google.com/document/d/1SOXTi5UEJi_6HK4P_e7Ha_YZ33GRYtB5ohkYYs1G9Go/edit?usp=drivesdk&ouid=112310536313329761687)), [Travel Like Andy - Website Photos](https://drive.google.com/drive/folders/1T101itDQ1IUpVDDUyDA7kfPhnGTJ6lcO), and [Travel Like Andy REBRAND w Bikram](https://drive.google.com/drive/folders/1tbv35i0VVi_YpTRc2qt0uR98fT8YjplV) (including [TAJ PALACE DELHI.jpeg](https://drive.google.com/file/d/1UJXDU-mFC55E37QqNDHvG950xB6BoreX/view?usp=drivesdk), [Pokhara2.jpeg](https://drive.google.com/file/d/1JS4pBUnTJYQldRsygWu4ds8odFhE62fZ/view?usp=drivesdk), and [HiltonReformaView.jpeg](https://drive.google.com/file/d/1N3QJBdCwlb6OxnZzW8XevlxbwVKQiyvH/view?usp=drivesdk)).

## 5. Database Schema (`app/src/migrations.ts`, `app/src/data.ts`)

### 5.1 Active v2 Relational Schema (`applyV2Migration` — 71/71 Tests Passing)

```sql
-- Enforced on every expo-sqlite / wa-sqlite connection initialization
PRAGMA foreign_keys = ON;

-- 1. Trips table: Root entity for travel plans
CREATE TABLE IF NOT EXISTS trips (
  id TEXT PRIMARY KEY NOT NULL,
  title TEXT NOT NULL,
  destination TEXT NOT NULL,
  start_date TEXT NOT NULL, -- ISO-8601 YYYY-MM-DD
  end_date TEXT NOT NULL,   -- ISO-8601 YYYY-MM-DD
  base_currency TEXT NOT NULL DEFAULT 'USD',
  budget_total REAL NOT NULL DEFAULT 0.0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

-- 2. Plan Items table: Day-by-day stops, Option Blocks, 4-way voting & LWW tombstones
CREATE TABLE IF NOT EXISTS plan_items (
  id TEXT PRIMARY KEY NOT NULL,
  trip_id TEXT NOT NULL,
  day_index INTEGER NOT NULL,
  time_slot TEXT, -- 'morning' | 'afternoon' | 'evening' | 'custom'
  title TEXT NOT NULL,
  notes TEXT,
  location_name TEXT,
  estimated_cost REAL DEFAULT 0.0,
  currency TEXT DEFAULT 'USD',
  sort_order INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'confirmed', -- 'idea' | 'option' | 'confirmed'
  option_group_id TEXT,
  vote_state TEXT DEFAULT 'yes', -- 'super_yes' | 'yes' | 'no' | 'opt_out'
  vote_tally_json TEXT DEFAULT '{}',
  updated_at INTEGER NOT NULL DEFAULT 0,
  deleted_at INTEGER, -- NULL = active, epoch ms = soft-deleted tombstone
  FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
);

-- 3. Expenses table: Multi-currency spend, locked FX, group splits & LWW tombstones
CREATE TABLE IF NOT EXISTS expenses (
  id TEXT PRIMARY KEY NOT NULL,
  trip_id TEXT NOT NULL,
  plan_item_id TEXT,
  category TEXT NOT NULL, -- 'lodging' | 'transit' | 'dining' | 'activity' | 'sundry'
  amount REAL NOT NULL,
  currency TEXT NOT NULL,
  amount_usd REAL NOT NULL,
  amount_base REAL NOT NULL DEFAULT 0.0,
  fx_rate_locked REAL NOT NULL DEFAULT 1.0,
  paid_by TEXT NOT NULL DEFAULT 'Primary',
  split_mode TEXT NOT NULL DEFAULT 'equal', -- 'equal' | 'room' | 'personal'
  expense_date TEXT NOT NULL,
  notes TEXT,
  updated_at INTEGER NOT NULL DEFAULT 0,
  deleted_at INTEGER,
  FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE,
  FOREIGN KEY (plan_item_id) REFERENCES plan_items(id) ON DELETE SET NULL
);

-- 4. Trip Planning Metadata table: Unit cost allocations & LWW timestamp
CREATE TABLE IF NOT EXISTS trip_planning (
  trip_id TEXT PRIMARY KEY NOT NULL,
  traveler_count INTEGER NOT NULL DEFAULT 1,
  room_count INTEGER NOT NULL DEFAULT 1,
  lodging_target_per_night REAL NOT NULL DEFAULT 0.0,
  daily_allowance_per_person REAL NOT NULL DEFAULT 0.0,
  updated_at INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
);

-- 5. App Settings table: Key-value app configuration & cache
CREATE TABLE IF NOT EXISTS app_settings (
  key TEXT PRIMARY KEY NOT NULL,
  value TEXT NOT NULL,
  updated_at INTEGER NOT NULL
);
```

## 6. Sync, Backup Engine & Obsidian Export (`app/src/sync/`, `app/src/backup.ts`)

- **Backup Export Format (v3 JSON)**:
  - Serializes full relational state across `trips`, `plan_items`, `expenses`, `trip_planning`, and `app_settings`.
  - Normalizes all floating-point currency values via `normalizeCurrencyFloat` prior to hashing so ARM64 mobile and Web WASM compute identical `SHA-256` integrity checksum headers.
  - Strips session secrets and transient UI filters prior to export.
- **Import & Merge Policy (`app/src/sync/policy.ts`)**:
  - Executes deterministic row-level Last-Write-Wins (LWW) conflict resolution comparing `updated_at` timestamps and honoring `deleted_at` tombstones so deleted stops or expenses never resurrect on merge.
  - Validates all foreign keys (`trip_id` and `plan_item_id`) inside a single atomic SQLite transaction before committing.
- **Web OPFS Multi-Tab Contention Coordinator (`app/src/components/DatabaseTabGate.web.tsx`)**:
  - Combines `BroadcastChannel('andygo_opfs_lock')` with `navigator.locks` to coordinate concurrent browser tabs before acquiring OPFS synchronous file handles, preventing uncaught `NoModificationAllowedError` crashes on Web.
- **Local File & Obsidian Export (`docs/OBSIDIAN_AND_SYNC.md`)**:
  - Generates clean Markdown itinerary and expense ledgers formatted for Obsidian, Notion, or Apple Notes with mandatory Seller of Travel compliance footers.

## 7. Legal, Regulatory & Compliance Framework

| Disclosure Field | Verified Statutory & Registration Detail |
| :--- | :--- |
| **Operating Entity** | `travellikeandy LLC` ([travellikeandy Homepage](https://www.travellikeandy.com/)) |
| **California Seller of Travel** | `CST 2174880-50` ([About — travellikeandy](https://www.travellikeandy.com/about)) |
| **Statutory Notice** | *"Registration as a seller of travel does not constitute approval by the State of California."* |
| **Host Agency Affiliation** | Independent Affiliate of [Fora Travel, Inc.](https://www.insightpartners.com/portfolio/fora/) |
| **Host Agency Registrations** | California `2151995-50` · Florida `ST43973` · Washington UBI `605329242` |
| **Direct Advisory Contact** | `webmaster@travellikeandy.com` |

### 7.1 Strict Compliance Invariants

1. **No-Contract Notice**: Every consultation request, `.ics` invite, and trip cost estimate generated inside **AndyGo** includes explicit wording that requests are non-binding exploratory proposals rather than executed seller-of-travel contracts.
2. **Zero-Knowledge Privacy**: Zero telemetry SDKs, analytics trackers, session replay scripts, or third-party advertising tags are bundled in the app.
3. **Single-Click Data Portability & Wipe**: Travelers can export full v3 JSON backups or permanently wipe local SQLite / OPFS storage in one tap.

## 8. Antigravity Swarm Execution Log, Build & CI/CD Pipeline

### 8.1 Completed Antigravity v2 Swarm Commits & Verification Status

| Swarm Track | Commit Hash | Merged Implementation Scope | Verification Result |
| :--- | :--- | :--- | :--- |
| **`docs`** | `1d77dfa` | Updated `docs/TRAVEL_LIKE_ANDY_APP.md` with clean-room reverse-engineering blueprint, Google Drive media links, v2 SQLite migration spec, and 3-sprint roadmap. | Passed (`scan-source.cjs`) |
| **`schema-sync`** | `4c795d3` | Added `applyV2Migration` (`PRAGMA foreign_keys = ON`, v2 columns on `plan_items`, `expenses`, `trip_planning`), `normalizeCurrencyFloat`, row-level LWW tombstones, and `DatabaseTabGate.web.tsx`. | Passed (`tsc --noEmit` & Jest) |
| **`edge-dst`** | `d35a38c` / `6fd7b60` | Updated Thailand FAQ for 2027 departures, added Koh Yao Noi to `thailand-signature`, hardened `centralTimeToUtc` across CST/CDT, and added `sanitizeLlmOutput` + `isRateLimited` (`20 req/hr`) in `worker/index.js`. | Passed (`tsc --noEmit` & Jest) |
| **`group-parity`** | `8dbf125` | Added Option Blocks & 4-way voting to `PlaceIdeas.tsx`, `calculateGroupSettlement` (`equal | room | personal`) to `budget.ts`, and `thailandGalleryCache.ts` LRU manifest fetcher. | Passed (`71/71` unit tests, `205` files scanned, `0` findings) |

### 8.2 Final Production Build, Browser Smoke-Test & Git Push Commands (PowerShell)

```powershell
# 1. Activate the hardened Node 24.x environment in your Travel-Like-Andy repo
. .\Use-SecureNode.ps1

# 2. Build the standalone web production bundle (skipped by swarm) and preview on port 8082
Set-Location app
npm run build:web
node scripts/preview-web.cjs --port 8082
# -> Open two tabs at http://localhost:8082 to smoke-test DatabaseTabGate.web.tsx OPFS lock handoff

# 3. Push the nested Cloudflare Worker demo repository (committed locally at 6fd7b60)
Set-Location ..\sites\travellikeandy-demo
git status
git push

# 4. Return to root Travel-Like-Andy repository and push merged swarm commits (1d77dfa..8dbf125)
Set-Location ..\..
node docs/security-evidence/scan-source.cjs
git status
git push
```

## 9. Complete Repository Directory Map

| File / Path | Purpose & Primary Responsibility |
| :--- | :--- |
| `app/src/app/index.tsx` | Main trip dashboard screen, multi-trip summary cards, and category budget gauge. |
| `app/src/screens/TripWizard.tsx` | Interactive trip setup wizard for `person-days`, `room-nights`, and daily allowances. |
| `app/src/screens/Concierge.tsx` | AI Concierge interface, grounded FAQ chat, and consultation slot selector. |
| `app/src/itinerary.ts` | Sequential day-by-day planner logic, sort ordering, and pre-loaded `thailand-signature` tour (Bangkok, Chiang Mai, Chiang Rai, Phuket, Koh Yao Noi). |
| `app/src/components/PlaceIdeas.tsx` | Unscheduled Place Ideas bucket, drag-and-drop promotion, `option_group_id` Option Blocks, and 4-way group voting UI (`super_yes | yes | no | opt_out`). |
| `app/src/components/DatabaseTabGate.web.tsx` | Web OPFS multi-tab coordination gate using `BroadcastChannel('andygo_opfs_lock')` and `navigator.locks`. |
| `app/src/budget.ts` | Cost architect calculations, daily burn-rate pace alerts, and `calculateGroupSettlement` (`equal | room | personal`). |
| `app/src/currency.ts` | Live FX fetching via [Frankfurter](https://frankfurter.dev/v1/) (`api.frankfurter.dev`) with locked offline rate fallback (`fx_rate_locked`). |
| `app/src/concierge.ts` | Deterministic rule engine, consultation payload builder, and `centralTimeToUtc` DST-aware helpers. |
| `app/src/faq.ts` | 14 grounded FAQ knowledge bases (updated for 2027 cycles) and edge chat client with PII redaction. |
| `app/src/calendar.ts` | RFC 5545 `.ics` invitation builder with target-date CST/CDT offset resolution and `buildConsultationMailtoUrl`. |
| `app/src/migrations.ts` & `app/src/data.ts` | SQLite DDL schema definitions, `PRAGMA foreign_keys = ON`, and `applyV2Migration` runner. |
| `app/src/sync/policy.ts` | Deterministic row-level Last-Write-Wins (LWW) merge engine, `deleted_at` tombstone handling, and foreign-key validator. |
| `app/src/backup.ts` | v3 JSON serializer/deserializer with `normalizeCurrencyFloat` and `SHA-256` checksum verification. |
| `app/src/content/thailandGalleryCache.ts` | `thailandHotelGalleryManifest` and `createGalleryCache` LRU on-demand media fetcher with offline fallback. |
| `sites/travellikeandy-demo/worker/index.js` | Cloudflare Worker edge proxy (`6fd7b60`) running `@cf/meta/llama-3.1-8b-instruct`, Gemini Flash fallback, PII scrubber, `isRateLimited` (`20 req/hr`), and `sanitizeLlmOutput`. |
| `docs/OBSIDIAN_AND_SYNC.md` | Local-first sync specification, OPFS multi-tab handling, and Obsidian Markdown export guide. |
