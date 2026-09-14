# Google Search Console — submission handoff

**Written 2026-09-13.** For whoever has Squarespace dashboard access (the
browser-based Claude session, or Bikram directly). Everything here was verified
live against `https://www.travellikeandy.com` on 2026-09-13.

**Do the three fixes first, then submit.** Submitting before fixing means Google
indexes Squarespace's demo blog posts under Andy's brand.

---

# CORRECTION 2 — 2026-09-14. ANSWERED: the four posts are REAL.

**The question "are those four posts Andy's writing?" is settled, and my first
correction below was still wrong about it.** I hypothesised "probably template
seed copy". The repo's own records say otherwise, and they are authoritative.

`HANDOFF_NOTES.md` line 78 (dated 2026-08-17):

> *the separate native blog collection at `/journal-native-draft` — now fully
> styled and layout-fixed — **already has 4 real published posts** (Redefine
> Success, Small Steps Create Big Shifts, Turn Intention Into Action, Make Room
> for Growth). The remaining step isn't writing content, it's swapping
> `/journal` from the teaser stub to the real collection.*

And line 212 (confirmed 2026-08-10):

> *the native collection's real slug is `/journal-native-draft` (published, 4 real
> posts already on it) — `pages/journal.html`'s "Read the Journal" button already
> links there correctly, not a guess.*

**Prior sessions did substantial styling and layout work on that collection.**
Deleting those posts would have destroyed real, worked-on content.

## Why my "seed copy" evidence was weak

- `og:description` identical across posts ("It All Begins Here") — this is a
  **site-wide social default** Squarespace applies when a post sets no custom
  description. Not evidence of seed content.
- May 28 2019 date and unfixed demo slugs — consistent with posts **created from
  seed entries and then rewritten**, which is exactly what the repo describes.
- "No travel vocabulary" — a reasonable observation about fit, but a judgement
  about editorial direction, not authorship.

Whether Andy personally typed the prose is still unconfirmed and is now a
**content-direction question for him**, not a blocker and not a cleanup task.

## The actual outstanding work (from HANDOFF_NOTES, not from this document)

Swap `/journal` from the teaser stub to the real collection, and update the
"Read the Journal" button and nav accordingly. That is a **decision point for
Andy**, not a defect.

## Standing instruction

**Delete nothing in `/journal-native-draft`. Do not apply the SEO hide toggle to
it either** — it is the real blog, and hiding it would de-index actual content.

Everything in CORRECTION 1 below about `/home`, the inert 301, and the harmful
fallback still stands. Only the authorship question is revised here.

---

# CORRECTION — 2026-09-13, after a live execution attempt

**Two findings in this document were wrong. Both are corrected here. The
sections below are left unedited as the record of what was originally claimed.**

The browser extension attempted the fixes, refused Task 1, and was right to.

## Wrong finding 1: the "demo posts" are not demo posts

I read the **slugs** in `sitemap.xml` (`blog-post-title-two-t5my5-…`) and concluded
the posts were Squarespace sample content. **I never fetched a single title or
body.** The URLs were in the sitemap and one `curl` would have settled it.

The four posts are actually titled:

| Slug (still the demo slug) | Actual title |
|---|---|
| `blog-post-title-…-3zaa9` | Redefine Success |
| `blog-post-title-two-t5my5-…` | Small Steps Create Big Shifts |
| `blog-post-title-three-y3peb-…` | Turn Intention Into Action |
| `blog-post-title-four-lr658-…` | Make Room for Growth |

Titles and bodies were rewritten; the URLs never were. That mismatch is what
made the sitemap read as demo content.

**The premise was also inverted.** `/journal` is the placeholder — it has section
headers, no posts, and says *"The first dispatches are being prepared for the new
native blog collection."* `/journal-native-draft` is where the real prose lives.
So "delete the draft, keep /journal" was backwards.

### Is the prose Andy's? Evidence says probably not, but confirm

Pointing to Squarespace **template seed copy from a coaching/wellness template**:

- Titles are self-improvement, not travel: *Redefine Success*, *Make Room for Growth*
- `og:description` is **identical on every post**: "It All Begins Here" — a
  template default, not per-post writing
- Zero travel vocabulary in the post bodies on a luxury-travel site
- All dated **May 28 2019**, a classic Squarespace seed date, long before this
  site's brand work
- Slugs were never updated, consistent with seed posts lightly edited

**Not conclusive. Ask Andy whether he wrote those four.**

## Wrong finding 2: the duplicate homepage was mostly a non-problem

I checked `rel="canonical"` on `/` and asserted a duplicate-content problem
**without checking `/home`**. It carries:

```html
<link rel="canonical" href="https://www.travellikeandy.com"/>
```

Google already consolidates the two. There was little to fix.

**The 301 does not work either.** `/home -> / 301` was added to URL Mappings and
saved, but `/home` still returns HTTP 200 with 0 redirects — verified live.
Squarespace applies mappings only when **no real page** matches, and `/home` is a
real page. The rule is inert. Harmless, but remove it to avoid confusing a
future reader.

**Do NOT use the fallback this document originally suggested.** `/home` is the
homepage's own slug — the same page serves `/` and `/home`. Turning on "Hide this
page from search engines" there would **de-index the actual homepage**.

## What to do instead

1. **Delete nothing.** The extension's refusal was correct. Deletion is
   irreversible and the content may be real.
2. **Ask Andy** whether he wrote those four posts, and which of `/journal` or
   `/journal-native-draft` is meant to be the live Journal.
3. **The blog question does not block Search Console.** Verification and sitemap
   submission are independent of it, and a sitemap can be resubmitted any time.
   Do Task 3 now; settle the Journal separately.
4. If the posts turn out to be seed copy, the reversible fix is
   **Page Settings → SEO → Hide from search engines** on
   `journal-native-draft` — not deletion.

## Also flagged during execution

The signed-in Google account was **gojosaturo42886@gmail.com**, which is not the
address associated with this project. **Confirm the intended owner before
verifying** — moving a Search Console property between accounts afterwards is
avoidable friction.

---


---

---

## Copy-paste prompt for the browser extension

Self-contained on purpose — it works even if the extension cannot read this
file. The STOP RULES come first deliberately: the agent reads top-down, and the
irreversible step is in Task 1.

````markdown
You have access to my browser where I'm logged into Squarespace (site:
travellikeandy.com) and Google. Do the following in order. Work carefully —
one step of this is irreversible.

## STOP RULES — read before touching anything

1. The ONLY irreversible action here is deleting blog posts. Squarespace has no
   undo and no trash for this. Everything else reverts in seconds.

2. TWO PAGES HAVE CONFUSINGLY SIMILAR NAMES:
      /journal-native-draft  = Squarespace DEMO content -> delete its sample posts
      /journal               = Andy's REAL Journal page -> DO NOT TOUCH, EVER

3. Before deleting ANY post, confirm ALL THREE:
      (a) its URL starts with /journal-native-draft/  — NOT /journal/
      (b) its title is exactly one of: "Blog Post Title One", "Blog Post Title
          Two", "Blog Post Title Three", "Blog Post Title Four"
      (c) its body is Squarespace lorem-ipsum filler, not real writing
   If any one fails -> STOP and ask me. Leaving demo posts up another week is far
   better than deleting real content.

4. Change NOTHING I don't name below. No theme edits, no navigation or page
   reordering, no content rewrites, no design changes.

5. If anything is ambiguous or the UI doesn't match these steps, STOP and report
   back rather than guessing.

## TASK 1 — delete the demo blog posts

Squarespace -> Pages -> open the `journal-native-draft` page (a blog collection).
Delete the four sample posts named in rule 3(b), applying all three checks each
time.

Then handle the page itself: delete `journal-native-draft` entirely if Andy's
real Journal is the separate `/journal` page (it is). If you're unsure, instead
move it to "Not Linked" AND turn ON Page Settings -> SEO -> "Hide this page from
search engines".

IMPORTANT: unlisting a page does NOT remove it from sitemap.xml. Only the SEO
hide toggle does. Do not skip the toggle if you choose that route.

## TASK 2 — fix the duplicate homepage

Right now `/` and `/home` both return HTTP 200 with no redirect, so Google sees
two competing homepages.

Squarespace -> Settings -> Advanced -> URL Mappings -> add this line:

    /home -> / 301

If URL Mappings isn't available, instead open the `/home` page -> Page Settings
-> SEO -> turn ON "Hide this page from search engines". Tell me which you did.

## TASK 3 — Google Search Console

1. Go to search.google.com/search-console
2. Add property -> choose "URL prefix" -> enter: https://www.travellikeandy.com
3. Choose "HTML tag" verification. Google shows a meta tag like:
       <meta name="google-site-verification" content="SOME_TOKEN" />
4. Copy it. In Squarespace: Settings -> Advanced -> Code Injection -> HEADER.
   Paste it on its own line at the VERY TOP, above the existing <style> blocks.
   Do not modify or delete anything already in that field. Save.
5. Back in Google, click Verify.
6. Once verified: Sitemaps -> enter `sitemap.xml` -> Submit
7. Then: URL Inspection -> paste https://www.travellikeandy.com -> Request Indexing

## REPORT BACK

- Which posts you deleted (exact titles), and which you skipped and why
- What you did with `journal-native-draft` (deleted / hidden)
- Which method you used for `/home` (301 mapping or SEO hide)
- The full google-site-verification meta tag, verbatim — I need to commit it to
  the repo
- Whether verification succeeded and whether the sitemap submitted cleanly
- Anything that looked different from these instructions
````

## READ FIRST if an agent is executing this

Fix 1 is the **only irreversible step in this document**. Squarespace blog-post
deletion has no undo and no trash. Everything else — URL Mappings, SEO toggles,
the verification tag — is reversible in seconds.

**Two pages have similar names. Only one is demo content:**

| Page | What it is | Action |
|---|---|---|
| `/journal-native-draft` | Squarespace template demo | **Delete its 4 sample posts** |
| `/journal` | **Andy's real Journal page** | **DO NOT TOUCH** |

**Before deleting any post, confirm all three:**

1. Its URL begins `/journal-native-draft/` — *not* `/journal/`
2. Its title is literally one of: *Blog Post Title One*, *Blog Post Title Two*,
   *Blog Post Title Three*, *Blog Post Title Four*
3. Its body is Squarespace lorem-ipsum filler, not Andy's writing

**If a post does not match all three, stop and ask.** A post with a real title,
or any post under `/journal/`, is Andy's content — losing it is a worse
outcome than leaving demo posts indexed for another week.

**Change nothing this document does not name.** No theme edits, no navigation
reordering, no page reordering, no content rewrites. The scope is: delete 4 named
demo posts, handle one draft page, add one URL mapping, paste one meta tag.

**If unsure at any point, report back rather than guessing.** Nothing here is
urgent enough to justify a wrong irreversible action.


---

## Verified state (no action needed on these)

| Check | Result |
|---|---|
| Site live | HTTP 200 |
| `noindex` present? | **No** — site is indexable |
| Canonical on `/` | `https://www.travellikeandy.com` — correct |
| Googlebot blocked? | **No** — `robots.txt` only blocks `/config`, `/search`, `/api/`, `/static/`, query params |
| `sitemap.xml` | Exists, declared in `robots.txt`, **12 URLs** |

Squarespace generates `sitemap.xml` and `robots.txt` automatically. Neither is in
this repo and neither should be hand-edited.

---

## Fix 1 — delete the Squarespace demo blog posts

**5 of 12 sitemap URLs are template placeholder content (42%):**

```
https://www.travellikeandy.com/journal-native-draft
https://www.travellikeandy.com/journal-native-draft/Blog Post Title One-3zaa9-zlxng-xbkmm-2pknr
https://www.travellikeandy.com/journal-native-draft/blog-post-title-two-t5my5-k4xmd-47fwc-4z885
https://www.travellikeandy.com/journal-native-draft/blog-post-title-three-y3peb-4lwnz-5xrlp-lamec
https://www.travellikeandy.com/journal-native-draft/blog-post-title-four-lr658-tcthp-7nadf-ynblg
```

**Why it matters:** these are Squarespace's built-in sample posts. Google can
index "Blog Post Title One" and show it in search results for the brand.

**Steps in Squarespace:**
1. **Pages** → find the **`journal-native-draft`** page (blog collection).
2. Open it. For each of the four sample posts — *Blog Post Title One / Two /
   Three / Four* — click the post → **⋯** → **Delete**.
3. Then decide about the page itself:
   - If the real Journal is the separate `/journal` page (it is in the sitemap),
     **delete `journal-native-draft`** outright, or
   - If it is still being worked on, move it to **Not Linked** *and* set
     **Page Settings → SEO → Hide this page from search engines**. Unlisting
     alone does **not** remove it from the sitemap; the SEO toggle does.

**Note:** a page named `-native-draft` is currently being advertised to Google.
Whichever option is chosen, it should not stay indexable under that name.

## Fix 2 — the malformed URL

```
/journal-native-draft/Blog Post Title One-3zaa9-zlxng-xbkmm-2pknr
                      ^^^^ literal spaces and capital letters
```

This encodes as `%20` in the live URL. It is malformed and looks broken when
shared. **Fix 1 removes it** (deleting the post deletes the URL) — no separate
action needed, listed here so it is not treated as a second task.

## Fix 3 — duplicate homepage

`/` and `/home` **both return HTTP 200 with no redirect between them**, and
`/home` is separately listed in the sitemap. Google sees two homepages competing
for the same content, which splits ranking signals.

**Steps in Squarespace:**
1. **Pages** → find the page currently set as **Home**.
2. Preferred: **Settings → Advanced → URL Mappings**, add:
   ```
   /home -> / 301
   ```
3. Alternative if URL Mappings is awkward: open the `/home` page →
   **Page Settings → SEO → Hide this page from search engines**.

Option 2 is the cleaner fix — a 301 passes any existing link equity to `/`.

---

## Then: submit to Google Search Console

**Step 1.** [search.google.com/search-console](https://search.google.com/search-console)
→ **Add property** → **URL prefix** → `https://www.travellikeandy.com`

**Step 2.** Choose **HTML tag** verification. Google returns:

```html
<meta name="google-site-verification" content="REPLACE_WITH_GOOGLE_TOKEN" />
```

**Step 3.** Paste it into **Settings → Advanced → Code Injection → HEADER**,
at the very top, above the existing `<style>` blocks.

**Also paste the same line at the top of `pages/header-injection.html`** in this
repo, so the repo stays the source of truth for that field — that file is the
tracked copy of the HEADER injection. Commit it. (The token identifies ownership
but is visible in the page source of every live page anyway, so it is not a
secret; it just must not be *changed* or verification breaks.)

**Step 4.** Click **Verify** in Google. Then:
- **Sitemaps** → enter `sitemap.xml` → **Submit**
- **URL Inspection** → paste `https://www.travellikeandy.com` → **Request Indexing**

---

## Afterwards — confirm it worked

Run these; they need no login:

```bash
# sitemap should now be 7 URLs, not 12, with no "blog-post-title-*"
curl -s https://www.travellikeandy.com/sitemap.xml | grep -c "<loc>"
curl -s https://www.travellikeandy.com/sitemap.xml | grep -i "blog-post-title" || echo "demo posts gone"

# /home should 301 to / (expect "301" then final URL without /home)
curl -sS -o /dev/null -w "%{http_code} -> %{url_effective}\n" -L https://www.travellikeandy.com/home

# verification tag should be present on every page
curl -s https://www.travellikeandy.com/ | grep -o 'google-site-verification[^>]*'
```

Ask this session to run them and it will confirm or flag what is still wrong.

---

## Expectations

- Indexing takes **days to weeks**. Submitting makes the site *eligible*, it does
  not make it rank.
- `/bespoke` will never be indexed. It is password-protected, and that is correct.
- `/groups` is **not in the sitemap** — if that page is meant to be public,
  check whether it is unlisted or disabled. Not fixed here because it may be
  intentional (the README documents Groups as a placeholder pending Andy's
  content).
