import type { Metadata } from 'next'
import ElforbrugBenchmark from '@/components/ElforbrugBenchmark'
import Guide, { type GuideFaq, GuideApp, GuideFigure, GuideLink as A, GuideSteps } from '@/components/site/Guide'

// Brought up to the recipe (docs/guide-recipe.md, ALT-1714) on 16 Nov 2026. The levels are
// Energistyrelsen's, as Bolius and FDM give them; the effect of elbil and elvarme is Danmarks
// Statistik's analysis of the smart meter data.
export const metadata: Metadata = {
  title: 'Gennemsnitligt elforbrug i hjemmet | Altid Hjem',
  description:
    '4.500 kWh om året bruger en familie med to voksne og to børn i et hus på 150 m², ifølge Energistyrelsen. Elbil og elvarme løfter forbruget markant.',
  alternates: { canonical: 'https://www.altidhjem.dk/gennemsnitligt-elforbrug' },
  openGraph: {
    title: 'Hvad er et normalt elforbrug?',
    description:
      '4.500 kWh om året bruger en familie med to voksne og to børn i et hus på 150 m², ifølge Energistyrelsen. Elbil og elvarme løfter forbruget markant.',
    url: 'https://www.altidhjem.dk/gennemsnitligt-elforbrug',
    type: 'article',
  },
}

const BOLIUS = 'https://www.bolius.dk/saa-meget-el-vand-og-varme-bruger-en-gennemsnitsfamilie-279'
const FDM_FORBRUG = 'https://fdm.dk/vaerd-at-vide/stroem/beregn-dit-elforbrug-indsend-din-elregning'
const FDM_LADE = 'https://fdm.dk/vaerd-at-vide/ladeloesninger/hvad-koster-det-at-lade-en-elbil-op-hjemme'
const DST = 'https://www.dst.dk/analyser/56579-husstandenes-elforbrug'
const ELOVERBLIK = 'https://energinet.dk/media/mcejb3i4/eloverblik-adgang-til-egne-data-via-computer.pdf'
const SPAR_REGNING = 'https://sparenergi.dk/privat/forstaa-din-elregning'
const SPAR_ELPRISER = 'https://sparenergi.dk/privat/elpriser'
const SKAT = 'https://skat.dk/erhverv/afgifter-paa-varer-og-ydelser-punktafgifter/nyhedsbrev-afgifter/midlertidig-nedsaettelse-af-elafgiften-i-2026-og-2027'

// FAQ bruges to steder: synligt på siden og som FAQPage-schema.
const FAQ: GuideFaq[] = [
  {
    q: 'Hvad er et normalt elforbrug?',
    a: [
      'En familie med to voksne og to børn i et hus på 150 m² bruger 4.500 kWh om året, ifølge Energistyrelsen. En typisk dansker bruger 1.600 kWh om året.',
    ],
  },
  {
    q: 'Hvad bruger en lejlighed i strøm?',
    a: [
      'En lejlighed på ca. 80 m² med to beboere bruger 2.080 kWh om året, ifølge de tal fra Energistyrelsen, som FDM gengiver. Jeres eget tal afhænger af apparater, vaner og antallet af beboere.',
    ],
  },
  {
    q: 'Hvorfor er vores elforbrug højere end gennemsnittet?',
    a: [
      'Elvarme og elbil betyder mest. Ifølge Danmarks Statistik brugte husstande med elvarme eller varmepumpe 3,2 gange så meget strøm som husstande med fjernvarme i 2024, og husstande i hus med elbil 1,9 gange så meget som husstande med benzin- eller dieselbil.',
    ],
  },
  {
    q: 'Hvor meget strøm bruger en elbil om året?',
    a: [
      'Kører I 15.000 km om året i en bil, der bruger 20 kWh pr. 100 km, svarer det til ca. 3.000 kWh om året, regner FDM. Lader I hjemme, kommer det oven i husstandens forbrug.',
    ],
  },
  {
    q: 'Hvordan ser vi vores eget elforbrug?',
    a: [
      'Forbruget står på elregningen, og på Eloverblik kan I se de måledata, som elleverandøren og netselskabet har registreret. Brug et helt år, så I ikke sammenligner en vintermåned med et årsgennemsnit.',
    ],
  },
  {
    q: 'Hvad er Altid Hjem?',
    a: [
      'Altid Hjem er en dansk app, der samler madplan, strøm, forsikring og økonomi ét sted, så I får ét overblik, ét login.',
      'I kan hente den gratis i App Store og Google Play.',
    ],
  },
  {
    q: 'Koster Altid Hjem noget?',
    a: [
      'Nej, appen er gratis at hente, og det er gratis at oprette en profil.',
      'I betaler kun for det, I selv vælger at bruge, for eksempel strøm fra Altid Energi, hvis I bliver kunder.',
    ],
  },
]

export default function GennemsnitligtElforbrug() {
  return (
    <Guide
      title="Hvad er et normalt elforbrug?"
      lead={
        <>
          <p>
            4.500 kWh om året bruger en familie med to voksne og to børn i et hus på 150 m², ifølge Energistyrelsen. En typisk dansker bruger 1.600 kWh om året.
          </p>
          <p>
            Har I elbil eller elvarme, ligger forbruget langt højere. Husstande med elvarme brugte 3,2 gange så meget strøm som husstande med fjernvarme i 2024, viser Danmarks
            Statistik.
          </p>
        </>
      }
      meta={
        <>
          Bygger på Energistyrelsens tal og Danmarks Statistik · Se{' '}
          <a href={DST} target="_blank" rel="noopener noreferrer">
            Danmarks Statistiks analyse af husstandenes elforbrug
          </a>
        </>
      }
      answer={{ label: 'Familie på fire i hus', value: '4.500', unit: 'kWh om året', note: 'To voksne og to børn i et hus på 150 m², ifølge Energistyrelsen.' }}
      factors={{ label: 'Det betyder mest', items: ['Antal beboere', 'Bolig og størrelse', 'Elvarme', 'Elbil', 'Årstiden'] }}
      faq={FAQ}
      cta={{
        eyebrow: 'Kend jeres forbrug',
        heading: 'Hent Altid Hjem til hjemmets strøm og økonomi',
        subtitle: 'Med Altid Energi følger I elforbruget pr. dag, uge og måned i appen, som er gratis at hente.',
      }}
      page={{ path: '/gennemsnitligt-elforbrug', description: metadata.description as string, published: '2026-07-27', updated: '2026-11-16' }}
      sources={{
        checked: '2026-11-16',
        items: [
          { publisher: 'Bolius', title: 'Så meget el, vand og varme bruger en gennemsnitsfamilie', href: BOLIUS, note: 'Ajourført 9. februar 2026. Tal fra Energistyrelsen' },
          { publisher: 'FDM', title: 'Beregn dit elforbrug: Hvad er normalt i kWh?', href: FDM_FORBRUG, note: '11. februar 2026. Tal fra Energistyrelsen' },
          { publisher: 'Danmarks Statistik', title: 'Husstandenes elforbrug', href: DST, note: '11. september 2025. Data for 2021 til 2024' },
          { publisher: 'FDM', title: 'Hvad koster det at lade en elbil op hjemme?', href: FDM_LADE, note: '12. november 2025. Regneeksemplet er egne beregninger på baggrund af data fra FDM og Energistyrelsen' },
          { publisher: 'Energinet', title: 'Eloverblik: Adgang til egne data via kundeportalen, private elkunder', href: ELOVERBLIK },
          { publisher: 'Sparenergi', title: 'Forstå din elregning, og få hjælp til at skifte elselskab', href: SPAR_REGNING, note: 'Opdateret 8. januar 2026' },
          { publisher: 'Sparenergi', title: 'Elpriser time for time', href: SPAR_ELPRISER, note: 'Opdateret 8. januar 2025' },
          { publisher: 'Skattestyrelsen', title: 'Midlertidig nedsættelse af elafgiften i 2026 og 2027', href: SKAT, note: '1. januar 2026' },
        ],
      }}
      related={['/fastpris-eller-variabel-el', '/billigste-elselskab', '/hvad-koster-en-ladeboks']}
    >
      <section>
        <h2>Hvor meget strøm bruger en familie på fire?</h2>
        <p>
          En gennemsnitsfamilie med to voksne og to børn i et hus på 150 m² bruger 4.500 kWh om året, ifølge Energistyrelsens tal, som{' '}
          <A href={BOLIUS}>Bolius</A> gengiver. For et hus på ca. 150 m² med fire beboere gengiver <A href={FDM_FORBRUG}>FDM</A> Energistyrelsens tal som 4.570 kWh om året.
        </p>
        <p>
          En typisk dansker bruger til sammenligning 1.600 kWh om året, skriver Bolius med Energistyrelsen som kilde. Forbruget pr. person er altså lavere, når flere bor
          sammen.
        </p>
        <p>
          Tallene er gennemsnit. Jeres eget forbrug kan ligge et godt stykke over eller under, uden at noget er galt, især hvis I har elbil eller elvarme.
        </p>
      </section>
      <section>
        <h2>Hvad er et normalt elforbrug i lejlighed og hus?</h2>
        <p>Ifølge de tal fra Energistyrelsen, som <A href={FDM_FORBRUG}>FDM</A> gengiver, bruger en husstand typisk:</p>
        <ul>
          <li>2.080 kWh om året i en lejlighed på ca. 80 m² med to beboere.</li>
          <li>3.679 kWh om året i et hus på ca. 150 m² med to beboere.</li>
          <li>4.570 kWh om året i et hus på ca. 150 m² med fire beboere.</li>
        </ul>
        <p>
          FDM skriver, at tallene varierer, blandt andet med elvarme, varmepumpe og solceller. Brug dem som pejlemærker, ikke som et mål, alle hjem skal ramme.
        </p>
        <GuideFigure tone="sky" caption="Eksempel: vejledende niveauer for elforbruget. Tallene og deres kilder står i teksten. Illustration, ikke et skærmbillede fra appen.">
          <ElforbrugBenchmark />
        </GuideFigure>
      </section>
      <section>
        <h2>Hvad bruger en familie strømmen til?</h2>
        <p>
          En gennemsnitlig familie bruger især strømmen på vask, underholdning og køle- og fryseapparater, skriver <A href={BOLIUS}>Bolius</A>. Vask dækker opvaskemaskine,
          vaskemaskine og tørretumbler. Underholdning dækker blandt andet spillekonsoller, computere og hi-fi, men ikke tv.
        </p>
        <p>
          Bor I i lejlighed, bruger I typisk mere på underholdning, tv og køl og frys. I et hus går mere til vask. Strøm til elvarme, elvandvarme og varmepumper er ikke
          talt med i Bolius&apos; fordeling.
        </p>
        <p>
          Vil I bruge mindre strøm i de dyre timer, så start med vask og opvask. Nettariffen er højest fra kl. 17 til 21, skriver{' '}
          <A href={SPAR_ELPRISER}>Sparenergi</A>, og vasken kan ofte vente til senere.
        </p>
      </section>
      <section>
        <h2>Hvorfor bruger vi mere strøm end gennemsnittet?</h2>
        <p>
          Oftest på grund af elvarme eller elbil. <A href={DST}>Danmarks Statistik</A> har undersøgt måledata fra danske hjem. I 2024 brugte husstande med elbaseret
          opvarmning, altså varmepumpe eller elradiatorer, 3,2 gange så meget strøm som husstande med fjernvarme, målt ved medianen.
        </p>
        <p>
          Husstande i hus med elbil brugte 1,9 gange så meget strøm som husstande med benzin- eller dieselbil. For elbilerne er forskellen størst om vinteren. Hos husstande med elvarme svinger forbruget endnu mere: I december 2024 brugte
          de 5 gange så meget strøm som husstande med fjernvarme.
        </p>
        <p>
          Danmarks Statistik skriver også, at en gruppe husstande har et væsentligt højere forbrug end den typiske husstand.
        </p>
      </section>
      <section>
        <h2>Hvor meget strøm bruger en elbil?</h2>
        <p>
          Det afhænger især af, hvor langt I kører, og hvor mange kWh bilen bruger pr. 100 km, skriver <A href={FDM_LADE}>FDM</A>. Kører I 15.000 km om
          året i en bil, der bruger 20 kWh pr. 100 km, svarer det til ca. 3.000 kWh om året før ladetab.
        </p>
        <p>
          Lader I hjemme, bliver bilens forbrug en del af husstandens samlede elforbrug, skriver FDM. Sammenlign derfor ikke jeres tal direkte med en familie uden elbil.
        </p>
        <p>
          Overvejer I at lade hjemme, kan I læse, <A href="/hvad-koster-en-ladeboks">hvad en ladeboks koster</A>.
        </p>
      </section>
      <section>
        <h2>Hvordan finder I jeres eget elforbrug?</h2>
        <p>
          Forbruget i kWh står på elregningen. I kan også se det på Eloverblik, hvor elkunder ifølge <A href={ELOVERBLIK}>Energinet</A> har adgang til de data, som
          elleverandøren og netselskabet har registreret. Måledata vises først som en årssum, og I kan klikke jer ned i mindre perioder.
        </p>
        <p>
          Brug helst et helt år. Danmarks Statistik viser, at forbruget svinger meget med årstiden, især hvis I har elvarme. En vintermåned gange 12 giver derfor et for
          højt tal.
        </p>
        <p>Skriv også ned, hvis noget har ændret sig undervejs, for eksempel en ny elbil, en varmepumpe eller flere beboere.</p>
      </section>
      <section>
        <h2>Hvad betyder forbruget for elregningen?</h2>
        <p>
          Elregningen er mere end antallet af kWh. Ifølge <A href={SPAR_REGNING}>Sparenergi</A> består den af prisen på strømmen, elleverandørens abonnement, nettariffen og
          netabonnementet, Energinets tariffer og elafgiften. Der er moms på det hele.
        </p>
        <p>
          Elafgiften er 0,8 øre pr. kWh fra 1. januar 2026 til 31. december 2027, skriver <A href={SKAT}>Skattestyrelsen</A>. Nettariffen er højest fra klokken 17 til 21,
          skriver Sparenergi.
        </p>
        <p>
          Se, <A href="/hvornar-er-strommen-billigst">hvornår strømmen er billigst</A>, og hvad I skal sammenligne, når I vælger{' '}
          <A href="/billigste-elselskab">elselskab</A>.
        </p>
      </section>
      <section>
        <h2>Regneeksempel: hvad gør en elbil ved forbruget?</h2>
        <p>Et eksempel, ikke jeres regning. Det bygger på disse antagelser:</p>
        <ul>
          <li>Familien bor i et hus på ca. 150 m² med fire beboere og bruger 4.570 kWh om året, som i Energistyrelsens tal.</li>
          <li>Familien får en elbil, der kører 15.000 km om året og bruger 20 kWh pr. 100 km, som i FDM&apos;s eksempel.</li>
          <li>Bilen lades hjemme, og ladetab er ikke regnet med.</li>
        </ul>
        <p>
          Bilen lægger ca. 3.000 kWh oven i, så forbruget bliver ca. 7.570 kWh om året. Det er godt halvanden gang så meget som før. Pr. måned stiger forbruget i gennemsnit
          fra ca. 381 til ca. 631 kWh.
        </p>
      </section>
      <GuideSteps
        title="Sådan sammenligner I jeres elforbrug"
        steps={[
          'Find jeres forbrug for et helt år på elregningen eller på Eloverblik.',
          'Træk elbilens opladning fra, hvis I vil sammenligne med en familie uden elbil.',
          'Sammenlign med en husstand af samme størrelse og boligtype, og husk, om I har elvarme.',
          'Følg forbruget måned for måned, så I ser det, hvis det ændrer sig uden en tydelig grund.',
        ]}
      />
      <section>
        <h2>Hvordan kan Altid Hjem hjælpe?</h2>
        <p>
          Det er svært at vide, om forbruget er normalt, når I kun ser det på en regning bagefter. Altid Hjem samler madplan, strøm, forsikring og økonomi i én app, så I får
          ét overblik, ét login.
        </p>
        <p>
          I appen ser I elprisen time for time, og med Altid Energi følger I også elforbruget pr. dag, uge og måned. I kan hente appen gratis i App Store og Google Play.
        </p>
        <p>
          Altid Hjem er bygget af holdet bag elleverandøren Altid Energi. Denne guide bygger på Energistyrelsens tal, Danmarks Statistik, FDM og Sparenergi, ikke på vores
          egne priser.
        </p>
        <GuideApp
          tone="sky"
          src="/site/app/energi-home.webp"
          alt="Energi i Altid Hjem: elprisen time for time og husstandens forbrug de seneste tre måneder i kroner og kWh"
          caption="I appen: husstandens forbrug de seneste tre måneder i kroner og kWh, under elprisen time for time."
        />
      </section>
    </Guide>
  )
}
