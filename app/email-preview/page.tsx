import { waitlistConfirmation } from '@/emails/waitlist-confirmation'
import { waitlistFollowup1 } from '@/emails/waitlist-followup-1'
import { waitlistFollowup2 } from '@/emails/waitlist-followup-2'

const EMAILS = [
  { label: 'Confirmation', fn: () => waitlistConfirmation({ name: 'Alex Thorup', email: 'alexander@thorup.life' }) },
  { label: 'Follow-up #1', fn: () => waitlistFollowup1({ name: 'Alex Thorup', email: 'alexander@thorup.life' }) },
  { label: 'Follow-up #2', fn: () => waitlistFollowup2({ name: 'Alex Thorup', email: 'alexander@thorup.life' }) },
]

export default async function EmailPreviewPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>
}) {
  const { email: selectedLabel } = await searchParams
  const selected = selectedLabel ?? 'Confirmation'
  const email = EMAILS.find((e) => e.label === selected) ?? EMAILS[0]
  const { subject, html } = email.fn()

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', background: '#111', minHeight: '100vh' }}>
      <div style={{ display: 'flex', gap: 8, padding: '12px 16px', borderBottom: '1px solid #222' }}>
        {EMAILS.map((e) => (
          <a
            key={e.label}
            href={`/email-preview?email=${encodeURIComponent(e.label)}`}
            style={{
              padding: '6px 14px',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              textDecoration: 'none',
              background: e.label === selected ? '#fff' : '#222',
              color: e.label === selected ? '#111' : '#aaa',
            }}
          >
            {e.label}
          </a>
        ))}
        <span style={{ marginLeft: 'auto', fontSize: 12, color: '#555', alignSelf: 'center' }}>
          Subject: <span style={{ color: '#aaa' }}>{subject}</span>
        </span>
      </div>

      <iframe
        srcDoc={html}
        style={{ width: '100%', height: 'calc(100vh - 49px)', border: 'none', background: '#fff' }}
        title={email.label}
      />
    </div>
  )
}
