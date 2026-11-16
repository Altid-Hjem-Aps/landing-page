import { describe, expect, it, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import Footer from '@/components/Footer'
import SiteFooter from '@/components/site/SiteFooter'
import Blog from '@/components/sections/Blog'
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
  // Kontakt is in the nav on every page (NAV.links), so the footer has its facts, not a link.
  it('links to the legal pages Google Play requires to be reachable', () => {
    render(<SiteFooter />)
    expect(screen.getByRole('link', { name: 'Presse' })).toHaveAttribute('href', '/presse')
    expect(screen.getByRole('link', { name: 'Slet konto' })).toHaveAttribute('href', '/slet-konto')
    expect(screen.getByRole('link', { name: 'Privatlivspolitik' })).toHaveAttribute('href', '/privatlivspolitik')
    expect(screen.getByRole('button', { name: 'Cookieindstillinger' })).toBeInTheDocument()
  })

  // No guides in the footer (Thor 15/11): the front page's blog cards link every SEO page in the
  // sitemap instead, so Google still finds each one from the front page.
  it('leaves the guides to the front page’s blog cards, which link every SEO page in the sitemap', () => {
    render(<SiteFooter />)
    expect(screen.queryByRole('navigation', { name: 'Guides' })).toBeNull()
    const { container } = render(<Blog />)
    const linked = new Set(Array.from(container.querySelectorAll('a[href^="/"]')).map((a) => a.getAttribute('href')))
    const seoPages = sitemap()
      .map((entry) => new URL(entry.url).pathname)
      .filter((path) => !['/', '/presse', '/kontakt', '/privatlivspolitik', '/slet-konto'].includes(path))
    for (const page of seoPages) expect(linked).toContain(page)
  })

  // No list of the services (Thor 15/11: more air); the nav has them.
  it('has no list of the services, and the legal pages under Juridisk', () => {
    render(<SiteFooter />)
    expect(screen.queryByRole('navigation', { name: 'Altid Hjem' })).toBeNull()
    expect(screen.queryByRole('link', { name: 'Økonomi' })).toBeNull()
    const legal = within(screen.getByRole('navigation', { name: 'Juridisk' }))
    expect(legal.getByRole('link', { name: 'Privatlivspolitik' })).toHaveAttribute('href', '/privatlivspolitik')
    expect(legal.getByRole('link', { name: 'Slet konto' })).toHaveAttribute('href', '/slet-konto')
    expect(legal.getByRole('button', { name: 'Cookieindstillinger' })).toBeInTheDocument()
  })

  // Boozt's "Hent vores app" (Thor 15/11): the code on a computer, one button to the visitor's
  // own store on a phone (CSS picks the store), on the exact campaign URLs.
  it('has Hent appen with the QR code and the store button on the exact campaign URLs', () => {
    render(<SiteFooter />)
    const getApp = within(screen.getByRole('region', { name: 'Hent appen' }))
    expect(getApp.getByAltText('QR-kode til Altid Hjem i App Store og Google Play')).toHaveAttribute('src', '/site/qr/app-footer.svg')
    expect(getApp.getAllByRole('link', { name: 'Hent appen gratis' }).map((a) => a.getAttribute('href'))).toEqual([APP_STORE, PLAY])
  })

  it('has customer service: our address for the app and Altid Energi’s for the electricity bill', () => {
    render(<SiteFooter />)
    const service = within(screen.getByRole('region', { name: 'Kundeservice' }))
    expect(service.getByText('Spørgsmål til appen?')).toBeInTheDocument()
    expect(service.getByRole('link', { name: 'hej@altidhjem.dk' })).toHaveAttribute('href', 'mailto:hej@altidhjem.dk')
    expect(service.getByRole('link', { name: 'Altid Energi: 44 440 440' })).toHaveAttribute('href', 'tel:+4544440440')
    expect(service.queryByRole('link', { name: 'Kontakt' })).toBeNull()
  })

  it('names the company and the socials, each with its icon and its name', () => {
    render(<SiteFooter />)
    expect(screen.getByText('Altid Hjem ApS, CVR 45637476')).toBeInTheDocument()
    const social = within(screen.getByRole('navigation', { name: 'Social' }))
    for (const name of ['LinkedIn', 'Instagram', 'Facebook']) {
      const link = social.getByRole('link', { name })
      expect(link).toHaveTextContent(name)
      expect(link.querySelector('svg')).not.toBeNull()
    }
  })
})
