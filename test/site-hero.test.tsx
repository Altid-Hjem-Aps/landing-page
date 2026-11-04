import { describe, expect, it, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import Hero from '@/components/site/Hero'

vi.mock('@amplitude/analytics-browser', () => ({ track: vi.fn() }))

// Literal on purpose: the campaign links, not built from lib/store-links.
const APP_STORE = 'https://apps.apple.com/dk/app/altid-hjem/id6794330094?pt=129212732&ct=ah_1_altidhjem_dk&mt=8'
const PLAY =
  'https://play.google.com/store/apps/details?id=dk.altidhjem.app&referrer=utm_source%3Daltidhjem_dk%26utm_campaign%3Dah_1_altidhjem_dk'

describe('Hero', () => {
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

  // Wrong behaviour guarded: the three scenes exist only as motion, so a reader without it gets nothing.
  it('keeps the three words and their captions in the page for readers without motion', () => {
    render(<Hero />)
    for (const text of [
      'Forbind.',
      'Forbind banken sikkert med MitID.',
      'Se.',
      'Se regningerne, før de bliver trukket.',
      'Slap af.',
      'Så ved I, hvad der er tilbage.',
    ]) {
      expect(screen.getByText(text)).toBeInTheDocument()
    }
  })

  // Wrong behaviour guarded: word by word fading breaks up or drops part of Thor's line.
  it('states the line exactly, as one heading', () => {
    render(<Hero />)
    expect(screen.getByRole('heading', { level: 2 }).textContent).toBe('Ét overblik. Ét login. Hele hjemmet.')
  })
})
