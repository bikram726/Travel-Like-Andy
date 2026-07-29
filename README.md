# Travel Like Andy — Squarespace Code Blocks

Each `.html` file in `pages/` is the **entire content for one page**, meant to be pasted into a single Squarespace **Code Block** (mode: HTML) inside a blank section, per `TRAVELLIKEANDY_HANDOFF.md`.

## Files

| File | Page | Slug |
|---|---|---|
| `pages/home.html` | Home | `/` (Not Linked, reached via logo) |
| `pages/leisure.html` | Leisure | `/leisure` |
| `pages/groups.html` | Groups (replaces the old Corporate/Executive page 2026-07-29 per the Brand Bible — see `travel-like-andy-brand-bible` memory) | Likely still `/corporate` unless the Squarespace page slug is changed — reuse the existing page's Code Block and just retitle the nav label to "Groups", rather than creating a new page, to avoid breaking the existing URL |
| `pages/bespoke.html` | Bespoke (password: `LuxeAccess`) | `/bespoke` |
| `pages/about.html` | About | `/about` |
| `pages/contact.html` | Contact | `/contact` |
| `pages/group.html` | OLD "Group" family-travel placeholder — doesn't map to any page in the Brand Bible's new site map (added 2026-07-29); fate undecided, see `travel-like-andy-brand-bible` memory | `/group` (page does not exist yet, needs creating) |
| `pages/gallery.html` | Gallery (placeholder, ready for Slides embed) — also doesn't map to the new site map; fate undecided | `/gallery` (page does not exist yet, needs creating) |
| `pages/collections.html` | Collections — new page added 2026-07-29 per the Brand Bible (Hosted Departures). Bare-bones placeholder, deliberately not built out further — no real "current journeys" content exists yet | `/collections` (page does not exist yet, needs creating) |
| `pages/global-custom-css.css` | Site-wide header/footer styling | Design → Custom CSS |
| `pages/lock-screen.html` | Bespoke password lock screen + fixed nav bar | Settings → Advanced → Code Injection → **Lock Page** (not Design → Custom CSS — the lock screen has its own separate styling system) |
| `pages/header-injection.html` | Site-wide `<head>` injection (contains legacy content — see below) | Settings → Advanced → Code Injection → **HEADER** (a 5th, separate injection location — different from Lock Page, Design → Custom CSS, and any page's Code Block) |

## How to publish a page

1. Open the page in Squarespace, click the existing Code Block → **Edit**.
2. Select all, delete, paste the full contents of the corresponding file.
3. Save. Scroll the full page afterward to confirm no leftover/duplicate Beacon sections exist below the block (recurring issue noted in the handoff doc).
4. Scripts show "embedded scripts disabled" in the editor — that's expected; they run on the published site.

## How to publish the lock screen

`pages/lock-screen.html` does **not** go in a Code Block or Design → Custom CSS — Squarespace's password lock screen has its own separate styling system.

1. Squarespace dashboard → **Settings → Advanced → Code Injection**.
2. Find the **Lock Page** field (separate from Header/Footer).
3. Paste the full contents of `pages/lock-screen.html` in there and save.
4. Visit `/bespoke` in a private/incognito window (so you're not already unlocked) to see it live.

## How to publish the header injection

`pages/header-injection.html` also does **not** go in a Code Block — it's injected into every page's `<head>`, site-wide.

1. Squarespace dashboard → **Settings → Advanced → Code Injection**.
2. Find the **HEADER** field (separate from Footer, and separate from the Lock Page field used for the lock screen).
3. Paste the full contents of `pages/header-injection.html` in there and save.

**Discovered 2026-07-24, not created by this repo's authors originally:** this field already contained legacy content before it was ever added to this repo — a pre-dating, likely-superseded attempt at styling the Bespoke lock screen via generic Squarespace password-page selectors (superseded by the more targeted `pages/lock-screen.html`), plus a stale sunset-photo hero design for Home that was actively fighting the current Home hero via `!important` (this part *was* the cause of a real bug — Home's hero rendered with the wrong photo and washed-out text until this was found and removed), plus two "gap fix" `min-height`/`padding` overrides for the Corporate and Leisure heroes that aren't currently causing visible problems. The stale Home-hero block has been removed from the tracked file below; the other three are preserved as-is (not yet verified safe to remove) — see comments inline in the file for details on each. If you ever change `.tlac-hero` or `.tlal-hero`'s `min-height`/`padding` directly in `pages/corporate.html` / `pages/leisure.html`, remember these overrides will still apply on top.

## What changed from the original handoff doc

- Leisure, Corporate, Bespoke, About, and Contact were previously only described in prose ("rebuild from this spec if missing"). They are now fully built out as complete, self-contained code blocks matching the locked design system, copy rules, and Andy's real facts.
- Added a lightweight `IntersectionObserver` scroll-reveal (vanilla JS, no dependencies, respects `prefers-reduced-motion`) on each page for a more premium, less static feel.
- Contact page uses its own `tlact-` class prefix instead of reusing `tlac-` (which Corporate already uses) to avoid any future style bleed if blocks are ever combined.
- All copy follows the strict rules: no prices, no banned words (buy/price/book now/etc.), uses "journey/experience/curated/by invitation."

## Still outstanding (from Andy)

- Real bio text for About (currently placeholder bio from his known facts).
- Real photos to replace Unsplash placeholders (Istanbul/Bosphorus shot, Luxembourg panorama, hotel suite, portrait of Andy).
- Corporate + Bespoke logo variants (currently letter marks on Home).
- Publish + point DNS per the handoff doc's DNS section.

## Logo placement (completed)

1. **Footer logo (main):** Squarespace → Edit any page → scroll to Footer → Add Block → Image → upload `logo-main-transparent.png` → size to ~200px tall → center → Save. Footer is site-wide.
2. **Header logo:** Hidden via `global-custom-css.css` (`.header-title-logo { display: none !important; }`) so the footer logo is the only logo. Home page link now replaces the header logo.
3. **Bespoke lock-screen logo:** currently a gold Cormorant Garamond text wordmark ("Bespoke") rather than an image — a deliberate bridge (see the comment above `.tlab-lock-logo` in `pages/lock-screen.html`) since no dedicated `logo-bespoke-transparent.png` exists yet. Swap it for a real `<img>` once Andy provides that asset. The lock screen file goes in **Settings → Advanced → Code Injection → Lock Page**.

## Client revision checklist (2026-07-04 call)

Full nav should read: **Home, Leisure, Executive, Group, Bespoke, About, Gallery** on every page. Split into what's done in code vs. what needs doing directly in Squarespace admin (page/nav structure isn't stored in these files — only page content and site-wide CSS/JS are).

### Done in code (this repo)

- Lock screen now has a real fixed nav bar (`pages/lock-screen.html`) so visitors on the Bespoke password screen are never stuck with only the browser Back button. This was the actual fix for "I can't click anywhere to go back home" — Squarespace's lock screen never shows the site header by platform design (confirmed via their docs), so the nav had to be injected directly into the Lock Page code slot instead.
- Confirmed the *unlocked* Bespoke page already shows the normal header fine (it's a regular page, not a Cover Page) — nothing else needed there.
- Home page card renamed "Corporate & Group Travel" → "Executive Travel" to match the new nav naming.
- Footer logo enlarged via CSS (`global-custom-css.css`) regardless of whatever size it was dragged to in the editor.
- `pages/group.html` and `pages/gallery.html` added as bare-bones placeholders (heading + CTA only) — deliberately not designed further per "don't build placeholder content," pending the client's Saturday materials.

### Needs doing in Squarespace admin (not code — page/nav structure lives there)

- **Add "Home" as a real nav item.** It currently sits under "Not Linked" in the Pages panel. Move/link it into Main Navigation as the first item, labeled "Home".
- **Rename the nav label** "Corporate & Group Travel" → "Executive" (Pages panel → click the page → rename the navigation title; this doesn't need to change the URL slug).
- **Create the Group page** in Main Navigation at slug `/group`, then paste `pages/group.html` into its code block.
- **Create the Gallery page** in Main Navigation at slug `/gallery`, then paste `pages/gallery.html` into its code block.
- **Footer text**: replace the current "© 2026 Travel Like Andy. All rights reserved." with exactly `Travel Like Andy LLC` (only the T in Travel capitalized, "Like Andy" normal case, "LLC" all caps).
- **Footer block order**: drag the logo Image Block above the text block so the logo sits above "Travel Like Andy LLC".
- Once Group/Executive page slugs are finalized, double check the links in `pages/lock-screen.html`'s nav bar (`/corporate`, `/group`, `/gallery`) match the real slugs — update here if any slug ends up different.

### Waiting on client

- Saturday: landing page content, offers, marketing copy, password-protected page content.
- Once Group content arrives, decide whether "Small Group Tours" and any other group-oriented cards move from the Executive page (`pages/corporate.html`) into `pages/group.html`.
- Confirm the single dedicated landing page the Bespoke password should lead to (client wants one password → one destination page, no extra pages in between) — currently password leads straight to `pages/bespoke.html` itself, which already satisfies this unless the new Saturday content changes that.
