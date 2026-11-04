// The pictures of the app on this site: one entry per file in
// public/app-screens/, made by scripts/build-app-screens.mjs, and the tours
// that show them. test/screen-captures.test.ts checks file sizes and that every
// region below lies inside its image. It cannot see a button that moved inside
// a frame of the same size: look at the tap dots and lifts after a refresh.
//
// Width, height and all coordinates are pixels of the 720 px wide WebP.

export interface ScreenCapture {
  source: string
  width: number
  height: number
}

const screen = (source: string, height = 1561): ScreenCapture => ({ source: `v1.0.3 ${source}`, width: 720, height })

export const SCREENS = {
  'hjem.top': screen('sim/hjem/hjem.top'),
  'hjem.top.full': screen('sim/hjem/hjem.top.full', 2297),
  'okonomi.top': screen('sim/okonomi/okonomi.top'),
  'okonomi.top.full': screen('sim/okonomi/okonomi.top.full', 2250),
  'okonomi.regninger': screen('sim/okonomi/regninger.top'),
  'okonomi.droemme': screen('sim/okonomi/droemme.detail'),
  'mad.home': screen('sim/mad/mad.home'),
  'mad.meal_plan': screen('sim/mad/mad.meal_plan'),
  'mad.trip': screen('sim/mad/mad.trip.in_progress'),
  'energi.home': screen('sim/energi/energi.home'),
  'energi.usage': screen('sim/energi/energi.usage'),
  'forsikring.welcome': screen('sim/forsikring/b.welcome.1'),
  'forsikring.flow': screen('sim/forsikring/b.flow.3_insurances_chosen'),
  // Repainted by the build script: clock 09.41, the timeline's own time removed.
  'forsikring.forlob': screen('sim/forsikring/b.forlob.waiting, retimed'),
  // Top of droemme.detail: paper with a dark clock, over a capture that has panned.
  'statusbar.paper': screen('sim/okonomi/droemme.detail, top 170 px', 104),
} as const satisfies Record<string, ScreenCapture>

export type ScreenId = keyof typeof SCREENS

export const screenSrc = (id: ScreenId) => `/app-screens/${id}.webp`

/** Height of the status bar strip that stays put while a capture pans under it. */
export const STATUS_STRIP_HEIGHT = SCREENS['statusbar.paper'].height

/**
 * The tallest part of a screen any layout shows: every phone runs off the
 * bottom of its band. A pan may end with less than a whole screen left in the
 * capture (a stitched capture stops above the tab bar), but never with blank
 * inside this height.
 */
export const VISIBLE_SCREEN_HEIGHT = 1240

export interface Point {
  x: number
  y: number
}

export interface Scene {
  id: ScreenId
  /** What the screen shows, used as the name of its dot when stepping by hand. */
  alt: string
  holdMs: number
  /** A slow scroll through a stitched capture of the same screen, during the hold. */
  panTo?: {
    image: ScreenId
    y: number
    /** Where the screen's dark top ends in `image`: the status bar turns light once this has passed under it. */
    foldY: number
  }
  /** A soft dot just before the next scene. In `panTo.image` when the scene pans. */
  tap?: Point
}

/** The one memorable moment of a tour: a crop of the same image rises out of the phone. */
export interface Lift {
  sceneId: ScreenId
  x: number
  y: number
  width: number
  height: number
  /** Corner radius in image pixels. */
  radius: number
  /** How much it grows as it rises. Enough to just break the phone's edge is fine. */
  scale: number
}

export interface TourData {
  scenes: Scene[]
  lift?: Lift
}

export type TourKey = 'hero' | 'okonomi' | 'mad' | 'energi' | 'forsikring'

export const TOURS: Record<TourKey, TourData> = {
  hero: {
    scenes: [
      {
        id: 'hjem.top',
        alt: 'forsiden med det beløb, der er tilbage til næste løn',
        holdMs: 7400,
        panTo: { image: 'hjem.top.full', y: 700, foldY: 785 },
      },
      { id: 'okonomi.top', alt: 'Økonomi med forbruget siden sidste løn', holdMs: 3800 },
    ],
    // "2 ting til dig i dag".
    lift: { sceneId: 'hjem.top', x: 44, y: 891, width: 632, height: 176, radius: 46, scale: 1.17 },
  },
  okonomi: {
    scenes: [
      {
        id: 'okonomi.top',
        alt: 'Økonomi med forbruget siden sidste løn',
        holdMs: 6000,
        panTo: { image: 'okonomi.top.full', y: 860, foldY: 918 },
        // The dream tile.
        tap: { x: 180, y: 1994 },
      },
      { id: 'okonomi.droemme', alt: 'en drøm, I sparer op til', holdMs: 4400 },
      { id: 'okonomi.regninger', alt: 'månedens regninger i en kalender', holdMs: 3800 },
    ],
    // The painting, with its 62 % tag, as a card of its own.
    lift: { sceneId: 'okonomi.droemme', x: 122, y: 618, width: 476, height: 466, radius: 44, scale: 1.2 },
  },
  mad: {
    scenes: [
      // The dot lands on "Se madplan".
      { id: 'mad.home', alt: 'Altid Mad med ugens retter', holdMs: 3600, tap: { x: 590, y: 1138 } },
      { id: 'mad.meal_plan', alt: 'madplanen med dagens retter', holdMs: 4400 },
      { id: 'mad.trip', alt: 'indkøbsturen med varer, der krydses af', holdMs: 3800 },
    ],
    // The "I dag" plate.
    lift: { sceneId: 'mad.meal_plan', x: 195, y: 562, width: 172, height: 172, radius: 86, scale: 1.4 },
  },
  energi: {
    scenes: [
      { id: 'energi.home', alt: 'Altid Energi med elprisen time for time', holdMs: 4400 },
      { id: 'energi.usage', alt: 'saldoen og forbruget måned for måned', holdMs: 4400 },
    ],
  },
  forsikring: {
    scenes: [
      { id: 'forsikring.welcome', alt: 'velkomsten til Altid Forsikring', holdMs: 3200 },
      { id: 'forsikring.flow', alt: 'valget af forsikringer, I vil have tilbud på', holdMs: 3600 },
      { id: 'forsikring.forlob', alt: 'forløbet, hvor I kan se, hvad der sker nu', holdMs: 4400 },
    ],
    // "Vi giver besked".
    lift: { sceneId: 'forsikring.forlob', x: 255, y: 423, width: 420, height: 230, radius: 42, scale: 1.12 },
  },
}
