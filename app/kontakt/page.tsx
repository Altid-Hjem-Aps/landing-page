import type { Metadata } from 'next'
import LegalPageLayout, { LegalAddress, LEGAL_H2, LEGAL_LABEL, LEGAL_LINK, LEGAL_RULE } from '@/components/LegalPageLayout'

export const metadata: Metadata = {
  title: 'Support – Altid Hjem',
  description: 'Har du brug for hjælp til Altid Hjem-appen? Skriv til os på hej@altidhjem.dk, så vender vi tilbage hurtigst muligt.',
}

const energiLink = (
  <a href="https://altidenergi.dk" target="_blank" rel="noopener noreferrer" className={LEGAL_LINK}>altidenergi.dk</a>
)

const faq = [
  {
    q: 'Jeg kan ikke logge ind',
    a: <>Skriv til os på <a href="mailto:hej@altidhjem.dk" className={LEGAL_LINK}>hej@altidhjem.dk</a> – så hjælper vi dig videre.</>,
  },
  {
    q: 'Spørgsmål til elforbrug og priser',
    a: <>Dit elforbrug og dine elpriser hører under Altid Energi. Du finder hjælp og kontakt på {energiLink}.</>,
  },
  {
    q: 'Spørgsmål til opladning',
    a: <>Spørgsmål til opladning hører under Altid Energi. Du finder hjælp og kontakt på {energiLink}.</>,
  },
]

export default function Kontakt() {
  return (
    <LegalPageLayout title="Support" meta="Altid Hjem ApS · hej@altidhjem.dk">

      <section className="space-y-6">
        <p className="text-lg text-forest">Har du brug for hjælp til Altid Hjem-appen? Skriv til os, så vender vi tilbage hurtigst muligt.</p>
        <a
          href="mailto:hej@altidhjem.dk"
          className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-[15px] font-medium transition-opacity hover:opacity-90"
          style={{ background: '#90ff7c', color: '#163223' }}
        >
          Skriv til hej@altidhjem.dk
        </a>
      </section>

      <section>
        <h2 className={LEGAL_H2}>Ofte stillede spørgsmål</h2>
        <div>
          {faq.map(({ q, a }) => (
            <div key={q} className="py-4" style={{ borderTop: LEGAL_RULE }}>
              <p className={`${LEGAL_LABEL} mb-1`}>{q}</p>
              <p>{a}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className={LEGAL_H2}>Adresse</h2>
        <LegalAddress name="Altid Hjem ApS">
          <p>Helsinkigade 29, 2150 Nordhavn</p>
          <p><a href="mailto:hej@altidhjem.dk" className={LEGAL_LINK}>hej@altidhjem.dk</a></p>
        </LegalAddress>
      </section>

    </LegalPageLayout>
  )
}
