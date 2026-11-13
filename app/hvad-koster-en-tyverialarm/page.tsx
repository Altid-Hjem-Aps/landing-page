import type { Metadata } from 'next'
import AlarmStatusMockup from '@/components/AlarmStatusMockup'
import Guide, { GuideFigure, GuideLink as A, type GuideFaq } from '@/components/site/Guide'

export const metadata: Metadata = {
  title: 'Hvad koster en tyverialarm? | Altid Hjem',
  description:
    'Se vejledende priser på tyverialarmer, fra gør-det-selv til abonnement, og lær, hvad der påvirker totalprisen. Få et ærligt overblik her.',
  alternates: { canonical: 'https://altidhjem.dk/hvad-koster-en-tyverialarm' },
  openGraph: {
    title: 'Hvad koster en tyverialarm?',
    description:
      'Se vejledende priser på tyverialarmer, fra gør-det-selv til abonnement, og lær, hvad der påvirker totalprisen. Få et ærligt overblik her.',
    url: 'https://altidhjem.dk/hvad-koster-en-tyverialarm',
    type: 'article',
  },
}

// FAQ bruges to steder: synligt på siden og som FAQPage-schema (rich results).
const FAQ: GuideFaq[] = [
  {
    q: 'Hvad koster en tyverialarm?',
    a: [
      'En tyverialarm koster vejledende 999-2.999 kr. som enkel gør-det-selv-løsning eller typisk 10.000-15.000 kr. for et professionelt installeret alarmsystem til en villa.',
      'Prisen varierer med boligens størrelse, antal sensorer og valgte funktioner.',
    ],
  },
  {
    q: 'Kan jeg selv sætte en alarm op?',
    a: [
      'Ja, mange enkle alarmsystemer er lavet til gør-det-selv-montering.',
      'Kontrollér, om boligen kræver ekstra sensorer, og om systemet kan udvides, før du vælger.',
    ],
  },
  {
    q: 'Hvad koster en alarm om måneden?',
    a: [
      'Abonnementsløsninger hos store udbydere koster typisk fra ca. 299 kr./md. plus installation.',
      'Den vejledende pris varierer med overvågning, vagtservice, udstyr og bindingsperiode.',
    ],
  },
  {
    q: 'Giver en alarm rabat på forsikringen?',
    a: [
      'Nogle forsikringsselskaber giver rabat, hvis alarmen opfylder bestemte krav.',
      'Tjek din police eller spørg selskabet, før du regner en mulig rabat med i alarmens totalpris.',
    ],
  },
  {
    q: 'Hvad sker der, når alarmen går?',
    a: [
      'En gør-det-selv-alarm sender typisk en notifikation, så du selv skal reagere.',
      'Ved en abonnementsløsning kan en kontrolcentral vurdere alarmen og eventuelt sende en vagt, afhængigt af aftalen.',
    ],
  },
  {
    q: 'Hvad er Altid Hjem?',
    a: [
      'Altid Hjem er en dansk app, der samler madplan, strøm, forsikring og økonomi ét sted, så du får ét overblik, ét login.',
      'Du kan hente den gratis i App Store og Google Play. Boligalarm er ikke i appen endnu, men er blandt de næste tjenester, vi lancerer.',
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

export default function HvadKosterEnTyverialarm() {
  return (
    <Guide
      title="Hvad koster en tyverialarm?"
      lead={
        <>
          <p>
            En tyverialarm koster vejledende fra under 1.000 kr. for en enkel gør-det-selv-løsning til typisk 10.000-15.000 kr. for et professionelt installeret alarmsystem
            til en villa.
          </p>
          <p>
            Vælger du abonnement, starter prisen typisk fra ca. 299 kr./md. plus installation og ofte en bindingsperiode. Den endelige pris afhænger blandt andet af boligens
            størrelse, antal sensorer og behovet for kontrolcentral eller vagtudrykning.
          </p>
        </>
      }
      meta={
        <>
          Opdateret: juli 2026 · Priserne er vejledende markedsintervaller · Se også{' '}
          <a href="https://dkr.dk/indbrud" target="_blank" rel="noopener noreferrer">
            Det Kriminalpræventive Råd om indbrudssikring
          </a>
        </>
      }
      faq={FAQ}
      cta={{
        eyebrow: 'Ét overblik over hjemmets udgifter',
        heading: 'Hent Altid Hjem, og få overblik over husstanden',
        subtitle: 'Appen er gratis og viser jeres faste udgifter og abonnementer i en kalender, før pengene bliver trukket.',
      }}
    >
      <section>
        <h2>Tre måder at købe tyverialarm på</h2>
        <p>
          Den billigste mulighed er normalt en gør-det-selv-alarm. En basisløsning koster typisk 999-2.999 kr. som engangskøb, men prisen varierer med antallet af sensorer,
          kameraer og øvrigt udstyr.
        </p>
        <p>
          Et standardsystem til en villa med professionel installation koster typisk 10.000-15.000 kr. Her afhænger prisen især af boligens indretning, systemets omfang og
          installationsarbejdet.
        </p>
        <p>
          Den tredje mulighed er en abonnementsløsning hos en større udbyder. Den koster typisk fra ca. 299 kr./md. plus installation, og der følger ofte en bindingsperiode
          med.
        </p>
      </section>
      <section>
        <h2>Hvad afhænger prisen på en alarm af?</h2>
        <p>
          Boligens størrelse har stor betydning. En lejlighed med få adgangspunkter kræver normalt mindre udstyr end en villa med flere døre, vinduer og et større
          udendørsareal.
        </p>
        <p>
          Antallet og typen af sensorer påvirker også prisen. Dørkontakter, bevægelsessensorer, røgalarmer og kameraer har forskellige priser, og funktioner som app-styring
          kan gøre løsningen dyrere.
        </p>
        <p>
          Kontrolcentral og vagtudrykning er typisk en del af en abonnementsløsning. Sammenlign derfor ikke kun startprisen, men også service, binding og eventuelle
          omkostninger ved installation eller udrykning.
        </p>
      </section>
      <section>
        <h2>Regn på abonnementet over fem år</h2>
        <p>
          Et alarmabonnement på flere hundrede kroner om måneden bliver til flere tusinde kroner om året. Over fem år kan den løbende betaling derfor fylde mere end den lave
          startpris antyder.
        </p>
        <p>
          Bed udbyderen om en samlet beregning med installation, månedlig betaling, bindingsperiode og mulige tillæg. Sammenlign derefter totalprisen med et system, du selv
          ejer, og vurder samtidig værdien af kontrolcentral og vagtservice.
        </p>
        <p>
          Den billigste løsning ved købet er ikke nødvendigvis den billigste over tid. Omvendt kan et abonnement være pengene værd, hvis professionel overvågning og hjælp ved
          alarm er vigtigt for jer.
        </p>
        <GuideFigure tone="rose" caption="Alarmen er en af hjemmets faste udgifter. Illustration, ikke et skærmbillede fra appen.">
          <AlarmStatusMockup />
        </GuideFigure>
      </section>
      <section>
        <h2>I ferieperioder er indbrudssikring særlig relevant</h2>
        <p>
          Interessen for tyverialarmer topper ofte i august, hvor mange tænker på indbrud i forbindelse med ferie og tomme boliger. En alarm kan være en del af sikringen, men
          den bør ikke stå alene.
        </p>
        <p>
          Få hjemmet til at se beboet ud, undgå synlige tegn på længere fravær, og aftal gerne med en nabo, at post og skraldespand bliver håndteret. Tjek også låse, døre og
          vinduer, før I rejser.
        </p>
      </section>
      <section>
        <h2>Alarmen er en fast udgift i hjemmet</h2>
        <p>
          Alarm, el, mobil og forsikring bliver ofte betalt forskellige steder. Det gør det svært at huske, hvad man reelt betaler hver måned, og hvornår priser eller vilkår
          ændrer sig.
        </p>
        <p>
          Forsikring og alarmsikring kan hænge sammen, fordi nogle forsikringsselskaber giver rabat for bestemte alarmtyper. Det gælder dog ikke alle, så tjek policen og læs
          mere om <A href="/hvad-koster-forsikring">hvad forsikring koster</A>.
        </p>
        <p>
          Vil du samle overblikket over faste udgifter uden at bruge flere separate værktøjer, kan du også læse om et <A href="/spiir-alternativ">alternativ til Spiir</A>.
        </p>
      </section>
      <section>
        <h2>Hvad Altid Hjem kan i dag</h2>
        <p>
          Altid Hjem samler madplan, strøm, forsikring og økonomi i én app, så du får ét overblik, ét login. Boligalarm er ikke i appen endnu, men er blandt de næste
          tjenester, vi lancerer. Tilslut din bank, og se allerede nu dine faste udgifter og abonnementer i en kalender.
        </p>
        <p>
          Altid Hjem er bygget af holdet bag Altid Energi, Danmarks første gebyrfrie energiselskab, hvor mere end 15.000 danskere allerede er kunder. Du kan hente den gratis i
          App Store og Google Play.
        </p>
        <p>Du kan bruge prisguiden her på siden til at sammenligne markedets løsninger.</p>
      </section>
    </Guide>
  )
}
