// src/app/(public)/status/page.tsx
import type { Metadata } from 'next'
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  GlobeAltIcon,
  CloudIcon,
  ServerIcon,
  BoltIcon,
  EnvelopeIcon,
  ArrowPathIcon,
  BellAlertIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link'

/* ----------------------- Site/SEO ----------------------- */
const SITE_NAME = 'Maklernull'
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://maklernull.de'
const PRIMARY = '#0a1b40'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Status – Maklernull',
    template: '%s | Maklernull',
  },
  description:
    'Live Status von Maklernull: Inserats-Erstellung, Portal-Schnittstellen, Kontaktanfragen, E-Mail-Benachrichtigungen & Reporting. Mit Incident-Chronik, Patchnotes & Roadmap.',
  alternates: { canonical: `${SITE_URL}/status` },
  openGraph: {
    type: 'website',
    url: `${SITE_URL}/status`,
    siteName: SITE_NAME,
    title: 'Status – Maklernull',
    description:
      'Alle Kerndienste von Maklernull im Überblick: Inserate, Portal-Sync, Kontaktanfragen & E-Mail-Benachrichtigungen. Transparente Incidents, Patchnotes und Roadmap.',
    images: [{ url: `${SITE_URL}/og/og-status.jpg`, width: 1200, height: 630 }],
    locale: 'de_DE',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Status – Maklernull',
    description:
      'Status von Inserats-Erstellung, Portal-Schnittstellen, Kontaktanfragen & Benachrichtigungen. Mit Patchnotes und Roadmap.',
    images: [`${SITE_URL}/og/og-status.jpg`],
  },
  robots: { index: true, follow: true },
}

/* ----------------------- JSON-LD ------------------------ */
function JsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: SITE_NAME,
    url: `${SITE_URL}/status`,
    description:
      'Statusseite von Maklernull: Betriebszustand von Inserats-Erstellung, Portal-Schnittstellen, Kontaktanfragen, Incidents, Patchnotes und Roadmap.',
    inLanguage: 'de-DE',
    publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
  }
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

/* --------------------- Hilfskomponenten --------------------- */
type State = 'operational' | 'degraded' | 'outage'

function Dot({ state }: { state: State }) {
  const bg =
    state === 'operational'
      ? 'bg-emerald-500'
      : state === 'degraded'
      ? 'bg-amber-500'
      : 'bg-rose-500'
  return (
    <span
      className={`relative inline-block h-2.5 w-2.5 rounded-full ${bg}`}
      aria-hidden
    >
      {state === 'operational' && (
        <span className="absolute inset-0 rounded-full bg-emerald-500/60 animate-ping" />
      )}
    </span>
  )
}

function Pill({
  state,
  label,
  icon: Icon,
  note,
}: {
  state: State
  label: string
  icon: any
  note?: string
}) {
  const iconColor =
    state === 'operational'
      ? 'text-emerald-600'
      : state === 'degraded'
      ? 'text-amber-600'
      : 'text-rose-600'

  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/60 bg-white/70 p-4 backdrop-blur-xl ring-1 ring-white/60 shadow-[0_10px_30px_rgba(2,6,23,0.06)]">
      <div className="flex items-center gap-3">
        <span
          className={`rounded-xl border border-white/60 bg-white/80 p-2 ring-1 ring-white/60 ${iconColor}`}
        >
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <div className="flex items-center gap-2">
            <Dot state={state} />
            <span className="text-sm font-medium text-slate-900">
              {label}
            </span>
          </div>
          {note && (
            <p className="mt-0.5 text-xs text-slate-600">
              {note}
            </p>
          )}
        </div>
      </div>
      <span
        className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
          state === 'operational'
            ? 'bg-emerald-50 text-emerald-700'
            : state === 'degraded'
            ? 'bg-amber-50 text-amber-800'
            : 'bg-rose-50 text-rose-700'
        }`}
      >
        {state === 'operational'
          ? 'Betriebsbereit'
          : state === 'degraded'
          ? 'Eingeschränkt'
          : 'Störung'}
      </span>
    </div>
  )
}

/* ------------------------- Page ------------------------- */
export default function StatusPage() {
  const today = '18.09.2025' // bei Bedarf automatisieren

  return (
    <>
      <JsonLd />

      {/* Keyframes für dezenten Glow */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes floatGlow {
            0%   { transform: translate3d(0,0,0); opacity:.6 }
            50%  { transform: translate3d(12px,10px,0); opacity:.75 }
            100% { transform: translate3d(0,0,0); opacity:.6 }
          }`,
        }}
      />

      <div className="space-y-20">
        {/* HERO / Summary */}
        <section className="relative overflow-visible">
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-[-28vh] -z-10 h-[120vh] w-[170vw] -translate-x-1/2"
            style={{
              background:
                'radial-gradient(1200px 480px at 50% 0%, rgba(10,27,64,0.06), transparent),' +
                'radial-gradient(900px 420px at 20% 8%, rgba(10,27,64,0.05), transparent),' +
                'radial-gradient(900px 420px at 80% 6%, rgba(10,27,64,0.05), transparent)',
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -left-10 -top-10 -z-10 h-[30rem] w-[30rem] rounded-full"
            style={{
              background:
                'radial-gradient(closest-side, rgba(10,27,64,.12), rgba(10,27,64,0))',
              filter: 'blur(26px)',
              animation: 'floatGlow 16s ease-in-out infinite',
            }}
          />

          <div className="relative mx-auto max-w-6xl px-6 pt-10 sm:pt-14">
            <div className="rounded-3xl border border-white/60 bg-white/70 p-8 text-center shadow-[0_18px_50px_rgba(2,6,23,0.08)] backdrop-blur-xl ring-1 ring-white/60 sm:p-12">
              <div className="mx-auto mb-3 inline-flex items-center gap-2 rounded-full bg-white/85 px-3 py-1 text-[11px] font-semibold text-slate-900 ring-1 ring-white/60">
                <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-white">
                  Live
                </span>
                <span>Systemstatus</span>
                <span className="text-slate-400">•</span>
                <span>Stand: {today}</span>
              </div>

              <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                <span className="inline-flex items-center gap-2 align-middle">
                  <span className="relative inline-block h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-emerald-500">
                    <span className="absolute inset-0 rounded-full bg-emerald-500/60 animate-ping" />
                  </span>
                  Alle Kerndienste von Maklernull sind betriebsbereit
                </span>
              </h1>
              <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-slate-700">
                Inserats-Erstellung, Portal-Schnittstellen und
                Kontaktanfragen laufen stabil. Alle bekannten Themen und
                Verbesserungen finden Sie in Incident-Chronik, Patchnotes
                und Roadmap.
              </p>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/preise"
                  className="inline-flex items-center justify-center rounded-full border border-white/60 bg-white/85 px-6 py-3 text-sm font-semibold text-slate-900 ring-1 ring-white/60 backdrop-blur hover:bg-white"
                >
                  Preise & Pakete
                </Link>
                <Link
                  href="/support"
                  className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white"
                  style={{
                    backgroundColor: PRIMARY,
                    boxShadow:
                      '0 6px 22px rgba(10,27,64,.25), inset 0 1px 0 rgba(255,255,255,.25)',
                  }}
                >
                  Support kontaktieren
                </Link>
              </div>
            </div>
          </div>

          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -bottom-10 h-16 -z-10"
            style={{
              background:
                'linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,1))',
            }}
          />
        </section>

        {/* Komponentenstatus */}
        <section className="mx-auto max-w-6xl px-6">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
            Komponenten
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Pill
              state="operational"
              label="Hosting (EU - Frankfurt)"
              icon={CloudIcon}
              note="Uptime (30 Tage): 100 %"
            />
            <Pill
              state="operational"
              label="Web-App (Maklernull)"
              icon={GlobeAltIcon}
              note="Stabile Performance"
            />
            <Pill
              state="operational"
              label="Datenbank"
              icon={ServerIcon}
              note="Replikation & Backups aktiv"
            />
            <Pill
              state="operational"
              label="API & Integrationen"
              icon={BoltIcon}
              note="Portal-Schnittstellen & Webhooks"
            />
            <Pill
              state="operational"
              label="Inserats-Erstellung"
              icon={CheckCircleIcon}
              note="Exposé-Export & Medienverarbeitung"
            />
            <Pill
              state="operational"
              label="Portal-Schnittstellen"
              icon={ArrowPathIcon}
              note="z. B. Immobilienscout24, Immowelt, Kleinanzeigen*"
            />
            <Pill
              state="operational"
              label="Kontaktanfragen-Eingang"
              icon={BellAlertIcon}
              note="Lead-Eingang über Portale & Website-Formulare"
            />
            <Pill
              state="operational"
              label="E-Mail"
              icon={EnvelopeIcon}
              note="Lead-Weiterleitung & Bestätigungen"
            />
            <Pill
              state="operational"
              label="Reporting & Statistiken"
              icon={GlobeAltIcon}
              note="Auswertungen zu Inseraten & Anfragen"
            />
          </div>
          <p className="mt-3 text-xs text-slate-500">
            * Nennung beispielhaft. Die tatsächlichen Portale hängen von Ihrer gebuchten Anbindung ab.
          </p>
        </section>

        {/* Incident-Chronik (letzte 30 Tage) */}
        <section className="mx-auto max-w-6xl px-6">
          <div className="rounded-3xl border border-white/60 bg-white/70 p-6 backdrop-blur-xl ring-1 ring-white/60 shadow-[0_15px_50px_rgba(2,6,23,0.08)]">
            <h3 className="text-xl font-semibold text-slate-900">
              Incident-Chronik (letzte 30 Tage)
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-700">
              <li className="flex items-start gap-3 rounded-2xl border border-white/60 bg-white/80 p-4 ring-1 ring-white/60">
                <CheckCircleIcon className="mt-0.5 h-5 w-5 text-emerald-600" />
                <div>
                  <div className="font-medium text-slate-900">
                    15.09.2025 – Verzögerte Übertragung einzelner Inserate zu Portalen
                  </div>
                  <p>
                    Ursache: Drosselung bei einem Portal-Endpoint. Retry-Logik
                    angepasst, Monitoring-Regeln erweitert. Alle betroffenen
                    Inserate wurden erneut synchronisiert.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3 rounded-2xl border border-white/60 bg-white/80 p-4 ring-1 ring-white/60">
                <CheckCircleIcon className="mt-0.5 h-5 w-5 text-emerald-600" />
                <div>
                  <div className="font-medium text-slate-900">
                    05.09.2025 – Verzögerte Weiterleitung von Kontaktanfragen per E-Mail
                  </div>
                  <p>
                    Mail-Worker skaliert & Queue-Konfiguration optimiert. Seitdem
                    werden Anfragen wieder in Echtzeit weitergeleitet.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3 rounded-2xl border border-white/60 bg-white/80 p-4 ring-1 ring-white/60">
                <ExclamationTriangleIcon className="mt-0.5 h-5 w-5 text-amber-600" />
                <div>
                  <div className="font-medium text-slate-900">
                    28.08.2025 – Kurzzeitig erhöhte Ladezeiten im Reporting
                  </div>
                  <p>
                    Ursache: Neuaufbau aggregierter Statistiken. Künftig separate
                    Wartungsfenster und gestaffelte Aktualisierung der Reports.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </section>

        {/* Patchnotes */}
        <section className="mx-auto max-w-6xl px-6">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
            Patchnotes
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-white/60 bg-white/70 p-5 backdrop-blur-xl ring-1 ring-white/60">
              <div className="flex items-center justify-between">
                <div className="text-lg font-semibold text-slate-900">
                  v1.4.2 <span className="text-slate-500">– 18.09.2025</span>
                </div>
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                  Stable
                </span>
              </div>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
                <li>
                  Portal-Schnittstellen: verbessertes Mapping für Objektarten,
                  Ausstattungsmerkmale & Energiekennwerte.
                </li>
                <li>
                  Kontaktanfragen: Deduplizierung optimiert – weniger doppelte Leads
                  bei mehrfachen Portal-Weiterleitungen.
                </li>
                <li>
                  Exposé-Export: optimierte PDF-Struktur für bessere Lesbarkeit auf
                  Mobilgeräten.
                </li>
                <li>
                  Dashboard: neue Kacheln für Inserats-Reichweite und
                  Kontaktanfragen pro Portal.
                </li>
              </ul>
            </div>
            <div className="rounded-2xl border border-white/60 bg-white/70 p-5 backdrop-blur-xl ring-1 ring-white/60">
              <div className="text-lg font-semibold text-slate-900">
                v1.4.1 <span className="text-slate-500">– 06.09.2025</span>
              </div>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
                <li>
                  E-Mail-Benachrichtigungen: klarere Betreffzeilen & Portal-Hinweise
                  in der Lead-Mail.
                </li>
                <li>
                  Import: CSV-Validierung für Objekt-Importe mit Vorschau & Details
                  zu fehlerhaften Zeilen.
                </li>
                <li>
                  Reporting: Filter nach Portal, Objektart und Zeitraum ergänzt.
                </li>
                <li>
                  Diverse UI-Verbesserungen in der Inserats-Liste & Detailansicht.
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Roadmap */}
        <section className="mx-auto max-w-6xl px-6 pb-24">
          <div className="rounded-3xl border border-white/60 bg-white/70 p-6 backdrop-blur-xl ring-1 ring-white/60 shadow-[0_15px_50px_rgba(2,6,23,0.08)]">
            <h3 className="text-xl font-semibold text-slate-900">
              Roadmap
            </h3>

            <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Kurzfristig */}
              <div>
                <h4 className="text-sm font-semibold text-slate-900">
                  Kurzfristig (1–4 Wochen)
                </h4>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>
                    Erweiterte Filter für Inserate (Status, Portal, Vermarktungsart).
                  </li>
                  <li>
                    Zusätzliche Benachrichtigungsoptionen (z. B. nur qualifizierte
                    Leads).
                  </li>
                  <li>
                    Verbesserte Protokollansicht für Portal-Übertragungen
                    (Monitoring & Logs).
                  </li>
                  <li>
                    Feineres Rechte-Management für Teams (z. B. Marketing vs. Vertrieb).
                  </li>
                </ul>
              </div>

              {/* Mittelfristig */}
              <div>
                <h4 className="text-sm font-semibold text-slate-900">
                  Mittelfristig (4–12 Wochen)
                </h4>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>
                    Erweiterung um weitere Portale & Exportformate.
                  </li>
                  <li>
                    Lead-Routing-Regeln (z. B. automatische Zuweisung nach Region,
                    Objektart oder Portal).
                  </li>
                  <li>
                    Tiefergehende Reporting-Ansichten mit Trichter von Inserat bis
                    Abschluss.
                  </li>
                  <li>
                    API-Zugriff für eigene Website-Formulare & individuelle Integrationen.
                  </li>
                </ul>
              </div>

              {/* Langfristig */}
              <div>
                <h4 className="text-sm font-semibold text-slate-900">
                  Langfristige Ziele
                </h4>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>
                    Maklernull Mobile App (iOS & Android) für Leads, Aufgaben &
                    Freigaben von unterwegs.
                  </li>
                  <li>
                    KI-Unterstützung für Exposé-Texte, Bildauswahl und
                    Preisempfehlungen.
                  </li>
                  <li>
                    Multi-Account/Mandantenfähigkeit für Gruppen, Büros & Netzwerke.
                  </li>
                  <li>
                    Tiefere Analytics zu Portal-Performance und
                    Vermarktungsgeschwindigkeit.
                  </li>
                </ul>
              </div>
            </div>

            <p className="mt-4 text-xs text-slate-500">
              Roadmap ohne Garantie; Prioritäten können sich basierend auf Feedback
              unserer Maklernull-Nutzerinnen und -Nutzer verschieben.
            </p>
          </div>
        </section>
      </div>
    </>
  )
}
