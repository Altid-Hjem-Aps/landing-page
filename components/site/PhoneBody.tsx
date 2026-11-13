// The phone's body behind Apple's front: the silhouette repeated in depth, so a tilted phone
// shows its titanium side and reads as solid, and the shadow at the back. Shared by every
// phone on the page (CyclingPhone and the steps' phone).
const LAYERS = 12

export default function PhoneBody() {
  return (
    <span className="ph-body" aria-hidden="true">
      <span className="ph-shadow" />
      {Array.from({ length: LAYERS }, (_, i) => (
        <span key={i} className="ph-edge" style={{ '--d': LAYERS - i } as React.CSSProperties} />
      ))}
    </span>
  )
}
