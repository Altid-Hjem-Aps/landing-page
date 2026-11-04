// The pictures of the app on this site, one entry per file in
// public/app-screens/, made by scripts/build-app-screens.mjs, and where each one
// is shown. Every row is from Thor's board (site-captures/boards/MAPPING.md).
// test/screen-captures.test.ts checks file sizes and that the lift region lies
// inside its image. It cannot see a bubble that moved inside a frame of the same
// size: look at the end of the WhatIs story after a refresh.
//
// Width, height and all coordinates are pixels of the 720 px wide WebP.

export interface ScreenCapture {
  source: string
  width: number
  height: number
}

const screen = (source: string, height = 1561): ScreenCapture => ({ source: `v1.0.3 sim/${source}`, width: 720, height })

export const SCREENS = {
  'hjem.top': screen('hjem/hjem.top'),
  'mere.sheet': screen('hjem/mere.sheet.energi_customer'),
  'todo.madplan': screen('hjem/hjem.todo_list.madplan'),
  'regninger.top': screen('okonomi/regninger.top'),
  // Paper top with a 09.41 painted over the part that runs under the clock.
  'regninger.faste': screen('okonomi/regninger.chart, top repainted'),
  'okonomi.mod_normal': screen('okonomi/okonomi.mod_normal, top repainted'),
  'energi.top': screen('energi/energi.home, crop 0,0,1179,1340', 818),
  'energi.month_details': screen('energi/energi.month_details'),
  'regninger.subscriptions': screen('okonomi/regninger.subscriptions'),
  'forsikring.policy_list': screen('forsikring/b.policy_list, crop 0,190,1179,1990', 1099),
  'forsikring.household': screen('forsikring/b.flow.1_household'),
  // Clock 09.41, the timeline's own time removed.
  'forsikring.forlob': screen('forsikring/b.forlob.waiting, retimed'),
  'mere.services_card': screen('hjem/mere.sheet, crop of the card with the coming services', 235),
} as const satisfies Record<string, ScreenCapture>

export type ScreenId = keyof typeof SCREENS

export const screenSrc = (id: ScreenId) => `/app-screens/${id}.webp`

export interface Frame {
  id: ScreenId
  alt: string
}

/** The hero's three phones: foreground, back left, back right. Also the slides of the mobile carousel. */
export const HERO_FRAMES: readonly Frame[] = [
  { id: 'hjem.top', alt: 'Hjem i appen med pengene, der er tilbage i denne måned, dagens opgaver og ugens regninger' },
  { id: 'mere.sheet', alt: 'Mere-menuen i appen med Altid Energi, Altid Mad, Altid Forsikring og Økonomi. Altid Opladning, Altid Alarm og Altid Mobil er ikke med endnu' },
  { id: 'todo.madplan', alt: 'Opgavelisten i appen med kortet Lav ugens madplan' },
]

export interface Region {
  x: number
  y: number
  width: number
  height: number
  radius: number
}

export interface StoryScene {
  id: ScreenId
  /** Where on the story's clock (0 to 1) this frame starts to fade in. */
  from: number
  /** A part of the same frame that comes forward once the scene has landed. */
  lift?: Region
}

/** What the phone shows in the WhatIs story, from the moment the app icon opens it. */
export const STORY_SCENES: readonly StoryScene[] = [
  { id: 'regninger.top', from: 0 },
  { id: 'regninger.faste', from: 0.56 },
  { id: 'okonomi.mod_normal', from: 0.7 },
  // "Du er 3.000 kr. foran", in its place on the top of Hjem.
  { id: 'hjem.top', from: 0.87, lift: { x: 117, y: 547, width: 558, height: 171, radius: 37 } },
]

export const STORY_LABEL =
  'Altid Hjem-appen: månedens regninger i en kalender, de faste udgifter, forbruget sammenlignet med en normal måned og Hjem med teksten: Du er 3.000 kr. foran.'

/** The picture on each SEO page that has one. */
export const SEO_FRAMES = {
  elpris: { id: 'energi.top', alt: 'Altid Energi i appen med elprisen lige nu og prisen time for time' },
  elselskab: { id: 'energi.month_details', alt: 'En måned i Altid Energi i appen: forbrug på 552 kr. og abonnement til 0 kr.' },
  abonnementer: { id: 'regninger.subscriptions', alt: 'Abonnementer i appen med prisen pr. måned og et forslag om at opsige et af dem' },
  alarm: { id: 'mere.services_card', alt: 'Kort fra Mere-menuen i appen med Altid Opladning, Altid Alarm og Altid Mobil, som ikke er med endnu' },
  indbo: { id: 'forsikring.policy_list', alt: 'Forsikringerne i appen med den måned, hvor hver forsikring fornyes' },
  forsikring: { id: 'forsikring.household', alt: 'Første spørgsmål i Altid Forsikring i appen: Er det jeres husstand? Antal voksne, børn og biler' },
  mobil: { id: 'mere.services_card', alt: 'Kort fra Mere-menuen i appen med Altid Opladning, Altid Alarm og Altid Mobil, som ikke er med endnu' },
  skift: { id: 'forsikring.forlob', alt: 'Forløbet i Altid Forsikring i appen: Spørgsmålene er besvaret, I bliver kontaktet, og tilbuddet bliver klar efter samtalen' },
} as const satisfies Record<string, Frame>
