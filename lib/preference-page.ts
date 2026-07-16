import { NextResponse } from 'next/server'
import { PREF_PHONE_LABEL, PREF_PHONE_HINT, PREF_PHONE_INVALID, PREF_CONSENT_GRID, PREF_SAVE_NOTE } from '@/lib/copy'
import { PHONE_RE, SENTINEL_PHONE } from '@/lib/phone'
import type { ConsentMatrix } from '@/lib/db'

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

/** A link back to the preference centre, for the "saved" page. */
export function backToPreferences(token: string) {
  const url = `/api/unsubscribe?token=${encodeURIComponent(token)}`
  return `<a href="${url}" style="display:inline-block;background:#ffffff;color:${FOREST};border:1px solid ${SAND};border-radius:999px;font-size:16px;font-weight:500;padding:14px 28px;text-decoration:none;font-family:inherit;">Ret mine præferencer</a>`
}

// The brands in the grid, in display order. Deliberately NOT here:
//   Altid Energi — a separate legal sender; Altid Hjem ApS cannot hold consent
//                  on its behalf, so it can never be a row here.
//   Altid Alarm  — live on the site, but named in no consent text we have ever
//                  shown, and its sending entity is unconfirmed.
const BRANDS = [
  { key: 'hjem', label: 'Altid Hjem' },
  { key: 'mad', label: 'Altid Mad' },
  { key: 'forsikring', label: 'Altid Forsikring' },
  { key: 'mobil', label: 'Altid Mobil' },
] as const

/**
 * The preference centre: one row per brand, one column per channel.
 *
 * The boxes ARE pre-filled with the current stored state — correct in this one
 * place, unlike on the double-opt-in confirm page. This is not the act of giving
 * consent; it is a person editing consent they already gave, and showing them
 * anything other than what is actually stored would misrepresent their own record.
 *
 * A grid cannot carry the full legal wording inside eight labels, so the wording
 * sits once, immediately below the grid and above the button, and is bound to
 * every box by the per-cell accessible labels ("Altid Mad via SMS").
 */
export function preferences(
  token: string,
  current: { matrix: ConsentMatrix; phone: string | null },
) {
  const url = `/api/unsubscribe?token=${encodeURIComponent(token)}`
  const m = current.matrix

  const cell = (brand: string, label: string, channel: 'email' | 'sms', checked: boolean) => {
    const name = `${brand}_${channel}`
    const channelLabel = channel === 'email' ? 'e-mail' : 'SMS'
    // SMS boxes render ENABLED even with no number (review 31/7): the inline
    // script below disables them when the field is empty/invalid, but a client
    // that strips scripts must still be able to tick SMS and type a number —
    // otherwise no-JS users could never grant SMS at all. The real rule lives
    // server-side in setConsentByToken, and the saved-page says so honestly when
    // an SMS choice is refused for lack of a valid number.
    return `<td align="center" style="background:${SAND};padding:14px;${channel === 'sms' ? `border-radius:0 12px 12px 0;` : ''}">
      <input type="checkbox" name="consent" value="${name}" class="${channel}"
        ${checked ? 'checked' : ''}
        aria-label="${esc(label)} via ${channelLabel}"
        style="width:17px;height:17px;accent-color:${FOREST};margin:0;"/>
    </td>`
  }

  const rows = BRANDS.map(
    (b) => `<tr>
      <td style="background:${SAND};padding:14px;border-radius:12px 0 0 12px;font-size:15px;color:${FOREST};">${esc(b.label)}</td>
      ${cell(b.key, b.label, 'email', m[`${b.key}Email` as keyof ConsentMatrix])}
      ${cell(b.key, b.label, 'sms', m[`${b.key}Sms` as keyof ConsentMatrix])}
    </tr>
    <tr><td colspan="3" style="height:3px;line-height:3px;font-size:3px;">&nbsp;</td></tr>`,
  ).join('')

  return `<form method="POST" action="${url}" style="margin:0 0 28px;" id="prefForm">
    <input type="hidden" name="action" value="preferences"/>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 14px;">
      <tr>
        <th align="left" style="font-size:11px;font-weight:600;color:${MUTED};text-transform:uppercase;letter-spacing:.06em;padding:0 0 10px;">Brand</th>
        <th style="font-size:11px;font-weight:600;color:${MUTED};text-transform:uppercase;letter-spacing:.06em;padding:0 0 10px;width:64px;">E-mail</th>
        <th style="font-size:11px;font-weight:600;color:${MUTED};text-transform:uppercase;letter-spacing:.06em;padding:0 0 10px;width:64px;">SMS</th>
      </tr>
      ${rows}
    </table>

    <div style="background:${SAND};border-radius:12px;padding:14px;margin:0 0 14px;">
      <label for="tlf" style="display:block;font-size:11px;font-weight:600;color:${MUTED};text-transform:uppercase;letter-spacing:.06em;margin:0 0 8px;">${esc(PREF_PHONE_LABEL)}</label>
      <input id="tlf" name="phone" type="tel" inputmode="numeric" autocomplete="tel"
        value="${esc(current.phone ?? '')}" placeholder="12 34 56 78"
        style="width:100%;box-sizing:border-box;border:1px solid #d5d0c4;border-radius:8px;padding:11px 12px;font-size:15px;font-family:inherit;color:${FOREST};background:#ffffff;"/>
      <p id="phoneHint" style="font-size:12px;line-height:1.5;color:${MUTED};margin:8px 0 0;">${esc(PREF_PHONE_HINT)}</p>
    </div>

    <p style="font-size:12px;line-height:1.6;color:${MUTED};margin:0 0 20px;padding:14px;background:#faf8f3;border-radius:10px;">${esc(PREF_CONSENT_GRID)}</p>

    <button type="submit" style="background:${SIGNAL};color:${FOREST};border:0;border-radius:999px;font-size:16px;font-weight:500;padding:14px 28px;cursor:pointer;font-family:inherit;">Gem mine valg</button>
    <p style="font-size:13px;line-height:1.6;color:${MUTED};margin:12px 0 0;">${esc(PREF_SAVE_NOTE)}</p>
  </form>
  <p style="font-size:14px;line-height:1.6;color:${MUTED};margin:0 0 12px;">Vil du helt ud af det hele?</p>
  ${button(token, 'unsubscribe', 'Afmeld mig fra alt')}
  <script>
  (function () {
    var tlf = document.getElementById('tlf');
    var sms = [].slice.call(document.querySelectorAll('input.sms'));
    var hint = document.getElementById('phoneHint');
    if (!tlf) return;
    // EXACTLY the server's rule, interpolated from lib/phone.ts rather than
    // hand-copied: regex AND the 00000000 sentinel (which the server refuses).
    // A looser gate here would enable the boxes for input the server then drops,
    // and the page would say "Dine valg er gemt" for a consent that was not. On
    // a consent screen that is the one message that has to be true.
    var phoneRe = new RegExp(${JSON.stringify(PHONE_RE.source)});
    function valid(v) {
      var c = v.replace(/\\s/g, '');
      return phoneRe.test(c) && c !== ${JSON.stringify(SENTINEL_PHONE)};
    }
    function sync() {
      var ok = valid(tlf.value);
      var typed = tlf.value.replace(/\\s/g, '').length > 0;
      sms.forEach(function (b) {
        b.disabled = !ok;
        // Consent must never outlive the number it belongs to.
        if (!ok) b.checked = false;
      });
      if (hint) {
        hint.textContent = typed && !ok
          ? ${JSON.stringify(PREF_PHONE_INVALID)}
          : ${JSON.stringify(PREF_PHONE_HINT)};
      }
    }
    tlf.addEventListener('input', sync);
    sync();
  })();
  </script>`
}

