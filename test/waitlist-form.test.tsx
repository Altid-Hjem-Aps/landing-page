import { afterEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import WaitlistForm from '@/components/WaitlistForm'

// Amplitude is a browser SDK with network side effects — mock it.
vi.mock('@amplitude/analytics-browser', () => ({ track: vi.fn() }))

afterEach(() => {
  vi.unstubAllGlobals()
  vi.clearAllMocks()
})

function fillAndSubmitDark() {
  render(<WaitlistForm variant="dark" />)
  fireEvent.change(screen.getByPlaceholderText('Dit fulde navn'), { target: { value: 'Test Testesen' } })
  fireEvent.change(screen.getByPlaceholderText('din@email.dk'), { target: { value: 'test@test.dk' } })
  fireEvent.change(screen.getByPlaceholderText('12 34 56 78'), { target: { value: '12345678' } })
  fireEvent.click(screen.getByRole('button', { name: /skriv mig på ventelisten/i }))
}

describe('WaitlistForm step 1 failure paths', () => {
  it('shows an error and re-enables the button when fetch rejects (offline)', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')))
    fillAndSubmitDark()
    await waitFor(() => expect(screen.getByText(/prøv igen/i)).toBeInTheDocument())
    expect(screen.getByRole('button', { name: /skriv mig på ventelisten/i })).toBeEnabled()
  })

  it('surfaces the API error message on a non-ok response', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        json: () => Promise.resolve({ error: 'Ugyldigt telefonnummer' }),
      }),
    )
    fillAndSubmitDark()
    await waitFor(() => expect(screen.getByText('Ugyldigt telefonnummer')).toBeInTheDocument())
  })

  it('moves to the questions step on success', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ id: 'abc', surveyToken: 'tok' }),
      }),
    )
    fillAndSubmitDark()
    await waitFor(() => expect(screen.getByText('Fortæl os lidt om dig.')).toBeInTheDocument())
  })
})
