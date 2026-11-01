import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, fireEvent, render, screen } from '@testing-library/react'
import DelPage from '@/app/del/page'
import { SHARE_TEXT } from '@/lib/share-page'

// The share count goes to our own route by fetch: fetch is the boundary.
const fetchMock = vi.fn(async (url: string, init: RequestInit) => {
  void url
  void init
  return new Response(null, { status: 204 })
})
beforeEach(() => {
  vi.stubGlobal('fetch', fetchMock)
})

function expectCounted(method: 'native' | 'copy', via: string) {
  expect(fetchMock).toHaveBeenCalledTimes(1)
  const [url, init] = fetchMock.mock.calls[0]
  expect(url).toBe('/api/del/share')
  expect(init).toMatchObject({ method: 'POST', keepalive: true, headers: { 'content-type': 'application/json' } })
  expect(JSON.parse(init.body as string)).toEqual({ method, via })
}

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
  vi.unstubAllGlobals()
  vi.unstubAllEnvs()
  vi.useRealTimers()
})

async function renderPage(via?: string) {
  render(await DelPage({ searchParams: Promise.resolve(via === undefined ? {} : { via }) }))
}

describe('/del', () => {
  it('without navigator.share shows only the link field with copy and one line', async () => {
    await renderPage('hjem-welcome')
    expect(screen.queryByRole('button', { name: 'Del' })).toBeNull()
    expect(screen.getByText('Kopier linket, og send det videre.')).toBeInTheDocument()
    expect(screen.getByLabelText('Link til Altid Hjem')).toHaveValue('altidhjem.dk/app')
    const copy = screen.getByRole('button', { name: 'Kopier link' })
    // The label shows at every width (no breakpoint-hidden text), next to the icon.
    expect(copy).toHaveTextContent('Kopier link')
    expect(copy.querySelector('svg[data-icon="copy"]')).not.toBeNull()
    expect(copy.querySelector('.hidden')).toBeNull()
    expect(copy.className).toContain('whitespace-nowrap')
    // The share sheet covers the channels: no WhatsApp/SMS/Mail buttons on the page.
    expect(screen.queryByRole('link', { name: /WhatsApp|SMS|Mail/ })).toBeNull()
  })

  it('shows the Del button with the share icon when the browser can share', async () => {
    setNavigator('share', vi.fn().mockResolvedValue(undefined))
    await renderPage('hjem-welcome')
    const del = screen.getByRole('button', { name: 'Del' })
    expect(del.querySelector('svg[data-icon="share"]')).not.toBeNull()
    expect(screen.queryByText('Kopier linket, og send det videre.')).toBeNull()
  })

  it('with navigator.share opens the sheet with title, text and url, and tracks only after it resolves', async () => {
    const share = vi.fn().mockResolvedValue(undefined)
    setNavigator('share', share)
    await renderPage('hjem-welcome')
    await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Del' })))
    expect(share).toHaveBeenCalledWith({ title: 'Altid Hjem', text: SHARE_TEXT, url: SHARED })
    expectCounted('native', 'hjem-welcome')
  })

  it('says nothing and tracks nothing when the person closes the share sheet', async () => {
    setNavigator('share', vi.fn().mockRejectedValue(Object.assign(new Error('closed'), { name: 'AbortError' })))
    await renderPage('hjem-welcome')
    await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Del' })))
    expect(screen.getByRole('status')).toBeEmptyDOMElement()
    expect(fetchMock).not.toHaveBeenCalled()
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
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('copies the link, says Kopieret for 2 seconds and tracks copy', async () => {
    vi.useFakeTimers()
    const writeText = vi.fn().mockResolvedValue(undefined)
    setNavigator('clipboard', { writeText })
    await renderPage('hjem-welcome')
    await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Kopier link' })))
    expect(writeText).toHaveBeenCalledWith(SHARED)
    const button = screen.getByRole('button', { name: 'Kopier link' })
    expect(button).toHaveTextContent('Kopieret')
    expect(button.querySelector('svg[data-icon="check"]')).not.toBeNull()
    expect(document.querySelector('[aria-live="polite"]')).toHaveTextContent('Kopieret')
    expectCounted('copy', 'hjem-welcome')
    act(() => vi.advanceTimersByTime(2000))
    expect(screen.getByRole('button', { name: 'Kopier link' })).toHaveTextContent('Kopier link')
    expect(screen.getByRole('button', { name: 'Kopier link' })).not.toHaveTextContent('Kopieret')
    expect(document.querySelector('[aria-live="polite"]')).toBeEmptyDOMElement()
  })

  it.each([
    ['without a clipboard API', undefined],
    ['when the clipboard refuses', { writeText: vi.fn().mockRejectedValue(new Error('denied')) }],
  ])('%s selects the whole link instead and does not claim it was copied', async (_, clipboard) => {
    setNavigator('clipboard', clipboard)
    await renderPage('hjem-welcome')
    await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Kopier link' })))
    const input = screen.getByLabelText('Link til Altid Hjem') as HTMLInputElement
    expect(document.activeElement).toBe(input)
    expect([input.selectionStart, input.selectionEnd]).toEqual([0, 'altidhjem.dk/app'.length])
    expect(screen.getByRole('status')).toHaveTextContent('Linket er markeret')
    expect(screen.getByRole('button', { name: 'Kopier link' })).not.toHaveTextContent('Kopieret')
    expect(fetchMock).not.toHaveBeenCalled()
  })


  it('copies and says Kopieret even while the count has not answered', async () => {
    fetchMock.mockImplementationOnce(() => new Promise<Response>(() => {}))
    setNavigator('clipboard', { writeText: vi.fn().mockResolvedValue(undefined) })
    await renderPage('hjem-welcome')
    await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Kopier link' })))
    expect(screen.getByRole('button', { name: 'Kopier link' })).toHaveTextContent('Kopieret')
    expectCounted('copy', 'hjem-welcome')
  })

  it.each([
    ['a refused count', () => fetchMock.mockResolvedValueOnce(new Response(null, { status: 429 })), 'HTTP 429'],
    ['a network failure', () => fetchMock.mockRejectedValueOnce(new TypeError('offline')), new TypeError('offline')],
  ])('logs %s in development and still copies', async (_, fail, logged) => {
    vi.stubEnv('NODE_ENV', 'development')
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    fail()
    setNavigator('clipboard', { writeText: vi.fn().mockResolvedValue(undefined) })
    await renderPage('hjem-welcome')
    await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Kopier link' })))
    expect(error).toHaveBeenCalledWith('del share not counted', logged)
    expect(screen.getByRole('button', { name: 'Kopier link' })).toHaveTextContent('Kopieret')
    error.mockRestore()
  })

  it('tracks an invalid ?via= as del', async () => {
    setNavigator('clipboard', { writeText: vi.fn().mockResolvedValue(undefined) })
    await renderPage('NOT valid')
    await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Kopier link' })))
    expectCounted('copy', 'del')
  })
})
