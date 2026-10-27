import { privacyPolicy } from '@/lib/privacyPolicy'

// The Altid Hjem app shows the policy from this JSON, so the text is always
// the one on /privatlivspolitik. The shape is a contract with the app; see
// lib/privacyPolicy.ts.
export const dynamic = 'force-static'

export function GET() {
  return Response.json(privacyPolicy, { headers: { 'Content-Type': 'application/json; charset=utf-8' } })
}
