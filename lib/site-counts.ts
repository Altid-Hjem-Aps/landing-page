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
  '/billigste-supermarked',
  '/fastpris-eller-variabel-el',
  '/gennemsnitligt-elforbrug',
  '/graensehandel-beregner',
  '/hvad-koster-bredbaand',
  '/hvad-koster-en-bilforsikring',
  '/hvad-koster-en-husforsikring',
  '/hvad-koster-en-ladeboks',
  '/hvad-koster-en-tyverialarm',
  '/hvad-koster-forsikring',
  '/hvad-koster-indboforsikring',
  '/hvornar-er-strommen-billigst',
  '/jul-paa-budget',
  '/mad-for-3000-om-maaneden',
  '/madbudget',
  '/madbudget-familie-paa-4',
  '/madpakker-paa-budget',
  '/madplan-efter-tilbud',
  '/opsig-abonnementer',
  '/skift-forsikringsselskab',
  '/spar-penge-paa-dagligvarer',
  '/spiir-alternativ',
] as const

/** A guide's own name: its path without the slash ("bedste-budget-app"). */
export type GuideSlug = (typeof GUIDE_PATHS)[number] extends `/${infer S}` ? S : never
export const GUIDE_SLUGS = GUIDE_PATHS.map((p) => p.slice(1)) as GuideSlug[]

/** Which page a count came from (ALT-1713): a guide by its own name, every other page by its
 * group. So each guide can be read on its own, and the list stays fixed. */
export const SITE_PAGES = [...PAGE_GROUPS, ...GUIDE_SLUGS] as const
export type SitePage = PageGroup | GuideSlug

function cleanPath(path: string): string {
  return path.length > 1 ? path.replace(/\/+$/, '') : path
}

/** The guide a path is, or null for any other page. */
export function guideSlug(path: string | null | undefined): GuideSlug | null {
  if (!path) return null
  const p = cleanPath(path)
  return (GUIDE_PATHS as readonly string[]).includes(p) ? (p.slice(1) as GuideSlug) : null
}

/** The page name a count carries: the guide's own name, else the page's group. */
export function sitePage(path: string): SitePage {
  return guideSlug(path) ?? pageGroup(path)
}

/** The group a path belongs to. */
export function pageGroup(path: string): PageGroup {
  const p = cleanPath(path)
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
  'QR Card Opened': { code: QR_CARD_CODES, position: STORE_POSITIONS, slug: SITE_PAGES },
  // Every page view on the new site, for every visitor, no cookie (D6 of the old vs new
  // conversion plan): the full visitor count the cookie-accepting count cannot give.
  // `slug` (ALT-1713): the guide's own name, so visits and store taps can be divided per guide.
  'Page Visited': { page: PAGE_GROUPS, slug: SITE_PAGES },
} as const satisfies Record<string, Record<string, readonly string[]>>

/** Properties a count may leave out: `slug` came on 16 Nov 2026 (ALT-1713), and a tab opened
 * before that deploy still runs the old script. Its count is kept, without the page name. */
const OPTIONAL: Readonly<Partial<Record<keyof typeof SITE_COUNTS, readonly string[]>>> = {
  'QR Card Opened': ['slug'],
  'Page Visited': ['slug'],
}

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
  const optional = OPTIONAL[event as SiteCount] ?? []
  if (Object.keys(given).some((key) => !Object.hasOwn(allowed, key))) return null
  const out: Record<string, string> = {}
  for (const key of Object.keys(allowed)) {
    if (!Object.hasOwn(given, key) && optional.includes(key)) continue
    const value = given[key]
    if (typeof value !== 'string' || !allowed[key].includes(value)) return null
    out[key] = value
  }
  return { event: event as SiteCount, props: out }
}
