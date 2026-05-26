/**
 * Reschedules all currently-scheduled Resend emails with subject "Den er her."
 * to a new time.
 *
 * Dry-run by default. Pass --execute to actually update.
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/reschedule-release-emails.ts
 *   npx tsx --env-file=.env.local scripts/reschedule-release-emails.ts --execute
 */

const API_KEY = process.env.RESEND_API_KEY
if (!API_KEY) {
  console.error('RESEND_API_KEY is not set.')
  process.exit(1)
}

const TARGET_SUBJECT = 'Den er her.'
// 22:00 Copenhagen (CEST = UTC+2) on Wednesday 2026-05-27 = 20:00 UTC
const NEW_SCHEDULED_AT = '2026-05-27T20:00:00.000Z'

const EXECUTE = process.argv.includes('--execute')

type ResendEmail = {
  id: string
  to: string[]
  subject: string | null
  scheduled_at: string | null
  last_event: string
}

async function fetchAll(): Promise<ResendEmail[]> {
  const all: ResendEmail[] = []
  let url = 'https://api.resend.com/emails?limit=100'

  while (true) {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${API_KEY}` },
    })
    if (!res.ok) throw new Error(`List failed ${res.status}: ${await res.text()}`)
    const body = (await res.json()) as { data: ResendEmail[]; has_more?: boolean }
    all.push(...body.data)
    process.stderr.write(`  fetched ${all.length}...\n`)
    if (!body.has_more || body.data.length === 0) break
    const lastId = body.data[body.data.length - 1].id
    url = `https://api.resend.com/emails?limit=100&after=${lastId}`
  }
  return all
}

async function patchEmail(id: string): Promise<void> {
  const res = await fetch(`https://api.resend.com/emails/${id}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ scheduled_at: NEW_SCHEDULED_AT }),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`PATCH ${id} failed: ${res.status} ${text}`)
  }
}

async function main() {
  console.log(`Target subject:  "${TARGET_SUBJECT}"`)
  console.log(`New scheduled_at: ${NEW_SCHEDULED_AT}`)
  console.log(`Mode: ${EXECUTE ? '*** EXECUTE ***' : 'dry-run (pass --execute to apply)'}\n`)

  console.log('Fetching all emails...')
  const all = await fetchAll()
  console.log(`\nTotal emails: ${all.length}`)

  const targets = all.filter(
    (e) =>
      e.last_event === 'scheduled' &&
      e.scheduled_at &&
      e.subject === TARGET_SUBJECT,
  )
  console.log(`Matching (scheduled, subject "${TARGET_SUBJECT}"): ${targets.length}`)

  if (targets.length === 0) {
    console.log('Nothing to do.')
    return
  }

  // Sanity: show the existing scheduled times we're about to overwrite
  const existingTimes = new Map<string, number>()
  for (const t of targets) {
    const k = t.scheduled_at!
    existingTimes.set(k, (existingTimes.get(k) ?? 0) + 1)
  }
  console.log('\nCurrent scheduled times being overwritten:')
  for (const [time, count] of existingTimes) {
    console.log(`  ${time}  →  ${count}`)
  }

  if (!EXECUTE) {
    console.log('\nDry-run complete. Re-run with --execute to apply changes.')
    return
  }

  console.log('\nPatching...')
  let ok = 0
  const failures: { id: string; err: string }[] = []
  for (let i = 0; i < targets.length; i++) {
    const t = targets[i]
    try {
      await patchEmail(t.id)
      ok++
      if ((i + 1) % 25 === 0 || i === targets.length - 1) {
        process.stderr.write(`  ${i + 1}/${targets.length} patched\n`)
      }
    } catch (err) {
      failures.push({ id: t.id, err: err instanceof Error ? err.message : String(err) })
    }
    // gentle throttle to stay under Resend rate limits
    await new Promise((r) => setTimeout(r, 120))
  }

  console.log(`\nDone. Success: ${ok}/${targets.length}`)
  if (failures.length > 0) {
    console.log(`Failures: ${failures.length}`)
    for (const f of failures.slice(0, 10)) console.log(`  ${f.id}: ${f.err}`)
    if (failures.length > 10) console.log(`  ...and ${failures.length - 10} more`)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
