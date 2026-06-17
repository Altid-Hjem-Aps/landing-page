import { NextRequest, NextResponse } from 'next/server'
import { getNetselskaber, getSupplierPrices } from '@/lib/elpriser'

/**
 * Time-priser for ét valgt netselskab — bruges af grafens netselskabs-vælger.
 * Proxy mod Strømligning, så browseren aldrig kalder dem direkte, og svaret
 * caches pr. netselskab (½ time) via fetch'en i lib/elpriser.
 */
export async function GET(req: NextRequest) {
  const supplier = req.nextUrl.searchParams.get('supplier') ?? ''
  const kendte = await getNetselskaber()
  // Tom liste = upstream nede, IKKE ukendt netselskab — ellers ville en
  // Strømligning-pause forklæde gyldige opslag som klientfejl (400).
  if (!kendte.length) {
    return NextResponse.json({ error: 'Netselskabslisten er utilgængelig' }, { status: 503 })
  }
  if (!kendte.some((n) => n.id === supplier)) {
    return NextResponse.json({ error: 'Ukendt netselskab' }, { status: 400 })
  }
  const data = await getSupplierPrices(supplier)
  if (!data) {
    return NextResponse.json({ error: 'Kunne ikke hente priser' }, { status: 502 })
  }
  // Svaret er en ren funktion af supplier-parametret og gyldigt i ½ time —
  // lad CDN'en svare i stedet for en funktions-invokering pr. klik.
  return NextResponse.json(data, {
    headers: { 'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=300' },
  })
}
