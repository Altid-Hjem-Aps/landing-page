/**
 * Finds waitlist signups that got a confirmation email but no batch-rollout
 * scheduled, and schedules the batch-rollout email for them.
 *
 * Detection:
 *   "Got a confirmation" = delivered email with subject "Du er på Altid Hjem-ventelisten"
 *   "Got a batch-rollout" = scheduled email with subject "En lille opdatering om Altid Hjem"
 *   Missing = recipients in the first set but not the second.
 *
 * Dry-run by default. Pass --execute to actually schedule.
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/schedule-missing-batch-rollout.ts
 *   npx tsx --env-file=.env.local scripts/schedule-missing-batch-rollout.ts --execute
 */

const API_KEY = process.env.RESEND_API_KEY
if (!API_KEY) {
  console.error('RESEND_API_KEY is not set.')
  process.exit(1)
}

const CONFIRMATION_SUBJECT = 'Du er på Altid Hjem-ventelisten'
const BATCH_SUBJECT = 'En lille opdatering om Altid Hjem'
const NEW_TEMPLATE_ALIAS = 'waitlist-batch-rollout'
const NEW_SCHEDULED_AT = '2026-05-27T08:00:00.000Z'
const FROM = 'Altid Hjem <hej@altidhjem.dk>'

const EXECUTE = process.argv.includes('--execute')
const THROTTLE_MS = 250

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

async function rfetch(url: string, init?: RequestInit): Promise<Response> {
  for (let attempt = 0; attempt < 5; attempt++) {
    const res = await fetch(url, init)
    if (res.status !== 429) return res
    const backoff = 2000 * (attempt + 1)
    process.stderr.write(`  429 — backing off ${backoff}ms\n`)
    await sleep(backoff)
  }
  throw new Error(`Rate-limited after 5 retries: ${url}`)
}

type ListEmail = {
  id: string
  to: string[]
  subject: string | null
  scheduled_at: string | null
  last_event: string
  created_at: string
}

async function fetchAll(): Promise<ListEmail[]> {
  const all: ListEmail[] = []
  let url = 'https://api.resend.com/emails?limit=100'
  while (true) {
    const res = await rfetch(url, { headers: { Authorization: `Bearer ${API_KEY}` } })
    if (!res.ok) throw new Error(`List ${res.status}: ${await res.text()}`)
    const body = (await res.json()) as { data: ListEmail[]; has_more?: boolean }
    all.push(...body.data)
    process.stderr.write(`  fetched ${all.length}...\n`)
    if (!body.has_more || body.data.length === 0) break
    url = `https://api.resend.com/emails?limit=100&after=${body.data[body.data.length - 1].id}`
    await sleep(THROTTLE_MS)
  }
  return all
}

async function getEmailBody(id: string): Promise<{ text: string; html: string }> {
  const res = await rfetch(`https://api.resend.com/emails/${id}`, {
    headers: { Authorization: `Bearer ${API_KEY}` },
  })
  if (!res.ok) throw new Error(`GET ${id}: ${res.status} ${await res.text()}`)
  const body = (await res.json()) as { text?: string; html?: string }
  return { text: body.text ?? '', html: body.html ?? '' }
}

function extractFirstName(body: { text: string; html: string }): string {
  // Try plaintext first
  const t = body.text.match(/Hej\s+([^,\n]+?),/)
  if (t && t[1].trim()) return t[1].trim()

  // Fall back to HTML — strip comments and tags around "Hej "
  const i = body.html.indexOf('Hej')
  if (i < 0) return ''
  const slice = body.html.slice(i, i + 300)
  const cleaned = slice
    .replace(/<!--[^>]*-->/g, '')
    .replace(/<[^>]+>/g, '')
  const m = cleaned.match(/Hej\s+([^,\n]+?),/)
  return m ? m[1].trim() : ''
}

async function scheduleNew(to: string, firstName: string): Promise<{ id: string }> {
  const res = await rfetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: FROM,
      to,
      scheduled_at: NEW_SCHEDULED_AT,
      template: {
        id: NEW_TEMPLATE_ALIAS,
        variables: { first_name: firstName },
      },
    }),
  })
  if (!res.ok) throw new Error(`POST ${to}: ${res.status} ${await res.text()}`)
  return (await res.json()) as { id: string }
}

async function main() {
  console.log(`Confirmation subject: "${CONFIRMATION_SUBJECT}"`)
  console.log(`Batch-rollout subject: "${BATCH_SUBJECT}"`)
  console.log(`New scheduled_at (UTC): ${NEW_SCHEDULED_AT}`)
  console.log(`Mode: ${EXECUTE ? '*** EXECUTE ***' : 'dry-run (pass --execute to apply)'}\n`)

  console.log('Fetching all emails...')
  const all = await fetchAll()
  console.log(`\nTotal returned: ${all.length}\n`)

  // For each unique recipient, pick the latest confirmation email id
  // (we'll use it as the source for first_name extraction).
  const confirmedRecipients = new Map<string, { id: string; createdAt: string }>()
  for (const e of all) {
    if (
      e.last_event === 'delivered' &&
      !e.scheduled_at &&
      e.subject === CONFIRMATION_SUBJECT
    ) {
      const to = e.to[0]?.toLowerCase().trim()
      if (!to) continue
      const existing = confirmedRecipients.get(to)
      if (!existing || e.created_at > existing.createdAt) {
        confirmedRecipients.set(to, { id: e.id, createdAt: e.created_at })
      }
    }
  }

  const scheduledRecipients = new Set<string>()
  for (const e of all) {
    if (
      e.last_event === 'scheduled' &&
      e.scheduled_at &&
      e.subject === BATCH_SUBJECT
    ) {
      const to = e.to[0]?.toLowerCase().trim()
      if (to) scheduledRecipients.add(to)
    }
  }

  const missing = [...confirmedRecipients.entries()].filter(
    ([email]) => !scheduledRecipients.has(email),
  )

  console.log(`Confirmation delivered to:    ${confirmedRecipients.size} unique recipients`)
  console.log(`Batch-rollout scheduled to:   ${scheduledRecipients.size} unique recipients`)
  console.log(`Missing batch-rollout:        ${missing.length}\n`)

  if (missing.length === 0) {
    console.log('Nothing to do — everyone is covered.')
    return
  }

  console.log('Missing recipients (with name extraction):')
  const planned: { email: string; firstName: string; confirmationId: string }[] = []
  for (let i = 0; i < missing.length; i++) {
    const [email, info] = missing[i]
    const body = await getEmailBody(info.id)
    const firstName = extractFirstName(body)
    planned.push({ email, firstName, confirmationId: info.id })
    console.log(`  ${i + 1}. ${email}  →  first_name="${firstName}"`)
    await sleep(THROTTLE_MS)
  }

  if (!EXECUTE) {
    console.log('\nDry-run complete. Re-run with --execute to schedule batch-rollout for these recipients.')
    return
  }

  console.log('\nScheduling batch-rollout emails...\n')
  const failures: { email: string; err: string }[] = []
  let ok = 0
  for (let i = 0; i < planned.length; i++) {
    const p = planned[i]
    try {
      await scheduleNew(p.email, p.firstName)
      ok++
      process.stderr.write(`  ${i + 1}/${planned.length} scheduled (${p.email})\n`)
    } catch (err) {
      failures.push({
        email: p.email,
        err: err instanceof Error ? err.message : String(err),
      })
    }
    await sleep(THROTTLE_MS)
  }

  console.log(`\nDone. Scheduled: ${ok}/${planned.length}`)
  if (failures.length) {
    console.log(`Failures: ${failures.length}`)
    for (const f of failures) console.log(`  ${f.email}: ${f.err}`)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
