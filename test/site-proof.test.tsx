import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import Proof from '@/components/site/Proof'

// Named risk: the Mine / Fælles toggle looks real, so a toggle that does not change
// the screen, or does not say which side is on, is a broken promise.
describe('Proof', () => {
  it('Mine / Fælles switches the screen and says which side is on', () => {
    render(<Proof />)
    const mine = screen.getByRole('button', { name: 'Mine' })
    const shared = screen.getByRole('button', { name: 'Fælles' })
    expect(mine).toHaveAttribute('aria-pressed', 'true')
    expect(shared).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByRole('img', { name: /^Økonomi-fanen/ })).toBeInTheDocument()

    fireEvent.click(shared)

    expect(shared).toHaveAttribute('aria-pressed', 'true')
    expect(mine).toHaveAttribute('aria-pressed', 'false')
    expect(screen.queryByRole('img', { name: /^Økonomi-fanen/ })).toBeNull()
    // The bills tile always shows this screen too, so the toggle's own phone adds a second.
    expect(screen.getAllByRole('img', { name: /^Regninger-fanen/ })).toHaveLength(2)
  })
})
