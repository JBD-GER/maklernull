// app/(app)/baufinanzierung/BaufinanzierungClient.tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  BanknotesIcon,
  UserPlusIcon,
  InboxArrowDownIcon,
  CheckBadgeIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline'

type LeadStatus =
  | 'eingereicht'
  | 'kontaktiert'
  | 'abgeschlossen'
  | 'deaktiviert'
  | 'abgerechnet'

type Lead = {
  id: string
  email: string
  phone: string
  status: LeadStatus | string
  created_at: string
}

type Metrics = {
  totalLeads: number
  abgerechnetCount: number
  totalRevenue: number // in Euro
  conversion: number // Prozent, 0–100
}

type Props = {
  initialLeads: Lead[]
  metrics: Metrics
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

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
  }).format(amount)
}

function statusChip(raw: string | null): { label: string; color: string; dot: string } {
  const v = (raw ?? '').toLowerCase() as LeadStatus

  switch (v) {
    case 'eingereicht':
      return {
        label: 'Eingereicht',
        color: 'bg-slate-50 text-slate-800 border-slate-200 ring-slate-200/60',
        dot: 'bg-slate-400',
      }
    case 'kontaktiert':
      return {
        label: 'Kontaktiert',
        color: 'bg-sky-50 text-sky-800 border-sky-200 ring-sky-200/70',
        dot: 'bg-sky-500',
      }
    case 'abgeschlossen':
      return {
        label: 'Abgeschlossen',
        color: 'bg-emerald-50 text-emerald-800 border-emerald-200 ring-emerald-200/70',
        dot: 'bg-emerald-500',
      }
    case 'deaktiviert':
      return {
        label: 'Deaktiviert',
        color: 'bg-slate-50 text-slate-700 border-slate-200 ring-slate-200/60',
        dot: 'bg-slate-500',
      }
    case 'abgerechnet':
      return {
        label: 'Abgerechnet',
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

export default function BaufinanzierungClient({ initialLeads, metrics }: Props) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads)
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [consent, setConsent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [localMetrics, setLocalMetrics] = useState<Metrics>(metrics)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!email || !phone) {
      setError('Bitte E-Mail und Telefonnummer angeben.')
      return
    }
    if (!consent) {
      setError(
        'Bitte bestätigen Sie, dass die Einwilligung zur Kontaktaufnahme vorliegt.',
      )
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/baufinanzierung', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, phone, consent: true }),
      })

      const json = await res.json()

      if (!res.ok) {
        setError(json?.error || 'Lead konnte nicht gespeichert werden.')
        setSubmitting(false)
        return
      }

      const newLead: Lead = json.lead
      setLeads((prev) => [newLead, ...prev])

      // Kennzahlen lokal aktualisieren
      const newTotalLeads = localMetrics.totalLeads + 1
      const newAbgerechnetCount = localMetrics.abgerechnetCount // Status beim Anlegen = eingereicht
      const newConversion =
        newTotalLeads > 0
          ? Math.round((newAbgerechnetCount / newTotalLeads) * 100)
          : 0

      setLocalMetrics((m) => ({
        ...m,
        totalLeads: newTotalLeads,
        conversion: newConversion,
      }))

      setEmail('')
      setPhone('')
      setConsent(false)
      setSuccess(
        'Lead erfolgreich eingereicht. Sobald der Status sich ändert, sehen Sie es in der Liste.',
      )
    } catch (err) {
      console.error(err)
      setError('Unerwarteter Fehler beim Speichern.')
    } finally {
      setSubmitting(false)
    }
  }

  const { totalLeads, abgerechnetCount, totalRevenue, conversion } = localMetrics

  return (
    <div className="relative min-h-[calc(100vh-6rem)] text-slate-900">
      {/* Background-Glow wie im Dashboard */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.06),_transparent_60%)]" />
      </div>

      <div className="relative space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        {/* HERO CARD */}
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.08)]"
        >
          <div className="relative flex flex-col gap-8 p-6 sm:p-8 lg:flex-row lg:items-center">
            <div className="pointer-events-none absolute inset-x-10 -top-10 h-16 bg-gradient-to-b from-slate-100 to-transparent" />

            {/* Text-Bereich */}
            <div className="relative flex-1 space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Zusatzertrag mit Baufinanzierungen
              </div>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
                Tipp eine Baufinanzierung&nbsp;
                <span className="bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                  und erhalte 100&nbsp;€
                </span>
                .
              </h1>
              <p className="max-w-xl text-sm text-slate-600 sm:text-[15px]">
                Gib einfach die Kontaktdaten eines Interessenten ein, der eine
                Baufinanzierung benötigt. Nach erfolgreicher Vermittlung und
                Vertragsunterzeichnung schreiben wir dir <strong>100&nbsp;€</strong>{' '}
                gut.
              </p>
              <ul className="mt-2 list-disc pl-5 text-xs text-slate-600 sm:text-[13px]">
                <li>Du brauchst nur E-Mail und Telefonnummer.</li>
                <li>Wir melden uns direkt beim Interessenten.</li>
                <li>Du verfolgst transparent den Status bis zur Abrechnung.</li>
              </ul>
            </div>

            {/* Kleine Visualisierung */}
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
                  <div className="absolute bottom-2 left-4 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <div className="absolute right-4 top-6 h-1.5 w-1.5 rounded-full bg-sky-500" />
                </motion.div>

                {/* Geld-Icon */}
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-slate-100 shadow-lg shadow-slate-300/70"
                >
                  <BanknotesIcon className="h-11 w-11 text-slate-900" />
                  <div className="pointer-events-none absolute inset-x-4 -bottom-4 h-4 rounded-full bg-slate-300/70 blur-xl" />
                </motion.div>

                {/* kleine Chips */}
                <div className="pointer-events-none absolute -right-4 top-6">
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-[11px] text-emerald-800 shadow-sm shadow-emerald-200/90">
                    <div className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      <span>Abgerechnet</span>
                    </div>
                    <div className="mt-1 text-lg font-semibold leading-none">
                      {abgerechnetCount}
                    </div>
                  </div>
                </div>
                <div className="pointer-events-none absolute -left-4 bottom-6">
                  <div className="rounded-2xl border border-slate-900/40 bg-slate-900 px-3 py-2 text-[11px] text-slate-50 shadow-sm shadow-slate-900/50">
                    <div className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-200" />
                      <span>Einnahmen</span>
                    </div>
                    <div className="mt-1 text-lg font-semibold leading-none">
                      {formatCurrency(totalRevenue)}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Kennzahlen */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut', delay: 0.05 }}
          className="grid gap-4 md:grid-cols-3"
        >
          <MetricCard
            icon={InboxArrowDownIcon}
            label="Getippte Interessenten"
            value={totalLeads}
            hint="Anzahl aller eingereichten Baufinanzierungs-Leads."
          />
          <MetricCard
            icon={BanknotesIcon}
            label="Einnahmen (potenziell)"
            value={formatCurrency(totalRevenue)}
            hint="100 € pro abgerechneter Baufinanzierung."
          />
          <MetricCard
            icon={ChartBarIcon}
            label="Conversion Abgerechnet"
            value={`${conversion} %`}
            hint="Anteil der abgerechneten Leads an allen getippten Interessenten."
          />
        </motion.section>

        {/* Formular + Liste + Status-Erklärung */}
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut', delay: 0.1 }}
          className="grid gap-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.9fr)]"
        >
          {/* Linke Spalte: Formular + Liste */}
          <div className="space-y-4">
            {/* Formular */}
            <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-4 shadow-[0_14px_50px_rgba(15,23,42,0.08)] sm:p-5">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-slate-50">
                  <UserPlusIcon className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-sm font-medium text-slate-900">
                    Interessenten für Baufinanzierung tippen
                  </h2>
                  <p className="text-xs text-slate-500">
                    Trage die Kontaktdaten des Interessenten ein. Wir übernehmen den
                    Rest und halten dich mit dem Status auf dem Laufenden.
                  </p>
                </div>
              </div>

              {error && (
                <div className="mb-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-800">
                  {error}
                </div>
              )}

              {success && (
                <div className="mb-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-800">
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3 text-sm">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-700">
                      E-Mail des Interessenten
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-300"
                      placeholder="z. B. muster@mail.de"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-700">
                      Telefonnummer des Interessenten
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-300"
                      placeholder="z. B. 0176 12345678"
                    />
                  </div>
                </div>

                <label className="flex items-start gap-2 text-xs text-slate-700">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-300"
                  />
                  <span>
                    Ich bestätige, dass der Interessent in die Weitergabe seiner Daten
                    eingewilligt hat und damit einverstanden ist, dass Maklernull ihn
                    zur Baufinanzierung kontaktieren darf.
                  </span>
                </label>

                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2 text-xs font-semibold text-white shadow-[0_18px_40px_rgba(15,23,42,0.45)] transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? 'Wird eingereicht…' : 'Lead einreichen & 100 € sichern'}
                  </button>
                </div>
              </form>
            </div>

            {/* Liste der Leads */}
            <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white">
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 sm:px-5">
                <div>
                  <h2 className="text-sm font-medium text-slate-900">
                    Deine getippten Interessenten
                  </h2>
                  <p className="text-xs text-slate-500">
                    Hier siehst du alle eingereichten Leads und ihren aktuellen Status.
                  </p>
                </div>
              </div>

              {leads.length === 0 ? (
                <div className="px-4 py-6 text-sm text-slate-600 sm:px-5">
                  Du hast noch keinen Interessenten eingereicht. Starte mit deinem
                  ersten Tipp und erhalte 100 € nach erfolgreicher Baufinanzierung.
                </div>
              ) : (
                <ul className="divide-y divide-slate-100 text-sm">
                  {leads.map((lead) => {
                    const chip = statusChip(lead.status)
                    return (
                      <li
                        key={lead.id}
                        className="px-4 py-3 transition hover:bg-slate-50 sm:px-5"
                      >
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <div className="min-w-0">
                            <p className="text-xs text-slate-500">
                              Eingereicht am {formatDate(lead.created_at)}
                            </p>
                            <p className="mt-0.5 text-sm text-slate-900">
                              {lead.email}
                            </p>
                            <p className="text-xs text-slate-600">{lead.phone}</p>
                          </div>
                          <div className="flex flex-col items-start gap-1 sm:items-end">
                            <span
                              className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium ring-1 ${chip.color}`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${chip.dot}`}
                              />
                              {chip.label}
                            </span>
                            {lead.status === 'abgerechnet' && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-medium text-emerald-800">
                                <CheckBadgeIcon className="h-3 w-3" />
                                100 € gutgeschrieben
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
          </div>

          {/* Rechte Spalte: Status-Erklärung */}
          <div className="space-y-4">
            <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-4 shadow-[0_14px_50px_rgba(15,23,42,0.08)] sm:p-5">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-slate-50">
                  <ChartBarIcon className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-sm font-medium text-slate-900">
                    Erklärung der Status
                  </h2>
                  <p className="text-xs text-slate-500">
                    So interpretierst du die einzelnen Schritte im Baufinanzierungsprozess.
                  </p>
                </div>
              </div>

              <dl className="space-y-3 text-xs text-slate-700">
                <div>
                  <dt className="font-semibold text-slate-900">Eingereicht</dt>
                  <dd>
                    Dein Lead wurde bei uns erfasst. Wir prüfen die Angaben und bereiten
                    die Kontaktaufnahme vor.
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-900">Kontaktiert</dt>
                  <dd>
                    Wir haben den Interessenten kontaktiert und einen Termin zur
                    Baufinanzierungsberatung vereinbart.
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-900">Abgeschlossen</dt>
                  <dd>
                    Der Baufinanzierungsvertrag wurde unterschrieben. Die Finanzierung
                    ist erfolgreich zustande gekommen.
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-900">Deaktiviert</dt>
                  <dd>
                    Aus individuellen Gründen kam kein Vertrag zustande (z.&nbsp;B.
                    Absage, fehlende Unterlagen oder andere Entscheidungen).
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-900">Abgerechnet</dt>
                  <dd>
                    Die Provision für diesen Lead wurde dir gutgeschrieben. Die 100 €
                    werden entsprechend der Vereinbarung mit dir abgerechnet.
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  )
}

/* === Kleine Sub-Komponente für KPI-Karten === */

type MetricCardProps = {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  label: string
  value: string | number
  hint?: string
}

function MetricCard({ icon: Icon, label, value, hint }: MetricCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white p-4 shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
      <div className="absolute inset-x-0 -top-10 h-12 bg-gradient-to-b from-slate-100 to-transparent" />
      <div className="relative flex items-start gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-slate-50">
          <Icon className="h-4 w-4" />
        </div>
        <div className="space-y-1">
          <p className="text-xs text-slate-500">{label}</p>
          <p className="text-xl font-semibold tracking-tight text-slate-900">
            {value}
          </p>
          {hint && <p className="text-[11px] text-slate-500">{hint}</p>}
        </div>
      </div>
    </div>
  )
}
