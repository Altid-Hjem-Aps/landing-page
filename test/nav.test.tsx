import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import * as amplitude from '@amplitude/analytics-browser'
import Nav from '@/components/Nav'

// Amplitude is a browser SDK with network side effects — mock it.
vi.mock('@amplitude/analytics-browser', () => ({ track: vi.fn() }))
vi.mock('@/components/Logo', () => ({ Logo: () => null }))

// Nav navigates via the App Router off the front page — capture push calls.
const push = vi.fn()
vi.mock('next/navigation', () => ({ useRouter: () => ({ push }) }))

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
