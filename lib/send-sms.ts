const GATEWAY_API_BASE = 'https://gatewayapi.com/rest'
const SENDER = 'Altid Hjem'
const WAITLIST_GROUP = 'waitlist'

function toMsisdn(phone: string): number {
  // phone is stored as 8-digit Danish number, prepend country code 45
  return parseInt('45' + phone.replace(/\s/g, ''), 10)
}

function authHeaders() {
  const apiKey = process.env.GATEWAYAPI_API_KEY
  if (!apiKey) throw new Error('GATEWAYAPI_API_KEY is not set')
  return {
    'Content-Type': 'application/json',
    Authorization: `Token ${apiKey}`,
  }
}

async function sendSms(message: string, recipients: { msisdn?: number; groups?: string[] }[]): Promise<void> {
  const res = await fetch(`${GATEWAY_API_BASE}/mtsms`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ sender: SENDER, message, recipients }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(`GatewayAPI error ${res.status}: ${JSON.stringify(err)}`)
  }
}

export async function addToWaitlistGroup(phone: string): Promise<void> {
  const msisdn = toMsisdn(phone)

  // Upsert contact
  await fetch(`${GATEWAY_API_BASE}/contacts/${msisdn}`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ msisdn }),
  })

  // Add to waitlist group (group is auto-created if it doesn't exist)
  const res = await fetch(`${GATEWAY_API_BASE}/groups/${WAITLIST_GROUP}/contacts/${msisdn}`, {
    method: 'POST',
    headers: authHeaders(),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(`GatewayAPI group add error ${res.status}: ${JSON.stringify(err)}`)
  }
}

export async function sendWaitlistConfirmationSms(name: string, phone: string): Promise<void> {
  const message = `Tak for din tilmelding til Altid Hjem ventelisten, ${name}! Du hører fra os, når appen er klar. Hav en skøn dag.`
  await sendSms(message, [{ msisdn: toMsisdn(phone) }])
}

export async function sendLaunchSmsToGroup(): Promise<void> {
  const message = 'Altid Hjem er live! Download appen her: [APPSTORE_LINK]'
  await sendSms(message, [{ groups: [WAITLIST_GROUP] }])
}
