import { NextRequest, NextResponse } from 'next/server'
import {
  setUnsubscribedByToken,
  unsubscribeAllByToken,
  getSignupByUnsubToken,
  setConsentByToken,
  recordConsentEvent,
  legacyFlagsFromMatrix,
  EMPTY_CONSENT,
  type ConsentMatrix,
} from '@/lib/db'
import { setResendSubscription } from '@/lib/resend'
import { PREF_CONSENT_VERSION, PREF_SMS_NOT_SAVED } from '@/lib/copy'
import { cleanPhone } from '@/lib/phone'
import { page, button, preferences, backToPreferences } from '@/lib/preference-page'

const notFound = () =>
  page('Vi kunne ikke finde dig', 'Linket er måske udløbet. Skriv til hej@altidhjem.dk hvis du har brug for hjælp.', '', 404)

const anySms = (m: ConsentMatrix) => m.hjemSms || m.madSms || m.forsikringSms || m.mobilSms

// This route is the ONE preference centre for the whole group: altidmad.dk's
// emails point their unsubscribe links here too, because the two sites share one
// waitlist row per person. Anything built here reaches both audiences; the same
// thing built on the Mad site's own /api/unsubscribe would be unreachable, since
// no email ever links to it.

// Opening the link only SHOWS the page — it never changes anything, so link
// scanners and antivirus that auto-open every URL in a mail cannot unsubscribe
// anyone, or silently change their consent.
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token') ?? ''
  if (!token) return page('Ugyldigt link', 'Linket mangler oplysninger. Prøv at klikke på linket i mailen igen.', '', 400)

  try {
    const row = await getSignupByUnsubToken(token)
    if (!row) return notFound()
    if (row.unsubscribed) {
      return page(
        'Du er afmeldt',
        'Du modtager ikke markedsføringsmails fra Altid Hjem.',
        button(token, 'resubscribe', 'Fortryd, tilmeld mig igen', false),
      )
    }
    return page('Vælg hvad du vil høre om', 'Sæt kryds ved det, du gerne vil modtage. Du kan altid ændre det igen.', preferences(token, row))
  } catch (e) {
    console.error('preference centre failed', e)
    return page('Noget gik galt', 'Prøv igen om lidt, eller skriv til hej@altidhjem.dk.', '', 500)
  }
}

// The actual change happens here — on a click (our forms) or a one-click POST
// (RFC 8058 List-Unsubscribe-Post from the mail app).
export async function POST(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token') ?? ''
  if (!token) return new NextResponse(null, { status: 400 })

  let action = 'unsubscribe'
  let matrix: ConsentMatrix = EMPTY_CONSENT
  let phone: string | null = null
  let legacyForm = false
  try {
    const form = await req.formData()
    const a = String(form.get('action') ?? '')
    if (a === 'resubscribe' || a === 'preferences') action = a
    // An unticked checkbox sends nothing, so the ONLY safe read is "present in
    // the payload = true". Anything absent stays false: a dropped field must
    // never read as a yes.
    const ticked = new Set(form.getAll('consent').map(String))
    matrix = {
      hjemEmail: ticked.has('hjem_email'),
      hjemSms: ticked.has('hjem_sms'),
      madEmail: ticked.has('mad_email'),
      madSms: ticked.has('mad_sms'),
      forsikringEmail: ticked.has('forsikring_email'),
      forsikringSms: ticked.has('forsikring_sms'),
      mobilEmail: ticked.has('mobil_email'),
      mobilSms: ticked.has('mobil_sms'),
    }
    // The PRE-GRID preference page posted 'mad' / 'group' (still live until this
    // deploys, and open in stale tabs after it). Without this mapping every old
    // value reads as unticked, so a stale-tab save would silently wipe all
    // stored consents while the page says "gemt". Old values only count when no
    // new-model value is present: a payload speaking the new language is
    // authoritative.
    const newFormValues = Object.values(matrix).some(Boolean)
    if (!newFormValues && (ticked.has('mad') || ticked.has('group'))) {
      legacyForm = true
      matrix = {
        ...EMPTY_CONSENT,
        madEmail: ticked.has('mad'),
        hjemEmail: ticked.has('group'),
        forsikringEmail: ticked.has('group'),
        mobilEmail: ticked.has('group'),
      }
    }
    phone = cleanPhone(form.get('phone'))
  } catch {
    // A one-click POST from a mail app carries no parseable body. Defaulting to
    // 'unsubscribe' is what keeps the native Unsubscribe button in Gmail and
    // Apple Mail working — do not make this default anything else.
  }

  try {
    if (action === 'preferences') {
      if (legacyForm) {
        // The old form knew nothing of SMS or the phone field, so a legacy
        // payload must not touch either: carry the row's current SMS flags and
        // number through unchanged. Absence of a field a form never rendered is
        // not a withdrawal.
        const current = await getSignupByUnsubToken(token)
        if (!current) return notFound()
        matrix = {
          ...matrix,
          hjemSms: current.matrix.hjemSms,
          madSms: current.matrix.madSms,
          forsikringSms: current.matrix.forsikringSms,
          mobilSms: current.matrix.mobilSms,
        }
        phone = current.phone
      }
      const saved = await setConsentByToken(token, { version: PREF_CONSENT_VERSION, matrix, phone })
      if (!saved) return notFound()
      // saved.matrix, never the raw `matrix` off the form: setConsentByToken drops
      // SMS flags that have no valid number behind them, and the audit trail must
      // record what was stored, not what was asked for.
      const legacy = legacyFlagsFromMatrix(saved.matrix)
      await recordConsentEvent({
        publicId: saved.publicId,
        method: 'preference-centre',
        version: PREF_CONSENT_VERSION,
        mad: legacy.mad,
        group: legacy.group,
        matrix: saved.matrix,
      })
      const anyTicked = Object.values(saved.matrix).some(Boolean)
      // If SMS was asked for but refused (no valid number — a JS-less client or
      // stale tab can submit that), say so. "Gemt" for a dropped choice is the
      // one lie a consent screen must never tell.
      const smsDropped = anySms(matrix) && !anySms(saved.matrix)
      return page(
        'Dine valg er gemt',
        (anyTicked
          ? 'Du hører kun om det, du har sat kryds ved.'
          : 'Du har fravalgt al markedsføring. Du står stadig på ventelisten og får besked, når vi åbner.') +
          (smsDropped ? ` ${PREF_SMS_NOT_SAVED}` : ''),
        backToPreferences(token),
      )
    }

    const resubscribe = action === 'resubscribe'

    if (!resubscribe) {
      // ONE atomic UPDATE: every flag (SMS included), the legacy pair, the phone
      // number and the unsubscribed flag change together — there is no in-between
      // state for a concurrent request to observe, and no failure point that
      // leaves "unsubscribed AND consented" behind. "Afmeld mig fra alt" has to
      // mean ALL, and the number's only purpose was the SMS consent that just
      // went away.
      const cleared = await unsubscribeAllByToken(token, PREF_CONSENT_VERSION)
      if (!cleared) return notFound()
      await recordConsentEvent({
        publicId: cleared.publicId,
        method: 'unsubscribe-all',
        version: PREF_CONSENT_VERSION,
        mad: false,
        group: false,
        matrix: EMPTY_CONSENT,
      })
      if (cleared.email) await setResendSubscription(cleared.email, true) // keep Resend Audience in sync
      return page('Du er afmeldt', 'Du modtager ikke flere markedsføringsmails fra Altid Hjem.', button(token, 'resubscribe', 'Fortryd, tilmeld mig igen', false))
    }

    const matched = await setUnsubscribedByToken(token, false)
    if (!matched) return notFound()
    if (matched.email) await setResendSubscription(matched.email, false) // keep Resend Audience in sync

    // Unsubscribing cleared the consent flags, so coming back must NOT claim the
    // person now gets marketing again — it would be a lie, and the send-gate
    // would disagree with the screen. Show them the boxes and let them choose.
    const row = await getSignupByUnsubToken(token)
    return page(
      'Velkommen tilbage',
      'Du er på ventelisten igen. Vælg herunder, hvad du gerne vil høre om. Du får ingen markedsføring, før du har sat kryds.',
      row ? preferences(token, row) : '',
    )
  } catch (e) {
    console.error('unsubscribe failed', e)
    return page('Noget gik galt', 'Prøv igen om lidt, eller skriv til hej@altidhjem.dk.', '', 500)
  }
}
