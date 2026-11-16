import type { Metadata } from 'next'
import SparVanerMockup from '@/components/mad/SparVanerMockup'
import { MAD_GUIDE_CTA, MAD_REPORT_HREF, MAD_REPORT_LABEL } from '@/components/mad/madGuide'
import Guide, { GuideFigure, GuideLink as A, type GuideFaq } from '@/components/site/Guide'

export const metadata: Metadata = {
  title: 'Spar penge på dagligvarer, praktisk guide | Altid Hjem',
  description:
    'Spar penge på dagligvarer med madplan, indkøbsliste og gode butiksvaner. Se dokumenterede prisforskelle fra vores pristjek, og kom enkelt i gang i denne uge.',
  alternates: { canonical: 'https://www.altidhjem.dk/spar-penge-paa-dagligvarer' },
  openGraph: {
    title: 'Sådan sparer du penge på dagligvarer',
    description:
      'Spar penge på dagligvarer med madplan, indkøbsliste og gode butiksvaner. Se dokumenterede prisforskelle fra vores pristjek, og kom enkelt i gang i denne uge.',
    url: 'https://www.altidhjem.dk/spar-penge-paa-dagligvarer',
    type: 'article',
  },
}

// FAQ bruges to steder: synligt på siden og som FAQPage-schema (rich results).
const FAQ: GuideFaq[] = [
  {
    q: 'Hvor meget kan man realistisk spare på dagligvarer?',
    a: [
      'Det afhænger af jeres nuværende butik, madspild og indkøbsvaner.',
      'I vores analyse var forskellen på den billigste og dyreste samlede kurv 531,24 kr. om ugen, svarende til op til 27.624 kr. om året.',
    ],
  },
  {
    q: 'Hvilket supermarked skal jeg vælge?',
    a: [
      'Vælg den butik, der samlet er billigst for de varer, jeres familie normalt køber.',
      'Lidl var billigst i vores konkrete analyse, men resultatet kan ændre sig med en anden indkøbsliste og andre tilbud.',
    ],
  },
  {
    q: 'Er tilbudsaviser stadig det værd?',
    a: [
      'Ja, især når tilbuddene bruges til at planlægge flere måltider med de samme råvarer.',
      'Besparelsen bliver mindre, hvis tilbud får dig til at købe varer, familien ikke mangler eller når at bruge.',
    ],
  },
  {
    q: 'Hjælper det at handle online?',
    a: [
      'Onlinehandel kan gøre det lettere at følge indkøbslisten og se kurvens pris undervejs.',
      'Det er dog ikke automatisk billigst, og i vores analyse var Nemlig.com ikke den billigste kæde for den samlede kurv.',
    ],
  },
  {
    q: 'Er discountmærker lige så gode?',
    a: [
      'Discountmærker kan være et godt valg, men kvalitet og smag varierer fra produkt til produkt.',
      'Prøv dem i de retter, hvor forskellen betyder mindst for jer, og behold de mærkevarer, som familien faktisk foretrækker.',
    ],
  },
  {
    q: 'Hvordan kommer jeg i gang i denne uge?',
    a: [
      'Tjek først skabe, køleskab og fryser, vælg ugens retter ud fra relevante tilbud, og skriv én samlet indkøbsliste.',
      'Vælg derefter en hovedbutik, og tag kun til en ekstra butik, hvis besparelsen opvejer tiden og transporten.',
    ],
  },
]

export default function SparPengePaaDagligvarer() {
  return (
    <Guide
      title="Sådan sparer du penge på dagligvarer"
      lead={
        <>
          <p>
            Du behøver ikke ekstremkuponer eller besværlige regler for at spare penge på mad. De største besparelser kommer ofte fra en gennemtænkt madplan, den rigtige
            hovedbutik og færre spontane køb.
          </p>
          <p>
            I vores analyse kostede den samme kurv med 23 varer 782,70 kr. hos Lidl og 1.313,94 kr. hos Min Købmand. Det er en forskel på 531,24 kr. om ugen, svarende til op
            til <a href={MAD_REPORT_HREF}>27.624 kr.</a> om året, alene ved at vælge den billigste samlede kurv.
          </p>
        </>
      }
      meta={
        <>
          Opdateret: september 2026 · Kilde: <a href={MAD_REPORT_HREF}>{MAD_REPORT_LABEL}</a>
        </>
      }
      answer={{ label: 'Prisforskel på kurven', value: '531,24', unit: 'kr. om ugen', note: 'Forskellen på den billigste og den dyreste samlede kurv svarer til op til 27.624 kr. om året.' }}
      factors={{ label: 'Besparelsen afhænger af', items: ['Jeres nuværende butik', 'Madspild', 'Indkøbsvaner'] }}
      faq={FAQ}
      cta={MAD_GUIDE_CTA}
    >
      <section>
        <h2>Vælg din hovedbutik med omhu</h2>
        <p>
          En billig enkeltvare gør ikke nødvendigvis hele indkøbsturen billig. Se derfor på prisen på de varer, I faktisk køber ofte, frem for at vælge butik efter ugens
          mest synlige tilbud.
        </p>
        <p>
          I vores sammenligning af Lidl, Rema 1000, Netto, 365discount, Meny, Bilka, Kvickly, Super Brugsen, Føtex, Brugsen, Nemlig.com, Spar og Min Købmand var
          prisforskellen på den samme kurv 40,4 pct. Den billigste samlede kurv kostede 782,70 kr., mens den dyreste kostede 1.313,94 kr.
        </p>
        <p>
          Beløbene svarer til cirka 3.392 kr. og 5.694 kr. om måneden, når ugepriserne skaleres direkte. Analysen gælder en bestemt kurv til 2 voksne og 2 teenagere, så
          jeres billigste butik kan afhænge af familiens egne vaner.
        </p>
        <p>
          Læs mere om, hvordan du sammenligner butikker, i vores guide til <A href="/billigste-supermarked">det billigste supermarked</A>.
        </p>
      </section>
      <section>
        <h2>Planlæg ugen, før du handler</h2>
        <p>
          Start med at se, hvilke råvarer der er på tilbud, og byg derefter ugens retter omkring dem. Det giver som regel mere end at lave en fast madplan først og bagefter
          lede efter rabatter på alle ingredienserne.
        </p>
        <p>
          Vælg retter, der deler råvarer, så en pose grøntsager, en bakke kød eller et bæger mejeriprodukt kan bruges flere gange. Tjek køleskab, fryser og skabe, før du
          skriver indkøbslisten.
        </p>
        <p>
          Det kan betale sig at fordele indkøbene, hvis butikkerne ligger naturligt på jeres vej. I analysen kostede kurven 599,81 kr. om ugen, hvis hver vare købes dér,
          hvor den er billigst, svarende til op til <a href={MAD_REPORT_HREF}>37.135 kr.</a> om året sammenlignet med den dyreste samlede kurv.
        </p>
        <p>
          Flere butiksture kræver dog tid og eventuel transport. Brug derfor vores guide til en <A href="/madplan-efter-tilbud">madplan efter tilbud</A>, og vælg kun
          ekstra stop, når besparelsen reelt er besværet værd.
        </p>
      </section>
      <section>
        <h2>Køb rigtigt ind i butikken</h2>
        <p>
          Skriv en konkret indkøbsliste, og hold dig til den, medmindre du finder en reel erstatning til en bedre pris. En vare er ikke et godt tilbud, hvis den ikke bliver
          brugt.
        </p>
        <p>
          Sammenlign kilopris eller literpris, ikke kun prisskiltets samlede beløb. Den største pakke er heller ikke automatisk billigst, især ikke hvis noget ender i
          skraldespanden.
        </p>
        <p>
          Spis gerne, før du handler, og læg impulskøb ind som et bevidst valg frem for en vane. Så bliver indkøbslisten et realistisk værktøj, ikke en regel, der er umulig
          at følge.
        </p>
      </section>
      <section>
        <h2>Brug resterne, og undgå madspild</h2>
        <p>
          Planlæg mindst én fleksibel ret, hvor rester kan indgå, eksempelvis suppe, pastaret, rugbrød eller en blandet ovnret. Det gør det lettere at bruge det, der er
          tilbage, uden at menuen føles som gentagelser.
        </p>
        <p>
          Opbevar rester synligt, skriv indhold på fryseposer, og flyt varer med kort holdbarhed frem i køleskabet. Kig efter mad til næste dag, før du åbner en ny pakke.
        </p>
        <p>
          Madspild bliver dyrt, fordi du både betaler for varen og for den erstatning, du senere køber. Små rutiner omkring opbevaring kan derfor være lige så vigtige som
          tilbudsprisen.
        </p>
      </section>
      <section>
        <h2>Tilpas planen til madpakker og højtider</h2>
        <p>
          Madpakker bliver nemmere at holde på budget, når de tænkes ind i aftensmaden. Kog lidt ekstra, eller vælg råvarer, som både kan bruges til måltider hjemme og i
          madkassen.
        </p>
        <p>
          Du finder konkrete idéer i vores guide til <A href="/madpakker-paa-budget">madpakker på budget</A>. Her handler det om variation og enkel forberedelse, ikke om at
          vælge den samme billige løsning hver dag.
        </p>
        <p>
          Ved højtider er det især menu, gæsteantal og indkøbstidspunkt, der påvirker budgettet. Vores guide til <A href="/jul-paa-budget">jul på budget</A> hjælper med at
          prioritere det vigtigste og skære det overflødige fra.
        </p>
      </section>
      <section>
        <h2>Sådan hjælper Altid Mad</h2>
        <p>
          Altid Mad læser tilbudsaviserne, bygger en madplan efter familiens smag og finder ugens dagligvarer til de bedste priser.
        </p>
        <p>
          Målet er at gøre det nemmere at bruge tilbud uden selv at sammenligne alle varer og butikker. Det skal stadig være familiens præferencer og hverdag, der bestemmer
          menuen.
        </p>
        <p>
          Altid Mad er en del af Altid Hjem-appen, som samler hjemmets faste udgifter med ét overblik og ét login. Appen er gratis i App Store og Google Play. Teamet står også bag Altid Energi, Danmarks første gebyrfrie energiselskab.
        </p>
        <GuideFigure tone="lavender" caption="Fem vaner der flytter madbudgettet, samlet som én ugeplan.">
          <SparVanerMockup />
        </GuideFigure>
      </section>
    </Guide>
  )
}
