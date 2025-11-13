'use client'

import { Suspense, useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline'
import { supabaseEphemeral } from '@/lib/supabase-client'

/**
 * Seite /neues-passwort – wird in eine Suspense-Boundary gepackt,
 * damit useSearchParams korrekt funktioniert (CSR-Bailout-Error fix).
 */
export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="relative min-h-screen overflow-hidden bg-[#020617] px-4 py-16">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background:
                'radial-gradient(700px 500px at 50% 0%, rgba(56,189,248,0.18), transparent),' +
                'radial-gradient(900px 600px at 0% 100%, rgba(37,99,235,0.25), transparent)',
            }}
          />
          <div className="mx-auto max-w-md rounded-3xl border border-white/15 bg-white/5 p-6 shadow-2xl backdrop-blur-2xl ring-1 ring-white/10 sm:p-8">
            <h1 className="mb-1 text-center text-2xl font-semibold text-white">
              Neues Passwort festlegen
            </h1>
            <p className="mb-4 text-center text-xs text-white/70">
              Der Wiederherstellungslink wird überprüft …
            </p>
            <div className="flex justify-center">
              <span className="h-6 w-6 animate-spin rounded-full border border-white/40 border-b-transparent" />
            </div>
          </div>
        </div>
      }
    >
      <ResetPasswordInner />
    </Suspense>
  )
}

/**
 * Die eigentliche Logik & UI – hier wird useSearchParams verwendet.
 */
function ResetPasswordInner() {
  const supabase = supabaseEphemeral() // ephemeraler Client
  const router = useRouter()
  const searchParams = useSearchParams()

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPw, setShowPw] = useState(false)

  const [info, setInfo] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true) // Link / Session wird geprüft
  const [ready, setReady] = useState(false)

  const triedRef = useRef(false)

  // Initial: Session / Tokens prüfen
  useEffect(() => {
    if (triedRef.current) return
    triedRef.current = true

    ;(async () => {
      try {
        // 1) Falls Supabase die Session bereits aus der URL hergestellt hat
        const { data: sess } = await supabase.auth.getSession()
        if (sess.session) {
          setInfo('Sicherer Link erkannt. Sie können jetzt ein neues Passwort setzen.')
          setReady(true)
          setChecking(false)
          return
        }

        // 2) Tokens aus der URL (Recovery-Flow)
        const type = searchParams.get('type')
        const token_hash = searchParams.get('token_hash') || searchParams.get('token')
        const code = searchParams.get('code')

        if (type === 'recovery' && token_hash) {
          const { error } = await supabase.auth.verifyOtp({
            type: 'recovery',
            token_hash,
          } as any)

          if (!error) {
            setInfo('Sicherer Link erkannt. Sie können jetzt ein neues Passwort setzen.')
            setReady(true)
            setChecking(false)
            return
          }
        }

        // 3) Optionaler Fallback: PKCE-Code
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code)
          if (!error) {
            setInfo('Sicherer Link erkannt. Sie können jetzt ein neues Passwort setzen.')
            setReady(true)
            setChecking(false)
            return
          }
        }

        setError('Kein gültiger Wiederherstellungslink. Bitte fordern Sie einen neuen Link an.')
        setReady(false)
        setChecking(false)
      } catch (e) {
        setError('Link ungültig oder abgelaufen. Bitte fordern Sie einen neuen Link an.')
        setReady(false)
        setChecking(false)
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase, searchParams])

  // Falls Supabase via Auth-Event signalisiert
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN') {
        setInfo('Sicherer Link erkannt. Sie können jetzt ein neues Passwort setzen.')
        setReady(true)
        setChecking(false)
      }
    })

    return () => {
      sub.subscription.unsubscribe()
    }
  }, [supabase])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setInfo(null)
    setError(null)

    if (!ready) {
      setError('Es konnte keine gültige Sitzung aus dem Link erstellt werden.')
      return
    }
    if (password.length < 8) {
      setError('Das Passwort muss mindestens 8 Zeichen lang sein.')
      return
    }
    if (password !== confirm) {
      setError('Die Passwörter stimmen nicht überein.')
      return
    }

    setLoading(true)
    try {
      const { error: updErr } = await supabase.auth.updateUser({ password })
      if (updErr) throw updErr

      // Ephemere Session beenden
      await supabase.auth.signOut()

      setInfo('Passwort aktualisiert. Sie werden nun zum Login weitergeleitet …')
      setTimeout(() => router.push('/login'), 1200)
    } catch (err: any) {
      setError(err?.message || 'Fehler beim Zurücksetzen des Passworts.')
    } finally {
      setLoading(false)
    }
  }

  const disableInputs = !ready || loading

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020617] px-4 py-16">
      {/* dezenter Glow-Hintergrund */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(700px 500px at 50% 0%, rgba(56,189,248,0.18), transparent),' +
            'radial-gradient(900px 600px at 0% 100%, rgba(37,99,235,0.25), transparent)',
        }}
      />

      <div className="mx-auto max-w-md rounded-3xl border border-white/15 bg-white/5 p-6 shadow-2xl backdrop-blur-2xl ring-1 ring-white/10 sm:p-8">
        <h1 className="mb-1 text-center text-2xl font-semibold text-white">
          Neues Passwort festlegen
        </h1>
        <p className="mb-6 text-center text-xs text-white/70">
          Bitte vergeben Sie ein neues, sicheres Passwort für Ihr Konto.
        </p>

        {/* Status-Meldungen */}
        {checking && !error && (
          <div
            className="mb-4 flex items-center gap-2 rounded-md border border-slate-300/30 bg-slate-800/40 px-4 py-3 text-xs text-slate-100"
            aria-live="polite"
          >
            <span className="h-2 w-2 animate-pulse rounded-full bg-sky-400" />
            <span>Der Wiederherstellungslink wird überprüft …</span>
          </div>
        )}

        {info && (
          <div
            className="mb-4 flex items-start gap-2 rounded-md border border-emerald-300/40 bg-emerald-300/10 px-4 py-3 text-xs text-emerald-100"
            aria-live="polite"
          >
            <CheckCircleIcon className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <span>{info}</span>
          </div>
        )}

        {error && (
          <div
            className="mb-4 flex items-start gap-2 rounded-md border border-rose-300/40 bg-rose-300/10 px-4 py-3 text-xs text-rose-100"
            aria-live="polite"
          >
            <ExclamationTriangleIcon className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-1 block text-xs font-medium text-white/80">
              Neues Passwort
            </label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="w-full rounded-lg border border-white/15 bg-white/90 px-4 py-3 pl-12 text-sm text-black outline-none transition focus:border-white/40 focus:bg-white"
                placeholder="Mindestens 8 Zeichen"
                disabled={disableInputs}
                autoComplete="new-password"
              />
              <LockClosedIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-white/80">
              Passwort wiederholen
            </label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                minLength={8}
                className="w-full rounded-lg border border-white/15 bg-white/90 px-4 py-3 pl-12 pr-11 text-sm text-black outline-none transition focus:border-white/40 focus:bg-white"
                placeholder="Bitte wiederholen"
                disabled={disableInputs}
                autoComplete="new-password"
              />
              <LockClosedIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
              <button
                type="button"
                onClick={() => setShowPw((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-600 hover:bg-slate-200/70 disabled:opacity-50"
                disabled={!ready}
                aria-label={showPw ? 'Passwörter ausblenden' : 'Passwörter anzeigen'}
              >
                {showPw ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={loading || !ready}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-[#5865f2] px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
            whileHover={{ scale: loading || !ready ? 1 : 1.02 }}
            whileTap={{ scale: loading || !ready ? 1 : 0.98 }}
          >
            {loading && (
              <span className="h-4 w-4 animate-spin rounded-full border border-white/40 border-b-transparent" />
            )}
            <span>{loading ? 'Wird gespeichert …' : 'Passwort festlegen'}</span>
          </motion.button>
        </form>

        {!ready && !error && (
          <p className="mt-4 text-center text-[11px] text-white/60">
            Hinweis: Öffnen Sie diese Seite ausschließlich über den Link aus Ihrer E-Mail.
          </p>
        )}
      </div>
    </div>
  )
}
