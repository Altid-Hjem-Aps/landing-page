/**
 * Lists scheduled emails in Resend.
 *
 * Usage:
 *   pnpm tsx --env-file=.env.local scripts/list-scheduled-emails.ts
 */

const API_KEY = process.env.RESEND_API_KEY
if (!API_KEY) {
  console.error('RESEND_API_KEY is not set. Add it to .env.local.')
  process.exit(1)
}

type ResendEmail = {
  id: string
  to: string[]
  from: string
  subject: string | null
  created_at: string
  scheduled_at: string | null
  last_event: string
}

async function fetchEmails(): Promise<ResendEmail[]> {
  const all: ResendEmail[] = []
  let url = 'https://api.resend.com/emails?limit=100'

  while (true) {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${API_KEY}` },
    })
    if (!res.ok) {
      const text = await res.text()
      throw new Error(`Resend API error ${res.status}: ${text}`)
    }
    const body = (await res.json()) as {
      data: ResendEmail[]
      has_more?: boolean
    }
    all.push(...body.data)
    process.stderr.write(`  fetched ${all.length} so far...\n`)
    if (!body.has_more || body.data.length === 0) break
    const lastId = body.data[body.data.length - 1].id
    url = `https://api.resend.com/emails?limit=100&after=${lastId}`
  }

  return all
}

function fmt(iso: string): string {
  const d = new Date(iso)
  const utc = d.toISOString().replace('T', ' ').slice(0, 16) + ' UTC'
  const cest = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Copenhagen',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
  return `${utc}  (${cest} CET/CEST)`
}

async function main() {
  const emails = await fetchEmails()
  const scheduled = emails.filter(
    (e) => e.last_event === 'scheduled' && e.scheduled_at,
  )

  console.log(`Total emails returned: ${emails.length}`)
  console.log(`Scheduled (not yet sent): ${scheduled.length}\n`)

  if (scheduled.length === 0) {
    console.log('No scheduled emails found.')
    console.log(
      '\nNote: Resend may only return the most recent N emails. If you expect more, check the dashboard.',
    )
    return
  }

  scheduled.sort(
    (a, b) =>
      new Date(a.scheduled_at!).getTime() -
      new Date(b.scheduled_at!).getTime(),
  )

  // Group by scheduled_at
  const byTime = new Map<string, ResendEmail[]>()
  for (const e of scheduled) {
    const key = e.scheduled_at!
    if (!byTime.has(key)) byTime.set(key, [])
    byTime.get(key)!.push(e)
  }

  console.log('Grouped by scheduled time:\n')
  for (const [time, group] of byTime) {
    console.log(`  ${fmt(time)}  →  ${group.length} email${group.length === 1 ? '' : 's'}`)
    console.log(`    Subject sample: ${group[0].subject ?? '(no subject)'}`)
    console.log(`    Recipients (first 3): ${group.slice(0, 3).map((e) => e.to.join(', ')).join(' | ')}`)
    console.log()
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
