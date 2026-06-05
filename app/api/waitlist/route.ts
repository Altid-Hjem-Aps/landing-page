import { NextRequest, NextResponse } from 'next/server'
import { sendWaitlistConfirmation, scheduleReleaseEmail, sendReferralProgress } from '@/lib/send-email'
import { sendWaitlistConfirmationSms } from '@/lib/send-sms'
import { trackServer, identifyServer } from '@/lib/amplitude.server'
import { recordReferral, mirrorSignup, getReferrerProgress } from '@/lib/db'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'https://api.altidhjem.dk'
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^\d{8}$/

const WINDOW_MS = 60 * 60 * 1000 // 1 hour
const MAX_ATTEMPTS = 3
const ipAttempts = new Map<string, { count: number; resetAt: number }>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = ipAttempts.get(ip)
  if (!entry || now > entry.resetAt) {
    ipAttempts.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return false
  }
  if (entry.count >= MAX_ATTEMPTS) return true
  entry.count++
  return false
}

export async function POST(req: NextRequest) {
  const body = await req.json()

  if (body.step === 1) {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
    if (isRateLimited(ip))
      return NextResponse.json({ success: false, error: 'For mange forsøg. Prøv igen om en time.' }, { status: 429 })

    const { email, name, phone, referredBy } = body

    if (!email || !EMAIL_RE.test(email))
      return NextResponse.json({ success: false, error: 'Ugyldig e-mail' }, { status: 400 })
    if (!phone || !PHONE_RE.test(String(phone).replace(/\s/g, '')))
      return NextResponse.json({ success: false, error: 'Ugyldigt mobilnummer' }, { status: 400 })
    if (!name || String(name).trim().length < 2)
      return NextResponse.json({ success: false, error: 'Navn mangler' }, { status: 400 })

    const res = await fetch(`${API_URL}/api/waitlist`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: String(name).trim(),
        mobile: String(phone).replace(/\s/g, ''),
        email: String(email).toLowerCase().trim(),
      }),
    })

    const data = await res.json().catch(() => ({}))

    if (res.status === 409)
      return NextResponse.json({ success: false, error: 'Du er allerede skrevet op!' }, { status: 409 })
    if (!res.ok)
      return NextResponse.json({ success: false, error: data.message ?? 'Noget gik galt' }, { status: res.status })

    // fire-and-forget — don't let these failures block signup
    const cleanName = String(name).trim()
    const cleanEmail = String(email).toLowerCase().trim()
    const cleanPhone = String(phone).replace(/\s/g, '')
    sendWaitlistConfirmation(cleanName, cleanEmail).catch(console.error)
    scheduleReleaseEmail(cleanName, cleanEmail).catch(console.error)
    sendWaitlistConfirmationSms(cleanName, cleanPhone).catch(console.error)

    // Mirror the signup into Supabase so leaderboard position is computable.
    try {
      await mirrorSignup(data.id as string, { email: cleanEmail, firstName: cleanName.split(' ')[0] })
    } catch (e) {
      console.error('mirrorSignup failed', e)
    }

    // If they arrived via someone's referral link (?ref=CODE): record it, then
    // email the referrer their updated progress (new count + queue position).
    // Awaited so it completes in serverless; wrapped so a hiccup never blocks signup.
    if (referredBy) {
      try {
        await recordReferral({
          referrerCode: String(referredBy),
          referredEmail: cleanEmail,
          referredId: data.id as string,
        })
        const prog = await getReferrerProgress(String(referredBy))
        if (prog?.email) {
          await sendReferralProgress(prog.firstName, prog.email, {
            referralCount: prog.count,
            position: prog.position ?? 0,
            progressPct: prog.progressPct,
            inviteUrl: `https://altidhjem.dk/?ref=${referredBy}`,
          })
        }
      } catch (e) {
        console.error('referral progress failed', e)
      }
    }

    const userId = data.id as string
    identifyServer(userId, { waitlist_signup: true })
    trackServer('Waitlist Signup Confirmed', { signup_id: userId }, userId)

    return NextResponse.json({ success: true, id: data.id })
  }

  if (body.step === 2) {
    const { id, age, household, why, electricity } = body

    if (!id)
      return NextResponse.json({ success: false, error: 'Mangler id' }, { status: 400 })

    const survey: Record<string, unknown> = {}
    if (age) survey.age = Number(age)
    if (household) {
      const n = household === '5+' ? 5 : Number(household)
      if (!isNaN(n)) survey.householdSize = n
    }
    if (why) survey.motivation = String(why).slice(0, 500)
    if (electricity) survey.electricityProvider = String(electricity).slice(0, 100)

    const res = await fetch(`${API_URL}/api/waitlist/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(survey),
    })

    if (!res.ok)
      return NextResponse.json({ success: false, error: 'Noget gik galt' }, { status: res.status })
  }

  return NextResponse.json({ success: true })
}
