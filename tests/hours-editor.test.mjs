import assert from 'node:assert/strict';
import { once } from 'node:events';
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

process.env.CMS_EDITOR_EMAILS = 'Staff@example.ie, other@example.ie';
process.env.CMS_SESSION_SECRET = 'test-secret-'.repeat(4);
process.env.RESEND_API_KEY = 'test';
process.env.CMS_EMAIL_FROM = 'Website <website@example.ie>';
process.env.GITHUB_TOKEN = 'test';

const feed = await readFile(new URL('../data/visit-information.json', import.meta.url), 'utf8');
const sent = [], commits = [];
const realFetch = globalThis.fetch;
globalThis.fetch = async (url, options = {}) => {
  url = String(url);
  if (url.startsWith('https://api.resend.com/')) { sent.push(JSON.parse(options.body)); return new Response('{}'); }
  if (url.startsWith('https://api.github.com/')) {
    if (options.method === 'PUT') { commits.push(JSON.parse(options.body)); return new Response('{}'); }
    return new Response(JSON.stringify({ content: Buffer.from(feed).toString('base64'), sha: 'abc' }));
  }
  return realFetch(url, options);
};
const login = (await import('../api/cms-login.js')).default;
const cms = (await import('../api/cms.js')).default;

test('staff sign in with an emailed code and can only save valid opening hours', async t => {
  const server = http.createServer((req, res) => (req.url === '/api/cms' ? cms : login)(req, res));
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  t.after(() => { globalThis.fetch = realFetch; return new Promise(resolve => server.close(resolve)); });
  const base = `http://127.0.0.1:${server.address().port}`;
  const post = (path, body, cookie = '') => realFetch(base + path, { method: 'POST', headers: { 'Content-Type': 'application/json', cookie }, body: JSON.stringify(body) });
  const cookieFrom = response => response.headers.getSetCookie().map(c => c.split(';')[0]).filter(c => !c.endsWith('=')).join('; ');

  // Addresses not on the list get the same reply but no email.
  assert.equal((await post('/api/cms-login', { action: 'send', email: 'stranger@example.ie' })).status, 200);
  assert.equal(sent.length, 0);

  const asked = await post('/api/cms-login', { action: 'send', email: ' STAFF@example.ie ' });
  assert.equal(asked.status, 200);
  assert.deepEqual(sent[0].to, ['staff@example.ie']);
  const code = sent[0].text.match(/\d{4} \d{4}/)[0];
  const challenge = cookieFrom(asked);

  assert.equal((await post('/api/cms', { action: 'getEntry', params: { path: 'data/visit-information.json' } })).status, 401);
  assert.equal((await post('/api/cms-login', { action: 'verify', code: '00000000' }, challenge)).status, 400);
  const verified = await post('/api/cms-login', { action: 'verify', code }, challenge);
  assert.equal(verified.status, 200);
  const session = cookieFrom(verified);
  assert.match(session, /lw_cms_session=/);

  const entry = await (await post('/api/cms', { action: 'getEntry', params: { path: 'data/visit-information.json' } }, session)).json();
  assert.equal(entry.data, feed);
  assert.equal((await post('/api/cms', { action: 'getEntry', params: { path: 'package.json' } }, session)).status, 404);

  const other = await post('/api/cms', { action: 'persistEntry', params: { dataFiles: [{ path: 'index.html', raw: 'x' }], assets: [] } }, session);
  assert.equal(other.status, 403);

  const broken = JSON.parse(feed); broken.centres[0].gymHours[0].times = [''];
  const refused = await post('/api/cms', { action: 'persistEntry', params: { dataFiles: [{ path: 'data/visit-information.json', raw: JSON.stringify(broken) }], assets: [] } }, session);
  assert.equal(refused.status, 422);
  assert.match((await refused.json()).error, /Monday/);
  assert.equal(commits.length, 0);

  const edited = JSON.parse(feed); edited.centres[0].gymHours[0].times = ['6.30am – 9pm'];
  const saved = await post('/api/cms', { action: 'persistEntry', params: { dataFiles: [{ path: 'data/visit-information.json', raw: JSON.stringify(edited, null, 2) }], assets: [] } }, session);
  assert.equal(saved.status, 200);
  assert.equal(commits.length, 1);
  assert.equal(commits[0].sha, 'abc');
  assert.equal(commits[0].branch, 'main');
  assert.equal(commits[0].author.email, 'staff@example.ie');
  assert.match(Buffer.from(commits[0].content, 'base64').toString(), /6\.30am – 9pm/);

  // Removing someone from the list ends their access straight away.
  process.env.CMS_EDITOR_EMAILS = 'other@example.ie';
  assert.equal((await post('/api/cms', { action: 'getEntry', params: { path: 'data/visit-information.json' } }, session)).status, 401);
});
