/**
 * Backfill signup.phone in Supabase from the upstream MySQL waitlist.
 *
 * WHY THIS EXISTS
 * The mobile number was never mirrored into Supabase — mirrorSignup only ever
 * wrote email/first_name/created_at/source/consent, and the number went upstream
 * to api.altidhjem.dk's MySQL and nowhere else. The preference centre reads
 * Supabase, so without this backfill everyone who signed up before
 * 20260716_pref_centre_sms_phone.sql sees an empty phone field and has to retype
 * a number we already hold.
 *
 * NOT RUN AS PART OF THIS PR. MySQL is office-IP whitelisted, so this must be run
 * by hand from the office. The code does not depend on it: the column is nullable,
 * an empty phone renders as an empty field, and the preference centre is correct
 * either way. This only saves people from retyping.
 *
 * WHAT IT DOES NOT DO
 * It does not grant anyone SMS consent, and it must never be extended to. Nobody
 * has SMS consent — every string we have ever shown says "e-mails", and the
 * mobile field said only "Mobil". Having someone's number is not permission to
 * text them. Every *_sms flag stays false; a person turns SMS on themselves, in
 * the preference centre, or it does not happen.
 *
 * USAGE (from the office):
 *   npx tsx scripts/backfill-phone-from-mysql.ts --dry-run    # always do this first
 *   npx tsx scripts/backfill-phone-from-mysql.ts --apply
 *
 * ENV:
 *   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY   (service role: bypasses RLS)
 *   MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE
 *   or a ~/.my.cnf the mysql client can read.
 */

import { createClient } from '@supabase/supabase-js'
import { PHONE_RE, SENTINEL_PHONE as SENTINEL } from '../lib/phone'

type UpstreamRow = { public_id: string; mobile: string | null }

function requireEnv(name: string): string {
  const v = process.env[name]
  if (!v) throw new Error(`${name} is not set`)
  return v
}

/**
 * Rows from upstream MySQL, keyed by the public_id Supabase also uses.
 *
 * Left unimplemented on purpose: this needs the office network, and writing a
 * connection against a database nobody can reach from here would be guessing at
 * its schema. Fill in the query when running it, having checked the real column
 * names — do not assume them.
 */
async function readUpstream(): Promise<UpstreamRow[]> {
  throw new Error(
    'readUpstream() is unimplemented: run from the office, confirm the real ' +
      'table/column names on api.altidhjem.dk, then implement the SELECT here. ' +
      'Do not guess the schema.',
  )
}

function usable(mobile: string | null): string | null {
  const clean = String(mobile ?? '').replace(/\s/g, '')
  // The sentinel means "no number given" — it is not a real MSISDN and can never
  // receive an SMS. It must never land in Supabase; a check constraint would
  // reject it anyway, but failing here is clearer than failing at the database.
  if (!clean || clean === SENTINEL) return null
  if (!PHONE_RE.test(clean)) return null
  return clean
}

async function main() {
  const apply = process.argv.includes('--apply')
  const dryRun = !apply

  const supabase = createClient(requireEnv('SUPABASE_URL'), requireEnv('SUPABASE_SERVICE_ROLE_KEY'), {
    auth: { persistSession: false },
  })

  const rows = await readUpstream()

  let skippedSentinel = 0
  let skippedMalformed = 0
  const updates: { public_id: string; phone: string }[] = []

  for (const r of rows) {
    const clean = String(r.mobile ?? '').replace(/\s/g, '')
    if (clean === SENTINEL) {
      skippedSentinel++
      continue
    }
    const phone = usable(r.mobile)
    if (!phone) {
      if (clean) skippedMalformed++
      continue
    }
    updates.push({ public_id: r.public_id, phone })
  }

  console.log(`upstream rows      : ${rows.length}`)
  console.log(`sentinel (skipped) : ${skippedSentinel}`)
  console.log(`malformed (skipped): ${skippedMalformed}`)
  console.log(`to write           : ${updates.length}`)

  if (dryRun) {
    console.log('\nDRY RUN — nothing written. Re-run with --apply.')
    return
  }

  let ok = 0
  let noMatch = 0
  for (const u of updates) {
    // Update, never upsert: this only fills a column on rows that already exist.
    // An upsert could conjure a signup row from an upstream record that was never
    // mirrored, inventing a person Supabase has no consent record for.
    //
    // FILL-EMPTY ONLY (review 31/7): .is('phone', null) means this can never
    // overwrite a number someone has since corrected in the preference centre,
    // and never re-insert one they deliberately removed — that removal is a
    // documented withdrawal in consent_event, and stale upstream data must not
    // reverse it. Unsubscribed rows are skipped for the same reason: they asked
    // to be left alone, not to have data restored onto their row.
    const { data, error } = await supabase
      .from('signup')
      .update({ phone: u.phone })
      .eq('public_id', u.public_id)
      .is('phone', null)
      .not('unsubscribed', 'is', true)
      .select('public_id')
    if (error) {
      console.error(`FAILED ${u.public_id}: ${error.message}`)
      continue
    }
    // .select() returns the rows actually touched — count a zero-match honestly
    // instead of reporting a write that never happened (no Supabase row, phone
    // already set, or unsubscribed).
    if ((data ?? []).length === 0) {
      noMatch++
      continue
    }
    ok++
  }
  console.log(`\nwritten            : ${ok}/${updates.length}`)
  console.log(`no-op (no row, phone already set, or unsubscribed): ${noMatch}`)
  console.log('SMS consent unchanged — every *_sms flag is still false, as it must be.')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
