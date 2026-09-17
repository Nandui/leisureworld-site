# Centre visitor information

Douglas, Bishopstown and Churchfield share `centre-details.css` for their
opening-hours and contact sections. The shared hero, panoramic photographs,
facility information and app sections keep their existing layout and content.

## Hours

`renderCentreHours()` in `scripts/build-content.mjs` generates one white panel:

- A clearly titled timetable with day headers and readable session rows.
- Centre-specific guidance and separate links to relevant activity timetables
  and prices. Bishopstown and Churchfield offer swimming, classes and pitches;
  Douglas retains its pool-only guidance.
- A common footer with app booking, reception phone and the editorial check date.

Douglas's seasonal date is supporting text below “Public swim times”. The
published sessions, Sunday closure, school-term restrictions and bank-holiday
advice remain unchanged. The existing expiry wrapper still replaces the table
with the reception fallback after the timetable expires.

The JSON feed remains the source of truth. Edit the generator, not the marked
`feed:centre-hours` regions. `#hours`, `#find-us`, `#facilities`, `#home` and `#app`
remain valid destinations.

## Contact and access

Address/reception and visit guidance form distinct groups. Phone and email have
separate, comfortably sized links; admission and access links use consistent
rows. Centre-specific addresses, contact details, directions and membership
information are preserved. Hours and contact columns stack below 851px.

## Recorded checks — 17 September 2026

Reviewed all three pages at 320px, 390px, 768px and 1440px, plus doubled text at
320px. No horizontal overflow or missing images was found; dedicated visitor
actions meet the 44px target-height check. Table captions, column headers and
row headers remain semantic HTML. Hero, facilities and app sections were also
reviewed across the three centres.

Keyboard checks confirm each centre's app shortcut and all seven activity
timetable links reach the intended section. Douglas's browser expiry fallback,
all seven site tests, the production build and structural link checks pass.

Local screenshots and measurements are in `.output/centres/` (ignored). This
is a bounded Chromium review, not full assistive-technology conformance testing.
