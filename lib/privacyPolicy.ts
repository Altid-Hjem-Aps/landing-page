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
  updated: '2026-11-24',
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
      title: '2. Venteliste og nyhedsbrev',
      blocks: [
        { type: 'paragraph', text: 'Indtil november 2026 kunne du tilmelde dig ventelisterne via altidhjem.dk, altidmad.dk eller altidforsikring.dk. Ventelisterne er nu lukket, og altidmad.dk og altidforsikring.dk sender dig videre til altidhjem.dk. Ventelisterne for Altid Hjem og Altid Mad er en fælles venteliste, mens Altid Forsikring har sin egen separate venteliste. Altid Hjem ApS er dataansvarlig for alle tre ventelister. Følgende særlige regler gælder for behandlingen af oplysninger fra ventelisterne. Afsnit 9 (Dine rettigheder) og afsnit 10 (Klage) gælder også for ventelisteoplysninger.' },
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
        { type: 'paragraph', text: 'Vi behandler oplysningerne for at kunne give dig besked, når Altid Hjem og de tilknyttede tjenester, herunder Altid Mad og Altid Forsikring, lanceres, og for at forstå, hvem vores tidlige brugere er. Retsgrundlaget er dit samtykke (GDPR artikel 6, stk. 1, litra a), som du til enhver tid kan trække tilbage via afmeldingslinket i vores e-mails eller ved at skrive til [hej@altidhjem.dk](mailto:hej@altidhjem.dk). Selve lanceringsbeskeden er markedsføring efter markedsføringslovens § 10, men sendes på grundlag af din tilmelding til ventelisten, som udgør dit forudgående, specifikke samtykke til netop den besked; den indeholder kun information om lancering og adgang.' },
        { type: 'label', text: 'E-mailstatistik' },
        { type: 'paragraph', text: 'Vores e-mails kan indeholde en lille sporingspixel og sporbare links, der fortæller os, om en e-mail bliver åbnet, og hvilke links der klikkes på. Vi bruger oplysningerne til at måle og forbedre vores kommunikation. Behandlingen sker på grundlag af dit samtykke og ophører fremadrettet, hvis du afmelder dig via afmeldingslinket i vores e-mails. Allerede indsamlede oplysninger slettes efter opbevaringsreglerne nedenfor. I de fleste e-mailprogrammer kan du desuden undgå åbningsregistrering ved at slå automatisk billedvisning fra. Vores e-mails udsendes via vores databehandler Resend; eventuelle overførsler til lande uden for EU/EØS sker som beskrevet i afsnit 6.' },
        { type: 'label', text: 'Opbevaring' },
        { type: 'paragraph', text: 'Dine ventelisteoplysninger opbevares sikkert hos vores databehandlere i EU/EØS og slettes senest 12 måneder efter lanceringen af den tjeneste, du har skrevet dig op til, eller tidligere hvis du anmoder om det.' },
        { type: 'label', text: 'Nyhedsbrev' },
        { type: 'paragraph', text: 'På altidhjem.dk kan du tilmelde dig vores nyhedsbrev med din e-mailadresse. Vi gemmer din e-mailadresse, hvornår du tilmeldte dig, og hvilken samtykketekst du satte kryds ved. Vi gemmer også en registrering af selve samtykket, så vi kan dokumentere det.' },
        { type: 'paragraph', text: 'Vi bruger oplysningerne til at sende dig nyheder og gode tilbud på mail om forsikring, el, mobil og mad fra Altid Hjem, Altid Forsikring, Altid Energi, Altid Mobil og Altid Mad, som beskrevet i den tekst, du satte kryds ved. Retsgrundlaget er dit samtykke (GDPR artikel 6, stk. 1, litra a, og markedsføringslovens § 10). Du kan til enhver tid afmelde dig via linket i vores e-mails eller ved at skrive til [hej@altidhjem.dk](mailto:hej@altidhjem.dk).' },
        { type: 'paragraph', text: 'Er din e-mailadresse allerede registreret hos os, uden at du har sagt ja til nyheder, sender vi dig en mail, hvor du selv bekræfter tilmeldingen.' },
        { type: 'paragraph', text: 'Vi gemmer din tilmelding, indtil du afmelder dig. Afmelder du dig, stopper udsendelsen med det samme. Registreringen af, at du gav samtykke og senere afmeldte dig, gemmer vi, så længe vi kan have brug for at dokumentere, at vi har overholdt reglerne.' },
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
        { type: 'paragraph', text: 'Hvis du forbinder din bank i appen, henter Subaio ApS (Subaio) oplysninger fra din bank og giver os dem: dine konti, saldi og posteringer med forhandlernes navne samt Subaios kategorier og overblik over tilbagevendende betalinger og abonnementer. Du giver samtykket i Subaios eget flow, og det er frivilligt: resten af appen virker uden. Forbindelsen til din bank er kun til at læse: hverken vi eller Subaio kan flytte penge eller foretage betalinger fra dine konti.' },
        { type: 'paragraph', text: 'Konti, saldi og posteringer, som Subaio henter. Vi sender dem til din telefon og gemmer ikke en kopi. Følger en drøm en konto, gemmer vi dato og beløb for kontoens posteringer og drømmens del af saldoen. Posteringer kan indeholde andres navne. De senest hentede bank-tal ligger desuden krypteret på din egen telefon, uden for telefonens sikkerhedskopi, i højst 7 dage eller til næste lønningsdag, så appen åbner hurtigt.' },
        { type: 'label', text: 'Dine valg' },
        { type: 'paragraph', text: 'Blandt andet kategorier, regler, noter, faste udgifter, forsikringer, budget og drømme. De kan indeholde et navn, et beløb og en dato.' },
        { type: 'label', text: 'Følsomme oplysninger' },
        { type: 'paragraph', text: 'Vi beder ikke om følsomme oplysninger. Men posteringer kan røbe dem, fx betalinger til en fagforening, et apotek, en kirke eller et politisk parti. Vi bruger ikke sådanne posteringer til markedsføring eller til at målrette tilbud, og vi giver dem ikke videre. De vises i dit eget overblik, og din partner ser kun det, afsnit 5 beskriver. Betalinger til fagforening, a-kasse, pension, Sygeforsikring Danmark og sundhedsforsikringer bruger vi heller ikke til forsikringstjekket.' },
        { type: 'label', text: 'Betalingsoplysninger' },
        { type: 'paragraph', text: 'Betalingskortoplysninger og øvrige betalingsdata i forbindelse med køb og tilmelding til produkter via appen. Betalingsoplysninger behandles via godkendte betalingsudbydere og opbevares ikke direkte af Altid Hjem.' },
        { type: 'label', text: 'Tekniske oplysninger' },
        { type: 'paragraph', text: 'Oplysninger om din enhed, dit styresystem og din appversion samt optælling af brugen af appen og tjenesterne (se afsnit 4). Med dit samtykke indsamler vi også oplysninger til analyse af, hvordan appen bliver brugt (se afsnit 5).' },
        { type: 'label', text: 'Notifikationer' },
        { type: 'paragraph', text: 'Siger du ja til notifikationer på din telefon, gemmer vi en kode, så vi kan sende beskeder til netop din telefon. Koden får vi fra Google (Firebase), som bringer beskederne ud for os. Vi gemmer også et tilfældigt nummer for appen på din telefon, om det er en iPhone eller en Android, hvilken version af appen du har, og om notifikationer er slået til. Om hver besked gemmer vi, hvad slags besked det var, hvornår vi sendte den, og om du åbnede den. Selve teksten i beskeden sletter vi, når den er sendt. Slår du notifikationer fra, gemmer vi, hvornår du gjorde det.' },
        { type: 'label', text: 'Henvisningsoplysninger' },
        { type: 'paragraph', text: 'Når du deler eller kopierer dit personlige henvisningslink i appen, og når nogen klikker på det, registrerer vi hændelsen. For hver hændelse gemmer vi tidspunkt, land, browsertype og en hashværdi af IP-adressen med et dagligt skiftende tilfældigt tillæg, men aldrig selve IP-adressen. Det personlige link viser, hvilken kunde et klik hører til. Oplysningerne bruges til at tælle henvisninger på grundlag af vores legitime interesse i at drive henvisningsordningen og slettes efter 90 dage. Henvisningsoptællingen bruger ikke cookies.' },
        { type: 'label', text: 'Hvor din konto kom fra' },
        { type: 'paragraph', text: 'Henter du appen fra Google Play på en Android-telefon, fortæller Google Play os, hvilket link du kom fra, fx hvilken annonce eller kampagne (kilde og kampagnenavn). Det gemmer vi på din konto, når du opretter den. Er der en personlig invitationskode i linket, gemmer vi ikke selve koden. På en iPhone får vi ingen oplysning om, hvor du kom fra, så der gemmer vi intet. Står din e-mail på vores venteliste, kobler vi også din konto til din tilmelding, så vi kan se, hvilken side du skrev dig op fra.' },
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
        { type: 'label', text: 'Samling og visning af dine bolig- og forbrugsdata i et overblik' },
        { type: 'paragraph', text: 'Retsgrundlag: Opfyldelse af aftale og legitim interesse (GDPR artikel 6, stk. 1, litra b og f).' },
        { type: 'label', text: 'Personligt overblik over din og husstandens økonomi, og beskeder og forslag til at forbedre den, ud fra dine bankoplysninger' },
        { type: 'paragraph', text: 'Retsgrundlag: Dit samtykke (GDPR artikel 6, stk. 1, litra a). Vi bruger ikke bankoplysningerne til kreditvurdering eller individuel prisfastsættelse, træner ingen modeller på dem og sælger dem ikke. Vi bruger dem til to forslag om tjenester fra Altid, som du ser i appen. Betaler du en forsikring, kan appen tilbyde dig et forsikringstjek. Betaler du for strøm til et andet elselskab, regner vi ud, hvad du cirka kunne spare hos Altid Energi, og viser dig det. Beregningen sker på vores server ud fra dine betalinger til elselskabet, din boligs postnummer og offentlige elpriser. Resultatet huskes højst dagen ud og gemmes ikke derefter. En gang i døgnet tæller vi, hvor mange husstande der kan spare, og gemmer kun de samlede tal. Mail og notifikationer om besparelsen sender vi kun, hvis du har sagt ja til nyheder fra Altid Energi. Trykker du "Spørg ikke igen" på forslaget, viser vi det ikke længere. Hverken Altid Energi eller vores forsikringspartner får bankoplysninger. Du trækker samtykket tilbage for en bank ad gangen under Profil › Økonomi ved at afbryde forbindelsen. Så beder vi Subaio om at slette bankens konti og posteringer, og vi sletter dine kategorier, noter, skjulte abonnementer og svar for de konti. Sletter du din konto, beder vi Subaio om at slette dig helt hos dem.' },
        { type: 'label', text: 'Kommunikation og support' },
        { type: 'paragraph', text: 'Retsgrundlag: Legitim interesse (GDPR artikel 6, stk. 1, litra f).' },
        { type: 'label', text: 'Notifikationer om de tjenester, du bruger' },
        { type: 'paragraph', text: 'Vi sender notifikationer, når der er noget, du kan bruge:' },
        {
          type: 'list',
          items: [
            { text: 'Når strømmen er billig i dag, hvis du er kunde hos Altid Energi. Højst tre om ugen.' },
            { text: 'Påmindelser fra Altid Mad om madplan og indkøbsliste, på de dage og tidspunkter du selv vælger.' },
            { text: 'Når madplanen for næste uge er klar.' },
          ],
        },
        { type: 'paragraph', text: 'Du får højst fem notifikationer om ugen i alt. De er ikke reklame. Nyheder og tilbud sender vi kun som notifikation, hvis du har sagt ja til det. Retsgrundlag: Opfyldelse af aftale og legitim interesse (GDPR artikel 6, stk. 1, litra b og f).' },
        { type: 'paragraph', text: 'Du slår notifikationer fra under Profil › Notifikationer i appen eller i din telefons indstillinger. Påmindelserne fra Altid Mad kan du også slå fra hver for sig under Påmindelser i Altid Mad. Logger du ud, sletter vi koden til din telefon.' },
        { type: 'label', text: 'Analyse af, hvordan appen bliver brugt, så vi kan gøre den bedre' },
        { type: 'paragraph', text: 'Retsgrundlag: Dit samtykke (GDPR artikel 6, stk. 1, litra a). Vi indsamler intet til denne analyse, før du har sagt ja, og du kan til enhver tid trække samtykket tilbage under Profil › Samtykker i appen.' },
        { type: 'label', text: 'Optælling af, hvor mange der bruger appen og tjenesterne' },
        { type: 'paragraph', text: 'Vi tæller, hvor mange der bruger appen og vores tjenester, så vi ved, om Altid Hjem bliver brugt. Vi gemmer kun, at appen blev åbnet, og hvilke tjenester der blev brugt den dag. Optællingen viser ikke, hvad du kigger på eller trykker på, og vi bruger kun tallene samlet. Det gælder alle, uanset om du har sagt ja eller nej til analysen ovenfor.' },
        { type: 'paragraph', text: 'Retsgrundlag: Legitim interesse (GDPR artikel 6, stk. 1, litra f). Vores interesse er at vide, om tjenesterne bliver brugt, og at kunne afregne korrekt. Vi vurderer, at den går forud for din interesse, fordi oplysningerne er få, ikke siger noget om, hvad du gør i appen, og ikke bruges til noget om dig som person. Du kan altid gøre indsigelse, se afsnit 9.' },
        { type: 'label', text: 'Optælling af klik og besøg på vores websteder' },
        { type: 'paragraph', text: 'På altidhjem.dk tæller vi nogle få handlinger for alle besøgende, også hvis du har sagt nej til statistikcookies: når du åbner en side, når du trykker på en knap til App Store eller Google Play, når du åbner eller scanner en af vores QR-koder, når vi viser dig en af vores pop-up-beskeder, når du lukker den, og når nogen tilmelder sig nyhedsbrevet. Vi gemmer kun, hvad der skete, og hvor, fx hvilken side du åbnede, hvilken knap det var, og om det var på en computer eller en telefon. Hver optælling får sit eget tilfældige id, så to optællinger aldrig kan kobles sammen eller til dig. Vi bruger ingen cookies til optællingen, og din IP-adresse sendes ikke til Amplitude.' },
        { type: 'paragraph', text: 'For at forhindre, at nogen kunstigt øger tallene, begrænser vi, hvor mange optællinger der kan komme fra samme internetforbindelse i timen. Til det bruger vi en hashværdi af IP-adressen, lavet med en hemmelig nøgle, men aldrig selve IP-adressen.' },
        { type: 'paragraph', text: 'Retsgrundlag: Legitim interesse (GDPR artikel 6, stk. 1, litra f). Vores interesse er at vide, om siden og vores pop-up-beskeder virker, og hvilke knapper der får folk til at hente appen. Vi vurderer, at den går forud for din interesse, fordi optællingen ikke siger noget om, hvem du er, ikke kan kobles til dig og ikke bruger cookies. Du kan altid gøre indsigelse, se afsnit 9.' },
        { type: 'label', text: 'Måling af, hvilke annoncer og kampagner der giver nye kunder' },
        { type: 'paragraph', text: 'Vi bruger oplysningen om, hvor din konto kom fra (se afsnit 3), til at se, hvilke annoncer og kampagner der giver nye kunder, og hvad en ny kunde koster os. Vi bruger kun tallene samlet per kampagne og ikke til noget om dig som person. Retsgrundlag: Legitim interesse (GDPR artikel 6, stk. 1, litra f). Vores interesse er at bruge vores markedsføringskroner fornuftigt. Vi vurderer, at den går forud for din interesse, fordi oplysningen kun siger, hvilket link appen blev hentet fra, og ikke hvem du er eller hvad du gør i appen. Du kan altid gøre indsigelse, se afsnit 9.' },
        { type: 'label', text: 'Markedsføring og personaliserede tilbud fra Altid Hjem og datterselskaber' },
        { type: 'paragraph', text: 'Retsgrundlag: Samtykke (GDPR artikel 6, stk. 1, litra a). Du kan til enhver tid trække dit samtykke tilbage.' },
        { type: 'label', text: 'Opfyldelse af lovkrav' },
        { type: 'paragraph', text: 'Retsgrundlag: Retlig forpligtelse (GDPR artikel 6, stk. 1, litra c).' },
        { type: 'label', text: 'Automatiske afgørelser' },
        { type: 'paragraph', text: 'Vi træffer ingen afgørelser, der udelukkende bygger på automatisk behandling og har retsvirkning for dig eller på tilsvarende måde betydeligt påvirker dig (GDPR artikel 22). Kategorier og overblik i appen er vejledende, og du kan selv flytte en postering til en anden kategori.' },
        { type: 'label', text: 'Profilering' },
        { type: 'paragraph', text: 'Appen sorterer automatisk dine posteringer i kategorier, genkender faste betalinger og abonnementer og regner ud, om du kan spare hos Altid Energi. Ud fra beregningen afgør vi, om forslaget vises for dig, og om du kan få mail eller notifikation om det, hvis du har sagt ja til nyheder fra Altid Energi. Det er profilering (GDPR artikel 4, nr. 4), men ikke en automatisk afgørelse som nævnt ovenfor. Du kan gøre indsigelse ved at trykke "Spørg ikke igen" på forslaget eller ved at skrive til [hej@altidhjem.dk](mailto:hej@altidhjem.dk), se afsnit 9.' },
      ],
    },
    {
      title: '5. Deling af oplysninger',
      blocks: [
        { type: 'label', text: 'Dataansvarlige i Altid-koncernen' },
        { type: 'paragraph', text: 'Altid Hjem ApS (CVR 45637476) er dataansvarlig for de personoplysninger, du afgiver i Altid Hjem-appen, på vores websteder og ventelister samt til tjenesten Altid Forsikring, herunder kontaktoplysninger, adresse, dine samtykker og din brug af tjenesterne.' },
        { type: 'paragraph', text: 'Altid Energi ApS (CVR 44373580) er selvstændig dataansvarlig for de oplysninger, der vedrører dit elkundeforhold, fx forbrug, aftale og betaling. Altid Hjem viser disse oplysninger i appen på vegne af Altid Energi og efter dit samtykke.' },
        { type: 'paragraph', text: 'Altid Mad er et selvstændigt selskab i Altid-koncernen. Når du tager Altid Mad-tjenesten i brug, bliver Altid Mad-selskabet dataansvarligt for de oplysninger, du afgiver til tjenesten, og du får besked om det, når du starter tjenesten. Altid Mad-selskabet fortæller os kun, om en husstand har brugt tjenesten en bestemt dag.' },
        { type: 'paragraph', text: 'Altid Forsikring er på nuværende tidspunkt en tjeneste under Altid Hjem ApS og ikke et selvstændigt selskab. Hvis tjenesten senere overgår til et andet selskab, opdaterer vi denne privatlivspolitik og informerer dig, før selskabet behandler dine oplysninger.' },
        { type: 'paragraph', text: 'For kommende tjenester, fx Altid Mobil, oplyser vi den dataansvarlige, før tjenesten lanceres.' },
        { type: 'label', text: 'Deling af oplysninger i koncernen' },
        { type: 'paragraph', text: 'Selskaberne i Altid-koncernen deler kun de oplysninger, der er nødvendige for at levere den tjeneste, du bruger, og for intern administration, fx support og drift af de fælles systemer. Grundlaget er vores legitime interesse i at drive koncernen effektivt (databeskyttelsesforordningens artikel 6, stk. 1, litra f, og betragtning 48) og, hvor det kræves, dit samtykke. Markedsføring fra et selskab kræver altid et separat samtykke til netop det selskab. Udvekslingen af oplysninger mellem Altid Hjem og Altid Energi er reguleret af en aftale om overførsel af personoplysninger mellem de to selskaber, og adgangen til oplysninger er begrænset til de medarbejdere, der har brug for dem i deres arbejde.' },
        { type: 'label', text: 'Datadeling med Altid Energi' },
        { type: 'paragraph', text: 'Datadeling mellem Altid Hjem og Altid Energi forudsætter altid dit aktive samtykke i appen og kan gå begge veje:' },
        {
          type: 'list',
          items: [
            { label: 'Modtagelse af data fra Altid Energi', text: 'Hvis du er elkunde hos Altid Energi og samtykker til at oprette en konto hos Altid Hjem, modtager vi følgende oplysninger fra Altid Energi: navn, e-mailadresse, telefonnummer og adresse.' },
            { label: 'Videregivelse af data til Altid Energi', text: 'Hvis du som Altid Hjem-kunde samtykker til at oprette dig som elkunde hos Altid Energi, videregiver vi de til enhver tid gældende oplysninger, der er nødvendige for oprettelse af et elkundeforhold.' },
          ],
        },
        { type: 'paragraph', text: 'Samtykket gælder, indtil du trækker det tilbage under Profil › Samtykker. Så længe det gælder, opdaterer vi din e-mail og dit kundenummer fra Altid Energi, når du logger ind. Dine efterfølgende rettigheder (sletning, indsigt, berigtigelse) reguleres af de almindelige GDPR-regler hos den modtagende dataansvarlige. Altid Energis datapolitik kan læses på [altidenergi.dk/datapolitik](https://altidenergi.dk/datapolitik/).' },
        { type: 'label', text: 'Subaio (bankoplysninger)' },
        { type: 'paragraph', text: 'Subaio ApS henter dine bankoplysninger, når du har givet samtykke i Subaios flow, og leverer dem til os. Subaio og Altid Hjem er hver især selvstændigt dataansvarlige: Subaio er ansvarlig for sin egen indsamling fra din bank, og vi er ansvarlige for det, vi gør med oplysningerne, efter at vi har modtaget dem. Vi giver ikke bankoplysningerne videre til andre end vores databehandlere, som kun må behandle dem efter vores instruks, og din partner i husstanden, hvis du selv vælger at dele en fælles konto (se nedenfor).' },
        { type: 'label', text: 'Din partner i husstanden' },
        { type: 'paragraph', text: 'Din partner ser aldrig dine egne konti eller din egen opsparing: hverken saldi, posteringer eller noget, der er regnet ud fra dem. Din partner ser kun det, du selv deler. Deler du en fælles konto eller en fælles opsparing, som du har markeret som husstandens, ser din partner kontoens saldo, posteringer og faste betalinger, og I ser begge de kategorier, noter og svar, I sætter på dens posteringer. Flytter du penge mellem den delte konto og en af dine egne, ser din partner kun, at pengene er flyttet, ikke hvilken konto de kom fra eller gik til. Du stopper delingen når som helst i appen, og den stopper af sig selv, hvis du ændrer kontoens rolle, fravælger kontoen, afbryder banken, eller en af jer forlader husstanden. Derudover ser din partner en fælles drøm på en konto, du selv har markeret som husstandens, med drømmens andel og de posteringer (dato og beløb), der er regnet med til den, fælles regler for forhandlere (forhandlernavn og kategori) og de forsikringer, du selv har markeret som delt.' },
        { type: 'label', text: 'Tryg (forsikringstjek)' },
        { type: 'paragraph', text: 'Siger du i appen ja til, at Tryg Forsikring A/S må ringe til dig, giver vi Tryg dit navn, dit telefonnummer, din e-mail og din adresse samt det, du har svaret i forsikringstjekket: dine nuværende forsikringsselskaber, de forsikringer du ønsker tjekket, nummerplader og din note. Vi sender også teksten til det samtykke, du gav. Tryg får ingen bankoplysninger. Tryg er selvstændigt dataansvarlig for sin kontakt til dig, og du kan til enhver tid trække samtykket tilbage ved at skrive til [samtykke@tryg.dk](mailto:samtykke@tryg.dk).' },
        { type: 'label', text: 'Logoer for forhandlere' },
        { type: 'paragraph', text: 'For at vise en forhandlers logo slår vores server forhandlerens navn op hos Brandfetch. Vi sender kun navnet på forretningen, aldrig beløb, dato, konto eller noget om dig, og aldrig teksten fra en betaling til en person. Appen henter selve logoet hos Brandfetch, som derved ser din telefons IP-adresse.' },
        { type: 'label', text: 'Databehandlere' },
        { type: 'paragraph', text: 'Som behandler oplysninger på vores vegne, herunder udbydere af hosting, betalingsinfrastruktur, kundesupport, analyseværktøjer, fejlrapportering samt udsendelse af e-mail, sms og notifikationer. Alle databehandlere er underlagt en databehandleraftale og må kun behandle dine oplysninger efter vores instruks.' },
        { type: 'label', text: 'Mails til hej@altidhjem.dk' },
        { type: 'paragraph', text: 'Når du skriver til [hej@altidhjem.dk](mailto:hej@altidhjem.dk), behandles din mail i Google Workspace. Google er vores databehandler, og vi bruger Gemini i Google Workspace til at finde og foreslå svar. Google bruger ikke indholdet af vores mails til at træne sine modeller.' },
        { type: 'label', text: 'Amplitude (analyse af brugen af appen og vores websteder)' },
        { type: 'paragraph', text: 'Har du givet samtykke til det, bruger vi Amplitude, Inc. som databehandler til at se, hvordan appen bliver brugt. Amplitude modtager oplysninger om, hvilke skærme du åbner, og hvor længe du er på dem, hvad du trykker på, hvor langt du ruller ned på lange skærme, om du får vist fejl, hvilke tjenester din husstand bruger, og hvor du kom fra. Amplitude modtager også din telefonmodel, dit styresystem og din appversion samt et id for din telefon og et id for din husstand. Vi optager ikke din skærm. Amplitude modtager ikke dit navn, din e-mail, din adresse, dit kundenummer eller hvor du befinder dig. Oplysningerne opbevares på Amplitudes servere i EU (Frankfurt, Tyskland).' },
        { type: 'paragraph', text: 'På vores websteder bruger vi kun Amplitude i din browser, hvis du har accepteret statistikcookies, se afsnit 11. Når du skriver dig op på ventelisten, registrerer vi tilmeldingen i Amplitude under et tilfældigt id sammen med, hvilken side du tilmeldte dig fra. Amplitude får ikke dit navn eller din e-mail.' },
        { type: 'paragraph', text: 'Derudover sender vores server de anonyme optællinger fra altidhjem.dk til Amplitude, se afsnit 4. De har intet id, der går igen fra gang til gang, og Amplitude får ikke din IP-adresse.' },
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
            { text: 'Regnskabsmateriale, fx fakturaer, opbevarer vi i 5 år fra udgangen af det regnskabsår, det vedrører, som bogføringsloven kræver. Andre oplysninger om dig gemmer vi ikke af den grund.' },
            { text: 'Når du har slettet din konto, gemmer vi en kode (hash) af din e-mail og dit kundenummer i 3 år, så vi kan dokumentere sletningen og ikke tæller dig med to gange, og registreringen af dine samtykker som dokumentation.' },
            { text: 'Tekniske logs slettes løbende og typisk inden for 12 måneder.' },
            { text: 'Oplysninger indsamlet på baggrund af samtykke slettes, når samtykket trækkes tilbage, medmindre andet retsgrundlag gælder.' },
            { text: 'Koden til din telefon gemmer vi, indtil du logger ud eller sletter din konto. Oplysningerne om hver notifikation, og om hvornår du slog dem fra, sletter vi efter 90 dage.' },
            { text: 'Dit profilbillede gemmer vi, indtil du fjerner det i appen eller sletter din konto. Derefter findes det kun i vores sikkerhedskopier, som slettes løbende inden for 8 uger.' },
            { label: 'Bankoplysninger og dine valg', text: 'Vi gemmer det, til du fjerner det eller sletter din konto. Afbryder du en bank, sletter vi kategorier, noter og svar på dens konti. Din telefon gemmer de seneste tal krypteret og bruger dem i højst 7 dage. Sikkerhedskopier slettes inden for 8 uger. Dine bankdata kan du se i appen, så længe banken er forbundet.' },
            { text: 'Fælles drømme og fælles regler hører til husstanden. Sletter du din konto eller forlader husstanden, mens din partner bliver, bliver det, partneren allerede kunne se, i husstanden uden dit navn og din konto på. Er du alene i husstanden, slettes det sammen med husstanden.' },
            { text: 'Vi gemmer oplysningerne om, at appen er åbnet, og hvilke tjenester der er brugt en bestemt dag, per bruger i 13 måneder. Derefter gemmer vi kun samlede tal.' },
            { text: 'Oplysningen om, hvor din konto kom fra, og koblingen til din ventelistetilmelding gemmer vi, så længe du har en konto. Sletter du din konto, slettes de sammen med den.' },
            { text: 'Brugsdata i Amplitude opbevarer vi, så længe du har givet samtykke. Trækker du samtykket tilbage under Profil › Samtykker, eller sletter du din konto, stopper indsamlingen med det samme, og vi beder automatisk Amplitude om at slette oplysningerne om dig. Sletningen er gennemført inden for 30 dage.' },
          ],
        },
      ],
    },
    {
      title: '8. Datasikkerhed',
      blocks: [
        { type: 'paragraph', text: 'Forbindelsen mellem appen og vores server er krypteret (HTTPS). Hver forespørgsel om bankoplysninger kræver et gyldigt login. Du kan kun hente dine egne og det, et medlem af din husstand selv har delt med dig: en fælles konto eller en fælles opsparing. Din partner ser aldrig dine egne konti eller din egen opsparing. De senest hentede bank-tal på din telefon er krypteret med AES-GCM, nøglen ligger i telefonens nøglering, og filen er ikke med i telefonens sikkerhedskopi. Vores servere kan kun nås med personlige nøgler, ikke med adgangskode.' },
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
        { type: 'paragraph', text: `Vi bruger cookies og lignende lagring i din browser (localStorage og sessionStorage) til det, siden skal bruge for at virke, og, hvis du siger ja, til statistik og til at huske, hvilke pop-up-beskeder du har set. Første gang du besøger siden, spørger vi dig. Dit valg gemmes i 12 måneder, og derefter spørger vi igen. Du kan til enhver tid ændre dit valg: [Cookieindstillinger](${COOKIE_SETTINGS_URL})` },
        { type: 'label', text: 'Nødvendige (kræver ikke samtykke)' },
        {
          type: 'list',
          items: [
            { label: 'ah-cookie-consent', text: 'Husker dit cookievalg. Gemmes i 12 måneder.' },
            { label: 'am_confirm', text: 'Bruges et kort øjeblik, når du bekræfter din tilmelding via linket i vores e-mail. Slettes efter 30 minutter.' },
            { label: 'norlys_auth', text: 'Giver adgang til en lukket side for en samarbejdspartner. Sættes kun, når man logger ind på siden. Gemmes i 30 dage.' },
            { label: 'tryg_demo_auth', text: 'Giver adgang til en lukket demoside for en samarbejdspartner. Sættes kun, når man logger ind på siden. Gemmes i 30 dage.' },
          ],
        },
        { type: 'label', text: 'Pop-up-beskeder (kun hvis du siger ja)' },
        { type: 'paragraph', text: 'Siger du nej, husker siden kun pop-up-beskederne, så længe du har siden åben, og gemmer intet om dem i din browser. Trækker du dit ja tilbage, sletter vi disse nøgler.' },
        {
          type: 'list',
          items: [
            { label: 'ah-leave-popup-shown', text: 'Husker, at vi har vist dig beskeden, der kommer, når du er på vej væk fra siden, så du højst ser en pop-up-besked pr. besøg. Slettes, når du lukker fanen.' },
            { label: 'ah-offer-popup-shown', text: 'Husker, at vi har vist dig tilbuddet fra Altid Energi, så du højst ser en pop-up-besked pr. besøg. Slettes, når du lukker fanen.' },
            { label: 'ah-offer-popup-closed', text: 'Husker, hvornår du lukkede tilbuddet fra Altid Energi, så vi ikke viser det igen de næste 7 dage. Gemmes, indtil du rydder din browser eller trækker dit ja tilbage.' },
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
