// Deterministic chaos pile — random positions render inconsistently and
// look bad. Eight bills labeled by category only ("Elregning", "Mobilregning",
// etc) — no fictional company names. Positions clustered toward the left
// of the canvas so the pile doesn't bleed into the arrow column.

export type ChaosBill = {
  type: string  // category-only invoice label, e.g. "Elregning"
  amount: number
  due: string
  tint: string
  x: number      // px offset from canvas center (clustered ≤ +60 to keep pile left)
  y: number
  rotate: number
  z: number
}

export const CHAOS_BILLS: ChaosBill[] = [
  { type: 'Elregning',         amount: 847, due: '1. maj',  tint: '#cbe4cd', x: -160, y:  -80, rotate: -10, z: 1 },
  { type: 'Mobilregning',      amount: 199, due: '5. maj',  tint: '#e8d8c4', x:  -20, y: -110, rotate:   7, z: 2 },
  { type: 'Forsikringspolice', amount: 489, due: '12. maj', tint: '#d8c8e0', x:   60, y:   20, rotate:  -4, z: 3 },
  { type: 'Internet',          amount: 299, due: '3. maj',  tint: '#c8dde8', x: -120, y:  130, rotate:  10, z: 4 },
  { type: 'Streaming',         amount:  99, due: '15. maj', tint: '#e0d4c0', x:    0, y:    0, rotate:  14, z: 5 },
  { type: 'Varmeregning',      amount: 612, due: '8. maj',  tint: '#dac8c8', x: -170, y:  160, rotate:   3, z: 6 },
  { type: 'Vandregning',       amount: 187, due: '20. maj', tint: '#c8e0d8', x:   40, y:  150, rotate: -12, z: 7 },
  { type: 'Abonnement',        amount: 159, due: '22. maj', tint: '#dcd0d8', x:  -60, y:   80, rotate:   2, z: 8 },
]

// 6-card mobile subset — centered around (0,0) so the pile renders in
// the middle of the screen on phones (the desktop set is left-clustered
// to clear the arrow column, which doesn't apply on the stacked mobile
// layout). Categories repeat the desktop story plus Streaming + Vandregning
// to give the chaos pile more visual density.
export const CHAOS_BILLS_MOBILE: ChaosBill[] = [
  { type: 'Elregning',         amount: 847, due: '1. maj',  tint: '#cbe4cd', x:  -90, y:  -80, rotate: -12, z: 1 },
  { type: 'Mobilregning',      amount: 199, due: '5. maj',  tint: '#e8d8c4', x:   20, y: -110, rotate:   8, z: 2 },
  { type: 'Forsikringspolice', amount: 489, due: '12. maj', tint: '#d8c8e0', x:   80, y:  -20, rotate:  -4, z: 3 },
  { type: 'Internet',          amount: 299, due: '3. maj',  tint: '#c8dde8', x:  -60, y:   30, rotate:  10, z: 4 },
  { type: 'Streaming',         amount:  99, due: '15. maj', tint: '#e0d4c0', x:   30, y:   90, rotate:  -6, z: 5 },
  { type: 'Vandregning',       amount: 187, due: '20. maj', tint: '#dac8c8', x:  -30, y:  130, rotate:   4, z: 6 },
]

// Final state — three launch subbrands + total
export const VICTORIOUS_SERVICES = [
  { label: 'Strøm',      sub: 'Næste betaling 1. maj', price: 347, bg: '#8fccff' },
  { label: 'Mobil',      sub: 'Næste betaling 1. maj', price: 199, bg: '#ffbbf8' },
  { label: 'Forsikring', sub: 'Næste betaling 1. maj', price: 389, bg: '#ffbab8' },
] as const

export const VICTORIOUS_TOTAL = VICTORIOUS_SERVICES.reduce((sum, s) => sum + s.price, 0)
