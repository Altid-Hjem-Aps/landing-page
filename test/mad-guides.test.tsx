import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it, vi } from 'vitest'
import { render } from '@testing-library/react'
import type { Metadata } from 'next'
import { MAD_GUIDE_CTA, MAD_REPORT_HREF } from '@/components/mad/madGuide'

// The nine Altid Mad guides that moved from altidmad.dk on 16 Nov 2026 at the same paths, so
// altidmad.dk's 301s land on them (altid-mad-site lib/retire.ts). Same smoke checks as
// tjenester-pages.test.tsx, plus what the move must keep true: no waitlist left, the price-check
// figures point at the report, and every guide is linked from the front page's blog cards.
vi.mock('@/components/site/SiteNav', () => ({ default: () => null }))
vi.mock('@/components/site/SiteFooter', () => ({ default: () => null }))
vi.mock('@/components/site/Reveal', () => ({ default: () => null }))
vi.mock('@/components/site/GuideOfferPopup', () => ({ default: () => null }))

import Madbudget, { metadata as madbudgetMeta } from '@/app/madbudget/page'
import BilligsteSupermarked, { metadata as supermarkedMeta } from '@/app/billigste-supermarked/page'
import MadbudgetFamiliePaa4, { metadata as familieMeta } from '@/app/madbudget-familie-paa-4/page'
import MadFor3000, { metadata as tretusindMeta } from '@/app/mad-for-3000-om-maaneden/page'
import MadplanEfterTilbud, { metadata as madplanMeta } from '@/app/madplan-efter-tilbud/page'
import MadpakkerPaaBudget, { metadata as madpakkerMeta } from '@/app/madpakker-paa-budget/page'
import SparPengePaaDagligvarer, { metadata as sparMeta } from '@/app/spar-penge-paa-dagligvarer/page'
import GraensehandelBeregner, { metadata as graenseMeta } from '@/app/graensehandel-beregner/page'
import JulPaaBudget, { metadata as julMeta } from '@/app/jul-paa-budget/page'

// [route, page, metadata, H1 as on altidmad.dk]
const PAGES: [string, React.ComponentType, Metadata, string][] = [
  ['/madbudget', Madbudget, madbudgetMeta, 'Hvad er et normalt madbudget for en familie?'],
  ['/billigste-supermarked', BilligsteSupermarked, supermarkedMeta, 'Hvilket supermarked er billigst?'],
  ['/madbudget-familie-paa-4', MadbudgetFamiliePaa4, familieMeta, 'Hvad koster mad til en familie på 4?'],
  ['/mad-for-3000-om-maaneden', MadFor3000, tretusindMeta, 'Kan en familie få mad for 3.000 kr. om måneden?'],
  ['/madplan-efter-tilbud', MadplanEfterTilbud, madplanMeta, 'Sådan laver du en madplan efter ugens tilbud'],
  ['/madpakker-paa-budget', MadpakkerPaaBudget, madpakkerMeta, 'Madpakker på budget, som børnene har lyst til at spise'],
  ['/spar-penge-paa-dagligvarer', SparPengePaaDagligvarer, sparMeta, 'Sådan sparer du penge på dagligvarer'],
  ['/graensehandel-beregner', GraensehandelBeregner, graenseMeta, 'Kan grænsehandel betale sig?'],
  ['/jul-paa-budget', JulPaaBudget, julMeta, 'Jul på budget uden at spare på hyggen'],
]

// Words of the closed waitlist and of the time before the app launched.
const STALE = /venteliste|ikke lanceret|åbner dørene|kommende dansk app|bliver en dansk app|Indtil da|madbudget-beregner|beregner til madbudgettet/i

describe.each(PAGES)('%s', (route, Page, metadata, h1) => {
  it('keeps its altidmad.dk path, with a www canonical', () => {
    expect(metadata.alternates?.canonical).toBe(`https://www.altidhjem.dk${route}`)
    expect((metadata.openGraph as { url?: string } | undefined)?.url).toBe(`https://www.altidhjem.dk${route}`)
    expect(String(metadata.title)).toMatch(/ \| Altid Hjem$/)
    expect(String(metadata.title)).not.toMatch(/Altid Mad$/)
  })

  it('has the H1 it had on altidmad.dk', () => {
    const { container } = render(<Page />)
    expect(container.querySelector('h1')?.textContent).toBe(h1)
  })

  it('emits valid FAQPage JSON-LD matching the visible questions, with the breakout guard', () => {
    const { container } = render(<Page />)
    const script = container.querySelector('script[type="application/ld+json"]')
    expect(script).not.toBeNull()
    expect(script!.innerHTML).not.toMatch(/<\/script/i)
    const schema = JSON.parse(script!.innerHTML)
    expect(schema['@type']).toBe('FAQPage')
    const visible = Array.from(container.querySelectorAll('details summary h3')).map((h) => h.textContent)
    expect(schema.mainEntity.map((q: { name: string }) => q.name)).toEqual(visible)
    expect(visible.length).toBeGreaterThanOrEqual(4)
  })

  it('has no waitlist left, in the text, the description or a link', () => {
    const { container } = render(<Page />)
    expect(container.textContent).not.toMatch(STALE)
    expect(String(metadata.description)).not.toMatch(STALE)
    expect(container.querySelector('a[href*="venteliste"]')).toBeNull()
    expect(container.querySelector('a[href*="altidmad.dk"]')).toBeNull()
  })

  it('ends on the Altid Mad app call to action', () => {
    const { getByText } = render(<Page />)
    expect(getByText(MAD_GUIDE_CTA.heading)).toBeInTheDocument()
  })

  it('links each price-check yearly figure it states to the report', () => {
    const { container } = render(<Page />)
    for (const figure of ['27.624', '37.135']) {
      if (!container.querySelector('article')?.textContent?.includes(figure)) continue
      const linked = Array.from(container.querySelectorAll(`a[href="${MAD_REPORT_HREF}"]`)).some((a) => a.textContent?.includes(figure))
      expect(linked, `${figure} kr. on ${route} links to ${MAD_REPORT_HREF}`).toBe(true)
    }
  })
})

describe('the merged /beregn-dit-madbudget', () => {
  it('has no page of its own (altidmad.dk sends it to /madbudget)', () => {
    expect(fs.existsSync(path.join(process.cwd(), 'app', 'beregn-dit-madbudget'))).toBe(false)
  })

  it('leaves the "familie på 4" and "3.000 kr." questions to their own guides, and links them', () => {
    const { container } = render(<Madbudget />)
    const questions = Array.from(container.querySelectorAll('details summary h3')).map((h) => h.textContent)
    expect(questions).not.toContain('Hvad er et normalt madbudget for en familie på 4?')
    expect(questions).not.toContain('Er 3.000 kr. om måneden nok til mad?')
    expect(container.querySelector('a[href="/madbudget-familie-paa-4"]')).not.toBeNull()
    expect(container.querySelector('a[href="/mad-for-3000-om-maaneden"]')).not.toBeNull()
  })
})

describe('internal links', () => {
  it('point only at pages this site has', () => {
    for (const [route, Page] of PAGES) {
      const { container } = render(<Page />)
      for (const a of Array.from(container.querySelectorAll('a[href^="/"]'))) {
        const href = a.getAttribute('href')!.split(/[?#]/)[0]
        if (href === MAD_REPORT_HREF || href === '/') continue
        const seg = href.replace(/^\/+|\/+$/g, '')
        expect(fs.existsSync(path.join(process.cwd(), 'app', seg, 'page.tsx')), `${route} links ${href}`).toBe(true)
      }
    }
  })
})

describe('the front page blog section', () => {
  it('links every Mad guide, so each keeps a link from the front page as it had on altidmad.dk', async () => {
    const { default: Blog } = await import('@/components/sections/Blog')
    const { container } = render(<Blog />)
    const linked = new Set(Array.from(container.querySelectorAll('a[href^="/"]')).map((a) => a.getAttribute('href')))
    for (const [route] of PAGES) expect(linked, route).toContain(route)
  })
})

// altidmad.dk and altidforsikring.dk 301 each of these paths to the same path here (their
// lib/retire.ts). A missing page would turn a ranking page into a permanent redirect to a 404.
describe('every address the retired sites send here', () => {
  it('has a page on this site', () => {
    const fromMad = PAGES.map(([route]) => route).concat(['/presse', '/kontakt', '/privatlivspolitik', '/slet-konto', '/inviter'])
    const fromForsikring = ['/kontakt', '/privatlivspolitik', '/slet-konto', '/inviter']
    const moved = ['/hvornar-er-strommen-billigst'] // both sites' old /elpriser rule
    for (const route of [...fromMad, ...fromForsikring, ...moved]) {
      expect(fs.existsSync(path.join(process.cwd(), 'app', route.slice(1), 'page.tsx')), route).toBe(true)
    }
  })
})
