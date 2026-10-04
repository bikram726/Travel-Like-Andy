# October 2 restoration

Status: footer registration update published to Squarespace on October 2, 2026.
Groups was also published October 2 following Bikram's instruction to put Andy's messages on Groups. Home, Collections, Contact, and Header restoration changes were subsequently published October 4 during the authorized website audit. See [OCT4_SITE_AUDIT.md](OCT4_SITE_AUDIT.md) for current validation and open account work.

## Groups publication

- Expanded the top categories with Weddings, Friend Groups, and Curated Events.
- Used Travel Together. Go Deeper. as the main heading.
- Added an 8–14-person small-group how-to, all six destinations Andy named, and a Contact Andy link.
- Restored the Thailand itinerary with Sold Out and Join the Wait List linking to /contact.
- Verified the public /corporate page, complete HTML paste, script syntax, and readable how-to paragraph. No registration-pending notice remains on Groups.
- Groups source committed and pushed as c81d03c. Public-page backup and screenshot are in the private Codex backup directory.

## Approved footer publication

Bikram relayed Andy's explicit approval of the proposed registration footer.
Only the global FOOTER injection was changed: REGISTRATION PENDING and its
temporary paragraph were replaced with `travellikeandy LLC · CST 2174880-50`
and the California approval disclaimer. Existing Fora affiliation and
registration wording was preserved separately. Header, lock page, page
content, tours, forms, booking terms, and payment settings were not published.

Verified on the public Home, About, Groups (`/corporate`), Collections,
Journal, and Contact pages: exactly one global footer, Andy's CST number,
approval disclaimer, Fora's CST number, and no pending notice in the footer.
Before-publication code, verification results, and a live screenshot were
saved in the private backup outside the public repository.

Andy’s WhatsApp messages supplied by Bikram confirm October 1, 2026 at
12:01am as the launch date. They also explicitly say the WITHAI tour is booked.
The September registration-pending restrictions were temporary.

## Prepared changes

- Footer: replace REGISTRATION PENDING with travellikeandy LLC and
  CST 2174880-50 from the existing registration record. Include the state's
  approval disclaimer; preserve Fora's existing registrations.
- Groups: recover the Thailand announcement and Small Group Tours card from
  Git history. Keep the sold-out / wait-list status. Preserve current layout
  and reveal failsafe. Historical itinerary dates are October 25–November 7,
  2027; the supplied WhatsApp conversation does not revise them.
- Collections: restore hosted-departure copy and the interest-list form.
  State that submission does not create a booking or contract.
- Home: restore the Hosted Departures Collections card.
- Contact: restore Hosted departure in the journey-type dropdown. Preserve
  the non-reservation disclaimer.
- Header injection: restore hosted-departure wording in the business JSON-LD.

The old flyer quoted $3,999 per person and a $500 deposit due September 1,
2026, becoming non-refundable after October 1, 2026. That deposit deadline
has passed. These old commercial terms were not restored. Groups shows
Sold Out in the third fact card instead of advertising the historical price.

## Still needed for reservations and payments

Andy must supply approved current terms, payment destination/options, bond
issuer and amount, confirmed TCRF status, and Fora's IATA number. Privacy,
terms, and refund policy content also remains outstanding. The separate
pages/tour-withai.html scaffold still contains placeholders and is not ready
to publish. Do not present it as a finished tour page.

The state's disclosure guidance distinguishes advertising disclosures from
disclosures before or when payment is received. The missing sale-specific
details should not be fabricated or used as a reason to keep an inaccurate
registration-pending advertising notice indefinitely.

Sources:
- https://oag.ca.gov/travel
- https://oag.ca.gov/sites/all/files/agweb/pdfs/travel/disclosure.pdf
- notes/OCT1_LAUNCH_COMPLIANCE.md (existing registration record)
- dbdea57 (sold-out Thailand section), 6dba597^ (pre-removal inquiry content)
- Andy/Bikram WhatsApp transcript supplied October 2, 2026

## Publishing checklist

1. Paste footer-content.html into FOOTER Code Injection and
   header-injection.html into HEADER Code Injection.
2. Paste home.html, groups.html (live slug /corporate), collections.html,
   and contact.html into their existing Code Blocks, keeping each centred.
3. Review Home, Groups, and Collections SEO descriptions in Squarespace;
   those fields are not controlled by the page files.
4. Verify all public pages and the password lock screen in a private browser.
   Confirm the CST footer, sold-out status, and absence of pending notices.
5. Verify inquiry-form delivery with an explicitly authorized test submission.
   Static checks do not establish inbox delivery.

Original preparation checks passed for HTML container balance, JavaScript syntax, JSON-LD parsing, and whitespace. Live publishing and visual verification were completed October 4; real inbox delivery remains unverified. Local mock submissions did not send external messages.
