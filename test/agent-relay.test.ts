import { createHmac } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import { isFreshDelivery, issueToDispatch, verifyLinearSignature } from '@/lib/agent-relay'

const SECRET = 'test-secret'
const sign = (body: string) => createHmac('sha256', SECRET).update(body).digest('hex')

describe('verifyLinearSignature', () => {
  it('accepts a correct HMAC-SHA256 hex signature of the raw body', () => {
    const body = '{"type":"Issue"}'
    expect(verifyLinearSignature(body, sign(body), SECRET)).toBe(true)
  })

  it('rejects a wrong signature, a missing header, and a tampered body', () => {
    const body = '{"type":"Issue"}'
    expect(verifyLinearSignature(body, sign('other'), SECRET)).toBe(false)
    expect(verifyLinearSignature(body, null, SECRET)).toBe(false)
    expect(verifyLinearSignature(body + ' ', sign(body), SECRET)).toBe(false)
  })
})

describe('isFreshDelivery', () => {
  const now = 1_752_000_000_000
  it('accepts timestamps within a minute of now', () => {
    expect(isFreshDelivery(now - 30_000, now)).toBe(true)
    expect(isFreshDelivery(now + 30_000, now)).toBe(true)
  })

  it('rejects old, future, and missing timestamps', () => {
    expect(isFreshDelivery(now - 61_000, now)).toBe(false)
    expect(isFreshDelivery(now + 61_000, now)).toBe(false)
    expect(isFreshDelivery(undefined, now)).toBe(false)
  })
})

// Payload shape matches Linear's Issue webhook: type/action at the top,
// changed fields' previous values in updatedFrom, issue fields in data.
const qualifyingIssue = {
  identifier: 'ALT-132',
  state: { name: 'Todo' },
  labels: [{ name: 'app' }, { name: 'agent' }],
}

describe('issueToDispatch', () => {
  it('dispatches when a qualifying issue is created', () => {
    expect(issueToDispatch({ type: 'Issue', action: 'create', data: qualifyingIssue })).toBe('ALT-132')
  })

  it('dispatches when labels or state change on a qualifying issue', () => {
    expect(
      issueToDispatch({ type: 'Issue', action: 'update', updatedFrom: { labelIds: [] }, data: qualifyingIssue }),
    ).toBe('ALT-132')
    expect(
      issueToDispatch({ type: 'Issue', action: 'update', updatedFrom: { stateId: 'x' }, data: qualifyingIssue }),
    ).toBe('ALT-132')
  })

  it('ignores updates that touch neither labels nor state, e.g. description edits', () => {
    expect(
      issueToDispatch({ type: 'Issue', action: 'update', updatedFrom: { description: 'old' }, data: qualifyingIssue }),
    ).toBeNull()
  })

  it('ignores issues that are not Todo, not agent-labeled, or blocked', () => {
    expect(
      issueToDispatch({
        type: 'Issue',
        action: 'create',
        data: { ...qualifyingIssue, state: { name: 'Backlog' } },
      }),
    ).toBeNull()
    expect(
      issueToDispatch({ type: 'Issue', action: 'create', data: { ...qualifyingIssue, labels: [{ name: 'app' }] } }),
    ).toBeNull()
    expect(
      issueToDispatch({
        type: 'Issue',
        action: 'create',
        data: { ...qualifyingIssue, labels: [...qualifyingIssue.labels, { name: 'blocked' }] },
      }),
    ).toBeNull()
  })

  it('ignores non-Issue events and issues outside ALT', () => {
    expect(issueToDispatch({ type: 'Comment', action: 'create', data: qualifyingIssue })).toBeNull()
    expect(
      issueToDispatch({
        type: 'Issue',
        action: 'create',
        data: { ...qualifyingIssue, identifier: 'OTHER-5' },
      }),
    ).toBeNull()
  })

  it('derives the identifier from team key and number when absent', () => {
    expect(
      issueToDispatch({
        type: 'Issue',
        action: 'create',
        data: { ...qualifyingIssue, identifier: undefined, team: { key: 'ALT' }, number: 132 },
      }),
    ).toBe('ALT-132')
  })
})
