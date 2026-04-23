import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.json()

  // TODO: insert into Supabase waitlist table
  // const supabase = createClient()
  // await supabase.from('waitlist').insert({ ...body })

  console.log('Waitlist signup:', body)

  return NextResponse.json({ success: true })
}
