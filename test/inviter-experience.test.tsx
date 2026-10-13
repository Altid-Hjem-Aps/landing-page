import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import InviterExperience from '@/components/InviterExperience'

vi.mock('@/components/InviterShare', async () => {
  const React = await import('react')
  return {
    default: ({ code }: { code: string }) =>
      React.createElement('div', { 'data-testid': 'waitlist-referral' }, code || 'no referral code'),
  }
})

beforeEach(() => {
  delete window.__altiPartnerInviteFallback
})

afterEach(() => {
  delete window.__altiPartnerInviteFallback
  vi.clearAllMocks()
})

describe('InviterExperience', () => {
  it('keeps the existing waitlist referral flow when there is no partner invitation flag', () => {
    render(<InviterExperience code="waitlist-ref" />)

    expect(screen.getByTestId('waitlist-referral')).toHaveTextContent('waitlist-ref')
    expect(screen.queryByRole('heading', { name: 'Åbn invitationen i Altid Hjem' })).toBeNull()
  })

  it('shows store links and asks partners to tap the original link again', async () => {
    window.__altiPartnerInviteFallback = true
    render(<InviterExperience code="" />)

    expect(await screen.findByRole('heading', { name: 'Åbn invitationen i Altid Hjem' })).toBeInTheDocument()
    expect(screen.getByText(/tryk på invitationslinket igen/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Hent i App Store' })).toHaveAttribute(
      'href',
      'https://apps.apple.com/dk/app/altid-hjem/id6794330094',
    )
    expect(screen.getByRole('link', { name: 'Hent i Google Play' })).toHaveAttribute(
      'href',
      'https://play.google.com/store/apps/details?id=dk.altidhjem.app',
    )
    expect(screen.queryByTestId('waitlist-referral')).toBeNull()
    expect(window.__altiPartnerInviteFallback).toBeUndefined()
  })
})
