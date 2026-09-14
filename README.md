# LeisureWorld Cork website

The redesign covers all 38 public HTML pages. The primary booking route is the
LeisureWorld app, with a browser booking alternative. Centre, activity, lesson,
membership, pricing, support and policy pages share the homepage design.

## Preview

```powershell
python scripts/preview.py
```

Open `http://127.0.0.1:8123`. Use `--port 8124` if needed. This loopback-only
preview serves public static file types and cannot execute PHP. Contact requests
in a static preview display the failure/recovery state.

## Implementation

- Static HTML contains the content, navigation and search metadata.
- `homepage.css` / `homepage.js` provide shared brand components and the menu.
- `site-pages.css` styles supporting pages. `site-accessibility.css` applies to
  every page; activity and centre styles extend the same design.
- `site-pages.js` enhances help search; `gym-page.js` enhances class filtering.
- `contact-page.js` provides labelled errors and honest submission states.
  `send-mail.php` validates the enquiry and hands it to the host's mail transport.
- Fonts/icons are local. `Images/optimized/` contains responsive WebP versions;
  original source images remain intact.
- Legacy `style.css` and `script.js` are not referenced by redesigned pages.

No framework or browser build is required. Live bookings, membership purchases,
current timetables and some specialist information belong to linked services.
There is no internal live-availability system or enquiry escalation pipeline.

## Maintenance and checks

Edit the HTML and relevant shared CSS, then run:

```powershell
python -m pip install -r scripts/requirements.txt
python scripts/optimize-images.py
python scripts/update-metadata.py
python scripts/check-site.py
```

Run image optimization when source images change. It creates encodings without
cropping or altering image content. Metadata generation updates canonical/social
tags, JSON-LD, asset cache keys, sitemap, robots rules and the optional AI directory.

`site-settings.json` uses **https://www.leisureworldcork.com** as the intended
production base. Change it and regenerate metadata for another domain/subpath.
Keep exact filename casing on Linux hosts.

See [page purposes](docs/page-purpose.md), [accessibility review](docs/accessibility-review.md)
and [content/search notes](docs/content-and-discovery.md).

## Contact service

Production requires a supported PHP version and a configured mail transport.
Set `LEISUREWORLD_CONTACT_TO` to the approved mailbox; the default is
`info@leisureworldcork.com`. Configure the sender domain on the host. Success
means the transport accepted the email, not proof of inbox delivery.

PHP 8.5.10 syntax and 15 isolated handler cases were checked. To repeat without
sending any email:

```powershell
python scripts/test-contact.py path/to/php.exe
```

The fixture disables real `mail()` before replacing it with a test stub.
Production mail delivery still needs a separate test.

## Before publishing

1. Confirm the production domain, canonical paths and redirects. HTML should
   revalidate; asset query strings must be included in cache keys.
2. Deploy public HTML, referenced CSS/JS/assets, discovery files and the PHP
   endpoint. Exclude `.git`, `.impeccable`, `scripts`, reports and development
   files. Robots exclusions are not access controls.
3. Configure and verify mail delivery. GitHub Pages and other static hosts
   cannot execute the PHP endpoint.
4. Preserve linked official timetable, course, privacy and specialist routes
   if replacing the existing website; these still depend on that service.
5. Complete the wider accessibility/external booking evaluation in the review
   and have the operator confirm approved policy texts and statement wording.
6. Submit the production sitemap to verified search accounts and check real
   host/CDN crawl access. Indexing and ranking are not guaranteed.

No deployment, purchase, app installation or real enquiry was performed.
Original repository attribution: [Nikita Joisa](https://github.com/nikitajoisa).
## Latest comprehensive review

The [latest 38-page visual review](docs/design-refinement-review.md) records the
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
