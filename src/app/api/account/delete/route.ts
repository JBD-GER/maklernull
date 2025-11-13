export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { supabaseServer } from '@/lib/supabase-server'

const SUPABASE_URL   = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SERVICE_ROLE   = process.env.SUPABASE_SERVICE_ROLE_KEY!

const adminClient = createClient(SUPABASE_URL, SERVICE_ROLE)

export async function POST() {
  const supa = await supabaseServer()

  const {
    data: { user },
    error: authError,
  } = await supa.auth.getUser()

  if (authError || !user) {
    return NextResponse.json(
      { error: 'Nicht eingeloggt.' },
      { status: 401 }
    )
  }

  const userId = user.id

  try {
    // 1) Benutzerbezogene Daten löschen
    // 👉 hier ggf. weitere Tabellen ergänzen, die eine user_id/id auf den User haben
    const tables: { name: string; column: string }[] = [
      { name: 'billing_settings', column: 'user_id' },
      { name: 'profiles',         column: 'id' },
      { name: 'market_requests',  column: 'user_id' }, // falls vorhanden
    ]

    for (const t of tables) {
      const { error } = await adminClient
        .from(t.name)
        .delete()
        .eq(t.column, userId)

      if (error) {
        // Loggen, aber nicht hart abbrechen – je nach Härtegrad kannst du hier auch returnen
        console.error(`Fehler beim Löschen aus ${t.name}:`, error)
      }
    }

    // 2) Benutzer aus Auth löschen
    const { error: delErr } = await adminClient.auth.admin.deleteUser(userId)
    if (delErr) {
      console.error(delErr)
      return NextResponse.json(
        { error: 'Benutzer konnte nicht gelöscht werden.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Konto-Lösch-Fehler:', err)
    return NextResponse.json(
      { error: 'Interner Fehler beim Löschen des Kontos.' },
      { status: 500 }
    )
  }
}
