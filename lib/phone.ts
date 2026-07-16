/**
 * The ONE definition of a storable Danish mobile number.
 *
 * Review 31/7 found this rule hand-copied in five places (waitlist route,
 * unsubscribe route, db.ts, the backfill script, and a string-embedded copy in
 * the preference page's inline script). Consent-critical guards must not depend
 * on a regex being retyped identically everywhere, so they all import from here
 * and the inline script interpolates PHONE_RE.source.
 */

// Exactly 8 digits, no country code — the same rule the signup form enforces.
export const PHONE_RE = /^\d{8}$/

// The upstream waitlist API marks Mobile as [Required], so the waitlist route
// sends this sentinel UPSTREAM when no number was given. It is not a real MSISDN
// and can never receive an SMS; it must never be stored in Supabase or shown to
// a person as if it were their number. A DB check constraint backs this up.
export const SENTINEL_PHONE = '00000000'

/**
 * Normalise input to a storable number, or null.
 * Strips whitespace; rejects anything that is not exactly 8 digits, and rejects
 * the sentinel. null means "no usable number given" on every call site.
 */
export function cleanPhone(v: unknown): string | null {
  const c = String(v ?? '').replace(/\s/g, '')
  return PHONE_RE.test(c) && c !== SENTINEL_PHONE ? c : null
}
