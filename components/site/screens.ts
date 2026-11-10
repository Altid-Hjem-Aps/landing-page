// Every picture from the app on the front page, one place. Files come from
// scripts/site-assets.mjs. Staged screens carry the screens caption on the page
// (primitives/Caption.tsx).

export type Screen = { src: string; alt: string; width: number; height: number }

const screen = (file: string, alt: string): Screen => ({
  src: `/site/screens/${file}.webp`,
  alt,
  width: 780,
  height: 1691,
})

export const SCREENS = {
  hjemTop: screen('hjem.top', 'Hjem-fanen i Altid Hjem med 8.166 kr. tilbage til lønningsdag'),
  okonomiTop: screen('okonomi.top', 'Økonomi-fanen med 1.076 kr. brugt siden sidste løn, fordelt på transport, restaurant og takeaway, tøj og andet'),
  regningerTop: screen('regninger.top', 'Regninger-fanen med en kalender for november og 21.842 kr. i faste regninger om måneden'),
  madHome: screen('mad.home', 'Altid Mad i appen med 130 kr. tilbage, ugens retter og en knap til at starte indkøbsturen'),
  forsikringChosen: screen('b.flow.3_insurances_chosen', 'Altid Forsikring spørger, hvilke forsikringer I vil have tilbud på: indbo, hus, bil og ulykke'),
} as const satisfies Record<string, Screen>

/** The top of hjemTop at full resolution, for the card that breaks out of the phone. */
export const HJEM_HERO_CROP: Screen = {
  src: '/site/hjem-hero-crop.webp',
  alt: '8.166 kr. tilbage til lønningsdag. Søjlerne viser, at du ligger foran',
  width: 1179,
  height: 520,
}

/** The coast painting from Drømme. */
export const PAINTING = {
  colour: { src: '/site/painting/coast-colour.webp', width: 960, height: 1280 },
} as const

export const APP_ICON = '/site/icons/app-icon.svg'
