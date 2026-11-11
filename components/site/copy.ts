// All copy for the new altidhjem.dk front page (ALT-1420). Alt texts are written here too, so nothing Danish lives in the components.

export const NAV = {
  home: 'Altid Hjem, til forsiden',
  ariaMain: 'Forside',
  ariaMenu: 'Menu',
  links: [
    { href: '#spoergsmaal', label: 'Spørgsmål' },
    { href: '/kontakt', label: 'Kontakt' },
  ],
  // Presse is not in the menus (Thor 11/11): the page is reached from the footer.
  sheet: [
    { href: '#okonomi', label: 'Økonomi' },
    { href: '#mad', label: 'Mad' },
    { href: '#energi', label: 'Energi' },
    { href: '#forsikring', label: 'Forsikring' },
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
  // The hero's story, one at a time: a paper bill in, the assistant's note out with an action,
  // then what was done. Bills as in
  // Thor's earlier bills mockup (made-up companies SikkerPlus and TeleNu); the notes are samples
  // and make no savings claims (Thor 11/11: none outside the Mad figure).
  lanes: [
    {
      bill: { title: 'Indboforsikring', from: 'SikkerPlus', date: '12. november', amount: '249 kr.', mail: false },
      note: 'Indboforsikringen fornyes snart. Vil du have et uforpligtende tilbud at sammenligne med?',
      action: 'Ja tak',
      done: 'Du bliver ringet op med et tilbud.',
    },
    {
      bill: { title: 'Mobilregning', from: 'TeleNu', date: '5. november', amount: '249 kr.', mail: true },
      note: 'Mobilregningen på 249 kr. er lagt ind under Regninger. Vil du se alle jeres faste udgifter?',
      action: 'Vis mig',
      done: 'Alle faste udgifter er samlet i kalenderen.',
    },
    {
      bill: { title: 'Bilforsikring', from: 'SikkerPlus', date: '3. november', amount: '659 kr.', mail: false },
      note: 'Bilforsikringen på 659 kr. trækkes 3. november. Skal jeg minde dig om det dagen før?',
      action: 'Ja tak',
      done: 'Du får en påmindelse 2. november.',
    },
    {
      bill: { title: 'Ulykkesforsikring', from: 'SikkerPlus', date: '6. november', amount: '139 kr.', mail: true },
      note: 'Ulykkesforsikringen er lagt ind under Forsikring. Vil I se alle jeres forsikringer samlet?',
      action: 'Vis mig',
      done: 'Jeres forsikringer er samlet ét sted.',
    },
  ] as const,
  secondScreens: [
    { src: '/site/app/mad-meal_plan.webp', alt: 'Madplanen i appen: 130 kr. tilbage og ugens retter på en række tallerkener.', focus: '50% 34%' },
    { src: '/site/app/droemme-detail.webp', alt: 'En drøm i appen: 9.500 kr. tilbage til Familieferie på Mallorca, 1.100 kr. om måneden.' },
    { src: '/site/app/energi-home.webp', alt: 'Energi i appen: elprisen time for time.' },
  ],
} as const


export const PROOF = {
  // Apple featured the app as App of the Day in Finance (Thor, 10 Nov 2026). Apple's own English wording.
  award: { lines: ['App of the Day', 'Finance'] },
  title: 'Hør, hvorfor over 4.000 danskere har appen',
  voicesLabel: 'Udtalelser',
  voiceLabel: (i: number) => `Gå til udtalelse ${i + 1}`,
} as const

export const OKONOMI = {
  titleFirst: 'Ikke mere',
  titleSecond: '“hvor blev pengene af?”',
  line: 'Forbind banken sikkert med MitID, og se, hvad der er tilbage til lønningsdag, hvor pengene går hen, og hvilke udgifter der er på vej.',
  // The seven feature blocks of the launch mail (Figma 9366:329 and 9366:211), word for word,
  // each with its phone and lifted pieces exported from the same frames.
  cards: [
    {
      tone: 'mint',
      title: 'Se regningerne,\nfør de bliver trukket',
      body: 'Se alle jeres faste udgifter i en kalender, så I aldrig bliver overrasket af store regninger.',
      src: '/site/mail/regninger.webp',
      alt: 'Regninger i appen: 397 kr., 4.621 kr. i faste regninger om måneden og kalenderen for oktober.',
    },
    {
      tone: 'honey',
      title: '“Bruger vi for meget\npå takeaway?”',
      body: 'Forbind banken sikkert med MitID, og se hvordan pengene bliver brugt.',
      id: 'okonomi',
      src: '/site/mail/takeaway.webp',
      alt: 'Økonomi i appen: 1.955 kr. brugt siden løn, fordelt på Transport, Restaurant og takeaway, Andet og Tøj.',
    },
    {
      tone: 'lavender',
      title: 'Ikke mere\n“hvad skal vi spise?”',
      body: 'Få en komplet madplan på få minutter, tilpasset dig og din familie.',
      id: 'mad',
      src: '/site/mail/mad.webp',
      alt: 'Madplanen i appen: 437 kr. tilbage og ugens retter, blandt andet hjemmelavet pizza med tomat og mozzarella.',
    },
    {
      tone: 'sand',
      // The mail's headline for its shopping block ("Blok 04"), with its source line (Thor 11/11).
      title: 'Spar 11.207 kr. om\nåret på dagligvarer*',
      body: 'Appen finder automatisk de billigste varer på tværs af de butikker, I handler i.',
      source: { text: 'Baseret på Altid Mad Q3-rapporten', href: '/madrapport' },
      src: '/site/mail/indkob-liste.webp',
      alt: 'Indkøbslisten i appen: 47 varer tilbage, sorteret efter butik, med priser.',
    },
    {
      tone: 'sky',
      title: '“Hvornår skal opvasken sættes over?”',
      body: 'Følg elprisen time for time og få besked, når strømmen er billigst.',
      id: 'energi',
      src: '/site/mail/energi.webp',
      alt: 'Elprisen i appen: 0,62 kr. pr. kWh lige nu og prisen time for time.',
    },
    {
      tone: 'rose',
      title: 'Alle jeres forsikringer\nsamlet ét sted',
      body: 'Se, hvad I betaler, og få et forsikringstjek. Helt gratis og uforpligtende.',
      id: 'forsikring',
      src: '/site/mail/forsikring.webp',
      alt: 'Forsikringer i appen: 1.397 kr. om måneden for bil, hus, indbo og ulykke.',
    },
    {
      tone: 'honey',
      title: '“Skat, hvornår skal vi\npå ferie igen?”',
      body: 'Spar op til det, som er vigtigst for jer. Sæt et mål, og se hver måned, hvor langt I er nået.',
      src: '/site/mail/droem.webp',
      alt: 'En drøm i appen: 9.600 kr. tilbage til Familieferie på Mallorca, 1.400 kr. om måneden, 62 % sparet op.',
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
  // Thor's wording, 10/11.
  body: 'I forbinder sikkert jeres bank med MitID. Vi får kun adgang til at læse jeres oplysninger og kan hverken flytte penge eller foretage betalinger. Jeres bankoplysninger bliver aldrig solgt eller delt med tredjeparter til markedsføring eller lignende.',
  link: 'Læs privatlivspolitikken',
} as const

// Step photos: four moments from one family's day in one home (Sofie on the sofa, at the dining
// table and in the kitchen, then Sofie and Mads together on the sofa), same daylight throughout,
// made with ChatGPT's image tool on 11 Nov 2026, each photo from scratch in its own run from one
// shared description of the people and the home. Each was made with an empty green screen and
// the app's own screenshot is put on it in the phone's perspective, so the app shown is the real
// one; photoFocus says where each photo is cropped. Step 4 has two phones that mirror each
// other, first names only: on Sofie's, Mads's half of the house is empty ("Mads' egne konti
// mangler"), on Mads's it says "Sofie har inviteret dig"; both are the app repo's own renders on
// main with the clock and signal marks of the other screens added. The briefs and the scripts
// are in the session's notes. A new round gets new file names: next/image keeps serving a
// cached picture under an old name.
export const STEPS = {
  title: 'Fire trin til ét overblik',
  steps: [
    { n: '01', photo: '/site/people/dag-sofa.webp', photoFocus: '90% 50%', tone: 'honey', title: 'Hent appen', body: 'Gratis i App Store og Google Play.', src: '/site/app/appstore.webp', alt: 'Altid Hjem i App Store: gratis, 4,3 ud af 5 og skærmbilleder af appen.' },
    { n: '02', photo: '/site/people/dag-bord.webp', photoFocus: '70% 50%', tone: 'sky', title: 'Forbind banken', body: 'Log ind med MitID, og se, hvor pengene går hen. Det er frivilligt.', src: '/site/app/okonomi-top.webp', alt: 'Økonomi i appen: 1.076 kr. brugt siden løn, 877 kr. under det, du plejer.' },
    { n: '03', photo: '/site/people/dag-koekken.webp', photoFocus: '40% 50%', tone: 'lavender', title: 'Vælg det, I vil bruge', body: 'Madplan, elpris og forsikringstjek. Tag det, der passer jer.', src: '/site/app/mere-sheet.webp', alt: 'Menuen i appen: Energi, Mad, Forsikring og Økonomi.' },
    { n: '04', photo: '/site/people/dag-par.webp', photoFocus: '64% 50%', tone: 'mint', title: 'Inviter din partner', body: 'Så har I et fælles overblik og hver jeres egne tal.', src: '/site/app/partner-venter.webp', alt: 'Et par i sofaen med hver sin telefon: på Sofies er Mads’ halvdel af huset tom, på Mads’ står der Sofie har inviteret dig.' },
  ],
} as const

export const BANKS = {
  title: 'Virker med alle danske banker',
  // The app connects through Subaio, whose own text in the app says all Danish banks. Logos
  // from each bank's own website on 10 Nov 2026, see public/site/banks/sources.json.
  logos: [
    { name: 'Danske Bank', src: '/site/banks/white/danske-bank.png', ratio: 9.85 },
    { name: 'Nordea', src: '/site/banks/white/nordea.png', ratio: 4.76 },
    { name: 'Jyske Bank', src: '/site/banks/white/jyske-bank.png', ratio: 6.44 },
    { name: 'Nykredit', src: '/site/banks/white/nykredit.png', ratio: 6.42 },
    { name: 'Sydbank', src: '/site/banks/white/sydbank.png', ratio: 5.08 },
    { name: 'Spar Nord', src: '/site/banks/white/spar-nord.png', ratio: 2.83 },
    { name: 'Lunar', src: '/site/banks/white/lunar.png', ratio: 2.86 },
    { name: 'Sparekassen Kronjylland', src: '/site/banks/white/sparekassen-kronjylland.png', ratio: 4.89 },
    { name: 'Ringkjøbing Landbobank', src: '/site/banks/white/ringkjobing-landbobank.png', ratio: 2.37 },
  ],
} as const

export const PRESS = {
  label: 'Omtalt i Ekstra Bladet, 25. juli 2026',
  title: 'Spar stort på dine dagligvarer: Ny app sammenligner priser',
  outlet: 'Ekstra Bladet',
  newTab: ' (åbner i en ny fane)',
  href: 'https://ekstrabladet.dk/forbrug/Teknologi/spar-stort-paa-dine-dagligvarer-ny-app-sammenligner-priser/11232767',
} as const

// The old site's Trust block (components/sections/Trust.tsx); the body is condensed.
export const STORY = {
  quote: '“Vi startede med at gøre op med skjulte gebyrer i elmarkedet. Nu gør vi det samme på tværs af alle hjemmets faste udgifter.”',
  title: 'Fair, gennemsigtigt og billigt',
  // Condensed from the old block's longer paragraph (Thor 10/11).
  body: 'Altid Hjem er skabt af teamet bag Altid Energi. Med over 15.000 kunder har vi bevist, at fair og gennemsigtige priser virker. Nu gør vi det samme for hjemmets faste udgifter.',
} as const

// One FAQ, one source: the visible answers and the JSON-LD both read this. `link` names
// the words in `a` that link somewhere.
export type FaqItem = { q: string; a: string; link?: { text: string; href: string } }

// The old site's FAQ (components/sections/Faq.tsx), as Thor asked 10/11, with two answers changed
// on his 11/11 rules: plain service names, and no savings claim except the sourced Mad figure.
export const FAQ: { title: string; items: readonly FaqItem[] } = {
  title: 'Ofte stillede spørgsmål',
  items: [
    {
      q: 'Hvad er Altid Hjem?',
      a: 'Altid Hjem er en app, der samler hjemmets økonomi og faste udgifter ét sted: strøm, forsikring og mad. Du får ét overblik og ét login. Altid.',
    },
    {
      q: 'Er Altid Hjem klar?',
      a: 'Ja. Altid Hjem ligger i App Store og Google Play, og du kan hente appen nu.',
    },
    {
      q: 'Hvor kan jeg hente Altid Hjem?',
      a: 'I både App Store og Google Play. Du finder den ved at søge efter Altid Hjem, eller du kan bruge knapperne her på siden.',
    },
    {
      q: 'Hvor meget sparer jeg med Altid Hjem?',
      // Only the sourced Mad figure, in the store texts' words (Thor 11/11); no other savings claims.
      a: 'Det afhænger af jeres aftaler og vaner. På dagligvarer kan I spare i gennemsnit 11.207 kr. om året. Se beregningen i Altid Mad-rapporten.',
      link: { text: 'Altid Mad-rapporten', href: '/madrapport' },
    },
    {
      q: 'Er det gratis at bruge Altid Hjem?',
      a: 'Ja, appen er gratis at hente, og det er gratis at oprette en konto. Du betaler kun for det, du selv vælger at bruge, for eksempel strøm fra Altid Energi, hvis du bliver kunde.',
    },
    {
      q: 'Hvilke tjenester kan jeg samle i appen?',
      a: 'I appen finder du Mad, Energi og Forsikring sammen med et overblik over hjemmets økonomi. Tjenesterne er udvalgt på baggrund af kvalitet, pris og gennemsigtighed.',
    },
    {
      q: 'Skal jeg selv opsige mine gamle aftaler?',
      a: 'Nej, det klarer vi. Når du vælger en løsning gennem Altid Hjem, håndterer vi skiftet for dig, så du slipper for opsigelser og papirarbejde.',
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
    { href: '#mad', label: 'Mad' },
    { href: '#energi', label: 'Energi' },
    { href: '#forsikring', label: 'Forsikring' },
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
    { href: '/presse', label: 'Presse' },
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

// The press page (/presse), for all of Altid Hjem: the four parts of the app are categories
// under it, named as in the app and the store texts (Thor 11/11). Sources: the "about" lines
// are the live store text; the Økonomi and Energi lines are the launch mail's; the Mad line is
// Thor's (11/11); the Forsikring line says what is in the app at the hard launch, when this page
// goes live (a forsikringstjek, no longer "snart"); contact, photos and credit are from the PR
// brief (ALT-1349) and altidmad.dk/presse. No user numbers: none is cleared.
export const PRESSE = {
  meta: {
    title: 'Presse | Altid Hjem',
    description: 'Pressemateriale om Altid Hjem: kort om appen, skærmbilleder, pressefotos, logoer og pressekontakt.',
  },
  title: 'Presse',
  lead: 'Kort om appen, billeder og logoer til fri redaktionel brug, og hvem I kan kontakte.',
  about: {
    title: 'Kort om Altid Hjem',
    body: [
      'Altid Hjem samler hjemmets faste udgifter ét sted: mad, strøm, forsikring og økonomi. Hverdagsøkonomien bliver enkel, gennemskuelig og nem at handle på.',
      'Appen er gratis og ligger i App Store og Google Play. Bag Altid Hjem står teamet bag Altid Energi.',
    ],
    facts: [
      { label: 'Selskab', value: 'Altid Hjem ApS' },
      { label: 'CVR', value: '45637476' },
      { label: 'Adresse', value: 'Helsinkigade 29, 2150 Nordhavn' },
      { label: 'Pris', value: 'Gratis' },
      { label: 'Findes til', value: 'iPhone og Android' },
    ],
  },
  parts: {
    title: 'Hele hjemmets økonomi i én app',
    line: 'Skærmbilleder af hver del af appen. Hent dem enkeltvis.',
    download: 'Hent billede',
    // Not in the app yet (Thor 11/11): shown dimmed, name and label only, no promise of what they do.
    soon: {
      label: 'Kommer snart',
      items: [
        { tone: 'mint', name: 'Mobil' },
        { tone: 'sand', name: 'Alarm' },
        { tone: 'sky', name: 'Opladning' },
      ],
    },
    items: [
      { tone: 'honey', name: 'Økonomi', body: 'Forbind banken sikkert med MitID, og se hvordan pengene bliver brugt.', file: 'altid-hjem-okonomi.jpg', shot: '/site/mail/takeaway.webp', alt: 'Økonomi i Altid Hjem: 1.955 kr. brugt siden løn, fordelt på kategorier.' },
      { tone: 'lavender', name: 'Mad', body: 'Få en madplan for ugen og en indkøbsliste, der viser, hvor varerne er billigst.', file: 'altid-hjem-mad.jpg', shot: '/site/mail/mad.webp', alt: 'Mad i Altid Hjem: ugens madplan og 437 kr. tilbage af madbudgettet.' },
      { tone: 'sky', name: 'Energi', body: 'Følg elprisen time for time og få besked, når strømmen er billigst.', file: 'altid-hjem-energi.jpg', shot: '/site/mail/energi.webp', alt: 'Energi i Altid Hjem: elprisen lige nu og time for time.' },
      { tone: 'rose', name: 'Forsikring', body: 'Se, hvad I betaler, og få et forsikringstjek. Helt gratis og uforpligtende.', file: 'altid-hjem-forsikring.jpg', shot: '/site/mail/forsikring.webp', alt: 'Forsikring i Altid Hjem: 1.397 kr. om måneden for bil, hus, indbo og ulykke.' },
    ],
  },
  photos: {
    title: 'Pressefotos',
    // The credit is a condition for using the photos; it must stay next to them.
    line: 'Til fri redaktionel brug. Kreditering: Fotograf: Frank Lohmann.',
    caption: 'Werner Valeur. Foto: Frank Lohmann.',
    alt: 'Werner Valeur',
    web: 'Hent web',
    print: 'Hent tryk',
    // Web size only for 6 to 8: they come from the photographer's web folder (Werner's Dropbox,
    // "LAV OPLØSNING TIL WEB", mail of 19 Jun 2026). Thor ruled out the restaurant, window and
    // blue curtain photos from that folder on 11 Nov 2026. The print files are the ones
    // altidmad.dk/presse serves (23 to 27 MB each). Plain portraits come first; the last four
    // were taken for the Mad story (shopping bags, a shop).
    items: [
      { file: 'werner-valeur-6.jpg', web: '0,5 MB' },
      { file: 'werner-valeur-7.jpg', web: '0,6 MB' },
      { file: 'werner-valeur-8.jpg', web: '1,4 MB' },
      { file: 'werner-valeur-5.jpg', web: '0,3 MB', print: { href: 'https://altidmad.dk/presse/altid-mad-pressefoto-5-tryk.jpg', size: '25 MB' } },
      { file: 'werner-valeur-1.jpg', web: '0,9 MB', print: { href: 'https://altidmad.dk/presse/altid-mad-pressefoto-1-tryk.jpg', size: '26 MB' } },
      { file: 'werner-valeur-2.jpg', web: '0,8 MB', print: { href: 'https://altidmad.dk/presse/altid-mad-pressefoto-2-tryk.jpg', size: '23 MB' } },
      { file: 'werner-valeur-3.jpg', web: '0,9 MB' },
      { file: 'werner-valeur-4.jpg', web: '1,0 MB' },
    ],
  },
  logos: {
    title: 'Logoer',
    line: 'Brug logoet, som det er, og lad der være luft omkring det.',
    items: [
      { name: 'Logo, mørkt', surface: 'light', preview: 'altid-hjem-lockup-deep-forest.svg', svg: 'altid-hjem-lockup-deep-forest.svg', png: 'altid-hjem-lockup-deep-forest-1920.png', alt: 'Altid Hjems logo i mørkegrøn' },
      { name: 'Logo, hvidt', surface: 'dark', preview: 'altid-hjem-lockup-white.svg', svg: 'altid-hjem-lockup-white.svg', png: 'altid-hjem-lockup-white-1920.png', alt: 'Altid Hjems logo i hvid' },
      { name: 'App-ikon', surface: 'light', preview: 'altid-hjem-app-icon-rounded.svg', svg: 'altid-hjem-app-icon-rounded.svg', png: 'altid-hjem-app-icon-rounded-1024.png', alt: 'Altid Hjems app-ikon' },
    ],
  },
  coverage: {
    title: 'Omtale og dokumentation',
    items: [
      { label: 'Ekstra Bladet: “Spar stort på dine dagligvarer: Ny app sammenligner priser”', note: '25. juli 2026', href: 'https://ekstrabladet.dk/forbrug/Teknologi/spar-stort-paa-dine-dagligvarer-ny-app-sammenligner-priser/11232767', external: true },
      { label: 'Altid Mad-rapporten, 3. kvartal 2026', note: 'Prisanalysen bag tallene om dagligvarer', href: '/madrapport', external: false },
    ],
  },
  contact: {
    title: 'Pressekontakt',
    name: 'Werner Valeur',
    mail: 'w@madhousehq.com',
    phone: '31 31 00 04',
    phoneHref: 'tel:+4531310004',
  },
  staged: 'Skærmbilleder fra appen med eksempeldata.',
  newTab: ' (åbner i en ny fane)',
} as const
