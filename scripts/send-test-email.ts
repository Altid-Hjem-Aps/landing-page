/**
 * Sends an immediate test of the batch-rollout email.
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/send-test-email.ts <email> [first_name]
 */
const API_KEY = process.env.RESEND_API_KEY!
const to = process.argv[2]
const firstName = process.argv[3] ?? 'Alexander'

if (!to) {
  console.error('Usage: send-test-email.ts <email> [first_name]')
  process.exit(1)
}

async function main() {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Altid Hjem <hej@altidhjem.dk>',
      to,
      template: {
        id: 'waitlist-batch-rollout',
        variables: { first_name: firstName },
      },
    }),
  })
  const body = await res.text()
  console.log(`Status: ${res.status}`)
  console.log(body)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
