# Website browser and navigation review — 16 September 2026

All 48 public HTML pages were rendered at desktop (1440 × 1000) and mobile (390 × 844), inventoried, and inspected through fresh screenshots. Every page is reachable from the home page. The final static inventory contains 2,830 anchors, 3,253 local references, and 15 distinct external destinations. No missing local destination, missing fragment, empty anchor, legacy informational anchor, visible unloaded image or browser JavaScript error remains in the recorded checks.

This is a practical website review, not a certification of accessibility or an assertion that every external transaction has been completed.

## Evidence and coverage

- [page-coverage.json](page-coverage.json): individual evidence for all 48 pages, including all rendered controls and their destinations, headings, visible word counts, viewport sizes, image/error checks, screenshot paths, native disclosure results, reflow results and axe results.
- [link-inventory.json](link-inventory.json): every current anchor, its label, location, surrounding heading, destination, purpose classification and local validation result. Canonical, Open Graph and schema URLs are deliberately separate from clickable old-site links.
- [browser-summary.json](browser-summary.json): final aggregate results.
- [interactive-results.json](interactive-results.json): keyboard, navigation, filters, search and all 74 native main-content disclosures across the 48 pages.
- [targeted-final-results.json](targeted-final-results.json): contact query routing and all four class/pitch timetable deep links.
- [resize-final-results.json](resize-final-results.json): final 320px and doubled-text results, combining the corrected full run with explicit focused reruns.
- [axe-results.json](axe-results.json) and [axe-incomplete-review.json](axe-incomplete-review.json): automated accessibility evidence and detailed follow-up.
- `screenshots/desktop`, `screenshots/mobile` and `sheets`: fresh complete-page captures, with detailed screenshots for the menu, timetable, activity imagery and enlarged text.

The screenshot set reflects the integrated 48-page site. Small final changes to the centre timetable link wording, swim-school FAQ region semantics, and shared 320px footer/price-caption wrapping were followed up separately. The coordinator also removed inherited, incorrect current-page markers from cloned pages and added a structural guard; this was a semantic correction with no layout change. Historical baseline and in-progress files are evidence of the investigation, not the final acceptance result.

## Information structure and reasons for links

The site now separates the principal visitor decisions: choose a centre, choose an activity, check prices and times, then book. App installation/booking is the prominent route. The browser booking service remains a quieter alternative beside app guidance. Links to independent services have a concrete purpose: app installation, bookings or membership, a voucher purchase, travel directions, a recruitment application, social updates, or consumer-rights information. Footer links repeat useful global routes without becoming the primary decision path.

Centre pages show practical facilities, concise opening information, the correct phone number, directions and local timetable links. The full opening-hours page keeps the substantial schedule information in one place, with centre jumps and collapsible class/pitch schedules. Class and pitch deep links open the correct disclosure and settle with its heading visible. Users do not need to open an old website to obtain this information.

Activity and course pages explain eligibility, location and the next useful step. Courses requiring an assessment or an enquiry route visitors accordingly. The parent guide, child admission policy, teen gym, camps and pitch pages provide local answers to previously external information needs. Camp dates are explicitly historical where new dates are not announced. Careers and course dates clearly direct visitors to the transaction provider for availability and application details.

Pricing separates Bishopstown/Churchfield from Douglas. Membership scope and supervision limits are stated alongside the decision. A new visitor can compare without mistaking a family ticket for permission to exceed the child-supervision ratio. Mobile prices retain labels when the tables become stacked rows.

The policy directory prioritises admission, child supervision, pool/gym rules, sauna/steam guidance and terms. Organisational documents are kept in a secondary disclosure. Long legal documents are necessarily longer, but retain headings, an on-page navigation control, a readable HTML version, labelled PDF links where appropriate and a contact route for another format. The reported gender-pay-gap source contradiction is disclosed instead of silently choosing a direction.

## Interactions exercised

| Family | Evidence and result |
| --- | --- |
| Keyboard entry | Tab first reaches the visible skip link; Enter targets and focuses the main content. |
| Shared menu | Opens as a native modal dialog, announces expanded state, contains keyboard focus, closes with Escape and its close button, and returns focus to the trigger. |
| Activity finder | All six choices update the visible result, pressed state and status text. |
| Gym classes | All five filter choices update cards, pressed state and result count. |
| Help search | All six categories work; an unmatched query gives a useful empty state; Clear restores the complete list and search focus. |
| Disclosures | All 74 main-content native disclosures toggle and restore. A FAQ also received a real pointer activation. |
| Timetable links | Bishopstown/Churchfield classes and pitches open the correct disclosure, with the settled target approximately 52px from the viewport top. |
| Contact context | Teen Gym sets that email subject; Douglas with Membership & Pricing selects Douglas's phone and a contextual subject; unknown values fall back to a general enquiry. Churchfield/Careers also routes correctly. |
| Contact actions | Phone/email URLs were inspected; no call, email or other message was sent. |
| Anchor destinations | Every local href and fragment is checked statically; link purposes and labels are available individually in the inventory. External transaction availability is documented by the separate destination/source audit. |

The interaction harness waits for smooth scrolling to finish before coordinate clicks. Earlier immediate-click/filter anomalies were harness timing, and were discarded after isolated, successful reruns. Deep-link measurements taken during scrolling are superseded by the settled targeted results.

## Layout and accessibility findings resolved

The screenshots show consistent heading hierarchy, readable text blocks, generous action spacing and clear primary/secondary choices. Native disclosures reduce reading load while preserving direct access to details. Wide desktop groups become stacked mobile content. Practical support remains available by phone and email, including for visitors who do not use the app.

Actual reflow issues found and corrected included the swim-school jump grid, gym centre links, the home visitor grid, summary icons, and long action labels at 320px with doubled text. The shared footer initially overflowed by 10px because its two-column grid retained automatic minimum widths. It now uses minimum-width safeguards and a single column below 360px. Enlarged price captions also needed explicit word wrapping.

The first resize harness inspected only main/header descendants. Its scope was corrected to the whole body, and document scroll width is now also checked so overflowing text inside a fitting element cannot be missed. A fresh full 48-page run plus focused reruns of about, pricing and swim school show no document width above the 320px viewport and no visible overflowing element. See the final consolidated file rather than the earlier raw intermediate result.

The automated axe scan reported zero violations across all 48 pages. It still returned incomplete checks requiring judgment, principally a dialog trigger referencing its closed popup and contrast checks affected by backgrounds/reveal states. The dialog target exists and its operation was tested. The swim-school FAQ's generic labelled container was given an explicit region role; the related incomplete result disappeared on focused follow-up. Screenshot review and shared colour checks support legibility, but are not equivalent to a full manual contrast audit of every possible visual state.

No native screen-reader/device user study or exhaustive assistive-technology compatibility test was performed. External booking, purchasing, app installation and job application flows were checked only to the authorised destination boundary. These limits are also reflected in the website's accessibility information.

## Changes owned by this audit

- `scripts/check-site.py`: excludes generated/vendor/audit folders; validates page landmarks, names, button types, control targets, URL schemes, local paths/fragments, external-link attributes and disclosures; rejects clickable legacy informational links; checks whole-site reachability from index.
- `site-accessibility.css`: text enlargement/reflow fixes for grids, summaries, labels, footer and price captions.
- `docs/audit-2026-09-16`: reproducible scripts, per-page inventories, screenshots, interaction results and this report.

Content migration, source research, operational feeds and integration changes were owned by the coordinating and research agents. Their final build/destination checks complement this browser audit.
