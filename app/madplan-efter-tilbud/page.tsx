import type { Metadata } from 'next'
import MadplanMockup from '@/components/mad/MadplanMockup'
import { MAD_GUIDE_CTA, MAD_IN_APP, MAD_REPORT_HREF, MAD_REPORT_LABEL } from '@/components/mad/madGuide'
import Guide, { GuideFigure, GuideLink as A, GuideStores, type GuideFaq } from '@/components/site/Guide'

export const metadata: Metadata = {
  title: 'Madplan efter tilbud, spar på ugens mad | Altid Hjem',
  description: 'Lav en madplan efter ugens tilbud, undgå dyre impulskøb og få en enkel metode til billigere hverdagsmad. Se guiden.',
  alternates: { canonical: 'https://www.altidhjem.dk/madplan-efter-tilbud' },
  openGraph: {
    title: 'Sådan laver du en madplan efter ugens tilbud',
    description: 'Lav en madplan efter ugens tilbud, undgå dyre impulskøb og få en enkel metode til billigere hverdagsmad. Se guiden.',
    url: 'https://www.altidhjem.dk/madplan-efter-tilbud',
    type: 'article',
  },
}

// FAQ bruges to steder: synligt på siden og som FAQPage-schema (rich results).
const FAQ: GuideFaq[] = [
  {
    q: 'Hvordan laver jeg en madplan efter tilbud?',
    a: [
      'Gennemgå ugens tilbud først, vælg 3-4 realistiske retter, og skriv derefter indkøbslisten.',
      'Brug varer fra fryser og skabe som supplement, så I både reducerer indkøbet og undgår madspild.',
    ],
  },
  {
    q: 'Hvor meget sparer en madplan?',
    a: [
      'Besparelsen afhænger af jeres nuværende vaner, butikker og valg af varer.',
      'I Altid Mads analyse var forskellen på den samme kurv op til 27.624 kr. om året, mens besparelsen var op til 37.135 kr. om året, hvis hver vare købes dér, hvor den er billigst, sammenlignet med den dyreste kurv.',
    ],
  },
  {
    q: 'Hvilken dag skal jeg lægge madplanen?',
    a: [
      'Søndag er praktisk for mange familier, fordi I kan planlægge den kommende uge samlet.',
      'Den bedste dag er dog den, hvor de relevante tilbudsaviser er tilgængelige, og hvor du kan se familiens kalender.',
    ],
  },
  {
    q: 'Skal jeg handle i flere butikker?',
    a: [
      'Nej, ikke nødvendigvis.',
      'Vælg flere butikker, når besparelsen er tydelig og passer ind i jeres rute, men hold jer til én butik, hvis ekstra transport, tid eller impulskøb æder gevinsten.',
    ],
  },
  {
    q: 'Hvad gør jeg med resten af ugens tilbud?',
    a: [
      'Ignorér de tilbud, der ikke passer til planen eller familiens behov.',
      'Gem kun holdbare varer eller frysevarer til senere, når prisen er god, varen faktisk bliver brugt, og der er plads derhjemme.',
    ],
  },
  {
    q: 'Kan Altid Mad gøre det for mig?',
    a: ['Altid Mad læser tilbudsaviserne, bygger en madplan efter familiens smag og finder ugens dagligvarer til de bedste priser.', MAD_IN_APP],
  },
]

export default function MadplanEfterTilbud() {
  return (
    <Guide
      title="Sådan laver du en madplan efter ugens tilbud"
      lead={
        <>
          <p>
            En madplan efter tilbud er en af de hverdagsvaner, der kan flytte mest i familiens madbudget. Metoden er enkel: Se tilbuddene, vælg retterne, og skriv derefter
            indkøbslisten.
          </p>
          <p>
            Det kræver lidt forberedelse, men du kan gøre det selv allerede i denne uge. Her får du en konkret metode til en billig madplan, som også tager højde for familiens
            smag, tid og appetit.
          </p>
        </>
      }
      meta={
        <>
          Kilde: <a href={MAD_REPORT_HREF}>{MAD_REPORT_LABEL}</a>
        </>
      }
      answer={{ label: 'Hver vare købt billigst', value: '599,81', unit: 'kr. om ugen', note: 'Det svarer til op til 37.135 kr. om året sammenlignet med den dyreste samlede kurv.' }}
      factors={{ label: 'Besparelsen afhænger af', items: ['Jeres nuværende vaner', 'Butikker', 'Valg af varer'] }}
      faq={FAQ}
      cta={MAD_GUIDE_CTA}
      page={{ path: '/madplan-efter-tilbud', description: metadata.description as string, published: '2026-07-26', updated: '2026-11-16' }}
      sources={{
        checked: '2026-11-16',
        items: [
          { publisher: 'Altid Mad', title: MAD_REPORT_LABEL, href: `https://www.altidhjem.dk${MAD_REPORT_HREF}`, note: 'Den samme ugekurv med 23 varer til 2 voksne og 2 teenagere hos 13 kæder. Genereret 21. september 2026' },
        ],
      }}
      related={['/billigste-supermarked', '/madpakker-paa-budget', '/jul-paa-budget']}
    >
      <section>
        <h2>Begynd med tilbuddene, ikke med retterne</h2>
        <p>
          Hvis I vælger ugens retter først, risikerer I at købe råvarerne, når de er dyrest. Vend derfor rækkefølgen om: tilbud, madplan og til sidst indkøbsliste.
        </p>
        <p>
          Se især efter tilbud på de varer, der kan danne grundlag for et måltid. Det kan være kød, fisk, grøntsager, bælgfrugter eller andre råvarer, som familien faktisk
          kan lide.
        </p>
        <p>
          Byg derefter retterne op omkring disse varer, og brug det, I allerede har i fryseren og skabene. På den måde styrer tilbuddene indkøbet, uden at de får lov til at
          bestemme hele menuen.
        </p>
      </section>
      <section>
        <h2>Sådan laver du madplanen i praksis</h2>
        <p>
          Sæt tid af søndag til at gennemgå tilbudsaviserne. Vælg 3-4 retter med råvarer på tilbud, og lad resten af ugens måltider tage udgangspunkt i billige basisvarer
          og rester.
        </p>
        <p>
          Kontrollér køleskab, fryser og skabe, før du skriver indkøbslisten. Notér også, hvilke aftener der skal være hurtige, så planen passer til jeres virkelige uge.
        </p>
        <p>
          Mange tjenester viser kun tilbud fra én kæde. Men de bedste priser skifter mellem Lidl, Rema 1000, Netto, 365discount, Meny, Bilka, Kvickly, Super Brugsen,
          Føtex, Brugsen, Nemlig.com, Spar og Min Købmand fra uge til uge, så sammenligning kan gøre en reel forskel.
        </p>
        <p>
          Vil du arbejde mere systematisk med økonomien, kan du også bruge vores guide til <A href="/madbudget">madbudgettet</A> eller læse om et passende{' '}
          <A href="/madbudget-familie-paa-4">madbudget for en familie på 4</A>.
        </p>
      </section>
      <section>
        <h2>Hvad kan det betyde i kroner?</h2>
        <p>
          Altid Mads analyse sammenlignede den samme ugentlige kurv med 23 varer hos 13 kæder. Kurven kostede 782,70 kr. hos Lidl og 1.313,94 kr. hos Min Købmand, en
          prisforskel på 40,4 pct.
        </p>
        <p>
          Forskellen var 531,24 kr. om ugen, svarende til op til <a href={MAD_REPORT_HREF}>27.624 kr.</a> om året. Kurven var beregnet til en husstand med 2 voksne og 2
          teenagere.
        </p>
        <p>
          Hvis hver vare købes dér, hvor den er billigst, kostede kurven 599,81 kr. om ugen. Det svarer til op til <a href={MAD_REPORT_HREF}>37.135 kr.</a> om året
          sammenlignet med den dyreste samlede kurv, men kræver, at besparelsen er større end besværet og transporten.
        </p>
        <p>
          Tallene viser en mulig ramme, ikke et løfte om familiens besparelse. Se hele sammenligningen i vores guide til{' '}
          <A href="/billigste-supermarked">det billigste supermarked</A>.
        </p>
      </section>
      <section>
        <h2>Undgå de typiske faldgruber</h2>
        <p>
          Et tilbud er kun billigt, hvis I får varen brugt. Køb derfor ikke ekstra alene på grund af en gul mærkat, medmindre varen indgår i madplanen eller kan gemmes uden
          at skabe madspild.
        </p>
        <p>
          En for ambitiøs plan kan også blive dyr. Hvis alle retter kræver lang tilberedning, ender råvarerne lettere ubrugt på travle dage, så læg plads ind til rester og
          enkle måltider.
        </p>
        <p>
          Vær desuden forsigtig med at køre langt efter små besparelser. Flere butikker kan være fornuftigt, når prisforskellen er tydelig, men tid, transport og risikoen
          for impulskøb skal regnes med.
        </p>
      </section>
      <section>
        <h2>Lad Altid Mad gøre arbejdet</h2>
        <p>
          Altid Mad læser tilbudsaviserne, bygger en madplan efter familiens smag og finder ugens dagligvarer til de bedste priser. Det samler det arbejde, du ellers skal
          gøre på tværs af tilbud, retter og indkøbslister.
        </p>
        <p>
          Du bestemmer stadig, hvad der passer til familien. Altid Mad gør det lettere at vælge realistiske måltider og gennemskue, hvor varerne er billigst den
          pågældende uge.
        </p>
        <p>
          Appen er en del af Altid Hjem, som samler hjemmets faste udgifter med ét overblik og ét login. Teamet står også bag Altid Energi, Danmarks første gebyrfrie
          energiselskab.
        </p>
        <p>Altid Mad er en del af Altid Hjem-appen, som du kan hente gratis i App Store og Google Play.</p>
        <GuideFigure tone="lavender" caption="Eksempel: Altid Mad læser tilbudsaviserne og bygger ugens madplan, før du handler. Illustration, ikke et skærmbillede fra appen.">
          <MadplanMockup />
        </GuideFigure>
        <GuideStores />
      </section>
    </Guide>
  )
}
