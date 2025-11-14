// src/app/dashboard/inserieren/erfolg/page.tsx
import Link from 'next/link'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { supabaseServer } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

type Props = {
  searchParams: { listing?: string }
}

type DbStatus =
  | 'draft'
  | 'pending_payment'
  | 'pending_sync'
  | 'active'
  | 'deactivated'
  | 'marketed'
  | 'archived'
  | 'deleted'

function mapDbStatusToUi(status: string | null | undefined): string {
  if (!status) return 'unbekannt'
  const s = status.toLowerCase() as DbStatus

  switch (s) {
    case 'draft':
      return 'Entwurf'
    case 'pending_payment':
      return 'Zahlung ausstehend'
    case 'pending_sync':
      return 'Übermittlung an Portale'
    case 'active':
      return 'Aktiv (auf Portalen)'
    case 'deactivated':
      return 'Deaktiviert'
    case 'marketed':
      return 'Vermarktet'
    case 'archived':
      return 'Archiviert'
    case 'deleted':
      return 'Gelöscht'
    default:
      return status
  }
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

  const rawStatus: string | undefined = listing?.status ?? undefined
  const uiStatus = mapDbStatusToUi(rawStatus)

  const topChipLabel = (() => {
    switch (rawStatus) {
      case 'active':
        return 'Aktiv auf Portalen'
      case 'pending_sync':
        return 'Übermittlung an Portale'
      case 'pending_payment':
        return 'Zahlung ausstehend'
      case 'draft':
        return 'Entwurf'
      default:
        return uiStatus
    }
  })()

  const isActive = rawStatus === 'active'
  const isPendingSync = rawStatus === 'pending_sync'

  return (
    <section className="mx-auto max-w-4xl px-4 py-10 sm:py-14">
      <div className="mb-6">
        <Link
          href="/dashboard/inserate"
          className="inline-flex items-center text-sm text-slate-500 hover:text-slate-700"
        >
          <span className="mr-1 text-lg">←</span>
          Zurück zur Inseratsübersicht
        </Link>
      </div>

      <div className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.10)] backdrop-blur-xl sm:p-8">
        {/* HEADER */}
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg">
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

          <div
            className={[
              'text-xs rounded-full px-3 py-1 font-medium ring-1',
              isActive
                ? 'bg-emerald-600 text-emerald-50 ring-emerald-700'
                : isPendingSync
                ? 'bg-sky-50 text-sky-700 ring-sky-100'
                : 'bg-emerald-50 text-emerald-700 ring-emerald-100',
            ].join(' ')}
          >
            Status: {topChipLabel}
          </div>
        </div>

        {/* WHAT HAPPENS NEXT + ANIMATION */}
        <BridgeAnimation isActive={isActive} />

        {/* LISTING SUMMARY */}
        {listing && (
          <div className="mt-8 rounded-2xl border border-white/80 bg-white/95 p-4 text-sm text-slate-800 sm:p-5">
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
                  {[listing.street, listing.house_number]
                    .filter(Boolean)
                    .join(' ')}
                  {listing.postal_code || listing.city ? ', ' : ''}
                  {[listing.postal_code, listing.city]
                    .filter(Boolean)
                    .join(' ')}
                </div>
              )}
              <div className="mt-3 text-xs text-slate-500">
                Aktueller Status in Maklernull:{' '}
                <span className="font-medium text-slate-800">{uiStatus}</span>.
                Sobald die Inserate an die Portale übermittelt wurden,
                aktualisieren wir den Status automatisch. Bei Rückfragen,
                Beanstandungen oder Korrekturwünschen seitens der Portale kann
                sich die Veröffentlichung verzögern.
              </div>
            </div>
          </div>
        )}

        {/* CTA-BUTTONS */}
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-full border border-slate-900 bg-slate-900 px-5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
          >
            Zum Dashboard
          </Link>
          <Link
            href="/dashboard/inserate"
            className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white/90 px-5 py-2 text-sm font-medium text-slate-800 shadow-sm hover:border-slate-300 hover:bg-white"
          >
            Inserate ansehen
          </Link>
          <Link
            href="/dashboard/inserieren"
            className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white/90 px-5 py-2 text-sm font-medium text-slate-800 shadow-sm hover:border-slate-300 hover:bg-white"
          >
            Weitere Immobilie anlegen
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  ANIMIERTE BRIDGE: Maklernull → Portale (mit echten Logos)         */
/* ------------------------------------------------------------------ */

function BridgeAnimation({ isActive }: { isActive: boolean }) {
  return (
    <div className="mt-8 rounded-3xl border border-slate-100 bg-slate-50/70 p-4 text-xs text-slate-600 shadow-sm sm:p-5">
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-stretch sm:justify-between">
        {/* Maklernull Bubble mit Logo */}
        <div className="flex flex-col items-center gap-2 sm:w-1/4">
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-[0_12px_35px_rgba(15,23,42,0.6)] animate-pulse">
            <Image
              src="/favi.png"
              alt="Maklernull Logo"
              width={40}
              height={40}
              className="h-9 w-9 rounded-lg object-contain"
              priority
            />
            <span className="pointer-events-none absolute -bottom-2 rounded-full bg-emerald-400 px-2 py-[2px] text-[9px] font-semibold uppercase tracking-wide text-slate-900 ring-1 ring-emerald-500/70">
              Maklernull
            </span>
          </div>
          <p className="mt-3 max-w-[220px] text-center text-[11px] text-slate-600">
            Ihre Daten werden jetzt von der{' '}
            <span className="font-medium">Maklernull Bridge</span> aufbereitet
            und für die Portale vorbereitet.
          </p>
        </div>

        {/* „Flugbahn“ / Bogen */}
        <div className="relative flex w-full max-w-xs flex-1 items-center justify-center py-2 sm:max-w-sm">
          {/* leichter Bogen-Hintergrund */}
          <svg
            viewBox="0 0 300 120"
            className="h-24 w-full max-w-full text-slate-300 sm:h-24"
            aria-hidden="true"
          >
            <path
              d="M10 90 C 110 10, 190 10, 290 90"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              className="opacity-60"
            />
          </svg>

          {/* „Pakete“, die entlang des Bogens pulsieren */}
          <div className="pointer-events-none absolute inset-0">
            {/* Startnah */}
            <div
              className="absolute left-[12%] top-[54%] h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400/90 shadow-md animate-ping"
              style={{ animationDuration: '1.4s' }}
            />
            {/* Mitte */}
            <div
              className="absolute left-1/2 top-[26%] h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500 shadow-md animate-ping"
              style={{ animationDelay: '250ms', animationDuration: '1.6s' }}
            />
            {/* kurz vor Portalen */}
            <div
              className="absolute left-[82%] top-[50%] h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500 shadow-md animate-ping"
              style={{ animationDelay: '500ms', animationDuration: '1.8s' }}
            />
          </div>

          {/* kleines Label „Bridge aktiv“ */}
          <div className="pointer-events-none absolute inset-x-0 top-[55%] flex justify-center">
            <span className="rounded-full bg-white/90 px-3 py-1 text-[10px] font-medium text-slate-700 shadow-sm ring-1 ring-slate-200">
              Bridge{' '}
              <span className="inline-flex items-center gap-1">
                aktiv
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </span>
            </span>
          </div>
        </div>

        {/* Portal-Logos */}
        <div className="flex w-full flex-col items-center gap-3 sm:w-1/3">
          <div className="grid w-full max-w-xs grid-cols-1 gap-3 sm:max-w-none sm:grid-cols-3">
            <PortalBubble
              name="ImmoScout24"
              src="/immobilienscout.png"
              alt="ImmoScout24 Logo"
              colorClass="bg-sky-50 text-sky-800 border-sky-100"
            />
            <PortalBubble
              name="Immowelt"
              src="/Immowelt.png"
              alt="Immowelt Logo"
              colorClass="bg-amber-50 text-amber-800 border-amber-100"
            />
            <PortalBubble
              name="Kleinanzeigen"
              src="/kleinanzeigen.png"
              alt="Kleinanzeigen Logo"
              colorClass="bg-emerald-50 text-emerald-800 border-emerald-100"
            />
          </div>
          <p className="mt-2 max-w-sm text-center text-[11px] text-slate-600">
            Die Inserierung wird schrittweise an{' '}
            <span className="font-medium">ImmoScout24</span>,{' '}
            <span className="font-medium">Immowelt</span> und{' '}
            <span className="font-medium">Kleinanzeigen</span> übertragen. Sobald
            alle Portale erfolgreich bestätigt haben, ist Ihr Inserat dort
            sichtbar.
          </p>
          <p className="mt-1 max-w-sm text-center text-[10px] text-slate-500">
            Bei Beanstandungen oder angeforderten Korrekturen durch die Portale
            kann sich die Veröffentlichung verzögern. Sie werden in Maklernull
            über Statusänderungen informiert.
          </p>
        </div>
      </div>

      <div className="mt-4 text-[11px] text-slate-500">
        Nächste Schritte:{' '}
        <span className="font-medium text-slate-700">
          1. Bridge übermittelt die Daten · 2. Portale prüfen und schalten frei ·
          3. Status springt auf „Aktiv (auf Portalen)“ · 4. Anfragen landen in
          Ihrem Maklernull-Dashboard.
        </span>
      </div>

      {isActive && (
        <div className="mt-3 rounded-2xl border border-emerald-100 bg-emerald-50/80 px-3 py-2 text-[11px] text-emerald-800">
          Ihr Inserat ist bereits als <span className="font-semibold">aktiv</span>{' '}
          markiert. Je nach Portal kann es wenige Minuten dauern, bis es überall
          sichtbar ist.
        </div>
      )}
    </div>
  )
}

type PortalBubbleProps = {
  name: string
  src: string
  alt: string
  colorClass: string
}

function PortalBubble({ name, src, alt, colorClass }: PortalBubbleProps) {
  return (
    <div
      className={[
        'flex flex-col items-center justify-center rounded-2xl border px-3 py-2 text-center text-[10px] shadow-sm',
        colorClass,
      ].join(' ')}
    >
      <div className="mb-1 flex h-7 items-center justify-center">
        <Image
          src={src}
          alt={alt}
          width={40}
          height={24}
          className="h-6 w-auto object-contain"
        />
      </div>
      <span className="font-medium leading-tight">{name}</span>
      <span className="mt-1 inline-flex items-center gap-1 text-[9px] text-emerald-700">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
        Rreserviert
      </span>
    </div>
  )
}
