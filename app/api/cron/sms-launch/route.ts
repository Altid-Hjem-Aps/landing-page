import { NextRequest, NextResponse } from 'next/server'
import { sendLaunchSmsToGroup } from '@/lib/send-sms'

// Called by Vercel cron on 27 May at 10:00 Copenhagen time (08:00 UTC / CEST)
export async function GET(req: NextRequest) {
  const secret = req.headers.get('authorization')
  if (secret !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await sendLaunchSmsToGroup()

  return NextResponse.json({ ok: true })
}
