import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import StoreLink from '@/components/site/StoreLink'

// ALT-1713: on a guide, a store link carries the guide's own campaign and its tap carries the
// guide's own name, so App Store Connect, Play Console and Amplitude can read each guide apart.
const GUIDE = '/billigste-elselskab'
let pathname = GUIDE
vi.mock('next/navigation', () => ({ usePathname: () => pathname }))

const beacon = vi.fn((url: string, data: Blob) => {
  void url
  void data
  return true
})

beforeEach(() => {
  beacon.mockClear()
  vi.stubGlobal('navigator', Object.assign(Object.create(navigator), { sendBeacon: beacon }))
})

afterEach(() => {
  vi.unstubAllGlobals()
  window.history.replaceState(null, '', '/')
  pathname = GUIDE
})

function tap(name: string) {
  const link = screen.getByRole('link', { name })
  link.addEventListener('click', (e) => e.preventDefault())
  fireEvent.click(link)
  return link
}

describe('a store link on a guide', () => {
  it('links with the guide campaign and counts the tap under the guide', async () => {
    window.history.replaceState(null, '', GUIDE)
    render(
      <StoreLink store="appstore" position="bottom">
        Hent
      </StoreLink>,
    )
    const link = tap('Hent')
    expect(link.getAttribute('href')).toContain('ct=ah_1_guide_billigste_elselskab&')
    const [url, body] = beacon.mock.calls[0]
    expect(url).toBe('/api/forside/store-click')
    expect(JSON.parse(await body.text())).toEqual({ store: 'appstore', position: 'bottom', slug: 'billigste-elselskab' })
  })

  it('keeps the site campaign and the page group anywhere else', async () => {
    pathname = '/kontakt'
    window.history.replaceState(null, '', '/kontakt')
    render(
      <StoreLink store="play" position="nav">
        Hent
      </StoreLink>,
    )
    const link = tap('Hent')
    expect(link.getAttribute('href')).toContain('utm_campaign%3Dah_1_altidhjem_dk')
    expect(JSON.parse(await beacon.mock.calls[0][1].text())).toEqual({ store: 'play', position: 'nav', slug: 'kontakt' })
  })
})

// The footer's and the offer pop-up's code (QrImage): the guide's own on a guide, so the scan
// keeps the phone's own store (/qr) and adds the guide.
describe('a place’s QR code on a guide', () => {
  it('is the guide’s own for the footer and the offer pop-up, the site’s elsewhere', async () => {
    const { default: QrImage } = await import('@/components/site/QrImage')
    const src = () => decodeURIComponent(screen.getByRole('img').getAttribute('src') ?? '')
    const { unmount } = render(<QrImage source="offer" size={148} />)
    expect(src()).toContain('/site/qr/guide/billigste-elselskab-offer.svg')
    unmount()
    const footer = render(<QrImage source="footer" size={104} />)
    expect(src()).toContain('/site/qr/guide/billigste-elselskab-footer.svg')
    footer.unmount()
    // A place without a guide code of its own keeps the site's.
    const sticky = render(<QrImage source="sticky" size={74} />)
    expect(src()).toContain('/site/qr/app-sticky.svg')
    sticky.unmount()
    pathname = '/'
    render(<QrImage source="footer" size={104} />)
    expect(src()).toContain('/site/qr/app-footer.svg')
  })
})
