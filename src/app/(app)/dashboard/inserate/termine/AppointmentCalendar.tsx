// src/app/dashboard/termine/AppointmentCalendar.tsx
'use client'

import { useEffect, useMemo, useState } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'

type AppointmentType =
  | 'Besichtigung'
  | 'Telefonat'
  | 'Vertragsunterzeichnung'
  | 'Sonstiges'

type AppointmentStatus = 'geplant' | 'erledigt' | 'abgesagt'

type PropertyStatus =
  | 'draft'
  | 'pending_payment'
  | 'pending_sync'
  | 'active'
  | 'deactivated'
  | 'marketed'
  | 'archived'
  | 'deleted'

type Property = {
  id: string
  name: string
  address: string
  status: PropertyStatus | string
}

type Appointment = {
  id: string
  title: string | null
  type: AppointmentType
  status: AppointmentStatus
  propertyId: string
  start: string // ISO
  end: string // ISO
  notes?: string | null
}

const weekdayShort = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function addMonths(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1)
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function toISODate(date: Date) {
  return date.toISOString().split('T')[0]
}

function getMonthGrid(currentMonth: Date) {
  const start = startOfMonth(currentMonth)
  // Montag als Start der Woche
  const startDay = (start.getDay() + 6) % 7 // 0 = Montag
  const gridStart = new Date(start)
  gridStart.setDate(start.getDate() - startDay)

  const days: Date[] = []
  for (let i = 0; i < 42; i++) {
    const d = new Date(gridStart)
    d.setDate(gridStart.getDate() + i)
    days.push(d)
  }
  return days
}

function fmtTime(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
}

function fmtDateTime(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleString('de-DE', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function statusBadgeClasses(status: AppointmentStatus) {
  switch (status) {
    case 'geplant':
      return 'bg-emerald-50 text-emerald-700 ring-emerald-200'
    case 'erledigt':
      return 'bg-slate-50 text-slate-700 ring-slate-200'
    case 'abgesagt':
      return 'bg-rose-50 text-rose-700 ring-rose-200'
    default:
      return 'bg-slate-50 text-slate-700 ring-slate-200'
  }
}

export default function AppointmentCalendar() {
  const [currentMonth, setCurrentMonth] = useState<Date>(startOfMonth(new Date()))
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date())

  const [properties, setProperties] = useState<Property[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(
    null
  )
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const activeProperties = useMemo(
    () => properties.filter((p) => p.status === 'active'),
    [properties]
  )

  const monthDays = useMemo(() => getMonthGrid(currentMonth), [currentMonth])

  const today = new Date()

  const appointmentsByDay = useMemo(() => {
    const map: Record<string, Appointment[]> = {}
    for (const appt of appointments) {
      const key = toISODate(new Date(appt.start))
      if (!map[key]) map[key] = []
      map[key].push(appt)
    }
    return map
  }, [appointments])

  const upcomingAppointments = useMemo(() => {
    const now = new Date()
    return [...appointments]
      .filter((a) => new Date(a.end) >= now)
      .sort((a, b) => +new Date(a.start) - +new Date(b.start))
      .slice(0, 5)
  }, [appointments])

  // Formular-States für Modal
  const [formPropertyId, setFormPropertyId] = useState<string>('')
  const [formTitle, setFormTitle] = useState<string>('')
  const [formType, setFormType] = useState<AppointmentType>('Besichtigung')
  const [formStatus, setFormStatus] = useState<AppointmentStatus>('geplant')
  const [formStart, setFormStart] = useState<string>('')
  const [formEnd, setFormEnd] = useState<string>('')
  const [formNotes, setFormNotes] = useState<string>('')

  // Initiales Laden: aktive Listings + Termine
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)

        const [listingRes, appointmentRes] = await Promise.all([
          fetch('/api/appointments/listings', {
            cache: 'no-store',
            headers: { 'Cache-Control': 'no-store' },
          }),
          fetch('/api/appointments', {
            cache: 'no-store',
            headers: { 'Cache-Control': 'no-store' },
          }),
        ])

        if (!listingRes.ok) {
          const body = await listingRes.json().catch(() => ({}))
          throw new Error(body.error || 'Fehler beim Laden der Immobilien')
        }

        if (!appointmentRes.ok) {
          const body = await appointmentRes.json().catch(() => ({}))
          throw new Error(body.error || 'Fehler beim Laden der Termine')
        }

        const listingsData = await listingRes.json()
        const appointmentsData = await appointmentRes.json()

        setProperties(listingsData.listings ?? [])

        const mappedAppointments: Appointment[] = (appointmentsData.appointments ?? []).map(
          (row: any) => ({
            id: row.id,
            title: row.title,
            type: row.type as AppointmentType,
            status: row.status as AppointmentStatus,
            propertyId: row.listing_id,
            start: row.start_at,
            end: row.end_at,
            notes: row.notes,
          })
        )

        setAppointments(mappedAppointments)

        // Default Immobilie fürs Formular
        if (listingsData.listings?.length) {
          setFormPropertyId(listingsData.listings[0].id)
        }

        // Default Datum / Uhrzeiten für Formular
        const baseDate = selectedDate ?? new Date()
        const isoDate = toISODate(baseDate)
        setFormStart(`${isoDate}T10:00`)
        setFormEnd(`${isoDate}T11:00`)
      } catch (e: any) {
        console.error(e)
        setError(e.message || 'Unerwarteter Fehler beim Laden der Daten')
      } finally {
        setLoading(false)
      }
    }

    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function resetForm() {
    const baseDate = selectedDate ?? new Date()
    const isoDate = toISODate(baseDate)
    setFormPropertyId((prev) => prev || activeProperties[0]?.id || '')
    setFormTitle('')
    setFormType('Besichtigung')
    setFormStatus('geplant')
    setFormStart(`${isoDate}T10:00`)
    setFormEnd(`${isoDate}T11:00`)
    setFormNotes('')
  }

  function openNewModal(date?: Date) {
    setIsEditing(false)
    setSelectedAppointment(null)
    if (date) {
      setSelectedDate(date)
    }
    resetForm()
    setIsModalOpen(true)
  }

  function openEditModal(appt: Appointment) {
    setIsEditing(true)
    setSelectedAppointment(appt)
    setFormPropertyId(appt.propertyId)
    setFormTitle(appt.title ?? '')
    setFormType(appt.type)
    setFormStatus(appt.status)
    // Für Input vom Typ datetime-local
    const start = new Date(appt.start)
    const end = new Date(appt.end)
    const startLocal = new Date(start.getTime() - start.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16)
    const endLocal = new Date(end.getTime() - end.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16)

    setFormStart(startLocal)
    setFormEnd(endLocal)
    setFormNotes(appt.notes ?? '')
    setIsModalOpen(true)
  }

  function closeModal() {
    setIsModalOpen(false)
    setSelectedAppointment(null)
  }

  function handleMonthChange(delta: number) {
    setCurrentMonth((prev) => addMonths(prev, delta))
  }

  function handleToday() {
    const now = new Date()
    setCurrentMonth(startOfMonth(now))
    setSelectedDate(now)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    const start = new Date(formStart)
    const end = new Date(formEnd)

    const property = activeProperties.find((p) => p.id === formPropertyId)
    const finalTitle =
      formTitle || `${formType} – ${property?.name ?? 'Immobilie'}`

    const payload = {
      listingId: formPropertyId,
      title: finalTitle,
      type: formType,
      status: formStatus,
      start: start.toISOString(),
      end: end.toISOString(),
      notes: formNotes || null,
    }

    try {
      if (isEditing && selectedAppointment) {
        const res = await fetch(`/api/appointments/${selectedAppointment.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })

        if (!res.ok) {
          const body = await res.json().catch(() => ({}))
          throw new Error(body.error || 'Fehler beim Aktualisieren des Termins')
        }

        const data = await res.json()
        const updated = data.appointment

        const mapped: Appointment = {
          id: updated.id,
          title: updated.title,
          type: updated.type as AppointmentType,
          status: updated.status as AppointmentStatus,
          propertyId: updated.listing_id,
          start: updated.start_at,
          end: updated.end_at,
          notes: updated.notes,
        }

        setAppointments((prev) =>
          prev.map((a) => (a.id === mapped.id ? mapped : a))
        )
      } else {
        const res = await fetch('/api/appointments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })

        if (!res.ok) {
          const body = await res.json().catch(() => ({}))
          throw new Error(body.error || 'Fehler beim Anlegen des Termins')
        }

        const data = await res.json()
        const created = data.appointment

        const mapped: Appointment = {
          id: created.id,
          title: created.title,
          type: created.type as AppointmentType,
          status: created.status as AppointmentStatus,
          propertyId: created.listing_id,
          start: created.start_at,
          end: created.end_at,
          notes: created.notes,
        }

        setAppointments((prev) => [...prev, mapped])
      }

      closeModal()
    } catch (e: any) {
      console.error(e)
      setError(e.message || 'Unerwarteter Fehler beim Speichern des Termins')
    }
  }

  async function handleDelete() {
    if (!isEditing || !selectedAppointment) return
    setError(null)

    try {
      const res = await fetch(`/api/appointments/${selectedAppointment.id}`, {
        method: 'DELETE',
      })

      if (!res.ok && res.status !== 204) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || 'Fehler beim Löschen des Termins')
      }

      setAppointments((prev) =>
        prev.filter((a) => a.id !== selectedAppointment.id)
      )
      closeModal()
    } catch (e: any) {
      console.error(e)
      setError(e.message || 'Unerwarteter Fehler beim Löschen des Termins')
    }
  }

  function getProperty(propertyId: string) {
    return properties.find((p) => p.id === propertyId)
  }

  const currentMonthLabel = useMemo(
    () =>
      currentMonth.toLocaleDateString('de-DE', {
        month: 'long',
        year: 'numeric',
      }),
    [currentMonth]
  )

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
      {/* Kalender-Bereich */}
      <div className="rounded-2xl border border-white/60 bg-white/80 p-4 sm:p-5 shadow-sm backdrop-blur-xl">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-100 bg-slate-50/70 px-3 py-1 text-[11px] text-slate-600">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Termine & Besichtigungen
            </div>
            <h2 className="mt-2 text-lg font-semibold text-slate-900">
              Monatsübersicht
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => handleMonthChange(-1)}
              className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 hover:border-slate-300 hover:bg-slate-50"
            >
              ◀︎
              <span className="ml-1 hidden sm:inline">Monat zurück</span>
            </button>
            <button
              type="button"
              onClick={handleToday}
              className="inline-flex items-center rounded-full border border-slate-800 bg-slate-900 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-slate-800"
            >
              Heute
            </button>
            <button
              type="button"
              onClick={() => handleMonthChange(1)}
              className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 hover:border-slate-300 hover:bg-slate-50"
            >
              <span className="mr-1 hidden sm:inline">Monat vor</span>
              ▶︎
            </button>
          </div>
        </div>

        {/* Monatstitel + Fehler/Loading */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-col gap-1">
            <p className="text-base font-medium text-slate-900 capitalize">
              {currentMonthLabel}
            </p>
            {loading && (
              <p className="text-xs text-slate-500">
                Lade Termine & Immobilien …
              </p>
            )}
            {error && (
              <p className="text-xs text-rose-600 max-w-sm">
                {error}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => openNewModal(selectedDate ?? new Date())}
            className="inline-flex items-center rounded-full border border-slate-200 bg-slate-900 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-slate-800 disabled:opacity-60"
            disabled={loading || activeProperties.length === 0}
          >
            + Neuer Termin
          </button>
        </div>

        {/* Kalender-Gitter */}
        <div className="mt-5">
          {/* Wochentage */}
          <div className="grid grid-cols-7 text-center text-[11px] font-medium uppercase tracking-wide text-slate-500">
            {weekdayShort.map((day) => (
              <div key={day} className="pb-2">
                {day}
              </div>
            ))}
          </div>

          {/* Tage */}
          <div className="grid grid-cols-7 gap-y-1 text-sm">
            {monthDays.map((day, idx) => {
              const iso = toISODate(day)
              const isCurrentMonth = day.getMonth() === currentMonth.getMonth()
              const isTodayDay = isSameDay(day, today)
              const isSelected = selectedDate && isSameDay(day, selectedDate)
              const dayAppointments = appointmentsByDay[iso] || []

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSelectedDate(day)
                    // Auf Handy direkt neues Modal anbieten, wenn Immobilie gewählt
                    if (window.innerWidth < 640 && activeProperties.length > 0) {
                      openNewModal(day)
                    }
                  }}
                  className={[
                    'group flex h-20 sm:h-24 flex-col border-t border-slate-100 px-1.5 pb-1.5 pt-1 text-left transition',
                    !isCurrentMonth ? 'bg-slate-50/60 text-slate-400' : 'bg-white/0',
                    isSelected
                      ? 'ring-1 ring-slate-900/70 bg-slate-900/5'
                      : 'hover:bg-slate-50',
                  ].join(' ')}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={[
                        'inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium',
                        isTodayDay
                          ? 'bg-slate-900 text-white'
                          : 'text-slate-700 group-hover:bg-slate-900/5',
                      ].join(' ')}
                    >
                      {day.getDate()}
                    </span>
                    {dayAppointments.length > 0 && (
                      <span className="rounded-full bg-slate-900/5 px-2 py-0.5 text-[10px] text-slate-600">
                        {dayAppointments.length}
                      </span>
                    )}
                  </div>

                  <div className="mt-1 flex flex-1 flex-col gap-0.5 overflow-hidden">
                    {dayAppointments.slice(0, 3).map((appt) => {
                      const prop = getProperty(appt.propertyId)
                      return (
                        <div
                          key={appt.id}
                          onClick={(ev) => {
                            ev.stopPropagation()
                            openEditModal(appt)
                          }}
                          className="flex cursor-pointer items-center gap-1 rounded-md bg-slate-900/5 px-1.5 py-0.5 text-[11px] text-slate-700 hover:bg-slate-900/10"
                        >
                          <span className="truncate">
                            {appt.type} {prop ? `· ${prop.name}` : ''}
                          </span>
                        </div>
                      )
                    })}
                    {dayAppointments.length > 3 && (
                      <span className="text-[10px] text-slate-400">
                        + {dayAppointments.length - 3} weitere
                      </span>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Rechte Spalte: Nächste Termine & Filter */}
      <div className="space-y-4">
        {/* Filter: Immobilie */}
        <div className="rounded-2xl border border-white/60 bg-white/80 p-4 shadow-sm backdrop-blur-xl">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Quick-Filter
          </p>
          <p className="mt-1 text-sm text-slate-700">
            Termine nach Immobilie filtern und neue Besichtigungen planen.
          </p>
          <div className="mt-3">
            <label className="text-xs font-medium text-slate-600">
              Immobilie auswählen
            </label>
            <select
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900/40"
              value={formPropertyId}
              onChange={(e) => setFormPropertyId(e.target.value)}
              disabled={loading || activeProperties.length === 0}
            >
              <option value="">– Bitte auswählen –</option>
              {activeProperties.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} – {p.address}
                </option>
              ))}
            </select>
            {activeProperties.length === 0 && !loading && (
              <p className="mt-1 text-[11px] text-slate-500">
                Du hast aktuell keine aktiven Inserate. Aktiviere ein Listing, um
                Termine zu planen.
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => openNewModal(selectedDate ?? new Date())}
            className="mt-3 inline-flex w-full items-center justify-center rounded-xl border border-slate-200 bg-slate-900 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-800 disabled:opacity-60"
            disabled={loading || activeProperties.length === 0}
          >
            + Termin für ausgewählte Immobilie
          </button>
        </div>

        {/* Nächste Termine */}
        <div className="rounded-2xl border border-white/60 bg-white/80 p-4 shadow-sm backdrop-blur-xl">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-medium text-slate-900">Nächste Termine</p>
            <span className="rounded-full bg-slate-900/5 px-2 py-0.5 text-[11px] text-slate-600">
              {upcomingAppointments.length} offen
            </span>
          </div>

          <div className="mt-3 space-y-2 max-h-72 overflow-y-auto pr-1">
            {upcomingAppointments.length === 0 && !loading && (
              <p className="text-sm text-slate-500">
                Aktuell sind keine anstehenden Termine geplant.
              </p>
            )}

            {upcomingAppointments.map((appt) => {
              const prop = getProperty(appt.propertyId)
              return (
                <button
                  key={appt.id}
                  type="button"
                  onClick={() => openEditModal(appt)}
                  className="w-full rounded-xl border border-slate-100 bg-white px-3 py-2 text-left text-sm text-slate-800 shadow-sm transition hover:border-slate-200 hover:bg-slate-50"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium text-slate-900">
                      {appt.type}
                      {prop ? ` · ${prop.name}` : ''}
                    </p>
                    <span
                      className={
                        'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ' +
                        statusBadgeClasses(appt.status)
                      }
                    >
                      {appt.status}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-slate-600">
                    {fmtDateTime(appt.start)} – {fmtTime(appt.end)}
                  </p>
                  {prop && (
                    <p className="mt-0.5 text-xs text-slate-500 truncate">
                      {prop.address}
                    </p>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 px-3 py-6 sm:px-4">
          <div className="relative w-full max-w-xl max-h-[100vh] overflow-y-auto rounded-2xl border border-white/40 bg-white/90 p-4 sm:p-5 shadow-2xl backdrop-blur-2xl">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  {isEditing ? 'Termin bearbeiten' : 'Neuen Termin anlegen'}
                </p>
                <h3 className="mt-1 text-base font-semibold text-slate-900">
                  {isEditing ? 'Details anpassen' : 'Besichtigung & Termine planen'}
                </h3>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-full border border-slate-200 bg-white p-1 text-slate-500 hover:bg-slate-50"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>

            <form className="mt-4 space-y-3" onSubmit={handleSave}>
              {/* Immobilie */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-600">
                  Immobilie <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900/40"
                  value={formPropertyId}
                  onChange={(e) => setFormPropertyId(e.target.value)}
                  disabled={activeProperties.length === 0}
                >
                  <option value="">– Bitte auswählen –</option>
                  {activeProperties.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} – {p.address}
                    </option>
                  ))}
                </select>
              </div>

              {/* Terminart & Status */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-600">
                    Terminart
                  </label>
                  <select
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900/40"
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as AppointmentType)}
                  >
                    <option>Besichtigung</option>
                    <option>Telefonat</option>
                    <option>Vertragsunterzeichnung</option>
                    <option>Sonstiges</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-600">
                    Status
                  </label>
                  <select
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900/40"
                    value={formStatus}
                    onChange={(e) =>
                      setFormStatus(e.target.value as AppointmentStatus)
                    }
                  >
                    <option value="geplant">geplant</option>
                    <option value="erledigt">erledigt</option>
                    <option value="abgesagt">abgesagt</option>
                  </select>
                </div>
              </div>

              {/* Titel */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-600">
                  Titel (optional – sonst wird automatisch generiert)
                </label>
                <input
                  type="text"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900/40"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="z. B. Erstbesichtigung mit Interessenten"
                />
              </div>

              {/* Start/Ende */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-600">
                    Startzeit <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900/40"
                    value={formStart}
                    onChange={(e) => setFormStart(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-600">
                    Endzeit <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900/40"
                    value={formEnd}
                    onChange={(e) => setFormEnd(e.target.value)}
                  />
                </div>
              </div>

              {/* Notizen */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-600">
                  Notizen (optional)
                </label>
                <textarea
                  rows={3}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900/40"
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="z. B. Treffpunkt vor der Haustür, Interessent bringt Unterlagen mit …"
                />
              </div>

              {/* Footer */}
              <div className="mt-4 flex flex-col gap-2 border-t border-slate-100 pt-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-[11px] text-slate-500">
                  Termin wird direkt in deiner Datenbank gespeichert. <br className="sm:hidden" />
                  Änderungen sind jederzeit möglich.
                </div>
                <div className="flex flex-wrap items-center justify-end gap-2">
                  {isEditing && (
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="inline-flex items-center rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-100"
                    >
                      Termin löschen
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={closeModal}
                    className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Abbrechen
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center rounded-xl border border-slate-900 bg-slate-900 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-slate-800"
                  >
                    {isEditing ? 'Änderungen speichern' : 'Termin anlegen'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
