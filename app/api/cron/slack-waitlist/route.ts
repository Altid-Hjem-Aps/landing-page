import { NextRequest, NextResponse } from 'next/server'
import { getResend } from '@/lib/resend'

const CHANNEL = process.env.SLACK_CHANNEL_ID!
const MSG_PREFIX = '*Venteliste'

async function slack(method: string, body: Record<string, unknown>) {
  const res = await fetch(`https://slack.com/api/${method}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.SLACK_BOT_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
  return res.json() as Promise<Record<string, unknown>>
}

function copenhagenTodayStartUnix(): number {
  const now = new Date()
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Europe/Copenhagen',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).formatToParts(now)
  const get = (type: string) => Number(parts.find(p => p.type === type)!.value)
  // Compute the Copenhagen UTC offset at this moment
  const cphAsUtc = Date.UTC(get('year'), get('month') - 1, get('day'), get('hour'), get('minute'), get('second'))
  const offsetMs = cphAsUtc - now.getTime()
  // Midnight Copenhagen in UTC = UTC midnight of that date minus the offset
  const midnightUtc = Date.UTC(get('year'), get('month') - 1, get('day')) - offsetMs
  return Math.floor(midnightUtc / 1000)
}

async function getEmailCounts(): Promise<{ today: number; total: number }> {
  const resend = getResend()
  const todayStartMs = copenhagenTodayStartUnix() * 1000
  const todayEndMs = todayStartMs + 86_400_000
  let today = 0
  let total = 0
  let after: string | undefined

  while (true) {
    const res = await resend.emails.list({ limit: 100, ...(after ? { after } : {}) })
    if (res.error || !res.data) break

    const emails = res.data.data
    if (emails.length === 0) break

    for (const email of emails) {
      if (email.last_event === 'delivered' && !email.scheduled_at) {
        total++
        const t = new Date(email.created_at).getTime()
        if (t >= todayStartMs && t < todayEndMs) today++
      }
    }

    if (!res.data.has_more) break
    after = emails[emails.length - 1].id
  }

  return { today, total }
}

function buildText(today: number, total: number): string {
  const now = new Date()
  const date = new Intl.DateTimeFormat('da-DK', {
    timeZone: 'Europe/Copenhagen',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(now)
  const time = new Intl.DateTimeFormat('da-DK', {
    timeZone: 'Europe/Copenhagen',
    hour: '2-digit',
    minute: '2-digit',
  }).format(now)
  return `${MSG_PREFIX} — ${date}*\nI dag: *${today}* — I alt: *${total}* — Sidst opdateret kl. ${time}`
}

export async function GET(req: NextRequest) {
  if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const todayStart = copenhagenTodayStartUnix()

  const [{ today, total }, history] = await Promise.all([
    getEmailCounts(),
    slack('conversations.history', {
      channel: CHANNEL,
      oldest: String(todayStart),
      limit: 100,
    }),
  ])

  const messages = (history.messages ?? []) as Array<{ ts: string; text?: string }>
  const todayMsg = messages.find(m => m.text?.startsWith(MSG_PREFIX))
  const text = buildText(today, total)

  if (todayMsg) {
    await slack('chat.update', { channel: CHANNEL, ts: todayMsg.ts, text })
  } else {
    await slack('chat.postMessage', { channel: CHANNEL, text })
  }

  return NextResponse.json({ ok: true, today, total })
}
