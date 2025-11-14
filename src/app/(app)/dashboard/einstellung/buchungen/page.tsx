'use client'

import { useEffect, useMemo, useState } from 'react'

type BookingStatus = 'paid' | 'open' | 'refunded' | 'failed'

type Booking = {
  id: string
  created_at: string
  product_name: string
  description?: string | null
  gross_amount: number // wir liefern aus der API schon Euro → keine /100 nötig
  currency: string
  status: BookingStatus
  invoice_number?: string | null
  invoice_url?: string | null
  period_from?: string | null
  period_to?: string | null
  // neu:
  listing_id?: string | null
  listing_title?: string | null
}

export default function AbonnementPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    setError(null)
    setLoading(true)
    try {
      const res = await fetch('/api/billing/bookings', {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-store' },
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({} as any))
        throw new Error(j?.error || 'Fehler beim Laden der Buchungen')
      }
      const json = (await res.json()) as { bookings: Booking[] }
      setBookings(json.bookings || [])
    } catch (e: any) {
      setError(e?.message || 'Buchungen konnten nicht geladen werden.')
      setBookings([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const fmtDate = (iso?: string | null) =>
    iso
      ? new Date(iso).toLocaleDateString('de-DE', { dateStyle: 'medium' })
      : '—'

  const fmtDateTime = (iso?: string | null) =>
    iso
      ? new Date(iso).toLocaleString('de-DE', {
          dateStyle: 'medium',
          timeStyle: 'short',
        })
      : '—'

  const fmtCurrency = (amount: number, currency: string) =>
    new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: currency || 'EUR',
      minimumFractionDigits: 2,
    }).format(amount)

  const statusLabel = (s: BookingStatus) => {
    switch (s) {
      case 'paid':
        return 'Bezahlt'
      case 'open':
        return 'Offen'
      case 'refunded':
        return 'Erstattet'
      case 'failed':
        return 'Fehlgeschlagen'
      default:
        return s
    }
  }

  const statusBadgeClass = (s: BookingStatus) => {
    switch (s) {
      case 'paid':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100'
      case 'open':
        return 'bg-amber-50 text-amber-700 border-amber-100'
      case 'refunded':
        return 'bg-sky-50 text-sky-700 border-sky-100'
      case 'failed':
        return 'bg-rose-50 text-rose-700 border-rose-100'
      default:
        return 'bg-slate-50 text-slate-700 border-slate-100'
    }
  }

  const summary = useMemo(() => {
    if (!bookings.length) {
      return {
        count: 0,
        totalGross: 0,
        lastBookingAt: null as string | null,
      }
    }
    const count = bookings.length
    const totalGross = bookings.reduce((sum, b) => sum + b.gross_amount, 0)
    const lastBookingAt =
      bookings
        .slice()
        .sort((a, b) => (a.created_at < b.created_at ? 1 : -1))[0]?.created_at ??
      null

    return { count, totalGross, lastBookingAt }
  }, [bookings])

  return (
    <div className="px-4 py-6 text-slate-700 sm:px-6 lg:px-10">
      <div className="space-y-6">
        {/* Header – Glas-Card */}
        <div className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/70 px-5 py-6 shadow-[0_18px_70px_rgba(15,23,42,0.28)] backdrop-blur-2xl sm:px-7">
          <div
            className="pointer-events-none absolute -top-24 -right-10 h-56 w-56 rounded-full opacity-50"
            style={{
              background:
                'radial-gradient(circle, rgba(15,23,42,0.45), transparent 60%)',
            }}
          />
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                Buchungen & Rechnungen
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                Übersicht über alle getätigten Buchungen, Zahlungsstatus, Rechnungen
                und – falls vorhanden – zugeordnete Immobilie.
              </p>
            </div>
            <div className="flex flex-col items-end gap-2 text-right text-xs text-slate-500">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/80 px-3 py-1 shadow-sm backdrop-blur-xl">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>
                  {summary.count} Buchung{summary.count === 1 ? '' : 'en'}
                </span>
              </span>
              {summary.lastBookingAt && (
                <span>
                  Letzte Buchung:{' '}
                  <span className="font-medium text-slate-800">
                    {fmtDate(summary.lastBookingAt)}
                  </span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* KPIs / Kennzahlen */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-white/60 bg-white/75 px-4 py-3 shadow-[0_14px_40px_rgba(15,23,42,0.16)] backdrop-blur-2xl">
            <div className="text-xs text-slate-500">Anzahl Buchungen</div>
            <div className="mt-1 text-2xl font-semibold text-slate-900">
              {summary.count}
            </div>
          </div>
          <div className="rounded-2xl border border-white/60 bg-white/75 px-4 py-3 shadow-[0_14px_40px_rgba(15,23,42,0.16)] backdrop-blur-2xl">
            <div className="text-xs text-slate-500">Gesamtvolumen (brutto)</div>
            <div className="mt-1 text-2xl font-semibold text-slate-900">
              {summary.totalGross
                ? fmtCurrency(summary.totalGross, bookings[0]?.currency || 'EUR')
                : '—'}
            </div>
          </div>
          <div className="rounded-2xl border border-white/60 bg-white/75 px-4 py-3 shadow-[0_14px_40px_rgba(15,23,42,0.16)] backdrop-blur-2xl">
            <div className="text-xs text-slate-500">Letzte Buchung</div>
            <div className="mt-1 text-sm font-medium text-slate-900">
              {summary.lastBookingAt ? fmtDateTime(summary.lastBookingAt) : '—'}
            </div>
          </div>
        </section>

        {/* Tabelle / Liste der Buchungen */}
        <section className="rounded-3xl border border-white/60 bg-white/75 p-4 shadow-[0_14px_50px_rgba(15,23,42,0.16)] backdrop-blur-2xl sm:p-5">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-semibold tracking-tight text-slate-900">
                Alle Buchungen
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Jede Buchung inkl. Zahlungsstatus, Zeitraum, Rechnung und – falls
                hinterlegt – zugehöriger Immobilie.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-11 animate-pulse rounded-xl bg-slate-200/60"
                />
              ))}
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50/80 px-3 py-2 text-sm text-rose-800">
              {error}
            </div>
          ) : !bookings.length ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 px-4 py-6 text-center text-sm text-slate-500">
              Bisher wurden keine Buchungen durchgeführt.
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-white/60 bg-white/70">
              <div className="max-h-[460px] overflow-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="sticky top-0 z-10 bg-white/80 text-xs text-slate-500 backdrop-blur-xl">
                    <tr className="border-b border-slate-100/70">
                      <th className="px-4 py-3 font-medium">Datum</th>
                      <th className="px-4 py-3 font-medium">Produkt</th>
                      <th className="px-4 py-3 font-medium">Immobilie</th>
                      <th className="px-4 py-3 font-medium">Zeitraum</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium text-right">Betrag</th>
                      <th className="px-4 py-3 font-medium text-right">Rechnung</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((b) => (
                      <tr
                        key={b.id}
                        className="border-b border-slate-100/70 last:border-0 hover:bg-slate-50/60"
                      >
                        <td className="px-4 py-3 align-middle text-xs text-slate-700">
                          <div>{fmtDate(b.created_at)}</div>
                          <div className="text-[11px] text-slate-400">
                            {fmtDateTime(b.created_at)}
                          </div>
                        </td>
                        <td className="px-4 py-3 align-middle text-xs text-slate-800">
                          <div className="font-medium text-slate-900">
                            {b.product_name}
                          </div>
                          {b.description && (
                            <div className="mt-0.5 line-clamp-2 text-[11px] text-slate-500">
                              {b.description}
                            </div>
                          )}
                          {b.invoice_number && (
                            <div className="mt-0.5 text-[11px] text-slate-400">
                              Rechnung: {b.invoice_number}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 align-middle text-xs text-slate-700">
                          {b.listing_title ? (
                            <div className="max-w-[160px] truncate">
                              {b.listing_title}
                            </div>
                          ) : (
                            <span className="text-slate-400 text-[11px]">
                              Keine Immobilie hinterlegt
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 align-middle text-xs text-slate-700">
                          {b.period_from || b.period_to ? (
                            <div>
                              {fmtDate(b.period_from)} – {fmtDate(b.period_to)}
                            </div>
                          ) : (
                            <span className="text-slate-400">–</span>
                          )}
                        </td>
                        <td className="px-4 py-3 align-middle text-xs">
                          <span
                            className={
                              'inline-flex rounded-full border px-2.5 py-1 text-[11px] font-medium ' +
                              statusBadgeClass(b.status)
                            }
                          >
                            {statusLabel(b.status)}
                          </span>
                        </td>
                        <td className="px-4 py-3 align-middle text-right text-xs font-medium text-slate-900">
                          {fmtCurrency(b.gross_amount, b.currency)}
                        </td>
                        <td className="px-4 py-3 align-middle text-right text-xs">
                          {b.invoice_url ? (
                            <a
                              href={b.invoice_url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-medium text-slate-800 shadow-sm hover:bg-slate-50"
                            >
                              Rechnung anzeigen
                            </a>
                          ) : (
                            <span className="text-[11px] text-slate-400">
                              Keine Rechnung
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
