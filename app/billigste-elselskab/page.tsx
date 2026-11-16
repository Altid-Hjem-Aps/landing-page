import type { Metadata } from 'next'
import Guide, { type GuideFaq, GuideApp, GuideLink as A, GuideSteps } from '@/components/site/Guide'
import { GUIDES } from '@/lib/guides'

// Brought up to the recipe (docs/guide-recipe.md, ALT-1714) on 16 Nov 2026. No company is named as
// the cheapest: the page explains what to compare, with Forbrugerrådet Tænk's test, Forsyningstilsynet
// and the rules for elselskaber as the sources.
export const metadata: Metadata = {
  title: 'Billigste elselskab, sådan sammenligner I | Altid Hjem',
  description:
    'Det afhænger af jeres forbrug. Sammenlign det, elselskabet selv bestemmer: tillægget til spotprisen, abonnement og gebyrer, som Forbrugerrådet Tænk gør.',
  alternates: { canonical: 'https://www.altidhjem.dk/billigste-elselskab' },
  openGraph: {
    title: 'Hvilket elselskab er billigst?',
    description:
      'Det afhænger af jeres forbrug. Sammenlign det, elselskabet selv bestemmer: tillægget til spotprisen, abonnement og gebyrer, som Forbrugerrådet Tænk gør.',
    url: 'https://www.altidhjem.dk/billigste-elselskab',
    type: 'article',
  },
}

const TAENK = 'https://taenk.dk/test/elselskaber'
const FST = 'https://forsyningstilsynet.dk/Media/638387451314241652/2022-elprisunders%C3%B8gelse.PDF'
const SPAR_REGNING = 'https://sparenergi.dk/privat/forstaa-din-elregning'
const SKAT = 'https://skat.dk/erhverv/afgifter-paa-varer-og-ydelser-punktafgifter/nyhedsbrev-afgifter/midlertidig-nedsaettelse-af-elafgiften-i-2026-og-2027'
const ENERGINET = 'https://www.energinet.dk/media/5v3pikp3/energinets_tarifkatalog_2026.pdf'
const BEK = 'https://www.retsinformation.dk/eli/lta/2025/1810/pdf'

// FAQ bruges to steder: synligt på siden og som FAQPage-schema.
const FAQ: GuideFaq[] = [
  {
    q: 'Hvilket elselskab er billigst?',
    a: [
      'Det afhænger af jeres forbrug. Forbrugerrådet Tænk sammenligner derfor kun det, elselskaberne selv bestemmer: tillægget til spotprisen, abonnement og gebyrer, ved seks forskellige forbrug fra 2.000 til 15.000 kWh om året.',
    ],
  },
  {
    q: 'Hvad bestemmer elselskabet selv på elregningen?',
    a: [
      'Elleverandøren sætter prisen pr. kWh og elabonnementet, skriver Sparenergi. Nettariffen og netabonnementet sættes af netselskabet, og elafgiften af staten.',
    ],
  },
  {
    q: 'Hvorfor er prisen pr. kWh ikke hele sandheden?',
    a: [
      'Fordi et fast abonnement bliver fordelt på jeres kWh. Jo mindre strøm I bruger, desto mere betyder abonnementet for prisen pr. kWh, skriver Forsyningstilsynet.',
    ],
  },
  {
    q: 'Koster det noget at skifte elselskab?',
    a: [
      'Som udgangspunkt nej. Et elselskab må kun opkræve et gebyr for skiftet, hvis I selv opsiger en fastprisaftale før tid, og gebyret må ikke være højere end selskabets direkte tab.',
    ],
  },
  {
    q: 'Skifter vi netselskab, når vi skifter elselskab?',
    a: [
      'Nej. Netselskabet ligger fast, fordi der kun er ét selskab, der ejer kablerne ud til jeres bolig, skriver Sparenergi.',
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

export default function BilligsteElselskab() {
  return (
    <Guide
      title={GUIDES['/billigste-elselskab'].title}
      lead={
        <>
          <p>
            Det afhænger af jeres forbrug. Sammenlign det, elselskabet selv bestemmer: tillægget til spotprisen, abonnement og gebyrer. Sådan gør Forbrugerrådet Tænk i sin
            test fra marts 2026 af 96 elaftaler fra 52 elselskaber.
          </p>
          <p>Spotprisen og elafgiften er de samme, uanset hvilket selskab I vælger, og nettariffen afhænger af jeres adresse.</p>
        </>
      }
      meta={
        <>
          Bygger på Forbrugerrådet Tænk, Forsyningstilsynet og Sparenergi · Se{' '}
          <a href={TAENK} target="_blank" rel="noopener noreferrer">
            Forbrugerrådet Tænks test af elselskaber
          </a>
        </>
      }
      answer={{
        label: 'Det skal I sammenligne',
        value: 'Tillæg, abonnement og gebyrer',
        note: 'Spotprisen og elafgiften er de samme hos alle elselskaber, skriver Forbrugerrådet Tænk.',
      }}
      factors={{ label: 'Det afgør prisen', items: ['Tillæg til spotprisen', 'Abonnement', 'Gebyrer', 'Jeres forbrug', 'Introduktionstilbud'] }}
      faq={FAQ}
      cta={{
        eyebrow: 'Kend jeres forbrug',
        heading: 'Hent Altid Hjem, og følg jeres strøm',
        subtitle: 'I appen ser I elprisen time for time, og med Altid Energi følger I også elforbruget pr. dag, uge og måned.',
      }}
      page={{ path: '/billigste-elselskab', description: metadata.description as string, published: GUIDES['/billigste-elselskab'].published, updated: GUIDES['/billigste-elselskab'].updated }}
      sources={{
        checked: '2026-11-16',
        items: [
          { publisher: 'Forbrugerrådet Tænk', title: 'TEST af elselskaber - find den billigste elaftale (2026)', href: TAENK, note: 'Test af 96 elaftaler fra 52 elselskaber, udgivet 12. marts 2026' },
          { publisher: 'Forsyningstilsynet', title: 'Hvad kostede strømmen i 2022? Prisundersøgelse af elprodukter til private og mindre virksomheder', href: FST, note: 'Juli 2023. Regneeksemplet er egne beregninger på baggrund af data fra Forsyningstilsynet og Forbrugerrådet Tænk' },
          { publisher: 'Sparenergi', title: 'Forstå din elregning, og få hjælp til at skifte elselskab', href: SPAR_REGNING, note: 'Opdateret 8. januar 2026' },
          { publisher: 'Skattestyrelsen', title: 'Midlertidig nedsættelse af elafgiften i 2026 og 2027', href: SKAT, note: '1. januar 2026' },
          { publisher: 'Energinet', title: 'Tarifkatalog 2026', href: ENERGINET },
          { publisher: 'Retsinformation', title: 'Bekendtgørelse om elhandelsvirksomhedernes opgaver og forpligtelser i forbindelse med levering af elektricitet til elkunder', href: BEK, note: 'Nr. 1810 af 29. december 2025, gældende fra 1. januar 2026' },
        ],
      }}
      related={['/fastpris-eller-variabel-el', '/hvornar-er-strommen-billigst', '/gennemsnitligt-elforbrug']}
    >
      <section>
        <h2>Hvorfor kan ingen sige, hvilket elselskab der er billigst?</h2>
        <p>
          Fordi svaret afhænger af, hvor meget strøm I bruger. <A href={TAENK}>Forbrugerrådet Tænk</A> regner derfor prisen for det første år ud ved seks forskellige forbrug:
          2.000, 3.000, 4.000, 6.000, 10.000 og 15.000 kWh om året. Testen fra marts 2026 omfatter 96 elaftaler fra 52 elselskaber.
        </p>
        <p>
          Alle aftaler i testen har variabel pris. Fastprisaftaler er ikke med, så testen siger intet om, hvilken fastpris der er bedst. Tænk skriver også, at I godt kan
          have en aftale, der ikke er med i testen.
        </p>
        <p>
          Tænk opfordrer til at vælge det billigste elprodukt. Det billigste for en lille lejlighed er bare ikke nødvendigvis det billigste for et hus med elbil.
        </p>
      </section>
      <section>
        <h2>Hvad består elregningen af?</h2>
        <p>
          Ifølge <A href={SPAR_REGNING}>Sparenergi</A> sætter elleverandøren prisen pr. kWh og elabonnementet. Netselskabet sætter prisen for at transportere strømmen,
          nettariffen, og netabonnementet. Der skal betales moms af alle posterne.
        </p>
        <p>
          Elafgiften er sat ned til 0,8 øre pr. kWh fra 1. januar 2026 til 31. december 2027, skriver <A href={SKAT}>Skattestyrelsen</A>. Energinets egne tariffer er 11,5
          øre pr. kWh uden moms i 2026, viser <A href={ENERGINET}>Energinets tarifkatalog</A>.
        </p>
        <p>
          Afgiften og Energinets tariffer er de samme, uanset hvilket elselskab I vælger. Nettariffen afhænger af, hvilket netselskab der ejer kablerne til jeres bolig.
        </p>
      </section>
      <section>
        <h2>Hvilke dele af prisen bestemmer elselskabet selv?</h2>
        <p>
          <A href={TAENK}>Forbrugerrådet Tænk</A> sammenligner kun de dele, der er forskellige fra selskab til selskab: oprettelsesgebyr, abonnement og gebyr for automatisk
          betaling. Dertil kommer det beløb, der lægges oven i spotprisen, og andre tillæg og gebyrer, for eksempel netadministrationsgebyr.
        </p>
        <p>
          Spotprisen og afgiften til staten er ikke med i sammenligningen, fordi de er de samme for alle. Det er altså tillæg, abonnement og gebyrer, der skiller selskaberne ad.
        </p>
        <p>
          Køber selskabet oprindelsescertifikater på et produkt, regner Tænk også prisen for dem med. Viser et selskab ikke det fulde tillæg til spotprisen tydeligt på
          produktet, trækker Tænk 20 procentpoint fra i bedømmelsen.
        </p>
      </section>
      <section>
        <h2>Hvad skal stå i aftalen, før I skriver under?</h2>
        <p>
          Før I indgår eller forlænger en aftale, skal elselskabet give jer et resumé af de vigtigste vilkår, står der i <A href={BEK}>bekendtgørelsen</A>. Resuméet skal
          vise, hvordan elprisen bliver regnet ud, og alle tillæg til spotprisen skal stå særskilt i øre pr. kWh.
        </p>
        <p>
          Abonnement og obligatoriske gebyrer skal også stå der, og det skal fremgå, om prisen er fast eller variabel. Selve kontrakten skal I have på et varigt medie.
        </p>
        <p>
          Vil elselskabet senere ændre prisen eller vilkårene til jeres ugunst, skal I som husholdning som udgangspunkt have besked mindst 3 måneder før. Brug varslet til at
          sammenligne igen.
        </p>
      </section>
      <section>
        <h2>Betyder abonnementet noget for prisen?</h2>
        <p>
          Ja, især hvis I bruger lidt strøm. Ifølge <A href={FST}>Forsyningstilsynet</A> er prisen pr. kWh, med abonnementet regnet med, for de fleste elprodukter lavere ved
          et højt forbrug, fordi abonnementet bliver fordelt på flere kWh.
        </p>
        <p>
          Har I et relativt beskedent forbrug, kan det derfor ofte betale sig at vælge et produkt med lav eller ingen abonnementsbetaling, skriver Forsyningstilsynet.
        </p>
        <p>
          Hold også øje med introduktionstilbud. Ifølge Forsyningstilsynet ophører de fleste efter en begrænset periode, og så bliver I flyttet til et andet produkt. Tjek derfor, hvilket produkt I
          ender på, og hvordan prisen bliver sat bagefter.
        </p>
      </section>
      <section>
        <h2>Hvordan sammenligner I elselskaber rigtigt?</h2>
        <p>
          Tag udgangspunkt i jeres eget forbrug for et helt år, som står på elregningen. Regn så den samlede pris for det første år ud med tillæg, abonnement og gebyrer, og
          sammenlign kun aftaler af samme type.
        </p>
        <p>
          <A href={SPAR_REGNING}>Sparenergi</A> henviser til elpris.dk, hvor I kan se jeres muligheder. <A href={FST}>Forsyningstilsynet</A> anbefaler at tjekke markedet flere gange om året,
          hvis I går efter de gode tilbud.
        </p>
        <p>
          Vil I vide mere om jeres forbrug, så se, <A href="/gennemsnitligt-elforbrug">hvad et normalt elforbrug er</A>. Overvejer I fastpris, så læs guiden{' '}
          <A href="/fastpris-eller-variabel-el">Fastpris eller variabel elaftale?</A>
        </p>
      </section>
      <section>
        <h2>Kan I skifte elselskab uden gebyr?</h2>
        <p>
          Ja, som udgangspunkt. Ifølge <A href={BEK}>bekendtgørelsen</A>, der gælder fra 1. januar 2026, må et elselskab kun opkræve et gebyr for skiftet, hvis I selv
          opsiger en fastprisaftale før tid. Gebyret må ikke være højere end selskabets direkte tab.
        </p>
        <p>
          Et elselskab må heller ikke binde jer på en aftale med variabel pris, skriver <A href={TAENK}>Forbrugerrådet Tænk</A>. Netselskabet skifter I ikke, for der er kun
          ét selskab, der ejer kablerne til jeres bolig, skriver Sparenergi.
        </p>
        <p>
          I 2022 skiftede ca. 8,4 procent af forbrugerne elleverandør, viser <A href={FST}>Forsyningstilsynets prisundersøgelse</A>.
        </p>
      </section>
      <section>
        <h2>Regneeksempel: hvad betyder et fast abonnement pr. kWh?</h2>
        <p>Et eksempel, ikke jeres regning. Det bygger på disse antagelser:</p>
        <ul>
          <li>Selskab A har et abonnement på 30 kroner om måneden, altså 360 kroner om året.</li>
          <li>To husstande bruger 2.000 og 6.000 kWh om året, to af forbrugene i Forbrugerrådet Tænks test.</li>
          <li>Moms er ikke regnet med.</li>
        </ul>
        <p>
          For husstanden med 2.000 kWh lægger abonnementet 18 øre oven i hver kWh. For husstanden med 6.000 kWh er det 6 øre. Det samme abonnement vejer altså tre gange så
          tungt, når forbruget er en tredjedel så stort.
        </p>
      </section>
      <GuideSteps
        title="Tjekliste før I skifter elselskab"
        steps={[
          'Find jeres forbrug for et helt år på elregningen.',
          'Sammenlign tillægget til spotprisen, abonnementet og gebyrerne, ikke kun prisen pr. kWh.',
          'Tjek, om prisen er et introduktionstilbud, og hvad I betaler, når det udløber.',
          'Har I fastpris, så tjek udløbsdatoen, før I skifter, så I ved, om der kommer et gebyr.',
        ]}
      />
      <section>
        <h2>Hvordan kan Altid Hjem hjælpe?</h2>
        <p>
          Det billigste elselskab for jer afhænger af jeres forbrug, så I skal kende det. Altid Hjem samler madplan, strøm, forsikring og økonomi i én app, så I får ét
          overblik, ét login.
        </p>
        <p>
          I appen ser I elprisen time for time, og med Altid Energi følger I også elforbruget pr. dag, uge og måned. I kan hente appen gratis i App Store og Google Play.
        </p>
        <p>
          Altid Hjem er bygget af holdet bag elleverandøren Altid Energi. Denne guide bygger på Forbrugerrådet Tænk, Forsyningstilsynet, Sparenergi og myndighedernes egne
          tal, ikke på vores egne priser.
        </p>
        <GuideApp
          tone="sky"
          src="/site/app/energi-home.webp"
          alt="Energi i Altid Hjem: elprisen lige nu, priserne time for time og forbruget de seneste tre måneder i kroner og kWh"
          caption="I appen: elprisen time for time og husstandens forbrug pr. måned i kroner og kWh."
        />
      </section>
    </Guide>
  )
}
