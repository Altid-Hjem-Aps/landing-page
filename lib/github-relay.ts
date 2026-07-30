import { createHmac, timingSafeEqual } from 'node:crypto'

// Relay from GitHub webhooks to the app repo's agent pipeline.
//
// Why this exists: the app repo's claude-agent.yml cannot react to @claude
// mentions in PR review bodies or inline review comments on conflicted PRs,
// because GitHub runs pull_request_review / pull_request_review_comment
// workflows from the PR's test merge commit, which does not exist when the
// PR has conflicts (app PR #264 was the first casualty). This relay listens
// to the same events as a repo webhook and re-emits qualifying mentions as
// repository_dispatch, which always runs from the default branch.
export const DISPATCH_REPO = 'Altid-Hjem-Aps/altid-hjem-app'
export const DISPATCH_EVENT = 'claude-mention'

// GitHub signs the raw request body with HMAC-SHA256 of the webhook secret,
// hex-encoded in the `x-hub-signature-256` header, prefixed with "sha256=".
export function verifyGithubSignature(rawBody: string, signature: string | null, secret: string): boolean {
  if (!signature) return false
  const expected = `sha256=${createHmac('sha256', secret).update(rawBody).digest('hex')}`
  const a = Buffer.from(signature)
  const b = Buffer.from(expected)
  return a.length === b.length && timingSafeEqual(a, b)
}

interface GithubReviewEvent {
  action?: string
  sender?: { type?: string }
  pull_request?: { number?: number }
  review?: { body?: string | null }
  comment?: { body?: string | null }
}

// Decide whether an incoming webhook delivery should trigger the agent, and
// for which PR. Returns the PR number or null.
//
// Only review-shaped events qualify: @claude in plain PR conversation
// comments (issue_comment) is still handled natively by the workflow, since
// that event runs from the default branch and is unaffected by conflicts.
// Bot senders are ignored so the agent's own replies can never re-trigger it.
export function mentionToDispatch(eventName: string | null, event: GithubReviewEvent): number | null {
  if (event.sender?.type === 'Bot') return null

  const body =
    eventName === 'pull_request_review' && event.action === 'submitted'
      ? event.review?.body
      : eventName === 'pull_request_review_comment' && event.action === 'created'
        ? event.comment?.body
        : null
  if (!body?.includes('@claude')) return null

  const pr = event.pull_request?.number
  return typeof pr === 'number' ? pr : null
}
