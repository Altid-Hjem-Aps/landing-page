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
// CONSENT_VERSION is stored with each signup. The site suffix ('-hjem', vs the
// altidmad.dk '-mad') makes it self-documenting on the SHARED waitlist: because
// the two sites use different wording, the exact text accepted is identifiable
// from the version alone, not only by joining on signup_source. altidmad.dk has
// a granular two-box variant of this consent.
// 2026-07-14 (legal fact-check): the Altid Hjem launch email is markedsføringslov
// §10 direct marketing, but the waitlist signup itself is the specific prior
// consent to that launch notice (SIGNUP_LAUNCH_NOTICE states the purpose above the
// button). "lanceringer" is dropped from the box: unlike the altidmad.dk group
// box, here the person signs up for the whole Altid Hjem platform that bundles the
// subbrands, so the platform launch is what they signed up for, not separate
// unrequested launches. The box is therefore purely ongoing marketing.
export const CONSENT_VERSION = '2026-07-14.2-hjem'
export const SIGNUP_LAUNCH_NOTICE =
  'Når du skriver dig op, giver Altid Hjem ApS dig besked på e-mail, når Altid Hjem lanceres. Du kan til enhver tid forlade ventelisten.'
export const SIGNUP_CONSENT_ALL =
  'Ja tak. Jeg vil gerne modtage e-mails med nyheder, tilbud og anden markedsføring om Altid Hjem og brands under Altid Hjem (Altid Mad, Altid Forsikring og Altid Mobil) fra Altid Hjem ApS. Jeg kan til enhver tid trække mit samtykke tilbage.'

// Double-opt-in copy for an already-listed person who ticks the consent box.
//
// Why: the signup form is anonymous, so it cannot prove the person typing an
// address owns it. Writing consent straight from that form would let a stranger
// sign anyone up for marketing, which is why the 409 path refuses to. But
// refusing SILENTLY, behind "Du er allerede skrevet op!", tells people they are
// covered when nothing was stored — 36 people lost their consent that way on
// altidmad.dk on 14 Jul, and this form had the identical bug. The confirmation
// mail turns the refusal into a route: the consent is held pending until the
// person clicks a link in their own inbox, which is the proof the form cannot
// give.
//
// Shared, word for word, with altidmad.dk: the two sites are one waitlist, and a
// person who signs up on one and confirms from the other must not be handed two
// different voices mid-flow.
export const CONFIRM_SENT_HEADING = 'Du er næsten i mål'
export function confirmSentBody(email: string): string {
  return `Du står allerede på ventelisten. Vi har sendt en mail til ${email} med et link, som du skal trykke på, før vi må sende dig markedsføring.`
}

// GET on the emailed link only RENDERS this page; the consent is written on
// POST. Not optional: corporate mail scanners (Safe Links, Proofpoint) auto-open
// every URL in an email, so a link that wrote consent on GET would have the
// scanner consent on the person's behalf before they ever saw the mail.
export const CONFIRM_PAGE_HEADING = 'Bekræft, at du vil høre nyt fra Altid Hjem'
// Names the actual two-step interaction: the boxes ship unticked (a pre-ticked
// box is not valid consent), so "press the button" alone described one action
// where two are required.
export const CONFIRM_PAGE_INTRO = 'Sæt kryds ved det, du vil sige ja til, og tryk på knappen:'
export const CONFIRM_PAGE_BUTTON = 'Bekræft'
export const CONFIRM_PAGE_BUTTON_PENDING = 'Bekræfter…'
// Read by screen readers while the submission is in flight (the button itself
// is disabled, which drops focus silently).
export const CONFIRM_PENDING_ANNOUNCE = 'Sender din bekræftelse'
// Inline error when the form is submitted with every box unticked (reachable
// without JavaScript). NOT the expired-link screen: the link is fine.
export const CONFIRM_PICK_ONE = 'Vælg mindst ét samtykke for at fortsætte.'

export const CONFIRM_DONE_HEADING = 'Tak, nu er du med'
export const CONFIRM_DONE_BODY =
  'Du vil fremover høre fra os, når vi har nyt til dig. Du kan altid trække dit samtykke tilbage via afmeldingslinket i vores e-mails.'

// A replayed confirmation (double-click, back button, re-clicked email link).
// Speaks about the past act, not the present state: the consent may have been
// revoked since redemption, so "du er med" could be false where "du har
// allerede bekræftet" is always true.
export const CONFIRM_ALREADY_HEADING = 'Du har allerede bekræftet'
export const CONFIRM_ALREADY_BODY =
  'Din bekræftelse er registreret, og du behøver ikke gøre mere. Du kan altid trække dit samtykke tilbage via afmeldingslinket i vores e-mails.'

export const CONFIRM_EXPIRED_HEADING = 'Linket virker desværre ikke længere'
export const CONFIRM_EXPIRED_BODY =
  'Det kan være udløbet eller være blevet ændret undervejs i din mail. Skriv dig op igen, så sender vi dig et nyt link.'

export const CONFIRM_HOME_CTA = 'Gå til altidhjem.dk'

export const CONFIRM_RATE_LIMITED_HEADING = 'Vi har allerede sendt dig en mail'
export const CONFIRM_RATE_LIMITED_BODY =
  'Tjek din indbakke, og husk også at kigge i spam. Kan du ikke finde mailen, kan du prøve igen om en time.'

export const ALREADY_CONSENTED_HEADING = 'Du er allerede med'
export const ALREADY_CONSENTED_BODY =
  'Du står på ventelisten og vil modtage nyt fra Altid Hjem. Du behøver ikke gøre mere.'

// Per-brand wording for the preference centre.
//
// The Hjem signup uses ONE combined box (SIGNUP_CONSENT_ALL) that sets both
// flags, so it has no per-brand text of its own. But the preference centre edits
// the flags SEPARATELY, and it serves altidmad.dk's audience too — so it must
// name each brand on its own. These are altidmad.dk's exact strings, reused
// verbatim: the same flag must never be described in two different ways
// depending on which site the person happens to be looking at.
export const PREF_CONSENT_MAD =
  'Ja tak. Jeg vil gerne modtage e-mails med nyheder, tilbud og anden markedsføring om Altid Mad fra Altid Hjem ApS. Jeg kan til enhver tid trække mit samtykke tilbage.'
export const PREF_CONSENT_GROUP =
  'Ja tak. Jeg vil gerne modtage e-mails med nyheder, lanceringer, tilbud og anden markedsføring om Altid Hjem, Altid Forsikring og Altid Mobil fra Altid Hjem ApS. Jeg kan til enhver tid trække mit samtykke tilbage.'


// Shown when the lookup that decides the 409 path could not run (Supabase raced
// its 2s timeout). It must NOT fall back to "Du er allerede skrevet op!" — that is
// the sentence that told 36 people they were covered while their consent was
// dropped. A retryable failure is honest; a reassuring lie is not.
export const LOOKUP_FAILED_ERROR = 'Vi kunne ikke behandle din tilmelding lige nu. Prøv igen om et øjeblik.'

// The plain-duplicate message, for someone who ticked nothing.
export const DUPLICATE_ERROR = 'Du er allerede skrevet op!'

// Ceiling on confirmation mails per hour ACROSS the whole site, not per address.
export const CONFIRM_SENDS_PER_HOUR = 100
