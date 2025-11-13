// src/app/(public)/features/page.tsx
import Link from 'next/link'
import type { Metadata } from 'next'
import {
  DocumentTextIcon,
  ArrowUpOnSquareStackIcon,
  EnvelopeOpenIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  CloudArrowUpIcon,
} from '@heroicons/react/24/outline'

/* ----------------------------- Site/SEO constants ----------------------------- */
const SITE_NAME = 'Maklernull'
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://maklernull.de'
const PRIMARY = '#0a1b40' // dein Maklernull-Blau

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Funktionen – Maklernull',
    template: '%s | Maklernull',
  },
  description:
    'Maklernull bündelt Inserats-Verwaltung, Portal-Schnittstellen und Kontaktanfragen in einer Oberfläche. Exposé einmal pflegen, auf mehreren Portalen veröffentlichen und alle Leads zentral im Blick behalten.',
  keywords: [
    'Maklernull',
    'Immobilien Inserate',
    'Immobilienportale Schnittstelle',
    'Immobilien Software Makler',
    'Kontaktanfragen Immobilien',
    'Exposé Verwaltung',
    'Mehrfachinserate Immobilien',
  ],
  alternates: { canonical: `${SITE_URL}/features` },
  openGraph: {
    type: 'website',
    url: `${SITE_URL}/features`,
    siteName: SITE_NAME,
    title: 'Funktionen – Maklernull',
    description:
      'Inserate einmal anlegen, auf mehreren Portalen veröffentlichen und alle Kontaktanfragen zentral verwalten – das sind die Kernfunktionen von Maklernull.',
    images: [
      {
        url: `${SITE_URL}/og/og-features.jpg`,
        width: 1200,
        height: 630,
        alt: 'Funktionen – Maklernull',
      },
    ],
    locale: 'de_DE',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Funktionen – Maklernull',
    description:
      'Maklernull vereinfacht Ihren Inserats-Alltag: zentrale Exposé-Verwaltung, Portal-Sync und einheitlicher Überblick über alle Leads.',
    images: [`${SITE_URL}/og/og-features.jpg`],
  },
  robots: { index: true, follow: true },
}

/* -------------------------------- JSON-LD --------------------------------- */
function JsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        name: 'Maklernull',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        url: `${SITE_URL}/features`,
        image: `${SITE_URL}/og/og-features.jpg`,
        description:
          'Maklernull ist die schlanke Webanwendung für Immobilienmakler: Zentrale Inserats-Verwaltung, Portal-Schnittstellen und Kontaktanfragen in einer Oberfläche.',
        offers: {
          '@type': 'Offer',
          price: '0.00',
          priceCurrency: 'EUR',
          description:
            'Maklernull unverbindlich kennenlernen und für Ihr Maklerbüro testen.',
          url: `${SITE_URL}/kontakt`,
        },
        publisher: {
          '@type': 'Organization',
          name: SITE_NAME,
          url: SITE_URL,
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Startseite', item: SITE_URL },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Funktionen',
            item: `${SITE_URL}/features`,
          },
        ],
      },
    ],
  }
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

/* ---------------------------------- Page ---------------------------------- */
export default function FeaturesPage() {
  return (
    <>
      <JsonLd />

      {/* Keyframes für weichen Glow */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes floatGlow {
            0%   { transform: translate3d(0,0,0); opacity:.45 }
            50%  { transform: translate3d(10px,10px,0); opacity:.7 }
            100% { transform: translate3d(0,0,0); opacity:.45 }
          }`,
        }}
      />

      <div className="space-y-20">
        {/* HERO */}
        <section className="relative overflow-visible">
          {/* Hintergrund-Glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-[-30vh] -z-10 h-[120vh] w-[180vw] -translate-x-1/2"
            style={{
              background:
                'radial-gradient(1200px 480px at 50% 0%, rgba(15,23,42,0.06), transparent),' +
                'radial-gradient(900px 420px at 12% 10%, rgba(15,23,42,0.04), transparent),' +
                'radial-gradient(900px 420px at 88% 8%, rgba(15,23,42,0.04), transparent)',
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -left-14 -top-10 -z-10 h-[26rem] w-[26rem] rounded-full"
            style={{
              background:
                'radial-gradient(closest-side, rgba(10,27,64,.22), rgba(10,27,64,0))',
              filter: 'blur(22px)',
              animation: 'floatGlow 18s ease-in-out infinite',
            }}
          />

          <div className="relative mx-auto max-w-6xl px-6 pt-12 sm:pt-16">
            <div className="rounded-3xl border border-white/60 bg-white/75 p-8 text-center shadow-[0_18px_50px_rgba(15,23,42,0.10)] backdrop-blur-xl ring-1 ring-white/60 sm:p-12">
              <div className="mx-auto mb-3 inline-flex flex-wrap items-center justify-center gap-2 rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold text-slate-900 ring-1 ring-white/60 backdrop-blur">
                <span
                  className="rounded-full px-2 py-0.5 text-white"
                  style={{ backgroundColor: PRIMARY }}
                >
                  Inserate • Portale • Kontaktanfragen
                </span>
                <span className="text-slate-400">•</span>
                <span>alles an einem Ort – speziell für Makler</span>
              </div>

              <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                Was Maklernull in Ihrem Alltag übernimmt.
              </h1>
              <p className="mx-auto mt-3 max-w-3xl text-sm sm:text-base leading-relaxed text-slate-700">
                Maklernull nimmt Ihnen Routinen ab: Sie pflegen ein Exposé zentral,
                veröffentlichen die Immobilie auf mehreren Portalen und behalten alle
                Kontaktanfragen in einer Oberfläche im Blick – ohne Tabellen, ohne
                Portal-Springen.
              </p>

              <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/kontakt"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white shadow transition sm:w-auto"
                  style={{
                    backgroundColor: PRIMARY,
                    boxShadow:
                      '0 6px 22px rgba(10,27,64,.25), inset 0 1px 0 rgba(255,255,255,.16)',
                  }}
                >
                  Beratung zu Maklernull anfragen
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    className="opacity-90"
                    fill="currentColor"
                    aria-hidden
                  >
                    <path d="M13.172 12l-4.95-4.95 1.414-1.414L16 12l-6.364 6.364-1.414-1.414z" />
                  </svg>
                </Link>
                <Link
                  href="/demo"
                  className="inline-flex w-full items-center justify-center rounded-full border border-white/60 bg-white/90 px-6 py-3 text-sm font-semibold text-slate-900 ring-1 ring-white/60 backdrop-blur hover:bg-white sm:w-auto"
                >
                  Live-Demo ansehen
                </Link>
              </div>

              <p className="mt-3 text-[10px] text-slate-500">
                Fokus auf das Wesentliche • EU-Hosting • Für Immobilienmakler entwickelt
              </p>
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

        {/* 3 KERNBEREICHE */}
        <section className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/60 bg-white/80 p-4 backdrop-blur-xl shadow-[0_8px_26px_rgba(15,23,42,0.06)]">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                Bereich 1
              </p>
              <h3 className="mt-1 text-sm font-semibold text-slate-900">
                Inserate & Exposés
              </h3>
              <p className="mt-1 text-xs text-slate-700">
                Stammdaten, Bilder und Texte nur einmal pflegen – Exposé steht überall
                identisch zur Verfügung.
              </p>
            </div>

            <div className="rounded-2xl border border-white/60 bg-white/80 p-4 backdrop-blur-xl shadow-[0_8px_26px_rgba(15,23,42,0.06)]">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                Bereich 2
              </p>
              <h3 className="mt-1 text-sm font-semibold text-slate-900">
                Portal-Schnittstellen
              </h3>
              <p className="mt-1 text-xs text-slate-700">
                Ihre Immobilie auf mehreren Portalen gleichzeitig – ohne alles mehrfach
                anzulegen.
              </p>
            </div>

            <div className="rounded-2xl border border-white/60 bg-white/80 p-4 backdrop-blur-xl shadow-[0_8px_26px_rgba(15,23,42,0.06)]">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                Bereich 3
              </p>
              <h3 className="mt-1 text-sm font-semibold text-slate-900">
                Kontaktanfragen & Überblick
              </h3>
              <p className="mt-1 text-xs text-slate-700">
                Alle Leads laufen an einem Ort zusammen – nachvollziehbar, pro Objekt
                und Portal getrennt.
              </p>
            </div>
          </div>
        </section>

        {/* 1) INSERATE & EXPOSÉS */}
        <section id="inserate" className="mx-auto max-w-6xl px-6">
          <div className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-[0_10px_34px_rgba(15,23,42,0.06)] backdrop-blur-xl ring-1 ring-white/60">
            <div className="mb-3 flex items-center gap-3">
              <div className="inline-flex rounded-2xl border border-white/60 bg-white/95 p-2 ring-1 ring-white/60">
                <DocumentTextIcon className="h-5 w-5 text-slate-900" />
              </div>
              <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-slate-900">
                Inserate & Exposés zentral verwalten
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-slate-700">
              Statt jedes Portal einzeln zu pflegen, verwalten Sie Ihre Immobilie in
              Maklernull: Objektstammdaten, Bilder, Texte und Ausstattungsmerkmale
              werden sauber strukturiert und können von dort aus in die Portale
              ausgespielt werden.
            </p>
            <ul className="mt-3 grid grid-cols-1 gap-1.5 text-[12px] text-slate-700 sm:grid-cols-2">
              <li className="flex gap-2">
                <span
                  className="mt-1 h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: PRIMARY }}
                />
                <span>Zentrales Exposé pro Immobilie – Stammdaten, Flächen, Preise, Energieausweis.</span>
              </li>
              <li className="flex gap-2">
                <span
                  className="mt-1 h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: PRIMARY }}
                />
                <span>Bildverwaltung mit Reihenfolge, Titeln und Auswahl für Vorschau-Bilder.</span>
              </li>
              <li className="flex gap-2">
                <span
                  className="mt-1 h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: PRIMARY }}
                />
                <span>Exposé-Texte einmal formulieren – in allen angebundenen Portalen identisch.</span>
              </li>
              <li className="flex gap-2">
                <span
                  className="mt-1 h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: PRIMARY }}
                />
                <span>Objektstatus (aktiv, pausiert, reserviert, verkauft / vermietet) klar sichtbar.</span>
              </li>
            </ul>
          </div>
        </section>

        {/* 2) PORTAL-SCHNITTSTELLEN */}
        <section id="portale" className="mx-auto max-w-6xl px-6">
          <div className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-[0_10px_34px_rgba(15,23,42,0.06)] backdrop-blur-xl ring-1 ring-white/60">
            <div className="mb-3 flex items-center gap-3">
              <div className="inline-flex rounded-2xl border border-white/60 bg-white/95 p-2 ring-1 ring-white/60">
                <ArrowUpOnSquareStackIcon className="h-5 w-5 text-slate-900" />
              </div>
              <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-slate-900">
                Portal-Schnittstellen & Veröffentlichung
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-slate-700">
              Maklernull wird zur Zentrale zwischen Ihrem Bestand und den
              Immobilienportalen. Sie entscheiden pro Objekt, auf welchen Portalen
              es erscheinen soll – Maklernull kümmert sich um die Übertragung.
            </p>
            <ul className="mt-3 grid grid-cols-1 gap-1.5 text-[12px] text-slate-700 sm:grid-cols-2">
              <li className="flex gap-2">
                <span
                  className="mt-1 h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: PRIMARY }}
                />
                <span>
                  Portalauswahl direkt am Objekt (z.&nbsp;B. Immobilienscout24, Immowelt, Kleinanzeigen*).
                </span>
              </li>
              <li className="flex gap-2">
                <span
                  className="mt-1 h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: PRIMARY }}
                />
                <span>Einmal veröffentlichen – Maklernull übernimmt den Abgleich mit den Portalen.</span>
              </li>
              <li className="flex gap-2">
                <span
                  className="mt-1 h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: PRIMARY }}
                />
                <span>Status-Anzeige: pro Portal sehen, ob das Inserat aktiv, pausiert oder fehlerhaft ist.</span>
              </li>
              <li className="flex gap-2">
                <span
                  className="mt-1 h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: PRIMARY }}
                />
                <span>Änderungen am Exposé werden synchron übernommen – ohne alles doppelt einzupflegen.</span>
              </li>
            </ul>

            <p className="mt-3 text-[11px] text-slate-500">
              * Die konkrete Liste angebundener Portale hängt von Ihrer individuellen Konfiguration ab.
            </p>
          </div>
        </section>

        {/* 3) KONTAKTANFRAGEN & ÜBERBLICK */}
        <section id="kontakte" className="mx-auto max-w-6xl px-6 space-y-6">
          {/* Leads & Kontaktanfragen */}
          <div className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-[0_10px_34px_rgba(15,23,42,0.06)] backdrop-blur-xl ring-1 ring-white/60">
            <div className="mb-3 flex items-center gap-3">
              <div className="inline-flex rounded-2xl border border-white/60 bg-white/95 p-2 ring-1 ring-white/60">
                <EnvelopeOpenIcon className="h-5 w-5 text-slate-900" />
              </div>
              <h3 className="text-lg font-semibold tracking-tight text-slate-900">
                Kontaktanfragen zentral bündeln
              </h3>
            </div>
            <p className="text-sm leading-relaxed text-slate-700">
              Egal, ob die Anfrage über Portal A, Portal B oder Ihre eigene Website
              kommt: Sie landet in Maklernull – direkt am passenden Objekt, inklusive
              Quelle und Zeitstempel.
            </p>
            <ul className="mt-3 grid grid-cols-1 gap-1.5 text-[12px] text-slate-700 sm:grid-cols-2">
              <li className="flex gap-2">
                <span
                  className="mt-1 h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: PRIMARY }}
                />
                <span>Alle Leads in einem Posteingang – nach Objekt und Portal filterbar.</span>
              </li>
              <li className="flex gap-2">
                <span
                  className="mt-1 h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: PRIMARY }}
                />
                <span>Kontaktkarte mit Name, E-Mail, Telefon und Nachricht des Interessenten.</span>
              </li>
              <li className="flex gap-2">
                <span
                  className="mt-1 h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: PRIMARY }}
                />
                <span>Zuordnung zu Mitarbeitenden (wer ruft wen wann zurück?).</span>
              </li>
              <li className="flex gap-2">
                <span
                  className="mt-1 h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: PRIMARY }}
                />
                <span>Notizen & Status (offen, in Bearbeitung, besichtigt, abgeschlossen).</span>
              </li>
            </ul>
          </div>

          {/* Überblick & Basis-Reporting */}
          <div className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-[0_10px_34px_rgba(15,23,42,0.06)] backdrop-blur-xl ring-1 ring-white/60">
            <div className="mb-3 flex items-center gap-3">
              <div className="inline-flex rounded-2xl border border-white/60 bg-white/95 p-2 ring-1 ring-white/60">
                <ChartBarIcon className="h-5 w-5 text-slate-900" />
              </div>
              <h3 className="text-lg font-semibold tracking-tight text-slate-900">
                Überblick behalten, ohne sich zu verlieren
              </h3>
            </div>
            <p className="text-sm leading-relaxed text-slate-700">
              Sie sehen auf einen Blick, welche Objekte gut laufen, wo wenig passiert
              und welche Portale die meisten Leads bringen – ohne komplizierte
              Statistik-Welt.
            </p>
            <ul className="mt-3 grid grid-cols-1 gap-1.5 text-[12px] text-slate-700 sm:grid-cols-2">
              <li className="flex gap-2">
                <span
                  className="mt-1 h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: PRIMARY }}
                />
                <span>Basis-Auswertung: Kontaktanfragen pro Objekt und pro Portal.</span>
              </li>
              <li className="flex gap-2">
                <span
                  className="mt-1 h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: PRIMARY }}
                />
                <span>Erkennen, welche Kanäle für Ihr Büro wirklich funktionieren.</span>
              </li>
              <li className="flex gap-2">
                <span
                  className="mt-1 h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: PRIMARY }}
                />
                <span>Filter nach Zeitraum, Objektstatus und Portal möglich.</span>
              </li>
            </ul>
          </div>
        </section>

        {/* WHY BLOCK – ABSCHLUSS */}
        <section className="mx-auto max-w-6xl px-6 pb-20">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
            Warum Maklernull – obwohl es bewusst “weniger” kann.
          </h2>
          <div className="mt-3 space-y-3 text-sm leading-relaxed text-slate-700">
            <p>
              Viele Systeme wollen alles gleichzeitig: komplette ERP-Lösungen, CRM,
              Terminplanung, Aufgaben, E-Mail, Telefonie und mehr. Maklernull
              konzentriert sich bewusst auf den Kern: Inserate, Portale und
              Kontaktanfragen – genau dort, wo im Alltag die meiste Routinearbeit
              entsteht.
            </p>
            <p>
              Sie pflegen jede Immobilie nur einmal, entscheiden, auf welchen Portalen
              sie erscheinen soll, und sehen alle Leads in einer Oberfläche. Keine
              Excel-Listen, kein mehrmaliges Einpflegen, kein Wechseln zwischen fünf
              Portalen, nur um den Überblick zu behalten.
            </p>
            <p>
              Maklernull ist damit die schlanke Schaltzentrale zwischen Ihrem
              Maklerbüro und den Immobilienportalen – mit genug Struktur, um Ruhe in
              den Alltag zu bringen, aber ohne die Komplexität einer überladenen
              All-in-One-Lösung.
            </p>
          </div>
        </section>
      </div>
    </>
  )
}
