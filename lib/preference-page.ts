import { NextResponse } from 'next/server'
import { PREF_CONSENT_MAD, PREF_CONSENT_GROUP } from '@/lib/copy'

// The preference centre's markup, kept out of the route file so it can be
// rendered and tested without a database. Route files may only export HTTP
// handlers, which is why this cannot live there.

// DESIGN.md palette (see lib/brand.ts). Inlined because this route returns raw
// HTML rather than React — same tokens, not a second palette.
const CREAM = '#FDFAF4'
const SAND = '#E6E2D8'
const FOREST = '#163223'
const SIGNAL = '#90FF7C'
const MUTED = '#6F6A61'

function esc(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

export function page(title: string, body: string, action = '', status = 200) {
  const html = `<!doctype html>
<html lang="da"><head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>Altid Hjem</title>
</head>
<body style="margin:0;background:${CREAM};font-family:'Onest','Helvetica Neue',Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="min-height:100vh;">
    <tr><td align="center" valign="middle" style="padding:40px 16px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:20px;overflow:hidden;">
        <tr><td style="background:${SAND};padding:24px 28px;">
          <img src="https://www.altidhjem.dk/altid-hjem-logo-dark.svg" alt="Altid Hjem" width="120" height="64" style="display:block;border:0;outline:none;"/>
        </td></tr>
        <tr><td style="padding:36px 32px 40px;">
          <p style="font-size:24px;line-height:1.3;font-weight:500;color:${FOREST};margin:0 0 12px;">${title}</p>
          <p style="font-size:16px;line-height:1.6;color:${MUTED};margin:0 0 24px;">${body}</p>
          ${action}
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`
  return new NextResponse(html, {
    status,
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'private, no-store' },
  })
}

// A POST form button (so state only changes on an explicit click, never on load).
export function button(token: string, act: string, label: string, primary = true) {
  const url = `/api/unsubscribe?token=${encodeURIComponent(token)}`
  const bg = primary ? FOREST : SIGNAL
  const fg = primary ? '#ffffff' : FOREST
  return `<form method="POST" action="${url}" style="margin:0;">
    <input type="hidden" name="action" value="${esc(act)}"/>
    <button type="submit" style="background:${bg};color:${fg};border:0;border-radius:999px;font-size:16px;font-weight:500;padding:14px 28px;cursor:pointer;font-family:inherit;">${esc(label)}</button>
  </form>`
}

/**
 * The preference centre.
 *
 * Withdrawal has to be as easy as giving consent (GDPR art. 7(3)), and it was
 * not: consent is per-brand (two flags), but unsubscribing was one global
 * boolean. Someone who wanted to stop the food mails but keep the rest had to
 * leave everything. Now each consent is its own box, and leaving entirely is
 * still one click.
 *
 * The boxes ARE pre-filled with the current state here — correct in this one
 * place, unlike on the double-opt-in confirm page. This is not the act of giving
 * consent; it is a person editing consent they already gave, and showing them
 * anything other than what is actually stored would misrepresent their own
 * record.
 */
export function preferences(token: string, current: { consentMad: boolean; consentGroup: boolean }) {
  const url = `/api/unsubscribe?token=${encodeURIComponent(token)}`
  const box = (name: string, checked: boolean, text: string) => `
    <label style="display:flex;gap:10px;align-items:flex-start;margin:0 0 14px;padding:12px 14px;background:${SAND};border-radius:12px;cursor:pointer;">
      <input type="checkbox" name="consent" value="${name}" ${checked ? 'checked' : ''} style="margin-top:3px;flex-shrink:0;width:17px;height:17px;accent-color:${FOREST};"/>
      <span style="font-size:14px;line-height:1.5;color:${FOREST};">${esc(text)}</span>
    </label>`

  return `<form method="POST" action="${url}" style="margin:0 0 28px;">
    <input type="hidden" name="action" value="preferences"/>
    ${box('mad', current.consentMad, PREF_CONSENT_MAD)}
    ${box('group', current.consentGroup, PREF_CONSENT_GROUP)}
    <button type="submit" style="background:${SIGNAL};color:${FOREST};border:0;border-radius:999px;font-size:16px;font-weight:500;padding:14px 28px;cursor:pointer;font-family:inherit;margin-top:6px;">Gem mine valg</button>
  </form>
  <p style="font-size:14px;line-height:1.6;color:${MUTED};margin:0 0 12px;">Vil du helt ud af det hele?</p>
  ${button(token, 'unsubscribe', 'Afmeld mig fra alt')}`
}

