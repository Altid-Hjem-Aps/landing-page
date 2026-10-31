import { createHmac } from 'node:crypto'

// Tracked store links in the Altid Hjem launch mails (ALT-605).
//
// Every App Store and Google Play link in the launch mails points at
// https://www.altidhjem.dk/m/<mail>/<link>. The route answers 302 to the store
// with the store's own campaign data (App Store `ct`, Google Play `referrer`),
// and counts the tap in Amplitude. The scheme is ALT-894's (`ah_1_<site>`), with
// the site being `mail_<mail>`.
//
// These URLs are permanent: they sit in inboxes for years. Never remove a code
// below, and never roll production back to a deployment without the route.
//
// Only the codes below ever leave the route. A code that is not on the list is
// reported as `unknown`, so nothing typed into a URL reaches analytics.

/** The Amplitude event (website project) the admin reads. */
export const MAIL_LINK_EVENT = 'Launch Mail Link Clicked'

// a1b and a1d (the short notices) are no longer sent since 31 Oct 2026: people
// without consent get a1a or a1c. They stay valid so any old link still
// counts. a1f is the Altid Forsikring waitlist's mail 1.
export const MAIL_CODES = ['a1a', 'a1c', 'a1b', 'a1d', 'a1f', 'm0', 'm2h', 'm2m', 'm3'] as const
export type MailCode = (typeof MAIL_CODES)[number]

export type Store = 'appstore' | 'play'

const STORES: readonly Store[] = ['appstore', 'play']
const BLOCKS = ['mad', 'indkob', 'energi', 'forsikring', 'drom'] as const

function allLinkCodes(): string[] {
  const codes = ['header', 'intro-play-link']
  for (const store of STORES) {
    for (const place of ['intro', 'breaker', 'end']) {
      codes.push(`${place}-${store}`)
    }
    codes.push(`intro-${store}-wide`, `end-${store}-wide`, `qr-${store}`, `text-${store}`)
    for (const block of BLOCKS) codes.push(`block-${block}-${store}`)
  }
  return codes
}

/** Every link position a launch mail may use. */
export const LINK_CODES: readonly string[] = allLinkCodes()

const MAIL_SET = new Set<string>(MAIL_CODES)
const LINK_SET = new Set<string>(LINK_CODES)

export const UNKNOWN = 'unknown'

export const APP_STORE_PROVIDER_TOKEN = '129212732'
const APP_STORE_BASE = 'https://apps.apple.com/dk/app/altid-hjem/id6794330094'
const PLAY_BASE = 'https://play.google.com/store/apps/details?id=dk.altidhjem.app'

export interface MailLink {
  /** A known mail code, or `unknown`. */
  mail: string
  /** A known link code, or `unknown`. */
  link: string
  valid: boolean
  store: Store
  location: string
}

/** The store a link code names, or null for a link that names none (the
 * header image, an unknown code): those follow the phone. */
export function storeOfLink(link: string): Store | null {
  if (!LINK_SET.has(link)) return null
  if (link.includes('appstore')) return 'appstore'
  if (link.includes('play')) return 'play'
  return null
}

function storeForDevice(userAgent: string | null): Store {
  return userAgent && /android/i.test(userAgent) ? 'play' : 'appstore'
}

export function storeUrl(store: Store, mail: string, link: string): string {
  const campaign = `ah_1_mail_${mail}`
  if (store === 'appstore') {
    return `${APP_STORE_BASE}?pt=${APP_STORE_PROVIDER_TOKEN}&ct=${campaign}&mt=8`
  }
  const referrer = `utm_source=mail_${mail}&utm_medium=email&utm_campaign=${campaign}&utm_content=${link}`
  return `${PLAY_BASE}&referrer=${encodeURIComponent(referrer)}`
}

/** A code as typed, or `unknown`. Mail programs that show plain text can
 * capitalise a link or glue a full stop or bracket onto it; both still count. */
function normalizeCode(raw: string, known: Set<string>): string {
  const code = raw.trim().toLowerCase().replace(/[^a-z0-9-]+$/, '')
  return known.has(code) ? code : UNKNOWN
}

/** Where a tap on /m/<mail>/<link> goes, and what it is counted as. Always a
 * store: a broken link in a sent mail must still get the person to the app. */
export function resolveMailLink(rawMail: string, rawLink: string, userAgent: string | null): MailLink {
  const mail = normalizeCode(rawMail, MAIL_SET)
  const link = normalizeCode(rawLink, LINK_SET)
  const valid = mail !== UNKNOWN && link !== UNKNOWN
  const store = storeOfLink(link) ?? storeForDevice(userAgent)
  return { mail, link, valid, store, location: storeUrl(store, mail, link) }
}

/**
 * The rate-limit key for one IP: an HMAC-SHA256 of the IP under a server-only
 * secret (REFERRAL_IP_SALT, set on Preview and Production), cut to 32 hex
 * characters. The raw IP is never stored, and without the secret the key
 * cannot be brute-forced back to an IPv4 address. Throws without a secret:
 * an unkeyed hash of an IP is no protection.
 */
export function mailLinkRateKey(ip: string | null, secret: string | undefined): string {
  if (!secret) throw new Error('REFERRAL_IP_SALT is not set: will not rate-limit on an unkeyed IP')
  return `mail-link:${createHmac('sha256', secret).update(ip ?? 'unknown').digest('hex').slice(0, 32)}`
}
