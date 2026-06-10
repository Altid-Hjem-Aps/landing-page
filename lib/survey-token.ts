import crypto from 'crypto'

// Proves the caller is the same person who completed step 1, so they can't
// overwrite someone else's survey by guessing a public_id (which is also the
// public referral code, so it is NOT secret). Stateless HMAC — no DB, no extra
// env: signed with the server-only service-role key.
function secret(): string {
  const key = process.env.SURVEY_TOKEN_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY
  // Fail loudly: signing with an empty key would make tokens forgeable by
  // anyone who reads the source.
  if (!key) throw new Error('survey-token: SURVEY_TOKEN_SECRET or SUPABASE_SERVICE_ROLE_KEY must be set')
  return key
}

// Lets callers fail fast BEFORE irreversible side effects (e.g. registering a
// user upstream) instead of throwing from signSurveyToken afterwards.
export function assertSurveyTokenConfigured(): void {
  secret()
}

export function signSurveyToken(id: string): string {
  return crypto.createHmac('sha256', secret()).update(String(id)).digest('base64url')
}

export function verifySurveyToken(id: string, token: string): boolean {
  if (!id || !token) return false
  const expected = Buffer.from(signSurveyToken(id))
  const given = Buffer.from(String(token))
  return expected.length === given.length && crypto.timingSafeEqual(expected, given)
}
