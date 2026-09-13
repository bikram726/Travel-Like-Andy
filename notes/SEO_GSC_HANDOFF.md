# Google Search Console — submission handoff

**Written 2026-09-13.** For whoever has Squarespace dashboard access (the
browser-based Claude session, or Bikram directly). Everything here was verified
live against `https://www.travellikeandy.com` on 2026-09-13.

**Do the three fixes first, then submit.** Submitting before fixing means Google
indexes Squarespace's demo blog posts under Andy's brand.

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
