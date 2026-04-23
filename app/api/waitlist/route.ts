import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^\d{8}$/

export async function POST(req: NextRequest) {
  const body = await req.json()

  if (body.step === 1) {
    const { email, name, phone, address } = body

    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json({ success: false, error: 'Ugyldig e-mail' }, { status: 400 })
    }
    if (!phone || !PHONE_RE.test(String(phone).replace(/\s/g, ''))) {
      return NextResponse.json({ success: false, error: 'Ugyldigt mobilnummer' }, { status: 400 })
    }
    if (!name || String(name).trim().length < 2) {
      return NextResponse.json({ success: false, error: 'Navn mangler' }, { status: 400 })
    }

    const { error } = await supabaseServer.from('waitlist').upsert(
      {
        phone: String(phone).replace(/\s/g, ''),
        email: String(email).toLowerCase().trim(),
        name: String(name).trim(),
        address: address ? String(address).trim() : null,
      },
      { onConflict: 'phone' }
    )

    if (error) {
      console.error('Waitlist step 1 error:', error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
  }

  if (body.step === 2) {
    const { phone, age, household, why, electricity } = body

    if (!phone) {
      return NextResponse.json({ success: false, error: 'Mangler telefonnummer' }, { status: 400 })
    }

    const { error } = await supabaseServer
      .from('waitlist')
      .update({
        age: age ? String(age).slice(0, 3) : null,
        household: household ? String(household).slice(0, 10) : null,
        why: why ? String(why).slice(0, 500) : null,
        electricity: electricity ? String(electricity).slice(0, 100) : null,
        completed: true,
      })
      .eq('phone', String(phone).replace(/\s/g, ''))

    if (error) {
      console.error('Waitlist step 2 error:', error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
  }

  return NextResponse.json({ success: true })
}
