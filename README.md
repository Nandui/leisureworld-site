# LeisureWorld Cork website

The redesign covers all 48 public HTML pages. The primary booking route is the
LeisureWorld app, with a browser booking alternative. Centre, activity, lesson,
membership, pricing, support and policy pages share the homepage design.

The current [whole-site audit](docs/audit-2026-09-16/README.md) records link,
content, layout and interaction checks. See the [content maintenance guide](docs/content-maintenance.md)
for timetables, course dates, jobs, notices and confirmed visitor policies.

## Preview

```powershell
npm run dev
```

Open `http://127.0.0.1:8123`. Use `npm run dev -- --port 8124` if needed. This
loopback-only preview serves public files including timetable PDFs and the JSON
content feed. Contact uses direct email and phone links.

## Implementation

- Static HTML contains the content, navigation and search metadata.
- `homepage.css` / `homepage.js` provide shared brand components and the menu.
- `site-pages.css` styles supporting pages. `site-accessibility.css` applies to
  every page; activity and centre styles extend the same design.
- `site-pages.js` enhances help search; `gym-page.js` enhances class filtering.
- `contact-page.js` optionally prefills the email subject and centre phone link
  for visitors arriving from an activity enquiry. All contact choices work
  without JavaScript; there is no website email-submission backend.
- `data/visit-information.json` is the GitHub-editable content feed. The content
  build writes its published information into static HTML regions.
- Fonts/icons are local. `Images/optimized/` contains responsive WebP versions;
  original source images remain intact.
- Legacy `style.css` and `script.js` are not referenced by redesigned pages.

No frontend framework is required. Node.js 22 runs the content and deployment
build. Live bookings and membership purchases belong to external services;
the editorial feed does not provide live booking availability.

## Maintenance and checks

Edit the HTML and relevant shared CSS, then run:

```powershell
python -m pip install -r scripts/requirements.txt
python scripts/optimize-images.py
python scripts/update-metadata.py
python scripts/check-site.py
npm test
npm run build
```

Run image optimization when source images change. It creates encodings without
cropping or altering image content. Metadata generation updates canonical/social
tags, JSON-LD, asset cache keys, sitemap, robots rules and the optional AI directory.

`site-settings.json` uses **https://www.leisureworldcork.com** as the intended
production base. Change it and regenerate metadata for another domain/subpath.
Keep exact filename casing on Linux hosts.

See [page purposes](docs/page-purpose.md), [accessibility review](docs/accessibility-review.md)
and [content/search notes](docs/content-and-discovery.md).

## Contact and deployment

Contact is by direct phone/email for this release. The email button opens the
visitor's email app, and the address is visible for copying. Existing activity
enquiry links can prefill the subject. No account, API key or mail transport is
needed. The obsolete PHP handler and fixtures were removed; its old URL safely
redirects to the contact page.

Vercel runs `npm run build` and publishes only `dist/`, as configured in
`vercel.json`. The build runs the content generator and copies public files from
an allowlist. It excludes documentation, scripts, tests, secrets and configuration.
See [deployment instructions](docs/deployment.md) for the GitHub workflow and
local production-output preview.

## Before publishing

1. Confirm the production domain, canonical paths and redirects. HTML should
   revalidate; asset query strings must be included in cache keys.
2. Use the committed Vercel build settings and publish only `dist/`. Robots
   exclusions are not access controls.
3. Check direct email/phone links and the old contact endpoint redirect.
4. Review published timetable, course and policy information and keep the JSON
   feed and local documents current.
5. Complete the wider accessibility/external booking evaluation in the review
   and have the operator confirm approved policy texts and statement wording.
6. Submit the production sitemap to verified search accounts and check real
   host/CDN crawl access. Indexing and ranking are not guaranteed.

No deployment, purchase, app installation or real enquiry was performed.
Original repository attribution: [Nikita Joisa](https://github.com/nikitajoisa).
## Previous design review

The [earlier 38-page visual review](docs/design-refinement-review.md) records the
follow-up after feedback on Swim School and the whole site. Thirty pages received
design or flow refinements. The [current results](docs/design-refinement-audit.json)
contain 304 final responsive/text-spacing checks and focused interaction evidence.
The site targets WCAG 2.2 AA; this is not a full conformance certification of the
site and external services.

`activity-finder.js` progressively enhances the Activities page. Centre pages use
the shared light template. Regenerate metadata after content or shared asset edits
using `scripts/update-metadata.py`; it also maintains visible-content-based course
and directory schema. Keep existing linked live routes or tested redirects when
deploying this static redesign.

`page-refinements.css` styles the editorial lesson/training pages, gym cards,
mobile price rows, membership, help, contact and policy reader. `swim-school.css`
owns the Swim School hub. Policy contents use native disclosures, expanded by
`site-pages.js` on larger screens. Mobile price cells carry visible labels;
maintain those labels when changing a table's column headings.
