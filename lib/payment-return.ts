export const APP_RETURN_URL = 'altidhjem://payment-return'

const KNOWN_METHODS = new Set(['card', 'mobilepay'])
const KNOWN_RESULTS = new Set(['accept', 'decline'])

/**
 * Bounce target after OnPay. Only the markers the API put on
 * PaymentRedirect:ReturnUrl travel on; OnPay's extra query is dropped.
 */
export function paymentAppReturnUrl(
  method: string | null,
  result: string | null,
): string {
  const query: string[] = []
  if (method && KNOWN_METHODS.has(method)) query.push(`method=${method}`)
  if (result && KNOWN_RESULTS.has(result)) query.push(`result=${result}`)
  return query.length === 0 ? APP_RETURN_URL : `${APP_RETURN_URL}?${query.join('&')}`
}

export function paymentReturnRedirect(
  method: string | null,
  result: string | null,
): Response {
  return new Response(null, {
    status: 302,
    headers: {
      Location: paymentAppReturnUrl(method, result),
      'Cache-Control': 'no-store',
    },
  })
}
