const API_KEY = process.env.RESEND_API_KEY!
const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

async function main() {
  const all: { last_event: string; subject: string; to: string[] }[] = []
  let url = 'https://api.resend.com/emails?limit=100'
  while (true) {
    const r = await fetch(url, { headers: { Authorization: `Bearer ${API_KEY}` } })
    if (r.status === 429) {
      await sleep(2000)
      continue
    }
    const b = (await r.json()) as {
      data: typeof all
      has_more?: boolean
    }
    all.push(...b.data)
    if (!b.has_more) break
    const last = b.data[b.data.length - 1] as unknown as { id: string }
    url = `https://api.resend.com/emails?limit=100&after=${last.id}`
    await sleep(250)
  }

  const scheduled = all.filter(
    (e) =>
      e.last_event === 'scheduled' &&
      e.subject === 'En lille opdatering om Altid Hjem',
  )
  const recipients = scheduled.map((e) => e.to[0])
  const counts = new Map<string, number>()
  for (const r of recipients) counts.set(r, (counts.get(r) ?? 0) + 1)
  const dupes = [...counts.entries()].filter(([, c]) => c > 1)

  console.log(`Scheduled batch-rollout emails: ${scheduled.length}`)
  console.log(`Unique recipients:              ${counts.size}`)
  console.log(`Duplicates:                     ${recipients.length - counts.size}`)
  if (dupes.length) {
    console.log('\nRecipients with multiple scheduled emails:')
    for (const [e, c] of dupes) console.log(`  ${e}  (${c}x)`)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
