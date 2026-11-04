import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import Proof from '@/components/site/Proof'

beforeEach(() => {
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      observe() {}
      disconnect() {}
    },
  )
})

describe('Proof', () => {
  // Risk: a bento tile says what it should not. Each line is the one Thor's spec gives.
  it('has the four tiles under one heading', () => {
    render(<Proof elpriser={null} />)
    expect(screen.getByRole('heading', { level: 2 }).textContent).toBe('Alt det, der fylder derhjemme. Samlet i én app.')
    for (const name of [
      'Hvornår skal opvasken sættes over?',
      'Alle jeres forsikringer samlet ét sted',
      'Bruger vi for meget på takeaway?',
      'Skat, hvornår skal vi på ferie igen?',
    ]) {
      expect(screen.getByRole('heading', { level: 3, name })).toBeInTheDocument()
    }
    expect(screen.getByRole('img', { name: /^Altid Forsikring spørger/ })).toBeInTheDocument()
  })

  // Risk: a price failure takes the tile down with it instead of saying so.
  it('says the prices cannot be fetched when there are none', () => {
    render(<Proof elpriser={null} />)
    expect(screen.getByText('Priserne kan ikke hentes lige nu')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Se siden med elpriser' })).toHaveAttribute('href', '/hvornar-er-strommen-billigst')
  })

  // Risk: the marquee reads every service out four times, or names something not in the app.
  it('reads the marquee once and names only what is in the app', () => {
    const { container } = render(<Proof elpriser={null} />)
    const sets = [...container.querySelectorAll('.pf-mq-set')]
    const read = sets.filter((set) => set.getAttribute('aria-hidden') !== 'true')
    expect(read).toHaveLength(1)
    const marquee = within(read[0] as HTMLElement)
    for (const name of ['Altid Mad', 'Altid Energi', 'Altid Forsikring']) {
      expect(marquee.getByRole('img', { name })).toBeInTheDocument()
    }
    expect(marquee.getByText('Økonomi')).toBeInTheDocument()
    expect(container.querySelector('.pf-feat')?.textContent).not.toMatch(/Mobil|Alarm|Opladning/)
  })

  it('carries the caption for the staged screens', () => {
    render(<Proof elpriser={null} />)
    expect(screen.getByText('Skærmbilleder fra appen med eksempeldata.')).toBeInTheDocument()
  })
})
