// src/app/api/users/route.ts
export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { supabaseServer } from '@/lib/supabase-server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY!
const ANON_KEY     = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// 🔹 SITE_URL immer auf https://www.maklernull.de normalisieren
const RAW_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.maklernull.de'
const SITE_URL = (() => {
  try {
    const url = new URL(RAW_SITE_URL)

    // falls jemand "https://maklernull.de" (ohne www) gesetzt hat → auf www drehen
    if (url.hostname === 'maklernull.de') {
      url.hostname = 'www.maklernull.de'
    }

    return url.origin
  } catch {
    return 'https://www.maklernull.de'
  }
})()

const adminClient = createClient(SUPABASE_URL, SERVICE_ROLE)
const authClient  = createClient(SUPABASE_URL, ANON_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

/* ----------------- Helpers ----------------- */

function norm(v?: unknown) {
  if (v === undefined || v === null) return null
  if (typeof v !== 'string') return v as any
  const t = v.trim()
  return t.length ? t : null
}

/* ----------------- GET: aktuelles Profil ----------------- */

export async function GET() {
  const supabase = await supabaseServer()
  const { data: { user }, error: authErr } = await supabase.auth.getUser()

  if (authErr || !user) {
    return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })
  }

  // Alles aus profiles holen (kein festes Spalten-Select)
  const { data: profile, error: profErr } = await adminClient
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()

  if (profErr) {
    return NextResponse.json({ error: profErr.message }, { status: 500 })
  }

  // "Fallback"-Profil falls es noch keins gibt
  const mergedProfile: any = profile ?? {
    id: user.id,
    email: user.email,
    role: 'eigentümer',
    first_name: user.user_metadata?.first_name ?? null,
    last_name: user.user_metadata?.last_name ?? null,
    company_name: user.user_metadata?.company_name ?? null,
  }

  // Logo-Signed-URL (falls logo_path existiert)
  let logo_url: string | null = null
  if (mergedProfile.logo_path) {
    const { data: urlData } = await adminClient
      .storage
      .from('logo')
      .createSignedUrl(mergedProfile.logo_path, 3600)
    logo_url = urlData?.signedUrl ?? null
  }

  return NextResponse.json({ profile: mergedProfile, logo_url })
}

/* ----------------- POST: Registrierung ----------------- */

export async function POST(req: Request) {
  const body = await req.json()

  const email        = norm(body.email)
  const password     = norm(body.password)
  const first_name   = norm(body.first_name)
  const last_name    = norm(body.last_name)
  const company_name = norm(body.company_name)

  const street       = norm(body.street)
  const house_number = norm(body.house_number)
  const postal_code  = norm(body.postal_code)
  const city         = norm(body.city)
  const country      = norm(body.country)

  const accept_terms   = Boolean(body.accept_terms)
  const accept_privacy = Boolean(body.accept_privacy)
  const terms_version   = norm(body.terms_version)   || '1'
  const privacy_version = norm(body.privacy_version) || '1'

  if (!email || !password) {
    return NextResponse.json({ error: 'E-Mail & Passwort sind erforderlich.' }, { status: 400 })
  }
  if (!first_name || !last_name) {
    return NextResponse.json({ error: 'Vorname & Nachname sind erforderlich.' }, { status: 400 })
  }
  if (!street || !house_number || !postal_code || !city || !country) {
    return NextResponse.json({ error: 'Adresse unvollständig (Straße, Nr., PLZ, Ort, Land).'}, { status: 400 })
  }
  if (!accept_terms || !accept_privacy) {
    return NextResponse.json({ error: 'Bitte AGB und Datenschutz akzeptieren.' }, { status: 400 })
  }

  const { data: sign, error: signErr } = await authClient.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${SITE_URL}/login`,
      data: {
        first_name,
        last_name,
        company_name,
        street,
        house_number,
        postal_code,
        city,
        country,
        role: 'eigentümer',
        terms_accepted: true,
        privacy_accepted: true,
        terms_version,
        privacy_version,
      },
    },
  })

  if (signErr) {
    return NextResponse.json({ error: signErr.message }, { status: 400 })
  }

  const userId = sign.user?.id
  if (!userId) {
    return NextResponse.json({ error: 'Registrierung unvollständig. Bitte erneut versuchen.' }, { status: 500 })
  }

  // Profil komplett anlegen/aktualisieren
  const { error: upErr } = await adminClient
    .from('profiles')
    .upsert(
      {
        id: userId,
        email,
        role: 'eigentümer',
        first_name,
        last_name,
        company_name,
        street,
        house_number,
        postal_code,
        city,
        country,
        terms_accepted: true,
        privacy_accepted: true,
        terms_version,
        privacy_version,
      },
      { onConflict: 'id' }
    )

  if (upErr) {
    return NextResponse.json({ error: upErr.message }, { status: 500 })
  }

  return NextResponse.json(
    { role: 'eigentümer', next: `${SITE_URL}/login?check-email=1` },
    { status: 201 }
  )
}

/* ----------------- PATCH: eigenes Profil teilweise aktualisieren ----------------- */

export async function PATCH(req: Request) {
  const supabase = await supabaseServer()
  const { data: { user }, error: authErr } = await supabase.auth.getUser()

  if (authErr || !user) {
    return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })
  }

  let body: any = {}
  try { body = await req.json() } catch { body = {} }

  const updates: Record<string, any> = {}

  if ('first_name' in body)   updates.first_name   = norm(body.first_name)
  if ('last_name' in body)    updates.last_name    = norm(body.last_name)
  if ('company_name' in body) updates.company_name = norm(body.company_name)
  if ('street' in body)       updates.street       = norm(body.street)
  if ('house_number' in body) updates.house_number = norm(body.house_number)
  if ('postal_code' in body)  updates.postal_code  = norm(body.postal_code)
  if ('city' in body)         updates.city         = norm(body.city)
  if ('country' in body)      updates.country      = norm(body.country)
  if ('website' in body)      updates.website      = norm(body.website)

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'Keine gültigen Felder im PATCH gefunden.' }, { status: 400 })
  }

  const { data, error } = await adminClient
    .from('profiles')
    .upsert(
      { id: user.id, ...updates },
      { onConflict: 'id' }
    )
    .select('*')
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, profile: data }, { status: 200 })
}

/* ----------------- DELETE: Account + Profil löschen ----------------- */

export async function DELETE() {
  const supabase = await supabaseServer()
  const { data: { user }, error: authErr } = await supabase.auth.getUser()

  if (authErr || !user) {
    return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })
  }

  // Profil löschen
  const { error: profErr } = await adminClient
    .from('profiles')
    .delete()
    .eq('id', user.id)

  if (profErr) {
    return NextResponse.json({ error: profErr.message }, { status: 500 })
  }

  // Auth-User löschen
  const { error: authDelErr } = await adminClient.auth.admin.deleteUser(user.id)
  if (authDelErr) {
    return NextResponse.json({ error: authDelErr.message }, { status: 500 })
  }

  return new NextResponse(null, { status: 204 })
}
