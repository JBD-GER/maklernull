// src/app/dashboard/inserieren/steps/StepAdresse.tsx

export type StepAdresseProps = {
  street: string
  setStreet: (v: string) => void
  houseNumber: string
  setHouseNumber: (v: string) => void
  postalCode: string
  setPostalCode: (v: string) => void
  city: string
  setCity: (v: string) => void
  country: string
  setCountry: (v: string) => void
  arrivalNote: string
  setArrivalNote: (v: string) => void
  hideStreet: boolean
  setHideStreet: (v: boolean) => void
}

export function StepAdresse({
  street,
  setStreet,
  houseNumber,
  setHouseNumber,
  postalCode,
  setPostalCode,
  city,
  setCity,
  country,
  setCountry,
  arrivalNote,
  setArrivalNote,
  hideStreet,
  setHideStreet,
}: StepAdresseProps) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-sm font-medium text-slate-900">
          Objektadresse
        </h2>
        <p className="text-xs text-slate-500">
          Die Objektadresse wird zur korrekten Zuordnung und zur
          Veröffentlichung in den Portalen genutzt. Für Rechnungen verwenden
          wir deine Profildaten, nicht diese Objektadresse. Du kannst Straße
          und Hausnummer bei Bedarf ausblenden.
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-medium text-slate-700">
          Straße
        </label>
        <input
          type="text"
          className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
          value={street}
          onChange={(e) => setStreet(e.target.value)}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-[1fr,120px]">
        <div className="space-y-2">
          <label className="text-xs font-medium text-slate-700">
            Hausnummer
          </label>
          <input
            type="text"
            className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
            value={houseNumber}
            onChange={(e) => setHouseNumber(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-[140px,1fr]">
        <div className="space-y-2">
          <label className="text-xs font-medium text-slate-700">
            PLZ
          </label>
          <input
            type="text"
            className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-medium text-slate-700">
            Ort
          </label>
          <input
            type="text"
            className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-medium text-slate-700">
          Land
        </label>
        <input
          type="text"
          className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-medium text-slate-700">
          Besonderer Hinweis zur Anfahrt (optional)
        </label>
        <textarea
          className="min-h-[80px] w-full resize-y rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
          placeholder="z.B. Eingang über Hinterhof, bitte Klingel XY benutzen..."
          value={arrivalNote}
          onChange={(e) => setArrivalNote(e.target.value)}
        />
      </div>

      <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3 text-[11px] text-slate-600">
        <label className="flex items-start gap-2">
          <input
            type="checkbox"
            className="mt-[2px] h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-200"
            checked={hideStreet}
            onChange={(e) => setHideStreet(e.target.checked)}
          />
          <span>
            Straße und Hausnummer nicht öffentlich anzeigen (sofern das Portal
            diese Option unterstützt, wird nur PLZ/Ort angezeigt).
          </span>
        </label>
      </div>
    </div>
  )
}
