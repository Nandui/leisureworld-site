# Whole-site audit and fixes — 16 September 2026

The audit covers all **48 public HTML pages**, including the 10 pages added to
bring useful information from the previous site into this website. The review
checked page purpose, content hierarchy, every link destination, button/control
behaviour, desktop/mobile layouts and the public deployment output.

## Decisions applied

- App-first booking, with a less prominent browser alternative.
- Direct phone/email contact; the non-working PHP form and handler were removed.
- Membership includes Bishopstown and Churchfield; Douglas remains separate.
- Children under 10 need an adult aged 18+ in the water, with at most two
  children per adult. Ages 10–12 need an adult in the building.
- Useful current-site information stays on the new site. External links remain
  for actual services: bookings, membership purchase, app downloads, maps,
  vouchers, recruitment, social channels and relevant official guidance.
- GitHub supplies the source; Vercel builds and publishes only `dist/`.

## What changed and why

| Finding | Implemented change |
| --- | --- |
| 195 original link instances led to 17 old informational destinations. | Reviewed their content, migrated useful information and replaced outgoing informational links. Final navigation has zero old-site links. |
| Centre pages described checking hours without giving usable hours. | Local opening-hours page, actual centre gym/swim summaries, swimming/class/pitch tables and direct centre anchors. |
| Old pages held information missing from the redesign. | Added parent account guidance, pitches, camps, teen gym, privacy, cookies and three missing policy pages. Refreshed 12 existing policy readers. |
| Generic course searches were labelled like direct bookings. | Search guidance now identifies centre/category selection; assessment buttons lead to local instructions. Repeated equivalent buttons were consolidated. |
| Camps and course dates risked looking current after expiry. | Ended camps are clearly informational. Dated NPLQ bookings and Douglas schedules have expiry behaviour and contact fallbacks. |
| Published policies conflicted with one another. | Applied the owner's confirmed rules consistently; contradictory original PDFs are audit-only, outside deployment. Family prices show the supervision limit beside the ticket. |
| Support depended on PHP mail that would not run in this deployment. | Working `mailto:`/`tel:` routes, readable contact details, recognised enquiry context and HTTP303 recovery for the retired endpoint. |
| Narrow layouts failed with enlarged text. | Fixed grid minimum widths, wrapping, disclosure layouts, footer columns and price captions; increased footer policy text size. |
| Future schedule edits could diverge between pages. | A validated JSON feed generates timetables, centre summaries, course dates and dated vacancies. Pitch pages use the same timetable source. |
| Legacy bookmarks could strand visitors after launch. | Added 68 exact redirects for 34 equivalent old paths, covering slash and slashless variants, plus the retired contact endpoint. |

The approved homepage identity and iPhone artwork are preserved. The new pool
stock photograph includes water, tile and a handrail without suggesting an
identifiable third-party facility is a LeisureWorld centre.

## Verification

- **48/48 pages reachable** from the homepage.
- **2,830 anchors and 3,253 local references** checked: no missing files,
  missing fragments, unnamed controls, placeholder links or old-site anchors.
- All pages rendered at desktop and phone widths. Layout, enlarged-text,
  keyboard and control evidence is in the browser reports below.
- Axe-core found **zero automatic violations across all 48 pages**. Some checks
  require human judgment; this is not a WCAG conformance certification.
- **15 distinct external destinations** remain after consolidating two valid
  Churchfield Maps variants. The service review inspected 16 URLs. No confirmed
  dead destination was found; Indeed blocked automated access and has a local
  contact fallback. Maps destination parameters were checked without supplying
  a visitor's location.
- **Five automated tests pass**, covering feed validation/expiry/escaping,
  public-file boundaries, contact behaviour and all configured legacy redirects.
- The production build contains **48 pages and 193 public files**. Every built
  file returned HTTP200 and exactly matched its output bytes in the local
  deployment preview. Repository files, source captures, audit reports and
  contradictory PDFs are excluded from the build.

## Evidence and maintenance

- [Every-page purpose and link decisions](page-purpose.md)
- [Final link/structure results](structural-final.json)
- [Rendered page/control inventory](link-inventory.json)
- [Browser review and interaction coverage](browser-review.md)
- [Per-page verification coverage](page-coverage.json)
- [Keyboard and interactive checks](interactive-results.json)
- [Contact context and timetable deep links](targeted-final-results.json)
- [Final narrow-screen and enlarged-text checks](resize-final-results.json)
- [Automated accessibility results](axe-results.json)
- [Legacy content and source decisions](legacy-content.md)
- [External-service checks and limitations](external-services.md)
- [Built-file HTTP verification](build-http.json)
- [Automated test run](unit-test-results.txt)
- [Link migration and redirect map](link-migration.json)
- [Content maintenance](../content-maintenance.md)
- [GitHub/Vercel deployment](../deployment.md)

Source ambiguities are handled without guessing: the invalid early Tuesday
Bishopstown swim window is omitted with a reception fallback; pitch peak cutoffs
are left to the selected booking's price; the gender report's inconsistent
interpretation is explained alongside its published number. Staff should replace
these with approved corrections when available.

No production push/deployment, app installation, payment, account registration,
real booking or message submission was performed. Authenticated third-party
flows, full assistive-technology testing and Vercel account/DNS configuration
remain outside the verified local result. The running preview is
`http://127.0.0.1:8123/`.

Raw screenshots, individual viewport snapshots and captured source markup are
local generated evidence and excluded from Git. The combined page-coverage
report and structured findings remain in the repository.
Earlier review documents elsewhere in `docs/` are historical snapshots.
