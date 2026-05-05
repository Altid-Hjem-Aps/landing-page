import { init, track, flush, Identify, identify } from '@amplitude/analytics-node'

let initialized = false

function ensureInit() {
  if (initialized) return
  initialized = true
  init(process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY!, {
    serverUrl: 'https://api.eu.amplitude.com/2/httpapi', // EU data region
    flushQueueSize: 10,
    flushIntervalMillis: 500,
  })
}

export function trackServer(
  eventName: string,
  eventProperties?: Record<string, unknown>,
  userId?: string,
) {
  ensureInit()
  track(eventName, eventProperties, { user_id: userId })
}

export function identifyServer(userId: string, userProperties: Record<string, unknown>) {
  ensureInit()
  const identifyObj = new Identify()
  for (const [key, value] of Object.entries(userProperties)) {
    identifyObj.set(key, value as string | number | boolean)
  }
  identify(identifyObj, { user_id: userId })
}

export { flush as flushAmplitude }
