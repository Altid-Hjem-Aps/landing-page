import { afterEach, describe, expect, it, vi } from 'vitest'
import { act, fireEvent, render, screen } from '@testing-library/react'
import * as amplitude from '@amplitude/analytics-browser'
import DelPage from '@/app/del/page'
import { SHARE_TEXT } from '@/lib/share-page'

vi.mock('@amplitude/analytics-browser', () => ({ track: vi.fn() }))

const SHARED = 'https://www.altidhjem.dk/app'

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
  it('without navigator.share shows only the link field with copy and one line', async () => {
    await renderPage('hjem-welcome')
    expect(screen.queryByRole('button', { name: 'Del' })).toBeNull()
    expect(screen.getByText('Kopiér linket, og send det videre.')).toBeInTheDocument()
    expect(screen.getByLabelText('Link til Altid Hjem')).toHaveValue('altidhjem.dk/app')
    expect(screen.getByRole('button', { name: 'Kopiér link' })).toBeInTheDocument()
    // The share sheet covers the channels: no WhatsApp/SMS/Mail buttons on the page.
    expect(screen.queryByRole('link', { name: /WhatsApp|SMS|Mail/ })).toBeNull()
  })

  it('shows the Del button with the share icon when the browser can share', async () => {
    setNavigator('share', vi.fn().mockResolvedValue(undefined))
    await renderPage('hjem-welcome')
    const del = screen.getByRole('button', { name: 'Del' })
    expect(del.querySelector('svg[data-icon="share"]')).not.toBeNull()
    expect(screen.queryByText('Kopiér linket, og send det videre.')).toBeNull()
  })

  it('with navigator.share opens the sheet with title, text and url, and tracks only after it resolves', async () => {
    const share = vi.fn().mockResolvedValue(undefined)
    setNavigator('share', share)
    await renderPage('hjem-welcome')
    await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Del' })))
    expect(share).toHaveBeenCalledWith({ title: 'Altid Hjem', text: SHARE_TEXT, url: SHARED })
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
    expect(writeText).toHaveBeenCalledWith(SHARED)
    const done = screen.getByRole('button', { name: 'Kopieret' })
    expect(done.querySelector('svg[data-icon="check"]')).not.toBeNull()
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

  it('tracks an invalid ?via= as del', async () => {
    setNavigator('clipboard', { writeText: vi.fn().mockResolvedValue(undefined) })
    await renderPage('NOT valid')
    await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Kopiér link' })))
    expect(amplitude.track).toHaveBeenCalledWith('Share Page Shared', { method: 'copy', via: 'del' })
  })
})
