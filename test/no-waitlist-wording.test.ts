import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

// ALT-894: no waitlist form or wording on the site. Scans the source of what can
// render, so a new page or a pasted-in sentence fails here instead of going live.
// The rendered-HTML grep in the PR proves the state once; this keeps it there.

const WORDING = /venteliste|ventelist|waitlist|skriv dig op|skriv dig på|skrevet op|snart|når vi åbner|åbner dørene/i

// Each entry: why it may keep the words.
const ALLOWED = new Set([
  // Legal text about the people still on the list, Alex's to change.
  'lib/privacyPolicy.ts',
  // The endpoint and the crons stay; nothing here renders.
  'app/api/waitlist/route.ts',
  'app/api/cron/slack-waitlist/route.ts',
  'app/api/test/sms/route.ts',
  // Server-side senders and adapters for mail already out, in comments and ids.
  'lib/send-email.ts',
  'lib/send-sms.ts',
  'lib/resend.ts',
  'lib/db.ts',
  'lib/mail-links.ts',
  'lib/signup-source.ts',
  // A sales deck for a partner, a number about history.
  'app/norlys/deck.html',
  // "snart" here is about deleting an account in the app, not about launch.
  'app/slet-konto/page.tsx',
])

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) return sourceFiles(path)
    return /\.(tsx?|html)$/.test(name) ? [path] : []
  })
}

describe('waitlist wording guard', () => {
  it('no source file outside the allowlist has the words', () => {
    const hits = ['app', 'components', 'lib']
      .flatMap(sourceFiles)
      .filter((path) => !ALLOWED.has(path))
      // The newsletter form posts to this URL. The address is not wording.
      .filter((path) => WORDING.test(readFileSync(path, 'utf8').replaceAll('/api/waitlist', '')))
    expect(hits).toEqual([])
  })

  it('every allowlist entry still earns its place', () => {
    const stale = [...ALLOWED].filter((path) => !WORDING.test(readFileSync(path, 'utf8')))
    expect(stale).toEqual([])
  })
})
