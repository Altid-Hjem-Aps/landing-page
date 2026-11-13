import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { renderToStaticMarkup } from 'react-dom/server'
import { consentSentences } from 'altid-consent'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Home, { metadata } from '@/app/page'
import { jsonLdScript, serializeForScript } from '@/components/site/jsonLd'

// The new front page, rendered whole. Faked at the boundary only: browser APIs jsdom
// lacks (IntersectionObserver, matchMedia, the dialog's modal methods) and the App Router.
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => '/',
}))
// The rating reads the App Store over the network (test/app-rating.test.tsx covers that).
vi.mock('@/components/site/AppRating', async (original) => {
  const { RatingLine } = await original<typeof import('@/components/site/AppRating')>()
  return { default: () => <RatingLine rating={{ average: 4.33333 }} users={4741} /> }
})
// The user count reads the admin snapshot over the network; lib/user-count's own test covers
// the rounding, so here it is a fixed count.
vi.mock('@/lib/user-count', async (original) => ({
  ...(await original<typeof import('@/lib/user-count')>()),
  readUserCount: async () => 4741,
}))

// Literal on purpose, not built from lib/store-links.
const APP_STORE = 'https://apps.apple.com/dk/app/altid-hjem/id6794330094?pt=129212732&ct=ah_1_altidhjem_dk&mt=8'
const PLAY =
  'https://play.google.com/store/apps/details?id=dk.altidhjem.app&referrer=utm_source%3Daltidhjem_dk%26utm_campaign%3Dah_1_altidhjem_dk'
const STAGED = 'Skærmbilleder fra appen med eksempeldata.'
const PAUSE = 'Sæt bevægelsen på pause'
const PLAY_MOTION = 'Start bevægelsen igen'
// The service row, the plates, the list.
const ALL_RUNNING = ['true', 'true', 'true']
const ALL_STOPPED = ['false', 'false', 'false']

type Observed = { element: Element; callback: IntersectionObserverCallback }

let observed: Observed[]
let reducedListeners: Set<() => void>
let reduced: boolean

function setOnScreen(selector: string, isIntersecting: boolean) {
  act(() => {
    for (const { element, callback } of observed) {
      if (element.matches(selector)) {
        callback([{ isIntersecting } as IntersectionObserverEntry], {} as IntersectionObserver)
      }
    }
  })
}

function setReduced(value: boolean) {
  reduced = value
  act(() => reducedListeners.forEach((listener) => listener()))
}

beforeEach(() => {
  observed = []
  reducedListeners = new Set()
  reduced = false
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
  window.matchMedia = ((query: string) => ({
    get matches() {
      return query.includes('reduced-motion') ? reduced : false
    },
    media: query,
    addEventListener: (_: string, listener: () => void) => {
      if (query.includes('reduced-motion')) reducedListeners.add(listener)
    },
    removeEventListener: (_: string, listener: () => void) => {
      reducedListeners.delete(listener)
    },
    addListener: () => {},
    removeListener: () => {},
  })) as unknown as typeof window.matchMedia
  HTMLMediaElement.prototype.play = vi.fn(async () => {})
  HTMLMediaElement.prototype.pause = vi.fn()
  // jsdom has no layout. The nav asks what lies under it: the hero's dark block by default.
  document.elementsFromPoint = vi.fn(() => [document.querySelector('.h-title')].filter((el) => el !== null))
  // The hero is light now: the dark blocks come further down.
  HTMLDialogElement.prototype.showModal = function showModal() {
    this.setAttribute('open', '')
  }
  HTMLDialogElement.prototype.close = function close() {
    this.removeAttribute('open')
  }
})

afterEach(() => {
  vi.unstubAllGlobals()
})

// One string per text node and attribute: textContent glues neighbouring elements together.
function readableStrings(root: HTMLElement): string[] {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  const texts: string[] = []
  while (walker.nextNode()) texts.push((walker.currentNode.textContent ?? '').trim())
  const attrs = Array.from(root.querySelectorAll('[alt],[aria-label],[title]')).flatMap((el) =>
    ['alt', 'aria-label', 'title'].map((a) => el.getAttribute(a) ?? ''),
  )
  return [...texts, ...attrs].filter(Boolean)
}

function readableText(root: HTMLElement): string {
  const attrs = Array.from(root.querySelectorAll('[alt],[aria-label],[title]')).flatMap((el) =>
    ['alt', 'aria-label', 'title'].map((a) => el.getAttribute(a) ?? ''),
  )
  return [root.textContent ?? '', ...attrs].join('\n')
}

const runningPieces = (container: HTMLElement) =>
  Array.from(container.querySelectorAll('[data-running]')).map((el) => el.getAttribute('data-running'))

describe('the page', () => {
  it('has one H1, and its sections in the order of the page it copies', async () => {
    const { container } = render(await Home())
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Hele hjemmets økonomi i én app')
    expect(Array.from(container.querySelectorAll('h2')).map((h) => h.textContent)).toEqual([
      'Samlet i én app',
      'Hør, hvorfor over 4.000 danskere har appen',
      'Se, hvor I står, før måneden er gået',
      'Ikke mere “hvad skal vi spise?”',
      'Og der er mere',
      'På jeres side. Altid',
      'Jeres tal er jeres egne',
      'Lavet med omhu til danske hjem',
      'Læs mere om Altid Hjem',
      'Spørgsmål og svar',
      'Hent Altid Hjem i dag',
      'Appen',
      'Læs mere',
      'Hjælp',
      'Juridisk',
    ])
  })

  it('has no banned word, no dash, no service outside the app and no invented proof', async () => {
    const { container } = render(await Home())
    const text = readableText(container).replace(consentSentences('hjem').all, '')
    expect(text).not.toMatch(/venteliste|waitlist|skriv dig op|kommer snart|snart|én regning|Altid Mobil|Altid Alarm|Altid Opladning|–|—/i)
    expect(text).not.toMatch(/Nordens Forsikringshus|Subaio|Spari\b/)
    // The App Store's own rating is the one exception, read live: no reviews, user counts or other stars.
    const rating = container.querySelector('.h-rating') as HTMLElement
    expect(text.replace(rating.textContent as string, '')).not.toMatch(
      /stjerner|anmeldelse|brugere|medlemmer|bedømmelse/i,
    )
    expect(Array.from(container.querySelectorAll('[aria-label*="stars" i], [class*="star" i]'))).toEqual([rating.querySelector('.h-stars')])
  })

  it('never says Mad alone, in visible text or alt text', async () => {
    const { container } = render(await Home())
    // The app's own tab says Mad only inside the screenshots. "Mad efter jeres smag" is the common word.
    const brandless = readableStrings(container).filter((text) => /(^|[^d] )Mad\b/.test(text))
    expect(brandless).toEqual(['Mad efter jeres smag'])
  })

  it('has every store pill on the exact campaign links, and one #hent-appen with pills in it', async () => {
    const { container } = render(await Home())
    const appStore = within(container).getAllByRole('link', { name: 'Hent i App Store', hidden: true })
    const play = within(container).getAllByRole('link', { name: 'Hent i Google Play', hidden: true })
    expect(appStore.length).toBeGreaterThanOrEqual(2)
    expect(play).toHaveLength(appStore.length)
    appStore.forEach((a) => expect(a).toHaveAttribute('href', APP_STORE))
    play.forEach((a) => expect(a).toHaveAttribute('href', PLAY))
    const anchors = container.querySelectorAll('#hent-appen')
    expect(anchors).toHaveLength(1)
    expect(within(anchors[0] as HTMLElement).getByRole('link', { name: 'Hent i App Store' })).toBeInTheDocument()
    expect(container.querySelector('#top #hent-appen')).toBeNull()
  })

  it('counts a final CTA pill under position bottom', async () => {
    const sendBeacon = vi.fn(async (url: string, data: Blob) => {
      void url
      void data
      return true
    })
    vi.stubGlobal('navigator', { ...navigator, sendBeacon })
    const { container } = render(await Home())
    container.addEventListener('click', (e) => e.preventDefault())
    fireEvent.click(within(container.querySelector('#hent-appen') as HTMLElement).getByRole('link', { name: 'Hent i App Store' }))
    expect(JSON.parse(await sendBeacon.mock.calls[0][1].text())).toEqual({ store: 'appstore', position: 'bottom' })
  })

  it('has one form, the newsletter, in the footer', async () => {
    const { container } = render(await Home())
    expect(container.querySelectorAll('form')).toHaveLength(1)
    const footer = within(container.querySelector('footer') as HTMLElement)
    expect(footer.getByRole('heading', { name: 'Få nyheder fra Altid Hjem' })).toBeInTheDocument()
    expect(footer.getByRole('textbox', { name: 'E-mail' })).toBeInTheDocument()
  })

  it('sends a filled-in newsletter form from the footer and thanks', async () => {
    const fetchMock = vi.fn(async () => new Response('{}', { status: 200 }))
    vi.stubGlobal('fetch', fetchMock)
    const { container } = render(await Home())
    const band = within(container.querySelector('footer') as HTMLElement)
    fireEvent.change(band.getByRole('textbox', { name: 'E-mail' }), { target: { value: 'qa@example.com' } })
    fireEvent.click(band.getByRole('checkbox'))
    fireEvent.click(band.getByRole('button', { name: 'Tilmeld' }))
    expect(await band.findByRole('status')).toHaveTextContent('Tak. Du hører fra os.')
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('points "Hent appen" at the one anchor, keeps the nav to its few links, and keeps Play marked for the Android order', async () => {
    const { container } = render(await Home())
    const nav = within(screen.getByRole('navigation', { name: 'Forside' }))
    expect(nav.getAllByRole('link').map((a) => [a.textContent, a.getAttribute('href')])).toEqual([
      ['Spørgsmål', '#spoergsmaal'],
      ['Kontakt', '/kontakt'],
      ['Hent appen', '#hent-appen'],
    ])
    const hero = within(container.querySelector('.h-pills') as HTMLElement)
    expect(hero.getByRole('link', { name: 'Hent i Google Play' })).toHaveClass('store-badge-play')
  })

  it('counts a hero pill click under its own position, and lets the navigation go ahead', async () => {
    const sendBeacon = vi.fn(async (url: string, data: Blob) => {
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
    fireEvent.click(within(container.querySelector('.h-pills') as HTMLElement).getByRole('link', { name: 'Hent i App Store' }))
    expect(prevented).toBe(false)
    const [url, blob] = sendBeacon.mock.calls[0]
    expect(url).toBe('/api/forside/store-click')
    expect(JSON.parse(await blob.text())).toEqual({ store: 'appstore', position: 'hero' })
  })

  it('shows the stars and the user count under the pills, the rating only in the stars\' name', async () => {
    const { container } = render(await Home())
    const rating = container.querySelector('#top .h-rating') as HTMLElement
    expect(rating).toHaveTextContent(/^\+4\.700 danskere har appen$/)
    const stars = within(rating).getByRole('img', { name: '4,3 ud af 5 stjerner i App Store' })
    expect(stars).toHaveClass('h-stars')
    expect(stars.style.getPropertyValue('--fill')).toBe('86.6666%')
  })

  it('links the four services by full name to their sections', async () => {
    const { container } = render(await Home())
    const row = within(container.querySelector('.w-mq') as HTMLElement)
    expect(row.getAllByRole('link').map((a) => [a.textContent, a.getAttribute('href')])).toEqual([
      ['Økonomi', '#okonomi'],
      ['Altid Mad', '#altid-mad'],
      ['Altid Energi', '#altid-energi'],
      ['Altid Forsikring', '#altid-forsikring'],
    ])
  })

  it('shows the staged sentence in every section with staged numbers', async () => {
    const { container } = render(await Home())
    const staged = Array.from(container.querySelectorAll('section')).filter((s) => s.querySelector('[data-staged="true"]'))
    expect(staged.length).toBeGreaterThanOrEqual(6)
    for (const section of staged) expect(section.textContent, section.getAttribute('data-b') ?? '').toContain(STAGED)
  })

  it('lands every anchor link on a section that exists', async () => {
    const { container } = render(await Home())
    const hrefs = Array.from(container.querySelectorAll('a[href^="#"]')).map((a) => a.getAttribute('href') as string)
    expect(hrefs.length).toBeGreaterThan(10)
    for (const href of new Set(hrefs)) expect(container.querySelector(href), href).not.toBeNull()
  })

  it('sends the HTML finished: text, phones and cards are there before any script runs', async () => {
    const html = renderToStaticMarkup(<Home />)
    expect(html).toContain('Hele hjemmets økonomi i én app')
    expect(html).toContain('Tjek jeres forsikringer')
    expect(html).toContain('Spar i gennemsnit 11.207 kr. om året på dagligvarer*')
    expect(html).not.toMatch(/autoplay/i)
  })

  it('tells that the plates are AI images in each section that shows plates', async () => {
    const { container } = render(await Home())
    for (const name of ['dark', 'love']) {
      expect(container.querySelector(`[data-b="${name}"]`)?.textContent, name).toContain('Billederne af retterne er AI-genererede, ligesom i appen.')
    }
  })

  it('ships no banned capture in public/site', async () => {
    const files = readdirSync(join(process.cwd(), 'public/site/app'))
    for (const banned of [/mad-flow-12/, /mad-savings/, /mad-flow-14/, /b-sent/, /b-welcome-3/, /b-tilbud/, /b-flow-6/, /b-forlob-before/, /^a-/]) {
      expect(files.filter((f) => banned.test(f)), String(banned)).toEqual([])
    }
  })
})

describe('the marquees', () => {
  it('are one list each for a screen reader and the tab key: the clone is hidden and out of the tab order', async () => {
    const { container } = render(await Home())
    const marquees = Array.from(container.querySelectorAll('.mq'))
    expect(marquees).toHaveLength(1)
    for (const marquee of marquees) {
      const [list, clone] = Array.from(marquee.querySelectorAll('.mq-list'))
      expect(clone).toHaveAttribute('aria-hidden', 'true')
      expect(clone.querySelectorAll('button,h3')).toHaveLength(0)
      // A phone taps whichever copy has scrolled into view, so the clone's links work.
      expect(Array.from(clone.querySelectorAll('a')).every((link) => link.getAttribute('tabindex') === '-1')).toBe(true)
      expect(Array.from(clone.querySelectorAll('img')).every((img) => img.getAttribute('alt') === '')).toBe(true)
      expect(list.querySelectorAll('li')).toHaveLength(clone.querySelectorAll('li').length)
    }
  })

  it('shows the testimonials in their own words, without stars or the sign-up quote', async () => {
    const { container } = render(await Home())
    const slider = within(container.querySelector('[data-b="proof"]') as HTMLElement).getByRole('region', { name: 'Udtalelser' })
    const cards = Array.from(slider.querySelectorAll('figure:not([aria-hidden])'))
    expect(cards.map((c) => c.querySelector('.v-name')?.textContent)).toEqual(['Lone', 'Magnus Svendsen', 'Michael'])
    for (const card of cards) expect(card.querySelector('blockquote')?.textContent).toMatch(/^“.+”$/)
    expect(slider.textContent).not.toMatch(/skrevet mig op|stjerne/i)
    expect(slider.querySelector('[aria-label*="stjerner"]')).toBeNull()
  })

  it('names the App Store award in the laurel', async () => {
    const { container } = render(await Home())
    const laurels = container.querySelectorAll('.p-laurel')
    expect(laurels).toHaveLength(1)
    expect(laurels[0]).toHaveTextContent('App of the DayApp Store')
    expect(laurels[0].querySelectorAll('svg[aria-hidden="true"]')).toHaveLength(3)
  })

  it('links the blog posts to the SEO pages, as on the old front page', async () => {
    const { container } = render(await Home())
    const posts = Array.from(container.querySelectorAll('a[href^="/"]')).filter((a) => a.textContent?.includes('Læs mere'))
    expect(posts.length).toBeGreaterThan(0)
    const pages = new Set(readdirSync('app').filter((name) => !name.includes('.')).map((name) => `/${name}`))
    for (const post of posts) expect(pages).toContain(post.getAttribute('href'))
  })

  it('shows the Ekstra Bladet mention with its date and a link to the article', async () => {
    const { container } = render(await Home())
    const press = container.querySelector('[data-b="press"]') as HTMLElement
    expect(press).toHaveTextContent('Omtalt i')
    expect(within(press).getByRole('img', { name: 'Ekstra Bladet' })).toBeInTheDocument()
    expect(press).toHaveTextContent('25. juli 2026')
    expect(press.querySelector('blockquote')).toHaveTextContent('“Spar stort på dine dagligvarer: Ny app sammenligner priser”')
    const link = within(press).getByRole('link', { name: 'Læs artiklen' })
    expect(link).toHaveAttribute('href', 'https://ekstrabladet.dk/forbrug/Teknologi/spar-stort-paa-dine-dagligvarer-ny-app-sammenligner-priser/11232767')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })
})

describe('the week of plates', () => {
  const week = () => within(document.querySelector('.plates') as HTMLElement)
  const selectedDay = () => week().getByRole('tab', { selected: true })
  const strip = (container: HTMLElement) => container.querySelector('.plates') as HTMLElement

  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  const wait = (ms: number) => act(() => vi.advanceTimersByTime(ms))

  it('has seven tabs with full day names, one selected, and its dish in the panel', async () => {
    render(await Home())
    const tabs = week().getAllByRole('tab')
    expect(tabs.map((t) => t.getAttribute('aria-label'))).toEqual(['Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag', 'Søndag'])
    expect(tabs.map((t) => t.textContent)).toEqual(['Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag', 'Søndag'])
    expect(selectedDay()).toHaveAttribute('aria-label', 'Tirsdag')
    expect(week().getByRole('tabpanel')).toHaveTextContent('Svamperisotto med brune champignon')
    expect(week().getByRole('tabpanel')).toHaveAttribute('aria-labelledby', selectedDay().id)
  })

  it('follows a swipe, stops advancing, and ignores a short drag or a page scroll', async () => {
    const { container } = render(await Home())
    const swipe = (from: number, to: number, down = 0) => {
      fireEvent.touchStart(strip(container), { touches: [{ clientX: from, clientY: 400 }] })
      fireEvent.touchEnd(strip(container), { changedTouches: [{ clientX: to, clientY: 400 + down }] })
    }
    swipe(300, 280)
    expect(selectedDay()).toHaveAttribute('aria-label', 'Tirsdag')
    swipe(300, 240, 200)
    expect(selectedDay()).toHaveAttribute('aria-label', 'Tirsdag')
    // A pinch: the second finger cancels the swipe.
    fireEvent.touchStart(strip(container), { touches: [{ clientX: 300, clientY: 400 }] })
    fireEvent.touchStart(strip(container), { touches: [{ clientX: 300, clientY: 400 }, { clientX: 100, clientY: 400 }] })
    fireEvent.touchEnd(strip(container), { changedTouches: [{ clientX: 100, clientY: 400 }] })
    expect(selectedDay()).toHaveAttribute('aria-label', 'Tirsdag')
    swipe(300, 200)
    expect(selectedDay()).toHaveAttribute('aria-label', 'Onsdag')
    swipe(200, 300)
    swipe(200, 300)
    expect(selectedDay()).toHaveAttribute('aria-label', 'Mandag')
    swipe(200, 300)
    expect(selectedDay()).toHaveAttribute('aria-label', 'Søndag')
    wait(10000)
    expect(selectedDay()).toHaveAttribute('aria-label', 'Søndag')
  })

  it('advances by itself and wraps around', async () => {
    render(await Home())
    wait(5000)
    expect(selectedDay()).toHaveAttribute('aria-label', 'Onsdag')
    expect(week().getByRole('tabpanel')).toHaveTextContent('Kyllingewok')
    wait(25000)
    expect(selectedDay()).toHaveAttribute('aria-label', 'Mandag')
  })

  it('stops advancing while paused, off screen, in a hidden tab or with reduced motion', async () => {
    render(await Home())
    fireEvent.click(screen.getByRole('button', { name: PAUSE }))
    wait(20000)
    expect(selectedDay()).toHaveAttribute('aria-label', 'Tirsdag')
    fireEvent.click(screen.getByRole('button', { name: PLAY_MOTION }))
    setOnScreen('.plates', false)
    wait(20000)
    expect(selectedDay()).toHaveAttribute('aria-label', 'Tirsdag')
    setOnScreen('.plates', true)
    setReduced(true)
    wait(20000)
    expect(selectedDay()).toHaveAttribute('aria-label', 'Tirsdag')
    setReduced(false)
    const visibility = vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('hidden')
    act(() => {
      document.dispatchEvent(new Event('visibilitychange'))
    })
    wait(20000)
    expect(selectedDay()).toHaveAttribute('aria-label', 'Tirsdag')
    visibility.mockRestore()
  })

  it('hover pauses without selecting, and leaving lets it go on', async () => {
    const { container } = render(await Home())
    fireEvent.pointerEnter(strip(container), { pointerType: 'mouse' })
    wait(20000)
    expect(selectedDay()).toHaveAttribute('aria-label', 'Tirsdag')
    fireEvent.pointerLeave(strip(container))
    wait(5000)
    expect(selectedDay()).toHaveAttribute('aria-label', 'Onsdag')
  })

  it('a manual pick selects the day and stops the advance for good', async () => {
    render(await Home())
    fireEvent.click(week().getByRole('tab', { name: 'Torsdag' }))
    expect(selectedDay()).toHaveAttribute('aria-label', 'Torsdag')
    expect(week().getByRole('tabpanel')).toHaveTextContent('Hjemmelavet pizza')
    wait(60000)
    expect(selectedDay()).toHaveAttribute('aria-label', 'Torsdag')
  })

  it('follows the tabs pattern on the keyboard, and a key counts as a manual pick', async () => {
    render(await Home())
    const tabbable = () => week().getAllByRole('tab').filter((t) => t.tabIndex === 0)
    expect(tabbable()).toHaveLength(1)
    expect(tabbable()[0]).toBe(selectedDay())
    selectedDay().focus()
    fireEvent.keyDown(selectedDay(), { key: 'ArrowRight' })
    expect(selectedDay()).toHaveAttribute('aria-label', 'Onsdag')
    expect(document.activeElement).toBe(selectedDay())
    fireEvent.keyDown(selectedDay(), { key: 'ArrowLeft' })
    fireEvent.keyDown(selectedDay(), { key: 'Home' })
    expect(selectedDay()).toHaveAttribute('aria-label', 'Mandag')
    fireEvent.keyDown(selectedDay(), { key: 'ArrowLeft' })
    expect(selectedDay()).toHaveAttribute('aria-label', 'Søndag')
    fireEvent.keyDown(selectedDay(), { key: 'ArrowRight' })
    expect(selectedDay()).toHaveAttribute('aria-label', 'Mandag')
    fireEvent.keyDown(selectedDay(), { key: 'End' })
    expect(selectedDay()).toHaveAttribute('aria-label', 'Søndag')
    expect(tabbable()).toEqual([selectedDay()])
    wait(60000)
    expect(selectedDay()).toHaveAttribute('aria-label', 'Søndag')
  })
})

describe('Økonomi, Altid Energi and Altid Forsikring', () => {
  it('has the three one-word cards, each with its real screen', async () => {
    const { container } = render(await Home())
    const cards = Array.from(container.querySelectorAll('.f-card'))
    expect(cards.map((c) => c.querySelector('h3')?.textContent)).toEqual(['Tilbage', 'Brugt', 'Regninger'])
    expect(cards.map((c) => c.querySelector('.ph-screen img')?.getAttribute('src'))).toEqual([
      expect.stringContaining('hjem-top'),
      expect.stringContaining('okonomi-top'),
      expect.stringContaining('regninger-top'),
    ])
  })

  it('shows Altid Energi with the question and its screens', async () => {
    const { container } = render(await Home())
    const card = within(container.querySelector('#altid-energi') as HTMLElement)
    expect(card.getByRole('heading', { level: 3 })).toHaveTextContent('“Hvornår skal opvasken sættes over?”')
    expect(card.getAllByRole('img')).toHaveLength(2)
  })

  it('makes no promise and names no insurer in the Altid Forsikring block', async () => {
    const { container } = render(await Home())
    const text = readableText(container.querySelector('#altid-forsikring') as HTMLElement)
    expect(text).toContain('Gratis og helt uforpligtende.')
    expect(text).not.toMatch(/snart|inden for|uger|kr\./i)
    expect(text).not.toMatch(/Tryg|Alm\.? Brand|Codan|Alka|Topdanmark|Gjensidige/)
  })
})

describe('the Altid Mad section', () => {
  it('reads the savings line as the app does, as a plain figure, with its footnote and report link', async () => {
    const { container } = render(await Home())
    const para = container.querySelector('.d-para') as HTMLElement
    expect(para.textContent).toContain('Spar i gennemsnit 11.207 kr. om året på dagligvarer*')
    expect(para.textContent).toContain('*En gennemsnitlig husstand på fire personer kan spare 11.207 kr. om året på dagligvarer med Altid Mad. Kilde: Altid Mad Q3-rapporten')
    const link = within(para).getByRole('link', { name: 'Altid Mad Q3-rapporten' })
    expect(link).toHaveAttribute('href', 'https://altidmad.dk/altid-mad-kvartalsrapport-q3.pdf')
    expect(link).toHaveAttribute('target', '_blank')
  })

  it('has four cards, each with its own phone showing a real capture, in the order asked for', async () => {
    const { container } = render(await Home())
    const cards = Array.from(container.querySelectorAll('.d-card'))
    expect(cards.map((c) => c.querySelector('h3')?.textContent)).toEqual([
      'En hel uge på få minutter',
      'Opskriften er lige ved hånden',
      '“Hvor handler vi billigst ind?”',
      'Indkøbslisten skriver sig selv',
    ])
    for (const card of cards) {
      expect(card.querySelector('.ph-screen img')?.getAttribute('src')).toContain('site%2Fapp%2Fmad-')
      expect(card.querySelector('.d-piece img')?.getAttribute('alt')).toBeTruthy()
    }
  })
})

describe('the list of small things', () => {
  const panel = () => within(document.querySelector('.m-grid') as HTMLElement).getByRole('tabpanel')
  const list = (container: HTMLElement) => container.querySelector('.m-grid') as HTMLElement
  const active = (container: HTMLElement) => within(list(container)).getAllByRole('tab').find((t) => t.getAttribute('aria-selected') === 'true') as HTMLElement

  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  const wait = (ms: number) => act(() => vi.advanceTimersByTime(ms))

  it('has the nine rows, and the staged sentence by the phone', async () => {
    const { container } = render(await Home())
    expect(within(list(container)).getAllByRole('tab').map((t) => t.querySelector('.m-row-title')?.textContent)).toEqual([
      'Drømme',
      'Ting til dig i dag',
      'Her brugte du mest',
      'Alle faste udgifter',
      'Din saldo hos Altid Energi',
      'Mad efter jeres smag',
      'Følg forsikringstjekket',
      'Mine og Fælles',
      'Indkøb undervejs',
    ])
    expect(panel().textContent).toContain(STAGED)
  })

  it('advances by itself, shows the screen, and stops when paused or off screen', async () => {
    const { container } = render(await Home())
    wait(6100)
    expect(active(container).textContent).toContain('Ting til dig i dag')
    expect(within(list(container)).getByAltText(/kortet 2 ting til dig i dag/)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: PAUSE }))
    wait(30000)
    expect(active(container).textContent).toContain('Ting til dig i dag')
    fireEvent.click(screen.getByRole('button', { name: PLAY_MOTION }))
    setOnScreen('.m-grid', false)
    wait(30000)
    expect(active(container).textContent).toContain('Ting til dig i dag')
    setOnScreen('.m-grid', true)
    wait(6100)
    expect(active(container).textContent).toContain('Her brugte du mest')
  })

  it('does not advance with reduced motion', async () => {
    const { container } = render(await Home())
    setReduced(true)
    wait(30000)
    expect(active(container).textContent).toContain('Drømme')
  })

  it('a manual pick stops the advance for good, on the keyboard too', async () => {
    const { container } = render(await Home())
    fireEvent.keyDown(active(container), { key: 'ArrowDown' })
    expect(active(container).textContent).toContain('Ting til dig i dag')
    expect(document.activeElement).toBe(active(container))
    wait(60000)
    expect(active(container).textContent).toContain('Ting til dig i dag')
    fireEvent.click(within(list(container)).getByRole('tab', { name: /Følg forsikringstjekket/ }))
    expect(panel()).toHaveAttribute('aria-labelledby', active(container).id)
    expect(within(list(container)).getByAltText(/Forløbet i Altid Forsikring/)).toBeInTheDocument()
  })

  it('a click stops the advance for good, even with focus elsewhere', async () => {
    const { container } = render(await Home())
    fireEvent.click(within(list(container)).getByRole('tab', { name: /Alle faste udgifter/ }))
    wait(60000)
    expect(active(container).textContent).toContain('Alle faste udgifter')
  })

  it('fetches a screen only when it is the current or the next one', async () => {
    const { container } = render(await Home())
    const screens = () => list(container).querySelectorAll('.m-screen').length
    expect(screens()).toBe(2)
    wait(6100)
    expect(screens()).toBe(3)
  })
})

describe('privacy', () => {
  it('states the facts plainly and links to the policy', async () => {
    const { container } = render(await Home())
    const section = container.querySelector('[data-b="privacy"]') as HTMLElement
    expect(section.textContent).toContain('Forbindelsen til jeres bank giver kun adgang til at læse oplysninger, og vi kan ikke flytte penge.')
    expect(section.textContent).toContain('Vi sælger ikke jeres bankoplysninger.')
    expect(section.textContent).not.toMatch(/markedsføring/)
    expect(within(section).getByRole('link', { name: 'Læs privatlivspolitikken' })).toHaveAttribute('href', '/privatlivspolitik')
  })
})

describe('FAQ and JSON-LD', () => {
  const graph = (container: HTMLElement) => JSON.parse(container.querySelector('script[type="application/ld+json"]')?.innerHTML ?? '')['@graph']

  it('has native disclosures with only the first open', async () => {
    const { container } = render(await Home())
    const items = Array.from(container.querySelectorAll('#spoergsmaal details'))
    expect(items.length).toBeGreaterThan(5)
    expect(items.map((d) => d.hasAttribute('open'))).toEqual(items.map((_, i) => i === 0))
  })

  it('tells the JSON-LD exactly what it shows', async () => {
    const { container } = render(await Home())
    const faq = graph(container).find((n: { '@type': string }) => n['@type'] === 'FAQPage')
    const visible = Array.from(container.querySelectorAll('#spoergsmaal details')).map((d) => ({
      q: d.querySelector('summary')?.textContent,
      a: d.querySelector('p')?.textContent,
    }))
    expect(faq.mainEntity.map((q: { name: string; acceptedAnswer: { text: string } }) => ({ q: q.name, a: q.acceptedAnswer.text }))).toEqual(visible)
  })

  it('describes the company and the app, with no rating and no offer', async () => {
    const { container } = render(await Home())
    expect(graph(container).map((n: { '@type': string }) => n['@type'])).toEqual(['Organization', 'MobileApplication', 'FAQPage'])
    const raw = container.querySelector('script[type="application/ld+json"]')?.innerHTML ?? ''
    expect(raw).not.toMatch(/aggregateRating|offers/)
  })

  it('escapes a < in the script so it cannot end the tag', async () => {
    const serialized = serializeForScript({ a: '</script><b>' })
    expect(serialized).not.toContain('<')
    expect(JSON.parse(serialized)).toEqual({ a: '</script><b>' })
    expect(JSON.parse(jsonLdScript())['@graph']).toHaveLength(3)
  })

  it('links the report and the delete page in their answers, and does not say the bank thing twice', async () => {
    const { container } = render(await Home())
    const faq = within(container.querySelector('#spoergsmaal') as HTMLElement)
    expect(faq.getByRole('link', { name: 'læse hele rapporten her', hidden: true })).toHaveAttribute('href', 'https://altidmad.dk/altid-mad-kvartalsrapport-q3.pdf')
    expect(faq.getByRole('link', { name: 'her på siden', hidden: true })).toHaveAttribute('href', '/slet-konto')
    const questions = Array.from(container.querySelectorAll('#spoergsmaal summary')).map((s) => s.textContent)
    expect(questions).toContain('Hvad kan min partner se?')
    expect(questions).not.toContain('Kan jeg bruge appen uden at forbinde min bank?')
    expect(questions).toContain('Skal jeg forbinde min bank?')
  })

  it('never makes the promises the old answers did', async () => {
    const { container } = render(await Home())
    const text = container.querySelector('#spoergsmaal')?.textContent ?? ''
    expect(text).not.toMatch(/langt over 1\.000|det klarer vi|opsige/i)
    expect(text).toMatch(/Din partner ser aldrig dine konti, saldi eller posteringer/)
  })

  it('has full metadata with no launch wording', async () => {
    expect(metadata.title).toBe('Altid Hjem: hele hjemmets økonomi i én app')
    const og = metadata.openGraph as { title: string; images: { url: string; alt: string }[] }
    const twitter = metadata.twitter as { card: string; images: unknown[] }
    expect(og.title).toBe(metadata.title)
    expect(og.images[0].url).toBe('/opengraph-image.png')
    expect(twitter.card).toBe('summary_large_image')
    expect(twitter.images).toHaveLength(1)
    expect(JSON.stringify(metadata)).not.toMatch(/snart|venteliste|én regning|lancer/i)
  })
})

describe('the QR card', () => {
  const card = () => screen.getByRole('complementary', { name: 'Hent appen med din telefon', hidden: true })

  it('belongs to the hero, with both codes, each named for its store', async () => {
    const { container } = render(await Home())
    expect((container.querySelector('#top') as HTMLElement).contains(card())).toBe(true)
    expect(within(card()).getByAltText('QR-kode til Altid Hjem i App Store').getAttribute('src')).toContain('qr/app-store.svg')
    expect(within(card()).getByAltText('QR-kode til Altid Hjem i Google Play').getAttribute('src')).toContain('qr/google-play.svg')
    expect(card().textContent).toContain('Scan koden med din telefon')
  })

  it('fades out with scrolling and is gone by 900 px, as measured on the reference', async () => {
    render(await Home())
    const element = card()
    const scrollTo = (y: number) => {
      vi.stubGlobal('scrollY', y)
      act(() => {
        window.dispatchEvent(new Event('scroll'))
      })
    }
    scrollTo(0)
    expect(element.style.opacity).toBe('1')
    scrollTo(900)
    expect(element.style.visibility).toBe('hidden')
    scrollTo(0)
    expect(element.style.visibility).toBe('visible')
  })
})

describe('reduced motion on the scroll-driven pieces', () => {
  it('leaves everything at rest', async () => {
    reduced = true
    const { container } = render(await Home())
    expect((container.querySelector('.rings') as HTMLElement).style.getPropertyValue('--ring-p')).toBe('0.5')
    expect((container.querySelector('.f-float') as HTMLElement).style.transform).toBe('')
    expect(container.querySelector('[data-pan]')).toBeNull()
  })
})

describe('the auto-advancing tabs while someone is using them', () => {
  const selected = (container: HTMLElement, root: string) => container.querySelector(`${root} [role="tab"][aria-selected="true"]`) as HTMLElement
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it.each(['.plates', '.m-list'])('%s holds while focus is inside and goes on after blur', async (root) => {
    const { container } = render(await Home())
    const first = selected(container, root)
    fireEvent.focus(first)
    act(() => vi.advanceTimersByTime(30000))
    expect(selected(container, root)).toBe(first)
    fireEvent.blur(first)
    act(() => vi.advanceTimersByTime(30000))
    expect(selected(container, root)).not.toBe(first)
  })

  it.each(['.plates', '.m-grid'])('%s: a touch does not count as hovering', async (root) => {
    const { container } = render(await Home())
    const first = selected(container, root)
    const area = (first.closest(root) as HTMLElement)
    fireEvent.pointerEnter(area, { pointerType: 'touch' })
    act(() => vi.advanceTimersByTime(30000))
    expect(selected(container, root)).not.toBe(first)
  })
})

describe('the list on a phone', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('stops advancing once a finger has touched it, so a swipe is not pulled back', async () => {
    const { container } = render(await Home())
    const first = container.querySelector('.m-list [role="tab"][aria-selected="true"]') as HTMLElement
    fireEvent.pointerDown(first, { pointerType: 'touch' })
    act(() => vi.advanceTimersByTime(30000))
    expect(container.querySelector('.m-list [role="tab"][aria-selected="true"]')).toBe(first)
  })
})

describe('the phone header button', () => {
  it('links to both stores with the campaign and counts the click under position nav', async () => {
    const beacon = vi.fn(() => true)
    vi.stubGlobal('navigator', Object.assign(Object.create(navigator), { sendBeacon: beacon }))
    const { container } = render(await Home())
    const ios = container.querySelector('.nav-get .for-appstore') as HTMLAnchorElement
    const play = container.querySelector('.nav-get .for-play') as HTMLAnchorElement
    expect(ios).toHaveAttribute('href', APP_STORE)
    expect(play).toHaveAttribute('href', PLAY)
    ios.addEventListener('click', (event) => event.preventDefault())
    fireEvent.click(ios)
    const [url, body] = beacon.mock.calls[0] as unknown as [string, Blob]
    expect(url).toBe('/api/forside/store-click')
    expect(JSON.parse(await body.text())).toEqual({ store: 'appstore', position: 'nav' })
  })

  it('shows once the hero store button has scrolled up out of view', async () => {
    const { container } = render(await Home())
    const get = container.querySelector('.nav-get') as HTMLElement
    expect(get).toHaveAttribute('data-shown', 'false')
    act(() => {
      for (const { element, callback } of observed) {
        if (element.matches('[data-hero-store]')) {
          callback([{ isIntersecting: false, boundingClientRect: { top: -200 } } as IntersectionObserverEntry], {} as IntersectionObserver)
        }
      }
    })
    expect(get).toHaveAttribute('data-shown', 'true')
  })
})

describe('motion', () => {
  it('the control steps aside while nothing that runs is on screen', async () => {
    render(await Home())
    const control = screen.getByRole('button', { name: PAUSE })
    expect(control).toHaveAttribute('data-idle', 'false')
    setOnScreen('[data-running]', false)
    expect(control).toHaveAttribute('data-idle', 'true')
    setOnScreen('.plates', true)
    expect(control).toHaveAttribute('data-idle', 'false')
  })

  it('runs by default', async () => {
    const { container } = render(await Home())
    expect(runningPieces(container)).toEqual(ALL_RUNNING)
  })

  it('has one control: it pauses every piece, and pressing again starts them', async () => {
    const { container } = render(await Home())
    expect(screen.getAllByRole('button', { name: PAUSE })).toHaveLength(1)
    fireEvent.click(screen.getByRole('button', { name: PAUSE }))
    expect(runningPieces(container)).toEqual(ALL_STOPPED)
    fireEvent.click(screen.getByRole('button', { name: PLAY_MOTION }))
    expect(runningPieces(container)).toEqual(ALL_RUNNING)
  })

  it('has no video and no soft gradient behind the hero', async () => {
    const { container } = render(await Home())
    expect(container.querySelector('video')).toBeNull()
    expect(readFileSync('app/site.css', 'utf8')).not.toMatch(/rgba\(var\(--/)
  })

  it('a pause survives scrolling away and back', async () => {
    const { container } = render(await Home())
    fireEvent.click(screen.getByRole('button', { name: PAUSE }))
    setOnScreen('.plates', false)
    setOnScreen('.plates', true)
    expect(runningPieces(container)).toEqual(ALL_STOPPED)
  })

  it('stops a piece off screen without touching the others, and resumes it', async () => {
    const { container } = render(await Home())
    setOnScreen('.plates', false)
    expect(container.querySelector('.plates')).toHaveAttribute('data-running', 'false')
    expect(container.querySelector('.w-mq')).toHaveAttribute('data-running', 'true')
    setOnScreen('.plates', true)
    expect(container.querySelector('.plates')).toHaveAttribute('data-running', 'true')
  })

  it('stops everything in a hidden tab', async () => {
    const { container } = render(await Home())
    const visibility = vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('hidden')
    act(() => {
      document.dispatchEvent(new Event('visibilitychange'))
    })
    expect(runningPieces(container)).toEqual(ALL_STOPPED)
    visibility.mockRestore()
    act(() => {
      document.dispatchEvent(new Event('visibilitychange'))
    })
    expect(runningPieces(container)).toEqual(ALL_RUNNING)
  })

  it('follows a reduced-motion change after mount: nothing runs and no control is left', async () => {
    const { container } = render(await Home())
    setReduced(true)
    expect(runningPieces(container)).toEqual(ALL_STOPPED)
    expect(screen.queryByRole('button', { name: PAUSE })).toBeNull()
    setReduced(false)
    expect(runningPieces(container)).toEqual(ALL_RUNNING)
  })
})

describe('the glass nav', () => {
  it('is light glass over the hero, turns dark over a dark block and light again over a card in it', async () => {
    const { container } = render(await Home())
    const nav = container.querySelector('header.nav') as HTMLElement
    expect(nav).toHaveAttribute('data-on', 'light')
    vi.mocked(document.elementsFromPoint).mockReturnValue([container.querySelector('.d-head') ?? (container.querySelector('#altid-mad') as Element)])
    fireEvent.scroll(window)
    await waitFor(() => expect(nav).toHaveAttribute('data-on', 'dark'))
    vi.mocked(document.elementsFromPoint).mockReturnValue([container.querySelector('.d-card') as Element])
    fireEvent.scroll(window)
    await waitFor(() => expect(nav).toHaveAttribute('data-on', 'light'))
  })
})

describe('the nav sheet', () => {
  it('opens from the burger with the anchors and store pills, and closes by its named button', async () => {
    const { container } = render(await Home())
    const dialog = container.querySelector('dialog') as HTMLDialogElement
    expect(dialog).not.toHaveAttribute('open')
    fireEvent.click(screen.getByRole('button', { name: 'Åbn menu' }))
    expect(dialog).toHaveAttribute('open')
    expect(within(dialog).getByRole('link', { name: 'Altid Forsikring' })).toHaveAttribute('href', '#altid-forsikring')
    expect(within(dialog).getByRole('link', { name: 'Hent i App Store' })).toHaveAttribute('href', APP_STORE)
    fireEvent.click(within(dialog).getByRole('button', { name: 'Luk menu' }))
    expect(dialog).not.toHaveAttribute('open')
  })

  it('takes focus itself on opening, so a tap draws no ring on the close button', async () => {
    const { container } = render(await Home())
    fireEvent.click(screen.getByRole('button', { name: 'Åbn menu' }))
    expect(document.activeElement).toBe(container.querySelector('dialog'))
  })

  it('closes when a link in it is followed', async () => {
    const { container } = render(await Home())
    const dialog = container.querySelector('dialog') as HTMLDialogElement
    fireEvent.click(screen.getByRole('button', { name: 'Åbn menu' }))
    fireEvent.click(within(dialog).getByRole('link', { name: 'Altid Mad' }))
    expect(dialog).not.toHaveAttribute('open')
  })
})
