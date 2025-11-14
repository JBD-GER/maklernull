// src/app/dashboard/inserieren/steps/StepKiTexte.tsx
'use client'

import { useEffect } from 'react'

type StepKiTexteProps = {
  aiLocationText: string
  setAiLocationText: (v: string) => void
  aiDescriptionText: string
  setAiDescriptionText: (v: string) => void
  aiEquipmentText: string
  setAiEquipmentText: (v: string) => void
  aiHighlightsText: string
  setAiHighlightsText: (v: string) => void
  aiLoading: boolean
  aiError: string | null
  onGenerate: () => void
}

export function StepKiTexte({
  aiLocationText,
  setAiLocationText,
  aiDescriptionText,
  setAiDescriptionText,
  aiEquipmentText,
  setAiEquipmentText,
  aiHighlightsText,
  setAiHighlightsText,
  aiLoading,
  aiError,
  onGenerate,
}: StepKiTexteProps) {
  // Beim ersten Betreten des Steps automatisch generieren,
  // aber nur, wenn noch keine Texte vorhanden sind:
  useEffect(() => {
    if (
      !aiLocationText &&
      !aiDescriptionText &&
      !aiEquipmentText &&
      !aiHighlightsText
    ) {
      onGenerate()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-medium text-slate-900">
            KI-Texte für dein Exposé
          </h2>
          <p className="text-xs text-slate-500">
            Auf Basis aller bisher eingegebenen Daten erstellt die KI typische
            Exposé-Texte wie Objektbeschreibung, Lage und Ausstattung. Du kannst
            alles im Anschluss beliebig anpassen.
          </p>
        </div>
        <div className="inline-flex items-center gap-1 rounded-full border border-indigo-100 bg-indigo-50 px-2.5 py-1 text-[10px] font-medium text-indigo-700">
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
          Powered by KI
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 px-3 py-2 text-[11px] text-slate-600">
        <div className="flex items-center gap-2">
          {aiLoading ? (
            <>
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
              <span>Die KI schreibt gerade deine Texte …</span>
            </>
          ) : (
            <>
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>
                Texte können jederzeit neu generiert werden – die KI nutzt dann
                deine aktuellen Formularangaben.
              </span>
            </>
          )}
        </div>
        <button
          type="button"
          onClick={onGenerate}
          disabled={aiLoading}
          className="inline-flex items-center rounded-full border border-slate-900 bg-slate-900 px-3 py-1.5 text-[11px] font-medium text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:border-slate-300 disabled:bg-slate-300"
        >
          {aiLoading ? 'Generiere…' : 'Neu generieren'}
        </button>
      </div>

      {aiError && (
        <p className="text-xs text-rose-600">
          {aiError}
        </p>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-xs font-medium text-slate-700">
            Objektbeschreibung
          </label>
          <textarea
            className="min-h-[140px] w-full resize-y rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 shadow-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
            placeholder="Die KI erstellt hier eine zusammenhängende Objektbeschreibung…"
            value={aiDescriptionText}
            onChange={(e) => setAiDescriptionText(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-slate-700">
            Lagebeschreibung
          </label>
          <textarea
            className="min-h-[140px] w-full resize-y rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 shadow-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
            placeholder="Die KI beschreibt hier die Lage – Infrastruktur, Umgebung, Besonderheiten…"
            value={aiLocationText}
            onChange={(e) => setAiLocationText(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-slate-700">
            Ausstattung
          </label>
          <textarea
            className="min-h-[140px] w-full resize-y rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 shadow-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
            placeholder="Hier fasst die KI Ausstattung, Modernisierungen und Komfort-Merkmale zusammen…"
            value={aiEquipmentText}
            onChange={(e) => setAiEquipmentText(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-slate-700">
            Highlights &amp; Sonstiges
          </label>
          <textarea
            className="min-h-[140px] w-full resize-y rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 shadow-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
            placeholder="Besondere Features, Zielgruppen, Nutzungsmöglichkeiten, rechtliche Hinweise, etc."
            value={aiHighlightsText}
            onChange={(e) => setAiHighlightsText(e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}
