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

// Status-Helper
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

// "christoph pfad" -> "Christoph Pfad"
function formatName(raw: string | null | undefined): string {
  if (!raw) return ''
  const parts = raw
    .trim()
    .split(/\s+/)
    .filter(Boolean)

  if (!parts.length) return ''

  return parts
    .map((p) => {
      const lower = p.toLowerCase()
      return lower.charAt(0).toUpperCase() + lower.slice(1)
    })
    .join(' ')
}

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

export default async function DashboardPage() {
  const supabase = await supabaseServer()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }

  // immer direkt aus der profiles-Tabelle lesen
  const { data: profile } = await supabase
    .from('profiles')
    .select('company_name, first_name, last_name')
    .eq('id', user.id)
    .maybeSingle()

  let ownerName = ''

  const companyName = (profile?.company_name ?? '').trim()
  const firstName = (profile?.first_name ?? '').trim()
  const lastName = (profile?.last_name ?? '').trim()

  if (companyName) {
    // 1) Wenn Firma vorhanden → immer Firma, unverändert
    ownerName = companyName
  } else {
    // 2) Sonst Vor- und Nachname
    const full = [firstName, lastName].filter(Boolean).join(' ')
    if (full) {
      ownerName = formatName(full)
    } else if (user.email) {
      // 3) Fallback: E-Mail vor @ hübsch machen
      const emailName = user.email.split('@')[0].replace(/[._-]+/g, ' ')
      ownerName = formatName(emailName) || 'Willkommen'
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
  const inactive = listings.filter((l) => safeStatus(l.status) === 'deaktiviert').length
  const marketed = listings.filter((l) => safeStatus(l.status) === 'vermarktet').length

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
