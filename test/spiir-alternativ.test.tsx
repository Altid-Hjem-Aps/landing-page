import { describe, expect, it, vi } from 'vitest'
import { render } from '@testing-library/react'
import SpiirAlternativ, { metadata } from '@/app/spiir-alternativ/page'

// Siden er en server-komponent; Nav/BottomCta/Footer er klient-komponenter
// med browser-side-effekter — her testes artiklens eget indhold og schema.
vi.mock('@/components/Nav', () => ({ default: () => null }))
vi.mock('@/components/sections/BottomCta', () => ({ default: () => null }))
vi.mock('@/components/Footer', () => ({ default: () => null }))

describe('/spiir-alternativ', () => {
  it('targets the Spiir searches in title and description', () => {
    expect(metadata.title).toContain('Spiir-alternativ')
    expect(metadata.description).toContain('Spiir')
  })

  it('emits valid FAQPage JSON-LD that matches the visible questions', () => {
    const { container } = render(<SpiirAlternativ />)
    const script = container.querySelector('script[type="application/ld+json"]')
    expect(script).not.toBeNull()

    // '<' er escapet som < i kilden — JSON.parse folder det tilbage.
    const schema = JSON.parse(script!.innerHTML)
    expect(schema['@type']).toBe('FAQPage')
    expect(schema.mainEntity).toHaveLength(5)

    // Google kræver at schema-spørgsmålene matcher det synlige indhold.
    const visibleQuestions = [...container.querySelectorAll('details h3')].map((h) => h.textContent)
    expect(schema.mainEntity.map((q: { name: string }) => q.name)).toEqual(visibleQuestions)
  })

  it('renders no raw "<" inside the JSON-LD payload (script breakout guard)', () => {
    const { container } = render(<SpiirAlternativ />)
    const script = container.querySelector('script[type="application/ld+json"]')
    expect(script!.innerHTML).not.toMatch(/<\/script/i)
  })
})
