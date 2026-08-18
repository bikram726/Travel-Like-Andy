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

## Andy answered several open questions directly (2026-08-01)

- **Phone numbers, corrected for real this time.** Andy gave the definitive breakdown: `+1 (760) 509-0169` = USA phone, `+52 55 7949 5570` = Mexico phone, `+1 (442) 234-8624` = WhatsApp specifically. The 2026-07-31 business-card-driven change had this wrong (put the WhatsApp number in the Phone card). Fixed on Contact: Phone card is back to the original USA number, WhatsApp card now uses the correct WhatsApp number. The Mexico number isn't currently represented as its own card (Contact only has 4 cards: Email/WhatsApp/Phone/Instagram) — ask if he wants a dedicated Mexico line added.
- **Also fixed while in there:** Contact's email card was still a `mail.google.com` compose link instead of a plain `mailto:` — an earlier live fix apparently never got captured back into this file (same regression pattern as the CSS syncs). Now a real `mailto:` link.
- **"Fora" (not "FORA")** — confirmed, matches what's already used sitewide, no change needed.
- **"VTW-The First Downbeat"** — confirmed event-specific (an upcoming introduction to the global travel-advisor community), not meant for the site. Question closed, nothing to add.
- **Bespoke's LuxeAccess gate** — Andy explicitly reconfirmed he loves it. Decision closed, no further reconsideration needed.
- **Fora legal disclosure — real text received and now live** on About's close section: "An Independent Affiliate of Fora." (linked to fora.travel) plus the required Seller-of-Travel registration numbers for California/Florida/Washington, verbatim. Andy also asked for a small linked Fora Travel logo next to it — that's a real image asset that doesn't exist in this repo yet, so only the text link went in; logo still needed.
- **Real bug reported, not yet fixed:** Andy says one of Bespoke's merged gallery photos is upside down — "the pool and palm trees at the bottom near the monkeys" (likely the Infinity Pool photo, based on grid position near the Macaque & Baby photo, but not confirmed — needs visual identification on the live page before guessing which file/CSS rule to touch, since a wrong rotate() would break a currently-correct photo).

## Structural question — resolved 2026-08-01

Andy referred to "the LEISURE TRAVEL PAGE" for real group content (friends/family/small clubs/wedding parties, not Bespoke's "super rich folks" framing), even though Leisure was dissolved into gated Bespoke earlier this project. **Resolved by the user directly: yes, this content needs a public home.** Rather than reviving a separate Leisure page, it went onto the already-public **Groups** page instead — which fits both of Andy's asks at once (he separately wanted Weddings/Friend Groups/Curated Events added to Groups anyway), under the umbrella that Groups now means *any* group travel, not just corporate. Built 2026-08-01:
- Three new Program Types cards (Weddings, Friend Groups, Curated Events) added at the top of the existing grid, ahead of Executive Travel/Conferences/etc.
- New slogan **"Travel Together. Go Deeper."** added under the hero deck.
- A full "First Group Departure" section for the real **Wisconsin to Thailand** trip (Oct 25 – Nov 7, 2027; Bangkok/Kanchanaburi/Chiang Mai/Koh Lanta; $3,999/person double occupancy; 8-14 travelers; real inclusions/exclusions and deposit/refund policy), built from the flyer Andy provided. **Note the deliberate exception to this site's "no prices" rule** — this is one specific, real, dated, bookable departure with a published price and cancellation policy, not a generic package or "deal," so the real price is shown. Not yet published to Squarespace — still needs pasting like every other page update.

## New real content/requests from Andy, not yet built (2026-08-01)

- **A "How To" concept for small-group trips**, Andy's own framing: destinations he wants to seed first are Thailand, Nepal, Tahiti, Hidden Mexico, Greece Mainland Coasts, Istanbul for Beginners, with copy along the lines of "It's simple — get a group of your friends or family together (minimum 8, maximum 14), and we curate an adventure that will exceed your expectations. Contact Andy to start building." No page/section exists for this yet — needs a placement decision (own page? part of Groups, alongside the new departure section?).
- **Journal**: Andy will send a real story about clients in Nayarit during a cartel-related regional shutdown "by Monday." He also named real topics he wants to write about: solo travel, the feeling of arriving somewhere entirely new, authentic/non-touristy travel, and music (classical and pop/hip-hop). He asked directly whether he should publish one post a week — that's a question for the user/Andy to answer together, not something to decide unilaterally.
- **A real upcoming group tour** (Wisconsin to Thailand, organized with someone named Jenny) will be ready to publish once Andy has met with Jenny — placement depends on the structural question above.

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
- **Journal has zero real content — update 2026-08-17, partially stale.** `pages/journal.html` (the static teaser still live at `/journal`) is an honest "first stories are being written" stub with no fake article titles, and that part is still accurate. But the separate native blog collection at `/journal-native-draft` — now fully styled and layout-fixed (see the 2026-08-17 entries above) — already has 4 real published posts (Redefine Success, Small Steps Create Big Shifts, Turn Intention Into Action, Make Room for Growth). The remaining step isn't writing content, it's swapping `/journal` from the teaser stub to the real collection (and updating the teaser's "Read the Journal" button/nav accordingly) — worth flagging to Andy/the user as a decision point, not a content gap.
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

## Real gap found 2026-08-03 — needs Andy/the user's decision, not a code fix

A full site sweep found the site has **no Privacy Policy or Terms page at all** — every candidate URL (`/privacy`, `/privacy-policy`, `/terms`, `/terms-of-service`, `/legal`, etc.) 404s, and there's no link to one anywhere in nav or footer. This became a real gap the moment Groups' Wisconsin-to-Thailand departure went live, since that section publishes a genuine binding deposit amount and a specific non-refundable-after date — real payment/cancellation terms with no policy page behind them. **Deliberately not building one** — this needs actual legal/business judgment (what it should say, whether it needs Andy's host-agency's own boilerplate, state-specific requirements similar to the Fora Seller-of-Travel disclosure) rather than invented policy text. **Confirmed 2026-08-03: Squarespace has no built-in privacy-policy/terms template, generator, or boilerplate on this plan** — the "Add a Page" panel has no legal-content starter, and "Cookies and Data Privacy" only manages a cookie-consent banner, not policy text. So there's nothing to enable — real content has to come from Andy or a lawyer first, then it's just a plain new blank page once approved. Flag to Andy directly.

**Resolved 2026-08-03:** the sitewide `:focus-visible` outline was re-verified in a genuine logged-out keyboard context (on the public domain, confirmed `:focus-visible` matched, not a synthetic state). Confirmed correct on every form field and interactive element on light backgrounds: `rgb(14,165,217)` (`#0EA5D9`, Voyage blue), ~3px solid, ~3px offset, on both Contact and Collections. The header nav links (on the dark Midnight header) show a white outline instead — a deliberate, sensible contrast choice given a blue ring would read poorly there, not a bug. Verification gap fully closed.

## Confirmed live 2026-07-31 (verified by the browser session, not just the editor)

- `/leisure` is fully retired: page disabled (not deleted, fully reversible), and a real server-side 301 redirect `/leisure` → `/bespoke` is confirmed firing on anonymous requests (verified against a control 404 path, no redirect loop). Bespoke's nav position and homepage prominence are untouched.
- `footer-content.html` is live in the footer's Code Block exactly as given — computed styles confirmed correct (wordmark in Cormorant Garamond/white, Cue in gold at the right tracking), FORA/Virtuoso placeholder comment present with nothing invented in it. Old icon-badge logo image confirmed hidden (not deleted) via the filename-keyed rule.
- **Known, accepted tradeoff, not a bug:** `/bespoke` still returns 401 to logged-out visitors (client's deliberate "stay gated" decision from earlier this project). This means the `/leisure` redirect currently lands anonymous visitors on the lock screen rather than live content — this is the exact consequence flagged when the redirect was set up, not a new issue.
- **Fixed this pass:** the footer was rendering pure black instead of Midnight (`#12355B`) — Squarespace's inner `.section-background` div has a hardcoded `#000` that was painting over the existing footer background rule. Extended the CSS to target `.section-background` directly inside the footer.

## 2026-08-01: focus-visible added, footer fix still not live yet

A live audit found **no element anywhere had a visible keyboard-focus outline** (computed `outline: none`, no fallback) — a real WCAG 2.4.7 failure. The browser session added a gold-outline version directly to live Custom CSS as a fix. Brought this into the tracked file instead using **Voyage blue** per the Brand Bible's own already-documented token spec (`:focus-visible { outline: 3px solid var(--tla-voyage); outline-offset: 3px; }`) rather than gold — gold is reserved for punctuation/accents, Voyage is the spec'd color for interactive-state affordances like links and focus rings. **The live Custom CSS field currently has the gold version; `pages/global-custom-css.css` has the corrected Voyage version — they've diverged. Re-paste the full file to reconcile.**

Also confirmed: the footer-black fix logged above was committed to the repo but **never actually got pasted into the live Custom CSS field** — the same audit re-discovered the identical bug. Re-pasting the current `pages/global-custom-css.css` fixes both the footer color and corrects the focus-outline color in one paste.

**Resolved 2026-08-01:** Groups (`/corporate`) content was pasted — confirmed live and correct via fresh audit. All 7 live pages are now on the new system.

## 2026-08-02: About gallery + /leisure both confirmed resolved

The live audit's gallery fix (a redundant `column-count:unset` override appended to the live Code Block, since it was patching against the *old*, not-yet-re-pasted live content) is now superseded — the tracked `pages/about.html` already had the correct `display:grid` fix from the previous commit, so the redundant override was removed from the tracked file rather than kept. Once this file is next pasted live in full, the live Code Block ends up with just the one clean rule either way.

`/leisure` needed no changes at all: both the page-disabled toggle and the `/leisure` → `/bespoke` 301 redirect were already correctly in place — the audit had been checking as logged-in admin, which bypasses the disabled-page state (same as it bypasses Bespoke's password), making it look live when it wasn't. Confirmed anonymously: `/leisure` returns a real 301 to `/bespoke`, which returns its normal password lock (401) with no loop.

## 2026-08-01: two more live-only additions synced back into the repo, one still not synced

A live audit found and fixed a real regression: pasting the tracked `global-custom-css.css` had dropped an earlier filename-keyed rule (added directly to live Custom CSS in an even earlier session, never captured here) that hid the retired icon-collage logo in the footer — so the old clip-art badge came back. It also found the Contact/Collections forms' own `input:focus { outline:none }` was overriding the new sitewide Voyage focus-visible rule with a gold-border-only cue. Both fixes are now synced into `pages/global-custom-css.css` (re-hide rule keyed to filename `logo-main-transparent-preview-dark`; `!important`-forced Voyage outline on both forms' fields) so a future re-paste of this file won't regress either one again.

**Resolved:** the same audit's `TravelAgency` JSON-LD block (added via Settings → Advanced → Code Injection → **HEADER**, the same field `pages/header-injection.html` maps to, to work around Squarespace's native JSON-LD `WebSite.description` being empty and uneditable in this template) is now synced into the tracked file verbatim, so a future re-paste won't drop it. Real facts only: name, URL, founder (Andy Eisenmann), and the same description now live in the page meta description.

Also confirmed clean via full sweep 2026-08-01: no retired vocabulary, old markers, old palette, or old-brand strings anywhere on any live page or in Squarespace's own settings (Site Title, sitemap, robots.txt, 404 page all correct/clean).

## 2026-08-10: Journal native-blog Masonry layout fixed

The Journal blog collection's list view was overlapping because Squarespace's Masonry JS sets inline `position:absolute` + `transform:translate3d()` + `width` on every card at runtime, and earlier CSS passes only made cosmetic properties (`color`/`font`) `!important`, not layout ones. Forced every layout-critical property (`position`, `transform`, `inset`, `width`) to `!important` on both the list wrapper and each card, which reliably beats non-`!important` inline JS styles on every re-application. Also aligned the single-post page so title/meta/body all share one reading-column width (`.blog-item-inner-wrapper`) instead of only the body text being constrained. Committed to `pages/global-custom-css.css` and handed to the browser session to paste into Design > Custom CSS — **pending visual confirmation** that the list now renders single-column with no overlap and the single-post page looks aligned, on both desktop and mobile.

**Correction 2026-08-10:** first verification attempt checked the wrong URL. `/journal` is still the static teaser page (`pages/journal.html`'s `.tljo-grid` 3-card topic grid — correctly 3-up desktop / 1-up mobile, cards intentionally non-clickable placeholders, not a bug). The native blog collection this CSS actually targets is a separate, still-unpublished page that hasn't been swapped into the `/journal` slug yet — `pages/journal.html`'s "Read the Journal" button links to `/journal-native-draft` as a guess at that slug, not a confirmed one. Re-verification needs to happen against the collection's real live URL, in an actual incognito browser (not an anonymous HTML fetch — the Masonry layout depends on JS running at runtime).

**Confirmed 2026-08-10:** the native collection's real slug is `/journal-native-draft` (published, 4 real posts already on it: Redefine Success, Small Steps Create Big Shifts, Turn Intention Into Action, Make Room for Growth) — `pages/journal.html`'s "Read the Journal" button already links there correctly, not a guess. **Also confirmed: the collection's layout type is `blog-basic-grid` (Squarespace's native Grid layout), not Masonry** — someone switched it at some point during the earlier "masonry-vs-grid layout-switch UI hunt." This means the CSS written against guessed Masonry-style class names (`.blog-list`, `.blog-masonry-wrapper`, `.blog-item`) was very likely targeting the wrong elements the whole time, which is why re-verification still showed desktop rendering 2-up and post-view title/meta/body misaligned (three different left edges) despite the `!important` overrides. Real DOM class names were requested via a JS snippet run in the extension's preview frame — next fix pass should use actual confirmed selectors instead of guessing a third time.

**Resolved 2026-08-17.** Real DOM introspection confirmed the actual selectors (`.blog-basic-grid.collection-content-wrapper` for the list container, `article.blog-item` for cards — the card styling was already correct, only the wrapper-level column control was targeting nonexistent `.blog-list`/`.blog-masonry-wrapper` classes). Rewrote the list-view fix to override `grid-template-columns` directly on the real container instead of fighting a JS-positioning theory that never applied to this template. For the single post, the misalignment wasn't a wrong selector after all (`.blog-item-content.e-content` etc. were already correct) — it was `.blog-item-content` being centered with `margin:auto` instead of left-aligned to the title, plus the meta line independently centered via `.blog-item-meta-wrapper`'s own `justify-content`/`text-align`. Both corrected. **Live-verified with real before/after computed values** (not just re-pasted and assumed): list view confirmed single-column, no overlap, real-cursor hover lift working; single post confirmed title/meta/body all sharing left edge 276 (was 276/604/340). Two more dead selectors turned up in the same audit and were fixed too — `.blog-image-wrapper`/`.blog-item-summary` never matched anything real on this template (real classes are `.image-wrapper img.image` and `.blog-basic-grid--text`), leaving the card image at the wrong aspect ratio and the card text with zero padding. **Round two of that same audit (still 2026-08-17)** found the two "dead selector" fixes above weren't fully correct either: the text-box padding overflowed 64px past the card's right edge (Squarespace gives it a content-box width; needed `box-sizing:border-box` too — invisible today only because the card clips overflow and the excerpt is short, but would've cut off a longer post), and the image aspect-ratio rule was a complete no-op (the `img` itself carries Squarespace's own inline sizing that beats any external rule; the real 3:2 ratio is a padding-bottom-percentage hack on the `.image-wrapper` parent, not the img — fixed by overriding the wrapper instead). Both confirmed via live before/after measurement, including a stress test with an injected ~450-char excerpt and a 147-char unbroken title (the actual overflow case a real long post title would hit): zero horizontal overflow in either case, right gutter held at 32px, title wrapped cleanly to 4 lines instead of running off the card. **Journal layout work is genuinely done.** The only remaining unverified piece is how the scroll-reveal fade settles for a real logged-out visitor (the admin preview frame has a stuck animation state unrelated to this CSS that had to be cancelled before measuring) — a quick private-window check would close that, but it's cosmetic, not a layout bug. Journal already has 4 real posts on the collection, so "Journal has zero real content" below is stale — worth a quick check before assuming it's still a gap.

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
