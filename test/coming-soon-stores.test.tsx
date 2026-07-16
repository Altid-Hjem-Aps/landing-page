import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import ComingSoonStores from '@/components/ComingSoonStores'

// jsdom loads no stylesheets, so the sm:hidden / max-sm:hidden split doesn't
// resolve here and the prefix renders for both viewports at once. That's why
// there's no assertion on the phrase's visibility or count — such a test would
// pin the styles-off state and pass whether or not the two classes still
// complement each other. Only the breakpoint-independent invariants are tested.
describe('ComingSoonStores', () => {
  // The pills are deliberately inert: Apple and Google sanction no "coming
  // soon" badge, and there's no listing to send anyone to yet. Linking them
  // before launch is the regression this guards.
  it('renders the stores as inert text, never as links or buttons', () => {
    render(<ComingSoonStores />)
    expect(screen.queryAllByRole('link')).toHaveLength(0)
    expect(screen.queryAllByRole('button')).toHaveLength(0)
    expect(screen.getByText('App Store')).toBeInTheDocument()
    expect(screen.getByText('Google Play')).toBeInTheDocument()
  })
})
