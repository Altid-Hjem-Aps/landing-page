import { consentSentences, consentVersion } from 'altid-consent'

// Legal/compliance copy that MUST stay identical everywhere it appears.
// Rendered under the Ét hjem animation in both the WhatIs section and the
// exit-intent dialog — an edit to one must never strand the other.
export const SAVINGS_DISCLAIMER =
  'Eksempelberegning. Besparelsen er vejledende og baseret på antagelser. Den faktiske besparelse afhænger af husstandens forbrug, adresse, aftaler, dækning og gældende priser.'

// Marketing consent. The wording, the family of brands and the version are
// decided at Altid Hjem level and live in the altid-consent package: its
// DECISIONS.md says why the box works the way it does, and its CHANGELOG.md
// holds the exact text of every version. Change them there, never here.
//
// Hjem-specific, so still here:
// - Sender is Altid Hjem ApS (CVR 45637476). Altid Hjem is the umbrella brand,
//   not a family brand, so the signup is ONE combined box: one tick stores both
//   flags (consentFlags(state, 'hjem')).
// - CONSENT_VERSION is stored with each signup. The package derives it
//   ('<template>-hjem'), so the exact text accepted is identifiable from the
//   version alone on the waitlist shared with altidmad.dk.
// - 2026-07-14 (legal fact-check): the Altid Hjem launch email is
//   markedsføringslov §10 direct marketing, but the waitlist signup itself is
//   the specific prior consent to that launch notice (SIGNUP_LAUNCH_NOTICE
//   states the purpose above the button). The box is therefore purely ongoing
//   marketing. The launch notice is this site's own text and is not versioned
//   by the package.
export const CONSENT_VERSION = consentVersion('hjem')
export const SIGNUP_LAUNCH_NOTICE =
  'Når du skriver dig op, giver Altid Hjem ApS dig besked på e-mail, når Altid Hjem lanceres. Du kan til enhver tid forlade ventelisten.'

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

// Per-brand wording for the preference centre and the confirmation mail.
//
// The Hjem signup uses ONE combined box that sets both flags, so it has no
// per-brand text of its own. But the preference centre edits the flags
// SEPARATELY, and it serves altidmad.dk's audience too. On the shared waitlist
// the `mad` column is Altid Mad's own flag (the package's `own` for the `mad`
// brand) and `group` is Altid Hjem and the rest of the family (`group`), so
// both are the package's `mad` sentences: the same flag must never be described
// in two different ways depending on which site the person is looking at.
// Whole sentences on purpose: emails/consent-confirm.ts quotes one as the
// consent itself, since clicking the link in that mail IS the act of consenting.
const MAD = consentSentences('mad')
export const PREF_CONSENT_MAD = MAD.own
export const PREF_CONSENT_GROUP = MAD.group


// Shown when the lookup that decides the 409 path could not run (Supabase raced
// its 2s timeout). It must NOT fall back to "Du er allerede skrevet op!" — that is
// the sentence that told 36 people they were covered while their consent was
// dropped. A retryable failure is honest; a reassuring lie is not.
export const LOOKUP_FAILED_ERROR = 'Vi kunne ikke behandle din tilmelding lige nu. Prøv igen om et øjeblik.'

// The plain-duplicate message, for someone who ticked nothing.
export const DUPLICATE_ERROR = 'Du er allerede skrevet op!'

// Ceiling on confirmation mails per hour ACROSS the whole site, not per address.
export const CONFIRM_SENDS_PER_HOUR = 100
