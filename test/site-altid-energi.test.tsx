import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, fireEvent, render, screen } from '@testing-library/react'
import { hydrateRoot } from 'react-dom/client'
import { renderToString } from 'react-dom/server'
import ElprisBars from '@/components/site/ElprisBars'
import { getElpriser, type ElpriserData, type HourPrice } from '@/lib/elpriser'

// Today's real prices on the front page, in the wide tile of the bento. The page is cached, so the risk is a
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
const readAt = (index: number) => {
  fireEvent.change(range(), { target: { value: String(index) } })
  return document.querySelector('.ae-readout')?.textContent
}

/** jsdom has no IntersectionObserver. This one reports only when told to. */
const observers: { report: (isIntersecting: boolean) => void }[] = []
class FakeObserver {
  constructor(private callback: IntersectionObserverCallback) {
    observers.push({
      report: (isIntersecting) =>
        this.callback([{ isIntersecting } as IntersectionObserverEntry], this as unknown as IntersectionObserver),
    })
  }
  observe() {}
  disconnect() {}
}

function motionAllowed(allowed: boolean) {
  vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: !allowed }))
}

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date', 'setInterval', 'clearInterval'] })
  observers.length = 0
  vi.stubGlobal('IntersectionObserver', FakeObserver)
  motionAllowed(true)
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
      name: 'the last hour, running, ends at 24',
      now: '23:10',
      hours: dayOf(),
      expected: 'I dag: nu til kl. 24',
    },
    {
      name: 'the last hour ends at 24, not 00',
      now: '20:30',
      hours: dayOf({ 23: 1 }),
      expected: 'I dag: kl. 23 til 24',
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
    render(<ElprisBars data={data({ hours })} />)
    expect(answer()).toBe(expected)
  })

  it('after the last hour with tomorrow known, says only tomorrow', () => {
    setClock(at(TODAY, '23:30'))
    render(<ElprisBars data={data({ hours: dayOf({}, 23), tomorrowHours: dayOf({ 4: 0.5 }) })} />)
    expect(answer()).toBe('I morgen: kl. 04 til 05')
  })

  it('names tomorrow when it is known, and not otherwise', () => {
    setClock(at(TODAY, '14:00'))
    const { unmount } = render(<ElprisBars data={data({ tomorrowHours: dayOf({ 3: 0.5 }) })} />)
    expect(screen.getByText('I morgen: kl. 03 til 04')).toBeInTheDocument()
    unmount()

    const lastHour = render(<ElprisBars data={data({ tomorrowHours: dayOf({ 23: 0.5 }) })} />)
    expect(screen.getByText('I morgen: kl. 23 til 24')).toBeInTheDocument()
    lastHour.unmount()

    render(<ElprisBars data={data()} />)
    expect(screen.queryByText(/I morgen/)).not.toBeInTheDocument()
  })

  it('moves on by itself when the hour passes with the page open', () => {
    setClock(at(TODAY, '13:59'))
    render(<ElprisBars data={data({ hours: dayOf({ 13: 0.5, 18: 1 }) })} />)
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
      <ElprisBars data={data({ hours: dayOf({ 10: 0.1 }), tomorrowHours: dayOf({ 15: 0.5 }) })}
      />,
    )
    expect(answer()).toBe('I dag: kl. 15 til 16')
    expect(screen.queryByText(/I morgen/)).not.toBeInTheDocument()
    expect(range().max).toBe('23')
  })

  it('shows the failure state when the cache is old and tomorrow is unknown', () => {
    setClock(at(TOMORROW, '08:00'))
    render(<ElprisBars data={data()} />)
    expect(screen.getByText('Priserne kan ikke hentes lige nu')).toBeInTheDocument()
    expect(answer()).toBeUndefined()
  })

  it('shows the failure state when the cache is two days old, even with a tomorrow in it', () => {
    setClock(at('2026-11-06', '08:00'))
    render(<ElprisBars data={data({ tomorrowHours: dayOf() })} />)
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

describe('the chart looks ahead when tomorrow is known', () => {
  const pastBars = () => document.querySelectorAll('.ae-bar[data-past]')
  const greenBars = () => document.querySelectorAll('.ae-bar[data-level="best"]')

  it('tomorrow known: starts at the running hour and runs through the end of tomorrow', () => {
    setClock(at(TODAY, '22:30'))
    render(<ElprisBars data={data({ tomorrowHours: dayOf() })} />)

    expect(document.querySelectorAll('.ae-bar')).toHaveLength(26)
    expect(pastBars()).toHaveLength(0)
    expect(readAt(0)).toBe('kl. 22: 2,50 kr. pr. kWh')
    expect(readAt(2)).toBe('I morgen kl. 00: 2,50 kr. pr. kWh')
    expect(readAt(25)).toBe('I morgen kl. 23: 2,50 kr. pr. kWh')
    expect(range().max).toBe('25')
    expect(screen.getByText('I morgen')).toBeInTheDocument()
    expect(screen.getByText('Nu')).toBeInTheDocument()
    expect(screen.getByText(/^Dagens og morgendagens timepriser/)).toBeInTheDocument()
  })

  it('tomorrow unknown: the whole of today, with the hours gone dimmed', () => {
    setClock(at(TODAY, '14:10'))
    render(<ElprisBars data={data()} />)

    expect(document.querySelectorAll('.ae-bar')).toHaveLength(24)
    expect(pastBars()).toHaveLength(14)
    expect(range().value).toBe('14')
    expect(readAt(0)).toBe('kl. 00: 2,50 kr. pr. kWh')
    expect(screen.queryByText(/I morgen/)).not.toBeInTheDocument()
    expect(screen.getByText(/^Dagens timepriser/)).toBeInTheDocument()
  })

  it('the last row of today is gone: only tomorrow, with no "Nu"', () => {
    setClock(at(TODAY, '23:30'))
    render(<ElprisBars data={data({ hours: dayOf({}, 23), tomorrowHours: dayOf({ 4: 0.5 }) })} />)

    expect(range().max).toBe('23')
    expect(screen.getByText('I morgen')).toBeInTheDocument()
    expect(screen.queryByText('Nu')).not.toBeInTheDocument()
    expect(document.querySelector('.ae-readout')?.textContent).toBe('I morgen kl. 04: 0,63 kr. pr. kWh')
  })

  it('the same hour on the two days stays two hours: reading it and colouring it', () => {
    setClock(at(TODAY, '14:10'))
    render(<ElprisBars data={data({ hours: dayOf({ 20: 1 }), tomorrowHours: dayOf({ 3: 0.5, 20: 1.5 }) })} />)

    const tomorrow20 = 10 + 20
    expect(readAt(tomorrow20)).toBe('I morgen kl. 20: 1,88 kr. pr. kWh')
    expect(range().value).toBe(String(tomorrow20))

    // Today's answer and tomorrow's answer are the only two in Signal green.
    expect(answer()).toBe('I dag: kl. 20 til 21I morgen: kl. 03 til 04')
    expect(greenBars()).toHaveLength(2)
    const bars = [...document.querySelectorAll('.ae-bar')]
    expect(bars.indexOf(greenBars()[0])).toBe(6)
    expect(bars.indexOf(greenBars()[1])).toBe(10 + 3)
  })

  it('splits the hours on the chart in three by rank, and a flat day is all one colour', () => {
    const levels = () => {
      const count: Record<string, number> = {}
      document.querySelectorAll<HTMLElement>('.ae-bar').forEach((b) => {
        count[b.dataset.level as string] = (count[b.dataset.level as string] ?? 0) + 1
      })
      return count
    }
    setClock(at(TODAY, '00:30'))
    const spiky = Array.from({ length: 24 }, (_, h) => row(h, 1 + h * h * 0.01))
    const first = render(<ElprisBars data={data({ hours: spiky })} />)
    expect(levels()).toEqual({ best: 1, low: 7, mid: 8, high: 8 })
    first.unmount()

    render(<ElprisBars data={data()} />)
    expect(levels()).toEqual({ best: 1, mid: 23 })
  })

  it('drops the hour that has passed, with the page open', () => {
    setClock(at(TODAY, '22:59'))
    render(<ElprisBars data={data({ tomorrowHours: dayOf() })} />)
    expect(range().max).toBe('25')

    act(() => {
      setClock(at(TODAY, '23:00'))
      vi.advanceTimersByTime(30_000)
    })
    expect(range().max).toBe('24')
    expect(document.querySelector('.ae-readout')?.textContent).toBe('kl. 23: 2,50 kr. pr. kWh')
  })

  it('goes back to the whole day in a zone where tomorrow is unknown', () => {
    setClock(at(TODAY, '14:10'))
    const tomorrowHours = dayOf().map((r) => row(r.hour, 2, null))
    render(<ElprisBars data={data({ tomorrowHours })} />)
    expect(range().max).toBe('33')

    fireEvent.click(screen.getByRole('button', { name: 'Østdanmark' }))
    expect(range().max).toBe('23')
    expect(pastBars()).toHaveLength(14)
  })

  it('server render: today under its date, then the window on hydrating, and no mismatch', async () => {
    const elpriser = data({ tomorrowHours: dayOf() })
    setClock(at(TODAY, '14:10'))
    const host = document.createElement('div')
    host.innerHTML = renderToString(<ElprisBars data={elpriser} />)
    document.body.append(host)
    expect(host.querySelectorAll('.ae-bar')).toHaveLength(24)
    expect(host.querySelectorAll('.ae-bar[data-past]')).toHaveLength(0)
    expect(host.querySelector('.ae-axis')?.textContent).not.toContain('I morgen')
    expect(host.querySelector('[data-rise]')).toBeNull()

    const errors = vi.spyOn(console, 'error').mockImplementation(() => {})
    await act(async () => {
      hydrateRoot(host, <ElprisBars data={elpriser} />)
    })
    expect(errors).not.toHaveBeenCalled()
    expect(host.querySelectorAll('.ae-bar')).toHaveLength(34)
    host.remove()
  })
})

describe('the bars rise once', () => {
  const chart = () => document.querySelector('.ae-bars')

  it('waits below the fold, rises on coming into view, then stays still', () => {
    vi.useFakeTimers({ toFake: ['Date', 'setInterval', 'clearInterval', 'setTimeout', 'clearTimeout'] })
    setClock(at(TODAY, '14:10'))
    render(<ElprisBars data={data()} />)
    expect(chart()).toHaveAttribute('data-rise', 'wait')

    act(() => observers[0].report(false))
    expect(chart()).toHaveAttribute('data-rise', 'wait')

    act(() => observers[0].report(true))
    expect(chart()).toHaveAttribute('data-rise', 'go')

    act(() => {
      vi.advanceTimersByTime(2_000)
    })
    expect(chart()).not.toHaveAttribute('data-rise')

    // Changing zone or passing the hour redraws the bars without another beat.
    fireEvent.click(screen.getByRole('button', { name: 'Østdanmark' }))
    expect(chart()).not.toHaveAttribute('data-rise')
  })

  it('already on screen when hydrated: nothing is taken away to rise again', () => {
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue({ top: 100, bottom: 400 } as DOMRect)
    setClock(at(TODAY, '14:10'))
    render(<ElprisBars data={data()} />)
    expect(chart()).not.toHaveAttribute('data-rise')
    expect(observers).toHaveLength(0)
  })
})

describe('the box that hops', () => {
  const lit = () => {
    const bars = [...document.querySelectorAll('.ae-col')]
    return bars.findIndex((col) => col.querySelector('.ae-hop[data-on]'))
  }
  const cheap = dayOf({ 15: 0.5, 16: 0.7, 17: 0.9 })

  it('starts on the cheapest hour and moves between the three cheapest', () => {
    setClock(at(TODAY, '08:30'))
    render(<ElprisBars data={data({ hours: cheap })} />)
    expect(document.querySelectorAll('.ae-hop')).toHaveLength(3)
    expect(lit()).toBe(15)
    act(() => {
      vi.advanceTimersByTime(1_800)
    })
    expect(lit()).toBe(16)
    act(() => {
      vi.advanceTimersByTime(1_800)
    })
    expect(lit()).toBe(17)
    act(() => {
      vi.advanceTimersByTime(1_800)
    })
    expect(lit()).toBe(15)
  })

  // Risk: the page's pause control leaves one loop running (WCAG 2.2.2).
  it('stays on the cheapest hour when motion is stopped', () => {
    setClock(at(TODAY, '08:30'))
    document.documentElement.dataset.motion = 'paused'
    render(<ElprisBars data={data({ hours: cheap })} />)
    act(() => {
      vi.advanceTimersByTime(5_400)
    })
    expect(lit()).toBe(15)
    delete document.documentElement.dataset.motion
  })

  it('stays on the cheapest hour with reduced motion', () => {
    setClock(at(TODAY, '08:30'))
    motionAllowed(false)
    render(<ElprisBars data={data({ hours: cheap })} />)
    act(() => {
      vi.advanceTimersByTime(5_400)
    })
    expect(lit()).toBe(15)
  })

  it('never stands on an hour that has gone', () => {
    setClock(at(TODAY, '16:30'))
    render(<ElprisBars data={data({ hours: cheap })} />)
    const hops = [...document.querySelectorAll('.ae-col')].flatMap((col, i) => (col.querySelector('.ae-hop') ? [i] : []))
    expect(hops.every((i) => i >= 16)).toBe(true)
    expect(hops).toContain(16)
    expect(hops).toContain(17)
  })
})

describe('Vestdanmark and Østdanmark', () => {
  it('starts in Vestdanmark, names it in the source line, and the toggle switches the prices', () => {
    setClock(at(TODAY, '08:30'))
    const hours = dayOf().map((r) => (r.hour === 10 ? row(10, 0.5, 2) : r.hour === 20 ? row(20, 2, 0.5) : r))
    render(<ElprisBars data={data({ hours })} />)

    expect(answer()).toBe('I dag: kl. 10 til 11')
    expect(screen.getByText(/i Vestdanmark med N1 som netselskab, inkl\. afgifter og moms\. Kilde: Strømligning\./)).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Østdanmark' }))
    expect(answer()).toBe('I dag: kl. 20 til 21')
    expect(screen.getByText(/i Østdanmark med Radius som netselskab, inkl\. afgifter og moms\. Kilde: Strømligning\./)).toBeInTheDocument()
  })

  it('hides the toggle and shows the other zone when one is missing', () => {
    setClock(at(TODAY, '08:30'))
    const hours = dayOf().map((r) => row(r.hour, null, r.hour === 20 ? 0.5 : 2))
    render(<ElprisBars data={data({ hours })} />)

    expect(screen.queryByRole('button', { name: 'Vestdanmark' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Østdanmark' })).not.toBeInTheDocument()
    expect(answer()).toBe('I dag: kl. 20 til 21')
    expect(screen.getByText(/i Østdanmark med Radius/)).toBeInTheDocument()
  })
})

describe('when the prices cannot be fetched', () => {
  it('says so and links to the price page, and the failure is logged', async () => {
    setClock(at(TODAY, '08:30'))
    vi.stubGlobal('fetch', vi.fn(async () => new Response('down', { status: 503 })))
    const errors = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(<ElprisBars data={await getElpriser()} />)

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
    render(<ElprisBars data={await getElpriser()} />)

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
    render(<ElprisBars data={await getElpriser()} />)

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
    render(<ElprisBars data={data({ hours: dayOf({ 3: -0.4 }) })} />)

    expect(answer()).toBe('I dag: kl. 03 til 04')
    const bars = document.querySelectorAll<HTMLElement>('.ae-bar')
    expect(bars[3].style.height).toBe('0%')
    expect(bars[4].style.height).toBe('100%')
    fireEvent.change(range(), { target: { value: '3' } })
    expect(screen.getByText('kl. 03: -0,50 kr. pr. kWh')).toBeInTheDocument()
  })

  it('the readout starts at the running hour and follows the range input', () => {
    setClock(at(TODAY, '18:10'))
    render(<ElprisBars data={data({ hours: dayOf({ 7: 1.2 }) })} />)
    expect(screen.getByText('kl. 18: 2,50 kr. pr. kWh')).toBeInTheDocument()
    expect(range().value).toBe('18')
    expect(screen.getByText('Nu')).toBeInTheDocument()

    fireEvent.change(range(), { target: { value: '7' } })
    expect(screen.getByText('kl. 07: 1,50 kr. pr. kWh')).toBeInTheDocument()
    expect(range()).toHaveAttribute('aria-valuetext', 'kl. 07: 1,50 kr. pr. kWh')
  })
})
