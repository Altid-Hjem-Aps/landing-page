import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'

export const metadata: Metadata = {
  title: 'Privatlivspolitik – Altid Hjem',
  description: 'Læs om hvordan Altid Hjem ApS behandler dine personoplysninger.',
}

export default function Privatpolitik() {
  return (
    <>
      <Nav />
      <main className="min-h-screen pt-28 pb-24" style={{ background: 'var(--forest)', fontFamily: 'var(--font-onest)' }}>
        <div className="max-w-2xl mx-auto px-6">

          <Link href="/" className="inline-flex items-center gap-2 text-sm mb-10 transition-opacity hover:opacity-70" style={{ color: 'rgba(255,255,255,0.4)' }}>
            <span>←</span> Tilbage
          </Link>

          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-1">Privatlivspolitik</h1>
          <p className="text-sm mb-2 font-medium" style={{ color: 'rgba(255,255,255,0.45)' }}>Altid Hjem ApS · CVR 45637476 · hej@altidhjem.dk</p>
          <p className="text-xs mb-12" style={{ color: 'rgba(255,255,255,0.3)' }}>Senest opdateret: april 2026</p>

          <div className="space-y-10 text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>

            <section>
              <h2 className="text-white font-semibold text-base mb-3">1. Vi er den dataansvarlige</h2>
              <p className="mb-3">Altid Hjem ApS, CVR 45637476, er dataansvarlig for behandlingen af de personoplysninger, som vi indsamler om dig i forbindelse med din brug af Altid Hjem-appen og vores tilknyttede tjenester (Altid Energi, Altid Forsikring, Altid Mobil m.fl.).</p>
              <p>Har du spørgsmål til vores behandling af dine personoplysninger, er du velkommen til at kontakte os:</p>
              <div className="mt-3 pl-4" style={{ borderLeft: '2px solid rgba(255,255,255,0.1)' }}>
                <p className="font-medium text-white">Altid Hjem ApS</p>
                <p>Helsinkigade 29, 2150 Nordhavn</p>
                <p><a href="mailto:hej@altidhjem.dk" className="underline underline-offset-2 hover:opacity-80">hej@altidhjem.dk</a></p>
              </div>
            </section>

            <section>
              <h2 className="text-white font-semibold text-base mb-3">2. Hvilke oplysninger behandler vi?</h2>
              <div className="space-y-3">
                {[
                  { title: 'Kontaktoplysninger', text: 'Navn, e-mailadresse, telefonnummer og bopælsadresse.' },
                  { title: 'Boligoplysninger', text: 'Adresse, boligtype og relevante oplysninger om dit hjem, som du angiver i appen.' },
                  { title: 'Produkt- og aftaleoplysninger', text: 'Oplysninger om de produkter og aftaler du har hos os eller vores datterselskaber, herunder el, forsikring og mobil.' },
                  { title: 'Forbrugsdata', text: 'Data om dit energiforbrug og øvrige forbrug, som vi modtager fra dig eller fra relevante leverandører og offentlige registre.' },
                  { title: 'Betalingsoplysninger', text: 'Betalingskortoplysninger og øvrige betalingsdata i forbindelse med køb og tilmelding til produkter via appen. Betalingsoplysninger behandles via godkendte betalingsudbydere og opbevares ikke direkte af Altid Hjem.' },
                  { title: 'Tekniske oplysninger', text: 'Oplysninger om din enhed, operativsystem, app-version og brugsadfærd i appen.' },
                  { title: 'Kommunikationsoplysninger', text: 'Korrespondance du har haft med os via e-mail, chat eller support.' },
                ].map(({ title, text }) => (
                  <div key={title}>
                    <p className="font-semibold text-white">{title}</p>
                    <p>{text}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-white font-semibold text-base mb-3">3. Formål og retsgrundlag</h2>
              <div className="space-y-3">
                {[
                  { title: 'Levering og administration af appen og vores tjenester', text: 'Retsgrundlag: Opfyldelse af aftale (GDPR artikel 6, stk. 1, litra b).' },
                  { title: 'Tilmelding til og administration af produkter fra Altid Energi, Altid Forsikring, Altid Mobil og øvrige datterselskaber', text: 'Retsgrundlag: Opfyldelse af aftale (GDPR artikel 6, stk. 1, litra b).' },
                  { title: 'Samling og visning af dine bolig- og forbrugsdata i ét overblik', text: 'Retsgrundlag: Opfyldelse af aftale og legitim interesse (GDPR artikel 6, stk. 1, litra b og f).' },
                  { title: 'Kommunikation og support', text: 'Retsgrundlag: Legitim interesse (GDPR artikel 6, stk. 1, litra f).' },
                  { title: 'Markedsføring og personaliserede tilbud fra Altid Hjem og datterselskaber', text: 'Retsgrundlag: Samtykke (GDPR artikel 6, stk. 1, litra a). Du kan til enhver tid trække dit samtykke tilbage.' },
                  { title: 'Opfyldelse af lovkrav', text: 'Retsgrundlag: Retlig forpligtelse (GDPR artikel 6, stk. 1, litra c).' },
                ].map(({ title, text }) => (
                  <div key={title}>
                    <p className="font-semibold text-white">{title}</p>
                    <p>{text}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-white font-semibold text-base mb-3">4. Deling af oplysninger</h2>
              <div className="space-y-3">
                <div>
                  <p className="font-semibold text-white">Datterselskaber i Altid Hjem-koncernen</p>
                  <p>Herunder Altid Energi, Altid Forsikring og Altid Mobil, i det omfang det er nødvendigt for at levere de tjenester, du har tilmeldt dig eller ønsker at tilmelde dig. Bemærk at de enkelte datterselskaber er selvstændige dataansvarlige for den behandling, der sker i forbindelse med deres egne produkter og aftaler. Altid Energis datapolitik kan læses på <a href="https://altidenergi.dk/datapolitik/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:opacity-80">altidenergi.dk/datapolitik</a>.</p>
                </div>
                <div>
                  <p className="font-semibold text-white">Databehandlere</p>
                  <p>Som behandler oplysninger på vores vegne, herunder udbydere af hosting, betalingsinfrastruktur, kundesupport og analyseværktøjer. Alle databehandlere er underlagt en databehandleraftale og må kun behandle dine oplysninger efter vores instruks.</p>
                </div>
                <div>
                  <p className="font-semibold text-white">Offentlige myndigheder</p>
                  <p>Hvis vi er retligt forpligtet hertil.</p>
                </div>
                <p>Vi sælger ikke dine personoplysninger til tredjeparter.</p>
              </div>
            </section>

            <section>
              <h2 className="text-white font-semibold text-base mb-3">5. Overførsler til tredjelande</h2>
              <p>Hvis vi overfører dine oplysninger til lande uden for EU/EØS, sker det udelukkende på grundlag af et lovligt overførselsgrundlag, herunder EU-Kommissionens standardkontraktbestemmelser. Du kan få nærmere oplysninger ved at kontakte os.</p>
            </section>

            <section>
              <h2 className="text-white font-semibold text-base mb-3">6. Opbevaring</h2>
              <p className="mb-3">Vi opbevarer dine personoplysninger så længe det er nødvendigt til de formål, de er indsamlet til, eller så længe vi er forpligtet til det efter lovgivningen. Generelt gælder:</p>
              <ul className="space-y-1.5 list-disc list-inside">
                <li>Kundedata opbevares i op til 5 år efter aftalens ophør af hensyn til bogføringsloven.</li>
                <li>Tekniske logs og brugsdata slettes løbende og typisk inden for 12 måneder.</li>
                <li>Oplysninger indsamlet på baggrund af samtykke slettes, når samtykket trækkes tilbage, medmindre andet retsgrundlag gælder.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-white font-semibold text-base mb-3">7. Dine rettigheder</h2>
              <p className="mb-3">Du har følgende rettigheder i henhold til databeskyttelsesforordningen:</p>
              <ul className="space-y-2">
                {[
                  { right: 'Indsigt', desc: 'Du kan anmode om at se de oplysninger, vi behandler om dig.' },
                  { right: 'Berigtigelse', desc: 'Du kan bede os om at rette unøjagtige oplysninger.' },
                  { right: 'Sletning', desc: 'Du kan i visse tilfælde bede os om at slette dine oplysninger.' },
                  { right: 'Begrænsning', desc: 'Du kan bede os om at begrænse behandlingen af dine oplysninger.' },
                  { right: 'Dataportabilitet', desc: 'Du kan i visse tilfælde anmode om at modtage dine oplysninger i et struktureret, maskinlæsbart format.' },
                  { right: 'Indsigelse', desc: 'Du kan gøre indsigelse mod vores behandling, herunder mod direkte markedsføring.' },
                  { right: 'Tilbagetrækning af samtykke', desc: 'Du kan til enhver tid trække et samtykke tilbage, uden at dette berører lovligheden af behandlingen forud for tilbagetrækningen.' },
                ].map(({ right, desc }) => (
                  <li key={right} className="flex gap-2">
                    <span className="font-semibold text-white shrink-0">{right}:</span>
                    <span>{desc}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3">Du udøver dine rettigheder ved at kontakte os på <a href="mailto:hej@altidhjem.dk" className="underline underline-offset-2 hover:opacity-80">hej@altidhjem.dk</a>. Vi besvarer din henvendelse inden for 30 dage.</p>
            </section>

            <section>
              <h2 className="text-white font-semibold text-base mb-3">8. Klage</h2>
              <p className="mb-3">Hvis du er utilfreds med vores behandling af dine personoplysninger, har du ret til at indgive en klage til Datatilsynet:</p>
              <div className="pl-4" style={{ borderLeft: '2px solid rgba(255,255,255,0.1)' }}>
                <p className="font-medium text-white">Datatilsynet</p>
                <p>Carl Jacobsens Vej 35, 2500 Valby</p>
                <p><a href="mailto:dt@datatilsynet.dk" className="underline underline-offset-2 hover:opacity-80">dt@datatilsynet.dk</a></p>
                <p><a href="https://www.datatilsynet.dk" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:opacity-80">datatilsynet.dk</a></p>
              </div>
            </section>

            <section>
              <h2 className="text-white font-semibold text-base mb-3">9. Ændringer</h2>
              <p>Vi opdaterer løbende denne privatlivspolitik. Den gældende version er altid tilgængelig i appen og på vores hjemmeside. Væsentlige ændringer vil blive kommunikeret til dig via appen eller e-mail.</p>
            </section>

          </div>
        </div>
      </main>
    </>
  )
}
