import { readCookieChoice } from '@/lib/cookie-consent'

// Amplitude in the browser runs only after the visitor chose "Accepter alle".
// Before that, amplitude.track() calls from components are held in the SDK's
// pre-init queue and never leave the browser unless init() is called.
let started = false
// Resolves with the SDK once init() has finished.
let ready: Promise<typeof import('@amplitude/analytics-browser')> | undefined

// Fetched only after consent: the SDK is about a quarter of the front page's script,
// and a first visit has not chosen yet. A failed download is forgotten, so the next
// consent can try again.
let sdk: Promise<typeof import('@amplitude/analytics-browser')> | undefined
const loadSdk = () =>
  (sdk ??= import('@amplitude/analytics-browser').catch((e) => {
    sdk = undefined
    started = false
    throw e
  }))

export function startAnalytics() {
  if (started) return
  const apiKey = process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY
  if (!apiKey) return
  started = true
  void loadSdk().then((amplitude) => {
    // The visitor may have withdrawn while the SDK was on its way, here or in another tab.
    if (!started || ready || readCookieChoice() === 'necessary') return
    const { promise } = amplitude.init(apiKey, {
      serverUrl: 'https://api.eu.amplitude.com/2/httpapi',
      fetchRemoteConfig: false,
      autocapture: {
        attribution: true,
        pageViews: true,
        sessions: true,
        formInteractions: true,
        fileDownloads: true,
        elementInteractions: true,
        frustrationInteractions: true,
        pageUrlEnrichment: true,
        networkTracking: true,
        webVitals: true,
      },
    })
    ready = promise.then(() => amplitude)
  })
}

// Withdrawal: stop sending now and remove what Amplitude stored in this
// browser (its AMP_* cookies and localStorage keys), so nothing links a
// later visit to this one.
export function stopAnalytics() {
  // Once init() has been called, opt out at once (the SDK is loaded by then), so an init() still
  // under way stops collecting, and again when it has finished, in case it overwrote the setting.
  // Before init() nothing is needed: startAnalytics() sees the withdrawal and never calls it.
  // Opting out writes the SDK's identifiers back to the browser, so they are removed after each.
  const optOut = ({ setOptOut }: typeof import('@amplitude/analytics-browser')) => {
    setOptOut(true)
    removeAmplitudeStorage()
  }
  if (ready) void sdk?.then(optOut)
  void ready?.then(optOut)
  started = false
  ready = undefined
  removeAmplitudeStorage()
}

export function removeAmplitudeStorage() {
  const host = window.location.hostname
  const apex = host.replace(/^www\./, '')
  for (const part of document.cookie.split(';')) {
    const name = part.split('=')[0]?.trim()
    if (!name || !name.startsWith('AMP_')) continue
    const expire = `${name}=; Max-Age=0; Path=/`
    document.cookie = expire
    document.cookie = `${expire}; Domain=.${apex}`
  }
  try {
    const keys: string[] = []
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i)
      if (key?.startsWith('AMP_')) keys.push(key)
    }
    keys.forEach((k) => window.localStorage.removeItem(k))
  } catch {}
}
