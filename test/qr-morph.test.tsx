import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import FinalCta from '@/components/site/FinalCta'
import { MotionPrefs } from '@/components/site/MotionPrefs'
import Stickies from '@/components/site/Stickies'

// The front page's QR codes and links (Thor 13/11, third round): the QR code bottom right until
// the testimonials' slider arrives; Altid Energi's offer fixed at the bottom while the Energi
// card is in view, one link everywhere, never with the QR code; the final block's store pills
// open into the QR code on a computer and are store links elsewhere; the final block's collage.
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

// The testimonials' slider and the Energi card the stickies watch.
function renderStickies() {
  const proof = document.createElement('section')
  proof.dataset.b = 'proof'
  proof.innerHTML = '<div class="v"></div>'
  const energi = document.createElement('article')
  energi.id = 'energi'
  document.body.append(proof, energi)
  return render(
    <MotionPrefs>
      <Stickies />
    </MotionPrefs>,
  )
}

const renderFinal = () =>
  render(
    <MotionPrefs>
      <FinalCta />
    </MotionPrefs>,
  )

describe('the sticky QR code and the Altid Energi offer', () => {
  it('shows the one QR code with its title and line, and no button', () => {
    const { container } = renderStickies()
    const qr = container.querySelector('.gs') as HTMLElement
    expect(qr.dataset.shown).toBe('true')
    expect(within(qr).getByAltText(QR_ALT).getAttribute('src')).toContain('/site/qr/app.svg')
    expect(qr.textContent).toBe('Hent appenScan koden med din telefon')
    expect(within(qr).queryByRole('button')).toBeNull()
    expect(within(qr).queryByRole('link')).toBeNull()
  })

  it('hides the QR code once the slider arrives, and shows it again above it', () => {
    const { container } = renderStickies()
    const qr = container.querySelector('.gs') as HTMLElement
    setInView('.v', true)
    expect(qr.dataset.shown).toBe('false')
    setInView('.v', false)
    expect(qr.dataset.shown).toBe('true')
  })

  it('shows the offer while the Energi card is in view, never together with the QR code', () => {
    const { container } = renderStickies()
    const qr = container.querySelector('.gs') as HTMLElement
    const offer = container.querySelector('.eo') as HTMLElement
    expect(offer.dataset.shown).toBe('false')
    setInView('#energi', true)
    expect(offer.dataset.shown).toBe('true')
    expect(qr.dataset.shown).toBe('false')
    setInView('#energi', false)
    expect(offer.dataset.shown).toBe('false')
    expect(qr.dataset.shown).toBe('true')
  })

  for (const device of ['a phone', 'a computer']) {
    it(`makes the offer one link to the signup, in a new tab, with its fine print, on ${device}`, () => {
      computer = device === 'a computer'
      const { container } = renderStickies()
      const offer = container.querySelector('.eo') as HTMLElement
      const link = within(offer).getByRole('link')
      expect(within(offer).getAllByRole('link')).toHaveLength(1)
      expect(link.getAttribute('href')).toBe(SIGNUP)
      expect(link.getAttribute('target')).toBe('_blank')
      for (const text of ['Bliv kunde hos Altid Energi', 'Gebyrfri strøm til indkøbspris', 'Første måned gratis', '100 % rabat på elabonnementet den første måned, når du bliver kunde via Altid Hjem.']) {
        expect(link.textContent).toContain(text)
      }
      expect(offer.querySelector('img[src*="qr"]')).toBeNull()
    })
  }
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
  it('mixes five photos and three screens, each named, with drawn pieces of the app hidden from screen readers', () => {
    const { container } = renderFinal()
    const wall = Array.from(container.querySelectorAll('.e-band .e-piece'))
    expect(wall).toHaveLength(19)
    const kinds = wall.map((piece) => (piece as HTMLElement).dataset.kind)
    expect(kinds.filter((k) => k === 'photo')).toHaveLength(5)
    expect(kinds.filter((k) => k === 'screen')).toHaveLength(3)
    for (const kind of ['note', 'bill', 'orb', 'soon', 'row']) expect(kinds).toContain(kind)
    const named = wall.filter((piece) => ['photo', 'screen'].includes((piece as HTMLElement).dataset.kind as string))
    const alts = named.map((piece) => piece.querySelector('img')?.getAttribute('alt'))
    expect(alts.every(Boolean)).toBe(true)
    expect(new Set(alts).size).toBe(8)
    for (const piece of wall.filter((p) => !named.includes(p))) expect(piece.querySelector('[aria-hidden="true"]')).not.toBeNull()
    // No screen with a menu or sheet open.
    expect(container.querySelector('img[src*="mere-sheet"]')).toBeNull()
    expect(container.querySelectorAll('.e-stage .e-piece')).toHaveLength(8)
    expect(container.querySelector('.mq')).toBeNull()
    expect(container.textContent).not.toContain('Skærmbilleder fra appen med eksempeldata.')
  })
})
