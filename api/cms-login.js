/**
 * Email-code sign-in for the staff hours editor.
 *
 * GET                          → { email } when signed in, otherwise 401.
 * POST { action: 'send', email } → emails an 8-digit code if the address is on
 *                                  the CMS_EDITOR_EMAILS list. The reply is the
 *                                  same either way, so the list can't be probed.
 * POST { action: 'verify', code } → signs in for 12 hours.
 * POST { action: 'logout' }       → signs out.
 */
import { randomInt } from 'node:crypto';
import {
  CODE_COOKIE, CODE_MINUTES, SESSION_COOKIE, SESSION_HOURS,
  allowedEmails, cookie, hmac, normalizeEmail, readBody, readCookies,
  sameOrigin, sameText, sendJson, sessionEmail, sign, unsign
} from './_lib/cms.js';

const codeHash = (email, code, exp) => hmac(`code:${email}:${code}:${exp}`);

async function sendCodeEmail(email, code) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.CMS_EMAIL_FROM;
  if (!key || !from) throw new Error('Email sending is not set up (RESEND_API_KEY / CMS_EMAIL_FROM).');
  const spaced = `${code.slice(0, 4)} ${code.slice(4)}`;
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from,
      to: [email],
      subject: `Your LeisureWorld website sign-in code: ${spaced}`,
      text: `Your code to sign in to the LeisureWorld opening hours editor is:\n\n${spaced}\n\nIt works for ${CODE_MINUTES} minutes. If you didn't ask for it, you can ignore this email.`,
      html: `<p>Your code to sign in to the LeisureWorld opening hours editor is:</p><p style="font-size:28px;font-weight:700;letter-spacing:4px">${spaced}</p><p>It works for ${CODE_MINUTES} minutes. If you didn't ask for it, you can ignore this email.</p>`
    })
  });
  if (!response.ok) throw new Error(`Email service returned ${response.status}`);
}

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const email = sessionEmail(req);
      return email ? sendJson(res, 200, { email }) : sendJson(res, 401, { error: 'Not signed in' });
    }
    if (req.method !== 'POST') return sendJson(res, 405, { error: 'Method not allowed' });
    if (!sameOrigin(req)) return sendJson(res, 403, { error: 'Forbidden' });
    const body = await readBody(req);

    if (body.action === 'send') {
      const email = normalizeEmail(body.email);
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return sendJson(res, 400, { error: 'Please enter a valid email address.' });
      const exp = Date.now() + CODE_MINUTES * 60 * 1000;
      const code = String(randomInt(0, 100_000_000)).padStart(8, '0');
      if (allowedEmails().has(email)) await sendCodeEmail(email, code);
      else console.warn('Editor sign-in requested for an address not on the list');
      const challenge = sign({ kind: 'code', email, h: codeHash(email, code, exp), exp });
      return sendJson(res, 200, { ok: true, email }, [cookie(CODE_COOKIE, challenge, CODE_MINUTES * 60)]);
    }

    if (body.action === 'verify') {
      const challenge = unsign(readCookies(req)[CODE_COOKIE]);
      const code = String(body.code || '').replace(/\D/g, '');
      if (!challenge || challenge.kind !== 'code') return sendJson(res, 400, { error: 'That code has expired. Please ask for a new one.' });
      if (code.length !== 8 || !sameText(codeHash(challenge.email, code, challenge.exp), challenge.h) || !allowedEmails().has(challenge.email)) {
        return sendJson(res, 400, { error: 'That code is not right. Check the latest email and try again.' });
      }
      const session = sign({ kind: 'session', email: challenge.email, exp: Date.now() + SESSION_HOURS * 3600 * 1000 });
      return sendJson(res, 200, { email: challenge.email }, [cookie(SESSION_COOKIE, session, SESSION_HOURS * 3600), cookie(CODE_COOKIE, '', 0)]);
    }

    if (body.action === 'logout') return sendJson(res, 200, { ok: true }, [cookie(SESSION_COOKIE, '', 0), cookie(CODE_COOKIE, '', 0)]);
    return sendJson(res, 400, { error: 'Unknown action' });
  } catch (error) {
    console.error('Editor sign-in error:', error.message);
    return sendJson(res, 500, { error: 'Sign-in is not available right now. Please try again later or contact the site owner.' });
  }
}
