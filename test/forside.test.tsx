import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { consentSentences } from 'altid-consent'
import Home from '@/app/page'
import BottomCta from '@/components/sections/BottomCta'

// The front page rendered whole. Boundaries faked: the Amplitude SDK, the App
// Router, the price API (fetch) and the browser APIs jsdom lacks.
vi.mock('@amplitude/analytics-browser', () => ({ track: vi.fn() }))
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => '/',
}))

// Literal on purpose: ALT-894's campaign links, not built from lib/store-links.
const APP_STORE = 'https://apps.apple.com/dk/app/altid-hjem/id6794330094?pt=129212732&ct=ah_1_altidhjem_dk&mt=8'
const PLAY =
  'https://play.google.com/store/apps/details?id=dk.altidhjem.app&referrer=utm_source%3Daltidhjem_dk%26utm_campaign%3Dah_1_altidhjem_dk'

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 503, json: async () => ({}) }))
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  )
  window.matchMedia = vi.fn().mockReturnValue({
    matches: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
  }) as unknown as typeof window.matchMedia
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.clearAllMocks()
})

function allReadableText(root: HTMLElement): string {
  const attrs = Array.from(root.querySelectorAll('[alt],[aria-label],[title]')).flatMap((el) =>
    ['alt', 'aria-label', 'title'].map((a) => el.getAttribute(a) ?? ''),
  )
  return [root.textContent ?? '', ...attrs].join('\n')
}

describe('front page', () => {
  it('has one h1 and the sections in the plan\'s order', async () => {
    const { container } = render(await Home())
    expect(Array.from(container.querySelectorAll('h1')).map((h) => h.textContent)).toEqual(['Hele hjemmet i én app'])
    const ids = Array.from(container.querySelectorAll('main > section[id]')).map((s) => s.id)
    const inOrder = ['okonomi', 'altid-mad', 'altid-energi', 'altid-forsikring', 'spoergsmaal', 'velkommen']
    expect(ids.filter((id) => inOrder.includes(id))).toEqual(inOrder)
  })

  it('every link in the nav lands on a section', async () => {
    const { container } = render(await Home())
    const nav = within(container.querySelector('nav') as HTMLElement)
    const targets = nav
      .getAllByRole('link')
      .map((a) => a.getAttribute('href') as string)
      .filter((href) => href.startsWith('/#'))
    expect(targets.length).toBeGreaterThan(4)
    for (const href of targets) expect(container.querySelector(href.slice(1)), href).not.toBeNull()
  })

  it('has store pills at the top and the bottom, with the exact links, and one target for "Hent appen"', async () => {
    const { container } = render(await Home())
    const appStore = within(container).getAllByRole('link', { name: 'Hent i App Store' })
    const play = within(container).getAllByRole('link', { name: 'Hent i Google Play' })
    expect(appStore.length).toBeGreaterThanOrEqual(2)
    expect(play.length).toBe(appStore.length)
    appStore.forEach((a) => expect(a).toHaveAttribute('href', APP_STORE))
    play.forEach((a) => expect(a).toHaveAttribute('href', PLAY))
    const anchors = container.querySelectorAll('#hent-appen')
    expect(anchors).toHaveLength(1)
    expect(within(anchors[0] as HTMLElement).getByRole('link', { name: 'Hent i App Store' })).toBeInTheDocument()
    expect(container.querySelector('#velkommen')?.contains(anchors[0])).toBe(true)
  })

  it('counts a pill click with a beacon and lets the navigation go ahead', async () => {
    const sendBeacon = vi.fn((url: string, data: Blob) => {
      void url
      void data
      return true
    })
    vi.stubGlobal('navigator', { ...navigator, sendBeacon })
    const { container } = render(await Home())
    let prevented = true
    container.addEventListener('click', (e) => {
      prevented = e.defaultPrevented
      e.preventDefault()
    })
    const velkommen = within(container.querySelector('#hent-appen') as HTMLElement)
    fireEvent.click(velkommen.getByRole('link', { name: 'Hent i Google Play' }))
    expect(prevented).toBe(false)
    const [url, blob] = sendBeacon.mock.calls[0]
    expect(url).toBe('/api/forside/store-click')
    expect(JSON.parse(await blob.text())).toEqual({ store: 'play', position: 'final' })
  })

  it('has no dashes, launch wording or waitlist copy', async () => {
    const { container } = render(await Home())
    // The newsletter box quotes the decided consent sentence word for word, and
    // that sentence names Altid Mobil as a sender.
    const text = allReadableText(container).replace(consentSentences('hjem').all, '')
    for (const banned of ['–', '—', 'venteliste', 'én regning', 'Kommer snart', 'Altid Alarm', 'Altid Opladning', 'Altid Mobil', 'Nordens']) {
      expect(text, `"${banned}" on the page`).not.toContain(banned)
    }
  })

  it('says the prices cannot be fetched when the price API is down, and the page still renders', async () => {
    const { container } = render(await Home())
    const energi = within(container.querySelector('#altid-energi') as HTMLElement)
    expect(energi.getByText(/Priserne kan ikke hentes lige nu/)).toBeInTheDocument()
    expect(energi.getByRole('link', { name: 'Se dagens elpriser' })).toHaveAttribute('href', '/hvornar-er-strommen-billigst')
  })

  it('has the newsletter under the bottom pills on the SEO pages', () => {
    const { container } = render(<BottomCta anchor={false} />)
    expect(container.querySelector('#hent-appen')).toBeNull()
    expect(screen.getByRole('heading', { name: 'Hent Altid Hjem' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Få nyheder fra Altid Hjem' })).toBeInTheDocument()
    const pill = screen.getByRole('link', { name: 'Hent i App Store' })
    expect(pill).toHaveStyle({ color: '#fff' })
    const form = container.querySelector('form') as HTMLFormElement
    expect(pill.compareDocumentPosition(form) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })
})

describe('the SEO pages\' closing section', () => {
  it('has the page\'s copy, the pills, the #hent-appen anchor and the newsletter', () => {
    const { container } = render(<BottomCta eyebrow="Linje" heading="Overskrift" subtitle="Sætning" />)
    const section = within(container.querySelector('#hent-appen') as HTMLElement)
    expect(section.getByRole('heading', { name: 'Overskrift' })).toBeInTheDocument()
    expect(section.getByText('Linje')).toBeInTheDocument()
    expect(section.getByText('Sætning')).toBeInTheDocument()
    expect(section.getByRole('link', { name: 'Hent i App Store' })).toHaveAttribute('href', APP_STORE)
    expect(section.getByRole('link', { name: 'Hent i Google Play' })).toHaveAttribute('href', PLAY)
    expect(container.querySelector('form')).not.toBeNull()
  })
})
