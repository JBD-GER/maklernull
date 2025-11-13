'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

const PRIMARY = '#0a1b40'

export default function GlobalCTA() {
  return (
    <section className="relative mx-auto mt-16 mb-20 max-w-6xl px-4 sm:px-6">
      <motion.div
        className="relative overflow-hidden rounded-3xl border border-white/80 bg-white/96 p-8 text-center shadow-[0_22px_90px_rgba(15,23,42,0.16)] backdrop-blur-2xl sm:p-12"
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {/* Pulsierender Kreis zentriert IN der Box */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(15,23,42,0.09),transparent_70%)]"
          animate={{ opacity: [0.25, 0.8, 0.25], scale: [0.95, 1.06, 0.95] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Feiner Lichtstreifen oben */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-slate-300/90 to-transparent"
          animate={{ opacity: [0.15, 0.7, 0.15] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="relative space-y-4">
          {/* Label */}
          <div className="mx-auto inline-flex flex-wrap items-center justify-center gap-2 rounded-full bg-white/98 px-3 py-1 text-[10px] font-medium text-slate-900 ring-1 ring-white/90">
            <span
              className="rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-white"
              style={{ backgroundColor: PRIMARY }}
            >
              Maklernull
            </span>
            <span>Verkauf</span>
            <span className="text-slate-300">•</span>
            <span>Vermietung</span>
            <span className="text-slate-300">•</span>
            <span>Inserate auf Portalen</span>
            <span className="hidden text-slate-500 sm:inline">
              | Ihre Immobilie ohne Maklerprovision.
            </span>
          </div>

          {/* Headline */}
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Sie wollen verkaufen oder vermieten,
            <span className="block text-slate-900">
              aber keinen klassischen Makler beauftragen?
            </span>
          </h2>

          {/* Subline */}
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-slate-700 sm:text-base">
            Mit Maklernull inserieren Sie Ihre Immobilie auf großen Portalen,
            erhalten geprüfte Anfragen, ein professionelles Exposé und persönliche
            Unterstützung – zu einem einmaligen Paketpreis, ganz ohne Abo
            oder Maklercourtage.
          </p>

          {/* Key-Punkte */}
          <div className="mx-auto mt-3 flex flex-wrap justify-center gap-3 text-[10px] font-medium text-slate-600 sm:text-[11px]">
            <span className="rounded-full bg-white/98 px-3 py-1 ring-1 ring-slate-100">
              Einmalige Pakete – kein Abo
            </span>
            <span className="rounded-full bg-white/98 px-3 py-1 ring-1 ring-slate-100">
              Inserate auf bis zu 4 Portalen
            </span>
            <span className="rounded-full bg-white/98 px-3 py-1 ring-1 ring-slate-100">
              Geprüfte Anfragen statt Anruf-Chaos
            </span>
            <span className="rounded-full bg-white/98 px-3 py-1 ring-1 ring-slate-100">
              Persönlicher Ansprechpartner
            </span>
          </div>

          {/* CTA */}
          <div className="pt-5 flex flex-wrap items-center justify-center gap-3">
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.18 }}
            >
              <Link
                href="/preis"
                aria-label="Preise und Pakete von Maklernull ansehen"
                className="inline-flex items-center justify-center gap-2 rounded-full px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-white shadow-[0_14px_40px_rgba(15,23,42,0.45)] transition hover:shadow-[0_18px_55px_rgba(15,23,42,0.6)] sm:text-sm"
                style={{
                  backgroundImage: 'linear-gradient(to right, #020817, #0f172a)',
                }}
              >
                <span>Preise &amp; Pakete ansehen</span>
              </Link>
            </motion.div>

            <Link
              href="/support"
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white/95 px-6 py-3 text-[11px] font-medium text-slate-900 ring-1 ring-white/80 backdrop-blur hover:bg-white sm:text-sm"
            >
              Oder kurz beraten lassen
            </Link>
          </div>

          <p className="text-[9px] text-slate-500 sm:text-[10px]">
            Keine automatische Verlängerung. Alle Preise inkl. MwSt.{' '}
            <span className="hidden sm:inline">
              Unsicher, welches Paket passt? Rufen Sie uns an unter{' '}
              <a
                href="tel:+4950353169999"
                className="font-medium text-slate-900 underline decoration-slate-300 underline-offset-2"
              >
                05035 3169999
              </a>
              .
            </span>
          </p>
        </div>
      </motion.div>
    </section>
  )
}
