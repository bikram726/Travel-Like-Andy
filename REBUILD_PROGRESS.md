# Rebuild Progress — Brand Bible v1.0

**Environment: Branch B.** No Next.js project exists — this is a Squarespace 7.1
site where every page's content is a single self-contained HTML/CSS/JS fragment
in `pages/*.html`, pasted directly into a Squarespace Code Block. That "paste-
ready deliverable set" already *is* this repo's established convention (see
`README.md`), so this rebuild continues using `pages/*.html` directly rather than
introducing a separate `squarespace/` folder structure.

This rebuild spans multiple sessions. Phased and committed incrementally per
project convention (one focused commit per logical chunk, not one giant commit).

## Phase A — Tokens & Typography: DONE
Completed across earlier commits (`fbaed7c`, `dec382d`, `9adb00e`, `847864a`,
`3077086`) plus this pass's conversion of `header-injection.html` and
`lock-screen.html` (the two Squarespace injection locations that aren't
per-page Code Blocks, and had been missed by the earlier page-by-page pass).

- Midnight/gold/Sandstone/Voyage/Sunrise/Canopy tokens in place on every page.
- Montserrat fully removed; Source Sans 3 + Cormorant Garamond throughout.
- 12px card radius / 8px button radius in place. Sunrise primary buttons,
  bordered secondary buttons.
- `prefers-reduced-motion` guards present on every page's reveal/lightbox CSS.
- **Fixed this pass:** headline `<em>` accent-words were still inheriting
  `font-style: italic` from the old design system on every rebuilt page — the
  Brand Bible specifies 600-weight headlines with no italic split. Stripped the
  italic (kept the gold color) across all 8 affected files.
- **Fixed this pass:** About's hero H1 ("Some people see the world. Andy lives in
  it.") was still the literal old-brand headline the Brand Bible's own audit
  flags for removal — missed by the earlier About conversion. Replaced with "A
  conductor, before he was ever a guide."

## Phase B — Identity: MOSTLY DONE
- `travellikeandy` wordmark + division lockup in place on every page's hero.
- "Curated Personally." signature present on About, Access & Care, Bespoke,
  Contact, Groups, Home, and the lock screen tagline.
- The Cue motif (baton line + three stars) present on every page that has a
  closing section (About, Access & Care, Bespoke, Contact, Groups, Home,
  Journal's hero).
- **Outstanding:** the actual header/footer logo *image* (a Squarespace Image
  Block, not in these files) is still the old icon-collage PNG. Favicon likewise.
  Both need a real SVG wordmark asset before they can be swapped — logged in
  `HANDOFF_NOTES.md`.

## Phase C — Architecture: MOSTLY DONE
- `/groups` (renamed from Corporate), `/collections`, `/access-and-care`,
  `/journal` all exist as content files. Only `/groups` and `/collections` are
  live Squarespace pages today — Access & Care and Journal still need creating
  in admin (they're new).
- Bespoke absorbed Leisure's content; `pages/leisure.html` retired.
- **Outstanding (admin-side, not code):** `/leisure` → `/bespoke` redirect; the
  real 6-link nav rebuild (Bespoke · Groups · Collections · About · Journal +
  "Begin a Journey"); un-gating Bespoke (explicitly deferred, client's call).

## Phase D — Content & Components: MOSTLY DONE
- Homepage sections match the Brand Bible's 8-section sequence (built in an
  earlier session, verified still correct this pass).
- About's unsubstantiated stats block ("20+/6/∞") removed.
- Full copy audit run against the Brand Bible's retired-vocabulary list and
  banned-headline list — see the grep-verifiable results below. One real hit
  found and fixed (About's H1, see Phase A).
- Collections shipped in "interest list" mode with a real Web3Forms-backed
  inquiry form, per the Brand Bible's launch-mode spec for this page.
- Access & Care and Journal built as new pages — see `HANDOFF_NOTES.md` for what
  real content they're still waiting on.
- **Not done:** meta titles/descriptions (Squarespace admin field, not in these
  files — logged in `HANDOFF_NOTES.md`); og:image/twitter:image still the old
  logo (same reason).
- **Not done:** the one remaining stock photo was replaced with a real Andy photo
  (see `HANDOFF_NOTES.md`) rather than a labelled placeholder, since a real,
  thematically-appropriate asset already existed in this project's photo
  library — no gap to log here.

## Phase E — Audit: grep-verifiable results (this pass, 2026-07-30)

Zero hits across `pages/*.html` for all of the following:
`#0a0a0a` `#0d0d0a` `#c8af78` `#dfc898` `#f0ebe0` `#7a7060` `#3a3830` ·
`Montserrat` · `unsplash` · `logo-main-transparent` (as a page reference) ·
`#travellikeandy` (as identity/hashtag use) · "a rare few experience it" ·
"by invitation only" · "extends invitations" · "inner circle" · "dream of going"
· "dream vacation" · "bucket list" · "hidden gem" · "book now" · "wanderer" ·
"10 per season" · any `<em>`/`<i>` inside an H1/H2 that still carries italic
styling · `/cart` (not present in any page file — lives in Squarespace's native
header if at all, outside these files' control).

Not independently verified (would need a live browser session, not available in
this environment): contrast ratios, keyboard focus order, mobile layout
behavior, and whether the legacy generic-selector lock-screen block in
`header-injection.html` is actually still live. `:focus-visible` and
`prefers-reduced-motion` rules are present in source on every page but weren't
tested against a live render this pass.

## Not attempted this pass, by design

Full nav rebuild, redirects, page creation in admin, meta tags, favicon, and
og:image are all Squarespace-admin-side changes this repo's files can't make —
each is logged once in `HANDOFF_NOTES.md` rather than duplicated here.
