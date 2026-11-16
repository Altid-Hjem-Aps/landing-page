import { storeLink } from '@/lib/store-links'
import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import FinalCta from '@/components/site/FinalCta'
import EnergiOffer from '@/components/site/EnergiOffer'
import GetAppSticky from '@/components/site/GetAppSticky'
import { FINAL_LAYOUT } from '@/components/site/copy'
import { MotionPrefs } from '@/components/site/MotionPrefs'

// The front page's QR codes and links (Thor 13/11, fifth round): the QR code bottom right from
// the moment the hero's animation has scrolled past until the testimonials' slider arrives;
// Altid Energi's offer over the Energi card's phone; the final block's store pills, which come
// in from their icon and on a computer each open into their own store's QR code (Thor 15/11),
// and are store links elsewhere; the final block's collage.
// Faked at the boundary only: matchMedia, IntersectionObserver, ResizeObserver and sendBeacon.

const QR_ALT = 'QR-kode til Altid Hjem i App Store og Google Play'

let computer: boolean
let observed: { element: Element; callback: IntersectionObserverCallback }[]
let beacons: unknown[]
// The anonymous counts (lib/count.ts), apart from the store clicks above.
let counts: unknown[]

beforeEach(() => {
  computer = false
  observed = []
  beacons = []
  counts = []
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
  navigator.sendBeacon = ((url: string, body: unknown) => {
    if (url === '/api/forside/count') counts.push(body)
    else beacons.push(body)
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
// In the page's .site wrapper, where an opened QR card puts its own layer.
function renderOffer() {
  return render(
    <div className="site">
      <MotionPrefs>
        <article className="d-card" id="energi">
          <EnergiOffer />
        </article>
      </MotionPrefs>
    </div>,
  )
}

const renderFinal = () =>
  render(
    <div className="site">
      <MotionPrefs>
        <FinalCta />
      </MotionPrefs>
    </div>,
  )

describe('the sticky QR code', () => {
  it('is the one QR code with its title and line, and no button', () => {
    const card = renderSticky()
    // Its own copy of the one code, whose link says where it was scanned (/qr?src=sticky).
    expect(within(card).getByAltText(QR_ALT).getAttribute('src')).toContain('/site/qr/app-sticky.svg')
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
  const OFFER_TEXT = ['Bliv kunde hos Altid Energi', 'Gebyrfri strøm til indkøbspris', 'Første måned gratis', '100 % rabat på elabonnementet den første måned, når du bliver kunde via Altid Hjem.']

  it('is a link to the visitor’s app store, with its fine print, on a phone', () => {
    const { container } = renderOffer()
    // One per store; CSS shows the visitor's own (data-platform).
    const links = screen.getAllByRole('link')
    expect(links.map((l) => l.getAttribute('href'))).toEqual([storeLink('appstore'), storeLink('play')])
    for (const link of links) for (const text of OFFER_TEXT) expect(link.textContent).toContain(text)
    expect(container.querySelector('img[src*="qr"]')).toBeNull()
  })

  // Thor 15/11: on a computer it sent people to the App Store's web page; now it opens into the
  // one QR code for both stores, as the store pills open into theirs.
  // No "Kopiér link" on this card (Thor 15/11: it did not work for the one code for both stores).
  it('opens into the one QR code for both stores on a computer, with no copy button', () => {
    computer = true
    renderOffer()
    expect(screen.queryByRole('link')).toBeNull()
    const offer = screen.getByRole('button', { name: /Bliv kunde hos Altid Energi/ })
    for (const text of OFFER_TEXT) expect(offer.textContent).toContain(text)
    fireEvent.click(offer)
    expect(offer.getAttribute('aria-expanded')).toBe('true')
    const card = screen.getByRole('group', { name: QR_ALT })
    expect(within(card).getByAltText(QR_ALT).getAttribute('src')).toBe('/site/qr/app-energi.svg')
    expect(within(card).queryByRole('button', { name: 'Kopiér link' })).toBeNull()
    expect(within(card).getByRole('button', { name: 'Luk QR-koden' })).toBeInTheDocument()
    expect(beacons).toHaveLength(0)
  })

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
    expect(screen.queryByRole('group', { name: /^QR-kode til/ })).toBeNull()
  })

  it('come in from their icon the first time they are in view (Thor 15/11)', () => {
    renderFinal()
    const row = document.querySelector('.e-pills .store-row') as HTMLElement
    expect(row.dataset.enter).toBe('wait')
    setInView('.e-pills .store-row', true)
    expect(row.dataset.enter).toBe('go')
  })

  // Thor 15/11: on a computer each pill turns into its own store's QR code with "Kopiér link",
  // instead of the one shared code for both stores.
  it('open into their own store’s QR code on a computer, not counted, with focus on its close control, and back with Escape', () => {
    computer = true
    renderFinal()
    expect(screen.queryByRole('link', { name: /Hent i/ })).toBeNull()
    const play = screen.getByRole('button', { name: 'Hent i Google Play' })
    const appStore = screen.getByRole('button', { name: 'Hent i App Store' })
    fireEvent.click(play)
    // Not a store click, but counted as a QR card opened (the tracking pass, 15/11).
    expect(beacons).toHaveLength(0)
    expect(counts).toHaveLength(1)
    expect(play.getAttribute('aria-expanded')).toBe('true')
    expect(appStore.getAttribute('aria-expanded')).toBe('false')
    const card = screen.getByRole('group', { name: 'QR-kode til Google Play' })
    expect(play.getAttribute('aria-controls')).toBe(card.id)
    expect(document.activeElement).toBe(within(card).getByRole('button', { name: 'Luk QR-koden' }))
    expect(within(card).getByAltText('QR-kode til Altid Hjem i Google Play').getAttribute('src')).toBe('/site/qr/play.svg')
    expect(card.textContent).toContain('Scan koden med din telefon')
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(play.getAttribute('aria-expanded')).toBe('false')
    expect(document.activeElement).toBe(play)
  })

  it('show one code at a time, and close on the close control and on a click outside', () => {
    computer = true
    renderFinal()
    const appStore = screen.getByRole('button', { name: 'Hent i App Store' })
    const play = screen.getByRole('button', { name: 'Hent i Google Play' })
    fireEvent.click(appStore)
    fireEvent.click(play)
    expect(appStore.getAttribute('aria-expanded')).toBe('false')
    expect(play.getAttribute('aria-expanded')).toBe('true')
    fireEvent.click(within(screen.getByRole('group', { name: 'QR-kode til Google Play' })).getByRole('button', { name: 'Luk QR-koden' }))
    expect(play.getAttribute('aria-expanded')).toBe('false')
    expect(document.activeElement).toBe(play)
    fireEvent.click(appStore)
    fireEvent.pointerDown(document.body)
    expect(appStore.getAttribute('aria-expanded')).toBe('false')
  })

  it('close as soon as the page scrolls, as the card sits in its own layer over a blurred page', () => {
    computer = true
    renderFinal()
    const appStore = screen.getByRole('button', { name: 'Hent i App Store' })
    fireEvent.click(appStore)
    expect(document.querySelector('.pq-veil')?.getAttribute('data-open')).toBe('true')
    fireEvent.scroll(window)
    expect(appStore.getAttribute('aria-expanded')).toBe('false')
  })

  it('copy their own store’s tracked link, count it as a store click and say so', async () => {
    computer = true
    const writeText = vi.fn(async () => {})
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } })
    renderFinal()
    fireEvent.click(screen.getByRole('button', { name: 'Hent i App Store' }))
    const card = screen.getByRole('group', { name: 'QR-kode til App Store' })
    await act(async () => {
      fireEvent.click(within(card).getByRole('button', { name: 'Kopiér link' }))
    })
    expect(writeText).toHaveBeenCalledWith(storeLink('appstore'))
    expect(beacons).toHaveLength(1)
    expect(within(card).getByRole('status')).toHaveTextContent('Kopieret')
  })

  // Review 16/11: a browser that refuses the clipboard got no word and an unhandled rejection.
  it.each([
    ['refuses the write', { writeText: vi.fn(async () => Promise.reject(new Error('denied'))) }],
    ['has no clipboard', undefined],
  ])('say so and count nothing when the browser %s', async (_, clipboard) => {
    computer = true
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: clipboard })
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    renderFinal()
    fireEvent.click(screen.getByRole('button', { name: 'Hent i App Store' }))
    const card = screen.getByRole('group', { name: 'QR-kode til App Store' })
    await act(async () => {
      fireEvent.click(within(card).getByRole('button', { name: 'Kopiér link' }))
    })
    expect(beacons).toHaveLength(0)
    expect(within(card).getByRole('status')).toHaveTextContent('Kunne ikke kopiere')
    expect(error).toHaveBeenCalledWith('Kopiér link: the browser refused the clipboard', expect.any(Error))
    error.mockRestore()
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
    // A phone: four tiles only (Thor 15/11), two columns wide each, two over the text and two
    // under it, a photo and a screen in each row, all from the same set.
    const phone = Array.from(container.querySelectorAll<HTMLElement>('.e-tile[data-view="phone"]'))
    expect(phone.map((t) => t.dataset.tile)).toEqual(['familie', 'hjem', 'okonomi', 'strand'])
    expect(phone.map((t) => t.style.getPropertyValue('--span'))).toEqual(['2', '2', '2', '2'])
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
