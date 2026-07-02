# Travel Like Andy — Squarespace Code Blocks

Each `.html` file in `pages/` is the **entire content for one page**, meant to be pasted into a single Squarespace **Code Block** (mode: HTML) inside a blank section, per `TRAVELLIKEANDY_HANDOFF.md`.

## Files

| File | Page | Slug |
|---|---|---|
| `pages/home.html` | Home | `/` (Not Linked, reached via logo) |
| `pages/leisure.html` | Leisure | `/leisure` |
| `pages/corporate.html` | Corporate | `/corporate` |
| `pages/bespoke.html` | Bespoke (password: `LuxeAccess`) | `/bespoke` |
| `pages/about.html` | About | `/about` |
| `pages/contact.html` | Contact | `/contact` |
| `pages/global-custom-css.css` | Site-wide header/footer styling | Design → Custom CSS |
| `pages/lock-screen.html` | Bespoke password lock screen | Settings → Advanced → Code Injection → **Lock Page** (not Design → Custom CSS — the lock screen has its own separate styling system) |

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
