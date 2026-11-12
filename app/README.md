# Travel Like Andy mobile app (AndyGo)

> **Complete Technical Specification**: See [docs/TRAVEL_LIKE_ANDY_APP.md](../docs/TRAVEL_LIKE_ANDY_APP.md) for the master architectural, legal, database, and grounded AI documentation.

Security update, October 22, 2026: this project requires **Node 24.15.0 or a later 24.x runtime**. When the verified 24.22.1 runtime is available, prefer it and use `..\Install-SecureNode.ps1` plus `..\Use-SecureNode.ps1` or the root `Start-TravelLikeAndy.cmd`. The older system-wide Node installation can still be used if it is on the supported 24.x line. Development scripts now bind to localhost by default. See [the hardening record](../docs/SECURITY-HARDENING-2026-10-22.md) for deployment, checks and remaining advisories.

An Expo/React Native first build based on the travel app strategy brief. It is a **local planning prototype** in the website repository's `app/` folder. It does not change the live Squarespace site.

## Run

From the repository root, start the browser preview:

```powershell
cd app
npm install
npm run web -- --localhost --port 8082
```

Open http://localhost:8082 in Brave. Keep the terminal running. This preview uses SQLite in browser storage; clearing site data removes those plans. The database is specific to the browser and origin, so changing ports creates a separate storage location.

`metro.config.js` enables SQLite's WebAssembly asset and isolation headers. Any future static web host must also serve `Cross-Origin-Embedder-Policy: credentialless` and `Cross-Origin-Opener-Policy: same-origin`. Expo SQLite web support is alpha: https://docs.expo.dev/versions/v57.0.0/sdk/sqlite/.

For a production web preview without Metro:

```powershell
npm run build:web
npm run preview:web
```

Open http://localhost:8083. The preview server binds only to this computer and serves the SQLite isolation headers and WebAssembly MIME type. Keep its terminal running. This origin has separate browser data from the development preview on port 8082. This command is a local preview, not public hosting.

For native preview:

```powershell
npm install
npm start
```

Open with Expo Go on a compatible iOS or Android device. The app supports creating trips, itinerary items, a trip budget, and expense entries. Data is saved in SQLite on that device and works without connectivity. The Privacy tab can delete one trip or all local app data.

## Privacy and release boundary

The Privacy screen includes **Export backup** and **Choose backup to import**. Browser exports download a JSON file; mobile exports open the operating system save/share sheet. Imports show a review before adding trips, preserve existing trips, and roll back on a write failure. Importing a file twice creates duplicate trips. Backup files are unencrypted and include destinations, notes, and expenses; store them privately. Deleting local app data does not remove files you already exported.

- No account, backend, analytics, sync, booking search, payments, chat, third-party map, or push notifications are connected.
- Do not enter passport numbers, payment details, medical data, booking codes, or customer records. Local SQLite is not encrypted by this prototype.
- No trip data is sent to Travel Like Andy. Website buttons open the public privacy/contact pages. Exported backups remain under your control; choosing another app in the mobile share sheet sends the file to that app.
- This is **not ready for public release**. The installed Expo toolchain currently reports dependency advisories. Resolve and review those advisories, add encrypted storage and a tested privacy architecture, then complete device QA and app store compliance work before real customer use.

## Product phases

1. Validate the trip and budget flows with disposable sample data.
2. Design authentication, per-user access controls, encrypted storage, data export/deletion, and audited sync before handling customer plans.
3. Evaluate booking and flight alert providers and seller-of-travel requirements before enabling transactions or notifications.

The website remains maintained in this repository's `pages/` folder. App code here does not change the live Squarespace site.

## Starter and design options

Navigation now uses Expo Router (`src/app/_layout.tsx` and `src/app/index.tsx`), with the planner in `src/screens/Planner.tsx`. Section URLs such as `/?section=Itinerary&trip=1` support direct navigation and browser back. The CSS build uses the official `lightningcss-wasm` npm alias because the native Windows ARM64 binding is blocked by Application Control on this computer.

- Official Expo SQLite example: https://github.com/expo/examples/tree/master/with-sqlite — the closest reference for the current local trip planner. Keep this app and use that example for database patterns.
- Official Expo tabs template: https://github.com/expo/expo/tree/main/templates/expo-template-tabs — use Expo Router as screens grow; migrate incrementally rather than replacing the working planner.
- GitHub plugin is already installed for repository workflows.
- MagicPath is optional for exploring interfaces and exporting React/TypeScript components. It has been suggested but is not installed or connected, and is not required for the preview.

Browser verification: created a disposable demo trip, added an itinerary item and a $25.50 expense against a $1,000 budget, and confirmed the $974.50 balance survived a reload. TypeScript and ESLint checks pass. Dependency advisories remain; this is a local prototype, not a public release.

## Optional web offline preparation

Production web builds generate a worker for the app HTML, JavaScript, SQLite WASM, fonts and images. In Privacy, select Save offline app files while online, then close and reopen the app. This feature is not enabled automatically or in Metro development mode. The worker does not cache API responses, external sites or trip data. Remove offline app files unregisters this worker and removes its app cache while keeping the SQLite database and backup files. Offline launch, update transitions, and removal still need real-browser QA; maps are not included.

## Multi-currency expenses

Choose an expense currency in the amount form. Get reference rate makes an explicit Frankfurter request containing the currency pair, then previews the amount in the trip currency. Reference estimates can differ from card/bank rates and fees; enter the actual amount directly in the trip currency when needed. Saved expenses retain the original amount, currency, decimal rate, rate date and source. Existing converted expenses can be edited using their saved rate offline. New backups use version 3 and include trip planning preferences/cost lines; version 1 and 2 files remain importable. Currency flow interaction QA is still pending.


## Consumer companion foundation - October 21, 2026

Open `/` for the new landing page, `/create-trip` for the eight-step guest wizard, `/explore` for editorial destination ideas, and `/?section=Trips` for saved trips. Legacy section/trip URLs remain supported. `/components` is the interactive component showcase.

The wizard saves an unfinished draft on this browser/device and creates the trip/preferences atomically. Budget now separates planned costs from actual expenses. Enter costs per trip/person/day/person-day/room-night, identify their source, and adjust traveler/room counts and contingency. Missing categories remain unknown; there are no live prices. Export v3 retains this planning data. Imports of v1/v2 still work. Draft/theme settings are not part of the backup.

Light/dark theme selection is saved locally. Inter is self-hosted for web with its OFL notice; native retains a system-font fallback. Original SVG app/social concepts are in `public/`.

The repository audit, architecture, database diagram, design system, research, decisions, security, deployment and test results are in `../docs/`. Full production MVP acceptance remains open: cloud accounts/authorization, AI, licensed maps, shared editing, advisory review and broader device/offline/privacy checks are not complete. The current local storage remains unencrypted.

The preview server serves axe-core at `/__qa__/axe.min.js` for local browser audits. axe-core is a development dependency and is not imported into the app bundle.


Prepared offline launch was verified in Brave on October 21, 2026: after saving app files and reopening, the saved Budget URL reloaded with the browser network offline and retained its planned costs. Worker updates/removal, storage eviction, other browsers and physical native devices still need coverage. Full details and accessibility scan limits are in `../docs/TESTING.md`.


## One-click start

From the repository root, double-click `Start-TravelLikeAndy.cmd`. It builds when source changes, starts a background preview, and opens http://localhost:8083. Closing the launcher does not stop the app. Repeated launches reuse the running server. Alternatively run `npm run open:web` in `app/`. Node.js 24 is required. Startup logs are in ignored `app/.expo/preview-stdout.log` and `preview-stderr.log`.

The browser planner reserves its local SQLite session for one tab. A second tab waits with an explanation rather than attempting to open the same OPFS files. Use the original tab, or close it to let the waiting tab proceed. No database reset or data migration is needed for this guard.
# AndyGo brand system

The consumer app now uses the provisional AndyGo identity under Travel Like Andy. See [the brand guide](../docs/ANDYGO-BRAND.md) and [validation/change record](../docs/ANDYGO-QA.md).

Edit `brand/andygo-master.svg`, `brand/andygo-favicon-master.svg` or `brand/tokens.json`, then run `npm run brand:generate` and `npm run brand:check`. Web builds regenerate the assets automatically. The visual workshop is `/brand-preview.html`; the cross-platform component is `src/components/Brand.tsx`. AndyGo and the artwork remain subject to clearance and founder approval.

