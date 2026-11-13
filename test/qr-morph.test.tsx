import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import FinalCta from '@/components/site/FinalCta'
import EnergiOffer from '@/components/site/EnergiOffer'
import GetAppSticky from '@/components/site/GetAppSticky'
import { FINAL_LAYOUT } from '@/components/site/copy'
import { MotionPrefs } from '@/components/site/MotionPrefs'

// The front page's QR codes and links (Thor 13/11, fifth round): the QR code bottom right from
// the moment the hero's animation has scrolled past until the testimonials' slider arrives;
// Altid Energi's offer over the Energi card's phone, one link everywhere; the final block's
// store pills open into the QR code on a computer and are store links elsewhere; the final
// block's collage.
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

// The testimonials' slider the QR card watches.
function renderSticky() {
  const proof = document.createElement('section')
  proof.dataset.b = 'proof'
  proof.innerHTML = '<div class="v"></div>'
  document.body.append(proof)
  return render(<GetAppSticky />).container.querySelector('.gs') as HTMLElement
}

// The offer sits in the Energi card's phone; it grows as the card passes.
function renderOffer() {
  return render(
    <MotionPrefs>
      <article className="d-card" id="energi">
        <EnergiOffer />
      </article>
    </MotionPrefs>,
  )
}

const renderFinal = () =>
  render(
    <MotionPrefs>
      <FinalCta />
    </MotionPrefs>,
  )

describe('the sticky QR code', () => {
  it('is the one QR code with its title and line, and no button', () => {
    const card = renderSticky()
    expect(within(card).getByAltText(QR_ALT).getAttribute('src')).toContain('/site/qr/app.svg')
    expect(card.textContent).toBe('Hent appenScan koden med din telefon')
    expect(within(card).queryByRole('button')).toBeNull()
    expect(within(card).queryByRole('link')).toBeNull()
  })

  it('is there from the moment the page opens, goes as the slider arrives, and comes back above it', () => {
    const card = renderSticky()
    expect(card.dataset.shown).toBe('true')
    setInView('.v', true)
    expect(card.dataset.shown).toBe('false')
    setInView('.v', false)
    expect(card.dataset.shown).toBe('true')
  })
})

describe('the Altid Energi offer over the Energi card’s phone', () => {
  for (const device of ['a phone', 'a computer']) {
    it(`is one link to the signup, in a new tab, with its fine print, on ${device}`, () => {
      computer = device === 'a computer'
      const { container } = renderOffer()
      expect(screen.getAllByRole('link')).toHaveLength(1)
      const link = screen.getByRole('link')
      expect(link.getAttribute('href')).toBe(SIGNUP)
      expect(link.getAttribute('target')).toBe('_blank')
      for (const text of ['Bliv kunde hos Altid Energi', 'Gebyrfri strøm til indkøbspris', 'Første måned gratis', '100 % rabat på elabonnementet den første måned, når du bliver kunde via Altid Hjem.']) {
        expect(link.textContent).toContain(text)
      }
      expect(container.querySelector('img[src*="qr"]')).toBeNull()
    })
  }

  it('grows from its own size to 1.3 as the card comes up to the upper third, then holds', () => {
    vi.stubGlobal('requestAnimationFrame', (run: FrameRequestCallback) => {
      run(0)
      return 0
    })
    window.innerHeight = 900
    const { container } = renderOffer()
    const card = container.querySelector('#energi') as HTMLElement
    const offer = container.querySelector('.ek-offer') as HTMLElement
    let top = 900
    card.getBoundingClientRect = () => ({ top, height: 600 }) as DOMRect
    const at = (y: number) => {
      top = y
      fireEvent.scroll(window)
      return Number(offer.style.scale)
    }
    // Comes in at the bottom: 1; its middle at a third (top at 0): 1.3; halfway between: 1.15.
    expect(at(900)).toBe(1)
    expect(at(450)).toBe(1.15)
    expect(at(0)).toBe(1.3)
    expect(at(-400)).toBe(1.3)
  })

  it('stays at its own size with reduced motion', () => {
    window.matchMedia = ((query: string) => ({ matches: query.includes('reduce'), media: query, addEventListener: () => {}, removeEventListener: () => {} })) as unknown as typeof window.matchMedia
    const { container } = renderOffer()
    expect((container.querySelector('.ek-offer') as HTMLElement).style.scale).toBe('')
  })

  it('floats only while on screen', () => {
    const { container } = renderOffer()
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
  it('has fourteen tiles on a computer and six on a phone: five photos, four screens on toned cards, the painting, the coins, two dishes', () => {
    const { container } = renderFinal()
    const wall = Array.from(container.querySelectorAll('.e-wall .e-tile'))
    expect(wall).toHaveLength(14)
    expect(container.querySelectorAll('.e-few .e-tile')).toHaveLength(6)
    const sources = wall.map((tile) => decodeURIComponent(tile.querySelector('img')?.getAttribute('src') ?? ''))
    expect(sources.filter((src) => src.includes('/site/plates/'))).toHaveLength(2)
    expect(sources.filter((src) => src.includes('/site/gallery/') || src.includes('faq-familie'))).toHaveLength(5)
    expect(sources.some((src) => src.includes('painting'))).toBe(true)
    expect(sources.some((src) => src.includes('coin-stack'))).toBe(true)
    const screens = Array.from(container.querySelectorAll('.e-wall .e-screen'))
    expect(screens).toHaveLength(4)
    for (const tile of screens) expect(tile.getAttribute('data-tone')).toBeTruthy()
    // Every tile but the notification is named; the notification is decoration.
    const named = wall.filter((tile) => !tile.classList.contains('e-note-tile'))
    const alts = named.map((tile) => tile.querySelector('img')?.getAttribute('alt'))
    expect(alts.every(Boolean)).toBe(true)
    expect(new Set(alts).size).toBe(13)
    expect(container.querySelector('.e-note-tile')?.getAttribute('aria-hidden')).toBe('true')
    expect(container.querySelector('img[src*="mere-sheet"]')).toBeNull()
    expect(container.textContent).not.toContain('Skærmbilleder fra appen med eksempeldata.')
    expect(container.textContent).toContain('Billederne af retterne er AI-genererede, ligesom i appen.')
  })
})

describe('arranging the final block’s collage', () => {
  const tile = (container: HTMLElement, id: string) => container.querySelector(`.e-wall [data-tile="${id}"]`) as HTMLElement

  beforeEach(() => {
    window.localStorage.clear()
    window.history.replaceState(null, '', '/?arrange')
    HTMLElement.prototype.setPointerCapture = () => {}
    HTMLElement.prototype.releasePointerCapture = () => {}
  })

  it('is not there without ?arrange: no panel, and the tiles rise in as usual', () => {
    window.history.replaceState(null, '', '/')
    const { container } = renderFinal()
    expect(screen.queryByRole('button', { name: 'Kopiér layout' })).toBeNull()
    expect(tile(container, 'familie').hasAttribute('data-reveal')).toBe(true)
  })

  it('moves a tile with the pointer, keeps the layout in this browser, copies it and resets it', async () => {
    const writes: string[] = []
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async (text: string) => void writes.push(text) } })
    const { container } = renderFinal()
    const familie = tile(container, 'familie')
    expect(familie.hasAttribute('data-reveal')).toBe(false)
    expect(familie.style.getPropertyValue('--x')).toBe('2.1')
    // The stage is 1440 x 960 px here, so 144 px across and 96 down is 10 % each way.
    ;(container.querySelector('.e-wall') as HTMLElement).getBoundingClientRect = () => ({ width: 1440, height: 960, left: 0, top: 0 }) as DOMRect
    fireEvent.pointerDown(familie, { clientX: 100, clientY: 100, pointerId: 1 })
    fireEvent.pointerMove(familie, { clientX: 244, clientY: 196, pointerId: 1 })
    fireEvent.pointerUp(familie, { clientX: 244, clientY: 196, pointerId: 1 })
    expect(familie.style.getPropertyValue('--x')).toBe('12.1')
    expect(familie.style.getPropertyValue('--y')).toBe('14.2')
    const saved = JSON.parse(window.localStorage.getItem('altid-final-layout') as string)
    expect(saved.wall.familie).toEqual({ x: 12.1, y: 14.2, w: 150, h: 250 })
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Kopiér layout' }))
    })
    expect(JSON.parse(writes[0]).wall.familie.x).toBe(12.1)
    expect(screen.getByRole('button', { name: 'Kopieret' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Nulstil' }))
    expect(familie.style.getPropertyValue('--x')).toBe('2.1')
    expect(window.localStorage.getItem('altid-final-layout')).toBeNull()
  })

  it('opens with the layout kept in this browser, and switches to the phone’s stage', () => {
    window.localStorage.setItem('altid-final-layout', JSON.stringify({ wall: { ...FINAL_LAYOUT.wall, familie: { x: 40, y: 40, w: 150, h: 250 } }, phone: FINAL_LAYOUT.phone }))
    const { container } = renderFinal()
    expect(tile(container, 'familie').style.getPropertyValue('--x')).toBe('40')
    const gallery = container.querySelector('.e-gallery') as HTMLElement
    expect(gallery.dataset.view).toBe('phone')
    fireEvent.click(screen.getByRole('button', { name: 'Computer' }))
    expect(gallery.dataset.view).toBe('wall')
  })
})

