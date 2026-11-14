import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { renderToStaticMarkup } from 'react-dom/server'
import { consentSentences } from 'altid-consent'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Home, { metadata } from '@/app/page'
import { TESTIMONIALS } from '@/components/sections/Testimonials'
import { jsonLdScript, serializeForScript } from '@/components/site/jsonLd'

// The new front page, rendered whole. Faked at the boundary only: browser APIs jsdom
// lacks (IntersectionObserver, ResizeObserver, matchMedia, the dialog's modal methods), the
// App Router and the network.
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
const EKSTRA_BLADET = 'https://ekstrabladet.dk/forbrug/Teknologi/spar-stort-paa-dine-dagligvarer-ny-app-sammenligner-priser/11232767'
// The Psst bubble's line in the steps (copy.ts STEPS.psst): upcoming services, written and
// approved by Thor 13/11, so its "Snart" is not launch wording.
const PSST = ' vi lancerer løbende flere tjenester. Snart kommer mobil, opladning og alarm.'
// What runs by itself: the hero's press card float, bill lanes, orbit and two phones; the
// Energi offer's float; the bank logos; the story's two rows of dots.
const PIECES = 9
const ALL_RUNNING = Array<string>(PIECES).fill('true')
const ALL_STOPPED = Array<string>(PIECES).fill('false')

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
  // jsdom has no layout, so nothing ever resizes: the FAQ's scrollbar measures once on mount.
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  )
  // Nothing on the page may reach the network in a test; a test that expects a request stubs its own.
  vi.stubGlobal(
    'fetch',
    vi.fn(async (url: unknown) => {
      throw new Error(`unexpected fetch: ${String(url)}`)
    }),
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
  // jsdom has no layout. The nav asks what lies under it: the hero's light ground by default.
  document.elementsFromPoint = vi.fn(() => [document.querySelector('.h-title')].filter((el) => el !== null))
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
      'Hør, hvorfor over 4.000 danskere har appen',
      'Hvad finder du i appen?',
      'Fire trin til ét overblik',
      'På jeres side. Altid',
      'Jeres tal er jeres egne',
      'Fair, gennemsigtigt og billigt',
      'Ofte stillede spørgsmål',
      'Læs mere om Altid Hjem',
      'Hent Altid Hjem i dag',
      'Appen',
      'Læs mere',
      'Hjælp',
      'Juridisk',
    ])
  })

  it('has no banned word, no dash, no service outside the app and no invented proof', async () => {
    const { container } = render(await Home())
    const text = readableText(container).replace(consentSentences('hjem').all, '').replaceAll(PSST, '')
    expect(text).not.toMatch(/venteliste|waitlist|skriv dig op|kommer snart|snart|én regning|Altid Mobil|Altid Alarm|Altid Opladning|–|—/i)
    expect(text).not.toMatch(/Nordens Forsikringshus|Subaio|Spari\b/)
    // The App Store's own rating is the one exception, read live: no reviews, user counts or other stars.
    const rating = container.querySelector('.h-rating') as HTMLElement
    const stars = rating.querySelector('.h-stars') as HTMLElement
    expect(text.replace(rating.textContent as string, '').replace(stars.getAttribute('aria-label') as string, '')).not.toMatch(
      /stjerner|anmeldelse|brugere|medlemmer|bedømmelse/i,
    )
    expect(Array.from(container.querySelectorAll('[aria-label*="stars" i], [class*="star" i]'))).toEqual([rating.querySelector('.h-stars')])
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
      ['Tjenesterne', '#tjenesterne'],
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
    expect(stars.style.getPropertyValue('--fill')).toBe('90%')
  })

  it('links the four services by their plain names to their cards from the menu', async () => {
    const { container } = render(await Home())
    const sheet = within(container.querySelector('dialog') as HTMLElement)
    expect(sheet.getAllByRole('link', { hidden: true }).filter((a) => a.closest('ul')).map((a) => [a.textContent, a.getAttribute('href')])).toEqual([
      ['Tjenesterne', '#tjenesterne'],
      ['Økonomi', '#okonomi'],
      ['Mad', '#mad'],
      ['Energi', '#energi'],
      ['Forsikring', '#forsikring'],
      ['Kontakt', '/kontakt'],
    ])
  })

  it('lands every anchor link on a section that exists', async () => {
    const { container } = render(await Home())
    const hrefs = Array.from(container.querySelectorAll('a[href^="#"]')).map((a) => a.getAttribute('href') as string)
    expect(hrefs.length).toBeGreaterThan(10)
    for (const href of new Set(hrefs)) expect(container.querySelector(href), href).not.toBeNull()
  })

  it('sends the HTML finished: text, phones and cards are there before any script runs', async () => {
    const html = renderToStaticMarkup(await Home())
    expect(html).toContain('Hele hjemmets økonomi i én app')
    expect(html).toContain('Alle jeres forsikringer')
    expect(html).toContain('forsikring.webp')
    expect(html).toContain('Spar 11.207 kr. om')
    expect(html).toContain('året på dagligvarer*')
    expect(html).not.toMatch(/autoplay/i)
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
    expect(cards.map((c) => c.querySelector('.v-name')?.textContent)).toEqual(['Lone', 'Kenneth Knudsen', 'Magnus Svendsen', 'Michael', 'Mie'])
    for (const card of cards) {
      const own = TESTIMONIALS.find((t) => t.name === card.querySelector('.v-name')?.textContent)
      expect(card.querySelector('blockquote')?.textContent).toBe(own?.quote)
      expect(card.querySelector('.v-mark')).toHaveTextContent('“')
    }
    expect(slider.textContent).not.toMatch(/skrevet mig op|stjerne/i)
    expect(slider.querySelector('[aria-label*="stjerner"]')).toBeNull()
  })

  it('names the App Store award in the laurel', async () => {
    const { container } = render(await Home())
    const laurels = container.querySelectorAll('.p-laurel')
    expect(laurels).toHaveLength(1)
    expect(laurels[0]).toHaveTextContent('App of the DayFinance')
    expect(laurels[0].querySelectorAll('svg[aria-hidden="true"]')).toHaveLength(3)
  })

  it('links the blog posts to the SEO pages, as on the old front page', async () => {
    const { container } = render(await Home())
    const posts = Array.from(container.querySelectorAll('a[href^="/"]')).filter((a) => a.textContent?.includes('Læs mere'))
    expect(posts.length).toBeGreaterThan(0)
    const pages = new Set(readdirSync('app').filter((name) => !name.includes('.')).map((name) => `/${name}`))
    for (const post of posts) expect(pages).toContain(post.getAttribute('href'))
  })

  it('shows the Ekstra Bladet mention in the hero, without a date, as a link to the article', async () => {
    const { container } = render(await Home())
    const press = container.querySelector('#top .h-press') as HTMLElement
    expect(press).toHaveAttribute('href', EKSTRA_BLADET)
    expect(press).toHaveAttribute('target', '_blank')
    expect(press).toHaveAttribute('rel', 'noopener noreferrer')
    expect(within(press).getByRole('img', { name: 'Ekstra Bladet' })).toBeInTheDocument()
    expect(press).toHaveTextContent('Omtalt i Ekstra Bladet')
    expect(press.querySelector('.h-press-title')).toHaveTextContent('Spar stort på dine dagligvarer:Ny app sammenligner priser')
    expect(press).toHaveTextContent('(åbner i en ny fane)')
    expect(press).not.toHaveTextContent(/2026/)
  })
})

describe('what is in the app', () => {
  it('has the launch mail\'s seven blocks in its order, each with its own real screen', async () => {
    const { container } = render(await Home())
    const cards = Array.from(container.querySelectorAll('#tjenesterne .d-card'))
    expect(cards.map((c) => Array.from(c.querySelectorAll('h3 .d-line')).map((l) => l.textContent).join('\n'))).toEqual([
      'Se regningerne,\nfør de bliver trukket',
      '“Bruger vi for meget\npå takeaway?”',
      'Ikke mere\n“hvad skal vi spise?”',
      'Spar 11.207 kr. om\nåret på dagligvarer*',
      '“Hvornår skal opvasken sættes over?”',
      'Alle jeres forsikringer\nsamlet ét sted',
      '“Skat, hvornår skal vi\npå ferie igen?”',
    ])
    expect(cards.map((c) => c.id || null)).toEqual([null, 'okonomi', 'mad', null, 'energi', 'forsikring', null])
    const shots = cards.map((c) => c.querySelector('img.d-shot') as HTMLImageElement)
    expect(shots.map((img) => img.getAttribute('src'))).toEqual(
      ['regninger', 'takeaway', 'mad', 'indkob-liste', 'energi', 'forsikring', 'droem'].map((name) => expect.stringContaining(`site%2Fmail%2F${name}.webp`)),
    )
    for (const img of shots) expect(img.getAttribute('alt')).toBeTruthy()
  })

  it('shows Energi with the question, its screen and the first month free as one link to the signup', async () => {
    const { container } = render(await Home())
    const card = within(container.querySelector('#energi') as HTMLElement)
    expect(card.getByRole('heading', { level: 3 })).toHaveTextContent('“Hvornår skal opvasken sættes over?”')
    expect(card.getByRole('img', { name: /^Elprisen i appen/ })).toBeInTheDocument()
    const offer = card.getByRole('link', { name: /Bliv kunde hos Altid Energi/ })
    expect(offer).toHaveAttribute('href', 'https://tilmeld.altidenergi.dk/signup/altid-hjem')
    expect(offer).toHaveAttribute('target', '_blank')
    expect(offer).toHaveAttribute('rel', 'noopener noreferrer')
    expect(offer).toHaveTextContent('Første måned gratis')
  })

  it('makes no promise and names no insurer in the Forsikring block', async () => {
    const { container } = render(await Home())
    const block = container.querySelector('#forsikring') as HTMLElement
    const text = readableText(block)
    expect(text).toContain('Helt gratis og uforpligtende.')
    expect(text).not.toMatch(/snart|inden for|uger/i)
    // No price in its words; the screenshot's alt text reads out the screen's sample amounts.
    expect(block.textContent).not.toMatch(/kr\./)
    expect(text).not.toMatch(/Tryg|Alm\.? Brand|Codan|Alka|Topdanmark|Gjensidige/)
  })

  it('names the Mad saving as a plain figure, with its source linked to the report', async () => {
    const { container } = render(await Home())
    const source = container.querySelector('.d-card-source') as HTMLElement
    const card = source.closest('.d-card') as HTMLElement
    expect(card.querySelector('h3')).toHaveTextContent('Spar 11.207 kr. omåret på dagligvarer*')
    const link = within(source).getByRole('link', { name: 'Baseret på Altid Mad Q3-rapporten' })
    expect(link).toHaveAttribute('href', '/madrapport')
    // The only savings figure on the page: the one the report backs.
    expect(container.querySelectorAll('.d-card-source')).toHaveLength(1)
  })
})

describe('privacy', () => {
  it('states the facts plainly and links to the policy', async () => {
    const { container } = render(await Home())
    const section = container.querySelector('[data-b="privacy"]') as HTMLElement
    expect(section.textContent).toContain('Appen kan kun læse jeres transaktioner, aldrig flytte penge eller foretage betalinger.')
    expect(section.textContent).toContain('Vi sælger eller deler aldrig jeres bankoplysninger med tredjeparter.')
    expect(section.textContent).not.toMatch(/markedsføring/)
    expect(within(section).getByRole('link', { name: 'Læs privatlivspolitikken' })).toHaveAttribute('href', '/privatlivspolitik')
  })
})

describe('FAQ and JSON-LD', () => {
  const graph = (container: HTMLElement) => JSON.parse(container.querySelector('script[type="application/ld+json"]')?.innerHTML ?? '')['@graph']
  const questions = (container: HTMLElement) => Array.from(container.querySelectorAll('#spoergsmaal .q-item button'))
  const expanded = (container: HTMLElement) => questions(container).map((q) => q.getAttribute('aria-expanded'))

  describe('the answers', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    const wait = (ms: number) => act(() => vi.advanceTimersByTime(ms))

    it('opens the first answer by itself once the questions are in view, and one answer at a time', async () => {
      const { container } = render(await Home())
      expect(questions(container).length).toBeGreaterThan(5)
      expect(expanded(container).every((e) => e === 'false')).toBe(true)
      setOnScreen('#spoergsmaal', true)
      wait(649)
      expect(expanded(container)[0]).toBe('false')
      wait(1)
      expect(expanded(container)).toEqual(questions(container).map((_, i) => String(i === 0)))
      fireEvent.click(questions(container)[2])
      expect(expanded(container)).toEqual(questions(container).map((_, i) => String(i === 2)))
      fireEvent.click(questions(container)[2])
      expect(expanded(container).every((e) => e === 'false')).toBe(true)
    })

    it('leaves the first answer alone if the visitor got there first', async () => {
      const { container } = render(await Home())
      fireEvent.click(questions(container)[3])
      fireEvent.click(questions(container)[3])
      setOnScreen('#spoergsmaal', true)
      wait(5000)
      expect(expanded(container).every((e) => e === 'false')).toBe(true)
    })

    it('opens the first answer at once with reduced motion', async () => {
      reduced = true
      const { container } = render(await Home())
      expect(expanded(container)[0]).toBe('true')
    })
  })

  it('tells the JSON-LD exactly what it shows', async () => {
    const { container } = render(await Home())
    const faq = graph(container).find((n: { '@type': string }) => n['@type'] === 'FAQPage')
    const visible = Array.from(container.querySelectorAll('#spoergsmaal .q-item')).map((item) => ({
      q: item.querySelector('button span')?.textContent,
      a: item.querySelector('.q-answer p')?.textContent,
    }))
    expect(visible.length).toBeGreaterThan(5)
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

  it('links the report in its answer', async () => {
    const { container } = render(await Home())
    const faq = within(container.querySelector('#spoergsmaal') as HTMLElement)
    expect(faq.getByRole('link', { name: 'Altid Mad-rapporten', hidden: true })).toHaveAttribute('href', '/madrapport')
  })

  it('claims no saving but the sourced Mad figure', async () => {
    const { container } = render(await Home())
    const text = container.querySelector('#spoergsmaal')?.textContent ?? ''
    expect(text).not.toMatch(/langt over 1\.000/i)
    expect(text.match(/[\d.]+ kr\./g)).toEqual(['11.207 kr.'])
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

describe('reduced motion on the scroll-driven pieces', () => {
  it('leaves everything at rest', async () => {
    reduced = true
    const { container } = render(await Home())
    const zoomer = container.querySelector('.zoomer') as HTMLElement
    expect(zoomer.style.transform).toBe('none')
    expect(zoomer.style.borderRadius).toBe('0px')
    expect((container.querySelector('.ek-offer') as HTMLElement).style.scale).toBe('')
    expect(container.querySelector('[data-pan]')).toBeNull()
  })

  it('grows the Energi offer by scroll otherwise', async () => {
    const { container } = render(await Home())
    expect((container.querySelector('.ek-offer') as HTMLElement).style.scale).toMatch(/^\d(\.\d+)?$/)
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
  it('runs by default', async () => {
    const { container } = render(await Home())
    expect(runningPieces(container)).toEqual(ALL_RUNNING)
  })

  it('has no video and no soft gradient behind the hero', async () => {
    const { container } = render(await Home())
    expect(container.querySelector('video')).toBeNull()
    expect(readFileSync('app/site.css', 'utf8')).not.toMatch(/rgba\(var\(--/)
  })

  it('stops a piece off screen without touching the others, and resumes it', async () => {
    const { container } = render(await Home())
    setOnScreen('.w-mq', false)
    expect(container.querySelector('.w-mq')).toHaveAttribute('data-running', 'false')
    expect(container.querySelector('.h-orbit')).toHaveAttribute('data-running', 'true')
    expect(runningPieces(container).filter((r) => r === 'true')).toHaveLength(PIECES - 1)
    setOnScreen('.w-mq', true)
    expect(container.querySelector('.w-mq')).toHaveAttribute('data-running', 'true')
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

  it('follows a reduced-motion change after mount: nothing runs', async () => {
    const { container } = render(await Home())
    setReduced(true)
    expect(runningPieces(container)).toEqual(ALL_STOPPED)
    setReduced(false)
    expect(runningPieces(container)).toEqual(ALL_RUNNING)
  })
})

describe('the glass nav', () => {
  it('is light glass over the hero, turns dark over a dark panel and light again over a feature card', async () => {
    const { container } = render(await Home())
    const nav = container.querySelector('header.nav') as HTMLElement
    expect(nav).toHaveAttribute('data-on', 'light')
    vi.mocked(document.elementsFromPoint).mockReturnValue([container.querySelector('[data-b="privacy"] .x-title') as Element])
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
    expect(within(dialog).getByRole('link', { name: 'Forsikring' })).toHaveAttribute('href', '#forsikring')
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
    fireEvent.click(within(dialog).getByRole('link', { name: 'Mad' }))
    expect(dialog).not.toHaveAttribute('open')
  })
})
