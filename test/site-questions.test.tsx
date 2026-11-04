import { afterEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Questions from '@/components/site/Questions'

// The four cards are the page's way into the sections. In the pinned deck only the
// card in front may take clicks and focus; anywhere else all four must stay in reach.

function stubDeck(matches: boolean) {
  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockReturnValue({ matches, addEventListener: vi.fn(), removeEventListener: vi.fn() }),
  )
}

const CARDS = [
  { question: '“Bruger vi for meget på takeaway?”', href: '#okonomi' },
  { question: 'Ikke mere “hvad skal vi spise?”', href: '#altid-mad' },
  { question: '“Hvornår skal opvasken sættes over?”', href: '#altid-energi' },
  { question: 'Alle jeres forsikringer samlet ét sted', href: '#altid-forsikring' },
]

const card = (question: string) =>
  screen.getByRole('heading', { level: 3, name: question }).closest('a') as HTMLAnchorElement

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('the fan', () => {
  it('links each exact question to its section, in page order', () => {
    stubDeck(true)
    render(<Questions />)
    expect(screen.getByRole('heading', { level: 2, name: 'Fire spørgsmål fra hverdagen' })).toBeInTheDocument()
    expect(screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual(
      CARDS.map((c) => c.question),
    )
    for (const { question, href } of CARDS) {
      expect(card(question)).toHaveAttribute('href', href)
    }
  })

  it('has only the focused card live at the start of the deck', () => {
    stubDeck(true)
    render(<Questions />)
    const [first, ...rest] = CARDS
    expect(card(first.question)).not.toHaveAttribute('inert')
    for (const { question } of rest) {
      expect(card(question)).toHaveAttribute('inert')
    }
  })

  it('keeps all four cards live when it is not a deck', () => {
    stubDeck(false)
    render(<Questions />)
    for (const { question } of CARDS) {
      expect(card(question)).not.toHaveAttribute('inert')
    }
  })
})
