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

function placePills() {
  const pills = document.createElement('div')
  pills.id = 'hent-appen'
  pills.scrollIntoView = vi.fn()
  document.body.appendChild(pills)
  return pills
}

describe('Nav CTA', () => {
  it('on a page with the store pills: tracks the click and scrolls to them', () => {
    stubLocation('/')
    const pills = placePills()

    render(<Nav />)
    fireEvent.click(screen.getByRole('button', { name: 'Hent appen' }))

    expect(amplitude.track).toHaveBeenCalledWith('Get App CTA Clicked', { source: 'nav' })
    expect(pills.scrollIntoView).toHaveBeenCalled()
    // Stayed on the page: no navigation.
    expect(push).not.toHaveBeenCalled()

    pills.remove()
  })

  it('on a page without pills: client-navigates to the front page\'s', () => {
    stubLocation('/slet-konto')

    render(<Nav />)
    fireEvent.click(screen.getByRole('button', { name: 'Hent appen' }))

    expect(amplitude.track).toHaveBeenCalledWith('Get App CTA Clicked', { source: 'nav' })
    // router.push (not a full page load) so the tracked event isn't dropped.
    expect(push).toHaveBeenCalledWith('/#hent-appen')
  })
})

describe('Nav active state', () => {
  const SIGNAL = 'rgb(144, 255, 124)'
  const WHITE = 'rgb(255, 255, 255)'

  // Hjem is the current site on every altidhjem.dk page.
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

  it('keeps the other brands white off the front page', () => {
    stubLocation('/opsig-abonnementer')
    render(<Nav />)
    expect(screen.getAllByRole('link', { name: 'Mad' })[0]).toHaveStyle({ color: WHITE })
    expect(screen.getAllByRole('link', { name: 'Forsikring' })[0]).toHaveStyle({ color: WHITE })
    expect(screen.getAllByRole('link', { name: 'Energi' })[0]).toHaveStyle({ color: WHITE })
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

describe('Nav links', () => {
  it('promises no service that is not in the app', () => {
    stubLocation('/')
    render(<Nav />)
    fireEvent.click(screen.getByRole('button', { name: 'Åbn menu' }))
    expect(screen.queryByText(/Kommer snart/i)).toBeNull()
    for (const name of ['Alarm', 'Opladning', 'Mobil']) expect(screen.queryByText(name)).toBeNull()
  })
})

describe('Spiir banner', () => {
  it('is ABSENT by default: the front page must render without campaign content', () => {
    stubLocation('/')
    render(<Nav />)
    expect(screen.queryByText(/Spiir/)).toBeNull()
    // Only the nav's own controls: the CTA and the burger toggle.
    expect(screen.getByRole('button', { name: 'Hent appen' })).toBeInTheDocument()
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
    expect(screen.getAllByRole('link', { name: 'Mad' }).length).toBeGreaterThan(1)
    expect(screen.getAllByRole('link', { name: 'Mad' })[0]).toHaveAttribute('href', 'https://altidmad.dk')
    expect(screen.getAllByRole('link', { name: 'Energi' }).length).toBeGreaterThan(1)
    expect(screen.getAllByRole("link", { name: "Forsikring" }).length).toBeGreaterThan(1)
    expect(screen.getAllByRole("link", { name: "Forsikring" })[0]).toHaveAttribute("href", "https://altidforsikring.dk")
    fireEvent.click(screen.getAllByRole('link', { name: 'Energi' })[1])
    expect(screen.getByRole('button', { name: 'Åbn menu' })).toHaveAttribute('aria-expanded', 'false')
  })

  it('renders above the nav when spiirBanner is set', () => {
    stubLocation('/spiir-alternativ')
    render(<Nav spiirBanner />)
    expect(screen.getByText(/Brugte du Spiir\?/)).toBeInTheDocument()
  })

  it('scrolls to the store pills on the page when clicked', () => {
    stubLocation('/spiir-alternativ')
    const pills = placePills()

    render(<Nav spiirBanner />)
    fireEvent.click(screen.getByText(/Brugte du Spiir\?/).closest('button') as HTMLElement)

    expect(amplitude.track).toHaveBeenCalledWith('Get App CTA Clicked', { source: 'spiir-banner' })
    expect(pills.scrollIntoView).toHaveBeenCalled()
    expect(push).not.toHaveBeenCalled()

    pills.remove()
  })

  it('goes to the front page\'s pills if the page has none of its own', () => {
    stubLocation('/spiir-alternativ')
    render(<Nav spiirBanner />)
    fireEvent.click(screen.getByText(/Brugte du Spiir\?/).closest('button') as HTMLElement)

    expect(push).toHaveBeenCalledWith('/#hent-appen')
  })
})
