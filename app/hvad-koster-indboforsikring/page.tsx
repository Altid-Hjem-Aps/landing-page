import type { Metadata } from 'next'
import ForsikringHusstandMockup from '@/components/ForsikringHusstandMockup'
import IndboTjekMockup from '@/components/IndboTjekMockup'
import Guide, { type GuideFaq, GuideFigure, GuideLink as A, GuideSteps, GuideStores } from '@/components/site/Guide'

// Brought up to the guide recipe (docs/guide-recipe.md) on 16 Nov 2026. The old range of 100 to
// 400 kr. a month and the average of 150 to 160 kr. had no source; the page now leads with
// Forbrugerrådet Tænk's typical price for an average family, the newest open figure we found
// (Tænk's test from October 2025 keeps its prices behind a paywall).
export const metadata: Metadata = {
  title: 'Pris på indboforsikring i 2026 | Altid Hjem',
  description:
    '1.700 til 3.000 kroner om året koster en indboforsikring typisk for en gennemsnitsfamilie, ifølge Forbrugerrådet Tænk. Se, hvad der afgør prisen.',
  alternates: { canonical: 'https://www.altidhjem.dk/hvad-koster-indboforsikring' },
  openGraph: {
    title: 'Hvad koster en indboforsikring?',
    description:
      '1.700 til 3.000 kroner om året koster en indboforsikring typisk for en gennemsnitsfamilie, ifølge Forbrugerrådet Tænk. Se, hvad der afgør prisen.',
    url: 'https://www.altidhjem.dk/hvad-koster-indboforsikring',
    type: 'article',
  },
}

const TAENK_GUIDE = 'https://taenk.dk/test-og-forbrugerliv/privatoekonomi-og-aftaler/forsikring/indboforsikring-bedst-billigst'
const TAENK_HUB = 'https://taenk.dk/test/indboforsikringer'
const TAENK_TEST = 'https://taenk.dk/test/indboforsikringer/indboforsikringer-disse-er-bedst-i-test'
const TAENK_SKIFT = 'https://taenk.dk/test-og-forbrugerliv/privatoekonomi-og-aftaler/forsikring/saadan-finder-du-den-bedste-og-billigste'
const DST = 'https://www.statistikbanken.dk/PRIS01'
const FORSIKRINGSGUIDEN = 'https://www.forsikringsguiden.dk'

// FAQ bruges to steder: synligt på siden og som FAQPage-schema.
const FAQ: GuideFaq[] = [
  {
    q: 'Hvad koster en indboforsikring?',
    a: [
      'Ifølge Forbrugerrådet Tænk koster en indboforsikring for en gennemsnitsfamilie typisk mellem 1.700 og 3.000 kroner om året. Det svarer til cirka 140 til 250 kroner om måneden.',
      'Jeres egen pris afhænger blandt andet af indbosummen, selvrisikoen og jeres alder.',
    ],
  },
  {
    q: 'Hvad afgør prisen på en indboforsikring?',
    a: [
      'Ifølge Forbrugerrådet Tænk betyder indbosummen, selvrisikoen og jeres alder mest. Jo højere indbosum, desto dyrere forsikring.',
      'Antallet af børn betyder mindre: Fra nul til ét barn stiger prisen i gennemsnit 4,18 procent.',
    ],
  },
  {
    q: 'Bliver indboforsikringen billigere med en højere selvrisiko?',
    a: [
      'Ja, typisk. I Tænks analyse af 14 selskaber faldt prisen i gennemsnit 24,4 procent, når selvrisikoen gik fra 0 til 3.000 kroner.',
      'Til gengæld betaler I selv mere, når der sker en skade, så vælg en selvrisiko, I kan betale uden at låne.',
    ],
  },
  {
    q: 'Kan vi være dækket dobbelt?',
    a: [
      'Ja. Indboforsikringen dækker som udgangspunkt alle i husstanden, så har to i samme hjem hver sin indboforsikring, kan I betale for den samme dækning to gange.',
      'Få selskaberne til at bekræfte, hvem hver police dækker, før I opsiger noget.',
    ],
  },
  {
    q: 'Hvornår kan vi opsige indboforsikringen?',
    a: [
      'Ifølge Forbrugerrådet Tænk kan en forsikring normalt opsiges med 30 dages varsel, og det er billigst at skifte, når den gamle forsikring udløber.',
      'Har I haft forsikringen i mindre end et år, kan gebyret være meget højt, så tjek det i policen først.',
    ],
  },
  {
    q: 'Hvad er Altid Hjem?',
    a: [
      'Altid Hjem er en dansk app, der samler madplan, strøm, forsikring og økonomi ét sted, så I får ét overblik, ét login.',
      'I kan hente den gratis i App Store og Google Play.',
    ],
  },
  {
    q: 'Koster Altid Hjem noget?',
    a: [
      'Nej, appen er gratis at hente, og det er gratis at oprette en profil.',
      'I betaler kun for det, I selv vælger at bruge, for eksempel strøm fra Altid Energi, hvis I bliver kunder.',
    ],
  },
]

export default function HvadKosterIndboforsikring() {
  return (
    <Guide
      title="Hvad koster en indboforsikring?"
      lead={
        <>
          <p>
            1.700 til 3.000 kroner om året koster en indboforsikring typisk for en gennemsnitsfamilie, ifølge Forbrugerrådet Tænk. Det svarer til cirka 140 til 250 kroner
            om måneden.
          </p>
          <p>Jeres egen pris afhænger især af indbosummen, selvrisikoen, jeres alder og de tilvalg, I vælger.</p>
        </>
      }
      meta={<>Kilde: Forbrugerrådet Tænk</>}
      answer={{
        label: 'Typisk pris for en gennemsnitsfamilie',
        value: '1.700-3.000',
        unit: 'kr. om året',
        note: 'Ifølge Forbrugerrådet Tænk. Cirka 140-250 kr. om måneden.',
      }}
      factors={{ label: 'Det afgør prisen', items: ['Indbosum', 'Selvrisiko', 'Alder', 'Bopæl', 'Tilvalg'] }}
      faq={FAQ}
      cta={{
        eyebrow: 'Alle jeres forsikringer ét sted',
        heading: 'Hent Altid Hjem, og saml husstandens forsikringer',
        subtitle: 'Skriv jeres forsikringer, priser og fornyelser ind i appen, så har I dem samlet ét sted.',
      }}
      page={{ path: '/hvad-koster-indboforsikring', description: metadata.description as string, published: '2026-07-27', updated: '2026-11-16' }}
      sources={{
        checked: '2026-11-16',
        items: [
          { publisher: 'Forbrugerrådet Tænk', title: 'Sådan finder du den bedste og billigste indboforsikring', href: TAENK_GUIDE, note: '21. maj 2024. Analyse af 14 selskaber' },
          { publisher: 'Forbrugerrådet Tænk', title: 'Test: Indboforsikringer', href: TAENK_HUB, note: 'Testens metode: 16 selskaber, 10 eksempler, priser fra oktober 2025. Udgivet 24. oktober 2025' },
          { publisher: 'Forbrugerrådet Tænk', title: 'Her er de bedste og billigste indboforsikringer', href: TAENK_TEST, note: '24. oktober 2025' },
          { publisher: 'Forbrugerrådet Tænk', title: 'Sådan finder du den bedste og billigste forsikring', href: TAENK_SKIFT, note: '1. april 2025' },
          {
            publisher: 'Danmarks Statistik',
            title: 'PRIS01: Forbrugerprisindeks, gruppe 12.1.3 Boligrelateret forsikring',
            href: DST,
            note: 'Oktober 2025 til oktober 2026. Egne beregninger på baggrund af data fra Danmarks Statistik',
          },
          { publisher: 'Forsikringsguiden', title: 'Uvildig og nem sammenligning af forsikringer', href: FORSIKRINGSGUIDEN, note: 'Sammenligner pris og dækning hos 86 procent af selskaberne i Danmark, læst 16. november 2026' },
        ],
      }}
      related={['/hvad-koster-en-husforsikring', '/hvad-koster-en-bilforsikring', '/skift-forsikringsselskab']}
    >
      <section>
        <h2>Hvad koster en indboforsikring i 2026?</h2>
        <p>
          Ifølge <A href={TAENK_GUIDE}>Forbrugerrådet Tænk</A> koster en indboforsikring for en gennemsnitsfamilie typisk mellem 1.700 og 3.000 kroner om året. Tallet er
          fra Tænks guide fra maj 2024, og omregnet til måneder er det cirka 140 til 250 kroner.
        </p>
        <p>
          Tænk testede igen i oktober 2025. <A href={TAENK_HUB}>Testen</A> omfatter 16 selskaber, der ifølge Tænk dækker over 90 procent af markedet, og hver pris er et
          gennemsnit af 10 eksempler. Priserne i testen er kun for medlemmer, men Tænk skriver, at der er <A href={TAENK_TEST}>store prisforskelle</A> på
          indboforsikringerne.
        </p>
        <p>
          Jeres egen pris får I kun ved at hente et tilbud på jeres eget hjem, for eksempel på <A href={FORSIKRINGSGUIDEN}>Forsikringsguiden.dk</A>. Derfra henter Tænk
          også de fleste af priserne til sin test.
        </p>
      </section>
      <section>
        <h2>Hvad afgør prisen på en indboforsikring?</h2>
        <p>
          Indbosummen betyder meget. Ifølge <A href={TAENK_GUIDE}>Tænks analyse</A> steg prisen i gennemsnit 19,73 procent, når indbosummen gik fra 200.000 til 1 million
          kroner, og 31 procent fra 1 til 2 millioner kroner.
        </p>
        <p>
          Alderen tæller også. I de fleste selskaber falder prisen, jo ældre I er, når I tegner forsikringen. Antallet af børn betyder mindre: Fra nul til ét barn steg
          prisen i gennemsnit 4,18 procent.
        </p>
        <p>Tænk skriver også, at det ofte er billigere at betale præmien én gang om året end at dele den op.</p>
      </section>
      <section>
        <h2>Skal I vælge høj eller lav selvrisiko?</h2>
        <p>
          Jo højere selvrisiko, desto lavere pris. I <A href={TAENK_GUIDE}>Tænks analyse</A> af 14 selskaber faldt prisen i gennemsnit 24,4 procent, når selvrisikoen gik
          fra 0 til 3.000 kroner. Fra 3.000 til 5.000 kroner faldt den kun 9,5 procent.
        </p>
        <p>
          Til gengæld betaler I selv mere, når der sker en skade. Vælg en selvrisiko, I kan betale uden at låne, og brug den samme selvrisiko, når I sammenligner selskaber.
          Ellers sammenligner I to forskellige forsikringer.
        </p>
      </section>
      <section>
        <h2>Hvad dækker en indboforsikring?</h2>
        <p>
          Indboforsikringen dækker jeres løse ejendele. Ifølge <A href={TAENK_GUIDE}>Forbrugerrådet Tænk</A> dækker den som udgangspunkt blandt andet ved indbrud, simpelt
          tyveri, hærværk, brand, pludselig vandskade og færdselsuheld. Det, der sidder fast i huset, hører under husforsikringen, som vi har en{' '}
          <A href="/hvad-koster-en-husforsikring">guide til her</A>.
        </p>
        <p>
          En indboforsikring indeholder også en ansvarsforsikring og en retshjælpsforsikring. Ansvarsforsikringen dækker blandt andet, hvis I laver skade på andres ting.
          Retshjælpen dækker nogle af omkostningerne, hvis I havner i en konflikt i privatlivet.
        </p>
        <p>
          Meget andet er tilvalg, som koster ekstra. <A href={TAENK_HUB}>Tænk holder i sin test</A> blandt andet årsrejseforsikring, glas og kumme, pludselig skade
          og udvidet cykeldækning uden for prisen, så tjek, hvilke af dem I selv betaler for.
        </p>
      </section>
      <section>
        <h2>Er den billigste indboforsikring god nok?</h2>
        <p>
          Ofte, ja. I <A href={TAENK_TEST}>Tænks test fra oktober 2025</A> er der større forskel på prisen end på kvaliteten af dækningen. I kan altså ende med at betale
          væsentligt mere for en forsikring, der dækker det samme som den billigste.
        </p>
        <p>
          Tjek dog grænserne. Ifølge Tænk har selskaberne vidt forskellige loftsbeløb for værdigenstande, og hvor tingene står, kan have betydning for, om forsikringen
          dækker. Tænk anbefaler at tjekke indboforsikringen hvert år og mindst hvert andet år.
        </p>
      </section>
      <section>
        <h2>Kan I være dækket dobbelt?</h2>
        <p>
          Ja. Ifølge <A href={TAENK_GUIDE}>Forbrugerrådet Tænk</A> dækker indboforsikringen som udgangspunkt alle i husstanden, både børn og voksne. Flytter to sammen med
          hver sin indboforsikring, kan I derfor betale for den samme dækning to gange.
        </p>
        <p>
          Lejere og logerende er normalt ikke dækket af jeres forsikring. Udeboende børn kan i nogle selskaber være dækket, til de fylder 18 eller 21 år, så længe de bor
          alene. Få selskaberne til at bekræfte, hvem der er dækket, før I opsiger noget.
        </p>
        <GuideFigure tone="mint" caption="Eksempel: husstandens indbodækninger gennemgås én for én, og et muligt overlap markeres. Illustration, ikke et skærmbillede fra appen.">
          <IndboTjekMockup />
        </GuideFigure>
      </section>
      <section>
        <h2>Hvornår kan I opsige indboforsikringen?</h2>
        <p>
          Ifølge <A href={TAENK_SKIFT}>Forbrugerrådet Tænk</A> kan en forsikring normalt opsiges med 30 dages varsel, og det er billigst at skifte, når den gamle forsikring
          udløber. Datoen står i policen.
        </p>
        <p>
          Har I haft forsikringen i mindre end et år, kan gebyret for at opsige være meget højt, så tjek det først. På en ny forsikring har I som udgangspunkt 14 dages
          fortrydelsesret. I guiden om at <A href="/skift-forsikringsselskab">skifte forsikringsselskab</A> kan I se, hvordan I skifter uden huller i dækningen.
        </p>
      </section>
      <section>
        <h2>Regneeksempel: hvad betyder prisstigningerne?</h2>
        <p>Et eksempel, ikke jeres regning. Det bygger på disse antagelser:</p>
        <ul>
          <li>I betaler 2.400 kroner om året for indboforsikringen, inden for Tænks spænd på 1.700 til 3.000 kroner.</li>
          <li>Prisen stiger 4,7 procent om året, ligesom priserne på boligrelaterede forsikringer gjorde fra oktober 2025 til oktober 2026.</li>
          <li>I beholder den samme police uden at sammenligne.</li>
        </ul>
        <p>
          Næste år betaler I så 2.513 kroner, og efter tre år 2.755 kroner. Stigningen bygger på Danmarks Statistiks <A href={DST}>forbrugerprisindeks</A>, som dækker alle
          boligrelaterede forsikringer. Hvor meget jeres egen pris ændrer sig, kan I kun se ved at hente et nyt tilbud med samme dækning.
        </p>
      </section>
      <GuideSteps
        title="Tjekliste før I skifter eller opsiger"
        steps={[
          'Find jeres nuværende police frem, og skriv indbosum, selvrisiko og tilvalg ned, så I kan sammenligne på samme betingelser.',
          'Hent mindst to tilbud med samme dækning, og tjek loftsbeløbene for værdigenstande, cykler og elektronik.',
          'Bor I flere sammen, så få selskaberne til at bekræfte, hvem hver police dækker, før I opsiger en af dem.',
          'Lad den nye forsikring begynde, før den gamle stopper, så I ikke står uden dækning en eneste dag.',
        ]}
      />
      <section>
        <h2>Hvordan kan Altid Hjem hjælpe?</h2>
        <p>
          Indboforsikringen bliver ofte bare fornyet hvert år, og bor I flere sammen, kan der ligge policer i flere selskaber. Altid Hjem samler madplan, strøm, forsikring
          og økonomi i én app, så I får ét overblik, ét login.
        </p>
        <p>
          Skriv jeres forsikringer, priser og fornyelser ind i appen, så har I dem samlet ét sted og kan nå at sammenligne før næste fornyelse. I kan hente appen gratis i
          App Store og Google Play.
        </p>
        <GuideStores />
        <GuideFigure tone="mint" caption="Eksempel: husstandens forsikringer samlet i ét overblik. Illustration, ikke et skærmbillede fra appen.">
          <ForsikringHusstandMockup />
        </GuideFigure>
      </section>
    </Guide>
  )
}
