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
export const STORE_POSITIONS = ['hero', 'founder', 'how-it-works', 'bottom', 'nav', 'bar', 'footer'] as const
export type StorePosition = (typeof STORE_POSITIONS)[number]

/** The element every "Hent appen" control scrolls to: the final CTA's pills on
 * the front page, BottomCta on the SEO pages. */
export const STORE_ANCHOR = 'hent-appen'

export function storeLink(store: Store): string {
  if (store === 'appstore') {
    return `${APP_STORE_URL}?pt=${APP_STORE_PROVIDER_TOKEN}&ct=${CAMPAIGN}&mt=8`
  }
  const referrer = `utm_source=${SITE}&utm_campaign=${CAMPAIGN}`
  return `${PLAY_STORE_URL}&referrer=${encodeURIComponent(referrer)}`
}
