// src/app/dashboard/inserieren/steps/StepDetails.tsx

import type { UsageType } from './types'

export type StepDetailsProps = {
  objectCategory: string
  usageType: UsageType
  livingArea: string
  setLivingArea: (v: string) => void
  landArea: string
  setLandArea: (v: string) => void
  rooms: string
  setRooms: (v: string) => void
  floor: string
  setFloor: (v: string) => void
  totalFloors: string
  setTotalFloors: (v: string) => void
  yearBuilt: string
  setYearBuilt: (v: string) => void
  condition: string
  setCondition: (v: string) => void
  isCurrentlyRented: boolean
  setIsCurrentlyRented: (v: boolean) => void
}

type CategoryConfig = {
  showLivingArea: boolean
  livingAreaLabel: string
  showLandArea: boolean
  landAreaLabel: string
  showRooms: boolean
  roomsLabel: string
  showFloor: boolean
  floorLabel: string
  showTotalFloors: boolean
  totalFloorsLabel: string
  showYearBuilt: boolean
}

// 👉 individuelle Konfiguration je Objektart (entspricht deinen SALE_CATEGORIES / RENT_CATEGORIES)
const CATEGORY_CONFIG: Record<string, CategoryConfig> = {
  Haus: {
    showLivingArea: true,
    livingAreaLabel: 'Wohnfläche (m²)',
    showLandArea: true,
    landAreaLabel: 'Grundstücksfläche (m²)',
    showRooms: true,
    roomsLabel: 'Zimmer',
    showFloor: false,
    floorLabel: 'Etage',
    showTotalFloors: true,
    totalFloorsLabel: 'Etagen im Haus',
    showYearBuilt: true,
  },
  Wohnung: {
    showLivingArea: true,
    livingAreaLabel: 'Wohnfläche (m²)',
    showLandArea: false,
    landAreaLabel: 'Grundstück (m²)',
    showRooms: true,
    roomsLabel: 'Zimmer',
    showFloor: true,
    floorLabel: 'Etage',
    showTotalFloors: true,
    totalFloorsLabel: 'Etagen im Haus',
    showYearBuilt: true,
  },
  Grundstück: {
    showLivingArea: false,
    livingAreaLabel: 'Fläche (m²)',
    showLandArea: true,
    landAreaLabel: 'Grundstücksfläche (m²)',
    showRooms: false,
    roomsLabel: 'Zimmer',
    showFloor: false,
    floorLabel: 'Etage',
    showTotalFloors: false,
    totalFloorsLabel: 'Etagen gesamt',
    showYearBuilt: false,
  },
  'WG-Zimmer': {
    showLivingArea: true,
    livingAreaLabel: 'Wohnfläche (m²)',
    showLandArea: false,
    landAreaLabel: 'Grundstück (m²)',
    showRooms: true,
    roomsLabel: 'Zimmer (gesamt)',
    showFloor: true,
    floorLabel: 'Etage',
    showTotalFloors: true,
    totalFloorsLabel: 'Etagen im Haus',
    showYearBuilt: true,
  },
  'Büro & Praxis': {
    showLivingArea: true,
    livingAreaLabel: 'Büro-/Praxisfläche (m²)',
    showLandArea: false,
    landAreaLabel: 'Grundstück (m²)',
    showRooms: true,
    roomsLabel: 'Räume',
    showFloor: true,
    floorLabel: 'Etage',
    showTotalFloors: true,
    totalFloorsLabel: 'Geschosse im Gebäude',
    showYearBuilt: true,
  },
  Einzelhandel: {
    showLivingArea: true,
    livingAreaLabel: 'Verkaufsfläche (m²)',
    showLandArea: false,
    landAreaLabel: 'Grundstück (m²)',
    showRooms: false,
    roomsLabel: 'Räume',
    showFloor: true,
    floorLabel: 'Etage',
    showTotalFloors: true,
    totalFloorsLabel: 'Geschosse im Gebäude',
    showYearBuilt: true,
  },
  'Gastronomie / Beherbergung': {
    showLivingArea: true,
    livingAreaLabel: 'Gastro-/Nutzfläche (m²)',
    showLandArea: true,
    landAreaLabel: 'Grundstück (m²)',
    showRooms: true,
    roomsLabel: 'Zimmer/Einheiten',
    showFloor: true,
    floorLabel: 'Etage',
    showTotalFloors: true,
    totalFloorsLabel: 'Etagen im Gebäude',
    showYearBuilt: true,
  },
  'Gewerbliche Freizeitimmobilie': {
    showLivingArea: true,
    livingAreaLabel: 'Nutzfläche (m²)',
    showLandArea: true,
    landAreaLabel: 'Grundstück (m²)',
    showRooms: false,
    roomsLabel: 'Räume',
    showFloor: false,
    floorLabel: 'Etage',
    showTotalFloors: false,
    totalFloorsLabel: 'Etagen gesamt',
    showYearBuilt: true,
  },
  'Land- / Forstwirtschaftliches Objekt': {
    showLivingArea: false,
    livingAreaLabel: 'Nutzfläche (m²)',
    showLandArea: true,
    landAreaLabel: 'Fläche gesamt (m²)',
    showRooms: false,
    roomsLabel: 'Räume',
    showFloor: false,
    floorLabel: 'Etage',
    showTotalFloors: false,
    totalFloorsLabel: 'Etagen gesamt',
    showYearBuilt: true,
  },
  'Produktions- / Lager- / Gewerbehalle': {
    showLivingArea: true,
    livingAreaLabel: 'Hallen-/Nutzfläche (m²)',
    showLandArea: true,
    landAreaLabel: 'Grundstück (m²)',
    showRooms: false,
    roomsLabel: 'Räume',
    showFloor: false,
    floorLabel: 'Ebene',
    showTotalFloors: false,
    totalFloorsLabel: 'Ebenen gesamt',
    showYearBuilt: true,
  },
  'Zinshaus oder Renditeobjekt': {
    showLivingArea: true,
    livingAreaLabel: 'Gesamtfläche (m²)',
    showLandArea: true,
    landAreaLabel: 'Grundstück (m²)',
    showRooms: true,
    roomsLabel: 'Einheiten (Wohnen/Gewerbe)',
    showFloor: false,
    floorLabel: 'Etage',
    showTotalFloors: true,
    totalFloorsLabel: 'Etagen im Gebäude',
    showYearBuilt: true,
  },
  'Garagen, Stellplätze': {
    showLivingArea: false,
    livingAreaLabel: 'Nutzfläche (m²)',
    showLandArea: true,
    landAreaLabel: 'Fläche (m²)',
    showRooms: false,
    roomsLabel: 'Räume',
    showFloor: false,
    floorLabel: 'Etage',
    showTotalFloors: false,
    totalFloorsLabel: 'Etagen gesamt',
    showYearBuilt: false,
  },
}

// Fallback, falls irgendwann neue Kategorien dazukommen
function getFallbackConfig(usageType: UsageType): CategoryConfig {
  const isResidential = usageType === 'residential'
  return {
    showLivingArea: true,
    livingAreaLabel: isResidential ? 'Wohnfläche (m²)' : 'Nutzfläche (m²)',
    showLandArea: false,
    landAreaLabel: 'Grundstück (m²)',
    showRooms: isResidential,
    roomsLabel: isResidential ? 'Zimmer' : 'Räume',
    showFloor: true,
    floorLabel: 'Etage',
    showTotalFloors: true,
    totalFloorsLabel: 'Etagen gesamt',
    showYearBuilt: true,
  }
}

export function StepDetails({
  objectCategory,
  usageType,
  livingArea,
  setLivingArea,
  landArea,
  setLandArea,
  rooms,
  setRooms,
  floor,
  setFloor,
  totalFloors,
  setTotalFloors,
  yearBuilt,
  setYearBuilt,
  condition,
  setCondition,
  isCurrentlyRented,
  setIsCurrentlyRented,
}: StepDetailsProps) {
  const category = objectCategory || ''

  const cfg =
    CATEGORY_CONFIG[category] ?? getFallbackConfig(usageType)

  const {
    showLivingArea,
    livingAreaLabel,
    showLandArea,
    landAreaLabel,
    showRooms,
    roomsLabel,
    showFloor,
    floorLabel,
    showTotalFloors,
    totalFloorsLabel,
    showYearBuilt,
  } = cfg

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-sm font-medium text-slate-900">
          Eckdaten der Immobilie
        </h2>
        <p className="text-xs text-slate-500">
          Fläche, Baujahr und Zustand sind die wichtigsten Kennzahlen. Die
          Felder passen sich automatisch an die gewählte Objektart an
          (z.&nbsp;B. Grundstücksfläche bei Grundstücken oder Bürofläche bei
          Gewerbeobjekten).
        </p>
      </div>

      {/* Fläche / Grundstück / Zimmer */}
      <div className="grid gap-3 sm:grid-cols-3">
        {showLivingArea && (
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-700">
              {livingAreaLabel}
            </label>
            <input
              type="number"
              min={0}
              className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
              value={livingArea}
              onChange={(e) => setLivingArea(e.target.value)}
            />
          </div>
        )}

        {showLandArea && (
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-700">
              {landAreaLabel}
            </label>
            <input
              type="number"
              min={0}
              className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
              value={landArea}
              onChange={(e) => setLandArea(e.target.value)}
            />
          </div>
        )}

        {showRooms && (
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-700">
              {roomsLabel}
            </label>
            <input
              type="number"
              min={0}
              step={0.5}
              className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
              value={rooms}
              onChange={(e) => setRooms(e.target.value)}
            />
          </div>
        )}
      </div>

      {/* Etage / Etagen gesamt / Baujahr */}
      <div className="grid gap-3 sm:grid-cols-3">
        {showFloor && (
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-700">
              {floorLabel}
            </label>
            <input
              type="text"
              className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
              value={floor}
              onChange={(e) => setFloor(e.target.value)}
            />
          </div>
        )}

        {showTotalFloors && (
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-700">
              {totalFloorsLabel}
            </label>
            <input
              type="text"
              className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
              value={totalFloors}
              onChange={(e) => setTotalFloors(e.target.value)}
            />
          </div>
        )}

        {showYearBuilt && (
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-700">
              Baujahr
            </label>
            <input
              type="number"
              min={1800}
              max={2100}
              className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
              value={yearBuilt}
              onChange={(e) => setYearBuilt(e.target.value)}
            />
          </div>
        )}
      </div>

      {/* Zustand + Vermietung */}
      <div className="grid gap-3 sm:grid-cols-[1.5fr,1fr]">
        <div className="space-y-2">
          <label className="text-xs font-medium text-slate-700">
            Zustand
          </label>
          <select
            className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
          >
            <option value="">Keine Angaben</option>
            <option value="Erstbezug">Erstbezug</option>
            <option value="Erstbezug nach Sanierung">
              Erstbezug nach Sanierung
            </option>
            <option value="Neuwertig">Neuwertig</option>
            <option value="saniert">saniert</option>
            <option value="gepflegt">gepflegt</option>
            <option value="renovierungsbedürftig">
              renovierungsbedürftig
            </option>
            <option value="renoviert">renoviert</option>
            <option value="modernisiert">modernisiert</option>
            <option value="nach Vereinbarung">nach Vereinbarung</option>
            <option value="Abbruchreif">Abbruchreif</option>
            <option value="Rohbau">Rohbau</option>
            <option value="Entkernt">Entkernt</option>
          </select>
        </div>

        <div className="flex items-end">
          <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-700">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-200"
              checked={isCurrentlyRented}
              onChange={(e) => setIsCurrentlyRented(e.target.checked)}
            />
            Aktuell (teilweise) vermietet
          </label>
        </div>
      </div>
    </div>
  )
}
