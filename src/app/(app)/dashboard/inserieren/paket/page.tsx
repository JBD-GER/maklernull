// src/app/dashboard/inserieren/paket/page.tsx
'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

type PackageCode =
  | 'VK_BASIS_1'
  | 'VK_BASIS_2'
  | 'VK_BASIS_3'
  | 'VK_PREMIUM_1'
  | 'VK_PREMIUM_2'
  | 'VK_PREMIUM_3'
  | 'VK_TOP_1'
  | 'VK_TOP_2'
  | 'VK_TOP_3'
  | 'VM_BASIS_1'
  | 'VM_BASIS_2'
  | 'VM_BASIS_3'
  | 'VM_PREMIUM_1'
  | 'VM_PREMIUM_2'
  | 'VM_PREMIUM_3'
  | 'VM_TOP_1'
  | 'VM_TOP_2'
  | 'VM_TOP_3'
  | 'TEST_1'
  | 'TEST_2'
  | 'TEST_3'

type Segment = 'sale' | 'rent' | 'test'

type PackageDef = {
  code: PackageCode
  segment: Segment
  title: string
  subtitle: string
  runtimeMonths: number
  priceLabel: string
  badge?: string
  highlight?: boolean
}

const PACKAGES: PackageDef[] = [
  // ----- VERKAUF – BASIS -----
  {
    code: 'VK_BASIS_1',
    segment: 'sale',
    title: 'VK-Basis · 1 Monat',
    subtitle: 'Ideal, wenn Sie den Markt erst testen möchten.',
    runtimeMonths: 1,
    priceLabel: '249 € inkl. MwSt.',
  },
  {
    code: 'VK_BASIS_2',
    segment: 'sale',
    title: 'VK-Basis · 2 Monate',
    subtitle: 'Mehr Sichtbarkeit durch längere Laufzeit.',
    runtimeMonths: 2,
    priceLabel: '299 € inkl. MwSt.',
  },
  {
    code: 'VK_BASIS_3',
    segment: 'sale',
    title: 'VK-Basis · 3 Monate',
    subtitle: 'Solide Dauer für Standard-Verkäufe.',
    runtimeMonths: 3,
    priceLabel: '349 € inkl. MwSt.',
  },

  // ----- VERKAUF – PREMIUM -----
  {
    code: 'VK_PREMIUM_1',
    segment: 'sale',
    title: 'VK-Premium · 1 Monat',
    subtitle: 'Mehr Service für eine schnelle Vermarktung.',
    runtimeMonths: 1,
    priceLabel: '399 € inkl. MwSt.',
  },
  {
    code: 'VK_PREMIUM_2',
    segment: 'sale',
    title: 'VK-Premium · 2 Monate',
    subtitle: 'Beliebt bei Eigentümern mit höherem Anspruch.',
    runtimeMonths: 2,
    priceLabel: '499 € inkl. MwSt.',
    highlight: true,
    badge: 'Beliebteste Wahl',
  },
  {
    code: 'VK_PREMIUM_3',
    segment: 'sale',
    title: 'VK-Premium · 3 Monate',
    subtitle: 'Maximale Präsenz über mehrere Monate.',
    runtimeMonths: 3,
    priceLabel: '599 € inkl. MwSt.',
  },

  // ----- VERKAUF – TOP -----
  {
    code: 'VK_TOP_1',
    segment: 'sale',
    title: 'VK-Top · 1 Monat',
    subtitle: 'Optimierte Darstellung und hohe Aufmerksamkeit.',
    runtimeMonths: 1,
    priceLabel: '299 € inkl. MwSt.',
  },
  {
    code: 'VK_TOP_2',
    segment: 'sale',
    title: 'VK-Top · 2 Monate',
    subtitle: 'Mehr Zeit für qualifizierte Anfragen.',
    runtimeMonths: 2,
    priceLabel: '349 € inkl. MwSt.',
  },
  {
    code: 'VK_TOP_3',
    segment: 'sale',
    title: 'VK-Top · 3 Monate',
    subtitle: 'Langfristige Sichtbarkeit für besondere Objekte.',
    runtimeMonths: 3,
    priceLabel: '399 € inkl. MwSt.',
  },

  // ----- VERMIETUNG – BASIS -----
  {
    code: 'VM_BASIS_1',
    segment: 'rent',
    title: 'VM-Basis · 1 Monat',
    subtitle: 'Perfekt bei hoher Nachfrage im Markt.',
    runtimeMonths: 1,
    priceLabel: '199 € inkl. MwSt.',
  },
  {
    code: 'VM_BASIS_2',
    segment: 'rent',
    title: 'VM-Basis · 2 Monate',
    subtitle: 'Gibt mehr Zeit für eine entspannte Auswahl.',
    runtimeMonths: 2,
    priceLabel: '249 € inkl. MwSt.',
  },
  {
    code: 'VM_BASIS_3',
    segment: 'rent',
    title: 'VM-Basis · 3 Monate',
    subtitle: 'Gut geeignet in ruhigeren Lagen.',
    runtimeMonths: 3,
    priceLabel: '299 € inkl. MwSt.',
  },

  // ----- VERMIETUNG – PREMIUM -----
  {
    code: 'VM_PREMIUM_1',
    segment: 'rent',
    title: 'VM-Premium · 1 Monat',
    subtitle: 'Mehr Leistung, wenn es schnell gehen soll.',
    runtimeMonths: 1,
    priceLabel: '349 € inkl. MwSt.',
  },
  {
    code: 'VM_PREMIUM_2',
    segment: 'rent',
    title: 'VM-Premium · 2 Monate',
    subtitle: 'Optimal für hochwertige Mietobjekte.',
    runtimeMonths: 2,
    priceLabel: '449 € inkl. MwSt.',
    highlight: true,
    badge: 'Empfohlen',
  },
  {
    code: 'VM_PREMIUM_3',
    segment: 'rent',
    title: 'VM-Premium · 3 Monate',
    subtitle: 'Maximale Reichweite über die gesamte Vermarktungszeit.',
    runtimeMonths: 3,
    priceLabel: '549 € inkl. MwSt.',
  },

  // ----- VERMIETUNG – TOP -----
  {
    code: 'VM_TOP_1',
    segment: 'rent',
    title: 'VM-Top · 1 Monat',
    subtitle: 'Starker Auftritt in kurzer Zeit.',
    runtimeMonths: 1,
    priceLabel: '249 € inkl. MwSt.',
  },
  {
    code: 'VM_TOP_2',
    segment: 'rent',
    title: 'VM-Top · 2 Monate',
    subtitle: 'Sehr gute Kombination aus Reichweite und Laufzeit.',
    runtimeMonths: 2,
    priceLabel: '299 € inkl. MwSt.',
  },
  {
    code: 'VM_TOP_3',
    segment: 'rent',
    title: 'VM-Top · 3 Monate',
    subtitle: 'Für Vermietungen, die etwas mehr Zeit brauchen.',
    runtimeMonths: 3,
    priceLabel: '349 € inkl. MwSt.',
  },

  // ----- TEST-PAKETE (nur vorübergehend) -----
  {
    code: 'TEST_1',
    segment: 'test',
    title: 'Testpaket · 1 Monat',
    subtitle: 'Nur für interne Tests des Workflows.',
    runtimeMonths: 1,
    priceLabel: 'Stripe-Testpreis',
    badge: 'Nur intern',
  },
  {
    code: 'TEST_2',
    segment: 'test',
    title: 'Testpaket · 2 Monate',
    subtitle: 'Workflow über längere Zeiträume testen.',
    runtimeMonths: 2,
    priceLabel: 'Stripe-Testpreis',
  },
  {
    code: 'TEST_3',
    segment: 'test',
    title: 'Testpaket · 3 Monate',
    subtitle: 'Dauerhafte Tests des kompletten Funnel.',
    runtimeMonths: 3,
    priceLabel: 'Stripe-Testpreis',
  },
]

const SEGMENT_LABELS: Record<Segment, string> = {
  sale: 'Verkauf',
  rent: 'Vermietung',
  test: 'Test',
}

export default function PaketAuswahlPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const listingId = searchParams.get('listing')

  const [segment, setSegment] = useState<Segment>('sale')
  const [selectedCode, setSelectedCode] = useState<PackageCode | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Wenn keine listingId vorhanden → zurück zur Inserats-Seite
  useEffect(() => {
    if (!listingId) {
      router.replace('/dashboard/inserieren')
    }
  }, [listingId, router])

  const filteredPackages = PACKAGES.filter((p) => p.segment === segment)

  const handleConfirm = async () => {
    if (!listingId || !selectedCode || loading) return

    setLoading(true)
    setError(null)

    const pkg = PACKAGES.find((p) => p.code === selectedCode)
    const runtimeMonths = pkg?.runtimeMonths ?? 1

    try {
      const res = await fetch('/api/listings/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingId,
          packageCode: selectedCode,
          runtimeMonths,
        }),
      })

      const data = await res.json()

      if (!res.ok || !data.url) {
        throw new Error(
          data?.error || 'Fehler beim Starten des Bezahlvorgangs'
        )
      }

      window.location.href = data.url as string
    } catch (e: any) {
      setError(e.message || 'Unbekannter Fehler beim Checkout')
      setLoading(false)
    }
  }

  if (!listingId) return null

  return (
    <section className="relative mx-auto max-w-6xl px-4 pb-12 pt-8">
      {/* weicher Hintergrund mit Glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[-18vh] -z-10 h-[140vh] w-[200vw] -translate-x-1/2"
        style={{
          background:
            'radial-gradient(1200px 520px at 50% 0%, rgba(10,27,64,0.08), transparent),' +
            'radial-gradient(900px 420px at 8% 10%, rgba(10,27,64,0.05), transparent),' +
            'radial-gradient(900px 420px at 92% 8%, rgba(10,27,64,0.05), transparent)',
        }}
      />

      <div className="mb-5 flex flex-col gap-3 sm:mb-7 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Paket für Ihr Inserat wählen
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Wählen Sie das passende Paket für Verkauf oder Vermietung aus. Im
            nächsten Schritt wechseln Sie zu Stripe und schließen die Zahlung ab.
          </p>
          <p className="mt-1 text-[11px] text-slate-500">
            Alle Preise verstehen sich inklusive Mehrwertsteuer. Die Pakete sind
            einmalig und laufen nach der gewählten Dauer automatisch aus.
          </p>
        </div>

        <button
          type="button"
          onClick={() => router.push('/dashboard/inserieren')}
          className="inline-flex items-center justify-center rounded-full border border-white/70 bg-white/90 px-4 py-2 text-xs font-medium text-slate-700 shadow-sm backdrop-blur-xl hover:border-slate-300 hover:bg-white"
        >
          ← Inserat bearbeiten
        </button>
      </div>

      {/* Segment-Tabs */}
      <div className="mb-6 rounded-3xl border border-white/70 bg-white/90 p-2 text-xs shadow-[0_18px_40px_rgba(15,23,42,0.04)] backdrop-blur-2xl">
        <div className="flex gap-2">
          {(['sale', 'rent', 'test'] as Segment[]).map((s) => {
            const active = s === segment
            return (
              <button
                key={s}
                type="button"
                onClick={() => {
                  setSegment(s)
                  setSelectedCode(null)
                }}
                className={[
                  'flex-1 rounded-2xl px-3 py-2 font-medium transition',
                  active
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-transparent text-slate-600 hover:bg-slate-100',
                ].join(' ')}
              >
                {SEGMENT_LABELS[s]}
              </button>
            )
          })}
        </div>
        {segment === 'test' && (
          <p className="mt-2 text-[11px] text-slate-500">
            Test-Pakete sind nur für interne Tests vorgesehen. Sie können später
            problemlos entfernt werden.
          </p>
        )}
      </div>

      {/* Paket-Kacheln */}
      <div className="grid gap-4 md:grid-cols-3">
        {filteredPackages.map((pkg) => {
          const active = pkg.code === selectedCode
          const isPremium = pkg.highlight

          return (
            <button
              key={pkg.code}
              type="button"
              onClick={() => setSelectedCode(pkg.code)}
              className={[
                'group flex flex-col justify-between rounded-3xl border p-4 text-left shadow-sm backdrop-blur-2xl transition',
                active
                  ? 'border-slate-900 bg-slate-900 text-white shadow-[0_18px_60px_rgba(15,23,42,0.55)]'
                  : 'border-white/70 bg-white/90 text-slate-900 hover:border-slate-300 hover:bg-white',
                isPremium && !active
                  ? 'ring-1 ring-slate-900/5'
                  : '',
              ].join(' ')}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 group-hover:text-slate-600">
                    {segment === 'sale'
                      ? 'Verkauf'
                      : segment === 'rent'
                      ? 'Vermietung'
                      : 'Test'}
                  </span>
                  {pkg.badge && (
                    <span
                      className={[
                        'rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-wide',
                        active
                          ? 'bg-emerald-400 text-slate-900'
                          : 'bg-slate-900 text-white',
                      ].join(' ')}
                    >
                      {pkg.badge}
                    </span>
                  )}
                </div>
                <div className="text-sm font-semibold sm:text-base">
                  {pkg.title}
                </div>
                <p
                  className={
                    active
                      ? 'text-xs text-slate-100/80'
                      : 'text-xs text-slate-600'
                  }
                >
                  {pkg.subtitle}
                </p>
              </div>

              <div className="mt-5 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span
                    className={
                      active
                        ? 'text-sm font-semibold text-emerald-200'
                        : 'text-sm font-semibold text-slate-900'
                    }
                  >
                    {pkg.priceLabel}
                  </span>
                  <span
                    className={
                      active
                        ? 'rounded-full bg-emerald-500/90 px-3 py-1 text-[11px] font-semibold text-white'
                        : 'rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-700'
                    }
                  >
                    Laufzeit: {pkg.runtimeMonths} Monat
                    {pkg.runtimeMonths > 1 ? 'e' : ''}
                  </span>
                </div>

                <div className="mt-1 flex items-center justify-between">
                  <span
                    className={
                      active
                        ? 'text-[11px] font-medium text-emerald-100'
                        : 'text-[11px] text-slate-500'
                    }
                  >
                    {active ? 'Ausgewählt' : 'Jetzt auswählen'}
                  </span>
                  <div
                    className={[
                      'h-6 w-6 rounded-full border transition',
                      active
                        ? 'border-emerald-300 bg-emerald-400'
                        : 'border-slate-300 bg-white group-hover:border-slate-400',
                    ].join(' ')}
                  >
                    {active && (
                      <div className="m-1 h-4 w-4 rounded-full bg-white" />
                    )}
                  </div>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Footer / CTA */}
      <div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[11px] text-slate-500">
          Nach der Paketwahl werden Sie zu Stripe weitergeleitet. Die
          Veröffentlichung der Immobilie auf den Portalen startet, sobald die
          Zahlung erfolgreich war.
        </p>
        <button
          type="button"
          onClick={handleConfirm}
          disabled={!selectedCode || loading}
          className="inline-flex items-center justify-center rounded-full border border-slate-900 bg-slate-900 px-5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? 'Weiter zu Stripe…' : 'Weiter zu Stripe'}
        </button>
      </div>

      {error && (
        <p className="mt-3 text-sm text-rose-600">
          {error}
        </p>
      )}
    </section>
  )
}
