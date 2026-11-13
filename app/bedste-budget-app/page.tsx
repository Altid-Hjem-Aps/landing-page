import type { Metadata } from 'next'
import BudgetAppSammenligning from '@/components/BudgetAppSammenligning'
import Guide, { GuideFigure, GuideLink as A, type GuideFaq } from '@/components/site/Guide'

export const metadata: Metadata = {
  title: 'Bedste budget-app til jeres økonomi | Altid Hjem',
  description:
    'Få en ærlig guide til budget-apps, faste aftaler og økonomisk overblik. Se forskellen på værktøjerne, og find den løsning, der passer til jer.',
  alternates: { canonical: 'https://altidhjem.dk/bedste-budget-app' },
  openGraph: {
    title: 'Hvilken budget-app er bedst til jeres behov?',
    description:
      'Få en ærlig guide til budget-apps, faste aftaler og økonomisk overblik. Se forskellen på værktøjerne, og find den løsning, der passer til jer.',
    url: 'https://altidhjem.dk/bedste-budget-app',
    type: 'article',
  },
}

// FAQ bruges to steder: synligt på siden og som FAQPage-schema (rich results).
const FAQ: GuideFaq[] = [
  {
    q: 'Hvad er den bedste budget-app?',
    a: [
      'Den bedste budget-app er den, der løser jeres konkrete behov og håndterer jeres data på en måde, I er trygge ved.',
      'Vælg ud fra bankunderstøttelse, kategorisering, eksportmuligheder og vilkår, ikke kun ud fra antallet af funktioner.',
    ],
  },
  {
    q: 'Er budget-apps sikre?',
    a: [
      'Budget-apps kan være sikre, men I bør altid undersøge den enkelte udbyder.',
      'Kontoadgang sker generelt gennem regulerede åbne bankløsninger, men tjek appens vilkår, databehandling og muligheder for at fjerne adgangen.',
    ],
  },
  {
    q: 'Hvad kostede Spiirs lukning brugerne?',
    a: [
      'Spiirs lukning betød først og fremmest, at brugerne mistede adgangen til deres vante overblik.',
      'Konsekvensen var ikke nødvendigvis et direkte økonomisk tab, men mange måtte finde en ny måde at kategorisere forbrug og følge økonomien på.',
    ],
  },
  {
    q: 'Skal vi vælge en budget-app eller et samlet overblik?',
    a: [
      'Vælg en budget-app, hvis I vil analysere forbruget bagud, og et samlet overblik, hvis I vil styre faste aftaler fremadrettet.',
      'De kan supplere hinanden, fordi de løser forskellige opgaver.',
    ],
  },
  {
    q: 'Kan Altid Hjem erstatte en budget-app?',
    a: [
      'Det afhænger af, hvad I bruger budget-appen til.',
      'I Altid Hjem forbinder I banken med MitID og ser, hvad I har tilbage til næste løn. I ser også jeres faste udgifter og abonnementer i en kalender. Appen samler også madplan, strøm og forsikring.',
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

export default function BedsteBudgetApp() {
  return (
    <Guide
      title="Hvilken budget-app er bedst til jeres behov?"
      lead={
        <>
          <p>
            Den bedste budget-app afhænger af, hvilket problem I vil løse. En klassisk budget-app viser, hvor pengene er gået, mens et samlet aftaleoverblik hjælper jer
            med at styre faste udgifter fremadrettet.
          </p>
          <p>
            De to værktøjer kan sagtens supplere hinanden. Vælg en budget-app til løbende forbrug, et aftaleoverblik til el, mobil, forsikringer og abonnementer, eller
            begge dele, hvis I har brug for hele billedet.
          </p>
        </>
      }
      meta="Opdateret: juli 2026"
      faq={FAQ}
      cta={{
        eyebrow: 'Budget og faste udgifter i samme app',
        heading: 'Hent Altid Hjem, og se, hvad I har tilbage til næste løn',
        subtitle: 'Appen er gratis og viser jeres faste udgifter og abonnementer i en kalender, før pengene bliver trukket.',
      }}
    >
      <section>
        <h2>Hvad gør en budget-app egentlig?</h2>
        <p>
          En klassisk budget-app henter oplysninger fra jeres konti og placerer betalingerne i kategorier som bolig, transport, dagligvarer og fornøjelser. Det gør det
          lettere at se, hvor pengene gik sidste måned.
        </p>
        <p>
          Overblikket er især nyttigt, hvis I vil finde vaner i det variable forbrug. Måske fylder takeaway, små netkøb eller dagligvarer mere, end I havde regnet med.
        </p>
        <p>
          Kategoriseringen er dog ikke altid fejlfri. En overførsel eller betaling kan lande i den forkerte kategori, så I bør gennemgå tallene, før I træffer større
          beslutninger ud fra dem.
        </p>
      </section>
      <section>
        <h2>Hvad løser budget-apps sjældent?</h2>
        <p>
          Budget-apps ser normalt på betalinger bagud i tid. De viser, at en forsikring eller et mobilabonnement er blevet betalt, men giver ikke nødvendigvis et samlet
          overblik over priser, vilkår, dækning og forskellige logins.
        </p>
        <p>Det gør det sværere at styre de faste aftaler fremadrettet. I kan godt se beløbet på kontoen uden at vide, om aftalen stadig passer til jeres behov.</p>
        <p>
          Her kan et særskilt aftaleoverblik være mere relevant. Det gælder især, hvis målet er at samle el, mobil, forsikringer og andre faste udgifter, ikke blot at
          kategorisere dem.
        </p>
      </section>
      <section>
        <h2>Spiir lukkede, hvad lærte det brugerne?</h2>
        <p>
          Spiir lukkede i juni 2026. Mange brugere mistede dermed det kontooverblik og de kategorier, som de havde gjort til en fast del af deres økonomiske rutine.
        </p>
        <p>
          Lukningen viste, at et digitalt økonomioverblik også afhænger af, at tjenesten fortsætter. Det er derfor fornuftigt at kunne hente sine oplysninger og have en
          enkel, selvstændig oversigt over de vigtigste aftaler.
        </p>
        <p>
          Hvis I brugte Spiir, kan I læse vores guide til at finde et <A href="/spiir-alternativ">alternativ til Spiir</A>. Her gennemgår vi forskellen mellem
          kontooverblik og styring af faste aftaler.
        </p>
        <GuideFigure
          tone="honey"
          caption="En budget-app ser bagud på forbruget. Et samlet overblik styrer de faste aftaler fremad. Illustration, ikke et skærmbillede fra appen."
        >
          <BudgetAppSammenligning />
        </GuideFigure>
      </section>
      <section>
        <h2>Sådan vælger I det rigtige værktøj</h2>
        <p>
          Start med at spørge, om jeres største udfordring er det variable forbrug eller de faste aftaler. Hvis I vil forstå, hvor pengene gik, er en klassisk budget-app
          ofte det mest oplagte valg.
        </p>
        <p>
          Hvis problemet er abonnementer, policer og leverandører fordelt på forskellige logins, har I snarere brug for et samlet aftaleoverblik. Mange vil få mest værdi
          af begge dele, fordi værktøjerne besvarer forskellige spørgsmål.
        </p>
        <p>
          Undersøg også, hvordan appen beskytter jeres data, hvilke konti den understøtter, om kategorier kan rettes, og om oplysninger kan eksporteres. Læs altid vilkår
          og privatlivspolitik, før I giver adgang til økonomiske oplysninger.
        </p>
      </section>
      <section>
        <h2>De faste udgifter er den stille post</h2>
        <p>
          Faste udgifter bliver let overset, fordi betalingerne kører automatisk. Mange husstande opdager glemte abonnementer, når de gennemgår kontoudtoget grundigt.
        </p>
        <p>
          Se hver aftale efter mindst én gang om året. Tjek pris, brug, binding, opsigelsesvilkår og eventuelle overlap, og begynd gerne med områder som{' '}
          <A href="/billigste-mobilabonnement">mobilabonnementet</A> og <A href="/hvad-koster-indboforsikring">indboforsikringen</A>.
        </p>
        <p>
          En lav pris er ikke altid det vigtigste. Dækning, datamængde, service og fleksibilitet skal passe til jeres faktiske behov, ellers kan den billigste aftale ende
          med at være et dårligt valg.
        </p>
      </section>
      <section>
        <h2>Hvad kan Altid Hjem?</h2>
        <p>
          Altid Hjem samler madplan, strøm, forsikring og økonomi i én app, så I får ét overblik, ét login. I Økonomi forbinder I banken med MitID og ser, hvad I har
          tilbage til næste løn. I ser også jeres faste udgifter og abonnementer i en kalender.
        </p>
        <p>Altid Hjem er bygget af holdet bag Altid Energi, Danmarks første gebyrfrie energiselskab, hvor mere end 15.000 danskere allerede er kunder.</p>
        <p>I kan hente appen gratis i App Store og Google Play.</p>
      </section>
    </Guide>
  )
}
