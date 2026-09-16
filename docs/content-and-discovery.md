> Historical review from 12 September 2026. The current 48-page migration and verification are recorded in [the September audit](audit-2026-09-16/README.md).

# Content and AI search discovery

The latest [every-page refinement](design-refinement-review.md) makes programme
names, suitability and progression more prominent in visible HTML. All 38 pages
remain reachable from the homepage. Metadata and discovery files were regenerated
after the changes; the five course entities and five directory lists continue to
match their visible content. No special AI claims or fabricated offers were added.

Important information is static HTML: centre facts, programme suitability,
prices, policy text, questions/answers and clear next steps. It remains crawlable
without JavaScript. Every page has unique metadata, a canonical URL and social
preview tags. JSON-LD describes the organisation, website, pages, breadcrumbs,
centre addresses/phone numbers and visible help questions. No ratings, real-time
availability or unverified openingHours values were fabricated.

`sitemap.xml` lists all 38 pages. `robots.txt` permits public search crawling and
explicitly allows OAI-SearchBot. No separate GPTBot training preference was added;
search and training controls are independent.
[OpenAI crawler documentation](https://developers.openai.com/api/docs/bots).

`llms.txt` is an optional content directory, not a required file or a promise of
AI citations. Google requires no special AI schema or text file; crawl access,
useful visible information and matching structured data remain the foundations.
[Google AI search guidance](https://developers.google.com/search/docs/appearance/ai-features).

Search accounts, analytics and CDN settings were not configured. After deployment,
verify the domain, redirects, crawl access and sitemap, then measure useful
visits to app/booking destinations. No ranking or traffic result has been measured.

## Sources and decisions

Checked 12 September 2026, alongside sources in earlier page reviews:

- [About LeisureWorld](https://www.leisureworldcork.com/about/): operator identity
  and community context. Three leisure centres remain distinct from other
  facilities operated by LW Management.
- [Prices](https://www.leisureworldcork.com/prices/) and
  [Douglas](https://www.leisureworldcork.com/locations/leisureworld-douglas/):
  centre-specific pricing; class add-ons shown separately from membership.
- [Opening hours](https://www.leisureworldcork.com/opening-hours/): conflicting
  duplicated times removed. Published schedules do not establish availability.
- [Swimming lessons](https://www.leisureworldcork.com/swimming-lessons-cork/):
  the three named children's programmes are described for Bishopstown. Adult
  and individual lessons have a separate route. Unsupported fixed prices,
  durations, group sizes and a club claim were removed.
- [Course search](https://leisureworldcork.legendonlineservices.co.uk/enterprise/program/index)
  and [parent guide](https://www.leisureworldcork.com/swimming-lessons-cork/swim-lessons-parent-help/):
  booking and existing-family destinations. No place-availability promise.
- [Functional Zone](https://www.leisureworldcork.com/health-wellbeing/functional-zone/):
  HSE Community Physiotherapy access route; LeisureWorld does not decide referrals.
- [Facility accessibility](https://www.leisureworldcork.com/accessibility/):
  contact the chosen centre for arrangements; facilities are not asserted to
  be identical at every location.
- [NPLQ](https://www.leisureworldcork.com/training/nplq-courses/): corrected the
  duplicated swim-teacher content. Current dates and fees stay with the listing.
- [Careers](https://www.leisureworldcork.com/careers-at-lw-management/): role
  descriptions and the current employer application route.
- [August 2025 admission policy](https://www.leisureworldcork.com/wp-content/uploads/2025/08/1.13-LeisureWorld-Admission-Policy-August-2025-1.pdf):
  old contradictory thresholds in terms/pool rules now point to current admission.
- Other supplied policy texts were preserved in readable HTML. They have not
  been rewritten as new legal commitments; the operator should confirm current
  approved versions. [Official policy library](https://www.leisureworldcork.com/leisureworld-policies/).

App destinations are the verified [App Store](https://apps.apple.com/ie/app/leisureworld/id1479809806)
and [Google Play](https://play.google.com/store/apps/details?id=com.innovatise.leisureworldsport)
listings. The user's supplied screenshot remains the content reference inside
the approved iPhone artwork. No installation, purchase or booking was completed.

## Maintenance and performance

Change `site-settings.json` before publishing on another domain and regenerate
metadata after content edits. Structured data must match the visible content.

The comprehensive follow-up added visible parent breadcrumbs to photo-led pages,
ItemList data for the five directories and Course data for the five programme/
qualification detail pages. The generator reads directory names and URLs from
the visible cards. No dated CourseInstance or offer is invented. Metadata
generation leaves unchanged HTML alone. The sitemap omits optional `lastmod`
values because file rewrites are not evidence of reviewed content dates.
[Schema.org Course](https://schema.org/Course),
[Schema.org ItemList](https://schema.org/ItemList),
[Google sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).

All 25 distinct external information, booking and app URLs checked returned
successful responses after one obsolete CCPC reference was corrected. Social
profiles and map directions were excluded from this HTTP check; successful
responses do not prove the usability of an external transaction. Preserve the
linked live LeisureWorld routes during deployment or supply verified redirects.

The largest responsive versions of 19 used images total 2,069,116 bytes compared
with 12,799,005 bytes for their originals: approximately 84% less. Smaller
viewport variants are also provided. Original files are retained. This is an
asset-size comparison, not a measured load-time or Core Web Vitals result.
