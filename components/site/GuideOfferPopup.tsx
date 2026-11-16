import { readUserCount, usersHundreds } from '@/lib/user-count'
import { OFFER_POPUP } from './copy'
import OfferPopup from './OfferPopup'

// The guides' offer pop-up with the live count under its button, read on the server as the
// front page does (lib/user-count.ts).
export default async function GuideOfferPopup({ after }: { after: number }) {
  const users = await readUserCount()
  return <OfferPopup after={after} proof={OFFER_POPUP.proof.replace('{hundreds}', usersHundreds(users))} />
}
