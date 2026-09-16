# External service audit — 16 September 2026

Sixteen distinct external destinations were checked by read-only GET, with
rendered browser checks for the booking, membership, course, voucher and Apple
pages. No account was used; no booking, purchase, application or message was
submitted. Raw HTTP results and page references are in `external-services.json`.

No destination returned HTTP 404 or 410. Indeed blocked both direct and browser
checks; that is an **unverified provider restriction**, not evidence of a dead
link. Google Maps reached its consent screen, so its destination parameters were
checked but a route from a visitor's starting point was not calculated.

| Destination | Evidence | Why the link belongs |
| --- | --- | --- |
| [Apple App Store](https://apps.apple.com/ie/app/leisureworld/id1479809806) | Direct GET rate-limited; browser renders LeisureWorld app and Cork operator. | Official iPhone download, primary booking route. |
| [Google Play](https://play.google.com/store/apps/details?id=com.innovatise.leisureworldsport) | HTTP 200; LeisureWorld app, Innovatise publisher, LeisureWorld support website/email. | Official Android download, primary booking route. |
| [Legend login](https://leisureworldcork.legendonlineservices.co.uk/enterprise/account/login) | HTTP 200; rendered email/password, password reset, casual registration and membership choices. | Subtle browser-booking alternative and account access. |
| [Legend membership](https://leisureworldcork.legendonlineservices.co.uk/enterprise/onlinesignup) | Redirects to `/enterprise/join`; rendered facility selector and joining stages. | Membership selection and purchase belong to the operator's transaction system. |
| [Legend course search](https://leisureworldcork.legendonlineservices.co.uk/enterprise/program/index) | HTTP 200; rendered course-name search and categories for adult/child lessons, camps, training and other courses. | Current course availability and registration. Local pages should explain which category to choose. |
| [NPLQ course 8699](https://leisureworldcork.legendonlineservices.co.uk/enterprise/program/8699) | HTTP 200; rendered RLSS Pool Lifeguard Course at Bishopstown, 27–31 October 2026, €500, minimum age 16; Register link present. | Specific live registration for the published NPLQ course; retain only while the course remains current. |
| [Gift vouchers](https://leisureworld-cork.vouchercart.com/app) | HTTP 200; rendered LeisureWorld Cork voucher shop, gift voucher product and Cork reception details. | Voucher purchase is handled by VoucherCart; no checkout was started. |
| [LeisureWorld jobs on Indeed](https://ie.indeed.com/cmp/Leisureworld-Cork/jobs) | Direct HTTP 403 and browser Request Blocked; web index identifies the employer jobs page, but that index was six months old. | Employer jobs listing, with local direct-contact fallback. Current vacancies remain unverified. |
| [Bishopstown directions](https://www.google.com/maps/dir/?api=1&destination=LeisureWorld+Bishopstown+Rossa+Avenue+Cork) | HTTP 200; correct named centre and street in Maps destination. | Directions from the visitor's location. |
| [Churchfield directions](https://www.google.com/maps/dir/?api=1&destination=LeisureWorld+Churchfield+Cork) | HTTP 200; correct named centre in Maps destination. | Centre-directory directions. Prefer the same street-specific URL used by the centre page for consistency. |
| [Churchfield street-specific directions](https://www.google.com/maps/dir/?api=1&destination=LeisureWorld+Churchfield+Knockfree+Avenue+Cork) | HTTP 200; correct centre and street; browser reaches Google consent screen. | Directions from the centre-detail page. |
| [Douglas directions](https://www.google.com/maps/dir/?api=1&destination=Gus+Healy+Pool+Nursery+Drive+Douglas+Cork) | HTTP 200; correct pool, street and district in destination. | Directions to Gus Healy Pool rather than a generic Douglas search. |
| [Facebook](https://www.facebook.com/LeisureWorldCork) | HTTP 200; title identifies LeisureWorld Cork. | Optional social updates in the footer, separate from essential visitor information. |
| [Instagram](https://www.instagram.com/leisureworldhq/) | HTTP 200; title identifies LeisureWorld and the expected account. | Optional social updates in the footer. |
| [Office of the Ombudsman](https://www.ombudsman.ie/) | HTTP 200; correct official organisation. | Escalation route from the website-accessibility information. |
| [CCPC services guidance](https://www.ccpc.ie/consumer-advice/consumer-rights/buying-services) | HTTP 200; specific buying-services/contract guidance. | Relevant consumer guidance from the terms page. |

## Context findings

The general Legend course link opens a search form rather than preselected adult
or child results. Labels such as “Search adult courses” and nearby guidance to
choose **Adult Swim Lessons** or **Children Swim Lessons**, then the correct centre,
set an accurate expectation. Its training category is **Courses (NPLQ, Swim Teacher
etc)**. No availability is implied by a successful link check.

The two Churchfield Maps URLs are both sensible. Reusing the street-specific
variant avoids unnecessary differences between directory and centre pages.

## Deployment and old-route review

The static build outputs only allowlisted public files to `dist/`, preserves
`.html` URLs, and does not contain PHP or an email API. The old `/send-mail.php`
route uses HTTP 303 to reach the current contact options. The source repository
and audit reports are excluded from public output. Production Git integration,
DNS and CDN routing require a deployed preview to verify; none was deployed here.

Beyond the 17 old URLs originally linked by the redesign, saved source navigation
contains additional old routes. Recommended equivalent mappings were sent to the
integrating agent and recorded in `additional-redirect-candidates.json`.
Unmatched specialist/news routes should not be redirected to an unrelated page
merely to suppress a 404; their retained content needs a deliberate destination.
