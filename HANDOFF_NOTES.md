# Handoff Notes — Brand Bible Rebuild

Every open decision, placeholder, and item that needs the client (Andy, or whoever
is coordinating with him) before this rebuild can be called finished. Nothing in
this list was fabricated to look finished — where real content doesn't exist yet,
the live pages say so honestly instead.

## Decisions made this pass (2026-07-30), with rationale

1. **Bespoke stays password-protected.** The Brand Bible gap audit recommended
   un-gating it into a public flagship page; the client explicitly chose to keep
   the existing password wall (`LuxeAccess`) instead. The page content itself was
   still rebuilt in the new brand voice (no more "by invitation," no more tiers),
   so if the gate is ever removed later, the content underneath is already ready.
2. **The Wanderer / Curator / Circle 3-tier system is gone**, along with its
   referral-gated "Curator" inquiry form. Bespoke now closes on a plain "Begin a
   Journey" button to `/contact`, same as every other page.
3. **Leisure no longer exists as its own page.** Its service copy (Family
   Vacations, Honeymoons, Cruises, Resort Stays, Fora Hotel Upgrades) and 9-photo
   gallery are now part of Bespoke. **A permanent redirect `/leisure` → `/bespoke`
   still needs to be set up in Squarespace admin** — this repo's files don't
   control routing/redirects.
4. **Group and Gallery (the old pre-Brand-Bible placeholder pages) were retired**
   separately, for unrelated reasons — see `README.md`'s superseded checklist
   section. Not part of this Brand Bible pass.

## Still needs the client

- **FORA / Virtuoso disclosure language.** The Brand Bible calls for exact
  required disclosure text in the footer. Nothing on the site currently makes a
  disclosure claim, so there's no compliance gap today — but the footer doesn't
  have the language either. Needs Andy's exact wording.
- **Approved testimonials.** The site still only uses Andy's own two established
  quotes ("I do not send you somewhere I would not go myself." / "The best
  journeys are not booked. They are designed around you.") — no client
  testimonials exist with permission to publish. The Brand Bible's homepage
  "Proof" section and Bespoke's places gallery are ready to receive real
  testimonials whenever they're approved; nothing was invented to fill the gap.
- **Access & Care specifics.** `pages/access-and-care.html` is built and live in
  the repo, but its copy is deliberately general ("I ask what you need before I
  ask where you're going") rather than specific. If Andy has real certifications,
  a concrete advocacy story, or specific accommodations he's arranged before,
  those would make this page much stronger — currently nothing is fabricated.
- **Journal has zero real content.** `pages/journal.html` is an honest "first
  stories are being written" stub, matching how Collections already launched.
  No fake article titles. Needs real editorial content before it does anything.
- **Footer content now has a tracked source file.** The site's actual footer
  text (wordmark, the Cue, "Curated Personally.", disclosure) was previously
  only referenced in `global-custom-css.css` comments — the real content had
  never been captured in this repo, presumably hand-typed once directly into
  Squarespace's footer Code Block. Added `pages/footer-content.html` with the
  wordmark/Cue/signature and an HTML-comment-only placeholder marking where
  the FORA disclosure text goes (no fake legal text rendered live). Needs
  pasting into the footer's Code Block to become the real source of truth —
  check what's currently live there first in case it's already been hand-
  edited since the comments in `global-custom-css.css` were written.
- **Real wordmark asset.** A placeholder text-based SVG wordmark now exists at
  `assets/wordmark/wordmark-midnight.svg` and `wordmark-white.svg` (lowercase
  "travellikeandy", Cormorant Garamond, no decoration) — good enough to swap
  into the footer/header Image Block now if needed, but still a stand-in for
  a real designer-exported asset. Every page uses a text-based `travellikeandy` /
  division lockup (Cormorant Garamond) in the page content itself, which
  satisfies the Brand Bible's wordmark spec without needing a new asset. But the
  site's actual **header/footer logo image** (a Squarespace Image Block, not
  controlled by these files) is still the old colorful icon-collage
  `logo-main-transparent.png` per `README.md`'s "Logo placement" section — the
  Brand Bible explicitly retires this as "never as the master logo." Swapping it
  for a real SVG wordmark (Midnight + white versions) still needs doing in
  Squarespace admin once that asset exists. Same for the **favicon**.
- **og:image / twitter:image.** Squarespace's site-wide social preview image
  setting isn't in these files. The gap audit flagged it as still pointing at the
  old logo; should become real editorial photography once Andy has some to use.
- **Meta titles & descriptions.** Per-page SEO fields live in Squarespace's page
  settings, not in these code-block files. Every page (including the three new
  ones) should get a real title + description written once the final page set is
  confirmed live.

## Accessibility audit (2026-07-30, computed via WCAG relative-luminance formula)

- **Fixed:** gold (#C9A96E) as text/accent color only passes AA contrast on
  Midnight backgrounds. On white or Sandstone it measured 1.95-2.24:1 (needs
  4.5:1) — every eyebrow label and headline accent-word in a light-background
  section across About, Bespoke, Collections, Access & Care, Groups, and Home
  was affected. Added a `--gold-deep` (#7a5a2e, 5.0-6.3:1 on white/Sandstone)
  token used only in those light-background spots; Midnight sections are
  unchanged.
- **Fixed:** Home's "Read the Story" link used Voyage blue as text on white
  (2.84:1) — darkened to `#08698c` (6.16:1) for that specific link.
- **Fixed:** `--muted-on-light` (the default body-copy color on white/Sandstone
  sections, used on nearly every page) measured 4.09-4.32:1 against its real
  backgrounds — just under the 4.5:1 threshold. Bumped its alpha from 0.65 to
  0.72 sitewide (now 4.97-5.29:1).
- **Not fixed, flagged instead:** white button-label text on Sunrise
  (#F26A21) measures 3.06:1. It clears the 3:1 WCAG threshold for UI
  components but falls short of 4.5:1 for text at button-label size (~13px,
  below the "large text" exemption). Both colors are exact Brand Bible tokens
  (mandated primary CTA color + button text color) — not changed unilaterally,
  since darkening Sunrise or the button text would be a real brand-color
  change, not a bug fix. Worth a design decision from whoever owns the Brand
  Bible if strict AA compliance on button labels matters more than the exact
  token value.
- Not independently verified: live keyboard-navigation order, screen-reader
  behavior, and mobile viewport rendering — all would need a real browser
  session, not available in this environment.

## Needs doing in Squarespace admin (not fixable from this repo)

- **Create the three new pages** (`/access-and-care`, `/journal`, `/collections`)
  in the Pages panel and paste in their code blocks — same publish process as
  every other page (see `README.md`). None of them exist as live pages yet.
- **Rebuild the site nav** to the Brand Bible's 6-link spec (Bespoke · Groups ·
  Collections · About · Journal + "Begin a Journey" as the header CTA). The
  current live nav still reflects the pre-rebrand page set. Deliberately held off
  on this until the new pages actually exist, so it isn't edited twice.
- **`/leisure` → `/bespoke` permanent redirect** (see above).
- **Check the `/cart` link and counter in the site header.** The Brand Bible gap
  audit flagged Squarespace's native commerce UI as present and out of place
  ("the relationship begins with consultation, not checkout"). This isn't
  something these code-block files control — worth a look in Squarespace's
  Commerce settings to see if it's actually needed.
- **Un-gate Bespoke's password**, only if the client later decides to follow the
  Brand Bible's original "public flagship" recommendation (see decision #1 above)
  — this is a page-level Squarespace setting, not something in `pages/bespoke.html`.

## What did NOT change (by design, not oversight)

- No fabricated statistics, testimonials, certifications, or disclosure text
  anywhere. Where real content is missing, pages either state that honestly
  (Journal, Collections) or use general-but-true statements (Access & Care)
  rather than inventing specifics.
- No new stock photography was introduced. The one remaining generic stock image
  (a "corporate lounge" photo used on Home's Groups card and the Groups page) was
  replaced by reusing an existing real Andy photo (him conducting an orchestra —
  already used on About, and thematically tied to "Travel, conducted around
  you.") rather than swapping in different stock.
