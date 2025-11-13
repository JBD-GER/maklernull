'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
  PhoneIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline'

const PRIMARY = '#5865f2'
const TERMS_VERSION = '1'
const PRIVACY_VERSION = '1'

function validateEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())
}

function passwordScore(pw: string) {
  let s = 0
  if (pw.length >= 8) s++
  if (/[A-Z]/.test(pw)) s++
  if (/[a-z]/.test(pw)) s++
  if (/\d/.test(pw)) s++
  if (/[^A-Za-z0-9]/.test(pw)) s++
  return Math.min(s, 4)
}

export default function RegisterPage() {
  const router = useRouter()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [street, setStreet] = useState('')
  const [houseNo, setHouseNo] = useState('')
  const [zip, setZip] = useState('')
  const [city, setCity] = useState('')

  const [companyName, setCompanyName] = useState('')

  const [acceptTerms, setAcceptTerms] = useState(false)
  const [acceptPrivacy, setAcceptPrivacy] = useState(false)

  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const emailValid = useMemo(() => validateEmail(email), [email])
  const pwScore = useMemo(() => passwordScore(password), [password])
  const pwLabel = ['zu kurz', 'schwach', 'okay', 'gut', 'stark'][pwScore]

  const canSubmit =
    !loading &&
    firstName.trim() &&
    lastName.trim() &&
    emailValid &&
    password.length >= 8 &&
    street.trim() &&
    houseNo.trim() &&
    zip.trim() &&
    city.trim() &&
    acceptTerms &&
    acceptPrivacy

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!canSubmit) {
      setError(
        'Bitte alle Pflichtfelder korrekt ausfüllen und AGB/Datenschutz akzeptieren.'
      )
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          first_name: firstName,
          last_name: lastName,
          company_name: companyName || null,
          street,
          house_number: houseNo,
          postal_code: zip,
          city,
          // Land im UI entfernt – falls Backend es braucht, setzen wir DE fix
          country: 'DE',
          accept_terms: true,
          accept_privacy: true,
          terms_version: TERMS_VERSION,
          privacy_version: PRIVACY_VERSION,
        }),
      })

      const payload = await res.json().catch(() => ({}))

      if (!res.ok) {
        setError(payload.error ?? 'Unbekannter Fehler bei der Registrierung.')
        setLoading(false)
        return
      }

      router.push('/danke')
    } catch (err: any) {
      setError(err?.message ?? 'Netzwerkfehler.')
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020617]">
      {/* Hintergrund-Glows */}
      <div
        className="pointer-events-none absolute inset-0 -z-20"
        style={{
          background:
            'radial-gradient(1200px 520px at 50% -10%, rgba(88,101,242,0.14), transparent),' +
            'radial-gradient(900px 420px at 10% 0%, rgba(15,23,42,0.9), transparent),' +
            'radial-gradient(900px 420px at 90% 0%, rgba(15,23,42,0.9), transparent)',
        }}
      />
      <motion.div
        className="pointer-events-none absolute -top-40 -left-32 h-[34rem] w-[34rem] rounded-full blur-3xl"
        style={{
          background:
            'radial-gradient(closest-side, rgba(88,101,242,.28), rgba(88,101,242,0))',
        }}
        initial={{ opacity: 0.45, scale: 0.9 }}
        animate={{ opacity: [0.45, 0.7, 0.45], scale: [0.9, 1.02, 0.9] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="pointer-events-none absolute -bottom-44 -right-40 h-[36rem] w-[36rem] rounded-full blur-3xl"
        style={{
          background:
            'radial-gradient(closest-side, rgba(79,70,229,.25), rgba(79,70,229,0))',
        }}
        initial={{ opacity: 0.4, scale: 0.96 }}
        animate={{ opacity: [0.4, 0.65, 0.4], scale: [0.96, 1.03, 0.96] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-10 sm:py-16">
        {/* Top-Badge + Headline */}
        <div className="mb-8 text-center">
          <span className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full bg-slate-900/60 px-3 py-1 text-[11px] font-semibold text-slate-100 ring-1 ring-indigo-400/40 backdrop-blur">
            <ShieldCheckIcon className="h-4 w-4 text-indigo-300" />
            Immobilien inserieren ohne Makler – ein Preis für alle Portale
          </span>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-50 sm:text-[32px]">
            Erstelle jetzt deinen Zugang für alle Immobilienportale
          </h1>
          <p className="mt-2 text-sm text-slate-300">
            Einmal Inserat erfassen – wir kümmern uns um die Veröffentlichung auf allen
            angebundenen Portalen. Kein Abo, keine Maklerprovision.
          </p>
        </div>

        {/* Main Card */}
        <motion.div
          className="grid grid-cols-1 gap-6 rounded-[26px] border border-white/10 bg-white/5 p-5 shadow-[0_30px_120px_rgba(0,0,0,0.55)] backdrop-blur-2xl sm:p-7 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]"
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
        >
          {/* Formularcard */}
          <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-4 shadow-[0_18px_60px_rgba(15,23,42,0.7)] backdrop-blur-2xl sm:p-5">
            <div className="mb-4 text-center sm:text-left">
              <h2 className="text-lg font-semibold tracking-tight text-slate-50">
                Zugang anlegen
              </h2>
              <p className="mt-1 text-xs text-slate-300">
                Deine Zugangsdaten und Rechnungsadresse – das Inserat selbst kannst du
                später in Ruhe erstellen.
              </p>
            </div>

            {error && (
              <div className="mb-4 rounded-lg border border-rose-400/40 bg-rose-500/10 px-3 py-2 text-xs text-rose-100">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} autoComplete="on" className="space-y-4">
              {/* Name */}
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-300">
                    Persönliche Daten
                  </span>
                </div>
                <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-[11px] font-medium text-slate-200">
                      Vorname
                    </label>
                    <input
                      name="given-name"
                      autoComplete="given-name"
                      className="w-full rounded-xl border border-slate-500/50 bg-slate-950/60 px-3.5 py-2.5 text-sm text-slate-50 shadow-[0_8px_30px_rgba(15,23,42,0.7)] outline-none placeholder:text-slate-500 focus:border-indigo-400/80 focus:ring-2 focus:ring-indigo-500/60"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[11px] font-medium text-slate-200">
                      Nachname
                    </label>
                    <input
                      name="family-name"
                      autoComplete="family-name"
                      className="w-full rounded-xl border border-slate-500/50 bg-slate-950/60 px-3.5 py-2.5 text-sm text-slate-50 shadow-[0_8px_30px_rgba(15,23,42,0.7)] outline-none placeholder:text-slate-500 focus:border-indigo-400/80 focus:ring-2 focus:ring-indigo-500/60"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Firma optional */}
              <div>
                <label className="mb-1 block text-[11px] font-medium text-slate-200">
                  Firmenname (optional)
                </label>
                <input
                  name="organization"
                  autoComplete="organization"
                  className="w-full rounded-xl border border-slate-500/40 bg-slate-950/60 px-3.5 py-2.5 text-sm text-slate-50 shadow-[0_8px_30px_rgba(15,23,42,0.7)] outline-none placeholder:text-slate-500 focus:border-indigo-400/80 focus:ring-2 focus:ring-indigo-500/60"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="z. B. Hausverwaltung Müller"
                />
              </div>

              {/* Rechnungsadresse */}
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-300">
                    Rechnungsadresse
                  </span>
                </div>
                <div className="mt-2 space-y-3">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-[11px] font-medium text-slate-200">
                        Straße
                      </label>
                      <input
                        name="street-address"
                        autoComplete="address-line1"
                        className="w-full rounded-xl border border-slate-500/40 bg-slate-950/60 px-3.5 py-2.5 text-sm text-slate-50 shadow-[0_8px_30px_rgba(15,23,42,0.7)] outline-none placeholder:text-slate-500 focus:border-indigo-400/80 focus:ring-2 focus:ring-indigo-500/60"
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        required
                        placeholder="Beispielstraße"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[11px] font-medium text-slate-200">
                        Hausnummer
                      </label>
                      <input
                        name="address-line2"
                        autoComplete="address-line2"
                        className="w-full rounded-xl border border-slate-500/40 bg-slate-950/60 px-3.5 py-2.5 text-sm text-slate-50 shadow-[0_8px_30px_rgba(15,23,42,0.7)] outline-none placeholder:text-slate-500 focus:border-indigo-400/80 focus:ring-2 focus:ring-indigo-500/60"
                        value={houseNo}
                        onChange={(e) => setHouseNo(e.target.value)}
                        required
                        placeholder="12A"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-[11px] font-medium text-slate-200">
                        PLZ
                      </label>
                      <input
                        name="postal-code"
                        autoComplete="postal-code"
                        inputMode="numeric"
                        className="w-full rounded-xl border border-slate-500/40 bg-slate-950/60 px-3.5 py-2.5 text-sm text-slate-50 shadow-[0_8px_30px_rgba(15,23,42,0.7)] outline-none placeholder:text-slate-500 focus:border-indigo-400/80 focus:ring-2 focus:ring-indigo-500/60"
                        value={zip}
                        onChange={(e) => setZip(e.target.value)}
                        required
                        placeholder="10115"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[11px] font-medium text-slate-200">
                        Ort
                      </label>
                      <input
                        name="address-level2"
                        autoComplete="address-level2"
                        className="w-full rounded-xl border border-slate-500/40 bg-slate-950/60 px-3.5 py-2.5 text-sm text-slate-50 shadow-[0_8px_30px_rgba(15,23,42,0.7)] outline-none placeholder:text-slate-500 focus:border-indigo-400/80 focus:ring-2 focus:ring-indigo-500/60"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                        placeholder="Berlin"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* E-Mail */}
              <div>
                <label className="mb-1 block text-[11px] font-medium text-slate-200">
                  E-Mail
                </label>
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={[
                    'w-full rounded-xl border px-3.5 py-2.5 text-sm text-slate-50 outline-none shadow-[0_8px_30px_rgba(15,23,42,0.7)] focus:bg-slate-950',
                    email.length === 0
                      ? 'border-slate-500/40 bg-slate-950/60 placeholder:text-slate-500 focus:border-indigo-400/80 focus:ring-2 focus:ring-indigo-500/60'
                      : emailValid
                      ? 'border-emerald-400/70 bg-slate-950/70 focus:ring-2 focus:ring-emerald-400/70'
                      : 'border-amber-400/70 bg-slate-950/70 focus:ring-2 focus:ring-amber-400/70',
                  ].join(' ')}
                  placeholder="name@beispiel.de"
                />
              </div>

              {/* Passwort */}
              <div>
                <label className="mb-1 block text-[11px] font-medium text-slate-200">
                  Passwort
                </label>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    name="new-password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    className="w-full rounded-xl border border-slate-500/40 bg-slate-950/60 px-3.5 py-2.5 pr-11 text-sm text-slate-50 shadow-[0_8px_30px_rgba(15,23,42,0.7)] outline-none placeholder:text-slate-500 focus:border-indigo-400/80 focus:ring-2 focus:ring-indigo-500/60"
                    placeholder="Mind. 8 Zeichen"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((s) => !s)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 hover:bg-slate-800/80 hover:text-slate-100"
                    aria-label={showPw ? 'Passwort verbergen' : 'Passwort anzeigen'}
                  >
                    {showPw ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(pwScore / 4) * 100}%`,
                      background:
                        pwScore < 2 ? '#f59e0b' : pwScore < 3 ? '#22c55e' : '#4ade80',
                      transition: 'width .25s ease',
                    }}
                  />
                </div>
                <p className="mt-1 text-[11px] text-slate-400">
                  Passwortstärke: {pwLabel}
                </p>
              </div>

              {/* Rechtliches */}
              <div className="space-y-2 rounded-xl border border-slate-600/60 bg-slate-950/60 px-3.5 py-3">
                <label className="flex items-start gap-2 text-xs text-slate-100">
  <input
    type="checkbox"
    name="accept-terms"
    className="mt-0.5 h-3.5 w-3.5 rounded border-slate-500 bg-slate-900 text-indigo-500 focus:ring-indigo-500"
    checked={acceptTerms}
    onChange={(e) => setAcceptTerms(e.target.checked)}
    required
  />
  <span>
    Ich akzeptiere die{' '}
    <Link
      href="/agb"
      className="underline underline-offset-2 text-white hover:text-indigo-200"
    >
      AGB
    </Link>
    .
  </span>
</label>

<label className="flex items-start gap-2 text-xs text-slate-100">
  <input
    type="checkbox"
    name="accept-privacy"
    className="mt-0.5 h-3.5 w-3.5 rounded border-slate-500 bg-slate-900 text-indigo-500 focus:ring-indigo-500"
    checked={acceptPrivacy}
    onChange={(e) => setAcceptPrivacy(e.target.checked)}
    required
  />
  <span>
    Ich habe die{' '}
    <Link
      href="/datenschutz"
      className="underline underline-offset-2 text-white hover:text-indigo-200"
    >
      Datenschutzerklärung
    </Link>{' '}
    gelesen und akzeptiere sie.
  </span>
</label>
                <p className="mt-1 text-[10px] text-slate-500">
                  Versionen: AGB v{TERMS_VERSION} · Datenschutz v{PRIVACY_VERSION}
                </p>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={!canSubmit}
                className="group relative mt-1 w-full overflow-hidden rounded-full bg-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_14px_40px_rgba(79,70,229,0.7)] transition enabled:hover:bg-indigo-600 disabled:opacity-40"
                style={{ backgroundColor: PRIMARY }}
              >
                <span
                  className={`${loading ? 'opacity-0' : 'opacity-100'} transition-opacity`}
                >
                  Zugang erstellen &amp; später inserieren
                </span>
                {loading && (
                  <span className="absolute inset-0 grid place-items-center">
                    <svg
                      className="h-5 w-5 animate-spin text-white"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-30"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-80"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                  </span>
                )}
              </button>

              <p className="mt-3 text-center text-[11px] text-slate-400">
                <CheckCircleIcon className="mr-1 inline h-4 w-4 align-[-2px] text-indigo-300" />
                Du zahlst erst, wenn du deine Immobilie tatsächlich inserierst – kein Abo.
              </p>

              <p className="mt-4 text-center text-xs text-slate-400">
                Bereits ein Konto?{' '}
                <Link
                  href="/login"
                  className="font-semibold text-slate-50 hover:text-indigo-300"
                >
                  Jetzt einloggen
                </Link>
              </p>
            </form>
          </div>

          {/* Info-Spalte / Vorteile */}
          <div className="flex min-h-full flex-col justify-center gap-8 rounded-2xl border border-white/10 bg-slate-900/40 p-4 shadow-[0_18px_60px_rgba(15,23,42,0.7)] backdrop-blur-2xl sm:p-5">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.18em] text-indigo-300">
                IMMOBILIEN INSERIEREN OHNE MAKLER
              </p>
              <h2 className="mt-2 text-2xl font-semibold leading-snug text-slate-50">
                Ein Preis, alle Portale.
                <br />
                Kein Abo. Kein Makler.
              </h2>

              {/* Vorteile (Pills) */}
              <div className="mt-4 flex flex-wrap gap-2">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/60 px-3 py-1 text-[11px] font-medium text-slate-50">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                  Ein Preis für alle Portale
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/60 px-3 py-1 text-[11px] font-medium text-slate-50">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                  Kein Abo, keine Maklerprovision
                </div>
              </div>

              {/* Checkliste */}
              <div className="mt-5 space-y-3 text-sm text-slate-100">
                {[
                  {
                    title: 'Inserat nur einmal anlegen',
                    text: 'Fotos hochladen, Beschreibung schreiben, Preis festlegen – alles zentral in deinem Zugang.',
                  },
                  {
                    title: 'Wir verteilen auf alle Portale',
                    text: 'Wir kümmern uns um die technische Übertragung zu den angebundenen Immobilienportalen.',
                  },
                  {
                    title: 'Anfragen zentral empfangen',
                    text: 'Alle Anfragen laufen übersichtlich an einer Stelle zusammen – kein Portal-Chaos mehr.',
                  },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-indigo-500/20 ring-1 ring-indigo-400/60">
                      <CheckCircleIcon className="h-3.5 w-3.5 text-indigo-200" />
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-slate-50">
                        {item.title}
                      </p>
                      <p className="text-[12px] text-slate-300">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Kontakt */}
            <div className="mt-6 space-y-2 text-[12px] text-slate-300">
              <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">
                Fragen zur Registrierung?
              </p>
              <div className="flex flex-wrap gap-2">
                <a
                  href="tel:+4950353169991"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-slate-900/60 px-3 py-1.5 text-xs font-medium text-slate-50 backdrop-blur hover:border-indigo-400/60 hover:text-white"
                >
                  <PhoneIcon className="h-4 w-4" />
                  +49&nbsp;5035&nbsp;3169999
                </a>
                <a
                  href="mailto:support@gleno.de"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-slate-900/60 px-3 py-1.5 text-xs font-medium text-slate-50 backdrop-blur hover:border-indigo-400/60 hover:text-white"
                >
                  <EnvelopeIcon className="h-4 w-4" />
                  hey@maklernull.de
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
