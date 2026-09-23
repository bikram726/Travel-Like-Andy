# PROJECT RULES & OPERATING ARCHITECTURE: TRAVEL LIKE ANDY

## 1. System-2 Reasoning & Execution Framework
- **Deconstruct & Plan:** All tasks requiring non-trivial edits must be deconstructed into discrete execution sub-tasks with verifiable checkpoints before writing code.
- **Root-Cause & Edge Cases:** Identify platform constraints (e.g., Squarespace Fluid Engine layout logic, client-side JS hydration quirks) before proposing modifications.
- **Verification:** Changes must be verified via syntax validation, automated checks, or browser tests where applicable.

---

## 2. Core Repository & Platform Guardrails

### A. Strict Secret & Credential Sanitization
- **NEVER** commit credentials, API keys, private tokens, or access passwords into this repository.
- The Bespoke page password and client email addresses must remain in Squarespace admin / secure storage only. Git history is public.

### B. Squarespace 7.1 Single-Block Breakout Rule
- All page deliverables in `pages/*.html` use full-bleed horizontal breakout:
  ```css
  .tla-*-wrap { width: 100vw; position: relative; left: calc(-50vw + 50%); overflow: hidden; }
  ```
- **Mandatory Grid Setting:** When pasting into a Squarespace Fluid Engine Code Block, the block **must be horizontally centred**. The wrapper's viewport-left resolves to `block_left - 50vw + 0.5 × block_width`, which is zero exactly when the block's centre is the viewport's centre — block *width* cancels out. An **off-centre** block drags the layout sideways; a narrow one does not.
  - *Corrected 2026-09-23.* This previously read "must span columns 1 through 27". A live browser audit measured four pages rendering correctly at columns **12–16**, and `/about` correct at 1–27. Spanning 1–27 satisfies centring but is not the requirement.

### C. Editor Hydration Caution
- Squarespace's layout editor disables embedded `<script>` execution and pages initiate at `opacity: 0` before reveal observers mount.
- **Never delete or attempt to "fix" an apparently empty code block inside the editor.** Test and inspect only on the live published URL in a private/incognito window.

### D. Brand Bible v1.0 Design Tokens & Copy Standards
- **Palette Tokens:**
  - Midnight: `#05070B`
  - Gold: `#D4AF37`
  - Sandstone: `#F5F2EB`
  - Voyage / Sunrise / Canopy accent tokens as defined in `pages/global-custom-css.css`
- **Typography:** Source Sans 3 (body) + Cormorant Garamond (headlines). Headings use 600-weight without italic accents (`<em>` carries gold color only, never `font-style: italic`).
- **Retired Vocabulary Filter:** Strictly avoid banned copy:
  - Banned terms: "a rare few experience it", "by invitation only", "inner circle", "dream vacation", "bucket list", "hidden gem", "wanderer", "book now".
  - Active signature: *"Curated Personally."*

### E. Legal & Compliance Disclosures
- The Fora Seller of Travel registration text is legally required on the site footer (`pages/footer-content.html`) and must be maintained across all page updates.

