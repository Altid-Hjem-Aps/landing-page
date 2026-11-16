import { STORE_POSITIONS } from '@/lib/store-links'

// Anonymous counts from the site's own pages, sent with countEvent (lib/count.ts) to
// app/api/forside/count and passed on to Amplitude by our server with no person behind them, as
// the store clicks are (app/api/forside/store-click). They count every visitor, also those who
// did not accept statistics, so a pop-up's shown count and its conversions (store clicks with
// position "popup", QR scans with src "leave" or "offer") come from the same visitors and can be
// divided. Every property is one of a fixed list of values: nothing typed, nothing about a person.
//
// The browser events (Exit Intent Shown, Energi Offer Shown and so on, lib/analytics.ts
// trackEvent) stay, for visitors who accepted: they carry the session, these do not.

export const POPUPS = ['leave', 'offer'] as const
export const POPUP_MODES = ['computer', 'phone'] as const
/** The QR card a store button turns into on a computer (PillQr): one store's code, or the one
 * code for both stores ("app", the Altid Energi offer). */
export const QR_CARD_CODES = ['appstore', 'play', 'app'] as const

/** Which kind of page a visit was on (Page Visited): the new site's pages in groups, so the
 * count says where visits land without a list that must follow every page. */
export const PAGE_GROUPS = ['front', 'guide', 'kontakt', 'presse', 'legal', 'other'] as const
export type PageGroup = (typeof PAGE_GROUPS)[number]

/** The guides (components/site/Guide.tsx). test/site-counts-pages.test.ts checks that every page
 * built on Guide is listed, so a new guide cannot land as "other". */
export const GUIDE_PATHS = [
  '/bedste-budget-app',
  '/billigste-elselskab',
  '/billigste-mobilabonnement',
  '/gennemsnitligt-elforbrug',
  '/hvad-koster-en-ladeboks',
  '/hvad-koster-en-tyverialarm',
  '/hvad-koster-forsikring',
  '/hvad-koster-indboforsikring',
  '/hvornar-er-strommen-billigst',
  '/opsig-abonnementer',
  '/skift-forsikringsselskab',
  '/spiir-alternativ',
] as const

/** The group a path belongs to. */
export function pageGroup(path: string): PageGroup {
  const p = path.length > 1 ? path.replace(/\/+$/, '') : path
  if (p === '/') return 'front'
  if ((GUIDE_PATHS as readonly string[]).includes(p)) return 'guide'
  if (p === '/kontakt') return 'kontakt'
  if (p === '/presse') return 'presse'
  if (p === '/privatlivspolitik' || p === '/slet-konto') return 'legal'
  return 'other'
}

export const SITE_COUNTS = {
  'Popup Shown': { popup: POPUPS, mode: POPUP_MODES },
  'Popup Dismissed': { popup: POPUPS, mode: POPUP_MODES },
  'QR Card Opened': { code: QR_CARD_CODES, position: STORE_POSITIONS },
  // Every page view on the new site, for every visitor, no cookie (D6 of the old vs new
  // conversion plan): the full visitor count the cookie-accepting count cannot give.
  'Page Visited': { page: PAGE_GROUPS },
} as const satisfies Record<string, Record<string, readonly string[]>>

export type SiteCount = keyof typeof SITE_COUNTS
export type SiteCountProps<E extends SiteCount> = { [K in keyof (typeof SITE_COUNTS)[E]]: (typeof SITE_COUNTS)[E][K] extends readonly (infer V)[] ? V : never }

/** The event and its properties when `body` is exactly one allowed count, else null. */
export function parseSiteCount(body: unknown): { event: SiteCount; props: Record<string, string> } | null {
  if (typeof body !== 'object' || body === null || Array.isArray(body)) return null
  const { event, props } = body as Record<string, unknown>
  if (typeof event !== 'string' || !Object.hasOwn(SITE_COUNTS, event)) return null
  if (typeof props !== 'object' || props === null || Array.isArray(props)) return null
  const allowed: Record<string, readonly string[]> = SITE_COUNTS[event as SiteCount]
  const given = props as Record<string, unknown>
  const keys = Object.keys(allowed)
  if (Object.keys(given).length !== keys.length) return null
  const out: Record<string, string> = {}
  for (const key of keys) {
    const value = given[key]
    if (typeof value !== 'string' || !allowed[key].includes(value)) return null
    out[key] = value
  }
  return { event: event as SiteCount, props: out }
}
