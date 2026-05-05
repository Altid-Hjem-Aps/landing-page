import WaitlistForm from '@/components/WaitlistForm'

export default function WaitlistQuestionsPreview() {
  return (
    <main
      style={{
        minHeight: '100vh',
        background: 'var(--forest, #0a3324)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        gap: 24,
      }}
    >
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
        Preview · Waitlist Questions
      </p>
      <div style={{ width: '100%', maxWidth: 460 }}>
        <WaitlistForm variant="dark" defaultView="questions" />
      </div>
    </main>
  )
}
