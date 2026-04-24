const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'https://api.altidhjem.dk'

export async function postWaitlist(name: string, mobile: string, email: string) {
  const res = await fetch(`${API_URL}/api/waitlist`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, mobile, email }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw Object.assign(new Error(data.message ?? 'Signup failed'), { status: res.status })
  return data as { id: string }
}

export async function patchWaitlist(
  id: string,
  survey: {
    age?: number
    householdSize?: number
    motivation?: string
    electricityProvider?: string
  },
) {
  const res = await fetch(`${API_URL}/api/waitlist/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(survey),
  })
  if (!res.ok) throw new Error('Survey update failed')
  return res.json() as Promise<{ id: string }>
}
