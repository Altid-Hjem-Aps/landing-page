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
    answer: 'Med MitID i appen. I bestemmer selv, hvad I vil forbinde.',
  },
  {
    question: 'Hvad kan appen i dag?',
    answer:
      'Madplan og indkøbsliste i Altid Mad, elpris time for time og forbrug i Altid Energi, jeres forsikringer samlet i Altid Forsikring og overblik over regninger og forbrug i Økonomi.',
  },
  {
    question: 'Hvor meget kan jeg spare?',
    answer:
      'Det afhænger af jeres husstand. For dagligvarer viser Q3-rapporten fra Altid Mad, at den samme ugentlige indkøbskurv til en familie på fire koster 21,6 % mindre i den billigste kæde end i den midterste af 13 kæder. Det svarer til 11.207 kr. om året.',
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
      'Ja. Du kan invitere din partner i appen. Når I har både egne og fælles konti, kan I skifte mellem Mine og Fælles, så hver af jer kan se sine egne penge og det, I deler. Du vælger selv, hvilke fælles konti din partner ser, og dine egne konti ser kun du.',
  },
  {
    question: 'Hvor henter jeg den?',
    answer: 'I App Store og Google Play.',
    more: <StorePills position="faq" variant="dark" className="mt-4" />,
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

function Item({ question, answer, more, open }: (typeof FAQ)[number] & { open: boolean }) {
  return (
    <details className="fq-item" open={open}>
      <summary className="fq-summary">
        <h3 className="fq-question">{question}</h3>
        <span className="fq-mark" aria-hidden />
      </summary>
      <div className="fq-answer">
        <p className="fq-text">{answer}</p>
        {more}
      </div>
    </details>
  )
}

// Two columns of their own, so opening a question moves nothing in the other one.
const COLUMNS = [FAQ.slice(0, 5), FAQ.slice(5)]

export default function Spoergsmaal() {
  return (
    <section id="spoergsmaal" className="fq-sec">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdHtml(FAQ_JSON_LD)} />
      <h2 className="fq-title">Spørgsmål</h2>
      <div className="fq-grid">
        {COLUMNS.map((column, c) => (
          <div key={c} className="fq-col">
            {column.map((item) => (
              <Item key={item.question} {...item} open={item === FAQ[0]} />
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}
