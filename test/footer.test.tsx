import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import Footer from '@/components/Footer'

vi.mock('@/components/Logo', () => ({ Logo: () => null }))

describe('footer', () => {
  it('links to support and the legal pages Google Play requires to be reachable', () => {
    render(<Footer />)
    expect(screen.getByRole('link', { name: 'Support' })).toHaveAttribute('href', '/kontakt')
    expect(screen.getByRole('link', { name: 'Privatlivspolitik' })).toHaveAttribute('href', '/privatlivspolitik')
    expect(screen.getByRole('link', { name: 'Slet konto' })).toHaveAttribute('href', '/slet-konto')
    expect(screen.getByRole('button', { name: 'Cookieindstillinger' })).toBeInTheDocument()
  })

  it('names the company with its CVR', () => {
    render(<Footer />)
    expect(screen.getByText(/Altid Hjem ApS · CVR 45637476/)).toBeInTheDocument()
  })

  it('shows the icons of the services in the app only', () => {
    const { container } = render(<Footer />)
    const icons = Array.from(container.querySelectorAll('img')).map((i) => i.getAttribute('src'))
    expect(icons).toEqual(['/site/icons/madplan.svg', '/site/icons/strom.svg', '/site/icons/forsikring.svg', '/site/icons/okonomi.svg'])
  })

  describe('on the front page', () => {
    it('has the contact line, and every link the other footer has', () => {
      render(<Footer front />)
      expect(screen.getByText('Kontakt os')).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'hej@altidhjem.dk' })).toHaveAttribute('href', 'mailto:hej@altidhjem.dk')
      expect(screen.getByRole('link', { name: 'Support' })).toHaveAttribute('href', '/kontakt')
      expect(screen.getByRole('link', { name: 'Privatlivspolitik' })).toHaveAttribute('href', '/privatlivspolitik')
      expect(screen.getByRole('link', { name: 'Slet konto' })).toHaveAttribute('href', '/slet-konto')
      expect(screen.getByRole('button', { name: 'Cookieindstillinger' })).toBeInTheDocument()
      expect(screen.getByText(/Altid Hjem ApS · CVR 45637476/)).toBeInTheDocument()
      for (const name of ['LinkedIn', 'Instagram', 'Facebook']) {
        expect(screen.getByRole('link', { name })).toHaveAttribute('target', '_blank')
      }
      expect(screen.getByRole('link', { name: 'Billigste elselskab' })).toHaveAttribute('href', '/billigste-elselskab')
    })

    // Risk: the dark footer's form is a copy that drifts from what the route expects.
    it('has the newsletter, and it posts as the newsletter', async () => {
      const fetchMock = vi.fn().mockResolvedValue({ status: 200 })
      vi.stubGlobal('fetch', fetchMock)
      const { container } = render(<Footer front />)
      expect(container.querySelectorAll('form')).toHaveLength(1)

      fireEvent.change(screen.getByLabelText('E-mail'), { target: { value: 'ny@example.dk' } })
      fireEvent.click(screen.getByRole('checkbox'))
      fireEvent.click(screen.getByRole('button', { name: 'Tilmeld' }))

      expect(await screen.findByText('Tak. Du hører fra os.')).toHaveFocus()
      const [url, init] = fetchMock.mock.calls[0]
      expect(url).toBe('/api/waitlist')
      expect(JSON.parse(init.body)).toEqual({ source: 'newsletter', scope: 'hjem', email: 'ny@example.dk', consent: true })
      vi.unstubAllGlobals()
    })

    it('carries the caption only where screens are staged', () => {
      const { unmount } = render(<Footer front sampleData />)
      expect(screen.getByText('Skærmbilleder fra appen med eksempeldata.')).toBeInTheDocument()
      unmount()
      render(<Footer front />)
      expect(screen.queryByText('Skærmbilleder fra appen med eksempeldata.')).toBeNull()
    })
  })
})
