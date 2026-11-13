import { describe, expect, it, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import Footer from '@/components/Footer'
import SiteFooter from '@/components/site/SiteFooter'
import sitemap from '@/app/sitemap'

vi.mock('@/components/Logo', () => ({ Logo: () => null }))

// Literal on purpose, not built from lib/store-links.
const APP_STORE = 'https://apps.apple.com/dk/app/altid-hjem/id6794330094?pt=129212732&ct=ah_1_altidhjem_dk&mt=8'
const PLAY =
  'https://play.google.com/store/apps/details?id=dk.altidhjem.app&referrer=utm_source%3Daltidhjem_dk%26utm_campaign%3Dah_1_altidhjem_dk'

describe('SEO pages footer', () => {
  it('links to support and the legal pages Google Play requires to be reachable', () => {
    render(<Footer />)
    // The footer renders the link run twice (desktop inline + mobile stacked),
    // so each link appears in both blocks: assert every instance.
    const expectAll = (name: string, href: string) => {
      const links = screen.getAllByRole('link', { name })
      expect(links.length).toBeGreaterThan(0)
      links.forEach((l) => expect(l).toHaveAttribute('href', href))
    }
    expectAll('Support', '/kontakt')
    expectAll('Privatlivspolitik', '/privatlivspolitik')
    expectAll('Slet konto', '/slet-konto')
  })
})

describe('front page footer', () => {
  it('links to contact and the legal pages Google Play requires to be reachable', () => {
    render(<SiteFooter />)
    expect(screen.getByRole('link', { name: 'Kontakt' })).toHaveAttribute('href', '/kontakt')
    expect(screen.getByRole('link', { name: 'Presse' })).toHaveAttribute('href', '/presse')
    expect(screen.getByRole('link', { name: 'Slet konto' })).toHaveAttribute('href', '/slet-konto')
    expect(screen.getByRole('link', { name: 'Privatlivspolitik' })).toHaveAttribute('href', '/privatlivspolitik')
    expect(screen.getByRole('button', { name: 'Cookieindstillinger' })).toBeInTheDocument()
  })

  it('lists every SEO page in the sitemap, so the old Blog links have somewhere to go', () => {
    render(<SiteFooter />)
    const more = within(screen.getByRole('navigation', { name: 'Læs mere' }))
    const linked = more.getAllByRole('link').map((a) => a.getAttribute('href'))
    // The press page is in the sitemap but sits under Hjælp, next to Kontakt (FOOTER.help).
    const seoPages = sitemap()
      .map((entry) => new URL(entry.url).pathname)
      .filter((path) => !['/', '/presse', '/kontakt', '/privatlivspolitik', '/slet-konto'].includes(path))
    expect(linked.sort()).toEqual(seoPages.sort())
  })

  it('has the four services as anchors and the two store links on the exact campaign URLs', () => {
    render(<SiteFooter />)
    const app = within(screen.getByRole('navigation', { name: 'Appen' }))
    expect(app.getAllByRole('link').map((a) => [a.textContent, a.getAttribute('href')])).toEqual([
      ['Økonomi', '#okonomi'],
      ['Mad', '#mad'],
      ['Energi', '#energi'],
      ['Forsikring', '#forsikring'],
      ['App Store', APP_STORE],
      ['Google Play', PLAY],
    ])
  })

  it('names the company and the socials', () => {
    render(<SiteFooter />)
    expect(screen.getByText('Altid Hjem ApS, CVR 45637476')).toBeInTheDocument()
    for (const name of ['LinkedIn', 'Instagram', 'Facebook']) {
      expect(screen.getAllByRole('link', { name }).length).toBeGreaterThan(0)
    }
  })
})
