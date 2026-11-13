import type { Metadata } from 'next'
import AbonnementMockup from '@/components/AbonnementMockup'
import Guide, { GuideFigure, GuideLink as A, type GuideFaq } from '@/components/site/Guide'

export const metadata: Metadata = {
  title: 'Opsig abonnementer, I ikke bruger | Altid Hjem',
  description:
    'Find alle husstandens abonnementer, tjek binding og opsig korrekt. Få en enkel guide til at rydde op, og hent Altid Hjem gratis.',
  alternates: { canonical: 'https://altidhjem.dk/opsig-abonnementer' },
  openGraph: {
    title: 'Sådan opsiger I husstandens abonnementer',
    description:
      'Find alle husstandens abonnementer, tjek binding og opsig korrekt. Få en enkel guide til at rydde op, og hent Altid Hjem gratis.',
    url: 'https://altidhjem.dk/opsig-abonnementer',
    type: 'article',
  },
}

// FAQ bruges to steder: synligt på siden og som FAQPage-schema (rich results).
const FAQ: GuideFaq[] = [
  {
    q: 'Hvordan opsiger jeg et abonnement?',
    a: [
      'Find opsigelsesfunktionen på udbyderens hjemmeside eller i appen, og følg den angivne proces.',
      'Tjek binding og opsigelsesvarsel først, og gem altid bekræftelsen.',
    ],
  },
  {
    q: 'Hvordan finder jeg alle mine abonnementer?',
    a: [
      'Gennemgå kontoudtog, appbutikkernes abonnementslister og aftaler hos de enkelte udbydere.',
      'Spørg også resten af husstanden, så delte eller parallelle abonnementer kommer med.',
    ],
  },
  {
    q: 'Hvad koster glemte abonnementer?',
    a: [
      'Det afhænger af, hvor mange aftaler der fortsætter, og hvad de koster.',
      'Selv små månedlige beløb kan fylde mærkbart over et år, når flere ubrugte abonnementer lægges sammen.',
    ],
  },
  {
    q: 'Kan jeg opsige et abonnement med det samme?',
    a: [
      'Det afhænger af abonnementets binding og opsigelsesvarsel.',
      'Du kan ofte sende opsigelsen straks, men aftalen og betalingen kan fortsætte frem til den slutdato, der følger af vilkårene.',
    ],
  },
  {
    q: 'Skal jeg opsige eller nedgradere?',
    a: [
      'Nedgradering kan være bedst, hvis du stadig bruger tjenesten, men ikke har behov for hele pakken.',
      'Opsigelse giver mere mening, hvis abonnementet sjældent bliver brugt eller overlapper med en anden aftale.',
    ],
  },
  {
    q: 'Hvad er Altid Hjem?',
    a: [
      'Altid Hjem er en dansk app, der samler madplan, strøm, forsikring og økonomi ét sted.',
      'Du får ét overblik, ét login, og du kan hente den gratis i App Store og Google Play.',
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

export default function OpsigAbonnementer() {
  return (
    <Guide
      title="Sådan opsiger I husstandens abonnementer"
      lead={
        <>
          <p>
            De fleste abonnementer kan opsiges hurtigt via udbyderens hjemmeside, app eller kundeservice. Tjek først bindingsperiode og opsigelsesvarsel, og gem derefter
            bekræftelsen.
          </p>
          <p>
            Det svære er ofte at finde alle aftalerne og huske dem, der ikke længere bliver brugt. Gennemgå kontoudtog, appbutikker og familiens delte abonnementer, før I
            beslutter, hvad der skal opsiges.
          </p>
        </>
      }
      meta={
        <>
          Opdateret: juli 2026 · Læs om dine abonnementsrettigheder på{' '}
          <a href="https://www.forbrug.dk" target="_blank" rel="noopener noreferrer">
            forbrug.dk
          </a>
        </>
      }
      faq={FAQ}
      cta={{
        eyebrow: 'Glemte abonnementer gemmer sig',
        heading: 'Hent Altid Hjem, og find jeres abonnementer',
        subtitle: 'Forbind banken, så ser I jeres faste udgifter og abonnementer i en kalender, før pengene bliver trukket.',
      }}
    >
      <section>
        <h2>Sådan finder I alle husstandens abonnementer</h2>
        <p>
          Start med kontoudtoget fra de seneste måneder. Se efter gentagne betalinger til streaming, mobil, fitness, aviser, apps, lagerplads i skyen og andre tjenester.
        </p>
        <p>
          Tjek også abonnementslisterne i telefonens appbutik. Nogle aftaler bliver trukket gennem Apple eller Google og fremgår derfor ikke under tjenestens eget navn på
          kontoudtoget.
        </p>
        <p>Spørg alle i husstanden, hvilke aftaler de betaler for. Delte tjenester og parallelle abonnementer kan ellers være svære at opdage.</p>
      </section>
      <section>
        <h2>Abonnementerne, mange glemmer</h2>
        <p>
          Mange husstande opdager glemte abonnementer, når de gennemgår kontoudtoget. Det kan være en gammel app, et fitnessmedlemskab, en nyhedsapp eller
          streamingtjenester med indhold, der overlapper.
        </p>
        <p>Små månedlige betalinger er lette at overse, fordi de hver for sig virker beskedne. Over et år kan flere ubrugte aftaler dog fylde mærkbart i budgettet.</p>
        <p>
          Se også på mobilabonnementerne i husstanden. Hvis behovet har ændret sig, kan vores guide til det <A href="/billigste-mobilabonnement">billigste mobilabonnement</A>{' '}
          hjælpe jer med at sammenligne pris, data og vilkår.
        </p>
      </section>
      <section>
        <h2>Sådan opsiger du et abonnement korrekt</h2>
        <p>
          Find udbyderens side om opsigelse, og læs vilkårene for binding og opsigelsesvarsel. Nogle aftaler stopper straks, mens andre fortsætter til udgangen af en
          betalingsperiode eller bindingsperiode.
        </p>
        <p>Opsig gennem den kanal, som udbyderen angiver. Gem en mail, kvittering eller et skærmbillede, der viser datoen og bekræfter opsigelsen.</p>
        <p>
          Reglerne afhænger af aftaletype og vilkår, så denne guide er generel og ikke en juridisk garanti. Kontakt udbyderen, hvis slutdatoen eller en fortsat betaling er
          uklar.
        </p>
        <GuideFigure
          tone="honey"
          caption="Et samlet overblik over husstandens faste aftaler gør det sværere for glemte abonnementer at gemme sig. Illustration, ikke et skærmbillede fra appen."
        >
          <AbonnementMockup />
        </GuideFigure>
      </section>
      <section>
        <h2>Behold det, I faktisk bruger</h2>
        <p>Målet er ikke at have nul abonnementer. Målet er at vælge dem bevidst og betale for tjenester, der giver reel værdi i hverdagen.</p>
        <p>
          Overvej en billigere pakke, hvis I bruger tjenesten, men ikke alle funktionerne. Ved overlappende streamingtjenester kan I også beholde én ad gangen og skifte
          efter behov.
        </p>
        <p>
          Vurdér hver aftale ud fra brug, pris og hvor besværlig den er at undvære. En aktiv beslutning om at beholde et abonnement er lige så relevant som en opsigelse.
        </p>
      </section>
      <section>
        <h2>Gør gennemgangen til en årlig vane</h2>
        <p>
          Vælg en fast måned, eksempelvis januar eller juni, hvor hele husstanden gennemgår sine løbende aftaler. En tilbagevendende påmindelse i kalenderen gør det mindre
          sandsynligt, at ubrugte abonnementer fortsætter ubemærket.
        </p>
        <p>Saml en enkel liste med udbyder, pris, betalingsfrekvens, binding og næste vurderingsdato. Opdatér den, når I opretter, ændrer eller opsiger en aftale.</p>
      </section>
      <section>
        <h2>Hvad Altid Hjem kan i dag</h2>
        <p>
          Altid Hjem samler madplan, strøm, forsikring og økonomi i én app, så I får ét overblik, ét login. Forbinder I banken, ser I jeres faste udgifter og abonnementer i
          en kalender, før pengene bliver trukket.
        </p>
        <p>Altid Hjem er bygget af holdet bag Altid Energi, Danmarks første gebyrfrie energiselskab, hvor mere end 15.000 danskere allerede er kunder.</p>
        <p>
          Læs også om forskellen på Altid Hjem og traditionelle <A href="/spiir-alternativ">budget- og kontooverblik-apps</A>.
        </p>
      </section>
    </Guide>
  )
}
