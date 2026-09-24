# Privacy and Terms — what the site actually does, and what has to be decided

**Status: the site has no privacy policy, no terms, and no refund policy.**
Verified 2026-09-24: `/privacy`, `/privacy-policy`, `/terms`,
`/terms-of-service`, `/legal`, `/cookie-policy` and `/refund-policy` all return
404, and nothing in the footer or navigation links to one.

This document contains **no drafted policy text**. Policy is a legal decision
and inventing it would be worse than having none. What follows is the factual
record of what the site does with personal data — which I can state precisely,
because I can read the code — plus the decisions only Andy or his attorney can
make.

Related: [OCT1_LAUNCH_COMPLIANCE.md](OCT1_LAUNCH_COMPLIANCE.md) covers the
California Seller of Travel disclosures, which are a separate obligation.

---

## 1. What the site collects today

The contact form at `/contact` collects, in one submission:

| Field | Type of data |
|---|---|
| `name` | identity |
| `email` | contact, and a persistent identifier |
| `phone` | contact, and a persistent identifier |
| `destination` | where the person intends to travel |
| `travel_timing` | when they intend to be away from home |
| `traveler_count` | household / party composition |
| `trip_type` | inferred affluence and life events (honeymoon, family) |
| `referred_by` | social graph |
| `message` | free text, unbounded — may contain anything |

Travel plans plus dates plus party size is a meaningful disclosure: together
they describe when a named person's home will be empty. That is worth stating
plainly because it raises the stakes on where the data goes.

## 2. Where it goes — and what does NOT happen to it

The form posts to **`https://api.web3forms.com/submit`**, a third-party US
service, using a public access key visible in page source.

Established facts:

- **Squarespace stores nothing.** These are not Squarespace Forms. There is no
  submission archive in the admin, no export, and no record of who ever
  submitted. Verified in the site audit of 2026-09-18.
- **Delivery is to `webmaster@travellikeandy.com`**, previously visible in the
  page source as a hidden field.
- **Retention is Web3Forms' policy, not Andy's.** Nobody here has checked what
  it is, whether there is a data-processing agreement, or where the data is
  stored.
- **There is no consent checkbox** and no link to any policy at the point of
  submission.

**The second consequence matters for the Seller of Travel registration too:**
with no submission record, there is no way to show who was solicited during the
period when registration was pending. That question already arose while TCRC
was reviewing the late fee.

## 3. Why this is sharper after October 1

Registration `CST 2174880-50` is effective 2026-10-01. From that date Andy
intends to publish the WITHAI tour, take reservations, and accept payment.

That changes the data picture:

- **Payment data.** Whoever processes it — Fora, Squarespace Commerce, or a
  separate processor — becomes a second data path that has to be described.
- **A refund and cancellation policy stops being optional.** California's
  seller-of-travel disclosures already require cancellation terms in writing,
  and the state's own guidance is blunt: *cancellation penalties not disclosed
  in writing are unenforceable.*
- **Client itineraries.** The app Andy described would ingest a Gmail folder
  per client trip, hold ticket barcodes, and geolocate recommendations. None of
  that can launch without a policy — and both app stores refuse submission
  without a privacy policy URL.

## 4. Questions only Andy or his attorney can answer

Nobody here should guess at any of these.

**Scope**

1. Which privacy law governs? Andy is California-registered, living in Mexico,
   serving clients in both. Note that **CalOPPA applies to commercial websites
   collecting personal information from California residents and has no
   revenue threshold** — unlike CCPA, which has thresholds a business this size
   probably does not meet. Confirm with counsel rather than relying on this
   note.
2. Does Fora's own privacy policy cover bookings made through Fora, and does
   Andy need his own for enquiries that arrive before a Fora booking exists?
   **Ask Fora directly** — this sits alongside the open question about whether
   the Seller of Travel disclosure may appear in Spanish.

**The form**

3. Keep Web3Forms, or move to something with a data-processing agreement and a
   retention policy Andy controls? Related open item: Domain Restriction on the
   Web3Forms key is still unverified, and without it the key is an open relay.
4. Should submissions be retained at all, and for how long? Retention has to be
   a decision, not an accident.
5. Does a consent checkbox belong at the point of submission?

**October 1**

6. Who processes payment, and under whose terms?
7. What are the actual cancellation and refund terms for the WITHAI trip? These
   must be in writing before a deposit is taken.
8. Does the bond disclosure wording differ between the website and the
   itinerary/receipt? See OCT1_LAUNCH_COMPLIANCE §3 and §5.

**The client app**

9. Gmail ingestion needs Google OAuth and a security assessment for restricted
   scopes. Weeks, and a cost. Worth confirming before any build starts.
10. AI-generated personalisation from client profiles is automated processing
    of personal data and needs its own consent language.

## 5. What can be done without a lawyer

Two things are just facts and need no drafting:

- **A link to a policy page in the footer**, once one exists. The footer block
  is already the sitewide legal surface — it carries the REGISTRATION PENDING
  notice and the Fora registrations.
- **Checking Web3Forms' published retention and sub-processor terms**, and
  enabling Domain Restriction. That is a dashboard task, not a legal one.

## 6. Recommended order

1. **Enable Domain Restriction on the Web3Forms key.** Minutes, no lawyer,
   closes a live exposure.
2. **One email to Fora** — the privacy question in §4.2, alongside the Spanish
   disclosure question already outstanding.
3. **An hour of an attorney's time** before October 1, covering §4 items 1, 6,
   7 and 8. The cancellation terms are the binding ones.
4. **Publish the policy pages and link them in the footer.**
5. **Only then** scope the client app.

Items 1 and 2 are safe to do today. Item 3 is the one with the deadline.
