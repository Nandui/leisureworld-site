/**
 * Shared helpers for the staff hours editor (/admin/): signed cookies, the list
 * of allowed staff emails and small request/response utilities.
 *
 * Environment variables (Vercel → Settings → Environment Variables):
 *   CMS_EDITOR_EMAILS   Comma-separated staff emails allowed to edit.
 *   CMS_SESSION_SECRET  Long random string used to sign codes and sessions.
 *   RESEND_API_KEY      Key for sending the sign-in code emails (resend.com).
 *   CMS_EMAIL_FROM      Sender, e.g. "LeisureWorld website <website@leisureworldcork.com>".
 *   GITHUB_TOKEN        Fine-grained token: this repository only, Contents read & write.
 *   CMS_GITHUB_REPO     Optional, defaults to Nandui/leisureworld-site.
 *   CMS_GITHUB_BRANCH   Optional, defaults to main.
 */
import { createHmac, timingSafeEqual } from 'node:crypto';

export const SESSION_COOKIE = 'lw_cms_session';
export const CODE_COOKIE = 'lw_cms_code';
export const SESSION_HOURS = 12;
export const CODE_MINUTES = 10;

const secret = () => {
  const value = process.env.CMS_SESSION_SECRET;
  if (!value || value.length < 32) throw new Error('CMS_SESSION_SECRET must be set (at least 32 characters).');
  return value;
};

export const normalizeEmail = value => String(value || '').trim().toLowerCase();

export function allowedEmails() {
  return new Set((process.env.CMS_EDITOR_EMAILS || '').split(/[,;\s]+/).map(normalizeEmail).filter(Boolean));
}

export const hmac = value => createHmac('sha256', secret()).update(value).digest('base64url');

export function sameText(a, b) {
  const x = Buffer.from(String(a || '')), y = Buffer.from(String(b || ''));
  return x.length === y.length && x.length > 0 && timingSafeEqual(x, y);
}

/** payload → "base64url(json).signature" */
export function sign(payload) {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return `${body}.${hmac(body)}`;
}

/** Returns the payload when the signature is valid and it hasn't expired. */
export function unsign(token) {
  const [body, signature] = String(token || '').split('.');
  if (!body || !signature || !sameText(hmac(body), signature)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    return payload && typeof payload.exp === 'number' && payload.exp > Date.now() ? payload : null;
  } catch { return null; }
}

export function readCookies(req) {
  return Object.fromEntries((req.headers.cookie || '').split(';').map(part => {
    const index = part.indexOf('=');
    return index < 0 ? [part.trim(), ''] : [part.slice(0, index).trim(), decodeURIComponent(part.slice(index + 1).trim())];
  }).filter(([key]) => key));
}

export function cookie(name, value, maxAgeSeconds) {
  return `${name}=${encodeURIComponent(value)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAgeSeconds}`;
}

/** The signed-in staff email, or null. Also re-checks the allowed list. */
export function sessionEmail(req) {
  const session = unsign(readCookies(req)[SESSION_COOKIE]);
  if (!session || session.kind !== 'session') return null;
  return allowedEmails().has(session.email) ? session.email : null;
}

export async function readBody(req) {
  if (req.body !== undefined) return typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const text = Buffer.concat(chunks).toString('utf8');
  return text ? JSON.parse(text) : {};
}

export function sendJson(res, status, data, cookies = []) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Robots-Tag', 'noindex');
  if (cookies.length) res.setHeader('Set-Cookie', cookies);
  res.end(JSON.stringify(data));
}

/** Rejects cross-site form/JSON posts: the editor always calls from the same site. */
export function sameOrigin(req) {
  const origin = req.headers.origin;
  if (!origin) return true;
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  try { return new URL(origin).host === host; } catch { return false; }
}
