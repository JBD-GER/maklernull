// src/app/api/appointments/route.ts
export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { supabaseServer } from '@/lib/supabase-server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY!

const adminClient = createClient(SUPABASE_URL, SERVICE_ROLE)

export async function GET() {
  try {
    const supabase = await supabaseServer()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await adminClient
      .from('appointments')
      .select(
        'id, user_id, listing_id, type, status, title, notes, start_at, end_at'
      )
      .eq('user_id', user.id)
      .order('start_at', { ascending: true })

    if (error) {
      console.error('Error fetching appointments', error)
      return NextResponse.json(
        { error: 'Fehler beim Laden der Termine' },
        { status: 500 }
      )
    }

    return NextResponse.json({ appointments: data ?? [] })
  } catch (e) {
    console.error(e)
    return NextResponse.json(
      { error: 'Unerwarteter Fehler beim Laden der Termine' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const supabase = await supabaseServer()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()

    const payload = {
      user_id: user.id,
      listing_id: body.listingId,
      type: body.type,
      status: body.status ?? 'geplant',
      title: body.title ?? null,
      notes: body.notes ?? null,
      start_at: body.start,
      end_at: body.end,
    }

    const { data, error } = await adminClient
      .from('appointments')
      .insert(payload)
      .select(
        'id, user_id, listing_id, type, status, title, notes, start_at, end_at'
      )
      .single()

    if (error) {
      console.error('Error creating appointment', error)
      return NextResponse.json(
        { error: 'Fehler beim Anlegen des Termins' },
        { status: 500 }
      )
    }

    return NextResponse.json({ appointment: data }, { status: 201 })
  } catch (e) {
    console.error(e)
    return NextResponse.json(
      { error: 'Unerwarteter Fehler beim Anlegen des Termins' },
      { status: 500 }
    )
  }
}
