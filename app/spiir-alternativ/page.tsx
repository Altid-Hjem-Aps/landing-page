import type { Metadata } from 'next'
import Guide, { type GuideFaq } from '@/components/site/Guide'

export const metadata: Metadata = {
  title: 'Spiir-alternativ: Hvad skal du bruge i stedet for Spiir? | Altid Hjem',
  description:
    'Spiir lukkede 8. juni 2026. Leder du efter et Spiir-alternativ, der giver overblik over dine faste udgifter? Altid Hjem samler økonomi, strøm, forsikring og madplan i én app. Hent den gratis.',
}

// FAQ-indholdet bruges to steder: på siden (afsnit for afsnit) og som
// FAQPage-schema (rich results i Google, afsnit samlet til én tekst).
const FAQ: GuideFaq[] = [
  {
    q: 'Er Altid Hjem et alternativ til Spiir?',
    a: [
      'Ja. Altid Hjem kan være et alternativ til Spiir, hvis du primært brugte Spiir til at holde overblik over dine faste udgifter.',
      'Altid Hjem er dog ikke en klassisk budgetapp. Vi samler i stedet hjemmets faste udgifter i én app med ét overblik og ét login.',
    ],
  },
  {
    q: 'Hvad skal jeg bruge i stedet for Spiir?',
    a: [
      'Hvis du vil have en klassisk budgetapp, skal du vælge en løsning, der kategoriserer dine kontobevægelser.',
      'Hvis du derimod vil have bedre overblik over hjemmets faste udgifter, er Altid Hjem bygget som et alternativ til Spiir.',
    ],
  },
  {
    q: 'Er Altid Hjem en budgetapp?',
    a: [
      'Nej. Altid Hjem er ikke en klassisk budgetapp.',
      'Vi fokuserer på hjemmets økonomi og faste udgifter. Du ser, hvad du har tilbage til næste løn. Du ser også dine faste udgifter og abonnementer i en kalender og har madplan, strøm og forsikring samlet i samme app.',
    ],
  },
  {
    q: 'Hvor henter jeg Altid Hjem?',
    a: [
      'Altid Hjem ligger i App Store og Google Play.',
      'Appen er gratis at hente, og du kan bruge knapperne her på siden.',
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

export default function SpiirAlternativ() {
  return (
    <Guide
      title="Spiir lukkede 8. juni 2026: Hvad skal du bruge i stedet?"
      lead={
        <>
          <p>Spiir lukkede den 8. juni 2026 efter 15 år med at hjælpe danskere med at holde overblik over deres økonomi.</p>
          <p>For mange betyder lukningen, at de nu skal finde en ny måde at få styr på budget, faste udgifter og hjemmets økonomi.</p>
          <p>
            Over 500.000 danskere har brugt Spiir til at skabe overblik over deres økonomi. Derfor leder mange nu efter et <strong>Spiir-alternativ</strong>, en
            Spiir-erstatning eller et svar på spørgsmålet: Hvad skal jeg bruge i stedet for Spiir?
          </p>
          <p>Her er det korte svar: Altid Hjem er et alternativ til Spiir, men ikke en klassisk budgetapp.</p>
        </>
      }
      meta="Opdateret: juni 2026"
      faq={FAQ}
      cta={{
        eyebrow: 'Fra Spiir til Altid Hjem',
        heading: 'Hent Altid Hjem, og få overblikket tilbage',
        subtitle: 'Forbind banken med MitID, så ser du dine faste udgifter i en kalender og det, du har tilbage til næste løn.',
      }}
    >
      <section>
        <h2>Et alternativ til Spiir, men ikke en budgetapp</h2>
        <p>Spiir hjalp dig med at se, hvor dine penge blev af. Det var værdifuldt, men overblikket ændrede ikke i sig selv på regningerne.</p>
        <p>Altid Hjem går skridtet videre.</p>
        <p>
          Vi samler hjemmets økonomi og faste udgifter. Strøm, forsikring og madplan. I <strong>én app med ét overblik og ét login</strong>.
        </p>
        <p>I stedet for at holde styr på flere udbydere, flere logins og flere fakturaer får du ét samlet sted med overblik over hjemmets økonomi.</p>
        <p>
          <strong>Uden skjulte gebyrer.</strong>
        </p>
      </section>
      <section>
        <h2>Fra overblik til handling</h2>
        <p>Leder du efter en klassisk budgetapp, der kategoriserer alle dine kontobevægelser, findes der andre løsninger på markedet.</p>
        <p>
          Men hvis du brugte Spiir til at holde styr på dine <strong>faste udgifter</strong>, er Altid Hjem bygget til netop det.
        </p>
        <p>Vi viser dig ikke kun udgifterne. Vi samler dem, så det bliver lettere at forstå og styre hjemmets faste regninger.</p>
      </section>
      <section>
        <h2>Hvem står bag Altid Hjem?</h2>
        <p>Altid Hjem er bygget af holdet bag Altid Energi, hvor mere end 15.000 danskere allerede får gennemsigtig strøm til en fair pris.</p>
        <p>Samme princip tager vi nu videre til resten af hjemmet: Fair priser, gennemsigtighed og færre ting at holde styr på.</p>
      </section>
    </Guide>
  )
}
