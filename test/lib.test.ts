import { describe, expect, it } from 'vitest'
import { fluid } from '@/lib/fluid'
import { liveSavings } from '@/lib/liveSavings'
import { RECEIPT_ROWS, SAVING, YEAR_SAVING } from '@/components/sections/why/cards'

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

// The animated receipt hard-codes per-subbrand savings that must equal the
// saving derived from the household's member prices — and the yearly claim in
// the green box is 12× that. A price edit that forgets the receipt fails here.
describe('household story data invariants', () => {
  it('receipt rows sum to the derived monthly saving', () => {
    expect(RECEIPT_ROWS.reduce((s, r) => s + r.save, 0)).toBe(SAVING)
  })

  it('the yearly claim is 12x the monthly saving', () => {
    expect(YEAR_SAVING).toBe(SAVING * 12)
  })

  it('receipt rows are ordered biggest saving first', () => {
    expect(RECEIPT_ROWS.every((r, i, a) => i === 0 || a[i - 1].save >= r.save)).toBe(true)
  })
})
