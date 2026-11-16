'use client'

import StoreBadges from '@/components/StoreBadges'
import GetAppButton from './GetAppButton'

// The final block's store pills. On a phone the one "Hent appen gratis" button to the visitor's
// own store (CSS); on a tablet the two pills as store links, counted as 'bottom'; on a computer
// each pill opens into its own store's QR code with "Kopiér link" (PillQr, Thor 15/11), which
// replaced the one shared QR card for both stores.
export default function FinalPills() {
  return (
    <div className="e-pills">
      <StoreBadges position="bottom" variant="cream" size="lg" className="store-row justify-center" motion qr />
      <GetAppButton position="bottom" />
    </div>
  )
}
