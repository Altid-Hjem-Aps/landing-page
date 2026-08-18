import { NextRequest, NextResponse } from 'next/server'
import { purgeEnergiReferralEvents } from '@/lib/db'

// Retention for the referral counters (ALT-287): the privacy policy says
// referral events are kept for 90 days. Vercel cron calls this daily with the
// CRON_SECRET bearer, same as the other crons.

export const dynamic = 'force-dynamic'

export const REFERRAL_EVENT_RETENTION_DAYS = 90

export async function GET(req: NextRequest) {
  if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ success: false, error: 'unauthorized' }, { status: 401 })
  }
  try {
    const deleted = await purgeEnergiReferralEvents(REFERRAL_EVENT_RETENTION_DAYS)
    return NextResponse.json({ success: true, deleted, retentionDays: REFERRAL_EVENT_RETENTION_DAYS })
  } catch (e) {
    console.error('referral purge failed', e instanceof Error ? e.message : e)
    return NextResponse.json({ success: false, error: 'purge_failed' }, { status: 500 })
  }
}
