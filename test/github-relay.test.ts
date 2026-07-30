import { createHmac } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import { mentionToDispatch, verifyGithubSignature, verifyPathKey } from '@/lib/github-relay'

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

describe('verifyPathKey', () => {
  it('accepts the exact key and rejects wrong, partial, and extended keys', () => {
    expect(verifyPathKey('abc123', 'abc123')).toBe(true)
    expect(verifyPathKey('abc124', 'abc123')).toBe(false)
    expect(verifyPathKey('abc12', 'abc123')).toBe(false)
    expect(verifyPathKey('abc1234', 'abc123')).toBe(false)
  })
})

// Payload shapes match GitHub's pull_request_review and
// pull_request_review_comment webhook events.
const review = {
  action: 'submitted',
  sender: { type: 'User' },
  pull_request: { number: 264 },
  review: { body: 'Requesting changes.\n\n@claude can you fix?', author_association: 'MEMBER' },
}

const reviewComment = {
  action: 'created',
  sender: { type: 'User' },
  pull_request: { number: 264 },
  comment: { body: '@claude this line is wrong', author_association: 'COLLABORATOR' },
}

describe('mentionToDispatch', () => {
  it('dispatches a submitted review whose body mentions @claude', () => {
    expect(mentionToDispatch('pull_request_review', review)).toBe(264)
  })

  it('dispatches a created inline review comment that mentions @claude', () => {
    expect(mentionToDispatch('pull_request_review_comment', reviewComment)).toBe(264)
  })

  it('ignores reviews and comments without a @claude mention, including empty bodies', () => {
    expect(
      mentionToDispatch('pull_request_review', { ...review, review: { ...review.review, body: 'LGTM' } }),
    ).toBeNull()
    expect(
      mentionToDispatch('pull_request_review', { ...review, review: { ...review.review, body: null } }),
    ).toBeNull()
    expect(
      mentionToDispatch('pull_request_review_comment', {
        ...reviewComment,
        comment: { ...reviewComment.comment, body: 'nit' },
      }),
    ).toBeNull()
  })

  it('ignores authors without write access: prompt mode has no native permission gate', () => {
    for (const association of ['CONTRIBUTOR', 'NONE', 'FIRST_TIME_CONTRIBUTOR', undefined]) {
      expect(
        mentionToDispatch('pull_request_review', {
          ...review,
          review: { ...review.review, author_association: association, user: { login: 'stranger' } },
        }),
      ).toBeNull()
    }
    expect(
      mentionToDispatch('pull_request_review_comment', {
        ...reviewComment,
        comment: { ...reviewComment.comment, author_association: 'NONE', user: { login: 'stranger' } },
      }),
    ).toBeNull()
    expect(
      mentionToDispatch('pull_request_review', {
        ...review,
        review: { ...review.review, author_association: 'OWNER' },
      }),
    ).toBe(264)
  })

  it('allows the team by login: private org membership reports MEMBER authors as CONTRIBUTOR', () => {
    for (const login of ['alexanderthorup', 'larssn']) {
      expect(
        mentionToDispatch('pull_request_review', {
          ...review,
          review: { ...review.review, author_association: 'CONTRIBUTOR', user: { login } },
        }),
      ).toBe(264)
    }
    expect(
      mentionToDispatch('pull_request_review_comment', {
        ...reviewComment,
        comment: { ...reviewComment.comment, author_association: 'CONTRIBUTOR', user: { login: 'larssn' } },
      }),
    ).toBe(264)
  })

  it('dispatches an edit that adds the mention: people tag after writing the review', () => {
    expect(
      mentionToDispatch('pull_request_review', {
        ...review,
        action: 'edited',
        changes: { body: { from: 'Requesting changes.' } },
      }),
    ).toBe(264)
    expect(
      mentionToDispatch('pull_request_review_comment', {
        ...reviewComment,
        action: 'edited',
        changes: { body: { from: 'this line is wrong' } },
      }),
    ).toBe(264)
  })

  it('ignores edits that did not introduce the mention, so the agent never fires twice', () => {
    expect(
      mentionToDispatch('pull_request_review', {
        ...review,
        action: 'edited',
        changes: { body: { from: '@claude can you fix?' } },
      }),
    ).toBeNull()
    // An edit to something other than the body carries no `changes.body`.
    expect(mentionToDispatch('pull_request_review', { ...review, action: 'edited' })).toBeNull()
  })

  it('ignores other actions: dismissed reviews, deleted comments', () => {
    expect(mentionToDispatch('pull_request_review', { ...review, action: 'dismissed' })).toBeNull()
    expect(mentionToDispatch('pull_request_review_comment', { ...reviewComment, action: 'deleted' })).toBeNull()
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
