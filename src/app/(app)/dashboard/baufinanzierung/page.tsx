// app/(app)/baufinanzierung/page.tsx
import { redirect } from 'next/navigation'
import { supabaseServer } from '@/lib/supabase-server'
import BaufinanzierungClient from './BaufinanzierungClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

type Lead = {
  id: string
  email: string
  phone: string
  status: string
  created_at: string
}

export default async function BaufinanzierungPage() {
  const supabase = await supabaseServer()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }

  const { data: leadsData, error: leadsError } = await supabase
    .from('baufinanzierung_leads')
    .select('id, email, phone, status, created_at')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: false })

  if (leadsError) {
    console.error('Leads laden fehlgeschlagen:', leadsError)
  }

  const leads = (leadsData ?? []) as Lead[]

  const totalLeads = leads.length
  const abgerechnetCount = leads.filter((l) => l.status === 'abgerechnet').length
  const totalRevenue = abgerechnetCount * 100 // 100€ pro abgerechnetem Lead
  const conversion =
    totalLeads > 0 ? Math.round((abgerechnetCount / totalLeads) * 100) : 0

  return (
    <BaufinanzierungClient
      initialLeads={leads}
      metrics={{
        totalLeads,
        abgerechnetCount,
        totalRevenue,
        conversion,
      }}
    />
  )
}
