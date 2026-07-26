import { describe, expect, it } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import { fireEvent, render, screen } from '@testing-library/react'
import { parseDanishNumber } from '@/components/seo/hjemKit'
import LadeboksCalculator from '@/components/LadeboksCalculator'

describe('parseDanishNumber', () => {
  it('parses a decimal comma', () => {
    expect(parseDanishNumber('2,50', 0.2, 10)).toBeCloseTo(2.5)
  })

  it('parses a thousands separator', () => {
    expect(parseDanishNumber('1.200', 50, 10_000)).toBe(1200)
  })

  it('parses combined thousands + decimals', () => {
    expect(parseDanishNumber('1.200,5', 50, 10_000)).toBeCloseTo(1200.5)
  })

  it('rejects out-of-range, zero, negative, garbage and trailing-junk input', () => {
    expect(parseDanishNumber('999999', 50, 10_000)).toBeNaN()
    expect(parseDanishNumber('0', 1, 100)).toBeNaN()
    expect(parseDanishNumber('-5', 1, 100)).toBeNaN()
    expect(parseDanishNumber('abc', 1, 100)).toBeNaN()
    expect(parseDanishNumber('1200foo', 50, 10_000)).toBeNaN()
    expect(parseDanishNumber('50,5,5', 1, 100)).toBeNaN()
    expect(parseDanishNumber('', 1, 100)).toBeNaN()
  })
})

describe('LadeboksCalculator', () => {
  it('computes the monthly estimate from the defaults (1.200 km, 18 kWh/100, 2,50 kr.)', () => {
    render(<LadeboksCalculator />)
    // 1200/100*18 = 216 kWh * 2,50 = 540 kr.
    expect(screen.getByText(/540 kr\./)).toBeInTheDocument()
    expect(screen.getByText(/216 kWh/)).toBeInTheDocument()
  })

  it('shows the with-refusion figure when a refusion price is given', () => {
    render(<LadeboksCalculator />)
    fireEvent.change(screen.getByPlaceholderText('F.eks. 0,73'), { target: { value: '0,73' } })
    // 216 kWh * 0,73 = 157,68 ≈ 158 kr.
    expect(screen.getByText(/158 kr\./)).toBeInTheDocument()
  })

  it('gates the estimate on implausible or malformed input', () => {
    render(<LadeboksCalculator />)
    const km = screen.getByLabelText('Km pr. måned')
    fireEvent.change(km, { target: { value: '999999' } })
    expect(screen.getByText(/Udfyld km, forbrug og elpris/)).toBeInTheDocument()
    fireEvent.change(km, { target: { value: '1200foo' } })
    expect(screen.getByText(/Udfyld km, forbrug og elpris/)).toBeInTheDocument()
  })

  it('warns when a filled refusion price cannot be read', () => {
    render(<LadeboksCalculator />)
    fireEvent.change(screen.getByPlaceholderText('F.eks. 0,73'), { target: { value: 'abc' } })
    expect(screen.getByText(/Refusionsprisen kunne ikke læses/)).toBeInTheDocument()
  })
})

describe('blog strip routes', () => {
  it('every internal blog card href maps to an existing page', () => {
    const src = fs.readFileSync(path.join(process.cwd(), 'components/sections/Blog.tsx'), 'utf-8')
    const hrefs = [...src.matchAll(/href: '(\/[^']+)'/g)].map((m) => m[1])
    expect(hrefs.length).toBeGreaterThanOrEqual(5)
    for (const href of hrefs) {
      const seg = href.replace(/^\/+|\/+$/g, '')
      const file = path.join(process.cwd(), 'app', seg, 'page.tsx')
      expect(fs.existsSync(file), `${href} has no page.tsx`).toBe(true)
    }
  })
})
