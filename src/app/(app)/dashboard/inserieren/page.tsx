'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

type TransactionType = 'sale' | 'rent'
type UsageType = 'residential' | 'commercial'

const SALE_CATEGORIES = [
  'Haus',
  'Wohnung',
  'Grundstück',
  'WG-Zimmer',
  'Büro & Praxis',
  'Einzelhandel',
  'Gastronomie / Beherbergung',
  'Gewerbliche Freizeitimmobilie',
  'Land- / Forstwirtschaftliches Objekt',
  'Produktions- / Lager- / Gewerbehalle',
  'Zinshaus oder Renditeobjekt',
  'Garagen, Stellplätze',
]

const RENT_CATEGORIES = [
  'Haus',
  'Wohnung',
  'Grundstück',
  'WG-Zimmer',
  'Büro & Praxis',
  'Einzelhandel',
  'Gastronomie / Beherbergung',
  'Gewerbliche Freizeitimmobilie',
  'Land- / Forstwirtschaftliches Objekt',
  'Produktions- / Lager- / Gewerbehalle',
  'Zinshaus oder Renditeobjekt',
  'Garagen, Stellplätze',
]

const STEPS = ['Basis', 'Adresse', 'Details', 'Preis & Kontakt']

export default function InserierenPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [step, setStep] = useState(0)

  // 🔥 Listing-ID (für Draft-Update statt immer neuem Insert)
  const [listingId, setListingId] = useState<string | null>(null)
  const [initialLoading, setInitialLoading] = useState(false)

  const [transactionType, setTransactionType] =
    useState<TransactionType>('sale')
  const [usageType, setUsageType] = useState<UsageType>('residential')
  const [saleCategory, setSaleCategory] = useState<string>('')
  const [rentCategory, setRentCategory] = useState<string>('')

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const [street, setStreet] = useState('')
  const [houseNumber, setHouseNumber] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [city, setCity] = useState('')
  const [country, setCountry] = useState('Deutschland')

  const [livingArea, setLivingArea] = useState('')
  const [landArea, setLandArea] = useState('')
  const [rooms, setRooms] = useState('')
  const [floor, setFloor] = useState('')
  const [totalFloors, setTotalFloors] = useState('')
  const [yearBuilt, setYearBuilt] = useState('')

  const [price, setPrice] = useState('')
  const [currency, setCurrency] = useState('EUR')
  const [availability, setAvailability] = useState('')
  const [isFurnished, setIsFurnished] = useState(false)

  const [contactName, setContactName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactPhone, setContactPhone] = useState('')

  const [acceptTerms, setAcceptTerms] = useState(false)
  const [acceptPrivacy, setAcceptPrivacy] = useState(false)

  const [submitting, setSubmitting] = useState(false)
  const [savingDraft, setSavingDraft] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // UI-Status-Anzeige (entwurf / aktiv / deaktiviert / vermarktet)
  const [status, setStatus] = useState<string>('entwurf')

  const isLastStep = step === STEPS.length - 1
  const isFirstStep = step === 0

  // 🔥 Beim Öffnen mit ?listing=ID bestehenden Datensatz laden und Formular befüllen
  useEffect(() => {
    const idFromUrl = searchParams.get('listing')
    if (!idFromUrl) return

    const loadListing = async () => {
      setInitialLoading(true)
      setError(null)
      setSuccess(null)
      try {
        const res = await fetch(`/api/listings/${idFromUrl}`, {
          method: 'GET',
          cache: 'no-store',
        })

        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          throw new Error(data.error || 'Inserat konnte nicht geladen werden.')
        }

        const { listing } = await res.json()

        if (!listing) {
          throw new Error('Inserat nicht gefunden.')
        }

        // ID merken – ab jetzt wird nur noch aktualisiert, kein neues Inserat
        setListingId(listing.id)

        // Status (kommt bereits als UI-Status aus der API, z.B. "entwurf")
        setStatus(listing.status || 'entwurf')

        // Basisangaben
        setTransactionType(
          (listing.transactionType as TransactionType) || 'sale'
        )
        setUsageType((listing.usageType as UsageType) || 'residential')

        const category =
          listing.objectCategory ||
          listing.saleCategory ||
          listing.rentCategory ||
          ''

        if (listing.transactionType === 'sale') {
          setSaleCategory(category)
          setRentCategory('')
        } else if (listing.transactionType === 'rent') {
          setRentCategory(category)
          setSaleCategory('')
        } else {
          setSaleCategory(category)
          setRentCategory(category)
        }

        setTitle(listing.title || '')
        setDescription(listing.description || '')

        // Adresse
        setStreet(listing.street || '')
        setHouseNumber(listing.houseNumber || '')
        setPostalCode(listing.postalCode || '')
        setCity(listing.city || '')
        setCountry(listing.country || 'Deutschland')

        // Details (Numerics -> String)
        setLivingArea(
          listing.livingArea !== null && listing.livingArea !== undefined
            ? String(listing.livingArea)
            : ''
        )
        setLandArea(
          listing.landArea !== null && listing.landArea !== undefined
            ? String(listing.landArea)
            : ''
        )
        setRooms(
          listing.rooms !== null && listing.rooms !== undefined
            ? String(listing.rooms)
            : ''
        )
        setFloor(listing.floor || '')
        setTotalFloors(listing.totalFloors || '')
        setYearBuilt(
          listing.yearBuilt !== null && listing.yearBuilt !== undefined
            ? String(listing.yearBuilt)
            : ''
        )

        // Preis & Kontakt
        setPrice(
          listing.price !== null && listing.price !== undefined
            ? String(listing.price)
            : ''
        )
        setCurrency(listing.currency || 'EUR')
        setAvailability(listing.availability || '')
        setIsFurnished(!!listing.isFurnished)

        setContactName(listing.contactName || '')
        setContactEmail(listing.contactEmail || '')
        setContactPhone(listing.contactPhone || '')

        // Einwilligungen setzen wir bewusst nicht aus der DB,
        // damit der Nutzer sie aktiv bestätigt.
        setAcceptTerms(false)
        setAcceptPrivacy(false)
      } catch (e: any) {
        setError(e.message || 'Fehler beim Laden des Inserats.')
      } finally {
        setInitialLoading(false)
      }
    }

    loadListing()
  }, [searchParams])

  const canContinue = () => {
    if (step === 0) {
      return (
        transactionType !== undefined &&
        usageType !== undefined &&
        title.trim().length > 5 &&
        ((transactionType === 'sale' && !!saleCategory) ||
          (transactionType === 'rent' && !!rentCategory))
      )
    }
    if (step === 1) {
      return (
        street.trim().length > 0 &&
        houseNumber.trim().length > 0 &&
        postalCode.trim().length >= 4 &&
        city.trim().length > 1
      )
    }
    if (step === 2) {
      return livingArea.trim().length > 0 && rooms.trim().length > 0
    }
    if (step === 3) {
      return (
        price.trim().length > 0 &&
        contactName.trim().length > 1 &&
        contactEmail.trim().length > 3 &&
        acceptTerms &&
        acceptPrivacy
      )
    }
    return true
  }

  const handleNext = () => {
    if (!canContinue()) return
    if (!isLastStep) setStep((s) => s + 1)
  }

  const handleBack = () => {
    if (!isFirstStep) setStep((s) => s - 1)
  }

  // Hilfsfunktion: Payload aus dem aktuellen State bauen
  const buildPayload = (status?: 'draft' | 'pending_payment') => ({
    transactionType,
    usageType,
    saleCategory,
    rentCategory,
    title,
    description,
    street,
    houseNumber,
    postalCode,
    city,
    country,
    livingArea,
    landArea,
    rooms,
    floor,
    totalFloors,
    yearBuilt,
    price,
    currency,
    availability,
    isFurnished,
    contactName,
    contactEmail,
    contactPhone,
    status,
  })

  // 👉 Entwurf speichern – arbeitet mit bestehendem Listing, wenn vorhanden
  const handleSaveDraft = async () => {
    setSavingDraft(true)
    setSubmitting(false)
    setError(null)
    setSuccess(null)

    try {
      const payload = buildPayload('draft')

      const url = listingId ? `/api/listings/${listingId}` : '/api/listings'
      const method = listingId ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Fehler beim Speichern des Entwurfs')
      }

      const { listing } = await res.json()

      if (listing?.id) {
        setListingId(listing.id)
      }
      if (listing?.status) {
        setStatus(listing.status)
      } else {
        setStatus('entwurf')
      }

      setSuccess(
        'Entwurf gespeichert. Du findest dein Inserat im Bereich „Inserate“ und kannst hier jederzeit weiterbearbeiten.'
      )
    } catch (e: any) {
      setError(e.message || 'Unbekannter Fehler beim Speichern des Entwurfs')
    } finally {
      setSavingDraft(false)
    }
  }

  const handleSubmit = async () => {
    if (!canContinue()) return
    setSubmitting(true)
    setSavingDraft(false)
    setError(null)
    setSuccess(null)

    try {
      const payload = buildPayload('pending_payment')

      const url = listingId ? `/api/listings/${listingId}` : '/api/listings'
      const method = listingId ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Fehler beim Speichern')
      }

      const { listing } = await res.json()

      if (listing?.id) {
        setListingId(listing.id)
      }
      if (listing?.status) {
        setStatus(listing.status)
      }

      // Weiter zur Paketauswahl – Listing-ID & transactionType mitgeben
      router.push(
        `/dashboard/inserieren/paket?listing=${listing.id}&kind=${transactionType}`
      )
    } catch (e: any) {
      setError(e.message || 'Unbekannter Fehler')
    } finally {
      setSubmitting(false)
    }
  }

  const statusChip = (() => {
    const normalized = (status || 'entwurf').toLowerCase()
    if (normalized === 'aktiv') {
      return {
        label: 'Aktiv',
        className:
          'bg-emerald-50 text-emerald-700 ring-emerald-200',
      }
    }
    if (normalized === 'deaktiviert') {
      return {
        label: 'Deaktiviert',
        className:
          'bg-slate-50 text-slate-600 ring-slate-200',
      }
    }
    if (normalized === 'vermarktet') {
      return {
        label: 'Vermarktet',
        className:
          'bg-indigo-50 text-indigo-700 ring-indigo-200',
      }
    }
    // Standard + auch für pending_payment (kommt als "entwurf" aus der API)
    return {
      label: 'Entwurf',
      className:
        'bg-amber-50 text-amber-700 ring-amber-200',
    }
  })()

  return (
    <section className="mx-auto max-w-5xl space-y-6 px-4 pb-10 pt-4">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Immobilie inserieren
          </h1>
          <p className="text-sm text-slate-600">
            Erstelle Schritt für Schritt dein Exposé. Später übernimmt die
            Maklernull Bridge die Übertragung zu ImmoScout24, Immowelt und Kleinanzeigen.
          </p>
          {initialLoading && (
            <p className="mt-1 text-xs text-slate-500">
              Bestehendes Inserat wird geladen …
            </p>
          )}
        </div>
        <div className="rounded-2xl border border-white/60 bg-white/80 px-4 py-2 text-xs text-slate-600 shadow-sm backdrop-blur-xl">
          Status:{' '}
          <span
            className={`rounded-full px-2 py-0.5 ring-1 ${statusChip.className}`}
          >
            {statusChip.label}
          </span>
        </div>
      </div>

      {/* Steps Indicator */}
      <div className="flex flex-col gap-4 rounded-3xl border border-white/60 bg-white/80 p-3 shadow-sm backdrop-blur-xl sm:flex-row sm:items-center">
        <div className="flex flex-1 items-center gap-3">
          {STEPS.map((label, index) => {
            const active = index === step
            const done = index < step
            return (
              <div key={label} className="flex flex-1 items-center gap-2">
                <div
                  className={[
                    'flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium',
                    done
                      ? 'bg-emerald-600 text-white'
                      : active
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-500',
                  ].join(' ')}
                >
                  {done ? '✓' : index + 1}
                </div>
                <span
                  className={[
                    'hidden text-xs sm:inline',
                    active ? 'text-slate-900' : 'text-slate-500',
                  ].join(' ')}
                >
                  {label}
                </span>
                {index < STEPS.length - 1 && (
                  <div className="hidden flex-1 border-t border-dashed border-slate-200 sm:block" />
                )}
              </div>
            )
          })}
        </div>

        <div className="flex items-center justify-between gap-2 text-[11px] text-slate-500">
          <span>
            Schritt {step + 1} von {STEPS.length}
          </span>
          <span>
            {transactionType === 'sale' ? 'Verkauf' : 'Vermietung'} ·{' '}
            {usageType === 'residential' ? 'Wohnen' : 'Gewerbe'}
          </span>
        </div>
      </div>

      {/* Content + Sidebar */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.1fr)]">
        {/* Hauptformular (Glass Card) */}
        <div className="rounded-3xl border border-white/60 bg-white/80 p-5 shadow-sm backdrop-blur-xl sm:p-6">
          {step === 0 && (
            <StepBasis
              transactionType={transactionType}
              setTransactionType={setTransactionType}
              usageType={usageType}
              setUsageType={setUsageType}
              saleCategory={saleCategory}
              setSaleCategory={setSaleCategory}
              rentCategory={rentCategory}
              setRentCategory={setRentCategory}
              title={title}
              setTitle={setTitle}
              description={description}
              setDescription={setDescription}
            />
          )}

          {step === 1 && (
            <StepAdresse
              street={street}
              setStreet={setStreet}
              houseNumber={houseNumber}
              setHouseNumber={setHouseNumber}
              postalCode={postalCode}
              setPostalCode={setPostalCode}
              city={city}
              setCity={setCity}
              country={country}
              setCountry={setCountry}
            />
          )}

          {step === 2 && (
            <StepDetails
              livingArea={livingArea}
              setLivingArea={setLivingArea}
              landArea={landArea}
              setLandArea={setLandArea}
              rooms={rooms}
              setRooms={setRooms}
              floor={floor}
              setFloor={setFloor}
              totalFloors={totalFloors}
              setTotalFloors={setTotalFloors}
              yearBuilt={yearBuilt}
              setYearBuilt={setYearBuilt}
            />
          )}

          {step === 3 && (
            <StepPreisKontakt
              transactionType={transactionType}
              price={price}
              setPrice={setPrice}
              currency={currency}
              setCurrency={setCurrency}
              availability={availability}
              setAvailability={setAvailability}
              isFurnished={isFurnished}
              setIsFurnished={setIsFurnished}
              contactName={contactName}
              setContactName={setContactName}
              contactEmail={contactEmail}
              setContactEmail={setContactEmail}
              contactPhone={contactPhone}
              setContactPhone={setContactPhone}
              acceptTerms={acceptTerms}
              setAcceptTerms={setAcceptTerms}
              acceptPrivacy={acceptPrivacy}
              setAcceptPrivacy={setAcceptPrivacy}
            />
          )}

          {/* Footer Buttons */}
          <div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={handleBack}
              disabled={isFirstStep}
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Zurück
            </button>

            <div className="flex flex-1 items-center justify-end gap-3">
              {/* Entwurf speichern */}
              <button
                type="button"
                onClick={handleSaveDraft}
                disabled={savingDraft || initialLoading}
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {savingDraft ? 'Speichere Entwurf...' : 'Als Entwurf speichern'}
              </button>

              {!isLastStep && (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!canContinue() || initialLoading}
                  className="inline-flex items-center justify-center rounded-full border border-slate-900 bg-slate-900 px-5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Weiter
                </button>
              )}

              {isLastStep && (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!canContinue() || submitting || initialLoading}
                  className="inline-flex items-center justify-center rounded-full border border-slate-900 bg-slate-900 px-5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting ? 'Speichere...' : 'Inserat speichern'}
                </button>
              )}
            </div>
          </div>

          {error && (
            <p className="mt-3 text-sm text-rose-600">
              {error}
            </p>
          )}
          {success && (
            <p className="mt-3 text-sm text-emerald-600">
              {success}
            </p>
          )}
        </div>

        {/* Sidebar Vorschau / Hinweis */}
        <aside className="space-y-4">
          <div className="rounded-3xl border border-white/60 bg-white/80 p-4 shadow-sm backdrop-blur-xl">
            <h2 className="text-sm font-medium text-slate-900">
              Kurzvorschau deines Exposés
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              So ähnlich könnte dein Inserat später auf den Portalen aussehen.
            </p>

            <div className="mt-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-3 text-xs text-slate-700">
              <div className="mb-2 h-32 w-full rounded-xl bg-slate-200/80" />
              <p className="text-[11px] uppercase tracking-wide text-slate-500">
                {transactionType === 'sale' ? 'Zum Kauf' : 'Zur Miete'} ·{' '}
                {usageType === 'residential' ? 'Wohnen' : 'Gewerbe'}
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-900">
                {title || 'Exposé-Titel'}
              </p>
              <p className="mt-1 text-[11px] text-slate-500">
                {[street && `${street} ${houseNumber}`, postalCode && city]
                  .filter(Boolean)
                  .join(' · ') || 'Adresse wird später hier angezeigt'}
              </p>
              <p className="mt-2 text-sm font-semibold text-slate-900">
                {price
                  ? new Intl.NumberFormat('de-DE', {
                      style: 'currency',
                      currency: currency || 'EUR',
                    }).format(Number(price))
                  : 'Preis/Miete'}
                {transactionType === 'rent' && ' / Monat'}
              </p>
              {livingArea && (
                <p className="mt-1 text-[11px] text-slate-500">
                  {livingArea} m² · {rooms || '?'} Zimmer
                </p>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-white/60 bg-white/80 p-4 text-xs text-slate-600 shadow-sm backdrop-blur-xl">
            <h3 className="mb-1 text-sm font-medium text-slate-900">
              Nächste Schritte
            </h3>
            <ol className="list-decimal space-y-1 pl-5">
              <li>Inserat ausfüllen & als Entwurf speichern</li>
              <li>Inserat finalisieren & Zahlung über Stripe abschließen</li>
              <li>
                Automatische Übertragung über die Maklernull Bridge zu den
                Portalen
              </li>
              <li>Veröffentlichung auf ImmoScout24, Immowelt & Kleinanzeigen</li>
            </ol>
          </div>
        </aside>
      </div>
    </section>
  )
}

/* --------------------------- Step Components --------------------------- */

type StepBasisProps = {
  transactionType: TransactionType
  setTransactionType: (v: TransactionType) => void
  usageType: UsageType
  setUsageType: (v: UsageType) => void
  saleCategory: string
  setSaleCategory: (v: string) => void
  rentCategory: string
  setRentCategory: (v: string) => void
  title: string
  setTitle: (v: string) => void
  description: string
  setDescription: (v: string) => void
}

function StepBasis(props: StepBasisProps) {
  const {
    transactionType,
    setTransactionType,
    usageType,
    setUsageType,
    saleCategory,
    setSaleCategory,
    rentCategory,
    setRentCategory,
    title,
    setTitle,
    description,
    setDescription,
  } = props

  const categories =
    transactionType === 'sale' ? SALE_CATEGORIES : RENT_CATEGORIES

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-sm font-medium text-slate-900">
          Basisangaben
        </h2>
        <p className="text-xs text-slate-500">
          Bestimme zuerst, ob du vermietest oder verkaufst – und ob es sich um
          eine Wohn- oder Gewerbeimmobilie handelt.
        </p>
      </div>

      {/* Verkauf / Vermietung */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-2">
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

        {/* Wohnen / Gewerbe */}
        <div className="space-y-2">
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
      </div>

      {/* Objektart */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-slate-700">
          Objektart
        </label>
        <select
          className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
          value={transactionType === 'sale' ? saleCategory : rentCategory}
          onChange={(e) =>
            transactionType === 'sale'
              ? setSaleCategory(e.target.value)
              : setRentCategory(e.target.value)
          }
        >
          <option value="">Bitte wählen</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
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

type StepAdresseProps = {
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
}

function StepAdresse({
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
}: StepAdresseProps) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-sm font-medium text-slate-900">
          Adresse
        </h2>
        <p className="text-xs text-slate-500">
          Wir übermitteln die Adresse nicht 1:1 an alle Portale – sie ist aber
          wichtig für die korrekte Zuordnung.
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
    </div>
  )
}

type StepDetailsProps = {
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
}

function StepDetails({
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
}: StepDetailsProps) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-sm font-medium text-slate-900">
          Eckdaten der Immobilie
        </h2>
        <p className="text-xs text-slate-500">
          Wohnfläche, Zimmer und Baujahr sind die wichtigsten Kennzahlen. Du
          kannst Details später noch erweitern.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="space-y-2">
          <label className="text-xs font-medium text-slate-700">
            Wohnfläche (m²)
          </label>
          <input
            type="number"
            min={0}
            className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
            value={livingArea}
            onChange={(e) => setLivingArea(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-medium text-slate-700">
            Grundstück (m²)
          </label>
          <input
            type="number"
            min={0}
            className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
            value={landArea}
            onChange={(e) => setLandArea(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-medium text-slate-700">
            Zimmer
          </label>
          <input
            type="number"
            min={0}
            step="0.5"
            className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
            value={rooms}
            onChange={(e) => setRooms(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="space-y-2">
          <label className="text-xs font-medium text-slate-700">
            Etage
          </label>
          <input
            type="text"
            className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
            value={floor}
            onChange={(e) => setFloor(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-medium text-slate-700">
            Etagen gesamt
          </label>
          <input
            type="text"
            className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
            value={totalFloors}
            onChange={(e) => setTotalFloors(e.target.value)}
          />
        </div>
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
      </div>
    </div>
  )
}

type StepPreisKontaktProps = {
  transactionType: TransactionType
  price: string
  setPrice: (v: string) => void
  currency: string
  setCurrency: (v: string) => void
  availability: string
  setAvailability: (v: string) => void
  isFurnished: boolean
  setIsFurnished: (v: boolean) => void
  contactName: string
  setContactName: (v: string) => void
  contactEmail: string
  setContactEmail: (v: string) => void
  contactPhone: string
  setContactPhone: (v: string) => void
  acceptTerms: boolean
  setAcceptTerms: (v: boolean) => void
  acceptPrivacy: boolean
  setAcceptPrivacy: (v: boolean) => void
}

function StepPreisKontakt({
  transactionType,
  price,
  setPrice,
  currency,
  setCurrency,
  availability,
  setAvailability,
  isFurnished,
  setIsFurnished,
  contactName,
  setContactName,
  contactEmail,
  setContactEmail,
  contactPhone,
  setContactPhone,
  acceptTerms,
  setAcceptTerms,
  acceptPrivacy,
  setAcceptPrivacy,
}: StepPreisKontaktProps) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-sm font-medium text-slate-900">
          Preis & Kontakt
        </h2>
        <p className="text-xs text-slate-500">
          Diese Daten verwenden wir für die spätere Zahlungsabwicklung und
          Kommunikation mit Interessenten.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-[2fr,1fr]">
        <div className="space-y-2">
          <label className="text-xs font-medium text-slate-700">
            {transactionType === 'sale'
              ? 'Kaufpreis'
              : 'Kaltmiete (monatlich)'}
          </label>
          <input
            type="number"
            min={0}
            className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
            value={price}
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

      <div className="grid gap-3 sm:grid-cols-[1.5fr,1fr]">
        <div className="space-y-2">
          <label className="text-xs font-medium text-slate-700">
            Verfügbar ab
          </label>
          <input
            type="date"
            className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
          />
        </div>
        <div className="flex items-end gap-2">
          <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-700">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-200"
              checked={isFurnished}
              onChange={(e) => setIsFurnished(e.target.checked)}
            />
            Möbliert
          </label>
        </div>
      </div>

      {/* Kontakt */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-slate-700">
          Ansprechpartner*in
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
            Telefonnummer
          </label>
          <input
            type="tel"
            className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
          />
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
