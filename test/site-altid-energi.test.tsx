import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, fireEvent, render, screen } from '@testing-library/react'
import { hydrateRoot } from 'react-dom/client'
import { renderToString } from 'react-dom/server'
import AltidEnergi from '@/components/site/AltidEnergi'
import ElprisBars from '@/components/site/ElprisBars'
import { getElpriser, type ElpriserData, type HourPrice } from '@/lib/elpriser'

// Today's real prices on the front page. The page is cached, so the risk is a
// confident answer from old data: a wrong hour told to a household.

const TODAY = '2026-11-04'
const TOMORROW = '2026-11-05'
const at = (date: string, time: string) => new Date(`${date}T${time}:00+01:00`)

function setClock(when: Date) {
  vi.setSystemTime(when)
}

/** A row where spot is the whole price before VAT, unless fees are given. */
function row(hour: number, dk1: number | null, dk2: number | null = dk1, dist = 0): HourPrice {
  return {
    hour,
    dk1,
    dk2,
    dk1Max: dk1,
    dk2Max: dk2,
    dk1Tax: dk1 === null ? null : 0,
    dk2Tax: dk2 === null ? null : 0,
    dk1Trans: dk1 === null ? null : 0,
    dk2Trans: dk2 === null ? null : 0,
    dk1Dist: dk1 === null ? null : dist,
    dk2Dist: dk2 === null ? null : dist,
  }
}

/** A full day at 2 kr. with some hours overridden. */
function dayOf(overrides: Record<number, number> = {}, hours = 24): HourPrice[] {
  return Array.from({ length: hours }, (_, h) => row(h, overrides[h] ?? 2))
}

function data(partial: Partial<ElpriserData> = {}): ElpriserData {
  return { date: TODAY, hours: dayOf(), tomorrowHours: null, tomorrowDate: TOMORROW, ...partial }
}

const answer = () => document.querySelector('.ae-answer')?.textContent
const range = () => screen.getByRole('slider', { name: 'Vælg time' }) as HTMLInputElement

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date', 'setInterval', 'clearInterval'] })
})
afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('the answer is the cheapest hour left today', () => {
  it.each([
    {
      name: 'morning: a cheaper hour already gone does not count',
      now: '08:30',
      hours: dayOf({ 3: 0.1, 13: 0.5 }),
      expected: 'I dag: kl. 13 til 14',
    },
    {
      name: 'evening: only the hours left',
      now: '20:30',
      hours: dayOf({ 13: 0.1, 22: 1 }),
      expected: 'I dag: kl. 22 til 23',
    },
    {
      name: 'the running hour is the cheapest',
      now: '13:10',
      hours: dayOf({ 13: 0.5 }),
      expected: 'I dag: nu til kl. 14',
    },
    {
      name: 'the last hour wraps to midnight',
      now: '23:10',
      hours: dayOf(),
      expected: 'I dag: nu til kl. 00',
    },
    {
      name: 'after the last hour with data, and tomorrow unknown',
      now: '23:30',
      hours: dayOf({}, 23),
      expected: 'Se priserne igen i morgen',
    },
    {
      name: 'fees count: low spot with a high grid fee loses',
      now: '00:30',
      hours: [row(5, 0.1, 0.1, 3), ...dayOf({ 6: 1 }).filter((r) => r.hour !== 5)].sort((a, b) => a.hour - b.hour),
      expected: 'I dag: kl. 06 til 07',
    },
  ])('$name', ({ now, hours, expected }) => {
    setClock(at(TODAY, now))
    render(<AltidEnergi elpriser={data({ hours })} />)
    expect(answer()).toBe(expected)
  })

  it('after the last hour with tomorrow known, says only tomorrow', () => {
    setClock(at(TODAY, '23:30'))
    render(<AltidEnergi elpriser={data({ hours: dayOf({}, 23), tomorrowHours: dayOf({ 4: 0.5 }) })} />)
    expect(answer()).toBe('I morgen: kl. 04 til 05')
  })

  it('names tomorrow when it is known, and not otherwise', () => {
    setClock(at(TODAY, '14:00'))
    const { unmount } = render(<AltidEnergi elpriser={data({ tomorrowHours: dayOf({ 3: 0.5 }) })} />)
    expect(screen.getByText('I morgen: kl. 03 til 04')).toBeInTheDocument()
    unmount()

    render(<AltidEnergi elpriser={data()} />)
    expect(screen.queryByText(/I morgen/)).not.toBeInTheDocument()
  })

  it('moves on by itself when the hour passes with the page open', () => {
    setClock(at(TODAY, '13:59'))
    render(<AltidEnergi elpriser={data({ hours: dayOf({ 13: 0.5, 18: 1 }) })} />)
    expect(answer()).toBe('I dag: nu til kl. 14')

    act(() => {
      setClock(at(TODAY, '14:00'))
      vi.advanceTimersByTime(30_000)
    })
    expect(answer()).toBe('I dag: kl. 18 til 19')
  })
})

describe('old cached data never gives a stale answer', () => {
  it('promotes yesterday\'s "tomorrow" to today when the cache is a day old', () => {
    setClock(at(TOMORROW, '08:00'))
    render(
      <AltidEnergi
        elpriser={data({ hours: dayOf({ 10: 0.1 }), tomorrowHours: dayOf({ 15: 0.5 }) })}
      />,
    )
    expect(answer()).toBe('I dag: kl. 15 til 16')
    expect(screen.queryByText(/I morgen/)).not.toBeInTheDocument()
  })

  it('shows the failure state when the cache is old and tomorrow is unknown', () => {
    setClock(at(TOMORROW, '08:00'))
    render(<AltidEnergi elpriser={data()} />)
    expect(screen.getByText('Priserne kan ikke hentes lige nu')).toBeInTheDocument()
    expect(answer()).toBeUndefined()
  })

  it('shows the failure state when the cache is two days old, even with a tomorrow in it', () => {
    setClock(at('2026-11-06', '08:00'))
    render(<AltidEnergi elpriser={data({ tomorrowHours: dayOf() })} />)
    expect(screen.getByText('Priserne kan ikke hentes lige nu')).toBeInTheDocument()
  })

  it('server render: the prices under their date and no answer, and hydrating stays quiet', async () => {
    const elpriser = data({ hours: dayOf({ 3: 0.1, 9: 0.5 }) })
    setClock(at(TODAY, '08:30'))
    const host = document.createElement('div')
    host.innerHTML = renderToString(<ElprisBars data={elpriser} />)
    document.body.append(host)
    expect(host.querySelector('.ae-answer')?.textContent).toBe('Priser for 4. november')
    expect(host.querySelectorAll('.ae-bar')).toHaveLength(24)

    const errors = vi.spyOn(console, 'error').mockImplementation(() => {})
    await act(async () => {
      hydrateRoot(host, <ElprisBars data={elpriser} />)
    })
    expect(errors).not.toHaveBeenCalled()
    expect(host.querySelector('.ae-answer')?.textContent).toBe('I dag: kl. 09 til 10')
    host.remove()
  })
})

describe('Vestdanmark and Østdanmark', () => {
  it('starts in Vestdanmark, names it in the source line, and the toggle switches the prices', () => {
    setClock(at(TODAY, '08:30'))
    const hours = dayOf().map((r) => (r.hour === 10 ? row(10, 0.5, 2) : r.hour === 20 ? row(20, 2, 0.5) : r))
    render(<AltidEnergi elpriser={data({ hours })} />)

    expect(answer()).toBe('I dag: kl. 10 til 11')
    expect(screen.getByText(/i Vestdanmark, med N1 som netselskab\. Kilde: Strømligning\./)).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Østdanmark' }))
    expect(answer()).toBe('I dag: kl. 20 til 21')
    expect(screen.getByText(/i Østdanmark, med Radius som netselskab\. Kilde: Strømligning\./)).toBeInTheDocument()
  })

  it('hides the toggle and shows the other zone when one is missing', () => {
    setClock(at(TODAY, '08:30'))
    const hours = dayOf().map((r) => row(r.hour, null, r.hour === 20 ? 0.5 : 2))
    render(<AltidEnergi elpriser={data({ hours })} />)

    expect(screen.queryByRole('button', { name: 'Vestdanmark' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Østdanmark' })).not.toBeInTheDocument()
    expect(answer()).toBe('I dag: kl. 20 til 21')
    expect(screen.getByText(/i Østdanmark, med Radius/)).toBeInTheDocument()
  })
})

describe('when the prices cannot be fetched', () => {
  it('says so and links to the price page, and the failure is logged', async () => {
    setClock(at(TODAY, '08:30'))
    vi.stubGlobal('fetch', vi.fn(async () => new Response('down', { status: 503 })))
    const errors = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(<AltidEnergi elpriser={await getElpriser()} />)

    expect(screen.getByText('Priserne kan ikke hentes lige nu')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Se siden med elpriser' })).toHaveAttribute(
      'href',
      '/hvornar-er-strommen-billigst',
    )
    expect(screen.queryByRole('slider')).not.toBeInTheDocument()
    expect(errors).toHaveBeenCalledWith(expect.stringContaining('503'))
  })

  it('logs when the fetch itself throws', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => Promise.reject(new Error('network'))))
    const errors = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(await getElpriser()).toBeNull()
    expect(errors).toHaveBeenCalledWith(expect.stringContaining('failed'), expect.any(Error))
  })
})

describe('the chart follows the rows, not a 24-hour clock', () => {
  /** The real API shape: quarter hours in local time. */
  function stubPrices(quarters: { time: string; spot: number }[]) {
    const body = {
      prices: quarters.map((q) => ({
        localDate: q.time,
        details: {
          electricity: { value: q.spot },
          electricityTax: { value: 0 },
          transmission: { systemTariff: { value: 0 }, netTariff: { value: 0 } },
          distribution: { value: 0 },
        },
      })),
    }
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify(body))))
  }
  const hh = (n: number) => String(n).padStart(2, '0')

  it('spring: 23 hours, and the hour before the gap ends at 03', async () => {
    setClock(new Date('2026-03-29T00:10:00+01:00'))
    stubPrices(
      Array.from({ length: 24 }, (_, h) => h)
        .filter((h) => h !== 2)
        .map((h) => ({ time: `2026-03-29T${hh(h)}:00:00`, spot: h === 1 ? 0.5 : 2 })),
    )
    render(<AltidEnergi elpriser={await getElpriser()} />)

    expect(range().max).toBe('22')
    expect(answer()).toBe('I dag: kl. 01 til 03')
    fireEvent.change(range(), { target: { value: '2' } })
    expect(screen.getByText('kl. 03: 2,50 kr. pr. kWh')).toBeInTheDocument()
  })

  it('autumn: the doubled hour is one row, not a 25th bar that shifts the rest', async () => {
    setClock(new Date('2026-10-25T00:10:00+02:00'))
    const quarters = Array.from({ length: 24 }, (_, h) => ({ time: `2026-10-25T${hh(h)}:00:00`, spot: h === 2 ? 1 : 2 }))
    quarters.push({ time: '2026-10-25T02:00:00', spot: 3 })
    stubPrices(quarters)
    render(<AltidEnergi elpriser={await getElpriser()} />)

    expect(range().max).toBe('23')
    fireEvent.change(range(), { target: { value: '2' } })
    expect(screen.getByText('kl. 02: 2,50 kr. pr. kWh')).toBeInTheDocument()
    fireEvent.change(range(), { target: { value: '23' } })
    expect(screen.getByText('kl. 23: 2,50 kr. pr. kWh')).toBeInTheDocument()
  })
})

describe('reading the chart', () => {
  it('a negative price stands at the baseline while the readout tells the real number', () => {
    setClock(at(TODAY, '00:30'))
    render(<AltidEnergi elpriser={data({ hours: dayOf({ 3: -0.4 }) })} />)

    expect(answer()).toBe('I dag: kl. 03 til 04')
    const bars = document.querySelectorAll<HTMLElement>('.ae-bar')
    expect(bars[3].style.height).toBe('0%')
    expect(bars[4].style.height).toBe('100%')
    fireEvent.change(range(), { target: { value: '3' } })
    expect(screen.getByText('kl. 03: -0,50 kr. pr. kWh')).toBeInTheDocument()
  })

  it('the readout starts at the running hour and follows the range input', () => {
    setClock(at(TODAY, '18:10'))
    render(<AltidEnergi elpriser={data({ hours: dayOf({ 7: 1.2 }) })} />)
    expect(screen.getByText('kl. 18: 2,50 kr. pr. kWh')).toBeInTheDocument()
    expect(range().value).toBe('18')
    expect(screen.getByText('Nu')).toBeInTheDocument()

    fireEvent.change(range(), { target: { value: '7' } })
    expect(screen.getByText('kl. 07: 1,50 kr. pr. kWh')).toBeInTheDocument()
    expect(range()).toHaveAttribute('aria-valuetext', 'kl. 07: 1,50 kr. pr. kWh')
  })
})
