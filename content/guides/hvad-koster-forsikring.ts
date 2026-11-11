import type { Guide } from '@/components/site/guide/types'

// The guide /hvad-koster-forsikring as data (ALT-1519). The wording comes from the page it
// replaces, updated for the hard launch: the app is in the stores, and Forsikring offers a
// forsikringstjek.
//
// Every figure is its source's own, read on 11 Nov 2026, and nothing is an estimate of ours.
// The old page's ranges had no source. Indbo's held (Tænk: 1.700-3.000 kr. a year). Ulykke
// and bil now carry what Tænk and FDM publish. Hus (250-600) and årsrejse (30-100) are gone:
// no independent, open source gives a typical price for them. The sources give yearly prices;
// the page shows them per month (divided by 12, rounded).
export const GUIDE: Guide = {
  slug: 'hvad-koster-forsikring',
  name: 'Hvad koster forsikring?',
  meta: {
    title: 'Hvad koster forsikring i 2026? Se priser | Altid Hjem',
    description:
      'Hvad koster forsikring i Danmark? Se typiske priser på indbo-, bil- og ulykkesforsikring med kilder. Find ud af, om du betaler for meget. Hent Altid Hjem gratis, og saml dine forsikringer ét sted.',
  },
  h1: 'Hvad koster forsikring i Danmark?',
  lead: 'Se typiske priser på de mest almindelige forsikringer, med kilder, og find ud af, om du betaler for meget.',
  answer: {
    title: 'Det korte svar',
    body: [
      'En indboforsikring koster typisk **140-250 kr. om måneden** for en gennemsnitsfamilie, og en ulykkesforsikring typisk 125-250 kr. En bilforsikring med kasko kostede i gennemsnit ca. 520 kr. om måneden i 2024.',
      'Men gennemsnittet er sjældent det vigtigste. Det afgørende er, om du betaler for meget for den dækning, du faktisk har brug for.',
    ],
    sources: ['taenk-indbo', 'taenk-ulykke', 'fdm-bil'],
    facts: [
      { label: 'Indboforsikring', value: '140-250 kr./md.' },
      { label: 'Ulykkesforsikring', value: '125-250 kr./md.' },
      { label: 'Bilforsikring med kasko', value: 'ca. 520 kr./md.' },
    ],
  },
  author: { name: 'Thor Jekes', role: 'Altid Hjem' },
  published: '2026-06-17',
  updated: '2026-11-11',
  sections: [
    {
      id: 'priser',
      title: 'Hvad koster de mest almindelige forsikringer?',
      blocks: [
        {
          type: 'prices',
          rows: [
            { name: 'Indboforsikring', price: '140-250 kr./md.', note: 'Typisk pris for en gennemsnitsfamilie: 1.700-3.000 kr. om året. Afhænger af adresse, husstand, indbosum, selvrisiko og tilvalg.', source: 'taenk-indbo' },
            { name: 'Bilforsikring med kasko', price: 'ca. 520 kr./md.', note: 'Gennemsnit i 2024: 6.239 kr. om året. Afhænger af bilen, førerens alder, postnummer, skadehistorik og selvrisiko.', source: 'fdm-bil' },
            { name: 'Ulykkesforsikring', price: '125-250 kr./md.', note: 'Typisk pris: 1.500-3.000 kr. om året. Afhænger af forsikringssum, alder, erhverv og selskab.', source: 'taenk-ulykke' },
          ],
          note: 'Kilderne oplyser prisen pr. år. Vi har delt med 12 og rundet af. Din konkrete pris kan ligge både under og over, afhængigt af din profil, dækning og dit forsikringsselskab.',
        },
        {
          type: 'text',
          text: 'Hus- og årsrejseforsikring er ikke med i oversigten, fordi vi ikke har fundet en uafhængig kilde med et typisk prisniveau for dem.',
        },
      ],
    },
    {
      id: 'forskelle',
      title: 'Hvorfor svinger forsikringspriserne så meget?',
      blocks: [
        {
          type: 'text',
          text: 'To naboer kan have samme bil, samme boligtype og samme forsikring og stadig betale vidt forskellige priser. Det skyldes, at selskaberne vurderer risiko forskelligt og prissætter blandt andet efter:',
        },
        {
          type: 'list',
          items: ['Hvor du bor og dit postnummer', 'Din alder og skadehistorik', 'Din selvrisiko', 'Din valgte dækning og dine tilvalg', 'Om dine forsikringer er samlet samme sted (samlerabat)'],
        },
        {
          type: 'text',
          text: 'Derfor kan forskellen mellem det billigste og det dyreste selskab være **flere tusinde kroner om året**. I Forbrugerrådet Tænks test var der op til 9.200 kr. om året i forskel mellem husforsikringer og mere end 2.200 kr. mellem ulykkesforsikringer med stort set samme dækning.',
          sources: ['taenk-hus', 'taenk-ulykke'],
        },
        {
          type: 'text',
          text: 'Samlerabat kan hjælpe, men er ikke automatisk lig med den bedste pris. Det afgørende er den samlede pris for hele husstanden.',
        },
      ],
    },
    {
      id: 'for-meget',
      title: 'Betaler du for meget for dine forsikringer?',
      blocks: [
        { type: 'text', text: 'Fem tegn på, at det er tid til at tjekke:' },
        {
          type: 'steps',
          items: [
            'Du har ikke tjekket dine forsikringer i mere end to år.',
            'Du er blevet hos samme selskab af gammel vane.',
            'Du har flere forsikringer spredt på forskellige logins og regninger.',
            'Du betaler for dækninger eller tilvalg, du ikke bruger.',
            'Du ved ikke, hvad husstanden betaler samlet hver måned.',
          ],
        },
      ],
    },
    {
      id: 'dobbeltdaekning',
      title: 'Er du dobbeltforsikret uden at vide det?',
      blocks: [
        { type: 'text', text: 'En fejl, der er nem at overse, er **dobbeltdækning**.' },
        {
          type: 'text',
          text: 'Det sker, når to personer i samme husstand betaler for den samme dækning hver for sig. Det kan være to indboforsikringer, to rejseforsikringer, et barn, der står på begge forældres policer, eller en dækning, der allerede indgår i en anden forsikring.',
        },
        {
          type: 'text',
          text: 'Problemet er sjældent, at folk ikke vil rydde op. Problemet er, at de ikke kan se det: policerne ligger hos forskellige selskaber, med hver sit login og hver sin regning.',
        },
        {
          type: 'example',
          example: 'forsikring-husstand',
          tone: 'lavender',
          title: 'Hvem i husstanden har hvilken forsikring?',
          body: 'Et samlet overblik gør det lettere at se mulige dobbeltdækninger.',
        },
      ],
    },
    {
      id: 'overblik',
      title: 'Hvordan får du overblik over forsikringerne med Altid Hjem?',
      blocks: [
        {
          type: 'text',
          text: 'Altid Hjem samler madplan, strøm, forsikring og økonomi i én app. Du får **ét overblik, ét login** og kan se, hvad hjemmet koster hver måned.',
        },
        {
          type: 'text',
          text: 'Skriv jeres forsikringer, priser og fornyelser ind i appen, så har I **hele husstandens forsikringer ét sted** og kan selv se, hvor I kan være dækket dobbelt. I kan også få et forsikringstjek i appen. Det er gratis og uforpligtende.',
        },
        {
          type: 'app',
          frame: 'composition',
          src: '/site/mail/forsikring.webp',
          alt: 'Forsikring i Altid Hjem: 1.397 kr. om måneden for bil, hus, indbo og ulykke.',
          tone: 'rose',
          title: 'Alle jeres forsikringer samlet ét sted',
          body: 'Se, hvad I betaler, og få et forsikringstjek. Helt gratis og uforpligtende.',
        },
        {
          type: 'text',
          text: 'Altid Hjem er skabt af teamet bag Altid Energi. Appen er gratis og ligger i App Store og Google Play.',
        },
      ],
    },
  ],
  sources: [
    { id: 'taenk-indbo', publisher: 'Forbrugerrådet Tænk', title: 'Indboforsikring: Sådan finder du den bedste og billigste', href: 'https://taenk.dk/privatoekonomi/forsikringer/indboforsikring', read: '2026-11-11' },
    { id: 'fdm-bil', publisher: 'FDM', title: 'Derfor bliver det dyrere for dig at være forsikringskunde', href: 'https://fdm.dk/nyheder/bilist/2025-02-derfor-stiger-prisen-paa-din-bilforsikring', read: '2026-11-11' },
    { id: 'taenk-ulykke', publisher: 'Forbrugerrådet Tænk', title: 'Ulykkesforsikringer: Du kan betale 2.200 kroner ekstra for stort set samme dækning', href: 'https://taenk.dk/test/ulykkesforsikringer/ulykkesforsikringer-bedst-og-billigst', read: '2026-11-11' },
    { id: 'taenk-hus', publisher: 'Forbrugerrådet Tænk', title: 'Har du den samme husforsikring som sidste år? Så tjek prisen', href: 'https://taenk.dk/test/husforsikringer/bedste-og-billigste-husforsikringer', read: '2026-11-11' },
    { id: 'dst-pris', publisher: 'Danmarks Statistik', title: 'Forbrugerprisindeks (tabel PRIS01), varegruppe 12.1 Forsikring', href: 'https://www.statistikbanken.dk/PRIS01', read: '2026-11-11' },
  ],
  related: [
    { href: '/hvad-koster-indboforsikring', title: 'Hvad koster en indboforsikring?', note: 'Priser, og hvad de afhænger af' },
    { href: '/skift-forsikringsselskab', title: 'Sådan skifter du forsikringsselskab', note: 'Trin for trin, og hvad du skal tjekke først' },
    { href: '/opsig-abonnementer', title: 'Sådan opsiger I husstandens abonnementer', note: 'Find dem, I ikke bruger' },
  ],
  faq: [
    {
      q: 'Hvad koster en indboforsikring?',
      a: [
        'En indboforsikring koster typisk 140-250 kr. om måneden for en gennemsnitsfamilie ifølge [Forbrugerrådet Tænk](https://taenk.dk/privatoekonomi/forsikringer/indboforsikring).',
        'Prisen afhænger blandt andet af adresse, indbosum, husstandens størrelse, selvrisiko og tilvalg.',
      ],
    },
    {
      q: 'Hvad koster en bilforsikring?',
      a: [
        'En bilforsikring med kasko kostede i gennemsnit 6.239 kr. om året i 2024, altså ca. 520 kr. om måneden, ifølge [FDM](https://fdm.dk/nyheder/bilist/2025-02-derfor-stiger-prisen-paa-din-bilforsikring).',
        'Ansvarsforsikring alene kan være billigere, mens unge bilister, dyre biler og lav selvrisiko trækker prisen op.',
      ],
    },
    {
      q: 'Hvad koster en husforsikring?',
      a: [
        'Det afhænger især af husets størrelse, alder, byggematerialer, tagtype, stand og beliggenhed.',
        'I [Forbrugerrådet Tænks test](https://taenk.dk/test/husforsikringer/bedste-og-billigste-husforsikringer) fra oktober 2026 var der op til 9.200 kr. om året i forskel mellem det billigste og det dyreste selskab. Indhent derfor flere tilbud.',
      ],
    },
    {
      q: 'Hvorfor er forsikring så dyrt?',
      a: [
        'Forsikring er blevet dyrere. [Danmarks Statistiks](https://www.statistikbanken.dk/PRIS01) prisindeks for forsikring steg 17,6 % fra oktober 2022 til oktober 2026, mens forbrugerpriserne i alt steg 6,1 %.',
        'For bilforsikring peger [FDM](https://fdm.dk/nyheder/bilist/2025-02-derfor-stiger-prisen-paa-din-bilforsikring) på flere skader, dyrere reparationer og dyrere reservedele. Samtidig bliver mange hos samme selskab i mange år uden at tjekke, om prisen stadig er fair.',
      ],
    },
    {
      q: 'Kan jeg spare ved at samle mine forsikringer?',
      a: [
        'Nogle selskaber giver samlerabat, når du har flere forsikringer samme sted.',
        'Men samlerabat betyder ikke nødvendigvis den laveste samlede pris. Det vigtigste er at se hele husstandens pris samlet.',
      ],
    },
    {
      q: 'Hvordan ved jeg, om jeg er dobbeltforsikret?',
      a: [
        'Du kan være dobbeltforsikret, hvis flere i husstanden betaler for den samme dækning hver for sig.',
        'Det kan fx være indbo, rejse eller en dækning, der allerede indgår i en anden police. Skriver I jeres forsikringer ind i Altid Hjem, har I dem samlet ét sted, så det er lettere selv at se overlap.',
      ],
    },
    {
      q: 'Hvad er Altid Hjem?',
      a: ['Altid Hjem er en dansk app, der samler madplan, strøm, forsikring og økonomi ét sted, så du får ét overblik, ét login.', 'Du kan hente den gratis i App Store og Google Play.'],
    },
    {
      q: 'Koster Altid Hjem noget?',
      a: ['Nej, appen er gratis at hente, og det er gratis at oprette sig.', 'Du betaler kun for det, du selv vælger at bruge, for eksempel strøm fra Altid Energi, hvis du bliver kunde.'],
    },
  ],
  store: {
    title: 'Hent Altid Hjem, og saml jeres forsikringer',
    body: 'Skriv jeres forsikringer, priser og fornyelser ind i appen, så har I dem samlet ét sted.',
  },
}
