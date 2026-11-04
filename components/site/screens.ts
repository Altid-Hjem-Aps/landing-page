// Every picture from the app on the front page, one place. Files come from
// scripts/site-assets.mjs. Staged screens carry SCREEN_CAPTION on the page
// (primitives/Caption.tsx).
//
// The QR files are generated once outside the repo (Python segno, level M, a
// quiet zone of 4 modules, Deep forest on transparent) and hold the exact output
// of storeLink() in lib/store-links.ts, also written in each SVG's <desc>
// (test/site-assets.test.ts). If the links change: regenerate them. They need a
// light card behind them; the card's radius rounds the quiet zone.

export type Screen = { src: string; alt: string; width: number; height: number }

const screen = (file: string, alt: string): Screen => ({
  src: `/site/screens/${file}.webp`,
  alt,
  width: 780,
  height: 1691,
})

export const SCREENS = {
  hjemTop: screen('hjem.top', 'Hjem-fanen i Altid Hjem med 8.166 kr. tilbage til lønningsdag'),
  hjemScrolled: screen('hjem.scrolled', 'Hjem-fanen rullet ned: 2 ting til dig i dag, regningerne i en kalenderstribe og de seneste køb'),
  okonomiTop: screen('okonomi.top', 'Økonomi-fanen med 1.076 kr. brugt siden løn, fordelt på transport, restaurant og takeaway, tøj og andet'),
  okonomiModNormal: screen('okonomi.mod_normal', 'Økonomi-fanen viser forbruget mod en normal måned, kategori for kategori, og drømmen om en familieferie'),
  droemmeDetail: screen('droemme.detail', 'Drømmen om en familieferie på Mallorca: 9.500 kr. tilbage og 62 % på vej, med et maleri af kysten'),
  regningerTop: screen('regninger.top', 'Regninger-fanen med november som kalender og 21.842 kr. i faste regninger om måneden'),
  okonomiCategoryTransport: screen('okonomi.category_transport', 'Transport i Økonomi-fanen: 450 kr. under det, du plejer, uge for uge'),
  madHome: screen('mad.home', 'Altid Mad i appen med 130 kr. tilbage af ugens budget, ugens retter og indkøbsturen klar til start'),
  madMealPlan: screen('mad.meal_plan', 'Ugens madplan i Altid Mad med dagens retter og budgettet for ugen'),
  madTripInProgress: screen('mad.trip.in_progress', 'Indkøbsturen i Altid Mad: 106 varer tilbage, og varerne krydses af, mens I handler'),
  madRecipe: screen('mad.recipe', 'Opskriften på kylling i karry med æble, gulerod og ris, med ingredienser til at krydse af'),
  madWeekPlan: screen('mad.flow.9_week_plan', 'Jeres madplan for ugen i Altid Mad, klar til at blive godkendt'),
  madWelcome2: screen('mad.welcome.2', 'Altid Mad: mad der passer til jer, med retter I kan lide til hele familien'),
  madWelcome3: screen('mad.welcome.3', 'Altid Mad sammenligner butikkerne: jo flere butikker, jo mere sparer I'),
  energiHome: screen('energi.home', 'Altid Energi i appen med elprisen 1,48 kr. pr. kWh lige nu og dagens priser time for time'),
  energiUsage: screen('energi.usage', 'Forbrug i Altid Energi med saldoen og forbruget måned for måned'),
  forsikringChosen: screen('b.flow.3_insurances_chosen', 'Altid Forsikring spørger, hvilke forsikringer I vil have tilbud på: indbo, hus, bil og ulykke'),
  forsikringWaiting: screen('b.forlob.waiting', 'Forløbet i Altid Forsikring: spørgsmålene er besvaret, og næste skridt står klart'),
  forsikringTilbud: screen('b.tilbud.before', 'Altid Forsikring: gratis og uforpligtende gennemgang af jeres forsikringer'),
} as const satisfies Record<string, Screen>

/** The top of hjemTop at full resolution, for the card that breaks out of the phone. */
export const HJEM_HERO_CROP: Screen = {
  src: '/site/hjem-hero-crop.webp',
  alt: '8.166 kr. tilbage til lønningsdag. Søjlerne viser, at du er foran',
  width: 1179,
  height: 520,
}

/** The coast painting from Drømme, as line drawing and in colour. Same frame. */
export const PAINTING = {
  line: { src: '/site/painting/coast-line.webp', width: 960, height: 1280 },
  colour: { src: '/site/painting/coast-colour.webp', width: 960, height: 1280 },
  alt: 'Maleri af en kyst med hvide huse, grønne træer og en båd på havet',
} as const

export const QR_CODES = {
  appstore: { src: '/site/qr/app-store.svg', alt: 'QR-kode til Altid Hjem i App Store' },
  play: { src: '/site/qr/google-play.svg', alt: 'QR-kode til Altid Hjem i Google Play' },
} as const

export const APP_ICON = '/site/icons/app-icon.svg'
export const ALTID_ENERGI_LOGO = '/site/icons/altid-energi.svg'
