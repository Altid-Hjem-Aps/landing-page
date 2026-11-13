import type { Metadata } from 'next'
import MobilOverblikMockup from '@/components/MobilOverblikMockup'
import Guide, { GuideFigure, GuideLink as A, type GuideFaq } from '@/components/site/Guide'

export const metadata: Metadata = {
  title: 'Billigste mobilabonnement i 2026 | Altid Hjem',
  description:
    'Find det billigste mobilabonnement til hele husstanden. Se vejledende priser, typiske faldgruber og få en enkel tjekliste. Hent Altid Hjem, og få overblik over husstanden.',
  alternates: { canonical: 'https://altidhjem.dk/billigste-mobilabonnement' },
  openGraph: {
    title: 'Det billigste mobilabonnement til hele husstanden',
    description:
      'Find det billigste mobilabonnement til hele husstanden. Se vejledende priser, typiske faldgruber og få en enkel tjekliste. Hent Altid Hjem, og få overblik over husstanden.',
    url: 'https://altidhjem.dk/billigste-mobilabonnement',
    type: 'article',
  },
}

// FAQ bruges to steder: synligt på siden og som FAQPage-schema (rich results).
const FAQ: GuideFaq[] = [
  {
    q: 'Hvad er det billigste mobilabonnement?',
    a: [
      'Det billigste mobilabonnement fås vejledende fra ca. 19 kr./md.',
      'Det er typisk en enkel lavprisløsning, og den bedste pris for dig afhænger af data, tale, roaming og dækning.',
    ],
  },
  {
    q: 'Er lavprisselskaberne lige så gode som de store?',
    a: [
      'Discountselskaber kan bruge samme mobilnet som større selskaber og derfor have tilsvarende dækning.',
      'Roaming, kundeservice, ekstratjenester og vilkår kan dog variere, så sammenlign mere end månedsprisen.',
    ],
  },
  {
    q: 'Hvor meget data har jeg brug for?',
    a: [
      'Du har brug for en datamængde, der matcher dit reelle mobilforbrug uden en stor ubrugt buffer.',
      'Se forbruget i din nuværende udbyders app eller på fakturaerne, og husk, at behovet kan stige, hvis du ofte streamer uden wi-fi.',
    ],
  },
  {
    q: 'Kan jeg skifte mobilselskab med det samme?',
    a: [
      'Ofte ja, fordi ingen binding er normen i Danmark.',
      'Tjek alligevel opsigelsesvarsel og eventuel telefonafbetaling, og lad normalt det nye selskab håndtere nummerflytningen.',
    ],
  },
  {
    q: 'Hvor meget kan en husstand spare på mobil?',
    a: [
      'Det afhænger af antallet af abonnementer, jeres nuværende priser og det faktiske forbrug.',
      'Flere hundrede kroner om måneden kan være muligt, når flere aftaler er gamle eller har ubrugte tillæg, men besparelsen kan også være mindre.',
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

export default function BilligsteMobilabonnement() {
  return (
    <Guide
      title="Det billigste mobilabonnement til hele husstanden"
      lead={
        <>
          <p>
            Det billigste mobilabonnement fås vejledende fra ca. 19 kr./md. Det er typisk et enkelt mobilabonnement med begrænset data eller taletid, mens fri tale ofte
            starter ved ca. 29-49 kr./md.
          </p>
          <p>
            Den laveste pris er dog ikke nødvendigvis billigst for jer. Se på data, dækning og vilkår, men især på hele husstandens mobiludgift, når I sammenligner.
          </p>
        </>
      }
      meta={<>Opdateret: juli 2026</>}
      faq={FAQ}
      cta={{
        eyebrow: 'Ét overblik over hele husstanden',
        heading: 'Hent Altid Hjem, og få overblik over husstanden',
        subtitle: 'Appen er gratis og viser husstandens faste udgifter og abonnementer i en kalender, før pengene bliver trukket.',
      }}
    >
      <section>
        <h2>Hvad koster mobilabonnementer i 2026?</h2>
        <p>
          De billigste mobilabonnementer fås vejledende fra ca. 19 kr./md. Prisen gælder typisk en enkel løsning fra et taletids- eller lavprisselskab, hvor data og øvrige
          tjenester kan være begrænsede.
        </p>
        <p>
          Abonnementer med fri tale koster typisk fra ca. 29-49 kr./md. Den konkrete pris varierer blandt andet med datamængde, roaming, netværk og inkluderede tjenester.
        </p>
        <p>
          Nul måneders binding er normen i Danmark. Tjek dog altid opsigelsesvarsel, eventuel afbetaling på telefonen og vilkårene for nummerflytning, før du skifter.
        </p>
        <p>
          Læs også vores guide til at <A href="/opsig-abonnementer">opsige de abonnementer</A>, I ikke længere bruger.
        </p>
      </section>
      <section>
        <h2>Hvorfor den laveste pris ikke altid er billigst</h2>
        <p>
          Et abonnement er kun billigt, hvis det passer til dit forbrug. For lidt data kan give ekstraudgifter, mens en stor datapakke er spild af penge, hvis du næsten altid
          bruger wi-fi.
        </p>
        <p>
          Se også på EU-roaming, dækning dér, hvor du bor og arbejder, samt adgang til kundeservice. Discountselskaber bruger ofte samme mobilnet som større selskaber, men
          vilkår og service kan være forskellige.
        </p>
        <p>
          Det vigtigste overses let, fordi en husstand ofte har tre til fem abonnementer fordelt på flere selskaber. En lille overpris på hver aftale kan derfor betyde mere
          end en meget lav kampagnepris på ét SIM-kort.
        </p>
      </section>
      <section>
        <h2>Den skjulte udgift ligger i hele husstanden</h2>
        <p>
          For et par eller en familie er det sjældent nok at sammenligne ét abonnement. Børn og voksne kan have forskellige aftaler, gamle priser og tillæg, som ingen længere
          bruger.
        </p>
        <p>
          Problemet er ikke nødvendigvis den enkelte pris, men manglen på overblik. Når aftalerne ligger i forskellige apps, mails og netbankposter, er det svært at se
          husstandens reelle mobiludgift.
        </p>
        <p>
          Et budgetværktøj kan vise betalingerne, men fortæller ikke altid, om aftalerne passer til jeres behov. Se, hvordan Altid Hjem adskiller sig fra et traditionelt
          budgetoverblik, i vores guide til et <A href="/spiir-alternativ">alternativ til Spiir</A>.
        </p>
        <GuideFigure
          tone="lavender"
          caption="Et samlet overblik viser husstandens mobilaftaler ét sted og gør det tydeligt, hvor I betaler for meget. Illustration, ikke et skærmbillede fra appen."
        >
          <MobilOverblikMockup />
        </GuideFigure>
      </section>
      <section>
        <h2>Sådan tjekker I mobilaftalerne i dag</h2>
        <p>
          Start med at skrive alle husstandens abonnementer ned. Notér person, selskab, månedspris, data, fri tale, roaming, tillæg og eventuel afbetaling på en telefon.
        </p>
        <p>
          Åbn derefter hver faktura og sammenlign det inkluderede forbrug med det faktiske forbrug. Kig især efter ubrugte datapakker, ekstra tjenester og rabatter, der er
          udløbet.
        </p>
        <p>
          Sammenlign nye priser på samme tidspunkt, så I vurderer alle aftaler på ens vilkår. Husk at kontrollere dækning og nummerflytning, før I beslutter jer.
        </p>
        <p>
          Gentag gennemgangen med jævne mellemrum. Når mobilabonnementerne er på plads, kan I bruge samme metode på andre faste udgifter, eksempelvis ved at undersøge det{' '}
          <A href="/billigste-elselskab">billigste elselskab</A>.
        </p>
      </section>
      <section>
        <h2>Hvad Altid Hjem kan i dag</h2>
        <p>Altid Hjem samler madplan, strøm, forsikring og økonomi i én app, så I får ét overblik, ét login.</p>
        <p>
          Forbinder I banken, ser I jeres faste udgifter og abonnementer i en kalender, før pengene bliver trukket. Mobilabonnementer er ikke i appen endnu, men er blandt de
          næste tjenester, vi lancerer.
        </p>
        <p>
          Altid Hjem er bygget af holdet bag Altid Energi, Danmarks første gebyrfrie energiselskab, hvor mere end 15.000 danskere allerede er kunder.
        </p>
      </section>
    </Guide>
  )
}
