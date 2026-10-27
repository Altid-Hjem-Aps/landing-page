// The privacy policy, as data. Single source for the page
// (app/privatlivspolitik/page.tsx) and the JSON the Altid Hjem app reads
// (app/privatlivspolitik.json/route.ts), so both always show the same text.
//
// The JSON shape is a contract with the app: add a block type only together
// with app support. Inline links are written [label](url) inside any text;
// url is https://..., mailto:... or the special COOKIE_SETTINGS_URL.

export const COOKIE_SETTINGS_URL = 'cookie-settings'

export interface PolicyListItem {
  /** Bold run-in label. Plain text, no links. */
  label?: string
  text: string
}

export type PolicyBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'label'; text: string }
  | { type: 'list'; items: PolicyListItem[] }
  /** First line is the name (bold). Other lines may hold inline links. */
  | { type: 'address'; lines: string[] }

export interface PolicySection {
  /** Keeps its number, e.g. "5. Deling af oplysninger". */
  title: string
  blocks: PolicyBlock[]
}

export interface PrivacyPolicy {
  /** ISO date, YYYY-MM-DD. */
  updated: string
  sections: PolicySection[]
}

export type InlineSegment = { text: string } | { text: string; url: string }

const INLINE_LINK = /\[([^\]]+)\]\(([^)\s]+)\)/g

/** Splits text with [label](url) links into plain and link segments. */
export function parseInline(text: string): InlineSegment[] {
  const segments: InlineSegment[] = []
  let last = 0
  for (const match of text.matchAll(INLINE_LINK)) {
    if (match.index > last) segments.push({ text: text.slice(last, match.index) })
    segments.push({ text: match[1], url: match[2] })
    last = match.index + match[0].length
  }
  if (last < text.length) segments.push({ text: text.slice(last) })
  return segments
}

export const privacyPolicy: PrivacyPolicy = {
  updated: '2026-10-27',
  sections: [
    {
      title: '1. Vi er den dataansvarlige',
      blocks: [
        { type: 'paragraph', text: 'Altid Hjem ApS, CVR 45637476, er dataansvarlig for behandlingen af de personoplysninger, som vi indsamler om dig i forbindelse med din brug af Altid Hjem-appen, vores websteder (herunder altidhjem.dk, altidmad.dk og altidforsikring.dk) og vores tilknyttede tjenester. Altid Mad er et selvstændigt selskab i Altid-koncernen og bliver dataansvarligt for de personoplysninger, du afgiver, når du tager Altid Mad-tjenesten i brug. Altid Forsikring er en tjeneste under Altid Hjem ApS og ikke et selvstændigt selskab; Altid Hjem ApS er derfor dataansvarlig for oplysninger, du afgiver til Altid Forsikring.' },
        { type: 'paragraph', text: 'Når du via appen opretter dig som kunde hos eller tilgår din selvbetjening hos Altid Energi, er det Altid Energi ApS (CVR 44373580), der er selvstændig dataansvarlig for behandlingen af dine personoplysninger som elkunde. Du kan læse om Altid Energis behandling af personoplysninger på [altidenergi.dk/datapolitik](https://altidenergi.dk/datapolitik/).' },
        { type: 'paragraph', text: 'Har du spørgsmål til vores behandling af dine personoplysninger, er du velkommen til at kontakte os:' },
        { type: 'address', lines: ['Altid Hjem ApS', 'Helsinkigade 29, 2150 Nordhavn', '[hej@altidhjem.dk](mailto:hej@altidhjem.dk)'] },
      ],
    },
    {
      title: '2. Venteliste (før lancering)',
      blocks: [
        { type: 'paragraph', text: 'Indtil Altid Hjem-appen er lanceret, kan du tilmelde dig ventelisterne via altidhjem.dk, altidmad.dk eller altidforsikring.dk. Ventelisterne for Altid Hjem og Altid Mad er én fælles venteliste, mens Altid Forsikring har sin egen separate venteliste. Altid Hjem ApS er dataansvarlig for alle tre ventelister. Følgende særlige regler gælder for behandlingen af oplysninger fra ventelisterne – afsnit 9 (Dine rettigheder) og afsnit 10 (Klage) gælder også for ventelisteoplysninger.' },
        { type: 'label', text: 'Hvilke oplysninger indsamler vi?' },
        {
          type: 'list',
          items: [
            { text: 'Navn' },
            { text: 'E-mailadresse' },
            { text: 'Mobilnummer (valgfrit)' },
            { text: 'Valgfrie svar på spørgsmål om din husstand og energiforbrug' },
            { text: 'Hvilken side du tilmeldte dig fra, og dermed hvilken af vores tjenester (fx Altid Forsikring) du har vist interesse for' },
            { text: 'Om du er tilmeldt via en invitation fra en anden person på ventelisten' },
            { text: 'Oplysninger om din interaktion med vores e-mails (om en e-mail åbnes, og hvilke links der klikkes på)' },
          ],
        },
        { type: 'label', text: 'Formål og retsgrundlag' },
        { type: 'paragraph', text: 'Vi behandler oplysningerne for at kunne give dig besked, når Altid Hjem og de tilknyttede tjenester – herunder Altid Mad og Altid Forsikring – lanceres, og for at forstå, hvem vores tidlige brugere er. Retsgrundlaget er dit samtykke (GDPR artikel 6, stk. 1, litra a), som du til enhver tid kan trække tilbage via afmeldingslinket i vores e-mails eller ved at skrive til [hej@altidhjem.dk](mailto:hej@altidhjem.dk). Selve lanceringsbeskeden er markedsføring efter markedsføringslovens § 10, men sendes på grundlag af din tilmelding til ventelisten, som udgør dit forudgående, specifikke samtykke til netop den besked; den indeholder kun information om lancering og adgang.' },
        { type: 'label', text: 'E-mailstatistik' },
        { type: 'paragraph', text: 'Vores e-mails kan indeholde en lille sporingspixel og sporbare links, der fortæller os, om en e-mail bliver åbnet, og hvilke links der klikkes på. Vi bruger oplysningerne til at måle og forbedre vores kommunikation. Behandlingen sker på grundlag af dit samtykke og ophører fremadrettet, hvis du afmelder dig via afmeldingslinket i vores e-mails — allerede indsamlede oplysninger slettes efter opbevaringsreglerne nedenfor. I de fleste e-mailprogrammer kan du desuden undgå åbningsregistrering ved at slå automatisk billedvisning fra. Vores e-mails udsendes via vores databehandler Resend; eventuelle overførsler til lande uden for EU/EØS sker som beskrevet i afsnit 6.' },
        { type: 'label', text: 'Opbevaring' },
        { type: 'paragraph', text: 'Dine ventelisteoplysninger opbevares sikkert hos vores databehandlere i EU/EØS og slettes senest 12 måneder efter lanceringen af den tjeneste, du har skrevet dig op til, eller tidligere hvis du anmoder om det.' },
      ],
    },
    {
      title: '3. Hvilke oplysninger behandler vi?',
      blocks: [
        { type: 'label', text: 'Kontaktoplysninger' },
        { type: 'paragraph', text: 'Navn, e-mailadresse, telefonnummer og bopælsadresse.' },
        { type: 'label', text: 'Boligoplysninger' },
        { type: 'paragraph', text: 'Adresse, boligtype og relevante oplysninger om dit hjem, som du angiver i appen.' },
        { type: 'label', text: 'Produkt- og aftaleoplysninger' },
        { type: 'paragraph', text: 'Oplysninger om de produkter og aftaler du har hos os eller andre selskaber i Altid-koncernen, herunder el, forsikring og mobil.' },
        { type: 'label', text: 'Forbrugsdata' },
        { type: 'paragraph', text: 'Data om dit energiforbrug og øvrige forbrug, som vi modtager fra dig eller fra relevante leverandører og offentlige registre.' },
        { type: 'label', text: 'Bankoplysninger' },
        { type: 'paragraph', text: 'Hvis du forbinder din bank i appen, henter Subaio ApS (Subaio) oplysninger fra din bank og giver os dem: dine konti, saldi og posteringer med forhandlernes navne samt Subaios kategorier og overblik over tilbagevendende betalinger og abonnementer. Du giver samtykket i Subaios eget flow, og det er frivilligt: resten af appen virker uden. Forbindelsen til din bank er kun til at læse: hverken vi eller Subaio kan flytte penge eller foretage betalinger fra dine konti. Posteringer, saldi og forhandlernavne går gennem vores server på vej til din telefon, men vi gemmer dem ikke. Vi gemmer kun det, du selv vælger i appen: hvilken rolle en konto har (min, fælles eller opsparing), din egen kategori til en postering, hvilke abonnementer du har skjult, dine svar på MobilePay-afregninger og udlæg (id, dato og dit valg, og ved udlæg din egen andel i kroner) og, for en drøm der følger en konto, dato og beløb på de posteringer, der er regnet med til drømmen. Du og din partner kan også lave fælles regler, der gemmer et forhandlernavn og en kategori (se afsnit 5). De senest hentede bank-tal ligger desuden krypteret på din egen telefon, uden for telefonens sikkerhedskopi, i højst 7 dage eller til næste lønningsdag, så appen åbner hurtigt.' },
        { type: 'label', text: 'Følsomme oplysninger' },
        { type: 'paragraph', text: 'Vi beder ikke om følsomme oplysninger. Men posteringer kan røbe dem, fx betalinger til en fagforening, et apotek, en kirke eller et politisk parti. Vi bruger ikke sådanne posteringer til markedsføring eller til at målrette tilbud, og vi giver dem ikke videre. De vises i dit eget overblik, og din partner ser kun det, afsnit 5 beskriver. Betalinger til fagforening, a-kasse, pension, Sygeforsikring Danmark og sundhedsforsikringer bruger vi heller ikke til forsikringstjekket.' },
        { type: 'label', text: 'Betalingsoplysninger' },
        { type: 'paragraph', text: 'Betalingskortoplysninger og øvrige betalingsdata i forbindelse med køb og tilmelding til produkter via appen. Betalingsoplysninger behandles via godkendte betalingsudbydere og opbevares ikke direkte af Altid Hjem.' },
        { type: 'label', text: 'Tekniske oplysninger' },
        { type: 'paragraph', text: 'Oplysninger om din enhed, operativsystem, app-version og brugsadfærd i appen.' },
        { type: 'label', text: 'Henvisningsoplysninger' },
        { type: 'paragraph', text: 'Når du deler eller kopierer dit personlige henvisningslink i appen, og når nogen klikker på det, registrerer vi hændelsen. For hver hændelse gemmer vi tidspunkt, land, browsertype og en hashværdi af IP-adressen med et dagligt skiftende tilfældigt tillæg, men aldrig selve IP-adressen. Det personlige link viser, hvilken kunde et klik hører til. Oplysningerne bruges til at tælle henvisninger på grundlag af vores legitime interesse i at drive henvisningsordningen og slettes efter 90 dage. Henvisningsoptællingen bruger ikke cookies.' },
        { type: 'label', text: 'Profilbillede' },
        { type: 'paragraph', text: 'Hvis du selv lægger et billede af dig ind i appen, gemmer vi det, så de andre voksne i din husstand kan se det. Kun medlemmer af din husstand, der er logget ind, kan se billedet. Før vi gemmer det, fjerner vi oplysninger om, hvor og med hvilket kamera det er taget. Det er frivilligt at lægge et billede ind.' },
        { type: 'label', text: 'Kommunikationsoplysninger' },
        { type: 'paragraph', text: 'Korrespondance du har haft med os via e-mail, chat eller support.' },
      ],
    },
    {
      title: '4. Formål og retsgrundlag',
      blocks: [
        { type: 'label', text: 'Levering og administration af appen og vores tjenester' },
        { type: 'paragraph', text: 'Retsgrundlag: Opfyldelse af aftale (GDPR artikel 6, stk. 1, litra b).' },
        { type: 'label', text: 'Tilmelding til og administration af produkter under Altid Forsikring og Altid Mobil samt produkter fra andre selskaber i Altid-koncernen' },
        { type: 'paragraph', text: 'Retsgrundlag: Opfyldelse af aftale (GDPR artikel 6, stk. 1, litra b).' },
        { type: 'label', text: 'Modtagelse af kontaktoplysninger fra Altid Energi og videregivelse af kontaktoplysninger til Altid Energi i forbindelse med oprettelse af kundeforhold' },
        { type: 'paragraph', text: 'Retsgrundlag: Dit samtykke (GDPR artikel 6, stk. 1, litra a).' },
        { type: 'label', text: 'Samling og visning af dine bolig- og forbrugsdata i ét overblik' },
        { type: 'paragraph', text: 'Retsgrundlag: Opfyldelse af aftale og legitim interesse (GDPR artikel 6, stk. 1, litra b og f).' },
        { type: 'label', text: 'Personligt overblik over din og husstandens økonomi, og beskeder og forslag til at forbedre den, ud fra dine bankoplysninger' },
        { type: 'paragraph', text: 'Retsgrundlag: Dit samtykke (GDPR artikel 6, stk. 1, litra a). Vi bruger ikke bankoplysningerne til kreditvurdering, individuel prisfastsættelse eller markedsføring, træner ingen modeller på dem og sælger dem ikke. Betaler du en forsikring, kan appen tilbyde dig at blive skrevet op til et forsikringstjek. Vi sender ingen bankoplysninger videre. Du kan trække samtykket tilbage ved at slette din konto i appen, og så beder vi Subaio om at slette dig hos dem.' },
        { type: 'label', text: 'Kommunikation og support' },
        { type: 'paragraph', text: 'Retsgrundlag: Legitim interesse (GDPR artikel 6, stk. 1, litra f).' },
        { type: 'label', text: 'Analyse af, hvordan appen bliver brugt, så vi kan gøre den bedre' },
        { type: 'paragraph', text: 'Retsgrundlag: Dit samtykke (GDPR artikel 6, stk. 1, litra a). Vi indsamler intet, før du har sagt ja, og du kan til enhver tid trække samtykket tilbage under Profil › Samtykker i appen.' },
        { type: 'label', text: 'Markedsføring og personaliserede tilbud fra Altid Hjem og datterselskaber' },
        { type: 'paragraph', text: 'Retsgrundlag: Samtykke (GDPR artikel 6, stk. 1, litra a). Du kan til enhver tid trække dit samtykke tilbage.' },
        { type: 'label', text: 'Opfyldelse af lovkrav' },
        { type: 'paragraph', text: 'Retsgrundlag: Retlig forpligtelse (GDPR artikel 6, stk. 1, litra c).' },
        { type: 'label', text: 'Automatiske afgørelser' },
        { type: 'paragraph', text: 'Vi træffer ingen afgørelser, der udelukkende bygger på automatisk behandling og har retsvirkning for dig eller på tilsvarende måde betydeligt påvirker dig (GDPR artikel 22). Kategorier og overblik i appen er vejledende, og du kan selv flytte en postering til en anden kategori.' },
      ],
    },
    {
      title: '5. Deling af oplysninger',
      blocks: [
        { type: 'label', text: 'Dataansvarlige i Altid-koncernen' },
        { type: 'paragraph', text: 'Altid Hjem ApS (CVR 45637476) er dataansvarlig for de personoplysninger, du afgiver i Altid Hjem-appen, på vores websteder og ventelister samt til tjenesten Altid Forsikring, herunder kontaktoplysninger, adresse, dine samtykker og din brug af tjenesterne.' },
        { type: 'paragraph', text: 'Altid Energi ApS (CVR 44373580) er selvstændig dataansvarlig for de oplysninger, der vedrører dit elkundeforhold, fx forbrug, aftale og betaling. Altid Hjem viser disse oplysninger i appen på vegne af Altid Energi og efter dit samtykke.' },
        { type: 'paragraph', text: 'Altid Mad er et selvstændigt selskab i Altid-koncernen. Når du tager Altid Mad-tjenesten i brug, bliver Altid Mad-selskabet dataansvarligt for de oplysninger, du afgiver til tjenesten, og du får besked om det, når du starter tjenesten.' },
        { type: 'paragraph', text: 'Altid Forsikring er på nuværende tidspunkt en tjeneste under Altid Hjem ApS og ikke et selvstændigt selskab. Hvis tjenesten senere overgår til et andet selskab, opdaterer vi denne privatlivspolitik og informerer dig, før selskabet behandler dine oplysninger.' },
        { type: 'paragraph', text: 'For kommende tjenester, fx Altid Mobil, oplyser vi den dataansvarlige, før tjenesten lanceres.' },
        { type: 'label', text: 'Deling af oplysninger i koncernen' },
        { type: 'paragraph', text: 'Selskaberne i Altid-koncernen deler kun de oplysninger, der er nødvendige for at levere den tjeneste, du bruger, og for intern administration, fx support og drift af de fælles systemer. Grundlaget er vores legitime interesse i at drive koncernen effektivt (databeskyttelsesforordningens artikel 6, stk. 1, litra f, og betragtning 48) og, hvor det kræves, dit samtykke. Markedsføring fra et selskab kræver altid et separat samtykke til netop det selskab. Delingen er reguleret af en koncernintern aftale om datadeling, og adgangen til oplysninger er begrænset til de medarbejdere, der har brug for dem i deres arbejde.' },
        { type: 'label', text: 'Datadeling med Altid Energi' },
        { type: 'paragraph', text: 'Datadeling mellem Altid Hjem og Altid Energi forudsætter altid dit aktive samtykke i appen og kan gå begge veje:' },
        {
          type: 'list',
          items: [
            { label: 'Modtagelse af data fra Altid Energi', text: 'Hvis du er elkunde hos Altid Energi og samtykker til at oprette en konto hos Altid Hjem, modtager vi følgende oplysninger fra Altid Energi: navn, e-mailadresse, telefonnummer og adresse.' },
            { label: 'Videregivelse af data til Altid Energi', text: 'Hvis du som Altid Hjem-kunde samtykker til at oprette dig som elkunde hos Altid Energi, videregiver vi de til enhver tid gældende oplysninger, der er nødvendige for oprettelse af et elkundeforhold.' },
          ],
        },
        { type: 'paragraph', text: 'Samtykket er engangs – det udløser én konkret overførsel og er forbrugt i samme handling. Dine efterfølgende rettigheder (sletning, indsigt, berigtigelse) reguleres af de almindelige GDPR-regler hos den modtagende dataansvarlige. Altid Energis datapolitik kan læses på [altidenergi.dk/datapolitik](https://altidenergi.dk/datapolitik/).' },
        { type: 'label', text: 'Subaio (bankoplysninger)' },
        { type: 'paragraph', text: 'Subaio ApS henter dine bankoplysninger, når du har givet samtykke i Subaios flow, og leverer dem til os. Subaio og Altid Hjem er hver især selvstændigt dataansvarlige: Subaio er ansvarlig for sin egen indsamling fra din bank, og vi er ansvarlige for det, vi gør med oplysningerne, efter at vi har modtaget dem. Vi giver ikke bankoplysningerne videre til andre end vores databehandlere, som kun må behandle dem efter vores instruks.' },
        { type: 'label', text: 'Din partner i husstanden' },
        { type: 'paragraph', text: 'Din partner ser aldrig dine konti, saldi eller posteringer. Partneren ser kun to ting: en fælles drøm på en konto, du selv har markeret som husstandens, med drømmens andel og de posteringer (dato og beløb), der er regnet med til den, og fælles regler for forhandlere (forhandlernavn og kategori). En fælles konto ser I hver især gennem jeres egen bankforbindelse.' },
        { type: 'label', text: 'Databehandlere' },
        { type: 'paragraph', text: 'Som behandler oplysninger på vores vegne, herunder udbydere af hosting, betalingsinfrastruktur, kundesupport, analyseværktøjer og e-mailudsendelse. Alle databehandlere er underlagt en databehandleraftale og må kun behandle dine oplysninger efter vores instruks.' },
        { type: 'label', text: 'Mails til hej@altidhjem.dk' },
        { type: 'paragraph', text: 'Når du skriver til [hej@altidhjem.dk](mailto:hej@altidhjem.dk), behandles din mail i Google Workspace. Google er vores databehandler, og vi bruger Gemini i Google Workspace til at finde og foreslå svar. Google bruger ikke indholdet af vores mails til at træne sine modeller.' },
        { type: 'label', text: 'Amplitude (analyse af brugen af appen og vores websteder)' },
        { type: 'paragraph', text: 'Har du givet samtykke til det, bruger vi Amplitude, Inc. som databehandler til at se, hvordan appen bliver brugt. Amplitude modtager hvilke skærme der åbnes, hvilke knapper der trykkes på, din telefonmodel, dit styresystem og din appversion, samt et id for din telefon og et id for din husstand. Amplitude modtager ikke dit navn, din e-mail, din adresse, dit kundenummer eller hvor du befinder dig. Oplysningerne opbevares på Amplitudes servere i EU (Frankfurt, Tyskland).' },
        { type: 'paragraph', text: 'På vores websteder bruger vi kun Amplitude i din browser, hvis du har accepteret statistikcookies, se afsnit 11. Når du skriver dig op på ventelisten, registrerer vi tilmeldingen i Amplitude under et tilfældigt id sammen med, hvilken side du tilmeldte dig fra. Amplitude får ikke dit navn eller din e-mail.' },
        { type: 'label', text: 'Offentlige myndigheder' },
        { type: 'paragraph', text: 'Hvis vi er retligt forpligtet hertil.' },
        { type: 'paragraph', text: 'Vi sælger ikke dine personoplysninger til tredjeparter.' },
      ],
    },
    {
      title: '6. Overførsler til tredjelande',
      blocks: [
        { type: 'paragraph', text: 'Hvis vi overfører dine oplysninger til lande uden for EU/EØS, sker det udelukkende på grundlag af et lovligt overførselsgrundlag, herunder EU-Kommissionens standardkontraktbestemmelser. Du kan få nærmere oplysninger ved at kontakte os.' },
        { type: 'paragraph', text: 'Amplitude, Inc. er en amerikansk virksomhed. Oplysningerne opbevares i EU, men hvis Amplitude tilgår dem fra USA, sker det på grundlag af EU-US Data Privacy Framework, som Amplitude er certificeret under, og EU-Kommissionens standardkontraktbestemmelser.' },
      ],
    },
    {
      title: '7. Opbevaring',
      blocks: [
        { type: 'paragraph', text: 'Vi opbevarer dine personoplysninger så længe det er nødvendigt til de formål, de er indsamlet til, eller så længe vi er forpligtet til det efter lovgivningen. Generelt gælder:' },
        {
          type: 'list',
          items: [
            { text: 'Kundedata opbevares i op til 5 år efter aftalens ophør af hensyn til bogføringsloven.' },
            { text: 'Tekniske logs slettes løbende og typisk inden for 12 måneder.' },
            { text: 'Oplysninger indsamlet på baggrund af samtykke slettes, når samtykket trækkes tilbage, medmindre andet retsgrundlag gælder.' },
            { text: 'Dit profilbillede gemmer vi, indtil du fjerner det i appen eller sletter din konto. Derefter findes det kun i vores sikkerhedskopier, som slettes løbende inden for 8 uger.' },
            { text: 'Bankoplysninger fra Subaio gemmer vi ikke hos os: de hentes, når du åbner appen, og går videre til din telefon. På din telefon ligger de senest hentede tal krypteret i højst 7 dage eller til næste lønningsdag, og de slettes, når du logger ud eller sletter din konto.' },
            { text: 'De valg, du selv har truffet om dine bankoplysninger (kontoroller, egne kategorier, skjulte abonnementer, svar på afregninger og udlæg), gemmer vi, indtil du fjerner dem eller sletter din konto. Sletter du din konto, beder vi samtidig Subaio om at slette dig hos dem. Beskeden sendes efter sletningen og forsøges igen, indtil Subaio har bekræftet.' },
            { text: 'Fælles drømme og fælles regler hører til husstanden. Sletter du din konto eller forlader husstanden, mens din partner bliver, bliver det, partneren allerede kunne se, i husstanden uden dit navn og din konto på. Er du alene i husstanden, slettes det sammen med husstanden.' },
            { text: 'Brugsdata i Amplitude opbevarer vi, så længe du har givet samtykke. Trækker du samtykket tilbage under Profil › Samtykker, eller sletter du din konto, stopper indsamlingen med det samme, og vi beder automatisk Amplitude om at slette oplysningerne om dig. Sletningen er gennemført inden for 30 dage.' },
          ],
        },
      ],
    },
    {
      title: '8. Datasikkerhed',
      blocks: [
        { type: 'paragraph', text: 'Forbindelsen mellem appen og vores server er krypteret (HTTPS). Hver forespørgsel om bankoplysninger kræver et gyldigt login, og du kan kun hente dine egne. De senest hentede bank-tal på din telefon er krypteret med AES-GCM, nøglen ligger i telefonens nøglering, og filen er ikke med i telefonens sikkerhedskopi. Vores servere kan kun nås med personlige nøgler, ikke med adgangskode.' },
      ],
    },
    {
      title: '9. Dine rettigheder',
      blocks: [
        { type: 'paragraph', text: 'Du har følgende rettigheder i henhold til databeskyttelsesforordningen:' },
        {
          type: 'list',
          items: [
            { label: 'Indsigt', text: 'Du kan anmode om at se de oplysninger, vi behandler om dig.' },
            { label: 'Berigtigelse', text: 'Du kan bede os om at rette unøjagtige oplysninger.' },
            { label: 'Sletning', text: 'Du kan i visse tilfælde bede os om at slette dine oplysninger.' },
            { label: 'Begrænsning', text: 'Du kan bede os om at begrænse behandlingen af dine oplysninger.' },
            { label: 'Dataportabilitet', text: 'Du kan i visse tilfælde anmode om at modtage dine oplysninger i et struktureret, maskinlæsbart format.' },
            { label: 'Indsigelse', text: 'Du kan gøre indsigelse mod vores behandling, herunder mod direkte markedsføring.' },
            { label: 'Tilbagetrækning af samtykke', text: 'Du kan til enhver tid trække et samtykke tilbage, uden at dette berører lovligheden af behandlingen forud for tilbagetrækningen.' },
          ],
        },
        { type: 'paragraph', text: 'Du udøver dine rettigheder ved at kontakte os på [hej@altidhjem.dk](mailto:hej@altidhjem.dk). Vi besvarer din henvendelse inden for 30 dage.' },
      ],
    },
    {
      title: '10. Klage',
      blocks: [
        { type: 'paragraph', text: 'Hvis du er utilfreds med vores behandling af dine personoplysninger, har du ret til at indgive en klage til Datatilsynet:' },
        { type: 'address', lines: ['Datatilsynet', 'Carl Jacobsens Vej 35, 2500 Valby', '[dt@datatilsynet.dk](mailto:dt@datatilsynet.dk)', '[datatilsynet.dk](https://www.datatilsynet.dk)'] },
      ],
    },
    {
      title: '11. Cookies',
      blocks: [
        { type: 'paragraph', text: `Vi bruger cookies og lignende lagring i din browser (localStorage) til to ting: det, siden skal bruge for at virke, og statistik, hvis du siger ja. Første gang du besøger siden, spørger vi dig. Dit valg gemmes i 12 måneder, og derefter spørger vi igen. Du kan til enhver tid ændre dit valg: [Cookieindstillinger](${COOKIE_SETTINGS_URL})` },
        { type: 'label', text: 'Nødvendige (kræver ikke samtykke)' },
        {
          type: 'list',
          items: [
            { label: 'ah-cookie-consent', text: 'Husker dit cookievalg. Gemmes i 12 måneder.' },
            { label: 'am_confirm', text: 'Bruges et kort øjeblik, når du bekræfter din tilmelding til ventelisten via linket i vores e-mail. Slettes efter 30 minutter.' },
            { label: 'ah-waitlist-joined', text: 'Husker, at du er skrevet op på ventelisten, så vi ikke spørger dig igen. Gemmes, indtil du rydder din browser.' },
            { label: 'ah-exit-intent-shown', text: 'Husker, at vi har vist dig invitationen til ventelisten, så den kun vises én gang. Gemmes, indtil du rydder din browser.' },
            { label: 'norlys_auth', text: 'Giver adgang til en lukket side for en samarbejdspartner. Sættes kun, når man logger ind på siden. Gemmes i 30 dage.' },
          ],
        },
        { type: 'label', text: 'Statistik (kun hvis du siger ja)' },
        {
          type: 'list',
          items: [
            { label: 'AMP_* (Amplitude)', text: 'Et tilfældigt id for din browser, så vi kan se, hvordan siden bliver brugt på tværs af besøg: hvilke sider du ser, hvad du klikker på, og hvor du kom fra. Oplysningerne behandles af vores databehandler Amplitude i EU, se afsnit 5. Gemmes i op til 12 måneder. Siger du nej, eller trækker du dit ja tilbage, stopper vi statistikken og sletter disse cookies fra din browser.' },
          ],
        },
      ],
    },
    {
      title: '12. Ændringer',
      blocks: [
        { type: 'paragraph', text: 'Vi opdaterer løbende denne privatlivspolitik. Den gældende version er altid tilgængelig i appen og på vores hjemmeside. Væsentlige ændringer vil blive kommunikeret til dig via appen eller e-mail.' },
      ],
    },
  ],
}
