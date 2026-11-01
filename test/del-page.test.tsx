import { afterEach, describe, expect, it, vi } from 'vitest'
import { act, fireEvent, render, screen } from '@testing-library/react'
import * as amplitude from '@amplitude/analytics-browser'
import DelPage from '@/app/del/page'
import { SHARE_TEXT } from '@/lib/share-page'

vi.mock('@amplitude/analytics-browser', () => ({ track: vi.fn() }))

const URL_HJEM = 'https://www.altidhjem.dk/?utm_source=invite&utm_medium=share&utm_campaign=hjem-welcome'

// navigator.share / clipboard / userAgent are browser APIs: set them on the real
// jsdom navigator and remove them again after each test.
const added: string[] = []
function setNavigator(key: string, value: unknown) {
  Object.defineProperty(navigator, key, { value, configurable: true, writable: true })
  added.push(key)
}

afterEach(() => {
  for (const key of added.splice(0)) delete (navigator as unknown as Record<string, unknown>)[key]
  vi.clearAllMocks()
  vi.useRealTimers()
})

async function renderPage(via?: string) {
  render(await DelPage({ searchParams: Promise.resolve(via === undefined ? {} : { via }) }))
}

describe('/del', () => {
  it('without navigator.share shows only the fallbacks, with links for the sanitised via', async () => {
    await renderPage('hjem-welcome')
    expect(screen.queryByRole('button', { name: 'Del' })).toBeNull()
    expect(screen.getByRole('button', { name: 'Kopiér link' })).toBeInTheDocument()
    const wa = screen.getByRole('link', { name: 'WhatsApp' }).getAttribute('href')!
    expect(decodeURIComponent(wa.replace('https://wa.me/?text=', ''))).toBe(`${SHARE_TEXT} ${URL_HJEM}`)
    expect(screen.getByRole('link', { name: 'SMS' }).getAttribute('href')).toMatch(/^sms:\?&body=/)
    expect(screen.getByRole('link', { name: 'Mail' }).getAttribute('href')).toMatch(/^mailto:\?subject=Pr%C3%B8v%20Altid%20Hjem&body=/)
  })

  it('falls back to via=del for an invalid ?via=', async () => {
    await renderPage('NOT valid')
    expect(screen.getByLabelText('Link til Altid Hjem')).toHaveValue(
      'https://www.altidhjem.dk/?utm_source=invite&utm_medium=share&utm_campaign=del',
    )
  })

  it('uses the Android sms: form on Android', async () => {
    setNavigator('userAgent', 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 Chrome/130 Mobile')
    await renderPage('hjem-welcome')
    expect(screen.getByRole('link', { name: 'SMS' }).getAttribute('href')).toMatch(/^sms:\?body=/)
  })

  it('with navigator.share opens the sheet with title, text and url, and tracks only after it resolves', async () => {
    const share = vi.fn().mockResolvedValue(undefined)
    setNavigator('share', share)
    await renderPage('hjem-welcome')
    await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Del' })))
    expect(share).toHaveBeenCalledWith({ title: 'Altid Hjem', text: SHARE_TEXT, url: URL_HJEM })
    expect(amplitude.track).toHaveBeenCalledWith('Share Page Shared', { method: 'native', via: 'hjem-welcome' })
  })

  it('says nothing and tracks nothing when the person closes the share sheet', async () => {
    setNavigator('share', vi.fn().mockRejectedValue(Object.assign(new Error('closed'), { name: 'AbortError' })))
    await renderPage('hjem-welcome')
    await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Del' })))
    expect(screen.getByRole('status')).toBeEmptyDOMElement()
    expect(amplitude.track).not.toHaveBeenCalled()
  })

  it('ignores a second tap while the share sheet is still open', async () => {
    let close: () => void = () => {}
    const share = vi.fn(() => new Promise<void>((resolve) => (close = resolve)))
    setNavigator('share', share)
    await renderPage('hjem-welcome')
    const del = screen.getByRole('button', { name: 'Del' })
    fireEvent.click(del)
    fireEvent.click(del)
    expect(share).toHaveBeenCalledTimes(1)
    await act(async () => close())
    expect(screen.getByRole('status')).toBeEmptyDOMElement()
  })

  it('shows a short Danish line when sharing really fails', async () => {
    setNavigator('share', vi.fn().mockRejectedValue(Object.assign(new Error('nope'), { name: 'NotAllowedError' })))
    await renderPage('hjem-welcome')
    await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Del' })))
    expect(screen.getByRole('status')).toHaveTextContent('Delingen virkede ikke')
    expect(amplitude.track).not.toHaveBeenCalled()
  })

  it('copies the link, says Kopieret for 2 seconds and tracks copy', async () => {
    vi.useFakeTimers()
    const writeText = vi.fn().mockResolvedValue(undefined)
    setNavigator('clipboard', { writeText })
    await renderPage('hjem-welcome')
    await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Kopiér link' })))
    expect(writeText).toHaveBeenCalledWith(URL_HJEM)
    expect(screen.getByRole('button', { name: 'Kopieret' })).toBeInTheDocument()
    expect(amplitude.track).toHaveBeenCalledWith('Share Page Shared', { method: 'copy', via: 'hjem-welcome' })
    act(() => vi.advanceTimersByTime(2000))
    expect(screen.getByRole('button', { name: 'Kopiér link' })).toBeInTheDocument()
  })

  it('without a clipboard API selects the link instead and does not claim it was copied', async () => {
    setNavigator('clipboard', undefined)
    await renderPage('hjem-welcome')
    await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Kopiér link' })))
    expect(document.activeElement).toBe(screen.getByLabelText('Link til Altid Hjem'))
    expect(screen.queryByRole('button', { name: 'Kopieret' })).toBeNull()
    expect(amplitude.track).not.toHaveBeenCalled()
  })

  it('tracks the channel a person picks', async () => {
    await renderPage('hjem-welcome')
    fireEvent.click(screen.getByRole('link', { name: 'Mail' }))
    expect(amplitude.track).toHaveBeenCalledWith('Share Page Shared', { method: 'mail', via: 'hjem-welcome' })
  })
})
