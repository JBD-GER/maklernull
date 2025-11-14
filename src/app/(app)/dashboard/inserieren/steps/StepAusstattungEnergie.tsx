'use client'

import {
  EnergyCertificateAvailable,
  EnergyCertificateType,
} from './types'

export type StepAusstattungEnergieProps = {
  hasBalcony: boolean
  setHasBalcony: (v: boolean) => void
  hasTerrace: boolean
  setHasTerrace: (v: boolean) => void
  hasGarden: boolean
  setHasGarden: (v: boolean) => void
  hasBuiltinKitchen: boolean
  setHasBuiltinKitchen: (v: boolean) => void
  hasElevator: boolean
  setHasElevator: (v: boolean) => void
  hasCellar: boolean
  setHasCellar: (v: boolean) => void
  isBarrierFree: boolean
  setIsBarrierFree: (v: boolean) => void
  hasGuestWC: boolean
  setHasGuestWC: (v: boolean) => void
  hasParkingSpace: boolean
  setHasParkingSpace: (v: boolean) => void
  parkingSpaces: string
  setParkingSpaces: (v: string) => void
  parkingSpacePrice: string
  setParkingSpacePrice: (v: string) => void
  energyCertificateAvailable: EnergyCertificateAvailable
  setEnergyCertificateAvailable: (v: EnergyCertificateAvailable) => void
  energyCertificateType: EnergyCertificateType
  setEnergyCertificateType: (v: EnergyCertificateType) => void
  energyEfficiencyClass: string
  setEnergyEfficiencyClass: (v: string) => void
  energyConsumption: string
  setEnergyConsumption: (v: string) => void
  primaryEnergySource: string
  setPrimaryEnergySource: (v: string) => void
  heatingType: string
  setHeatingType: (v: string) => void
  firingType: string
  setFiringType: (v: string) => void
  energyCertificateIssueDate: string
  setEnergyCertificateIssueDate: (v: string) => void
  energyCertificateValidUntil: string
  setEnergyCertificateValidUntil: (v: string) => void
}

export function StepAusstattungEnergie({
  hasBalcony,
  setHasBalcony,
  hasTerrace,
  setHasTerrace,
  hasGarden,
  setHasGarden,
  hasBuiltinKitchen,
  setHasBuiltinKitchen,
  hasElevator,
  setHasElevator,
  hasCellar,
  setHasCellar,
  isBarrierFree,
  setIsBarrierFree,
  hasGuestWC,
  setHasGuestWC,
  hasParkingSpace,
  setHasParkingSpace,
  parkingSpaces,
  setParkingSpaces,
  parkingSpacePrice,
  setParkingSpacePrice,
  energyCertificateAvailable,
  setEnergyCertificateAvailable,
  energyCertificateType,
  setEnergyCertificateType,
  energyEfficiencyClass,
  setEnergyEfficiencyClass,
  energyConsumption,
  setEnergyConsumption,
  primaryEnergySource,
  setPrimaryEnergySource,
  heatingType,
  setHeatingType,
  firingType,
  setFiringType,
  energyCertificateIssueDate,
  setEnergyCertificateIssueDate,
  energyCertificateValidUntil,
  setEnergyCertificateValidUntil,
}: StepAusstattungEnergieProps) {
  const showEnergyDetails =
    energyCertificateAvailable === 'yes' ||
    energyCertificateAvailable === 'not_required'

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-sm font-medium text-slate-900">
          Ausstattung & Energie
        </h2>
        <p className="text-xs text-slate-500">
          Hier erfasst du die wichtigsten Ausstattungsmerkmale und
          Energieausweisdaten – so wie es Interessenten und Portale erwarten.
        </p>
      </div>

      {/* Ausstattung */}
      <div className="space-y-2">
        <h3 className="text-xs font-medium text-slate-700">
          Ausstattung
        </h3>
        <div className="grid gap-2 text-xs sm:grid-cols-2">
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-200"
              checked={hasBalcony}
              onChange={(e) => setHasBalcony(e.target.checked)}
            />
            Balkon
          </label>
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-200"
              checked={hasTerrace}
              onChange={(e) => setHasTerrace(e.target.checked)}
            />
            Terrasse
          </label>
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-200"
              checked={hasGarden}
              onChange={(e) => setHasGarden(e.target.checked)}
            />
            Garten
          </label>
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-200"
              checked={hasBuiltinKitchen}
              onChange={(e) => setHasBuiltinKitchen(e.target.checked)}
            />
            Einbauküche
          </label>
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-200"
              checked={hasElevator}
              onChange={(e) => setHasElevator(e.target.checked)}
            />
            Aufzug
          </label>
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-200"
              checked={hasCellar}
              onChange={(e) => setHasCellar(e.target.checked)}
            />
            Keller
          </label>
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-200"
              checked={isBarrierFree}
              onChange={(e) => setIsBarrierFree(e.target.checked)}
            />
            Barrierefrei
          </label>
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-200"
              checked={hasGuestWC}
              onChange={(e) => setHasGuestWC(e.target.checked)}
            />
            Gäste-WC
          </label>
        </div>
      </div>

      {/* Stellplätze */}
      <div className="space-y-2 rounded-2xl border border-slate-100 bg-slate-50/70 p-3 text-xs text-slate-700">
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-200"
            checked={hasParkingSpace}
            onChange={(e) => setHasParkingSpace(e.target.checked)}
          />
          Stellplatz / Garage vorhanden
        </label>
        {hasParkingSpace && (
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-700">
                Anzahl Stellplätze
              </label>
              <input
                type="number"
                min={0}
                className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 shadow-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                value={parkingSpaces}
                onChange={(e) => setParkingSpaces(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-700">
                Preis / Miete je Stellplatz
              </label>
              <input
                type="number"
                min={0}
                className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 shadow-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                value={parkingSpacePrice}
                onChange={(e) => setParkingSpacePrice(e.target.value)}
              />
            </div>
          </div>
        )}
      </div>

      {/* Energieausweis */}
      <div className="space-y-3">
        <h3 className="text-xs font-medium text-slate-700">
          Energieausweis
        </h3>

        <div className="space-y-2">
          <label className="text-[11px] font-medium text-slate-700">
            Energieausweis vorhanden?
          </label>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <button
              type="button"
              onClick={() => setEnergyCertificateAvailable('yes')}
              className={[
                'rounded-xl border px-3 py-1.5 font-medium transition',
                energyCertificateAvailable === 'yes'
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300',
              ].join(' ')}
            >
              Ja
            </button>
            <button
              type="button"
              onClick={() => setEnergyCertificateAvailable('no')}
              className={[
                'rounded-xl border px-3 py-1.5 font-medium transition',
                energyCertificateAvailable === 'no'
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300',
              ].join(' ')}
            >
              Nein
            </button>
            <button
              type="button"
              onClick={() =>
                setEnergyCertificateAvailable('not_required')
              }
              className={[
                'rounded-xl border px-3 py-1.5 font-medium transition',
                energyCertificateAvailable === 'not_required'
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300',
              ].join(' ')}
            >
              Nicht erforderlich
            </button>
          </div>
        </div>

        {showEnergyDetails && (
          <>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-[11px] font-medium text-slate-700">
                  Art des Energieausweises
                </label>
                <select
                  className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 shadow-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                  value={energyCertificateType}
                  onChange={(e) =>
                    setEnergyCertificateType(
                      e.target.value as EnergyCertificateType
                    )
                  }
                >
                  <option value="">Bitte wählen</option>
                  <option value="consumption">Verbrauchsausweis</option>
                  <option value="demand">Bedarfsausweis</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-medium text-slate-700">
                  Energieeffizienzklasse
                </label>
                <select
                  className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 shadow-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                  value={energyEfficiencyClass}
                  onChange={(e) => setEnergyEfficiencyClass(e.target.value)}
                >
                  <option value="">Keine Angabe</option>
                  <option value="A+">A+</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                  <option value="E">E</option>
                  <option value="F">F</option>
                  <option value="G">G</option>
                  <option value="H">H</option>
                </select>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-[11px] font-medium text-slate-700">
                  Endenergiebedarf/-verbrauch (kWh/(m²·a))
                </label>
                <input
                  type="number"
                  min={0}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 shadow-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                  value={energyConsumption}
                  onChange={(e) => setEnergyConsumption(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-medium text-slate-700">
                  Hauptenergieträger
                </label>
                <select
                  className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 shadow-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                  value={primaryEnergySource}
                  onChange={(e) =>
                    setPrimaryEnergySource(e.target.value)
                  }
                >
                  <option value="">Keine Angabe</option>
                  <option value="Gas">Gas</option>
                  <option value="Öl">Öl</option>
                  <option value="Fernwärme">Fernwärme</option>
                  <option value="Wärmepumpe">Wärmepumpe</option>
                  <option value="Strom">Strom</option>
                  <option value="Holz/Pellets">Holz / Pellets</option>
                  <option value="Sonstige">Sonstige</option>
                </select>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-[11px] font-medium text-slate-700">
                  Heizungsart
                </label>
                <input
                  type="text"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 shadow-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                  placeholder="z.B. Zentralheizung, Fernwärme, Fußbodenheizung..."
                  value={heatingType}
                  onChange={(e) => setHeatingType(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-medium text-slate-700">
                  Art der Befeuerung
                </label>
                <input
                  type="text"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 shadow-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                  placeholder="z.B. Gas, Öl, Wärmepumpe..."
                  value={firingType}
                  onChange={(e) => setFiringType(e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-[11px] font-medium text-slate-700">
                  Energieausweis ausgestellt am
                </label>
                <input
                  type="date"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 shadow-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                  value={energyCertificateIssueDate}
                  onChange={(e) =>
                    setEnergyCertificateIssueDate(e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-medium text-slate-700">
                  Energieausweis gültig bis
                </label>
                <input
                  type="date"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 shadow-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                  value={energyCertificateValidUntil}
                  onChange={(e) =>
                    setEnergyCertificateValidUntil(e.target.value)
                  }
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
