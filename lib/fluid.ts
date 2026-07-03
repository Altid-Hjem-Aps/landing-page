// Responsive sizing anchored to the 1920px CVI Figma frame.
//
// Give a design value (the px you read in Figma at 1920 wide) and get back a
// CSS clamp() that:
//   • equals that px exactly at a 1920px viewport,
//   • scales down proportionally on narrower screens (the vw middle),
//   • is bounded by rem min/max so browser zoom + user font-size still work.
//
// Use it in an inline style (Tailwind can't see runtime-generated class names):
//   style={{ paddingLeft: fluid(140), fontSize: fluid(20, 15) }}

const FRAME_WIDTH = 1920

/**
 * @param px    design value at the 1920 frame
 * @param minPx floor for small screens (default 16px)
 * @param maxPx ceiling for screens wider than the frame (default = px)
 */
export function fluid(px: number, minPx = 16, maxPx = px): string {
  // Guard: a design value below the default floor would otherwise produce an
  // inverted clamp (min > max), which CSS resolves to the min — i.e. LARGER
  // than the design value everywhere.
  const min = Math.min(minPx, maxPx)
  const vw = ((px / FRAME_WIDTH) * 100).toFixed(3)
  return `clamp(${min / 16}rem, ${vw}vw, ${maxPx / 16}rem)`
}
