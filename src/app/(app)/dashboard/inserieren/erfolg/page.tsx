// src/app/dashboard/inserieren/erfolg/page.tsx
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { supabaseServer } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

type Props = {
  searchParams: { listing?: string }
}

export default async function InseratErfolgPage({ searchParams }: Props) {
  const supabase = await supabaseServer()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const listingId = searchParams?.listing
  let listing: any = null

  if (listingId) {
    const { data } = await supabase
      .from('listings')
      .select(
        'id, title, transaction_type, usage_type, status, city, street, house_number, postal_code'
      )
      .eq('id', listingId)
      .eq('user_id', user.id)
      .single()

    listing = data
  }

  const isPaidStatus =
    listing?.status === 'pending_sync' || listing?.status === 'active'

  return (
    <section className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
      <div className="mb-6">
        <Link
          href="/dashboard/inserieren"
          className="inline-flex items-center text-sm text-slate-500 hover:text-slate-700"
        >
          <span className="mr-1 text-lg">←</span>
          Zurück zur Inseratsübersicht
        </Link>
      </div>

      <div className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-8">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white">
              ✓
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
                Zahlung erfolgreich abgeschlossen.
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                Vielen Dank! Wir haben Ihre Buchung erhalten. Das Inserat wird
                nun für die Veröffentlichung vorbereitet.
              </p>
            </div>
          </div>

          <div className="text-xs rounded-full bg-emerald-50 px-3 py-1 font-medium text-emerald-700 ring-1 ring-emerald-100">
            Status:{' '}
            {isPaidStatus ? 'Bezahlung bestätigt' : 'Verarbeitung läuft'}
          </div>
        </div>

        {listing && (
          <div className="mt-6 rounded-2xl border border-white/80 bg-white/90 p-4 text-sm text-slate-800">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Zusammenfassung Ihres Inserats
            </div>
            <div className="mt-2 space-y-1">
              <div className="font-medium text-slate-900">
                {listing.title || 'Ohne Titel'}
              </div>
              <div className="text-xs text-slate-600">
                {listing.transaction_type === 'sale' ? 'Verkauf' : 'Vermietung'} ·{' '}
                {listing.usage_type === 'commercial'
                  ? 'Gewerblich'
                  : 'Wohnen'}
              </div>
              {(listing.street || listing.city) && (
                <div className="mt-2 text-xs text-slate-600">
                  {[listing.street, listing.house_number].filter(Boolean).join(' ')}
                  {listing.postal_code || listing.city ? ', ' : ''}
                  {[listing.postal_code, listing.city].filter(Boolean).join(' ')}
                </div>
              )}
              <div className="mt-3 text-xs text-slate-500">
                Aktueller Status in Maklernull:{' '}
                <span className="font-medium text-slate-800">
                  {listing.status || 'unbekannt'}
                </span>
                . Sobald die Inserate an die Portale übermittelt wurden,
                aktualisieren wir den Status automatisch.
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-full border border-slate-900 bg-slate-900 px-5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
          >
            Zum Dashboard
          </Link>
          <Link
            href="/dashboard/inserieren"
            className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white/80 px-5 py-2 text-sm font-medium text-slate-800 shadow-sm hover:border-slate-300 hover:bg-white"
          >
            Weitere Immobilie anlegen
          </Link>
        </div>
      </div>
    </section>
  )
}
