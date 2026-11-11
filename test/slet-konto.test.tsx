import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import SletKonto, { metadata } from '@/app/slet-konto/page'

// Nav is a client component with scroll listeners and Amplitude — irrelevant here.
vi.mock('@/components/Nav', () => ({ default: () => null }))

describe('/slet-konto', () => {
  it('renders the H1 and deletion instructions Google Play requires', () => {
    render(<SletKonto />)
    expect(screen.getByRole('heading', { level: 1, name: 'Slet din Altid Hjem-konto' })).toBeInTheDocument()
    // Email path with pre-filled subject
    const mailto = screen.getAllByRole('link').find((a) => a.getAttribute('href')?.startsWith('mailto:hej@altidhjem.dk?subject='))
    expect(mailto).toBeTruthy()
    expect(decodeURIComponent(mailto!.getAttribute('href')!)).toContain('Slet min konto')
  })

  // Risk: the page drifts from hej@'s answer 6, or promises a date or a later feature again.
  it('tells the same story as the support answer and promises no dates', () => {
    const { container } = render(<SletKonto />)
    const main = container.querySelector('main')!.textContent
    expect(screen.getByText('Profil → Slet konto')).toBeInTheDocument()
    expect(main).toContain('fjerner vi din konto og dine appdata')
    expect(main).toContain('bankdata også slettet hos Subaio')
    expect(main).toContain('elaftale hos Altid Energi fortsætter som før')
    expect(main).toContain('de næste 90 dage')
    expect(screen.getByRole('link', { name: 'hej@altidenergi.dk' })).toHaveAttribute('href', 'mailto:hej@altidenergi.dk')
    expect(main).not.toMatch(/\bsnart\b|arbejder på|inden for 30 dage|gennemføres først/i)
    expect(main).not.toMatch(/[–—]/)
  })

  it('links to the privacy policy for retention details', () => {
    render(<SletKonto />)
    expect(screen.getByRole('link', { name: 'privatlivspolitik' })).toHaveAttribute('href', '/privatlivspolitik')
  })

  it('shows the legal entity block (Altid Hjem ApS, CVR, address)', () => {
    render(<SletKonto />)
    expect(screen.getByText('CVR 45637476')).toBeInTheDocument()
    expect(screen.getByText('c/o Mad House HQ ApS')).toBeInTheDocument()
    expect(screen.getByText('Helsinkigade 29, 2150 Nordhavn')).toBeInTheDocument()
  })

  // NOTE: actual production indexability also depends on robots.txt and deploy
  // headers (e.g. Vercel preview noindex) — this only checks the page's own metadata.
  it('page metadata does not opt out of indexing', () => {
    expect(metadata.title).toBe('Slet din konto | Altid Hjem')
    expect(metadata.description).toBeTruthy()
    expect(metadata.robots).toBeUndefined()
  })
})
