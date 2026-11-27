# Editing opening hours (for staff)

Opening hours, public swim times, fitness classes and short notices can be
changed in a simple web editor. No code is involved. When you press
**Publish**, the website updates itself within about two minutes.

## Signing in

1. Go to **https://www.leisureworldcork.com/admin/** (bookmark it).
2. Press **Login with GitHub**. A small window opens.
3. Sign in with your GitHub account and, the first time only, press
   **Authorize**. The window closes and the editor opens.

You need a free GitHub account that has been added to the website by the site
owner (see "Giving someone access" below).

## Changing hours

1. Open **Opening hours & timetables**.
2. Open **Centres**, then press the arrow next to the centre you want.
3. Each centre has:
   - **Gym opening hours** and **Pitch opening hours**: one entry per day.
   - **Public swimming**: the note above the times, an optional end date for a
     seasonal timetable, and each pool's swim times.
   - **Fitness classes**: one entry per class (day, start time, name, length).
4. Type the new times. Write them the way they appear on the website, for
   example `7am – 8.45pm`. For several sessions on one day, separate them with
   commas: `7am – 8.30am, 1.15pm – 3pm`.
5. Use **Add day** / **Add class** for new entries and the **×** on an entry to
   remove it.
6. Set **Date the hours were last checked** to today (press **Now**). The site
   shows this date as "Schedules checked …".
7. Press **Publish**, then **Publish now**.

Consecutive days with the same times are combined automatically on the website
(for example "Monday–Thursday"), so keep one entry per day.

## Closures and holiday notices

Under **Notices**, press **Add notice**, choose the centre, type the message
(for example "Pool closed for maintenance on 3 December") and pick the
**Show from** and **Show until** dates. The notice appears on that centre's
hours only between those dates.

## If a change doesn't appear

Wait two or three minutes and refresh the page. If it still hasn't changed, the
update was probably refused by the website's safety check, which happens when,
for example, a day has no times or a date is missing. The live site keeps the
previous hours until this is fixed. Open the editor, check the entry you
changed, and publish again, or ask the site owner to look at the failed
deployment in Vercel.

Every published change is saved in the site's history on GitHub, so any change
can be undone.

## Giving someone access (site owner)

Each editor needs their own GitHub account. In the GitHub repository, go to
**Settings → Collaborators → Add people** and invite them with the **Write**
role. They accept the email invitation once, then sign in at `/admin/`.
Remove them the same way when they no longer need access.

## One-time setup (site owner)

The editor signs people in through GitHub. This needs a GitHub OAuth app and two
settings in Vercel:

1. On GitHub, go to **Settings → Developer settings → OAuth Apps → New OAuth
   App** and fill in:
   - Application name: `LeisureWorld website editor`
   - Homepage URL: `https://www.leisureworldcork.com`
   - Authorization callback URL: `https://www.leisureworldcork.com/api/cms-auth`
2. Create the app, then press **Generate a new client secret**.
3. In Vercel, open the project's **Settings → Environment Variables** and add,
   for Production:
   - `GITHUB_OAUTH_CLIENT_ID`: the app's Client ID
   - `GITHUB_OAUTH_CLIENT_SECRET`: the client secret
4. Redeploy once so the new settings take effect.

If the site is served from a different address, use that address in the
callback URL instead. Sign-in only works on the address in the callback URL,
not on Vercel preview links.

## How it works (for developers)

- `admin/index.html` loads [Decap CMS](https://decapcms.org/) and
  `admin/config.yml` describes the form. It edits `data/visit-information.json`,
  the same feed the build already uses. Fields the editor doesn't show (courses,
  recruitment, membership rules) are kept as they are.
- Publishing commits the file to `main` through the GitHub API, and Vercel
  rebuilds. `scripts/build-content.mjs` tidies blank optional fields
  (`normalizeFeed`) and then validates the feed; an invalid edit fails the build
  so the previous deployment stays live.
- `api/cms-auth.js` is the Vercel function that handles GitHub sign-in.
- To try the editor locally without GitHub, run `npx decap-server` in the
  repository and serve the repository root on `localhost` (for example
  `python -m http.server 8080`), then open `http://localhost:8080/admin/`.
  Saving writes straight to your local file.
