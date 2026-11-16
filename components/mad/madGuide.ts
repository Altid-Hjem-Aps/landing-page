// Shared strings for the nine Altid Mad guides that moved from altidmad.dk to altidhjem.dk
// (16 Nov 2026). The article text itself is copied word for word from altidmad.dk; only what
// cannot stay true after the move lives here: the end-of-page call to action (the sign-up
// block it replaces is closed) and the source line for the price-check figures.

/** The guide's closing block (Guide `cta`). Mad's line on the front page reused as the subtitle. */
export const MAD_GUIDE_CTA = {
  eyebrow: 'Altid Mad i Altid Hjem',
  heading: 'Hent Altid Hjem, og få styr på madbudgettet',
  subtitle: 'Appen er gratis. Få en madplan for ugen og en indkøbsliste, der viser, hvor varerne er billigst.',
}

/** Where every price-check figure (782,70 kr., 27.624 kr., 37.135 kr. ...) comes from. A fixed
 * address on this site (next.config.ts), never the PDF's own URL. */
export const MAD_REPORT_HREF = '/madrapport'
export const MAD_REPORT_LABEL = 'Altid Mad-rapporten, 3. kvartal 2026'

/** Replaces the old "Appen er ikke lanceret endnu ..." sentences, which stopped being
 * true when the app launched. */
export const MAD_IN_APP = 'Altid Mad er en del af Altid Hjem-appen, som I kan hente gratis i App Store og Google Play.'
