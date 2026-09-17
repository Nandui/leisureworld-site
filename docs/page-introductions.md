# Shared page introductions

`page-heroes.css` is the sizing authority for all 47 secondary-page introductions.
Load it after the other site stylesheets. The approved homepage retains its own
brand hero in `homepage.css`, with its flow safeguards scoped to `.homepage` in
`site-accessibility.css`.

## Choose an existing variant

| Variant | Use | Shared sizing |
| --- | --- | --- |
| `.page-hero--photo` | Activities, swimming, gym and centres directory | 640px desktop minimum, 600px tablet, 520px phone; shared title/CTA position |
| `.page-hero--split` | Swim School, programmes, training, about and careers | Equal desktop columns, 480px image frame, one-column layout below 851px |
| `.page-hero--plain` | Centre details, prices, membership, support and policies | Content-driven height with the same title scale, copy spacing and actions |
| `.page-hero--split.page-hero--app` | App download page | Shared split-intro dimensions with the original uncropped phone artwork |

Every variant also uses `.page-hero`. A split introduction's copy uses
`.page-hero__copy`; its photograph uses `.page-hero__media`. Existing page classes
remain for imagery, links and section-specific behavior. They must not define
another hero height, heading scale or introduction spacing.

## Common rules

- Secondary H1s use 72px on large screens, 64px up to 1100px, 56px up to 850px,
  40px up to 600px and 36px up to 360px. Line height is 1.08 and tracking is
  -0.035em. The homepage wordmark-sized H1 is the deliberate exception.
- Intro padding is 32px above / 64px below on larger screens and 24px / 40px
  on phones. Body-copy and action gaps use shared tokens.
- All secondary breadcrumbs use `.page-breadcrumbs.content-width`. Light and
  split pages place this row before their hero. Photo hubs keep the breadcrumb
  below their existing shortcut strip.
- Primary intro buttons share a 52px minimum height, 14px type and matching
  padding. Action groups stack on phones.
- Desktop split photographs have a shared 480px minimum height (440px below
  1101px), with a common corner radius. Stacked images use 16:9 on tablets and
  4:3 on phones. Preserve each source image and its existing focal point.
- All three centre panoramas use 5:1. The app artwork retains its native ratio.
- Hero minimum heights may grow for longer content or enlarged text. Do not
  constrain them with a fixed height, clipping, line clamps or hidden copy.

Change tokens in `page-heroes.css` to adjust the system. Verify the photo hubs,
Swim School, a training course, a centre, a long policy title and the app page
together at phone, tablet and desktop widths.

## Verification — 17 September 2026

The previous photo hubs measured 760px (Activities), 740px (swimming) and 690px
(gym/centres) at 1440px. Their secondary heading sizes also differed. They now
share the same 640px height and 72px H1. At 390px, all four measure 520px with a
40px H1, and their title and header logo both begin at the 24px content edge.

All ten desktop split introductions, including the app page, measure 576px
including vertical padding at 1440px. Photographic frames measure 480px; the
phone artwork remains uncropped. All secondary pages use the same heading scale
at each tested width. Phone layouts expand naturally with their content.

Fresh browser checks cover all 48 pages at 390px, 768px and 1440px, plus 17
representative pages at 320px with normal and doubled text. Local screenshots
and per-page measurements are in `.output/consistency/` (gitignored).

The layout detector reports no findings for the new shared stylesheet. Existing
site tests and structural link checks also pass. This is a local Chromium
review, not a claim of full cross-browser or accessibility conformance.
