// The Altid Hjem store listings and the tracked links to them. This file is
// the one home of the store URLs: lib/mail-links.ts (links in sent mails) and
// components/StoreButtons.tsx import them from here. Browser safe: no node
// imports, so client components can use it.
//
// The site's badges use the ALT-894 campaign scheme ah_1_<site>. Sent mails have
// their own campaign per mail (lib/mail-links.ts).

/** The app's App Store id: the listing URL, the rating lookup and Apple's app banner. */
export const APP_STORE_ID = '6794330094'
export const APP_STORE_URL = `https://apps.apple.com/dk/app/altid-hjem/id${APP_STORE_ID}`
export const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=dk.altidhjem.app'
/** Apple's provider token for the Altid Hjem developer account. */
export const APP_STORE_PROVIDER_TOKEN = '129212732'

const SITE = 'altidhjem_dk'
const CAMPAIGN = `ah_1_${SITE}`

export const STORES = ['appstore', 'play'] as const
export type Store = (typeof STORES)[number]
export const STORE_POSITIONS = ['hero', 'founder', 'how-it-works', 'bottom', 'nav', 'footer', 'side', 'popup', 'energi'] as const
export type StorePosition = (typeof STORE_POSITIONS)[number]

/** The element every "Hent appen" control scrolls to: the final CTA's text and pills on
 * the front page, BottomCta on the SEO pages. */
export const STORE_ANCHOR = 'hent-appen'

/** The one QR code's link (public/site/qr/app.svg, app/qr/route.ts): each phone to its own
 * store. */
export const QR_LINK = 'https://www.altidhjem.dk/qr'

/** Where a copy of the one QR code sits on the site. Each place has its own image whose link
 * carries ?src=<place> (qrLink), so app/qr/route.ts counts the scans per place: the corner card
 * (GetAppSticky), the Altid Energi card at the side (EnergiSticky), the leave pop-up, the Altid
 * Energi offer pop-up, the offer on the Energi block (EnergiOffer), the footer's "Hent appen"
 * (SiteFooter). Ten characters at most: the link then still fits the same small code
 * (version 3, 37 modules with its quiet zone) as the plain QR_LINK. */
export const QR_SOURCES = ['sticky', 'side-offer', 'leave', 'offer', 'energi', 'footer'] as const
export type QrSource = (typeof QR_SOURCES)[number]

export function qrLink(source: QrSource): string {
  return `${QR_LINK}?src=${source}`
}

/** The QR image for a place: public/site/qr/app-<place>.svg, made from qrLink() with
 * scripts/site-assets.py qr. */
export function qrImage(source: QrSource): string {
  return `/site/qr/app-${source}.svg`
}

export function storeLink(store: Store): string {
  if (store === 'appstore') {
    return `${APP_STORE_URL}?pt=${APP_STORE_PROVIDER_TOKEN}&ct=${CAMPAIGN}&mt=8`
  }
  const referrer = `utm_source=${SITE}&utm_campaign=${CAMPAIGN}`
  return `${PLAY_STORE_URL}&referrer=${encodeURIComponent(referrer)}`
}
