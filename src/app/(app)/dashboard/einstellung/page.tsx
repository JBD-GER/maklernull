'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseClient } from '@/lib/supabase-client'

type Profile = {
  id: string
  first_name?: string
  last_name?: string
  company_name?: string
  street?: string
  house_number?: string
  postal_code?: string
  city?: string
}

export default function SettingsPage() {
  const router = useRouter()
  const supa = supabaseClient()

  const [loadingProfile, setLoadingProfile] = useState(true)

  const [profile, setProfile] = useState<Profile | null>(null)
  const [editing, setEditing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [street, setStreet] = useState('')
  const [houseNumber, setHouseNumber] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [city, setCity] = useState('')

  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  useEffect(() => {
    ;(async () => {
      const {
        data: { user },
        error,
      } = await supa.auth.getUser()
      if (error || !user) {
        router.push('/login')
        return
      }

      try {
        const res = await fetch('/api/users')
        const { profile: p } = await res.json()
        setProfile(p)
        setFirstName(p?.first_name ?? '')
        setLastName(p?.last_name ?? '')
        setCompanyName(p?.company_name ?? '')
        setStreet(p?.street ?? '')
        setHouseNumber(p?.house_number ?? '')
        setPostalCode(p?.postal_code ?? '')
        setCity(p?.city ?? '')
      } catch (e) {
        console.error('Profil laden fehlgeschlagen:', e)
      } finally {
        setLoadingProfile(false)
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const isDirty = useMemo(() => {
    if (!profile) return false
    return (
      firstName !== (profile.first_name || '') ||
      lastName !== (profile.last_name || '') ||
      companyName !== (profile.company_name || '') ||
      street !== (profile.street || '') ||
      houseNumber !== (profile.house_number || '') ||
      postalCode !== (profile.postal_code || '') ||
      city !== (profile.city || '')
    )
  }, [profile, firstName, lastName, companyName, street, houseNumber, postalCode, city])

  const fullAddress = useMemo(() => {
    const parts = [
      `${street || ''} ${houseNumber || ''}`.trim(),
      `${postalCode || ''} ${city || ''}`.trim(),
    ].filter(Boolean)
    return parts.length ? parts.join(', ') : '—'
  }, [street, houseNumber, postalCode, city])

  const handleSaveProfile = async () => {
    if (!profile) return
    setError(null)

    const res = await fetch('/api/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        company_name: companyName,
        street,
        house_number: houseNumber,
        postal_code: postalCode,
        city,
      }),
    })

    const json = await res.json().catch(() => ({} as any))
    if (!res.ok) {
      setError(json?.error || 'Fehler beim Speichern')
      return
    }

    setEditing(false)
    setProfile((p) =>
      p
        ? {
            ...p,
            first_name: firstName,
            last_name: lastName,
            company_name: companyName,
            street,
            house_number: houseNumber,
            postal_code: postalCode,
            city,
          }
        : p,
    )
  }

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'Möchten Sie Ihr Konto wirklich dauerhaft löschen? Alle Daten werden entfernt und der Zugriff geht verloren.',
    )
    if (!confirmed) return

    setDeleteError(null)
    setDeleting(true)

    try {
      const res = await fetch('/api/account/delete', { method: 'POST' })

      if (!res.ok) {
        const json = await res.json().catch(() => ({} as any))
        setDeleteError(json?.error || 'Konto konnte nicht gelöscht werden.')
        setDeleting(false)
        return
      }

      await supa.auth.signOut()
      router.push('/login?deleted=1')
    } catch (e) {
      console.error(e)
      setDeleteError('Unerwarteter Fehler beim Löschen des Kontos.')
      setDeleting(false)
    }
  }

  return (
    <div className="px-4 py-6 text-slate-700 sm:px-6 lg:px-10">
      <div className="space-y-6">
        {/* Header – Glass Hero */}
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
                Einstellungen
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                Stammdaten und Kontosicherheit an einem Ort.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/80 px-3 py-1 text-xs text-slate-600 shadow-sm backdrop-blur-xl">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span>Konto aktiv</span>
            </div>
          </div>
        </div>

        {/* PROFIL (ohne Logo) */}
        <section className="rounded-3xl border border-white/60 bg-white/75 p-4 shadow-[0_14px_50px_rgba(15,23,42,0.16)] backdrop-blur-2xl sm:p-5">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-semibold tracking-tight text-slate-900">
                Profil
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Diese Angaben erscheinen z.B. auf Dokumenten und E-Mails.
              </p>
            </div>
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="inline-flex items-center justify-center rounded-lg border border-white/70 bg-white/80 px-3 py-1.5 text-xs font-medium text-slate-800 shadow-sm backdrop-blur-xl hover:bg-white"
              >
                Bearbeiten
              </button>
            ) : (
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleSaveProfile}
                  disabled={!isDirty}
                  className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-1.5 text-xs font-semibold text-white shadow hover:bg-black disabled:opacity-50"
                >
                  Speichern
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="inline-flex items-center justify-center rounded-lg border border-white/70 bg-white/80 px-3 py-1.5 text-xs font-medium text-slate-800 shadow-sm hover:bg-white"
                >
                  Abbrechen
                </button>
              </div>
            )}
          </div>

          {error && (
            <div className="mb-3 rounded-xl border border-rose-200 bg-rose-50/80 px-3 py-2 text-xs text-rose-800">
              {error}
            </div>
          )}

          {loadingProfile ? (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="h-9 animate-pulse rounded-lg bg-slate-200/70" />
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {[
                  { label: 'Vorname', val: firstName, set: setFirstName },
                  { label: 'Nachname', val: lastName, set: setLastName },
                  {
                    label: 'Firma',
                    val: companyName,
                    set: setCompanyName,
                  },
                  { label: 'Straße', val: street, set: setStreet },
                  {
                    label: 'Hausnummer',
                    val: houseNumber,
                    set: setHouseNumber,
                  },
                  {
                    label: 'PLZ',
                    val: postalCode,
                    set: setPostalCode,
                  },
                  { label: 'Ort', val: city, set: setCity },
                ].map((f) => (
                  <div key={f.label}>
                    <label className="mb-1 block text-xs font-medium text-slate-700">
                      {f.label}
                    </label>
                    <input
                      className={`w-full rounded-lg px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition-all
                        ${
                          editing
                            ? 'border border-slate-300 bg-white focus:border-slate-500 focus:ring-2 focus:ring-slate-300'
                            : 'border border-slate-200 bg-slate-50'
                        } disabled:opacity-70`}
                      value={f.val}
                      onChange={(e) => f.set(e.target.value)}
                      disabled={!editing}
                    />
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-2xl border border-white/70 bg-white/70 px-3 py-2 text-xs text-slate-700">
                <span className="font-medium text-slate-800">Adresse gesamt:</span>{' '}
                {fullAddress}
              </div>
            </>
          )}
        </section>

        {/* KONTO LÖSCHEN */}
        <section className="mt-2 rounded-3xl border border-rose-100 bg-rose-50/70 px-4 py-4 text-sm text-rose-900 shadow-[0_14px_50px_rgba(248,113,113,0.25)] backdrop-blur-2xl sm:px-5">
          <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-semibold tracking-tight">
                Konto löschen
              </h2>
              <p className="mt-0.5 text-xs text-rose-800/90">
                Diese Aktion kann nicht rückgängig gemacht werden. Alle Daten,
                Projekte und Rechnungsinformationen werden entfernt.
              </p>
            </div>
            <button
              type="button"
              onClick={handleDeleteAccount}
              disabled={deleting}
              className="inline-flex items-center justify-center rounded-full border border-rose-200 bg-rose-600 px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-rose-700 disabled:opacity-60"
            >
              {deleting ? 'Konto wird gelöscht…' : 'Konto unwiderruflich löschen'}
            </button>
          </div>

          {deleteError && (
            <div className="rounded-2xl border border-rose-200 bg-white/70 px-3 py-2 text-xs text-rose-800">
              {deleteError}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
