# Accessibility review — 12 September 2026

The [latest visual refinement review](design-refinement-review.md) and
[304 current checks](design-refinement-audit.json) supersede earlier layout results.
Price tables now reflow into labelled rows on phones with explicit table,
row-group, row and cell/header semantics. Policy contents are native disclosures,
expanded on desktop and compact on phones; keyboard and no-script use were
checked. Programme information is visible without opening multiple disclosures.

The implementation target is **WCAG 2.2 Level AA** for all 38 local HTML pages.
This review is not a legal certification or a complete conformance evaluation.

Ireland's public-sector web baseline is EN 301 549 v3.2.1, including WCAG 2.1 AA
and additional requirements. LeisureWorld's organisational context makes that
baseline relevant to review; the operator must confirm precise legal scope and
responsibilities. [NDA requirements](https://nda.ie/monitoring/eu-web-accessibility-directive/what-are-the-eu-web-accessibility-requirements).

The European Accessibility Act applies to covered services, including e-commerce,
from 28 June 2025. Testing this website's links cannot establish accessibility
of the complete booking/payment service. [NDA EAA information](https://nda.ie/events/european-accessibility-act).
The newer design target does not replace the need to assess every applicable
requirement. [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/).

## Implemented

- Language, meaningful titles, one H1 per page and labelled landmarks.
- Skip links, visible focus, consistent navigation and a native modal menu.
- Keyboard-usable native disclosures, class filters and help search.
- Form labels/autocomplete, associated errors, a focused error summary and
  links to invalid inputs. Submission progress/results are announced.
- Failed requests retain details and offer direct email. Success requires
  confirmation from the endpoint. A native form fallback is retained.
- Readable HTML policies with contents links; labelled data tables and
  keyboard-focusable scroll regions for genuinely wide tables.
- Reflow down to 320 CSS pixels, generous targets and heroes that grow when
  text wraps. Long headings wrap instead of overflowing.
- Photo overlays support small white text. Entrance effects no longer fade
  text to low contrast. Reduced-motion and forced-colour styles are supplied.
- Image alternatives/dimensions and decorative icons hidden from assistive tools.
- Separate website accessibility and physical facility access information.

## Verification

The final automated browser matrix covered **38 pages × four widths = 152
checks**, repeated with WCAG text-spacing overrides for another **152 checks**.
Widths: 1267, 768, 390 and 320 CSS pixels, using same-origin iframe layout
viewports. Native scrollbar space is retained.

Axe-core checked WCAG 2 A/AA, 2.1 A/AA, 2.2 AA and best-practice rules. Disclosures
were expanded. The final matrices detected **zero rule violations**, no broken
images, no page-level horizontal overflow and no hero/header overlap. These
results exclude external services and do not establish complete conformance.

Spacing overrides: line height 1.5, letter spacing 0.12em, word spacing 0.16em,
paragraph spacing 2em. Wide tables retain their two-dimensional format inside
contained scroll regions. The hero and long-heading fixes arose from this test.

Selected manual browser checks covered:

- Keyboard menu opening, Escape dismissal and focus return.
- Help search, empty results, clear/reset and lesson category filtering.
- Contact topic preselection, error-summary focus and links to invalid fields.
- Simulated contact success and failure: reset on success, retained data on
  failure. No email was sent.
- Policy section navigation, mobile readability and pricing shortcuts.
- App download controls, iPhone artwork and the browser booking alternative.
- Reference/implementation screenshots at matching desktop and phone sizes.

Static checks cover all 38 pages, 2,369 local href/src/action references,
responsive assets, filename case, fragments, IDs, images, form labels and JSON-LD.
Fifteen PHP validation/response tests passed with real mail disabled. JavaScript
syntax and Git whitespace checks passed. The concise results are in
`docs/audit-results.json`; detailed local captures are in the excluded `.impeccable/`.

## Wider evaluation still needed

- Screen readers (NVDA/VoiceOver), speech input, actual browser zoom/text-only
  resizing and representative disabled-user testing.
- The complete external Legend authentication, booking, payment and membership
  journey, including its errors and accessible authentication.
- Linked PDFs, third-party pages, app stores and the mobile app.
- Deployed mail delivery and the process for accessibility feedback and
  alternative-format requests.
- Operator confirmation of legal scope, statement wording and responsibility
  for complaints/escalation before publishing.

The public accessibility statement deliberately makes no full-conformance claim.
Update it after the wider evaluation and as known barriers are resolved.

## Comprehensive follow-up pass

The latest whole-site pass repeated all 304 responsive/spacing checks after the
centre, navigation and conversion refinements. Seven additional checks covered
all six activity chooser states at 320px with expanded spacing and the corrected
terms-page link. All passed with zero detected violations or layout/image flags.
Keyboard operation, live announcements, no-script activity/help content and
centre/topic enquiry preselection were checked. The 15 PHP fixture cases passed
again with real mail disabled.

Manual-review flags for the closed menu target, photographic backgrounds and
cropped logo were inspected separately. Details, accepted screenshots and the
limitations of these checks are in [the comprehensive review](comprehensive-review.md)
and [the current result file](comprehensive-audit-results.json). Earlier results
remain as historical records.
