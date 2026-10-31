import { randomUUID } from 'node:crypto'
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

/**
 * One event with no person behind it: a fresh random device id per call, no
 * user id, nothing that ties two events together. The request reaches
 * Amplitude from our server, so the person's IP never does. Sends at once and
 * waits for Amplitude's answer, so a serverless function cannot freeze before
 * the event left. Rejects when the key is missing or Amplitude refuses it.
 */
export async function trackAnonymousServer(eventName: string, eventProperties: Record<string, unknown>) {
  if (!process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY) {
    throw new Error('NEXT_PUBLIC_AMPLITUDE_API_KEY is not set')
  }
  ensureInit()
  const sent = track(eventName, eventProperties, { device_id: randomUUID() })
  flush()
  const result = await sent.promise
  if (result.code !== 200) {
    throw new Error(`Amplitude answered ${result.code}: ${result.message}`)
  }
}

export { flush as flushAmplitude }
