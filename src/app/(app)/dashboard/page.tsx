// app/(app)/dashboard/page.tsx
import { redirect } from 'next/navigation'
import { supabaseServer } from '@/lib/supabase-server'
import DashboardClient from './DashboardClient'

type Listing = {
  id: string
  title: string | null
  status: string | null
  created_at: string
  updated_at: string | null
  marketed_at?: string | null
}

type Message = {
  id: string
  created_at: string
  is_read: boolean | null
  listing_title?: string | null
  sender_name?: string | null
}

/* Kleine Helper */
function safeStatus(
  raw: string | null,
): 'entwurf' | 'aktiv' | 'deaktiviert' | 'vermarktet' | 'unbekannt' {
  const v = (raw ?? '').toLowerCase()
  if (v === 'entwurf') return 'entwurf'
  if (v === 'aktiv') return 'aktiv'
  if (v === 'deaktiviert') return 'deaktiviert'
  if (v === 'vermarktet') return 'vermarktet'
  return 'unbekannt'
}

/**
 * Normalisiert einen Namen:
 * - nimmt nur den Teil vor einem evtl. "@"
 * - ersetzt ".", "_" und "-" durch Leerzeichen
 * - macht aus "christoph.pfad" -> "Christoph Pfad"
 */
function normalizeName(raw: string | null | undefined): string {
  if (!raw) return ''
  let s = raw.trim()
  if (!s) return ''

  // Falls doch eine Mail durchrutscht
  s = s.split('@')[0]

  // Punkte/Unterstriche/Minus in Spaces wandeln
  s = s.replace(/[._]+/g, ' ').replace(/-+/g, ' ')

  const parts = s.split(/\s+/).filter(Boolean)
  if (!parts.length) return ''

  const cased = parts.map((p) => {
    const lower = p.toLowerCase()
    return lower.charAt(0).toUpperCase() + lower.slice(1)
  })

  return cased.join(' ')
}

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = await supabaseServer()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }

  // Profil laden
  const { data: profile } = await supabase
    .from('profiles')
    .select('company_name, full_name, first_name, last_name')
    .eq('id', user.id)
    .maybeSingle()

  const p = profile as any

  // 1) Firma bevorzugen – erst aus profiles, dann aus user_metadata
  const profileCompany =
    typeof p?.company_name === 'string' ? p.company_name.trim() : ''
  const metaCompany =
    typeof user.user_metadata?.company_name === 'string'
      ? user.user_metadata.company_name.trim()
      : ''
  const company = profileCompany || metaCompany

  let ownerName = ''

  if (company) {
    // Firma niemals verändern (kein normalizeName)
    ownerName = company
  } else {
    // 2) Vor- & Nachname
    const firstName =
      typeof p?.first_name === 'string' ? p.first_name.trim() : ''
    const lastName =
      typeof p?.last_name === 'string' ? p.last_name.trim() : ''
    const combined = [firstName, lastName].filter(Boolean).join(' ').trim()

    if (combined) {
      ownerName = normalizeName(combined)
    } else if (typeof p?.full_name === 'string' && p.full_name.trim()) {
      // 3) full_name aus profiles
      ownerName = normalizeName(p.full_name)
    } else if (
      typeof user.user_metadata?.full_name === 'string' &&
      user.user_metadata.full_name.trim()
    ) {
      // 4) full_name aus user_metadata
      ownerName = normalizeName(user.user_metadata.full_name)
    } else if (
      typeof user.user_metadata?.name === 'string' &&
      user.user_metadata.name.trim()
    ) {
      // 5) name aus user_metadata
      ownerName = normalizeName(user.user_metadata.name)
    } else if (user.email) {
      // 6) Fallback: Mail vor @, z.B. "christoph.pfad" -> "Christoph Pfad"
      ownerName = normalizeName(user.email)
    } else {
      ownerName = 'Willkommen'
    }
  }

  const ownerId = user.id

  // --- INSERATE ---
  const listingsRes = await supabase
    .from('listings')
    .select('id, title, status, created_at, updated_at, marketed_at')
    .eq('owner_id', ownerId)
    .order('created_at', { ascending: false })

  const listings = (listingsRes.data ?? []) as Listing[]

  const totalListings = listings.length
  const draft = listings.filter((l) => safeStatus(l.status) === 'entwurf').length
  const active = listings.filter((l) => safeStatus(l.status) === 'aktiv').length
  const inactive = listings.filter(
    (l) => safeStatus(l.status) === 'deaktiviert',
  ).length
  const marketed = listings.filter(
    (l) => safeStatus(l.status) === 'vermarktet',
  ).length

  const marketingRate =
    totalListings > 0 ? Math.round((marketed / totalListings) * 100) : 0

  // --- NACHRICHTEN ---
  const messagesRes = await supabase
    .from('messages')
    .select('id, created_at, is_read, listing_title, sender_name')
    .eq('owner_id', ownerId)
    .order('created_at', { ascending: false })
    .limit(10)

  const messages = (messagesRes.data ?? []) as Message[]
  const unreadMessages = messages.filter((m) => !m.is_read).length

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <DashboardClient
        ownerName={ownerName}
        metrics={{
          totalListings,
          draft,
          active,
          inactive,
          marketed,
          marketingRate,
          unreadMessages,
        }}
        listings={listings}
        messages={messages}
        contact={{
          email: 'hey@makelrnull.de',
          phone: '050353169999',
        }}
      />
    </div>
  )
}
