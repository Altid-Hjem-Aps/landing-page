import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import Hero from '@/components/site/Hero'

vi.mock('@amplitude/analytics-browser', () => ({ track: vi.fn() }))

// Literal on purpose: the campaign links, not built from lib/store-links.
const APP_STORE = 'https://apps.apple.com/dk/app/altid-hjem/id6794330094?pt=129212732&ct=ah_1_altidhjem_dk&mt=8'
const PLAY =
  'https://play.google.com/store/apps/details?id=dk.altidhjem.app&referrer=utm_source%3Daltidhjem_dk%26utm_campaign%3Dah_1_altidhjem_dk'

describe('Hero', () => {
  // jsdom has no matchMedia. Hero reads it to pick the phone's timeline.
  beforeEach(() => {
    vi.stubGlobal('matchMedia', () => ({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() }))
  })
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('names the product in the page heading', () => {
    render(<Hero />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Hele hjemmet i én app')
  })

  // Wrong behaviour guarded: a hero pill that loses its campaign and stops being counted as this site's.
  it('links the first screen to both stores with the exact campaign links', () => {
    render(<Hero />)
    const hero = within(document.querySelector('#top') as HTMLElement)
    expect(hero.getByRole('link', { name: /App Store/ })).toHaveAttribute('href', APP_STORE)
    expect(hero.getByRole('link', { name: /Google Play/ })).toHaveAttribute('href', PLAY)
  })

  // Wrong behaviour guarded: the header loses the way to the stores when the nav is gone from the front page.
  it('has the logo and the link to the app in its own header', () => {
    render(<Hero />)
    expect(screen.getByRole('link', { name: 'Altid Hjem forside' })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: 'Hent appen' })).toBeInTheDocument()
  })

  // Wrong behaviour guarded: the three scenes exist only as motion, so a reader without it gets nothing.
  it('keeps the three words and their screens in the page for readers without motion', () => {
    render(<Hero />)
    for (const word of ['Forbind.', 'Se.', 'Slap af.']) {
      expect(screen.getByText(word)).toBeInTheDocument()
    }
    expect(screen.getAllByAltText(/Økonomi-fanen/).length).toBeGreaterThan(0)
    expect(screen.getAllByAltText(/Regninger-fanen/).length).toBeGreaterThan(0)
    expect(screen.getAllByAltText(/Hjem-fanen/).length).toBeGreaterThan(0)
  })

  // Wrong behaviour guarded: Thor's line breaks up or loses a part when it is split in two lines.
  it('states the line exactly, as one heading', () => {
    render(<Hero />)
    expect(screen.getByRole('heading', { level: 2 }).textContent).toBe('Ét overblik. Ét login. Hele hjemmet.')
  })

  // Wrong behaviour guarded: a card promises something else than the app does. "Kun læse" is the legal line.
  it('has the three cards with their headings, one of them on read only access', () => {
    render(<Hero />)
    expect(screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual([
      'Appen kan kun læse.',
      'Mad, strøm, forsikringer og økonomi.',
      'Se regningerne, før de bliver trukket.',
    ])
    expect(screen.getByText(/Den kan aldrig flytte penge/)).toBeInTheDocument()
  })

  // Wrong behaviour guarded: staged numbers shown without saying that they are staged.
  it('says the screens carry sample data', () => {
    render(<Hero />)
    expect(screen.getByText('Skærmbilleder fra appen med eksempeldata.')).toBeInTheDocument()
  })
})
