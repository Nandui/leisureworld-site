# GitHub to Vercel deployment

The site uses static HTML, CSS and browser JavaScript. Node.js 22 runs the content
build; there is no application server or email provider to configure. Contact is
by direct phone and email, as agreed for this release.

## Project settings

Connect this GitHub repository to the existing Vercel project. Use the repository
root, the **Other** framework preset, build command **npm run build**, and output
directory **dist**. These settings are recorded in `vercel.json`. Existing
`.html` URLs are preserved. Do not add a catch-all rewrite to `index.html`:
missing pages must return a real 404.

The build first runs `scripts/build-content.mjs`, then copies an explicit public
allowlist into `dist/`. Public HTML, CSS, JavaScript, images, fonts, PDF documents,
discovery files and `data/*.json` are included. Repository metadata, reports,
scripts, tests, dependencies, configuration, environment files and PHP are not
published. `dist/` is generated and excluded from Git.

Commit content and code changes to GitHub; the configured Vercel integration
builds and publishes them. No live deployment or push was performed by the audit.

## Content updates

Edit `data/visit-information.json` in GitHub or locally. The content build updates
marked HTML regions, so hours and published updates remain readable without
JavaScript. The same JSON is published at `/data/visit-information.json` for future
integrations. It is an editorial feed, not live booking availability. Keep source
and review dates accurate and recheck linked timetable documents when replacing
them. See the content-maintenance guide for the exact fields and update workflow.

## Local checks

```powershell
npm test
npm run build
npm run dev -- --dist --port 8123
```

Omit `--dist` to preview the editable source pages; run the content build after
editing JSON. The preview binds only to `127.0.0.1`, serves the same public file
types as the build, and disables caching. Change the port if it is already used.

## Contact behaviour

The contact page displays every centre phone number and the reception email
address. Email buttons open the visitor's email app; the full address can also
be copied. Existing enquiry links can prefill a recognised topic and centre in
the email subject. No enquiry data is submitted to this website and no message
is claimed to be sent. Calls are recommended for time-sensitive booking changes.

The obsolete PHP handler and its tests have been removed. Requests to
`/send-mail.php` redirect with HTTP 303 to `/contact.html#message`, so even an old
form submission becomes a GET of the contact options. No backend API, secret or
mail account is required for this release.

## After the first deployment

Check the actual production domain, a nested `.html` page, a local timetable PDF,
the JSON feed, an unknown URL's 404 status, and the contact links. The local build
does not prove the account's Git integration or DNS settings. Existing root
domain metadata is controlled by `site-settings.json`; regenerate it if the
production domain changes. External booking and membership platforms remain
separate services.

Configuration follows [Vercel's build settings](https://vercel.com/docs/builds/configure-a-build)
and [vercel.json routing settings](https://vercel.com/docs/project-configuration/vercel-json).
