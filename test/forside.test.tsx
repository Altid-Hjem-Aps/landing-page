import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, within } from '@testing-library/react'
import Home from '@/app/page'
import SeoBottomCta from '@/components/sections/BottomCta'
import { consentSentences } from 'altid-consent'
import { storeLink } from '@/lib/store-links'

// The launch front page, rendered whole. Boundaries faked: the Amplitude SDK
// (the nav's consent-gated events), the App Router, and the browser APIs jsdom
// lacks (matchMedia, sendBeacon).
vi.mock('@amplitude/analytics-browser', () => ({ track: vi.fn() }))
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => '/',
}))

beforeEach(() => {
  window.matchMedia = vi.fn().mockReturnValue({ matches: false }) as unknown as typeof window.matchMedia
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.clearAllMocks()
})

function renderHome() {
  const { container } = render(<Home />)
  return container
}

function allReadableText(root: HTMLElement): string {
  const attrs = Array.from(root.querySelectorAll('[alt],[aria-label],[title]')).flatMap((el) =>
    ['alt', 'aria-label', 'title'].map((a) => el.getAttribute(a) ?? ''),
  )
  return [root.textContent ?? '', ...attrs].join('\n')
}

describe('front page', () => {
  it('every in-page nav link has a section to land on', () => {
    const container = renderHome()
    const hrefs = Array.from(container.querySelectorAll('nav a[href^="#"]')).map((a) => a.getAttribute('href') as string)
    // Four services + Hent appen (desktop CTA and phone pill).
    expect(new Set(hrefs)).toEqual(new Set(['#okonomi', '#altid-mad', '#altid-energi', '#altid-forsikring', '#hent-appen']))
    for (const href of hrefs) {
      expect(container.querySelector(href), `no element for ${href}`).not.toBeNull()
    }
  })

  it('links the hero and bottom badges to the tracked store URLs and counts the click', async () => {
    const sendBeacon = vi.fn((url: string, data: Blob) => {
      void url
      void data
      return true
    })
    vi.stubGlobal('navigator', { ...navigator, sendBeacon })
    const container = renderHome()
    const hero = within(container.querySelector('#hent-appen') as HTMLElement)
    const bottom = within(container.querySelector('#hent') as HTMLElement)

    expect(hero.getByRole('link', { name: 'Hent i App Store' })).toHaveAttribute('href', storeLink('appstore'))
    expect(hero.getByRole('link', { name: 'Hent den på Google Play' })).toHaveAttribute('href', storeLink('play'))
    expect(bottom.getByRole('link', { name: 'Hent i App Store' })).toHaveAttribute('href', storeLink('appstore'))
    expect(bottom.getByRole('link', { name: 'Hent den på Google Play' })).toHaveAttribute('href', storeLink('play'))

    // jsdom cannot follow the store link; stop the navigation after React's
    // handler has run.
    container.addEventListener('click', (e) => e.preventDefault())
    fireEvent.click(hero.getByRole('link', { name: 'Hent den på Google Play' }))
    expect(sendBeacon).toHaveBeenCalledTimes(1)
    const [url, blob] = sendBeacon.mock.calls[0]
    expect(url).toBe('/api/forside/store-click')
    expect(blob.type).toBe('application/json')
    expect(JSON.parse(await blob.text())).toEqual({ store: 'play', position: 'hero' })
  })

  it('has no dashes, waitlist copy or services that are not in the app', () => {
    // The whole page, the Blog carousel included.
    // The newsletter box quotes the decided consent sentence word for word, and
    // that sentence names Altid Mobil as a sender. Everything else may not.
    const text = allReadableText(renderHome()).replace(consentSentences('hjem').all, '')
    for (const banned of ['\u2013', '\u2014', 'venteliste', 'én regning', 'Mobil', 'Alarm', 'Opladning', 'Kommer snart']) {
      expect(text, `"${banned}" on the page`).not.toContain(banned)
    }
    // The filtered Blog still shows the live categories (a typo in the list on
    // the page would empty it).
    expect(text).toContain('Billigste elselskab: se på gebyrerne')
    // The Blog icons of services that are not in the app.
    for (const icon of ['icon-mobil', 'icon-alarm', 'icon-opladning']) {
      expect(document.querySelector(`img[src*="${icon}"]`), `${icon} on the page`).toBeNull()
    }
  })

  it('offers the newsletter under the bottom badges, with no form anywhere else', () => {
    const container = renderHome()
    const bottom = container.querySelector('#hent') as HTMLElement
    expect(within(bottom).getByRole('heading', { name: 'Få nyheder fra Altid Hjem' })).toBeInTheDocument()
    const badge = within(bottom).getByRole('link', { name: 'Hent i App Store' })
    const form = bottom.querySelector('form') as HTMLFormElement
    expect(badge.compareDocumentPosition(form) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(container.querySelectorAll('form')).toHaveLength(1)
  })

  it('shows the Altid Mad savings footnote with its source link', () => {
    renderHome()
    const section = within(document.getElementById('altid-mad') as HTMLElement)
    expect(section.getByText(/Spar i gennemsnit 11\.207 kr\. om året på dagligvarer\*/)).toBeInTheDocument()
    const footnote = section.getByText(/^\*En gennemsnitlig husstand på fire personer/)
    const source = within(footnote).getByRole('link', { name: 'altidmad.dk' })
    expect(source).toHaveAttribute('href', 'https://altidmad.dk')
    expect(source).toHaveAttribute('target', '_blank')
  })
})

describe('the SEO pages\' closing section', () => {
  it('has the page\'s copy, the store badges and then the newsletter', () => {
    const { container } = render(<SeoBottomCta eyebrow="Linje" heading="Overskrift" subtitle="Sætning" />)
    const section = within(container.querySelector('#hent-appen') as HTMLElement)
    expect(section.getByRole('heading', { name: 'Overskrift' })).toBeInTheDocument()
    expect(section.getByText('Linje')).toBeInTheDocument()
    expect(section.getByText('Sætning')).toBeInTheDocument()
    const badge = section.getByRole('link', { name: 'Hent i App Store' })
    expect(badge).toHaveAttribute('href', storeLink('appstore'))
    expect(section.getByRole('link', { name: 'Hent den på Google Play' })).toHaveAttribute('href', storeLink('play'))
    const form = container.querySelector('form') as HTMLFormElement
    expect(badge.compareDocumentPosition(form) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })
})
