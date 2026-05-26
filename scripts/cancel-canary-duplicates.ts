/**
 * Cancels the 10:00 batch-rollout sends for recipients who are also in
 * the 09:00 canary, so they don't get the email twice.
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/cancel-canary-duplicates.ts
 */
const API_KEY = process.env.RESEND_API_KEY!
const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

const TEN_AM_UTC = '2026-05-27 08:00:00+00'

const TARGETS = new Set([
  'mik.voergaard@gmail.com',
  'simon-vp@hotmail.com',
])

async function rfetch(url: string, init?: RequestInit): Promise<Response> {
  for (let i = 0; i < 5; i++) {
    const res = await fetch(url, init)
    if (res.status !== 429) return res
    await sleep(2000 * (i + 1))
  }
  throw new Error(`Rate-limited: ${url}`)
}

async function main() {
  const all: { id: string; to: string[]; subject: string | null; scheduled_at: string | null; last_event: string }[] = []
  let url = 'https://api.resend.com/emails?limit=100'
  while (true) {
    const res = await rfetch(url, { headers: { Authorization: `Bearer ${API_KEY}` } })
    const body = await res.json() as { data: typeof all; has_more?: boolean }
    all.push(...body.data)
    if (!body.has_more || body.data.length === 0) break
    url = `https://api.resend.com/emails?limit=100&after=${body.data[body.data.length - 1].id}`
    await sleep(250)
  }

  const toCancel = all.filter(
    (e) =>
      e.last_event === 'scheduled' &&
      e.scheduled_at === TEN_AM_UTC &&
      e.subject === 'En lille opdatering om Altid Hjem' &&
      TARGETS.has(e.to[0]?.toLowerCase().trim()),
  )

  console.log(`Found ${toCancel.length} 10:00 sends to cancel:`)
  for (const e of toCancel) console.log(`  ${e.to[0]} → ${e.id}`)

  for (const e of toCancel) {
    const res = await rfetch(`https://api.resend.com/emails/${e.id}/cancel`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${API_KEY}` },
    })
    console.log(`  cancel ${e.to[0]}: ${res.status}`)
    await sleep(250)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
