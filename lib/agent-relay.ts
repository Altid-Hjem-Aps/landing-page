import { createHmac, timingSafeEqual } from 'node:crypto'

// Relay from Linear webhooks to the app repo's agent pipeline:
// a qualifying Issue event fires repository_dispatch on the app repo,
// where .github/workflows/claude-agent.yml re-validates the issue after
// a 2-minute grace before the agent starts (see ALT-131 / app PR #259).
export const DISPATCH_REPO = 'Altid-Hjem-Aps/altid-hjem-app'
export const DISPATCH_EVENT = 'linear-agent-issue'

// Linear signs the raw request body with HMAC-SHA256 of the webhook secret,
// hex-encoded in the `linear-signature` header.
export function verifyLinearSignature(rawBody: string, signature: string | null, secret: string): boolean {
  if (!signature) return false
  const expected = createHmac('sha256', secret).update(rawBody).digest('hex')
  const a = Buffer.from(signature)
  const b = Buffer.from(expected)
  return a.length === b.length && timingSafeEqual(a, b)
}

// Replay protection: reject deliveries whose payload timestamp (ms epoch)
// is more than a minute from now, per Linear's webhook guidance.
export function isFreshDelivery(webhookTimestamp: unknown, nowMs: number): boolean {
  return typeof webhookTimestamp === 'number' && Math.abs(nowMs - webhookTimestamp) <= 60_000
}

interface LinearIssueEvent {
  type?: string
  action?: string
  updatedFrom?: Record<string, unknown>
  data?: {
    number?: number
    identifier?: string
    team?: { key?: string }
    state?: { name?: string }
    labels?: Array<{ name?: string }>
  }
}

const ISSUE_ID_RE = /^ALT-\d+$/

// Decide whether an incoming event should trigger the agent, and for which
// issue. Returns the issue identifier (e.g. "ALT-132") or null.
//
// Intentionally strict about *when* to fire (created, or state/labels
// changed) so description edits on delegated issues don't re-dispatch, and
// permissive about everything else: the workflow re-checks the issue against
// Linear before acting, so a stale or duplicate dispatch is harmless (the
// app repo also has a per-issue concurrency group).
export function issueToDispatch(event: LinearIssueEvent): string | null {
  if (event.type !== 'Issue') return null

  const relevantChange =
    event.action === 'create' ||
    (event.action === 'update' &&
      (event.updatedFrom?.stateId !== undefined || event.updatedFrom?.labelIds !== undefined))
  if (!relevantChange) return null

  const data = event.data
  if (data?.state?.name !== 'Todo') return null

  const labels = (data.labels ?? []).map((l) => l.name)
  if (!labels.includes('agent') || labels.includes('blocked')) return null

  const identifier =
    data.identifier ?? (data.team?.key && data.number !== undefined ? `${data.team.key}-${data.number}` : null)
  return identifier !== null && ISSUE_ID_RE.test(identifier) ? identifier : null
}
