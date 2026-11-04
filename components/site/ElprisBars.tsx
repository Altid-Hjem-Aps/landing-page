'use client'

import { useCallback, useState, useSyncExternalStore, type PointerEvent } from 'react'
import Link from 'next/link'
import {
  copenhagenDateKey,
  currentCopenhagenHour,
  DEFAULT_SUPPLIERS,
  formatKr,
  priceWith,
  type ElpriserData,
  type Fees,
  type HourPrice,
} from '@/lib/elpriser'

// Real hourly prices. The page is cached for half an hour and can outlive midnight,
// so everything that depends on "now" is decided in the browser after hydration:
// which day the rows belong to, which hours are past, what the answer is, whether
// the chart rolls on into tomorrow. Before that (and without JS) the chart shows
// the cached rows under their date and gives no answer that could be out of date.

type Zone = 'dk1' | 'dk2'
type Day = 'today' | 'tomorrow'
type Bar = { day: Day; hour: number; price: number }

const ALL_FEES: Fees = { elafgift: true, transmission: true, moms: true }

// Keyed by supplier id, so changing DEFAULT_SUPPLIERS breaks the build here rather
// than leaving the source line naming the wrong grid company.
const NETSELSKAB: Record<(typeof DEFAULT_SUPPLIERS)[keyof typeof DEFAULT_SUPPLIERS], string> = {
  n1_c: 'N1',
  radius_c: 'Radius',
}
const ZONES: { id: Zone; label: string; netselskab: string }[] = [
  { id: 'dk1', label: 'Vestdanmark', netselskab: NETSELSKAB[DEFAULT_SUPPLIERS.DK1] },
  { id: 'dk2', label: 'Østdanmark', netselskab: NETSELSKAB[DEFAULT_SUPPLIERS.DK2] },
]

const MONTHS = ['januar', 'februar', 'marts', 'april', 'maj', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'december']

function bars(rows: HourPrice[], zone: Zone, day: Day): Bar[] {
  return rows.flatMap((r) => {
    const [spot, tax, trans, dist] =
      zone === 'dk1' ? [r.dk1, r.dk1Tax, r.dk1Trans, r.dk1Dist] : [r.dk2, r.dk2Tax, r.dk2Trans, r.dk2Dist]
    if (spot === null || tax === null || trans === null || dist === null) return []
    return [{ day, hour: r.hour, price: priceWith(spot, tax, trans, dist, ALL_FEES) }]
  })
}

const cheapest = (list: Bar[]): Bar | null =>
  list.reduce<Bar | null>((best, b) => (best === null || b.price < best.price ? b : best), null)

// Hours repeat across the two days, so a bar is never identified by its hour alone.
const keyOf = (b: Bar) => `${b.day}-${b.hour}`

// Thirds by rank among the hours on the chart, past ones too, so the three colours
// share the chart on a flat day as on a spiky one. Equal prices share a colour, and
// a day with one price is all middle.
function thirds(list: Bar[]) {
  const sorted = list.map((b) => b.price).sort((a, b) => a - b)
  const third = Math.floor(sorted.length / 3)
  const lowBelow = sorted[third]
  const highAbove = sorted[sorted.length - 1 - third]
  return (price: number) => (price < lowBelow ? 'low' : price > highAbove ? 'high' : 'mid')
}

const kl = (hour: number) => `kl. ${String(hour).padStart(2, '0')}`

/** The hour a row ends. Not hour + 1: the hour before the spring gap ends at 03. The day ends at 24. */
function endOf(rows: HourPrice[], hour: number): string {
  const next = rows.find((r) => r.hour > hour)?.hour ?? hour + 1
  return String(next).padStart(2, '0')
}
const span = (rows: HourPrice[], hour: number) => `${kl(hour)} til ${endOf(rows, hour)}`

const subscribeToClock = (tick: () => void) => {
  const id = setInterval(tick, 30_000)
  return () => clearInterval(id)
}
const readClock = () => `${copenhagenDateKey(new Date())} ${currentCopenhagenHour()}`
const noClockOnServer = () => null

// Long enough for the last bar of a full chart: see the stagger in altid-energi.css.
const RISE_MS = 1500

/** The bars rise once, the first time the chart comes into view. */
function useRiseOnce() {
  const [rise, setRise] = useState<'wait' | 'go' | null>(null)
  const watch = useCallback((chart: HTMLDivElement | null) => {
    if (chart === null) return

    // On screen when hydrated: already painted at full height, and a jump would be worse.
    const box = chart.getBoundingClientRect()
    if (box.top < window.innerHeight && box.bottom > 0) return

    setRise('wait')
    let done: ReturnType<typeof setTimeout>
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()
        setRise('go')
        done = setTimeout(() => setRise(null), RISE_MS)
      },
      // Scrolling down the top of the chart comes first; wait until the baseline is close.
      { threshold: 0.5 },
    )
    observer.observe(chart)
    return () => {
      observer.disconnect()
      clearTimeout(done)
    }
  }, [])
  return { rise, watch }
}

function Failure() {
  return (
    <div className="ae-panel ae-panel--failure">
      <p className="ah-h3 ae-failure">Priserne kan ikke hentes lige nu</p>
      <Link href="/hvornar-er-strommen-billigst" className="ae-link">
        Se siden med elpriser
      </Link>
    </div>
  )
}

export default function ElprisBars({ data }: { data: ElpriserData | null }) {
  const clock = useSyncExternalStore(subscribeToClock, readClock, noClockOnServer)
  const [wantedZone, setWantedZone] = useState<Zone>('dk1')
  const [picked, setPicked] = useState<string | null>(null)
  const { rise, watch } = useRiseOnce()

  if (data === null) return <Failure />

  const now = clock === null ? null : { date: clock.slice(0, 10), hour: Number(clock.slice(11)) }

  // An old cached page: yesterday's "tomorrow" is today. Anything else is not today's prices.
  let todayRows: HourPrice[] = data.hours
  let tomorrowRows: HourPrice[] | null = data.tomorrowHours
  if (now && data.date !== now.date) {
    if (data.tomorrowDate !== now.date || data.tomorrowHours === null) return <Failure />
    todayRows = data.tomorrowHours
    tomorrowRows = null
  }

  const zones = ZONES.filter((z) => bars(todayRows, z.id, 'today').length > 0)
  if (zones.length === 0) return <Failure />
  const zone = zones.find((z) => z.id === wantedZone) ?? zones[0]

  const today = bars(todayRows, zone.id, 'today')
  const tomorrow = tomorrowRows ? bars(tomorrowRows, zone.id, 'tomorrow') : []
  const remaining = now ? today.filter((b) => b.hour >= now.hour) : []
  const best = now ? cheapest(remaining) : cheapest(today)
  const tomorrowBest = cheapest(tomorrow)
  const currentBar = now ? (today.find((b) => b.hour === now.hour) ?? null) : null

  // With tomorrow known the chart looks ahead: now through the end of tomorrow.
  // Otherwise it is today, with the hours gone dimmed.
  const rolling = now !== null && tomorrow.length > 0
  const shown = rolling ? [...remaining, ...tomorrow] : today
  const dayStart = rolling ? remaining.length : -1
  const nowIndex = currentBar ? shown.indexOf(currentBar) : -1

  const selected = shown.find((b) => keyOf(b) === picked) ?? currentBar ?? best ?? tomorrowBest ?? shown[0]
  const selectedIndex = shown.indexOf(selected)
  const readout = `${selected.day === 'tomorrow' ? 'I morgen ' : ''}${kl(selected.hour)}: ${formatKr(selected.price)} pr. kWh`

  const top = Math.max(...shown.map((b) => b.price), 0) || 1
  const third = thirds(shown)

  const scrub = (e: PointerEvent<HTMLDivElement>) => {
    const box = e.currentTarget.getBoundingClientRect()
    const i = Math.floor(((e.clientX - box.left) / box.width) * shown.length)
    setPicked(keyOf(shown[Math.min(shown.length - 1, Math.max(0, i))]))
  }

  const [, month, day] = data.date.split('-').map(Number)

  return (
    <>
      <div className="ae-panel" style={{ '--ae-n': shown.length } as React.CSSProperties}>
        <div className="ae-top">
          <div className="ae-answer">
            {now === null && (
              <p className="ae-date">
                Priser for {day}. {MONTHS[month - 1]}
              </p>
            )}
            {now !== null && best !== null && (
              <p className="ae-today">
                I dag:{' '}
                <em>{best === currentBar ? `nu til kl. ${endOf(todayRows, best.hour)}` : span(todayRows, best.hour)}</em>
              </p>
            )}
            {now !== null && best === null && tomorrowBest === null && (
              <p className="ae-today">Se priserne igen i morgen</p>
            )}
            {now !== null && tomorrowRows !== null && tomorrowBest !== null && (
              <p className={best === null ? 'ae-today' : 'ae-tomorrow'}>
                I morgen: {best === null ? <em>{span(tomorrowRows, tomorrowBest.hour)}</em> : span(tomorrowRows, tomorrowBest.hour)}
              </p>
            )}
          </div>
          <div className="ae-side">
            {zones.length === 2 && (
              <div className="ae-zones" role="group" aria-label="Vælg landsdel">
                {zones.map((z) => (
                  <button key={z.id} type="button" aria-pressed={z.id === zone.id} onClick={() => setWantedZone(z.id)}>
                    {z.label}
                  </button>
                ))}
              </div>
            )}
            <p className="ae-readout">{readout}</p>
          </div>
        </div>

        <div
          ref={watch}
          className="ae-bars"
          data-rise={rise ?? undefined}
          aria-hidden
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId)
            scrub(e)
          }}
          onPointerMove={(e) => {
            if (e.pointerType === 'mouse' || e.currentTarget.hasPointerCapture(e.pointerId)) scrub(e)
          }}
          onPointerLeave={(e) => {
            if (e.pointerType === 'mouse') setPicked(null)
          }}
        >
          {shown.map((b, i) => {
            const isSelected = b === selected
            return (
              <div key={keyOf(b)} className="ae-col" data-daystart={(i === dayStart && i > 0) || undefined}>
                {(b === currentBar || isSelected) && (
                  <span className="ae-mark" data-now={b === currentBar || undefined} />
                )}
                {/* A negative price stays at the baseline; the readout says the real number. */}
                <span
                  className="ae-bar"
                  data-level={b === best || b === tomorrowBest ? 'best' : third(b.price)}
                  data-past={(now !== null && b.day === 'today' && b.hour < now.hour) || undefined}
                  style={
                    { height: `${(Math.max(b.price, 0) / top) * 100}%`, '--ae-i': i } as React.CSSProperties
                  }
                />
              </div>
            )
          })}
        </div>

        <div className="ae-axis" aria-hidden>
          {shown.map((b, i) => {
            const isNow = b === currentBar
            const isDayStart = i === dayStart
            const clearOfNow = nowIndex < 0 || Math.abs(nowIndex - i) > 2
            // Fits on a wide chart, but not beside the "Nu" pill or "I morgen" at phone width.
            const tight = rolling && (Math.abs(nowIndex - i) <= 4 || (i > dayStart && i - dayStart <= 6))
            return (
              <span key={keyOf(b)} data-daystart={(isDayStart && i > 0) || undefined} data-tight={tight || undefined}>
                {isNow && <span className="ae-now">Nu</span>}
                {!isNow && isDayStart && (
                  <span
                    className="ae-tomorrow-label"
                    style={nowIndex < 0 ? undefined : ({ '--ae-after-now': i - nowIndex } as React.CSSProperties)}
                  >
                    I morgen
                  </span>
                )}
                {!isNow && !isDayStart && b.hour % 6 === 0 && clearOfNow && (
                  <span className="ae-time">
                    <span className="ae-kl">kl.&nbsp;</span>
                    {String(b.hour).padStart(2, '0')}
                  </span>
                )}
              </span>
            )
          })}
        </div>

        <input
          className="ae-range"
          type="range"
          min={0}
          max={shown.length - 1}
          step={1}
          value={selectedIndex}
          aria-label="Vælg time"
          aria-valuetext={readout}
          onChange={(e) => setPicked(keyOf(shown[Number(e.target.value)]))}
        />
      </div>

      <p className="ae-source">
        {rolling ? 'Dagens og morgendagens' : 'Dagens'} timepriser inkl. afgifter og moms i {zone.label}, med {zone.netselskab} som netselskab. Kilde: Strømligning.
      </p>
    </>
  )
}
