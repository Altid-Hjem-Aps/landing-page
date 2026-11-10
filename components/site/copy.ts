// All copy for the new altidhjem.dk front page (ALT-1420). Alt texts are written here too, so nothing Danish lives in the components.

export const NAV = {
  home: 'Altid Hjem, til forsiden',
  ariaMain: 'Forside',
  ariaMenu: 'Menu',
  links: [
    { href: '#spoergsmaal', label: 'Spørgsmål' },
    { href: '/kontakt', label: 'Kontakt' },
  ],
  sheet: [
    { href: '#okonomi', label: 'Økonomi' },
    { href: '#altid-energi', label: 'Altid Energi' },
    { href: '#altid-forsikring', label: 'Altid Forsikring' },
    { href: '#spoergsmaal', label: 'Spørgsmål' },
    { href: '/kontakt', label: 'Kontakt' },
  ],
  cta: 'Hent appen',
  pause: 'Sæt bevægelsen på pause',
  play: 'Start bevægelsen igen',
  skip: 'Spring til indhold',
  open: 'Åbn menu',
  close: 'Luk menu',
} as const

export const HERO = {
  title: 'Hele hjemmets økonomi i én app',
  line: 'Hent Altid Hjem gratis i dag, og få overblik over jeres mad, strøm, forsikring og økonomi.',
  // {average} and {count} come from the App Store (AppRating.tsx).
  rating: '{average} ud af 5 · {count} i App Store',
  // The hero phones show these in turn.
  mainScreens: [
    { src: '/site/app/hjem-top.webp', alt: 'Forsiden i Altid Hjem: 8.166 kr. tilbage, søjler for resten af måneden og en besked om, at du er 3.000 kr. foran.' },
    { src: '/site/app/okonomi-top.webp', alt: 'Økonomi i appen: 1.076 kr. brugt siden løn, 877 kr. under det, du plejer.' },
    { src: '/site/app/regninger-top.webp', alt: 'Regninger i appen: 2.345 kr., 21.842 kr. i faste regninger om måneden og kalenderen for november.' },
  ],
  secondScreens: [
    { src: '/site/app/mad-meal_plan.webp', alt: 'Madplanen i Altid Mad: 130 kr. tilbage og ugens retter på en række tallerkener.', focus: '50% 34%' },
    { src: '/site/app/droemme-detail.webp', alt: 'En drøm i appen: 9.500 kr. tilbage til Familieferie på Mallorca, 1.100 kr. om måneden.' },
    { src: '/site/app/energi-home.webp', alt: 'Altid Energi i appen: elprisen time for time.' },
  ],
} as const


export const PROOF = {
  // Apple featured the app as App of the Day in Finance (Thor, 10 Nov 2026). Apple's own English wording.
  award: { lines: ['App of the Day', 'Finance'] },
  title: 'Hør, hvorfor over 4.000 danskere har appen',
  voicesLabel: 'Udtalelser',
  voiceLabel: (i: number) => `Gå til udtalelse ${i + 1}`,
} as const

export const FEATURES = {
  title: 'Se, hvor I står, før måneden er gået',
  line: 'Hele måneden samlet ét sted, fra løn til løn.',
  cards: [
    {
      tone: 'honey',
      title: 'Tilbage',
      body: 'Se, hvad der er tilbage til lønningsdag, og om I er foran eller bagud.',
      src: '/site/app/hjem-top.webp',
      alt: 'Forsiden i Altid Hjem: 8.166 kr. tilbage, søjler for resten af måneden og en besked om, at du er 3.000 kr. foran.',
    },
    {
      tone: 'sky',
      title: 'Brugt',
      body: 'Forbind banken sikkert med MitID, og se, hvordan pengene bliver brugt.',
      src: '/site/app/okonomi-top.webp',
      alt: 'Økonomi i appen: 1.076 kr. brugt siden løn, 877 kr. under det, du plejer.',
    },
    {
      tone: 'mint',
      title: 'Regninger',
      body: 'Se alle jeres faste udgifter i en kalender, så I aldrig bliver overraskede.',
      src: '/site/app/regninger-top.webp',
      alt: 'Regninger i appen: 2.345 kr., 21.842 kr. i faste regninger om måneden og kalenderen for november.',
    },
  ],
  pieces: {
    foran: 'Du er 3.000 kr. foran. Det svarer til 6 gange restaurant og takeaway.',
    ting: '2 ting til dig i dag: Har du lagt ud for andre?',
    takeaway: 'Restaurant og takeaway, 250 kr.',
    regning: 'Næste store regning: Bilforsikring, trækkes 1. jan.',
    fast: 'Faste udgifter: Forsikring, 1.450 kr./md.',
  },
  energi: {
    title: '“Hvornår skal opvasken sættes over?”',
    body: 'Følg elprisen time for time, og få besked, når strømmen er billigst.',
    altOne: 'Altid Energi i appen: elprisen er 1,48 kr. pr. kWh med søjler time for time, dit forbrug de seneste tre måneder og 71 % vind og sol i nettet.',
    altTwo: 'Altid Energi i appen: saldoen med indbetalt og brugt, forbrug pr. måned, netselskab og 240 kr. på saldoen.',
  },
  forsikring: {
    title: 'Tjek jeres forsikringer',
    body: 'Få gennemgået jeres forsikringer, og se, om der er penge at spare. Gratis og helt uforpligtende.',
    alt: 'Forsikringstjekket i appen: Hvilke forsikringer vil I have tilbud på? Indbo og Bil er valgt.',
    chipBil: 'Bil, valgt',
    chipHus: 'Hus, ikke valgt',
  },
} as const

export const OKONOMI = {
  titleFirst: 'Ikke mere',
  titleSecond: '“hvor blev pengene af?”',
  line: 'Forbind banken sikkert med MitID, og se, hvad der er tilbage til lønningsdag, hvor pengene går hen, og hvilke udgifter der er på vej.',
  categoriesLabel: 'Jeres kategorier',
  // The app's own category icons (public/site/icons), in its category colours.
  categories: [
    { icon: '/site/icons/housing.svg', name: 'Bolig', tone: 'sky' },
    { icon: '/site/icons/transport.svg', name: 'Transport', tone: 'honey' },
    { icon: '/site/icons/groceries.svg', name: 'Dagligvarer', tone: 'mint' },
    { icon: '/site/icons/restaurants.svg', name: 'Restaurant og takeaway', tone: 'lavender' },
    { icon: '/site/icons/shopping.svg', name: 'Shopping', tone: 'rose' },
    { icon: '/site/icons/children.svg', name: 'Børn', tone: 'honey' },
    { icon: '/site/icons/leisure.svg', name: 'Fritid', tone: 'sky' },
  ],
  cards: [
    {
      tone: 'honey',
      title: '“Hvad har vi tilbage?”',
      body: 'Se, hvad der er tilbage til lønningsdag, og om I er foran eller bagud.',
      src: '/site/app/hjem-top.webp',
      alt: 'Forsiden i Altid Hjem: 8.166 kr. tilbage, søjler for resten af måneden og en besked om, at du er 3.000 kr. foran.',
      piece: '/site/app/crop-foran-card.webp',
      pieceSize: [915, 285],
      pieceAlt: 'Du er 3.000 kr. foran. Det svarer til 6 gange restaurant og takeaway.',
    },
    {
      tone: 'sky',
      title: 'Her brugte I mest',
      body: 'Tryk på en kategori, og se, hvor pengene gik hen, og hvad I plejer at bruge.',
      src: '/site/app/okonomi-category_transport.webp',
      alt: 'Kategorien Transport i appen: hvad I har brugt, og hvad I plejer at bruge.',
      piece: '/site/app/piece-takeaway.webp',
      pieceSize: [380, 503],
      pieceAlt: 'Kategorien Restaurant og takeaway med månedens beløb.',
    },
    {
      tone: 'mint',
      title: 'Alle faste udgifter',
      body: 'Se jeres faste udgifter i en kalender, så I aldrig bliver overraskede.',
      src: '/site/app/regninger-top.webp',
      alt: 'Regninger i appen: 2.345 kr., 21.842 kr. i faste regninger om måneden og kalenderen for november.',
      piece: '/site/app/piece-regning.webp',
      pieceSize: [376, 198],
      pieceAlt: 'Næste store regning: bilforsikringen.',
    },
    {
      tone: 'lavender',
      title: 'Spar op til jeres drømme',
      body: 'Sæt et mål, og se hver måned, hvor langt I er nået.',
      src: '/site/app/droemme-detail.webp',
      alt: 'En drøm i appen: 9.500 kr. tilbage til Familieferie på Mallorca, 1.100 kr. om måneden.',
      piece: '/site/app/painting.webp',
      pieceSize: [629, 672],
      pieceAlt: 'Maleriet af en kystby fra drømmen om en familieferie.',
    },
  ],
} as const

export const MAD = {
  // Real catalogue names, from public/site/plates/plates.json. The collage uses them.
  plates: [
    { src: '/site/plates/tacos.webp', name: 'Klassiske tacos med oksefars' },
    { src: '/site/plates/svamperisotto.webp', name: 'Svamperisotto med brune champignon' },
    { src: '/site/plates/kyllingewok.webp', name: 'Kyllingewok med æggenudler, broccoli og spidskål' },
    { src: '/site/plates/pizza.webp', name: 'Hjemmelavet pizza med tomat og mozzarella' },
    { src: '/site/plates/stegt-flaesk.webp', name: 'Stegt flæsk med kartofler og persillesovs' },
    { src: '/site/plates/butter-chicken.webp', name: 'Butter chicken med ris og naan' },
    { src: '/site/plates/kylling-i-karry.webp', name: 'Kylling i karry med æble, gulerod og ris' },
  ],
} as const


export const PRIVACY = {
  title: 'Jeres tal er jeres',
  body: 'Forbindelsen til jeres bank giver kun adgang til at læse oplysninger, og vi kan ikke flytte penge. Vi sælger ikke jeres bankoplysninger.',
  link: 'Læs privatlivspolitikken',
} as const

export const STEPS = {
  title: 'Fire trin til ét overblik',
  steps: [
    { n: '01', tone: 'honey', title: 'Hent appen', body: 'Gratis i App Store og Google Play.', src: '/site/app/appstore.webp', alt: 'Altid Hjem i App Store: gratis, 4,3 ud af 5 og skærmbilleder af appen.' },
    { n: '02', tone: 'sky', title: 'Forbind banken', body: 'Log ind med MitID, og se, hvor pengene går hen. Det er frivilligt.', src: '/site/app/okonomi-top.webp', alt: 'Økonomi i appen: 1.076 kr. brugt siden løn, 877 kr. under det, du plejer.' },
    { n: '03', tone: 'lavender', title: 'Vælg det, I vil bruge', body: 'Madplan, elpris og forsikringstjek. Tag det, der passer jer.', src: '/site/app/mere-sheet.webp', alt: 'Menuen i appen: Energi, Mad, Forsikring og Økonomi.' },
    { n: '04', tone: 'mint', title: 'Inviter din partner', body: 'Så har I et fælles overblik og hver jeres egne tal.', src: '/site/app/hjem-faelles.webp', alt: 'Forsiden med Fælles valgt: 12.853 kr. tilbage for husstanden.' },
  ],
} as const

export const BANKS = {
  title: 'Virker med alle danske banker',
  // The app connects through Subaio, whose own text in the app says all Danish banks.
  names: ['Danske Bank', 'Nordea', 'Jyske Bank', 'Nykredit', 'Sydbank', 'Arbejdernes Landsbank', 'Spar Nord', 'Lunar', 'Sparekassen Kronjylland', 'Ringkjøbing Landbobank'],
} as const

export const PRESS = {
  eyebrow: 'Omtalt i',
  outlet: 'Ekstra Bladet',
  date: '25. juli 2026',
  quote: '“Spar stort på dine dagligvarer: Ny app sammenligner priser”',
  cta: 'Læs artiklen',
  newTab: ' (åbner i en ny fane)',
  href: 'https://ekstrabladet.dk/forbrug/Teknologi/spar-stort-paa-dine-dagligvarer-ny-app-sammenligner-priser/11232767',
} as const

export const LOVE = {
  title: 'Lavet med omhu til danske hjem',
  body: 'Altid Hjem kommer fra holdet bag Altid Energi og samler det, I ellers skal holde styr på hver for sig: jeres mad, strøm, forsikring og økonomi.',
  collageAlt: {
    painting: 'Maleriet af en kystby fra drømmen om en familieferie.',
    coins: 'En stak mønter fra forsiden i appen.',
    bars: 'Søjler for hver dag frem til lønningsdag den 20., med mærkaten Foran.',
  },
} as const

// One FAQ, one source: the visible answers and the JSON-LD both read this. `link` names
// the words in `a` that link somewhere.
export type FaqItem = { q: string; a: string; link?: { text: string; href: string } }

export const FAQ: { title: string; items: readonly FaqItem[] } = {
  title: 'Spørgsmål og svar',
  items: [
    {
      q: 'Hvad er Altid Hjem?',
      a: 'En app, der samler hjemmets økonomi ét sted: Økonomi, Altid Mad, Altid Energi og Altid Forsikring. Ét overblik, ét login.',
    },
    {
      q: 'Hvad koster det?',
      a: 'Appen er gratis at hente, og det er gratis at oprette en konto. Du betaler kun for det, du selv vælger at bruge, for eksempel strøm, hvis du bliver kunde hos Altid Energi.',
    },
    {
      q: 'Hvor henter jeg appen?',
      a: 'I App Store og Google Play. Du kan bruge knapperne her på siden eller søge efter Altid Hjem.',
    },
    {
      q: 'Skal jeg forbinde min bank?',
      a: 'Nej, det er frivilligt, og resten af appen virker uden. Vil du bruge Økonomi, forbinder du banken sikkert med MitID.',
    },
    {
      q: 'Kan I flytte penge fra min konto?',
      a: 'Nej. Forbindelsen giver kun adgang til at læse oplysninger fra banken. Hverken vi eller vores leverandør kan flytte penge eller betale fra dine konti.',
    },
    {
      q: 'Skal jeg være kunde hos Altid Energi?',
      a: 'Nej. Altid Hjem virker også, hvis du ikke er kunde hos Altid Energi. Er du allerede kunde, kan du knytte dit kundeforhold til din konto og se forbrug og saldo i appen.',
    },
    {
      q: 'Kan vi bruge appen sammen?',
      a: 'Ja. Du kan invitere din partner, og så har I både jeres egne tal og et fælles overblik.',
    },
    {
      q: 'Hvad kan min partner se?',
      a: 'Din partner ser aldrig dine konti, saldi eller posteringer. Partneren ser kun to ting: en fælles drøm på en konto, du selv har markeret som husstandens, og fælles regler for forhandlere.',
    },
    {
      q: 'Hvordan virker Altid Forsikring?',
      a: 'I samler jeres forsikringer i appen og svarer på nogle få spørgsmål. Så kontakter en rådgiver jer, og I får et tilbud efter samtalen. Det er gratis og helt uforpligtende.',
    },
    {
      q: 'Hvordan sletter jeg min konto?',
      a: 'Du kan slette kontoen under Profil i appen eller her på siden.',
      link: { text: 'her på siden', href: '/slet-konto' },
    },
  ],
}

export const FINAL = {
  title: 'Hent Altid Hjem i dag',
  body: 'Vi glæder os til at se jer. Appen er gratis at hente, og det er gratis at oprette en konto.',
  alt: 'Telefon med forsiden i Altid Hjem, omgivet af ting fra hjemmet: husnøgler, en kop kaffe, en tallerken mad, en indkøbsseddel, en elpære og en paraply.',
} as const

export const QR = {
  title: 'Hent appen',
  line: 'Scan koden med din telefon',
  appStore: 'App Store',
  googlePlay: 'Google Play',
  appStoreAlt: 'QR-kode til Altid Hjem i App Store',
  googlePlayAlt: 'QR-kode til Altid Hjem i Google Play',
  label: 'Hent appen med din telefon',
} as const

export const FOOTER = {
  company: 'Altid Hjem ApS, CVR 45637476',
  home: 'Altid Hjem, til forsiden',
  heads: { app: 'Appen', more: 'Læs mere', help: 'Hjælp', legal: 'Juridisk' },
  app: [
    { href: '#okonomi', label: 'Økonomi' },
    { href: '#altid-energi', label: 'Altid Energi' },
    { href: '#altid-forsikring', label: 'Altid Forsikring' },
  ],
  // Every SEO page in app/sitemap.ts, with today's titles in plain words.
  more: [
    { href: '/spiir-alternativ', label: 'Spiir-alternativ' },
    { href: '/hvornar-er-strommen-billigst', label: 'Hvornår er strømmen billigst?' },
    { href: '/hvad-koster-forsikring', label: 'Hvad koster forsikring?' },
    { href: '/billigste-mobilabonnement', label: 'Billigste mobilabonnement' },
    { href: '/hvad-koster-en-ladeboks', label: 'Hvad koster en ladeboks?' },
    { href: '/hvad-koster-en-tyverialarm', label: 'Hvad koster en tyverialarm?' },
    { href: '/hvad-koster-indboforsikring', label: 'Pris på indboforsikring' },
    { href: '/billigste-elselskab', label: 'Billigste elselskab' },
    { href: '/opsig-abonnementer', label: 'Opsig abonnementer' },
    { href: '/gennemsnitligt-elforbrug', label: 'Gennemsnitligt elforbrug' },
    { href: '/bedste-budget-app', label: 'Bedste budget-app' },
    { href: '/skift-forsikringsselskab', label: 'Skift forsikringsselskab' },
  ],
  help: [
    { href: '/kontakt', label: 'Kontakt' },
    { href: '/slet-konto', label: 'Slet konto' },
  ],
  legal: [{ href: '/privatlivspolitik', label: 'Privatlivspolitik' }],
} as const

export const META = {
  title: 'Altid Hjem: hele hjemmets økonomi i én app',
  description: 'Altid Hjem samler jeres mad, strøm, forsikring og økonomi i én app. Ét overblik, ét login. Hent appen gratis i App Store og Google Play.',
  imageAlt: 'Altid Hjem: hele hjemmets økonomi i én app. Tre telefoner med appen og de fire tjenester.',
} as const

export const APP_BAR = {
  label: 'Hent appen',
  name: 'Altid Hjem',
  sub: 'Gratis at hente',
  cta: 'Hent appen',
} as const

export const NOTES = {
  staged: 'Skærmbilleder fra appen med eksempeldata.',
  plates: 'Billederne af retterne er AI-genererede, ligesom i appen.',
} as const
