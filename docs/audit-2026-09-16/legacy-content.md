# Legacy content audit — 16 September 2026

## Scope and evidence

The initial 38 public HTML pages contained 195 ordinary anchors to 17 distinct informational URLs on leisureworldcork.com. Canonicals, social metadata, structured data and email addresses were excluded: the production domain remains the same. All 17 linked destinations returned HTTP 200. The source pages were read, including their tables, images, links and relevant linked official documents. This is a fresh audit, not a reuse of earlier audit claims.

`legacy-inventory.json` preserves every original page/label occurrence. `legacy-sources.json` preserves retrieval results, extracted text, tables and links. `sources/` preserves fetched HTML and extracted page/PDF text. `documents.json` gives document source URLs, local paths, SHA-256 checksums, page counts and full extracted text. Sixteen official PDFs (33 pages in total) and the official 2026 price poster were downloaded. PDFs were rendered for visual inspection; the price poster was read visually. No official pool/class timetable PDF was linked by the current timetable pages: those schedules are HTML tables.

## Decisions and destinations

| Original route | Purpose and disposition | Local destination |
| --- | --- | --- |
| `/opening-hours/` | Essential visit planning; migrate exact gym, public-swim and pitch tables, with review date and source anomalies recorded. | `opening-hours.html` and centre anchors |
| `/about/` | Explain management and community role; retain useful facts without another external information loop. | `about.html` |
| `/privacy-policy/` | Required explanation of data handling; replace obsolete WordPress-era website claims with the actual no-form, no-tracking implementation. Retain original 2020 statement in audit evidence. | `Policies/privacy-policy.html` |
| `/cookies-policy/` | Explain current site cookies accurately. Old plugin/cookie catalogue does not describe the new site. | `Policies/cookie-policy.html` |
| `/accessibility/` | Practical access information and inclusion policy; migrate to centre access page and full local policy. | `accessibility.html` |
| `/health-wellbeing/functional-zone/` | Clarify referral-only programme; retain Bishopstown location and HSE Community Physiotherapy referral path. | `accessibility.html#functional-zone` |
| `/all-weather-pitch-cork/` | Useful facilities, prices, cancellation and booking information; give a local page rather than sending readers to old site. | `pitches.html` |
| `/summer-activity-camps/` | Useful age group and preparation information. Summer 2026 finished 21 August; remove live-booking language for expired weeks. | `camps.html` |
| `/careers-at-lw-management/` | Describe roles and benefits locally, use the real external hiring service for live applications. | `careers.html`; Indeed for applications |
| `/locations/leisureworld-douglas/` | Essential current Douglas swim times and separate prices. | `Centres/douglas.html#hours` |
| `/teen-gym-cork/` | Explain compulsory induction, guardian attendance, ages, academy and next step. | `teen-gym.html` |
| `/locations/leisureworld-bishopstown/fitness-classes-bishopstown/` | Useful class explanations; integrate locally rather than a generic information exit. | `gym.html#classes` |
| `/locations/leisureworld-bishopstown/fitness-classes-timetables-bishopstown/` | Essential current class schedule; migrate as updateable structured data. | `opening-hours.html#bishopstown-classes` |
| `/locations/leisureworld-churchfield/fitness-classes-timetables-churchfield/` | Essential class schedule; migrate three advertised Aqua sessions. | `opening-hours.html#churchfield-classes` |
| `/prices/` | Essential comparison of PAYG and membership; migrate figures and resolve source conflicts explicitly. | `pricing.html` |
| `/training/nplq-courses/` | Course facts and next dated session; remove expired August course. Retain genuine external course booking service. | `Certfictaons/Cert.html#nplq` |
| `/swimming-lessons-cork/swim-lessons-parent-help/` | Useful account setup and progress instructions; migrate steps and remove 2017 UI screenshots. | `parent-guide.html` |

## Confirmed practical facts

- Bishopstown and Churchfield gym hours: Monday–Thursday 07:00–20:45, Friday 07:00–19:45, Saturday/Sunday 09:00–17:45, bank holidays 10:00–17:45. These are gym opening hours, not uninterrupted public swimming hours.
- Pitch hours at both centres: Monday–Thursday 10:00–21:00, Friday 10:00–20:00, Saturday/Sunday 10:00–18:00. Bank holiday pitch hours are not separately stated.
- Churchfield public swimming and both Bishopstown pool schedules are preserved row for row in `legacy-sources.json`. The source says these can change with availability and school holidays.
- Douglas page is explicitly labelled September–December 2026: Monday–Friday 08:00–09:40 and 13:00–13:40; Saturday 13:00–15:40; Sunday closed. Public swimming is restricted by school and club bookings.
- Bishopstown class timetable has Monday–Saturday rows, each advertised at 45 minutes. Churchfield advertises Aqua Monday, Wednesday and Friday at 09:30; no duration is stated.
- NPLQ: Bishopstown, 27–31 October 2026, 09:00–18:00, €500. Price includes learning materials, assessment, logbook and two-year qualification. Candidates must be at least 16, swim 50m in under 60 seconds and 100m continuously, surface dive and tread water. The page specifies 36 hours training before assessment, with a 20-hour renewal route. The 18–22 August course has expired. Direct October booking `/enterprise/program/8699` returned 200 and advertised €500.
- Teen gym: public page advertises ages 13–17, induction with a parent/guardian, and a €9 teen visit. Admission rules distinguish teen sessions 13–15 and student sessions 16+. Academy at Bishopstown Saturday girls 14:00, boys 15:00, 45 minutes. Churchfield academy is “coming soon,” not a current bookable session.
- Camps: ages 5–10, Bishopstown and Churchfield; no Douglas camps advertised. Summer 2026 ran 09:00–15:00 at €130 per five-day week; final week ended 21 August. The generic PDF explains clothing, swim hat, independent changing, packed lunches and no vending access; no new season is invented.
- Pitches: Bishopstown four six-a-side pitches €50 off peak/€66 peak; Churchfield eight five-a-side pitches €45/€55. Full-refund cancellation requires 48 hours’ notice. Show the chosen booking’s price rather than guessing a disputed peak cutoff.
- Functional Zone: adapted training at Bishopstown for people with neurological conditions; access currently only through HSE Community Physiotherapy referral. LeisureWorld does not choose referrals.
- Careers: official page points to `https://ie.indeed.com/cmp/Leisureworld-Cork/jobs` and seven individual role links. Full descriptions were captured. The full-time Douglas lifeguard listing inconsistently calls itself part-time later; avoid presenting contradictory contract claims.
- About: organisation established 1997; manages LeisureWorld Bishopstown, Churchfield and Douglas, Mahon Golf Course and St Peter’s Cork on behalf of Cork City Council. Bishopstown opened 1997; management of Churchfield began 2005, Douglas 2012, St Peter’s 2016.

## Source conflicts and owner decisions

These were problems in the existing authoritative source, not invented corrections:

1. **Child supervision:** General Admission reviewed 29 June 2026: under 10 adult in water 1:2, ages 10–12 adult in building. Child Admission appendix of the same review date: ages 0–10 in water, 11–13 adult on premises. July 2026 terms still say under 8 and 8–10. **Owner confirmed on 16 September: under 10 in water 1:2; ages 10–12 adult in building.** Local HTML follows that confirmation. The contradictory child and terms PDFs are retained only in `original-documents/`, outside the public build.
2. **Membership coverage:** 2026 price poster says membership includes Douglas; prices page specifies Bishopstown/Churchfield. **Owner confirmed Douglas is separate.** Local information follows the owner. The conflicting poster is audit evidence only.
3. **Bishopstown Tuesday 18m pool:** the source contains the impossible range “9am–8am” followed by 10:30–13:00. Do not repair the first range by guessing. Keep confirmed sessions and advise visitors to check early-morning availability.
4. **Pitch peak times:** poster says Monday–Thursday 17:30–21:00; pitch page says 18:00–21:00; prices page says 17:00. Rates agree. Local page shows peak/off-peak amounts and asks readers to confirm the selected slot during booking.
5. **Gender pay gap:** published 2025 report introduction, table and appendix show part-time median +50.92% and introduction says men; analysis says women. Local report retains +50.92% as reported and explicitly identifies the conflicting direction. No replacement number or sign has been invented.
6. **Privacy/cookies:** privacy is dated 5 October 2020 and describes forms, Google analytics and WordPress-era systems. New site uses direct phone/email, has no onsite submission or database, first-party cookies or tracking scripts. Local pages describe observed implementation and external-service boundaries; original statements remain in audit evidence.
7. **Safeguarding document:** wording says two designated people but lists three names. Local page preserves the three named contacts without asserting a count.

## Policy work completed

Existing readers now link to intact local published documents where those documents do not contradict the owner’s clarified rules. July 2026 terms’ supplement paragraph replaced outdated food/drink text; rule links were restored; cancellation and refund terms were preserved. Child admission, clean sport and supplements pages were added. Parent-supervision rules are consistent with the owner’s confirmation. Environmental policy review date corrected to 29 June 2026. Safeguarding confidentiality paragraph restored. Repeated pool-admission link and repeated customer-charter introduction removed. The policy directory groups visit rules separately from organisation policies.

The source documents are downloadable originals, not recreated or modified PDFs. Their links, page counts and hashes are recorded in `documents.json`. Original terms/child admission PDFs and the price poster are evidence only due to contradictions resolved above.

## Date sensitivity and maintenance

Opening hours, classes, public swimming, prices, course dates, camps and vacancies must have a review date and be updated by staff. The new structured timetable feed is a manual source of truth, not a live synchronisation with Legend. Availability is still checked in the booking service. Expired dates should not remain as active offers. Staff should confirm the unresolved early Tuesday swim period, pitch price boundary and gender-report interpretation.

## Verification of this work

All new pages have one H1 and use the existing shared navigation and responsive styles. Their local file and fragment links were checked; at handoff only the root agent’s in-progress `opening-hours.html` remained to be generated. Browser booking login and the October NPLQ course returned HTTP 200. No bookings, applications or messages were submitted.
