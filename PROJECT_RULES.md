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
- **Mandatory Grid Setting:** When pasting into a Squarespace Fluid Engine Code Block, the block **must span columns 1 through 27**. If the block is partial-width, `left: calc(-50vw + 50%)` evaluates relative to the narrowed block container and drags the entire layout horizontally off-center.

### C. Editor Hydration Caution
- Squarespace's layout editor disables embedded `<script>` execution and pages initiate at `opacity: 0` before reveal observers mount.
- **Never delete or attempt to "fix" an apparently empty code block inside the editor.** Test and inspect only on the live published URL in a private/incognito window.

### D. Brand Bible v1.0 Design Tokens & Copy Standards
- **Palette Tokens:**
  - Midnight: `#12355B`
  - Gold: `#C9A96E`
  - Sandstone: `#F4EFE6`
  - (Corrected 2026-09-18. This section previously listed #05070B / #D4AF37 /
    #F5F2EB, which appear nowhere in the code. All 8 files in `pages/` declare
    the values above, identically. Following the old values would have
    restyled the entire site.)
  - Voyage / Sunrise / Canopy accent tokens as defined in `pages/global-custom-css.css`
- **Typography:** Source Sans 3 (body) + Cormorant Garamond (headlines). Headings use 600-weight without italic accents (`<em>` carries gold color only, never `font-style: italic`).
- **Retired Vocabulary Filter:** Strictly avoid banned copy:
  - Banned terms: "a rare few experience it", "by invitation only", "inner circle", "dream vacation", "bucket list", "hidden gem", "wanderer", "book now".
  - Active signature: *"Curated Personally."*

### E. Legal & Compliance Disclosures
- The Fora Seller of Travel registration text is legally required on the site footer (`pages/footer-content.html`) and must be maintained across all page updates.

