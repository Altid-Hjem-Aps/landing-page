import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import NewsletterForm from '@/components/NewsletterForm'

// The form states a visitor can meet. The network is the boundary.

const fetchMock = vi.fn()

beforeEach(() => {
  vi.stubGlobal('fetch', fetchMock)
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
  fetchMock.mockReset()
})

function fill({ email = 'ny@example.dk', tick = true } = {}) {
  render(<NewsletterForm />)
  fireEvent.change(screen.getByLabelText('E-mail'), { target: { value: email } })
  if (tick) fireEvent.click(screen.getByRole('checkbox'))
  fireEvent.click(screen.getByRole('button', { name: 'Tilmeld' }))
}

describe('NewsletterForm', () => {
  it('starts with the box unticked, quoting the decided sentence', () => {
    render(<NewsletterForm />)
    expect(screen.getByRole('checkbox')).not.toBeChecked()
    expect(screen.getByLabelText(/^Ja tak til nyheder og gode tilbud på mail/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Hvem står bag?' })).toBeInTheDocument()
    expect(screen.getByText(/Afmeld når som helst/)).toBeInTheDocument()
    expect(screen.getByLabelText('E-mail')).toHaveAttribute('autocomplete', 'email')
  })

  it('unticked: sends nothing, says so and focuses the box', () => {
    fill({ tick: false })
    expect(fetchMock).not.toHaveBeenCalled()
    expect(screen.getByText('Sæt kryds i feltet for at tilmelde dig.')).toBeInTheDocument()
    expect(screen.getByRole('checkbox')).toHaveFocus()
  })

  it('invalid address: sends nothing and says so', () => {
    fill({ email: 'ikke-en-mail' })
    expect(fetchMock).not.toHaveBeenCalled()
    expect(screen.getByText('Skriv en gyldig e-mailadresse.')).toBeInTheDocument()
    expect(screen.getByLabelText('E-mail')).toHaveFocus()
  })

  it('posts the signup, shows the in-flight state, then replaces the form and moves focus', async () => {
    let answer: (r: { status: number }) => void = () => {}
    fetchMock.mockReturnValue(new Promise((resolve) => (answer = resolve)))
    fill()

    const button = screen.getByRole('button', { name: 'Tilmelder…' })
    expect(button).toBeDisabled()
    expect(fetchMock).toHaveBeenCalledTimes(1)
    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe('/api/waitlist')
    expect(JSON.parse(init.body)).toEqual({ source: 'newsletter', scope: 'hjem', email: 'ny@example.dk', consent: true })

    answer({ status: 200 })
    const success = await screen.findByText('Tak. Du hører fra os.')
    expect(success).toHaveFocus()
    expect(screen.queryByRole('checkbox')).toBeNull()
  })

  it.each([
    ['503', () => fetchMock.mockResolvedValue({ status: 503 }), 'Vi kunne ikke tilmelde dig lige nu. Prøv igen om et øjeblik.'],
    ['429', () => fetchMock.mockResolvedValue({ status: 429 }), 'Du har prøvet for mange gange. Prøv igen senere.'],
    ['network failure', () => fetchMock.mockRejectedValue(new Error('offline')), 'Vi kunne ikke tilmelde dig lige nu. Prøv igen om et øjeblik.'],
  ])('%s keeps the input and asks for a retry', async (_name, arrange, message) => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    arrange()
    fill()
    expect(await screen.findByText(message)).toHaveAttribute('aria-live', 'polite')
    expect(screen.getByLabelText('E-mail')).toHaveValue('ny@example.dk')
    expect(screen.getByRole('checkbox')).toBeChecked()
    await waitFor(() => expect(screen.getByRole('button', { name: 'Tilmeld' })).toBeEnabled())
  })
})
