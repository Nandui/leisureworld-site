# Keeping visitor information current

The public site contains 48 connected HTML pages. Bookings are app-first, with
a browser alternative. Phone and email provide support without a contact form.

## Hours, notices, course dates and jobs

Edit `data/visit-information.json`, then run `npm run build`. The build writes
marked regions in `opening-hours.html`, the three centre pages,
`Certfictaons/nplq.html` and `careers.html`. Do not hand-edit between `feed:*`
comments: the next build replaces that content. Pitch pages link to these same
timetables so there is one maintained set of hours.

The JSON is also published at `/data/visit-information.json`. This is an
editorial information feed; Legend supplies live availability and transactions.

| Field | Responsibility |
| --- | --- |
| `checkedOn` | Date staff actually checked schedules, not the deployment date. |
| `centres[].gymHours`, `pitchHours` | Days and opening windows for each centre. |
| `centres[].swimming.pools[].rows` | Public swim windows, closures and exceptions for each named pool. |
| `centres[].classes` | Day, time, programme and duration; use `null` when duration is unpublished. |
| `swimming.validThrough` | End date of a seasonal timetable; Douglas currently ends 31 December 2026. |
| `notices` | Centre, text, `startsOn`, `endsOn`. Publish a new build when a notice starts. |
| `courses` | Confirmed dates, times, venue, fee, inclusions and specific course URL. |
| `recruitment` | Date checked, role titles/locations and employer application URL. Remove closed roles on review. |

Use `YYYY-MM-DD` dates. Builds reject invalid dates, unknown notice centres and
non-HTTPS course URLs. Course booking links, notices and seasonal timetables
expire in the browser after their end date, with a contact fallback. A new
deployment removes expired course entries from static HTML.

Membership and supervision fields document owner-confirmed decisions. Changes
to these rules also require edits to policy, pricing, membership, help and
parent pages; those pages are not rewritten automatically from JSON.

## Confirmed rules and source ambiguities

- Membership covers Bishopstown and Churchfield only. Douglas is separate.
- Under-10s need an adult aged 18+ in the water, at most two children per adult.
  Ages 10–12 need an adult in the building. Lesson attendance rules also apply.
- Bishopstown's published early Tuesday 18m-pool window reads “9am–8am”. That
  invalid window is omitted with advice to ask reception. Confirmed sessions
  later on Tuesday remain visible.
- Pitch peak cutoffs conflict between sources. Show peak/off-peak rates and
  let the selected booking determine the price; do not guess the cutoff.
- The 2025 gender report contradicts itself about the direction of the
  part-time median gap. The page preserves its number and explains the issue;
  change this only against an approved corrected report.

Contradictory originals (terms, child admission, pool poster and 2026 price
poster) remain in the audit archive, outside the deployed site. Their useful content is retained
in corrected HTML. Do not restore the obsolete PDFs as public alternatives.

## Validation and publishing

Edit other HTML for activity descriptions, prices, policies and contacts.
Check that each primary action describes its destination: “Search” for a course
search, “Ask” for an enquiry. Keep essential information on this site.

After changing metadata, shared CSS/JS or FAQ text, install the Python packages
in `scripts/requirements.txt` if necessary and run:

```powershell
python scripts/update-metadata.py
python scripts/check-site.py
npm test
npm run build
npm run dev -- --dist --port 8124
```

Review the changed pages at phone width and with a keyboard. Commit source
HTML, JSON, assets and code to GitHub; Vercel builds `dist`. Generated deployment
files and local audit screenshots are excluded from Git. See the
[deployment guide](deployment.md) and [audit](audit-2026-09-16/README.md).
