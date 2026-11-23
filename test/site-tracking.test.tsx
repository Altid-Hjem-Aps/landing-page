import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import * as amplitude from '@amplitude/analytics-browser'
import { FAQ, OFFER_POPUP, STEPS } from '@/components/site/copy'

// What the new site measures (ALT-1420). Two channels, faked at their boundaries: the browser
// SDK (only after "Accepter alle") and the anonymous beacons to our own server (every visitor,
// fixed values only). Risk: an event leaving the browser without consent, a pop-up's shown count
// and its conversions counted from different visitors, or an event counted twice or never.

vi.mock('@amplitude/analytics-browser', () => ({ track: vi.fn(), setTransport: vi.fn(), flush: vi.fn(() => ({ promise: Promise.resolve() })) }))
// The leave pop-up's card itself (framer-motion, a native dialog, loaded with next/dynamic) is
// not what is measured here: a close button stands in for it.
vi.mock('@/components/site/LeaveDialog', () => ({ default: () => null }))
vi.mock('next/dynamic', () => ({
  default: () =>
    function LeaveDialog({ onClose }: { onClose: () => void }) {
      return (
        <button type="button" onClick={onClose}>
          Luk
        </button>
      )
    },
}))

const LeavePopup = (await import('@/components/site/LeavePopup')).default
const OfferPopup = (await import('@/components/site/OfferPopup')).default
const EngagementTracker = (await import('@/components/site/EngagementTracker')).default
const FaqSection = (await import('@/components/site/FaqSection')).default
const Steps = (await import('@/components/site/Steps')).default
const { trackEvent } = await import('@/lib/analytics')
const CookieBanner = (await import('@/components/CookieBanner')).default
const { saveCookieChoice } = await import('@/lib/cookie-consent')
const { startNewPageLoad } = await import('@/lib/popup-memory')

const track = vi.mocked(amplitude.track)
const setTransport = vi.mocked(amplitude.setTransport)
const flush = vi.mocked(amplitude.flush)
let beacons: Array<{ url: string; body: Blob }>

const accept = () => window.localStorage.setItem('ah-cookie-consent', JSON.stringify({ choice: 'all', at: Date.now() }))
const decline = () => window.localStorage.setItem('ah-cookie-consent', JSON.stringify({ choice: 'necessary', at: Date.now() }))
// Each event loads the SDK on demand; wait until every load so far has handed its event over.
const sdkSettled = () =>
  act(async () => {
    for (let i = 0; i < 5; i++) await vi.dynamicImportSettled()
  })
const beaconBodies = async (url: string) => Promise.all(beacons.filter((b) => b.url === url).map(async (b) => JSON.parse(await b.body.text())))

type Observed = { element: Element; callback: IntersectionObserverCallback }
let observed: Observed[]
const setSeen = (selector: string, isIntersecting: boolean) =>
  act(() => {
    for (const { element, callback } of observed) {
      if (element.matches(selector)) callback([{ isIntersecting, target: element } as unknown as IntersectionObserverEntry], {} as IntersectionObserver)
    }
  })

let computer: boolean
beforeEach(() => {
  window.localStorage.clear()
  window.sessionStorage.clear()
  startNewPageLoad()
  track.mockClear()
  setTransport.mockClear()
  flush.mockClear()
  beacons = []
  observed = []
  computer = true
  Object.defineProperty(navigator, 'sendBeacon', { configurable: true, value: (url: string, body: Blob) => (beacons.push({ url, body }), true) })
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      constructor(private callback: IntersectionObserverCallback) {}
      observe(element: Element) {
        observed.push({ element, callback: this.callback })
      }
      unobserve() {}
      disconnect() {}
      takeRecords() {
        return []
      }
    },
  )
  vi.stubGlobal('matchMedia', (query: string) => ({
    // A computer: a fine pointer, and wide enough for the folded steps.
    matches: query.includes('pointer: fine') || query === '(min-width: 768px)' ? computer : false,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  }))
})

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
  window.localStorage.clear()
})

describe('trackEvent', () => {
  it('sends only after "Accepter alle", and says whether it sent', async () => {
    expect(trackEvent('FAQ Opened', { index: 0 })).toBe(false)
    decline()
    expect(trackEvent('FAQ Opened', { index: 0 })).toBe(false)
    accept()
    expect(trackEvent('FAQ Opened', { index: 0 })).toBe(true)
    await sdkSettled()
    expect(track.mock.calls).toEqual([['FAQ Opened', { index: 0 }]])
    // An event that does not leave the page waits for the SDK's own batch.
    expect(setTransport).not.toHaveBeenCalled()
    expect(flush).not.toHaveBeenCalled()
  })
})

describe('the leave pop-up', () => {
  const leaveTheWindow = () => {
    act(() => vi.advanceTimersByTime(5000))
    act(() => {
      document.dispatchEvent(new MouseEvent('mouseout', { clientY: 10, relatedTarget: null }))
    })
  }

  it('is counted by our server for every visitor, shown and dismissed, and in the browser only after consent', async () => {
    vi.useFakeTimers()
    render(<LeavePopup proof="Over 4.000 bruger appen" />)
    leaveTheWindow()
    vi.useRealTimers()
    fireEvent.click(await screen.findByRole('button', { name: 'Luk' }))
    await sdkSettled()
    expect(await beaconBodies('/api/forside/count')).toEqual([
      { event: 'Popup Shown', props: { popup: 'leave', mode: 'computer' } },
      { event: 'Popup Dismissed', props: { popup: 'leave', mode: 'computer' } },
    ])
    expect(track).not.toHaveBeenCalled()
  })

  it('also sends the old browser events once the visitor accepted', async () => {
    accept()
    vi.useFakeTimers()
    render(<LeavePopup proof="Over 4.000 bruger appen" />)
    leaveTheWindow()
    vi.useRealTimers()
    fireEvent.click(await screen.findByRole('button', { name: 'Luk' }))
    await sdkSettled()
    expect(track.mock.calls).toEqual([
      ['Exit Intent Shown', { path: '/' }],
      ['Exit Intent Dismissed', { path: '/' }],
    ])
  })
})

describe('the Altid Energi offer pop-up', () => {
  function showOffer() {
    Object.defineProperty(document.documentElement, 'scrollHeight', { configurable: true, value: 3000 })
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: 1000 })
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 1200 })
    vi.useFakeTimers()
    render(<OfferPopup after={0.3} proof="Over 800 bruger appen" />)
    act(() => vi.advanceTimersByTime(11_000))
  }

  it('on a phone: shown, a store button as its conversion, and closed, each counted once', async () => {
    computer = false
    accept()
    showOffer()
    fireEvent.click(screen.getAllByRole('link')[1])
    fireEvent.click(screen.getByRole('button', { name: 'Luk' }))
    await sdkSettled()
    expect(await beaconBodies('/api/forside/count')).toEqual([
      { event: 'Popup Shown', props: { popup: 'offer', mode: 'phone' } },
      { event: 'Popup Dismissed', props: { popup: 'offer', mode: 'phone' } },
    ])
    expect(await beaconBodies('/api/forside/store-click')).toEqual([{ store: 'play', position: 'popup', slug: 'front' }])
    // The store tap is also the site's main step (App Intent, 16 Nov), sent before the conversion.
    expect(track.mock.calls).toEqual([
      ['Energi Offer Shown', { path: '/', mode: 'phone' }],
      ['App Intent', { kind: 'store_tap', store: 'play', position: 'popup' }],
      ['Energi Offer Converted', { path: '/', mode: 'phone', store: 'play' }],
      ['Energi Offer Dismissed', { path: '/', mode: 'phone' }],
    ])
    // The store link leaves the page: both events go out at once, by beacon.
    expect(setTransport).toHaveBeenCalledWith('beacon')
    expect(flush).toHaveBeenCalledTimes(2)
  })

  it('on a computer shows its own QR code, so its scans are counted as src=offer', () => {
    decline()
    HTMLDialogElement.prototype.showModal ??= function (this: HTMLDialogElement) {
      this.setAttribute('open', '')
    }
    showOffer()
    expect(screen.getByRole('img', { name: /QR/i }).getAttribute('src')).toContain('app-offer.svg')
  })

  it('on a computer describes the receipt photo for screen readers, saving included', () => {
    decline()
    HTMLDialogElement.prototype.showModal ??= function (this: HTMLDialogElement) {
      this.setAttribute('open', '')
    }
    showOffer()
    const photo = screen.getByRole('img', { name: OFFER_POPUP.photo })
    expect(photo.getAttribute('src')).toContain('galleri-kvittering')
    expect(OFFER_POPUP.photo).toContain('353 kr.')
  })
})

describe('how far a visitor reads', () => {
  function page() {
    return render(
      <>
        <section data-b="hero" />
        <section data-b="steps" />
        <section data-b="faq" />
        <EngagementTracker />
      </>,
    )
  }

  it('sends each block once when it is reached, only after consent, and a block missed before consent when seen again', async () => {
    page()
    setSeen('[data-b="hero"]', true)
    accept()
    setSeen('[data-b="steps"]', true)
    setSeen('[data-b="steps"]', false)
    setSeen('[data-b="steps"]', true)
    setSeen('[data-b="hero"]', true)
    await sdkSettled()
    expect(track.mock.calls).toEqual([
      ['Section Reached', { section: 'steps', path: '/' }],
      ['Section Reached', { section: 'hero', path: '/' }],
    ])
  })

  it('sends the scroll depth at 25, 50, 75 and 100 %, each once', async () => {
    accept()
    vi.useFakeTimers()
    Object.defineProperty(document.documentElement, 'scrollHeight', { configurable: true, value: 4000 })
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: 1000 })
    page()
    const scrollTo = (y: number) => {
      Object.defineProperty(window, 'scrollY', { configurable: true, value: y })
      act(() => {
        window.dispatchEvent(new Event('scroll'))
        vi.advanceTimersByTime(20)
      })
    }
    scrollTo(1000)
    scrollTo(0)
    scrollTo(1000)
    scrollTo(2970)
    await sdkSettled()
    expect(track.mock.calls).toEqual([
      ['Page Scrolled', { percent: 25, path: '/' }],
      ['Page Scrolled', { percent: 50, path: '/' }],
      ['Page Scrolled', { percent: 75, path: '/' }],
      ['Page Scrolled', { percent: 100, path: '/' }],
    ])
  })

  it('sends nothing without consent', async () => {
    page()
    setSeen('[data-b]', true)
    await sdkSettled()
    expect(track).not.toHaveBeenCalled()
  })
})

describe('the questions and the steps', () => {
  it('sends the question a visitor opens, not the one that folds out by itself or one being closed', async () => {
    accept()
    render(<FaqSection />)
    const second = screen.getByRole('button', { name: FAQ.items[1].q })
    fireEvent.click(second)
    fireEvent.click(second)
    await sdkSettled()
    expect(track.mock.calls).toEqual([['FAQ Opened', { question: FAQ.items[1].q, index: 1 }]])
  })

  it('sends the step a visitor clicks', async () => {
    accept()
    Element.prototype.scrollIntoView = vi.fn()
    render(<Steps />)
    fireEvent.click(screen.getByRole('button', { name: new RegExp(STEPS.steps[2].title) }))
    await sdkSettled()
    expect(track).toHaveBeenCalledWith('Step Clicked', { step: STEPS.steps[2].n })
  })

  it('on a computer sends each step once as the scroll opens it, while the block holds still', async () => {
    accept()
    vi.useFakeTimers()
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: 1000 })
    const view = render(<Steps />)
    const section = view.container.querySelector('section[data-b="steps"]') as HTMLElement
    const scrollTo = (top: number) => {
      section.getBoundingClientRect = () => ({ top, bottom: top + 3000, height: 3000 }) as DOMRect
      act(() => {
        window.dispatchEvent(new Event('scroll'))
        vi.advanceTimersByTime(20)
      })
    }
    scrollTo(200) // not yet holding: the block's top is still below the window's top
    scrollTo(-500) // a quarter through: step 02
    scrollTo(-520)
    scrollTo(-1100) // step 03
    await sdkSettled()
    expect(track.mock.calls).toEqual([
      ['Step Opened', { step: STEPS.steps[1].n }],
      ['Step Opened', { step: STEPS.steps[2].n }],
    ])
  })
})

// The old vs new conversion panel (drafts/site-conversion-old-vs-new-plan-16nov.html, D5): the
// site's main step as a browser event for visitors who accepted statistics, never without.
describe('the site’s main step (App Intent)', () => {
  it('sends a store tap with its store and position at once, only after "Accepter alle"', async () => {
    const { default: StoreLink } = await import('@/components/site/StoreLink')
    decline()
    const { unmount } = render(
      <StoreLink store="play" position="hero">
        Hent
      </StoreLink>,
    )
    fireEvent.click(screen.getByRole('link', { name: 'Hent' }))
    await sdkSettled()
    expect(track.mock.calls.filter(([e]) => e === 'App Intent')).toEqual([])
    unmount()

    accept()
    render(
      <StoreLink store="play" position="hero">
        Hent
      </StoreLink>,
    )
    fireEvent.click(screen.getByRole('link', { name: 'Hent' }))
    await sdkSettled()
    expect(track.mock.calls.filter(([e]) => e === 'App Intent')).toEqual([['App Intent', { kind: 'store_tap', store: 'play', position: 'hero' }]])
    // The tap leaves the page, so the event goes out with beacon at once.
    expect(setTransport).toHaveBeenCalledWith('beacon')
    // The cookie-free store click is still counted for everyone.
    expect(await beaconBodies('/api/forside/store-click')).toEqual([
      { store: 'play', position: 'hero', slug: 'front' },
      { store: 'play', position: 'hero', slug: 'front' },
    ])
  })

  it('sends a QR card opened on a computer, with its code and place', async () => {
    const { default: PillQr } = await import('@/components/site/PillQr')
    accept()
    render(
      <div className="site">
        <PillQr code={{ src: '/site/qr/appstore.svg', alt: 'QR', title: 'App Store', label: 'QR-kode til App Store', link: 'https://apps.apple.com', store: { store: 'appstore', position: 'bottom' } }} variant="cream" className="sp">
          Hent i App Store
        </PillQr>
      </div>,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Hent i App Store' }))
    await sdkSettled()
    expect(track.mock.calls.filter(([e]) => e === 'App Intent')).toEqual([['App Intent', { kind: 'qr_open', store: 'appstore', position: 'bottom' }]])
  })
})

// D6: one cookie-free count per page view, from the nav that is on every page of the new site.
describe('the cookie-free visit count', () => {
  it('sends one Page Visited with the page’s group and the guide’s own name when the nav mounts, without consent', async () => {
    const { default: SiteNav } = await import('@/components/site/SiteNav')
    // jsdom has no hit testing; the nav uses it only to pick its light or dark look.
    document.elementsFromPoint = () => []
    window.history.replaceState(null, '', '/hvad-koster-indboforsikring')
    render(<SiteNav base="/" />)
    expect(await beaconBodies('/api/forside/count')).toEqual([{ event: 'Page Visited', props: { page: 'guide', slug: 'hvad-koster-indboforsikring' } }])
    window.history.replaceState(null, '', '/')
  })
})

// Cookie rules: remembering a pop-up in the browser is not needed for anything the visitor asked
// for, so it takes a yes. The rules cover sessionStorage and localStorage like cookies.
describe('what the pop-ups remember in the browser', () => {
  const POPUP_KEYS = ['ah-offer-popup-shown', 'ah-leave-popup-shown', 'ah-offer-popup-closed']
  const stored = () => POPUP_KEYS.filter((key) => window.sessionStorage.getItem(key) !== null || window.localStorage.getItem(key) !== null)

  function showAndCloseTheOffer() {
    computer = false
    Object.defineProperty(document.documentElement, 'scrollHeight', { configurable: true, value: 3000 })
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: 1000 })
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 1200 })
    vi.useFakeTimers()
    const offer = render(<OfferPopup after={0.3} proof="Over 800 bruger appen" />)
    act(() => vi.advanceTimersByTime(11_000))
    fireEvent.click(screen.getByRole('button', { name: 'Luk' }))
    return offer
  }

  // Risk: a visitor who chose "Kun nødvendige" still gets the pop-up keys written, or, with
  // nothing stored, gets the leave pop-up on top of the offer in the same visit.
  it('stores nothing for a visitor who said no, and still shows one pop-up per visit', async () => {
    decline()
    showAndCloseTheOffer().unmount()
    expect(stored()).toEqual([])

    computer = true
    render(<LeavePopup proof="Over 4.000 bruger appen" />)
    act(() => vi.advanceTimersByTime(5000))
    act(() => {
      document.dispatchEvent(new MouseEvent('mouseout', { clientY: 10, relatedTarget: null }))
    })
    vi.useRealTimers()
    await sdkSettled()
    expect((await beaconBodies('/api/forside/count')).filter((b) => b.props.popup === 'leave')).toEqual([])
    expect(stored()).toEqual([])
  })

  // Risk: the change forgets the pop-ups for everyone, so a visitor who accepted cookies gets
  // the offer again on every page.
  it('remembers them for a visitor who said yes, and forgets them when the yes is taken back', () => {
    accept()
    render(<CookieBanner />)
    showAndCloseTheOffer()
    expect(stored()).toEqual(['ah-offer-popup-shown', 'ah-offer-popup-closed'])

    act(() => saveCookieChoice('necessary'))
    expect(stored()).toEqual([])
  })

  // Risk: a visitor closes the offer before answering the banner (or after a no), then says yes:
  // nothing is stored, so the offer comes back on the next page inside its quiet week.
  it('stores what the visit already showed when a yes comes after the pop-up', () => {
    decline()
    render(<CookieBanner />)
    showAndCloseTheOffer()
    expect(stored()).toEqual([])

    act(() => saveCookieChoice('all'))
    expect(stored()).toEqual(['ah-offer-popup-shown', 'ah-offer-popup-closed'])
  })

  // Risk: a yes taken back deletes the keys that held the pop-ups back on this page, so the
  // visitor who just said no to cookies gets a second pop-up in the same visit.
  it('still shows one pop-up per visit when the yes is taken back on a later page', async () => {
    accept()
    showAndCloseTheOffer().unmount()
    startNewPageLoad()

    computer = true
    render(<CookieBanner />)
    render(<LeavePopup proof="Over 4.000 bruger appen" />)
    act(() => vi.advanceTimersByTime(5000))
    act(() => saveCookieChoice('necessary'))
    expect(stored()).toEqual([])
    act(() => {
      document.dispatchEvent(new MouseEvent('mouseout', { clientY: 10, relatedTarget: null }))
    })
    vi.useRealTimers()
    await sdkSettled()
    expect((await beaconBodies('/api/forside/count')).filter((b) => b.props.popup === 'leave')).toEqual([])
  })

  // Risk: a yes that ran out after 12 months, or keys from the older site, leave the pop-up keys
  // in the browser of a visitor who has no valid yes.
  it('removes keys left in the browser of a visitor without a valid yes', () => {
    window.localStorage.setItem('ah-offer-popup-closed', String(Date.now()))
    window.sessionStorage.setItem('ah-offer-popup-shown', '1')
    render(<CookieBanner />)
    expect(stored()).toEqual([])
  })
})
