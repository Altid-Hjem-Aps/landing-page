// Live "sparet" figure — IDENTICAL formula to altidenergi.dk's counter, so our
// number always matches theirs. Purely client-side and deterministic (no API):
//
//   value = startValue + (seconds since 2025-01-01 × 6750 kr/day)
//
// Source: inline <script> on altidenergi.dk (startValue 2,080,000, 6750 kr/day).
const START_VALUE = 2_080_000
const INCREMENT_PER_DAY = 6750
const INCREMENT_PER_SECOND = INCREMENT_PER_DAY / 86_400
// Explicit +01:00 offset: without it the anchor parses in the runtime's LOCAL
// timezone, so a UTC server and a Copenhagen browser disagree by ~280-560 kr.
const START_TIME = new Date('2025-01-01T00:00:00+01:00').getTime()

// Unfloored, continuously-increasing value (internal helper).
function liveSavingsExact(at: number = Date.now()): number {
  return START_VALUE + ((at - START_TIME) / 1000) * INCREMENT_PER_SECOND
}

// Whole-kr value actually shown to the user (matches altidenergi.dk).
export function liveSavings(at: number = Date.now()): number {
  return Math.floor(liveSavingsExact(at))
}
