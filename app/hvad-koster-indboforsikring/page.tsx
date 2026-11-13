import type { Metadata } from 'next'
import IndboTjekMockup from '@/components/IndboTjekMockup'
import Guide, { GuideFigure, GuideLink as A, type GuideFaq } from '@/components/site/Guide'

export const metadata: Metadata = {
  title: 'Pris på indboforsikring i 2026 | Altid Hjem',
  description:
    'Se, hvad en indboforsikring typisk koster, hvorfor prisen varierer, og hvad du bør tjekke før et skifte. Få et ærligt overblik hos Altid Hjem.',
  alternates: { canonical: 'https://altidhjem.dk/hvad-koster-indboforsikring' },
  openGraph: {
    title: 'Hvad koster en indboforsikring?',
    description:
      'Se, hvad en indboforsikring typisk koster, hvorfor prisen varierer, og hvad du bør tjekke før et skifte. Få et ærligt overblik hos Altid Hjem.',
    url: 'https://altidhjem.dk/hvad-koster-indboforsikring',
    type: 'article',
  },
}

// FAQ bruges to steder: synligt på siden og som FAQPage-schema (rich results).
const FAQ: GuideFaq[] = [
  {
    q: 'Hvad koster en indboforsikring om måneden?',
    a: [
      'En indboforsikring koster typisk 100-400 kr. om måneden, mens gennemsnittet ligger omkring 150-160 kr.',
      'Priserne er vejledende og varierer efter blandt andet profil, dækning og selvrisiko.',
    ],
  },
  {
    q: 'Hvad afgør prisen på en indboforsikring?',
    a: [
      'Prisen afgøres typisk af postnummer, indbosum, selvrisiko, alder og valgte tilvalg.',
      'Selskabernes risikovurderinger varierer, så samme husstand kan få forskellige priser.',
    ],
  },
  {
    q: 'Er den billigste indboforsikring god nok?',
    a: [
      'Den billigste indboforsikring kan være god nok, hvis dækningen passer til jeres behov.',
      'Sammenlign især selvrisiko, undtagelser, dækningsgrænser og tilvalg, før I vælger.',
    ],
  },
  {
    q: 'Kan vi være dækket dobbelt?',
    a: [
      'Ja, dobbeltdækning kan opstå, hvis flere i samme hjem har hver sin indboforsikring.',
      'Få selskaberne til at bekræfte, hvem hver police omfatter, før I ændrer eller opsiger noget.',
    ],
  },
  {
    q: 'Hvornår kan jeg opsige min indboforsikring?',
    a: [
      'En indboforsikring kan typisk opsiges med kort varsel efter den første aftaleperiode, men vilkårene varierer.',
      'Tjek policen eller spørg selskabet, og lad den nye dækning begynde, før den gamle ophører.',
    ],
  },
  {
    q: 'Hvad er Altid Hjem?',
    a: [
      'Altid Hjem er en dansk app, der samler madplan, strøm, forsikring og økonomi ét sted, så du får ét overblik, ét login.',
      'Du kan hente den gratis i App Store og Google Play.',
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

export default function HvadKosterIndboforsikring() {
  return (
    <Guide
      title="Hvad koster en indboforsikring?"
      lead={
        <>
          <p>
            En indboforsikring koster typisk 100-400 kr. om måneden afhængigt af din profil. Gennemsnittet ligger omkring 150-160 kr. om måneden, svarende til ca.
            1.800 kr. om året.
          </p>
          <p>Priserne er vejledende. Din pris afhænger blandt andet af postnummer, indbosum, selvrisiko, alder og valgte tilvalg.</p>
        </>
      }
      meta={
        <>
          Opdateret: juli 2026 · Priserne er vejledende markedsintervaller · Sammenlign selv på{' '}
          <a href="https://www.forsikringsguiden.dk" target="_blank" rel="noopener noreferrer">
            Forsikringsguiden.dk
          </a>
        </>
      }
      faq={FAQ}
      cta={{
        eyebrow: 'Alle jeres forsikringer ét sted',
        heading: 'Hent Altid Hjem, og saml husstandens forsikringer',
        subtitle: 'Skriv jeres forsikringer, priser og fornyelser ind i appen, så har I dem samlet ét sted.',
      }}
    >
      <section>
        <h2>Hvad koster en indboforsikring i 2026?</h2>
        <p>
          En indboforsikring koster typisk 100-400 kr. om måneden. Gennemsnittet ligger omkring 150-160 kr. om måneden, men det fortæller ikke nødvendigvis, hvad netop din
          husstand skal betale.
        </p>
        <p>Prisen varierer, fordi selskaberne vurderer risiko forskelligt. Postnummer, alder, indbosum, selvrisiko og tilvalg kan alle påvirke den vejledende pris.</p>
        <p>
          En højere selvrisiko kan ofte give en lavere månedlig pris, men betyder også, at du selv skal betale mere ved en skade. Sammenlign derfor både pris, dækning og
          selvrisiko.
        </p>
      </section>
      <section>
        <h2>Hvad dækker en indboforsikring egentlig?</h2>
        <p>
          En indboforsikring dækker typisk husstandens indbo og løsøre ved bestemte skader og hændelser. Den indeholder ofte også privat ansvar og retshjælp, mens den
          præcise dækning afhænger af policen.
        </p>
        <p>
          Rejsegods kan være inkluderet eller kræve et tilvalg. Tjek også beløbsgrænser, undtagelser og særlige krav til eksempelvis elektronik, cykler og værdifulde
          genstande.
        </p>
        <p>
          Den billigste police er derfor ikke automatisk det bedste valg. Det afgørende er, om dækningen passer til det, I ejer, og den risiko I ønsker at bære selv.
        </p>
      </section>
      <section>
        <h2>Derfor betaler ens husstande forskellige priser</h2>
        <p>
          To husstande med lignende bolig og indbo kan få meget forskellige tilbud. Forskellen mellem det billigste og dyreste selskab kan være flere hundrede kroner om
          måneden for samme dækning.
        </p>
        <p>
          Prisen kan blandt andet afhænge af selskabets risikovurdering, kundens alder, adresse og valgte selvrisiko. Eksisterende kunder får heller ikke altid automatisk
          den bedste pris, så lang loyalitet kan i praksis blive dyr.
        </p>
        <p>
          Indhent sammenlignelige tilbud, og brug samme dækning og selvrisiko hver gang. Ellers risikerer I at sammenligne priser på produkter, der reelt ikke er ens.
        </p>
        <GuideFigure
          tone="mint"
          caption="Et samlet overblik over husstandens dækninger gør det lettere at se mulige overlap. Illustration, ikke et skærmbillede fra appen."
        >
          <IndboTjekMockup />
        </GuideFigure>
      </section>
      <section>
        <h2>Pas på dobbeltdækning i husstanden</h2>
        <p>
          Hvis to personer flytter sammen, kan begge komme med hver sin indboforsikring. Ofte er én police nok til hele husstanden, men I bør få selskabet til at bekræfte,
          hvem der er omfattet, før noget opsiges.
        </p>
        <p>
          Børn kan i visse situationer være dækket gennem begge forældres forsikringer. Det afhænger af policerne og barnets bopælsforhold, så spørg selskaberne konkret i
          stedet for at antage, at dækningen følger automatisk.
        </p>
        <p>
          Læs mere om overlap og andre forsikringstyper i guiden til <A href="/hvad-koster-forsikring">hvad forsikringer typisk koster</A>.
        </p>
      </section>
      <section>
        <h2>Tjekliste før I skifter eller opsiger</h2>
        <p>
          Sammenlign først dækningsomfang, selvrisiko, undtagelser og eventuelle tilvalg. Kontrollér også, om ansvar, retshjælp og rejsegods er med, og om værdifulde
          ejendele kræver særlig registrering eller dækning.
        </p>
        <p>
          Tjek opsigelsesvilkårene i den nuværende police, og sørg for, at den nye forsikring er trådt i kraft, før den gamle stopper. På den måde undgår I et hul i
          dækningen.
        </p>
        <p>
          Se også på hele husstandens økonomi, ikke kun den enkelte police. Et samlet digitalt budgetværktøj kan være nyttigt, og du kan læse om mulighederne i vores guide
          til et <A href="/spiir-alternativ">alternativ til Spiir</A>.
        </p>
      </section>
      <section>
        <h2>Hvad Altid Hjem kan i dag</h2>
        <p>
          Altid Hjem samler madplan, strøm, forsikring og økonomi i én app, så I får ét overblik, ét login. Skriv jeres forsikringer, priser og fornyelser ind, så har I dem
          samlet ét sted, og det bliver lettere selv at opdage mulige overlap.
        </p>
        <p>
          Altid Hjem er bygget af holdet bag Altid Energi, Danmarks første gebyrfrie energiselskab, hvor mere end 15.000 danskere allerede er kunder. I kan hente den
          gratis i App Store og Google Play.
        </p>
      </section>
    </Guide>
  )
}
