import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  copenhagenDateKey,
  currentCopenhagenHour,
  DEFAULT_SUPPLIERS,
  formatKr,
  getElpriser,
  getNetselskaber,
  getSupplierPrices,
  hourSpan,
  MOMS,
  nextDateKey,
  priceWith,
} from '@/lib/elpriser'

// ── Rene prisfunktioner ──────────────────────────────────────────────────
describe('priceWith', () => {
  // Netselskabets transport (dist) er ALTID med; spot er altid med.
  // elafgift/transmission/moms er tilvalg.
  it('lægger altid spot + dist sammen, uanset tilvalg', () => {
    expect(priceWith(1, 0.008, 0.1, 0.2, { elafgift: false, transmission: false, moms: false })).toBeCloseTo(1.2)
  })

  it('tilføjer elafgift og transmission når de er valgt', () => {
    expect(priceWith(1, 0.008, 0.1, 0.2, { elafgift: true, transmission: true, moms: false })).toBeCloseTo(1.308)
  })

  it('ganger HELE summen med moms til sidst', () => {
    expect(priceWith(1, 0.008, 0.1, 0.2, { elafgift: true, transmission: true, moms: true })).toBeCloseTo(1.308 * MOMS)
  })

  it('MOMS er 25 %', () => {
    expect(MOMS).toBe(1.25)
  })
})

describe('hourSpan', () => {
  it('nulpolstrer og bruger en-dash', () => {
    expect(hourSpan(0)).toBe('00–01')
    expect(hourSpan(9)).toBe('09–10')
  })

  it('ombryder ved midnat (23 → 00, ikke 24)', () => {
    expect(hourSpan(23)).toBe('23–00')
  })
})

describe('formatKr', () => {
  it('viser en-dash for null', () => {
    expect(formatKr(null)).toBe('–')
  })

  it('formaterer med dansk komma og to decimaler', () => {
    expect(formatKr(0.5)).toBe('0,50 kr.')
    expect(formatKr(1.2)).toBe('1,20 kr.')
  })
})

// ── Dato-aritmetik (DST-fælden) ──────────────────────────────────────────
describe('nextDateKey', () => {
  it('går én kalenderdag frem på en normal dag', () => {
    expect(nextDateKey('2026-06-12')).toBe('2026-06-13')
  })

  it('krydser månedsskel', () => {
    expect(nextDateKey('2026-01-31')).toBe('2026-02-01')
  })

  it('krydser årsskel', () => {
    expect(nextDateKey('2026-12-31')).toBe('2027-01-01')
  })

  it('rammer skuddag', () => {
    expect(nextDateKey('2024-02-28')).toBe('2024-02-29')
  })

  // Kernen: på den danske vinterskiftedag (26. okt 2025, 25 timer) må
  // "i morgen" IKKE bare være nu+24t på uret — det ville lande samme dato.
  it('advancerer præcis én dag hen over sommertids-OPHØR (25-timers dag)', () => {
    expect(nextDateKey('2025-10-26')).toBe('2025-10-27')
  })

  it('advancerer præcis én dag hen over sommertids-START (23-timers dag)', () => {
    expect(nextDateKey('2025-03-30')).toBe('2025-03-31')
  })
})

describe('copenhagenDateKey', () => {
  it('bruger København-tidszonen, ikke UTC', () => {
    // 21:30 UTC om sommeren = 23:30 i København → stadig samme dato.
    expect(copenhagenDateKey(new Date('2026-06-12T21:30:00Z'))).toBe('2026-06-12')
    // 22:30 UTC = 00:30 København næste dag → datoen ruller.
    expect(copenhagenDateKey(new Date('2026-06-12T22:30:00Z'))).toBe('2026-06-13')
  })
})

describe('currentCopenhagenHour', () => {
  it('er et heltal i intervallet 0-23', () => {
    const h = currentCopenhagenHour()
    expect(Number.isInteger(h)).toBe(true)
    expect(h).toBeGreaterThanOrEqual(0)
    expect(h).toBeLessThanOrEqual(23)
  })
})

// ── Netværksfunktioner (fetch mocket) ────────────────────────────────────

/** Byg ét 15-min-prispunkt i API'ets form for en given dato/time. */
function price(date: string, hour: number, spot: number) {
  return {
    localDate: `${date}T${String(hour).padStart(2, '0')}:00:00`,
    details: {
      electricity: { value: spot },
      electricityTax: { value: 0.008 },
      transmission: { systemTariff: { value: 0.05 }, netTariff: { value: 0.05 } },
      distribution: { value: 0.3 },
    },
  }
}

function mockFetch(payload: unknown, ok = true) {
  vi.stubGlobal(
    'fetch',
    vi.fn(async (url: string) => ({
      ok,
      json: async () => payload,
    })),
  )
}

describe('getSupplierPrices', () => {
  afterEach(() => vi.unstubAllGlobals())

  const today = copenhagenDateKey(new Date())
  const tomorrow = nextDateKey(today)

  it('midler 15-min-priser til timegennemsnit og finder timens max', () => {
    mockFetch({
      prices: [price(today, 2, 0.4), price(today, 2, 0.6), price(today, 3, 1.0)],
    })
    return getSupplierPrices('radius_c').then((data) => {
      expect(data).not.toBeNull()
      const h2 = data!.hours.find((h) => h.hour === 2)!
      expect(h2.spot).toBeCloseTo(0.5) // (0.4 + 0.6) / 2
      expect(h2.spotMax).toBeCloseTo(0.6) // højeste 15-min inden for timen
      expect(h2.tax).toBeCloseTo(0.008)
      expect(h2.trans).toBeCloseTo(0.1) // system 0.05 + net 0.05
      expect(h2.dist).toBeCloseTo(0.3)
    })
  })

  it('kasserer urealistiske spotpriser (|spot| > 20) som korrupte', () => {
    mockFetch({
      prices: [price(today, 2, 0.5), price(today, 2, 99)], // 99 er enhedsfejl
    })
    return getSupplierPrices('radius_c').then((data) => {
      const h2 = data!.hours.find((h) => h.hour === 2)!
      expect(h2.spot).toBeCloseTo(0.5) // 99 indgår hverken i snit eller max
      expect(h2.spotMax).toBeCloseTo(0.5)
    })
  })

  it('adskiller i dag og i morgen på localDate', () => {
    mockFetch({
      prices: [price(today, 5, 0.2), price(tomorrow, 5, 0.9)],
    })
    return getSupplierPrices('radius_c').then((data) => {
      expect(data!.date).toBe(today)
      expect(data!.tomorrowDate).toBe(tomorrow)
      expect(data!.hours.find((h) => h.hour === 5)!.spot).toBeCloseTo(0.2)
      expect(data!.tomorrowHours!.find((h) => h.hour === 5)!.spot).toBeCloseTo(0.9)
    })
  })

  it('giver tomorrowHours = null når der ikke er morgendagspriser endnu', () => {
    mockFetch({ prices: [price(today, 5, 0.2)] })
    return getSupplierPrices('radius_c').then((data) => {
      expect(data!.tomorrowHours).toBeNull()
    })
  })

  it('returnerer null ved upstream-fejl (ikke-ok svar)', () => {
    mockFetch({}, false)
    return getSupplierPrices('radius_c').then((data) => expect(data).toBeNull())
  })

  it('returnerer null når fetch kaster (timeout/netværk)', () => {
    vi.stubGlobal('fetch', vi.fn(async () => { throw new Error('timeout') }))
    return getSupplierPrices('radius_c').then((data) => expect(data).toBeNull())
  })
})

describe('getNetselskaber', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('beholder kun DK1/DK2, navngiver og sorterer på dansk', () => {
    mockFetch([
      { id: 'radius_c', name: 'Radius C', priceArea: 'DK2' },
      { id: 'n1_c', name: 'N1 A/S', priceArea: 'DK1' },
      { id: 'cerius_c', name: 'Cerius C', priceArea: 'DK2' },
      { id: 'udland', name: 'Udland', priceArea: 'DE' }, // skal frasorteres
      { name: 'Uden id', priceArea: 'DK1' }, // mangler id → frasorteres
    ])
    return getNetselskaber().then((list) => {
      expect(list.map((n) => n.navn)).toEqual(['Cerius C', 'N1 A/S', 'Radius C'])
      expect(list.every((n) => n.area === 'DK1' || n.area === 'DK2')).toBe(true)
    })
  })

  it('returnerer tom liste ved upstream-fejl', () => {
    mockFetch([], false)
    return getNetselskaber().then((list) => expect(list).toEqual([]))
  })

  it('returnerer tom liste når fetch kaster', () => {
    vi.stubGlobal('fetch', vi.fn(async () => { throw new Error('down') }))
    return getNetselskaber().then((list) => expect(list).toEqual([]))
  })
})

describe('getElpriser', () => {
  afterEach(() => vi.unstubAllGlobals())

  const today = copenhagenDateKey(new Date())

  it('fletter Vest+Øst til ét datasæt', () => {
    // Begge standard-netselskaber henter fra samme mock → samme tal i dk1/dk2.
    mockFetch({ prices: [price(today, 4, 0.7)] })
    return getElpriser().then((data) => {
      expect(data).not.toBeNull()
      const row = data!.hours.find((h) => h.hour === 4)!
      expect(row.dk1).toBeCloseTo(0.7)
      expect(row.dk2).toBeCloseTo(0.7)
    })
  })

  it('returnerer null når begge områder fejler', () => {
    mockFetch({}, false)
    return getElpriser().then((data) => expect(data).toBeNull())
  })

  it('har sansynlige standard-netselskaber', () => {
    expect(DEFAULT_SUPPLIERS.DK1).toBe('n1_c')
    expect(DEFAULT_SUPPLIERS.DK2).toBe('radius_c')
  })
})
