import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import ElprisAppMockup from '@/components/ElprisAppMockup'
import type { ElpriserData } from '@/lib/elpriser'

// Risk: the card shows today's real prices next to an example picture. A flipped
// condition would state an invented hour or percentage on an SEO page.

vi.mock('@/components/StoreBadges', () => ({ default: () => null }))

const hour = (h: number, dk2: number | null) => ({ hour: h, dk1: dk2, dk2, dk2Tax: 0, dk2Trans: 0, dk2Dist: 0 })
const data = (prices: (number | null)[]) => ({ hours: prices.map((p, h) => hour(h, p)) }) as unknown as ElpriserData

afterEach(cleanup)

describe('ElprisAppMockup', () => {
  it('names the cheapest hour and how much lower it is, from the real prices', () => {
    render(<ElprisAppMockup data={data([1, 4, 2])} />)
    expect(screen.getByText(/^Billigst kl\. 00-01, \d+ % lavere end kl\. 1\.$/)).toBeInTheDocument()
  })

  it.each([
    ['no data', null],
    ['no prices', data([null, null])],
    ['prices at or below zero', data([-5, -1])],
  ])('states no hour or percentage with %s', (_name, value) => {
    render(<ElprisAppMockup data={value} />)
    expect(screen.queryByText(/% lavere/)).toBeNull()
    expect(screen.getByText(/^Typisk billigst om natten/)).toBeInTheDocument()
  })

  it('keeps the live numbers out of the picture and says the picture is an example', () => {
    render(<ElprisAppMockup data={data([1, 4, 2])} />)
    expect(screen.getByRole('img', { name: /Altid Energi i appen/ })).toBeInTheDocument()
    expect(screen.getByText('Skærmbillede fra appen med eksempeldata.')).toBeInTheDocument()
  })
})
