// app/(app)/dashboard/inserate/page.tsx
'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  HomeModernIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  TrashIcon,
  ArrowPathIcon,
  ArrowTopRightOnSquareIcon,
} from '@heroicons/react/24/outline'

type ListingStatus = 'entwurf' | 'aktiv' | 'deaktiviert' | 'vermarktet' | 'unbekannt'

type Listing = {
  id: string
  title: string | null
  status: string | null
  created_at: string
  updated_at: string | null
  city?: string | null
  postal_code?: string | null
  transactionType?: 'sale' | 'rent' | null
  price?: number | string | null
  currency?: string | null
  livingArea?: number | string | null
  rooms?: number | string | null
}

function niceStatus(raw: string | null): { label: string; color: string; dot: string } {
  const v = (raw ?? '').toLowerCase() as ListingStatus

  switch (v) {
    case 'entwurf':
      return {
        label: 'Entwurf',
        color: 'bg-slate-50 text-slate-800 border-slate-200 ring-slate-200/60',
        dot: 'bg-slate-400',
      }
    case 'aktiv':
      return {
        label: 'Aktiv',
        color: 'bg-emerald-50 text-emerald-800 border-emerald-200 ring-emerald-200/70',
        dot: 'bg-emerald-500',
      }
    case 'deaktiviert':
      return {
        label: 'Deaktiviert',
        color: 'bg-slate-50 text-slate-700 border-slate-200 ring-slate-200/60',
        dot: 'bg-slate-500',
      }
    case 'vermarktet':
      return {
        label: 'Vermarktet',
        color: 'bg-slate-900 text-slate-50 border-slate-900 ring-slate-900/60',
        dot: 'bg-slate-200',
      }
    default:
      return {
        label: 'Unbekannt',
        color: 'bg-slate-50 text-slate-700 border-slate-200 ring-slate-200/60',
        dot: 'bg-slate-400',
      }
  }
}

function formatDate(dateStr?: string | null) {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return '—'
  return new Intl.DateTimeFormat('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  }).format(d)
}

function formatPrice(price?: number | string | null, currency?: string | null) {
  if (price === null || price === undefined || price === '') return '–'
  const num = typeof price === 'string' ? Number(price.replace(',', '.')) : price
  if (!Number.isFinite(num)) return '–'
  try {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: currency || 'EUR',
    }).format(num)
  } catch {
    return `${num.toLocaleString('de-DE')} ${currency || 'EUR'}`
  }
}

type StatusFilter = 'alle' | 'entwurf' | 'aktiv' | 'deaktiviert' | 'vermarktet'

export default function InseratePage() {
  const router = useRouter()
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('alle')
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const loadListings = async () => {
    setError(null)
    setRefreshing(true)
    try {
      const res = await fetch('/api/listings', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Fehler beim Laden der Inserate')
      }
      const data = await res.json()
      setListings(data.listings || [])
    } catch (e: any) {
      setError(e.message || 'Unbekannter Fehler beim Laden')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadListings()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const draftCount = useMemo(
    () => listings.filter((l) => (l.status ?? '').toLowerCase() === 'entwurf').length,
    [listings]
  )
  const activeCount = useMemo(
    () => listings.filter((l) => (l.status ?? '').toLowerCase() === 'aktiv').length,
    [listings]
  )
  const inactiveCount = useMemo(
    () => listings.filter((l) => (l.status ?? '').toLowerCase() === 'deaktiviert').length,
    [listings]
  )
  const marketedCount = useMemo(
    () => listings.filter((l) => (l.status ?? '').toLowerCase() === 'vermarktet').length,
    [listings]
  )

  const filteredListings = useMemo(() => {
    const term = search.trim().toLowerCase()
    return listings
      .filter((l) => {
        const status = (l.status ?? '').toLowerCase() as ListingStatus
        if (statusFilter !== 'alle' && status !== statusFilter) return false
        if (!term) return true
        const haystack = [
          l.title ?? '',
          l.city ?? '',
          l.postal_code ?? '',
          l.id ?? '',
        ]
          .join(' ')
          .toLowerCase()
        return haystack.includes(term)
      })
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
  }, [listings, search, statusFilter])

  const handleDelete = async (listing: Listing) => {
    const ok = window.confirm(
      'Dieses Inserat wirklich dauerhaft löschen? Dies kann nicht rückgängig gemacht werden.'
    )
    if (!ok) return

    setActionLoadingId(listing.id)
    setError(null)
    try {
      const res = await fetch(`/api/listings/${listing.id}`, {
        method: 'DELETE',
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Fehler beim Löschen')
      }
      setListings((prev) => prev.filter((l) => l.id !== listing.id))
    } catch (e: any) {
      setError(e.message || 'Unbekannter Fehler beim Löschen')
    } finally {
      setActionLoadingId(null)
    }
  }

  const handleContinueDraft = (listing: Listing) => {
    // 👉 ggf. anpassen, wenn dein Edit-Flow anders ist
    router.push(`/dashboard/inserieren/${listing.id}`)
  }

  const handleOpen = (listing: Listing) => {
    router.push(`/dashboard/inserate/${listing.id}`)
  }

  const total = listings.length

  return (
    <div className="relative min-h-[calc(100vh-6rem)] text-slate-900">
      {/* zarter Hintergrund-Glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.06),_transparent_60%)]" />
      </div>

      <div className="relative space-y-6">
        {/* HEADER / HERO */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.08)]"
        >
          <div className="relative flex flex-col gap-5 p-6 sm:p-7 lg:p-8">
            <div className="pointer-events-none absolute inset-x-10 -top-10 h-16 bg-gradient-to-b from-slate-100 to-transparent" />

            <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700">
                  <HomeModernIcon className="h-3.5 w-3.5" />
                  <span>Meine Inserate</span>
                </div>
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                    Alle Immobilien an einem Ort.
                  </h1>
                  <p className="mt-1 max-w-xl text-sm text-slate-600 sm:text-[15px]">
                    Suche, filtere und verwalte deine Inserate – vom ersten Entwurf
                    bis zur vermarkteten Immobilie.
                  </p>
                </div>
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-3">
                <Link
                  href="/dashboard/inserieren"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-900 bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-[0_18px_40px_rgba(15,23,42,0.45)] transition hover:bg-slate-800 hover:border-slate-800"
                >
                  Neue Immobilie inserieren
                </Link>
                <button
                  type="button"
                  onClick={loadListings}
                  disabled={refreshing}
                  className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-800 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <ArrowPathIcon
                    className={`h-3.5 w-3.5 ${
                      refreshing ? 'animate-spin' : ''
                    }`}
                  />
                  Aktualisieren
                </button>
              </div>
            </div>

            {/* KPIs & Filter */}
            <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              {/* kleine KPI-Pills */}
              <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
                <KpiChip label="Alle" value={total} />
                <KpiChip label="Entwürfe" value={draftCount} tone="slate" />
                <KpiChip label="Aktiv" value={activeCount} tone="emerald" />
                <KpiChip
                  label="Vermarktet"
                  value={marketedCount}
                  tone="dark"
                />
              </div>

              {/* Suche + Statusfilter */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                {/* Suche */}
                <div className="relative w-full sm:w-64">
                  <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Nach Titel, Ort, PLZ suchen..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-full border border-slate-200 bg-white px-8 py-2 text-xs text-slate-800 shadow-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                  />
                </div>

                {/* Status-Filter */}
                <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                  <div className="inline-flex items-center gap-1 text-slate-500">
                    <FunnelIcon className="h-3.5 w-3.5" />
                    Status:
                  </div>
                  <StatusFilterChip
                    label="Alle"
                    active={statusFilter === 'alle'}
                    onClick={() => setStatusFilter('alle')}
                  />
                  <StatusFilterChip
                    label="Entwurf"
                    active={statusFilter === 'entwurf'}
                    onClick={() => setStatusFilter('entwurf')}
                  />
                  <StatusFilterChip
                    label="Aktiv"
                    active={statusFilter === 'aktiv'}
                    onClick={() => setStatusFilter('aktiv')}
                  />
                  <StatusFilterChip
                    label="Deaktiviert"
                    active={statusFilter === 'deaktiviert'}
                    onClick={() => setStatusFilter('deaktiviert')}
                  />
                  <StatusFilterChip
                    label="Vermarktet"
                    active={statusFilter === 'vermarktet'}
                    onClick={() => setStatusFilter('vermarktet')}
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* LISTE DER INSERATE */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut', delay: 0.05 }}
          className="space-y-3"
        >
          <div className="flex items-center justify-between px-1 text-xs text-slate-500">
            <span>
              {loading
                ? 'Lade Inserate ...'
                : `${filteredListings.length} von ${total} Inseraten angezeigt`}
            </span>
          </div>

          <div className="space-y-3">
            {error && (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-700">
                {error}
              </div>
            )}

            {loading ? (
              <div className="rounded-3xl border border-slate-200/80 bg-white px-4 py-6 text-sm text-slate-600 shadow-sm sm:px-6">
                Bitte einen Moment gedulden – deine Inserate werden geladen.
              </div>
            ) : filteredListings.length === 0 ? (
              <div className="rounded-3xl border border-slate-200/80 bg-white px-4 py-6 text-sm text-slate-600 shadow-sm sm:px-6">
                Keine Inserate gefunden. Passe den Filter an oder lege deine erste
                Immobilie an.
              </div>
            ) : (
              <ul className="space-y-3">
                {filteredListings.map((listing) => {
                  const statusInfo = niceStatus(listing.status)
                  const status = (listing.status ?? '').toLowerCase() as ListingStatus
                  const isDraft = status === 'entwurf'

                  return (
                    <li key={listing.id}>
                      <div className="flex flex-col gap-3 rounded-3xl border border-slate-200/80 bg-white/95 p-4 text-sm shadow-sm backdrop-blur-xl transition hover:-translate-y-[1px] hover:shadow-[0_16px_40px_rgba(15,23,42,0.08)] sm:p-5 sm:flex-row sm:items-center sm:justify-between">
                        {/* Linke Seite: Info */}
                        <div className="flex flex-1 flex-col gap-1.5 sm:gap-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="max-w-full truncate text-sm font-semibold text-slate-900 sm:text-[15px]">
                              {listing.title || 'Unbenannte Immobilie'}
                            </p>
                            <span
                              className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium ring-1 ${statusInfo.color}`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${statusInfo.dot}`}
                              />
                              {statusInfo.label}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500">
                            <span>
                              Angelegt am {formatDate(listing.created_at)}
                            </span>
                            {listing.updated_at && (
                              <span>· Aktualisiert {formatDate(listing.updated_at)}</span>
                            )}
                            {(listing.city || listing.postal_code) && (
                              <span>
                                · {listing.postal_code} {listing.city}
                              </span>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-600">
                            {listing.transactionType && (
                              <span className="rounded-full bg-slate-50 px-2 py-0.5">
                                {listing.transactionType === 'sale'
                                  ? 'Verkauf'
                                  : 'Vermietung'}
                              </span>
                            )}
                            {listing.livingArea && (
                              <span className="rounded-full bg-slate-50 px-2 py-0.5">
                                {listing.livingArea} m² Wohnfläche
                              </span>
                            )}
                            {listing.rooms && (
                              <span className="rounded-full bg-slate-50 px-2 py-0.5">
                                {listing.rooms} Zimmer
                              </span>
                            )}
                            {listing.price && (
                              <span className="rounded-full bg-slate-900 px-2 py-0.5 text-[10px] font-medium text-slate-50">
                                {formatPrice(listing.price, listing.currency)}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Rechte Seite: Actions */}
                        <div className="flex flex-shrink-0 flex-wrap items-center justify-end gap-2">
                          {isDraft ? (
                            <>
                              <button
                                type="button"
                                onClick={() => handleContinueDraft(listing)}
                                className="inline-flex items-center gap-1 rounded-full border border-slate-900 bg-slate-900 px-3 py-1.5 text-[11px] font-medium text-slate-50 shadow-sm transition hover:bg-slate-800 hover:border-slate-800"
                              >
                                Fortsetzen
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDelete(listing)}
                                disabled={actionLoadingId === listing.id}
                                className="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-3 py-1.5 text-[11px] font-medium text-rose-700 shadow-sm transition hover:border-rose-300 hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                <TrashIcon className="h-3.5 w-3.5" />
                                {actionLoadingId === listing.id
                                  ? 'Lösche...'
                                  : 'Löschen'}
                              </button>
                            </>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleOpen(listing)}
                              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-medium text-slate-900 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
                            >
                              Aufrufen
                              <ArrowTopRightOnSquareIcon className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </motion.section>
      </div>
    </div>
  )
}

/* --- kleine Sub-Komponenten --- */

function KpiChip({
  label,
  value,
  tone,
}: {
  label: string
  value: number
  tone?: 'slate' | 'emerald' | 'dark'
}) {
  const base =
    tone === 'emerald'
      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
      : tone === 'dark'
        ? 'bg-slate-900 border-slate-900 text-slate-50'
        : 'bg-white border-slate-200 text-slate-800'

  return (
    <div
      className={`flex items-center justify-between gap-2 rounded-2xl border px-3 py-2 text-xs shadow-sm ${base}`}
    >
      <span className="truncate">{label}</span>
      <span className="text-sm font-semibold">{value}</span>
    </div>
  )
}

function StatusFilterChip({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium transition ${
        active
          ? 'border border-slate-900 bg-slate-900 text-slate-50 shadow-sm'
          : 'border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
      }`}
    >
      {label}
    </button>
  )
}
