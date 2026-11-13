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
  it('is bevel’s eight columns of fourteen tiles, in four areas, each pairing life with the app', () => {
    const { container } = renderFinal()
    const tiles = Array.from(container.querySelectorAll<HTMLElement>('.e-tile[data-view="wall"]'))
    expect(tiles).toHaveLength(14)
    const at = (id: string) => {
      const t = container.querySelector(`[data-view="wall"][data-tile="${id}"]`) as HTMLElement
      return [Number(t.style.getPropertyValue('--col')), Number(t.style.getPropertyValue('--top')), Number(t.style.getPropertyValue('--h'))]
    }
    // Bevel's columns: two tiles of 230, three of 166, then four of 356, mirrored.
    const columns = Array.from({ length: 8 }, (_, c) => tiles.filter((t) => Number(t.style.getPropertyValue('--col')) === c + 1).map((t) => Number(t.style.getPropertyValue('--h'))))
    expect(columns).toEqual([[230, 230], [166, 166, 166], [356], [356], [356], [356], [166, 166, 166], [230, 230]])
    // Økonomi top left, Mad top right, Forsikring bottom left, Energi og Opladning bottom right.
    for (const id of ['maleri', 'okonomi', 'hjem', 'droem']) expect(at(id)[0]).toBeLessThanOrEqual(4)
    for (const id of ['madplan', 'familie', 'tacos', 'risotto']) expect(at(id)[0]).toBeGreaterThanOrEqual(5)
    for (const id of ['pige', 'forsikring', 'besked']) expect(at(id)[0]).toBeLessThanOrEqual(2)
    for (const id of ['energi', 'elpris', 'elbil']) expect(at(id)[0]).toBeGreaterThanOrEqual(7)
    const sources = tiles.map((tile) => decodeURIComponent(tile.querySelector('img')?.getAttribute('src') ?? ''))
    expect(sources.filter((src) => src.includes('/site/plates/'))).toHaveLength(2)
    expect(sources.some((src) => src.includes('forsikring-top'))).toBe(true)
    expect(sources.some((src) => src.includes('mad-meal_plan'))).toBe(true)
    const screens = Array.from(container.querySelectorAll('[data-view="wall"].e-screen'))
    expect(screens).toHaveLength(6)
    for (const tile of screens) expect(tile.getAttribute('data-tone')).toBeTruthy()
    // The drawn pieces are decoration; everything else is named.
    const drawn = tiles.filter((t) => t.getAttribute('aria-hidden') === 'true').map((t) => t.dataset.tile)
    expect(drawn).toEqual(['besked', 'elpris'])
    const alts = tiles.filter((t) => !drawn.includes(t.dataset.tile)).map((tile) => tile.querySelector('img')?.getAttribute('alt'))
    expect(alts.every(Boolean)).toBe(true)
    expect(new Set(alts).size).toBe(12)
    expect(container.querySelector('[data-tile="elpris"]')?.textContent).toBe('0,62 kr. pr. kWhBilligren elpris, kl. 17-18')
    expect(container.textContent).not.toContain('AI-genererede')
    // A phone: the middle four columns, Økonomi and Mad over the text, Forsikring and Energi under it.
    const phone = Array.from(container.querySelectorAll<HTMLElement>('.e-tile[data-view="phone"]'))
    const row = (below: boolean) => phone.filter((t) => (t.dataset.below === 'true') === below).map((t) => [t.dataset.tile, Number(t.style.getPropertyValue('--col'))])
    expect(row(false)).toEqual([['maleri', 3], ['hjem', 4], ['madplan', 5], ['familie', 6]])
    expect(row(true)).toEqual([['pige', 3], ['forsikring', 4], ['energi', 5], ['elbil', 6]])
  })
})

describe('arranging the final block’s gallery', () => {
  const KEY = 'altid-final-layout-bevel'
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
    expect(tile(container, 'pige').hasAttribute('data-reveal')).toBe(true)
  })

  it('moves a tile to another column and up or down, keeps it in this browser, copies and resets', async () => {
    const writes: string[] = []
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async (text: string) => void writes.push(text) } })
    const { container } = renderFinal()
    const pige = tile(container, 'pige')
    expect(pige.hasAttribute('data-reveal')).toBe(false)
    // Tiles 143 px wide here, so one column is 159 px across.
    pige.getBoundingClientRect = () => ({ width: 143, height: 230, left: 0, top: 0 }) as DOMRect
    fireEvent.pointerDown(pige, { clientX: 100, clientY: 100, pointerId: 1 })
    fireEvent.pointerMove(pige, { clientX: 100 + 2 * 159 + 20, clientY: 140, pointerId: 1 })
    fireEvent.pointerUp(pige, { clientX: 100 + 2 * 159 + 20, clientY: 140, pointerId: 1 })
    expect(pige.style.getPropertyValue('--col')).toBe('3')
    expect(pige.style.getPropertyValue('--top')).toBe('-159')
    expect(JSON.parse(window.localStorage.getItem(KEY) as string).wall.pige).toEqual({ col: 3, top: -159, h: 230 })
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Kopiér layout' }))
    })
    expect(JSON.parse(writes[0]).wall.pige.col).toBe(3)
    expect(screen.getByRole('button', { name: 'Kopieret' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Nulstil' }))
    expect(pige.style.getPropertyValue('--col')).toBe('1')
    expect(window.localStorage.getItem(KEY)).toBeNull()
  })

  it('opens with the layout kept in this browser and ignores the earlier galleries’', () => {
    window.localStorage.setItem('altid-final-layout-universes', JSON.stringify({ wall: {}, phone: {} }))
    window.localStorage.setItem(KEY, JSON.stringify({ ...FINAL_LAYOUT, wall: { ...FINAL_LAYOUT.wall, pige: { col: 4, top: 0, h: 230 } } }))
    const { container } = renderFinal()
    expect(tile(container, 'pige').style.getPropertyValue('--col')).toBe('4')
    expect(tile(container, 'maleri').style.getPropertyValue('--col')).toBe('1')
  })
})
