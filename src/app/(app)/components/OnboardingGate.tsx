'use client'

import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { ChevronRightIcon } from '@heroicons/react/24/outline'

/* ---------------------------- Helper ---------------------------- */

function clsx(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(' ')
}

/* ---------------------------- Component ---------------------------- */

const LS_KEY = 'maklernull_welcome_seen_v1'

export default function OnboardingWelcome() {
  const [mounted, setMounted] = useState(false)
  const [open, setOpen] = useState(false)

  // Portal erst rendern, wenn im Browser
  useEffect(() => {
    setMounted(true)
  }, [])

  // Nur beim ersten Besuch/Login anzeigen (pro Browser, via localStorage)
  useEffect(() => {
    if (typeof window === 'undefined') return
    const seen = window.localStorage.getItem(LS_KEY)
    if (!seen) {
      setOpen(true)
    }
  }, [])

  const handleClose = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(LS_KEY, '1')
    }
    setOpen(false)
  }

  if (!mounted || !open) return null

  return createPortal(
    <div className="fixed inset-0 z-[1200]">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />

      {/* Dialog */}
      <div
        className={clsx(
          'absolute left-1/2 top-1/2 w-[min(600px,95vw)] -translate-x-1/2 -translate-y-1/2',
          'rounded-2xl border border-white/60 bg-white/95 p-5 shadow-[0_24px_80px_rgba(15,23,42,0.5)] backdrop-blur-xl'
        )}
      >
        <div className="mb-4">
          <h1 className="text-lg font-semibold text-slate-900">
            Willkommen bei Maklernull 👋
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            So läuft deine Vermarktung über Maklernull – vom ersten Inserat bis zum Laufzeitende deines Pakets.
          </p>
        </div>

        <div className="rounded-xl border border-slate-100 bg-white/80 p-4 text-sm text-slate-700">
          <ol className="list-decimal space-y-2 pl-5">
            <li>
              <span className="font-medium">Inserierung starten &amp; Daten angeben:&nbsp;</span>
              Lege deine Immobilie an, ergänze die wichtigsten Eckdaten (Lage, Beschreibung, Preis, Bilder)
              und wähle die Portale, in denen wir für dich inserieren sollen.
            </li>
            <li>
              <span className="font-medium">Paket auswählen:&nbsp;</span>
              Entscheide dich für ein Paket mit der gewünschten Laufzeit und Reichweite.
              Die Abrechnung läuft bequem über dein Maklernull-Konto.
            </li>
            <li>
              <span className="font-medium">Immobilie erfolgreich vermarkten:&nbsp;</span>
              Wir spielen dein Inserat automatisiert in die angebundenen Portale aus.
              Alle Interessentenanfragen werden direkt an dich bzw. deine hinterlegte Kontaktadresse
              (z.&nbsp;B. Eigentümer oder Makler) weitergeleitet – du übernimmst Besichtigungen und Abschluss.
            </li>
            <li>
              <span className="font-medium">Laufzeit &amp; Verlängerung:&nbsp;</span>
              Dein Paket läuft für die von dir gewählte Dauer. Wenn die Laufzeit abgelaufen ist,
              kannst du optional eine automatische Verlängerung aktivieren – andernfalls wird dein Paket
              automatisch beendet und die Inserate werden deaktiviert.
            </li>
          </ol>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            Später lesen
          </button>
          <button
            type="button"
            onClick={handleClose}
            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow hover:bg-black"
          >
            Verstanden – Inserierung starten
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
