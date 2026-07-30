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

// Authors allowed to command the agent. The relayed workflow job runs in
// prompt mode, which does not re-check the author the way the action's
// native tag mode does — so the relay is where the write-access gate lives.
// The app repo is private today; this keeps the pipeline safe if that ever
// changes.
//
// Two checks, either passes. The association check never fires for the
// current team: their org memberships are private, and GitHub conceals
// private membership from webhook payloads by reporting MEMBER authors as
// CONTRIBUTOR (verified live against app PR #292). The login allowlist is
// the gate that actually matches; the association check covers future
// members with public visibility. Logins are public info, so listing them
// here leaks nothing.
const ALLOWED_ASSOCIATIONS = new Set(['OWNER', 'MEMBER', 'COLLABORATOR'])
const ALLOWED_LOGINS = new Set(['alexanderthorup', 'larssn'])

interface MentionSource {
  body?: string | null
  author_association?: string
  user?: { login?: string }
}

interface GithubReviewEvent {
  action?: string
  sender?: { type?: string }
  pull_request?: { number?: number }
  review?: MentionSource
  comment?: MentionSource
  changes?: { body?: { from?: string } }
}

// Decide whether an incoming webhook delivery should trigger the agent, and
// for which PR. Returns the PR number or null.
//
// Only review-shaped events qualify: @claude in plain PR conversation
// comments (issue_comment) is still handled natively by the workflow, since
// that event runs from the default branch and is unaffected by conflicts.
// Bot senders are ignored so the agent's own replies can never re-trigger
// it, and only repo members' mentions count (see ALLOWED_ASSOCIATIONS).
//
// Edits count too. Writing the review first and adding the tag afterwards is
// how people actually work, and GitHub sends that as `edited`, not
// `submitted` (app PR #279: the mention sat unanswered until the 6-hourly
// sweep). An edit only qualifies when it introduces the mention, so
// re-editing a review that already said @claude cannot fire the agent twice.
export function mentionToDispatch(eventName: string | null, event: GithubReviewEvent): number | null {
  if (event.sender?.type === 'Bot') return null

  const isReview = eventName === 'pull_request_review'
  const isReviewComment = eventName === 'pull_request_review_comment'
  if (!isReview && !isReviewComment) return null

  const action = event.action
  const newAction = isReview ? 'submitted' : 'created'
  if (action !== newAction && action !== 'edited') return null

  if (action === 'edited') {
    // No body diff means the edit changed something else: not a new mention.
    const previousBody = event.changes?.body?.from
    if (previousBody === undefined || previousBody.includes('@claude')) return null
  }

  const source = isReview ? event.review : event.comment
  if (!source?.body?.includes('@claude')) return null
  const allowed =
    ALLOWED_ASSOCIATIONS.has(source.author_association ?? '') || ALLOWED_LOGINS.has(source.user?.login ?? '')
  if (!allowed) return null

  const pr = event.pull_request?.number
  return typeof pr === 'number' ? pr : null
}
