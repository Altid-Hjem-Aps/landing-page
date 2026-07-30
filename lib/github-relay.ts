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

// The route's dynamic path segment must match GITHUB_RELAY_PATH_KEY.
export function verifyPathKey(key: string, expected: string): boolean {
  const a = Buffer.from(key)
  const b = Buffer.from(expected)
  return a.length === b.length && timingSafeEqual(a, b)
}

// Author associations allowed to command the agent. The relayed workflow job
// runs in prompt mode, which does not re-check the author the way the
// action's native tag mode does — so the relay is where the write-access
// gate lives. The app repo is private today; this keeps the pipeline safe
// if that ever changes.
const ALLOWED_ASSOCIATIONS = new Set(['OWNER', 'MEMBER', 'COLLABORATOR'])

interface GithubReviewEvent {
  action?: string
  sender?: { type?: string }
  pull_request?: { number?: number }
  review?: { body?: string | null; author_association?: string }
  comment?: { body?: string | null; author_association?: string }
}

// Decide whether an incoming webhook delivery should trigger the agent, and
// for which PR. Returns the PR number or null.
//
// Only review-shaped events qualify: @claude in plain PR conversation
// comments (issue_comment) is still handled natively by the workflow, since
// that event runs from the default branch and is unaffected by conflicts.
// Bot senders are ignored so the agent's own replies can never re-trigger
// it, and only repo members' mentions count (see ALLOWED_ASSOCIATIONS).
export function mentionToDispatch(eventName: string | null, event: GithubReviewEvent): number | null {
  if (event.sender?.type === 'Bot') return null

  const source =
    eventName === 'pull_request_review' && event.action === 'submitted'
      ? event.review
      : eventName === 'pull_request_review_comment' && event.action === 'created'
        ? event.comment
        : null
  if (!source?.body?.includes('@claude')) return null
  if (!ALLOWED_ASSOCIATIONS.has(source.author_association ?? '')) return null

  const pr = event.pull_request?.number
  return typeof pr === 'number' ? pr : null
}
