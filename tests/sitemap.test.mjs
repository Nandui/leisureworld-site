import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import { buildSitemap, normalizePage, parseSitemap, renderSitemap } from '../scripts/build-sitemap.mjs';
import { publicFiles } from '../scripts/public-files.mjs';

const root = new URL('../', import.meta.url);

test('regenerated metadata and site-wide scripts are not content changes', () => {
  const page = (head, body) => `<html><head><title>Gym</title><meta content="Gyms in Cork" name="description"/>${head}</head><body>${body}</body></html>`;
  const a = page('<link href="a.css?v=1a2b3c4d5e" rel="stylesheet"/><link href="https://x/gym.html" rel="canonical"/>', '<h1>Gym</h1><script src="snowfall.js?v=snow1"></script>');
  const b = page('<link href="a.css?v=9f8e7d6c5b" rel="stylesheet"/><meta content="Gym" property="og:title"/>', '<h1>Gym</h1>');
  assert.equal(normalizePage(a), normalizePage(b));
  assert.notEqual(normalizePage(a), normalizePage(page('', '<h1>Gyms</h1>')));
  assert.notEqual(normalizePage(a), normalizePage(a.replace('Gyms in Cork', 'Gyms in Douglas')));
  const feed = '<!-- feed:hours:start -->\n<p>9am</p>\n<!-- feed:hours:end -->';
  assert.equal(normalizePage(page('', feed)), normalizePage(page('', feed.replace('9am', '10am'))));
});

test('the sitemap lists every public page once, with valid dates, and robots.txt points to it', async () => {
  const entries = await buildSitemap({ write: false });
  const pages = (await publicFiles(root.pathname)).filter(path => path.endsWith('.html'));
  assert.deepEqual(entries.map(e => e.path).sort(), pages.sort());
  const settings = JSON.parse(await readFile(new URL('site-settings.json', root), 'utf8'));
  const base = settings.site_url.replace(/\/+$/, '') + '/';
  assert.equal(entries.find(e => e.path === 'index.html').loc, base);
  assert.equal(new Set(entries.map(e => e.loc)).size, entries.length);
  for (const e of entries) {
    assert.ok(e.loc.startsWith(base), e.loc);
    if (e.lastmod) assert.match(e.lastmod, /^\d{4}-\d{2}-\d{2}$/, e.path);
  }
  const published = parseSitemap(renderSitemap(entries));
  assert.equal(published.size, entries.length);
  const robots = await readFile(new URL('robots.txt', root), 'utf8');
  assert.match(robots, new RegExp(`^Sitemap: ${base}sitemap\\.xml$`, 'm'));
});
