/**
 * Schedules the 09:00 Copenhagen canary batch for 2026-05-27.
 * 09:00 CEST = 07:00 UTC.
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/schedule-canary.ts
 */
const API_KEY = process.env.RESEND_API_KEY!
const SCHEDULED_AT = '2026-05-27T07:00:00.000Z'
const FROM = 'Altid Hjem <hej@altidhjem.dk>'
const TEMPLATE = 'waitlist-batch-rollout'

const RECIPIENTS: { email: string; firstName: string }[] = [
  { email: 'alexanderthorup@hotmail.com', firstName: 'Alexander' },
  { email: 'alexander@thorup.life',       firstName: 'Alexander' },
  { email: 'mik.voergaard@gmail.com',     firstName: 'Mik' },
  { email: 'simon-vp@hotmail.com',        firstName: 'Simon' },
  { email: 'w@madhousehq.com',            firstName: 'Werner' },
]

async function main() {
  console.log(`Scheduling ${RECIPIENTS.length} canary sends for ${SCHEDULED_AT} (09:00 Copenhagen)\n`)
  for (const r of RECIPIENTS) {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM,
        to: r.email,
        scheduled_at: SCHEDULED_AT,
        template: { id: TEMPLATE, variables: { first_name: r.firstName } },
      }),
    })
    const body = await res.json() as { id?: string }
    console.log(`  ${res.status}  ${r.email}  (${r.firstName})  →  ${body.id ?? 'ERROR'}`)
    await new Promise((r) => setTimeout(r, 250))
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
