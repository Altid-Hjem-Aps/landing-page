import { NextRequest, NextResponse } from 'next/server'
import { getSignupCounts } from '@/lib/db'

const CHANNEL = process.env.SLACK_CHANNEL_ID!
const MAIN_PREFIX = '*Venteliste'
const THREAD_PREFIX = '*Tilmeldinger per dag'

// How many recent days to list in the thread breakdown (the total is all-time).
const THREAD_DAYS = 30

async function slack(method: string, params: Record<string, unknown>, useGet = false) {
  const token = process.env.SLACK_BOT_TOKEN
  if (useGet) {
    const qs = new URLSearchParams(Object.entries(params).map(([k, v]) => [k, String(v)])).toString()
    const res = await fetch(`https://slack.com/api/${method}?${qs}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return res.json() as Promise<Record<string, unknown>>
  }
  const res = await fetch(`https://slack.com/api/${method}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  })
  return res.json() as Promise<Record<string, unknown>>
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
  const sorted = Object.entries(perDay)
    .sort((a, b) => b[0].localeCompare(a[0]))
    .slice(0, THREAD_DAYS)
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

  const { today, total, perDay } = await getSignupCounts()
  const mainText = buildMainText(today, total)
  const threadText = buildThreadText(perDay)

  // Find the existing waitlist message in channel history
  const histRes = await slack('conversations.history', { channel: CHANNEL, limit: 50 }, true)
  const messages = (histRes.messages ?? []) as Array<{ ts: string; text?: string }>
  const existing = messages.find(m => m.text?.startsWith(MAIN_PREFIX))

  let mainTs: string

  if (existing) {
    mainTs = existing.ts
    await slack('chat.update', { channel: CHANNEL, ts: mainTs, text: mainText })
  } else {
    const postRes = await slack('chat.postMessage', { channel: CHANNEL, text: mainText })
    mainTs = postRes.ts as string
  }

  // Find and update (or create) the thread reply with daily breakdown
  const repliesRes = await slack('conversations.replies', { channel: CHANNEL, ts: mainTs, limit: 20 }, true)
  const replies = (repliesRes.messages ?? []) as Array<{ ts: string; text?: string }>
  const threadReply = replies.slice(1)[0]

  if (threadReply) {
    await slack('chat.update', { channel: CHANNEL, ts: threadReply.ts, text: threadText })
  } else {
    await slack('chat.postMessage', { channel: CHANNEL, thread_ts: mainTs, text: threadText })
  }

  return NextResponse.json({ ok: true, today, total })
}
