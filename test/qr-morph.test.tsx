import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import EnergiOffer from '@/components/site/EnergiOffer'
import FinalCta from '@/components/site/FinalCta'
import GetAppSticky from '@/components/site/GetAppSticky'
import { MotionPrefs } from '@/components/site/MotionPrefs'

// The front page's QR codes and links (Thor 13/11, second round): the sticky bottom right is
// just the QR code; the Energi offer is one link everywhere; the final block's store pills open
// into the QR code on a computer and are store links elsewhere; the final block's collage.
// Faked at the boundary only: matchMedia, IntersectionObserver, ResizeObserver and sendBeacon.

const SIGNUP = 'https://tilmeld.altidenergi.dk/signup/altid-hjem'
const QR_ALT = 'QR-kode til Altid Hjem i App Store og Google Play'

let computer: boolean
let observed: { element: Element; callback: IntersectionObserverCallback }[]
let beacons: unknown[]

beforeEach(() => {
  computer = false
  observed = []
  beacons = []
  window.matchMedia = ((query: string) => ({
    matches: query.includes('pointer: fine') ? computer : false,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  })) as unknown as typeof window.matchMedia
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      constructor(private callback: IntersectionObserverCallback) {}
      observe(element: Element) {
        observed.push({ element, callback: this.callback })
      }
      unobserve() {}
      disconnect() {}
    },
  )
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  )
  navigator.sendBeacon = ((_url: string, body: unknown) => {
    beacons.push(body)
    return true
  }) as typeof navigator.sendBeacon
})

afterEach(() => {
  vi.unstubAllGlobals()
  document.body.innerHTML = ''
  window.history.replaceState(null, '', '/')
})

function setInView(selector: string, isIntersecting: boolean) {
  act(() => {
    for (const { element, callback } of observed) {
      if (element.matches(selector)) callback([{ isIntersecting } as IntersectionObserverEntry], {} as IntersectionObserver)
    }
  })
}

// The Ekstra Bladet card the sticky watches.
function renderSticky() {
  const press = document.createElement('a')
  press.className = 'h-press'
  document.body.append(press)
  return render(<GetAppSticky />)
}

const renderFinal = () =>
  render(
    <MotionPrefs>
      <FinalCta />
    </MotionPrefs>,
  )

describe('the sticky QR code', () => {
  it('is the one QR code with its title and line, and no button', () => {
    const { container } = renderSticky()
    expect(screen.getByAltText(QR_ALT).getAttribute('src')).toContain('/site/qr/app.svg')
    expect(container.textContent).toContain('Hent appen')
    expect(container.textContent).toContain('Scan koden med din telefon')
    expect(screen.queryByRole('button')).toBeNull()
    expect(screen.queryByRole('link')).toBeNull()
  })

  it('fades once Ekstra Bladet has scrolled past and comes back above it', () => {
    const { container } = renderSticky()
    const sticky = container.querySelector('.gs') as HTMLElement
    expect(sticky.dataset.shown).toBe('true')
    setInView('.h-press', false)
    expect(sticky.dataset.shown).toBe('false')
    setInView('.h-press', true)
    expect(sticky.dataset.shown).toBe('true')
  })
})

describe('the Altid Energi offer in the Energi card', () => {
  for (const device of ['a phone', 'a computer']) {
    it(`is one link to the signup, in a new tab, on ${device}, with no QR code`, () => {
      computer = device === 'a computer'
      const { container } = render(
        <MotionPrefs>
          <EnergiOffer />
        </MotionPrefs>,
      )
      const link = screen.getByRole('link')
      expect(link.getAttribute('href')).toBe(SIGNUP)
      expect(link.getAttribute('target')).toBe('_blank')
      expect(link.textContent).toContain('Bliv kunde hos Altid Energi')
      expect(link.textContent).toContain('Gebyrfri strøm til indkøbspris')
      expect(link.textContent).toContain('Første måned gratis')
      expect(container.textContent).toContain('100 % rabat på elabonnementet den første måned, når du bliver kunde via Altid Hjem.')
      expect(screen.queryByRole('button')).toBeNull()
      expect(container.querySelector('img[src*="qr"]')).toBeNull()
    })
  }

  it('floats only while on screen', () => {
    const { container } = render(
      <MotionPrefs>
        <EnergiOffer />
      </MotionPrefs>,
    )
    const float = container.querySelector('.float') as HTMLElement
    expect(float.dataset.running).toBe('true')
    setInView('.float', false)
    expect(float.dataset.running).toBe('false')
  })
})

describe('the final block’s store pills', () => {
  it('are store links on a phone or a tablet, counted as the bottom position, with no QR code', () => {
    renderFinal()
    const appStore = screen.getAllByRole('link', { name: 'Hent i App Store' })[0]
    expect(appStore.getAttribute('href')).toContain('apps.apple.com')
    expect(screen.getAllByRole('link', { name: 'Hent i Google Play' })[0].getAttribute('href')).toContain('play.google.com')
    fireEvent.click(appStore)
    expect(beacons).toHaveLength(1)
    expect(screen.queryByAltText(QR_ALT)).toBeNull()
  })

  it('open into the QR code on a computer, not counted, with focus on its close control, and back with Escape', () => {
    computer = true
    renderFinal()
    expect(screen.queryByRole('link', { name: /Hent i/ })).toBeNull()
    const play = screen.getByRole('button', { name: 'Hent i Google Play' })
    const appStore = screen.getByRole('button', { name: 'Hent i App Store' })
    expect(play.getAttribute('aria-expanded')).toBe('false')
    fireEvent.click(play)
    expect(beacons).toHaveLength(0)
    expect(play.getAttribute('aria-expanded')).toBe('true')
    expect(appStore.getAttribute('aria-expanded')).toBe('true')
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Luk QR-koden' }))
    const card = screen.getByRole('group', { name: 'Hent appen' })
    expect(play.getAttribute('aria-controls')).toBe(card.id)
    expect(within(card).getByAltText(QR_ALT).getAttribute('src')).toContain('/site/qr/app.svg')
    expect(card.textContent).toContain('Scan koden med din telefon')
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(play.getAttribute('aria-expanded')).toBe('false')
    expect(document.activeElement).toBe(play)
  })

  it('close on the close control and on a click outside', () => {
    computer = true
    renderFinal()
    const appStore = screen.getByRole('button', { name: 'Hent i App Store' })
    fireEvent.click(appStore)
    fireEvent.click(screen.getByRole('button', { name: 'Luk QR-koden' }))
    expect(appStore.getAttribute('aria-expanded')).toBe('false')
    expect(document.activeElement).toBe(appStore)
    fireEvent.click(appStore)
    fireEvent.pointerDown(document.body)
    expect(appStore.getAttribute('aria-expanded')).toBe('false')
  })

  it('open by themselves on a computer when a "Hent appen" link brings the visitor here', () => {
    computer = true
    renderFinal()
    const menu = document.createElement('a')
    menu.href = '#hent-appen'
    document.body.append(menu)
    const appStore = screen.getByRole('button', { name: 'Hent i App Store' })
    setInView('.e-pills', false)
    fireEvent.click(menu)
    expect(appStore.getAttribute('aria-expanded')).toBe('false')
    setInView('.e-pills', true)
    expect(appStore.getAttribute('aria-expanded')).toBe('true')
    // Only once: scrolling away and back leaves it as the visitor left it.
    fireEvent.keyDown(document, { key: 'Escape' })
    setInView('.e-pills', false)
    setInView('.e-pills', true)
    expect(appStore.getAttribute('aria-expanded')).toBe('false')
  })

  it('open by themselves when the page opens at #hent-appen on a computer, and not on a phone', () => {
    window.history.replaceState(null, '', '/#hent-appen')
    computer = true
    const { unmount } = renderFinal()
    setInView('.e-pills', true)
    expect(screen.getByRole('button', { name: 'Hent i App Store' }).getAttribute('aria-expanded')).toBe('true')
    unmount()
    computer = false
    observed = []
    renderFinal()
    setInView('.e-pills', true)
    expect(screen.queryByRole('group', { name: 'Hent appen' })).toBeNull()
  })
})

describe('the final block’s collage', () => {
  it('has twelve tiles on a computer and six on a phone, screens on a tone and five photos, each named', () => {
    const { container } = renderFinal()
    const wall = Array.from(container.querySelectorAll('.e-wall .e-tile'))
    const few = Array.from(container.querySelectorAll('.e-few .e-tile'))
    expect(wall).toHaveLength(12)
    expect(few).toHaveLength(6)
    const photos = wall.filter((tile) => tile.classList.contains('e-photo'))
    expect(photos).toHaveLength(5)
    for (const tile of wall.filter((t) => t.classList.contains('e-shot'))) expect(tile.getAttribute('data-tone')).toBeTruthy()
    const alts = wall.map((tile) => tile.querySelector('img')?.getAttribute('alt'))
    expect(alts.every(Boolean)).toBe(true)
    expect(new Set(alts).size).toBe(12)
    expect(container.querySelector('.mq')).toBeNull()
    expect(container.textContent).toContain('Skærmbilleder fra appen med eksempeldata.')
  })
})
