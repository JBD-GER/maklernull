'use client'

import { useEffect, useMemo, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  EyeIcon,
  EyeSlashIcon,
  EnvelopeIcon,
  LockClosedIcon,
  ArrowRightIcon,
  HomeModernIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline'
import { supabaseClient } from '@/lib/supabase-client'

const PRIMARY = '#0a1b40'
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (typeof window !== 'undefined' ? window.location.origin : 'https://maklernull.de')

function CheckEmailEffect({ onInfo }: { onInfo: (msg: string) => void }) {
  const qp = useSearchParams()
  useEffect(() => {
    if (qp?.get('check_email') === '1') {
      onInfo(
        'Wir haben Ihnen eine E-Mail geschickt. Bitte bestätigen Sie Ihre Adresse, um sich einloggen zu können.'
      )
    }
  }, [qp, onInfo])
  return null
}

export default function LoginPage() {
  const supabase = supabaseClient()
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const [canResend, setCanResend] = useState(false)

  const emailValid = useMemo(
    () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()),
    [email]
  )

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setInfo(null)
    setCanResend(false)

    if (!emailValid || password.length < 8) {
      setError('Bitte E-Mail und Passwort korrekt eingeben.')
      return
    }

    setLoading(true)
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (signInError) {
        setError(signInError.message)
        return
      }

      const { data, error: userError } = await supabase.auth.getUser()
      if (userError) {
        setError('Fehler beim Abrufen des Benutzers.')
        return
      }

      const user = data.user
      if (!user?.email_confirmed_at) {
        await supabase.auth.signOut()
        setError('Ihre E-Mail ist noch nicht bestätigt.')
        setCanResend(true)
        return
      }

      // Profil sicherstellen (z. B. Rolle "eigentümer", Routing bleibt zentral)
      try {
        await fetch('/api/profiles/ensure', { method: 'POST' })
      } catch {
        // ignorieren – Fallback Routing
      }

      router.push('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  async function handleResend() {
    setError(null)
    setInfo(null)

    if (!emailValid) {
      setError('Bitte zuerst eine gültige E-Mail eintragen.')
      return
    }

    setLoading(true)
    try {
      const { error: resendErr } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: { emailRedirectTo: `${SITE_URL}/auth/callback` },
      })
      if (resendErr) throw resendErr
      setInfo('Bestätigungslink wurde erneut gesendet.')
    } catch (err: any) {
      setError(err?.message ?? 'Konnte die E-Mail nicht erneut senden.')
    } finally {
      setLoading(false)
    }
  }

  async function handleResetPassword() {
    setError(null)
    setInfo(null)

    if (!emailValid) {
      setError('Bitte geben Sie Ihre E-Mail ein, um den Reset-Link zu erhalten.')
      return
    }

    setLoading(true)
    try {
      const { error: resetErr } =
        await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${SITE_URL}/neues-passwort`,
        })
      if (resetErr) throw resetErr
      setInfo(
        'Falls diese E-Mail bei uns hinterlegt ist, haben wir Ihnen einen Link zum Zurücksetzen geschickt.'
      )
    } catch (err: any) {
      setError(err?.message ?? 'Konnte die Reset-E-Mail nicht senden.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020617]">
      <Suspense fallback={null}>
        <CheckEmailEffect onInfo={setInfo} />
      </Suspense>

      {/* Hintergrund-Glow */}
      <div
        className="pointer-events-none absolute inset-0 -z-20"
        style={{
          background:
            'radial-gradient(1400px 520px at 50% -10%, rgba(10,27,64,0.45), transparent),' +
            'radial-gradient(900px 420px at 0% 0%, rgba(15,23,42,0.7), transparent),' +
            'radial-gradient(900px 420px at 100% 0%, rgba(15,23,42,0.7), transparent)',
        }}
      />
      <motion.div
        className="absolute -top-32 -left-32 h-[32rem] w-[32rem] rounded-full blur-3xl"
        style={{
          background:
            'radial-gradient(closest-side, rgba(15,23,42,.55), rgba(15,23,42,0))',
        }}
        initial={{ opacity: 0.5, scale: 0.9 }}
        animate={{ opacity: [0.45, 0.7, 0.45], scale: [0.9, 1.02, 0.9] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -bottom-40 -right-28 h-[36rem] w-[36rem] rounded-full blur-3xl"
        style={{
          background:
            'radial-gradient(closest-side, rgba(37,99,235,.55), rgba(37,99,235,0))',
        }}
        initial={{ opacity: 0.4, scale: 0.95 }}
        animate={{ opacity: [0.35, 0.6, 0.35], scale: [0.95, 1.04, 0.95] }}
        transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-10 sm:px-6 sm:py-16 lg:flex-row lg:items-center lg:gap-10">
        {/* LINKS: Login-Card (unverändert, nur Reihenfolge geändert) */}
        <motion.div
          className="w-full lg:w-1/2 mb-10 lg:mb-0"
          initial={{ opacity: 0, x: -18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <motion.div
            className="relative mx-auto max-w-md rounded-3xl border border-white/20 bg-white/10 p-6 shadow-[0_30px_120px_rgba(0,0,0,0.55)] backdrop-blur-2xl ring-1 ring-white/10 sm:p-8"
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-slate-100/80 to-transparent"
              animate={{ opacity: [0.15, 0.7, 0.15] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            />

            {info && (
              <div className="mb-4 rounded-lg border border-emerald-300/40 bg-emerald-300/10 px-4 py-3 text-sm text-emerald-100">
                {info}
              </div>
            )}
            {error && (
              <div className="mb-4 rounded-lg border border-rose-300/40 bg-rose-300/10 px-4 py-3 text-sm text-rose-100">
                {error}
              </div>
            )}

            <div className="mb-5 text-center">
              <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-200">
                Login
              </span>
              <h2 className="mt-1 text-xl font-semibold text-white sm:text-2xl">
                Zugang zu Ihren Inseraten
              </h2>
              <p className="mt-1 text-xs text-slate-200/80 sm:text-[13px]">
                Melden Sie sich mit Ihrer E-Mail-Adresse und Ihrem Passwort an, um Ihre
                laufenden Pakete, Anfragen und Unterlagen zu verwalten.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* E-Mail */}
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-100/90">
                  E-Mail
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={`w-full rounded-lg border px-4 py-3 pl-11 text-sm text-black outline-none focus:bg-white ${
                      email.length === 0
                        ? 'border-white/25 bg-white/85 focus:border-white/40'
                        : emailValid
                        ? 'border-emerald-400/80 bg-white'
                        : 'border-amber-400/80 bg-white'
                    }`}
                    placeholder="name@beispiel.de"
                  />
                  <EnvelopeIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                </div>
              </div>

              {/* Passwort */}
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-100/90">
                  Passwort
                </label>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    className="w-full rounded-lg border border-white/25 bg-white/85 px-4 py-3 pl-12 pr-12 text-sm text-black outline-none focus:border-white/40 focus:bg-white"
                    placeholder="••••••••"
                  />
                  <LockClosedIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                  <button
                    type="button"
                    onClick={() => setShowPw((s) => !s)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-600 hover:bg-slate-200/70"
                    aria-label={showPw ? 'Passwort verbergen' : 'Passwort anzeigen'}
                  >
                    {showPw ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>

                <div className="mt-2 text-right">
                  <button
                    type="button"
                    onClick={handleResetPassword}
                    className="text-[11px] font-medium text-slate-100/90 underline-offset-4 hover:underline"
                  >
                    Passwort vergessen?
                  </button>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <motion.button
                  type="submit"
                  disabled={loading}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white shadow-[0_16px_45px_rgba(15,23,42,0.8)] transition enabled:hover:opacity-95 disabled:opacity-60"
                  style={{
                    backgroundImage: 'linear-gradient(to right, #020617, #0f172a)',
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>{loading ? 'Anmeldung…' : 'Einloggen'}</span>
                  {!loading && <ArrowRightIcon className="h-5 w-5 opacity-90" />}
                </motion.button>

                {canResend && (
                  <button
                    type="button"
                    disabled={loading}
                    onClick={handleResend}
                    className="w-full rounded-full border border-white/30 bg-white/10 px-6 py-3 text-xs font-medium text-slate-50 ring-1 ring-white/20 backdrop-blur transition hover:bg-white/18 disabled:opacity-60"
                  >
                    Bestätigungs-E-Mail erneut senden
                  </button>
                )}
              </div>
            </form>

            <p className="mt-3 text-center text-[11px] text-slate-200/80">
              Mit Ihrem Zugang verwalten Sie alle bei Maklernull gebuchten Pakete und
              die dazugehörigen Anfragen – unabhängig davon, ob Sie verkaufen oder
              vermieten.
            </p>

            <p className="mt-4 text-center text-sm text-slate-100/90">
              Noch kein Zugang?{' '}
              <Link
                href="/registrieren"
                className="font-semibold text-sky-200 underline-offset-2 hover:underline"
              >
                Jetzt registrieren
              </Link>
            </p>
          </motion.div>
        </motion.div>

        {/* RECHTS: Welcome + Story-Animation (mit neuen Texten) */}
        <motion.div
          className="w-full lg:w-1/2"
          initial={{ opacity: 0, x: 18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
        >
          {/* Badge */}
          <div className="mb-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-white/90 ring-1 ring-white/20 backdrop-blur">
              <span className="rounded-full bg-white/90 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-900">
                Maklernull
              </span>
              <span>Login für Eigentümer:innen &amp; Vermieter:innen</span>
            </div>
          </div>

          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-4xl">
            Willkommen zurück bei Ihrem
            <span className="block text-sky-100">
              digitalen Inseratsservice.
            </span>
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-200/80 sm:text-base">
            Hier verwalten Sie Ihre Inserate für Verkauf oder Vermietung – ohne
            Maklervertrag, ohne Erfolgsprovision. Ein Login, um alles im Blick zu
            behalten: Pakete, Anfragen &amp; Unterlagen.
          </p>

          {/* die kleinen Chips WEG – wie gewünscht */}

{/* Story-Animation: Immobilie inseriert → Anfragen erhalten → Erfolgreich vermarktet */}
<div className="mt-8">
  <p className="mb-3 text-[11px] font-medium text-slate-300 sm:text-xs">
    In drei Schritten mit Maklernull zum Vermarktungserfolg:
  </p>

  <div className="relative w-full max-w-xl rounded-3xl border border-white/12 bg-white/5 p-4 sm:p-5 backdrop-blur-xl shadow-[0_20px_70px_rgba(15,23,42,0.75)]">
    {/* Basislinie */}
    <div className="pointer-events-none absolute bottom-4 left-5 right-5 h-px bg-gradient-to-r from-transparent via-sky-200/40 to-transparent" />

    <div className="relative flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-4">
      {/* Schritt 1: Immobilie inseriert */}
      <motion.div
        className="flex-1 rounded-2xl border border-white/20 bg-white/8 p-3 backdrop-blur-xl sm:h-32"
        initial={{ y: 14, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, delay: 0.05, ease: [0.2, 0.8, 0.2, 1] }}
      >
        <div className="flex items-center justify-between text-[11px] text-slate-100/90">
          <span className="inline-flex items-center gap-1">
            <HomeModernIcon className="h-4 w-4 text-sky-200" />
            Inseriert
          </span>
          <span className="rounded-full bg-emerald-400/20 px-2 py-0.5 text-[10px] text-emerald-100 ring-1 ring-emerald-300/50">
            Aktiv
          </span>
        </div>
        <div className="mt-2 space-y-1 text-[11px] text-slate-100/80">
          <p>Immobilie veröffentlicht</p>
          <p className="text-[10px] text-slate-300">
            Sichtbar auf mehreren Portalen.
          </p>
        </div>
      </motion.div>

      {/* Schritt 2: Anfragen erhalten */}
      <motion.div
        className="flex-1 rounded-2xl border border-sky-300/40 bg-sky-950/70 p-3 backdrop-blur-xl shadow-[0_16px_60px_rgba(8,47,73,0.7)] sm:h-40"
        initial={{ y: 26, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.15, ease: [0.2, 0.8, 0.2, 1] }}
      >
        <div className="flex items-center justify-between text-[11px] text-sky-50">
          <span className="inline-flex items-center gap-1">
            <ShieldCheckIcon className="h-4 w-4 text-emerald-300" />
            Anfragen
          </span>
          <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-sky-50 ring-1 ring-sky-200/50">
            Geprüft
          </span>
        </div>
        <div className="mt-2 space-y-1 text-[11px] text-sky-50/90">
          <p>12 ernsthafte Kontakte</p>
          <p>Bonität vorgeprüft</p>
          <p className="pt-1 text-[10px] text-sky-200/80">
            Besichtigungstermine organisiert.
          </p>
        </div>
      </motion.div>

      {/* Schritt 3: Erfolgreich vermarktet */}
      <motion.div
        className="flex-1 rounded-2xl border border-white/18 bg-white/5 p-3 backdrop-blur-xl sm:h-32"
        initial={{ y: 18, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
      >
        <div className="text-[11px] font-medium text-slate-100/90">
          Erfolgreich vermarktet
        </div>
        <div className="mt-2 space-y-1 text-[11px] text-slate-200/90">
          <p>Kauf- oder Mietvertrag unterschrieben</p>
          <p>Unterlagen sicher abgelegt</p>
        </div>
      </motion.div>
    </div>
  </div>
</div>
        </motion.div>
      </div>
    </div>
  )
}
