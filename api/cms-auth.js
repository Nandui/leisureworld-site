/**
 * GitHub sign-in for the staff editor at /admin/ (Decap CMS).
 *
 * Step 1: the editor opens /api/cms-auth in a pop-up; we send the person to
 *         GitHub to approve access.
 * Step 2: GitHub sends them back here with a one-time code; we swap it for an
 *         access token and hand it to the editor window, then the pop-up closes.
 *
 * Needs two Vercel environment variables from a GitHub OAuth app whose
 * callback URL is https://<site address>/api/cms-auth:
 *   GITHUB_OAUTH_CLIENT_ID, GITHUB_OAUTH_CLIENT_SECRET
 * Only people with write access to the repository can save changes.
 */
import { randomBytes, timingSafeEqual } from 'node:crypto';

const STATE_COOKIE = 'cms_oauth_state';

const page = (status, message, origin) => `<!doctype html><html lang="en-IE"><head><meta charset="utf-8"><meta name="robots" content="noindex"><title>Signing in…</title></head><body><p>${status === 'success' ? 'Signed in. You can close this window.' : 'Sign-in failed. Close this window and try again.'}</p><script>
(() => {
  const origin = ${JSON.stringify(origin)};
  const message = ${JSON.stringify(message)};
  if (!window.opener) return;
  window.addEventListener('message', event => {
    if (event.origin !== origin) return;
    window.opener.postMessage(message, origin);
    window.close();
  }, { once: true });
  window.opener.postMessage('authorizing:github', origin);
})();
</script></body></html>`;

const sameBytes = (a, b) => {
  const x = Buffer.from(String(a || '')), y = Buffer.from(String(b || ''));
  return x.length === y.length && x.length > 0 && timingSafeEqual(x, y);
};

export default async function handler(req, res) {
  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GITHUB_OAUTH_CLIENT_SECRET;
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const origin = `https://${host}`;
  const url = new URL(req.url, origin);
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Robots-Tag', 'noindex');

  const fail = reason => {
    console.error('CMS sign-in failed:', reason);
    res.statusCode = 400;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.end(page('error', `authorization:github:error:${JSON.stringify({ message: reason })}`, origin));
  };

  if (!clientId || !clientSecret) return fail('The editor sign-in is not set up yet (missing GitHub OAuth settings).');

  const code = url.searchParams.get('code');
  if (!code) {
    const state = randomBytes(24).toString('hex');
    const authorize = new URL('https://github.com/login/oauth/authorize');
    authorize.searchParams.set('client_id', clientId);
    authorize.searchParams.set('redirect_uri', `${origin}/api/cms-auth`);
    authorize.searchParams.set('scope', url.searchParams.get('scope') || 'repo');
    authorize.searchParams.set('state', state);
    res.setHeader('Set-Cookie', `${STATE_COOKIE}=${state}; Path=/api/cms-auth; HttpOnly; Secure; SameSite=Lax; Max-Age=600`);
    res.statusCode = 302;
    res.setHeader('Location', authorize.href);
    return res.end();
  }

  const cookies = Object.fromEntries((req.headers.cookie || '').split(';').map(part => part.trim().split('=')).filter(([k]) => k));
  res.setHeader('Set-Cookie', `${STATE_COOKIE}=; Path=/api/cms-auth; HttpOnly; Secure; SameSite=Lax; Max-Age=0`);
  if (!sameBytes(cookies[STATE_COOKIE], url.searchParams.get('state'))) return fail('Sign-in expired. Please try again.');

  try {
    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code, redirect_uri: `${origin}/api/cms-auth` })
    });
    const result = await response.json();
    if (!result.access_token) return fail(result.error_description || 'GitHub did not return an access token.');
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.end(page('success', `authorization:github:success:${JSON.stringify({ token: result.access_token, provider: 'github' })}`, origin));
  } catch (error) {
    fail('Could not reach GitHub. Please try again.');
  }
}
