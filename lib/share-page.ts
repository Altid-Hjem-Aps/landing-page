// The /del share page (ALT-605): what a person sends on when they share
// Altid Hjem with a friend or partner, and the links that carry it.
//
// Pure string builders so the page and its tests share one source. The welcome
// mail (M0) builds the same WhatsApp/SMS/Mail links in Python; keep the text
// and URL here and in build_r10.py identical.

export const SHARE_TITLE = 'Altid Hjem'
export const SHARE_TEXT =
  'Jeg er begyndt at bruge Altid Hjem til mad, strøm, forsikring og økonomi i ét overblik. Prøv den her:'
export const MAIL_SUBJECT = 'Prøv Altid Hjem'

// `via` says where the share started (the mail, the app, the page itself). It
// ends up in utm_campaign, so only a short slug gets through; anything else
// falls back to the page's own value instead of reaching Amplitude.
export const DEFAULT_VIA = 'del'
const VIA = /^[a-z0-9-]{1,32}$/

export function sanitizeVia(raw: unknown): string {
  return typeof raw === 'string' && VIA.test(raw) ? raw : DEFAULT_VIA
}

export function shareUrl(via: string): string {
  return `https://www.altidhjem.dk/?utm_source=invite&utm_medium=share&utm_campaign=${via}`
}

// Android's Messages app reads `sms:?body=`; iOS needs the `&` form.
export function isAndroid(userAgent: string): boolean {
  return /android/i.test(userAgent)
}

export interface ShareChannelLinks {
  whatsapp: string
  sms: string
  mail: string
}

export function shareChannelLinks(via: string, { android = false } = {}): ShareChannelLinks {
  const message = encodeURIComponent(`${SHARE_TEXT} ${shareUrl(via)}`)
  return {
    whatsapp: `https://wa.me/?text=${message}`,
    sms: android ? `sms:?body=${message}` : `sms:?&body=${message}`,
    mail: `mailto:?subject=${encodeURIComponent(MAIL_SUBJECT)}&body=${message}`,
  }
}
