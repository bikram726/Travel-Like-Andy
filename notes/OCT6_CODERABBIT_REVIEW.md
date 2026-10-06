# CodeRabbit review — October 6, 2026

Completed with official CodeRabbit CLI 0.8.2 against committed HEAD `da45864`, comparing to initial commit `6c0f4089276b25775f85be5f4e00abfa1e4adc93`. Command: `coderabbit review --agent --deep --committed --base-commit 6c0f4089276b25775f85be5f4e00abfa1e4adc93 -c PROJECT_RULES.md`.

CodeRabbit completed successfully, reviewed 35 text files, excluded 66 binary image files, and returned eight findings: two major and six minor. This is a Git diff review with project context, not a complete runtime or security certification. No website changes or suggested fixes were applied during this review.

| Severity | File | CodeRabbit finding | Assessment |
|---|---|---|---|
| Major | `scripts/audit_site.py:29` | Catch HTTPError and continue the inventory instead of aborting on a 404. | Confirmed in source: urlopen has no exception handling and inventory is written only after the loop. |
| Major | `notes/SEO_GSC_HANDOFF.md:209` | Remove unverified `/home` mapping and search-hiding instructions. | Valid caution: hiding the actual homepage could affect indexing. Correct only after identifying the Squarespace page and canonical route. |
| Minor | `pages/tour-withai.html:147` | Closed details descriptions may remain hidden in print. | Draft-template concern. Current rule only sets child display; print behavior needs browser validation before implementing a fix. |
| Minor | `pages/collections.html:65` | Use a dedicated Collections Web3Forms key. | Configuration recommendation, consistent with existing code comment. Requires a real key and recipient configuration; do not invent or replace it with a placeholder. |
| Minor | `README.md:30` and `START_HERE.md` | Update password and registration status. | README inventory is stale. START_HERE already has October 5 superseding status, but older warnings remain confusing. |
| Minor | `notes/SEO_STRATEGY.md:59` | Replace allegedly retired `/corporate` route with `/groups`. | Reject automatic route change: published Groups intentionally remains at `/corporate`, as confirmed during live work. Updating its title wording may be useful independently. |
| Minor | `notes/GLOBAL_RESEARCH_BRIEF.md:39` | Stop describing hreflang as the only locale lever. | Confirmed internal contradiction: preceding paragraph lists multiple geographic signals. |
| Minor | `notes/SEO_GSC_HANDOFF.md:169` | Treat journal-native-draft as four real posts and preserve it. | Conflicts with October 5 publication record: collection was identified as demo content and disabled. Do not restore or delete based on this finding without verifying the actual posts. |

Priorities: make the audit resilient; correct unsafe/stale handoff guidance; validate draft print behavior. Form key isolation requires dashboard configuration. CodeRabbit did not report a defect in the latest homepage photo controls or mobile-number field.
