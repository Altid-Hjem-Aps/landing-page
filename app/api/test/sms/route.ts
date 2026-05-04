import { NextRequest, NextResponse } from 'next/server'
import { sendWaitlistConfirmationSms, addToWaitlistGroup } from '@/lib/send-sms'

// DELETE THIS FILE before going to production
// Usage: POST /api/test/sms { "phone": "12345678", "name": "Alex" }
export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 })
  }

  const { phone, name } = await req.json()

  if (!phone || !name) {
    return NextResponse.json({ error: 'phone and name required' }, { status: 400 })
  }

  const keyPreview = process.env.GATEWAYAPI_API_KEY
    ? `set (starts with: ${process.env.GATEWAYAPI_API_KEY.slice(0, 4)}...)`
    : 'NOT SET'

  const results: Record<string, string> = { keyPreview }

  try {
    await sendWaitlistConfirmationSms(name, phone)
    results.sms = 'ok'
  } catch (e) {
    results.sms = String(e)
  }

  try {
    await addToWaitlistGroup(phone)
    results.group = 'ok'
  } catch (e) {
    results.group = String(e)
  }

  return NextResponse.json(results)
}
