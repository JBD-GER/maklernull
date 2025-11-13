'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
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
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
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

      // Profil + Logo
      try {
        const res = await fetch('/api/users')
        const { profile: p, logo_url } = await res.json()
        setProfile(p)
        setLogoUrl(logo_url || null)
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

  const uploadLogo = async () => {
    if (!file) return
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/users/logo', { method: 'POST', body: fd })
    if (res.ok) {
      const { logo_url } = await (await fetch('/api/users')).json()
      setLogoUrl(logo_url || null)
      setFile(null)
    }
  }

  const deleteLogo = async () => {
    await fetch('/api/users/logo', { method: 'DELETE' })
    setLogoUrl(null)
  }

  // Dropzone visueller Ring
  const dropRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = dropRef.current
    if (!el) return
    const onDrop = (e: DragEvent) => {
      e.preventDefault()
      const f = Array.from(e.dataTransfer?.files || [])[0]
      if (f && f.type.startsWith('image/')) setFile(f)
      el.classList.remove('ring-2', 'ring-slate-300')
    }
    const onOver = (e: DragEvent) => {
      e.preventDefault()
      el.classList.add('ring-2', 'ring-slate-300')
    }
    const onLeave = () => el.classList.remove('ring-2', 'ring-slate-300')
    el.addEventListener('drop', onDrop)
    el.addEventListener('dragover', onOver)
    el.addEventListener('dragleave', onLeave)
    return () => {
      el.removeEventListener('drop', onDrop)
      el.removeEventListener('dragover', onOver)
      el.removeEventListener('dragleave', onLeave)
    }
  }, [])

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

        {/* PROFIL & LOGO */}
        <section className="rounded-3xl border border-white/60 bg-white/75 p-4 shadow-[0_14px_50px_rgba(15,23,42,0.16)] backdrop-blur-2xl sm:p-5">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-semibold tracking-tight text-slate-900">
                Profil & Logo
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Diese Angaben erscheinen auf Angeboten, Rechnungen und E-Mails.
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

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.3fr)]">
            {/* Logo / Upload */}
            <div>
              {loadingProfile ? (
                <div className="h-40 w-full animate-pulse rounded-2xl border border-white/60 bg-white/70 shadow" />
              ) : logoUrl ? (
                <div className="space-y-3">
                  <div className="relative w-full rounded-2xl border border-white/70 bg-white/85 p-3 shadow-sm">
                    <div className="h-40 w-full overflow-hidden rounded-xl bg-white">
                      <img
                        src={logoUrl}
                        alt="Logo"
                        className="h-full w-full object-contain"
                        draggable={false}
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <label className="inline-flex cursor-pointer items-center rounded-lg border border-white/70 bg-white/85 px-3 py-1.5 text-xs text-slate-800 shadow-sm hover:bg-white">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                        className="hidden"
                      />
                      Logo ersetzen…
                    </label>
                    <button
                      onClick={uploadLogo}
                      disabled={!file}
                      className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white shadow hover:bg-black disabled:opacity-40"
                    >
                      Hochladen
                    </button>
                    <button
                      onClick={deleteLogo}
                      className="rounded-lg border border-white/70 bg-white/85 px-3 py-1.5 text-xs text-slate-800 shadow-sm hover:bg-white"
                    >
                      Logo löschen
                    </button>
                  </div>

                  <p className="text-[11px] leading-snug text-slate-500">
                    PNG oder JPG, ideal 1500×600&nbsp;px (mind. 1250×500&nbsp;px),
                    sRGB. PNG mit transparentem Hintergrund empfohlen; SVG/WebP
                    werden nicht unterstützt.
                  </p>
                </div>
              ) : (
                <div
                  ref={dropRef}
                  className="flex h-40 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white/70 px-4 text-center text-xs shadow-sm"
                >
                  <p className="mb-2 text-slate-600">
                    Logo hier ablegen oder Datei auswählen
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                    className="mx-auto block text-xs"
                  />
                  <button
                    onClick={uploadLogo}
                    disabled={!file}
                    className="mt-3 rounded-lg border border-white/70 bg-white/90 px-4 py-1.5 text-xs font-semibold text-slate-900 shadow-sm hover:bg-white disabled:opacity-50"
                  >
                    Hochladen
                  </button>
                  <p className="mt-2 text-[11px] leading-snug text-slate-500">
                    PNG oder JPG, ideal 1500×600&nbsp;px, PNG mit transparentem
                    Hintergrund empfohlen.
                  </p>
                </div>
              )}
            </div>

            {/* Stammdaten */}
            <div>
              {loadingProfile ? (
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-9 animate-pulse rounded-lg bg-slate-200/70"
                    />
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
                          className="w-full rounded-lg border border-white/70 bg-white/95 px-3 py-2 text-sm text-slate-800 shadow-sm outline-none focus:ring-2 focus:ring-slate-300 disabled:opacity-70"
                          value={f.val}
                          onChange={(e) => f.set(e.target.value)}
                          disabled={!editing}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 rounded-2xl border border-white/70 bg-white/70 px-3 py-2 text-xs text-slate-700">
                    <span className="font-medium text-slate-800">
                      Adresse gesamt:
                    </span>{' '}
                    {fullAddress}
                  </div>
                </>
              )}
            </div>
          </div>
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
