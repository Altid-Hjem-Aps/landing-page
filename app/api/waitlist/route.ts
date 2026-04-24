import { NextRequest, NextResponse } from 'next/server'
import { sendWaitlistConfirmation } from '@/lib/send-email'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'https://api.altidhjem.dk'
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^\d{8}$/

export async function POST(req: NextRequest) {
  const body = await req.json()

  if (body.step === 1) {
    const { email, name, phone } = body

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

    // fire-and-forget — don't let email failure block signup
    sendWaitlistConfirmation(String(name).trim(), String(email).toLowerCase().trim()).catch(console.error)

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
