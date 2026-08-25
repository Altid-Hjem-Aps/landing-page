import { createHash } from 'node:crypto'

// Altid Energi referral link plumbing (ALT-231 / ALT-286).
//
// The app builds https://altidhjem.dk/r/<code>; /r/<code> sends the friend on to
// Altid Energi's own referral signup page, which grants the 3-month reward. The
// only thing we add is the code (so Energi could attribute later) and UTM tags.
// Everything here is pure so the routes stay unit-testable.

/** Same alphabet + length as the app (lib/features/profile/state/referral_link.dart). */
export const REFERRAL_CODE_RE = /^[23456789BCDFGHJKMNPQRSTVWXZ]{8}$/

/** Michael's link, verbatim (18 Aug 2026). Do not change without Altid Energi. */
export const ENERGI_REFERRAL_SIGNUP_URL = 'https://tilmeld.altidenergi.dk/signup/henvisning-app'

export type ReferralEventKind = 'click' | 'share' | 'copy'
export const REFERRAL_EVENT_KINDS: readonly ReferralEventKind[] = ['click', 'share', 'copy']

export function isReferralCode(value: string): boolean {
  return REFERRAL_CODE_RE.test(value)
}

/**
 * What arrives in the URL is not always the bare code: chat apps like to glue
 * trailing punctuation onto pasted links ("…/r/ABCDEFGH." or ")"). Strip that
 * and upper-case before validating, so a friend still gets attributed.
 */
export function normalizeReferralCode(raw: string | null | undefined): string {
  return String(raw ?? '')
    .trim()
    .replace(/[.,;:!?)\]}>'"]+$/u, '')
    .toUpperCase()
}

/**
 * Where the friend ends up. Valid code → Energi page with ref + UTM.
 * Invalid code → same page, UTM only, so a typo never dead-ends anyone.
 */
export function energiRedirectUrl(code: string | null): string {
  const url = new URL(ENERGI_REFERRAL_SIGNUP_URL)
  if (code) url.searchParams.set('ref', code)
  url.searchParams.set('utm_source', 'altidhjem')
  url.searchParams.set('utm_medium', 'referral')
  url.searchParams.set('utm_campaign', 'ah_referral')
  return url.toString()
}

/**
 * Daily-salted, one-way hash of the visitor IP. Good enough to dedupe repeat
 * clicks within a day (the stats view calls it unique_ip_days for that reason),
 * useless for re-identifying anyone across days. Returns null when no IP or no
 * salt is available rather than hashing a guessable value.
 */
export function hashIp(ip: string | null, salt: string | undefined, now: Date = new Date()): string | null {
  if (!ip || !salt) return null
  const day = now.toISOString().slice(0, 10)
  return createHash('sha256').update(`${salt}|${day}|${ip}`).digest('hex')
}

let warnedMissingSalt = false
/**
 * REFERRAL_IP_SALT is what makes ip_hash mean anything. Without it every row
 * gets ip_hash = null and unique_ip_days is silently 0 forever, so shout once
 * per process instead of degrading quietly.
 */
export function referralIpSalt(): string | undefined {
  const salt = process.env.REFERRAL_IP_SALT
  if (!salt && !warnedMissingSalt) {
    warnedMissingSalt = true
    console.error('REFERRAL_IP_SALT is not set: referral ip_hash will be null and unique_ip_days will not count')
  }
  return salt
}

/** First hop of x-forwarded-for, or x-real-ip. Vercel sets both. */
export function clientIp(headers: Headers): string | null {
  const xff = headers.get('x-forwarded-for')
  if (xff) {
    const first = xff.split(',')[0]?.trim()
    if (first) return first
  }
  return headers.get('x-real-ip')
}

/**
 * Link-preview fetchers hit /r/<code> the moment a link is pasted into a chat,
 * long before any human taps it. Those are not clicks. Match on the well-known
 * unfurl/crawler UA tokens; anything else counts as a person.
 */
const BOT_UA_RE =
  /bot|crawler|spider|preview|headless|facebookexternalhit|facebookcatalog|whatsapp|slack|telegram|discord|twitter|linkedin|skype|imessage|snapchat|pinterest|embedly|quora|vkshare|outbrain|w3c_validator|curl\/|wget\/|python-requests|go-http-client|okhttp/i

export function looksLikeBot(userAgent: string | null): boolean {
  if (!userAgent) return true
  // Every card-drawing unfurler counts as a bot too, so the two lists can never
  // drift into a state where an unfurler is logged as a human click.
  return BOT_UA_RE.test(userAgent) || isLinkPreviewBot(userAgent)
}

/**
 * A subset of the crawlers above: the ones that actually draw a link card.
 * They get an HTML page with OG tags instead of the redirect (ALT-288), so the
 * receiver sees the offer rather than a naked link. Everything else, including
 * search crawlers, scripts and a missing UA, keeps the plain 302.
 */
const LINK_PREVIEW_UA_RE =
  /facebookexternalhit|facebookcatalog|whatsapp|slackbot|slack-imgproxy|telegrambot|discordbot|twitterbot|linkedinbot|skypeuripreview|snapchat|pinterest|redditbot|embedly|quora link preview|vkshare|applebot|iframely|nuzzel|bitlybot|flipboard|outbrain|google-safety|developers\.google\.com\/\+\/web\/snippet/i

export function isLinkPreviewBot(userAgent: string | null): boolean {
  if (!userAgent) return false
  return LINK_PREVIEW_UA_RE.test(userAgent)
}

/**
 * The card the receiver sees. Wording is Altid Energi's own offer, verbatim in
 * substance (25 Aug 2026: "100% rabat på dit Altid Energi-abonnement de første
 * 3 måneder"), so the promise on the card is the promise on the signup page.
 * "Gratis abonnement" was rejected in the Danish copy audit: it reads as free
 * electricity, and the discount only covers the subscription.
 */
export const REFERRAL_OG_TITLE = '100 % rabat på abonnementet i 3 måneder hos Altid Energi'
export const REFERRAL_OG_DESCRIPTION =
  'Du er blevet henvist og får derfor 100 % rabat på abonnementet de første 3 måneder. Herefter skifter du automatisk til det billigste abonnement, der matcher dit forbrug.'
// Versioned filename on purpose: chat apps cache preview images for weeks and
// ignore the HTML's no-store, so a new card ships under a new name.
export const REFERRAL_OG_IMAGE_URL = 'https://www.altidhjem.dk/og/referral-altid-energi-v1.png'
export const REFERRAL_OG_IMAGE_ALT = 'Altid Energi: 100 % rabat på abonnementet i 3 måneder'

/**
 * Where an unfurler is told the link lives. Only validated codes are echoed, and
 * a junk code gets no og:url at all: og:url is the object's identity in the
 * social graph, so pointing it at the front page would attach this referral card
 * to altidhjem.dk in every cache that saw it.
 */
export function referralCanonicalUrl(code: string | null): string | null {
  return code ? `https://www.altidhjem.dk/r/${code}` : null
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/**
 * The preview page. `code` only reaches it after isReferralCode(), i.e. 8 chars
 * of [23456789BCDFGHJKMNPQRSTVWXZ], and every interpolated value is escaped
 * anyway, so no caller can inject markup here.
 *
 * A human should never see this page (only known unfurl UAs get it), but if one
 * does, the meta refresh and the link still take them to Energi.
 */
export function referralPreviewHtml(code: string | null): string {
  const target = escapeHtml(energiRedirectUrl(code))
  const canonical = referralCanonicalUrl(code)
  const ogUrl = canonical ? `<meta property="og:url" content="${escapeHtml(canonical)}">\n` : ''
  return `<!doctype html>
<html lang="da">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>${REFERRAL_OG_TITLE}</title>
<meta name="description" content="${REFERRAL_OG_DESCRIPTION}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Altid Hjem">
<meta property="og:locale" content="da_DK">
${ogUrl}<meta property="og:title" content="${REFERRAL_OG_TITLE}">
<meta property="og:description" content="${REFERRAL_OG_DESCRIPTION}">
<meta property="og:image" content="${REFERRAL_OG_IMAGE_URL}">
<meta property="og:image:secure_url" content="${REFERRAL_OG_IMAGE_URL}">
<meta property="og:image:type" content="image/png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${REFERRAL_OG_IMAGE_ALT}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${REFERRAL_OG_TITLE}">
<meta name="twitter:description" content="${REFERRAL_OG_DESCRIPTION}">
<meta name="twitter:image" content="${REFERRAL_OG_IMAGE_URL}">
<meta name="twitter:image:alt" content="${REFERRAL_OG_IMAGE_ALT}">
<meta http-equiv="refresh" content="0; url=${target}">
</head>
<body>
<p><a href="${target}">${REFERRAL_OG_TITLE}</a></p>
</body>
</html>
`
}
