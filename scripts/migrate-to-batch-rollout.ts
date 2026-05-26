/**
 * Migrates all currently-scheduled "Den er her." (waitlist-release) emails
 * to use the new `waitlist-batch-rollout` template, with a new scheduled_at.
 *
 * Strategy (safety-first):
 *   1. List all scheduled emails matching subject "Den er her."
 *   2. For each: GET full email → extract first_name from rendered text
 *   3. Schedule NEW email via Resend with the batch template + new time
 *   4. Only after the new one is successfully scheduled, cancel the old one
 *   This guarantees we never end up with fewer scheduled emails than we started,
 *   even if the script crashes mid-way (worst case: duplicates).
 *
 * Dry-run by default. Pass --execute to actually apply.
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/migrate-to-batch-rollout.ts
 *   npx tsx --env-file=.env.local scripts/migrate-to-batch-rollout.ts --execute
 */

const API_KEY = process.env.RESEND_API_KEY
if (!API_KEY) {
  console.error('RESEND_API_KEY is not set.')
  process.exit(1)
}

const OLD_SUBJECT = 'Den er her.'
const NEW_TEMPLATE_ALIAS = 'waitlist-batch-rollout'
// 2026-05-27 at 10:00 Copenhagen (CEST = UTC+2) = 08:00 UTC
const NEW_SCHEDULED_AT = '2026-05-27T08:00:00.000Z'
const FROM = 'Altid Hjem <hej@altidhjem.dk>'

const EXECUTE = process.argv.includes('--execute')
// Resend rate limit is 5 req/sec. 250ms = 4 req/sec, comfortably under.
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
}

type FullEmail = ListEmail & {
  text?: string
  html?: string
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

async function getEmail(id: string): Promise<FullEmail> {
  const res = await rfetch(`https://api.resend.com/emails/${id}`, {
    headers: { Authorization: `Bearer ${API_KEY}` },
  })
  if (!res.ok) throw new Error(`GET ${id}: ${res.status} ${await res.text()}`)
  return (await res.json()) as FullEmail
}

function extractFirstName(text: string | undefined): string {
  if (!text) return ''
  // "Hej Nikolai,"  →  "Nikolai"
  const m = text.match(/Hej\s+([^,\n]+?),/)
  if (!m) return ''
  return m[1].trim()
}

async function scheduleNew(
  to: string,
  firstName: string,
): Promise<{ id: string }> {
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

async function cancelEmail(id: string): Promise<void> {
  const res = await rfetch(`https://api.resend.com/emails/${id}/cancel`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${API_KEY}` },
  })
  if (!res.ok) throw new Error(`CANCEL ${id}: ${res.status} ${await res.text()}`)
}

async function main() {
  console.log(`Old template subject:    "${OLD_SUBJECT}"`)
  console.log(`New template alias:      ${NEW_TEMPLATE_ALIAS}`)
  console.log(`New scheduled_at (UTC):  ${NEW_SCHEDULED_AT}`)
  console.log(`Mode: ${EXECUTE ? '*** EXECUTE ***' : 'dry-run (pass --execute to apply)'}\n`)

  console.log('Fetching all emails...')
  const all = await fetchAll()
  const targets = all.filter(
    (e) =>
      e.last_event === 'scheduled' &&
      e.scheduled_at &&
      e.subject === OLD_SUBJECT,
  )
  console.log(`\nTotal returned: ${all.length}`)
  console.log(`Targets (scheduled, subject "${OLD_SUBJECT}"): ${targets.length}\n`)

  if (targets.length === 0) {
    console.log('Nothing to do.')
    return
  }

  if (!EXECUTE) {
    console.log('Sampling 3 targets to verify first_name extraction:')
    for (const t of targets.slice(0, 3)) {
      const full = await getEmail(t.id)
      const first = extractFirstName(full.text)
      console.log(`  ${t.to[0]} → first_name="${first}"`)
      await new Promise((r) => setTimeout(r, THROTTLE_MS))
    }
    console.log('\nDry-run complete. Re-run with --execute to apply.')
    return
  }

  console.log('Migrating...\n')
  const successes: { oldId: string; newId: string; to: string }[] = []
  const failures: { id: string; to: string; phase: string; err: string }[] = []

  for (let i = 0; i < targets.length; i++) {
    const t = targets[i]
    const recipient = t.to[0] ?? '<unknown>'

    let firstName = ''
    try {
      const full = await getEmail(t.id)
      firstName = extractFirstName(full.text)
    } catch (err) {
      failures.push({
        id: t.id,
        to: recipient,
        phase: 'GET',
        err: err instanceof Error ? err.message : String(err),
      })
      await new Promise((r) => setTimeout(r, THROTTLE_MS))
      continue
    }

    await new Promise((r) => setTimeout(r, THROTTLE_MS))

    let newId: string
    try {
      const created = await scheduleNew(recipient, firstName)
      newId = created.id
    } catch (err) {
      failures.push({
        id: t.id,
        to: recipient,
        phase: 'POST',
        err: err instanceof Error ? err.message : String(err),
      })
      await new Promise((r) => setTimeout(r, THROTTLE_MS))
      continue
    }

    successes.push({ oldId: t.id, newId, to: recipient })

    if ((i + 1) % 25 === 0 || i === targets.length - 1) {
      process.stderr.write(`  ${i + 1}/${targets.length} new emails scheduled\n`)
    }
    await new Promise((r) => setTimeout(r, THROTTLE_MS))
  }

  console.log(`\nScheduled new: ${successes.length}/${targets.length}`)
  if (failures.length) {
    console.log(`Failures so far: ${failures.length}`)
    for (const f of failures.slice(0, 10))
      console.log(`  [${f.phase}] ${f.to}: ${f.err}`)
  }

  console.log('\nCancelling old scheduled emails (only those with confirmed replacements)...\n')
  let cancelled = 0
  for (let i = 0; i < successes.length; i++) {
    const s = successes[i]
    try {
      await cancelEmail(s.oldId)
      cancelled++
    } catch (err) {
      failures.push({
        id: s.oldId,
        to: s.to,
        phase: 'CANCEL',
        err: err instanceof Error ? err.message : String(err),
      })
    }
    if ((i + 1) % 25 === 0 || i === successes.length - 1) {
      process.stderr.write(`  ${i + 1}/${successes.length} cancelled\n`)
    }
    await new Promise((r) => setTimeout(r, THROTTLE_MS))
  }

  console.log(`\nDone. New scheduled: ${successes.length}, old cancelled: ${cancelled}`)
  if (failures.length) {
    console.log(`\nTotal failures: ${failures.length}`)
    for (const f of failures.slice(0, 20))
      console.log(`  [${f.phase}] ${f.to} (${f.id}): ${f.err}`)
    if (failures.length > 20) console.log(`  ...and ${failures.length - 20} more`)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
