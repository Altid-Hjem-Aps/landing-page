import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import LiveSavingsStat from '@/components/LiveSavingsStat'
import { liveSavings } from '@/lib/liveSavings'
import { currentSavings, __resetForTests } from '@/lib/savingsTicker'

// The hero stat's contract, minus the animation: it must render the SHARED
// ticker value (the one-number invariant with SavingsCounter) and the exact
// live value under reduced motion. jsdom has no IntersectionObserver, so the
// component's fallback subscribes immediately — which is what these tests use.

describe('LiveSavingsStat', () => {
  beforeEach(() => {
    __resetForTests()
  })
  afterEach(() => {
    __resetForTests()
    vi.unstubAllGlobals()
    vi.clearAllMocks()
  })

  it('renders the shared ticker value on mount', () => {
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: false }))
    render(<LiveSavingsStat />)
    const expected = currentSavings()
    expect(screen.getByText(`${expected.toLocaleString('da-DK')} kr.`)).toBeInTheDocument()
  })

  it('shows the exact live number under reduced motion', () => {
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: true }))
    render(<LiveSavingsStat />)
    const expected = Math.round(liveSavings())
    expect(screen.getByText(`${expected.toLocaleString('da-DK')} kr.`)).toBeInTheDocument()
  })
})
