// The blog cards' data: every guide's card on the front page (components/sections/Blog.tsx), and a
// guide's "Læs også" picks its cards from here (components/site/Guide.tsx). A plain module, not a
// client one, so the server-rendered guides can read it.

export type Post = {
  href: string
  icon: string
  category: string
  title: string
  excerpt: string
  meta: string
}

/** Every guide's card. A guide's "Læs også" picks its cards from here (components/site/Guide.tsx). */
export const POSTS: Post[] = [
  // Mixed so the visitor sees different services (Thor, 16 Nov 2026): the first seven cards are one
  // of each service, after that the services alternate and never two of one kind sit side by side.
  // test/blog-order.test.ts keeps it that way.
  {
    href: '/billigste-supermarked',
    icon: '/services/icon-mad.svg',
    category: 'Mad',
    title: 'Hvilket supermarked er billigst?',
    excerpt: 'Vi sammenlignede den samme kurv med 23 varer hos 13 kæder. Se hvem der var billigst, hvad forskellen betyder på et år, og hvordan analysen er lavet.',
    meta: '5 min læsning · 26. jul 2026',
  },
  {
    href: '/hvad-koster-indboforsikring',
    icon: '/services/icon-forsikring.svg',
    category: 'Forsikring',
    title: 'Hvad koster indboforsikring?',
    excerpt: 'Typisk 100-400 kr. om måneden, men to ens husstande kan betale vidt forskelligt. Se hvad prisen afhænger af, og hvor dobbeltdækning gemmer sig.',
    meta: '4 min læsning · 27. jul 2026',
  },
  {
    href: '/billigste-elselskab',
    icon: '/services/icon-strom.svg',
    category: 'Energi',
    title: 'Billigste elselskab: se på gebyrerne',
    excerpt: 'kWh-prisen er ikke hele sandheden. Gebyrer og tillæg er den del af elregningen, selskabet selv bestemmer, og den del du faktisk kan styre.',
    meta: '5 min læsning · 27. jul 2026',
  },
  {
    href: '/opsig-abonnementer',
    icon: '/app-badge.png',
    category: 'Overblik',
    title: 'Opsig de abonnementer, I ikke bruger',
    excerpt: 'Glemte abonnementer gemmer sig i kontoudtoget. Få metoden til at finde dem alle, opsige rigtigt og gøre gennemgangen til en årlig vane.',
    meta: '5 min læsning · 27. jul 2026',
  },
  {
    href: '/billigste-mobilabonnement',
    icon: '/services/icon-mobil.svg',
    category: 'Mobil',
    title: 'Billigste mobilabonnement i 2026',
    excerpt:
      'Abonnementer fås fra ca. 19 kr. om måneden, men husstandens samlede mobilregning er den, der batter. Se hvad priserne dækker, og hvor de gemmer sig.',
    meta: '5 min læsning · 27. jul 2026',
  },
  {
    href: '/hvad-koster-en-ladeboks',
    icon: '/services/icon-opladning.svg',
    category: 'Opladning',
    title: 'Hvad koster en ladeboks?',
    excerpt: 'Boks, installation, leje eller køb, og strømmen selv. Se de vejledende priser, og beregn din egen månedlige ladeudgift med beregneren på siden.',
    meta: 'Beregner · 27. jul 2026',
  },
  {
    href: '/hvad-koster-en-tyverialarm',
    icon: '/services/icon-alarm.svg',
    category: 'Alarm',
    title: 'Hvad koster en tyverialarm?',
    excerpt: 'Fra gør-det-selv til professionelt installerede systemer og abonnementer. Se de vejledende priser, og hvad de afhænger af, før du vælger.',
    meta: '5 min læsning · 27. jul 2026',
  },
  {
    href: '/madpakker-paa-budget',
    icon: '/services/icon-mad.svg',
    category: 'Mad',
    title: 'Madpakker på budget til skolestart',
    excerpt: 'Skolestart betyder 5 madpakker om ugen pr. barn. Få billige madpakke-idéer, en enkel ugeplan og råd til at planlægge efter ugens tilbud.',
    meta: '4 min læsning · 26. jul 2026',
  },
  {
    href: '/skift-forsikringsselskab',
    icon: '/services/icon-forsikring.svg',
    category: 'Forsikring',
    title: 'Skift forsikringsselskab uden huller',
    excerpt: 'Rækkefølgen beskytter dig: ny police på plads, før den gamle opsiges. Få tjeklisten til et sikkert skifte, og undgå de klassiske fælder.',
    meta: '4 min læsning · 27. jul 2026',
  },
  {
    href: '/gennemsnitligt-elforbrug',
    icon: '/services/icon-strom.svg',
    category: 'Energi',
    title: 'Er jeres elforbrug normalt?',
    excerpt: 'En familie i hus bruger typisk 4.500-5.000 kWh om året, en lejlighed langt mindre. Se benchmark for jeres boligtype, og hvad der flytter tallet.',
    meta: '5 min læsning · 27. jul 2026',
  },
  {
    href: '/hvad-koster-en-husforsikring',
    icon: '/services/icon-forsikring.svg',
    category: 'Forsikring',
    title: 'Hvad koster en husforsikring?',
    excerpt: 'Der kan være op til 9.200 kr. om året mellem det billigste og det dyreste selskab. Se, hvad der afgør prisen, og hvordan I sammenligner rigtigt.',
    meta: '5 min læsning · 16. nov 2026',
  },
  {
    href: '/bedste-budget-app',
    icon: '/app-badge.png',
    category: 'Overblik',
    title: 'Budget-app eller samlet overblik?',
    excerpt:
      'En budget-app viser forbruget bagud. Et samlet overblik styrer de faste aftaler fremad. Se ærligt, hvad de to værktøjer kan, og hvad de ikke kan.',
    meta: '4 min læsning · 27. jul 2026',
  },
  {
    href: '/madbudget',
    icon: '/services/icon-mad.svg',
    category: 'Mad',
    title: 'Hvad er et normalt madbudget?',
    excerpt: 'Danmarks Statistik har tallene for, hvad husstande faktisk bruger på mad. Se benchmark for jeres husstandstype, og hvorfor tallene i forældrefora ofte er højere.',
    meta: '6 min læsning · 26. jul 2026',
  },
  {
    href: '/hvad-koster-forsikring',
    icon: '/services/icon-forsikring.svg',
    category: 'Forsikring',
    title: 'Hvad koster forsikring i 2026?',
    excerpt:
      'Hvad en husstand bruger på forsikring om året ifølge Danmarks Statistik, hvad prisen afhænger af, og hvordan I ser, om I er dækket dobbelt.',
    meta: '5 min læsning · 17. jun 2026',
  },
  {
    href: '/madplan-efter-tilbud',
    icon: '/services/icon-mad.svg',
    category: 'Mad',
    title: 'Madplan efter ugens tilbud',
    excerpt: 'Tilbud først, madplan bagefter, indkøbsliste til sidst. Den rækkefølge er den enkeltvane, der flytter mest i madbudgettet. Sådan gør du i praksis.',
    meta: '5 min læsning · 26. jul 2026',
  },
  {
    href: '/hvad-koster-en-bilforsikring',
    icon: '/services/icon-forsikring.svg',
    category: 'Forsikring',
    title: 'Hvad koster en bilforsikring?',
    excerpt: 'En kaskoforsikring kostede i gennemsnit 6.239 kr. i 2024 ifølge FDM. Se, hvad der afgør prisen, og hvordan I sammenligner rigtigt.',
    meta: '5 min læsning · 16. nov 2026',
  },
  {
    href: '/hvornar-er-strommen-billigst',
    icon: '/services/icon-strom.svg',
    category: 'Energi',
    title: 'Lad Altid Hjem holde øje med elprisen for dig',
    excerpt: 'Det kræver tid at holde øje med elprisen hver dag. I Altid Hjem-appen ser du elprisen time for time og kan få besked, når strømmen er billig.',
    meta: '5 min læsning · 25. jun 2026',
  },
  {
    href: '/madbudget-familie-paa-4',
    icon: '/services/icon-mad.svg',
    category: 'Mad',
    title: 'Madbudget for en familie på 4',
    excerpt: 'Hvad er normalt for en børnefamilie? Se tallene fra Danmarks Statistik, hvad vores egen kurvanalyse viser, og de tre vaner der flytter mest.',
    meta: '5 min læsning · 26. jul 2026',
  },
  {
    href: '/spiir-alternativ',
    icon: '/app-badge.png',
    category: 'Overblik',
    title: 'Spiir lukker: hvad bruger du nu?',
    excerpt: 'Spiir lukkede 8. juni 2026. Altid Hjem giver dig overblik over hjemmets faste udgifter: strøm, forsikring og madplan samlet ét sted, i én app.',
    meta: '4 min læsning · 10. jun 2026',
  },
  {
    href: '/fastpris-eller-variabel-el',
    icon: '/services/icon-strom.svg',
    category: 'Energi',
    title: 'Fastpris eller variabel elaftale?',
    excerpt: 'For de fleste er variabel billigst over tid, vurderer Forbrugerrådet Tænk. Se forskellen, og hvad det koster at komme ud af en fastpris.',
    meta: '5 min læsning · 16. nov 2026',
  },
  {
    href: '/mad-for-3000-om-maaneden',
    icon: '/services/icon-mad.svg',
    category: 'Mad',
    title: 'Kan man leve for 3.000 kr. mad om måneden?',
    excerpt: 'Det ærlige svar med regnestykket: hvad 3.000 kr. betyder pr. uge, hvem der realistisk kan ramme det, og hvordan I kommer tættest på.',
    meta: '5 min læsning · 26. jul 2026',
  },
  {
    href: '/hvad-koster-forsikring',
    icon: '/services/icon-forsikring.svg',
    category: 'Forsikring',
    title: 'Er du forsikret dobbelt uden at vide det?',
    excerpt:
      'Flytter et par sammen med hver sin indboforsikring, kan de betale for den samme dækning to gange. Se, hvordan du tjekker det.',
    meta: '4 min læsning · 17. jun 2026',
  },
  {
    href: '/spar-penge-paa-dagligvarer',
    icon: '/services/icon-mad.svg',
    category: 'Mad',
    title: 'Spar penge på dagligvarer',
    excerpt: 'Ingen kupon-tricks, bare vaner der virker: vælg hovedbutik med omhu, planlæg efter tilbud, og køb rigtigt ind. Den samlede gevinst kan mærkes.',
    meta: '6 min læsning · 26. jul 2026',
  },
  {
    href: '/hvornar-er-strommen-billigst',
    icon: '/services/icon-strom.svg',
    category: 'Energi',
    title: 'Hvornår er strømmen billigst?',
    excerpt: 'Følg elpriserne time for time i DK1 og DK2, og se hvornår strømmen er billigst i dag og i morgen, så du kan lægge forbruget, når prisen er lav.',
    meta: '4 min læsning · 14. jun 2026',
  },
  {
    href: '/graensehandel-beregner',
    icon: '/services/icon-mad.svg',
    category: 'Mad',
    title: 'Kan grænsehandel betale sig?',
    excerpt: 'Regn det efter, før I kører: brændstof, break-even og de udgifter folk glemmer. Beregneren giver det ærlige svar for netop jeres tur.',
    meta: 'Beregner · 26. jul 2026',
  },
  {
    href: '/spiir-alternativ',
    icon: '/app-badge.png',
    category: 'Overblik',
    title: 'Få ro på hjemmets faste udgifter',
    excerpt:
      'Regninger, vilkår og aftaler spredt på mail, papir og e-Boks stjæler overblikket. Saml dem ét sted, og se præcis hvad du betaler for, og hvorfor.',
    meta: '3 min læsning · 10. jun 2026',
  },
  {
    href: '/jul-paa-budget',
    icon: '/services/icon-mad.svg',
    category: 'Mad',
    title: 'Jul på budget uden panik-uge',
    excerpt: 'Spred juleindkøbene over ugerne op til jul i stedet for én dyr uge i december. Sådan planlægger I julemaden efter tilbuddene.',
    meta: '5 min læsning · 26. jul 2026',
  },
  {
    href: '/hvad-koster-bredbaand',
    icon: '/app-badge.png',
    category: 'Overblik',
    title: 'Hvad koster bredbånd om måneden?',
    excerpt: 'Fiber med 300 Mbit kostede i gennemsnit 305 kr. om måneden og coax 284 kr. Se, hvad der afgør prisen, og hvor længe I må være bundet.',
    meta: '5 min læsning · 16. nov 2026',
  },
]
