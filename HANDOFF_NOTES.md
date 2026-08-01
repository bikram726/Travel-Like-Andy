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

## Real brand artwork received from Andy (2026-07-31)

Andy sent official business card artwork (`FRONT ARTWORK.pdf` / `BACK ARTWORK.pdf`) via the user. Important: this arrived as rendered content in chat, not as a file this session can write to disk — the actual PDF files are not saved anywhere in this repo. **If they should be version-controlled, someone with local file access needs to save them into the repo** (e.g. `assets/brand/`) — this session can't do that itself.

What it confirms and changes:
- **Design system validated exactly as built.** Front artwork shows the lowercase `travellikeandy` wordmark in Cormorant Garamond (white on Midnight), "Curated Personally." in gold, and the Cue motif (thin line + three clustered stars) — matches this rebuild's implementation precisely. No changes needed from this; strong confirmation the interpretation of the Brand Bible was correct.
- **Phone number corrected.** The business card lists `+1 4422348624` as the USA number — different from the `+1 (760) 509-0169` that was live on the Contact page (the Mexico/WhatsApp number, `+52 5579495570`, already matched exactly). Updated Contact page's phone card to `+1 (442) 234-8624` / `tel:+14422348624`. **Worth Andy double-checking this is correct** — a phone number is high-stakes to get wrong, and this came from a business card image rather than a direct written confirmation.
- **Full legal name confirmed**: "Andrew 'Andy' Eisenmann." Site copy uses "Andy Eisenmann" throughout, which reads as intentional (matches the informal, first-name-forward brand voice) — left as-is, not changed to the formal version. Worth using the full name if a legal/disclosure line is ever added to the footer.
- **"VTW 2026 · The First Downbeat"** appears on the back artwork as a small tagline/watermark. Purpose unclear (possibly an event name, e.g. Virtuoso Travel Week 2026, or a campaign name) — not added anywhere on the site since its meaning and intended use aren't known. Ask Andy if this needs to appear anywhere (e.g. a Journal post, an About mention, or if it's business-card-only).
- **FORA Travel Partner** spelling/casing on the card ("FORA" all-caps) vs. site's "Fora Travel Partner" (title case) — minor, cosmetic, not changed without knowing which is the brand-approved casing.

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

## Media & Motion Addendum (2026-07-31)

A follow-up brief (`MEDIA_MOTION_ADDENDUM.md`) asked for a proper animated Cue component, a defined motion/media system, and a shot list for real photography/video. Status:

**Built:** The Cue (baton line + three clustered stars) is now a single reusable inline SVG on every page that has one (Home ×2, About, Bespoke, Contact, Groups, Access & Care, Journal) — previously it was an em-dash-and-unicode-star text approximation. It draws once via `stroke-dashoffset` on scroll into view (IntersectionObserver, 40% threshold), stars fade in with a short stagger after, `aria-hidden="true"`, fires once and never loops, and renders fully complete with no animation under `prefers-reduced-motion`.

**Already compliant, no changes needed:** scroll-reveal pattern (fade + translate, fires once, disabled under reduced-motion, one reveal per section not per child); Bespoke's lightbox (Escape closes, arrows navigate, focus-trapped, focus returns to trigger on close, no autoplay); no carousels/sliders/rotators, no marquee logo scroller, no cursor-follow/WebGL effects, no text-baked-into-images, no travel pictograms in motion anywhere in the codebase.

**Deliberately not built — hero video / Ken Burns stills:** the addendum's premise is "no real photography or footage exists," which doesn't match this project's actual state — real Andy photography already exists and is in use (the Taj Mahal hero, the orchestra-conducting photo, the Cabo/Palmilla shots, the 9 merged Leisure gallery photos). Building placeholder video-hero scaffolding to replace a working real-photo hero would be a downgrade, not progress, and speculative given no footage will ever fill it without Andy providing V1/V2 below. The Brand Bible itself permits a static image as a full alternative to video (§11 section 01), which the current hero already satisfies. If real hero footage arrives, building the video-hero component (muted/looped/poster/reduced-motion-safe per the addendum's A1 spec) is a contained, well-defined follow-up.

**Not attempted — full editorial image-rhythm rebuild (A4):** the addendum wants an asymmetric "one dominant image + smaller counterpoint" rhythm alternating orientation down the page, versus this site's current masonry/column-based photo galleries. The galleries already avoid true equal-weight collages (column-count masonry naturally varies tile height), so this is a refinement opportunity, not a violation — not undertaken this pass to control scope.

### Shot list for Andy (blocking — nothing below exists yet)

**Video**
| # | Shot | Spec |
|---|---|---|
| V1 | Hero loop — a single unhurried moment (a table being set, a train window, a hand on a balcony rail at dawn, an empty concert hall). Not a montage, not a destination reel | 8-15s, 1920×1080, no audio, minimal camera movement, warm-neutral grade |
| V2 | Andy speaking to camera, 30-60s, on judgment and being present when plans change | 1080p, clean audio, captions required |

**Photography**
| # | Shot | Ratio | Use |
|---|---|---|---|
| P1 | Andy — horizontal environmental (in place, working, mid-journey) | 3:2 | Homepage "Why Andy" |
| P2 | Andy — vertical editorial | 4:5 | About page |
| P3 | Andy — simple headshot, neutral | 1:1 | Proof section, social, favicon fallback |
| P4-P6 | Bespoke / Groups / Collections path images — a real moment, not stock/boardroom imagery | 16:9 | Homepage "Three paths" (currently reusing existing real photos as a placeholder) |
| P7 | Detail set, 6-10 images: architectural detail, a table, textiles, a performance, a train, a boat, dawn light | mixed 4:5/3:2 | General editorial rhythm |

Image test to apply: would this make a discerning traveler want to be *in* the moment, or merely recognize the place? Reject: generic beach sunsets, landmark checklists, stock handshakes, HDR/lens flare/heavy filters, airport/airplane imagery.

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

## Confirmed live 2026-07-31 (verified by the browser session, not just the editor)

- `/leisure` is fully retired: page disabled (not deleted, fully reversible), and a real server-side 301 redirect `/leisure` → `/bespoke` is confirmed firing on anonymous requests (verified against a control 404 path, no redirect loop). Bespoke's nav position and homepage prominence are untouched.
- `footer-content.html` is live in the footer's Code Block exactly as given — computed styles confirmed correct (wordmark in Cormorant Garamond/white, Cue in gold at the right tracking), FORA/Virtuoso placeholder comment present with nothing invented in it. Old icon-badge logo image confirmed hidden (not deleted) via the filename-keyed rule.
- **Known, accepted tradeoff, not a bug:** `/bespoke` still returns 401 to logged-out visitors (client's deliberate "stay gated" decision from earlier this project). This means the `/leisure` redirect currently lands anonymous visitors on the lock screen rather than live content — this is the exact consequence flagged when the redirect was set up, not a new issue.
- **Fixed this pass:** the footer was rendering pure black instead of Midnight (`#12355B`) — Squarespace's inner `.section-background` div has a hardcoded `#000` that was painting over the existing footer background rule. Extended the CSS to target `.section-background` directly inside the footer.

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
