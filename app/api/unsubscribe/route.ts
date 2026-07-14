import { NextRequest, NextResponse } from 'next/server'
import { setUnsubscribedByToken, getSignupByUnsubToken, setConsentByToken, recordConsentEvent } from '@/lib/db'
import { setResendSubscription } from '@/lib/resend'
import { CONSENT_VERSION } from '@/lib/copy'
import { page, button, preferences } from '@/lib/preference-page'

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
    if (!row) return page('Vi kunne ikke finde dig', 'Linket er måske udløbet. Skriv til hej@altidhjem.dk hvis du har brug for hjælp.', '', 404)
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
  let consent = { mad: false, group: false }
  try {
    const form = await req.formData()
    const a = String(form.get('action') ?? '')
    if (a === 'resubscribe' || a === 'preferences') action = a
    const ticked = new Set(form.getAll('consent').map(String))
    consent = { mad: ticked.has('mad'), group: ticked.has('group') }
  } catch {
    // A one-click POST from a mail app carries no parseable body. Defaulting to
    // 'unsubscribe' is what keeps the native Unsubscribe button in Gmail and
    // Apple Mail working — do not make this default anything else.
  }

  try {
    if (action === 'preferences') {
      const saved = await setConsentByToken(token, { version: CONSENT_VERSION, mad: consent.mad, group: consent.group })
      if (!saved) return page('Vi kunne ikke finde dig', 'Linket er måske udløbet. Skriv til hej@altidhjem.dk hvis du har brug for hjælp.', '', 404)
      await recordConsentEvent({
        publicId: saved.publicId,
        method: 'preference-centre',
        version: CONSENT_VERSION,
        mad: consent.mad,
        group: consent.group,
      })
      return page(
        'Dine valg er gemt',
        consent.mad || consent.group
          ? 'Du hører kun om det, du har sat kryds ved. Du kan altid ændre det via linket i vores mails.'
          : 'Du har fravalgt al markedsføring. Du står stadig på ventelisten og får besked, når vi åbner.',
      )
    }

    const resubscribe = action === 'resubscribe'
    const matched = await setUnsubscribedByToken(token, !resubscribe)
    if (!matched) return page('Vi kunne ikke finde dig', 'Linket er måske udløbet. Skriv til hej@altidhjem.dk hvis du har brug for hjælp.', '', 404)
    if (matched.email) await setResendSubscription(matched.email, !resubscribe) // keep Resend Audience in sync

    if (!resubscribe) {
      // Leaving means leaving: clear the consent flags too. Otherwise the row says
      // "unsubscribed" AND "consented to marketing" at once, and whichever of the
      // two a send-gate happens to read decides whether they get mailed.
      const cleared = await setConsentByToken(token, { version: CONSENT_VERSION, mad: false, group: false })
      if (cleared) {
        await recordConsentEvent({
          publicId: cleared.publicId,
          method: 'unsubscribe-all',
          version: CONSENT_VERSION,
          mad: false,
          group: false,
        })
      }
    }

    if (resubscribe) {
      // Unsubscribing cleared the consent flags, so coming back must NOT claim the
      // person now gets marketing again — it would be a lie, and the send-gate
      // would disagree with the screen. Show them the boxes and let them choose.
      const row = await getSignupByUnsubToken(token)
      return page(
        'Velkommen tilbage',
        'Du er på ventelisten igen. Vælg herunder, hvad du gerne vil høre om — du får ingen markedsføring, før du har sat kryds.',
        row ? preferences(token, row) : '',
      )
    }
    return page('Du er afmeldt', 'Du modtager ikke flere markedsføringsmails fra Altid Hjem.', button(token, 'resubscribe', 'Fortryd, tilmeld mig igen', false))
  } catch (e) {
    console.error('unsubscribe failed', e)
    return page('Noget gik galt', 'Prøv igen om lidt, eller skriv til hej@altidhjem.dk.', '', 500)
  }
}
