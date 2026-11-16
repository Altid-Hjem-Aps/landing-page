/// <reference types="vite/client" />
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
// The pure entry: no automatic cleanup after each test, since one render per guide serves all five.
import { cleanup, render } from '@testing-library/react/pure'
import type { Metadata } from 'next'
import type { ReactElement } from 'react'
import { MAD_REPORT_HREF } from '@/components/mad/madGuide'
import { GUIDE_PATHS } from '@/lib/site-counts'

// The guide checks (ALT-1519, docs/guide-recipe.md section 6). Every guide on the site, old or
// new, is held to three rules in CI instead of by hand:
//   1. Sources. Every outside link in the text is in Kilder. Every price, percentage, kWh or GB
//      figure in the article has its source linked (an outside link or the Altid Mad report) or
//      named (a publisher in Kilder) in its own paragraph or the paragraph just before it. A figure
//      in the short answer, the answer card, the factors, the questions, a table, a heading or the
//      metadata is sourced the same way, or repeats a figure the article sources.
//   2. Visuals. A real app screen (an image from public/site/app) is captioned "I appen:", a chart
//      of real figures (GuideFigure kind="data") "Tal fra <a source in Kilder>", and anything drawn
//      "Eksempel: ... Illustration, ikke et skærmbillede fra appen.".
//   3. Markedsføringsloven, over all the page's text, the drawn examples and the metadata included:
//      a savings figure only from the Altid Mad report, no superlative about Altid Hjem, Altid Mad,
//      Altid Energi or the app, no promised app feature.
// A sentence that breaks a rule but is kept on purpose goes in ALLOWED with who decided and when.
// Only that sentence is excused, and an entry that no longer matches its page fails.

vi.mock('@/components/site/SiteNav', () => ({ default: () => null }))
vi.mock('@/components/site/SiteFooter', () => ({ default: () => null }))
vi.mock('@/components/site/Reveal', () => ({ default: () => null }))
// Async server parts: the live user count and the App Store rating.
vi.mock('@/components/site/GuideOfferPopup', () => ({ default: () => null }))
vi.mock('@/components/site/AppRating', () => ({ default: () => null }))
// The live prices, as one fixed day, so the price chart renders and its figure is checked.
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

/** Sentences kept on purpose. Each entry: the page, a piece of the sentence, and the decision. */
const ALLOWED: { path: string; text: string; why: string }[] = [
  ...['/madbudget', '/mad-for-3000-om-maaneden'].map((path) => ({
    path,
    text: 'I forældrefora fortæller familier',
    why: 'Mad copy (Thor and Alex own it), kept as it is by Thor on 16 Nov 2026',
  })),
  ...['I forældrefora fortæller familier', '4.000 kr. om måneden kan være realistisk'].map((text) => ({
    path: '/madbudget-familie-paa-4',
    text,
    why: 'Mad copy, kept as it is by Thor on 16 Nov 2026',
  })),
  {
    path: '/madbudget-familie-paa-4',
    text: 'Er 4.000 kr. om måneden realistisk',
    why: 'Mad copy (the question its kept answer replies to), kept as it is by Thor on 16 Nov 2026',
  },
  {
    path: '/graensehandel-beregner',
    text: 'I skal spare mere end',
    why: "The calculator's break-even line: the trip's cost from the reader's own numbers, not a savings claim",
  },
  ...['/billigste-supermarked', '/graensehandel-beregner', '/jul-paa-budget', '/mad-for-3000-om-maaneden', '/madbudget', '/madbudget-familie-paa-4', '/madpakker-paa-budget', '/madplan-efter-tilbud', '/spar-penge-paa-dagligvarer'].flatMap((path) => [
    { path, text: 'Danmarks første gebyrfrie energiselskab', why: 'Mad copy, kept as it is by Thor on 16 Nov 2026' },
    { path, text: 'til de bedste priser', why: 'Mad copy, kept as it is by Thor on 16 Nov 2026' },
  ]),
]

/** Figures a page sets itself, not taken from a source: its own question and the sums from it. */
const OWN_FIGURES: Record<string, { figures: string[]; why: string }> = {
  '/mad-for-3000-om-maaneden': {
    figures: ['3.000', '692', '4.000', '5.000'],
    why: 'The page asks whether a family can eat for 3.000 kr. a month (692 kr. a week) and how to get from 5.000 to 4.000 kr.',
  },
}

/** Ways a paragraph names a source without its full publisher name. */
const ALIASES: Record<string, string[]> = {
  'Altid Mad': ['Altid Mads', 'vores analyse', 'Vores analyse', 'vores sammenligning', 'Vi sammenlignede', 'vores pristjek', 'Pristjekket'],
  'Forbrugerrådet Tænk': ['Tænk'],
  'Danmarks Statistik': ['Forbrugsundersøgelsen', 'forbrugerpris'],
  'Det Kriminalpræventive Råd': ['DKR'],
  'Konkurrence- og Forbrugerstyrelsen': ['Konkurrencerådet', 'KFST'],
  'Den Europæiske Union, Dit Europa': ['EU'],
  'billigsteabonnement.dk': ['sammenligningssiden'],
  Skattestyrelsen: ['Skat'],
}

const FIGURE = /\d[\d.,]*\s?(kr\.?|kroner|%|procent|pct\.|kWh|øre|GB|Mbit)/
const FIGURES = /\d[\d.,]*\d|\d/g
// Only what the guide writes itself is checked for sources: not the drawn examples and tools,
// the store buttons, the Læs også cards, the end panel or the JSON-LD (it repeats the questions).
const NOT_ARTICLE = 'figure, .gd-sources, .gd-stores, .gd-related, .gd-cta, .gd-app, script'
// Markedsføringsloven reads everything a visitor sees, the drawn examples and the end panel included.
const NOT_SEEN = '.gd-sources, .gd-related, script'

/** Amounts and percentages in the Altid Mad report (/madrapport), and our sums from it. */
const MAD_REPORT_AMOUNTS = ['11.207', '27.624', '37.135', '531,24', '599,81', '782,70', '998,21', '1.313,94', '3.392', '5.694']
const MAD_REPORT_PERCENTS = ['40,4', '54,4', '67,9']
const SAVING = /\b(spar\w*|besparelse\w*|hente\s+\S+\s+hjem)/gi
// A kroner amount, not a unit price: "17,39 kr. pr. liter" is a price, not a saving.
const AMOUNT = /(\d[\d.]*(?:,\d+)?)\s?(?:mio\.\s?)?(?:kr\.(?!\s?pr\.)|kroner(?!\s?pr\.)|kr(?![.\w]))/g
const PERCENT = /(\d[\d,]*)\s?(?:%|pct\.|procent)/g
const SUPERLATIVE = /\b(første|først|eneste|bedste|bedst|billigste|billigst|største|størst|førende|laveste|lavest|nr\.\s?1|nummer (?:et|ét|1)|mest populære)\b/i
// Superlatives that describe the data, not the product: "the cheapest hour" in the price chart.
const DESCRIPTIVE = /\b(billigste|dyreste|laveste) (time|timer|tidspunkt|kurv|kæde|butik)\w*|hvor \S+ er billigst/gi
const ABOUT_US = /\bAltid(?: Hjem| Mad| Energi)?\b|\b(?:[Aa]ppen|[Vv]ores app|[Tt]eamet|[Hh]oldet)\b/
// Naming our own analysis as the source of a finding about the shops is not a claim about us.
const OUR_ANALYSIS = /Altid Mads? (analyse|pristjek)|Altid Mad-rapporten/g
const PROMISE = /(\bsnart\b|\bpå vej\b|senere i år|\bvil (?:snart )?kunne\b|kommer til at kunne|\blanceres?\b|\blancerer\b)/i
const ILLUSTRATION = 'Illustration, ikke et skærmbillede fra appen.'
const ABBREVIATIONS = /\b(bl\.a|ca|kr|pct|f\.eks|fx|nr|jf|evt|inkl|ekskl|mio|mia|stk)\./gi

/** An element's text with its parts kept apart ("2024" and "21.227" in the answer card). */
function textOf(el: Element) {
  const parts: string[] = []
  const walk = (n: Node) => (n.nodeType === 3 ? parts.push(n.textContent!) : n.childNodes.forEach(walk))
  walk(el)
  return parts.join(' ').replace(/\s+/g, ' ').trim()
}

function sentences(text: string) {
  return text
    .replace(ABBREVIATIONS, (m) => m.replace(/\./g, '\u0000'))
    .split(/(?<=[.!?])\s+(?=[A-ZÆØÅ0-9"«])/)
    .map((s) => s.replace(/\u0000/g, '.'))
}

describe.each(GUIDE_PATHS)('%s', (path) => {
  let page: HTMLElement
  let meta: Metadata

  beforeAll(async () => {
    const load = PAGES[`../app${path}/page.tsx`]
    if (!load) throw new Error(`No page file for ${path}`)
    const mod = (await load()) as { default: () => ReactElement | Promise<ReactElement>; metadata: Metadata }
    meta = mod.metadata
    page = render(await mod.default()).container
  })
  afterAll(cleanup)

  const allowedHere = ALLOWED.filter((a) => a.path === path)
  /** The text without the sentences ALLOWED excuses on this page. */
  const unexcused = (text: string) =>
    sentences(text)
      .filter((s) => !allowedHere.some((a) => s.includes(a.text)))
      .join(' ')
  const kilderEntries = () => [...page.querySelectorAll('.gd-sources li')].map((li) => li.textContent!)
  const sourceNames = () =>
    kilderEntries().flatMap((entry) => {
      const publisher = entry.split(':')[0].trim()
      return [publisher, ...(ALIASES[publisher] ?? [])]
    })
  /** An outside link or the Altid Mad report; a link to another guide is not a source. */
  const isSourceLink = (a: Element) => a.matches('a[href]') && (/^https?:/.test(a.getAttribute('href')!) || a.getAttribute('href') === MAD_REPORT_HREF)
  const sources = (el: Element | null | undefined): boolean =>
    !!el && ([el, ...el.querySelectorAll('a[href]')].some(isSourceLink) || sourceNames().some((n) => n && el.textContent!.includes(n)))
  /** The paragraph or list just before an element, the only neighbour that may carry its source. */
  const textBefore = (el: Element) => {
    const prev = (el.tagName === 'LI' ? el.parentElement : el)?.previousElementSibling
    return prev && ['P', 'UL', 'OL'].includes(prev.tagName) ? prev : null
  }

  it('has the recipe parts: Kilder, three related guides, Article, BreadcrumbList and FAQPage data', () => {
    expect(page.querySelectorAll('.gd-sources a[href^="http"]').length, 'Kilder').toBeGreaterThan(0)
    expect(page.querySelectorAll('.gd-related a[href^="/"]').length, 'Læs også').toBe(3)
    const types = [...page.querySelectorAll('script[type="application/ld+json"]')].flatMap((s) => [JSON.parse(s.innerHTML)].flat().map((d) => d['@type']))
    expect(types).toEqual(expect.arrayContaining(['Article', 'BreadcrumbList', 'FAQPage']))
  })

  it('still has every sentence its ALLOWED entries excuse', () => {
    const text = page.textContent!
    expect(allowedHere.filter((a) => !text.includes(a.text)).map((a) => a.text)).toEqual([])
  })

  it('lists every outside link in the text in Kilder', () => {
    const clean = (href: string) => href.replace(/#.*$/, '').replace(/\/$/, '')
    const kilder = new Set([...page.querySelectorAll('.gd-sources a[href]')].map((a) => clean(a.getAttribute('href')!)))
    const linked = [...page.querySelectorAll('a[href^="http"]')].filter((a) => !a.closest(NOT_ARTICLE)).map((a) => clean(a.getAttribute('href')!))
    expect([...new Set(linked)].filter((href) => !kilder.has(href))).toEqual([])
  })

  it('links or names a source for every figure', () => {
    const unsourced: string[] = []
    const own = new Set(OWN_FIGURES[path]?.figures)
    const citesReport = kilderEntries().some((e) => e.startsWith('Altid Mad'))
    const sourcedFigures = new Set<string>([...own, ...(citesReport ? [...MAD_REPORT_AMOUNTS, ...MAD_REPORT_PERCENTS] : [])])
    // Only the figures the page sets itself excuse a paragraph, never a figure seen elsewhere.
    const ownOnly = (text: string) => [...text.matchAll(new RegExp(FIGURE, 'g'))].every((m) => own.has(m[0].match(FIGURES)![0]))
    const body = [...page.querySelectorAll('.gd-body section')].filter((s) => !s.closest(NOT_ARTICLE) && !s.matches('.gd-faq-sec, .gd-factors'))
    for (const section of body) {
      // A worked example is our own sum with its assumptions listed (recipe part 9).
      if (/^Regneeksempel/.test(section.querySelector('h2')?.textContent ?? '')) continue
      for (const block of section.querySelectorAll('p, li')) {
        if (block.closest(NOT_ARTICLE)) continue
        const text = unexcused(block.textContent!)
        if (!FIGURE.test(text) || ownOnly(text)) continue
        if (sources(block) || sources(textBefore(block))) for (const f of text.match(FIGURES) ?? []) sourcedFigures.add(f)
        else unsourced.push(text.slice(0, 120))
      }
    }
    // The other places a figure can stand: sourced on the spot, or a repeat of a sourced figure.
    const elsewhere = [...page.querySelectorAll('.gd-lead, .gd-answer, .gd-factors li, .gd-faq details, td, th, .gd-body h2, .gd-body h3')].filter((el) => !el.closest(NOT_ARTICLE))
    const loose = (text: string) => [...text.matchAll(new RegExp(FIGURE, 'g'))].map((m) => m[0].match(FIGURES)![0]).filter((f) => !sourcedFigures.has(f))
    // Sentence by sentence: a sentence names its source, or each of its figures is one the
    // article sources (a heading counts the paragraph under it, a table cell its caption or the
    // paragraph before the table).
    for (const el of elsewhere) {
      const table = el.closest('.gd-table')
      const covered = sources(table?.querySelector('caption')) || (table && sources(textBefore(table))) || (/^H[23]$/.test(el.tagName) && sources(el.nextElementSibling))
      const list = sentences(unexcused(textOf(el)))
      for (const [i, sentence] of list.entries()) {
        if (!FIGURE.test(sentence)) continue
        if (covered || [sentence, list[i - 1] ?? ''].some((t) => sourceNames().some((n) => n && t.includes(n)))) {
          for (const f of sentence.match(FIGURES) ?? []) sourcedFigures.add(f)
          continue
        }
        const figures = loose(sentence)
        if (figures.length) unsourced.push(`${figures.join(', ')} in: ${sentence.slice(0, 100)}`)
      }
    }
    const names = sourceNames()
    for (const [label, text] of [['title', String(meta.title ?? '')], ['description', meta.description ?? '']]) {
      if (names.some((n) => n && text.includes(n))) continue
      const figures = loose(unexcused(text))
      if (figures.length) unsourced.push(`${figures.join(', ')} in the ${label}: ${text.slice(0, 100)}`)
    }
    expect(unsourced).toEqual([])
  })

  it('says what every visual is: a real app screen, real data or a labelled example', () => {
    const publishers = kilderEntries().map((e) => e.split(':')[0].trim())
    for (const figure of page.querySelectorAll('figure')) {
      const caption = figure.querySelector('figcaption')?.textContent?.trim() ?? ''
      const appScreen = [...figure.querySelectorAll('img')].some((img) => decodeURIComponent(img.getAttribute('src') ?? '').includes('/site/app/'))
      if (appScreen) expect(caption, 'a real app screen').toMatch(/^I appen: /)
      else if (figure.getAttribute('data-kind') === 'data') {
        expect(caption, 'a chart of real figures').toMatch(/^Tal fra /)
        expect(publishers.some((p) => caption.slice('Tal fra '.length).startsWith(p)), `"${caption}" names a source in Kilder`).toBe(true)
      } else {
        expect(caption, 'a drawn example').toMatch(/^Eksempel: /)
        expect(caption).toContain(ILLUSTRATION)
      }
    }
  })

  it('makes no claim markedsføringsloven rules out', () => {
    const citesReport = kilderEntries().some((e) => e.startsWith('Altid Mad'))
    const problems: string[] = []
    const tags = 'p, li, h1, h2, h3, figcaption, td, th, summary'
    const seen = [...page.querySelectorAll(`${tags}, .gd-answer-value, .gd-figure-art, .gd-cta`)]
      .filter((el) => !el.closest(NOT_SEEN))
      // Read text where it stands: a block that holds paragraphs is read through them, not twice.
      .map((el) => (el.querySelector(tags) ? [...el.childNodes].filter((n) => n.nodeType === 3 || !(n as Element).matches?.(tags)).map((n) => n.textContent).join(' ') : el.textContent!))
      .concat(String(meta.title ?? '').replace(/ \| Altid Hjem$/, ''), meta.description ?? '')
    for (const block of seen) {
      for (const sentence of sentences(unexcused(block))) {
        for (const m of sentence.matchAll(SAVING)) {
          // "Spar" alone is also a supermarket chain in the report's list of 13 chains.
          if (m[0] === 'Spar' && /^\s*(,|·|og\b|$)/.test(sentence.slice(m.index! + 4))) continue
          const around = sentence.slice(Math.max(0, m.index! - 80), m.index! + m[0].length + 80)
          for (const a of around.matchAll(AMOUNT)) if (!citesReport || !MAD_REPORT_AMOUNTS.includes(a[1])) problems.push(`savings figure ${a[1]} kr.: ${sentence.slice(0, 100)}`)
          for (const p of around.matchAll(PERCENT)) if (!citesReport || !MAD_REPORT_PERCENTS.includes(p[1])) problems.push(`savings figure ${p[1]} %: ${sentence.slice(0, 100)}`)
        }
        const aboutUs = ABOUT_US.test(sentence.replace(OUR_ANALYSIS, ''))
        if (aboutUs && SUPERLATIVE.test(sentence.replace(DESCRIPTIVE, ''))) problems.push(`superlative: ${sentence.slice(0, 100)}`)
        if (aboutUs && PROMISE.test(sentence)) problems.push(`promised feature: ${sentence.slice(0, 100)}`)
      }
    }
    expect([...new Set(problems)]).toEqual([])
  })
})
