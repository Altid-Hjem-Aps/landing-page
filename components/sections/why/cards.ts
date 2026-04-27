// Deterministic chaos pile — random positions render inconsistently and
// look bad. Eight bills, generic Danish utility types, fictional brand
// names so we don't accidentally call out real competitors.

export type ChaosBill = {
  type: string
  brand: string
  amount: number
  due: string
  tint: string
  x: number      // px offset from canvas center
  y: number      // px offset from canvas center
  rotate: number // deg
  z: number      // stacking
}

export const CHAOS_BILLS: ChaosBill[] = [
  { type: 'Strøm',      brand: 'NorthernLight Energi', amount: 847, due: '1. maj',  tint: '#cbe4cd', x: -210, y:  -70, rotate:  -8, z: 1 },
  { type: 'Mobil',      brand: 'Telecom DK',           amount: 199, due: '5. maj',  tint: '#e8d8c4', x:  120, y: -120, rotate:   6, z: 2 },
  { type: 'Forsikring', brand: 'Nordic Sikring',       amount: 489, due: '12. maj', tint: '#d8c8e0', x:  180, y:   50, rotate:  -3, z: 3 },
  { type: 'Internet',   brand: 'FiberLink',            amount: 299, due: '3. maj',  tint: '#c8dde8', x: -150, y:  140, rotate:   9, z: 4 },
  { type: 'Streaming',  brand: 'StreamPlus',           amount:  99, due: '15. maj', tint: '#e0d4c0', x:   30, y:  -10, rotate:  14, z: 5 },
  { type: 'Varme',      brand: 'HeatSmart',            amount: 612, due: '8. maj',  tint: '#dac8c8', x: -240, y:  170, rotate:   4, z: 6 },
  { type: 'Vand',       brand: 'Kommune Vand',         amount: 187, due: '20. maj', tint: '#c8e0d8', x:  210, y:  190, rotate: -10, z: 7 },
  { type: 'Abonnement', brand: 'Diverse',              amount: 159, due: '22. maj', tint: '#dcd0d8', x:  -50, y:  100, rotate:   2, z: 8 },
]

// 4-card subset for mobile — keep visual story but reduce density
export const CHAOS_BILLS_MOBILE: ChaosBill[] = [
  CHAOS_BILLS[0], // Strøm
  CHAOS_BILLS[1], // Mobil
  CHAOS_BILLS[2], // Forsikring
  CHAOS_BILLS[3], // Internet
]

// Final state — three launch subbrands + total
export const VICTORIOUS_SERVICES = [
  { label: 'Strøm',      sub: 'Næste betaling 1. maj', price: 347, bg: '#8fccff' },
  { label: 'Mobil',      sub: 'Næste betaling 1. maj', price: 199, bg: '#ffbbf8' },
  { label: 'Forsikring', sub: 'Næste betaling 1. maj', price: 389, bg: '#ffbab8' },
] as const

export const VICTORIOUS_TOTAL = VICTORIOUS_SERVICES.reduce((sum, s) => sum + s.price, 0)
