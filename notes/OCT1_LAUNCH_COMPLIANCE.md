# October 1, 2026 launch — California Seller of Travel compliance

**Source of truth:** TRAVELLIKEANDY LLC's Acknowledgement of Registration and
Certificate of Registration, California DOJ Seller of Travel Program, issued
2026-09-22 (Conf Id 178610), plus the state's own *Sample Disclosure Language*
at <https://oag.ca.gov/sites/all/files/agweb/pdfs/travel/disclosure.pdf>.

Nothing in this document is drafted by me. Every quoted disclosure is either
lifted from the certificate or is the Attorney General's published sample text.

---

## 1. The hard date

| | |
|---|---|
| Registration number | **2174880-50** |
| Valid from | **October 1, 2026** |
| Expires | September 30, 2027 — must be renewed before |
| Consumer funds protection | **Bond in lieu of a trust account** |
| Registrant | TRAVELLIKEANDY LLC, Gerald Andrew Eisenmann |
| Business address | 74711 Dillon Rd. Spc 417, Desert Hot Springs, CA 92241 |

The registration is **not effective until October 1**. Andy said the same
independently ("October 1 and 12:01am I am good to go"). So:

- The **REGISTRATION PENDING** notice stays live until then. It is currently on
  all 7 pages and is still accurate — registered, not yet operating.
- The CST number must **not** go up before October 1. Publishing a registration
  number before its effective date advertises a registration that does not yet
  exist.
- The WITHAI tour cannot be announced, and no payment or reservation terms can
  go live, before then.

**Everything below gets built now and pasted at 12:01am on October 1.**

---

## 2. What the registration number requirement actually says

From the AG's sample language, section A:

> Your registration number must be clearly and conspicuously displayed in **all
> advertising, promotional materials, including ... Internet sites, banner ads,
> or any writing of any kind** provided to persons in California or from
> California to any person elsewhere.

So it belongs in the **footer of every page**, not on one page.

Use the **CST** prefix. The state is explicit about why:

> You may use the abbreviation "CST" before the registration number to
> distinguish the registration number from another kind of number ... **"CST" is
> the preferable abbreviation to use. "SOT" may be confused with seller of
> travel registration programs in other states.**

    CST 2174880-50

**Mandatory Disclosure Language** — required if we describe him as a
"Registered Seller of Travel" rather than only printing the CST number, and it
must be *at least as prominent* as the registration statement:

> "Registration as a seller of travel does not constitute approval by the
> State of California."

The simplest compliant footer prints `CST 2174880-50` and carries that sentence
anyway. Carrying it is never wrong; omitting it is wrong if we use the words
"Registered Seller of Travel".

---

## 3. THREE FACTS STILL MISSING — the disclosure cannot be finished without them

These are not stylistic choices. The mandatory wording **changes completely**
depending on the answers, and two of the three are Mandatory Disclosure
Language, meaning the statute dictates the words.

### 3.1 Bond company name  ❌ MISSING
### 3.2 Bond amount  ❌ MISSING

The certificate confirms a bond exists ("This business has obtained a consumer
funds protection bond") but names neither the issuer nor the amount. The
statute's required sentence has both as fill-in blanks:

> **Mandatory Disclosure Language** (choose either trust account or bond and
> fill in relevant information described in parentheses):
>
> "California law requires certain sellers of travel to have a trust account or
> bond. This business has **[a bond issued by (name of bond company) in the
> amount of $ (X).)]**"

**Andy must supply both from his bond certificate.** Do not estimate the amount
and do not guess the issuer.

### 3.3 TCRF participation status  ❌ MISSING — and this one inverts

Three mutually exclusive outcomes, and picking wrong means publishing a false
statement about consumer protection:

| Situation | Required written disclosure |
|---|---|
| **(a)** Participant, buyer in California | The long TCRF claim notice — $50 minimum, $15,000 cap, 12-month deadline, $35 fee, claim address in Chico CA |
| **(b)** Participant, buyer outside California | "This transaction is not covered by the California Travel Consumer Restitution Fund." |
| **(c)** **Not** a participant | "This Seller of Travel is not a participant in the California Travel Consumer Restitution Fund." |

(b) and (c) must **also be made orally**, before or at the time of taking
payment.

**Why this is genuinely open:** Andy referred on 2026-09-18 to "while TCRC
reviews the late fee", which implies he is in the TCRF system. But a late fee
under review is not the same as confirmed participation, and (a) and (c) say
opposite things to the customer. **Ask; do not infer.**

---

## 4. Footer block — ready the moment §3 is answered

Andy asked (2026-09-18, 11:04) for "the seller of travel number in the footer of
every page, along with the Fora partner and their IATA number."

Status of each piece:

| Piece | Have it? |
|---|---|
| Andy's CST 2174880-50 | ✅ from the certificate |
| "does not constitute approval" sentence | ✅ AG mandatory language |
| Fora Seller of Travel registrations | ✅ already live in the footer |
| Bond issuer + amount | ❌ §3.1 / §3.2 |
| TCRF status | ❌ §3.3 |
| **Fora's IATA number** | ❌ never supplied — get from Fora, do not guess |

`pages/footer-content.html` is deliberately **not** edited yet. A footer holding
a half-written mandatory disclosure is one accidental paste away from being
live, and this file is pasted by hand.

---

## 5. Itinerary / receipt disclosures — separate from the website

The certificate encloses "Disclosures From Sellers of Travel": **nine items**
that must appear on the customer's itinerary or receipt, not on the website.
These matter for the WITHAI booking and for the client app.

1. Business name, address, telephone number
2. Total to be paid, plus itemised balance due
3. Provider name, and date/time/place of each departure
4. All terms and conditions, including penalties and cancellation conditions
5. The prompt-refund statement (AG sample text, §C of the disclosure PDF)
6. The trust-account-or-bond sentence — same blanks as §3.1/§3.2
7. Consumer Protection Deposit plan claim rights, if applicable
8. TCRF claim rights, if a participant
9. Non-participation statement, if not a participant

Cancellation penalties **not disclosed in writing are unenforceable**. That is
worth Andy knowing before he takes a deposit on the WITHAI trip.

---

## 6. Open question for whoever handled the registration

The certificate says bond **in lieu of** a trust account, and the cover letter
adds a condition worth reading closely:

> "you must make certain that you maintain an 'adequate bond' ... in an amount
> at all times no less than at least equal to the amount required to be held in
> a trust account ... Should your business circumstances be such that the bond
> ... is no longer 'adequate', you must **immediately establish and use a trust
> account for the difference**."

Taking deposits on a group tour raises the amount that would otherwise sit in
trust. Whether the existing bond stays "adequate" once WITHAI deposits land is a
question for his bond agent or attorney — not for this repo, and not for me.

---

## 7. Sequence

1. Andy supplies: bond issuer, bond amount, TCRF status, Fora IATA number
2. Footer block completed in `pages/footer-content.html` — still unpublished
3. **October 1, 12:01am** — paste footer, remove REGISTRATION PENDING notice,
   publish the tour page
4. Verify on the live site in a private window, every page, that `CST
   2174880-50` and the approval disclaimer render
