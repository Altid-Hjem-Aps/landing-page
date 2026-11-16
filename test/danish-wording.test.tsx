/// <reference types="vite/client" />
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
// The pure entry: no automatic cleanup after each test, since one render per guide serves all its tests.
import { cleanup, render } from '@testing-library/react/pure'
import type { ReactElement } from 'react'
import { GUIDE_PATHS } from '@/lib/site-counts'

// The Danish word checks (docs/guide-recipe.md, section 5), on every guide in GUIDE_PATHS:
//   1. No word from WORDS: English words with a plain Danish word, terms Thor's language audits
//      found invented or wrong, and team words, which never go on the page.
//   2. du or I, kept the same: a guide whose title says du never says "I", "jer" or "jeres" to the
//      reader. Any other guide is in I-form (recipe section 5): a guide not in OLD_GUIDES never
//      says "du", "dig", "din", "dit" or "dine", and one of the old 25 only once it says I.
// A list cannot know every word, so the writing agent's language pass (section 5) stays. A
// sentence kept on purpose goes in KEPT with who decided and why; only that sentence is excused,
// and an entry that no longer matches its page fails.

vi.mock('@/components/site/SiteNav', () => ({ default: () => null }))
vi.mock('@/components/site/SiteFooter', () => ({ default: () => null }))
vi.mock('@/components/site/Reveal', () => ({ default: () => null }))
// Async server parts: the live user count and the App Store rating.
vi.mock('@/components/site/GuideOfferPopup', () => ({ default: () => null }))
vi.mock('@/components/site/AppRating', () => ({ default: () => null }))
// The live prices, as one fixed day, so the price chart renders.
vi.mock('@/lib/elpriser', async (original) => {
  const real = await original<typeof import('@/lib/elpriser')>()
  const hour = (h: number) => ({ hour: h, dk1: 0.6 + h / 100, dk2: 0.65 + h / 100, dk1Max: 0.7, dk2Max: 0.75, dk1Tax: 0.008, dk2Tax: 0.008, dk1Trans: 0.115, dk2Trans: 0.115, dk1Dist: 0.2, dk2Dist: 0.2 })
  return {
    ...real,
    getElpriser: async () => ({ date: '2026-11-16', hours: Array.from({ length: 24 }, (_, h) => hour(h)), tomorrowHours: null, tomorrowDate: '2026-11-17' }),
    getNetselskaber: async () => [],
    currentCopenhagenHour: () => 12,
  }
})

const PAGES = import.meta.glob('../app/*/page.tsx')

/** A whole word, upper or lower case, with Danish letters counted as letters. */
const word = (pattern: string) => new RegExp(`(?<![\\p{L}\\p{N}])(?:${pattern})(?![\\p{L}\\p{N}])`, 'iu')

/** Words a guide never uses, each with the Danish to use instead and why. */
const WORDS: { word: RegExp; use: string; why: string }[] = [
  { word: word('awesome'), use: 'fantastisk, god', why: 'English' },
  { word: word('nice'), use: 'rar, god, fin', why: 'English' },
  { word: word('cool'), use: 'god, smart', why: 'English' },
  { word: word('deal(?:s|en|ene|et)?'), use: 'aftale, tilbud, god handel', why: 'English' },
  { word: word('game[ -]?changer\\w*'), use: 'stor forskel', why: 'English' },
  { word: word('must[ -]have'), use: 'et must, noget man skal have', why: 'English' },
  { word: word('insights?'), use: 'indsigt, viden', why: 'English' },
  { word: word('features?'), use: 'funktion', why: 'English' },
  { word: word('seamless'), use: 'nem, glidende', why: 'English' },
  { word: word('(?:life)?hacks?'), use: 'tip, kneb', why: 'English' },
  { word: word('boost(?:e|er|et|ede)?'), use: 'løfte, øge', why: 'English' },
  { word: word('fancy'), use: 'fin, smart', why: 'English' },
  { word: word('flage(?:r|t|de)?'), use: 'markere', why: "Anglicism (to flag), found in Thor's language audit, 31 Jul 2026" },
  { word: word('discount(?:aftale|abonnement)\\w*'), use: 'datamængden ("30 GB"), "fri tale"', why: "Invented: no such product on the Danish mobile market (Thor's audit, 31 Jul 2026)" },
  { word: word('transporttarif\\w*'), use: 'nettarif', why: "Wrong trade term: the electricity market says nettarif (Thor's audit, 31 Jul 2026)" },
  { word: word('subbrands?'), use: 'Mad, Energi, Forsikring, Økonomi', why: 'Team word, never on the page (recipe section 5)' },
  { word: word('undermærke\\w*'), use: 'Mad, Energi, Forsikring, Økonomi', why: 'Invented: "there is no such thing as undermærker" (Thor, 6 Oct 2026)' },
  { word: word('onboarding'), use: 'kom i gang, opret profil', why: 'Team word, never on the page (recipe section 5)' },
]

const MAD_COPY = 'Mad copy, moved word for word from altidmad.dk; Thor and Alex own it (recipe section 4, step 8). Mixed du and I found by this test on 16 Nov 2026, kept until they rewrite it'

/** Sentences kept on purpose. Each entry: the page, a piece of the sentence, and the reason. */
const KEPT: { path: string; text: string; why: string }[] = [
  {
    path: '/billigste-mobilabonnement',
    text: "skriver EU's portal Dit Europa",
    why: '"Dit Europa" is the name of the EU portal (Your Europe), not du',
  },
  ...[
    'Du kan læse den samlede metode og se varegrundlaget',
    'Nej, du kan ofte spare ved at vælge en billig hovedbutik',
  ].map((text) => ({ path: '/billigste-supermarked', text, why: MAD_COPY })),
  ...[
    'Med vores grænsehandel-beregner kan du indtaste afstanden',
    'Så får du transportprisen og jeres break-even',
    'Sådan regner du grænsehandlen ud',
    'Vil du have det fulde regnestykke, bør du også overveje',
    'Du kan læse mere om metoden på siden om det billigste supermarked',
  ].map((text) => ({ path: '/graensehandel-beregner', text, why: MAD_COPY })),
  { path: '/madpakker-paa-budget', text: 'som du kan hente gratis i App Store og Google Play', why: MAD_COPY },
  ...[
    'Hvis I vælger ugens retter først, risikerer I',
    'brug det, I allerede har i fryseren og skabene',
    'så planen passer til jeres virkelige uge',
    'Et tilbud er kun billigt, hvis I får varen brugt',
    'så I både reducerer indkøbet og undgår madspild',
    'Besparelsen afhænger af jeres nuværende vaner',
    'fordi I kan planlægge den kommende uge samlet',
    'passer ind i jeres rute, men hold jer til én butik',
    'som I kan hente gratis i App Store og Google Play',
  ].map((text) => ({ path: '/madplan-efter-tilbud', text, why: MAD_COPY })),
  ...[
    'Se derfor på prisen på de varer, I faktisk køber ofte',
    'så jeres billigste butik kan afhænge af familiens egne vaner',
    'hvis butikkerne ligger naturligt på jeres vej',
    'Det afhænger af jeres nuværende butik, madspild og indkøbsvaner',
    'for de varer, jeres familie normalt køber',
    'hvor forskellen betyder mindst for jer',
  ].map((text) => ({ path: '/spar-penge-paa-dagligvarer', text, why: MAD_COPY })),
]

/** The reader as I (the household) and as du. */
const I_FORM = word('jer|jeres')
const I_PRONOUN = /(?<![\p{L}\p{N}])I(?![\p{L}\p{N}])/u
const DU_FORM = word('du|dig|din|dit|dine')

const BLOCKS = 'h1, h2, h3, p, li, td, th, caption, figcaption, summary'
// The guide's own text: not the shared parts every guide shows (the "Fandt du ikke svaret?" card,
// the store buttons, the end panel's buttons), not the other guides' cards or the sources' titles,
// and not the app screens drawn in an example, which speak as the app does.
const NOT_OWN = '.gd-crumbs, .gd-sources, .gd-ask, .gd-stores, .gd-app-cta, .gd-related, .gd-cta-pills, .gd-cta-get, .gd-figure-art, script'

/** Sentences, cut after . ! ? and : so a caption's "I appen:" and the text after it stand apart. */
function sentences(text: string) {
  return text
    .split(/(?<=[.!?:])\s+/)
    .map((s) => s.trim())
    .filter(Boolean)
}

/** Whether a sentence speaks to the reader as I: "jer", "jeres", or "I" after its first word (at
 * the start, "I" can also be the preposition: "I appen", "I 2024"). */
function saysI(sentence: string) {
  const rest = sentence.replace(/^[^\p{L}\p{N}]*[\p{L}\p{N}]+/u, '')
  return I_FORM.test(sentence) || I_PRONOUN.test(rest)
}

/** The listed words in these sentences, each with the sentence it stands in. */
function listedWords(text: string[]) {
  return WORDS.flatMap(({ word: w, use }) => text.filter((s) => w.test(s)).map((s) => `"${s.match(w)![0]}" (use ${use}) in: ${s.slice(0, 120)}`))
}

/** The 25 guides on the site on 16 Nov 2026, frozen like OLD_GUIDES in test/guide-checks.test.tsx
 * (never add a path): they may be in du-form without saying so in the title. */
const OLD_GUIDES: readonly string[] = [
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
]

/** The sentences that break du or I: with a title that says du, those that say I. Else the page is
 * in I-form: on a new guide every sentence that says du; on one of the old 25, once one sentence
 * says I, those that say du. */
function mixedForms(title: string, text: string[], old: boolean) {
  if (DU_FORM.test(title)) return text.filter(saysI)
  return !old || text.some(saysI) ? text.filter((s) => DU_FORM.test(s)) : []
}

describe('the Danish word checks', () => {
  it.each([
    { text: ['Det er en god deal.'], found: 1 },
    { text: ['Appen har en ny feature.'], found: 1 },
    { text: ['Vi tjekker transporttariffen.'], found: 1 },
    { text: ['Er discountbutikker altid billigst?', 'Idealet er en fast aftale.'], found: 0 },
  ])('finds $found listed word(s) in $text', ({ text, found }) => {
    expect(listedWords(text)).toHaveLength(found)
  })

  it.each([
    { old: true, title: 'Hvad koster en husforsikring?', text: ['Har I lån i huset?', 'Så skal du tjekke policen.'], wrong: ['Så skal du tjekke policen.'] },
    { old: true, title: 'Hvad koster en husforsikring?', text: ['Tjek jeres police.', 'Find dine papirer.'], wrong: ['Find dine papirer.'] },
    { old: true, title: 'Hvad koster en husforsikring?', text: ['I appen kan du se prisen.', 'Find dine papirer.'], wrong: [] },
    { old: false, title: 'Hvad koster en husforsikring?', text: ['I appen kan du se prisen.', 'Find dine papirer.'], wrong: ['I appen kan du se prisen.', 'Find dine papirer.'] },
    { old: false, title: 'Hvad koster en husforsikring?', text: ['I appen ser I prisen.', 'Find jeres papirer.'], wrong: [] },
    { old: true, title: 'Sådan sparer du penge', text: ['Vælg din butik.', 'Det afhænger af jeres vaner.', 'Det passer, hvis I handler sjældent.'], wrong: ['Det afhænger af jeres vaner.', 'Det passer, hvis I handler sjældent.'] },
    { old: false, title: 'Sådan sparer du penge', text: ['I 2024 steg priserne.', 'Vælg din butik.'], wrong: [] },
  ])('with the title "$title" (old guide: $old), flags $wrong', ({ old, title, text, wrong }) => {
    expect(mixedForms(title, text, old)).toEqual(wrong)
  })
})

describe.each(GUIDE_PATHS)('%s', (path) => {
  let page: HTMLElement

  beforeAll(async () => {
    const load = PAGES[`../app${path}/page.tsx`]
    if (!load) throw new Error(`No page file for ${path}`)
    const mod = (await load()) as { default: () => ReactElement | Promise<ReactElement> }
    page = render(await mod.default()).container
  })
  afterAll(cleanup)

  const keptHere = KEPT.filter((k) => k.path === path)
  const kept = (sentence: string) => keptHere.some((k) => sentence.includes(k.text))
  /** The guide's own sentences: each block read once, where it stands. */
  const own = () =>
    [...page.querySelectorAll(BLOCKS)]
      .filter((el) => !el.closest(NOT_OWN) && !el.querySelector(BLOCKS))
      .flatMap((el) => sentences(el.textContent!.replace(/\s+/g, ' ')))

  it('still has every sentence its KEPT entries excuse', () => {
    const text = page.textContent!
    expect(keptHere.filter((k) => !text.includes(k.text)).map((k) => k.text)).toEqual([])
  })

  it('uses no word from the list', () => {
    // Every text a visitor sees, its pieces kept apart so a heading's last word and the next
    // paragraph's first do not run together.
    const parts: string[] = []
    const walk = (n: Node) => (n.nodeType === 3 ? parts.push(n.textContent!) : (n as Element).matches('script') || n.childNodes.forEach(walk))
    walk(page)
    expect(listedWords(sentences(parts.join(' ').replace(/\s+/g, ' ')).filter((s) => !kept(s)))).toEqual([])
  })

  it('keeps to du or I through the page', () => {
    const title = page.querySelector('h1')!.textContent!
    const message = DU_FORM.test(title) ? 'the title says du, so these must not say I, jer or jeres' : 'the page is in I-form, so these must not say du'
    expect(mixedForms(title, own().filter((s) => !kept(s)), OLD_GUIDES.includes(path)), message).toEqual([])
  })
})
