# AndyGo · Travel Like Andy Companion App

Comprehensive technical, architecture, design, and operating specification for the Travel Like Andy mobile & web application (**AndyGo** / `app/`).

---

## 1. Executive Summary & Brand Identity

**AndyGo** is the local-first travel planning companion for **Travel Like Andy** ([travellikeandy.com](https://travellikeandy.com)). It bridges Andy's boutique luxury travel advisory practice with an offline-capable, privacy-respecting digital tool for independent and guided travelers.

### 1.1 Brand Positioning & Guardrails
- **Operating Entity**: `travellikeandy LLC · CST 2174880-50` *(Registration as a seller of travel does not constitute approval by the State of California)*.
- **Fora Host Agency Affiliations**: CA `2151995-50` · FL `ST43973` · WA UBI `605329242`.
- **Core Advisory Pillars**: *Anticipate, Advocate, Curate, Accompany*.
- **Signature Phrase**: *"Curated Personally."*
- **Provisional Trademark Note**: The `AndyGo` application name is provisional pending formal mark clearance; fallback is `Travel Like Andy Companion`.
- **Forbidden Brand Vocabulary**: Never use `"bucket list"`, `"book now"`, `"hidden gem"`, `"dream vacation"`, `"inner circle"`, or `"by invitation only"`. Andy's tone is warm, deliberate, direct, and unhurried.
- **No Virtuoso Affiliation**: Travel Like Andy operates through Fora Travel; never cite Virtuoso or unauthorized consortia.

---

## 2. Architecture & Technical Stack

```
+------------------------------------------------------------------------+
|                          AndyGo Application Layer                      |
|      (React Native 0.86 · React 19 · TypeScript 5.9 · Expo SDK 57)     |
+------------------------------------------------------------------------+
           |                                             |
           v (Mobile Native)                             v (Web / Desktop)
+-----------------------+                 +------------------------------+
|     Native SQLite     |                 |   WASM SQLite (wa-sqlite)    |
| (expo-sqlite on iOS/  |                 |     Origin Private File      |
|       Android)        |                 |      System (OPFS) Lock      |
+-----------------------+                 +------------------------------+
           |                                             |
           +----------------------+----------------------+
                                  |
                                  v
+------------------------------------------------------------------------+
|                     Local-First Data & Privacy Core                    |
|  - Zero account requirement      - Zero analytics or tracking pixels   |
|  - Strict local SQLite storage   - Client-side AES-256 backup support  |
|  - PII scrubbing on exports      - Frankfurter only for foreign fx     |
+------------------------------------------------------------------------+
                                  |
                 +----------------+----------------+
                 | (Optional Grounded AI Fallback) |
                 v                                 v
+----------------------------------+ +----------------------------------+
|    Cloudflare Workers AI         | |     Google Gemini Flash          |
| @cf/meta/llama-3.1-8b-instruct   | |   (Grounded FAQ answering        |
|  (10,000 Neurons/day free tier)  | |    PII redacted client & edge)   |
+----------------------------------+ +----------------------------------+
```

### 2.1 Technology Matrix
- **Framework**: Expo Router 57 (`expo-router` / `@react-navigation`), React Native 0.86, React 19.
- **Languages**: TypeScript (`strict: true`), modern ES modules.
- **Storage Engine**: `expo-sqlite` (native SQLite on iOS/Android; `wa-sqlite` WASM with OPFS lock on web).
- **Styling**: Tailored design tokens (`app/src/themeColors.ts`, `app/src/global.css`) supporting system Light & Dark modes, WCAG AA 4.5:1 contrast compliance.
- **Security Isolation**:
  - `Cross-Origin-Embedder-Policy: credentialless`
  - `Cross-Origin-Opener-Policy: same-origin`
  - Content Security Policy (CSP) permitting `'wasm-unsafe-eval'` strictly for WASM SQLite.
- **External Network Endpoints**:
  - FX Rates: `https://api.frankfurter.dev` (Open source European Central Bank data; no API keys, no user tracking).
  - Edge Backend: `POST /api/chat` (Cloudflare Worker with Workers AI / Gemini Flash).

---

## 3. Core Screens & Feature Modules

### 3.1 Trip Dashboard & Overview (`app/src/app/index.tsx`)
- Multi-trip summary cards displaying destinations, trip dates, countdown, and active currency.
- Real-time total expenditure vs. planned budget gauge with per-category breakdowns (Lodging, Transit, Dining, Activities, Sundries).
- Single-tap quick navigation to itinerary builder, expense logger, and AI Concierge.

### 3.2 Trip Wizard & Cost Architect (`app/src/screens/TripWizard.tsx`, `app/src/budget.ts`)
- Configurable cost units: `person-days`, `room-nights`, and custom allowances.
- Dynamic daily spending targets and pace calculators alerting travelers before budget overruns occur.
- Multi-currency expense capture with live Frankfurter conversion and manual lock-in rates.

### 3.3 Itinerary & Place Ideas (`app/src/itinerary.ts`, `app/src/components/PlaceIdeas.tsx`)
- Drag-and-drop / sequential day planner supporting timed stops, transfer routes, and confirmation notes.
- Grounded Thailand starter tour (Bangkok, Chiang Mai, Chiang Rai, Phuket) pre-loaded with curated stops, ethical sanctuary guidelines, and transit notes.

### 3.4 AI Concierge & Grounded Q&A (`app/src/concierge.ts`, `app/src/faq.ts`)
- **14 Grounded FAQ Knowledge Bases**:
  1. *Group Sizes*: Exact 8–14 traveler thresholds for intimate pacing.
  2. *Thailand Tour Status*: Sold out (March 2026 departure); waitlist policy.
  3. *Featured Destinations*: Thailand, Japan, Italy, Spain, France, and bespoke custom routes.
  4. *Bespoke Advisory Services*: Multi-tier planning fees and Fora hotel booking benefits.
  5. *3-Step Planning Process*: Discovery -> Curation -> Concierge Execution.
  6. *Andy's Background*: Personal story, culinary & cultural focus, independent advisory.
  7. *Pacing & Accessibility*: Leisurely pace, luxury accommodations, mobility assistance.
  8. *Pricing Philosophy*: Transparent fees, no marked-up wholesale rates, direct supplier receipts.
  9. *Booking Policies & No-Contract Notice*: Inquiries are exploratory non-binding requests.
  10. *Contact Details*: Direct email `webmaster@travellikeandy.com` and phone booking.
  11. *Curated Collections*: Food & Wine, Cultural Heritage, Natural Sanctuary, Train & River.
  12. *Legal & CST Licensing*: `travellikeandy LLC · CST 2174880-50` and Fora registrations.
  13. *Privacy & Storage*: Local-first SQLite, no cloud accounts, no data sale.
  14. *Consultation Scheduling*: 20/30/45-minute slots in Central Time (`America/Chicago`).
- **Free-Tier Edge Fallback**: Automatic failover from client rule engine -> Cloudflare Workers AI (`@cf/meta/llama-3.1-8b-instruct`) -> Google Gemini Flash -> Local rule suggestion.
- **PII Guardrail**: Client & worker regex filtering strips emails, phone numbers, and passport/card numbers before edge submission.

### 3.5 Consultation Appointment Generator (`app/src/calendar.ts`)
- Consultation time-slot picker: 20-min Discovery, 30-min Route Review, or 45-min Bespoke Planning.
- Supported times: `09:30, 11:00, 13:30, 15:00, 16:30` Central Time (`America/Chicago`), converting reliably to UTC across Standard (CST) and Daylight (CDT) periods.
- Generates RFC 5545 compliant `.ics` calendar invitation files downloadable directly in browser or native calendar app.
- Pre-filled email handoff button (`buildConsultationMailtoUrl`) launching the user's default mail client addressed to `webmaster@travellikeandy.com`.

### 3.6 Curated Collections & Thailand Photo Gallery (`app/src/content/`)
- 12 high-resolution, EXIF-sanitized photography assets documenting Bangkok temples, Chiang Mai night bazaars, and Andaman coastlines.
- Paired side-by-side design mirroring the web portfolio on `pages/groups.html`.

---

## 4. Database Schema (SQLite)

Local relational storage managed by `app/src/migrations.ts`:

```sql
-- Trips table: Root entity for travel plans
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

-- Plan Items table: Day-by-day stops and activities
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
  FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
);

-- Expenses table: Logged out-of-pocket and pre-paid expenses
CREATE TABLE IF NOT EXISTS expenses (
  id TEXT PRIMARY KEY NOT NULL,
  trip_id TEXT NOT NULL,
  plan_item_id TEXT,
  category TEXT NOT NULL, -- 'lodging' | 'transit' | 'dining' | 'activity' | 'sundry'
  amount REAL NOT NULL,
  currency TEXT NOT NULL,
  amount_usd REAL NOT NULL,
  expense_date TEXT NOT NULL,
  notes TEXT,
  FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
);

-- Trip Planning Metadata table: Unit cost allocations
CREATE TABLE IF NOT EXISTS trip_planning (
  trip_id TEXT PRIMARY KEY NOT NULL,
  traveler_count INTEGER NOT NULL DEFAULT 1,
  room_count INTEGER NOT NULL DEFAULT 1,
  lodging_target_per_night REAL NOT NULL DEFAULT 0.0,
  daily_allowance_per_person REAL NOT NULL DEFAULT 0.0,
  FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
);

-- App Settings table: Key-value app configuration & cache
CREATE TABLE IF NOT EXISTS app_settings (
  key TEXT PRIMARY KEY NOT NULL,
  value TEXT NOT NULL,
  updated_at INTEGER NOT NULL
);
```

---

## 5. Sync & Backup Engine (`app/src/sync/`, `app/src/backup.ts`)

- **Backup Export Format (v3 JSON)**:
  - Full relational serialization of trips, plan items, expenses, and settings.
  - SHA-256 integrity checksum header.
  - Strips session secrets and transient UI filters.
- **Import & Merge Policy (`app/src/sync/policy.ts`)**:
  - Deterministic conflict resolution: Last-Write-Wins based on ISO timestamps.
  - Foreign key verification ensuring orphaned expenses or items cannot corrupt database state.
- **Local File & Obsidian Export**:
  - Optional Markdown itinerary export designed for Obsidian, Notion, or Apple Notes (`docs/OBSIDIAN_AND_SYNC.md`).

---

## 6. Legal, Regulatory & Compliance Framework

```
+-------------------------------------------------------------------------+
|                  LEGAL & CONSUMER PROTECTION DISCLOSURES                |
+-------------------------------------------------------------------------+
| Operating Entity:    travellikeandy LLC                                 |
| California Seller:   CST 2174880-50                                     |
| Statutory Notice:    "Registration as a seller of travel does not       |
|                      constitute approval by the State of California."   |
| Host Agency:         Fora Travel Inc.                                   |
| Other Registrations: Florida ST43973 · Washington UBI 605329242         |
| Direct Contact:      webmaster@travellikeandy.com                       |
+-------------------------------------------------------------------------+
```

### 6.1 Strict Compliance Invariants
1. **No-Contract Notice**: Every consultation request and trip estimate generated inside AndyGo contains clear wording that requests are exploratory proposals, not an executed seller-of-travel contract.
2. **Zero-Knowledge Privacy**: No telemetry, analytics SDKs, session recording tools, or commercial tracking tags are included in the bundle.
3. **Data Portability**: Users can wipe all local storage with a single click or export complete encrypted JSON backups at any time.

---

## 7. Build, Verification, & CI/CD Pipeline

### 7.1 Local Development Commands
```powershell
# 1. Use the hardened Node 24.x environment
. .\Use-SecureNode.ps1

# 2. Enter app directory and run type safety & unit tests
Set-Location app
npm run typecheck
npm test

# 3. Build standalone web production bundle
npm run build:web

# 4. Preview local bundle with correct security headers
node scripts/preview-web.cjs --port 8082
```

### 7.2 GitHub Actions Pipeline (`.github/workflows/security.yml`)
1. **Typecheck & Test**: Validates 65+ unit tests across currency, calendar, SQLite migrations, and FAQ logic.
2. **Security & PII Audit**: Runs `node docs/security-evidence/scan-source.cjs` verifying no API secrets, forbidden tokens, or insecure protocols exist.
3. **Artifact Deployment**: Bundles `app/dist-web` into `andygo-web-dist` with a 14-day retention cycle.

---

## 8. Directory Map & Relevant Files

| File / Path | Purpose & Responsibility |
| :--- | :--- |
| [app/src/app/index.tsx](file:///c:/Users/bikra/OneDrive/Github%20Repos/Travel-Like-Andy/app/src/app/index.tsx) | Main dashboard screen, trip cards, budget overview. |
| [app/src/screens/Concierge.tsx](file:///c:/Users/bikra/OneDrive/Github%20Repos/Travel-Like-Andy/app/src/screens/Concierge.tsx) | Interactive AI concierge, grounded FAQ chat, consultation booking. |
| [app/src/concierge.ts](file:///c:/Users/bikra/OneDrive/Github%20Repos/Travel-Like-Andy/app/src/concierge.ts) | Rule engine, consultation payload builder, Central Time UTC conversions. |
| [app/src/faq.ts](file:///c:/Users/bikra/OneDrive/Github%20Repos/Travel-Like-Andy/app/src/faq.ts) | 14 grounded knowledge bases, edge chat client with PII redaction. |
| [app/src/calendar.ts](file:///c:/Users/bikra/OneDrive/Github%20Repos/Travel-Like-Andy/app/src/calendar.ts) | RFC 5545 `.ics` file builder with CST/CDT Central Time awareness. |
| [app/src/migrations.ts](file:///c:/Users/bikra/OneDrive/Github%20Repos/Travel-Like-Andy/app/src/migrations.ts) | SQLite database DDL and schema migration runner. |
| [app/src/currency.ts](file:///c:/Users/bikra/OneDrive/Github%20Repos/Travel-Like-Andy/app/src/currency.ts) | Multi-currency conversions via Frankfurter API with offline fallback. |
| [sites/travellikeandy-demo/worker/index.js](file:///c:/Users/bikra/OneDrive/Github%20Repos/Travel-Like-Andy/sites/travellikeandy-demo/worker/index.js) | Cloudflare Worker edge host with free-tier Workers AI / Gemini chat. |
| [docs/OBSIDIAN_AND_SYNC.md](file:///c:/Users/bikra/OneDrive/Github%20Repos/Travel-Like-Andy/docs/OBSIDIAN_AND_SYNC.md) | Sync protocol, Obsidian export guide, local file storage specs. |
