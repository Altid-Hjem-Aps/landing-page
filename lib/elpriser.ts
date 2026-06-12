/**
 * Elpriser fra Strømligning (stromligning.dk) til elpris-siden
 * (/hvornar-er-strommen-billigst) — samme datakilde som altidenergi.dk's
 * egen prisgraf, så tallene matcher 1:1.
 *
 * API'et leverer 15-minutters-priser med ALLE komponenter pr. interval:
 * spot (electricity), elafgift (EU-minimum 0,8 øre/kWh fra 1. jan 2026),
 * Energinets system- og nettarif samt netselskabets transport (tidsafhængig —
 * dyrere i kogespidsen kl. 17-21). Alle værdier er ekskl. moms; grafen lægger
 * 25 % moms på til sidst.
 *
 * Som standard viser vi Radius' område for Øst (DK2) og N1's for Vest (DK1) —
 * de to største netselskaber — men brugeren kan vælge sit eget netselskab i
 * grafen; så henter klienten det via /api/elpriser (getSupplierPrices).
 *
 * Vi viser timegennemsnit — det er dét, forbrugere kan handle på
 * (opvaskeren starter ikke kl. 14:15). API'et er offentligt og nøglefrit;
 * fetch'ene cacher via Next ISR.
 */

const API = 'https://stromligning.dk/api'
export const DEFAULT_SUPPLIERS = { DK1: 'n1_c', DK2: 'radius_c' } as const

/** Moms-multiplikator — delt af graf og mockup, så prismatematikken aldrig drifter. */
export const MOMS = 1.25

export interface Fees {
  elafgift: boolean
  transmission: boolean
  moms: boolean
}

/** Fuld pris for en time: spot + netselskabets transport (altid med) + tilvalgte komponenter. */
export function priceWith(spot: number, tax: number, trans: number, dist: number, fees: Fees): number {
  const base = spot + dist + (fees.elafgift ? tax : 0) + (fees.transmission ? trans : 0)
  return fees.moms ? base * MOMS : base
}

/** "14–15"-formatering af en times interval. */
export function hourSpan(h: number): string {
  return `${String(h).padStart(2, '0')}–${String((h + 1) % 24).padStart(2, '0')}`
}

// Upstream-fejl må ikke kunne hænge en server-render eller API-rute.
const FETCH_TIMEOUT_MS = 8000

// Værn mod enhedsfejl upstream (fx øre leveret som kr): spotpriser uden for
// dette interval er aldrig forekommet og afvises som korrupte.
const MAX_TROVAERDIG_SPOT = 20

/** Én times priser for ét netselskab (alle kr./kWh ekskl. moms). */
export interface SupplierHour {
  hour: number // 0-23 (dansk tid)
  /** Spotpris — timegennemsnit af 15-min-priserne. */
  spot: number | null
  /** Højeste 15-min-spotpris inden for timen — "potentialet" (lys top). */
  spotMax: number | null
  /** Elafgift (EU-minimum 0,008 fra 2026). */
  tax: number | null
  /** Transmission: Energinets system- og nettarif (kan slås fra i grafen). */
  trans: number | null
  /** Netselskabets transport — følger valget af netselskab, altid med. */
  dist: number | null
}

export interface SupplierDayData {
  /** Dansk kalenderdato for "i dag", fx '2026-06-12' */
  date: string
  hours: SupplierHour[]
  /** Morgendagens priser — offentliggøres typisk kl. ~13; null før da. */
  tomorrowHours: SupplierHour[] | null
  tomorrowDate: string
}

/** Sammenlagt Vest+Øst-datasæt til siden's første render (standardnetselskaber). */
export interface HourPrice {
  hour: number
  dk1: number | null
  dk2: number | null
  dk1Max: number | null
  dk2Max: number | null
  dk1Tax: number | null
  dk2Tax: number | null
  dk1Trans: number | null
  dk2Trans: number | null
  dk1Dist: number | null
  dk2Dist: number | null
}

export interface ElpriserData {
  date: string
  hours: HourPrice[]
  tomorrowHours: HourPrice[] | null
  tomorrowDate: string
}

export interface Netselskab {
  id: string
  navn: string
  area: 'DK1' | 'DK2'
}

interface ApiComponent {
  value?: number
}

interface ApiPrice {
  localDate?: string
  details?: {
    electricity?: ApiComponent
    electricityTax?: ApiComponent
    transmission?: { systemTariff?: ApiComponent; netTariff?: ApiComponent }
    distribution?: ApiComponent
  }
}

function copenhagenDateKey(date: Date): string {
  return new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Europe/Copenhagen',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
}

/**
 * Næste kalenderdag ud fra en YYYY-MM-DD-nøgle. Bevidst IKKE "+24 timer på
 * uret": på oktober-skiftedagen (25 timer) ville nu+24h stadig være samme
 * lokale dato, og "i morgen" ville vise dagens priser igen.
 */
function nextDateKey(key: string): string {
  const d = new Date(`${key}T12:00:00Z`)
  d.setUTCDate(d.getUTCDate() + 1)
  return d.toISOString().slice(0, 10)
}

interface Bucket {
  spotSum: number
  spotMax: number
  taxSum: number
  transSum: number
  distSum: number
  n: number
}

function dayHours(buckets: Map<string, Bucket>, dateKey: string): SupplierHour[] {
  const hours: SupplierHour[] = []
  for (let h = 0; h < 24; h++) {
    const b = buckets.get(`${dateKey}:${h}`)
    if (!b) continue
    hours.push({
      hour: h,
      spot: b.spotSum / b.n,
      spotMax: b.spotMax,
      tax: b.taxSum / b.n,
      trans: b.transSum / b.n,
      dist: b.distSum / b.n,
    })
  }
  return hours
}

/** Hent i dag + i morgen for ét netselskab (cachet ½ time). */
export async function getSupplierPrices(supplierId: string): Promise<SupplierDayData | null> {
  const today = copenhagenDateKey(new Date())
  const tomorrow = nextDateKey(today)
  const dayAfter = nextDateKey(tomorrow)

  try {
    const res = await fetch(
      `${API}/Prices?supplierId=${encodeURIComponent(supplierId)}&from=${today}T00:00:00&to=${dayAfter}T00:00:00`,
      { next: { revalidate: 1800 }, signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) },
    )
    if (!res.ok) return null
    const data = (await res.json()) as { prices?: ApiPrice[] }

    const buckets = new Map<string, Bucket>()
    for (const p of data.prices ?? []) {
      const time = p.localDate
      const spot = p.details?.electricity?.value
      if (!time || typeof spot !== 'number') continue
      if (Math.abs(spot) > MAX_TROVAERDIG_SPOT) continue
      const day = time.slice(0, 10)
      const hour = Number(time.slice(11, 13))
      if (Number.isNaN(hour)) continue
      const tax = p.details?.electricityTax?.value ?? 0
      const trans =
        (p.details?.transmission?.systemTariff?.value ?? 0) +
        (p.details?.transmission?.netTariff?.value ?? 0)
      const dist = p.details?.distribution?.value ?? 0
      const key = `${day}:${hour}`
      const b =
        buckets.get(key) ??
        { spotSum: 0, spotMax: -Infinity, taxSum: 0, transSum: 0, distSum: 0, n: 0 }
      b.spotSum += spot
      b.spotMax = Math.max(b.spotMax, spot)
      b.taxSum += tax
      b.transSum += trans
      b.distSum += dist
      b.n += 1
      buckets.set(key, b)
    }

    const hours = dayHours(buckets, today)
    if (!hours.length) return null
    const tomorrowHours = dayHours(buckets, tomorrow)
    return {
      date: today,
      hours,
      tomorrowHours: tomorrowHours.length ? tomorrowHours : null,
      tomorrowDate: tomorrow,
    }
  } catch {
    return null
  }
}

/** Standarddatasættet til første render: N1 (Vest) + Radius (Øst) flettet. */
export async function getElpriser(): Promise<ElpriserData | null> {
  const [dk1, dk2] = await Promise.all([
    getSupplierPrices(DEFAULT_SUPPLIERS.DK1),
    getSupplierPrices(DEFAULT_SUPPLIERS.DK2),
  ])
  const base = dk2 ?? dk1
  if (!base) return null

  const merge = (a: SupplierHour[] | null, b: SupplierHour[] | null): HourPrice[] => {
    const rows: HourPrice[] = []
    for (let h = 0; h < 24; h++) {
      const h1 = a?.find((x) => x.hour === h)
      const h2 = b?.find((x) => x.hour === h)
      if (!h1 && !h2) continue
      rows.push({
        hour: h,
        dk1: h1?.spot ?? null,
        dk2: h2?.spot ?? null,
        dk1Max: h1?.spotMax ?? null,
        dk2Max: h2?.spotMax ?? null,
        dk1Tax: h1?.tax ?? null,
        dk2Tax: h2?.tax ?? null,
        dk1Trans: h1?.trans ?? null,
        dk2Trans: h2?.trans ?? null,
        dk1Dist: h1?.dist ?? null,
        dk2Dist: h2?.dist ?? null,
      })
    }
    return rows
  }

  const hours = merge(dk1?.hours ?? null, dk2?.hours ?? null)
  if (!hours.length) return null
  const tomorrowHours = merge(dk1?.tomorrowHours ?? null, dk2?.tomorrowHours ?? null)
  return {
    date: base.date,
    hours,
    tomorrowHours: tomorrowHours.length ? tomorrowHours : null,
    tomorrowDate: base.tomorrowDate,
  }
}

interface ApiSupplier {
  id?: string
  name?: string
  companyName?: string
  priceArea?: string
}

/** Alle netselskaber til vælgeren i grafen (cachet et døgn). */
export async function getNetselskaber(): Promise<Netselskab[]> {
  try {
    const res = await fetch(`${API}/suppliers`, {
      next: { revalidate: 86400 },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    })
    if (!res.ok) return []
    const suppliers = (await res.json()) as ApiSupplier[]

    // API'ets "name"-felt er præcis dét, Strømlignings (og dermed Altid
    // Energis) egen vælger viser — fx "Radius C", "Cerius C", "N1 A/S - 131".
    return suppliers
      .flatMap((s) => {
        if (!s.id || (s.priceArea !== 'DK1' && s.priceArea !== 'DK2')) return []
        return [{ id: s.id, navn: s.name ?? s.companyName ?? s.id, area: s.priceArea as 'DK1' | 'DK2' }]
      })
      .sort((a, b) => a.navn.localeCompare(b.navn, 'da'))
  } catch {
    return []
  }
}

/** Nuværende time i dansk tid (0-23) — til "lige nu"-markering. */
export function currentCopenhagenHour(): number {
  return Number(
    new Intl.DateTimeFormat('da-DK', {
      timeZone: 'Europe/Copenhagen',
      hour: '2-digit',
      // h23 eksplicit: hour12:false kan i visse ICU-kombinationer give h24,
      // hvor midnat formateres "24" og aldrig matcher grafens timer 0-23.
      hourCycle: 'h23',
    }).format(new Date()),
  )
}

export function formatKr(price: number | null): string {
  if (price === null) return '–'
  return `${price.toLocaleString('da-DK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kr.`
}
