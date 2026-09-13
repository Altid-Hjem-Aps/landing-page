import { describe, expect, it } from 'vitest'
import { NextRequest } from 'next/server'
import {
  APP_RETURN_URL,
  PAGE_TITLE,
  paymentAppReturnUrl,
  paymentReturnPage,
  paymentReturnRedirect,
} from '@/lib/payment-return'
import { GET, HEAD } from '@/app/betaling-retur/route'

function request(path: string): NextRequest {
  return new NextRequest(`https://www.altidhjem.dk${path}`)
}

describe('paymentAppReturnUrl', () => {
  it('forwards the markers the API put on the return URL', () => {
    expect(paymentAppReturnUrl('card', 'accept')).toBe(
      `${APP_RETURN_URL}?method=card&result=accept`,
    )
    expect(paymentAppReturnUrl('card', 'decline')).toBe(
      `${APP_RETURN_URL}?method=card&result=decline`,
    )
    expect(paymentAppReturnUrl('mobilepay', null)).toBe(
      `${APP_RETURN_URL}?method=mobilepay`,
    )
  })

  it('drops anything it did not put there but still lands in the app', () => {
    expect(paymentAppReturnUrl(null, null)).toBe(APP_RETURN_URL)
    expect(paymentAppReturnUrl('paypal', 'maybe')).toBe(APP_RETURN_URL)
    expect(paymentAppReturnUrl('card', 'maybe')).toBe(
      `${APP_RETURN_URL}?method=card`,
    )
    expect(paymentAppReturnUrl('javascript:alert(1)', 'accept')).toBe(
      `${APP_RETURN_URL}?result=accept`,
    )
  })
})

describe('paymentReturnPage', () => {
  it('uses a Danish title, heading and meta', () => {
    expect(PAGE_TITLE).toBe('Tilbage til appen')
    const html = paymentReturnPage(`${APP_RETURN_URL}?method=card&result=accept`)
    expect(html).toContain(`<title>${PAGE_TITLE}</title>`)
    expect(html).toContain(`<h1>${PAGE_TITLE}</h1>`)
    expect(html).toContain('lang="da"')
    expect(html).toContain('name="description"')
    expect(html).toContain('noindex')
    expect(html).not.toMatch(/Payment return/i)
    expect(html).toContain(
      'href="altidhjem://payment-return?method=card&amp;result=accept"',
    )
  })
})

describe('paymentReturnRedirect', () => {
  it('answers 302 with a custom-scheme Location and Danish HTML', async () => {
    const res = paymentReturnRedirect('card', 'accept')
    expect(res.status).toBe(302)
    expect(res.headers.get('Location')).toBe(
      `${APP_RETURN_URL}?method=card&result=accept`,
    )
    expect(res.headers.get('Cache-Control')).toBe('no-store')
    expect(res.headers.get('Content-Type')).toContain('text/html')
    expect(await res.text()).toContain(`<title>${PAGE_TITLE}</title>`)
  })
})

describe('GET /betaling-retur', () => {
  it('forwards our markers and drops the provider query', async () => {
    const res = GET(
      request(
        '/betaling-retur?method=card&result=accept&onpay_uuid=abc&onpay_hmac_sha1=def',
      ),
    )
    expect(res.status).toBe(302)
    expect(res.headers.get('Location')).toBe(
      'altidhjem://payment-return?method=card&result=accept',
    )
  })

  it('carries no result for MobilePay', () => {
    const res = GET(request('/betaling-retur?method=mobilepay'))
    expect(res.headers.get('Location')).toBe(
      'altidhjem://payment-return?method=mobilepay',
    )
  })

  it('still lands in the app with no markers', () => {
    const res = GET(request('/betaling-retur'))
    expect(res.headers.get('Location')).toBe('altidhjem://payment-return')
  })
})

describe('HEAD /betaling-retur', () => {
  it('matches GET so scanners do not see a different hop', () => {
    const res = HEAD(request('/betaling-retur?method=card&result=decline'))
    expect(res.status).toBe(302)
    expect(res.headers.get('Location')).toBe(
      'altidhjem://payment-return?method=card&result=decline',
    )
  })
})
