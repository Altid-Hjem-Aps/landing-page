import type { Metadata } from 'next'
import Link from 'next/link'
import LegalPageLayout, { LegalAddress, LEGAL_H2, LEGAL_LABEL, LEGAL_LINK, LEGAL_LIST } from '@/components/LegalPageLayout'

export const metadata: Metadata = {
  title: 'Slet din konto | Altid Hjem',
  description: 'Sådan sletter du din Altid Hjem-konto, og hvad der sker med dine data.',
}

export default function SletKonto() {
  return (
    <LegalPageLayout title="Slet din Altid Hjem-konto" meta="Altid Hjem ApS · CVR 45637476" updated="november 2026">

      <section>
        <p>På denne side kan du læse, hvordan du sletter din Altid Hjem-konto, og hvad der sker med dine data, når kontoen slettes.</p>
      </section>

      <section className="space-y-4">
        <h2 className={LEGAL_H2}>Sådan sletter du din konto</h2>
        <p>Du kan slette din Altid Hjem-konto direkte i appen under <span className={LEGAL_LABEL}>Profil → Slet konto</span>.</p>
        <p>Du kan også skrive til <a href="mailto:hej@altidhjem.dk?subject=Slet%20min%20konto" className={LEGAL_LINK}>hej@altidhjem.dk</a> med emnet <span className={LEGAL_LABEL}>&ldquo;Slet min konto&rdquo;</span> fra den e-mailadresse, du brugte til din konto, så hjælper vi dig videre.</p>
      </section>

      <section className="space-y-4">
        <h2 className={LEGAL_H2}>Hvad bliver slettet?</h2>
        <p>Når du sletter din konto, fjerner vi din konto og dine appdata. Har du forbundet din bank, bliver dine bankdata også slettet hos Subaio.</p>
        <p>Oplysninger, som vi er retligt forpligtede til at opbevare, fx bogføringsmateriale efter bogføringsloven samt aftale- og betalingshistorik, opbevares i op til 5 år efter kundeforholdets ophør og slettes derefter. Du kan læse mere i vores <Link href="/privatlivspolitik" className={LEGAL_LINK}>privatlivspolitik</Link>.</p>
      </section>

      <section className="space-y-4">
        <h2 className={LEGAL_H2}>Efter sletningen</h2>
        <ul className={LEGAL_LIST}>
          <li>Din elaftale hos Altid Energi fortsætter som før. Vil du også opsige den, skal du kontakte Altid Energi på <a href="mailto:hej@altidenergi.dk" className={LEGAL_LINK}>hej@altidenergi.dk</a>.</li>
          <li>Din e-mailadresse kan ikke bruges til at oprette en ny konto i Altid Hjem de næste 90 dage.</li>
        </ul>
        <p>Fortryder du inden da? Så skriv til os fra den e-mailadresse, du brugte til din konto. Vi undersøger gerne, om vi kan hjælpe dig tilbage.</p>
      </section>

      <section>
        <h2 className={LEGAL_H2}>Kontakt</h2>
        <LegalAddress name="Altid Hjem ApS">
          <p>CVR 45637476</p>
          <p>c/o Mad House HQ ApS</p>
          <p>Helsinkigade 29, 2150 Nordhavn</p>
          <p><a href="mailto:hej@altidhjem.dk" className={LEGAL_LINK}>hej@altidhjem.dk</a></p>
        </LegalAddress>
      </section>

    </LegalPageLayout>
  )
}
