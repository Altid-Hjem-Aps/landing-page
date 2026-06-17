'use client'

import { useEffect, useState } from 'react'
import {
  DEFAULT_SUPPLIERS,
  formatKr,
  hourSpan,
  priceWith,
  type ElpriserData,
  type Fees,
  type HourPrice,
  type Netselskab,
  type SupplierDayData,
  type SupplierHour,
} from '@/lib/elpriser'

/**
 * Timepris-graf i Andel-stil: ét område ad gangen (Vest/Øst), stor pris som
 * overskrift med hover/tap-aflæsning, kr./kWh-akse i højre side, alle 24
 * timer på x-aksen og "Billigst"/"Dyrest" markeret direkte på søjlerne.
 *
 * Søjlens lyse top = timens højeste 15-minutters-pris ("potentialet") —
 * strøm handles i kvarters-intervaller, og den solide søjle er gennemsnittet.
 * Hover fremhæver HELE kolonnen (samme effekt som dashboardets dagsgraf);
 * markøren for nuværende time viger, mens man peger på andre kolonner.
 * Serveren henter data (lib/elpriser.ts); denne komponent er kun visning.
 */

interface Props {
  data: ElpriserData
  nowHour: number
  netselskaber: Netselskab[]
}

type Area = 'dk1' | 'dk2'
type Day = 'today' | 'tomorrow'

const AREA_LABEL: Record<Area, string> = { dk1: 'Vestdanmark', dk2: 'Østdanmark' }
// Standardnetselskab pr. område — afledt af lib'ens konstant, så serverens
// første render og klientens cache-logik aldrig kan pege på forskellige id'er.
const DEFAULT_NET: Record<Area, string> = { dk1: DEFAULT_SUPPLIERS.DK1, dk2: DEFAULT_SUPPLIERS.DK2 }

// Satserne kommer time for time fra Strømligning (samme datakilde som
// altidenergi.dk's graf), så totalerne matcher 1:1: elafgift er EU's minimum
// (0,8 øre/kWh + moms) fra 1. jan 2026, "Transmission" er Energinets system-
// og nettarif, og netselskabets transport følger det valgte netselskab og er
// ALTID med (dyrere i kogespidsen kl. 17-21) — præcis som i Altid Energis
// graf, hvor transmissions-kontakten ikke rører netselskabets transport.
// Moms er 25 % af det hele. Selve prisformlen (priceWith) bor i lib/elpriser,
// delt med mockup'en, så matematikken aldrig drifter mellem visningerne.

function Pill({
  active,
  onClick,
  children,
  disabled = false,
  title,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
  disabled?: boolean
  title?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className="text-xs font-semibold px-3.5 py-1.5 rounded-full transition-colors"
      style={{
        background: active ? 'var(--forest)' : 'rgba(26,61,34,0.06)',
        color: active ? '#fff' : 'var(--forest)',
        border: '1px solid ' + (active ? 'var(--forest)' : 'rgba(26,61,34,0.15)'),
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.45 : 1,
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      {children}
    </button>
  )
}

export default function ElprisChart({ data, nowHour, netselskaber }: Props) {
  const [area, setArea] = useState<Area>('dk2')
  const [day, setDay] = useState<Day>('today')
  const [hovered, setHovered] = useState<number | null>(null)
  // Kontakter: hver priskomponent kan slås til/fra hver for sig.
  const [fees, setFees] = useState<Fees>({ elafgift: true, transmission: true, moms: true })
  // Info-fold: forklaringen af grafen gemmer sig bag et ⓘ-ikon.
  const [infoOpen, setInfoOpen] = useState(false)

  // Netselskabs-vælger: standard er Radius (Øst) / N1 (Vest), som serveren
  // allerede har hentet; andre valg hentes fra /api/elpriser og caches pr.
  // id, så man kan sammenligne frem og tilbage uden nye kald.
  const [netselskabId, setNetselskabId] = useState<string>(DEFAULT_NET.dk2)
  const [hentede, setHentede] = useState<Record<string, SupplierDayData>>({})
  const [netFejl, setNetFejl] = useState<string | null>(null)
  const defaultNetId = DEFAULT_NET[area]

  // "Lige nu" må ikke fryse i ISR-cachen (siden regenereres hver ½ time):
  // serverens time bruges kun til første maling, klienten holder den ajour.
  const [aktuelTime, setAktuelTime] = useState(nowHour)
  useEffect(() => {
    const opdater = () =>
      setAktuelTime(
        Number(
          new Intl.DateTimeFormat('da-DK', {
            timeZone: 'Europe/Copenhagen',
            hour: '2-digit',
            hourCycle: 'h23',
          }).format(new Date()),
        ),
      )
    opdater()
    const t = setInterval(opdater, 60_000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    if (netselskabId === defaultNetId || hentede[netselskabId]) return
    let live = true
    fetch(`/api/elpriser?supplier=${encodeURIComponent(netselskabId)}`, {
      signal: AbortSignal.timeout(10000),
    })
      .then((r) => {
        if (!r.ok) throw new Error()
        return r.json()
      })
      .then((d: SupplierDayData) => {
        if (!live) return
        setHentede((h) => ({ ...h, [netselskabId]: d }))
        setNetFejl(null)
      })
      .catch(() => {
        if (!live) return
        // Fald tilbage til områdets standard — og SIG det, i stedet for
        // stiltiende at vise andre tal, end brugeren bad om.
        const valgt = netselskaber.find((n) => n.id === netselskabId)?.navn ?? 'netselskabet'
        const standard = netselskaber.find((n) => n.id === defaultNetId)?.navn ?? 'standard'
        setNetFejl(`Kunne ikke hente ${valgt} — viser ${standard} i stedet.`)
        setNetselskabId(defaultNetId)
      })
    return () => {
      live = false
    }
  }, [netselskabId, defaultNetId, hentede, netselskaber])

  const vaelgArea = (a: Area) => {
    setArea(a)
    setNetselskabId(DEFAULT_NET[a])
    setNetFejl(null)
  }

  const customData = netselskabId !== defaultNetId ? hentede[netselskabId] ?? null : null
  const henterNet = netselskabId !== defaultNetId && !customData
  const tomorrowAvailable = customData ? customData.tomorrowHours !== null : data.tomorrowHours !== null
  const valgtNavn =
    netselskaber.find((n) => n.id === netselskabId)?.navn ?? (area === 'dk1' ? 'N1' : 'Radius Elnet')

  // Kontakterne styrer, hvilke komponenter der lægges oven i spotprisen —
  // satserne er timens egne for det valgte netselskab (transporten varierer
  // over døgnet, dyrest i kogespidsen kl. 17-21).
  // Begge dage mappes til ens rækker, uanset om data kommer fra standard-
  // datasættet eller et klient-hentet netselskab — grafen viser den valgte
  // dag, mens nøgletallene øverst scanner i dag + i morgen samlet.
  type Row = {
    hour: number
    spot: number | null
    peakSpot: number | null
    tax: number
    trans: number
    dist: number
  }
  const mapCustom = (hs: SupplierHour[]): Row[] =>
    hs.map((h) => ({
      hour: h.hour,
      spot: h.spot,
      peakSpot: h.spotMax,
      tax: h.tax ?? 0,
      trans: h.trans ?? 0,
      dist: h.dist ?? 0,
    }))
  const mapDefault = (hs: HourPrice[]): Row[] =>
    hs.map((h) => ({
      hour: h.hour,
      spot: area === 'dk1' ? h.dk1 : h.dk2,
      peakSpot: area === 'dk1' ? h.dk1Max : h.dk2Max,
      tax: (area === 'dk1' ? h.dk1Tax : h.dk2Tax) ?? 0,
      trans: (area === 'dk1' ? h.dk1Trans : h.dk2Trans) ?? 0,
      dist: (area === 'dk1' ? h.dk1Dist : h.dk2Dist) ?? 0,
    }))
  const todayRows = customData ? mapCustom(customData.hours) : mapDefault(data.hours)
  const tomorrowRows = customData
    ? customData.tomorrowHours && mapCustom(customData.tomorrowHours)
    : data.tomorrowHours && mapDefault(data.tomorrowHours)
  // Skifter man til et datasæt uden morgendagspriser, mens "I morgen" er
  // valgt, falder HELE visningen tilbage til i dag — også overskrifterne,
  // så der aldrig står "I morgen" over dagens tal.
  const visningsDag: Day = tomorrowAvailable ? day : 'today'
  const rows = visningsDag === 'today' ? todayRows : tomorrowRows || todayRows
  const values = rows.map((r) => ({
    hour: r.hour,
    spot: r.spot,
    price: r.spot === null ? null : priceWith(r.spot, r.tax, r.trans, r.dist, fees),
    peak:
      r.spot === null || r.peakSpot === null
        ? null
        : priceWith(r.peakSpot, r.tax, r.trans, r.dist, fees),
  }))
  const known = values.filter(
    (v): v is { hour: number; spot: number; price: number; peak: number | null } => v.price !== null,
  )
  if (!known.length) {
    // Delvist upstream-svigt (fx kun ét område hentet): kortet må ikke
    // forsvinde helt — så mister brugeren også knapperne til at skifte
    // tilbage til et område, der HAR data.
    return (
      <div
        className="rounded-2xl p-5 sm:p-6"
        style={{ background: '#ffffff', border: '1px solid rgba(26,61,34,0.1)', boxShadow: '0 1px 3px rgba(26,61,34,0.06)' }}
      >
        <div className="flex gap-2 mb-4">
          <Pill active={area === 'dk1'} onClick={() => vaelgArea('dk1')}>Vest (DK1)</Pill>
          <Pill active={area === 'dk2'} onClick={() => vaelgArea('dk2')}>Øst (DK2)</Pill>
        </div>
        <p className="text-sm" style={{ color: 'rgba(26,61,34,0.6)' }}>
          Priserne for {AREA_LABEL[area]} kan ikke hentes lige nu — prøv igen om lidt, eller
          skift område ovenfor.
        </p>
      </div>
    )
  }

  const isToday = visningsDag === 'today'
  const current = isToday ? known.find((v) => v.hour === aktuelTime) ?? null : null
  const hoveredValue = hovered !== null ? known.find((v) => v.hour === hovered) ?? null : null

  // Billigst/Dyrest pr. VIST døgn (på fuld pris) — skifter med I dag/I morgen.
  const byPrice = [...known].sort((a, b) => a.price - b.price)
  const cheapest = byPrice[0]
  const priciest = byPrice[byPrice.length - 1]

  // Aksen følger dagens niveau i 0,50-trin, så søjlerne hverken fladtrykkes
  // eller stikker over toppen, uanset hvilke komponenter der er slået til.
  const maxShown = Math.max(...known.map((v) => Math.max(v.peak ?? v.price, v.price)))
  const scaleMax = Math.max(1.5, Math.ceil(maxShown * 2) / 2)
  const gridTop = scaleMax
  const gridValues: number[] = []
  for (let v = 0.5; v <= gridTop + 0.001; v += 0.5) gridValues.push(Number(v.toFixed(2)))

  const shown = hoveredValue ?? current ?? cheapest
  const dateLabel = (isToday ? data.date : data.tomorrowDate).split('-').reverse().join('.')
  const subject = 'strømmen'
  // Netselskabets transport er altid med (følger valget af netselskab) —
  // kontakterne styrer kun elafgift, transmission og moms, som hos Altid Energi.
  const includedList = [
    'netselskabets transport',
    fees.elafgift && 'elafgift',
    fees.transmission && 'transmission',
    fees.moms && 'moms',
  ]
    .filter(Boolean)
    .join(', ')
    .replace(/, ([^,]*)$/, ' og $1')
  const headline = hoveredValue
    ? `Kl. ${hourSpan(shown.hour)} ${isToday ? 'koster' : 'kommer'} ${subject} i ${AREA_LABEL[area]}${isToday ? '' : ' til at koste'}`
    : current
      ? `Lige nu (kl. ${hourSpan(shown.hour)}) koster ${subject} i ${AREA_LABEL[area]}`
      : `I morgen (${dateLabel}) er strømmen billigst kl. ${hourSpan(shown.hour)} i ${AREA_LABEL[area]}`

  // Nøgletal over grafen ("Totale elpris" hos Altid Energi): scanner i dag OG
  // i morgen samlet (når morgendagens priser er ude), uafhængigt af hvilken
  // dag grafen viser — men med samme netselskab og komponenter slået til.
  const statPool = [
    { dato: data.date, dagRows: todayRows },
    ...(tomorrowRows ? [{ dato: data.tomorrowDate, dagRows: tomorrowRows }] : []),
  ].flatMap((d) =>
    d.dagRows.flatMap((r) =>
      r.spot === null
        ? []
        : [{ dato: d.dato, hour: r.hour, price: priceWith(r.spot, r.tax, r.trans, r.dist, fees) }],
    ),
  )
  const ligeNu = statPool.find((p) => p.dato === data.date && p.hour === aktuelTime) ?? null
  const lavest = statPool.length ? statPool.reduce((a, b) => (b.price < a.price ? b : a)) : null
  const hoejest = statPool.length ? statPool.reduce((a, b) => (b.price > a.price ? b : a)) : null
  const gennemsnit = statPool.length
    ? statPool.reduce((sum, p) => sum + p.price, 0) / statPool.length
    : null

  const tidsstempel = (p: { dato: string; hour: number } | null): string | null =>
    p === null
      ? null
      : `${new Intl.DateTimeFormat('da-DK', { day: 'numeric', month: 'short' }).format(
          new Date(`${p.dato}T12:00:00`),
        )} kl. ${String(p.hour).padStart(2, '0')}:00`

  const noegletal: { label: string; value: number | null; farve?: string; tid?: string | null }[] = [
    { label: 'Lige nu', value: ligeNu?.price ?? null, tid: tidsstempel(ligeNu) },
    { label: 'Laveste pris', value: lavest?.price ?? null, farve: '#5cb434', tid: tidsstempel(lavest) },
    { label: 'Højeste pris', value: hoejest?.price ?? null, farve: '#d64541', tid: tidsstempel(hoejest) },
    { label: 'Gennemsnit', value: gennemsnit },
  ]

  return (
    <>
      {/* Nøgletal — almindelig tekst uden boks, oven på grafen */}
      <div className="flex flex-wrap gap-x-8 gap-y-3 mb-5">
        {noegletal.map((n) => (
          <div key={n.label}>
            <p className="text-xs mb-0.5" style={{ color: 'rgba(26,61,34,0.55)' }}>
              {n.label}
            </p>
            <p className="text-3xl font-bold leading-none tabular-nums" style={{ color: n.farve ?? 'var(--forest)' }}>
              {n.value === null ? '–' : formatKr(n.value)}
            </p>
            {n.tid && (
              <p className="text-[11px] mt-1" style={{ color: 'rgba(26,61,34,0.45)' }}>
                {n.tid}
              </p>
            )}
          </div>
        ))}
      </div>

    <div
      className="rounded-2xl p-5 sm:p-6"
      style={{ background: '#ffffff', border: '1px solid rgba(26,61,34,0.1)', boxShadow: '0 1px 3px rgba(26,61,34,0.06)' }}
    >
      {/* Toggles */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div className="flex gap-2">
          <Pill active={area === 'dk1'} onClick={() => vaelgArea('dk1')}>Vest (DK1)</Pill>
          <Pill active={area === 'dk2'} onClick={() => vaelgArea('dk2')}>Øst (DK2)</Pill>
        </div>
        <div className="flex gap-2">
          <Pill active={isToday} onClick={() => setDay('today')}>I dag</Pill>
          <Pill
            active={!isToday}
            onClick={() => setDay('tomorrow')}
            disabled={!tomorrowAvailable}
            title={tomorrowAvailable ? undefined : 'I morgens priser offentliggøres ca. kl. 13'}
          >
            I morgen
          </Pill>
        </div>
      </div>
      {!tomorrowAvailable && (
        <p className="text-[11px] mb-3 text-right" style={{ color: 'rgba(26,61,34,0.45)' }}>
          I morgens priser offentliggøres ca. kl. 13
        </p>
      )}

      {/* Det store tal — opdateres ved hover/tap på en kolonne */}
      <div className="mb-4" aria-live="polite">
        <p className="text-xs mb-1" style={{ color: 'rgba(26,61,34,0.55)' }}>{headline}</p>
        <p className="text-3xl font-bold leading-none" style={{ color: 'var(--forest)' }}>
          {formatKr(shown.price)}<span className="text-base font-semibold">/kWh</span>
        </p>
        <p className="text-xs mt-1" style={{ color: 'rgba(26,61,34,0.55)' }}>
          inkl. {includedList} (anslået) — heraf spotpris {formatKr(shown.spot)}/kWh
        </p>
      </div>

      {/* Akse-enhed over skalaen — i højre side */}
      <div className="flex justify-end mb-1">
        <p className="text-[10px] font-medium pl-2" style={{ color: 'rgba(26,61,34,0.5)', width: '3rem' }}>
          kr./kWh
        </p>
      </div>

      {/* Graf: plot + aksekolonne i højre side. Dæmpes mens et nyt netselskab
          hentes — søjlerne viser stadig det gamle datasæt, og det skal kunne
          ses, at tallene ikke er det valgte selskabs endnu. */}
      <div className="flex" style={{ opacity: henterNet ? 0.45 : 1, transition: 'opacity 200ms' }}>
        {/* Plot */}
        <div className="relative flex-1">
          {gridValues.map((v) => (
            <div
              key={v}
              className="absolute left-0 right-0 pointer-events-none"
              style={{ bottom: `${(v / scaleMax) * 100}%`, borderTop: '1px dashed rgba(26,61,34,0.12)' }}
            />
          ))}
          <div
            className="flex items-end gap-[3px] h-44 relative"
            role="img"
            aria-label={`Elpriser time for time, ${AREA_LABEL[area]}, ${dateLabel}`}
            onMouseLeave={() => setHovered(null)}
          >
            {values.map((v) => {
              // Nuværende time-markøren viger, mens man peger på en anden kolonne.
              const isNow = isToday && v.hour === aktuelTime && (hovered === null || hovered === v.hour)
              const isCheapest = v.hour === cheapest.hour
              const isPriciest = v.hour === priciest.hour
              const isHovered = v.hour === hovered
              const spotPct = v.price === null ? 0 : Math.max((Math.max(v.price, 0) / scaleMax) * 100, 2)
              const peakPct = v.price === null || v.peak === null ? 0 : Math.max(((v.peak - Math.max(v.price, 0)) / scaleMax) * 100, 0)
              // Hvile: lyse markørfarver. Hover: indholdet (søjlen) skifter til
              // mørkegrøn — og Billigst/Dyrest viser deres fulde farve i stedet.
              const spotColor = isHovered
                ? isPriciest
                  ? '#d64541'
                  : isCheapest
                    ? '#5cb434'
                    : 'var(--forest)'
                : isNow
                  ? 'rgba(26,61,34,0.85)'
                  : isCheapest
                    ? 'rgba(92,180,52,0.5)'
                    : isPriciest
                      ? 'rgba(214,69,65,0.5)'
                      : 'rgba(168,224,99,0.6)'
              const peakColor = isHovered
                ? isPriciest
                  ? 'rgba(214,69,65,0.45)'
                  : isCheapest
                    ? 'rgba(92,180,52,0.45)'
                    : 'rgba(26,61,34,0.3)'
                : isPriciest
                  ? 'rgba(214,69,65,0.22)'
                  : isCheapest
                    ? 'rgba(92,180,52,0.22)'
                    : 'rgba(168,224,99,0.25)'
              return (
                <div
                  key={v.hour}
                  className="flex-1 h-full relative flex flex-col justify-end cursor-pointer rounded-t-[3px]"
                  onMouseEnter={() => setHovered(v.hour)}
                  onClick={() => setHovered(v.hour)}
                >
                  {(isCheapest || isPriciest) && (
                    <span
                      className="absolute text-[9px] font-bold whitespace-nowrap"
                      style={{
                        bottom: `calc(${spotPct + peakPct}% + 3px)`,
                        left: v.hour > 20 ? 'auto' : v.hour < 3 ? 0 : '50%',
                        right: v.hour > 20 ? 0 : 'auto',
                        transform: v.hour > 20 || v.hour < 3 ? 'none' : 'translateX(-50%)',
                        color: isCheapest ? '#3e8c1f' : '#b43a37',
                      }}
                    >
                      {isCheapest ? 'Billigst' : 'Dyrest'}
                    </span>
                  )}
                  {/* Lys top: timens højeste kvartspris (potentialet) */}
                  <div
                    className="w-full rounded-t-[3px]"
                    style={{ height: `${peakPct}%`, background: peakColor }}
                  />
                  {/* Timegennemsnit */}
                  <div className="w-full transition-colors" style={{ height: `${spotPct}%`, background: spotColor }} />
                </div>
              )
            })}
          </div>
        </div>

        {/* Aksekolonne (højre) */}
        <div className="relative shrink-0 self-end h-44" style={{ width: '3rem' }}>
          {gridValues.map((v) => (
            <span
              key={v}
              className="absolute left-2 text-[10px] tabular-nums leading-none"
              style={{ bottom: `calc(${(v / scaleMax) * 100}% - 4px)`, color: 'rgba(26,61,34,0.5)' }}
            >
              {v.toLocaleString('da-DK', { minimumFractionDigits: 2 })}
            </span>
          ))}
        </div>
      </div>

      {/* Tidsakse: alle 24 timer på store skærme; på mellem vises hver anden
          og på mobil hver fjerde — de skjulte celler beholder deres plads, så
          tallene altid står præcis under deres søjle og aldrig klippes. */}
      <div className="flex mt-2">
        <div className="flex-1 flex gap-[3px] min-w-0">
          {values.map((v) => {
            const synlighed =
              v.hour % 4 === 0 ? '' : v.hour % 2 === 0 ? 'opacity-0 sm:opacity-100' : 'opacity-0 md:opacity-100'
            return (
              <span
                key={v.hour}
                className={`flex-1 min-w-0 text-center whitespace-nowrap text-[8px] sm:text-[9px] tabular-nums ${synlighed}`}
                style={{ color: v.hour === hovered ? 'var(--forest)' : 'rgba(26,61,34,0.45)' }}
              >
                {String(v.hour).padStart(2, '0')}
              </span>
            )
          })}
        </div>
        <div className="shrink-0" style={{ width: '3rem' }} />
      </div>

      {/* Netselskab + priskomponenter — én række, styrer hvad søjlerne viser */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-4">
        {netselskaber.length > 0 && (
          <div className="flex items-center gap-2">
            <select
              aria-label="Netselskab"
              value={netselskabId}
              onChange={(e) => {
                const valgt = netselskaber.find((n) => n.id === e.target.value)
                setNetselskabId(e.target.value)
                setNetFejl(null)
                // Vest/Øst følger netselskabet — spot hører til dets prisområde.
                if (valgt) setArea(valgt.area === 'DK1' ? 'dk1' : 'dk2')
              }}
              className="text-xs font-semibold px-2 py-1.5 rounded-lg max-w-[9rem]"
              style={{
                color: 'var(--forest)',
                background: 'rgba(26,61,34,0.06)',
                border: '1px solid rgba(26,61,34,0.15)',
                cursor: 'pointer',
                // Lange netselskabsnavne klippes med "…" i den lukkede vælger.
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {netselskaber.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.navn}
                </option>
              ))}
            </select>
            {henterNet && (
              <span className="text-[11px]" style={{ color: 'rgba(26,61,34,0.45)' }}>
                Henter…
              </span>
            )}
            {netFejl && !henterNet && (
              <span className="text-[11px]" style={{ color: '#b43a37' }}>
                {netFejl}
              </span>
            )}
          </div>
        )}
        {(
          [
            ['elafgift', 'Elafgift'],
            ['transmission', 'Transmission'],
            ['moms', 'Moms'],
          ] as const
        ).map(([key, label]) => (
          <div key={key} className="flex items-center gap-2">
            <button
              type="button"
              role="switch"
              aria-checked={fees[key]}
              aria-label={label}
              onClick={() => setFees((f) => ({ ...f, [key]: !f[key] }))}
              className="relative shrink-0 rounded-full transition-colors"
              style={{
                width: '2.25rem',
                height: '1.25rem',
                background: fees[key] ? 'var(--forest)' : 'rgba(26,61,34,0.2)',
                cursor: 'pointer',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              <span
                className="absolute rounded-full transition-transform"
                style={{
                  top: '0.125rem',
                  left: '0.125rem',
                  width: '1rem',
                  height: '1rem',
                  background: '#fff',
                  transform: fees[key] ? 'translateX(1rem)' : 'translateX(0)',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
                }}
              />
            </button>
            <label
              className="text-xs font-medium cursor-pointer select-none"
              style={{ color: 'var(--forest)' }}
              onClick={() => setFees((f) => ({ ...f, [key]: !f[key] }))}
            >
              {label}
            </label>
          </div>
        ))}
      </div>

      {/* Info-fold: forklaringen af grafen gemmer sig bag et ⓘ-ikon */}
      <div className="mt-4">
        <button
          type="button"
          onClick={() => setInfoOpen((v) => !v)}
          aria-expanded={infoOpen}
          className="inline-flex items-center gap-1.5 text-xs font-medium transition-opacity hover:opacity-70"
          style={{
            color: 'rgba(26,61,34,0.55)',
            cursor: 'pointer',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <circle cx="8" cy="8" r="7.25" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="8" cy="4.9" r="0.9" fill="currentColor" />
            <rect x="7.25" y="7" width="1.5" height="5" rx="0.75" fill="currentColor" />
          </svg>
          Om grafen
          <span
            aria-hidden="true"
            className="text-[10px] transition-transform duration-200"
            style={{ transform: infoOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
          >
            ▾
          </span>
        </button>
        {infoOpen && (
          <p className="mt-2 text-xs" style={{ color: 'rgba(26,61,34,0.5)' }}>
            Hold musen over (eller tryk på) en kolonne for at se timens pris. Søjlerne viser
            spotprisen plus dit netselskabs transport ({valgtNavn} — dyrere kl. 17-21) samt de
            komponenter, du slår til: elafgift (EU-minimum fra 2026, ca. 1 øre/kWh inkl. moms),
            transmission (Energinets system- og nettarif, ca. 14 øre/kWh inkl. moms) og 25 % moms.
            Den lyse top er timens højeste kvarterspris (strøm handles i 15-minutters
            intervaller). Grøn = {isToday ? 'dagens' : 'morgendagens'} billigste time, rød =
            dyreste{isToday ? ', mørkegrøn = nuværende time' : ''}. Data fra Strømligning.
          </p>
        )}
      </div>
    </div>
    </>
  )
}
