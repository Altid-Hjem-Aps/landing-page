import type { Metadata } from 'next'
import JulekurvMockup from '@/components/mad/JulekurvMockup'
import { MAD_GUIDE_CTA, MAD_IN_APP, MAD_REPORT_HREF, MAD_REPORT_LABEL } from '@/components/mad/madGuide'
import Guide, { GuideFigure, GuideLink as A, type GuideFaq } from '@/components/site/Guide'

// Moved from altidmad.dk/jul-paa-budget (16 Nov 2026): the article text is word for word, only
// the sign-up sentences from before the launch (no longer true) were rewritten to be true on altidhjem.dk, and the description lost its
// closing invitation to sign up.
export const metadata: Metadata = {
  title: 'Jul på budget: Spar på julemaden | Altid Hjem',
  description: 'Få en jul på budget med en planlagt menu, tilbudskøb og mindre madspild. Se konkrete råd til billig julemad.',
  alternates: { canonical: 'https://www.altidhjem.dk/jul-paa-budget' },
  openGraph: {
    title: 'Jul på budget uden at spare på hyggen',
    description: 'Få en jul på budget med en planlagt menu, tilbudskøb og mindre madspild. Se konkrete råd til billig julemad.',
    url: 'https://www.altidhjem.dk/jul-paa-budget',
    type: 'article',
  },
}

// FAQ bruges to steder: synligt på siden og som FAQPage-schema (rich results).
const FAQ: GuideFaq[] = [
  {
    q: 'Hvad koster julemiddagen for en familie?',
    a: [
      'Det afhænger af menuen, antallet af gæster og de varer, I vælger.',
      'Det vigtigste er at beslutte et beløb på forhånd og tilpasse menuen, før indkøbene begynder.',
    ],
  },
  {
    q: 'Hvornår skal jeg købe ind til jul?',
    a: [
      'Køb langtidsholdbare og fryseegnede varer i ugerne op til jul, når de er på tilbud.',
      'Vent med de mest letfordærvelige varer, og lav en opdelt indkøbsliste, så intet bliver købt to gange.',
    ],
  },
  {
    q: 'Er julevarer billigere før eller efter jul?',
    a: [
      'Mange julevarer er på tilbud i ugerne op til jul, men det varierer mellem butikker og produkter.',
      'Efter jul kan der være udsalg, men udvalget og holdbarheden kan være begrænset.',
    ],
  },
  {
    q: 'Hvordan undgår vi madspild i julen?',
    a: [
      'Planlæg portionerne efter gæsterne, og beslut på forhånd, hvordan resterne skal bruges.',
      'Køl maden hurtigt ned, frys overskud ned, og indlæg restedage mellem de større måltider.',
    ],
  },
  {
    q: 'Hvad med julefrokosten?',
    a: [
      'Hold menuen overskuelig, og vælg de retter, gæsterne faktisk ønsker.',
      'Ved sammenskud kan hver husstand medbringe en aftalt ret, så udgifterne fordeles, og I undgår dubletter.',
    ],
  },
  {
    q: 'Kan Altid Mad hjælpe med julen?',
    a: [
      'Ja, Altid Mad er udviklet til at læse tilbudsaviserne, foreslå en madplan efter familiens smag og finde dagligvarerne til de bedste priser.',
      MAD_IN_APP,
    ],
  },
]

export default function JulPaaBudget() {
  return (
    <Guide
      title="Jul på budget uden at spare på hyggen"
      lead={
        <>
          <p>
            Julen behøver ikke vælte familiens madbudget. Når I planlægger menuen og indkøbene i god tid, bliver det lettere at prioritere det, I holder mest af.
          </p>
          <p>
            Panikindkøb i december gør det svært at sammenligne priser og bruge råvarerne fornuftigt. En enkel plan giver jer bedre overblik, mindre madspild og mere ro
            omkring julebordet.
          </p>
        </>
      }
      meta={
        <>
          Opdateret: 2026 · Kilde: <a href={MAD_REPORT_HREF}>{MAD_REPORT_LABEL}</a>
        </>
      }
      answer={{
        label: 'Prisforskel på kurven',
        value: '40,4',
        unit: 'pct.',
        note: 'Samme kurv med 23 varer kostede 782,70 kr. hos Lidl og 1.313,94 kr. hos Min Købmand.',
      }}
      faq={FAQ}
      cta={MAD_GUIDE_CTA}
    >
      <section>
        <h2>Læg julemadbudgettet i god tid</h2>
        <p>
          Beslut på forhånd, hvor meget I vil bruge på julemiddag, julefrokoster, snacks og øvrige måltider. Fordel gerne beløbet mellem de forskellige anledninger, så hele
          budgettet ikke forsvinder på én dyr indkøbstur.
        </p>
        <p>
          Forbrugsundersøgelsen 2024 fra Danmarks Statistik viser, at 2 voksne med børn i gennemsnit bruger 65.775 kr. om året på fødevarer og ikke-alkoholiske drikkevarer.
          Tallet dækker hele årets forbrug og kan derfor ikke bruges som en pris på julemad, men det kan hjælpe jer med at se julens indkøb i forhold til familiens almindelige
          madbudget.
        </p>
        <p>
          Skriv menuen ned, gennemgå skabe og fryser, og lav derefter indkøbslisten. I kan få flere konkrete metoder i vores guide til <A href="/madbudget">madbudget</A>.
        </p>
      </section>
      <section>
        <h2>Find de dyre valg i julemenuen</h2>
        <p>
          And, flæskesteg og andet kød fylder ofte meget i julebudgettet. Vælg først hovedretten, og byg derefter tilbehøret op omkring råvarer, som både passer til menuen og
          kan bruges i dagene efter.
        </p>
        <p>
          Tilbudsaviserne er fulde af julevarer fra november. Køb ikke-letfordærvelige varer, når de er på tilbud i ugerne op til jul, men undgå at købe noget alene, fordi
          prisen ser god ud.
        </p>
        <p>
          Prissammenligning kan gøre en mærkbar forskel året rundt. I Altid Mads analyse kostede den samme kurv med 23 varer til 2 voksne og 2 teenagere 782,70 kr. hos Lidl
          og 1.313,94 kr. hos Min Købmand, en forskel på 40,4 pct. Det svarer til op til <a href={MAD_REPORT_HREF}>27.624 kr.</a> om året, og hvis hver vare købes dér, hvor
          den er billigst, op til <a href={MAD_REPORT_HREF}>37.135 kr.</a> om året. Læs mere om analysen af <A href="/billigste-supermarked">det billigste supermarked</A>.
        </p>
      </section>
      <section>
        <h2>Spred indkøbene over ugerne før jul</h2>
        <p>
          Alt behøver ikke blive købt i den samme uge. Basisvarer med lang holdbarhed kan komme i kurven, når de er på tilbud, mens friske varer kan vente til tættere på den
          dag, hvor de skal bruges.
        </p>
        <p>
          Kød og andre fryseegnede varer kan købes tidligere, hvis I har plads i fryseren. Mærk pakkerne tydeligt, og skriv dem ind i madplanen, så de ikke bliver glemt.
        </p>
        <p>Hold indkøbslisten opdelt efter anledning og holdbarhed. Så kan I bedre se, hvad der mangler, og undgå dobbeltkøb.</p>
      </section>
      <section>
        <h2>Gør julefrokosten lettere at styre</h2>
        <p>
          Til en julefrokost er det nemt at ende med flere retter, end gæsterne kan spise. Vælg færre favoritter, planlæg portionerne efter antallet af gæster, og tænk over,
          hvilke retter der kan gemmes.
        </p>
        <p>
          Hvis flere familier mødes, kan I bruge sammenskudsprincippet. Lad hver husstand tage en aftalt ret med, så både arbejdet og udgifterne bliver fordelt.
        </p>
        <p>
          Aftal retterne på forhånd, så I ikke står med flere næsten ens fade. Spørg også gæsterne, hvad de faktisk glæder sig til, før menuen vokser.
        </p>
      </section>
      <section>
        <h2>Brug resterne som planlagte måltider</h2>
        <p>
          Rester er nemmere at få brugt, når de allerede indgår i planen. Juleand kan blive til andesalat eller fyld i en sandwich, mens kartofler og grønt kan bruges i
          biksemad, supper eller lune frokostretter.
        </p>
        <p>
          Sæt maden på køl hurtigt, opbevar den i lukkede beholdere, og frys det ned, I ikke får spist i tide. Skriv indhold og dato på beholderen, så resterne er nemme at
          finde igen.
        </p>
        <p>
          Planlæg gerne et par enkle restedage mellem julens større måltider. Det mindsker madspild og giver en tiltrængt pause fra nye indkøb.
        </p>
      </section>
      <section>
        <h2>Sådan kan Altid Mad hjælpe</h2>
        <p>
          Altid Mad læser tilbudsaviserne, lærer familiens smag at kende og bygger en madplan med ugens dagligvarer til de bedste priser. Det gælder også tilbud på julevarer, når de dukker op i butikkerne.
        </p>
        <p>
          I kan også bruge principperne her og vores guide til en <A href="/madplan-efter-tilbud">madplan efter tilbud</A>.
        </p>
        <p>
          Altid Mad er en del af Altid Hjem-appen, som samler hjemmets faste udgifter med ét overblik og ét login. Appen er gratis i App Store og Google Play. Teamet står også bag Altid Energi, Danmarks første gebyrfrie energiselskab.
        </p>
        <GuideFigure tone="lavender" caption="Juleindkøbene spredt over ugerne op til jul, planlagt efter tilbud.">
          <JulekurvMockup />
        </GuideFigure>
      </section>
    </Guide>
  )
}
