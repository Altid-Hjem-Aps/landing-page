import { NextRequest, NextResponse } from 'next/server'
import {
  DISPATCH_EVENT,
  DISPATCH_REPO,
  mentionToDispatch,
  verifyGithubSignature,
  verifyPathKey,
} from '@/lib/github-relay'

// GitHub webhook receiver: relays @claude mentions in PR reviews and inline
// review comments to the app repo's Claude Agent pipeline via
// repository_dispatch. Companion to /api/agent-relay (the Linear receiver);
// see lib/github-relay.ts for why review mentions cannot use the native
// workflow triggers.
//
// The route lives under an unguessable path segment (GITHUB_RELAY_PATH_KEY)
// so scanners never learn the endpoint exists: any other key 404s exactly
// like a route that is not there. The HMAC signature remains the actual
// security boundary; the path key is obscurity on top.
export async function POST(req: NextRequest, { params }: { params: Promise<{ key: string }> }) {
  const pathKey = process.env.GITHUB_RELAY_PATH_KEY
  const secret = process.env.GITHUB_WEBHOOK_SECRET
  const token = process.env.GITHUB_DISPATCH_TOKEN
  if (!pathKey || !secret || !token) {
    return NextResponse.json({ error: 'Relay not configured' }, { status: 500 })
  }

  const { key } = await params
  if (!verifyPathKey(key, pathKey)) {
    return new NextResponse(null, { status: 404 })
  }

  const rawBody = await req.text()
  if (!verifyGithubSignature(rawBody, req.headers.get('x-hub-signature-256'), secret)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  let event
  try {
    event = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  const eventName = req.headers.get('x-github-event')
  if (eventName === 'ping') {
    return NextResponse.json({ dispatched: false, pong: true })
  }

  const pr = mentionToDispatch(eventName, event)
  if (pr === null) {
    return NextResponse.json({ dispatched: false })
  }

  const res = await fetch(`https://api.github.com/repos/${DISPATCH_REPO}/dispatches`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
    body: JSON.stringify({ event_type: DISPATCH_EVENT, client_payload: { pr } }),
  })
  if (!res.ok) {
    return NextResponse.json({ error: `GitHub dispatch failed: ${res.status}` }, { status: 502 })
  }

  return NextResponse.json({ dispatched: true, pr })
}
