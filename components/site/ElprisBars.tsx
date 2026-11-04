'use client'

import { useRef, useState, useSyncExternalStore, type PointerEvent } from 'react'
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

// Today's real hourly prices. The page is cached for half an hour and can outlive
// midnight, so everything that depends on "now" is decided in the browser after
// hydration: which day the rows belong to, which hours are past, what the answer
// is. Before that (and without JS) the chart shows the cached rows under their
// date and gives no answer that could be out of date.

type Zone = 'dk1' | 'dk2'
type Bar = { hour: number; price: number }

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

function bars(rows: HourPrice[], zone: Zone): Bar[] {
  return rows.flatMap((r) => {
    const [spot, tax, trans, dist] =
      zone === 'dk1' ? [r.dk1, r.dk1Tax, r.dk1Trans, r.dk1Dist] : [r.dk2, r.dk2Tax, r.dk2Trans, r.dk2Dist]
    if (spot === null || tax === null || trans === null || dist === null) return []
    return [{ hour: r.hour, price: priceWith(spot, tax, trans, dist, ALL_FEES) }]
  })
}

const cheapest = (list: Bar[]): Bar | null =>
  list.reduce<Bar | null>((best, b) => (best === null || b.price < best.price ? b : best), null)

const kl = (hour: number) => `kl. ${String(hour).padStart(2, '0')}`

/** The hour a row ends. Not hour + 1: the hour before the spring gap ends at 03. */
function endOf(rows: HourPrice[], hour: number): string {
  const next = rows.find((r) => r.hour > hour)?.hour ?? (hour + 1) % 24
  return String(next).padStart(2, '0')
}
const span = (rows: HourPrice[], hour: number) => `${kl(hour)} til ${endOf(rows, hour)}`

const subscribeToClock = (tick: () => void) => {
  const id = setInterval(tick, 30_000)
  return () => clearInterval(id)
}
const readClock = () => `${copenhagenDateKey(new Date())} ${currentCopenhagenHour()}`
const noClockOnServer = () => null

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
  const [picked, setPicked] = useState<number | null>(null)
  const barsRef = useRef<HTMLDivElement>(null)

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

  const zones = ZONES.filter((z) => bars(todayRows, z.id).length > 0)
  if (zones.length === 0) return <Failure />
  const zone = zones.find((z) => z.id === wantedZone) ?? zones[0]

  const today = bars(todayRows, zone.id)
  const remaining = now ? today.filter((b) => b.hour >= now.hour) : []
  const best = now ? cheapest(remaining) : cheapest(today)
  const tomorrowBest = tomorrowRows ? cheapest(bars(tomorrowRows, zone.id)) : null
  const currentBar = now ? (today.find((b) => b.hour === now.hour) ?? null) : null

  const selected = today.find((b) => b.hour === picked) ?? currentBar ?? best ?? today[0]
  const selectedIndex = today.indexOf(selected)
  const readout = `${kl(selected.hour)}: ${formatKr(selected.price)} pr. kWh`

  const top = Math.max(...today.map((b) => b.price), 0) || 1
  const low = Math.min(...today.map((b) => b.price))
  const range = Math.max(...today.map((b) => b.price)) - low

  const level = (b: Bar) => {
    if (b.hour === best?.hour) return 'best'
    const t = range === 0 ? 0 : (b.price - low) / range
    return t >= 0.72 ? 'high' : t >= 0.42 ? 'mid' : 'low'
  }

  const scrub = (e: PointerEvent<HTMLDivElement>) => {
    const box = (barsRef.current as HTMLDivElement).getBoundingClientRect()
    const i = Math.floor(((e.clientX - box.left) / box.width) * today.length)
    setPicked(today[Math.min(today.length - 1, Math.max(0, i))].hour)
  }

  const [, month, day] = data.date.split('-').map(Number)

  return (
    <>
      <div className="ae-panel" style={{ '--ae-n': today.length } as React.CSSProperties}>
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
          ref={barsRef}
          className="ae-bars"
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
          {today.map((b) => (
            <div key={b.hour} className="ae-col" data-selected={b.hour === selected.hour || undefined}>
              {/* A negative price stays at the baseline; the readout says the real number. */}
              <span
                className="ae-bar"
                data-level={level(b)}
                data-past={(now !== null && b.hour < now.hour) || undefined}
                style={{ height: `${(Math.max(b.price, 0) / top) * 100}%` }}
              />
            </div>
          ))}
        </div>

        <div className="ae-axis" aria-hidden>
          {today.map((b) => {
            const isNow = currentBar?.hour === b.hour
            const clearOfNow = !currentBar || Math.abs(currentBar.hour - b.hour) > 1
            return (
              <span key={b.hour} data-now={isNow || undefined}>
                {isNow && 'Nu'}
                {!isNow && b.hour % 6 === 0 && clearOfNow && (
                  <>
                    <span className="ae-kl">kl.&nbsp;</span>
                    {String(b.hour).padStart(2, '0')}
                  </>
                )}
              </span>
            )
          })}
        </div>

        <input
          className="ae-range"
          type="range"
          min={0}
          max={today.length - 1}
          step={1}
          value={selectedIndex}
          aria-label="Vælg time"
          aria-valuetext={readout}
          onChange={(e) => setPicked(today[Number(e.target.value)].hour)}
        />
      </div>

      <p className="ae-source">
        Dagens timepriser inkl. afgifter og moms i {zone.label}, med {zone.netselskab} som netselskab. Kilde: Strømligning.
      </p>
    </>
  )
}
