# Product

## Whole-site audit decisions — 16 September 2026

- The app is the primary booking route; browser booking remains a subtle alternative.
- Support uses direct phone/email. There is no contact form or email backend.
- Membership covers Bishopstown and Churchfield only; Douglas is separate.
- Under-10s need an adult aged 18+ in the water, at most two children per adult;
  ages 10–12 need an adult in the building. These owner-confirmed rules override
  contradictory historical source documents.
- The 48-page site keeps visitor information locally. External links are for
  services such as booking, app downloads, directions and recruitment.
- Hours, classes, dated courses, notices and recruitment use a GitHub-editable
  JSON feed compiled to readable HTML. This does not represent live capacity.
- Publish via the GitHub/Vercel integration, with the explicit public build in
  `dist`. Audit evidence and source scripts are excluded from deployment.
- The homepage stock photograph shows pool water, a tiled edge and handrail,
  without presenting an identifiable building as a LeisureWorld centre.
- Current findings and page purposes are in `docs/audit-2026-09-16/README.md`.

Initialization refreshed on 16 September 2026 against the current checkout and
the audit above. The user reconfirmed app bookings, practical visitor information
and community positioning, and requested reconciliation with the current code
and latest audit. Other previously recorded user decisions are retained; this
refresh does not establish new visual approvals or repeat the historical audit.
Dated review sections below describe earlier project states. The current
implementation and the 16 September decisions supersede their outdated
implementation details.

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

The primary users are visitors to LeisureWorld's public website for its three
Cork centres. Their main job is to find centre, activity, price, and availability
information so they can plan a visit without having to make an enquiry.

This priority was confirmed by the user during initialization on 2026-09-10.
The relative priority of particular visitor groups remains open; do not assume
that prospective members, existing members, or families dominate every task.

## Product Purpose

The user confirmed on 2026-09-11 that getting customers to use the mobile app
for bookings is the homepage's most important funnel. Give app discovery and
downloads primary emphasis, while helping visitors answer practical questions
about using LeisureWorld and reducing avoidable enquiries to staff.

Success means visitors can find relevant information, understand which centre
and activity it applies to, and identify the next step. No numerical target or
measurement baseline has been established.

## Positioning

The existing website presents LeisureWorld as Cork's community leisure network.
Its content covers Bishopstown, Churchfield, and Gus Healy Pool in Douglas,
with different facilities and participation options by location.

This describes the positioning in the repository, rather than independently
verified business claims. Any new claim of superiority, uniqueness, operational
impact, or partnership needs supporting evidence.

## Operating Context

- Visitors browse centre details, opening hours, activities, swimming lessons,
  membership information, prices, help, and policies across separate pages.
- The current content distinguishes pay-as-you-go visits from membership.
  Centre-specific information must not be treated as universal.
- Sign-in, booking, and online membership sign-up links lead to LeisureWorld's
  external Legend service. The repository does not implement that service.
- Support uses visible email addresses and direct phone/email links.
  `contact-page.js` can prefill an email subject and select a centre phone link
  from recognised enquiry parameters. There is no contact form or mail backend;
  an email link opens the visitor's own email application.
- `opening-hours.html` publishes local centre, swimming, class and pitch
  schedules generated from `data/visit-information.json`. Visitors use the app
  or reception to confirm changes and availability. Published schedules are not
  evidence of live availability.

These workflows are observed in the checkout. Historical external-service
checks and their limits are recorded in `docs/audit-2026-09-16/external-services.md`.
External service operation and the deployed website were not reverified during
this initialization.

## Capabilities and Constraints

- The implementation is a multi-page HTML site with shared `homepage.css`,
  `homepage.js`, `site-pages.css`, `site-accessibility.css`, local assets,
  and page-specific styles/scripts. Maintenance scripts regenerate responsive
  images and metadata; no browser framework is required.
- Node.js 22 runs the content and deployment build. `npm run dev` serves the
  public site at `http://127.0.0.1:8123`; `npm run build` publishes an explicit
  allowlist into `dist/` for Vercel. Audit evidence, scripts, configuration and
  private files are excluded from deployment.
- The contact page requires no API key or server mail transport. The retired
  `send-mail.php` URL redirects to `contact.html#message`; no PHP handler remains.
  Opening an email application is not evidence of delivery.
- Hours, class schedules, dated courses, notices and recruitment use the
  GitHub-editable `data/visit-information.json` feed, compiled to readable HTML.
  Do not hand-edit generated `feed:*` regions. Membership and supervision rules
  also require coordinated changes to the relevant policy and visitor pages.
  Maintenance responsibilities and unresolved source conflicts are recorded in
  `docs/content-maintenance.md`.
- The LeisureWorld app's store listings were verified on 2026-09-11:
  Apple Ireland `https://apps.apple.com/ie/app/leisureworld/id1479809806` and
  Google Play `https://play.google.com/store/apps/details?id=com.innovatise.leisureworldsport`.
  Downloads do not establish successful installation, sign-in or booking.
- Rates, hours, admission conditions, lesson details, and external destinations
  are maintained content, not timeless facts. Preserve their meaning during
  refinement and verify them before making new claims or changing them.

## Brand Commitments

The incumbent name is LeisureWorld Cork. On 23 September 2026, the user supplied
the new full-white primary wordmark, stored unchanged at
`Images/leisureworld-logo-white.png`. Shared brand styles hide its transparent
canvas margins while preserving the artwork. `Images/leisureworld-favicon.svg`
uses the same artwork on navy for browser tabs.
Existing copy uses the inclusion statement "Every Body Belongs" and identifies
the individual centres by name.

The user confirmed that dark navy is a core part of the design. LeisureWorld is
community based and should look premium, but not luxury: accessible and modern.
Future work must retain that positioning and navy identity. Navy must not cover
the whole website: the user explicitly rejected the all-navy treatment as cheap.
Orange accents must be very deliberate and restrained. The desired result is
modern, distinctive, and exceptionally easy to use. Strong hierarchy, legibility,
welcoming imagery, and clear routes to useful information support this commitment.
The user also explicitly asked for a memorable website with "wow factor" and
requested live design inspiration before further design development. Research was
previously recorded in `.impeccable/inspiration/README.md`; that local record is
not present in this checkout (`.impeccable/` is gitignored). Its recommendations
were not an approved design or a change to the confirmed brand constraints.
The user rejected the subsequent `cork-in-motion` concept for its cheap/AI-like
appearance, arbitrary navy coverage, weak separation, excessive information,
lack of mobile planning, and lack of a distinctive idea. Future homepage work
must address those points explicitly; that concept carries no approval.

The user's earlier centre-first homepage priority was superseded on 2026-09-11
by app adoption for bookings. Keep centre details and opening hours easy to find.
Preserve the approved "Welcome to LeisureWorld." hero and Archivo typography.
Use the user-supplied real app home screen (`Images/leisureworld-app-home.png`)
as the content reference when showing the app. The user subsequently requested
an iPhone presentation; the homepage uses the derived device mockup
`Images/leisureworld-app-iphone.png`, while the original screenshot is retained.
The screenshot's visible
features include bookings for swims, gym sessions, classes, pitches and sauna /
steam, plus booking management, membership card, opening hours and account access.

## Evidence on Hand

- `README.md`: project purpose and implementation claims, with the qualifications above.
- `index.html`, `centres.html`, and `Centres/`: existing centre and visitor information.
- `Activities.html`, `Activities/Swimlessons/`, `adultswimlesson.html`, `gym.html`,
  and `poolactivities.html`: existing activity and lesson content.
- `pricing.html` and `membershipfunnel.html`: published price and membership content.
- `help.html`, `contact.html`, and `contact-page.js`: help and direct contact routes.
- `opening-hours.html`, `data/visit-information.json`, and
  `docs/content-maintenance.md`: maintained schedules, dated content and rules.
- `about.html`, `centre-policies.html`, and `Policies/`: community positioning and policy copy.
- `accessibility.html`: physical access and Functional Zone information; this
  is a service page, not a digital accessibility audit.
- `website-accessibility.html` and `docs/audit-2026-09-16/`: the digital
  accessibility target, recorded checks, limitations and current audit evidence.
- `Images/` and `fonts/`: existing image assets and self-hosted fonts. File presence
  does not establish licensing or usage rights for new contexts.

No analytics baseline or verified reduction in enquiry volume was established.
Do not invent impact metrics, testimonials, certifications, or endorsements.

## Product Principles

### Swim school page

The swim school hub helps parents compare programmes and book a free assessment.
It uses the homepage's Archivo typography, navy/pale-blue palette and shared
navigation. Existing families have a secondary route to the app and parent guide;
adult learners have a separate route to adult lessons.

Programme and assessment information was checked against LeisureWorld's published
swimming-lessons page on 2026-09-11. Its three named programmes are offered at
Bishopstown; other centres' options require confirmation. Assessment actions
first lead to local instructions, which explain how to choose the centre and
assessment category in the published Legend course search:
https://leisureworldcork.legendonlineservices.co.uk/enterprise/program/index.
Current prices, times and availability remain with that service or reception.

On 2026-09-12 the user rejected the visual quality of the previous site-wide
pass, named Swim School as an example, and explicitly reconfirmed that every
page must be reviewed. Do not ask the user to identify the remaining weak pages
as a substitute for the requested whole-site review.

The resulting refinement uses a bright split hero and large programme photos
for Swim School, visible learning stages on its three detail pages, dedicated
assessment guidance and centre-specific lesson enquiries. Supporting course,
community and careers pages share the light editorial treatment. Gym discovery
uses larger photographic cards. Pricing reflows into labelled rows on phones,
and long policy contents collapse on small screens. These are implemented
refinements in response to feedback, not a record of user approval of the result.
The approved homepage and lighter centre direction remains the foundation.

### Activities hub

The activities hub at `Activities.html` uses the shared homepage design and
helps visitors choose swimming, gym/fitness or swimming lessons. It exposes
adult lessons, pitches, camps, sauna/steam and the Functional Zone through direct
links. App downloads are available on the page, with a browser booking fallback.
The old broken `Activities/other.html` destination is no longer used by the hub.
Seasonal camp information stays on the local `camps.html` page; the hub does not
claim that places are currently available or publish recurring class counts.

### Pool and swimming

The pool hub at `poolactivities.html` follows the homepage design and gives
public swimming, swim school, adult lessons and Aquafit distinct routes.
Public swims and Aquafit lead to app downloads, with a browser booking fallback;
lesson enquiries lead to the relevant programme page. Centre links and practical
visitor guidance help customers plan before booking. The published public swim
timetable covers Bishopstown and Churchfield; Douglas visitors are directed to
Gus Healy Pool. Prices, supervision requirements and changing session times stay
with their dedicated pages rather than being duplicated in the hub.

### Centres directory

The directory at `centres.html` helps visitors compare the three locations,
explore their facilities and get directions. It uses the approved homepage's
visual system, with centre photos, concise feature lists, visitor-information
accordions and app downloads. Opening hours link to the published schedules;
Douglas public swim times have a separate destination. No blanket walk-in or
seven-day opening promise is made.

Centre facts were checked against the official location pages on 2026-09-12.
Bishopstown's correct location is Rossa Avenue, T12 HP29, with phone
021 434 6505. Its existing detail page's address, map query and phone were
corrected to agree with the directory. Its missing image was restored from
the official site's centre panorama. The directory uses a separate official
Bishopstown pool photograph; source URLs are recorded in `design-qa.md`.

### Gym and fitness

The gym hub at `gym.html` separates gym visits from class discovery and uses
the approved homepage design. Gym information links to Bishopstown and
Churchfield. The class finder starts with Fitness and also offers All, AgeWell,
Teens and Wellbeing; all twelve programmes remain readable without JavaScript.
The existing `#classes` destination is preserved. Class and gym booking actions
lead to app downloads, with the Legend browser login as a secondary route.

Published gym, class and teen information was checked on 2026-09-12, with later
local content migration recorded in the 16 September audit. Classes and
availability vary by centre; published timetables are now maintained on the local
`opening-hours.html` page, while live availability belongs to the booking service.
Fixed prices, durations and availability promises are not duplicated here.
Teen gym users aged 13–17 need an induction with a parent or legal guardian
present. Reception arranges inductions; the page links to current teen programme
details. MoveWell enquiries go to the team because entry requirements apply.

### Shared principles

1. Make app downloads the primary homepage booking route, with a secondary
   browser booking option. Keep practical visitor information easy to find.
2. Keep centre and activity differences explicit so visitors can plan correctly.
3. Distinguish maintained information from verified live availability.
4. Give visitors a clear next step when an answer depends on a booking service
   or a staff member.

## Accessibility & Inclusion

The repository contains disability inclusion and admission policies and content
for the Functional Zone. These are existing product evidence and should inform
future work without implying the website meets a particular accessibility standard.

The documented implementation target is WCAG 2.2 AA, alongside the relevant web
requirements of EN 301 549. The current website statement and audit do not claim
full conformance. Third-party booking flows and comprehensive assistive-technology
testing remain outside the recorded checks.

Physical access information does not establish that every listed facility is
available at every centre. A confirmed centre-by-centre access inventory remains
open; see `docs/audit-2026-09-16/accessibility-content.md`.

Other open decisions: particular assistive-technology needs, language
requirements, additional priority audiences, measurable success targets, and
any further business or policy commitments beyond those recorded here.

### Whole-site completion — 12 September 2026

All 38 public HTML pages now share the approved visual system and consistent
app, centre, activity, pricing, membership and support navigation. Page goals
and next steps are recorded in `docs/page-purpose.md`. Training, individual
lesson programmes, contact, help and policies have distinct visitor journeys.

Accessibility targets WCAG 2.2 AA, with Ireland’s EN 301 549/public-sector
baseline and the covered e-commerce journey considered. Automated and selected
manual checks are recorded in `docs/accessibility-review.md`; full legal
conformance and third-party booking accessibility are not claimed.

Discovery uses readable HTML, verified facts, canonical/social metadata,
matching structured data, sitemap and crawler access. `llms.txt` is an optional
directory, not an AI ranking mechanism. Production domain configuration and
content sources are recorded in `docs/content-and-discovery.md`.

### Centre layout preference — 12 September 2026

The user prefers Bishopstown's light page introduction with a separate panoramic
photograph, facilities cards, visitor details and in-page iPhone/app section.
Bishopstown and Churchfield now use that layout through `site-pages.css`.
Use this as the centre-page reference, preserving each centre's own facilities
and contact details. The previous full-photo Churchfield hero is superseded.
## Comprehensive review decisions — 12 September 2026

- The user confirmed app bookings as the first conversion priority and asked to
  refine the approved homepage and lighter Bishopstown/Churchfield design.
- All three centres now use that light template, with app booking as the primary
  action and visit planning secondary. Douglas stays clearly pool-only.
- Activities adds an accessible six-choice “What sounds good?” recommendation
  panel. The static directory remains usable without JavaScript.
- Programme, membership, training and support pages keep their appropriate
  assessment, joining, enquiry or assistance routes. Formal policies are not
  repurposed as sales pages.
- Preserve the homepage hero wording and current iPhone artwork. Do not restore
  the removed Churchfield question callout.
- The complete page-by-page review and current checks are recorded in
  `docs/comprehensive-review.md` and `docs/comprehensive-audit-results.json`.
