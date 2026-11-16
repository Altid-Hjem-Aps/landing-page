import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import GraensehandelCalculator from '@/components/mad/GraensehandelCalculator'

// Regression: ISSUE-003 — an expected saving of 0 kr. was rejected as invalid instead of showing
// that the trip only costs (about 118 kr. with the defaults). Carried over from altidmad.dk.
// Found by /qa (Codex review) on 2026-11-16
// Report: .gstack/qa-reports/qa-report-localhost-2026-11-16.md

describe('GraensehandelCalculator with no expected saving', () => {
  it('accepts 0 and says the trip does not pay', () => {
    render(<GraensehandelCalculator />)
    const field = screen.getByLabelText('Forventet besparelse (kr.)') as HTMLInputElement
    fireEvent.change(field, { target: { value: '0' } })
    fireEvent.blur(field)
    expect(field).not.toHaveAttribute('aria-invalid')
    expect(screen.getByText('På papiret: nej')).toBeInTheDocument()
  })
})
