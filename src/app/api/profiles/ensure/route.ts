// src/app/api/profiles/ensure/route.ts
export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { supabaseServer } from '@/lib/supabase-server'

function mustEnv(name: string) {
  const v = process.env[name]
  if (!v) throw new Error(`Missing env: ${name}`)
  return v
}

export async function POST() {
  try {
    const SUPABASE_URL = mustEnv('NEXT_PUBLIC_SUPABASE_URL')
    const SERVICE_ROLE = mustEnv('SUPABASE_SERVICE_ROLE_KEY')

    // Admin-Client pro Request (ok, zuverlässig)
    const admin = createClient(SUPABASE_URL, SERVICE_ROLE, {
      auth: { persistSession: false, autoRefreshToken: false },
    })

    const supa = await supabaseServer()
    const { data: { user }, error: authErr } = await supa.auth.getUser()

    if (authErr || !user) {
      return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })
    }

    // Profil holen
    const { data: existing, error: selErr } = await admin
      .from('profiles')
      .select('id, email, role')
      .eq('id', user.id)
      .maybeSingle()

    if (selErr) {
      return NextResponse.json({ error: `Select failed: ${selErr.message}` }, { status: 500 })
    }

    if (existing) {
      return NextResponse.json({ profile: existing, role: existing.role }, { status: 200 })
    }

    // Minimal & robust: nur Felder, die garantiert existieren sollten
    const role = (user.user_metadata as any)?.role ?? 'konsument'
    const email = user.email ?? null

    const { data: inserted, error: insErr } = await admin
      .from('profiles')
      .upsert(
        { id: user.id, email, role },
        { onConflict: 'id' }
      )
      .select('id, email, role')
      .single()

    if (insErr) {
      return NextResponse.json({ error: `Upsert failed: ${insErr.message}` }, { status: 500 })
    }

    return NextResponse.json({ profile: inserted, role: inserted.role }, { status: 201 })
  } catch (e: any) {
    console.error('profiles/ensure crash:', e)
    return NextResponse.json({ error: e?.message ?? 'Unknown server error' }, { status: 500 })
  }
}
