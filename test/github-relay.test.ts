import { createHmac } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import { mentionToDispatch, verifyGithubSignature } from '@/lib/github-relay'

const SECRET = 'test-secret'
const sign = (body: string) => `sha256=${createHmac('sha256', SECRET).update(body).digest('hex')}`

describe('verifyGithubSignature', () => {
  it('accepts a correct sha256-prefixed HMAC signature of the raw body', () => {
    const body = '{"action":"submitted"}'
    expect(verifyGithubSignature(body, sign(body), SECRET)).toBe(true)
  })

  it('rejects a wrong signature, a missing header, an unprefixed digest, and a tampered body', () => {
    const body = '{"action":"submitted"}'
    expect(verifyGithubSignature(body, sign('other'), SECRET)).toBe(false)
    expect(verifyGithubSignature(body, null, SECRET)).toBe(false)
    expect(verifyGithubSignature(body, sign(body).slice('sha256='.length), SECRET)).toBe(false)
    expect(verifyGithubSignature(body + ' ', sign(body), SECRET)).toBe(false)
  })
})

// Payload shapes match GitHub's pull_request_review and
// pull_request_review_comment webhook events.
const review = {
  action: 'submitted',
  sender: { type: 'User' },
  pull_request: { number: 264 },
  review: { body: 'Requesting changes.\n\n@claude can you fix?' },
}

const reviewComment = {
  action: 'created',
  sender: { type: 'User' },
  pull_request: { number: 264 },
  comment: { body: '@claude this line is wrong' },
}

describe('mentionToDispatch', () => {
  it('dispatches a submitted review whose body mentions @claude', () => {
    expect(mentionToDispatch('pull_request_review', review)).toBe(264)
  })

  it('dispatches a created inline review comment that mentions @claude', () => {
    expect(mentionToDispatch('pull_request_review_comment', reviewComment)).toBe(264)
  })

  it('ignores reviews and comments without a @claude mention, including empty bodies', () => {
    expect(mentionToDispatch('pull_request_review', { ...review, review: { body: 'LGTM' } })).toBeNull()
    expect(mentionToDispatch('pull_request_review', { ...review, review: { body: null } })).toBeNull()
    expect(mentionToDispatch('pull_request_review_comment', { ...reviewComment, comment: { body: 'nit' } })).toBeNull()
  })

  it('ignores other actions: edited reviews, dismissed reviews, edited comments', () => {
    expect(mentionToDispatch('pull_request_review', { ...review, action: 'edited' })).toBeNull()
    expect(mentionToDispatch('pull_request_review', { ...review, action: 'dismissed' })).toBeNull()
    expect(mentionToDispatch('pull_request_review_comment', { ...reviewComment, action: 'edited' })).toBeNull()
  })

  it('ignores other event names, including issue_comment (handled natively by the workflow)', () => {
    expect(mentionToDispatch('issue_comment', reviewComment)).toBeNull()
    expect(mentionToDispatch('ping', review)).toBeNull()
    expect(mentionToDispatch(null, review)).toBeNull()
  })

  it('ignores bot senders so the agent cannot re-trigger itself', () => {
    expect(mentionToDispatch('pull_request_review', { ...review, sender: { type: 'Bot' } })).toBeNull()
  })

  it('returns null when the PR number is missing', () => {
    expect(mentionToDispatch('pull_request_review', { ...review, pull_request: {} })).toBeNull()
  })
})
