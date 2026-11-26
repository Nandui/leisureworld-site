/**
 * Generates sitemap.xml from the public HTML pages, with a <lastmod> date for
 * each page taken from Git: the date of the last commit that changed what the
 * visitor reads. Generated metadata (asset cache keys, canonical/social tags,
 * JSON-LD) does not count as a change. Pages whose marked regions are filled from
 * data/visit-information.json also take that feed's last change into account.
 *
 * Runs as part of `npm run build`, and on its own with `npm run sitemap`.
 * In a shallow clone, a page whose last real change is older than the fetched
 * history keeps the date already committed in sitemap.xml instead of a guess.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { publicFiles } from './public-files.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const FEED = 'data/visit-information.json';
const escapeXml = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[c]));

/**
 * Reduce a page to what a visitor reads: its title, description and body text and
 * markup. Scripts, stylesheet links, asset cache keys, canonical/social tags,
 * JSON-LD and feed-filled regions are dropped, so regenerated metadata or a
 * site-wide script (e.g. analytics, seasonal effects) is not a content change.
 */
export function normalizePage(html) {
  const title = html.match(/<title[^>]*>[\s\S]*?<\/title>/i)?.[0] || '';
  const description = html.match(/<meta[^>]*name="description"[^>]*>/i)?.[0] || '';
  const body = html.match(/<body[\s\S]*$/i)?.[0] || html;
  return [title, description, body]
    .join('\n')
    .replace(/<!-- feed:([a-z-]+):start -->[\s\S]*?<!-- feed:\1:end -->/g, '')
    .replace(/<script\b[\s\S]*?<\/script>/gi, '')
    .replace(/<(?:link|style)\b[^>]*>/gi, '')
    .replace(/\?v=[\w.-]+/g, '')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Compare JSON semantically, so reformatting the feed is not a change. */
const normalizeFeed = text => { try { return JSON.stringify(JSON.parse(text)); } catch { return text; } };

export function pageUrl(base, path) {
  return path === 'index.html' ? base : new URL(path, base).href;
}

export function renderSitemap(entries) {
  return '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    + entries.map(e => `  <url><loc>${escapeXml(e.loc)}</loc>${e.lastmod ? `<lastmod>${e.lastmod}</lastmod>` : ''}</url>\n`).join('')
    + '</urlset>\n';
}

/** lastmod values already published, keyed by URL. */
export function parseSitemap(xml) {
  const dates = new Map();
  for (const [, block] of xml.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
    const loc = block.match(/<loc>([^<]+)<\/loc>/)?.[1];
    const lastmod = block.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1];
    if (loc) dates.set(loc.replace(/&amp;/g, '&'), lastmod || null);
  }
  return dates;
}

function git(args) {
  try {
    return execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 64 * 1024 * 1024 });
  } catch {
    return null;
  }
}

function gitHistory() {
  if (git(['rev-parse', '--is-inside-work-tree'])?.trim() !== 'true') return null;
  const shallowFile = git(['rev-parse', '--git-path', 'shallow'])?.trim();
  const shallowPath = shallowFile && resolve(root, shallowFile);
  const boundaries = new Set(shallowPath && existsSync(shallowPath) ? readFileSync(shallowPath, 'utf8').split(/\s+/).filter(Boolean) : []);
  const show = (rev, path) => git(['show', `${rev}:${path}`]);
  const dirty = path => (git(['status', '--porcelain', '--', path]) || '').trim() !== '';

  /** Date (YYYY-MM-DD) of the last significant change, or undefined when history can't tell. */
  return function lastChanged(path, normalize, today) {
    const current = readFileSync(join(root, path), 'utf8');
    const head = show('HEAD', path);
    if (head === null) return today; // A new page not committed yet.
    if (dirty(path) && normalize(current) !== normalize(head)) return today;
    const log = git(['log', '--first-parent', '--format=%H %cI', 'HEAD', '--', path]) || '';
    for (const line of log.trim().split('\n').filter(Boolean)) {
      const [sha, date] = line.split(' ');
      if (boundaries.has(sha)) return undefined; // Parent not fetched: unknown.
      const after = show(sha, path);
      const before = show(`${sha}^`, path);
      if (after === null) continue;
      if (before === null || normalize(after) !== normalize(before)) return date.slice(0, 10);
    }
    return undefined;
  };
}

export async function buildSitemap({ today = new Date().toISOString().slice(0, 10), write = true } = {}) {
  const settings = JSON.parse(await readFile(join(root, 'site-settings.json'), 'utf8'));
  const base = settings.site_url.replace(/\/+$/, '') + '/';
  if (new URL(base).protocol !== 'https:') throw new Error('site_url must use HTTPS');
  const pages = (await publicFiles(root)).filter(path => path.endsWith('.html'));
  pages.sort((a, b) => (a === 'index.html' ? -1 : b === 'index.html' ? 1 : a.localeCompare(b, 'en', { sensitivity: 'base' })));

  const sitemapPath = join(root, 'sitemap.xml');
  const before = existsSync(sitemapPath) ? await readFile(sitemapPath, 'utf8') : '';
  const published = parseSitemap(before);
  const lastChanged = gitHistory();
  if (!lastChanged) console.warn('sitemap: Git history is unavailable; keeping the dates already in sitemap.xml.');

  const feedSource = await readFile(join(root, FEED), 'utf8');
  const feedPages = new Set(['opening-hours.html', 'careers.html', 'Certfictaons/nplq.html', ...JSON.parse(feedSource).centres.map(c => c.page)]);
  const feedDate = lastChanged?.(FEED, normalizeFeed, today);

  const entries = pages.map(path => {
    const loc = pageUrl(base, path);
    let lastmod = lastChanged?.(path, normalizePage, today);
    if (lastmod && feedPages.has(path) && feedDate && feedDate > lastmod) lastmod = feedDate;
    if (!lastmod) lastmod = published.get(loc) || undefined;
    return { path, loc, lastmod };
  });

  const xml = renderSitemap(entries);
  if (write && xml !== before) await writeFile(sitemapPath, xml);
  const dated = entries.filter(e => e.lastmod).length;
  console.log(`Sitemap lists ${entries.length} pages (${dated} with a last-changed date).`);
  return entries;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await buildSitemap();
