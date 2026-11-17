import type { Metadata } from 'next'
import Guide, { type GuideFaq, GuideApp, GuideLink as A, GuideSteps } from '@/components/site/Guide'
import { GUIDES } from '@/lib/guides'

// Written by the recipe (docs/guide-recipe.md) in the SEO-kørsel of 16 Nov 2026 (ALT-1851). The
// elafgift is Skattestyrelsen's 2026 rate, the bill's parts and the dear hours are Sparenergi's,
// the seasons and the effect of elvarme and elbil are Danmarks Statistik's analysis of the smart
// meter data, and the family's consumption is Energistyrelsen's, as Bolius gives it.
export const metadata: Metadata = {
  title: 'Hvorfor er min elregning så høj? | Altid Hjem',
  description:
    'Elafgiften er kun 0,8 øre pr. kWh i 2026, ifølge Skattestyrelsen. En høj elregning skyldes oftere vinterens forbrug, de dyre timer og elaftalen.',
  alternates: { canonical: 'https://www.altidhjem.dk/hvorfor-er-elregningen-hoej' },
  openGraph: {
    title: 'Hvorfor er min elregning så høj?',
    description:
      'Elafgiften er kun 0,8 øre pr. kWh i 2026, ifølge Skattestyrelsen. En høj elregning skyldes oftere vinterens forbrug, de dyre timer og elaftalen.',
    url: 'https://www.altidhjem.dk/hvorfor-er-elregningen-hoej',
    type: 'article',
  },
}

const SPAR_REGNING = 'https://sparenergi.dk/privat/forstaa-din-elregning'
const SPAR_ELPRISER = 'https://sparenergi.dk/privat/elpriser'
const DST = 'https://www.dst.dk/analyser/56579-husstandenes-elforbrug'
const BOLIUS = 'https://www.bolius.dk/saa-meget-el-vand-og-varme-bruger-en-gennemsnitsfamilie-279'
const SKAT = 'https://skat.dk/erhverv/afgifter-paa-varer-og-ydelser-punktafgifter/nyhedsbrev-afgifter/midlertidig-nedsaettelse-af-elafgiften-i-2026-og-2027'
const ELOVERBLIK = 'https://energinet.dk/media/mcejb3i4/eloverblik-adgang-til-egne-data-via-computer.pdf'

// FAQ bruges to steder: synligt på siden og som FAQPage-schema.
const FAQ: GuideFaq[] = [
  {
    q: 'Hvorfor er min elregning så høj?',
    a: [
      'Oftest fordi I bruger mere strøm om vinteren, bruger strømmen i de dyre timer fra kl. 17 til 21, eller har en elaftale, der ikke passer til jeres forbrug.',
      'Elafgiften er kun 0,8 øre pr. kWh i 2026, ifølge Skattestyrelsen, så den er ikke forklaringen.',
    ],
  },
  {
    q: 'Hvorfor er elregningen højere om vinteren?',
    a: [
      'Forbruget topper i december, januar eller februar, viser Danmarks Statistik. Samtidig er nettariffen dyrest fra oktober til og med marts, skriver Sparenergi.',
    ],
  },
  {
    q: 'Hvad er et normalt elforbrug for en familie?',
    a: [
      'En familie med to voksne og to børn i et hus på 150 m² bruger 4.500 kWh om året, ifølge Energistyrelsen. Har I elvarme eller elbil, ligger forbruget typisk højere.',
    ],
  },
  {
    q: 'Hvornår på døgnet er strømmen dyrest?',
    a: [
      'Nettariffen er højest fra kl. 17 til 21, skriver Sparenergi. Har I en aftale med variabel pris, skifter også prisen på selve strømmen fra time til time.',
    ],
  },
  {
    q: 'Hvordan ser vi, hvornår vi har brugt strømmen?',
    a: [
      'Forbruget står på elregningen. På Eloverblik kan I se de måledata, som elleverandøren og netselskabet har registreret, og klikke jer ned i mindre perioder.',
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

export default function HvorforErElregningenHoej() {
  return (
    <Guide
      title={GUIDES['/hvorfor-er-elregningen-hoej'].title}
      lead={
        <>
          <p>
            0,8 øre pr. kWh er elafgiften i 2026 og 2027, skriver Skattestyrelsen, så afgiften er ikke grunden til en høj elregning lige nu.
          </p>
          <p>
            Oftest er forklaringen, at I bruger mere strøm om vinteren, bruger den i de dyre timer fra kl. 17 til 21, eller har en elaftale, der ikke passer til jeres forbrug.
          </p>
        </>
      }
      meta={
        <>
          Bygger på Sparenergi, Danmarks Statistik og Skattestyrelsen · Se{' '}
          <a href={SPAR_REGNING} target="_blank" rel="noopener noreferrer">
            Sparenergis forklaring af elregningen
          </a>
        </>
      }
      answer={{ label: 'Elafgift i 2026', value: '0,8', unit: 'øre pr. kWh', note: 'Fra 1. januar 2026 til 31. december 2027, ifølge Skattestyrelsen. Moms kommer oveni.' }}
      factors={{ label: 'Det betyder mest', items: ['Forbruget', 'Årstiden', 'Tidspunktet på døgnet', 'Elaftalen', 'Elvarme og elbil'] }}
      faq={FAQ}
      cta={{
        eyebrow: 'Se regningen komme',
        heading: 'Hent Altid Hjem og følg hjemmets strøm',
        subtitle: 'I appen ser I elprisen time for time, og med Altid Energi følger I forbruget pr. dag, uge og måned. Appen er gratis at hente.',
      }}
      page={{
        path: '/hvorfor-er-elregningen-hoej',
        description: metadata.description as string,
        published: GUIDES['/hvorfor-er-elregningen-hoej'].published,
        updated: GUIDES['/hvorfor-er-elregningen-hoej'].updated,
      }}
      sources={{
        checked: '2026-11-16',
        items: [
          { publisher: 'Sparenergi', title: 'Forstå din elregning, og få hjælp til at skifte elselskab', href: SPAR_REGNING, note: 'Opdateret 8. januar 2026' },
          { publisher: 'Sparenergi', title: 'Elpriser time for time', href: SPAR_ELPRISER, note: 'Opdateret 8. januar 2025' },
          { publisher: 'Danmarks Statistik', title: 'Husstandenes elforbrug', href: DST, note: '11. september 2025. Data for december 2020 til december 2024' },
          { publisher: 'Bolius', title: 'Så meget el, vand og varme bruger en gennemsnitsfamilie', href: BOLIUS, note: 'Ajourført 9. februar 2026. Tal fra Energistyrelsen' },
          {
            publisher: 'Skattestyrelsen',
            title: 'Midlertidig nedsættelse af elafgiften i 2026 og 2027',
            href: SKAT,
            note: '1. januar 2026. Elafgiften for et års forbrug og regneeksemplet er egne beregninger på baggrund af data fra Skattestyrelsen og Energistyrelsen',
          },
          { publisher: 'Energinet', title: 'Eloverblik: Adgang til egne data via kundeportalen, private elkunder', href: ELOVERBLIK },
        ],
      }}
      related={['/gennemsnitligt-elforbrug', '/fastpris-eller-variabel-el', '/hvornar-er-strommen-billigst']}
    >
      <section>
        <h2>Hvilke dele af elregningen kan stige?</h2>
        <p>
          Elregningen består af flere dele. Ifølge <A href={SPAR_REGNING}>Sparenergi</A> er det prisen på selve strømmen, elleverandørens abonnement, nettariffen og
          netabonnementet til netselskabet, Energinets tariffer og elafgiften. Der er moms på det hele.
        </p>
        <p>
          Nogle af delene følger antallet af kWh, I bruger: strømmen, nettariffen, Energinets tariffer og elafgiften. Abonnementerne er faste beløb, som I betaler, uanset hvor
          meget strøm I bruger. Bruger I mere strøm, vokser de fleste linjer på regningen altså på én gang.
        </p>
        <p>
          Prisen på strømmen og abonnementet bestemmer elleverandøren. Nettariffen og netabonnementet fastsætter netselskabet i jeres område. Se, hvilke dele I selv kan
          påvirke, i guiden om, <A href="/billigste-elselskab">hvilket elselskab der er billigst</A>.
        </p>
      </section>
      <section>
        <h2>Hvorfor er elregningen højere om vinteren?</h2>
        <p>
          Fordi I bruger mere strøm, når det er koldt og mørkt. <A href={DST}>Danmarks Statistik</A> har set på måledata fra danske hjem fra december 2020 til december 2024.
          I alle årene toppede forbruget i december, januar eller februar, og det laveste forbrug lå om sommeren.
        </p>
        <p>
          Udsvinget er størst i hjem med elvarme. I december 2024 brugte husstande med elvarme 5 gange så meget strøm som husstande med fjernvarme, og i juli 2 gange så
          meget, skriver Danmarks Statistik.
        </p>
        <p>
          Også betalingen for at få strømmen leveret skifter med årstiden. Ifølge <A href={SPAR_ELPRISER}>Sparenergi</A> er vinterperioden fra oktober til og med marts den
          dyreste for nettariffen. En vinterregning er derfor ikke et tegn på, at noget er galt. Sammenlign den med samme måned sidste år, ikke med en sommermåned.
        </p>
      </section>
      <section>
        <h2>Bruger I mere strøm end andre husstande?</h2>
        <p>
          En familie med to voksne og to børn i et hus på 150 m² bruger 4.500 kWh om året, ifølge Energistyrelsens tal, som <A href={BOLIUS}>Bolius</A> gengiver. En
          typisk dansker bruger 1.600 kWh om året.
        </p>
        <p>
          Elvarme og elbil løfter forbruget mest. I 2024 brugte husstande med varmepumpe eller elradiatorer 3,2 gange så meget strøm som husstande med fjernvarme, målt ved
          medianen, skriver <A href={DST}>Danmarks Statistik</A>. Husstande i hus med elbil brugte 1,9 gange så meget som husstande med benzin- eller dieselbil.
        </p>
        <p>
          Har I fået elbil, varmepumpe eller flere beboere siden sidste år, er en højere regning altså ikke mærkelig. Se, <A href="/gennemsnitligt-elforbrug">hvad et
          normalt elforbrug er</A> for jeres type bolig.
        </p>
      </section>
      <section>
        <h2>Bruger I strømmen i de dyre timer?</h2>
        <p>
          Nettariffen skifter i løbet af døgnet. Den er højest i den såkaldte kogespids fra kl. 17 til 21 og lavest fra kl. 0 til 6, skriver{' '}
          <A href={SPAR_ELPRISER}>Sparenergi</A>.
        </p>
        <p>
          Står der flexpris, spotpris eller lignende på jeres elregning, har I normalt en variabel timepris, skriver Sparenergi. Så skifter også prisen på selve strømmen
          fra time til time, og strøm om aftenen kan altså blive dyr af to grunde.
        </p>
        <p>
          Vask, opvask, tørretumbler og opladning af elbil kan ofte flyttes. Ligger de i de dyre timer, betaler I mere for den samme mængde strøm. Se,{' '}
          <A href="/hvornar-er-strommen-billigst">hvornår strømmen er billigst</A> i dag og i morgen.
        </p>
      </section>
      <section>
        <h2>Har I den rigtige elaftale?</h2>
        <p>
          Elaftalen afgør, hvad I betaler for selve strømmen. Med fastpris betaler I den samme pris i hele aftalens periode. Med variabel pris følger prisen markedet, så
          den stiger, når strømmen bliver dyr, og falder igen, når den bliver billig.
        </p>
        <p>
          Se også efter elleverandørens abonnement og eventuelle tillæg. Ifølge <A href={SPAR_REGNING}>Sparenergi</A> er abonnementet et fast beløb for at være kunde, som
          elleverandøren selv fastsætter, og nogle gange er det lagt ind i prisen pr. kWh.
        </p>
        <p>
          Har I ikke kigget på aftalen længe, så sammenlign den med andre aftaler. Læs, hvad forskellen er på <A href="/fastpris-eller-variabel-el">fastpris og variabel
          elaftale</A>.
        </p>
      </section>
      <section>
        <h2>Betyder elafgiften noget for regningen i 2026?</h2>
        <p>
          Kun lidt. Fra 1. januar 2026 til 31. december 2027 er elafgiften sat ned til 0,8 øre pr. kWh, skriver <A href={SKAT}>Skattestyrelsen</A>. Der er moms oveni, som
          på resten af regningen, skriver Sparenergi.
        </p>
        <p>
          Med de 4.500 kWh om året fra Energistyrelsens tal bliver elafgiften ca. 36 kroner om året før moms, regnet efter Skattestyrelsens sats.
        </p>
        <p>
          En høj regning i 2026 kommer derfor fra de andre dele: forbruget, prisen på strømmen, nettariffen og abonnementerne. Det er dem, I skal kigge på.
        </p>
      </section>
      <section>
        <h2>Hvordan finder I årsagen til en høj elregning?</h2>
        <p>
          Start med forbruget. Står der flere kWh på regningen end i samme periode sidste år, er det forbruget, der er steget. Står der nogenlunde det samme, er det prisen
          pr. kWh eller abonnementerne, der har ændret sig.
        </p>
        <p>
          På Eloverblik kan I se de måledata, som elleverandøren og netselskabet har registreret, skriver <A href={ELOVERBLIK}>Energinet</A>. Data vises først som en
          årssum, og I kan klikke jer ned i mindre perioder. Så kan I se, hvilke måneder forbruget steg i.
        </p>
        <p>
          Vil I bruge mindre strøm, står der gode råd i guiden om <A href="/gennemsnitligt-elforbrug">et normalt elforbrug</A>.
        </p>
      </section>
      <GuideSteps
        title="Sådan finder I årsagen til en høj elregning"
        steps={[
          'Find forbruget i kWh på regningen, og sammenlign det med samme måned sidste år.',
          'Se på Eloverblik, hvilke måneder forbruget steg i.',
          'Tjek, om meget af forbruget ligger fra kl. 17 til 21.',
          'Læs elaftalen, og se, hvad I betaler i abonnement og tillæg.',
        ]}
      />
      <section>
        <h2>Regneeksempel: hvad gør en kold måned ved regningen?</h2>
        <p>Et eksempel, ikke jeres regning. Det bygger på disse antagelser:</p>
        <ul>
          <li>Husstanden bruger 4.500 kWh om året, som familien på fire i Energistyrelsens tal. Det er i gennemsnit 375 kWh om måneden.</li>
          <li>I januar bruger husstanden 450 kWh, fordi det er koldt og mørkt. Tallet er valgt til eksemplet.</li>
          <li>Strømmen koster i alt 2,50 kr. pr. kWh med nettarif, afgifter og moms. Prisen er en antagelse, ikke et selskabs pris.</li>
          <li>Abonnementerne er ikke regnet med.</li>
        </ul>
        <p>
          En gennemsnitlig måned koster 375 kWh gange 2,50 kr., altså 937,50 kr. Januar koster 450 kWh gange 2,50 kr., altså 1.125 kr. Regningen for januar er dermed 187,50
          kr. højere, uden at prisen pr. kWh har ændret sig.
        </p>
        <p>Ligger mere af januarforbruget fra kl. 17 til 21, bliver forskellen større, fordi nettariffen er højest i de timer.</p>
      </section>
      <section>
        <h2>Hvordan kan Altid Hjem hjælpe?</h2>
        <p>
          En høj elregning er svær at forstå, når I kun ser den bagefter. Altid Hjem samler madplan, strøm, forsikring og økonomi i én app, så I får ét overblik, ét login.
        </p>
        <p>
          I appen ser I elprisen time for time, så I kan se, hvornår strømmen er dyr. Med Altid Energi følger I også elforbruget pr. dag, uge og måned, så en dyr måned
          ikke kommer som en overraskelse. I kan hente appen gratis i App Store og Google Play.
        </p>
        <p>
          Altid Hjem er bygget af holdet bag elleverandøren Altid Energi. Denne guide bygger på Sparenergi, Danmarks Statistik, Skattestyrelsen og Energistyrelsens tal, ikke
          på vores egne priser.
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
