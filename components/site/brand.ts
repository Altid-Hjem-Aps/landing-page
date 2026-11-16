// A brand name never breaks over two lines (Thor 15/11): "Altid Hjem", "Altid Energi", "Altid
// Mad" and "Altid Forsikring" keep their two words together with a no-break space. For headings
// and short lines; the copy itself keeps ordinary spaces.
export const keepBrands = (text: string) => text.replace(/Altid (Hjem|Energi|Mad|Forsikring)/g, 'Altid $1')

// The long words in the page titles, with a soft hyphen at the join: at title size on a phone
// one of them is wider than the screen (Thor 15/11), and the browser's own hyphenation breaks
// them in odd places ("forsik-ringsselskab"). A soft hyphen only shows where the line breaks.
const BREAKS: [RegExp, string][] = [
  [/indboforsikring/g, 'indbo­forsikring'],
  [/mobilabonnement/g, 'mobil­abonnement'],
  [/forsikringsselskab/g, 'forsikrings­selskab'],
  [/abonnementer/g, 'abonne­menter'],
  [/Privatlivspolitik/g, 'Privatlivs­politik'],
]

/** A title ready for the page: brand names kept together, long words breakable at their join. */
export const titleText = (text: string) => BREAKS.reduce((t, [word, broken]) => t.replace(word, broken), keepBrands(text))
