'use client'

import { useEffect } from 'react'

interface Props {
  onClose: () => void
}

export default function PrivatpolitikModal({ onClose }: Props) {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="w-full sm:w-[92vw] sm:max-w-[1100px] max-h-[85dvh] sm:h-[90dvh] flex flex-col rounded-t-[24px] sm:rounded-[24px]"
        style={{ background: '#1a2e1a', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <h2 className="text-base font-bold text-white">Privatpolitik</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-lg transition-opacity hover:opacity-70"
            style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)' }}
            aria-label="Luk"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 sm:px-10 sm:py-8 text-sm leading-relaxed sm:columns-2 sm:gap-12 space-y-5" style={{ color: 'rgba(255,255,255,0.6)' }}>
          <p className="break-inside-avoid" style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>Sidst opdateret: april 2026</p>

          <section className="break-inside-avoid">
            <h3 className="text-white font-semibold mb-1.5">Dataansvarlig</h3>
            <p>Altid Hjem er ansvarlig for behandlingen af de personoplysninger, du afgiver via vores venteliste. Kontakt os på <a href="mailto:hej@altidhjem.dk" className="underline underline-offset-2 hover:opacity-80">hej@altidhjem.dk</a>.</p>
          </section>

          <section className="break-inside-avoid">
            <h3 className="text-white font-semibold mb-1.5">Hvilke oplysninger indsamler vi?</h3>
            <p>Når du skriver dig på ventelisten, behandler vi følgende oplysninger:</p>
            <ul className="mt-2 space-y-1 list-disc list-inside">
              <li>Navn</li>
              <li>E-mailadresse</li>
              <li>Mobilnummer</li>
              <li>Valgfrie svar på spørgsmål om din husstand og energiforbrug</li>
            </ul>
          </section>

          <section className="break-inside-avoid">
            <h3 className="text-white font-semibold mb-1.5">Hvorfor behandler vi dine oplysninger?</h3>
            <p>Vi behandler dine oplysninger for at kunne give dig besked, når Altid Hjem lanceres, og for at forstå, hvem vores tidlige brugere er. Det retslige grundlag er dit samtykke (GDPR art. 6, stk. 1, litra a).</p>
          </section>

          <section className="break-inside-avoid">
            <h3 className="text-white font-semibold mb-1.5">Opbevaring og sletning</h3>
            <p>Dine oplysninger opbevares sikkert hos Supabase (EU-region) og slettes senest 12 måneder efter Altid Hjems lancering, eller tidligere hvis du anmoder om det.</p>
          </section>

          <section className="break-inside-avoid">
            <h3 className="text-white font-semibold mb-1.5">Dine rettigheder</h3>
            <p>Du har til enhver tid ret til at:</p>
            <ul className="mt-2 space-y-1 list-disc list-inside">
              <li>Få indsigt i dine oplysninger</li>
              <li>Få rettet ukorrekte oplysninger</li>
              <li>Få slettet dine oplysninger</li>
              <li>Trække dit samtykke tilbage</li>
            </ul>
            <p className="mt-2">Send en mail til <a href="mailto:hej@altidhjem.dk" className="underline underline-offset-2 hover:opacity-80">hej@altidhjem.dk</a> for at gøre brug af dine rettigheder. Du kan også klage til Datatilsynet på <a href="https://www.datatilsynet.dk" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:opacity-80">datatilsynet.dk</a>.</p>
          </section>
        </div>
      </div>
    </div>
  )
}
