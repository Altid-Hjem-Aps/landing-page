export const APP_RETURN_URL = 'altidhjem://payment-return'

/** Visible document title / heading on the hop (`/betaling-retur`). */
export const PAGE_TITLE = 'Tilbage til appen'
export const PAGE_DESCRIPTION = 'Du sendes tilbage til Altid Hjem-appen.'

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

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

export function paymentReturnPage(location: string): string {
  const href = escapeHtml(location)
  return `<!DOCTYPE html>
<html lang="da">
<head>
<meta charset="utf-8">
<title>${PAGE_TITLE}</title>
<meta name="description" content="${PAGE_DESCRIPTION}">
<meta name="robots" content="noindex,nofollow">
<meta http-equiv="refresh" content="0;url=${href}">
</head>
<body>
<h1>${PAGE_TITLE}</h1>
<p><a href="${href}">${PAGE_DESCRIPTION}</a></p>
</body>
</html>
`
}

export function paymentReturnRedirect(
  method: string | null,
  result: string | null,
): Response {
  const location = paymentAppReturnUrl(method, result)
  return new Response(paymentReturnPage(location), {
    status: 302,
    headers: {
      Location: location,
      'Cache-Control': 'no-store',
      'Content-Type': 'text/html; charset=utf-8',
    },
  })
}
