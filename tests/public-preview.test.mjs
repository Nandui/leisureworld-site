import assert from 'node:assert/strict';
import { once } from 'node:events';
import { test } from 'node:test';
import { isPublicFile, publicFiles } from '../scripts/public-files.mjs';
import { createPreviewServer } from '../scripts/dev-server.mjs';
import { fileURLToPath } from 'node:url';
import { readFile } from 'node:fs/promises';

const root = fileURLToPath(new URL('../', import.meta.url));

test('the deployment surface includes site assets and excludes source, secrets and traversal', async () => {
  for (const path of ['index.html', 'contact-page.js', 'Centres/churchfield.html', 'Activities/Swimlessons/swimschool.html', 'assets/documents/timetable.pdf', 'data/visit-information.json']) assert.equal(isPublicFile(path), true, path);
  for (const path of ['.env', '.git/config', 'scripts/dev-server.mjs', 'lib/contact-handler.js', 'api/contact.js', 'tests/public-preview.test.mjs', 'README.md', 'package.json', 'send-mail.php', 'docs/audit.json', 'dist/index.html', '../index.html', 'Images/../README.md', 'Images\\../README.md', 'Images/a.jpg:secret']) assert.equal(isPublicFile(path), false, path);
  const files = await publicFiles(root);
  assert.ok(files.includes('index.html'));
  assert.ok(files.includes('contact.html'));
  assert.ok(!files.some(file => /^(docs|scripts|tests|dist|node_modules|api|lib)\//.test(file)));
});

test('preview returns public content, safe failures and a contact redirect without any email transport', async t => {
  const server = createPreviewServer(root);
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  t.after(() => new Promise(resolve => server.close(resolve)));
  const base = `http://127.0.0.1:${server.address().port}`;
  const home = await fetch(base);
  assert.equal(home.status, 200);
  assert.match(home.headers.get('content-type'), /text\/html/);
  assert.equal(home.headers.get('cache-control'), 'no-store');
  const contact = await fetch(`${base}/contact.html`);
  const html = await contact.text();
  assert.match(html, /mailto:info@leisureworldcork.com/);
  assert.doesNotMatch(html, /id="contact-form"|action="send-mail.php"/);
  for (const path of ['/package.json', '/scripts/dev-server.mjs', '/docs/page-purpose.md', '/.git/config', '/%2e%2e%2fREADME.md', '/missing-page.html', '/api/contact']) {
    const response = await fetch(`${base}${path}`);
    assert.equal(response.status, 404, path);
    assert.match(await response.text(), /Page not found|page.*find|find.*page/i, path);
  }
  const head = await fetch(`${base}/contact.html`, { method: 'HEAD' });
  assert.equal(head.status, 200);
  assert.equal(await head.text(), '');
  const post = await fetch(`${base}/contact.html`, { method: 'POST', body: 'test' });
  assert.equal(post.status, 405);
  const old = await fetch(`${base}/send-mail.php`, { method: 'POST', body: 'test', redirect: 'manual' });
  assert.equal(old.status, 303);
  assert.equal(old.headers.get('location'), '/contact.html#message');
  const config=JSON.parse(await readFile(new URL('../vercel.json',import.meta.url),'utf8'));
  for(const rule of config.redirects.filter(rule=>rule.permanent)) {
    const response=await fetch(`${base}${rule.source}`,{redirect:'manual'});
    assert.equal(response.status,308,rule.source);
    assert.equal(response.headers.get('location'),rule.destination,rule.source);
    const destination=new URL(rule.destination,base);
    const target=await fetch(destination);
    assert.equal(target.status,200,rule.destination);
    if(destination.hash) assert.ok((await target.text()).includes(`id="${destination.hash.slice(1)}"`),rule.destination);
  }
  const queryRedirect=await fetch(`${base}/opening-hours/?centre=churchfield`,{redirect:'manual'});
  assert.equal(queryRedirect.headers.get('location'),'/opening-hours.html?centre=churchfield');
});
