// src/app/dashboard/inserieren/steps/StepPreisKontakt.tsx
'use client'

import { TransactionType } from './types'

export type StepPreisKontaktProps = {
  transactionType: TransactionType
  price: string
  setPrice: (v: string) => void
  currency: string
  setCurrency: (v: string) => void
  serviceCharge: string
  setServiceCharge: (v: string) => void
  heatingCosts: string
  setHeatingCosts: (v: string) => void
  totalAdditionalCosts: string
  setTotalAdditionalCosts: (v: string) => void
  hoaFee: string
  setHoaFee: (v: string) => void
  garagePrice: string
  setGaragePrice: (v: string) => void
  deposit: string
  setDeposit: (v: string) => void
  priceOnRequest: boolean
  setPriceOnRequest: (v: boolean) => void
  availability: string
  setAvailability: (v: string) => void
  takeoverType: 'nach_vereinbarung' | 'sofort' | 'ab_datum'
  setTakeoverType: (v: 'nach_vereinbarung' | 'sofort' | 'ab_datum') => void
  takeoverDate: string
  setTakeoverDate: (v: string) => void
  isFurnished: boolean
  setIsFurnished: (v: boolean) => void
  contactName: string
  setContactName: (v: string) => void
  contactEmail: string
  setContactEmail: (v: string) => void
  contactPhone: string
  setContactPhone: (v: string) => void
  contactMobile: string
  setContactMobile: (v: string) => void
  showName: boolean
  setShowName: (v: boolean) => void
  showPhone: boolean
  setShowPhone: (v: boolean) => void
  showMobile: boolean
  setShowMobile: (v: boolean) => void
  noAgentRequests: boolean
  setNoAgentRequests: (v: boolean) => void
  acceptTerms: boolean
  setAcceptTerms: (v: boolean) => void
  acceptPrivacy: boolean
  setAcceptPrivacy: (v: boolean) => void
}

export function StepPreisKontakt({
  transactionType,
  price,
  setPrice,
  currency,
  setCurrency,
  serviceCharge,
  setServiceCharge,
  heatingCosts,
  setHeatingCosts,
  totalAdditionalCosts,
  setTotalAdditionalCosts,
  hoaFee,
  setHoaFee,
  garagePrice,
  setGaragePrice,
  deposit,
  setDeposit,
  priceOnRequest,
  setPriceOnRequest,
  availability,
  setAvailability,
  takeoverType,
  setTakeoverType,
  takeoverDate,
  setTakeoverDate,
  isFurnished,
  setIsFurnished,
  contactName,
  setContactName,
  contactEmail,
  setContactEmail,
  contactPhone,
  setContactPhone,
  contactMobile,
  setContactMobile,
  showName,
  setShowName,
  showPhone,
  setShowPhone,
  showMobile,
  setShowMobile,
  noAgentRequests,
  setNoAgentRequests,
  acceptTerms,
  setAcceptTerms,
  acceptPrivacy,
  setAcceptPrivacy,
}: StepPreisKontaktProps) {
  const isRent = transactionType === 'rent'
  const isSale = transactionType === 'sale'

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-sm font-medium text-slate-900">
          Preis & Kontakt
        </h2>
        <p className="text-xs text-slate-500">
          Diese Daten werden für das Inserat und für die Kommunikation mit
          Interessenten genutzt. Die eigentliche Rechnungsstellung läuft über
          dein Maklernull-Konto und Stripe.
        </p>
      </div>

      {/* Preisblock */}
      <div className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-3">
        <div className="grid gap-3 sm:grid-cols-[2fr,1fr]">
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-700">
              {isSale ? 'Kaufpreis' : 'Kaltmiete (monatlich)'}
            </label>
            <input
              type="number"
              min={0}
              disabled={priceOnRequest}
              className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition disabled:bg-slate-50 disabled:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
              value={priceOnRequest ? '' : price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-700">
              Währung
            </label>
            <select
              className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              <option value="EUR">EUR</option>
            </select>
          </div>
        </div>

        {isRent && (
          <>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-700">
                  Nebenkosten ohne Heizkosten (mtl.)
                </label>
                <input
                  type="number"
                  min={0}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                  value={serviceCharge}
                  onChange={(e) => setServiceCharge(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-700">
                  Heizkosten (mtl.)
                </label>
                <input
                  type="number"
                  min={0}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                  value={heatingCosts}
                  onChange={(e) => setHeatingCosts(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-700">
                  Summe Neben-/Heizkosten (mtl.)
                </label>
                <input
                  type="number"
                  min={0}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                  value={totalAdditionalCosts}
                  onChange={(e) =>
                    setTotalAdditionalCosts(e.target.value)
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-700">
                Mietsicherheit / Kaution
              </label>
              <input
                type="number"
                min={0}
                className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                value={deposit}
                onChange={(e) => setDeposit(e.target.value)}
              />
            </div>
          </>
        )}

        {isSale && (
          <>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-700">
                  Hausgeld (mtl.)
                </label>
                <input
                  type="number"
                  min={0}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                  value={hoaFee}
                  onChange={(e) => setHoaFee(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-700">
                  Kaufpreis Garage/Stellplatz
                </label>
                <input
                  type="number"
                  min={0}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                  value={garagePrice}
                  onChange={(e) => setGaragePrice(e.target.value)}
                />
              </div>
            </div>
          </>
        )}

        <div className="rounded-2xl border border-slate-100 bg-white px-3 py-2 text-[11px] text-slate-600">
          <label className="flex items-start gap-2">
            <input
              type="checkbox"
              className="mt-[2px] h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-200"
              checked={priceOnRequest}
              onChange={(e) => setPriceOnRequest(e.target.checked)}
            />
            <span>
              Preis auf Anfrage (Preis wird in den Portalen – wo möglich – nicht
              direkt angezeigt).
            </span>
          </label>
        </div>
      </div>

      {/* Verfügbarkeit */}
      <div className="grid gap-3 sm:grid-cols-[1.2fr,1fr,1fr]">
        <div className="space-y-2">
          <label className="text-xs font-medium text-slate-700">
            Verfügbar ab (Datum)
          </label>
          <input
            type="date"
            className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-medium text-slate-700">
            Übernahme
          </label>
          <select
            className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
            value={takeoverType}
            onChange={(e) =>
              setTakeoverType(
                e.target.value as
                  | 'nach_vereinbarung'
                  | 'sofort'
                  | 'ab_datum'
              )
            }
          >
            <option value="nach_vereinbarung">Nach Vereinbarung</option>
            <option value="sofort">Sofort</option>
            <option value="ab_datum">ab Datum</option>
          </select>
        </div>
        {takeoverType === 'ab_datum' && (
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-700">
              Übernahmedatum
            </label>
            <input
              type="date"
              className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
              value={takeoverDate}
              onChange={(e) => setTakeoverDate(e.target.value)}
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 text-xs">
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-200"
            checked={isFurnished}
            onChange={(e) => setIsFurnished(e.target.checked)}
          />
          Möbliert
        </label>
      </div>

      {/* Kontakt */}
      <div className="space-y-3">
        <h3 className="text-xs font-medium text-slate-700">
          Ansprechpartner*in
        </h3>
        <div className="space-y-2">
          <label className="text-xs font-medium text-slate-700">
            Name
          </label>
          <input
            type="text"
            className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-700">
              E-Mail
            </label>
            <input
              type="email"
              className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-700">
              Telefon
            </label>
            <input
              type="tel"
              className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-slate-700">
            Mobiltelefon (optional)
          </label>
          <input
            type="tel"
            className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
            value={contactMobile}
            onChange={(e) => setContactMobile(e.target.value)}
          />
        </div>

        <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3 text-[11px] text-slate-600">
          <p className="mb-2 font-medium text-slate-700">
            Sichtbarkeit im Inserat
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-200"
                checked={showName}
                onChange={(e) => setShowName(e.target.checked)}
              />
              Name anzeigen
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-200"
                checked={showPhone}
                onChange={(e) => setShowPhone(e.target.checked)}
              />
              Telefon anzeigen
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-200"
                checked={showMobile}
                onChange={(e) => setShowMobile(e.target.checked)}
              />
              Mobiltelefon anzeigen
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-200"
                checked={noAgentRequests}
                onChange={(e) => setNoAgentRequests(e.target.checked)}
              />
              Makleranfragen unerwünscht
            </label>
          </div>
        </div>
      </div>

      {/* Einwilligungen */}
      <div className="space-y-2 rounded-2xl border border-slate-100 bg-slate-50/70 p-3 text-[11px] text-slate-600">
        <label className="flex items-start gap-2">
          <input
            type="checkbox"
            className="mt-[2px] h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-200"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
          />
          <span>
            Ich bestätige, dass ich berechtigt bin, diese Immobilie zu vermieten
            oder zu verkaufen, und dass alle Angaben der Wahrheit entsprechen.
          </span>
        </label>

        <label className="mt-2 flex items-start gap-2">
          <input
            type="checkbox"
            className="mt-[2px] h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-200"
            checked={acceptPrivacy}
            onChange={(e) => setAcceptPrivacy(e.target.checked)}
          />
          <span>
            Ich bin damit einverstanden, dass Maklernull meine Daten zur
            Abwicklung der Inserierung speichert und verarbeitet. Weitere
            Informationen in der Datenschutzerklärung.
          </span>
        </label>
      </div>
    </div>
  )
}
