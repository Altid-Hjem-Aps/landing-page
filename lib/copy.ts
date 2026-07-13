// Legal/compliance copy that MUST stay identical everywhere it appears.
// Rendered under the Ét hjem animation in both the WhatIs section and the
// exit-intent dialog — an edit to one must never strand the other.
export const SAVINGS_DISCLAIMER =
  'Eksempelberegning. Besparelsen er vejledende og baseret på antagelser. Den faktiske besparelse afhænger af husstandens forbrug, adresse, aftaler, dækning og gældende priser.'

// Marketing-consent copy for the signup form. Active (not pre-checked),
// OPTIONAL (never blocks submit), names every brand under Altid Hjem, and says
// it is marketing — per the Forbrugerombudsmanden/GDPR fact-check. Altid Hjem
// is the umbrella brand, so a single opt-in covers the whole group; one tick
// records consent to all subbrands. Sender is Altid Hjem ApS (CVR 45637476).
// CONSENT_VERSION is stored with each signup so the exact wording accepted is
// documentable. The shared waitlist is also used by altidmad.dk, which has its
// own granular two-box variant of this consent.
export const CONSENT_VERSION = '2026-07-13'
export const SIGNUP_CONSENT_ALL =
  'Ja tak. Jeg vil modtage e-mails med nyheder, lanceringer, tilbud og markedsføring om Altid Hjem og brands under Altid Hjem (Altid Mad, Altid Forsikring og Altid Mobil) fra Altid Hjem ApS. Jeg kan til enhver tid trække mit samtykke tilbage via afmeldingslinket i e-mails.'
