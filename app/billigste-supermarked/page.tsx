import type { Metadata } from 'next'
import PristjekMockup from '@/components/mad/PristjekMockup'
import { MAD_GUIDE_CTA, MAD_REPORT_HREF, MAD_REPORT_LABEL } from '@/components/mad/madGuide'
import Guide, { GuideFigure, GuideLink as A, GuideStores, type GuideFaq } from '@/components/site/Guide'
import { GUIDES } from '@/lib/guides'

export const metadata: Metadata = {
  title: 'Billigste supermarked 2026, se pristjek | Altid Hjem',
  description:
    'Se hvilket supermarked der var billigst i vores pristjek, hvad en familie kan spare, og hvordan du selv handler billigere. Læs analysen hos Altid Mad.',
  alternates: { canonical: 'https://www.altidhjem.dk/billigste-supermarked' },
  openGraph: {
    title: 'Hvilket supermarked er billigst?',
    description:
      'Se hvilket supermarked der var billigst i vores pristjek, hvad en familie kan spare, og hvordan du selv handler billigere. Læs analysen hos Altid Mad.',
    url: 'https://www.altidhjem.dk/billigste-supermarked',
    type: 'article',
  },
}

// FAQ bruges to steder: synligt på siden og som FAQPage-schema (rich results).
const FAQ: GuideFaq[] = [
  {
    q: 'Hvilket supermarked er billigst i Danmark?',
    a: [
      'Lidl var billigst for hele varekurven i vores Q3-analyse.',
      'Resultatet er et øjebliksbillede, fordi priser, tilbud og familiers indkøb varierer.',
    ],
  },
  {
    q: 'Er discountbutikker altid billigst?',
    a: [
      'Nej, discountbutikker er ikke nødvendigvis billigst på alle varer.',
      'Sammenlign den samlede pris på de varer, I faktisk køber, frem for kun at se på enkelte tilbud.',
    ],
  },
  {
    q: 'Er Nemlig.com billigere end supermarkederne?',
    a: [
      'Nemlig.com var ikke billigst på den samlede varekurv i vores analyse.',
      'Pristjekket viser, at onlinehandel ikke automatisk er billigere, men levering og tidsbesparelse kan også have værdi for familien.',
    ],
  },
  {
    q: 'Hvor meget kan en familie spare?',
    a: [
      'Forskellen mellem den billigste og dyreste samlede kurv var op til 27.624 kr. om året.',
      'Besparelsen kan nå op til 37.135 kr. om året, hvis hver vare købes dér, hvor den er billigst.',
    ],
  },
  {
    q: 'Hvordan er analysen lavet?',
    a: [
      'Vi sammenlignede den samme kurv med 23 varer hos 13 kæder i en enkelt uge.',
      'Varekurven tager udgangspunkt i en husstand med 2 voksne og 2 teenagere, og hele metoden findes i Q3-rapporten.',
    ],
  },
  {
    q: 'Skal jeg handle i flere butikker for at spare?',
    a: [
      'Nej, du kan ofte spare ved at vælge en billig hovedbutik og planlægge efter relevante tilbud.',
      'En ekstra butik giver bedst mening, når besparelsen opvejer den ekstra tid og transport.',
    ],
  },
]

export default function BilligsteSupermarked() {
  return (
    <Guide
      title={GUIDES['/billigste-supermarked'].title}
      lead={
        <>
          <p>Lidl var det billigste supermarked for hele varekurven i vores Q3-analyse. Kurven kostede 782,70 kr. hos Lidl og 1.313,94 kr. hos Min Købmand.</p>
          <p>
            Det betyder ikke, at Lidl er billigst på alle varer eller i alle uger. Det bedste valg afhænger også af jeres faste indkøb, ugens tilbud og hvor mange
            butikker I vil besøge.
          </p>
        </>
      }
      meta={
        <>
          Baseret på <a href={MAD_REPORT_HREF}>Altid Mads Q3-analyse</a> · Opdateres kvartalsvist
        </>
      }
      answer={{ label: 'Billigste kurv i pristjekket', value: '782,70', unit: 'kr. hos Lidl', note: 'Den samme kurv med 23 varer kostede 1.313,94 kr. hos Min Købmand.' }}
      factors={{ label: 'Det bedste valg afhænger af', items: ['Jeres faste indkøb', 'Ugens tilbud', 'Hvor mange butikker I vil besøge'] }}
      faq={FAQ}
      cta={MAD_GUIDE_CTA}
      page={{ path: '/billigste-supermarked', description: metadata.description as string, published: GUIDES['/billigste-supermarked'].published, updated: GUIDES['/billigste-supermarked'].updated }}
      sources={{
        checked: '2026-11-16',
        items: [
          { publisher: 'Altid Mad', title: MAD_REPORT_LABEL, href: `https://www.altidhjem.dk${MAD_REPORT_HREF}`, note: 'Den samme ugekurv med 23 varer til 2 voksne og 2 teenagere hos 13 kæder. Genereret 21. september 2026' },
        ],
      }}
      related={['/spar-penge-paa-dagligvarer', '/graensehandel-beregner', '/mad-for-3000-om-maaneden']}
    >
      <section>
        <h2>Lidl var billigst i vores pristjek</h2>
        <p>
          Vi sammenlignede den samme ugentlige kurv med 23 varer hos 13 kæder: Lidl, Rema 1000, Netto, 365discount, Meny, Bilka, Kvickly, Super Brugsen, Føtex, Brugsen,
          Nemlig.com, Spar og Min Købmand.
        </p>
        <p>Lidl havde den billigste samlede kurv til 782,70 kr., mens Min Købmand var dyrest til 1.313,94 kr. Prisforskellen på præcis de samme varer var 40,4 pct.</p>
        <p>
          Forskellen svarer til 531,24 kr. om ugen og op til <a href={MAD_REPORT_HREF}>27.624 kr.</a> om året. For en familie kan valget af supermarked derfor have mærkbar
          betydning for husholdningsbudgettet.
        </p>
      </section>
      <section>
        <h2>Den billigste kæde er ikke hele svaret</h2>
        <p>
          En kæde kan have den billigste samlede kurv uden at være billigst på hver enkelt vare. Nogle basisvarer er billigst ét sted, mens ugens tilbud gør andre varer
          billigere hos en anden kæde.
        </p>
        <p>
          Hvis hver vare købes dér, hvor den er billigst, falder kurvens pris til 599,81 kr. om ugen. Sammenlignet med den dyreste samlede kurv giver det en besparelse på op
          til <a href={MAD_REPORT_HREF}>37.135 kr.</a> om året.
        </p>
        <p>
          Det er dog sjældent praktisk at besøge alle kæder. Den reelle besparelse skal altid vejes op mod transport, tid og risikoen for ekstra impulskøb.
        </p>
      </section>
      <section>
        <h2>Sådan har vi lavet analysen</h2>
        <p>
          Analysen tager udgangspunkt i den samme ugentlige kurv med 23 varer hos Lidl, Rema 1000, Netto, 365discount, Meny, Bilka, Kvickly, Super Brugsen, Føtex, Brugsen,
          Nemlig.com, Spar og Min Købmand. Kurven er baseret på en husstand med 2 voksne og 2 teenagere.
        </p>
        <p>
          Pristjekket er et øjebliksbillede fra en enkelt uge i vores Q3-analyse. Du kan læse den samlede metode og se varegrundlaget i{' '}
          <a href={MAD_REPORT_HREF}>Q3-rapporten</a>.
        </p>
        <p>
          Analysen viser ikke, at én kæde altid er billigst. Priser og tilbud skifter fra uge til uge, og jeres egen varekurv kan give et andet resultat.
        </p>
      </section>
      <section>
        <h2>Find de billigste varer uden at køre rundt</h2>
        <p>
          Start med at skelne mellem faste varer og tilbudsvarer. Køb basisvarer dér, hvor jeres samlede standardkurv typisk er billigst, og brug tilbudsaviserne til de
          varer, der fylder mest i budgettet.
        </p>
        <p>
          Lav madplanen, før I vælger tilbud. Så undgår I at købe en billig vare, som ikke passer ind i ugens måltider eller ender med at blive smidt ud.
        </p>
        <p>
          Vælg kun en ekstra butik, når besparelsen er tydelig og passer naturligt ind i jeres uge. Se også vores guide til{' '}
          <A href="/madpakker-paa-budget">madpakker på budget</A>.
        </p>
      </section>
      <section>
        <h2>Sådan hjælper Altid Mad</h2>
        <p>
          Altid Mad læser tilbudsaviserne, bygger en madplan efter familiens smag og finder ugens dagligvarer til de bedste priser. Målet er at gøre det lettere at bruge pristjek og tilbud i hverdagen uden selv at gennemgå hver enkelt tilbudsavis.
        </p>
        <p>
          Altid Mad er en del af Altid Hjem-appen, som samler hjemmets faste udgifter med ét overblik og ét login. Appen er gratis i App Store og Google Play. Teamet står også bag Altid Energi, Danmarks første gebyrfrie energiselskab.
        </p>
        <GuideFigure tone="lavender" caption="Eksempel: Altid Mad sammenligner ugens kurv på tværs af kæderne og viser, hvor familien sparer mest. Illustration, ikke et skærmbillede fra appen.">
          <PristjekMockup />
        </GuideFigure>
        <GuideStores />
      </section>
    </Guide>
  )
}
