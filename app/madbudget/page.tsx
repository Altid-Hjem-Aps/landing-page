import type { Metadata } from 'next'
import { SITE_IMAGE } from '@/lib/site-image'
import MadbudgetBenchmark from '@/components/mad/MadbudgetBenchmark'
import MadbudgetSammenligningMockup from '@/components/mad/MadbudgetSammenligningMockup'
import { MAD_GUIDE_CTA, MAD_REPORT_HREF, MAD_REPORT_LABEL } from '@/components/mad/madGuide'
import Guide, { GuideFigure, GuideLink as A, GuideStores, type GuideFaq } from '@/components/site/Guide'
import { GUIDES } from '@/lib/guides'

// Moved from altidmad.dk/madbudget (16 Nov 2026) with the text word for word. The old
// /beregn-dit-madbudget is merged in: its two own sections follow "Sådan sætter I et realistisk
// madbudget" below, and the old address redirects here.
export const metadata: Metadata = {
  title: 'Madbudget for familien: Hvad er normalt? | Altid Hjem',
  description:
    'Se, hvad et normalt madbudget er for familier og andre husstande, og få konkrete råd til at lægge et budget, der holder. Kom godt i gang.',
  alternates: { canonical: 'https://www.altidhjem.dk/madbudget' },
  openGraph: {
    title: 'Hvad er et normalt madbudget for en familie?',
    description:
      'Se, hvad et normalt madbudget er for familier og andre husstande, og få konkrete råd til at lægge et budget, der holder. Kom godt i gang.',
    url: 'https://www.altidhjem.dk/madbudget',
    type: 'article',
    images: [SITE_IMAGE],
  },
  twitter: { card: 'summary_large_image', images: [SITE_IMAGE] },
}

// FAQ bruges to steder: synligt på siden og som FAQPage-schema (rich results).
const FAQ: GuideFaq[] = [
  {
    q: 'Hvad bruger 2 voksne på mad om måneden?',
    a: [
      '2 voksne under 60 uden børn bruger i gennemsnit ca. 3.478 kr. om måneden ifølge Danmarks Statistik.',
      'Det er et gennemsnit, så appetit, madvaner og valg af butikker kan flytte beløbet mærkbart.',
    ],
  },
  {
    q: 'Hvorfor bruger vi mere end gennemsnittet?',
    a: [
      'I kan bruge mere på grund af husstandens størrelse, teenagere, særlige kostbehov, takeaway eller dyre indkøbssteder.',
      'Undersøg også, om jeres opgørelse inkluderer andre dagligvarer, mens Danmarks Statistiks tal kun dækker fødevarer og ikke-alkoholiske drikkevarer.',
    ],
  },
  {
    q: 'Hvad tæller med i et madbudget?',
    a: [
      'Et madbudget bør som minimum omfatte fødevarer og ikke-alkoholiske drikkevarer til hjemmet.',
      'I kan vælge at medregne takeaway og restaurantbesøg, men hold rengøring, personlig pleje og andre dagligvarer adskilt, hvis I vil sammenligne med Danmarks Statistik.',
    ],
  },
  {
    q: 'Hvordan kommer vi i gang med at spare?',
    a: [
      'Gennemgå jeres faktiske forbrug, planlæg ugens måltider og sammenlign prisen på den samlede indkøbskurv.',
      'Begynd med de ændringer, der er nemme at gentage, såsom en indkøbsliste, færre ekstrature og bedre brug af rester.',
    ],
  },
]

export default function Madbudget() {
  return (
    <Guide
      title={GUIDES['/madbudget'].title}
      lead={
        <>
          <p>
            Et normalt madbudget afhænger især af husstandens størrelse. Ifølge Danmarks Statistik bruger en gennemsnitshusstand 41.851 kr. om året på fødevarer og
            ikke-alkoholiske drikkevarer, svarende til ca. 3.488 kr. om måneden.
          </p>
          <p>
            For 2 voksne med børn er gennemsnittet 65.775 kr. om året, svarende til ca. 5.481 kr. om måneden. Tallene er et nyttigt pejlemærke, men jeres realistiske budget
            afhænger også af børnenes alder, madvaner og hvor I handler.
          </p>
        </>
      }
      meta={
        <>
          Kilde: Danmarks Statistik, Forbrugsundersøgelsen 2024 · Kilde:{' '}
          <a href={MAD_REPORT_HREF}>
            {MAD_REPORT_LABEL}
          </a>
        </>
      }
      answer={{
        label: 'Gennemsnitshusstand',
        value: '3.488',
        unit: 'kr. om måneden',
        note: 'For 2 voksne med børn er gennemsnittet ca. 5.481 kr. om måneden.',
      }}
      factors={{ label: 'Det påvirker budgettet', items: ['Husstandens størrelse', 'Børnenes alder', 'Madvaner', 'Hvor I handler'] }}
      faq={FAQ}
      cta={MAD_GUIDE_CTA}
      page={{ path: '/madbudget', description: metadata.description as string, published: GUIDES['/madbudget'].published, updated: GUIDES['/madbudget'].updated }}
      sources={{
        checked: '2026-11-16',
        items: [
          { publisher: 'Danmarks Statistik', title: 'Forbrugsundersøgelsen, tabel FU13: Forbrug efter husstand', href: 'https://www.statistikbanken.dk/FU13', note: 'Fødevarer og ikke-alkoholiske drikkevarer, løbende priser, 2024. Månedsbeløb er egne beregninger på baggrund af data fra Danmarks Statistik (årsbeløb delt med 12)' },
          { publisher: 'Danmarks Statistik', title: 'Forbrugsundersøgelsen, tabel FU11: Baggrundsoplysninger', href: 'https://www.statistikbanken.dk/FU11', note: 'Personer i husstanden, gennemsnitshusstand: 2,0 i 2024' },
          { publisher: 'Altid Mad', title: MAD_REPORT_LABEL, href: `https://www.altidhjem.dk${MAD_REPORT_HREF}`, note: 'Den samme ugekurv med 23 varer til 2 voksne og 2 teenagere hos 13 kæder. Genereret 21. september 2026. Månedsbeløb er egne beregninger på baggrund af rapportens ugepriser (ugepris gange 52 delt med 12)' },
        ],
      }}
      related={['/madbudget-familie-paa-4', '/mad-for-3000-om-maaneden', '/spar-penge-paa-dagligvarer']}
    >
      <section>
        <h2>Hvad bruger danske husstande faktisk?</h2>
        <p>
          Tabellen viser tal fra Danmarks Statistiks Forbrugsundersøgelse 2024. Enlige med børn bruger i gennemsnit 38.564 kr. om året, svarende til ca. 3.214 kr. om
          måneden.
        </p>
        <p>
          For 2 voksne under 60 uden børn er beløbet 41.730 kr. om året, svarende til ca. 3.478 kr. om måneden. Kategorien omfatter alle fødevarer og ikke-alkoholiske
          drikkevarer gennem hele året.
        </p>
        <p>
          En gennemsnitshusstand bestod af 2,0 personer i 2024. Derfor kan gennemsnittet ikke sammenlignes direkte med en familie eller med en enkelt ugentlig indkøbskurv.
        </p>
        <GuideFigure tone="lavender" kind="data" caption="Tal fra Danmarks Statistik, Forbrugsundersøgelsen 2024: så meget bruger danske husstande på mad om måneden.">
          <MadbudgetBenchmark />
        </GuideFigure>
      </section>
      <section>
        <h2>Hvorfor er beløbene i forældrefora ofte højere?</h2>
        <p>
          I forældrefora fortæller familier ofte, at de bruger 4.000-7.000 kr. om måneden på dagligvarer. Forskellen skyldes blandt andet, at familier ikke altid bruger samme
          definition af et madbudget.
        </p>
        <p>
          Nogle tæller kun mad og drikke med, mens andre også medregner rengøring, toiletpapir, bleer og personlig pleje. Danmarks Statistiks tal er desuden et årsgennemsnit,
          så dyre højtider og billige ferieuger udligner hinanden.
        </p>
        <p>Sammenlign derfor først jeres forbrug med en husstand, der ligner jeres. Tjek derefter, hvilke varer og udgifter I faktisk har taget med.</p>
      </section>
      <section>
        <h2>Supermarkedsvalget kan flytte budgettet mærkbart</h2>
        <p>
          Vores analyse sammenlignede den samme ugentlige kurv med 23 varer hos Lidl, Rema 1000, Netto, 365discount, Meny, Bilka, Kvickly, Super Brugsen, Føtex, Brugsen,
          Nemlig.com, Spar og Min Købmand. Kurven kostede 782,70 kr. hos Lidl og 1.313,94 kr. hos Min Købmand, en prisforskel på 40,4 pct.
        </p>
        <p>
          Forskellen var 531,24 kr. om ugen, svarende til op til <a href={MAD_REPORT_HREF}>27.624 kr.</a> om året. Hvis hver vare købes dér, hvor den er billigst, kostede kurven 599,81
          kr. om ugen, svarende til op til <a href={MAD_REPORT_HREF}>37.135 kr.</a> om året sammenlignet med den dyreste kurv.
        </p>
        <p>
          Den billigste samlede kurv svarer til ca. 3.392 kr. om måneden, mens den dyreste svarer til ca. 5.694 kr. Beregningen gælder én bestemt kurv til{' '}
          <A href="/madbudget-familie-paa-4">2 voksne og 2 teenagere</A>, så den kan ikke sidestilles med Danmarks Statistiks helårstal.
        </p>
        <p>
          Læs mere om metoden og resultaterne i vores pristjek af <A href="/billigste-supermarked">det billigste supermarked</A>.
        </p>
      </section>
      <section>
        <h2>Sådan sætter I et realistisk madbudget</h2>
        <p>
          Start med jeres faktiske køb fra en almindelig måned. Sortér dem i mad og drikkevarer, andre dagligvarer samt takeaway og restaurantbesøg, så I ved, hvad budgettet
          skal dække.
        </p>
        <p>
          Se derefter på de indkøb, der ofte vælter planen, for eksempel små ekstrature, impulskøb og mad, der ender som spild.{' '}
          <A href="/mad-for-3000-om-maaneden">Sæt et beløb, der kræver omtanke</A>, men stadig passer til jeres appetit, tid og hverdag.
        </p>
        <p>
          Brug tallene på denne side som pejlemærke for jeres husstand. Følg løbende op, og justér budgettet, hvis det konsekvent er for stramt eller for højt.
        </p>
      </section>
      {/* The two sections below are the old /beregn-dit-madbudget's own, merged in word for word. */}
      <section>
        <h2>Hvad afhænger et realistisk madbudget af?</h2>
        <p>
          Et realistisk madbudget afhænger først og fremmest af husstandens størrelse. Børnenes alder, appetit, madpakker, specialkost, økologi og hvor ofte I spiser hjemme,
          har også stor betydning.
        </p>
        <p>
          Ifølge Danmarks Statistik bruger enlige med børn cirka 3.214 kr. om måneden, mens 2 voksne under 60 uden børn bruger cirka 3.478 kr. Tallene omfatter alle
          fødevarer og ikke-alkoholiske drikkevarer gennem hele året.
        </p>
        <p>
          Statistikken kan derfor ikke sammenlignes direkte med vores testkurv, som dækker én uges 23 varer til 2 voksne og 2 teenagere. Brug tallene som et pejlemærke,
          ikke som en facitliste.
        </p>
        <GuideFigure
          tone="lavender"
          caption="Eksempel: en sammenligning af månedsforbrug og en mulig besparelse. Illustration, ikke et skærmbillede fra appen."
        >
          <MadbudgetSammenligningMockup />
        </GuideFigure>
      </section>
      <section>
        <h2>Fra estimat til faktisk besparelse</h2>
        <p>
          Den mulige besparelse opstår ikke automatisk. Den kræver, at I planlægger måltider og indkøb efter de varer, der er billige den pågældende uge.
        </p>
        <p>
          I vores analyse kostede hele kurven 782,70 kr. hos Lidl og 1.313,94 kr. hos Min Købmand. Det svarer til cirka 3.392 kr. og 5.694 kr. om måneden. Forskellen var
          531,24 kr. om ugen, op til <a href={MAD_REPORT_HREF}>27.624 kr.</a> om året.
        </p>
        <p>
          Hvis hver vare købes dér, hvor den er billigst, kostede kurven 599,81 kr. om ugen. Det giver op til <a href={MAD_REPORT_HREF}>37.135 kr.</a> om året sammenlignet med den
          dyreste samlede kurv, men kan kræve indkøb flere steder. Se, hvordan I kan lave en <A href="/madplan-efter-tilbud">madplan efter tilbud</A>, og læs vores
          sammenligning af det <A href="/billigste-supermarked">billigste supermarked</A>.
        </p>
      </section>
      <section>
        <h2>Sådan holder I madbudgettet i hverdagen</h2>
        <p>
          Lav madplanen med udgangspunkt i det, I allerede har, og de råvarer der er på tilbud. Planlæg gerne retter, som deler ingredienser, så hele pakken bliver brugt.
        </p>
        <p>
          Skriv en indkøbsliste og vælg butik, før I tager hjemmefra. Sammenlign den samlede kurv, fordi enkelte gode tilbud ikke nødvendigvis gør hele indkøbet billigst.
        </p>
        <p>
          Få en enkel metode til at forbinde tilbud og aftensmad i vores guide til <A href="/madplan-efter-tilbud">madplan efter tilbud</A>. Et budget er lettest at holde,
          når planen passer til familiens smag og den tid, I faktisk har.
        </p>
      </section>
      <section>
        <h2>Hvad kan Altid Mad hjælpe med?</h2>
        <p>
          Altid Mad læser tilbudsaviserne, bygger en madplan efter familiens smag og finder ugens dagligvarer til de bedste priser. Målet er at gøre det lettere at planlægge både måltider og indkøb uden selv at gennemgå alle tilbud.
        </p>
        <p>
          Altid Mad er en del af Altid Hjem-appen, som samler hjemmets faste udgifter med ét overblik og ét login. Appen er gratis i App Store og Google Play. Teamet står også bag Altid Energi, Danmarks første gebyrfrie energiselskab.
        </p>
        <GuideStores />
      </section>
    </Guide>
  )
}
