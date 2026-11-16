import type { Metadata } from 'next'
import MadbudgetBenchmark from '@/components/mad/MadbudgetBenchmark'
import { MAD_GUIDE_CTA, MAD_REPORT_HREF, MAD_REPORT_LABEL } from '@/components/mad/madGuide'
import Guide, { GuideFigure, GuideLink as A, GuideStores, type GuideFaq } from '@/components/site/Guide'
import { GUIDES } from '@/lib/guides'

// Moved from altidmad.dk/madbudget-familie-paa-4 (16 Nov 2026) with the text word for word.
export const metadata: Metadata = {
  title: 'Madbudget for familie på 4: Hvad er normalt? | Altid Hjem',
  description:
    'Se, hvad et normalt madbudget for en familie på 4 er, hvorfor det varierer, og hvordan I får pengene til at række længere. Få konkrete råd.',
  alternates: { canonical: 'https://www.altidhjem.dk/madbudget-familie-paa-4' },
  openGraph: {
    title: 'Hvad koster mad til en familie på 4?',
    description:
      'Se, hvad et normalt madbudget for en familie på 4 er, hvorfor det varierer, og hvordan I får pengene til at række længere. Få konkrete råd.',
    url: 'https://www.altidhjem.dk/madbudget-familie-paa-4',
    type: 'article',
  },
}

// FAQ bruges to steder: synligt på siden og som FAQPage-schema (rich results).
const FAQ: GuideFaq[] = [
  {
    q: 'Hvad er et normalt madbudget for en familie på 4?',
    a: [
      'Et relevant pejlemærke er cirka 5.481 kr. om måneden.',
      'Det bygger på Forbrugsundersøgelsen 2024 fra Danmarks Statistik, hvor 2 voksne med børn bruger 65.775 kr. om året på fødevarer og ikke-alkoholiske drikkevarer.',
    ],
  },
  {
    q: 'Er 4.000 kr. om måneden realistisk for 4 personer?',
    a: [
      'Ja, 4.000 kr. om måneden kan være realistisk for en familie på 4.',
      'Det kræver typisk planlagte indkøb, begrænsede impulskøb og retter, der bruger de samme råvarer på tværs af ugen.',
    ],
  },
  {
    q: 'Hvorfor bruger vi meget mere end DST-gennemsnittet?',
    a: [
      'I kan bruge mere på grund af børnenes alder, specialkost, økologi, madpakker eller forskellige måder at opgøre budgettet på.',
      'Danmarks Statistiks tal er et gennemsnit og ikke en grænse for, hvad en familie bør bruge.',
    ],
  },
  {
    q: 'Hvor meget betyder supermarkedsvalget?',
    a: [
      'Supermarkedsvalget kan betyde op til 27.624 kr. om året i vores analyse.',
      'Den samme kurv med 23 varer kostede 782,70 kr. hos Lidl og 1.313,94 kr. hos Min Købmand, en forskel på 40,4 pct.',
    ],
  },
  {
    q: 'Betyder børnenes alder noget?',
    a: [
      'Ja, børnenes alder kan have stor betydning for madbudgettet.',
      'Teenagere spiser ofte omtrent som voksne, så en husstand med 2 voksne og 2 teenagere vil typisk have andre behov end en familie med små børn.',
    ],
  },
  {
    q: 'Hvordan sætter vi et budget, der holder?',
    a: [
      'Tag udgangspunkt i jeres faktiske køb, og vælg derefter et realistisk beløb med plads til travle dage.',
      'Følg løbende op på hovedindkøb, suppleringskøb og madspild, så I justerer vanerne frem for kun at sænke beløbet.',
    ],
  },
]

export default function MadbudgetFamiliePaa4() {
  return (
    <Guide
      title={GUIDES['/madbudget-familie-paa-4'].title}
      lead={
        <>
          <p>
            Danmarks Statistik viser, at 2 voksne med børn i gennemsnit bruger 65.775 kr. om året, svarende til cirka 5.481 kr. om måneden, på fødevarer og
            ikke-alkoholiske drikkevarer. I forældrefora fortæller familier typisk om madbudgetter på 4.000-7.000 kr. om måneden, så begge niveauer kan være helt normale.
          </p>
          <p>
            Det rigtige madbudget afhænger blandt andet af børnenes alder, familiens appetit, madpakker og valg af supermarked. Teenagere spiser ofte omtrent som voksne, og
            derfor kan en familie med større børn ligge højere end en familie med små børn.
          </p>
          <p>Her får I konkrete sammenligningstal og en enkel metode til at finde et budget, der passer til netop jeres familie.</p>
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
        label: '2 voksne med børn',
        value: '5.481',
        unit: 'kr. om måneden',
        note: 'I forældrefora fortæller familier typisk om madbudgetter på 4.000-7.000 kr. om måneden.',
      }}
      factors={{ label: 'Det påvirker budgettet', items: ['Børnenes alder', 'Familiens appetit', 'Madpakker', 'Valg af supermarked'] }}
      faq={FAQ}
      cta={MAD_GUIDE_CTA}
      page={{ path: '/madbudget-familie-paa-4', description: metadata.description as string, published: GUIDES['/madbudget-familie-paa-4'].published, updated: GUIDES['/madbudget-familie-paa-4'].updated }}
      sources={{
        checked: '2026-11-16',
        items: [
          { publisher: 'Danmarks Statistik', title: 'Forbrugsundersøgelsen, tabel FU13: Forbrug efter husstand', href: 'https://www.statistikbanken.dk/FU13', note: 'Fødevarer og ikke-alkoholiske drikkevarer, løbende priser, 2024. Månedsbeløb er egne beregninger på baggrund af data fra Danmarks Statistik (årsbeløb delt med 12)' },
          { publisher: 'Altid Mad', title: MAD_REPORT_LABEL, href: `https://www.altidhjem.dk${MAD_REPORT_HREF}`, note: 'Den samme ugekurv med 23 varer til 2 voksne og 2 teenagere hos 13 kæder. Genereret 21. september 2026. Månedsbeløb og de 67,9 pct. er egne beregninger på baggrund af rapportens ugepriser' },
        ],
      }}
      related={['/madbudget', '/mad-for-3000-om-maaneden', '/madpakker-paa-budget']}
    >
      <section>
        <h2>Hvad er et normalt madbudget for 4 personer?</h2>
        <p>
          Forbrugsundersøgelsen 2024 fra Danmarks Statistik viser et årligt forbrug på 65.775 kr. for 2 voksne med børn. Det svarer til cirka 5.481 kr. om måneden og omfatter
          alle fødevarer og ikke-alkoholiske drikkevarer gennem hele året.
        </p>
        <p>
          Til sammenligning bruger en gennemsnitshusstand 41.851 kr. om året, svarende til cirka 3.488 kr. om måneden. Enlige med børn ligger på 38.564 kr. om året, cirka
          3.214 kr. om måneden, mens 2 voksne under 60 uden børn ligger på 41.730 kr., cirka 3.478 kr. om måneden.
        </p>
        <p>
          Tallene er pejlemærker, ikke facitlister. Danmarks Statistik måler hele årets forbrug, og familier kan have meget forskellige vaner, behov og definitioner af, hvad
          der hører til madbudgettet.
        </p>
        <GuideFigure tone="lavender" kind="data" caption="Tal fra Danmarks Statistik, Forbrugsundersøgelsen 2024: børnefamilier har et af de højeste forbrug. Se, hvor I ligger.">
          <MadbudgetBenchmark highlight="par-boern" />
        </GuideFigure>
      </section>
      <section>
        <h2>Børnenes alder gør en mærkbar forskel</h2>
        <p>
          Små børn, skolebørn og teenagere har ikke samme behov. Teenagere spiser ofte som voksne, især når det gælder aftensmad, mellemmåltider og madpakker.
        </p>
        <p>
          Altid Mads kurvanalyse tager netop udgangspunkt i en husstand med 2 voksne og 2 teenagere. Den kan derfor være et mere relevant pejlemærke for familier med større
          børn end for familier med små børn.
        </p>
        <p>
          Andre forhold spiller også ind. Specialkost, økologi, måltider ude, mange madpakker og gæster kan alle gøre et højere budget både forståeligt og nødvendigt.
        </p>
      </section>
      <section>
        <h2>Samme madkurv kan koste 67,9 pct. mere</h2>
        <p>
          Vi sammenlignede den samme ugentlige kurv med 23 varer hos Lidl, Rema 1000, Netto, 365discount, Meny, Bilka, Kvickly, Super Brugsen, Føtex, Brugsen, Nemlig.com,
          Spar og Min Købmand. Hele kurven kostede 782,70 kr. hos Lidl og 1.313,94 kr. hos Min Købmand.
        </p>
        <p>
          Forskellen var 531,24 kr. om ugen, svarende til op til <a href={MAD_REPORT_HREF}>27.624 kr.</a> om året. Omregnet svarer kurvene til cirka 3.392 kr. og 5.694 kr. om måneden.
        </p>
        <p>
          Hvis hver vare købes dér, hvor den er billigst, koster kurven 599,81 kr. om ugen. Det giver en forskel på op til <a href={MAD_REPORT_HREF}>37.135 kr.</a> om året sammenlignet
          med den dyreste samlede kurv, men kræver indkøb på tværs af butikker.
        </p>
        <p>
          Kurvanalysen kan ikke sammenlignes direkte med Danmarks Statistiks tal. Den dækker én bestemt uges kurv for 2 voksne og 2 teenagere, mens Forbrugsundersøgelsen
          2024 omfatter alle årets køb af fødevarer og ikke-alkoholiske drikkevarer.
        </p>
      </section>
      <section>
        <h2>Sådan finder I familiens eget madbudget</h2>
        <p>
          Start med jeres faktiske forbrug frem for et ønsketal. Saml køb af mad, drikkevarer, madpakker og små suppleringskøb, så I kan se, hvor pengene reelt går hen.
        </p>
        <p>
          Skeln derefter mellem nødvendige køb og de køb, der opstår uden plan. Vores <A href="/madbudget">guide til madbudgettet</A> kan hjælpe jer med at finde et
          realistisk niveau ud fra jeres egen hverdag.
        </p>
        <p>
          Vælg et budget, der giver plads til travle dage og familiens præferencer. Et budget holder bedre, når det bygger på vaner, I faktisk kan leve med, end når det
          kræver, at alle indkøb bliver perfekte.
        </p>
      </section>
      <section>
        <h2>Vanerne, der ofte flytter mest</h2>
        <p>
          Vælg en fast hovedbutik ud fra priserne på de varer, I køber ofte. Se vores sammenligning af <A href="/billigste-supermarked">det billigste supermarked</A>, men
          husk også transporttid og risikoen for ekstra impulskøb.
        </p>
        <p>
          Lav en <A href="/madplan-efter-tilbud">madplan efter tilbud</A>, og planlæg retter med ingredienser, der kan bruges flere gange. Det reducerer både dyre nødkøb og
          madspild.
        </p>
        <p>
          Madpakker er også et oplagt sted at skabe ro i budgettet. Faste valg og genbrug af ingredienser fra aftensmaden gør det lettere at købe målrettet.
        </p>
      </section>
      <section>
        <h2>Sådan kan Altid Mad hjælpe</h2>
        <p>
          Altid Mad læser tilbudsaviser, bygger en madplan efter familiens smag og finder ugens dagligvarer til de bedste priser.
        </p>
        <p>
          Målet er at gøre prisbevidste valg lettere uden at sende familien rundt efter hvert enkelt tilbud. Altid Mad er en del af Altid Hjem-appen, som samler hjemmets faste udgifter med ét overblik og ét login. Appen er gratis i App Store og Google Play. Teamet står også bag Altid Energi, Danmarks første gebyrfrie energiselskab.
        </p>
        <GuideStores />
      </section>
    </Guide>
  )
}
