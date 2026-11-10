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
    { href: '#altid-mad', label: 'Altid Mad' },
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
  altCluster:
    'Tre telefoner med Altid Hjem: madplanen i Altid Mad, månedens forbrug i Økonomi fordelt på transport, restaurant og takeaway, andet og tøj, og forsikringerne i Altid Forsikring.',
} as const

export const WORKS = {
  title: 'Samlet i én app',
  services: [
    { href: '#okonomi', name: 'Økonomi', icon: 'okonomi' },
    { href: '#altid-mad', name: 'Altid Mad', icon: 'mad' },
    { href: '#altid-energi', name: 'Altid Energi', icon: 'energi' },
    { href: '#altid-forsikring', name: 'Altid Forsikring', icon: 'forsikring' },
  ],
} as const

export const PROOF = {
  // Apple featured the app as App of the Day (Thor, 10 Nov 2026). Apple's own English wording.
  award: { lines: ['App of the Day', 'App Store'] },
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

export const MAD = {
  titleFirst: 'Ikke mere',
  titleSecond: '“hvad skal vi spise?”',
  days: ['Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag', 'Søndag'],
  weekLabel: 'Ugens madplan',
  // Real catalogue names, from public/site/plates/plates.json.
  plates: [
    { src: '/site/plates/tacos.webp', name: 'Klassiske tacos med oksefars' },
    { src: '/site/plates/svamperisotto.webp', name: 'Svamperisotto med brune champignon' },
    { src: '/site/plates/kyllingewok.webp', name: 'Kyllingewok med æggenudler, broccoli og spidskål' },
    { src: '/site/plates/pizza.webp', name: 'Hjemmelavet pizza med tomat og mozzarella' },
    { src: '/site/plates/stegt-flaesk.webp', name: 'Stegt flæsk med kartofler og persillesovs' },
    { src: '/site/plates/butter-chicken.webp', name: 'Butter chicken med ris og naan' },
    { src: '/site/plates/kylling-i-karry.webp', name: 'Kylling i karry med æble, gulerod og ris' },
  ],
  savings: {
    line: 'Spar i gennemsnit 11.207 kr. om året på dagligvarer*',
    footnoteLead: '*En gennemsnitlig husstand på fire personer kan spare 11.207 kr. om året på dagligvarer med Altid Mad. Kilde: ',
    footnoteLink: 'Altid Mad Q3-rapporten',
    footnoteHref: 'https://altidmad.dk/altid-mad-kvartalsrapport-q3.pdf',
  },
  cards: [
    {
      tone: 'lavender',
      title: 'En hel uge på få minutter',
      body: 'Fortæl, hvem der spiser med, og hvad I kan lide. Så er ugens madplan klar.',
      src: '/site/app/mad-meal_plan.webp',
      alt: 'Madplanen i Altid Mad: ugens retter på en række tallerkener og dagens måltider under dem.',
      piece: '/site/app/piece-week.webp',
      pieceSize: [800, 203],
      pieceAlt: 'Ugens retter på en række tallerkener.',
    },
    {
      tone: 'rose',
      title: 'Opskriften er lige ved hånden',
      body: 'Har I mere lyst til noget andet, skifter I retten med ét tryk.',
      src: '/site/app/mad-recipe.webp',
      alt: 'En opskrift i Altid Mad: kylling i karry med knappen Skift ret og listen over ingredienser.',
      piece: '/site/app/piece-ingredients.webp',
      pieceSize: [960, 745],
      pieceAlt: 'Ingredienserne til kylling i karry, med plads til at krydse af.',
    },
    {
      tone: 'honey',
      title: '“Hvor handler vi billigst ind?”',
      body: 'Appen finder automatisk de billigste varer på tværs af de butikker, I handler i.',
      src: '/site/app/mad-trip.webp',
      alt: 'Indkøb i Altid Mad: 108 varer tilbage, fordelt på butikker, med pris på hver vare.',
      piece: '/site/app/piece-bilka-section.webp',
      pieceSize: [800, 670],
      pieceAlt: 'Indkøbslisten for Bilka: frugt og grønt med pris på hver vare.',
    },
    {
      tone: 'mint',
      title: 'Indkøbslisten skriver sig selv',
      body: 'Kryds varerne af, mens I går rundt. Listen er delt op efter butik.',
      src: '/site/app/mad-trip-in_progress.webp',
      alt: 'Indkøbsturen i Altid Mad: 106 varer tilbage, og de to første varer er krydset af.',
      piece: '/site/app/piece-ticked.webp',
      pieceSize: [800, 497],
      pieceAlt: 'To varer er krydset af på indkøbslisten.',
    },
  ],
} as const

export const MORE = {
  title: 'Og der er mere',
  line: 'Altid Hjem kan også det her:',
  listLabel: 'Det, du finder i appen',
  rows: [
    {
      title: 'Drømme',
      body: 'Spar op til det, som er vigtigst for jer. Sæt et mål, og se hver måned, hvor langt I er nået.',
      src: '/site/app/droemme-detail.webp',
      alt: 'En drøm i appen: 9.500 kr. tilbage til Familieferie på Mallorca, 1.100 kr. om måneden.',
    },
    {
      title: 'Ting til dig i dag',
      body: 'Det, du skal tage stilling til, ligger øverst på forsiden.',
      src: '/site/app/hjem-scrolled.webp',
      alt: 'Forsiden i Altid Hjem: kortet 2 ting til dig i dag, måneden og de seneste bevægelser.',
    },
    {
      title: 'Her brugte du mest',
      body: 'Tryk på en kategori, og se, hvor pengene gik hen, og hvad I plejer at bruge.',
      src: '/site/app/okonomi-category_transport.webp',
      alt: 'Kategorien transport i Økonomi: 450 kr. under det, du plejer, og hvor du brugte mest.',
    },
    {
      title: 'Alle faste udgifter',
      body: 'Bolig, transport, børn og abonnementer med pris pr. måned.',
      src: '/site/app/regninger-chart.webp',
      alt: 'Faste udgifter i appen: søjler for de store regninger og en liste med bolig, transport, børn og forsikring.',
    },
    {
      title: 'Din saldo hos Altid Energi',
      body: 'Se, hvad du har indbetalt, og hvad du har brugt.',
      src: '/site/app/energi-balance.webp',
      alt: 'Din saldo hos Altid Energi: 240 kr. med indbetalt og brugt som søjler.',
    },
    {
      title: 'Mad efter jeres smag',
      body: 'Vælg det, der passer til jer, og fravælg resten.',
      src: '/site/app/mad-flow-1_tastes.webp',
      alt: 'Altid Mad spørger: Hvad passer til jer? Med valg som børnevenligt, hurtige retter og vegetarisk.',
    },
    {
      title: 'Følg forsikringstjekket',
      body: 'Se, hvor langt I er nået, fra spørgsmål til tilbud.',
      src: '/site/app/b-forlob-waiting.webp',
      alt: 'Forløbet i Altid Forsikring: spørgsmål besvaret, derefter besked fra en rådgiver og så tilbuddet.',
    },
    {
      title: 'Mine og Fælles',
      body: 'Skift mellem dine egne tal og jeres fælles overblik.',
      src: '/site/app/okonomi-top.webp',
      alt: 'Økonomi i appen med valget mellem Mine og Fælles øverst.',
    },
    {
      title: 'Indkøb undervejs',
      body: 'Kryds varerne af, mens I går rundt. Listen er delt op efter butik.',
      src: '/site/app/mad-trip-in_progress.webp',
      alt: 'Indkøbsturen i Altid Mad: 106 varer tilbage, og de to første varer er krydset af.',
    },
  ],
} as const

export const PRIVACY = {
  title: 'Jeres tal er jeres',
  body: 'Forbindelsen til jeres bank giver kun adgang til at læse oplysninger, og vi kan ikke flytte penge. Vi sælger ikke jeres bankoplysninger.',
  link: 'Læs privatlivspolitikken',
} as const

export const PRESS = {
  eyebrow: 'Omtalt i',
  outlet: 'Ekstra Bladet',
  date: '25. juli 2026',
  quote: '“Spar stort på dine dagligvarer: Ny app sammenligner priser”',
  cta: 'Læs artiklen',
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
      q: 'Hvor kommer de 11.207 kr. fra?',
      a: 'Tallet kommer fra Altid Mad Q3-rapporten. Det er den samme ugentlige indkøbskurv hos den billigste kæde og hos mediankæden, regnet om til et år. Du kan læse hele rapporten her.',
      link: { text: 'læse hele rapporten her', href: MAD.savings.footnoteHref },
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
    { href: '#altid-mad', label: 'Altid Mad' },
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
