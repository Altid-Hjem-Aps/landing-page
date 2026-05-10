import { NextRequest, NextResponse } from 'next/server'
import { getResend } from '@/lib/resend'

const CHANNEL = process.env.SLACK_CHANNEL_ID!
const MAIN_PREFIX = '*Venteliste'
const THREAD_PREFIX = '*Tilmeldinger per dag'

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

function copenhagenDateKey(date: Date): string {
  return new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Europe/Copenhagen',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
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
  const cphAsUtc = Date.UTC(get('year'), get('month') - 1, get('day'), get('hour'), get('minute'), get('second'))
  const offsetMs = cphAsUtc - now.getTime()
  const midnightUtc = Date.UTC(get('year'), get('month') - 1, get('day')) - offsetMs
  return Math.floor(midnightUtc / 1000)
}

async function getEmailCounts(): Promise<{ today: number; total: number; perDay: Record<string, number> }> {
  const resend = getResend()
  const todayStartMs = copenhagenTodayStartUnix() * 1000
  const todayEndMs = todayStartMs + 86_400_000
  let today = 0
  let total = 0
  const perDay: Record<string, number> = {}
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
        const key = copenhagenDateKey(new Date(email.created_at))
        perDay[key] = (perDay[key] ?? 0) + 1
      }
    }

    if (!res.data.has_more) break
    after = emails[emails.length - 1].id
  }

  return { today, total, perDay }
}

function buildMainText(today: number, total: number): string {
  const now = new Date()
  const time = new Intl.DateTimeFormat('da-DK', {
    timeZone: 'Europe/Copenhagen',
    hour: '2-digit',
    minute: '2-digit',
  }).format(now)
  return `${MAIN_PREFIX} — Altid Hjem*\nI dag: *${today}* — I alt: *${total}* — Sidst opdateret kl. ${time}`
}

function buildThreadText(perDay: Record<string, number>): string {
  const sorted = Object.entries(perDay).sort((a, b) => b[0].localeCompare(a[0]))
  const lines = sorted.map(([key, count]) => {
    const date = new Date(key + 'T12:00:00Z')
    const formatted = new Intl.DateTimeFormat('da-DK', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date)
    return `${formatted}: *${count}*`
  })
  return `${THREAD_PREFIX}*\n${lines.join('\n')}`
}

export async function GET(req: NextRequest) {
  if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { today, total, perDay } = await getEmailCounts()
  const mainText = buildMainText(today, total)
  const threadText = buildThreadText(perDay)

  // Find the persistent pinned message
  const pinsRes = await slack('pins.list', { channel: CHANNEL })
  const pins = (pinsRes.items ?? []) as Array<{ message?: { ts: string; text?: string } }>
  const pinned = pins.find(p => p.message?.text?.startsWith(MAIN_PREFIX))

  let mainTs: string

  if (pinned?.message) {
    mainTs = pinned.message.ts
    await slack('chat.update', { channel: CHANNEL, ts: mainTs, text: mainText })
  } else {
    const postRes = await slack('chat.postMessage', { channel: CHANNEL, text: mainText })
    mainTs = postRes.ts as string
    await slack('pins.add', { channel: CHANNEL, timestamp: mainTs })
  }

  // Find and update (or create) the thread reply with daily breakdown
  const repliesRes = await slack('conversations.replies', { channel: CHANNEL, ts: mainTs, limit: 20 })
  const replies = (repliesRes.messages ?? []) as Array<{ ts: string; text?: string }>
  const threadReply = replies.slice(1).find(m => m.text?.startsWith(THREAD_PREFIX))

  if (threadReply) {
    await slack('chat.update', { channel: CHANNEL, ts: threadReply.ts, text: threadText })
  } else {
    await slack('chat.postMessage', { channel: CHANNEL, thread_ts: mainTs, text: threadText })
  }

  return NextResponse.json({ ok: true, today, total })
}
