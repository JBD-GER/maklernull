// src/app/dashboard/inserieren/steps/StepBasis.tsx

import type { TransactionType, UsageType, OfferType } from './types'
import { SALE_CATEGORIES, RENT_CATEGORIES, SUBTYPE_OPTIONS } from './types'

export type StepBasisProps = {
  transactionType: TransactionType
  setTransactionType: (v: TransactionType) => void
  usageType: UsageType
  setUsageType: (v: UsageType) => void
  offerType: OfferType
  setOfferType: (v: OfferType) => void
  saleCategory: string
  setSaleCategory: (v: string) => void
  rentCategory: string
  setRentCategory: (v: string) => void
  objectSubtype: string
  setObjectSubtype: (v: string) => void
  title: string
  setTitle: (v: string) => void
  description: string
  setDescription: (v: string) => void
}

export function StepBasis(props: StepBasisProps) {
  const {
    transactionType,
    setTransactionType,
    usageType,
    setUsageType,
    offerType,
    setOfferType,
    saleCategory,
    setSaleCategory,
    rentCategory,
    setRentCategory,
    objectSubtype,
    setObjectSubtype,
    title,
    setTitle,
    description,
    setDescription,
  } = props

  const categories =
    transactionType === 'sale' ? SALE_CATEGORIES : RENT_CATEGORIES

  const selectedCategory =
    transactionType === 'sale' ? saleCategory : rentCategory

  const subtypeOptions =
    (selectedCategory && SUBTYPE_OPTIONS[selectedCategory]) || []

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-sm font-medium text-slate-900">Basisangaben</h2>
        <p className="text-xs text-slate-500">
          Hier legst du fest, ob du vermietest oder verkaufst, ob es sich
          um eine Wohn- oder Gewerbeimmobilie handelt und wie dein Angebot
          grundsätzlich eingeordnet wird – ähnlich wie bei ImmoScout.
        </p>
      </div>

      {/* Verkauf / Vermietung + Nutzung */}
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="space-y-2 sm:col-span-1">
          <label className="text-xs font-medium text-slate-700">
            Art des Angebots
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setTransactionType('sale')}
              className={[
                'rounded-xl border px-3 py-2 text-xs font-medium transition',
                transactionType === 'sale'
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300',
              ].join(' ')}
            >
              Verkaufen
            </button>
            <button
              type="button"
              onClick={() => setTransactionType('rent')}
              className={[
                'rounded-xl border px-3 py-2 text-xs font-medium transition',
                transactionType === 'rent'
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300',
              ].join(' ')}
            >
              Vermieten
            </button>
          </div>
        </div>

        <div className="space-y-2 sm:col-span-1">
          <label className="text-xs font-medium text-slate-700">
            Nutzung
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setUsageType('residential')}
              className={[
                'rounded-xl border px-3 py-2 text-xs font-medium transition',
                usageType === 'residential'
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300',
              ].join(' ')}
            >
              Wohnen
            </button>
            <button
              type="button"
              onClick={() => setUsageType('commercial')}
              className={[
                'rounded-xl border px-3 py-2 text-xs font-medium transition',
                usageType === 'commercial'
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300',
              ].join(' ')}
            >
              Gewerbe / Anlage
            </button>
          </div>
        </div>

        <div className="space-y-2 sm:col-span-1">
          <label className="text-xs font-medium text-slate-700">
            Angebotsart
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setOfferType('private')}
              className={[
                'rounded-xl border px-3 py-2 text-xs font-medium transition',
                offerType === 'private'
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300',
              ].join(' ')}
            >
              Privat
            </button>
            <button
              type="button"
              onClick={() => setOfferType('commercial')}
              className={[
                'rounded-xl border px-3 py-2 text-xs font-medium transition',
                offerType === 'commercial'
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300',
              ].join(' ')}
            >
              Gewerblich
            </button>
          </div>
        </div>
      </div>

      {/* Objektart */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-slate-700">
          Objektart
        </label>
        <select
          className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
          value={transactionType === 'sale' ? saleCategory : rentCategory}
          onChange={(e) => {
            const value = e.target.value
            if (transactionType === 'sale') {
              setSaleCategory(value)
              setRentCategory('')
            } else {
              setRentCategory(value)
              setSaleCategory('')
            }
            // Objekttyp zurücksetzen, wenn Objektart geändert wird
            setObjectSubtype('')
          }}
        >
          <option value="">Bitte wählen</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <p className="text-[11px] text-slate-500">
          Entspricht der Objektart-Auswahl bei ImmoScout (Haus, Wohnung,
          Büro &amp; Praxis, …).
        </p>
      </div>

      {/* Objekttyp (abhängig von Objektart) */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-slate-700">
          Objekttyp
        </label>
        <select
          className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200 disabled:bg-slate-50 disabled:text-slate-400"
          value={objectSubtype}
          onChange={(e) => setObjectSubtype(e.target.value)}
          disabled={!selectedCategory}
        >
          {!selectedCategory && (
            <option value="">Bitte zuerst eine Objektart wählen</option>
          )}
          {selectedCategory && (
            <>
              <option value="">Bitte wählen</option>
              {subtypeOptions.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
              {/* Fallback-Auswahl, falls nichts passt */}
              <option value="Sonstiger Objekttyp">Sonstiger Objekttyp</option>
            </>
          )}
        </select>
        <p className="text-[11px] text-slate-500">
          Die Auswahl richtet sich nach der Objektart. Wenn nichts exakt
          passt, wähle „Sonstiger Objekttyp“.
        </p>
      </div>

      {/* Titel + Beschreibung */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-slate-700">
          Exposé-Titel
        </label>
        <input
          type="text"
          className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
          placeholder="z.B. Moderne 3-Zimmer-Wohnung mit Balkon in zentraler Lage"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-medium text-slate-700">
          Kurzbeschreibung
        </label>
        <textarea
          className="min-h-[100px] w-full resize-y rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
          placeholder="Was macht deine Immobilie besonders? Lage, Ausstattung, Besonderheiten..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
    </div>
  )
}
