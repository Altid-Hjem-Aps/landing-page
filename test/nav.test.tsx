import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, fireEvent, render, screen } from '@testing-library/react'
import * as amplitude from '@amplitude/analytics-browser'
import Nav from '@/components/Nav'

// Amplitude is a browser SDK with network side effects: mock it.
vi.mock('@amplitude/analytics-browser', () => ({ track: vi.fn() }))
vi.mock('@/components/Logo', () => ({ Logo: () => null }))

// Nav navigates via the App Router off the front page: capture push calls.
// usePathname follows the stubbed window.location.
const push = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
  usePathname: () => window.location.pathname,
}))

const realLocation = window.location

// jsdom's window.location throws "Not implemented: navigation" on href
// assignment: replace it with a plain object so the test can observe paths.
function stubLocation(pathname: string) {
  Object.defineProperty(window, 'location', {
    configurable: true,
    writable: true,
    value: { pathname, href: `https://altidhjem.dk${pathname}`, hash: '' } as unknown as Location,
  })
}

beforeEach(() => {
  // jsdom does not implement matchMedia, which Nav's scroll effect reads.
  window.matchMedia = vi.fn().mockReturnValue({ matches: false }) as unknown as typeof window.matchMedia
})

afterEach(() => {
  Object.defineProperty(window, 'location', {
    configurable: true,
    writable: true,
    value: realLocation,
  })
  vi.clearAllMocks()
})

const SECTIONS = [
  ['Økonomi', 'okonomi'],
  ['Altid Mad', 'altid-mad'],
  ['Altid Energi', 'altid-energi'],
  ['Altid Forsikring', 'altid-forsikring'],
] as const

function expectHrefs(name: string, href: string) {
  const links = screen.getAllByRole('link', { name })
  expect(links.length).toBeGreaterThan(0)
  for (const link of links) expect(link).toHaveAttribute('href', href)
}

describe('Nav links', () => {
  it('on the front page: section links and Hent appen stay in the document', () => {
    stubLocation('/')
    render(<Nav />)
    // Open the burger so the panel's links are checked too.
    fireEvent.click(screen.getByRole('button', { name: 'Åbn menu' }))
    for (const [label, id] of SECTIONS) expectHrefs(label, `#${id}`)
    // Desktop CTA, phone pill and the panel's button.
    expect(screen.getAllByRole('link', { name: 'Hent appen' })).toHaveLength(3)
    expectHrefs('Hent appen', '#hent-appen')
  })

  it('on another page: section links and Hent appen lead to the front page', () => {
    stubLocation('/billigste-elselskab')
    render(<Nav />)
    fireEvent.click(screen.getByRole('button', { name: 'Åbn menu' }))
    for (const [label, id] of SECTIONS) expectHrefs(label, `/#${id}`)
    expectHrefs('Hent appen', '/#hent-appen')
  })

  it('tracks the phone pill as its own Hent appen source', () => {
    stubLocation('/')
    render(<Nav />)
    // [1] is the phone pill ([0] the desktop CTA).
    fireEvent.click(screen.getAllByRole('link', { name: 'Hent appen' })[1])
    expect(amplitude.track).toHaveBeenCalledWith('Get App CTA Clicked', { source: 'nav-pill' })
  })

  it('closes the burger menu when the phone pill is tapped', () => {
    stubLocation('/')
    render(<Nav />)
    fireEvent.click(screen.getByRole('button', { name: 'Åbn menu' }))
    fireEvent.click(screen.getAllByRole('link', { name: 'Hent appen' })[1])
    expect(screen.getByRole('button', { name: 'Åbn menu' })).toHaveAttribute('aria-expanded', 'false')
  })

  it('closes the burger menu after a section link is clicked', () => {
    stubLocation('/')
    render(<Nav />)
    fireEvent.click(screen.getByRole('button', { name: 'Åbn menu' }))
    expect(screen.getByRole('button', { name: 'Luk menu' })).toHaveAttribute('aria-expanded', 'true')
    // [0] is the desktop menu, [1] the open panel.
    fireEvent.click(screen.getAllByRole('link', { name: 'Altid Energi' })[1])
    expect(screen.getByRole('button', { name: 'Åbn menu' })).toHaveAttribute('aria-expanded', 'false')
  })
})

describe('Nav after an anchor jump', () => {
  function scrollTo(y: number) {
    Object.defineProperty(window, 'scrollY', { configurable: true, writable: true, value: y })
    act(() => {
      window.dispatchEvent(new Event('scroll'))
    })
  }
  // The nav hides by moving itself up out of view.
  const navHidden = () => screen.getByRole('navigation').style.transform === 'translateY(-100%)'

  beforeEach(() => {
    vi.useFakeTimers()
    Object.defineProperty(window, 'scrollY', { configurable: true, writable: true, value: 0 })
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('stays visible while a section link jumps down, and hides on normal scrolling after', () => {
    stubLocation('/')
    render(<Nav />)
    scrollTo(600)
    expect(navHidden()).toBe(true)

    act(() => {
      window.dispatchEvent(new HashChangeEvent('hashchange'))
    })
    expect(navHidden()).toBe(false)
    // The smooth scroll to the section keeps sending downward events.
    scrollTo(900)
    scrollTo(1400)
    expect(navHidden()).toBe(false)

    act(() => {
      vi.advanceTimersByTime(200)
    })
    scrollTo(1600)
    expect(navHidden()).toBe(true)
  })

  it('stays visible when the link to the section already in the URL is clicked again (no hashchange)', () => {
    stubLocation('/')
    render(<Nav />)
    scrollTo(600)
    expect(navHidden()).toBe(true)
    fireEvent.click(screen.getAllByRole('link', { name: 'Altid Mad' })[0])
    expect(navHidden()).toBe(false)
    scrollTo(1200)
    expect(navHidden()).toBe(false)
  })

  it('stays visible when the page is loaded with a hash and the browser jumps after mount', () => {
    stubLocation('/')
    window.location.hash = '#altid-forsikring'
    render(<Nav />)
    scrollTo(3500)
    expect(navHidden()).toBe(false)
  })
})

describe('Spiir banner', () => {
  it('is absent by default: the front page renders without campaign content', () => {
    stubLocation('/')
    render(<Nav />)
    expect(screen.queryByText(/Spiir/)).toBeNull()
    // The nav's only button is the burger toggle.
    expect(screen.getAllByRole('button')).toHaveLength(1)
  })


  it('renders above the nav when spiirBanner is set', () => {
    stubLocation('/spiir-alternativ')
    render(<Nav spiirBanner />)
    expect(screen.getByText(/Brugte du Spiir\?/)).toBeInTheDocument()
  })

  it('scrolls to the page\'s own store badges when it has them', () => {
    stubLocation('/spiir-alternativ')
    // /spiir-alternativ has the store badges in its BottomCta.
    const onPageBadges = document.createElement('div')
    onPageBadges.id = 'hent-appen'
    onPageBadges.scrollIntoView = vi.fn()
    document.body.appendChild(onPageBadges)

    render(<Nav spiirBanner />)
    fireEvent.click(screen.getByText(/Brugte du Spiir\?/).closest('button') as HTMLElement)

    expect(amplitude.track).toHaveBeenCalledWith('Get App CTA Clicked', { source: 'spiir-banner' })
    expect(onPageBadges.scrollIntoView).toHaveBeenCalled()
    // Crucially: NO navigation to the front page.
    expect(push).not.toHaveBeenCalled()

    onPageBadges.remove()
  })

  it('goes to the store badges on the front page if the page has none of its own', () => {
    stubLocation('/spiir-alternativ')
    render(<Nav spiirBanner />)
    fireEvent.click(screen.getByText(/Brugte du Spiir\?/).closest('button') as HTMLElement)

    expect(push).toHaveBeenCalledWith('/#hent-appen')
  })
})
