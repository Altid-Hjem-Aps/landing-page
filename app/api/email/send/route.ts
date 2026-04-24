import { NextRequest, NextResponse } from 'next/server'
import { sendWaitlistFollowup1, sendWaitlistFollowup2 } from '@/lib/send-email'

// POST /api/email/send
// Body: { type: 'followup-1' | 'followup-2', name: string, email: string }
// Protected by CRON_SECRET header (same secret used for Vercel cron jobs)
export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-cron-secret')
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { type, name, email } = await req.json()

  if (!type || !name || !email) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  if (type === 'followup-1') {
    await sendWaitlistFollowup1(name, email)
  } else if (type === 'followup-2') {
    await sendWaitlistFollowup2(name, email)
  } else {
    return NextResponse.json({ error: 'Unknown type' }, { status: 400 })
  }

  return NextResponse.json({ success: true })
}
