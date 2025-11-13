// src/app/(public)/preis/PriceTabs.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CheckIcon } from '@heroicons/react/24/outline'

const PRIMARY = '#0a1b40'

type Tab = 'verkauf' | 'vermietung'

type Paket = {
  id: string
  label: string
  shortName: string
  priceFrom: string
  hint: string
  duration: string
  badge?: 'Empfehlung'
  bullets: string[]
}

const verkaufPakete: Paket[] = [
  {
    id: 'vk-basis',
    label: 'VK-Basis',
    shortName: 'VK-Basis',
    priceFrom: 'ab 249 €',
    hint: 'inkl. MwSt. • einmalig',
    duration: 'Dauer: in der Regel 1–3 Monate',
    bullets: [
      'Inserierung auf Immobilienscout24',
      'Erstellung eines Exposés',
      'Automatische Anfragenweiterleitung',
      'Aktiver Kundensupport',
      'KI-erstellte Texte (Beta)',
      'Prüfung der Baufinanzierung',
    ],
  },
  {
    id: 'vk-premium',
    label: 'VK-Premium',
    shortName: 'VK-Premium',
    priceFrom: 'ab 399 €',
    hint: 'inkl. MwSt. • einmalig',
    duration: 'Dauer: in der Regel 1–3 Monate',
    badge: 'Empfehlung',
    bullets: [
      'Inserierung auf allen vier Portalen',
      'Erstellung eines Exposés',
      'Automatische Anfragenweiterleitung',
      'Aktiver Kundensupport',
      'KI-erstellte Texte (Beta)',
      'Prüfung der Baufinanzierung',
      'Geprüfte Anfragen',
      'Terminkoordinierung',
      'Individuelle Fragen für Anfragen',
      'Dokumentenprüfung',
      'Immobilienbewertung',
      'Aktualisierung der Anzeige',
      'Persönlicher Ansprechpartner',
      'Anzeigenoptimierung',
    ],
  },
  {
    id: 'vk-top',
    label: 'VK-Top',
    shortName: 'VK-Top',
    priceFrom: 'ab 299 €',
    hint: 'inkl. MwSt. • einmalig',
    duration: 'Dauer: in der Regel 1–3 Monate',
    bullets: [
      'Inserierung auf allen vier Portalen',
      'Erstellung eines Exposés',
      'Automatische Anfragenweiterleitung',
      'Aktiver Kundensupport',
      'KI-erstellte Texte (Beta)',
      'Prüfung der Baufinanzierung',
      'Geprüfte Anfragen',
      'Terminkoordinierung',
      'Individuelle Fragen für Anfragen',
      'Dokumentenprüfung',
    ],
  },
]

const vermietungPakete: Paket[] = [
  {
    id: 'vm-basis',
    label: 'VM-Basis',
    shortName: 'VM-Basis',
    priceFrom: 'ab 199 €',
    hint: 'inkl. MwSt. • einmalig',
    duration: 'Dauer: in der Regel 1–3 Monate',
    bullets: [
      'Inserierung auf Immobilienscout24',
      'Digitale Mietvertragserstellung',
      'Automatische Anfragenweiterleitung',
      'Aktiver Kundensupport',
      'KI-erstellte Texte (Beta)',
    ],
  },
  {
    id: 'vm-premium',
    label: 'VM-Premium',
    shortName: 'VM-Premium',
    priceFrom: 'ab 349 €',
    hint: 'inkl. MwSt. • einmalig',
    duration: 'Dauer: in der Regel 1–3 Monate',
    badge: 'Empfehlung',
    bullets: [
      'Inserierung auf allen vier Portalen',
      'Digitale Mietvertragserstellung',
      'Automatische Anfragenweiterleitung',
      'Aktiver Kundensupport',
      'KI-erstellte Texte (Beta)',
      'Geprüfte Anfragen',
      'Terminkoordinierung',
      'Individuelle Fragen für Anfragen',
      'Dokumentenprüfung',
      'Mietpreisprüfung',
      'Aktualisierung der Anzeige',
      'Persönlicher Ansprechpartner',
      'Anzeigenoptimierung',
    ],
  },
  {
    id: 'vm-top',
    label: 'VM-Top',
    shortName: 'VM-Top',
    priceFrom: 'ab 249 €',
    hint: 'inkl. MwSt. • einmalig',
    duration: 'Dauer: in der Regel 1–3 Monate',
    bullets: [
      'Inserierung auf allen vier Portalen',
      'Digitale Mietvertragserstellung',
      'Automatische Anfragenweiterleitung',
      'Aktiver Kundensupport',
      'KI-erstellte Texte (Beta)',
      'Geprüfte Anfragen',
      'Terminkoordinierung',
      'Individuelle Fragen für Anfragen',
    ],
  },
]

export default function PriceTabs() {
  const [active, setActive] = useState<Tab>('verkauf')
  const pakete = active === 'verkauf' ? verkaufPakete : vermietungPakete

  return (
    <div className="space-y-8 md:space-y-10">
      {/* Tabs */}
      <div className="mx-auto flex max-w-xs sm:max-w-md items-center justify-center rounded-full border border-white/70 bg-white/60 p-1.5 text-xs font-semibold text-slate-700 shadow-[0_10px_30px_rgba(15,23,42,0.18)] backdrop-blur-xl ring-1 ring-white/70">
        <button
          type="button"
          onClick={() => setActive('verkauf')}
          className={`flex-1 inline-flex h-9 sm:h-10 items-center justify-center rounded-full px-4 text-[11px] sm:text-xs leading-none transition-all duration-200 ${
            active === 'verkauf'
              ? 'bg-slate-900 text-white shadow-[0_10px_26px_rgba(15,23,42,0.55)]'
              : 'text-slate-700 hover:bg-white/85'
          }`}
        >
          Verkauf
        </button>
        <button
          type="button"
          onClick={() => setActive('vermietung')}
          className={`flex-1 inline-flex h-9 sm:h-10 items-center justify-center rounded-full px-4 text-[11px] sm:text-xs leading-none transition-all duration-200 ${
            active === 'vermietung'
              ? 'bg-slate-900 text-white shadow-[0_10px_26px_rgba(15,23,42,0.55)]'
              : 'text-slate-700 hover:bg-white/85'
          }`}
        >
          Vermietung
        </button>
      </div>

      {/* Pakete */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {pakete.map((paket) => (
          <div
            key={paket.id}
            className={`relative flex h-full flex-col rounded-3xl border border-white/70 bg-white/82 p-5 shadow-[0_16px_46px_rgba(2,6,23,0.08)] backdrop-blur-xl ring-1 ring-white/70 ${
              paket.badge ? 'md:-mt-3 md:pb-6 md:pt-7' : ''
            }`}
          >
            {paket.badge && (
              <div className="absolute -top-3 left-5 inline-flex items-center gap-1 rounded-full bg-amber-500 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white shadow-[0_10px_30px_rgba(245,158,11,0.6)]">
                Empfehlung
              </div>
            )}

            <div className="mb-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                {active === 'verkauf' ? 'Verkauf' : 'Vermietung'}
              </p>
              <h3 className="text-lg font-semibold text-slate-900">
                {paket.label}
              </h3>
              <p className="mt-1 text-xs text-slate-600">
                {paket.duration}
              </p>
            </div>

            <div className="mb-3">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-semibold text-slate-900">
                  {paket.priceFrom}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                {paket.hint}. Kein Abo, keine automatische Verlängerung.
              </p>
            </div>

            <ul className="mt-3 space-y-1.5 text-[12px] text-slate-700">
              {paket.bullets.map((b) => (
                <li key={b} className="flex gap-2">
                  <span
                    className="mt-1 inline-flex h-4 w-4 items-center justify-center rounded-full text-white"
                    style={{ backgroundColor: PRIMARY }}
                  >
                    <CheckIcon className="h-3 w-3" />
                  </span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            {/* CTA-Bereich fest ans Boxende */}
            <div className="mt-auto flex flex-col gap-2 pt-4">
              <Link
                href="/registrieren"
                className="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.16em] text-white shadow-[0_10px_30px_rgba(15,23,42,0.6)]"
                style={{
                  backgroundImage:
                    'linear-gradient(to right, #020617, #0f172a)',
                }}
              >
                Immobilie inserieren
              </Link>
              <a
                href="#preise-uebersicht"
                className="inline-flex items-center justify-center rounded-full border border-white/70 bg-white/90 px-5 py-2 text-[12px] font-semibold text-slate-900 ring-1 ring-white/70 backdrop-blur hover:bg-white"
              >
                Alle Preise auf einen Blick
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
