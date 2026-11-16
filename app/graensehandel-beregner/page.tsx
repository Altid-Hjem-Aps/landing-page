import type { Metadata } from 'next'
import GraensehandelCalculator from '@/components/mad/GraensehandelCalculator'
import { MAD_GUIDE_CTA, MAD_REPORT_HREF, MAD_REPORT_LABEL } from '@/components/mad/madGuide'
import Guide, { GuideFigure, GuideLink as A, GuideStores, type GuideFaq } from '@/components/site/Guide'

// Moved from altidmad.dk/graensehandel-beregner (16 Nov 2026): the article text is word for
// word, only the sign-up sentence from before the launch (no longer true) was rewritten to be true on altidhjem.dk.
export const metadata: Metadata = {
  title: 'Kan grænsehandel betale sig? | Altid Hjem',
  description:
    'Beregn, om grænsehandel kan betale sig. Se transportens pris og dit break-even, før I kører, og få et ærligt regnestykke fra Altid Mad.',
  alternates: { canonical: 'https://www.altidhjem.dk/graensehandel-beregner' },
  openGraph: {
    title: 'Kan grænsehandel betale sig?',
    description:
      'Beregn, om grænsehandel kan betale sig. Se transportens pris og dit break-even, før I kører, og få et ærligt regnestykke fra Altid Mad.',
    url: 'https://www.altidhjem.dk/graensehandel-beregner',
    type: 'article',
  },
}

// FAQ bruges to steder: synligt på siden og som FAQPage-schema (rich results).
const FAQ: GuideFaq[] = [
  {
    q: 'Kan grænsehandel betale sig?',
    a: [
      'Ja, hvis jeres reelle besparelse er større end udgiften til transporten og værdien af jeres tid.',
      'Brug beregneren med jeres egen afstand, bilens forbrug og den kurv, I faktisk vil købe.',
    ],
  },
  {
    q: 'Hvor langt kan man køre, før besparelsen er væk?',
    a: [
      'Det afhænger af bilens forbrug, brændstofprisen og besparelsen på varerne.',
      'Kører I 100 km tur-retur i en bil, der kører 15 km pr. liter, koster turen ca. 116 kr. i brændstof ved en pris på 17,39 kr. pr. liter.',
    ],
  },
  {
    q: 'Hvad er billigst i Tyskland?',
    a: [
      'Prisfordelen forbindes ofte med afgiftsvarer som slik, sodavand og øl.',
      'Sammenlign altid de konkrete mærker, mængder og tilbud, fordi grænsehandel ikke automatisk er billigst på alle dagligvarer.',
    ],
  },
  {
    q: 'Tæller tiden med?',
    a: ['Ja, hvis I vil kende turens reelle omkostning.', 'Sæt eventuelt en personlig værdi på køretiden og læg den oven i udgifterne til brændstof.'],
  },
  {
    q: 'Er der regler for, hvor meget man må tage med hjem?',
    a: [
      'Ja, der gælder regler og vejledende mængder for blandt andet alkohol og tobak, når varer medbringes til eget brug inden for EU.',
      'Tjek altid de aktuelle mængdegrænser hos Toldstyrelsen på toldst.dk før turen.',
    ],
  },
  {
    q: 'Kan vi spare det samme herhjemme?',
    a: [
      'Det kan være muligt, men det afhænger af jeres indkøb og de aktuelle tilbud.',
      'Sammenlign priser, planlæg måltiderne og brug eventuelt vores guide til et bedre madbudget før I beslutter jer for at køre.',
    ],
  },
]

export default function GraensehandelBeregner() {
  return (
    <Guide
      title="Kan grænsehandel betale sig?"
      lead={
        <>
          <p>
            Det afhænger af transporten og det, I lægger i kurven. En billig indkøbstur er kun billig, hvis besparelsen overstiger udgifterne til at komme frem og tilbage.
          </p>
          <p>
            Med vores grænsehandel-beregner kan du indtaste afstanden til grænsen, bilens forbrug, brændstofprisen og den besparelse, I forventer. Så får du transportprisen og
            jeres break-even, altså hvor meget I mindst skal spare, før turen betaler sig.
          </p>
          <p>
            Brændstofprisen er forudfyldt med Drivkraft Danmarks listepris for benzin den 6. november 2026 på 17,39 kr. pr. liter. Prisen kan redigeres, så beregningen passer til den
            pris, I faktisk betaler.
          </p>
        </>
      }
      meta={
        <>
          Kilde: <a href={MAD_REPORT_HREF}>{MAD_REPORT_LABEL}</a>
        </>
      }
      answer={{
        label: 'Brændstof til 100 km',
        value: 'ca. 116',
        unit: 'kr. for turen',
        note: 'I en bil, der kører 15 km pr. liter, med en literpris på 17,39 kr.',
      }}
      factors={{ label: 'Det afhænger af', items: ['Afstanden til grænsen', 'Bilens forbrug', 'Brændstofprisen', 'Den besparelse, I forventer'] }}
      faq={FAQ}
      cta={MAD_GUIDE_CTA}
      page={{ path: '/graensehandel-beregner', description: metadata.description as string, published: '2026-07-26', updated: '2026-11-16' }}
      sources={{
        checked: '2026-11-16',
        items: [
          { publisher: 'Drivkraft Danmark', title: 'Benzin (kr./liter)', href: 'https://www.drivkraftdanmark.dk/priser/benzin-95-oktan/', note: 'Listepris for benzin 95 oktan, 17,39 kr. pr. liter den 6. november 2026' },
          { publisher: 'Toldstyrelsen', title: 'Rejser inden for EU', href: 'https://toldst.dk/borger/rejser/rejser-inden-for-eu', note: 'Mængdegrænser for alkohol og tobak til eget brug fra et andet EU-land' },
          { publisher: 'Altid Mad', title: MAD_REPORT_LABEL, href: `https://www.altidhjem.dk${MAD_REPORT_HREF}`, note: 'Den samme ugekurv med 23 varer til 2 voksne og 2 teenagere hos 13 kæder. Genereret 21. september 2026' },
        ],
      }}
      related={['/billigste-supermarked', '/spar-penge-paa-dagligvarer', '/madbudget']}
    >
      {/* The calculator sat right under the intro on altidmad.dk, before the first heading. */}
      <GuideFigure tone="lavender" caption="Regn brændstof og break-even ud, før I kører mod grænsen. Intet gemmes.">
        <GraensehandelCalculator />
      </GuideFigure>
      <section>
        <h2>Sådan regner du grænsehandlen ud</h2>
        <p>
          Start med den samlede køreafstand frem og tilbage. Divider afstanden med bilens kilometer pr. liter, og gang derefter med brændstofprisen.
        </p>
        <p>Resultatet er turens brændstofudgift. Det er samtidig det beløb, I mindst skal spare på varerne, før køreturen går i nul.</p>
        <p>
          Vil du have det fulde regnestykke, bør du også overveje, hvad jeres tid er værd. Beregneren viser den konkrete transportudgift, mens I selv kan vurdere, om
          tidsforbruget gør turen attraktiv.
        </p>
      </section>
      <section>
        <h2>Hvad sparer man typisk på ved grænsehandel?</h2>
        <p>
          Grænsehandel forbindes især med afgiftsvarer som slik, sodavand og øl. Den faktiske besparelse afhænger dog af mærke, pakningsstørrelse, tilbud og den aktuelle pris
          i Danmark.
        </p>
        <p>
          Sammenlign derfor de varer, I reelt vil købe, i stedet for at vurdere turen ud fra enkelte lokkepriser. Skriv den forventede samlede besparelse i beregneren, så den
          bliver holdt op mod transportudgiften.
        </p>
      </section>
      <section>
        <h2>Det glemmer mange i regnestykket</h2>
        <p>
          Impulskøb kan hurtigt spise en forventet besparelse. Lav en indkøbsliste hjemmefra, sammenlign samme mængder og kvaliteter, og køb kun stort ind, hvis familien
          faktisk får varerne brugt inden holdbarhedsdatoen.
        </p>
        <p>
          Undersøg også emballage og pantsystem, hvis I køber drikkevarer. Det kan have betydning for, hvor og hvordan emballagen kan afleveres.
        </p>
        <p>
          Endelig kan danske tilbud mindske prisforskellen. Se, hvordan en <A href="/madplan-efter-tilbud">madplan efter tilbud</A> kan samle ugens måltider omkring de
          varer, der allerede er billige herhjemme.
        </p>
      </section>
      <section>
        <h2>Kan besparelsen hentes uden køreturen?</h2>
        <p>
          Ja, en del familier kan spare ved at sammenligne danske supermarkeder og planlægge indkøbene bedre. I Altid Mads analyse kostede den samme ugentlige kurv med 23 varer
          til 2 voksne og 2 teenagere 782,70 kr. hos Lidl og 1.313,94 kr. hos Min Købmand.
        </p>
        <p>
          Det er en forskel på 531,24 kr. om ugen, svarende til op til <a href={MAD_REPORT_HREF}>27.624 kr.</a> om året. Prisgabet på den samme kurv var 40,4 pct., uden at
          transport til grænsen skulle trækkes fra.
        </p>
        <p>
          Kurven blev også sammenlignet hos Netto, Bilka, Føtex, Nemlig.com og Min Købmand. Du kan læse mere om metoden på siden om{' '}
          <A href="/billigste-supermarked">det billigste supermarked</A>.
        </p>
      </section>
      <section>
        <h2>Sådan kan Altid Mad hjælpe</h2>
        <p>
          Altid Mad læser tilbudsaviserne, bygger en madplan efter familiens smag og finder ugens dagligvarer til de bedste priser.
        </p>
        <p>
          Altid Mad er en del af Altid Hjem-appen, som samler hjemmets faste udgifter med ét overblik og ét login. Appen er gratis i App Store og Google Play. Holdet står også bag Altid Energi, Danmarks første gebyrfrie energiselskab.
        </p>
        <GuideStores />
      </section>
    </Guide>
  )
}
