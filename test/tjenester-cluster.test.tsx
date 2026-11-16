import { describe, expect, it } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import { fireEvent, render, screen } from '@testing-library/react'
import { parseDanishNumber } from '@/components/seo/hjemKit'
import { POSTS } from '@/components/sections/blogPosts'
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
  // The defaults are FDM's example on the page (15.000 km a year = 1.250 a month, 20 kWh/100 km).
  // There is no sourced household price, so the price field starts empty and no kroner show.
  const fillPrice = (value = '2,50') => fireEvent.change(screen.getByLabelText('Elpris (kr./kWh)'), { target: { value } })

  it('shows no kroner until the household enters its own price', () => {
    render(<LadeboksCalculator />)
    expect(screen.getByText(/Udfyld km, forbrug og elpris med jeres egne tal/)).toBeInTheDocument()
    expect(screen.queryByText('Estimat')).not.toBeInTheDocument()
  })

  it('computes the monthly estimate from the defaults and an entered price', () => {
    render(<LadeboksCalculator />)
    fillPrice()
    // 1250/100*20 = 250 kWh * 2,50 = 625 kr.
    expect(screen.getByText(/625 kr\./)).toBeInTheDocument()
    expect(screen.getByText(/250 kWh/)).toBeInTheDocument()
  })

  it('shows the with-refusion figure when a refusion price is given', () => {
    render(<LadeboksCalculator />)
    fillPrice()
    fireEvent.change(screen.getByLabelText(/efter refusion/), { target: { value: '0,80' } })
    // 250 kWh * 0,80 = 200 kr.
    expect(screen.getByText(/200 kr\./)).toBeInTheDocument()
  })

  it('gates the estimate on implausible or malformed input', () => {
    render(<LadeboksCalculator />)
    fillPrice()
    expect(screen.queryByText(/Udfyld km, forbrug og elpris/)).not.toBeInTheDocument()
    const km = screen.getByLabelText('Km pr. måned')
    fireEvent.change(km, { target: { value: '999999' } })
    expect(screen.getByText(/Udfyld km, forbrug og elpris/)).toBeInTheDocument()
    fireEvent.change(km, { target: { value: '1200foo' } })
    expect(screen.getByText(/Udfyld km, forbrug og elpris/)).toBeInTheDocument()
  })

  it('warns when a filled refusion price cannot be read', () => {
    render(<LadeboksCalculator />)
    fillPrice()
    fireEvent.change(screen.getByLabelText(/efter refusion/), { target: { value: 'abc' } })
    expect(screen.getByText(/Elprisen efter refusion kunne ikke læses/)).toBeInTheDocument()
  })

  const FIELD_CASES = [
    { key: 'km', label: 'Km pr. måned', bad: '999999', copy: 'Indtast et tal mellem 50 og 10.000 km' },
    { key: 'kwh100', label: 'Forbrug (kWh/100 km)', bad: '99', copy: 'Indtast et tal mellem 8 og 35 kWh/100 km' },
    { key: 'price', label: 'Elpris (kr./kWh)', bad: '99', copy: 'Indtast en pris mellem 0,2 og 10 kr./kWh' },
    { key: 'refusion', label: 'Evt. elpris efter refusion (kr./kWh)', bad: 'abc', copy: 'Indtast en pris mellem 0,2 og 10 kr./kWh' },
  ] as const

  it.each(FIELD_CASES)('shows the $key error only after blur, with linked copy', ({ key, label, bad, copy }) => {
    render(<LadeboksCalculator />)
    const input = screen.getByLabelText(label)
    fireEvent.change(input, { target: { value: bad } })
    expect(input).not.toHaveAttribute('aria-invalid')
    expect(screen.queryByText(copy)).not.toBeInTheDocument()
    fireEvent.blur(input)
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input).toHaveAttribute('aria-describedby', `ladeboks-${key}-error`)
    expect(screen.getByText(copy)).toBeInTheDocument()
  })

  it('keeps the error text out of the input accessible name', () => {
    render(<LadeboksCalculator />)
    const km = screen.getByLabelText('Km pr. måned')
    fireEvent.change(km, { target: { value: '999999' } })
    fireEvent.blur(km)
    // the label must still resolve exactly — error copy lives outside the <label>
    expect(screen.getByLabelText('Km pr. måned')).toBe(km)
  })

  it('validates live while typing once a field has been touched', () => {
    render(<LadeboksCalculator />)
    const km = screen.getByLabelText('Km pr. måned')
    fireEvent.change(km, { target: { value: '999999' } })
    fireEvent.blur(km)
    fireEvent.change(km, { target: { value: '1.500' } })
    expect(km).not.toHaveAttribute('aria-invalid')
    // touched has latched: an invalid retype flags immediately, no second blur needed
    fireEvent.change(km, { target: { value: '999999' } })
    expect(km).toHaveAttribute('aria-invalid', 'true')
  })

  it('clears the field error as soon as the value becomes valid again', () => {
    render(<LadeboksCalculator />)
    const km = screen.getByLabelText('Km pr. måned')
    fireEvent.change(km, { target: { value: '999999' } })
    fireEvent.blur(km)
    expect(km).toHaveAttribute('aria-invalid', 'true')
    fireEvent.change(km, { target: { value: '1.500' } })
    expect(km).not.toHaveAttribute('aria-invalid')
    expect(screen.queryByText('Indtast et tal mellem 50 og 10.000 km')).not.toBeInTheDocument()
  })

  it('keeps the empty optional refusion field neutral after blur', () => {
    render(<LadeboksCalculator />)
    const refusion = screen.getByLabelText(/efter refusion/)
    fireEvent.blur(refusion)
    expect(refusion).not.toHaveAttribute('aria-invalid')
  })

  it('links an unreadable refusion price to its field error after blur', () => {
    render(<LadeboksCalculator />)
    const refusion = screen.getByLabelText(/efter refusion/)
    fireEvent.change(refusion, { target: { value: 'abc' } })
    fireEvent.blur(refusion)
    expect(refusion).toHaveAttribute('aria-invalid', 'true')
    expect(refusion).toHaveAttribute('aria-describedby', 'ladeboks-refusion-error')
  })

  it('keeps the live-region node stable across value updates', () => {
    const { container } = render(<LadeboksCalculator />)
    const live = container.querySelector('[aria-live]')
    expect(live).not.toBeNull()
    fillPrice()
    fireEvent.change(screen.getByLabelText('Km pr. måned'), { target: { value: '2.000' } })
    expect(container.querySelector('[aria-live]')).toBe(live)
    // 2000/100*20 = 400 kWh * 2,50 = 1.000 kr.; figures stay correct with the motion markup
    expect(screen.getByText(/1\.000 kr\./)).toBeInTheDocument()
  })
})

describe('blog strip routes', () => {
  it('every internal blog card href maps to an existing page', () => {
    const hrefs = POSTS.map((p) => p.href).filter((h) => h.startsWith('/'))
    expect(hrefs.length).toBeGreaterThanOrEqual(5)
    for (const href of hrefs) {
      const seg = href.replace(/^\/+|\/+$/g, '')
      const file = path.join(process.cwd(), 'app', seg, 'page.tsx')
      expect(fs.existsSync(file), `${href} has no page.tsx`).toBe(true)
    }
  })
})
