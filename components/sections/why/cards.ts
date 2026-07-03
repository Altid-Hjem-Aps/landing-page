// Data + shared timeline for the "Ét hjem" mockup animation.
//
// The story, on one entranceProgress 0→1:
//   1. SOURCES  — only the bill sources are visible: three physical letters,
//                 the Mail app icon and the e-Boks app icon. The badge on each
//                 icon equals EXACTLY the number of bills inside it.
//   2. OPEN     — each source is opened in turn (letters → Mail → e-Boks) and
//                 its bills fly out onto the TOP of the pile; once a source is
//                 emptied it is removed from the scene.
//   3. COLLECT  — the whole pile flies one-by-one into the Altid Hjem APP
//                 ICON, which is then pressed and opens the app interface.
//   4. LOAD     — the household (3 members) loads with each member's services
//                 attached; the current total monthly spend is shown.
//   5. OPTIMISE — the Altid Assistent goes through the members one by one and
//                 optimises every service; the saving ticks up in real time
//                 (same logic as the /hvad-koster-forsikring household card).
//   6. RECEIPT  — the interface collapses into the final summary card: the
//                 changes across ALL six Altid subbrands + the yearly saving.

export type SourceKind = 'letter' | 'mail' | 'eboks'

export type Bill = {
  name: string
  provider: string
  source: SourceKind
  envIndex?: number // which envelope it comes out of (letters only)
  price: number
  dueDay: number
  x: number // hovering-pile offset from the pile centre (px)
  y: number
  rotate: number
}

export type MemberService = {
  label: string
  icon: string // /services/icon-*.svg
  oldPrice: number
  newPrice: number
}
export type Member = {
  name: string
  role: 'adult' | 'child'
  services: MemberService[]
}

// Scenery positions (px offsets from the pile centre). The physical letters
// sit in the lower-left cluster and the Mail icon at the top (swapped per
// Thor); e-Boks stays at the right. Spread WIDE so the opening composition
// fills the section.
export const ENVELOPES = [
  { x: -435, y: 15,  rotate: -8 },
  { x: -320, y: 115, rotate: 5 },
  { x: -465, y: 205, rotate: -4 },
  { x: -235, y: 235, rotate: 7 },
]
export const ICON_POS: Record<'mail' | 'eboks', { x: number; y: number }> = {
  mail:  { x: -240, y: -235 },
  eboks: { x: 415,  y: 135 },
}

// Sixteen bills covering every Altid subbrand, grouped by where they come
// from. Emission order = array order, and each new bill lands ON TOP of the
// pile (zIndex = index). Providers are fictional; prices are realistic DK
// monthly amounts (groceries dominate, as they do in a real household budget).
// Bills carry only the due DAY; ChaosCard formats "1. juli" with the month
// read at render time (a module-scope Date here would be baked at build time
// by the static prerender and go stale when the month turns).

export const ITEMS: Bill[] = [
  { name: 'Elregning',        provider: 'NordEl A/S', source: 'letter', envIndex: 0, price:  649, dueDay: 1,  x: -200, y: -110, rotate: -9 },
  { name: 'Bilforsikring',    provider: 'SikkerPlus', source: 'letter', envIndex: 1, price:  519, dueDay: 3,  x:   60, y: -40,  rotate:  6 },
  { name: 'Indboforsikring',  provider: 'SikkerPlus', source: 'letter', envIndex: 2, price:  189, dueDay: 12, x:  230, y: -140, rotate: 10 },
  { name: 'Husforsikring',    provider: 'SikkerPlus', source: 'letter', envIndex: 3, price:  389, dueDay: 4,  x: -330, y: -160, rotate: -6 },
  { name: 'Ulykkesforsikring', provider: 'SikkerPlus', source: 'letter', envIndex: 1, price: 129, dueDay: 6,  x: -190, y:  225, rotate:  5 },
  { name: 'Mobilregning',     provider: 'TeleNu',     source: 'mail',                price:  249, dueDay: 5,  x: -230, y:  100, rotate: -5 },
  { name: 'Mobilt bredbånd',  provider: 'TeleNu',     source: 'mail',                price:  299, dueDay: 15, x:  100, y:  135, rotate:  8 },
  { name: 'Madplan',          provider: 'MadKurven',  source: 'mail',                price: 5200, dueDay: 7,  x:  -40, y: -10,  rotate:  3 },
  { name: 'Opladning',        provider: 'LadNemt',    source: 'mail',                price:  429, dueDay: 10, x: -330, y: -15,  rotate: -7 },
  { name: 'Mobilregning',     provider: 'TeleNu',     source: 'mail',                price:  149, dueDay: 14, x:  330, y: -30,  rotate:  7 },
  { name: 'Rejseforsikring',  provider: 'SikkerPlus', source: 'eboks',               price:   89, dueDay: 8,  x:  270, y:  60,  rotate: -6 },
  { name: 'Mobil (barn)',     provider: 'TeleNu',     source: 'eboks',               price:   99, dueDay: 18, x:  -60, y:  215, rotate:  4 },
  { name: 'Alarm',            provider: 'VagtPlus',   source: 'eboks',               price:  399, dueDay: 20, x:  180, y: -225, rotate:  5 },
  { name: 'Ulykkesforsikring', provider: 'SikkerPlus', source: 'eboks',               price: 129, dueDay: 9,  x:  300, y:  175, rotate:  6 },
  { name: 'Børneulykke',      provider: 'SikkerPlus', source: 'eboks',               price:   59, dueDay: 11, x:   35, y: -195, rotate: -5 },
  { name: 'Skolemad',         provider: 'MadKurven',  source: 'eboks',               price:  180, dueDay: 22, x:  150, y:  210, rotate: -4 },
]

export const M = ITEMS.length

// The household — same cast as the /hvad-koster-forsikring card. Every Altid
// subbrand is represented: energi, mobil, forsikring, opladning, alarm, mad.
export const MEMBERS: Member[] = [
  {
    name: 'Dig', role: 'adult',
    services: [
      { label: 'El',      icon: '/services/icon-strom.svg',      oldPrice: 649, newPrice: 569 },
      { label: 'Mobil',   icon: '/services/icon-mobil.svg',      oldPrice: 249, newPrice: 199 },
      { label: 'Bil',     icon: '/services/icon-forsikring.svg', oldPrice: 519, newPrice: 459 },
      { label: 'Hus',     icon: '/services/icon-forsikring.svg', oldPrice: 389, newPrice: 339 },
      { label: 'Ulykke',  icon: '/services/icon-forsikring.svg', oldPrice: 129, newPrice: 109 },
      { label: 'Ladning', icon: '/services/icon-opladning.svg',  oldPrice: 429, newPrice: 379 },
      { label: 'Alarm',   icon: '/services/icon-alarm.svg',      oldPrice: 399, newPrice: 349 },
    ],
  },
  {
    name: 'Marie', role: 'adult',
    services: [
      { label: 'Indbo',    icon: '/services/icon-forsikring.svg', oldPrice:  189, newPrice:  159 },
      { label: 'Bredbånd', icon: '/services/icon-mobil.svg',      oldPrice:  299, newPrice:  269 },
      { label: 'Mobil',    icon: '/services/icon-mobil.svg',      oldPrice:  149, newPrice:  119 },
      // Groceries dominate a real family budget — Altid Mad alone saves
      // 1.000 kr./md. = 12.000 kr./year (Thor: realistically 10–15k/year).
      { label: 'Mad',      icon: '/services/icon-mad.svg',        oldPrice: 5200, newPrice: 4200 },
      { label: 'Rejse',    icon: '/services/icon-forsikring.svg', oldPrice:   89, newPrice:   69 },
      { label: 'Ulykke',   icon: '/services/icon-forsikring.svg', oldPrice:  129, newPrice:  109 },
    ],
  },
  {
    name: 'Lukas', role: 'child',
    services: [
      { label: 'Mobil',    icon: '/services/icon-mobil.svg',      oldPrice:  99, newPrice:  69 },
      { label: 'Ulykke',   icon: '/services/icon-forsikring.svg', oldPrice:  59, newPrice:  49 },
      { label: 'Skolemad', icon: '/services/icon-mad.svg',        oldPrice: 180, newPrice: 160 },
    ],
  },
]

export const OLD_TOTAL = MEMBERS.reduce((s, m) => s + m.services.reduce((t, x) => t + x.oldPrice, 0), 0) // 9156
export const NEW_TOTAL = MEMBERS.reduce((s, m) => s + m.services.reduce((t, x) => t + x.newPrice, 0), 0) // 7606 → saving 1550
export const SAVING = OLD_TOTAL - NEW_TOTAL // 1550
export const YEAR_SAVING = SAVING * 12 // 18600

// The final receipt: the changes, one row per Altid subbrand, biggest first.
export const RECEIPT_ROWS = [
  { label: '2 madaftaler → Altid Mad',          save: 1020 },
  { label: '7 forsikringer → Altid Forsikring', save: 210 },
  { label: '4 mobilaftaler → Altid Mobil',      save: 140 },
  { label: 'El-aftale → Altid Energi',          save: 80 },
  { label: 'Opladning → Altid Opladning',       save: 50 },
  { label: 'Alarm → Altid Alarm',               save: 50 },
]

// === Timeline (fractions of entranceProgress) ===
export const DURATION = 38000
/** How long the finished receipt (yearly saving) holds before the animation
 *  loops from the top. */
export const LOOP_PAUSE = 5000
/** The fade the loop uses to blend the phone out / the sources scene in. */
export const LOOP_FADE = 650

// When each source is opened/emptied, and when it is removed from the scene.
export const SRC_WINDOW: Record<SourceKind, [number, number]> = {
  letter: [0.016, 0.095],
  mail:   [0.111, 0.174],
  eboks:  [0.19, 0.245],
}
const SRC_REMOVE: Record<SourceKind, number> = { letter: 0.099, mail: 0.178, eboks: 0.249 }

export const T = {
  iconAt: 0.251,       // the Altid Hjem app icon pops up at the centre FIRST…
  iconWindow: 0.021,
  collectStart: 0.271, // …and the pile fades directly into it
  collectEnd: 0.35,
  pressStart: 0.354,   // …is pressed the moment the last bill lands…
  pressEnd: 0.374,
  openStart: 0.377,    // …and the interface opens straight away
  openEnd: 0.417,
  loadStart: 0.429,    // members appear
  loadStagger: 0.046,
  chipStagger: 0.012,
  totalAt: 0.576,      // total monthly spend appears
  totalWindow: 0.029,
  doneAt: 0.85,
  collapseStart: 0.862, // members fold away, bottom-up (slower, with a beat)
  collapseStep: 0.011,
  collapseWindow: 0.018,
  receiptAt: 0.908,    // view switches to the summary card
  rowStart: 0.917,
  rowStep: 0.0105,
  monthlyAt: 0.983,
  yearAt: 0.987,
  yearWindow: 0.011,
  finishedAt: 0.999,
}

// Per-member optimisation windows (Dig, Marie, Lukas) — the assistant walks
// through the household one member at a time; window length follows the
// member's number of services. Deliberately unhurried (~9s in total).
export const FIX: [number, number][] = [
  [0.61, 0.715],
  [0.715, 0.8],
  [0.8, 0.845],
]

const clamp01 = (v: number) => Math.max(0, Math.min(1, v))
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)

// === Opening the sources ===

// Each bill's exit flight length, as a fraction of entranceProgress; starts
// are spread over its source's window.
export const EMIT_FLY = 0.04
const groupSizes: Record<SourceKind, number> = { letter: 0, mail: 0, eboks: 0 }
ITEMS.forEach((it) => groupSizes[it.source]++)
const groupIndex: number[] = (() => {
  const c: Record<SourceKind, number> = { letter: 0, mail: 0, eboks: 0 }
  return ITEMS.map((it) => c[it.source]++)
})()

export const emitStart = (i: number) => {
  const it = ITEMS[i]
  const [a, b] = SRC_WINDOW[it.source]
  const n = groupSizes[it.source]
  return n <= 1 ? a : a + ((b - a - EMIT_FLY) * groupIndex[i]) / (n - 1)
}
/** Exit-flight progress of bill i (0..1): source → hovering pile. */
export const itemEmit = (p: number, i: number) => clamp01((p - emitStart(i)) / EMIT_FLY)

/** The sources scene fades in over the first beat — gives the loop a soft
 *  landing instead of a hard cut. */
export const introFade = (p: number) => clamp01(p / 0.015)

/** The letter's flap swings open just before its bill slides out. */
export const flapOpen = (p: number, i: number) =>
  easeInOut(clamp01((p - (emitStart(i) - 0.01)) / 0.028))

/** How far a source is through being opened/emptied (pulses). */
export const openLocal = (p: number, s: SourceKind) => {
  const [a, b] = SRC_WINDOW[s]
  return clamp01((p - a) / (b - a))
}
/** The badge shows EXACTLY how many bills are still inside the inbox — it
 *  ticks down one by one as each bill visibly leaves. */
export const badgeRemaining = (p: number, s: SourceKind) =>
  ITEMS.reduce((n, it, i) => n + (it.source === s && itemEmit(p, i) < 0.35 ? 1 : 0), 0)
/** Stray decoration dots fade with the inbox being emptied. */
export const badgeFactor = (p: number, s: SourceKind) => 1 - openLocal(p, s)
/** Emptied sources are removed from the scene one by one (0 = present, 1 = gone). */
export const sourceGone = (p: number, s: SourceKind) => easeInOut(clamp01((p - SRC_REMOVE[s]) / 0.03))

// === Collect (pile → app icon) ===

/** Collect-phase-local progress 0..1. */
export const collectLocal = (p: number) => clamp01((p - T.collectStart) / (T.collectEnd - T.collectStart))

// Each bill's flight length as a fraction of the collect window; the long
// overlapping flights make the whole pile implode together into the centre.
export const ITEM_FLY = 0.34
export const itemStart = (i: number) => (M <= 1 ? 0 : (i * (1 - ITEM_FLY)) / (M - 1))
/** Flight progress of bill i (0..1) given collect-local progress cp. */
export const itemFly = (cp: number, i: number) => clamp01((cp - itemStart(i)) / ITEM_FLY)

// === App icon appear + press + interface open ===

// The icon pops up (with a little overshoot) where the pile just vanished.
const easeOutBack = (t: number) => {
  const c1 = 1.70158
  const c3 = c1 + 1
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2)
}
export const iconAppear = (p: number) => easeOutBack(clamp01((p - T.iconAt) / T.iconWindow))
export const iconAppearOpacity = (p: number) => clamp01(((p - T.iconAt) / T.iconWindow) * 3)

/** A quick press pulse on the app icon (0..1..0). */
export const iconPress = (p: number) =>
  Math.sin(Math.PI * clamp01((p - T.pressStart) / (T.pressEnd - T.pressStart)))
/** The interface scaling open out of the icon. */
export const openReveal = (p: number) => easeInOut(clamp01((p - T.openStart) / (T.openEnd - T.openStart)))

// === Household loading ===

export const memberReveal = (p: number, i: number) =>
  easeInOut(clamp01((p - (T.loadStart + i * T.loadStagger)) / 0.028))
export const chipReveal = (p: number, i: number, j: number) =>
  easeInOut(clamp01((p - (T.loadStart + i * T.loadStagger + 0.013 + j * T.chipStagger)) / 0.018))
/** The monthly-total line appearing (its value also counts up with this). */
export const totalReveal = (p: number) => easeInOut(clamp01((p - T.totalAt) / T.totalWindow))

// === Optimisation (member by member, service by service) ===

/** When service j of member i flips to its optimised state. */
const flipTime = (i: number, j: number) => {
  const [a, b] = FIX[i]
  const n = MEMBERS[i].services.length
  return a + ((j + 0.6) / n) * (b - a)
}
export const serviceFlip = (p: number, i: number, j: number) =>
  easeInOut(clamp01((p - flipTime(i, j)) / 0.013))
/** A member is done when its last service has flipped. */
export const memberDone = (p: number, i: number) => serviceFlip(p, i, MEMBERS[i].services.length - 1)
/** Which member the assistant is currently working on (-1 = none). */
export const fixingMember = (p: number) => FIX.findIndex(([a, b]) => p >= a && p < b)

/** Total saved so far — drives the real-time "Sparet i alt" counter. */
export const savedSoFar = (p: number) =>
  Math.round(
    MEMBERS.reduce(
      (s, m, i) => s + m.services.reduce((t, x, j) => t + (x.oldPrice - x.newPrice) * serviceFlip(p, i, j), 0),
      0,
    ),
  )
/** The monthly total, ticking down as services are optimised. */
export const totalMonthly = (p: number) => Math.round(OLD_TOTAL * totalReveal(p)) - savedSoFar(p)
/** The most recent flip's saving, shown briefly as a "+X kr." chip. */
export const chipAmount = (p: number) => {
  let amt = 0
  MEMBERS.forEach((m, i) =>
    m.services.forEach((x, j) => {
      const t = flipTime(i, j)
      if (p >= t && p < t + 0.03) amt = x.oldPrice - x.newPrice
    }),
  )
  return amt
}

// === Collapse + receipt ===

/** How folded-away collapse slot `slot` is (0=Dig, 1=Marie, 2=Lukas, 3=the
 *  totals block). Removed bottom-up, exactly like the forsikring card. */
export const collapseAmt = (p: number, slot: number) =>
  easeInOut(clamp01((p - (T.collapseStart + (3 - slot) * T.collapseStep)) / T.collapseWindow))

export const rowReveal = (p: number, i: number) => clamp01((p - (T.rowStart + i * T.rowStep)) / 0.01)
export const monthlyReveal = (p: number) => clamp01((p - T.monthlyAt) / 0.01)
export const yearBoxReveal = (p: number) => easeInOut(clamp01((p - T.yearAt) / 0.018))
export const yearValue = (p: number) => Math.round(YEAR_SAVING * easeInOut(clamp01((p - T.yearAt) / T.yearWindow)))

/** What the Altid Assistent is doing right now (card is only visible from the
 *  open phase onwards). */
export const assistantStatus = (p: number): { text: string; done: boolean } => {
  if (p >= T.finishedAt) return { text: 'Færdig – husstanden er optimeret', done: true }
  if (p >= T.doneAt) return { text: 'Samler jeres besparelse', done: false }
  const fixing = fixingMember(p)
  if (fixing === 0) return { text: 'Optimerer dine aftaler', done: false }
  if (fixing === 1) return { text: "Optimerer Marie's aftaler", done: false }
  if (fixing === 2) return { text: "Optimerer Lukas' aftaler", done: false }
  if (p >= T.totalAt) return { text: 'Beregner månedligt forbrug', done: false }
  return { text: 'Indlæser husstanden', done: false }
}
