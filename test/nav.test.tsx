import { afterEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import * as amplitude from '@amplitude/analytics-browser'
import Nav from '@/components/Nav'

// Amplitude is a browser SDK with network side effects: mock it.
vi.mock('@amplitude/analytics-browser', () => ({ track: vi.fn() }))
vi.mock('@/components/Logo', () => ({ Logo: () => null }))

const push = vi.fn()
vi.mock('next/navigation', () => ({ useRouter: () => ({ push }) }))

// Literal on purpose: ALT-894's campaign links, not built from lib/store-links.
const APP_STORE = 'https://apps.apple.com/dk/app/altid-hjem/id6794330094?pt=129212732&ct=ah_1_altidhjem_dk&mt=8'
const PLAY =
  'https://play.google.com/store/apps/details?id=dk.altidhjem.app&referrer=utm_source%3Daltidhjem_dk%26utm_campaign%3Dah_1_altidhjem_dk'

afterEach(() => {
  vi.unstubAllGlobals()
  vi.clearAllMocks()
})

function onDevice(userAgent: string) {
  const sendBeacon = vi.fn((url: string, data: Blob) => {
    void url
    void data
    return true
  })
  vi.stubGlobal('navigator', { userAgent, maxTouchPoints: 5, sendBeacon })
  return sendBeacon
}

function placePills() {
  const pills = document.createElement('div')
  pills.id = 'hent-appen'
  pills.scrollIntoView = vi.fn()
  document.body.appendChild(pills)
  return pills
}

const hentAppen = () => screen.getByRole('link', { name: 'Hent appen' })

describe('Nav links', () => {
  it('goes to the front page sections', () => {
    render(<Nav />)
    const hrefs = Object.fromEntries(
      ['Økonomi', 'Altid Mad', 'Altid Energi', 'Altid Forsikring', 'Spørgsmål'].map((name) => [
        name,
        screen.getByRole('link', { name }).getAttribute('href'),
      ]),
    )
    expect(hrefs).toEqual({
      Økonomi: '/#okonomi',
      'Altid Mad': '/#altid-mad',
      'Altid Energi': '/#altid-energi',
      'Altid Forsikring': '/#altid-forsikring',
      Spørgsmål: '/#spoergsmaal',
    })
  })

  it('promises no service that is not in the app', () => {
    render(<Nav />)
    expect(screen.queryByText(/Kommer snart/i)).toBeNull()
    for (const name of ['Alarm', 'Opladning', 'Mobil']) expect(screen.queryByText(name)).toBeNull()
  })
})

describe('Hent appen', () => {
  it('is a working link to the pills in the server HTML, on any device', () => {
    onDevice('Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X)')
    expect(renderToString(<Nav />)).toContain('href="/#hent-appen"')
  })

  it('on an iPhone goes straight to the App Store and counts as nav', async () => {
    const sendBeacon = onDevice('Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X)')
    render(<Nav />)
    expect(hentAppen()).toHaveAttribute('href', APP_STORE)
    fireEvent.click(hentAppen())
    const [url, blob] = sendBeacon.mock.calls[0]
    expect(url).toBe('/api/forside/store-click')
    expect(JSON.parse(await blob.text())).toEqual({ store: 'appstore', position: 'nav' })
  })

  it('on Android goes straight to Google Play', () => {
    onDevice('Mozilla/5.0 (Linux; Android 15; Pixel 9) Chrome/130.0.0.0 Mobile Safari/537.36')
    render(<Nav />)
    expect(hentAppen()).toHaveAttribute('href', PLAY)
  })

  it('on a desktop scrolls to the pills on this page, and counts no store click', () => {
    const sendBeacon = onDevice('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)')
    vi.stubGlobal('navigator', { ...navigator, maxTouchPoints: 0 })
    const pills = placePills()
    render(<Nav />)
    expect(hentAppen()).toHaveAttribute('href', '#hent-appen')
    fireEvent.click(hentAppen())
    expect(amplitude.track).toHaveBeenCalledWith('Get App CTA Clicked', { source: 'nav' })
    expect(sendBeacon).not.toHaveBeenCalled()
    pills.remove()
  })

  it('on a desktop page without pills goes to the front page\'s', () => {
    onDevice('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)')
    vi.stubGlobal('navigator', { ...navigator, maxTouchPoints: 0 })
    render(<Nav />)
    expect(hentAppen()).toHaveAttribute('href', '/#hent-appen')
  })
})

describe('Campaign banner', () => {
  it('is ABSENT by default: the front page must render without campaign content', () => {
    render(<Nav />)
    expect(screen.queryByText(/Spiir/)).toBeNull()
    expect(screen.queryAllByRole('button')).toHaveLength(0)
  })

  it('renders above the nav when spiirBanner is set', () => {
    render(<Nav spiirBanner />)
    expect(screen.getByText(/Brugte du Spiir\?/)).toBeInTheDocument()
  })

  it('renders a page\'s own banner', () => {
    render(<Nav banner={{ longPrefix: 'Lang tekst. ', shortPrefix: 'Kort tekst. ', source: 'elpris-banner' }} />)
    expect(screen.getByText('Kort tekst.')).toBeInTheDocument()
  })

  it('scrolls to the store pills on the page when clicked', () => {
    const pills = placePills()

    render(<Nav spiirBanner />)
    fireEvent.click(screen.getByText(/Brugte du Spiir\?/).closest('button') as HTMLElement)

    expect(amplitude.track).toHaveBeenCalledWith('Get App CTA Clicked', { source: 'spiir-banner' })
    expect(pills.scrollIntoView).toHaveBeenCalled()
    expect(push).not.toHaveBeenCalled()

    pills.remove()
  })

  it('goes to the front page\'s pills if the page has none of its own', () => {
    render(<Nav spiirBanner />)
    fireEvent.click(screen.getByText(/Brugte du Spiir\?/).closest('button') as HTMLElement)

    expect(push).toHaveBeenCalledWith('/#hent-appen')
  })
})
