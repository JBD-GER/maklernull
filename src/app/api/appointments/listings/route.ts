// src/app/api/appointments/listings/route.ts
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
      .from('listings')
      .select(
        'id, status, title, street, house_number, postal_code, city'
      )
      .eq('user_id', user.id)
      .eq('status', 'active')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching listings', error)
      return NextResponse.json(
        { error: 'Fehler beim Laden der Immobilien' },
        { status: 500 }
      )
    }

    const listings = (data ?? []).map((row) => {
      const addressParts = [
        row.street,
        row.house_number,
        row.postal_code,
        row.city,
      ].filter(Boolean)

      return {
        id: row.id as string,
        status: row.status as string,
        name: row.title as string,
        address: addressParts.join(' ') || 'Adresse wird nachgereicht',
      }
    })

    return NextResponse.json({ listings })
  } catch (e) {
    console.error(e)
    return NextResponse.json(
      { error: 'Unerwarteter Fehler beim Laden der Immobilien' },
      { status: 500 }
    )
  }
}
