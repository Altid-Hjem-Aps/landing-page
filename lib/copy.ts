import { consentSentences, consentVersion } from 'altid-consent'

// Legal copy shown under the bills-into-the-app animation in the WhatIs section.
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
//   version alone on the table shared with altidmad.dk.
export const CONSENT_VERSION = consentVersion('hjem')

// Double-opt-in copy for someone already on file whose consent is asked for from
// an anonymous form. The form cannot prove the person typing an address owns it,
// so the consent is held pending until the person clicks a link in their own
// inbox, which is the proof the form cannot give.
//
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
  'Det kan være udløbet eller være blevet ændret undervejs i din mail. Tilmeld dig igen på altidhjem.dk, så sender vi dig et nyt link.'

export const CONFIRM_HOME_CTA = 'Gå til altidhjem.dk'

// Per-brand wording for the preference centre and the confirmation mail.
//
// The Hjem signup uses ONE combined box that sets both flags, so it has no
// per-brand text of its own. But the preference centre edits the flags
// SEPARATELY, and it serves altidmad.dk's audience too. On the shared table
// the `mad` column is Altid Mad's own flag (the package's `own` for the `mad`
// brand) and `group` is Altid Hjem and the rest of the family (`group`), so
// both are the package's `mad` sentences: the same flag must never be described
// in two different ways depending on which site the person is looking at.
// Whole sentences on purpose: emails/consent-confirm.ts quotes one as the
// consent itself, since clicking the link in that mail IS the act of consenting.
const MAD = consentSentences('mad')
export const PREF_CONSENT_MAD = MAD.own
export const PREF_CONSENT_GROUP = MAD.group


// Shown when a lookup or a write could not run. A retryable failure is honest; a
// reassuring lie is not (36 people on altidmad.dk lost their consent to one on 14 Jul).
export const LOOKUP_FAILED_ERROR = 'Vi kunne ikke behandle din tilmelding lige nu. Prøv igen om et øjeblik.'

// Ceiling on confirmation mails per hour ACROSS the whole site, not per address.
export const CONFIRM_SENDS_PER_HOUR = 100
