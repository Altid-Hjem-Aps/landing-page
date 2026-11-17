import type { Metadata } from 'next'
import { SITE_IMAGE } from '@/lib/site-image'
import MadpakkeMockup from '@/components/mad/MadpakkeMockup'
import { MAD_GUIDE_CTA, MAD_REPORT_HREF, MAD_REPORT_LABEL } from '@/components/mad/madGuide'
import Guide, { GuideFigure, GuideLink as A, GuideStores, type GuideFaq } from '@/components/site/Guide'
import { GUIDES } from '@/lib/guides'

// Moved from altidmad.dk/madpakker-paa-budget (16 Nov 2026): the article text is word for word,
// only the sign-up sentences from before the launch (no longer true) were rewritten to be true on altidhjem.dk.
export const metadata: Metadata = {
  title: 'Madpakker på budget til skolestart | Altid Hjem',
  description:
    'Få idéer til madpakker på budget, en enkel ugeplan og råd til billigere indkøb ved skolestart. Læs guiden, og kom godt i gang.',
  alternates: { canonical: 'https://www.altidhjem.dk/madpakker-paa-budget' },
  openGraph: {
    title: 'Madpakker på budget, som børnene har lyst til at spise',
    description:
      'Få idéer til madpakker på budget, en enkel ugeplan og råd til billigere indkøb ved skolestart. Læs guiden, og kom godt i gang.',
    url: 'https://www.altidhjem.dk/madpakker-paa-budget',
    type: 'article',
    images: [SITE_IMAGE],
  },
  twitter: { card: 'summary_large_image', images: [SITE_IMAGE] },
}

// FAQ bruges to steder: synligt på siden og som FAQPage-schema (rich results).
const FAQ: GuideFaq[] = [
  {
    q: 'Hvordan laver jeg billige madpakker, børnene faktisk spiser?',
    a: [
      'Tag udgangspunkt i billige basisvarer, som barnet allerede kan lide.',
      'Variér formen, og brug eksempelvis de samme råvarer i rugbrød, wraps, sandwich og små hapsere.',
    ],
  },
  {
    q: 'Hvad skal en god madpakke indeholde?',
    a: [
      'En god madpakke skal mætte og være nem for barnet at spise.',
      'Kombinér gerne brød, pasta eller kartofler med en proteinkilde samt frugt eller grønt, og tilpas mængden til barnets appetit.',
    ],
  },
  {
    q: 'Er det billigere at smøre madpakker end at købe?',
    a: [
      'Det er som regel billigere at smøre madpakken hjemme, især når I bruger basisvarer, tilbud og rester.',
      'Færdige måltider, enkeltportioner og snacks købt undervejs gør hurtigt madpakken dyrere.',
    ],
  },
  {
    q: 'Hvordan undgår jeg, at madpakken kommer retur?',
    a: [
      'Pak mad, barnet kender og kan spise uden besvær.',
      'Spørg, hvad der blev spist, justér portionsstørrelsen, og hold grønt og brød adskilt, hvis barnet ikke bryder sig om bløde madder.',
    ],
  },
  {
    q: 'Hvordan sparer jeg tid på madpakker om morgenen?',
    a: [
      'Forbered så meget som muligt aftenen før.',
      'Skær grønt, kog æg, fordel snacks og læg beholdere frem, så morgenen primært handler om at samle madpakken.',
    ],
  },
  {
    q: 'Kan Altid Mad hjælpe med madpakker?',
    a: [
      'Altid Mad laver ugens madplan og indkøbsliste efter tilbuddene, så madpakkerne kan planlægges sammen med aftensmaden.',
      // The old answer said "du": MAD_IN_APP in the du form.
      'Altid Mad er en del af Altid Hjem-appen, som du kan hente gratis i App Store og Google Play.',
    ],
  },
]

export default function MadpakkerPaaBudget() {
  return (
    <Guide
      title={GUIDES['/madpakker-paa-budget'].title}
      lead={
        <>
          <p>
            Når skolestart nærmer sig, vender madpakkerne tilbage som en fast del af hverdagen. Det er både et spørgsmål om at holde udgifterne nede og finde på noget, som
            faktisk bliver spist.
          </p>
          <p>
            Heldigvis behøver billige madpakker hverken være kedelige eller besværlige. Med få basisvarer, lidt planlægning og et blik på ugens tilbud kan I skabe variation
            uden at købe en masse særlige madpakkevarer.
          </p>
        </>
      }
      meta={
        <>
          Kilde: <a href={MAD_REPORT_HREF}>{MAD_REPORT_LABEL}</a>
        </>
      }
      answer={{
        label: 'Prisforskel på kurven',
        value: '27.624',
        unit: 'kr. om året',
        note: 'Op til så meget skiller Lidl og Min Købmand for samme ugekurv med 23 varer.',
      }}
      faq={FAQ}
      cta={MAD_GUIDE_CTA}
      page={{ path: '/madpakker-paa-budget', description: metadata.description as string, published: GUIDES['/madpakker-paa-budget'].published, updated: GUIDES['/madpakker-paa-budget'].updated }}
      sources={{
        checked: '2026-11-16',
        items: [
          { publisher: 'Altid Mad', title: MAD_REPORT_LABEL, href: `https://www.altidhjem.dk${MAD_REPORT_HREF}`, note: 'Den samme ugekurv med 23 varer til 2 voksne og 2 teenagere hos 13 kæder. Genereret 21. september 2026' },
        ],
      }}
      related={['/madplan-efter-tilbud', '/spar-penge-paa-dagligvarer', '/madbudget-familie-paa-4']}
    >
      <section>
        <h2>Madpakkehverdagen kræver mere, end man tror</h2>
        <p>
          Ét skolebarn skal typisk have 5 madpakker med om ugen. Når familien først står i køkkenet om morgenen, er der sjældent tid til at finde på noget eller opdage, at
          rugbrødet mangler.
        </p>
        <p>
          En enkel ugeplan gør det lettere at købe de rigtige mængder og bruge de samme råvarer på flere måder. Planlægning slår impulskøb, især når alternativet er dyre
          snacks eller hurtige løsninger på vej til skole.
        </p>
        <p>
          Vælg gerne nogle faste byggesten til ugen, eksempelvis brød, grønt, frugt, pålæg og en mættende rest fra aftensmaden. Så kan indholdet varieres, uden at
          indkøbslisten vokser unødigt.
        </p>
      </section>
      <section>
        <h2>8 billige madpakke-idéer til skolestart</h2>
        <p>
          Rugbrød med æg og agurk er enkelt, mættende og nemt at forberede. Rugbrød med hummus og revet gulerod giver en mild variant uden klassisk pålæg.
        </p>
        <p>
          En pastasalat kan laves med rester af pasta, grøntsager og lidt dressing. En lille wrap med kylling eller bønner er oplagt, når fyldet allerede indgår i
          aftensmaden.
        </p>
        <p>
          Mini-sandwich med ost og grønt er nemme for mindre hænder. En kold kartoffelmad med mayonnaise og purløg udnytter kogte kartofler fra dagen før.
        </p>
        <p>
          Havregrynsboller med ost eller hjemmelavet pålæg kan bages, når der er tid, og fryses ned. Frugtstykker, grøntsagsstænger eller en lille portion hjemmepoppede
          popcorn kan bruges som tilbehør frem for færdigpakkede snacks.
        </p>
      </section>
      <section>
        <h2>Planlæg ugens madpakker efter tilbudsaviserne</h2>
        <p>
          Start med at se, hvilke basisvarer der er på tilbud. Brød, æg, ost, frugt, grønt og pålæg kan danne rammen om ugens madpakker, hvis familien kan lide dem og når at
          bruge dem.
        </p>
        <p>
          Tænk derefter madpakken ind i indkøbet til aftensmad. Skal I have pasta, kartofler, kylling eller grøntsager til aften, kan en passende rest blive til pastasalat,
          sandwichfyld eller små hapsere næste dag.
        </p>
        <p>
          Planlæg også, hvilke varer der skal bruges først. Moden frugt kan skæres i stykker, grøntsagsrester kan komme i en wrap, og brød kan fryses ned, før det bliver tørt.
        </p>
      </section>
      <section>
        <h2>Undgå de dyre fælder i madpakken</h2>
        <p>
          Færdigpakkede snacks og enkeltportioner er praktiske, men emballagen gør dem ofte til en dyr vane. Køb større pakker, og fordel selv maden i små beholdere, når det
          passer ind i hverdagen.
        </p>
        <p>
          Variation kræver ikke nye ingredienser hver dag. Det samme brød, grønt og fyld kan serveres som rugbrød, sandwich, wrap eller små hapsere.
        </p>
        <p>
          Madspild er også en skjult udgift. Pak hellere en mindre portion, som barnet spiser, og læg lidt ekstra ved, når appetitten kræver det.
        </p>
      </section>
      <section>
        <h2>Så meget kan valget af supermarked betyde</h2>
        <p>
          Altid Mad har analyseret den samme ugentlige kurv med 23 varer hos Lidl, Rema 1000, Netto, 365discount, Meny, Bilka, Kvickly, Super Brugsen, Føtex, Brugsen,
          Nemlig.com, Spar og Min Købmand. Kurven kostede 782,70 kr. hos Lidl og 1.313,94 kr. hos Min Købmand, en forskel på 531,24 kr. om ugen og op til{' '}
          <a href={MAD_REPORT_HREF}>27.624 kr.</a> om året.
        </p>
        <p>Prisforskellen på den samme kurv var 40,4 pct. Beregningen tager udgangspunkt i en husstand med 2 voksne og 2 teenagere.</p>
        <p>
          Hvis hver vare købes dér, hvor den er billigst, kostede kurven 599,81 kr. om ugen. Det svarer til op til <a href={MAD_REPORT_HREF}>37.135 kr.</a> om året
          sammenlignet med den dyreste samlede kurv. Se hele sammenligningen i vores <A href="/billigste-supermarked">pristjek af supermarkederne</A>.
        </p>
      </section>
      <section>
        <h2>Sådan hjælper Altid Mad familien</h2>
        <p>
          Altid Mad læser tilbudsaviserne, bygger en madplan efter familiens smag og finder ugens dagligvarer til de bedste priser. Indkøbslisten samler det, I skal bruge, så tilbud, aftensmad og madpakker kan tænkes sammen.
        </p>
        <p>
          Tænk madpakkerne ind i ugens plan. Råvarer fra aftensmaden kan bruges i næste dags madpakke, og relevante basisvarer på tilbud kan komme på indkøbslisten.
        </p>
        <p>
          Altid Mad er en del af Altid Hjem-appen, som samler hjemmets faste udgifter med ét overblik og ét login. Appen er gratis i App Store og Google Play. Teamet står også bag Altid Energi, Danmarks første gebyrfrie energiselskab.
        </p>
        <GuideFigure tone="lavender" caption="Eksempel: Altid Mad planlægger ugens madpakker efter tilbudsaviserne og skriver indkøbslisten for jer. Illustration, ikke et skærmbillede fra appen.">
          <MadpakkeMockup />
        </GuideFigure>
        <GuideStores />
      </section>
    </Guide>
  )
}
