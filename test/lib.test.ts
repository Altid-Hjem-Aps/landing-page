import { describe, expect, it } from 'vitest'
import { fluid } from '@/lib/fluid'
import { liveSavings } from '@/lib/liveSavings'

// The counter formula must stay in lockstep with altidenergi.dk's inline
// script: startValue 2,080,000 anchored 2025-01-01 (Copenhagen), +6750 kr/day.
const START = new Date('2025-01-01T00:00:00+01:00').getTime()

describe('liveSavings', () => {
  it('returns the start value at the anchor instant', () => {
    expect(liveSavings(START)).toBe(2_080_000)
  })

  it('adds exactly 6750 kr per day', () => {
    expect(liveSavings(START + 86_400_000)).toBe(2_086_750)
  })

  it('floors to whole kroner and never decreases', () => {
    expect(Number.isInteger(liveSavings(START + 1234))).toBe(true)
    expect(liveSavings(START + 2_000_000)).toBeGreaterThanOrEqual(liveSavings(START + 1_000_000))
  })
})

describe('fluid', () => {
  it('equals the design px at the 1920 frame and scales as vw', () => {
    expect(fluid(192)).toBe('clamp(1rem, 10.000vw, 12rem)')
  })

  it('never produces an inverted clamp when px is below the default 16px floor', () => {
    const [min, max] = fluid(14)
      .match(/[\d.]+(?=rem)/g)!
      .map(Number)
    expect(min).toBeLessThanOrEqual(max)
  })
})
