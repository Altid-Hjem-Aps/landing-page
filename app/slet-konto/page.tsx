import type { Metadata } from 'next'
import Link from 'next/link'
import LegalPageLayout, { LegalAddress, LEGAL_H2, LEGAL_LABEL, LEGAL_LINK } from '@/components/LegalPageLayout'

export const metadata: Metadata = {
  title: 'Slet din konto – Altid Hjem',
  description: 'Sådan sletter du din Altid Hjem-konto, og hvad der sker med dine data.',
}

export default function SletKonto() {
  return (
    <LegalPageLayout title="Slet din Altid Hjem-konto" meta="Altid Hjem ApS · CVR 45637476" updated="juni 2026">

      <section>
        <p>På denne side kan du læse, hvordan du sletter din Altid Hjem-konto, og hvad der sker med dine data, når kontoen slettes.</p>
      </section>

      <section className="space-y-4">
        <h2 className={LEGAL_H2}>Sådan sletter du din konto</h2>
        <p>Send en e-mail til <a href="mailto:hej@altidhjem.dk?subject=Slet%20min%20konto" className={LEGAL_LINK}>hej@altidhjem.dk</a> med emnet <span className={LEGAL_LABEL}>&ldquo;Slet min konto&rdquo;</span> fra den e-mailadresse, din konto er oprettet med. Som sikkerhed sender vi en bekræftelse til din kontos e-mailadresse, og sletningen gennemføres først, når du har bekræftet. Din konto slettes herefter inden for 30 dage.</p>
        <p>Vi arbejder på, at du snart kan slette din konto direkte i appen under <span className={LEGAL_LABEL}>Profil → Slet konto</span>. Denne side bliver opdateret, når funktionen er klar.</p>
      </section>

      <section className="space-y-4">
        <h2 className={LEGAL_H2}>Hvad bliver slettet</h2>
        <p>Når din konto slettes, fjerner vi din profil og dine kontaktoplysninger, dine app-data og dit login.</p>
        <p>Oplysninger, som vi er retligt forpligtede til at opbevare – fx bogføringsmateriale efter bogføringsloven samt aftale- og betalingshistorik – opbevares i op til 5 år efter kundeforholdets ophør og slettes derefter. Du kan læse mere i vores <Link href="/privatlivspolitik" className={LEGAL_LINK}>privatlivspolitik</Link>.</p>
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
