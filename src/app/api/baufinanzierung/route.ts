// app/api/baufinanzierung/route.ts
export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

export async function GET() {
  const supabase = await supabaseServer()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })
  }

  const { data, error: dbError } = await supabase
    .from('baufinanzierung_leads')
    .select('id, email, phone, status, created_at')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: false })

  if (dbError) {
    console.error('GET /api/baufinanzierung Fehler:', dbError)
    return NextResponse.json(
      { error: 'Leads konnten nicht geladen werden.' },
      { status: 500 },
    )
  }

  return NextResponse.json({ leads: data ?? [] })
}

export async function POST(req: Request) {
  const supabase = await supabaseServer()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })
  }

  const body = await req.json().catch(() => null)

  const email = body?.email?.toString().trim()
  const phone = body?.phone?.toString().trim()
  const consent = !!body?.consent

  if (!email || !phone) {
    return NextResponse.json(
      { error: 'Bitte E-Mail und Telefonnummer angeben.' },
      { status: 400 },
    )
  }

  if (!consent) {
    return NextResponse.json(
      {
        error:
          'Bitte bestätigen Sie, dass die Einwilligung zur Kontaktaufnahme vorliegt.',
      },
      { status: 400 },
    )
  }

  const { data, error: dbError } = await supabase
    .from('baufinanzierung_leads')
    .insert({
      owner_id: user.id,
      email,
      phone,
      consent: true,
      // status default = 'eingereicht'
    })
    .select('id, email, phone, status, created_at')
    .single()

  if (dbError) {
    console.error('POST /api/baufinanzierung Fehler:', dbError)
    return NextResponse.json(
      { error: 'Lead konnte nicht gespeichert werden.' },
      { status: 500 },
    )
  }

  return NextResponse.json({ lead: data }, { status: 201 })
}
