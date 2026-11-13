import Image from 'next/image'
import { QR } from './copy'

// Computers only (CSS): the one QR code in a low dark card bottom right, the hero's old QR card
// with the new simple text (Thor 13/11). 200 x 60, so the hero's notifications and service
// marks stay clear of it while the page is at the top (sampled over a whole turn of the ring
// at 1280 x 900, 1440 x 900, 1536 x 864 and 1920 x 1080); a lower window has them in that
// corner, so there it sits top right instead (CSS). Stickies decides when it shows.
export default function GetAppSticky({ shown }: { shown: boolean }) {
  return (
    <div className="gs" data-shown={shown}>
      <span className="gs-tile">
        <Image src="/site/qr/app.svg" alt={QR.alt} width={52} height={52} />
      </span>
      <span className="gs-text">
        <span className="gs-title">{QR.title}</span>
        <span className="gs-line">{QR.line}</span>
      </span>
    </div>
  )
}
