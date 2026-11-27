# Editing opening hours (for staff)

Opening hours, public swim times, fitness classes and short notices can be
changed in a simple web editor. No code is involved. When you press
**Publish**, the website updates itself within about two minutes.

## Signing in

1. Go to **https://www.leisureworldcork.com/admin/** (bookmark it).
2. Type your work email and press **Send me a code**.
3. Check your email for a message with an 8-digit code, type it in and press
   **Sign in**. The code works for 10 minutes.

You stay signed in for 12 hours on that computer. Use **Sign out** in the
bottom-right corner on a shared computer. Only email addresses on the editors
list can sign in (see "Giving someone access" below).

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

## If something goes wrong

- **"Not saved: …"** when you publish means the change was refused, for
  example because a day has no times or a date is missing. Nothing on the
  website changed. Fix the entry it names and publish again.
- **No code arrives**: check spam, and make sure you typed the address that is
  on the editors list. Press "Use a different email or send a new code" to try
  again.
- **The website hasn't changed**: wait two or three minutes and refresh.

Every published change is saved in the site's history on GitHub with the
editor's email address, so any change can be undone.

## Giving someone access (site owner)

The editors list is the `CMS_EDITOR_EMAILS` setting in Vercel (project
**Settings → Environment Variables**): email addresses separated by commas.
To add or remove someone, edit it, save, and redeploy the latest production
deployment (**Deployments → … → Redeploy**). Removing an address ends that
person's access as soon as the redeploy finishes.

## One-time setup (site owner)

Add these in Vercel under **Settings → Environment Variables** (Production),
then redeploy:

| Name | What to put |
| --- | --- |
| `CMS_EDITOR_EMAILS` | Staff emails allowed to edit, separated by commas. |
| `CMS_SESSION_SECRET` | A long random string (at least 32 characters). Keep it private. Changing it signs everyone out. |
| `RESEND_API_KEY` | API key from [Resend](https://resend.com), which sends the code emails. The free plan is plenty. |
| `CMS_EMAIL_FROM` | Sender, e.g. `LeisureWorld website <website@leisureworldcork.com>`. The domain must be verified in Resend (it gives you DNS records to add). |
| `GITHUB_TOKEN` | A GitHub fine-grained personal access token for **only this repository**, with **Contents: Read and write**. This is how saved changes reach the site. |

To make the GitHub token: GitHub **Settings → Developer settings → Personal
access tokens → Fine-grained tokens → Generate new token**, choose "Only select
repositories" and pick this repository, set **Contents** to "Read and write",
and set an expiry date. Put a reminder in the calendar to renew it before it
expires; after that, saving stops working until a new token is added.

## How it works (for developers)

- `admin/index.html` shows the email-code sign-in, then loads
  [Decap CMS](https://decapcms.org/) with a small custom back end.
  `admin/config.yml` describes the form over `data/visit-information.json`, the
  feed the build already uses. Fields the editor doesn't show (courses,
  recruitment, membership rules) are kept as they are.
- `api/cms-login.js` sends and checks the codes. Codes and sessions are
  HMAC-signed, HttpOnly, SameSite=Strict cookies, so no database is needed.
  The reply is the same for addresses that aren't on the list.
- `api/cms.js` is the editor's back end. It needs a signed-in session, only
  reads or writes `data/visit-information.json`, runs the build's
  `normalizeFeed`/`validateFeed` checks before saving, and commits to `main`
  through the GitHub API with the editor's email as the author. Vercel then
  rebuilds.
- To try the editor locally without signing in, run `npx decap-server` in the
  repository, serve the repository root (for example
  `python -m http.server 8080`) and open
  `http://localhost:8080/admin/?local`. Saving writes straight to your local file.
