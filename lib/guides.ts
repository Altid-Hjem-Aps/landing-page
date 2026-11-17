import type { GuideSlug } from './site-counts'

/** A guide's title (its H1: the search question in the reader's words, docs/guide-recipe.md part
 * 3) and its dates as YYYY-MM-DD: first published, and last updated (a fix sets `updated` to the
 * day of the change). */
export type GuideFacts = { title: string; published: string; updated: string }

/** Every guide's title and dates. The page renders them (its H1, its dates and its Article data)
 * and /guides.json serves them, so the two cannot drift. One entry per path in GUIDE_PATHS, which
 * the type holds to. A page file cannot export these itself: Next.js allows only its own exports
 * in a page. */
export const GUIDES: Record<`/${GuideSlug}`, GuideFacts> = {
  '/bedste-budget-app': { title: 'Hvilken budget-app er bedst til jeres behov?', published: '2026-07-27', updated: '2026-11-16' },
  '/billigste-elselskab': { title: 'Hvilket elselskab er billigst?', published: '2026-07-27', updated: '2026-11-16' },
  '/billigste-mobilabonnement': { title: 'Det billigste mobilabonnement til hele husstanden', published: '2026-07-27', updated: '2026-11-16' },
  '/billigste-supermarked': { title: 'Hvilket supermarked er billigst?', published: '2026-07-26', updated: '2026-11-16' },
  '/fastpris-eller-variabel-el': { title: 'Fastpris eller variabel elaftale?', published: '2026-11-16', updated: '2026-11-16' },
  '/gennemsnitligt-elforbrug': { title: 'Hvad er et normalt elforbrug?', published: '2026-07-27', updated: '2026-11-16' },
  '/graensehandel-beregner': { title: 'Kan grænsehandel betale sig?', published: '2026-07-26', updated: '2026-11-16' },
  '/hvad-koster-bredbaand': { title: 'Hvad koster bredbånd om måneden?', published: '2026-11-16', updated: '2026-11-16' },
  '/hvad-koster-en-bilforsikring': { title: 'Hvad koster en bilforsikring?', published: '2026-11-16', updated: '2026-11-16' },
  '/hvad-koster-en-husforsikring': { title: 'Hvad koster en husforsikring?', published: '2026-11-16', updated: '2026-11-16' },
  '/hvad-koster-en-ladeboks': { title: 'Hvad koster en ladeboks?', published: '2026-07-27', updated: '2026-11-16' },
  '/hvad-koster-en-tyverialarm': { title: 'Hvad koster en tyverialarm?', published: '2026-07-27', updated: '2026-11-16' },
  '/hvad-koster-forsikring': { title: 'Hvad koster forsikring i Danmark?', published: '2026-06-17', updated: '2026-11-16' },
  '/hvad-koster-indboforsikring': { title: 'Hvad koster en indboforsikring?', published: '2026-07-27', updated: '2026-11-16' },
  '/hvorfor-er-elregningen-hoej': { title: 'Hvorfor er min elregning så høj?', published: '2026-11-17', updated: '2026-11-17' },
  '/hvornar-er-strommen-billigst': { title: 'Hvornår er strømmen billigst?', published: '2026-06-25', updated: '2026-11-16' },
  '/jul-paa-budget': { title: 'Jul på budget uden at spare på hyggen', published: '2026-07-26', updated: '2026-11-16' },
  '/mad-for-3000-om-maaneden': { title: 'Kan en familie få mad for 3.000 kr. om måneden?', published: '2026-07-26', updated: '2026-11-16' },
  '/madbudget': { title: 'Hvad er et normalt madbudget for en familie?', published: '2026-07-26', updated: '2026-11-16' },
  '/madbudget-familie-paa-4': { title: 'Hvad koster mad til en familie på 4?', published: '2026-07-26', updated: '2026-11-16' },
  '/madpakker-paa-budget': { title: 'Madpakker på budget, som børnene har lyst til at spise', published: '2026-07-26', updated: '2026-11-16' },
  '/madplan-efter-tilbud': { title: 'Sådan laver du en madplan efter ugens tilbud', published: '2026-07-26', updated: '2026-11-16' },
  '/opsig-abonnementer': { title: 'Sådan opsiger I husstandens abonnementer', published: '2026-07-27', updated: '2026-11-16' },
  '/skift-forsikringsselskab': { title: 'Sådan skifter I forsikringsselskab', published: '2026-07-27', updated: '2026-11-16' },
  '/spar-penge-paa-dagligvarer': { title: 'Sådan sparer du penge på dagligvarer', published: '2026-07-26', updated: '2026-11-16' },
  '/spiir-alternativ': { title: 'Spiir lukkede 8. juni 2026: Hvad skal du bruge i stedet?', published: '2026-06-10', updated: '2026-11-16' },
}
