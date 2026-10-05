# Homepage photographic hero — October 5, 2026

Requested a striking homepage visual, considering images, video and 3D. Reviewed the available skill catalog and relevant image-generation, Higgsfield, HyperFrames and registry instructions, the project's brand rules, existing photo library, and editorial travel design references. Selected a code-native interactive photographic composition for the website rather than a separate rendered video deliverable.

## Published design

- Navy editorial split hero with large Cormorant typography, gold rings, an arched photo frame, a raised globe seal and subtle pointer-driven CSS perspective.
- User-selected Thailand, India and Mexico photographs with matching location/caption updates and a gentle crossfade. No automatic image rotation.
- Existing real Andy photographs reused: Koh Yao Noi boat, Andy at the Taj Mahal and Cabo dinner table. No generated destination photography or new service claims.
- Inquiry CTA and a direct Explore Bespoke link, now that Bespoke is public.
- Single-column composition below 900px; minimum 52px photo-selector targets. Pointer depth is enabled only for a fine hover pointer and disabled for reduced motion.
- Static Thailand image without JavaScript; controls remain hidden until the interaction is initialized. Screen readers receive only the selected photo and a polite caption update.
- Explicit header clearance includes the mobile introductory line.

No new rendering library, subscription, AI generation charge, video download or WebGL dependency was introduced. Photos remain on their existing Squarespace CDN and pinned GitHub URLs. Original Home content below the hero and registration disclosures are preserved.

## Validation

Anonymous homepage fetch returns 200 with three photo controls and CST disclosure intact. All three source images load. Live photo selection and keyboard Space activation checked. At 320, 390, 768, 1366 and 1920 CSS pixels: one h1, zero horizontal overflow, zero failures in the audit's sampled text contrast set and CTA heights of 46px. Photography overlays inspected visually; sampled contrast checks are not a complete WCAG certification. Reduced-motion and no-JS fallback verified in source.

Before-edit public HTML, exact code-block backup and isolated preview are outside the repository at `C:/Users/bikra/.codex/backups/travel-like-andy/oct5-home-preview/`. Live screenshots/results are at `C:/Users/bikra/.codex/backups/travel-like-andy/oct5-home-live/`.

## Inspiration

- [Many Moons editorial travel concept](https://lazarolondon.com/work/many-moons-travel-concept)
- [Travel by Andi design case study](https://blairstaky.com/crisp-whimsical-showit-website-for-travel-advisor-travel-by-andi/)

References informed layout direction; no competitor imagery or copy was imported.
