import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import LegalPageLayout, { LegalAddress } from '@/components/LegalPageLayout'
import Kontakt from '@/app/kontakt/page'
import Privatlivspolitik from '@/app/privatlivspolitik/page'

// Nav is a client component with scroll listeners and Amplitude — irrelevant here.
vi.mock('@/components/Nav', () => ({ default: () => null }))

describe('LegalPageLayout', () => {
  it('renders title, entity line and the "Senest opdateret" line when given', () => {
    render(
      <LegalPageLayout title="Testside" meta="Altid Hjem ApS · CVR 45637476" updated="september 2026">
        <p>Indhold</p>
      </LegalPageLayout>,
    )
    expect(screen.getByRole('heading', { level: 1, name: 'Testside' })).toBeInTheDocument()
    expect(screen.getByText('Altid Hjem ApS · CVR 45637476')).toBeInTheDocument()
    expect(screen.getByText('Senest opdateret: september 2026')).toBeInTheDocument()
    expect(screen.getByText('Indhold')).toBeInTheDocument()
  })

  it('omits the "Senest opdateret" line when no date is given', () => {
    render(
      <LegalPageLayout title="Testside" meta="Altid Hjem ApS">
        <p>Indhold</p>
      </LegalPageLayout>,
    )
    expect(screen.queryByText(/Senest opdateret/)).not.toBeInTheDocument()
  })

  it('has a back link to the front page and the site footer', () => {
    render(
      <LegalPageLayout title="Testside" meta="Altid Hjem ApS">
        <p>Indhold</p>
      </LegalPageLayout>,
    )
    expect(screen.getByRole('link', { name: /Tilbage/ })).toHaveAttribute('href', '/')
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })

  it('renders the cream surface, not the dark one', () => {
    render(
      <LegalPageLayout title="Testside" meta="Altid Hjem ApS">
        <p>Indhold</p>
      </LegalPageLayout>,
    )
    expect(screen.getByRole('main')).toHaveStyle({ background: 'var(--cream)' })
  })
})

describe('LegalAddress', () => {
  it('renders the entity name and the address lines it is given', () => {
    render(
      <LegalAddress name="Datatilsynet">
        <p>Carl Jacobsens Vej 35, 2500 Valby</p>
      </LegalAddress>,
    )
    expect(screen.getByText('Datatilsynet')).toBeInTheDocument()
    expect(screen.getByText('Carl Jacobsens Vej 35, 2500 Valby')).toBeInTheDocument()
  })
})

describe('/kontakt', () => {
  it('has a primary mailto action and the FAQ', () => {
    render(<Kontakt />)
    expect(screen.getByRole('heading', { level: 1, name: 'Support' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Skriv til hej@altidhjem.dk' })).toHaveAttribute('href', 'mailto:hej@altidhjem.dk')
    expect(screen.getByRole('heading', { level: 2, name: 'Ofte stillede spørgsmål' })).toBeInTheDocument()
    expect(screen.getByText('Jeg kan ikke logge ind')).toBeInTheDocument()
  })
})

describe('/privatlivspolitik', () => {
  it('renders all ten numbered sections and the Datatilsynet complaint block', () => {
    render(<Privatlivspolitik />)
    const h2s = screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)
    expect(h2s).toHaveLength(10)
    expect(h2s[0]).toBe('1. Vi er den dataansvarlige')
    expect(h2s[9]).toBe('10. Ændringer')
    expect(screen.getByRole('link', { name: 'dt@datatilsynet.dk' })).toHaveAttribute('href', 'mailto:dt@datatilsynet.dk')
  })

  it('lists every GDPR right as a run-in label', () => {
    render(<Privatlivspolitik />)
    for (const right of ['Indsigt:', 'Berigtigelse:', 'Sletning:', 'Begrænsning:', 'Dataportabilitet:', 'Indsigelse:', 'Tilbagetrækning af samtykke:']) {
      expect(screen.getByText(right)).toBeInTheDocument()
    }
  })

  it('identifies Altid Hjem as data controller for Altid Forsikring', () => {
    render(<Privatlivspolitik />)
    expect(screen.getByText(/Altid Forsikring er en tjeneste under Altid Hjem ApS og ikke et selvstændigt selskab/)).toBeInTheDocument()
    expect(screen.queryByText(/Altid Mad og Altid Forsikring er selvstændige selskaber/)).not.toBeInTheDocument()
  })
})
