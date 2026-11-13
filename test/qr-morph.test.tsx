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

describe('the final block’s gallery', () => {
  it('is Thor’s Figma frame on a computer: every tile at his place, the screens without their beta badge', () => {
    const { container } = renderFinal()
    const tiles = Array.from(container.querySelectorAll<HTMLElement>('.e-tile[data-view="wall"]'))
    expect(tiles.map((t) => t.dataset.tile)).toEqual(['bamse', 'familie', 'maleri', 'droem', 'hjem', 'energi', 'besked', 'elbil', 'strand', 'madplan', 'tacos', 'okonomi'])
    const at = (id: string) => ['--x', '--y', '--w', '--h'].map((p) => Number((container.querySelector(`[data-view="wall"][data-tile="${id}"]`) as HTMLElement).style.getPropertyValue(p)))
    expect(at('strand')).toEqual([707, 635, 163, 200])
    expect(at('madplan')).toEqual([1136, 358, 160, 320])
    expect(at('besked')).toEqual([446.8, 130.1, 329, 160])
    const sources = tiles.map((tile) => decodeURIComponent(tile.querySelector('img')?.getAttribute('src') ?? ''))
    for (const screen of ['hjem-top', 'okonomi-top', 'mad-meal_plan']) {
      expect(sources.some((src) => src.includes(`${screen}-uden-beta`))).toBe(true)
      expect(sources.some((src) => src.includes(`${screen}.webp`))).toBe(false)
    }
    expect(sources.filter((src) => src.includes('/site/plates/'))).toHaveLength(1)
    for (const tile of container.querySelectorAll('[data-view="wall"].e-screen')) expect(tile.getAttribute('data-tone')).toBeTruthy()
    // The notification, word for word from his frame, is decoration; everything else is named.
    const note = container.querySelector('[data-view="wall"][data-tile="besked"]') as HTMLElement
    expect(note.getAttribute('aria-hidden')).toBe('true')
    expect(note.textContent).toBe('Altid HjemnuJeres faste udgifter er faldet med 380 kr. siden sidste måned!Se budget')
    const alts = tiles.filter((t) => t !== note).map((tile) => tile.querySelector('img')?.getAttribute('alt'))
    expect(alts.every(Boolean)).toBe(true)
    expect(new Set(alts).size).toBe(11)
    // His line, broken where he broke it.
    const line = container.querySelector('.e-line') as HTMLElement
    expect(line.textContent).toBe('Vi glæder os til at se jer. Appen er gratis at hente, og det er gratis at oprette en konto.')
    expect(line.querySelector('br')).not.toBeNull()
    // A phone: the middle four columns, four tiles over the text and four under it, all from the same set.
    const phone = Array.from(container.querySelectorAll<HTMLElement>('.e-tile[data-view="phone"]'))
    expect(phone.map((t) => t.dataset.tile)).toEqual(['maleri', 'hjem', 'madplan', 'familie', 'bamse', 'okonomi', 'energi', 'elbil'])
  })
})

describe('arranging the final block’s gallery', () => {
  const KEY = 'altid-final-layout-figma'
  const tile = (container: HTMLElement, id: string) => container.querySelector(`[data-view="wall"][data-tile="${id}"]`) as HTMLElement

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
    expect(tile(container, 'strand').hasAttribute('data-reveal')).toBe(true)
  })

  it('moves a tile in the stage’s design px, keeps it in this browser, copies and resets', async () => {
    const writes: string[] = []
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async (text: string) => void writes.push(text) } })
    const { container } = renderFinal()
    const strand = tile(container, 'strand')
    expect(strand.hasAttribute('data-reveal')).toBe(false)
    // The stage is drawn 720 px wide here, half its 1440 design px: 10 px on screen is 20.
    ;(container.querySelector('.e-wall') as HTMLElement).getBoundingClientRect = () => ({ width: 720, height: 460, left: 0, top: 0 }) as DOMRect
    fireEvent.pointerDown(strand, { clientX: 100, clientY: 100, pointerId: 1 })
    fireEvent.pointerMove(strand, { clientX: 110, clientY: 95, pointerId: 1 })
    fireEvent.pointerUp(strand, { clientX: 110, clientY: 95, pointerId: 1 })
    expect(strand.style.getPropertyValue('--x')).toBe('727')
    expect(strand.style.getPropertyValue('--y')).toBe('625')
    expect(JSON.parse(window.localStorage.getItem(KEY) as string).wall.strand).toEqual({ x: 727, y: 625, w: 163, h: 200 })
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Kopiér layout' }))
    })
    expect(JSON.parse(writes[0]).wall.strand.x).toBe(727)
    expect(screen.getByRole('button', { name: 'Kopieret' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Nulstil' }))
    expect(strand.style.getPropertyValue('--x')).toBe('707')
    expect(window.localStorage.getItem(KEY)).toBeNull()
  })

  it('opens with the layout kept in this browser and ignores the earlier galleries’', () => {
    window.localStorage.setItem('altid-final-layout-bevel', JSON.stringify({ wall: {}, phone: {} }))
    window.localStorage.setItem(KEY, JSON.stringify({ ...FINAL_LAYOUT, wall: { ...FINAL_LAYOUT.wall, strand: { x: 40, y: 40, w: 163, h: 200 } } }))
    const { container } = renderFinal()
    expect(tile(container, 'strand').style.getPropertyValue('--x')).toBe('40')
    expect(tile(container, 'bamse').style.getPropertyValue('--x')).toBe('249.5')
  })
})
