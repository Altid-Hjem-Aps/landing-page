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
// 2026-07-14 (legal fact-check): the Altid Hjem launch email is markedsføringslov
// §10 direct marketing, but the waitlist signup itself is the specific prior
// consent to that launch notice (SIGNUP_LAUNCH_NOTICE states the purpose above the
// button). "lanceringer" is dropped from the box: unlike the altidmad.dk group
// box, here the person signs up for the whole Altid Hjem platform that bundles the
// subbrands, so the platform launch is what they signed up for, not separate
// unrequested launches. The box is therefore purely ongoing marketing.
export const CONSENT_VERSION = '2026-07-14.2'
export const SIGNUP_LAUNCH_NOTICE =
  'Når du skriver dig op, giver Altid Hjem ApS dig besked på e-mail, når Altid Hjem lanceres. Du kan til enhver tid forlade ventelisten.'
export const SIGNUP_CONSENT_ALL =
  'Ja tak. Jeg vil gerne modtage e-mails med nyheder, tilbud og anden markedsføring om Altid Hjem og brands under Altid Hjem (Altid Mad, Altid Forsikring og Altid Mobil) fra Altid Hjem ApS. Jeg kan til enhver tid trække mit samtykke tilbage.'
