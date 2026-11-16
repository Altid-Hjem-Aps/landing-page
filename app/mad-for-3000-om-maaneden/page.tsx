import type { Metadata } from 'next'
import TreTusindMockup from '@/components/mad/TreTusindMockup'
import { MAD_GUIDE_CTA, MAD_IN_APP, MAD_REPORT_HREF, MAD_REPORT_LABEL } from '@/components/mad/madGuide'
import Guide, { GuideFigure, GuideLink as A, GuideStores, type GuideFaq } from '@/components/site/Guide'
import { GUIDES } from '@/lib/guides'

// Moved from altidmad.dk/mad-for-3000-om-maaneden (16 Nov 2026) with the text word for word.
export const metadata: Metadata = {
  title: 'Mad for 3.000 om måneden, sådan gør I | Altid Hjem',
  description:
    'Kan en familie få mad for 3.000 kr. om måneden? Se det ærlige regnestykke og konkrete greb, der hjælper jer tættere på. Få overblik hos Altid Mad.',
  alternates: { canonical: 'https://www.altidhjem.dk/mad-for-3000-om-maaneden' },
  openGraph: {
    title: 'Kan en familie få mad for 3.000 kr. om måneden?',
    description:
      'Kan en familie få mad for 3.000 kr. om måneden? Se det ærlige regnestykke og konkrete greb, der hjælper jer tættere på. Få overblik hos Altid Mad.',
    url: 'https://www.altidhjem.dk/mad-for-3000-om-maaneden',
    type: 'article',
  },
}

// FAQ bruges to steder: synligt på siden og som FAQPage-schema (rich results).
const FAQ: GuideFaq[] = [
  {
    q: 'Kan en familie leve for 3.000 kr. mad om måneden?',
    a: [
      'Ja, nogle familier kan, men for en familie med børn er det et ambitiøst budget.',
      'Danmarks Statistik viser et gennemsnit på cirka 5.481 kr. om måneden for 2 voksne med børn, så 3.000 kr. kræver konsekvent planlægning og billige råvarer.',
    ],
  },
  {
    q: 'Hvad er realistisk for 2 personer?',
    a: [
      'Det afhænger af appetit, madpakker, kostbehov og hvor meget der allerede står i køkkenet.',
      'Danmarks Statistik opgør 2 voksne under 60 uden børn til cirka 3.478 kr. om måneden i gennemsnit, så 3.000 kr. kan være muligt med en stram plan.',
    ],
  },
  {
    q: 'Hvordan kommer vi fra 5.000 til 4.000 kr. om måneden?',
    a: [
      'Begynd med at planlægge aftensmad efter tilbud og vælge en billig hovedbutik.',
      'Brug råvarer på tværs af flere måltider, køb efter en fast liste, og følg madspildet, før I skærer mere fra.',
    ],
  },
  {
    q: 'Hvad koster den billigste uge i jeres analyse?',
    a: [
      'Den billigste samlede kurv kostede 782,70 kr. hos Lidl.',
      'Kurven indeholdt 23 varer til en husstand med 2 voksne og 2 teenagere og svarer til cirka 3.392 kr. om måneden.',
    ],
  },
  {
    q: 'Er det billigere at droppe kød?',
    a: [
      'Det kan være billigere at erstatte nogle kødretter med måltider baseret på bælgfrugter, æg, grøntsager og andre mættende råvarer.',
      'Besparelsen afhænger dog af de konkrete varer, tilbuddene og hvor godt I bruger resterne.',
    ],
  },
  {
    q: 'Hvor skal vi starte?',
    a: [
      'Start med at gennemgå jeres seneste indkøb og vælge et realistisk månedsbudget.',
      'Lav derefter en madplan ud fra køkkenets indhold og ugens tilbud.',
      MAD_IN_APP,
    ],
  },
]

export default function MadFor3000OmMaaneden() {
  return (
    <Guide
      title={GUIDES['/mad-for-3000-om-maaneden'].title}
      lead={
        <>
          <p>
            For en familie er 3.000 kr. til mad om måneden ambitiøst, men ikke umuligt. Det kræver en stram madplan, få impulskøb og retter, der bruger de samme billige
            råvarer på tværs af ugen.
          </p>
          <p>
            Ifølge Danmarks Statistiks Forbrugsundersøgelse 2024 bruger 2 voksne med børn i gennemsnit 65.775 kr. om året på fødevarer og ikke-alkoholiske drikkevarer. Det
            svarer til cirka 5.481 kr. om måneden.
          </p>
          <p>
            Til sammenligning svarer testkurvens pris hos den billigste kæde til cirka 3.392 kr. om måneden for 2 voksne og 2 teenagere. For mindre husstande er målet mere
            realistisk, men der skal stadig planlægges.
          </p>
        </>
      }
      meta={
        <>
          Kilde:{' '}
          <a href={MAD_REPORT_HREF}>
            {MAD_REPORT_LABEL}
          </a>
        </>
      }
      answer={{
        label: 'Budget på 3.000 kr.',
        value: '692',
        unit: 'kr. om ugen',
        note: 'Den billigste testkurv til 2 voksne og 2 teenagere kostede 782,70 kr. om ugen.',
      }}
      factors={{
        label: 'Det kræver',
        items: ['En stram madplan', 'Få impulskøb', 'Retter, der bruger de samme billige råvarer på tværs af ugen'],
      }}
      faq={FAQ}
      cta={MAD_GUIDE_CTA}
      page={{ path: '/mad-for-3000-om-maaneden', description: metadata.description as string, published: GUIDES['/mad-for-3000-om-maaneden'].published, updated: GUIDES['/mad-for-3000-om-maaneden'].updated }}
      sources={{
        checked: '2026-11-16',
        items: [
          { publisher: 'Danmarks Statistik', title: 'Forbrugsundersøgelsen, tabel FU13: Forbrug efter husstand', href: 'https://www.statistikbanken.dk/FU13', note: 'Fødevarer og ikke-alkoholiske drikkevarer, løbende priser, 2024. Månedsbeløb er egne beregninger på baggrund af data fra Danmarks Statistik (årsbeløb delt med 12)' },
          { publisher: 'Danmarks Statistik', title: 'Forbrugsundersøgelsen, tabel FU11: Baggrundsoplysninger', href: 'https://www.statistikbanken.dk/FU11', note: 'Personer i husstanden, gennemsnitshusstand: 2,0 i 2024' },
          { publisher: 'Altid Mad', title: MAD_REPORT_LABEL, href: `https://www.altidhjem.dk${MAD_REPORT_HREF}`, note: 'Den samme ugekurv med 23 varer til 2 voksne og 2 teenagere hos 13 kæder. Genereret 21. september 2026. Månedsbeløb er egne beregninger på baggrund af rapportens ugepriser (ugepris gange 52 delt med 12)' },
        ],
      }}
      related={['/madbudget-familie-paa-4', '/billigste-supermarked', '/madplan-efter-tilbud']}
    >
      <section>
        <h2>Hvad betyder 3.000 kr. til mad om måneden?</h2>
        <p>
          Et månedsbudget på 3.000 kr. svarer til cirka 692 kr. om ugen. Det skal dække alle de fødevarer og ikke-alkoholiske drikkevarer, I regner med i budgettet, ikke kun
          aftensmad.
        </p>
        <p>
          I vores analyse kostede den samme ugentlige kurv med 23 varer 782,70 kr. hos Lidl og 1.313,94 kr. hos Min Købmand. Forskellen var 531,24 kr. om ugen, svarende til
          40,4 pct. eller op til <a href={MAD_REPORT_HREF}>27.624 kr.</a> om året.
        </p>
        <p>
          Testkurven er lavet til 2 voksne og 2 teenagere og kan derfor ikke sammenlignes direkte med alle husholdninger. Den viser dog tydeligt, at valg af butik kan afgøre,
          om budgettet holder.
        </p>
        <GuideFigure tone="lavender" caption="Eksempel: 3.000 kr. om måneden holdt op mod den billigste testkurv. Illustration, ikke et skærmbillede fra appen.">
          <TreTusindMockup />
        </GuideFigure>
      </section>
      <section>
        <h2>Hvem kan realistisk ramme budgettet?</h2>
        <p>
          Jo færre personer der skal spise med, desto mere realistisk er 3.000 kr. om måneden. Børnenes alder, appetit, madpakker og behov for særlige fødevarer har også stor
          betydning.
        </p>
        <p>
          Danmarks Statistik opgør gennemsnittet til 41.851 kr. om året for en gennemsnitshusstand, cirka 3.488 kr. om måneden. Enlige med børn ligger på 38.564 kr. om året,
          cirka 3.214 kr. om måneden, mens 2 voksne under 60 uden børn ligger på 41.730 kr. om året, cirka 3.478 kr. om måneden.
        </p>
        <p>
          Forbrugsundersøgelsen 2024 dækker al mad og alle ikke-alkoholiske drikkevarer gennem året. En gennemsnitshusstand er 2,0 personer i 2024, så tallene kan ikke
          sidestilles direkte med vores ugentlige kurv til 2 voksne og 2 teenagere.
        </p>
      </section>
      <section>
        <h2>Sådan kommer I tættest på 3.000 kr.</h2>
        <p>
          Vælg én hovedbutik med et lavt samlet prisniveau, og brug tilbud fra andre butikker selektivt. Se vores sammenligning af{' '}
          <A href="/billigste-supermarked">det billigste supermarked</A>, før I beslutter, hvor ugens store indkøb skal ligge.
        </p>
        <p>
          Lav derefter en <A href="/madplan-efter-tilbud">madplan efter tilbud</A>, hvor flere retter bruger de samme grøntsager, basisvarer og rester. Begynd med det, I
          allerede har, og skriv først derefter indkøbslisten.
        </p>
        <p>
          I vores analyse kostede hele kurven 599,81 kr. om ugen, hvis hver vare købes dér, hvor den er billigst. Det giver op til <a href={MAD_REPORT_HREF}>37.135 kr.</a> om året
          sammenlignet med den dyreste kurv, men besparelsen skal holdes op mod transport, tid og risikoen for ekstra impulskøb.
        </p>
      </section>
      <section>
        <h2>Det skal I ikke gøre for at spare</h2>
        <p>
          Et madbudget skal ikke holdes ved at springe måltider over eller spise for lidt. Et lavt budget fungerer kun, hvis maden stadig mætter, giver variation og passer
          til familiens hverdag.
        </p>
        <p>
          Undgå også at køre mellem mange butikker for små besparelser uden først at regne på turen. Det kan være bedre at vælge en billig hovedbutik og kun hente enkelte
          tilbud andre steder, når de ligger naturligt på jeres vej.
        </p>
        <p>
          Skær heller ikke alle hyggelige valg væk fra den ene uge til den anden. Et budget er lettere at fastholde, når der er plads til velkendte retter og små ønsker
          inden for den samlede ramme.
        </p>
      </section>
      <section>
        <h2>Find et realistisk madbudget for jeres familie</h2>
        <p>
          Start med jeres faktiske forbrug, ikke et ideal fra et forum. I forældrefora fortæller familier ofte om dagligvarebudgetter på 4.000 til 7.000 kr. om måneden, men
          deres husstande og vaner kan være meget forskellige.
        </p>
        <p>
          Gennemgå, hvad I køber, og hvilke varer der ofte bliver smidt ud. Brug derefter <A href="/madbudget">guiden til madbudget</A> til at sætte et mål, der både kræver
          omtanke og kan holde i hverdagen.
        </p>
        <p>
          Hvis 3.000 kr. er for stramt, kan et mindre første skridt stadig gøre en tydelig forskel. Det vigtigste er et budget, I kan følge uden sult, stress eller
          urealistiske regler.
        </p>
      </section>
      <section>
        <h2>Sådan kan Altid Mad hjælpe</h2>
        <p>
          Altid Mad læser tilbudsaviserne, bygger en madplan efter familiens smag og finder ugens dagligvarer til de bedste priser.
        </p>
        <p>
          Altid Mad er en del af Altid Hjem-appen, som samler hjemmets faste udgifter med ét overblik og ét login. Appen er gratis i App Store og Google Play. Teamet står også bag Altid Energi, Danmarks første gebyrfrie energiselskab.
        </p>
        <GuideStores />
      </section>
    </Guide>
  )
}
