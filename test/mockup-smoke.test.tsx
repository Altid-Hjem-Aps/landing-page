import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import AbonnementMockup from '@/components/AbonnementMockup'
import AlarmStatusMockup from '@/components/AlarmStatusMockup'
import BudgetAppSammenligning from '@/components/BudgetAppSammenligning'
import GebyrMockup from '@/components/GebyrMockup'
import IndboTjekMockup from '@/components/IndboTjekMockup'
import MobilOverblikMockup from '@/components/MobilOverblikMockup'
import SkiftTjeklisteMockup from '@/components/SkiftTjeklisteMockup'

/* Smoke coverage for the seven migrated mockups: the shared hook is unit
 * tested in hjem-kit.test.tsx, but each component hand-writes its own
 * phase-zero gate and final-phase content — a per-file mistake (wrong SEQ
 * index, missed reduced guard) only surfaces by rendering the component. */

const CASES = [
  { name: 'AbonnementMockup', C: AbonnementMockup, finalText: 'Gennemgangen er færdig' },
  { name: 'AlarmStatusMockup', C: AlarmStatusMockup, finalText: 'Hjemmet er sikret' },
  { name: 'BudgetAppSammenligning', C: BudgetAppSammenligning, finalText: 'Begge kan have værdi i jeres økonomi' },
  { name: 'GebyrMockup', C: GebyrMockup, finalText: 'Ingen faste gebyrer, intet abonnement' },
  { name: 'IndboTjekMockup', C: IndboTjekMockup, finalText: 'Overblikket er klar' },
  { name: 'MobilOverblikMockup', C: MobilOverblikMockup, finalText: 'Alle mobilaftaler er gennemgået' },
  { name: 'SkiftTjeklisteMockup', C: SkiftTjeklisteMockup, finalText: 'Skiftet er på plads' },
]

function stubMedia(reduced: boolean) {
  window.matchMedia = vi.fn().mockReturnValue({
    matches: reduced,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }) as unknown as typeof window.matchMedia
}

beforeEach(() => {
  // jsdom has no IntersectionObserver: the hook takes the reveal-immediately
  // fallback, which is exactly what these smoke tests need.
  delete (globalThis as { IntersectionObserver?: unknown }).IntersectionObserver
})

describe.each(CASES)('$name', ({ C, finalText }) => {
  it('pins the final phase fully visible under reduced motion, with no keyed animations', () => {
    stubMedia(true)
    const { container } = render(<C />)
    // status line and receipt may share the same copy — one match is enough
    expect(screen.getAllByText(new RegExp(finalText)).length).toBeGreaterThanOrEqual(1)
    const root = container.querySelector('.hjem-motion-scope') as HTMLElement
    expect(root.style.opacity).toBe('1')
    const animated = [...root.querySelectorAll('span')].filter(
      s => s.style.animation && s.style.animation.includes('hjem')
    )
    expect(animated).toHaveLength(0)
  })

  it('renders the first phase without crashing when motion is allowed', () => {
    stubMedia(false)
    const { container } = render(<C />)
    const root = container.querySelector('.hjem-motion-scope') as HTMLElement
    expect(root).not.toBeNull()
    // final receipt panel is mounted but hidden pre-'done'
    expect(root.querySelector('[aria-hidden="true"]')).not.toBeNull()
  })
})
