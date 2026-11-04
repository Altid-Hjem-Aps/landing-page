import type { ReactNode } from 'react'
import Link from 'next/link'
import { jsonLdHtml } from '@/components/site/JsonLd'
import StorePills from '@/components/site/primitives/StorePills'
import './spoergsmaal.css'

// One list for the page and for search engines, so they cannot drift apart.
// answer is the plain text both read; more is what only the page can hold.
const FAQ: { question: string; answer: string; more?: ReactNode }[] = [
  {
    question: 'Hvad er Altid Hjem?',
    answer: 'En app, der samler jeres mad, strøm, forsikringer og økonomi. Ét overblik, ét login.',
  },
  {
    question: 'Hvad koster det?',
    answer:
      'Appen er gratis at hente, og det er gratis at oprette en konto. I betaler kun for det, I selv vælger, for eksempel strøm fra Altid Energi.',
  },
  {
    question: 'Kan appen flytte mine penge?',
    answer: 'Nej. Appen kan kun læse jeres bankdata. Den kan aldrig flytte penge.',
  },
  {
    question: 'Hvordan forbinder jeg min bank?',
    answer: 'Med MitID, i appen. I bestemmer selv, hvad I forbinder.',
  },
  {
    question: 'Hvad kan jeg i appen i dag?',
    answer:
      'Madplan og indkøbsliste med Altid Mad, elpris time for time og forbrug med Altid Energi, jeres forsikringer samlet med Altid Forsikring, og overblik over regninger og forbrug i Økonomi.',
  },
  {
    question: 'Hvor meget kan jeg spare?',
    answer:
      'Det afhænger af jeres husstand. For dagligvarer viser Altid Mad Q3-rapporten, at den samme ugentlige indkøbskurv til en familie på fire koster 21,6 % mindre i den billigste kæde end i den midterste af 13 kæder. Det svarer til 11.207 kr. om året.',
    more: (
      <a href="https://altidmad.dk/altid-mad-kvartalsrapport-q3.pdf" className="fq-link">
        Læs rapporten
      </a>
    ),
  },
  {
    // Worded from the app (app_da.arb 1.0.3): hjemLens*, onboardingStartInviteBody,
    // onboardingPartnerInvitedPrivate. The toggle only shows when both sides have
    // an account to spend from (hjem_lens_toggle.dart).
    question: 'Kan vi bruge den sammen?',
    answer:
      'Ja. Du kan invitere din partner i appen. Når I har både egne og fælles konti, kan I skifte mellem Mine og Fælles, så I kan se jeres egne penge og det, I deler. Du vælger selv, hvilke fælles konti din partner ser, og dine egne konti ser kun du.',
  },
  {
    question: 'Hvor henter jeg den?',
    answer: 'I App Store og Google Play.',
    more: <StorePills position="faq" className="mt-4" />,
  },
  {
    question: 'Hvordan sletter jeg min konto?',
    answer: 'I appen under Mere, Profil, Slet konto.',
    more: (
      <Link href="/slet-konto" className="fq-link">
        Sådan sletter du din konto
      </Link>
    ),
  },
  {
    question: 'Hvem står bag?',
    answer: 'Altid Hjem ApS, holdet bag Altid Energi.',
  },
]

const FAQ_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ.map(({ question, answer }) => ({
    '@type': 'Question',
    name: question,
    acceptedAnswer: { '@type': 'Answer', text: answer },
  })),
}

export default function Spoergsmaal() {
  return (
    <section id="spoergsmaal" className="ah-sec ah-bg-cream">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdHtml(FAQ_JSON_LD)} />
      <div className="ah-wrap fq-grid">
        <h2 className="ah-h2 fq-title">Spørgsmål</h2>
        <div className="fq-list">
          {FAQ.map(({ question, answer, more }, i) => (
            <details key={question} className="fq-item" open={i === 0}>
              <summary className="fq-summary">
                <h3 className="fq-question">{question}</h3>
                <span className="fq-mark" aria-hidden />
              </summary>
              <div className="fq-answer">
                <p className="ah-body">{answer}</p>
                {more}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
