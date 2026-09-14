# LeisureWorld design QA — 10 September 2026

final result: passed

## Churchfield centre page — latest redesign

**Scope:** `Centres/churchfield.html` now extends the approved homepage visual system through `homepage.css`, `homepage.js` and the new `centre-page.css`. The homepage's rendered design is the explicit source of truth for this request. Centre-specific content and the directions map are intentional extensions; this is visual consistency rather than a duplicate homepage.

### Comparison evidence

- Source: `.impeccable/reference/centre-home-reference.png`, captured from `http://127.0.0.1:8123/index.html`.
- Implementation: `.impeccable/reference/churchfield-desktop.png`, captured from `http://127.0.0.1:8123/Centres/churchfield.html` (a temporary refresh query was used during capture).
- Both: 1440 × 1000 CSS viewport, approximately 1 DPR, screenshot output 1425 × 990 pixels. Equal screenshot dimensions; no density conversion needed.
- State: top of page, menu closed, motion settled, same theme and browser. The pool photograph and heading wording differ intentionally by centre.
- Full comparison: `.impeccable/reference/churchfield-home-comparison.jpg`, both captures together.
- Focused header comparison: `.impeccable/reference/churchfield-header-comparison.jpg`; matching logo crop, header position, nav spacing, booking button and menu icon.
- Additional evidence: `churchfield-facilities.png`, `churchfield-hours.png`, `churchfield-mobile.png`, `churchfield-hours-mobile.png`, `churchfield-map-mobile.png` and `churchfield-tablet.png` in the same reference directory. The tablet capture shows the map/membership area.

### Findings and fidelity surfaces

No actionable P0/P1/P2 visual findings remained in the first completed comparison. No visual-fix iteration was needed after that comparison. A cached old document initially appeared during navigation; an explicit browser reload resolved it. Only the refreshed document is accepted implementation evidence.

- **Typography:** Actual self-hosted Archivo and Archivo Black match the homepage's computed fonts. The smaller brand lead-in and large white centre name use the same hero hierarchy. Facility descriptions use readable body text; headings and table rows wrap without truncation.
- **Spacing/layout:** Matching hero frame, content gutters, overlap strip, rounded corners, header and footer. Facilities use a two-column editorial layout with a six-item list; activities use the homepage photo-card treatment. Hours and directions retain generous spacing while stacking on phones.
- **Colors/tokens:** Uses the shared navy, pale blue, white, blue icons and restrained orange arrows. The authentic Churchfield image has the same contrast overlay treatment. No old diagonal ramp, saturated gradient or page-specific cursor effect remains.
- **Imagery/icons:** Reuses the real Churchfield pool photos (`cf.jpg`, `cf1.png`), original logo, existing gym/family photos and local Tabler icon font. No photo placeholders, fabricated centre imagery or handcrafted SVG icons. The map was observed loading at the correct Churchfield location.
- **Copy/content:** Churchfield facilities, lessons, gym, pitches, membership and contact routes are preserved and reorganized. Hours are now explicitly labelled as gym hours; public pool/pitch timetables have a separate link. The incorrect phone number, incomplete address and outdated Friday hours were corrected against official sources below.

### Verification

- 72 HTML references checked: no missing local file/fragment targets, no duplicate IDs and no missing icon definitions.
- No horizontal page or hero-text overflow at desktop 1440px, tablet 768px, mobile 390px or compact phone 320px. The hours table fits at 320px.
- Facilities, Opening hours and Find us quick links reach their sections.
- Mobile menu opens; Escape closes it, removes scroll lock and returns focus to `menu-toggle`. Choosing Opening hours or Activities from the menu closes it and follows the anchor.
- Swim-school card opens the existing Swim School page. All remaining local activity/membership/footer destinations resolve in the link audit.
- Verified the phone link, email link, directions URL and existing Legend booking/signup destinations without initiating a call, message, booking, login or payment.
- Map rendering and contact section inspected on mobile and tablet. Browser console warnings/errors were empty during the Churchfield desktop check.
- Shared JavaScript syntax and `git diff --check` pass. Git's LF-to-CRLF notice is informational.
- Native dialog, keyboard focus, skip link, real links, semantic table headers, alt text and shared reduced-motion support are retained. This is not a full accessibility certification.

### Official content sources

- [Churchfield location](https://www.leisureworldcork.com/locations/leisureworld-churchfield/): address, phone, facility information.
- [Opening hours](https://www.leisureworldcork.com/opening-hours/): gym hours, Friday closing and bank-holiday hours, with separate swimming/pitch timetables.
- [Astro pitches](https://www.leisureworldcork.com/all-weather-pitch-cork/): eight Churchfield pitches.
- [Membership](https://www.leisureworldcork.com/prices/): membership access to both Churchfield and Bishopstown.

### Completion checklist

- [x] Match the homepage design and reuse its typography, assets and interactions.
- [x] Replace the old Churchfield page and its placeholders.
- [x] Keep visitor information and key destinations functional.
- [x] Compare browser captures and verify responsive layouts.
- [x] Keep the local Churchfield preview available for review.

No Churchfield-specific blockers remain. Other existing centre/activity pages have not been redesigned or comprehensively audited in this change. External booking, mail and map services remain external; no backend or deployment changes were made.

## Earlier homepage work

Latest layout refinement: the standalone hero now uses a smaller Archivo-medium “Welcome to” lead-in above the larger Archivo Black “LeisureWorld.” name. Raised the group above the centre panel, widened its desktop container, and tuned the mobile scale and gap. Inspected the actual rendering at 1438 × 964 and 390 × 844, and verified no text/container overflow at 320 × 800. Evidence: `.impeccable/reference/hero-layout-after.png` and `hero-layout-mobile.png`. The user's new layout request supersedes the equal-sized lines from the previous revision. Existing image, colors and exact heading wording remain. `git diff --check` passed.

Latest follow-up: removed the “Discover LeisureWorld” link and its unused desktop/mobile spacing rules as requested. The hero content now contains only the two-line welcome heading. Refreshed the browser and confirmed the link is absent; `git diff --check` passed.

## Hero copy revision — 10 September 2026

The user's follow-up replaces the original hero copy specification: the heading is now “Welcome to LeisureWorld.”, set on two lines, and the “LeisureWorld Cork” eyebrow and “Every Body Belongs.” subtitle are removed from the hero. Existing fonts, image, palette and the discovery link are retained. Removed obsolete eyebrow/subtitle rules, adjusted headline sizing and line height at the desktop, tablet and phone breakpoints, and increased the heading-to-link spacing to 32px on desktop and 24px on phones.

Browser verification at 1440 × 1000, 768 × 1024, 390 × 844 and 320 × 800 CSS pixels confirms a two-line heading and no headline/container or page overflow. Screenshots are in `.impeccable/reference/welcome-hero-desktop.png`, `welcome-hero-tablet.png`, `welcome-hero-mobile.png` and `welcome-hero-phone-320.png`. Both removed hero elements are absent from the DOM. Homepage console warnings/errors: none observed. `git diff --check` passed. The earlier source-comparison evidence below records the approved underlying design; its original hero wording is superseded by this explicit request.

## Target and evidence

- Approved direction: the third Sky Lagoon-inspired concept, revised to use the project's existing Archivo / Archivo Black typography.
- Source visual truth: `.impeccable/reference/selected-archivo-homepage.png` (1058 × 1487 pixels).
- Implementation: `http://127.0.0.1:8123/index.html`.
- Final implementation screenshot: `.impeccable/reference/implemented-desktop-final.png` (1043 × 1466 pixels).
- Comparison viewport: 1058 × 1487 CSS pixels, browser DPR approximately 1. The browser capture is proportionally scaled to 1043 × 1466. The source was resized to those same dimensions for comparison; scrollbar and exterior frame differences were excluded from findings.
- State: homepage at the top, light theme, menu closed, no selected accordion, entrance animations settled.
- Full-view comparison: `.impeccable/reference/desktop-comparison-final.jpg` puts the normalized source and implementation side by side.
- Focused comparison: `.impeccable/reference/welcome-comparison-final.jpg` shows heading wrapping, body copy, button, spacing and gym crop at a readable scale.
- Additional browser evidence: `implemented-mobile-final.png` (390 × 844 CSS viewport), `implemented-tablet.png` (768 × 1024), `implemented-phone-320.png` (320 × 800), `activities-desktop.png` and `footer-desktop.png` (1440 × 1000), plus `menu-mobile.png` and `hours-mobile.png`, all in `.impeccable/reference/`.

## Findings and comparison history

No actionable P0/P1/P2 findings remain for the redesigned homepage.

1. **[P2, fixed] Oversized header logo.** The first desktop comparison made the brand more dominant than the selected concept. Reduced the normal header logo from 176px to 148px; retained the original PNG and cropped its transparent margins in its container. The final comparison shows a balanced logo/navigation row.
2. **[P2, fixed] Intro proportions and text scale.** The first capture had a narrow gym image, small text and excess vertical displacement. Adjusted grid tracks, section padding and type sizes. An intermediate heading increase created an unwanted line wrap; the final `4vw` sizing and breakpoint rules preserve the intended two-line heading. Both the full and focused final comparisons show the corrected layout.
3. **[P2, fixed] Photo text contrast.** Increased the hero shade to 48% on desktop and 50% on phones. The white text remains legible across the real pool photograph. The retained image has a more restrained grade than the generated reference; this is an intentional readability adjustment.
4. **[P2, fixed] Mobile centre discovery.** The first 390px capture placed the third centre too far below the opening screen. Shortened the mobile hero from 77svh to a bounded 64svh. `implemented-mobile-final.png` and the 320px capture show all three centre choices with intact labels and arrows.
5. **[P2, fixed] Compact utility text and touch targets.** Increased mobile hours-table text and footer link target heights. `hours-mobile.png` confirms readable rows without clipping; footer links have a 44px minimum height on mobile.

The initial desktop and mobile captures are retained as `implemented-desktop-first.png`, `desktop-comparison-first.jpg` and `implemented-mobile-first.png`. The first comparison was exploratory and was not density-normalized; the final combined evidence above is normalized and is the basis for acceptance.

## Required fidelity surfaces

- **Fonts and typography:** Computed styles confirm local Archivo body text and Archivo Black headings. Hierarchy, weight, letter spacing and two-line headline wrapping were inspected. The real font files have slightly different metrics from ImageGen's approximation; using the actual project fonts is the user's explicit request. No truncated labels or unintended heading breaks at the inspected breakpoints.
- **Spacing and layout rhythm:** Retains the immersive image opening, overlapping white centre strip, generous pale-blue intro and portrait gym crop. Consistent content gutters, deliberate section spacing and rounded image corners continue below the mock's first screen. Tablet preserves three centre columns; phones stack them. No horizontal page overflow at 320, 390, 768, 1058 or 1440px.
- **Colors and tokens:** Existing navy `#0a2348`, pale blue `#edf2f9`, white and restrained orange `#ff6a1a` accents remain. Hero shading is intentionally stronger for readable text. Visible keyboard focus, hover and open states are defined. No unrelated palette introduced.
- **Image quality and asset fidelity:** Original project logo, Gus Healy photograph, gym image and activity photographs are used. Crops preserve their subjects, with no stretching or broken image loads. The actual pool photograph differs slightly from the generated mock's reconstructed perspective and grade; preserving the authentic asset is intentional. Standard icons use locally hosted Tabler Icons rather than custom drawings.
- **Copy and content:** Approved hero and intro copy retained. Remaining homepage copy supports real centre discovery, activities and membership links. Gus Healy is described as pool-only. Existing opening hours remain explicitly indicative; no live availability, invented prices or invented testimonials are shown.

## Interactions and implementation checks

- Opened all three centre links and verified the destination headings for Bishopstown, Churchfield and Gus Healy Pool.
- Used Explore activities to reach the homepage activity section, then followed the swimming card to the existing Aquatics Programme page.
- Opened the mobile menu, checked its modal state and scroll lock, closed it with Escape, and verified focus returned to the trigger and `aria-expanded` reset.
- Followed Opening hours from the menu and verified the menu closed and the page reached the hours section.
- Exercised opening-hours summaries with Enter, Space and pointer input; verified expansion, collapse and mutual exclusivity. Checked the Gus Healy hours and pool-only description.
- Verified the booking link retains the existing Legend account-login destination. No account login, booking or payment was submitted.
- Checked 67 local links/assets and fragment targets: no missing targets or duplicate IDs.
- Inspected loaded images and computed font families in the browser. Homepage console warnings/errors: none observed.
- `node --check homepage.js` and `git diff --check` passed; Git only reported its normal LF-to-CRLF conversion notice.
- Code review confirms reduced-motion support, visible focus styles, a skip link, semantic native dialog/details controls, accessible button names, photo alternative text and progressive enhancement. These checks are not a full accessibility audit.

## Scope and remaining limitations

- QA covers the redesigned homepage and its outgoing navigation. Existing secondary pages retain their current designs and were not comprehensively audited or rebuilt.
- No server-side form, authentication, payment, production deployment or live timetable integration changed or tested.
- Mobile/tablet layouts and content below the first screen are responsive extensions of the approved visual direction; the source mock has no separate visual specification for them.
- Optional P3 polish: source photograph crops and small UI text can be tuned further if the user prefers a closer rendering of the generated reference. No approval or missing asset blocks the implementation.

## Completion checklist

- [x] Implement selected direction with original project fonts and palette.
- [x] Compare actual browser output with the selected visual in one normalized image.
- [x] Fix and recapture the identified visual issues.
- [x] Check responsive layouts and primary homepage interactions.
- [x] Preserve existing page destinations and real image assets.
- [x] Keep local preview available for review.

## Mobile app booking funnel — 2026-09-11

Final result: passed for the homepage app funnel changes.

The user made mobile app adoption the primary homepage booking goal and supplied
an actual app home screen. The header, hero, menu and footer now lead to `#app`.
The previous generic introduction is replaced by app benefits, both store
badges, the supplied screenshot and a secondary browser booking link.

Visual checks:
- Retained the approved pool hero, exact Welcome to LeisureWorld heading, Archivo
  fonts, navy / pale-blue / white palette and restrained orange accents.
- Compared the original supplied screenshot and rendered desktop app section
  together. All app content is preserved without stretching, fabricated controls
  or phone chrome. The deployed asset is byte-identical to the supplied file.
- Desktop 1264x966, tablet 768x1024 and phone 390x844 / 320x800 layouts were
  inspected. No horizontal page overflow. Store targets are at least 48px high
  on phones and appear before the screenshot in the mobile reading order.
- Hero and app-section captures are saved as `app-hero-desktop.png`,
  `app-hero-mobile.png`, `app-section-desktop.png`, `app-section-mobile.png`,
  `app-section-320.png` and `app-section-tablet.png` in `.impeccable/reference/`.
  Mobile/tablet captures precede the final small copy shortening; layout CSS is
  unchanged. The desktop capture contains the final copy.
- No remaining P0/P1/P2 issues found in the changed homepage surface.

Functional checks:
- Clicked header, hero, mobile menu and footer app links. They reach the download
  section. The menu closes and releases its scroll lock after navigation.
- Followed both store buttons in the preview browser. Apple loaded
  'LeisureWorld App - App Store' at
  https://apps.apple.com/ie/app/leisureworld/id1479809806; Google loaded
  'LeisureWorld - Apps on Google Play' at
  https://play.google.com/store/apps/details?id=com.innovatise.leisureworldsport.
- Store links are ordinary anchors; no JavaScript popup dependency. The same
  verified URLs replace placeholders on the existing `appfunnel.html` route.
- Local links, image paths and fragments in both edited HTML files resolve;
  there are no duplicate IDs. No broken images or homepage console errors found.
- `git diff --check` passed. A stylesheet version parameter prevents stale
  homepage styles from being reused with the new markup.

Limits: store listings were verified, but installation, account sign-in and
bookings were not performed. No production deployment, analytics integration,
backend changes or comprehensive audit of the older app-funnel page is included.
The shared centre hero styles are unaffected by the homepage-scoped additions.

## iPhone app presentation — 2026-09-11

Final result: passed for the requested presentation change.

- Replaced the bare screenshot with `Images/leisureworld-app-iphone.png`, a
  1024x1536 mockup made with the built-in image-generation tool. The user
  specifically requested an iPhone after the initial generic phone version.
- Prompt direction: show the supplied LeisureWorld home screen in a front-facing
  black iPhone with flat edges, Dynamic Island, a home indicator, pale-blue
  background and a soft shadow. Keep the app's labels and booking tiles visible.
- This is a generated presentation mockup, not a pixel-identical embedding of
  the original. The unmodified app screenshot remains available separately.
- Removed the old screenshot padding and shadow in favour of the mockup's own
  composition. Checked desktop and 390px phone layouts, image loading, aspect
  ratio, complete device visibility and lack of horizontal overflow. Store links
  and booking copy remain as previously verified.
- Evidence: `.impeccable/reference/app-iphone-desktop.png` and
  `.impeccable/reference/app-iphone-mobile.png`. Original generation is retained
  under the Codex generated-images directory. The earlier generic device is
  retained only as `.impeccable/reference/app-phone-initial.png`.

## Compact app section — 2026-09-11

Final result: passed for the requested reduction in prominence.

- Kept the app section after the hero and centre shortcuts. Reduced its vertical
  padding and gaps, capped the iPhone preview at 360px wide on desktop and 220px
  on phones, and removed the redundant introductory paragraph. The two practical
  benefits, both store buttons and secondary browser booking link remain.
- Measured section height at a 1264px viewport: 919px before, 660px after (28%
  shorter). At a 390px viewport: 1154px before, 817px after (29% shorter).
- Mobile store buttons remain approximately 50px high, the full iPhone stays
  visible, and no horizontal overflow was found. The activities section starts
  338px earlier on mobile. Store URLs are unchanged from the verified listings.
- Visual evidence: `.impeccable/reference/app-compact-mobile.png` and
  `.impeccable/reference/app-compact-desktop.png`. `git diff --check` passed.

## Swim school redesign — 2026-09-11

final result: passed

### Visual target and evidence

- Target: the approved, running homepage at `index.html`, captured as
  `.impeccable/reference/swim-school-home-reference.png`.
- Implementation: `Activities/Swimlessons/swimschool.html`, with page-specific
  rules in `swim-school.css` and the shared `homepage.css` / `homepage.js`.
- Opened the homepage reference and `swim-school-hero-desktop-final.png` together
  in one comparison input. Both are 1249 × 955 pixels from the same 1264 × 966 CSS
  viewport, reported DPR approximately 1. Browser capture excludes/scales its
  scrollbar area equally for both, so no further image normalization was needed.
  Both show the top of the page, menu closed and fonts loaded.
- Compared the shared header, logo, buttons, heading treatment and overlapping
  shortcut strip at readable scale. These focused regions are visible in the
  combined captures; a separate enlarged crop was unnecessary.
- Intentional differences: a shorter swim-school hero with the heading placed
  above the children, programme shortcuts, and an assessment CTA. The homepage's
  full-height composition and app booking message are specific to that page.

### Findings, fixes and comparison history

- [P2, fixed] The secondary hero link crossed a child's face. Removed it; the
  programme shortcut remains directly below the hero. Compared the final desktop
  capture against the homepage reference after the fix. The primary button and
  heading stay clear of faces. Initial evidence: `swim-school-hero-desktop.png`
  and `swim-school-hero-mobile-before.png`.
- [P2, fixed] At 320px, the programme heading broke into three awkward lines.
  Reduced only this narrow-breakpoint heading from 29px to 26px. Opened
  `swim-school-programmes-narrow.png` and `swim-school-programmes-narrow-final.png`
  together; the final heading occupies two balanced lines without overflow.
  Both captures use a 320 × 800 CSS viewport (305 × 763 image pixels). The earlier
  capture has a programme expanded; this state difference does not affect the
  heading region being compared.
- Replaced the old hub's conflicting programme descriptions and informal
  walk-in messaging with verified programme information and prebooked assessment
  guidance. Level details now expand on the hub instead of depending on the old
  duplicated programme subpages.
- No actionable P0/P1/P2 findings remain.

### Required fidelity surfaces

- Fonts: self-hosted Archivo body/UI and Archivo Black headings are loaded and
  match the homepage. Checked heading wraps and button labels at desktop, tablet,
  390px and 320px widths.
- Layout: shared gutters, photo radii, overlapping white navigation, pale-blue
  sections and navy footer. Programme columns become compact image/text rows on
  phones; assessment steps and centre links stack. No horizontal overflow at
  1264, 768, 390 or 320 CSS pixels.
- Colours: shared navy, white, pale blue and orange token values; body text and
  controls remain readable, with visible keyboard focus and high-contrast
  assessment buttons. This is a visual check, not a WCAG certification.
- Imagery: reused existing pool, swimmer and Rookie Lifeguard photos and the
  original logo. No generated imagery or drawn substitute assets were needed.
  All page images loaded; crops and proportions were inspected at each layout.
- Copy: programme choice, enrolment steps and FAQs support the parent assessment
  journey. App/account help is available for existing families and adult learners
  have a separate route. Avoids unsupported prices, schedules or guarantees.

### Interaction and responsive checks

- Assessment CTA clicked through to the official Legend Course Search. Its
  search form, category choices and course filters loaded. No booking submitted.
- Programme details work with Enter and click, show the correct four beginner
  levels and allow one programme to be open at a time.
- Parent FAQs tested by keyboard and pointer; opening a second closes the first.
- Menu tested at 320px: opens, scrolls, locks page scroll, closes with Escape and
  returns focus to the menu button.
- Adult swimming link reaches `adultswimlesson.html`; parent app CTA reaches
  `index.html#app`. Anchors for programmes, joining, FAQs and top work.
- Local reference check: 71 href/src references, one H1, no missing local paths,
  missing fragment targets or duplicate IDs. `git diff --check` passes.
- No local console errors or warnings. Two deprecation warnings came from the
  external Legend service and did not prevent its form from loading.
- Additional evidence under `.impeccable/reference/`:
  `swim-school-programmes-desktop.png`, `swim-school-assessment-desktop.png`,
  `swim-school-programmes-tablet.png` (768 × 1024 CSS; 753 × 1004 image),
  `swim-school-programmes-mobile.png`, `swim-school-faq-mobile.png`
  (390 × 844 CSS; 375 × 811 image), `swim-school-hero-narrow.png` and
  `swim-school-menu-narrow.png`.

### Content sources and scope

- [LeisureWorld swimming lessons](https://www.leisureworldcork.com/swimming-lessons-cork/):
  Bishopstown programme scope, beginners age 5+, Sharks 1/2, Rookie age 8–14,
  free assessment and booking requirement. Checked 2026-09-11.
- [Parent account guide](https://www.leisureworldcork.com/swimming-lessons-cork/swim-lessons-parent-help/):
  family profiles and progress/account support; linked for current instructions.
- [Published course search](https://leisureworldcork.legendonlineservices.co.uk/enterprise/program/index):
  primary booking destination, verified in browser.
- Existing legacy pages and external booking UI remain outside this redesign.
  No backend, automated booking, live availability claims or conversion metrics
  were added. Earlier uncommitted homepage/app work was preserved.

Implementation checklist: complete. No residual visual fixes required.

## Activities hub redesign — 2026-09-11

final result: passed

### Visual comparison

- Source: the approved homepage, captured at
  `.impeccable/reference/swim-school-home-reference.png`, plus its compact app
  section at `app-compact-desktop.png` in the same directory.
- Implementation: `Activities.html`, extending the shared visual system through
  `activities-page.css`. Original page captured as `activities-before.png`.
- Opened the homepage reference and `activities-hero-desktop.png` together in one
  comparison input. Opened the source app section and
  `activities-app-desktop-final.png` together in another. Each desktop pair uses
  1264 × 966 CSS pixels and equal 1249 × 955 capture pixels. Browser capture
  normalization is identical within each pair; no extra resampling was applied.
- Shared header, logo, buttons, navigation strip, app presentation and footer
  match. The shorter gym-photo hero, activity directory and more compact app
  section are intentional adaptations to the activity-discovery journey.
- Focused review of readable header/button and app/store-badge regions was
  possible within these paired captures; no separate magnification was needed.

### Findings and iteration history

- [P2, fixed] At 320px, the app download row imposed a 324px minimum content
  width and made the page 348px wide. Added `min-width:0` to its grid child and
  badge flex items. Compared `activities-hero-narrow.png` with
  `activities-hero-narrow-final.png` together at the same top-of-page state.
  Horizontal scrolling is gone. `activities-app-narrow-final.png` shows both
  store buttons fitting; each measures 123px wide with a 48px minimum hit area.
- [P2, fixed] Tablet activity headings had inconsistent vertical alignment.
  Defined a 32px icon row for the tablet layout. Opened
  `activities-more-tablet.png` and `activities-more-tablet-final.png` together;
  all three headings now have the same measured top position (483px).
- [P2, fixed] The app image initially omitted the homepage's rounded container.
  Reused the shared `app-preview` class. The final desktop app comparison shows
  the same 24px radius and complete iPhone image. Initial evidence is
  `activities-app-desktop.png`; corrected evidence has the `-final` suffix.
- Replaced the hub's nonexistent `Activities/other.html` link with direct
  destinations. Removed unsupported weekly-class counts and popularity labels.
- No actionable P0/P1/P2 findings remain.

### Fidelity and behaviour

- Typography: loaded local Archivo and Archivo Black; hierarchy, weight and
  wrapping checked at 1264, 768, 390 and 320px widths.
- Spacing/layout: shared gutters, image radii and section rhythm. Card columns
  become a readable vertical list on phones; additional activities become rows.
  No horizontal overflow at the four checked widths after fixes.
- Colours: shared navy, pale blue, white and orange tokens. Buttons, links and
  keyboard focus remain visible. No accessibility certification is implied.
- Imagery: original gym and pool photos, original brand assets and the existing
  approved iPhone mockup; no new artwork or placeholder images. All images loaded.
- Content: activity discovery leads to existing detail pages, with app downloads
  available directly on the hub. Centre differences and seasonal camp information
  remain explicit; no live availability, pricing or class-count claims added.
- Clicked all three main cards and verified the pool, gym and new swim school
  destinations. Category shortcuts, hero booking CTA and Book a swim correctly
  navigate to their page sections. The store URLs match the previously verified
  App Store and Google Play listings; no installation or booking was performed.
- Tested the menu at 320px: open, scroll lock, Escape close and focus return.
- Checked 74 href/src references: no missing local files, missing fragment
  targets or duplicate IDs; one H1. `git diff --check` passes.
- Final browser console: no warnings or errors.

### Additional evidence and scope

All captures are under `.impeccable/reference/`:
`activities-directory-desktop.png`, `activities-more-desktop.png`,
`activities-hero-mobile.png`, `activities-directory-mobile.png`,
`activities-app-mobile.png`, and the final captures listed above.
Mobile: 390 × 844 CSS / 375 × 811 image pixels. Narrow phone: 320 × 800 CSS /
305 × 763 image pixels. Tablet: 768 × 1024 CSS / 753 × 1004 image pixels.

Verified the published [pitch-hire page](https://www.leisureworldcork.com/all-weather-pitch-cork/)
and [summer camp information](https://www.leisureworldcork.com/summer-activity-camps/)
on 2026-09-11 before linking them. The camp page lists summer dates, so the hub
offers information without implying that places are currently available.
Sauna/steam links to the existing Churchfield facilities section.

Existing activity detail pages are outside this redesign. Earlier uncommitted
homepage, app and swim school work was preserved. Implementation checklist:
complete; no residual visual fixes required.

## Pool and swimming redesign — 2026-09-12

Status: **passed**. No actionable P0/P1/P2 findings remain.

### Reference and scope

Compared `swim-school-home-reference.png` and `pool-hero-desktop.png` together
at 1264 × 966 CSS pixels / 1249 × 955 image pixels, with both pages at the top.
The pool page shares the approved Archivo typography, navy/pale-blue/orange
palette, rounded photo hero, overlapping shortcut strip, buttons and footer.
`pool-before.png` records the old page. Captures are in `.impeccable/reference/`.

The redesigned page adds public swimming discovery and centre information,
then separates swim school, adult lessons and Aquafit. It replaces the broken
Aquafit destination and misleading membership-signup enrolment link with
relevant booking or programme routes. Existing detail pages are unchanged.

### Visual verification

- Typography: local Archivo and Archivo Black loaded. Heading wraps and card
  text remain readable at 1264, 768, 390 and 320px widths.
- Layout: shared gutters and section spacing; aligned three-column programme
  cards on desktop/tablet, stacked cards on phones. No horizontal overflow at
  any checked width. Tablet card headings and CTAs align within 0.02px.
- Colours and imagery: shared brand colours, original Churchfield pool photo,
  existing swim/Aquafit images, and the approved iPhone mockup. All images load;
  image crops, rounded corners and text contrast were visually checked.
- App download buttons fit at 320px, each measuring about 123 × 48px. The
  complete iPhone stays visible, and browser booking remains available.
- The wording distinguishes centre facilities and lesson programmes without
  adding fixed schedules, prices, availability or unverified age requirements.

Desktop evidence: `pool-hero-desktop.png`, `pool-swimming-desktop.png`,
`pool-programmes-desktop.png`, `pool-visit-desktop.png`, `pool-app-desktop.png`.
Phone evidence: `pool-hero-mobile.png`, `pool-programmes-mobile.png`,
`pool-app-mobile.png` at 390 × 844 CSS pixels; `pool-hero-narrow.png` and
`pool-app-narrow.png` at 320 × 800 CSS pixels. Tablet evidence:
`pool-hero-tablet.png`, `pool-programmes-tablet.png`, `pool-app-tablet.png`
at 768 × 1024 CSS pixels.

### Behaviour and content checks

- Clicked all three hero shortcuts and verified their target sections. Hero
  Book a swim and the Aquafit card reach the on-page app download section.
- Clicked the swim school and adult lesson cards and verified the intended
  local pages. The official Public swim timetables link opens Opening Hours.
- Verified the published timetable scope against
  https://www.leisureworldcork.com/opening-hours/ on 2026-09-12. It covers
  Bishopstown and Churchfield; the page explicitly directs Douglas enquiries
  to Gus Healy Pool. Current times are not copied into the new page.
- Store badges use the previously verified official LeisureWorld App Store
  and Google Play listings. No app installation or booking was performed.
- Menu checked at 320px: opens, locks page scrolling, closes with Escape,
  and returns focus to Open menu.
- Static check of 77 href/src references: no missing local files, missing
  fragment targets or duplicate IDs; one H1. `git diff --check` passes.
- Final browser console has no warnings or errors. Temporary viewport override
  cleared and the local pool page left open at the top.

Implementation checklist complete. Earlier homepage, app, swim-school and
activities edits were preserved. No commit, push or deployment performed.

## Centres directory redesign — 2026-09-12

final result: passed

### Findings and comparison history

- [P2, fixed] The first tablet layout stretched the photo container to the full
  height of the centre details, heavily cropping and enlarging the Bishopstown
  source. Changed `.location-image` at the tablet breakpoint to keep its 1.36
  aspect ratio and centre vertically alongside the copy. Opened
  `centres-cards-tablet.png` and `centres-cards-tablet-final.png` together at the
  Bishopstown anchor, 768 × 1024 CSS pixels. The revised view includes the pool
  context and avoids enlarging the image beyond its native height.
- No actionable P0/P1/P2 issues remain. The official Bishopstown pool photo is
  smaller than the other assets, so it stays in modest card-sized slots.

### Visual grounding and evidence

The approved homepage is the visual reference. Captured
`centres-home-reference.png` and `centres-hero-desktop.png` at the same
1267 × 972 CSS viewport, top-of-page state, and opened them together. Both
images are 1252 × 960 image pixels; no resampling was required. The centres
hero is intentionally shorter than the homepage, retaining its logo/nav,
Archivo type, rounded photography, orange arrows and overlapping shortcuts.
`centres-before.png` records the replaced design.

All screenshots are under `.impeccable/reference/`. Additional readable section
captures: `centres-directory-desktop.png`, `centres-planning-desktop.png`,
`centres-app-desktop.png`, `centres-hero-mobile.png`, `centres-card-mobile.png`,
`centres-douglas-narrow.png`, `centres-app-narrow.png`,
`centres-cards-tablet-final.png`, and `centres-planning-tablet.png`.
Phone viewport: 390 × 844 CSS pixels; narrow phone: 320 × 800;
tablet: 768 × 1024. Full desktop and section captures were sufficiently
readable to judge typography, images, icons and controls without extra crops.

### Required fidelity surfaces

- Fonts/typography: local Archivo and Archivo Black load correctly. Headings,
  addresses, long centre names and action labels remain readable. Typography
  follows the homepage's weights, spacing and hierarchy.
- Layout/spacing: shared gutters, radii and buttons; three comparable columns
  on desktop, paired photo/text rows on tablet and stacked cards on phones.
  No horizontal overflow at 1267, 768, 390 or 320px. Final tablet image crops
  passed the paired before/after comparison.
- Colours: existing navy, pale blue, white, muted blue-grey and restrained
  orange tokens. Keyboard focus and accordion open/closed states are visible.
- Imagery: existing Douglas, Churchfield, brand and iPhone assets; real
  Bishopstown imagery sourced from the official site. All images load.
  No generated, placeholder, CSS-drawn or substituted icon artwork was added.
- Copy/content: centres are differentiated by facilities, with published
  schedule links instead of invented hours. Removed unsupported superiority
  claims, fixed facility counts and blanket no-booking/seven-day promises.

### Behaviour and static checks

- Clicked all centre shortcuts, the hero directory CTA, all three Explore
  centre links, footer Opening hours, and Get the app. All reach their intended
  sections or local centre pages.
- Opened each planning accordion and verified exclusive open/close behaviour.
- At 320px, verified menu open, scroll lock, Escape close and focus return.
- App badges fit at 320px with approximately 123 × 48px hit areas. Their URLs
  match the previously verified official store listings. Browser booking uses
  the existing Legend login. No installation, form submission or booking done.
- Checked 78 href/src references, including fragment targets in local pages:
  no missing files, missing anchors or duplicate IDs; one H1.
- Browser console has no warnings or errors. `git diff --check` passes.
- Responsive viewport overrides were cleared after testing. No commit, push
  or deployment performed; earlier work was preserved.

### Content and asset sources

Verified on 2026-09-12:

- [Official location overview](https://www.leisureworldcork.com/): public
  pay-as-you-go access and centre facilities.
- [Bishopstown](https://www.leisureworldcork.com/locations/leisureworld-bishopstown/):
  address, Eircode, phone and facilities. Corrected the existing local
  Bishopstown detail page's address, phone and map query as well, so its linked
  visit route agrees with this directory.
- [Churchfield](https://www.leisureworldcork.com/locations/leisureworld-churchfield/):
  address and facilities. No numerical pitch count is duplicated.
- [Douglas](https://www.leisureworldcork.com/locations/leisureworld-douglas/):
  Nursery Drive and centre-specific public swim schedule destination.
- `Images/bishopstown-pool.jpg` (518 × 300) comes from
  https://www.leisureworldcork.com/wp-content/uploads/2021/02/3-1.jpg,
  linked on the official Bishopstown page. Used for the directory card.
- `Images/bishopstown.jpg` (1400 × 280) comes from
  https://www.leisureworldcork.com/wp-content/uploads/2017/01/leisureworld-bishopstown.jpg.
  Restores the missing existing Bishopstown hero image.

Implementation checklist: complete. Separate older detail pages retain their
existing layouts; only the factual Bishopstown corrections above were made.

## Gym and fitness redesign — 2026-09-12

final result: passed

### Scope and findings

Rebuilt `gym.html` with the shared header, menu, fonts, palette, photo hero,
shortcuts and footer. Added `gym-page.css` and a small progressive class filter
in `gym-page.js`. `.impeccable/build-gym.py` records the one-time page assembly.
The page now distinguishes gym sessions from classes, makes the app the primary
booking route and gives first-time visitors practical guidance.

The old page duplicated featured classes in its catalogue, implied that Douglas
offered gym classes, and published blanket durations, prices and availability
claims. The new class finder contains twelve programmes supported by the current
official pages. General Boxercise and Teen Boxercise were not carried forward
because the current programme listings did not substantiate them; AgeWell
Boxercise is retained. MoveWell has an enquiry route, and Movin’ Chat describes
movement and social activity rather than reusing MoveWell's eligibility copy.

No actionable P0/P1/P2 issues remain. A small result-label grammar issue was
corrected during QA (`2 teen programmes`), and Aquafit's intrinsic dimensions
were corrected to 735 × 490. No new raster assets were generated or downloaded.

### Paired visual review

Opened the approved homepage `centres-home-reference.png` alongside
`gym-hero-desktop.png`, both at 1267 × 972 CSS pixels, top-of-page state. The gym
hero intentionally follows the shorter interior-page height. Logo, navigation,
Archivo type, photo treatment, rounded corners, white CTA and overlapping
shortcuts follow the source system. Hero copy and image are appropriate to the
gym page, and contrast remains clear over the photograph.

Opened `centres-hero-mobile.png` and `gym-hero-mobile.png` together at 390 × 844
CSS pixels. The mobile hero, menu, booking button and stacked shortcuts retain
the same spacing and hierarchy. No clipped text or controls were found.

All screenshots are under `.impeccable/reference/`. Additional section captures:
`gym-classes-desktop.png`, `gym-start-desktop.png`, `gym-app-desktop.png`,
`gym-classes-mobile.png`, `gym-classes-narrow.png`, `gym-app-narrow.png`,
`gym-classes-tablet.png`, `gym-intro-tablet.png` and `gym-app-tablet.png`.
`gym-before.png` records a scrolled portion of the replaced class-card design,
not its hero. Section screenshots were opened and readable for visual review.

### Fidelity and responsive behavior

- Typography: existing self-hosted Archivo and Archivo Black, using the shared
  heading weights and spacing. Long class names wrap without clipping.
- Layout: two-column class rows on desktop/tablet and one column on phones;
  category buttons wrap and stay visible. Gym information, visitor accordions
  and iPhone promotion stack on mobile. There is no horizontal overflow at
  1267, 768, 390 or 320px widths.
- Colour: shared navy, pale blue, white and restrained orange arrows. Selected
  filters use navy with white text; keyboard focus is visible.
- Imagery: existing gym, class and iPhone assets load. Thumbnails use compact
  measured slots and preserve proportions. Existing gym photography replaces
  the old LBT image in that row. No fabricated icon artwork or CSS device mockup.
- Content: gyms are limited to Bishopstown and Churchfield. Programme and
  timetable differences remain explicit. The app is presented after discovery,
  with direct access from the hero, header and relevant class actions.

### Functional and static verification

- Clicked all five category buttons. Counts and visible rows were correct:
  All 12, Fitness 4, AgeWell 4, Teens 2, Wellbeing 2. Exactly one filter has
  `aria-pressed="true"`; hidden rows have no rendered links. Enter activated
  AgeWell and kept focus on its filter. The count is a polite live status.
- Without enhancement, HTML exposes every programme and hides the inactive
  filter controls. This fallback was verified in the source, not by disabling
  JavaScript in the user's browser.
- Clicked Gym sessions, Fitness classes and Getting started shortcuts; the
  existing `gym.html#classes` destination remains valid.
- Opened all visitor accordions and confirmed only one is open at a time.
- At 320px, opened the menu, verified scroll lock, closed with Escape and
  confirmed focus returned to the menu button with `aria-expanded="false"`.
- Header Get the app, Book a gym session and the Revelate app action reached
  `#app`. The browser booking fallback reached the external Account Login page.
  Both gym centre links reached the expected local detail pages. No booking,
  login, form submission or app installation was performed.
- App store destinations match the verified listings. Badge targets at 320px
  are approximately 123 × 48px and fit side by side.
- `check-local-page.py gym.html`: 98 href/src references, no missing local
  files or fragments, no duplicate IDs and one H1.
- `node --check gym-page.js` and `git diff --check` pass. Browser console
  reported no warnings or errors during gym-page checks.
- Temporary viewport overrides were reset. Previous uncommitted work remains
  intact; this task did not commit, push or deploy.

### Content sources

Verified on 2026-09-12:

- [Bishopstown gym](https://www.leisureworldcork.com/locations/leisureworld-bishopstown/leisureworld-bishopstown-gym/)
  and [Churchfield gym](https://www.leisureworldcork.com/locations/leisureworld-churchfield/churchfield-gym/):
  gym facilities, training areas and pay-as-you-go access.
- [Fitness classes](https://www.leisureworldcork.com/fitness-classes-cork/):
  Bishopstown and Churchfield class routes and staff guidance.
- [Bishopstown class descriptions](https://www.leisureworldcork.com/locations/leisureworld-bishopstown/fitness-classes-bishopstown/):
  programme names and short descriptions. The page does not reproduce current
  prices, schedules, block lengths or medical eligibility details.
- [Teen gym](https://www.leisureworldcork.com/teen-gym-cork/): ages 13–17,
  induction before gym use, parent/guardian attendance and reception bookings.
- [Bishopstown timetable](https://www.leisureworldcork.com/locations/leisureworld-bishopstown/fitness-classes-timetables-bishopstown/)
  and [Churchfield timetable](https://www.leisureworldcork.com/locations/leisureworld-churchfield/fitness-classes-timetables-churchfield/):
  current schedule destinations, without copying times into this static hub.

Implementation checklist: complete.

## Whole-site redesign — 12 September 2026

final result: passed (local design and interaction review; not legal certification)

All 38 public pages use the approved Archivo, navy, pale-blue, white and
restrained-orange system. Photo heroes serve activity/programme pages; lighter
editorial layouts serve practical information and documents. Every page has
a clear next step and common navigation, including app, prices and membership.

### Reference comparison

The approved `centres-home-reference.png` and final
`site-home-final-desktop.png` were emitted together for direct comparison at
1267 × 972 CSS pixels. The headline, frame, typography and positions match.
Intentional improvements are the white header app button and stronger photo
overlay for contrast. Hero copy remains in normal flow to support larger text.

The same reference was compared with `site-programme-desktop.png`. The
programme template retains the photo frame, typography and CTA treatment with
a shorter hero, programme identity and useful facts beneath it. Mobile
`centres-hero-mobile.png` and `site-policy-mobile.png` were compared at
390 × 844. Utility/policy pages intentionally use the light editorial template
with the shared navy navigation. Additional inspected views cover pricing,
contact errors, the mobile menu, policy contents, a programme and app downloads.

Local evidence is under `.impeccable/reference/`: `site-pricing-desktop.png`,
`site-programme-desktop.png`, `site-policy-mobile.png`, `site-app-mobile.png`
and `site-home-final-desktop.png`. No P0/P1/P2 local visual or interaction
findings remain in the reviewed scope.

### Fixes and verification

- Completed all remaining programme, centre, membership, pricing, help, contact,
  careers, training and policy pages; added website accessibility information.
- Corrected duplicated NPLQ content, placeholder award criteria, unsupported
  programme promises, conflicting admission guidance and duplicated hours.
- Removed the watermarked adult stock asset from rendered pages; originals
  remain intact. Responsive encodings reduce the 19 used source images from
  12.8 MB to 2.1 MB for their largest variants. No image content was fabricated.
- Fixed hero/header overlap under text-spacing overrides, narrow headings,
  transient low-contrast text animation and stale stylesheet caching.
- Replaced the embedded Churchfield map with an existing centre photograph;
  the explicit directions link remains.
- 304 final axe/layout checks: 38 pages × four widths × ordinary/text-spacing
  states, zero detected rule violations, image errors or page overflow.
- 2,306 local references and responsive image references pass the static checker.
- Menu keyboard/focus return, help filters/empty/reset, pricing/policy anchors,
  app CTA and contact validation/simulated outcomes were checked in the browser.
- PHP 8.5.10 syntax and 15 isolated handler cases pass with real mail disabled.
  JavaScript syntax and Git whitespace checks pass.

See `docs/audit-results.json`, `docs/accessibility-review.md` and
`docs/content-and-discovery.md` for results, scope, sources and outstanding
manual/production checks. Automated success is not full WCAG/EN certification.
No external booking, account creation, purchase, real enquiry, commit, push or
production deployment was performed.

## Bishopstown / Churchfield consistency follow-up — 12 September 2026

The reference for Bishopstown centre pages is the approved Churchfield layout.
Bishopstown now uses the same `centre-page` markup and `centre-page.css` instead
of the light `interior-page` template. Centre details and imagery remain specific
to each location. The obsolete sentence referring to a removed opening-hours
table was corrected on both pages.

Source visual truth: `.impeccable/reference/churchfield-consistency-desktop.png`,
`churchfield-consistency-mobile.png`, `churchfield-consistency-facilities.png`
and `churchfield-consistency-activities.png` in the same directory.
Implementation evidence: corresponding `bishopstown-consistency-*.png` files,
plus `bishopstown-consistency-find-mobile.png`. The original mismatch is recorded
in `bishopstown-consistency-before.png`.

Comparison state and dimensions:

- Desktop viewport: 1267 × 972 CSS pixels; final source and implementation
  screenshots: 1252 × 960 pixels from the browser capture API.
- Mobile viewport: 390 × 844 CSS pixels; both screenshots: 375 × 811 pixels.
- Source and implementation were emitted together in each comparison input.
  Both use the same browser capture density; no additional image resizing or
  pixel-diff precision is claimed.
- Full viewport: page top, menu closed. Focused comparisons: facilities and
  activity anchors on desktop; hero, visit strip and contact details on mobile.
- An activity-card capture initially included pointer hover. The pointer was
  moved to the background and both resting card states were compared again.
  This was a capture-state correction, not a CSS defect.

Findings and comparison history:

- Initial P1 mismatch: Bishopstown used a detached navy header, light text hero,
  panoramic banner and utility cards. Replaced with Churchfield's image hero,
  overlapping visit strip, editorial introduction, six facilities, photo cards,
  opening-hours section, contact section and membership invitation.
- Final paired desktop/mobile comparisons show no actionable P0/P1/P2 mismatch.
  Longer Bishopstown facility descriptions naturally add a little section
  height; grid tracks, padding, type hierarchy and alignment remain shared.
- Typography: same Archivo / Archivo Black families, sizes, weights, tracking
  and hierarchy. Bishopstown's longer name fits without truncation on mobile.
- Layout: hero size, margins, corner radius, visit strip, grids and card
  proportions match. Mobile contact and booking controls remain readable.
- Colors: shared navy, blue, orange, pale background and white treatments;
  identical hero shade, button and interaction tokens.
- Images: actual Bishopstown pool replaces Churchfield's slide photo. Existing
  gym and swimming-lesson assets are shared. No fabricated centre images.
  P3 follow-up: the existing Bishopstown pool source is only 518 × 300, so its
  hero is softer than Churchfield's; a higher-resolution original would improve
  sharpness. It is retained as the available verified photograph of this centre.
- Content: Bishopstown's three pools, Functional Zone, Rossa Avenue address,
  phone, directions and cross-centre membership wording remain correct. App
  calls to action lead to the shared app page. Churchfield-only facilities were
  not copied into Bishopstown.

Validation:

- 16 targeted axe-core/layout checks: two centres × four widths (1267, 768,
  390, 320) × normal and WCAG text spacing. Zero automated rule violations,
  overflow, broken-image or hero-overlap flags. Raw evidence:
  `docs/centre-consistency-audit.json`. These checks are not a conformance
  certification and retain axe's incomplete/manual-review results.
- Manually checked mobile menu opening, Escape closing and focus return,
  Get the app navigation and return, facilities/find-us anchors, and contact
  details. No browser console warnings or errors were recorded.
- Static validation: 38 pages, 2305 local references, zero errors. Canonical
  URL and centre structured data remain Bishopstown-specific; sharing image
  metadata now follows the pool hero.
- Factual source: https://www.leisureworldcork.com/locations/leisureworld-bishopstown/
  and the previously recorded official pool image source.

Implementation checklist: complete. The shared centre stylesheet is used by
both pages; only centre content differs. No deployment or commit was performed.

final result: passed

## Bishopstown layout restored — user preference, 12 September 2026

The user preferred Bishopstown's previous design. Restored its light text hero,
separate panoramic centre photograph, facilities cards, visitor information and
in-page iPhone/app download section. This supersedes the Churchfield-template
choice in the preceding consistency review; its 16-check report describes that
previous revision, not a fresh audit of the restored layout.

Only Bishopstown was rebuilt. Its centre metadata, optimized image assets,
current contact details and accessibility styles were retained. Verified the
restored page in the browser, menu visibility, app anchor and back-to-top link.
Static validation: 38 pages, 2306 local references, zero errors. No fresh full
accessibility matrix was run for this restoration.

## Churchfield matched to the preferred Bishopstown layout — 12 September 2026

Reference: the restored Bishopstown light layout. Churchfield now uses the same
header, light introduction, separate photo banner, six-card facilities grid,
opening-hours section, visitor information and iPhone/app download section.
The previous full-photo Churchfield template is superseded by this user choice.

Source visual truth: `.impeccable/reference/bishopstown-light-desktop.png`,
`bishopstown-light-facilities.png` and `bishopstown-light-mobile.png`.
Implementation: `.impeccable/reference/churchfield-light-desktop.png`,
`churchfield-light-facilities-final.png`, `churchfield-light-mobile.png`, plus
`churchfield-light-app-mobile.png` for the mobile booking route.

Comparison conditions:

- Desktop: 1267 × 972 CSS viewport; both final image pairs are 1252 × 960 pixels.
  Full viewport at page top and focused facilities anchor were compared.
- Mobile: both pages rendered in a 390 × 844 CSS iframe in the local QA harness;
  both saved comparison crops are 390 × 844 pixels. Browser capture scaling and
  some harness background are present equally in both images. No additional
  resampling or pixel-level equality is claimed.
- Each reference/implementation pair was emitted together in the same tool
  input. Resting page states and matching section anchors were used.

Findings / iteration history:

- [P2, fixed] The first facilities comparison showed the new inline adult lesson
  and fitness class links styled as plain paragraph text. Added underlining to
  `.location-page .info-card p a`, refreshed the Churchfield stylesheet cache key
  and captured `churchfield-light-facilities-final.png`. The final paired view
  confirms clear link affordances without changing card spacing.
- No actionable P0/P1/P2 findings remain after the fix.

Required fidelity surfaces:

- Typography: shared Archivo / Archivo Black families, weights, sizes, line
  heights and tracking. Centre names wrap consistently on desktop and mobile.
- Spacing/layout: identical light hero and banner proportions, grid tracks,
  padding, dividers, radii, buttons and section order. Contact information has
  an additional short membership paragraph to retain Churchfield's content.
- Color/tokens: same navy header, pale page surface, white sections, blue icons
  and orange arrows, using the existing shared styles.
- Imagery: Churchfield's real pool/play-area photo fills the same 5:1 banner slot
  using a centre-specific crop. Bishopstown's photo is unchanged. The existing
  iPhone app asset and official download badges are reused, with no new assets.
- Content: Churchfield's pool/play, gym/classes, lessons, teen gym, sauna/steam,
  pitches, Knockfree Avenue address, phone, directions and membership detail
  are preserved. No Bishopstown-specific facility was copied. The removed
  question callout has not been reintroduced.

Verification:

- `docs/churchfield-light-audit.json`: eight checks (1267, 768, 390, 320 widths,
  normal and WCAG text spacing), zero automated rule violations, layout flags
  or broken images. The report retains manual-review/incomplete results and
  does not certify full WCAG conformance.
- Mobile menu opens and closes with Escape; Get the app scrolls to the working
  download/browser-booking section and iPhone preview. Facilities navigation,
  image loading and visible page content were checked in the browser.
- Browser console: no warnings or errors recorded.
- Static validation: 38 pages, 2310 local references, zero errors. Centre schema
  and social-image metadata remain Churchfield-specific, with matching
  Home → Centres → Churchfield breadcrumbs.

Implementation checklist: complete. No deployment or commit performed.

final result: passed
## Comprehensive follow-up — 12 September 2026

Reviewed all 38 public routes with fresh top/content/end browser captures in
`.impeccable/full-review/captures/`. Before copies are in the same review's
`before/` directory. Retained the approved homepage and light centre direction.

Resolved centre-template drift, weak centre booking emphasis, the prepaid-plan
comparison loop, poorly connected programme details, adjacent action spacing,
inline-link affordances and one HTTP 404. Added the activity decision aid,
visible breadcrumbs and matching directory/course schema. Douglas's app copy
now reflects its pool-only purpose. No speculative opening times or capacity.

Inspected the updated centre trio at 390px side by side, activity chooser at
desktop and 390px, lesson/membership paths at 390px, distinct course heroes and
the homepage's app funnel. Initial offscreen iframe image-paint artefacts were
rejected and replaced with visible-row/direct captures.

Final automated coverage: 304 whole-site checks plus seven focused state checks;
zero rule violations, broken images, overflow flags or hero/header overlaps.
Static validation: 38 pages, 2,369 local references, zero errors. Fifteen PHP
fixtures passed with mail disabled. JS syntax and Git whitespace checks passed.
Manual checks include keyboard menu/focus, six activity choices, five gym filter
states, FAQ empty/reset/disclosure, enquiry preselection and mocked form outcomes.
No-script activity/help content was checked with a local script-blocking policy.

Manual axe flags: closed-dialog ID confirmed; image-backed text reviewed against
the shared dark overlay (white minimum 5.03:1; light supporting text 4.55:1);
footer logo crop and caption visually checked. A full accessibility conformance
evaluation and external booking/payment tests remain outstanding.

Accepted evidence and a 38-row review are in `docs/comprehensive-review.md`.

## Every-page visual refinement after feedback — 12 September 2026

The user rejected the earlier visual quality and explicitly reconfirmed every
page as the scope. Fresh desktop and phone review covers all 38 public pages.
Thirty received design or flow changes; the approved homepage and centre
direction was retained. Swim School was rebuilt, its programme details opened
up, supporting editorial/course pages refined, gym cards enlarged and price
tables made fully readable without horizontal scrolling on phones. Help search,
centre-specific enquiries and compact policy contents were also refined.

Current evidence: `docs/design-refinement-review.md` and
`docs/design-refinement-audit.json`. There are 304 final responsive/text-spacing
checks with zero detected rule violations or layout/image flags. Static checks:
38 pages, 2,436 local references, zero errors; all routes reachable from home.
All 12 policy bodies are text-identical to their before copies. Keyboard menu,
FAQ, class filters, help search, policy navigation, no-script content, enquiry
preselection and empty-form validation were checked. Wider accessibility and
external-service evaluation is still required; no full-conformance claim.

Accepted screenshots were saved, reopened and inspected. The working capture
set and before copies are in `.impeccable/second-pass/`. Early gallery compositor
artefacts were excluded from the accepted images. This is an implementation
review, not a record of final user approval. No commit, push or deployment.
