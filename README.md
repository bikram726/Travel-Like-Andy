# Travel Like Andy — Squarespace Code Blocks

Each `.html` file in `pages/` is the **entire content for one page**, meant to be pasted into a single Squarespace **Code Block** (mode: HTML) inside a blank section, per `TRAVELLIKEANDY_HANDOFF.md`.

## Files

| File | Page | Slug |
|---|---|---|
| `pages/home.html` | Home | `/` (Not Linked, reached via logo) |
| `pages/leisure.html` | Leisure | `/leisure` |
| `pages/corporate.html` | Executive (nav label renamed; file/slug still say "corporate") | `/corporate` |
| `pages/bespoke.html` | Bespoke (password: `LuxeAccess`) | `/bespoke` |
| `pages/about.html` | About | `/about` |
| `pages/contact.html` | Contact | `/contact` |
| `pages/group.html` | Group (bare-bones placeholder — real content pending) | `/group` (page does not exist yet, needs creating) |
| `pages/gallery.html` | Gallery (placeholder, ready for Slides embed) | `/gallery` (page does not exist yet, needs creating) |
| `pages/global-custom-css.css` | Site-wide header/footer styling | Design → Custom CSS |
| `pages/lock-screen.html` | Bespoke password lock screen + fixed nav bar | Settings → Advanced → Code Injection → **Lock Page** (not Design → Custom CSS — the lock screen has its own separate styling system) |

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
3. **Bespoke lock-screen logo:** Replace the placeholder `src` in `pages/lock-screen.html` line 114 with the actual Squarespace CDN URL for `logo-bespoke-transparent.png`. The lock screen file goes in **Settings → Advanced → Code Injection → Lock Page**.

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
