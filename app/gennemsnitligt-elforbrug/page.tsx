import type { Metadata } from 'next'
import ElforbrugBenchmark from '@/components/ElforbrugBenchmark'
import Guide, { GuideFigure, GuideLink as A, type GuideFaq } from '@/components/site/Guide'

export const metadata: Metadata = {
  title: 'Gennemsnitligt elforbrug i hjemmet | Altid Hjem',
  description:
    'Se typisk elforbrug for lejlighed og hus, sammenlign jeres kWh med vejledende niveauer, og få konkrete råd til at forstå og sænke forbruget.',
  alternates: { canonical: 'https://altidhjem.dk/gennemsnitligt-elforbrug' },
  openGraph: {
    title: 'Hvad er et normalt elforbrug?',
    description:
      'Se typisk elforbrug for lejlighed og hus, sammenlign jeres kWh med vejledende niveauer, og få konkrete råd til at forstå og sænke forbruget.',
    url: 'https://altidhjem.dk/gennemsnitligt-elforbrug',
    type: 'article',
  },
}

// FAQ bruges to steder: synligt på siden og som FAQPage-schema (rich results).
const FAQ: GuideFaq[] = [
  {
    q: 'Hvad er et normalt elforbrug for en familie på 4?',
    a: [
      'En familie på 4 i hus bruger typisk omkring 4.500-5.000 kWh om året.',
      'Niveauet er vejledende og gælder uden elbil og elvarme, som kan løfte forbruget markant.',
    ],
  },
  {
    q: 'Hvad bruger en lejlighed i el?',
    a: [
      'En lejlighed med 1 person bruger typisk cirka 1.500-2.000 kWh om året, mens 2 personer ligger omkring 2.100 kWh.',
      'En familielejlighed ligger vejledende omkring 2.600 kWh, men boligstørrelse, apparater og vaner påvirker tallet.',
    ],
  },
  {
    q: 'Hvorfor er vores elforbrug højere end gennemsnittet?',
    a: [
      'Et højere elforbrug skyldes ofte elvarme, elbil, mange beboere eller apparater med stort eller hyppigt forbrug.',
      'Hjemmearbejde, teenagere og ældre hvidevarer kan også gøre en mærkbar forskel.',
    ],
  },
  {
    q: 'Hvor meget el bruger en elbil?',
    a: [
      'En moderne elbil bruger typisk 15-22 kWh pr. 100 km, så hjemmeladning kan fordoble en husstands elforbrug afhængigt af kørslen.',
      'Se også, hvad en ladeboks koster, hvis I vil forstå den samlede økonomi ved opladning hjemme.',
    ],
  },
  {
    q: 'Hvordan ser jeg vores eget elforbrug?',
    a: [
      'I kan normalt se forbruget i kWh i elselskabets app, på årsopgørelsen eller via ElOverblik.',
      'Brug helst et helt års data, så sæsonudsving ikke giver et misvisende billede.',
    ],
  },
  {
    q: 'Hvad er Altid Hjem?',
    a: [
      'Altid Hjem er en dansk app, der samler madplan, strøm, forsikring og økonomi ét sted, så du får ét overblik, ét login.',
      'Den er bygget omkring ét overblik, ét login, mens Altid Energi allerede er live i dag.',
    ],
  },
  {
    q: 'Koster Altid Hjem noget?',
    a: [
      'Nej, appen er gratis at hente, og det er gratis at oprette sig.',
      'Du betaler kun for det, du selv vælger at bruge, for eksempel strøm fra Altid Energi, hvis du bliver kunde.',
    ],
  },
]

export default function GennemsnitligtElforbrug() {
  return (
    <Guide
      title="Hvad er et normalt elforbrug?"
      lead={
        <>
          <p>
            En familie på 4 i hus bruger typisk omkring 4.500-5.000 kWh om året, mens en lejlighed normalt bruger væsentligt mindre. Tallene er vejledende og gælder uden
            elbil og elvarme.
          </p>
          <p>
            Jeres bolig, vaner og apparater har stor betydning. Oversigten her på siden giver jer et sammenligningsgrundlag, så I kan vurdere, om jeres elforbrug ligger
            lavt, normalt eller højt.
          </p>
        </>
      }
      meta={
        <>
          Opdateret: juli 2026 · Kilde:{' '}
          <a href="https://sparenergi.dk" target="_blank" rel="noopener noreferrer">
            Energistyrelsen (Sparenergi)
          </a>{' '}
          og elselskabernes opgørelser
        </>
      }
      faq={FAQ}
      cta={{
        eyebrow: 'Kend jeres forbrug',
        heading: 'Hent Altid Hjem til hjemmets strøm og økonomi',
        subtitle: 'Med Altid Energi følger I elforbruget dag, uge og måned i appen, som er gratis at hente.',
      }}
    >
      <section>
        <h2>Typisk elforbrug efter boligtype</h2>
        <p>
          En lejlighed med 1 person bruger typisk omkring 1.500-2.000 kWh om året. Bor der 2 personer i lejligheden, er et vejledende niveau cirka 2.100 kWh om året.
        </p>
        <p>
          En familielejlighed ligger typisk omkring 2.600 kWh om året. Et hus med 2 personer bruger vejledende cirka 3.700 kWh, mens en familie på 4 i hus typisk bruger
          omkring 4.500-5.000 kWh om året.
        </p>
        <p>
          Tallene i oversigten her på siden er pejlemærker, ikke mål, som alle hjem bør ramme. Boligens installationer, antallet af personer og jeres hverdag kan forklare
          store forskelle.
        </p>
      </section>
      <section>
        <h2>Det flytter for alvor elforbruget</h2>
        <p>
          Elvarme og elbil kan fordoble husstandens elforbrug eller mere. Derfor bør I ikke sammenligne jeres samlede tal direkte med standardniveauerne, hvis boligen
          opvarmes med el, eller bilen ofte lades hjemme.
        </p>
        <p>
          Store apparater, mange vaske, tørretumbler og ældre køleudstyr kan også trække forbruget op. Teenagere, hjemmearbejde og flere personer hjemme i dagtimerne
          betyder ofte, at lys, elektronik og madlavning bruges flere timer om dagen.
        </p>
        <p>
          Et højt tal er altså ikke nødvendigvis tegn på spild. Det vigtigste er at forstå, hvilke aktiviteter der ligger bag, og om forbruget ændrer sig uden en tydelig
          forklaring.
        </p>
      </section>
      <section>
        <h2>Sådan finder I jeres eget tal</h2>
        <p>
          Se først i elselskabets app eller på jeres årsopgørelse. Her kan I normalt finde forbruget i kWh for et helt år, hvilket giver et bedre sammenligningsgrundlag end
          en enkelt vintermåned.
        </p>
        <p>
          I kan også bruge ElOverblik til at se måledata fra elmåleren. Sammenlign gerne hele år med hinanden, da ferie, vejr og ændringer i husstanden kan få enkelte
          måneder til at afvige.
        </p>
        <p>
          Notér større ændringer undervejs, for eksempel ny elbil, elvarme eller flere hjemmearbejdsdage. Så bliver det lettere at forklare udviklingen i jeres forbrug.
        </p>
        <GuideFigure tone="sky" caption="Typiske årsniveauer uden elbil og elvarme. Elbil eller elvarme kan fordoble tallene.">
          <ElforbrugBenchmark />
        </GuideFigure>
      </section>
      <section>
        <h2>Fra elforbrug til elregning</h2>
        <p>
          Elregningen afhænger ikke kun af antallet af kWh. Den samlede elpris består af spotpris, nettariffer, elafgift samt elselskabets tillæg og eventuelle gebyrer.
        </p>
        <p>
          I grove træk finder I den forbrugsafhængige del ved at gange jeres kWh med den samlede pris pr. kWh. Faste abonnementer og gebyrer kan dog betyde, at to
          husstande med samme forbrug betaler forskelligt.
        </p>
        <p>
          Når I sammenligner aftaler, bør I derfor se på hele prisstrukturen. Læs mere om at finde det <A href="/billigste-elselskab">billigste elselskab</A> og om,{' '}
          <A href="/hvornar-er-strommen-billigst">hvornår strømmen er billigst</A>.
        </p>
      </section>
      <section>
        <h2>Spar strøm uden at gå i mørke</h2>
        <p>
          Begynd med det forbrug, der er nemt at flytte eller undgå. Opvaskemaskine, vaskemaskine og opladning kan ofte placeres i billigere timer, hvis jeres elaftale
          følger spotprisen.
        </p>
        <p>
          Sluk apparater, der står unødigt på standby, og brug programmerne på vask og opvask, som passer til behovet. Det er ofte mere realistisk at ændre få gentagne
          vaner end at forsøge at spare på alt på én gang.
        </p>
        <p>
          Følg forbruget efter en ændring, så I kan se, om den faktisk gør en forskel. Det giver et bedre grundlag for at vælge de vaner, der passer til jeres hjem.
        </p>
      </section>
      <section>
        <h2>Hvad Altid Hjem kan i dag</h2>
        <p>Altid Hjem samler madplan, strøm, forsikring og økonomi i én app, så I får ét overblik, ét login.</p>
        <p>Med Altid Energi følger I elforbruget dag, uge og måned i appen. I kan hente den gratis i App Store og Google Play.</p>
        <p>
          Altid Energi er live i dag og er Danmarks første gebyrfrie energiselskab, uden faste gebyrer eller abonnement. Mere end 15.000 danskere er allerede kunder hos
          Altid Energi.
        </p>
      </section>
    </Guide>
  )
}
