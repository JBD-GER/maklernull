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

  const dbStatus: string | undefined = listing?.status

  let statusLabel = 'unbekannt'
  if (dbStatus === 'active') statusLabel = 'Aktiv (auf Portalen)'
  else if (dbStatus === 'pending_sync') statusLabel = 'Bridge übermittelt'
  else if (dbStatus === 'pending_payment') statusLabel = 'Zahlung ausstehend'
  else if (dbStatus === 'draft') statusLabel = 'Entwurf'
  else if (dbStatus === 'deactivated') statusLabel = 'Deaktiviert'
  else if (dbStatus === 'marketed') statusLabel = 'Vermarktet'

  const isActiveStatus = dbStatus === 'active'

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:py-14">
      {/* Backlink */}
      <div className="mb-6">
        <Link
          href="/dashboard/inserieren"
          className="inline-flex items-center text-sm text-slate-500 hover:text-slate-700"
        >
          <span className="mr-1 text-lg">←</span>
          Zurück zur Inseratsübersicht
        </Link>
      </div>

      {/* Card */}
      <div className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-8">
        {/* Header */}
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md">
              ✓
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
                Zahlung erfolgreich abgeschlossen.
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                Vielen Dank! Wir haben Ihre Buchung erhalten. Ihr Inserat wird
                jetzt über die Maklernull Bridge für die Portale vorbereitet.
              </p>
            </div>
          </div>

          <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-100">
            Status:&nbsp;
            <span>{statusLabel}</span>
          </div>
        </div>

        {/* Kurz-Zusammenfassung Inserat */}
        {listing && (
          <div className="mt-6 rounded-2xl border border-white/80 bg-white/95 p-4 text-sm text-slate-800">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Zusammenfassung Ihres Inserats
            </div>
            <div className="mt-2 space-y-1">
              <div className="font-medium text-slate-900">
                {listing.title || 'Ohne Titel'}
              </div>
              <div className="text-xs text-slate-600">
                {listing.transaction_type === 'sale' ? 'Verkauf' : 'Vermietung'} ·{' '}
                {listing.usage_type === 'commercial' ? 'Gewerblich' : 'Wohnen'}
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
                  {statusLabel}
                </span>
                . Sobald die Inserate an die Portale übermittelt wurden, wird der
                Status automatisch aktualisiert.
              </div>
            </div>
          </div>
        )}

        {/* Bridge + Portale */}
        <BridgeAnimation isActive={isActiveStatus} />

        {/* Footer Buttons */}
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

/* ------------------------------------------------------------------ */
/*  Bridge Animation – nutzt die CSS-Klassen aus deiner globals.css   */
/* ------------------------------------------------------------------ */

function BridgeAnimation({ isActive }: { isActive: boolean }) {
  return (
    <div className="mt-8 rounded-3xl border border-emerald-50 bg-emerald-50/40 px-4 py-6 text-xs text-slate-600 shadow-sm sm:px-6 sm:py-7">
      {/* Desktop-Layout */}
      <div className="hidden sm:block">
        <div className="relative flex items-center justify-between gap-6">
          {/* Maklernull links */}
          <div className="flex w-[190px] flex-col items-center gap-3 text-center text-xs text-slate-600">
            <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-900 shadow-[0_16px_40px_rgba(15,23,42,0.55)]">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/95 shadow-inner shadow-slate-900/40">
                <img
                  src="/favi.png"
                  alt="Maklernull"
                  className="h-10 w-10 rounded-xl"
                />
              </div>
            </div>
            <div>
              <div className="font-semibold text-slate-900">
                Maklernull Bridge
              </div>
              <p className="mt-1 text-[11px] leading-snug">
                Ihre Daten werden jetzt von der Maklernull Bridge aufbereitet
                und für die Portale vorbereitet.
              </p>
            </div>
          </div>

          {/* Linien + animierte Dots in der Mitte */}
          <div className="relative h-40 flex-1">
            {/* Hauptlinie Maklernull -> Bridge */}
            <div className="bridge-main-line-desktop">
              <div className="bridge-main-line-inner">
                <span className="bridge-main-dot-desktop" />
              </div>
            </div>

            {/* Verzweigungen Bridge -> Portale */}
            <div className="bridge-branch-line-desktop bridge-branch-line-desktop-1">
              <div className="bridge-branch-line-inner">
                <span className="bridge-branch-dot-desktop bridge-branch-dot-desktop-1" />
              </div>
            </div>
            <div className="bridge-branch-line-desktop bridge-branch-line-desktop-2">
              <div className="bridge-branch-line-inner">
                <span className="bridge-branch-dot-desktop bridge-branch-dot-desktop-2" />
              </div>
            </div>
            <div className="bridge-branch-line-desktop bridge-branch-line-desktop-3">
              <div className="bridge-branch-line-inner">
                <span className="bridge-branch-dot-desktop bridge-branch-dot-desktop-3" />
              </div>
            </div>

            {/* Bridge-Kapsel in der Mitte */}
            <button
              type="button"
              className="bridge-pill-desktop"
            >
              <span className="mr-1 inline-block h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_0_2px_rgba(16,185,129,0.25)]" />
              Bridge aktiv
            </button>
          </div>

          {/* Portale rechts */}
          <div className="flex w-[260px] flex-col gap-3 text-xs">
            {/* ImmoScout24 */}
            <div className="flex items-center gap-3 rounded-2xl bg-sky-50/90 px-3 py-2 shadow-sm ring-1 ring-sky-100">
              <div className="flex h-10 w-20 items-center justify-center">
                <img
                  src="/immobilienscout.png"
                  alt="ImmoScout24 Logo"
                  className="max-h-8 w-auto"
                />
              </div>
              <div className="flex flex-1 flex-col">
                <span className="text-[11px] font-semibold text-slate-900">
                  ImmoScout24
                </span>
                <span className="mt-0.5 flex items-center gap-1 text-[11px] text-emerald-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Reserviert
                </span>
              </div>
            </div>

            {/* Immowelt */}
            <div className="flex items-center gap-3 rounded-2xl bg-amber-50/90 px-3 py-2 shadow-sm ring-1 ring-amber-100">
              <div className="flex h-10 w-20 items-center justify-center">
                <img
                  src="/Immowelt.png"
                  alt="Immowelt Logo"
                  className="max-h-8 w-auto"
                />
              </div>
              <div className="flex flex-1 flex-col">
                <span className="text-[11px] font-semibold text-slate-900">
                  Immowelt
                </span>
                <span className="mt-0.5 flex items-center gap-1 text-[11px] text-emerald-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Reserviert
                </span>
              </div>
            </div>

            {/* Kleinanzeigen */}
            <div className="flex items-center gap-3 rounded-2xl bg-emerald-50/90 px-3 py-2 shadow-sm ring-1 ring-emerald-100">
              <div className="flex h-10 w-20 items-center justify-center">
                <img
                  src="/kleinanzeigen.png"
                  alt="Kleinanzeigen Logo"
                  className="max-h-8 w-auto"
                />
              </div>
              <div className="flex flex-1 flex-col">
                <span className="text-[11px] font-semibold text-slate-900">
                  Kleinanzeigen
                </span>
                <span className="mt-0.5 flex items-center gap-1 text-[11px] text-emerald-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Reserviert
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile-Layout */}
      <div className="sm:hidden">
        <div className="flex flex-col items-center gap-4">
          {/* Logo + kurzer Text */}
          <div className="flex flex-col items-center gap-2 text-center text-xs text-slate-600">
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 shadow-[0_16px_40px_rgba(15,23,42,0.55)]">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/95 shadow-inner shadow-slate-900/40">
                <img
                  src="/favi.png"
                  alt="Maklernull"
                  className="h-8 w-8 rounded-lg"
                />
              </div>
            </div>
            <div>
              <div className="font-semibold text-slate-900">
                Maklernull Bridge aktiv
              </div>
              <p className="mt-1 text-[11px] leading-snug">
                Wir bereiten Ihr Inserat auf und übertragen es an die Portale.
              </p>
            </div>
          </div>

          {/* Vertikale Animation + Portale */}
          <div className="flex w-full max-w-sm items-start gap-3">
            {/* Vertikale Linien + Dots */}
            <div className="relative mt-3 w-8">
              {/* Hauptlinie nach unten */}
              <div className="bridge-main-line-mobile">
                <div className="bridge-main-line-mobile-inner">
                  <span className="bridge-main-dot-mobile" />
                </div>
              </div>

              {/* Verzweigungen zu den drei Portalen */}
              <div className="bridge-branch-line-mobile bridge-branch-line-mobile-1">
                <div className="bridge-branch-line-mobile-inner">
                  <span className="bridge-branch-dot-mobile bridge-branch-dot-mobile-1" />
                </div>
              </div>
              <div className="bridge-branch-line-mobile bridge-branch-line-mobile-2">
                <div className="bridge-branch-line-mobile-inner">
                  <span className="bridge-branch-dot-mobile bridge-branch-dot-mobile-2" />
                </div>
              </div>
              <div className="bridge-branch-line-mobile bridge-branch-line-mobile-3">
                <div className="bridge-branch-line-mobile-inner">
                  <span className="bridge-branch-dot-mobile bridge-branch-dot-mobile-3" />
                </div>
              </div>
            </div>

            {/* Portal-Karten untereinander */}
            <div className="flex-1 space-y-3 text-xs">
              <div className="flex items-center gap-3 rounded-2xl bg-sky-50/90 px-3 py-2 shadow-sm ring-1 ring-sky-100">
                <div className="flex h-8 w-16 items-center justify-center">
                  <img
                    src="/immobilienscout.png"
                    alt="ImmoScout24 Logo"
                    className="max-h-7 w-auto"
                  />
                </div>
                <div className="flex flex-1 flex-col">
                  <span className="text-[11px] font-semibold text-slate-900">
                    ImmoScout24
                  </span>
                  <span className="mt-0.5 flex items-center gap-1 text-[11px] text-emerald-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Reserviert
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl bg-amber-50/90 px-3 py-2 shadow-sm ring-1 ring-amber-100">
                <div className="flex h-8 w-16 items-center justify-center">
                  <img
                    src="/Immowelt.png"
                    alt="Immowelt Logo"
                    className="max-h-7 w-auto"
                  />
                </div>
                <div className="flex flex-1 flex-col">
                  <span className="text-[11px] font-semibold text-slate-900">
                    Immowelt
                  </span>
                  <span className="mt-0.5 flex items-center gap-1 text-[11px] text-emerald-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Reserviert
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl bg-emerald-50/90 px-3 py-2 shadow-sm ring-1 ring-emerald-100">
                <div className="flex h-8 w-16 items-center justify-center">
                  <img
                    src="/kleinanzeigen.png"
                    alt="Kleinanzeigen Logo"
                    className="max-h-7 w-auto"
                  />
                </div>
                <div className="flex flex-1 flex-col">
                  <span className="text-[11px] font-semibold text-slate-900">
                    Kleinanzeigen
                  </span>
                  <span className="mt-0.5 flex items-center gap-1 text-[11px] text-emerald-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Reserviert
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Nächste Schritte + Hinweis */}
      <p className="mt-5 text-[11px] leading-relaxed text-slate-500">
        Nächste Schritte: 1. Die Bridge übermittelt die Daten an ImmoScout24,
        Immowelt und Kleinanzeigen · 2. Portale prüfen und schalten frei · 3.
        Der Status springt auf „Aktiv (auf Portalen)“ · 4. Anfragen landen in
        Ihrem Maklernull-Dashboard. Bei Beanstandungen oder angeforderten
        Korrekturen durch die Portale kann sich die Veröffentlichung verzögern.
      </p>

      {isActive && (
        <div className="mt-3 rounded-2xl border border-emerald-100 bg-emerald-50/80 px-3 py-2 text-[11px] text-emerald-800">
          Ihr Inserat ist bereits als{' '}
          <span className="font-semibold">aktiv</span> markiert. Je nach Portal
          kann es wenige Minuten dauern, bis es überall sichtbar ist.
        </div>
      )}
    </div>
  )
}
