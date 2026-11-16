import type { Metadata } from 'next'
import { KONTAKT, NAV } from '@/components/site/copy'
import { dmSans } from '@/components/site/fonts'
import Reveal from '@/components/site/Reveal'
import SiteFooter from '@/components/site/SiteFooter'
import SiteNav from '@/components/site/SiteNav'
import '../site.css'

export const metadata: Metadata = {
  title: 'Support | Altid Hjem',
  description: 'Har du brug for hjælp til Altid Hjem-appen? Skriv til os på hej@altidhjem.dk, så vender vi tilbage hurtigst muligt.',
}

// "Altid Hjem-appen" stays on one line on a phone, instead of breaking at its hyphen.
const APP_NAME = 'Altid Hjem-appen'
const lead = KONTAKT.lead.split(APP_NAME)
if (lead.length !== 2) throw new Error('KONTAKT.lead must name Altid Hjem-appen once')

// The two questions, word for word from the old page. Altid Energi's first, in blue (Thor 15/11),
// in two paragraphs broken where he wrote them; on a phone the lines wrap on their own (.kt-br).
const FAQ = [
  {
    tone: 'sky',
    q: 'Spørgsmål til min elregning, mit forbrug eller opladning',
    a: [
      <>
        Vores venner hos Altid Energi hjælper dig bedst med <br className="kt-br" />
        spørgsmål om din elregning, dit forbrug eller opladning.
      </>,
      <>
        Du kan skrive til <a href="mailto:hej@altidenergi.dk">hej@altidenergi.dk</a> eller ringe på{' '}
        <a href="tel:+4544440440" className="kt-nowrap">
          44 440 440
        </a>
        . <br className="kt-br" />
        De sidder klar ved telefonen mandag til fredag fra kl. 9.00 til 15.30.
      </>,
    ],
  },
  {
    tone: 'mint',
    q: 'Jeg kan ikke logge ind',
    a: [
      <>
        Skriv til os på <a href="mailto:hej@altidhjem.dk">hej@altidhjem.dk</a>, så hjælper vi dig videre.
      </>,
    ],
  },
] as const

// The Kontakt page in the new site's look, like /presse (Thor 15/11: it looked like the old
// site): the new nav and footer, the title with the mail button, the two questions as tinted
// cards like the front page's blocks, and the company's address on a Dark forest panel.
export default function Kontakt() {
  return (
    <div className={`site ${dmSans.variable}`}>
      <a href="#indhold" className="skip">
        {NAV.skip}
      </a>
      <SiteNav base="/" />
      <main id="indhold" className="pz kt">
        <header className="pz-head">
          <h1 className="t-h1" data-rise="0">
            {KONTAKT.title}
          </h1>
          <p className="t-body pz-lead" data-rise="1">
            {lead[0]}
            <span className="kt-nowrap">{APP_NAME}</span>
            {lead[1]}
          </p>
          <a className="kt-mail" href={KONTAKT.mail.href} data-rise="2">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3.5 6.5h17v11h-17zM3.5 7l8.5 6.5L20.5 7" />
            </svg>
            {KONTAKT.mail.text}
          </a>
        </header>

        <section className="pz-sec" aria-labelledby="kt-faq">
          <h2 id="kt-faq" className="t-h2" data-reveal>
            {KONTAKT.faqTitle}
          </h2>
          <ul className="kt-faq">
            {FAQ.map((item) => (
              <li key={item.q} data-tone={item.tone} data-reveal>
                <h3>{item.q}</h3>
                {item.a.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </li>
            ))}
          </ul>
        </section>

        {/* No "Adresse" heading (Thor 15/11): the company's name heads the panel. */}
        <section className="pz-contact kt-contact" data-surface="dark" aria-labelledby="kt-address" data-reveal>
          <h2 id="kt-address" className="pz-contact-name">
            {KONTAKT.company}
          </h2>
          <p className="pz-contact-lines">
            <span>{KONTAKT.address}</span>
            <a href={`mailto:${KONTAKT.email}`}>{KONTAKT.email}</a>
          </p>
        </section>
      </main>
      <SiteFooter base="/" />
      <Reveal />
    </div>
  )
}
