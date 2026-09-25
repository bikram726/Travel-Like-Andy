# START HERE

Orientation for anyone — human or agent — picking up travellikeandy.com cold.

**Accurate as of 2026-09-24.** `README.md` is the file index. `HANDOFF_NOTES.md`
is the chronological log. This is the map.

---

## What this is

The website for **travellikeandy LLC**, a California travel agency run by
Gerald Andrew ("Andy") Eisenmann, an independent contractor advisor with the
host agency **Fora Travel**.

| | |
|---|---|
| Site | <https://www.travellikeandy.com> |
| Repo | <https://github.com/bikram726/Travel-Like-Andy> |
| Branch | `claude/quirky-ritchie-z102u6` — this **is** the default branch |

Bikram builds and maintains the site. Andy is the client and sends requests by
WhatsApp, often urgent. Bikram relays them.

---

## 1. The one thing that governs everything: October 1

Andy **is now registered** as a California Seller of Travel.

| | |
|---|---|
| Registration | **CST 2174880-50** (his own — distinct from Fora's) |
| Valid from | **2026-10-01** |
| Expires | 2027-09-30 |
| Consumer funds | a **bond** in lieu of a trust account |
| Source | CA DOJ Acknowledgement + Certificate, Conf Id 178610 |

**The registration is not effective until October 1.** Andy said the same
himself: *"October 1 and 12:01am I am good to go."*

Until then, non-negotiably:

- the **REGISTRATION PENDING** notice stays on every page
- the **CST number must not be published** — publishing a registration before
  its effective date advertises one that does not exist
- the WITHAI tour cannot be announced, even though it is booked
- no payment options, no reservation terms

At 12:01am on 1 October all of that flips at once.

Read [notes/OCT1_LAUNCH_COMPLIANCE.md](notes/OCT1_LAUNCH_COMPLIANCE.md) before
touching anything compliance-related. It quotes the Attorney General's own
sample disclosure language, fetched from `oag.ca.gov` rather than recalled.

---

## 2. The architecture — and the thing everyone gets wrong

Squarespace 7.1. Each file in `pages/` is the **entire content of one page**,
hand-pasted into a Squarespace Code Block. No build step, no bundler, no npm,
no deploy pipeline.

> ### Git and the website are not connected.
>
> Pushing to GitHub changes **nothing** on the live site. A human must paste
> each file into Squarespace.

This has caused repeated confusion: someone fixes a bug, pushes it, and reports
it fixed. It is not fixed until it is pasted. **When reporting status, always
distinguish "in the repo" from "live".**

### Where each file goes

| File | Destination |
|---|---|
| `pages/<page>.html` | that page's **Code Block** |
| `pages/footer-content.html` | Settings → Advanced → Code Injection → **FOOTER**. *Not* a footer Code Block — getting this wrong produced two footers on every page |
| `pages/header-injection.html` | Code Injection → **HEADER** |
| `pages/lock-screen.html` | Code Injection → **LOCK PAGE** |
| `pages/global-custom-css.css` | Design → **Custom CSS** |

**URL gotcha:** the "Groups" page is served at **`/corporate`**. `/groups` 404s.

---

## 3. Hard-won rules — breaking these has already cost real damage

### A. The editor lies about Code Blocks

Squarespace's editor does not run JavaScript, and these pages start at
`opacity:0` awaiting their own `IntersectionObserver`. So **a perfectly correct
paste renders as an empty block in the editor.** Squarespace then discards a
block left empty when the panel closes.

On 2026-09-18 someone "fixed" a blank-looking block on `/about`. The page was
wiped. Because `/about` was the only page carrying the Fora registration
numbers, the whole site lost its seller-of-travel disclosure for hours —
during a regulator review.

**Never delete or re-paste a block that looks empty in the editor. Judge only
by the saved live page in a private window.**

### B. The Code Block must be CENTRED — not full width

Every page uses `width:100vw` with `left:calc(-50vw + 50%)`. The wrapper's
viewport-left resolves to `block_left − 50vw + 0.5 × block_width`, which is
zero exactly when the block's **centre** is the viewport's centre. Block width
cancels out. An **off-centre** block drags the page sideways; a narrow one does
not.

*(An earlier version of these docs said "must span columns 1–27". That was
wrong; four pages render correctly at columns 12–16. Corrected in `README.md`.)*

### C. Never invent legal text

Compliance wording comes from Andy, from Fora, or from the California Attorney
General's published samples. Never draft it. `footer-content.html` carries a
deliberate placeholder for Virtuoso disclosure language that has never been
supplied — leave it.

### D. Code Blocks, never Embed blocks

Embed takes a URL and will not run `<style>` or `<script>`.

### E. Fetch raw bytes from GitHub — never retype

A previous transcribed paste silently dropped comment blocks.

---

## 4. What is live right now

Verified by fetching the production domain, 2026-09-24. All 7 public pages
return 200; `/bespoke` returns 401 (password-gated, by design); sitemap has 12
URLs.

- REGISTRATION PENDING notice on every page (2 on `/corporate` and
  `/collections` — footer plus that page's own body notice, intentional
  redundancy after the `/about` wipe)
- Fora's registrations sitewide: CA `2151995-50`, FL `ST43973`, WA `605329242`
  — these are **Fora's**, not Andy's
- Zero "Begin a Journey" anywhere — now "Send an Inquiry"
- Zero small-group-tour advertising, zero interest-list forms
- Thailand tour flyer removed; duplicate footer blocks deleted
- Squarespace Site Animations set to **None** (they were double-fading our
  reveals — the likely cause of the reported lag)
- Footer logo image block deleted; three empty pages unpublished
- Meta descriptions no longer advertise departures
- **CST 2174880-50 not published** — correct, not effective until Oct 1

---

## 5. In the repo but not yet live — needs pasting

| File | What it adds |
|---|---|
| `about`, `access-and-care`, `bespoke`, `contact`, `groups`, `home` | **reveal failsafe** (`a5d0a2d`) — see below |
| `header-injection.html` | dead legacy lock-screen CSS removed, 3,497 → 1,733 bytes. It matched **0** elements on the real lock page while shipping render-blocking on every page |
| `tour-withai.html` | **NEW, DRAFT.** The Oct 1 tour page — `<details>` accordion itinerary, two-column inclusions, terms deliberately not collapsible. 24 placeholders and a red DRAFT banner to delete by hand |

**The reveal failsafe matters.** The reveal system fails *open* if the script
never runs — but fails **closed** if the script runs and the observer never
fires, leaving Andy's regulator-facing notice invisible on a page that looks
finished. A 2-second timer now reveals everything, but only if the observer has
not fired once.

---

## 6. Blocked — waiting on Andy

1. **Bond company name** — Mandatory Disclosure Language, a fill-in blank
2. **Bond amount** — same
3. **TCRF participation status** — three mutually exclusive disclosures, and
   (a) and (c) say **opposite** things to the customer. Andy mentioned "TCRC
   reviewing the late fee", which implies he is in the system, but a fee under
   review is not confirmed participation. **Ask. Do not infer.**
4. **Fora's IATA number** — Andy asked for it in the footer; never supplied
5. **WITHAI trip facts** — dates, price, deposit, cancellation terms, itinerary

---

## 7. Open risks

**Bespoke password not rotated,** or not confirmed. It was published in this
public repo and remains in git history — scrubbing files does not remove it,
and the scrub actually *increased* history occurrences, because the deletion
diff records the old text. `/bespoke` is still gated by it. Only changing the
password in Squarespace fixes this.

**Web3Forms domain restriction unverified.** The contact form posts to
`api.web3forms.com` with a key that is public by design. Without domain
restriction it is an open mail relay into Andy's inbox.

**No privacy policy, terms or refund policy.** All URLs 404. The contact form
already collects name, email, phone, destination, travel dates, party size and
free text, and sends it to a third party Squarespace does not archive — so
there is no record of who was solicited. See
[notes/PRIVACY_AND_TERMS_BRIEF.md](notes/PRIVACY_AND_TERMS_BRIEF.md). This
blocks payments on Oct 1 and blocks the client app entirely.

**Four demo blog posts still published** at `/journal-native-draft` — same body
text under four different titles, another account's stock images, all dated
2019-05-28. Decision made: unpublish, no redirects. Not yet done.

---

## 8. How to work on this

- `git pull` **before** editing, `git push` **immediately** after. Multiple
  Claude sessions work this branch.
- **Verify by fetching the live site**, not by trusting the repo or the editor.
- Read [notes/OCT1_LAUNCH_COMPLIANCE.md](notes/OCT1_LAUNCH_COMPLIANCE.md) and
  [PROJECT_RULES.md](PROJECT_RULES.md) first.
- Distinguish **"verified absent"** from **"could not check"**. Never give an
  all-clear you did not confirm.
- This repo is the **website only**. Nothing else belongs in the folder.

---

## 9. The goal

Have travellikeandy.com legally and visually ready to sell travel at **12:01am
on 1 October 2026**: the registration notice swapped for the CST number and
full disclosures, the WITHAI tour published with binding written terms, and
nothing on the site the California Seller of Travel Act would object to.

Everything else — the client app Andy wants, the Spanish-language expansion,
real Journal content — comes after that date.
