import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'

export const metadata: Metadata = {
  title: 'Support – Altid Hjem',
  description: 'Brug for hjælp? Sådan kontakter du Altid Hjem support.',
}

// TODO(phone): replace PHONE_NUMBER + PHONE_HREF with the real support
// number once confirmed. Keeping both as constants so it's a one-line
// edit when the value lands.
const PHONE_NUMBER = '+45 XX XX XX XX'
const PHONE_HREF = 'tel:+45XXXXXXXX'

export default function Support() {
  return (
    <>
      <Nav />
      <main className="min-h-screen pt-28 pb-24" style={{ background: 'var(--forest)', fontFamily: 'var(--font-onest)' }}>
        <div className="max-w-2xl mx-auto px-6">

          <Link href="/" className="inline-flex items-center gap-2 text-sm mb-10 transition-opacity hover:opacity-70" style={{ color: 'rgba(255,255,255,0.4)' }}>
            <span>←</span> Tilbage
          </Link>

          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-1">Support</h1>
          <p className="text-sm mb-12 font-medium" style={{ color: 'rgba(255,255,255,0.45)' }}>Brug for hjælp? Vi sidder klar.</p>

          <div className="space-y-10 text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>

            <section>
              <h2 className="text-white font-semibold text-base mb-3">Skriv til os</h2>
              <p className="mb-3">Send en mail til <a href="mailto:hej@altidhjem.dk" className="underline underline-offset-2 hover:opacity-80">hej@altidhjem.dk</a>. Vi svarer normalt inden for én hverdag.</p>
            </section>

            <section>
              <h2 className="text-white font-semibold text-base mb-3">Ring til os</h2>
              <p className="mb-3">Telefonsupport på hverdage 9–16.</p>
              <div className="pl-4" style={{ borderLeft: '2px solid rgba(255,255,255,0.1)' }}>
                <p className="font-medium text-white"><a href={PHONE_HREF} className="hover:opacity-80">{PHONE_NUMBER}</a></p>
              </div>
            </section>

            <section>
              <h2 className="text-white font-semibold text-base mb-3">Adresse</h2>
              <div className="pl-4" style={{ borderLeft: '2px solid rgba(255,255,255,0.1)' }}>
                <p className="font-medium text-white">Altid Hjem ApS</p>
                <p>Helsinkigade 29, 2150 Nordhavn</p>
                <p>CVR 45637476</p>
              </div>
            </section>

            <section>
              <h2 className="text-white font-semibold text-base mb-3">Databeskyttelse</h2>
              <p>Spørgsmål om dine personoplysninger? Læs vores <Link href="/privatlivspolitik" className="underline underline-offset-2 hover:opacity-80">privatlivspolitik</Link> eller skriv til <a href="mailto:hej@altidhjem.dk" className="underline underline-offset-2 hover:opacity-80">hej@altidhjem.dk</a>.</p>
            </section>

          </div>
        </div>
      </main>
    </>
  )
}
