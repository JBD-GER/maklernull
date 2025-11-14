// src/app/api/appointments/[id]/route.ts
export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { supabaseServer } from '@/lib/supabase-server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY!

const adminClient = createClient(SUPABASE_URL, SERVICE_ROLE)

type RouteParams = {
  params: { id: string }
}

export async function PATCH(req: Request, { params }: RouteParams) {
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

    const updatePayload: any = {
      listing_id: body.listingId,
      type: body.type,
      status: body.status,
      title: body.title ?? null,
      notes: body.notes ?? null,
      start_at: body.start,
      end_at: body.end,
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await adminClient
      .from('appointments')
      .update(updatePayload)
      .eq('id', params.id)
      .eq('user_id', user.id)
      .select(
        'id, user_id, listing_id, type, status, title, notes, start_at, end_at'
      )
      .single()

    if (error) {
      console.error('Error updating appointment', error)
      return NextResponse.json(
        { error: 'Fehler beim Aktualisieren des Termins' },
        { status: 500 }
      )
    }

    return NextResponse.json({ appointment: data })
  } catch (e) {
    console.error(e)
    return NextResponse.json(
      { error: 'Unerwarteter Fehler beim Aktualisieren des Termins' },
      { status: 500 }
    )
  }
}

export async function DELETE(_req: Request, { params }: RouteParams) {
  try {
    const supabase = await supabaseServer()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { error } = await adminClient
      .from('appointments')
      .delete()
      .eq('id', params.id)
      .eq('user_id', user.id)

    if (error) {
      console.error('Error deleting appointment', error)
      return NextResponse.json(
        { error: 'Fehler beim Löschen des Termins' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true }, { status: 204 })
  } catch (e) {
    console.error(e)
    return NextResponse.json(
      { error: 'Unerwarteter Fehler beim Löschen des Termins' },
      { status: 500 }
    )
  }
}
