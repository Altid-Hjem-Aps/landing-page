import { describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'

vi.mock('@amplitude/analytics-browser', () => ({ track: vi.fn() }))
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }) }))
// A probe exposing the privacy props the real player receives.
vi.mock('@mux/mux-player-react', () => ({
  default: (props: Record<string, unknown>) => (
    <div
      data-testid="mux-player"
      data-disable-tracking={String(props.disableTracking)}
      data-disable-cookies={String(props.disableCookies)}
    />
  ),
}))

import FounderVideo from '@/components/sections/FounderVideo'

describe('FounderVideo privacy', () => {
  it('never runs Mux Data tracking or sets its cookie (not covered by cookie consent)', async () => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn().mockReturnValue({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() })
    )
    render(<FounderVideo />)
    const player = await waitFor(() => screen.getByTestId('mux-player'))
    expect(player.dataset.disableTracking).toBe('true')
    expect(player.dataset.disableCookies).toBe('true')
    vi.unstubAllGlobals()
  })
})
