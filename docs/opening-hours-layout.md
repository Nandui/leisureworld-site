# Opening hours and timetables

The opening-hours page keeps the shared header, secondary-page title scale,
Archivo typography and navy/pale-blue palette. Its layout is organised around
the visitor's task: choose a centre, then an activity, then read the week.

## Content and interaction

- `scripts/build-content.mjs` renders the timetable from
  `data/visit-information.json`. No session times, phone numbers, exceptions or
  programme requirements were changed for this layout.
- `opening-hours.js` enhances ordinary anchor links. One centre and activity
  are shown at a time, with a visible selected state and a polite announcement
  when the selection changes. Links retain standard keyboard activation and
  open-in-new-tab behaviour. These are navigation links, not ARIA tabs.
- Changing centres retains the activity when available. Douglas falls back to
  swimming because it has no gym, classes or pitches in the feed.
- Existing centre, pool, class and pitch fragment identifiers remain valid.
  Direct links and browser history reveal the relevant schedule.
- Without JavaScript, all schedules are readable and the same links jump to
  their sections. Print styles include all centres and activities without
  revealing expired information.
- Tables retain captions, column headers and row headers. Swim sessions use
  separate list items; accompanying notes stay with their day.
- Seasonal expiry, notices, app booking and telephone alternatives remain intact.

## Visual structure

The image-first layout reference is stored locally at
`.impeccable/mocks/opening-hours-layout.png`. It establishes the centre selector,
activity navigation and paired swim schedules. Generated sample times and
contact text are not content sources; the maintained JSON supplies every fact.

The page uses a single white timetable area. Equivalent activities have the
same heading level, rather than a mixture of table titles and nested disclosures.
Two pools sit side by side on wide screens and stack below 1101px. Narrow
screens wrap the activity links and retain readable day/session columns.
Page-specific styles live in `opening-hours.css`; the shared centre summaries,
course listings and recruitment styles are unaffected.

## Verification — 17 September 2026

- Reviewed all nine centre/activity combinations and the existing pool anchor
  at 320px, 390px, 768px and 1440px in Chromium.
- Confirmed keyboard selection, activity retention between centres, Douglas's
  swimming fallback, browser Back/Forward and malformed-fragment handling.
- Confirmed semantic table captions/headers, control heights of at least 44px,
  and no horizontal overflow, including 320px with doubled text.
- Loaded the page with script execution disabled: all three centres and nine
  activity sections remained readable. Print includes every schedule while
  retaining the expired-timetable fallback.
- Direct links focus the destination heading or table caption. All six site
  tests, the production build and structural link checks pass.

This covers the recorded local checks, not full assistive-technology or
cross-browser conformance. Screenshots and measurements are in the ignored
`.output/hours/` folder.
