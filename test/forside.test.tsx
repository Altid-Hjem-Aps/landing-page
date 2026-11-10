import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { consentSentences } from 'altid-consent'
import Home from '@/app/page'
import BottomCta from '@/components/sections/BottomCta'
import Faq from '@/components/sections/Faq'
import HowItWorks from '@/components/sections/HowItWorks'
import Services from '@/components/sections/Services'
import Testimonials from '@/components/sections/Testimonials'

// The front page as it stands after the flip, rendered whole where it matters.
// Boundaries faked: the Amplitude SDK, the App Router, the Mux player and the
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

function allReadableText(root: HTMLElement): string {
  const attrs = Array.from(root.querySelectorAll('[alt],[aria-label],[title]')).flatMap((el) =>
    ['alt', 'aria-label', 'title'].map((a) => el.getAttribute(a) ?? ''),
  )
  return [root.textContent ?? '', ...attrs].join('\n')
}

describe('front page', () => {
  it('keeps every section of today\'s page, in today\'s order', () => {
    const { container } = render(<Home />)
    const headings = Array.from(container.querySelectorAll('h1,h2')).map((h) => h.textContent)
    expect(headings).toEqual([
      'Hele hjemmets økonomi i én app',
      expect.stringContaining('Der er gebyrer overalt'),
      'Hvad finder du i appen?',
      'Ét hjem. Alt for mange regninger.',
      'Fire trin til fuldt overblik',
      'Fair, gennemsigtigt og billigt',
      'Ofte stillede spørgsmål',
      'Læs mere om, hvordan Altid Hjem skaber ro i hverdagen',
      'Hent Altid Hjem',
    ])
  })

  it('has the store pills in the hero, founder, how-it-works and bottom sections, with the exact links', () => {
    const { container } = render(<Home />)
    const appStore = within(container).getAllByRole('link', { name: 'Hent i App Store' })
    const play = within(container).getAllByRole('link', { name: 'Hent i Google Play' })
    expect(appStore).toHaveLength(4)
    expect(play).toHaveLength(4)
    appStore.forEach((a) => expect(a).toHaveAttribute('href', APP_STORE))
    play.forEach((a) => expect(a).toHaveAttribute('href', PLAY))
    // The one target of "Hent appen" is the hero's pills.
    const anchors = container.querySelectorAll('#hent-appen')
    expect(anchors).toHaveLength(1)
    expect(within(anchors[0] as HTMLElement).getByRole('link', { name: 'Hent i App Store' })).toBeInTheDocument()
    expect(container.querySelector('#top')?.contains(anchors[0])).toBe(true)
  })

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

  it('has no dashes, launch wording or waitlist copy, and one form', () => {
    const { container } = render(<Home />)
    // The newsletter box quotes the decided consent sentence word for word, and
    // that sentence names Altid Mobil as a sender.
    const text = allReadableText(container).replace(consentSentences('hjem').all, '')
    for (const banned of ['–', '—', 'venteliste', 'én regning', 'Kommer snart', 'Snart', 'Altid Alarm', 'Altid Opladning', 'Altid Mobil']) {
      expect(text, `"${banned}" on the page`).not.toContain(banned)
    }
    expect(container.querySelectorAll('form')).toHaveLength(1)
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

  it('footer shows the icons of the services in the app only', () => {
    const { container } = render(<Home />)
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
