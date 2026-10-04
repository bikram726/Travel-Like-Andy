# Website audit and published improvements — October 4, 2026

The authorized UI/UX and frontend reliability improvements are published to Squarespace. This is an audit of the public pages and repository-owned code, not a certification that every vulnerability has been eliminated. Account-level security actions and native macOS testing remain open.

## Published changes

- Global FOOTER injection now measures the usable viewport width, excluding the scrollbar. This corrects the 8px horizontal overflow found on all seven public pages. A ResizeObserver keeps the breakout and fixed-header clearance correct when the viewport or header changes.
- Fixed About's tablet header overlap and tightened mobile hero spacing. Longer contact values and CTA text wrap without pushing the page sideways.
- Corrected dark headings on navy, a white heading on sandstone, the Sold Out label, and the mobile menu's black inquiry button. Primary orange buttons now use #B6430D with white text. Navy, sandstone, gold, and the existing typefaces remain the site's visual foundation.
- Page CTAs have a minimum 44px height; form controls use 16px text and at least 48px height. Footer disclosure copy is larger and fully opaque. Keyboard focus indicators and reduced-motion behavior are explicit.
- Added a reveal failsafe so a stalled IntersectionObserver cannot leave page content unreadable.
- Contact and Collections use named form controls, a duplicate-submit guard, native constraint validation, input length limits, an accessible busy state, and a 20-second abort timeout. Validation focuses the first invalid field. Error messages remain textContent rather than HTML. Timeout copy warns that delivery is unconfirmed and asks visitors to contact Andy before resending.
- Added a strict-origin-when-cross-origin referrer meta policy in HEADER injection. It complements the existing Squarespace HTTPS/HSTS, nosniff, and SAMEORIGIN response headers.
- Restored the hosted-departure interest list and consistent Home/Contact/business-description copy. Removed the duplicate Groups slogan. Groups retains the Thailand sold-out status, wait-list link, 8–14-person how-to, expanded categories, and Thailand/Nepal photos.
- Access & Care now directs visitors to discuss sensitive details directly with Andy. Removed the unsupported promise that form data stays only between two people; the website uses a third-party form processor.
- The Bespoke lock screen now clips the logo track's horizontal overflow. Navigation has 44px touch targets and a focus outline; the password field uses 16px text and is at least 48px high. Header clearance follows the larger targets. Authentication and the password itself were not changed.

Global fixes live in `pages/footer-content.html`, served through FOOTER Code Injection. The lock screen has a separate stylesheet in LOCK PAGE injection. The Groups status color is also overridden globally, so the current published inline color and the simplified local inline color produce the same result.

## Verification

| Check | Result |
| --- | --- |
| Seven public pages at 320, 390, 768, 1366, and 1920px | 35 checks; no horizontal overflow, heading/header overlap, broken loaded images, or contrast failures in the audited text set |
| Page CTAs and form controls | No sampled CTA below 44px; no form control below 16px text or 48px height |
| Bespoke lock screen at 320, 390, and 1366px | No horizontal overflow; every nav link 44px; password field 16px/48px; body clears nav by 48–68px |
| Mobile menu | Opens and closes; navigation links visible; inquiry button white with gold border after correction |
| HTTP inventory | Seven public pages return 200; Bespoke returns 401 and remains password gated |
| Public HTML checks | One h1 per page; no mixed-content src URLs, missing img alt attributes, unsafe target=_blank links, or stale registration-pending notices |
| Inline JavaScript and JSON-LD | 17 inline scripts pass Node syntax validation; JSON-LD parses |
| Contact local mock | Empty-field focus, success/reset, duplicate-submit guard, literal unsafe-text response, and timeout recovery checked |
| Collections local mock | Empty-field focus, success/reset, literal unsafe-text response, and malformed-response recovery checked; rapid click plus Enter increased the mock request count from 6 to 7, confirming one request |
| Current repository credential patterns | No private-key blocks or common GitHub/OpenAI/AWS token patterns found in the 92 tracked-file inventory; this is a bounded scan, not proof that history contains no secrets |

All form submissions used a loopback-only mock with fake data and a local-test key. No test emails or bookings were sent. Real inbox delivery is unverified. Browser value redaction prevents inspecting an email field's retained value, so input retention is an implementation behavior rather than a separately claimed email-value test.

Tests ran in Chromium/Brave on Windows with explicit viewport overrides. These are responsive layout checks, not native macOS Safari, iOS, Android, screen-reader, or full WCAG certification. Text over photographs, sibling image overlays on Home cards, and decorative elements require visual judgment; the automated contrast script excludes those image cases. Mobile Groups photos and page/menu screenshots were inspected. Native Safari and assistive-technology testing remain recommended.

Private production snapshots, exact pre-edit injection/code-block backups, JSON results, and screenshots are outside the public repo in `C:/Users/bikra/.codex/backups/travel-like-andy/oct3-audit` and `oct4-live`. The final matrix is `oct4-live/final-matrix.json`; lock results are `lock-live-checks.json`.

## Open security and account work

1. **Bespoke password rotation — user action required.** Existing README/START_HERE records say it was exposed in public Git history and rotation has not been confirmed. Editing current files cannot revoke an old password. The user was asked to rotate it directly in Squarespace; no new credential should be sent through chat or committed. Browser automation policy requires the user to enter and save the replacement themselves.
2. **Web3Forms enforcement — dashboard access required.** The public access key is a client-side form identifier, not a private server credential. The current honeypot and JavaScript validation can be bypassed by direct requests. Verify/enable provider-side hCaptcha enforcement and appropriate domain restrictions in the owning dashboard. Domain restrictions are a Pro feature; no plan purchase was made. A frontend widget alone would not prove backend enforcement, so a decorative challenge was not shipped as a security claim.
3. **Privacy and sales policies — owner-approved content required.** The repository already records missing privacy/terms/refund details and sale-specific disclosure facts. Those must be supplied and reviewed before adding reservation/payment flows. No policies, deposit terms, booking guarantees, or legal approvals were invented.
4. **Squarespace-managed security boundary.** Platform/backend vulnerabilities, account MFA, domain ownership/renewal, permissions, provider rate limits, and private-page content were outside this frontend audit's verified access. The public response has no CSP header. A strict policy needs an inventory and report-only rollout around Squarespace's inline/third-party scripts; injecting a guessed policy would risk breaking the site. No arbitrary proxy, DNS change, or permission expansion was performed.

## Reproduce the checks

`scripts/audit_site.py` requires Python and BeautifulSoup (`beautifulsoup4`). It fetches production read-only, writes private snapshots/HTTP inventory, and constructs isolated previews with local form endpoints and no real access key:

```powershell
python scripts/audit_site.py --output C:/path/to/private-audit
python scripts/preview_server.py --directory C:/path/to/private-audit/preview --port 8766
```

The preview server binds only to 127.0.0.1 and never forwards form requests. Message `unsafe-text` returns a literal HTML-looking error, `malformed` returns a non-JSON error, and `timeout` delays 21 seconds. Use fake data only. `scripts/audit_browser.js` is a read-only DOM function intended for the documented browser API. Save results after each page because the browser connection interrupted longer runs during this audit.

## References

- [W3C contrast guidance](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html): regular text 4.5:1, large text 3:1.
- [W3C reflow guidance](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html): check a 320 CSS-pixel viewport.
- [Web3Forms domain restriction](https://docs.web3forms.com/getting-started/pro-features/restrict-to-domain).
- [Web3Forms hCaptcha configuration](https://docs.web3forms.com/getting-started/customizations/spam-protection/hcaptcha).
- [Web3Forms FAQ](https://docs.web3forms.com/getting-started/faq).
- `notes/OCT2_RESTORATION.md`, `notes/OCT1_LAUNCH_COMPLIANCE.md`, and `START_HERE.md` for existing approved registration/copy records and password-history risk.
