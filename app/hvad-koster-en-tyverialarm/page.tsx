import type { Metadata } from 'next'
import { SITE_IMAGE } from '@/lib/site-image'
import AlarmStatusMockup from '@/components/AlarmStatusMockup'
import Guide, { type GuideFaq, GuideApp, GuideFigure, GuideLink as A } from '@/components/site/Guide'
import { GUIDES } from '@/lib/guides'

// Brought up to the guide recipe (docs/guide-recipe.md) on 16 Nov 2026. No neutral body publishes
// alarm prices; the old ranges (999 to 2.999 kr., 10.000 to 15.000 kr., 299 kr. a month) had no
// source and are replaced by the guide prices Handyhand publishes, named as theirs. Burglary facts
// come from Danmarks Statistik and Det Kriminalpræventive Råd.
export const metadata: Metadata = {
  title: 'Hvad koster en tyverialarm? | Altid Hjem',
  description:
    '3.000 til 7.000 kroner koster en tyverialarm til et hus typisk uden abonnement, ifølge Handyhand. Se, hvad overvågning og installation koster oveni.',
  alternates: { canonical: 'https://www.altidhjem.dk/hvad-koster-en-tyverialarm' },
  openGraph: {
    title: 'Hvad koster en tyverialarm?',
    description:
      '3.000 til 7.000 kroner koster en tyverialarm til et hus typisk uden abonnement, ifølge Handyhand. Se, hvad overvågning og installation koster oveni.',
    url: 'https://www.altidhjem.dk/hvad-koster-en-tyverialarm',
    type: 'article',
    images: [SITE_IMAGE],
  },
  twitter: { card: 'summary_large_image', images: [SITE_IMAGE] },
}

const HANDYHAND = 'https://handyhand.dk/alarm/installation-tyverialarm/pris'
const TAENK_ALARM = 'https://taenk.dk/forbrugerliv/bolig/alarmselskaberne-tager-tvivlsomme-metoder-i-brug'
const TAENK_TYVEN = 'https://taenk.dk/forbrugerliv/bolig/tyven-er-mere-bange-nysgerrige-naboer-end-indbrudsalarmen'
const BOLIUS = 'https://www.bolius.dk/alarm-til-hjemmet-17622'
const DKR_FAKTA = 'https://dkr.dk/viden/indbrud-og-tyveri/fakta-om-indbrud'
const DKR_RAAD = 'https://dkr.dk/gode-raad/indbrud-og-tyveri/beskyt-dit-hjem-mod-indbrud'
const DST = 'https://www.statistikbanken.dk/STRAF20'

// FAQ bruges to steder: synligt på siden og som FAQPage-schema.
const FAQ: GuideFaq[] = [
  {
    q: 'Hvad koster en tyverialarm?',
    a: [
      'Ifølge håndværkerplatformen Handyhand koster en alarm til et hus typisk mellem 3.000 og 7.000 kroner for et basissystem uden abonnement.',
      'Vælger I overvågning, koster abonnementet ofte 300 til 500 kroner om måneden oveni.',
    ],
  },
  {
    q: 'Hvad koster det at få installeret en tyverialarm?',
    a: [
      'Ifølge Handyhand koster det typisk mellem 1.310 og 7.180 kroner at få installeret en tyverialarm.',
      'Prisen afhænger af antallet af sensorer og det alarmsystem, I vælger.',
    ],
  },
  {
    q: 'Hvad er forskellen på en alarm med og uden abonnement?',
    a: [
      'Med et abonnement er alarmen koblet til en vagtservice. En alarm, I selv sætter op, sender typisk en sms eller ringer til jer, når den går.',
      'En analytiker fra Det Kriminalpræventive Råd kender ikke til troværdige data, der viser, at den ene type virker bedre end den anden.',
    ],
  },
  {
    q: 'Giver en alarm rabat på forsikringen?',
    a: [
      'Det kan den. Ifølge Bolius giver flere forsikringsselskaber rabat, hvis I har installeret visse typer alarmer.',
      'Spørg jeres eget selskab, før I køber, så I ved, om jeres alarm tæller med.',
    ],
  },
  {
    q: 'Forebygger en tyverialarm indbrud?',
    a: [
      'Det Kriminalpræventive Råd kender ikke til dokumentation for, at alarmer kan forebygge indbrud.',
      'Rådet anbefaler at sikre hjemmet på flere måder, for eksempel med to låse på hoveddøren og hjælp fra naboerne.',
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

export default function HvadKosterEnTyverialarm() {
  return (
    <Guide
      title={GUIDES['/hvad-koster-en-tyverialarm'].title}
      lead={
        <>
          <p>
            3.000 til 7.000 kroner koster en tyverialarm til et hus typisk som basissystem uden abonnement, ifølge håndværkerplatformen Handyhand. Vælger I overvågning,
            kommer der ofte 300 til 500 kroner om måneden oveni.
          </p>
          <p>Prisen afhænger især af antallet af sensorer, det alarmsystem, I vælger, installationen, og om alarmen skal være koblet til en vagtservice.</p>
        </>
      }
      meta={
        <>
          Kilde: vejledende priser fra Handyhand · Se også{' '}
          <a href={DKR_RAAD} target="_blank" rel="noopener noreferrer">
            Det Kriminalpræventive Råds råd mod indbrud
          </a>
        </>
      }
      answer={{
        label: 'Basissystem til et hus, uden abonnement',
        value: '3.000-7.000',
        unit: 'kr.',
        note: 'Vejledende priser fra Handyhand. Overvågning koster ofte 300-500 kr. om måneden oveni.',
      }}
      factors={{ label: 'Det afgør prisen', items: ['Antal sensorer', 'Alarmsystem', 'Installation', 'Overvågning', 'Boligens størrelse'] }}
      faq={FAQ}
      cta={{
        eyebrow: 'Ét overblik over hjemmets udgifter',
        heading: 'Hent Altid Hjem og få overblik over husstanden',
        subtitle: 'Forbinder I banken, ser I jeres faste udgifter i en kalender, før pengene bliver trukket.',
      }}
      page={{ path: '/hvad-koster-en-tyverialarm', description: metadata.description as string, published: GUIDES['/hvad-koster-en-tyverialarm'].published, updated: GUIDES['/hvad-koster-en-tyverialarm'].updated }}
      sources={{
        checked: '2026-11-16',
        items: [
          { publisher: 'Handyhand', title: 'Hvad koster det at få installeret en tyverialarm?', href: HANDYHAND, note: 'Vejledende priser 2026. Siden oplyser ikke, hvordan priserne er fundet' },
          { publisher: 'Forbrugerrådet Tænk', title: 'Alarmselskaberne tager tvivlsomme metoder i brug', href: TAENK_ALARM, note: '26. september 2024' },
          { publisher: 'Forbrugerrådet Tænk', title: 'Tyven er mere bange for nysgerrige naboer end for indbrudsalarmen', href: TAENK_TYVEN, note: '26. september 2024' },
          { publisher: 'Bolius', title: 'Valg af alarm til hjemmet', href: BOLIUS, note: 'Ajourført 6. juni 2018' },
          { publisher: 'Det Kriminalpræventive Råd', title: 'Fakta om indbrud', href: DKR_FAKTA, note: 'Uden dato. Tal fra Danmarks Statistik og egne undersøgelser' },
          { publisher: 'Det Kriminalpræventive Råd', title: 'Beskyt dit hjem mod indbrud', href: DKR_RAAD, note: 'Uden dato' },
          { publisher: 'Danmarks Statistik', title: 'STRAF20: Anmeldte forbrydelser og sigtelser, indbrud i beboelser', href: DST, note: '2024 og 2025' },
        ],
      }}
      related={['/hvad-koster-indboforsikring', '/hvad-koster-en-husforsikring', '/opsig-abonnementer']}
    >
      <section>
        <h2>Hvad koster en tyverialarm i 2026?</h2>
        <p>
          Der findes ingen officiel gennemsnitspris på en tyverialarm. Håndværkerplatformen <A href={HANDYHAND}>Handyhand</A> oplyser vejledende priser: En alarm til et
          hus koster typisk mellem 3.000 og 7.000 kroner for et basissystem uden abonnement, og et overvågningsabonnement koster ofte 300 til 500 kroner om måneden oveni.
        </p>
        <p>
          Handyhand skriver ikke, hvordan priserne er fundet, så brug dem som et pejlemærke og ikke som et tilbud. Også <A href={TAENK_ALARM}>Forbrugerrådet Tænk</A>{' '}
          skriver, at selve alarmen kan koste flere tusind kroner, og at et abonnement hos et vagtfirma giver en fast månedlig udgift.
        </p>
        <p>Tænk kalder en indbrudsalarm en forholdsvis dyr foranstaltning, så det er værd at regne på den, før I køber.</p>
      </section>
      <section>
        <h2>Hvad koster det at få installeret en alarm?</h2>
        <p>
          Ifølge <A href={HANDYHAND}>Handyhand</A> koster det typisk mellem 1.310 og 7.180 kroner at få installeret en tyverialarm, afhængigt af antallet af sensorer og
          det alarmsystem, I vælger.
        </p>
        <p>
          Boligens størrelse spiller også ind. En lejlighed med én hoveddør kræver typisk færre sensorer end et hus med flere døre, vinduer i stueplan og en have. Bed
          derfor om en pris på netop jeres bolig, med antallet af sensorer skrevet ind.
        </p>
        <p>
          Kan I selv sætte alarmen op, slipper I for installationen. En del alarmer er lavet til, at I selv monterer dem, skriver <A href={BOLIUS}>Bolius</A>.
        </p>
      </section>
      <section>
        <h2>Hvad er forskellen på en alarm med og uden abonnement?</h2>
        <p>
          Ifølge <A href={BOLIUS}>Bolius</A> kan I vælge en alarm, hvor I samtidig tegner et abonnement på en vagtservice. Har I en alarm, I selv har sat op, kan I typisk
          ikke tegne et abonnement. Så får I i stedet en sms eller et opkald, når alarmen går, og må selv reagere.
        </p>
        <p>
          Hvilken type virker så bedst? En analytiker fra Det Kriminalpræventive Råd, som <A href={TAENK_TYVEN}>Tænk</A> har talt med, kender ikke til troværdige
          data, der viser, at den ene type virker bedre end den anden.
        </p>
        <GuideFigure tone="rose" caption="Eksempel: en alarm med fem sensorer slås til. Illustration, ikke et skærmbillede fra appen.">
          <AlarmStatusMockup />
        </GuideFigure>
      </section>
      <section>
        <h2>Forebygger en tyverialarm indbrud?</h2>
        <p>
          Det er uvist. <A href={DKR_RAAD}>Det Kriminalpræventive Råd</A> skriver, at de ikke kender til dokumentation for, at alarmer kan forebygge indbrud. Ifølge{' '}
          <A href={DKR_FAKTA}>rådets fakta om indbrud</A> bruger de fleste tyve højst 10 minutter i huset, og nogle regner med 5 til 15 minutter, før alarmfirmaet
          kommer.
        </p>
        <p>
          Rådet anbefaler at sikre hjemmet på flere måder. To låse på hoveddøren gør det sværere at bryde ind, og ifølge rådet kan nabohjælp forebygge op mod hvert fjerde
          indbrud. En alarm kan være en del af sikringen, men den bør ikke stå alene.
        </p>
      </section>
      <section>
        <h2>Hvornår sker der flest indbrud?</h2>
        <p>
          I 2025 blev der anmeldt 15.882 indbrud i beboelser, viser <A href={DST}>Danmarks Statistik</A>. Året før var tallet 14.544. Ifølge{' '}
          <A href={DKR_FAKTA}>Det Kriminalpræventive Råd</A> har der siden 2021 været omkring 15.000 anmeldelser om året.
        </p>
        <p>
          Rådet skriver, at der er særligt mange indbrud i ferieugerne 7, 8, 27 til 29 og 42 og mellem jul og nytår. Der sker flest indbrud fredag og lørdag mellem klokken
          17 og 20, og risikoen er cirka 3,5 gange større i villaer end i lejligheder.
        </p>
        <p>
          Har der været indbrud, er risikoen for endnu et indbrud i samme bolig inden for et år 5,5 gange større. Boliger inden for 200 meter har dobbelt så stor risiko de
          følgende 14 dage.
        </p>
      </section>
      <section>
        <h2>Hvordan sikrer I hjemmet uden en alarm?</h2>
        <p>
          <A href={DKR_RAAD}>Det Kriminalpræventive Råd</A> peger på flere ting, der ikke koster et abonnement. Sæt en ekstra lås på hoveddøren, mindst 40 centimeter fra
          den første lås, og tjek, at vindueskarmene sidder fast med mindst to skruer i hver lodret side.
        </p>
        <p>
          Når I rejser, kan betroede naboer tømme postkassen og slå græs eller rydde sne, så huset ser beboet ud. Lys med timer indenfor gør det også sværere for en tyv at
          se, om nogen er hjemme. Det passer godt med ferieugerne, hvor der ifølge rådet sker særligt mange indbrud.
        </p>
      </section>
      <section>
        <h2>Giver en alarm rabat på forsikringen?</h2>
        <p>
          Det kan den. Ifølge <A href={BOLIUS}>Bolius</A> giver flere forsikringsselskaber rabat på forsikringen, hvis I har installeret visse typer alarmer. Bolius
          anbefaler at kontakte jeres forsikringsselskab, før I køber en alarm. Artiklen hos Bolius er fra 2018, så spørg om de regler, der gælder i dag.
        </p>
        <p>
          Regn ikke rabatten med, før selskabet har bekræftet den skriftligt for netop jeres alarm. Tyveri ved indbrud dækkes som udgangspunkt af indboforsikringen, og i guiden{' '}
          <A href="/hvad-koster-indboforsikring">Hvad koster en indboforsikring?</A> kan I se, hvad den typisk koster.
        </p>
      </section>
      <section>
        <h2>Regneeksempel: hvad koster en alarm over fem år?</h2>
        <p>Et eksempel, ikke jeres regning. Det bygger på disse antagelser:</p>
        <ul>
          <li>I betaler 5.000 kroner for alarmen med installation, i den lave ende af Handyhands spænd på 5.000 til 10.000 kroner, når overvågning og installation er med.</li>
          <li>I vælger et overvågningsabonnement til 400 kroner om måneden, midt i Handyhands spænd på 300 til 500 kroner.</li>
          <li>I beholder alarmen og abonnementet i fem år, og prisen på abonnementet står stille.</li>
        </ul>
        <p>
          Abonnementet koster så 24.000 kroner over fem år, og alarmen koster i alt 29.000 kroner. Uden abonnement betaler I kun for selve alarmen, 3.000 til 7.000
          kroner for et basissystem ifølge Handyhand, men så er det jer selv, der skal reagere, når alarmen går. Bed om en samlet pris for hele perioden, før I skriver
          under.
        </p>
      </section>
      <section>
        <h2>Hvordan kan Altid Hjem hjælpe?</h2>
        <p>
          Et alarmabonnement er en af de faste udgifter, der bliver trukket hver måned, uden at man tænker over det. Altid Hjem samler madplan, strøm, forsikring og
          økonomi i én app, så I får ét overblik, ét login.
        </p>
        <p>
          Forbinder I banken, ser I jeres faste udgifter i en kalender, før pengene bliver trukket. Skriv også jeres forsikringer, priser og fornyelser ind i appen, så har
          I dem samlet ét sted. I kan hente appen gratis i App Store og Google Play. Læs også, hvordan I <A href="/opsig-abonnementer">opsiger abonnementer</A>, I ikke
          bruger.
        </p>
        <GuideApp
          tone="rose"
          src="/site/app/regninger-top.webp"
          alt="Regninger i Altid Hjem: husstandens faste regninger i en kalender for november"
          caption="I appen: husstandens faste regninger i en kalender, og hvad den næste store regning er."
        />
      </section>
    </Guide>
  )
}
