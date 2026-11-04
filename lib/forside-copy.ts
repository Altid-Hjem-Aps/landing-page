// Every Danish string on the front page (app/page.tsx and components/forside/*),
// plus the site's default metadata and the Open Graph card. Components import
// from here, so a language pass only needs this file.
//
// House rules for this copy: no en or em dashes, full brand names (Altid Mad,
// Altid Energi, Altid Forsikring, Altid Hjem; "Økonomi" is the app's own tab
// and not a subbrand), and the positioning line is "ét overblik, ét login".

export const METADATA = {
  title: 'Altid Hjem: hele hjemmets økonomi i én app',
  description:
    'Altid Hjem samler madplan, strøm, forsikring og økonomi i én app, så du får ét overblik, ét login. Hent appen gratis i App Store og Google Play.',
} as const

export const OG_IMAGE = {
  alt: 'Altid Hjem: hele hjemmets økonomi i én app',
  headline: 'Hele hjemmets økonomi i én app',
  subline: 'Madplan, strøm, forsikring og økonomi. Ét overblik, ét login.',
  stores: 'App Store · Google Play',
} as const

export const HERO = {
  title: 'Hele hjemmets økonomi i én app',
  lead: 'Madplan, strøm, forsikring og økonomi samlet ét sted. Ét overblik, ét login.',
  note: 'Det er gratis at hente appen og oprette sig.',
  imageAlt: 'Altid Hjem-appens forside med beløbet, der er tilbage til næste løn',
} as const

export const STORE_BADGES = {
  prefix: 'Hent i',
  appStore: 'App Store',
  play: 'Google Play',
} as const

export type ServiceKey = 'okonomi' | 'mad' | 'energi' | 'forsikring'

export interface ServiceCopy {
  key: ServiceKey
  /** Stable anchor id; the nav, mails and shared links point at it. */
  id: string
  /** Brand name, used as the accessible name of the eyebrow lockup. */
  name: string
  title: string
  bullets: readonly [string, string, string]
  /** Optional line under the bullets. */
  qualification?: string
  /** Altid Mad only: the savings claim with its footnote right under it. */
  claim?: {
    text: string
    footnoteBeforeLink: string
    linkLabel: string
    linkHref: string
    footnoteAfterLink: string
  }
  imageAlt: string
}

export const SERVICES: readonly ServiceCopy[] = [
  {
    key: 'okonomi',
    id: 'okonomi',
    name: 'Økonomi',
    title: 'Hvad har I tilbage til næste løn?',
    bullets: [
      'Forbind banken med MitID, og se, hvad I har tilbage til næste løn',
      'Se jeres faste udgifter og abonnementer i en kalender, før pengene bliver trukket',
      'Spar op til jeres drømme, og følg med i, hvor langt I er',
    ],
    qualification:
      'Appen kan kun læse jeres kontooplysninger og kan aldrig flytte penge. I vælger selv, om I vil forbinde banken.',
    imageAlt: 'Økonomi i Altid Hjem: forbrug fordelt på kategorier siden sidste løn',
  },
  {
    key: 'mad',
    id: 'altid-mad',
    name: 'Altid Mad',
    title: 'Ikke mere ”hvad skal vi spise?”',
    bullets: [
      'Få en madplan for hele ugen',
      'Få en indkøbsliste med priser fra de butikker, I handler i',
      'Byt en ret ud, så følger indkøbslisten med',
    ],
    claim: {
      text: 'Spar i gennemsnit 11.207 kr. om året på dagligvarer*',
      footnoteBeforeLink:
        '*En gennemsnitlig husstand på fire personer kan spare 11.207 kr. om året på dagligvarer med Altid Mad. Kilde: Altid Mad-rapporten på ',
      linkLabel: 'altidmad.dk',
      linkHref: 'https://altidmad.dk',
      footnoteAfterLink: '.',
    },
    imageAlt: 'Altid Mad: ugens madplan med dagens retter',
  },
  {
    key: 'energi',
    id: 'altid-energi',
    name: 'Altid Energi',
    title: 'Se elprisen time for time',
    bullets: [
      'Se den aktuelle elpris time for time, og få besked, når strømmen er billig',
      'Følg dit elforbrug dag, uge og måned',
      'Se månedens omkostninger, din løbende saldo og dine acontobetalinger',
    ],
    qualification:
      'Er du ikke kunde endnu, kan du blive det direkte i appen. Er du kunde hos Altid Energi, logger du ind som før.',
    imageAlt: 'Altid Energi: elprisen time for time og forbruget i de seneste måneder',
  },
  {
    key: 'forsikring',
    id: 'altid-forsikring',
    name: 'Altid Forsikring',
    title: 'Alle jeres forsikringer ét sted',
    bullets: [
      'Skriv jeres forsikringer, priser og fornyelser ind, så har I dem samlet ét sted',
      'Vil I have et tilbud, så bed om det i appen. I bliver ringet op, når det er klart',
      'Det er gratis og uforpligtende, og tilbuddet kommer fra vores samarbejdspartner',
    ],
    imageAlt: 'Altid Forsikring: husstandens forsikringer samlet med pris pr. måned',
  },
]

export const REASSURANCE = {
  /** Visually hidden heading, so the strip has a place in the outline. */
  title: 'Derfor kan du være tryg',
  items: [
    'Ét login til madplan, strøm, forsikring og økonomi',
    'Appen kan kun læse dine kontooplysninger og kan aldrig flytte penge',
    'Bygget af teamet bag Altid Energi, der leverer strøm til mere end 15.000 danskere',
  ],
} as const

export const FAQ = {
  title: 'Spørgsmål og svar',
  items: [
    {
      q: 'Hvad koster Altid Hjem?',
      a: 'Appen er gratis, og det er gratis at oprette sig. Du betaler kun for det, du selv vælger at bruge, for eksempel strøm fra Altid Energi, hvis du bliver kunde.',
    },
    {
      q: 'Skal jeg være kunde hos Altid Energi?',
      a: 'Nej. Du kan bruge Altid Mad, Altid Forsikring og Økonomi uden at have strøm hos Altid Energi. Er du kunde, logger du ind som før.',
    },
    {
      q: 'Hvordan bruger appen min bank?',
      a: 'Du forbinder banken med MitID. Appen kan kun læse dine kontooplysninger og kan aldrig flytte penge. Du vælger selv, om du vil forbinde banken.',
    },
    {
      q: 'Hvordan får jeg et forsikringstilbud?',
      a: 'Skriv jeres forsikringer ind i appen, og bed om et tilbud. I bliver ringet op, når det er klart. Det er gratis og uforpligtende.',
    },
    {
      q: 'Hvor henter jeg appen?',
      a: 'I App Store og Google Play. Søg efter Altid Hjem, eller brug knapperne her på siden.',
    },
    {
      q: 'Kommer der flere tjenester?',
      a: 'Ja. Vi udvider løbende med flere tjenester til husstanden, så du kan samle endnu mere af din hverdag ét sted.',
    },
  ],
} as const

export const BOTTOM = {
  title: 'Hent Altid Hjem i dag',
  lead: 'Appen er gratis. Begynd med det, der fylder mest hos jer lige nu. Resten kan vente.',
  shareLead: 'Kender du en, der vil have ro på hjemmets økonomi? ',
  shareLabel: 'Del Altid Hjem',
  shareHref: '/del',
} as const

// The newsletter signup. The sentence next to the box comes from altid-consent.
export const NEWSLETTER = {
  title: 'Få nyheder fra Altid Hjem',
  emailLabel: 'E-mail',
  button: 'Tilmeld',
  buttonPending: 'Tilmelder…',
  success: 'Tak. Du hører fra os.',
  invalidEmail: 'Skriv en gyldig e-mailadresse.',
  consentMissing: 'Sæt kryds i feltet for at tilmelde dig.',
  tooMany: 'Du har prøvet for mange gange. Prøv igen senere.',
  failed: 'Vi kunne ikke tilmelde dig lige nu. Prøv igen om et øjeblik.',
} as const
