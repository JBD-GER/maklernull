// app/(app)/dashboard/DashboardClient.tsx
'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  HomeModernIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  PlusIcon,
  EnvelopeOpenIcon,
  BoltIcon,
  ArrowTopRightOnSquareIcon,
} from '@heroicons/react/24/outline'

type ListingStatus = 'entwurf' | 'aktiv' | 'deaktiviert' | 'vermarktet' | 'unbekannt'

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

type Metrics = {
  totalListings: number
  draft: number
  active: number
  inactive: number
  marketed: number
  marketingRate: number
  unreadMessages: number
}

type Props = {
  ownerName: string
  metrics: Metrics
  listings: Listing[]
  messages: Message[]
  contact: { email: string; phone: string }
}

/* Helper */
function formatDate(dateStr?: string | null) {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return '—'
  return new Intl.DateTimeFormat('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
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

function percentageLabel(value: number) {
  if (!Number.isFinite(value)) return '0 %'
  return `${Math.max(0, Math.min(100, Math.round(value)))} %`
}

export default function DashboardClient({
  ownerName,
  metrics,
  listings,
  messages,
  contact,
}: Props) {
  const {
    totalListings,
    draft,
    active,
    inactive,
    marketed,
    marketingRate,
    unreadMessages,
  } = metrics

  const latestListings = listings.slice(0, 5)
  const latestMessages = messages.slice(0, 5)

  return (
    <div className="relative min-h-[calc(100vh-6rem)] text-slate-900">
      {/* ganz dezenter Background-Glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.06),_transparent_60%)]" />
      </div>

      <div className="relative space-y-6">
        {/* HERO CARD */}
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.08)]"
        >
          <div className="relative flex flex-col gap-8 p-6 sm:p-8 lg:flex-row lg:items-center">
            {/* leichte Kante oben */}
            <div className="pointer-events-none absolute inset-x-10 -top-10 h-16 bg-gradient-to-b from-slate-100 to-transparent" />

            {/* Text */}
            <div className="relative flex-1 space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Dein Maklernull-Cockpit
              </div>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
                Willkommen zurück,&nbsp;
                <span className="bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                  {ownerName}
                </span>
                .
              </h1>
              <p className="max-w-xl text-sm text-slate-600 sm:text-[15px]">
                Behalte alle Inserate, Anfragen und Vermarktungsstände im Blick – in einem
                ruhigen, klaren Dashboard. Von Entwurf bis „Vermarktet“ in nur wenigen Klicks.
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                {/* Primär: Deep-Blue */}
                <Link
                  href="/dashboard/inserieren/"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-900 bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-[0_18px_40px_rgba(15,23,42,0.45)] transition hover:bg-slate-800 hover:border-slate-800"
                >
                  <PlusIcon className="h-4 w-4" />
                  Neue Immobilie inserieren
                </Link>
                {/* Sekundär: Ghost */}
                <Link
                  href="/dashboard/inserate"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-900 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  <HomeModernIcon className="h-4 w-4" />
                  Zu meinen Inseraten
                </Link>
                {/* Status Chip */}
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600">
                  <ChatBubbleOvalLeftEllipsisIcon className="h-3.5 w-3.5 text-slate-500" />
                  {unreadMessages > 0 ? (
                    <span>
                      {unreadMessages} ungelesene&nbsp;
                      {unreadMessages === 1 ? 'Nachricht' : 'Nachrichten'}
                    </span>
                  ) : (
                    <span>Keine offenen Nachrichten</span>
                  )}
                </div>
              </div>
            </div>

            {/* Animated House Orbit */}
            <div className="relative flex-1 lg:max-w-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
                className="relative mx-auto flex h-52 w-52 items-center justify-center rounded-full border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.12)] sm:h-60 sm:w-60"
              >
                <div className="absolute inset-6 rounded-full border border-slate-200" />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-3"
                >
                  <div className="absolute -top-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-slate-700" />
                  <div className="absolute bottom-2 left-5 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                </motion.div>

                {/* Haus */}
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-slate-100 shadow-lg shadow-slate-300/70"
                >
                  <HomeModernIcon className="h-11 w-11 text-slate-900" />
                  <div className="pointer-events-none absolute inset-x-4 -bottom-4 h-4 rounded-full bg-slate-300/70 blur-xl" />
                </motion.div>

                {/* Status-Chips */}
                <div className="pointer-events-none absolute -right-4 top-6">
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-[11px] text-emerald-800 shadow-sm shadow-emerald-200/90">
                    <div className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      <span>Aktive Inserate</span>
                    </div>
                    <div className="mt-1 text-lg font-semibold leading-none">
                      {active}
                    </div>
                  </div>
                </div>
                <div className="pointer-events-none absolute -left-4 bottom-6">
                  <div className="rounded-2xl border border-slate-900/40 bg-slate-900 text-[11px] text-slate-50 px-3 py-2 shadow-sm shadow-slate-900/50">
                    <div className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-200" />
                      <span>Vermarktungsquote</span>
                    </div>
                    <div className="mt-1 text-lg font-semibold leading-none">
                      {percentageLabel(marketingRate)}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* KPIs */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut', delay: 0.05 }}
          className="grid gap-4 md:grid-cols-4"
        >
          <MetricCard
            label="Gesamt-Inserate"
            value={totalListings}
            hint="Alle Immobilien, die du jemals angelegt hast."
          />
          <MetricCard
            label="Aktiv"
            value={active}
            hint="Aktuell auf Portalen sichtbar."
            accent="emerald" // leicht grün
          />
          <MetricCard
            label="Vermarktet"
            value={marketed}
            hint="Erfolgreich abgeschlossen."
            accent="blue"
          />
          <MetricCard
            label="Ungelesene Anfragen"
            value={unreadMessages}
            hint="Neue Nachrichten von Interessenten."
            accent="blue"
          />
        </motion.section>

        {/* Status + Aktivität */}
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut', delay: 0.1 }}
          className="grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]"
        >
          {/* Linke Spalte: Letzte Inserate & Nachrichten */}
          <div className="space-y-4">
            {/* Letzte Inserate */}
            <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white">
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 sm:px-5">
                <div>
                  <h2 className="text-sm font-medium text-slate-900">
                    Neueste Inserate
                  </h2>
                  <p className="text-xs text-slate-500">
                    Vom Entwurf bis zur erfolgreichen Vermarktung.
                  </p>
                </div>
                <Link
                  href="/dashboard/inserate"
                  className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-900 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  Alle ansehen
                  <ArrowTopRightOnSquareIcon className="h-3.5 w-3.5" />
                </Link>
              </div>

              {latestListings.length === 0 ? (
                <div className="px-4 py-6 text-sm text-slate-600 sm:px-5">
                  Du hast noch keine Inserate angelegt. Starte mit deiner ersten Immobilie –
                  es dauert nur wenige Minuten.
                </div>
              ) : (
                <ul className="divide-y divide-slate-100">
                  {latestListings.map((listing) => {
                    const statusInfo = niceStatus(listing.status)
                    return (
                      <li
                        key={listing.id}
                        className="px-4 py-3 text-sm transition hover:bg-slate-50 sm:px-5"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="truncate font-medium text-slate-900">
                                {listing.title || 'Unbenannte Immobilie'}
                              </p>
                            </div>
                            <p className="mt-0.5 text-xs text-slate-500">
                              Angelegt am {formatDate(listing.created_at)}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <span
                              className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium ring-1 ${statusInfo.color}`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${statusInfo.dot}`}
                              />
                              {statusInfo.label}
                            </span>
                            {listing.marketed_at && (
                              <span className="text-[10px] text-slate-700">
                                Vermarktet am {formatDate(listing.marketed_at)}
                              </span>
                            )}
                          </div>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>

            {/* Letzte Nachrichten */}
            <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white">
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 sm:px-5">
                <div>
                  <h2 className="text-sm font-medium text-slate-900">
                    Neueste Anfragen
                  </h2>
                  <p className="text-xs text-slate-500">
                    Interessenten melden sich direkt auf deine Inserate.
                  </p>
                </div>
                <Link
                  href="/dashboard/nachrichten"
                  className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-900 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  Nachrichten
                  <ChatBubbleOvalLeftEllipsisIcon className="h-3.5 w-3.5" />
                </Link>
              </div>

              {latestMessages.length === 0 ? (
                <div className="px-4 py-6 text-sm text-slate-600 sm:px-5">
                  Noch keine Nachrichten eingegangen. Sobald Anfragen zu deinen Inseraten
                  eingehen, erscheinen sie hier.
                </div>
              ) : (
                <ul className="divide-y divide-slate-100">
                  {latestMessages.map((msg) => (
                    <li
                      key={msg.id}
                      className="px-4 py-3 text-sm transition hover:bg-slate-50 sm:px-5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-xs text-slate-500">
                            {formatDate(msg.created_at)}
                          </p>
                          <p className="mt-0.5 text-sm text-slate-900">
                            {msg.sender_name || 'Interessent'} zu{' '}
                            <span className="font-medium">
                              {msg.listing_title || 'deinem Inserat'}
                            </span>
                          </p>
                        </div>
                        {!msg.is_read && (
                          <span className="mt-1 inline-flex h-6 items-center rounded-full bg-slate-900 text-[11px] font-medium text-slate-50 px-2">
                            Neu
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Rechte Spalte: Statusübersicht & Support */}
          <div className="space-y-4">
            {/* Status-Balken */}
            <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white">
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 sm:px-5">
                <div>
                  <h2 className="text-sm font-medium text-slate-900">
                    Inseratsstatus
                  </h2>
                  <p className="text-xs text-slate-500">
                    Verteilung deiner Inserate nach Status.
                  </p>
                </div>
                <BoltIcon className="h-4 w-4 text-slate-700" />
              </div>

              <div className="px-4 py-4 sm:px-5">
                <div className="mb-3 flex items-center justify-between text-xs text-slate-700">
                  <span>Vermarktungsquote</span>
                  <span className="font-semibold text-slate-900">
                    {percentageLabel(marketingRate)}
                  </span>
                </div>
                <div className="mb-4 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className="flex h-full w-full">
                    {totalListings > 0 && (
                      <>
                        <div
                          className="h-full bg-slate-400/70"
                          style={{ width: `${(draft / totalListings) * 100 || 0}%` }}
                        />
                        <div
                          className="h-full bg-emerald-500/85"
                          style={{ width: `${(active / totalListings) * 100 || 0}%` }}
                        />
                        <div
                          className="h-full bg-slate-500/80"
                          style={{ width: `${(inactive / totalListings) * 100 || 0}%` }}
                        />
                        <div
                          className="h-full bg-slate-900"
                          style={{ width: `${(marketed / totalListings) * 100 || 0}%` }}
                        />
                      </>
                    )}
                  </div>
                </div>

                <dl className="grid grid-cols-2 gap-3 text-xs">
                  <StatusPill
                    label="Entwürfe"
                    value={draft}
                    tone="slate"
                    description="Noch nicht veröffentlicht."
                  />
                  <StatusPill
                    label="Aktiv"
                    value={active}
                    tone="emerald"
                    description="Auf Portalen sichtbar."
                  />
                  <StatusPill
                    label="Deaktiviert"
                    value={inactive}
                    tone="neutral"
                    description="Versteckt, aber reaktivierbar."
                  />
                  <StatusPill
                    label="Vermarktet"
                    value={marketed}
                    tone="blue"
                    description="Abgeschlossen & archiviert."
                  />
                </dl>
              </div>
            </div>

            {/* Kontakt / Support */}
            <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white">
              <div className="border-b border-slate-100 px-4 py-3 sm:px-5">
                <h2 className="text-sm font-medium text-slate-900">
                  Hilfe & Support
                </h2>
                <p className="text-xs text-slate-500">
                  Fragen zur Vermarktung oder zur Plattform? Wir sind für dich da.
                </p>
              </div>
              <div className="space-y-3 px-4 py-4 text-sm text-slate-800 sm:px-5">
                <div className="flex items-center gap-2">
                  <EnvelopeOpenIcon className="h-4 w-4 text-slate-700" />
                  <a
                    href={`mailto:${contact.email}`}
                    className="truncate hover:text-slate-900"
                  >
                    {contact.email}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <ChatBubbleOvalLeftEllipsisIcon className="h-4 w-4 text-slate-700" />
                  <a href={`tel:${contact.phone}`} className="hover:text-slate-900">
                    {contact.phone}
                  </a>
                </div>
                <p className="pt-1 text-xs text-slate-600">
                  Unser Ziel: Eigentümer sollen inserieren, Anfragen erhalten und ihre
                  Immobilie stressfrei vermarkten – Maklernull kümmert sich um den Rest.
                </p>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  )
}

/* === Kleine Sub-Komponenten === */

type MetricCardProps = {
  label: string
  value: number
  hint?: string
  accent?: 'emerald' | 'blue'
}

function MetricCard({ label, value, hint, accent }: MetricCardProps) {
  const bg =
    accent === 'emerald'
      ? 'bg-emerald-50'
      : 'bg-white'

  const shadow =
    accent === 'emerald'
      ? 'shadow-[0_18px_40px_rgba(16,185,129,0.16)]'
      : accent === 'blue'
        ? 'shadow-[0_18px_40px_rgba(15,23,42,0.12)]'
        : 'shadow-[0_18px_40px_rgba(15,23,42,0.06)]'

  return (
    <div
      className={`relative overflow-hidden rounded-2xl ${bg} p-4 ${shadow}`}
    >
      <div className="absolute inset-x-0 -top-10 h-12 bg-gradient-to-b from-slate-100 to-transparent" />
      <div className="relative space-y-1.5">
        <p className="text-xs text-slate-500">{label}</p>
        <p className="text-2xl font-semibold tracking-tight text-slate-900">
          {value}
        </p>
        {hint && <p className="text-[11px] text-slate-500">{hint}</p>}
      </div>
    </div>
  )
}

type StatusPillProps = {
  label: string
  value: number
  tone: 'slate' | 'emerald' | 'blue' | 'neutral'
  description?: string
}

function StatusPill({ label, value, tone, description }: StatusPillProps) {
  const base =
    tone === 'emerald'
      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
      : tone === 'blue'
        ? 'bg-slate-900 text-slate-50 border-slate-900'
        : tone === 'neutral'
          ? 'bg-slate-50 border-slate-200 text-slate-700'
          : 'bg-slate-50 border-slate-200 text-slate-800'

  const descColor =
    tone === 'blue'
      ? 'text-slate-200' // 👉 bei "Vermarktet" alles hell/weiß
      : 'text-slate-600'

  return (
    <div
      className={`flex flex-col justify-between gap-1 rounded-2xl border px-3 py-2.5 ${base}`}
    >
      <div className="flex items-center justify-between gap-2 text-[11px]">
        <span className="font-medium">{label}</span>
        <span className="text-xs font-semibold">{value}</span>
      </div>
      {description && (
        <p className={`text-[10px] ${descColor}`}>{description}</p>
      )}
    </div>
  )
}
