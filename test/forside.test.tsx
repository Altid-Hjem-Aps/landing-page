import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, within } from '@testing-library/react'
import Footer from '@/components/Footer'
import BottomCta from '@/components/sections/BottomCta'
import Faq from '@/components/sections/Faq'
import HowItWorks from '@/components/sections/HowItWorks'
import Services from '@/components/sections/Services'
import Testimonials from '@/components/sections/Testimonials'

// BottomCta and the footer are on the SEO pages. Faq, HowItWorks, Services and Testimonials
// are on no page since the new front page; they stay until Thor has accepted it.
// The new front page itself is test/site-home.test.tsx. Boundaries faked: the Amplitude SDK, the App Router and the
// browser APIs jsdom lacks. The phones are stubbed: they change in their own PR.
vi.mock('@amplitude/analytics-browser', () => ({ track: vi.fn() }))
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => '/',
}))
vi.mock('@/components/IPhoneMockup', () => ({ default: () => null }))
vi.mock('@/components/sections/why/EtHjemStage', () => ({ default: () => null }))

// Literal on purpose: ALT-894's campaign links, not built from lib/store-links.
const APP_STORE = 'https://apps.apple.com/dk/app/altid-hjem/id6794330094?pt=129212732&ct=ah_1_altidhjem_dk&mt=8'
const PLAY =
  'https://play.google.com/store/apps/details?id=dk.altidhjem.app&referrer=utm_source%3Daltidhjem_dk%26utm_campaign%3Dah_1_altidhjem_dk'

beforeEach(() => {
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  )
  window.matchMedia = vi.fn().mockReturnValue({
    matches: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
  }) as unknown as typeof window.matchMedia
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.clearAllMocks()
})

describe('the sections from the flip', () => {
  it('counts a pill click with a beacon and lets the navigation go ahead', async () => {
    const sendBeacon = vi.fn((url: string, data: Blob) => {
      void url
      void data
      return true
    })
    vi.stubGlobal('navigator', { ...navigator, sendBeacon })
    const { container } = render(<HowItWorks />)
    let prevented = true
    container.addEventListener('click', (e) => {
      prevented = e.defaultPrevented
      e.preventDefault()
    })
    fireEvent.click(screen.getByRole('link', { name: 'Hent i Google Play' }))
    expect(prevented).toBe(false)
    const [url, blob] = sendBeacon.mock.calls[0]
    expect(url).toBe('/api/forside/store-click')
    expect(JSON.parse(await blob.text())).toEqual({ store: 'play', position: 'how-it-works' })
  })

  it('has the newsletter under the bottom pills', () => {
    const { container } = render(<BottomCta anchor={false} />)
    expect(container.querySelector('#hent-appen')).toBeNull()
    expect(screen.getByRole('heading', { name: 'Hent Altid Hjem' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Få nyheder fra Altid Hjem' })).toBeInTheDocument()
    const pill = screen.getByRole('link', { name: 'Hent i App Store' })
    expect(pill).toHaveStyle({ color: '#fff' })
    const form = container.querySelector('form') as HTMLFormElement
    expect(pill.compareDocumentPosition(form) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })

  it('shows only the services that are in the app', () => {
    render(<Services />)
    for (const name of ['Altid Energi', 'Altid Forsikring', 'Altid Mad']) expect(screen.getByAltText(name)).toBeInTheDocument()
    for (const name of ['Altid Alarm', 'Altid Opladning', 'Altid Mobil']) expect(screen.queryByAltText(name)).toBeNull()
  })

  it('keeps the testimonials, without a list in the heading', () => {
    const { container } = render(<Testimonials />)
    expect(screen.getByText('Hør, hvad danskerne siger om Altid Hjem')).toBeInTheDocument()
    expect(container.textContent).toContain('Folkeskolelærer')
  })

  it('says the app is out, and promises no service that is not in it', () => {
    const { container } = render(<Faq />)
    expect(screen.getByRole('button', { name: 'Hvor kan jeg hente Altid Hjem?' })).toBeInTheDocument()
    const text = container.textContent ?? ''
    expect(text).toMatch(/ligger i App Store og Google Play/)
    expect(text).not.toMatch(/mobil|alarm|opladning|lanceres|snart|endnu/i)
  })

  it('SEO footer shows the icons of the services in the app only', () => {
    const { container } = render(<Footer />)
    const icons = Array.from(container.querySelectorAll('footer img')).map((i) => i.getAttribute('src'))
    expect(icons).toEqual(expect.arrayContaining(['/services/icon-strom.svg', '/services/icon-mad.svg', '/services/icon-forsikring.svg']))
    for (const gone of ['icon-alarm', 'icon-mobil', 'icon-opladning']) {
      expect(icons.some((s) => s?.includes(gone)), gone).toBe(false)
    }
  })
})

describe('the SEO pages\' closing section', () => {
  it('has the page\'s copy, the pills, the #hent-appen anchor and the newsletter', () => {
    const { container } = render(<BottomCta eyebrow="Linje" heading="Overskrift" subtitle="Sætning" />)
    const section = within(container.querySelector('#hent-appen') as HTMLElement)
    expect(section.getByRole('heading', { name: 'Overskrift' })).toBeInTheDocument()
    expect(section.getByText('Linje')).toBeInTheDocument()
    expect(section.getByText('Sætning')).toBeInTheDocument()
    expect(section.getByRole('link', { name: 'Hent i App Store' })).toHaveAttribute('href', APP_STORE)
    expect(section.getByRole('link', { name: 'Hent i Google Play' })).toHaveAttribute('href', PLAY)
    expect(container.querySelector('form')).not.toBeNull()
  })
})
