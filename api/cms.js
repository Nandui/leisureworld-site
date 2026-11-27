/**
 * Back end for the staff hours editor (Decap CMS "proxy" protocol).
 * Only signed-in staff can use it, and it can only read and change
 * data/visit-information.json. Every save is checked with the same rules as the
 * site build before it is committed to GitHub, so a broken edit is refused with
 * a message in the editor instead of breaking the live site.
 */
import { normalizeFeed, validateFeed } from '../scripts/build-content.mjs';
import { readBody, sameOrigin, sendJson, sessionEmail } from './_lib/cms.js';

export const EDITABLE_FILE = 'data/visit-information.json';
const repo = () => process.env.CMS_GITHUB_REPO || 'Nandui/leisureworld-site';
const branch = () => process.env.CMS_GITHUB_BRANCH || 'main';

async function github(path, options = {}) {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error('GITHUB_TOKEN is not set.');
  const response = await fetch(`https://api.github.com/repos/${repo()}/contents/${path}${options.method ? '' : `?ref=${encodeURIComponent(branch())}`}`, {
    ...options,
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', 'User-Agent': 'leisureworld-hours-editor', ...(options.body ? { 'Content-Type': 'application/json' } : {}) }
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(`GitHub ${response.status}: ${data.message || 'request failed'}`);
    error.status = response.status;
    throw error;
  }
  return data;
}

async function readFile() {
  const file = await github(EDITABLE_FILE);
  return { data: Buffer.from(file.content, 'base64').toString('utf8'), sha: file.sha };
}

const entryFor = async ({ path, label }) => {
  const { data, sha } = await readFile();
  return { data, file: { path, label, id: sha } };
};

export function checkFeedText(raw) {
  let data;
  try { data = JSON.parse(raw); } catch { throw new Error('The hours could not be read. Please reload the editor and try again.'); }
  validateFeed(normalizeFeed(data));
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return sendJson(res, 405, { error: 'Method not allowed' });
  if (!sameOrigin(req)) return sendJson(res, 403, { error: 'Forbidden' });
  const email = sessionEmail(req);
  if (!email) return sendJson(res, 401, { error: 'Your sign-in has expired. Reload the page and sign in again.' });

  let body;
  try { body = await readBody(req); } catch { return sendJson(res, 400, { error: 'Bad request' }); }
  const { action, params = {} } = body;

  try {
    switch (action) {
      case 'info':
        return sendJson(res, 200, { repo: repo().split('/')[1], publish_modes: ['simple'], type: 'leisureworld' });
      case 'entriesByFiles': {
        const files = (params.files || []).filter(file => file.path === EDITABLE_FILE);
        return sendJson(res, 200, await Promise.all(files.map(entryFor)));
      }
      case 'getEntry':
        if (params.path !== EDITABLE_FILE) return sendJson(res, 404, { error: 'Not found' });
        return sendJson(res, 200, await entryFor({ path: EDITABLE_FILE }));
      case 'entriesByFolder':
      case 'getMedia':
        return sendJson(res, 200, []);
      case 'persistEntry': {
        const dataFiles = params.dataFiles || [];
        if ((params.assets || []).length || dataFiles.length !== 1 || dataFiles[0].path !== EDITABLE_FILE || dataFiles[0].newPath) {
          return sendJson(res, 403, { error: 'Only the opening hours can be changed here.' });
        }
        const raw = String(dataFiles[0].raw || '');
        try { checkFeedText(raw); } catch (error) { return sendJson(res, 422, { error: `Not saved: ${error.message}` }); }
        const { sha } = await readFile();
        await github(EDITABLE_FILE, {
          method: 'PUT',
          body: JSON.stringify({
            message: `Update opening hours (edited by ${email})`,
            content: Buffer.from(raw.endsWith('\n') ? raw : `${raw}\n`).toString('base64'),
            sha,
            branch: branch(),
            author: { name: email, email }
          })
        });
        return sendJson(res, 200, { message: 'entry persisted' });
      }
      default:
        return sendJson(res, 400, { error: 'This action is not available in the hours editor.' });
    }
  } catch (error) {
    console.error('Hours editor error:', error.message);
    return sendJson(res, 502, { error: error.status === 409 ? 'Someone else saved at the same time. Reload the page and try again.' : 'Could not reach the website storage. Please try again in a minute.' });
  }
}
