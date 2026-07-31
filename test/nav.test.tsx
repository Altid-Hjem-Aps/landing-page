import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import * as amplitude from '@amplitude/analytics-browser'
import Nav from '@/components/Nav'

// Amplitude is a browser SDK with network side effects — mock it.
vi.mock('@amplitude/analytics-browser', () => ({ track: vi.fn() }))
vi.mock('@/components/Logo', () => ({ Logo: () => null }))

// Nav navigates via the App Router off the front page — capture push calls.
// usePathname (active-link highlighting) follows the stubbed window.location.
const push = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
  usePathname: () => window.location.pathname,
}))

const realLocation = window.location

// jsdom's window.location throws "Not implemented: navigation" on href
// assignment — replace it with a plain object so the test can observe paths.
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

describe('Nav CTA', () => {
  it('on the front page: tracks the click and expands the waitlist form in place', () => {
    stubLocation('/')
    const expandListener = vi.fn()
    window.addEventListener('expand-waitlist', expandListener)

    render(<Nav />)
    fireEvent.click(screen.getByRole('button', { name: /ventelisten/i }))

    expect(amplitude.track).toHaveBeenCalledWith('Waitlist CTA Clicked', { source: 'nav' })
    expect(expandListener).toHaveBeenCalledTimes(1)
    // Stayed on the page — no navigation.
    expect(push).not.toHaveBeenCalled()

    window.removeEventListener('expand-waitlist', expandListener)
  })

  it('off the front page: client-navigates home with the auto-expand hash', () => {
    stubLocation('/slet-konto')
    const expandListener = vi.fn()
    window.addEventListener('expand-waitlist', expandListener)

    render(<Nav />)
    fireEvent.click(screen.getByRole('button', { name: /ventelisten/i }))

    expect(amplitude.track).toHaveBeenCalledWith('Waitlist CTA Clicked', { source: 'nav' })
    // router.push (not a full page load) so the tracked event isn't dropped,
    // with #venteliste so the hero form expands on arrival.
    expect(push).toHaveBeenCalledWith('/#venteliste')
    expect(expandListener).not.toHaveBeenCalled()

    window.removeEventListener('expand-waitlist', expandListener)
  })
})

describe('Nav active state', () => {
  const SIGNAL = 'rgb(144, 255, 124)'
  const MUTED = 'rgb(111, 106, 97)'
  const WHITE = 'rgb(255, 255, 255)'

  // Hjem is the current site on every altidhjem.dk page. Before this was
  // fixed it fell through to MUTED off the front page — the same grey as the
  // unlaunched services, so the site you were on looked disabled.
  it.each(['/', '/opsig-abonnementer', '/hvad-koster-en-tyverialarm', '/slet-konto'])(
    'renders Hjem as the selected item on %s',
    (path) => {
      stubLocation(path)
      render(<Nav />)
      const hjem = screen.getAllByRole('link', { name: 'Hjem' })[0]
      expect(hjem).toHaveStyle({ color: SIGNAL })
      // The marker dot is the other half of the active affordance — assert it
      // renders, so deleting it can't pass silently.
      const dot = hjem.parentElement?.querySelector('span[aria-hidden]')
      expect(dot).toBeTruthy()
      expect(dot).toHaveStyle({ background: SIGNAL })
    }
  )

  it('marks Hjem with aria-current: the page itself on /, the section elsewhere', () => {
    stubLocation('/')
    const { unmount } = render(<Nav />)
    expect(screen.getAllByRole('link', { name: 'Hjem' })[0]).toHaveAttribute('aria-current', 'page')
    unmount()

    stubLocation('/opsig-abonnementer')
    render(<Nav />)
    expect(screen.getAllByRole('link', { name: 'Hjem' })[0]).toHaveAttribute('aria-current', 'true')
  })

  it('keeps the other brands white and the unlaunched services muted off the front page', () => {
    stubLocation('/opsig-abonnementer')
    render(<Nav />)
    expect(screen.getAllByRole('link', { name: 'Mad' })[0]).toHaveStyle({ color: WHITE })
    expect(screen.getAllByRole('link', { name: 'Energi' })[0]).toHaveStyle({ color: WHITE })
    // "Kommer snart" services are not links and stay muted.
    expect(screen.queryAllByRole('link', { name: 'Alarm' })).toHaveLength(0)
    expect(screen.getAllByText('Alarm')[0]).toHaveStyle({ color: MUTED })
    expect(screen.getAllByRole('link', { name: 'Hjem' })[0]).not.toHaveAttribute('aria-current', 'page')
  })

  it('marks Hjem active in the burger menu too', () => {
    stubLocation('/opsig-abonnementer')
    render(<Nav />)
    fireEvent.click(screen.getByRole('button', { name: 'Åbn menu' }))
    const hjemLinks = screen.getAllByRole('link', { name: 'Hjem' })
    // desktop menu + open panel both render it; every instance is active
    expect(hjemLinks.length).toBeGreaterThan(1)
    for (const link of hjemLinks) {
      expect(link).toHaveStyle({ color: SIGNAL })
      expect(link).toHaveAttribute('aria-current', 'true')
    }
  })
})

describe('Spiir banner', () => {
  it('is ABSENT by default — the front page must render without campaign content', () => {
    stubLocation('/')
    render(<Nav />)
    expect(screen.queryByText(/Spiir/)).toBeNull()
    // Only the nav's own controls: the waitlist CTA and the burger toggle.
    expect(screen.getByRole('button', { name: /ventelisten/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Åbn menu' })).toBeInTheDocument()
    expect(screen.getAllByRole('button')).toHaveLength(2)
  })

  it('burger menu opens with the nav links and closes when a link is clicked', () => {
    stubLocation('/')
    render(<Nav />)
    const burger = screen.getByRole('button', { name: 'Åbn menu' })
    fireEvent.click(burger)
    expect(screen.getByRole('button', { name: 'Luk menu' })).toHaveAttribute('aria-expanded', 'true')
    // Panel + desktop menu both render the links; the panel adds a second set.
    // Mad and Energi are both live now; the remaining services stay inactive text.
    expect(screen.queryAllByRole('link', { name: 'Alarm' })).toHaveLength(0)
    expect(screen.getAllByRole('link', { name: 'Mad' }).length).toBeGreaterThan(1)
    expect(screen.getAllByRole('link', { name: 'Mad' })[0]).toHaveAttribute('href', 'https://altidmad.dk')
    expect(screen.getAllByRole('link', { name: 'Energi' }).length).toBeGreaterThan(1)
    fireEvent.click(screen.getAllByRole('link', { name: 'Energi' })[1])
    expect(screen.getByRole('button', { name: 'Åbn menu' })).toHaveAttribute('aria-expanded', 'false')
  })

  it('renders above the nav when spiirBanner is set', () => {
    stubLocation('/spiir-alternativ')
    render(<Nav spiirBanner />)
    expect(screen.getByText(/Brugte du Spiir\?/)).toBeInTheDocument()
  })

  it('scrolls to the on-page form when one exists, so the signup keeps its source tag', () => {
    stubLocation('/spiir-alternativ')
    // /spiir-alternativ has BottomCta's form on the page (id venteliste2).
    const onPageForm = document.createElement('div')
    onPageForm.id = 'venteliste2'
    onPageForm.scrollIntoView = vi.fn()
    document.body.appendChild(onPageForm)

    render(<Nav spiirBanner />)
    fireEvent.click(screen.getByText(/Brugte du Spiir\?/).closest('button') as HTMLElement)

    expect(amplitude.track).toHaveBeenCalledWith('Waitlist CTA Clicked', { source: 'spiir-banner' })
    expect(onPageForm.scrollIntoView).toHaveBeenCalled()
    // Crucially: NO navigation to the front page, whose form tags 'forside'.
    expect(push).not.toHaveBeenCalled()

    onPageForm.remove()
  })

  it('falls back to navigating home if the page has no form of its own', () => {
    stubLocation('/spiir-alternativ')
    render(<Nav spiirBanner />)
    fireEvent.click(screen.getByText(/Brugte du Spiir\?/).closest('button') as HTMLElement)

    expect(push).toHaveBeenCalledWith('/#venteliste')
  })
})
