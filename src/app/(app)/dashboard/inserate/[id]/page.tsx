// app/(app)/dashboard/inserate/[id]/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowLeftIcon,
  HomeModernIcon,
  MapPinIcon,
  CurrencyEuroIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarDaysIcon,
  BuildingOffice2Icon,
} from '@heroicons/react/24/outline'

type ListingStatus = 'entwurf' | 'aktiv' | 'deaktiviert' | 'vermarktet' | 'unbekannt'

type ListingDetail = {
  id: string
  status: string | null
  created_at: string
  updated_at: string | null
  transactionType?: 'sale' | 'rent' | null
  usageType?: 'residential' | 'commercial' | null
  saleCategory?: string | null
  rentCategory?: string | null
  title?: string | null
  description?: string | null
  street?: string | null
  houseNumber?: string | null
  postalCode?: string | null
  postal_code?: string | null // fallback, je nach API
  city?: string | null
  country?: string | null
  livingArea?: string | number | null
  landArea?: string | number | null
  rooms?: string | number | null
  floor?: string | null
  totalFloors?: string | null
  yearBuilt?: string | number | null
  price?: string | number | null
  currency?: string | null
  availability?: string | null
  isFurnished?: boolean | null
  contactName?: string | null
  contactEmail?: string | null
  contactPhone?: string | null
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

function formatDateTime(dateStr?: string | null) {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return '—'
  return new Intl.DateTimeFormat('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}

function formatDate(dateStr?: string | null) {
  if (!dateStr) return '–'
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return '–'
  return new Intl.DateTimeFormat('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
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

export default function InseratDetailPage() {
  const router = useRouter()
  const params = useParams() as { id: string }
  const { id } = params

  const [listing, setListing] = useState<ListingDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      setError(null)
      setLoading(true)
      try {
        const res = await fetch(`/api/listings/${id}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          cache: 'no-store',
        })
        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          throw new Error(data.error || 'Inserat konnte nicht geladen werden')
        }
        const data = await res.json()
        setListing(data.listing)
      } catch (e: any) {
        setError(e.message || 'Unbekannter Fehler beim Laden des Inserats')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      load()
    }
  }, [id])

  const statusInfo = niceStatus(listing?.status ?? null)
  const showPostal =
    listing?.postalCode ||
    listing?.postal_code ||
    '' ||
    ''
  const postal = listing?.postalCode || listing?.postal_code || ''

  return (
    <div className="relative min-h-[calc(100vh-6rem)] text-slate-900">
      {/* leichter Glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.06),_transparent_60%)]" />
      </div>

      <div className="relative space-y-6">
        {/* Back + Title */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => router.push('/dashboard/inserate')}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
          >
            <ArrowLeftIcon className="h-3.5 w-3.5" />
            Zurück zu den Inseraten
          </button>
          <Link
            href="/dashboard/inserieren"
            className="inline-flex items-center gap-2 rounded-full border border-slate-900 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-50 shadow-[0_18px_40px_rgba(15,23,42,0.45)] transition hover:bg-slate-800 hover:border-slate-800"
          >
            Neue Immobilie inserieren
          </Link>
        </div>

        {/* Haupt-Card */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="grid gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.1fr)]"
        >
          {/* Linke Seite: Details */}
          <div className="space-y-4">
            <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
              <div className="border-b border-slate-100 px-5 py-4">
                {loading ? (
                  <div className="h-5 w-40 animate-pulse rounded bg-slate-100" />
                ) : (
                  <>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-slate-900 text-slate-50">
                        <HomeModernIcon className="h-5 w-5" />
                      </span>
                      <div className="flex flex-col gap-1">
                        <h1 className="text-base font-semibold tracking-tight text-slate-900 sm:text-lg">
                          {listing?.title || 'Unbenannte Immobilie'}
                        </h1>
                        <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                          {listing?.transactionType && (
                            <span className="rounded-full bg-slate-50 px-2 py-0.5">
                              {listing.transactionType === 'sale'
                                ? 'Verkauf'
                                : 'Vermietung'}
                            </span>
                          )}
                          {listing?.usageType && (
                            <span className="rounded-full bg-slate-50 px-2 py-0.5">
                              {listing.usageType === 'residential'
                                ? 'Wohnen'
                                : 'Gewerbe / Anlage'}
                            </span>
                          )}
                          {(listing?.saleCategory || listing?.rentCategory) && (
                            <span className="rounded-full bg-slate-50 px-2 py-0.5">
                              {listing.saleCategory || listing.rentCategory}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-600">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium ring-1 ${statusInfo.color}`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${statusInfo.dot}`}
                        />
                        {statusInfo.label}
                      </span>
                      <span>
                        Angelegt: {listing ? formatDateTime(listing.created_at) : '–'}
                      </span>
                      {listing?.updated_at && (
                        <span>· Aktualisiert: {formatDateTime(listing.updated_at)}</span>
                      )}
                    </div>
                  </>
                )}
              </div>

              <div className="grid gap-4 px-5 py-4 sm:grid-cols-2 sm:gap-5">
                {/* Adresse */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-800">
                    <MapPinIcon className="h-4 w-4 text-slate-600" />
                    Adresse
                  </div>
                  {loading ? (
                    <div className="space-y-1.5">
                      <div className="h-3 w-40 animate-pulse rounded bg-slate-100" />
                      <div className="h-3 w-24 animate-pulse rounded bg-slate-100" />
                    </div>
                  ) : (
                    <div className="text-xs text-slate-700">
                      {listing?.street || listing?.houseNumber ? (
                        <p>
                          {listing.street} {listing.houseNumber}
                        </p>
                      ) : (
                        <p>–</p>
                      )}
                      {(postal || listing?.city) && (
                        <p>
                          {postal} {listing?.city}
                        </p>
                      )}
                      {listing?.country && <p>{listing.country}</p>}
                    </div>
                  )}
                </div>

                {/* Preis + Verfügbarkeit */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-800">
                    <CurrencyEuroIcon className="h-4 w-4 text-slate-600" />
                    Preis & Verfügbarkeit
                  </div>
                  {loading ? (
                    <div className="space-y-1.5">
                      <div className="h-3 w-32 animate-pulse rounded bg-slate-100" />
                      <div className="h-3 w-28 animate-pulse rounded bg-slate-100" />
                    </div>
                  ) : (
                    <div className="text-xs text-slate-700 space-y-1">
                      <p className="text-sm font-semibold text-slate-900">
                        {listing?.price
                          ? formatPrice(listing.price, listing.currency) +
                            (listing.transactionType === 'rent' ? ' / Monat' : '')
                          : '–'}
                      </p>
                      <p>
                        Verfügbar ab:{' '}
                        {listing?.availability
                          ? formatDate(listing.availability)
                          : '–'}
                      </p>
                      <p>
                        Möbliert:{' '}
                        {listing?.isFurnished === true
                          ? 'Ja'
                          : listing?.isFurnished === false
                            ? 'Nein'
                            : '–'}
                      </p>
                    </div>
                  )}
                </div>

                {/* Eckdaten */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-800">
                    <BuildingOffice2Icon className="h-4 w-4 text-slate-600" />
                    Eckdaten
                  </div>
                  {loading ? (
                    <div className="space-y-1.5">
                      <div className="h-3 w-36 animate-pulse rounded bg-slate-100" />
                      <div className="h-3 w-28 animate-pulse rounded bg-slate-100" />
                    </div>
                  ) : (
                    <div className="text-xs text-slate-700 space-y-1.5">
                      <p>
                        Wohnfläche:{' '}
                        {listing?.livingArea ? `${listing.livingArea} m²` : '–'}
                      </p>
                      <p>
                        Grundstück:{' '}
                        {listing?.landArea ? `${listing.landArea} m²` : '–'}
                      </p>
                      <p>Zimmer: {listing?.rooms ?? '–'}</p>
                      <p>
                        Etage: {listing?.floor || '–'}{' '}
                        {listing?.totalFloors && (
                          <span className="text-slate-500">
                            (von {listing.totalFloors})
                          </span>
                        )}
                      </p>
                      <p>Baujahr: {listing?.yearBuilt || '–'}</p>
                    </div>
                  )}
                </div>

                {/* Kontakt */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-800">
                    <UserIcon className="h-4 w-4 text-slate-600" />
                    Ansprechpartner*in
                  </div>
                  {loading ? (
                    <div className="space-y-1.5">
                      <div className="h-3 w-40 animate-pulse rounded bg-slate-100" />
                      <div className="h-3 w-32 animate-pulse rounded bg-slate-100" />
                    </div>
                  ) : (
                    <div className="text-xs text-slate-700 space-y-1.5">
                      <p>{listing?.contactName || '–'}</p>
                      {listing?.contactEmail && (
                        <p className="flex items-center gap-1.5">
                          <EnvelopeIcon className="h-3.5 w-3.5 text-slate-500" />
                          <a
                            href={`mailto:${listing.contactEmail}`}
                            className="hover:text-slate-900"
                          >
                            {listing.contactEmail}
                          </a>
                        </p>
                      )}
                      {listing?.contactPhone && (
                        <p className="flex items-center gap-1.5">
                          <PhoneIcon className="h-3.5 w-3.5 text-slate-500" />
                          <a
                            href={`tel:${listing.contactPhone}`}
                            className="hover:text-slate-900"
                          >
                            {listing.contactPhone}
                          </a>
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Beschreibung */}
              <div className="border-t border-slate-100 px-5 py-4">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-800">
                  <CalendarDaysIcon className="h-4 w-4 text-slate-600" />
                  Beschreibung
                </div>
                {loading ? (
                  <div className="mt-3 space-y-1.5">
                    <div className="h-3 w-full animate-pulse rounded bg-slate-100" />
                    <div className="h-3 w-3/4 animate-pulse rounded bg-slate-100" />
                    <div className="h-3 w-1/2 animate-pulse rounded bg-slate-100" />
                  </div>
                ) : (
                  <p className="mt-3 text-sm leading-relaxed text-slate-700">
                    {listing?.description?.trim()
                      ? listing.description
                      : 'Für dieses Inserat wurde noch keine Beschreibung hinterlegt.'}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Rechte Seite: Bridge / Meta */}
          <div className="space-y-4">
            {/* Maklernull Bridge Card (Info) */}
            <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-4 py-3 sm:px-5">
                <h2 className="text-sm font-medium text-slate-900">
                  Maklernull Bridge
                </h2>
                <p className="text-xs text-slate-500">
                  Dieses Inserat kann über die Maklernull Bridge mit den
                  Immobilienportalen verbunden werden.
                </p>
              </div>
              <div className="space-y-3 px-4 py-4 text-xs text-slate-700 sm:px-5">
                <p>
                  Aktueller Status:{' '}
                  <span className="font-medium">{statusInfo.label}</span>
                </p>
                <p>
                  Sobald das Inserat aktiv ist und das passende Paket gebucht
                  wurde, kümmert sich die Bridge um die technische Übertragung zu
                  den angeschlossenen Portalen.
                </p>
                <ul className="mt-1 list-disc space-y-1 pl-4 text-[11px] text-slate-600">
                  <li>Strukturierte Daten aus dem Exposé</li>
                  <li>Automatische Anpassung an das Zielformat</li>
                  <li>Synchrone Aktualisierung bei Änderungen</li>
                </ul>
                <p className="pt-1 text-[11px] text-slate-500">
                  Die eigentliche Schaltung auf ImmoScout24, Immowelt und
                  Kleinanzeigen erfolgt abhängig vom gebuchten Paket und deinem
                  Vertrag mit Maklernull.
                </p>
              </div>
            </div>

            {/* Meta / IDs */}
            {listing && (
              <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-4 py-3 sm:px-5">
                  <h2 className="text-sm font-medium text-slate-900">
                    Technische Informationen
                  </h2>
                  <p className="text-xs text-slate-500">
                    Nützlich für Support & Debugging.
                  </p>
                </div>
                <div className="px-4 py-4 text-[11px] text-slate-700 sm:px-5">
                  <div className="space-y-1.5">
                    <p>
                      <span className="font-medium">Listing-ID:</span>{' '}
                      <span className="font-mono text-[10px]">
                        {listing.id}
                      </span>
                    </p>
                    <p>
                      <span className="font-medium">Angelegt:</span>{' '}
                      {formatDateTime(listing.created_at)}
                    </p>
                    {listing.updated_at && (
                      <p>
                        <span className="font-medium">Zuletzt geändert:</span>{' '}
                        {formatDateTime(listing.updated_at)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.section>

        {error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-700">
            {error}
          </div>
        )}
      </div>
    </div>
  )
}
