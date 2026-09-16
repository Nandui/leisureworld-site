import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import { readFile, realpath, stat } from 'node:fs/promises';
import { dirname, extname, resolve, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { isPublicFile } from './public-files.mjs';

const workspace = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const redirects = JSON.parse(readFileSync(resolve(workspace, 'vercel.json'), 'utf8')).redirects || [];
const CONTENT_TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8', '.txt': 'text/plain; charset=utf-8',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp',
  '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.pdf': 'application/pdf',
  '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.otf': 'font/otf',
};

export function createPreviewServer(root = workspace) {
  const safeRoot = resolve(root);
  return createServer(async (request, response) => {
    const headers = { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'strict-origin-when-cross-origin' };
    const end = (status, body, type = 'text/html; charset=utf-8', extra = {}) => {
      response.writeHead(status, { ...headers, 'Content-Type': type, ...extra });
      response.end(request.method === 'HEAD' ? undefined : body);
    };
    let pathname;
    try { pathname = decodeURIComponent((request.url || '/').split('?')[0]); }
    catch { end(400, 'Invalid URL', 'text/plain'); return; }
    if (pathname === '/send-mail.php') { end(303, '', 'text/plain', { Location: '/contact.html#message' }); return; }
    const redirect = redirects.find(rule => rule.source === pathname);
    if (redirect) {
      const destination = new URL(redirect.destination, 'http://preview.local');
      const query = new URL(request.url, 'http://preview.local').searchParams;
      for (const [key, value] of query) destination.searchParams.append(key, value);
      end(redirect.statusCode || (redirect.permanent ? 308 : 307), '', 'text/plain', {Location: destination.pathname + destination.search + destination.hash});
      return;
    }
    if (!['GET', 'HEAD'].includes(request.method)) { end(405, 'Use the email and phone links on the contact page.', 'text/plain', { Allow: 'GET, HEAD' }); return; }
    const relative = pathname === '/' ? 'index.html' : pathname.replace(/^\//, '');
    if (isPublicFile(relative)) {
      try {
        const file = await realpath(resolve(safeRoot, relative));
        if (file.startsWith(safeRoot + sep) && (await stat(file)).isFile()) {
          end(200, await readFile(file), CONTENT_TYPES[extname(file).toLowerCase()] || 'application/octet-stream');
          return;
        }
      } catch { /* Use the same useful 404 for missing or private files. */ }
    }
    try { end(404, await readFile(resolve(safeRoot, '404.html'))); }
    catch { end(404, '<!doctype html><html lang="en-IE"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Page not found — LeisureWorld</title><main><h1>Page not found</h1><p><a href="/index.html">Return to the homepage</a> or <a href="/contact.html">contact our team</a>.</p></main></html>'); }
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const args = process.argv.slice(2);
  const portIndex = args.indexOf('--port');
  const port = Number(portIndex >= 0 ? args[portIndex + 1] : 8123);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Use --port followed by a valid port number.');
  const server = createPreviewServer(args.includes('--dist') ? resolve(workspace, 'dist') : workspace);
  server.requestTimeout = 15000;
  server.on('error', error => { console.error(error.code === 'EADDRINUSE' ? `Port ${port} is in use. Try npm run dev -- --port ${port + 1}.` : error.message); process.exitCode = 1; });
  server.listen(port, '127.0.0.1', () => console.log(`LeisureWorld preview: http://127.0.0.1:${port}`));
}
