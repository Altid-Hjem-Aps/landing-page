// The contract for a guide page (ALT-1519). One file in content/guides/ holds everything a
// guide says; components/site/guide/GuidePage.tsx draws it. A new guide is a new data file
// and a four-line route, no TSX.
//
// Text fields are plain strings. Two marks work inside `text`, list items and FAQ answers:
// **fed** for emphasis and [link](/sti) for a link. Nothing else is read as markup.

import type { ExampleId } from './examples'

export type Tone = 'honey' | 'sky' | 'mint' | 'lavender' | 'rose' | 'sand'

/** One entry in "Kilder". Every price and statistic on the page points at one by `id`. */
export type GuideSource = {
  id: string
  /** Who published it, as the reader sees it: "Forbrugerrådet Tænk". */
  publisher: string
  /** The source page's own title. */
  title: string
  href: string
  /** The day the figure was read from the source, YYYY-MM-DD. */
  read: string
}

export type GuidePriceRow = {
  name: string
  /** The figure as shown: "140-250 kr./md." */
  price: string
  /** What the price depends on, one line. */
  note: string
  /** A GuideSource id. Required: a price with no source does not go on the page. */
  source: string
}

export type GuideBlock =
  /** `sources`: GuideSource ids for any figure in the text; they are linked after it. */
  | { type: 'text'; text: string; sources?: string[] }
  | { type: 'list'; items: string[] }
  | { type: 'steps'; items: string[] }
  | { type: 'prices'; rows: GuidePriceRow[]; note: string }
  /** "I appen": a real app screen with seeded numbers. `frame` says what the file is: a bare
   *  screen capture from public/site/app/ (drawn inside the site's phone) or a finished
   *  composition from public/site/mail/ (the phone is already in the picture). */
  | { type: 'app'; frame: 'screen' | 'composition'; src: string; alt: string; tone: Tone; title: string; body: string }
  /** "Eksempel": an animated illustration from components/site/guide/examples, by name. */
  | { type: 'example'; example: ExampleId; tone: Tone; title: string; body: string }

export type GuideSection = {
  /** The anchor: /slug#id. Lower case, no spaces. */
  id: string
  /** Question-shaped where it can be. */
  title: string
  blocks: GuideBlock[]
}

export type Guide = {
  /** The route, without slashes: "hvad-koster-forsikring". */
  slug: string
  /** Short name for the breadcrumb and "Læs også" on other guides. */
  name: string
  meta: { title: string; description: string }
  /** The search question, word for word. */
  h1: string
  lead: string
  /** The short answer in the dark panel: a number, its source, and the figures at a glance. */
  answer: {
    title: string
    body: string[]
    /** GuideSource ids for the numbers in `body` and `facts`. */
    sources: string[]
    facts: { label: string; value: string }[]
  }
  author: { name: string; role: string }
  /** YYYY-MM-DD. */
  published: string
  updated: string
  sections: GuideSection[]
  sources: GuideSource[]
  related: { href: string; title: string; note: string }[]
  faq: { q: string; a: string[] }[]
  /** The one block with store buttons. */
  store: { title: string; body: string }
}
