import { createHmac } from 'node:crypto'

// Tracked links in the Altid Hjem launch mails (ALT-605).
//
// Every App Store and Google Play link in the launch mails points at
// https://www.altidhjem.dk/m/<mail>/<link>. The route answers 302 to the store
// with the store's own campaign data (App Store `ct`, Google Play `referrer`),
// and counts the tap in Amplitude. The scheme is ALT-894's (`ah_1_<site>`), with
// the site being `mail_<mail>`. A few links of one mail go somewhere else, or
// follow the phone under a name of their own: those are in MAIL_LINK_OVERRIDES.
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
// counts. a1f is the Altid Forsikring waitlist's mail 1. invite is not a mail:
// it is the link people share from /del and the welcome mail's share row
// (www.altidhjem.dk/app redirects to /m/invite/header), so a friend lands in
// the store with campaign ah_1_mail_invite.
// m2f (4 Nov 2026) is mail 2 to the Altid Forsikring waitlist: A1f recipients who did not open it.
export const MAIL_CODES = ['a1a', 'a1c', 'a1b', 'a1d', 'a1f', 'm0', 'm2h', 'm2m', 'm3', 'invite', 'm2f'] as const
export type MailCode = (typeof MAIL_CODES)[number]

export type Store = 'appstore' | 'play'
/** Where a tap lands: a store, or `web` for a page on the site. */
export type Target = Store | 'web'

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

/** A link that only one mail has. `phone`: the store of the phone, with that
 * mail's campaign, like the header image. `web`: a fixed page on the site. */
export type LinkOverride = { kind: 'phone' } | { kind: 'web'; url: string }

/**
 * Links that exist for one mail only, keyed by mail code, then link code.
 *
 * m0 (the welcome mail) opens the app and the share page from buttons that
 * used to link straight to the site, so their taps were never counted:
 * - m0/open: the "open the app" button, to the store of the phone (m0 campaign).
 * - m0/del: the share button, to /del with via=hjem-welcome (the /del page
 *   counts the share itself in "Share Page Shared").
 *
 * Destinations are fixed here, never read from the request: the route is not
 * an open redirect. A web destination is an absolute production URL, so a
 * preview deployment hands m0/del over to production /del. Same rule as the
 * codes above: never remove an entry.
 */
export const MAIL_LINK_OVERRIDES: Readonly<Partial<Record<MailCode, Readonly<Record<string, LinkOverride>>>>> = {
  m0: {
    open: { kind: 'phone' },
    del: { kind: 'web', url: 'https://www.altidhjem.dk/del?via=hjem-welcome' },
  },
}

function overrideFor(mail: string, link: string): LinkOverride | undefined {
  const links = MAIL_LINK_OVERRIDES[mail as MailCode]
  return links && Object.hasOwn(links, link) ? links[link] : undefined
}

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
  /** The store the tap goes to, or `web` for a page on the site. */
  store: Target
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
  // A shared invite is not an email: Play reports it as its own share source.
  const referrer =
    mail === 'invite'
      ? `utm_source=invite&utm_medium=share&utm_campaign=invite&utm_content=${link}`
      : `utm_source=mail_${mail}&utm_medium=email&utm_campaign=${campaign}&utm_content=${link}`
  return `${PLAY_BASE}&referrer=${encodeURIComponent(referrer)}`
}

/** A code as typed. Mail programs that show plain text can capitalise a link
 * or glue a full stop or bracket onto it; both still count. */
function cleanCode(raw: string): string {
  return raw.trim().toLowerCase().replace(/[^a-z0-9-]+$/, '')
}

/** Where a tap on /m/<mail>/<link> goes, and what it is counted as. A store,
 * unless the mail has its own destination for that link (MAIL_LINK_OVERRIDES):
 * a broken link in a sent mail must still get the person to the app. */
export function resolveMailLink(rawMail: string, rawLink: string, userAgent: string | null): MailLink {
  const cleanMail = cleanCode(rawMail)
  const cleanLink = cleanCode(rawLink)
  const mail = MAIL_SET.has(cleanMail) ? cleanMail : UNKNOWN
  const override = mail === UNKNOWN ? undefined : overrideFor(mail, cleanLink)
  const link = (override || LINK_SET.has(cleanLink)) ? cleanLink : UNKNOWN
  const valid = mail !== UNKNOWN && link !== UNKNOWN
  if (override?.kind === 'web') {
    return { mail, link, valid, store: 'web', location: override.url }
  }
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
