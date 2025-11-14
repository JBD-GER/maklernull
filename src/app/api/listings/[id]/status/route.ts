// src/app/api/listings/[id]/status/route.ts
import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

const ALLOWED_STATUS = [
  'draft',
  'pending_payment',
  'pending_sync',
  'active',
  'deactivated',
  'marketed',
  'archived',
  'deleted',
] as const

type ListingStatus = (typeof ALLOWED_STATUS)[number]

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  const supabase = await supabaseServer()
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })
  }

  const { status } = await req.json()

  if (!ALLOWED_STATUS.includes(status)) {
    return NextResponse.json(
      { error: 'Ungültiger Status' },
      { status: 400 },
    )
  }

  const { error } = await supabase
    .from('listings')
    .update({ status })
    .eq('id', params.id)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error updating listing status', error)
    return NextResponse.json(
      { error: 'Fehler beim Aktualisieren des Status' },
      { status: 500 },
    )
  }

  return NextResponse.json({ success: true }, { status: 200 })
}
