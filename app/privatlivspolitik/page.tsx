import type { Metadata } from 'next'
import LegalPageLayout, { LegalAddress, LEGAL_H2, LEGAL_LABEL, LEGAL_LINK, LEGAL_LIST } from '@/components/LegalPageLayout'

export const metadata: Metadata = {
  title: 'Privatlivspolitik – Altid Hjem',
  description: 'Læs om hvordan Altid Hjem ApS behandler dine personoplysninger.',
}

const OPLYSNINGER = [
  { title: 'Kontaktoplysninger', text: 'Navn, e-mailadresse, telefonnummer og bopælsadresse.' },
  { title: 'Boligoplysninger', text: 'Adresse, boligtype og relevante oplysninger om dit hjem, som du angiver i appen.' },
  { title: 'Produkt- og aftaleoplysninger', text: 'Oplysninger om de produkter og aftaler du har hos os eller vores datterselskaber, herunder el, forsikring og mobil.' },
  { title: 'Forbrugsdata', text: 'Data om dit energiforbrug og øvrige forbrug, som vi modtager fra dig eller fra relevante leverandører og offentlige registre.' },
  { title: 'Betalingsoplysninger', text: 'Betalingskortoplysninger og øvrige betalingsdata i forbindelse med køb og tilmelding til produkter via appen. Betalingsoplysninger behandles via godkendte betalingsudbydere og opbevares ikke direkte af Altid Hjem.' },
  { title: 'Tekniske oplysninger', text: 'Oplysninger om din enhed, operativsystem, app-version og brugsadfærd i appen.' },
  { title: 'Henvisningsoplysninger', text: 'Når du deler eller kopierer dit personlige henvisningslink i appen, og når nogen klikker på det, registrerer vi hændelsen. For hver hændelse gemmer vi tidspunkt, land, browsertype og en hashværdi af IP-adressen med et dagligt skiftende tilfældigt tillæg, men aldrig selve IP-adressen. Det personlige link viser, hvilken kunde et klik hører til. Oplysningerne bruges til at tælle henvisninger på grundlag af vores legitime interesse i at drive henvisningsordningen og slettes efter 90 dage. Vi bruger ikke cookies.' },
  { title: 'Kommunikationsoplysninger', text: 'Korrespondance du har haft med os via e-mail, chat eller support.' },
]

const FORMAAL = [
  { title: 'Levering og administration af appen og vores tjenester', text: 'Retsgrundlag: Opfyldelse af aftale (GDPR artikel 6, stk. 1, litra b).' },
  { title: 'Tilmelding til og administration af produkter fra Altid Forsikring, Altid Mobil og øvrige datterselskaber', text: 'Retsgrundlag: Opfyldelse af aftale (GDPR artikel 6, stk. 1, litra b).' },
  { title: 'Modtagelse af kontaktoplysninger fra Altid Energi og videregivelse af kontaktoplysninger til Altid Energi i forbindelse med oprettelse af kundeforhold', text: 'Retsgrundlag: Dit samtykke (GDPR artikel 6, stk. 1, litra a).' },
  { title: 'Samling og visning af dine bolig- og forbrugsdata i ét overblik', text: 'Retsgrundlag: Opfyldelse af aftale og legitim interesse (GDPR artikel 6, stk. 1, litra b og f).' },
  { title: 'Kommunikation og support', text: 'Retsgrundlag: Legitim interesse (GDPR artikel 6, stk. 1, litra f).' },
  { title: 'Markedsføring og personaliserede tilbud fra Altid Hjem og datterselskaber', text: 'Retsgrundlag: Samtykke (GDPR artikel 6, stk. 1, litra a). Du kan til enhver tid trække dit samtykke tilbage.' },
  { title: 'Opfyldelse af lovkrav', text: 'Retsgrundlag: Retlig forpligtelse (GDPR artikel 6, stk. 1, litra c).' },
]

const RETTIGHEDER = [
  { right: 'Indsigt', desc: 'Du kan anmode om at se de oplysninger, vi behandler om dig.' },
  { right: 'Berigtigelse', desc: 'Du kan bede os om at rette unøjagtige oplysninger.' },
  { right: 'Sletning', desc: 'Du kan i visse tilfælde bede os om at slette dine oplysninger.' },
  { right: 'Begrænsning', desc: 'Du kan bede os om at begrænse behandlingen af dine oplysninger.' },
  { right: 'Dataportabilitet', desc: 'Du kan i visse tilfælde anmode om at modtage dine oplysninger i et struktureret, maskinlæsbart format.' },
  { right: 'Indsigelse', desc: 'Du kan gøre indsigelse mod vores behandling, herunder mod direkte markedsføring.' },
  { right: 'Tilbagetrækning af samtykke', desc: 'Du kan til enhver tid trække et samtykke tilbage, uden at dette berører lovligheden af behandlingen forud for tilbagetrækningen.' },
]

const mail = <a href="mailto:hej@altidhjem.dk" className={LEGAL_LINK}>hej@altidhjem.dk</a>
const energiDatapolitik = (
  <a href="https://altidenergi.dk/datapolitik/" target="_blank" rel="noopener noreferrer" className={LEGAL_LINK}>altidenergi.dk/datapolitik</a>
)

export default function Privatlivspolitik() {
  return (
    <LegalPageLayout title="Privatlivspolitik" meta="Altid Hjem ApS · CVR 45637476" updated="september 2026">

      <section className="space-y-4">
        <h2 className={LEGAL_H2}>1. Vi er den dataansvarlige</h2>
        <p>Altid Hjem ApS, CVR 45637476, er dataansvarlig for behandlingen af de personoplysninger, som vi indsamler om dig i forbindelse med din brug af Altid Hjem-appen, vores websteder (herunder altidhjem.dk, altidmad.dk og altidforsikring.dk) og vores tilknyttede tjenester (Altid Mad, Altid Forsikring, Altid Mobil m.fl.). Altid Mad og Altid Forsikring er brands under Altid Hjem ApS, som er dataansvarlig for de personoplysninger, du afgiver via altidmad.dk og altidforsikring.dk.</p>
        <p>Når du via appen opretter dig som kunde hos eller tilgår din selvbetjening hos Altid Energi, er det Altid Energi ApS (CVR 44373580), der er selvstændig dataansvarlig for behandlingen af dine personoplysninger som elkunde. Du kan læse om Altid Energis behandling af personoplysninger på {energiDatapolitik}.</p>
        <p>Har du spørgsmål til vores behandling af dine personoplysninger, er du velkommen til at kontakte os:</p>
        <LegalAddress name="Altid Hjem ApS">
          <p>Helsinkigade 29, 2150 Nordhavn</p>
          <p>{mail}</p>
        </LegalAddress>
      </section>

      <section className="space-y-4">
        <h2 className={LEGAL_H2}>2. Venteliste (før lancering)</h2>
        <p>Indtil Altid Hjem-appen er lanceret, kan du tilmelde dig ventelisterne via altidhjem.dk, altidmad.dk eller altidforsikring.dk. Ventelisterne for Altid Hjem og Altid Mad er én fælles venteliste, mens Altid Forsikring har sin egen separate venteliste. Altid Hjem ApS er dataansvarlig for alle tre ventelister. Følgende særlige regler gælder for behandlingen af oplysninger fra ventelisterne – afsnit 8 (Dine rettigheder) og afsnit 9 (Klage) gælder også for ventelisteoplysninger.</p>
        <div>
          <p className={LEGAL_LABEL}>Hvilke oplysninger indsamler vi?</p>
          <ul className={`${LEGAL_LIST} mt-2`}>
            <li>Navn</li>
            <li>E-mailadresse</li>
            <li>Mobilnummer (valgfrit)</li>
            <li>Valgfrie svar på spørgsmål om din husstand og energiforbrug</li>
            <li>Hvilken side du tilmeldte dig fra, og dermed hvilken af vores tjenester (fx Altid Forsikring) du har vist interesse for</li>
            <li>Om du er tilmeldt via en invitation fra en anden person på ventelisten</li>
            <li>Oplysninger om din interaktion med vores e-mails (om en e-mail åbnes, og hvilke links der klikkes på)</li>
          </ul>
        </div>
        <div>
          <p className={LEGAL_LABEL}>Formål og retsgrundlag</p>
          <p>Vi behandler oplysningerne for at kunne give dig besked, når Altid Hjem og de tilknyttede tjenester – herunder Altid Mad og Altid Forsikring – lanceres, og for at forstå, hvem vores tidlige brugere er. Retsgrundlaget er dit samtykke (GDPR artikel 6, stk. 1, litra a), som du til enhver tid kan trække tilbage via afmeldingslinket i vores e-mails eller ved at skrive til {mail}. Selve lanceringsbeskeden er markedsføring efter markedsføringslovens § 10, men sendes på grundlag af din tilmelding til ventelisten, som udgør dit forudgående, specifikke samtykke til netop den besked; den indeholder kun information om lancering og adgang.</p>
        </div>
        <div>
          <p className={LEGAL_LABEL}>E-mailstatistik</p>
          <p>Vores e-mails kan indeholde en lille sporingspixel og sporbare links, der fortæller os, om en e-mail bliver åbnet, og hvilke links der klikkes på. Vi bruger oplysningerne til at måle og forbedre vores kommunikation. Behandlingen sker på grundlag af dit samtykke og ophører fremadrettet, hvis du afmelder dig via afmeldingslinket i vores e-mails — allerede indsamlede oplysninger slettes efter opbevaringsreglerne nedenfor. I de fleste e-mailprogrammer kan du desuden undgå åbningsregistrering ved at slå automatisk billedvisning fra. Vores e-mails udsendes via vores databehandler Resend; eventuelle overførsler til lande uden for EU/EØS sker som beskrevet i afsnit 6.</p>
        </div>
        <div>
          <p className={LEGAL_LABEL}>Opbevaring</p>
          <p>Dine ventelisteoplysninger opbevares sikkert hos vores databehandlere i EU/EØS og slettes senest 12 måneder efter lanceringen af den tjeneste, du har skrevet dig op til, eller tidligere hvis du anmoder om det.</p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className={LEGAL_H2}>3. Hvilke oplysninger behandler vi?</h2>
        {OPLYSNINGER.map(({ title, text }) => (
          <div key={title}>
            <p className={LEGAL_LABEL}>{title}</p>
            <p>{text}</p>
          </div>
        ))}
      </section>

      <section className="space-y-4">
        <h2 className={LEGAL_H2}>4. Formål og retsgrundlag</h2>
        {FORMAAL.map(({ title, text }) => (
          <div key={title}>
            <p className={LEGAL_LABEL}>{title}</p>
            <p>{text}</p>
          </div>
        ))}
      </section>

      <section className="space-y-4">
        <h2 className={LEGAL_H2}>5. Deling af oplysninger</h2>
        <div>
          <p className={LEGAL_LABEL}>Tjenester og datterselskaber i Altid Hjem-koncernen</p>
          <p>Herunder Altid Mad, Altid Forsikring og Altid Mobil, i det omfang det er nødvendigt for at levere de tjenester, du har tilmeldt dig eller ønsker at tilmelde dig. Altid Hjem ApS er dataansvarlig for de personoplysninger, du afgiver til Altid Hjem, Altid Mad og Altid Forsikring, og deler kun relevante oplysninger med de enkelte tjenester i det omfang, det er nødvendigt for at levere dem til dig. Bemærk at et selvstændigt selskab kan være selvstændig dataansvarlig for den behandling, der sker i forbindelse med dets egne produkter og aftaler.</p>
        </div>
        <div className="space-y-2">
          <p className={LEGAL_LABEL}>Datadeling med Altid Energi</p>
          <p>Datadeling mellem Altid Hjem og Altid Energi forudsætter altid dit aktive samtykke i appen og kan gå begge veje:</p>
          <ul className={LEGAL_LIST}>
            <li><span className={LEGAL_LABEL}>Modtagelse af data fra Altid Energi:</span> Hvis du er elkunde hos Altid Energi og samtykker til at oprette en konto hos Altid Hjem, modtager vi følgende oplysninger fra Altid Energi: navn, e-mailadresse, telefonnummer og adresse.</li>
            <li><span className={LEGAL_LABEL}>Videregivelse af data til Altid Energi:</span> Hvis du som Altid Hjem-kunde samtykker til at oprette dig som elkunde hos Altid Energi, videregiver vi de til enhver tid gældende oplysninger, der er nødvendige for oprettelse af et elkundeforhold.</li>
          </ul>
          <p>Samtykket er engangs – det udløser én konkret overførsel og er forbrugt i samme handling. Dine efterfølgende rettigheder (sletning, indsigt, berigtigelse) reguleres af de almindelige GDPR-regler hos den modtagende dataansvarlige. Altid Energis datapolitik kan læses på {energiDatapolitik}.</p>
        </div>
        <div>
          <p className={LEGAL_LABEL}>Databehandlere</p>
          <p>Som behandler oplysninger på vores vegne, herunder udbydere af hosting, betalingsinfrastruktur, kundesupport, analyseværktøjer og e-mailudsendelse. Alle databehandlere er underlagt en databehandleraftale og må kun behandle dine oplysninger efter vores instruks.</p>
        </div>
        <div>
          <p className={LEGAL_LABEL}>Offentlige myndigheder</p>
          <p>Hvis vi er retligt forpligtet hertil.</p>
        </div>
        <p>Vi sælger ikke dine personoplysninger til tredjeparter.</p>
      </section>

      <section className="space-y-4">
        <h2 className={LEGAL_H2}>6. Overførsler til tredjelande</h2>
        <p>Hvis vi overfører dine oplysninger til lande uden for EU/EØS, sker det udelukkende på grundlag af et lovligt overførselsgrundlag, herunder EU-Kommissionens standardkontraktbestemmelser. Du kan få nærmere oplysninger ved at kontakte os.</p>
      </section>

      <section className="space-y-4">
        <h2 className={LEGAL_H2}>7. Opbevaring</h2>
        <p>Vi opbevarer dine personoplysninger så længe det er nødvendigt til de formål, de er indsamlet til, eller så længe vi er forpligtet til det efter lovgivningen. Generelt gælder:</p>
        <ul className={LEGAL_LIST}>
          <li>Kundedata opbevares i op til 5 år efter aftalens ophør af hensyn til bogføringsloven.</li>
          <li>Tekniske logs og brugsdata slettes løbende og typisk inden for 12 måneder.</li>
          <li>Oplysninger indsamlet på baggrund af samtykke slettes, når samtykket trækkes tilbage, medmindre andet retsgrundlag gælder.</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className={LEGAL_H2}>8. Dine rettigheder</h2>
        <p>Du har følgende rettigheder i henhold til databeskyttelsesforordningen:</p>
        <ul className="space-y-2">
          {RETTIGHEDER.map(({ right, desc }) => (
            <li key={right}>
              <span className={LEGAL_LABEL}>{right}:</span> {desc}
            </li>
          ))}
        </ul>
        <p>Du udøver dine rettigheder ved at kontakte os på {mail}. Vi besvarer din henvendelse inden for 30 dage.</p>
      </section>

      <section className="space-y-4">
        <h2 className={LEGAL_H2}>9. Klage</h2>
        <p>Hvis du er utilfreds med vores behandling af dine personoplysninger, har du ret til at indgive en klage til Datatilsynet:</p>
        <LegalAddress name="Datatilsynet">
          <p>Carl Jacobsens Vej 35, 2500 Valby</p>
          <p><a href="mailto:dt@datatilsynet.dk" className={LEGAL_LINK}>dt@datatilsynet.dk</a></p>
          <p><a href="https://www.datatilsynet.dk" target="_blank" rel="noopener noreferrer" className={LEGAL_LINK}>datatilsynet.dk</a></p>
        </LegalAddress>
      </section>

      <section className="space-y-4">
        <h2 className={LEGAL_H2}>10. Ændringer</h2>
        <p>Vi opdaterer løbende denne privatlivspolitik. Den gældende version er altid tilgængelig i appen og på vores hjemmeside. Væsentlige ændringer vil blive kommunikeret til dig via appen eller e-mail.</p>
      </section>

    </LegalPageLayout>
  )
}
