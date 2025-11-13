// src/app/(public)/docs/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://maklernull.de'
const PRIMARY = '#0a1b40'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Dokumentation – Maklernull',
    template: '%s | Maklernull',
  },
  description:
    'Maklernull Dokumentation: Ablauf, Pakete, Unterlagen-Upload, Status & Support.',
  alternates: { canonical: `${SITE_URL}/docs` },
  robots: { index: true, follow: true },
}

export default function DocsOverviewPage() {
  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-28 -bottom-16"
          style={{
            background:
              'radial-gradient(1400px 520px at 50% -10%, rgba(10,27,64,0.06), transparent), radial-gradient(1200px 480px at 90% -20%, rgba(10,27,64,0.05), transparent), radial-gradient(1200px 480px at 10% -20%, rgba(10,27,64,0.05), transparent)',
          }}
        />
        <div className="relative mx-auto max-w-6xl px-6 pt-12 sm:pt-16">
          <div className="rounded-3xl border border-white/60 bg-white/70 p-10 text-center shadow-[0_18px_70px_rgba(2,6,23,0.12)] backdrop-blur-xl ring-1 ring-white/60 sm:p-14">
            <div className="mx-auto mb-3 inline-flex items-center gap-2 rounded-full bg-white/85 px-3 py-1 text-[11px] font-semibold text-slate-900 ring-1 ring-white/60">
              <span
                className="rounded-full px-2 py-0.5 text-white"
                style={{ backgroundColor: PRIMARY }}
              >
                Hilfe & Docs
              </span>
              <span>Alle Anleitungen zu Maklernull an einem Ort</span>
            </div>

            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Dokumentation für <span className="whitespace-nowrap">Maklernull</span>
            </h1>
            <p className="mx-auto mt-3 max-w-3xl text-base leading-relaxed text-slate-700">
              Erfahren Sie Schritt für Schritt, wie Sie Ihr Paket buchen, Unterlagen
              hochladen, Verkauf oder Vermietung vorbereiten und bei Fragen direkt den
              richtigen Kontakt finden.
            </p>
          </div>
        </div>
      </section>

      {/* Kacheln */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              href: '/funktionen',
              title: 'Pakete & Leistungen',
              desc: 'Übersicht über Leistungen für Verkauf & Vermietung – von Inserierung bis Dokumentenprüfung.',
            },
            {
              href: '/preis',
              title: 'Preise & Laufzeiten',
              desc: 'Alle Pakete mit Preisen, Laufzeiten und enthaltenen Services im Vergleich.',
            },
            {
              href: '/status',
              title: 'Systemstatus & Hinweise',
              desc: 'Aktuelle Erreichbarkeit, Wartungen und wichtige Hinweise zu Maklernull.',
            },
            {
              href: '/support',
              title: 'Kontakt & Support',
              desc: 'So erreichen Sie uns bei Fragen zu Ihrem Paket, Unterlagen oder Inserat.',
            },
          ].map((i) => (
            <Link
              key={i.href}
              href={i.href}
              className="group relative overflow-hidden rounded-2xl border border-white/60 bg-white/70 p-6 shadow-[0_10px_40px_rgba(2,6,23,0.08)] backdrop-blur-xl ring-1 ring-white/60 transition hover:shadow-[0_16px_60px_rgba(2,6,23,0.12)]"
            >
              <div className="mb-2 text-sm font-semibold text-slate-900">
                {i.title}
              </div>
              <p className="text-sm leading-relaxed text-slate-700">
                {i.desc}
              </p>
              <div className="mt-3 text-[12px] font-semibold text-slate-900/70">
                Weiterlesen →
              </div>
              <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/60 opacity-0 blur-3xl transition group-hover:opacity-100" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
