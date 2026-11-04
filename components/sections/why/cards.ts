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
//   4. APP      — the phone shows real frames of the app, cross-fading on the
//                 same clock (the scenes are in lib/screen-captures.ts). The
//                 last one holds until the story loops.

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
  { name: 'Elregning',        provider: 'NordEl A/S', source: 'letter', envIndex: 0, price:  949, dueDay: 1,  x: -200, y: -110, rotate: -9 },
  { name: 'Bilforsikring',    provider: 'SikkerPlus', source: 'letter', envIndex: 1, price:  659, dueDay: 3,  x:   60, y: -40,  rotate:  6 },
  { name: 'Indboforsikring',  provider: 'SikkerPlus', source: 'letter', envIndex: 2, price:  249, dueDay: 12, x:  230, y: -140, rotate: 10 },
  { name: 'Husforsikring',    provider: 'SikkerPlus', source: 'letter', envIndex: 3, price:  549, dueDay: 4,  x: -330, y: -160, rotate: -6 },
  { name: 'Ulykkesforsikring', provider: 'SikkerPlus', source: 'letter', envIndex: 1, price: 139, dueDay: 6,  x: -190, y:  225, rotate:  5 },
  { name: 'Mobilregning',     provider: 'TeleNu',     source: 'mail',                price:  249, dueDay: 5,  x: -230, y:  100, rotate: -5 },
  { name: 'Mobilt bredbånd',  provider: 'TeleNu',     source: 'mail',                price:  299, dueDay: 15, x:  100, y:  135, rotate:  8 },
  { name: 'Madplan',          provider: 'MadKurven',  source: 'mail',                price: 5800, dueDay: 7,  x:  -40, y: -10,  rotate:  3 },
  { name: 'Opladning',        provider: 'LadNemt',    source: 'mail',                price:  699, dueDay: 10, x: -330, y: -15,  rotate: -7 },
  { name: 'Mobilregning',     provider: 'TeleNu',     source: 'mail',                price:  149, dueDay: 14, x:  330, y: -30,  rotate:  7 },
  { name: 'Rejseforsikring',  provider: 'SikkerPlus', source: 'eboks',               price:   99, dueDay: 8,  x:  270, y:  60,  rotate: -6 },
  { name: 'Mobil (barn)',     provider: 'TeleNu',     source: 'eboks',               price:   99, dueDay: 18, x:  -60, y:  215, rotate:  4 },
  { name: 'Alarm',            provider: 'VagtPlus',   source: 'eboks',               price:  449, dueDay: 20, x:  180, y: -225, rotate:  5 },
  { name: 'Ulykkesforsikring', provider: 'SikkerPlus', source: 'eboks',               price: 139, dueDay: 9,  x:  300, y:  175, rotate:  6 },
  { name: 'Børneulykke',      provider: 'SikkerPlus', source: 'eboks',               price:   69, dueDay: 11, x:   35, y: -195, rotate: -5 },
  { name: 'Skolemad',         provider: 'MadKurven',  source: 'eboks',               price:  540, dueDay: 22, x:  150, y:  210, rotate: -4 },
]

export const M = ITEMS.length

// === Timeline (fractions of entranceProgress) ===
export const DURATION = 38000
/** How long the last frame holds before the animation loops from the top. */
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
}

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

/** Where the sources scene finishes fading in — also the stage's RESTING
 *  frame (EtHjemStage.SOURCES_READY imports this so the two can't drift). */
export const INTRO_FADE_END = 0.015

/** The sources scene fades in over the first beat — gives the loop a soft
 *  landing instead of a hard cut. */
export const introFade = (p: number) => clamp01(p / INTRO_FADE_END)

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

// === The phone's frames ===

/** Fraction of the clock a frame takes to fade in. */
const SCENE_FADE = 0.012

/** Opacity of each frame at p. Later frames fade in on top of earlier ones, so
 *  nothing behind them shows. A frame that is not ready stays out, which leaves
 *  the current one in place; the first frame that is ready is there from the start. */
export const sceneOpacities = (p: number, froms: readonly number[], ready: readonly boolean[]) => {
  const first = ready.indexOf(true)
  return froms.map((from, i) => (!ready[i] ? 0 : i === first ? 1 : clamp01((p - from) / SCENE_FADE)))
}

/** The point on the clock where a frame has fully landed, for stepping by hand. */
export const sceneRest = (from: number) => from + SCENE_FADE

/** The part of a frame that comes forward, once the frame has landed. */
export const liftAmount = (p: number, from: number) =>
  easeInOut(clamp01((p - (from + 2 * SCENE_FADE)) / 0.024))
