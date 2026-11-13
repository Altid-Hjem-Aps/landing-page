import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import EnergiOffer from '@/components/site/EnergiOffer'
import FinalCta from '@/components/site/FinalCta'
import GetAppSticky from '@/components/site/GetAppSticky'
import { MotionPrefs } from '@/components/site/MotionPrefs'

// The front page's QR codes (Thor 13/11): the sticky "Hent appen" and the Energi offer turn into
// a QR card on a computer and are plain links elsewhere; the final block shows the one code.
// Faked at the boundary only: matchMedia, IntersectionObserver and ResizeObserver.

const SIGNUP = 'https://tilmeld.altidenergi.dk/signup/altid-hjem'

let computer: boolean
let observed: { element: Element; callback: IntersectionObserverCallback }[]

beforeEach(() => {
  computer = false
  observed = []
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
})

afterEach(() => {
  vi.unstubAllGlobals()
  document.body.innerHTML = ''
})

// The Ekstra Bladet card the sticky watches.
function renderSticky() {
  const press = document.createElement('a')
  press.className = 'h-press'
  document.body.append(press)
  return render(<GetAppSticky />)
}

function setPressInView(isIntersecting: boolean) {
  act(() => {
    for (const { element, callback } of observed) {
      if (element.matches('.h-press')) callback([{ isIntersecting } as IntersectionObserverEntry], {} as IntersectionObserver)
    }
  })
}

describe('the sticky "Hent appen"', () => {
  it('is a plain link to the one QR address on a phone or a tablet', () => {
    renderSticky()
    const link = screen.getByRole('link', { name: /Hent appen/ })
    expect(link.getAttribute('href')).toBe('/qr')
  })

  it('turns into the QR card on a computer, with focus on its close control, and back with Escape', () => {
    computer = true
    renderSticky()
    const button = screen.getByRole('button', { name: /Hent appen/ })
    expect(button.getAttribute('aria-expanded')).toBe('false')
    fireEvent.click(button)
    expect(button.getAttribute('aria-expanded')).toBe('true')
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Luk QR-koden' }))
    const card = screen.getByRole('group', { name: 'Hent appen' })
    const code = within(card).getByAltText('QR-kode til Altid Hjem i App Store og Google Play')
    expect(code.getAttribute('src')).toContain('/site/qr/app.svg')
    expect(card.textContent).toContain('Scan koden med din telefon')
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(button.getAttribute('aria-expanded')).toBe('false')
    expect(document.activeElement).toBe(button)
  })

  it('closes on a click outside', () => {
    computer = true
    renderSticky()
    const button = screen.getByRole('button', { name: /Hent appen/ })
    fireEvent.click(button)
    fireEvent.pointerDown(document.body)
    expect(button.getAttribute('aria-expanded')).toBe('false')
  })

  it('fades once Ekstra Bladet has scrolled past, comes back above it, and stays while open', () => {
    computer = true
    const { container } = renderSticky()
    const sticky = container.querySelector('.gs') as HTMLElement
    expect(sticky.dataset.shown).toBe('true')
    setPressInView(false)
    expect(sticky.dataset.shown).toBe('false')
    setPressInView(true)
    expect(sticky.dataset.shown).toBe('true')
    fireEvent.click(screen.getByRole('button', { name: /Hent appen/ }))
    setPressInView(false)
    expect(sticky.dataset.shown).toBe('true')
    fireEvent.click(screen.getByRole('button', { name: 'Luk QR-koden' }))
    expect(sticky.dataset.shown).toBe('false')
  })
})

describe('the Altid Energi offer in the Energi card', () => {
  it('is one link to the signup, in a new tab, on a phone or a tablet', () => {
    const { container } = render(<EnergiOffer />)
    const link = screen.getByRole('link')
    expect(link.getAttribute('href')).toBe(SIGNUP)
    expect(link.getAttribute('target')).toBe('_blank')
    expect(link.textContent).toContain('Bliv kunde hos Altid Energi')
    expect(link.textContent).toContain('Gebyrfri strøm til indkøbspris')
    expect(container.textContent).toContain('Første måned gratis')
    expect(container.textContent).toContain('100 % rabat på elabonnementet den første måned, når du bliver kunde via Altid Hjem.')
  })

  it('turns into the signup QR code on a computer, with a link for this computer', () => {
    computer = true
    render(<EnergiOffer />)
    fireEvent.click(screen.getByRole('button', { name: /Bliv kunde hos Altid Energi/ }))
    const card = screen.getByRole('group', { name: 'Bliv kunde hos Altid Energi' })
    expect(within(card).getByAltText('QR-kode til tilmelding hos Altid Energi').getAttribute('src')).toContain('/site/qr/altid-energi.svg')
    const here = within(card).getByRole('link', { name: 'Eller bliv kunde her' })
    expect(here.getAttribute('href')).toBe(SIGNUP)
    expect(here.getAttribute('target')).toBe('_blank')
  })
})

describe('the final block', () => {
  it('shows the one QR code and the app screens, each named once', () => {
    const { container } = render(
      <MotionPrefs>
        <FinalCta />
      </MotionPrefs>,
    )
    const code = screen.getByAltText('QR-kode til Altid Hjem i App Store og Google Play')
    expect(code.getAttribute('src')).toContain('/site/qr/app.svg')
    expect(container.querySelector('.e-qr')?.textContent).toBe('Scan koden med din telefon')
    expect(container.querySelector('img[src*="flatlay"]')).toBeNull()
    const named = Array.from(container.querySelectorAll('.e-screen img')).filter((img) => img.getAttribute('alt'))
    expect(named.map((img) => img.getAttribute('src'))).toHaveLength(6)
    expect(new Set(named.map((img) => img.getAttribute('alt'))).size).toBe(6)
    // Every other round is hidden from screen readers.
    for (const tile of container.querySelectorAll('.e-screen')) {
      const img = tile.querySelector('img') as HTMLImageElement
      if (!img.getAttribute('alt')) expect(tile.closest('[aria-hidden="true"]')).not.toBeNull()
    }
    expect(container.textContent).toContain('Skærmbilleder fra appen med eksempeldata.')
  })
})
