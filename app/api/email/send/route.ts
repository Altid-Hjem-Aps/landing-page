import { NextResponse } from 'next/server'

// Emails are now scheduled at signup time via Resend's scheduled_at.
export async function POST() {
  return NextResponse.json({ error: 'Deprecated' }, { status: 410 })
}
