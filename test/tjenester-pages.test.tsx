import { describe, expect, it, vi } from 'vitest'
import { render } from '@testing-library/react'
import type { Metadata } from 'next'

// The 9 tjeneste-cluster pages share one generated pattern; this smoke suite
// mirrors spiir-alternativ.test.tsx for each of them: page renders, canonical
// matches the route, FAQPage JSON-LD parses, matches the visible questions,
// and cannot break out of its script tag.
vi.mock('@/components/Nav', () => ({ default: () => null }))
vi.mock('@/components/sections/BottomCta', () => ({ default: () => null }))
vi.mock('@/components/Footer', () => ({ default: () => null }))

import BilligsteMobilabonnement, { metadata as mobilMeta } from '@/app/billigste-mobilabonnement/page'
import HvadKosterEnLadeboks, { metadata as ladeboksMeta } from '@/app/hvad-koster-en-ladeboks/page'
import HvadKosterEnTyverialarm, { metadata as alarmMeta } from '@/app/hvad-koster-en-tyverialarm/page'
import HvadKosterIndboforsikring, { metadata as indboMeta } from '@/app/hvad-koster-indboforsikring/page'
import BilligsteElselskab, { metadata as elselskabMeta } from '@/app/billigste-elselskab/page'
import OpsigAbonnementer, { metadata as opsigMeta } from '@/app/opsig-abonnementer/page'
import GennemsnitligtElforbrug, { metadata as elforbrugMeta } from '@/app/gennemsnitligt-elforbrug/page'
import BedsteBudgetApp, { metadata as budgetappMeta } from '@/app/bedste-budget-app/page'
import SkiftForsikringsselskab, { metadata as skiftMeta } from '@/app/skift-forsikringsselskab/page'

const PAGES: [string, React.ComponentType, Metadata][] = [
  ['/billigste-mobilabonnement', BilligsteMobilabonnement, mobilMeta],
  ['/hvad-koster-en-ladeboks', HvadKosterEnLadeboks, ladeboksMeta],
  ['/hvad-koster-en-tyverialarm', HvadKosterEnTyverialarm, alarmMeta],
  ['/hvad-koster-indboforsikring', HvadKosterIndboforsikring, indboMeta],
  ['/billigste-elselskab', BilligsteElselskab, elselskabMeta],
  ['/opsig-abonnementer', OpsigAbonnementer, opsigMeta],
  ['/gennemsnitligt-elforbrug', GennemsnitligtElforbrug, elforbrugMeta],
  ['/bedste-budget-app', BedsteBudgetApp, budgetappMeta],
  ['/skift-forsikringsselskab', SkiftForsikringsselskab, skiftMeta],
]

describe.each(PAGES)('%s', (route, Page, metadata) => {
  it('has a canonical matching its route', () => {
    expect(metadata.alternates?.canonical).toBe(`https://altidhjem.dk${route}`)
  })

  it('emits valid FAQPage JSON-LD matching the visible questions, with the breakout guard', () => {
    const { container } = render(<Page />)
    const script = container.querySelector('script[type="application/ld+json"]')
    expect(script).not.toBeNull()
    expect(script!.innerHTML).not.toMatch(/<\/script/i)

    const schema = JSON.parse(script!.innerHTML)
    expect(schema['@type']).toBe('FAQPage')
    expect(schema.mainEntity).toHaveLength(7)

    const visibleQuestions = [...container.querySelectorAll('details h3')].map((h) => h.textContent)
    expect(schema.mainEntity.map((q: { name: string }) => q.name)).toEqual(visibleQuestions)
  })

  it('renders without copy artifacts', () => {
    const { container } = render(<Page />)
    const text = container.textContent ?? ''
    expect(text).not.toContain('[LINK')
    expect(text).not.toContain('](')
    expect(text).not.toContain('én regning')
  })
})
