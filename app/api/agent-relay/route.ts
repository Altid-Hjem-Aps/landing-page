import { NextRequest, NextResponse } from 'next/server'
import { DISPATCH_EVENT, DISPATCH_REPO, isFreshDelivery, issueToDispatch, verifyLinearSignature } from '@/lib/agent-relay'

// Linear webhook receiver: relays qualifying ALT issues (label `agent`,
// state Todo, not `blocked`) to the app repo's Claude Agent pipeline via
// repository_dispatch. The 6-hourly cron in that workflow remains the
// fallback for missed deliveries.
export async function POST(req: NextRequest) {
  const secret = process.env.LINEAR_WEBHOOK_SECRET
  const token = process.env.GITHUB_DISPATCH_TOKEN
  if (!secret || !token) {
    return NextResponse.json({ error: 'Relay not configured' }, { status: 500 })
  }

  const rawBody = await req.text()
  if (!verifyLinearSignature(rawBody, req.headers.get('linear-signature'), secret)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  let event
  try {
    event = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  if (!isFreshDelivery(event.webhookTimestamp, Date.now())) {
    return NextResponse.json({ error: 'Stale delivery' }, { status: 400 })
  }

  const issue = issueToDispatch(event)
  if (issue === null) {
    return NextResponse.json({ dispatched: false })
  }

  const res = await fetch(`https://api.github.com/repos/${DISPATCH_REPO}/dispatches`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
    body: JSON.stringify({ event_type: DISPATCH_EVENT, client_payload: { issue } }),
  })
  if (!res.ok) {
    return NextResponse.json({ error: `GitHub dispatch failed: ${res.status}` }, { status: 502 })
  }

  return NextResponse.json({ dispatched: true, issue })
}
