'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

type TransactionType = 'sale' | 'rent'
type UsageType = 'residential' | 'commercial'
type OfferType = 'private' | 'commercial'
type EnergyCertificateAvailable = 'yes' | 'no' | 'not_required'
type EnergyCertificateType = 'consumption' | 'demand' | ''

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

 // direkt oberhalb von StepBasis einfügen
const SUBTYPE_OPTIONS: Record<string, string[]> = {
  Haus: [
    'Einfamilienhaus (freistehend)',
    'Doppelhaushälfte',
    'Reihenhaus',
    'Reihenendhaus',
    'Mehrfamilienhaus',
    'Bungalow',
    'Villa',
    'Resthof / Bauernhaus',
    'Sonstiges Haus',
  ],
  Wohnung: [
    'Etagenwohnung',
    'Erdgeschosswohnung',
    'Dachgeschosswohnung',
    'Maisonette',
    'Souterrain',
    'Loft / Studio',
    'Penthouse',
    'Apartment',
    'Sonstige Wohnung',
  ],
  Grundstück: [
    'Wohngrundstück',
    'Gewerbegrundstück',
    'Mischgebiet',
    'Bauerwartungsland',
    'Land- / Forstwirtschaft',
    'Sonstiges Grundstück',
  ],
  'WG-Zimmer': ['WG-Zimmer'],
  'Büro & Praxis': [
    'Bürofläche',
    'Bürohaus',
    'Praxisfläche',
    'Büroetage',
    'Sonstige Büro-/Praxisfläche',
  ],
  Einzelhandel: [
    'Ladenlokal',
    'Einkaufszentrum',
    'Verkaufsfläche',
    'Sonstige Einzelhandelsfläche',
  ],
  'Gastronomie / Beherbergung': [
    'Restaurant',
    'Café / Bistro',
    'Hotel',
    'Pension',
    'Sonstige Gastro-/Beherbergung',
  ],
  'Gewerbliche Freizeitimmobilie': [
    'Freizeitanlage',
    'Sportanlage',
    'Sonstige Freizeitimmobilie',
  ],
  'Land- / Forstwirtschaftliches Objekt': [
    'Ackerbau',
    'Forstwirtschaft',
    'Weide / Wiese',
    'Sonstiges land-/forstw. Objekt',
  ],
  'Produktions- / Lager- / Gewerbehalle': [
    'Lagerhalle',
    'Produktion',
    'Logistikfläche',
    'Sonstige Halle / Lager',
  ],
  'Zinshaus oder Renditeobjekt': [
    'Wohn- und Geschäftshaus',
    'Mehrfamilienhaus (Rendite)',
    'Gewerbeobjekt (Rendite)',
    'Sonstiges Renditeobjekt',
  ],
  'Garagen, Stellplätze': [
    'Tiefgaragenstellplatz',
    'Außenstellplatz',
    'Garage',
    'Carport',
    'Sonstiger Stellplatz',
  ],
}

// 🔥 Steps erweitert (Ausstattung & Energie + Medien)
const STEPS = [
  'Basis',
  'Adresse',
  'Details',
  'Ausstattung & Energie',
  'Medien',
  'Preis & Kontakt',
]

export default function InserierenPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [step, setStep] = useState(0)

  // Listing-ID (für Draft-Update statt immer neuem Insert)
  const [listingId, setListingId] = useState<string | null>(null)
  const [initialLoading, setInitialLoading] = useState(false)

  const [transactionType, setTransactionType] =
    useState<TransactionType>('sale')
  const [usageType, setUsageType] = useState<UsageType>('residential')
  const [offerType, setOfferType] = useState<OfferType>('private')

  const [saleCategory, setSaleCategory] = useState<string>('')
  const [rentCategory, setRentCategory] = useState<string>('')
  const [objectSubtype, setObjectSubtype] = useState<string>('')

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const [street, setStreet] = useState('')
  const [houseNumber, setHouseNumber] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [city, setCity] = useState('')
  const [country, setCountry] = useState('Deutschland')
  const [arrivalNote, setArrivalNote] = useState('')

  const [hideStreet, setHideStreet] = useState(false)

  const [livingArea, setLivingArea] = useState('')
  const [landArea, setLandArea] = useState('')
  const [rooms, setRooms] = useState('')
  const [floor, setFloor] = useState('')
  const [totalFloors, setTotalFloors] = useState('')
  const [yearBuilt, setYearBuilt] = useState('')
  const [condition, setCondition] = useState('')

  const [isCurrentlyRented, setIsCurrentlyRented] = useState(false)

  // Energie
  const [energyCertificateAvailable, setEnergyCertificateAvailable] =
    useState<EnergyCertificateAvailable>('yes')
  const [energyCertificateType, setEnergyCertificateType] =
    useState<EnergyCertificateType>('')
  const [energyEfficiencyClass, setEnergyEfficiencyClass] = useState('')
  const [energyConsumption, setEnergyConsumption] = useState('')
  const [primaryEnergySource, setPrimaryEnergySource] = useState('')
  const [heatingType, setHeatingType] = useState('')
  const [firingType, setFiringType] = useState('')
  const [
    energyCertificateIssueDate,
    setEnergyCertificateIssueDate,
  ] = useState('')
  const [
    energyCertificateValidUntil,
    setEnergyCertificateValidUntil,
  ] = useState('')

  // Ausstattung
  const [hasBalcony, setHasBalcony] = useState(false)
  const [hasTerrace, setHasTerrace] = useState(false)
  const [hasGarden, setHasGarden] = useState(false)
  const [hasBuiltinKitchen, setHasBuiltinKitchen] = useState(false)
  const [hasElevator, setHasElevator] = useState(false)
  const [hasCellar, setHasCellar] = useState(false)
  const [isBarrierFree, setIsBarrierFree] = useState(false)
  const [hasGuestWC, setHasGuestWC] = useState(false)
  const [hasParkingSpace, setHasParkingSpace] = useState(false)
  const [parkingSpaces, setParkingSpaces] = useState('')
  const [parkingSpacePrice, setParkingSpacePrice] = useState('')



  // Medien – erst mal als URL-Listen (z.B. CDN, später auch Upload möglich)
  const [photos, setPhotos] = useState<string[]>([''])
  const [floorplans, setFloorplans] = useState<string[]>([''])
  const [documents, setDocuments] = useState<string[]>([''])

  const [price, setPrice] = useState('')
  const [currency, setCurrency] = useState('EUR')
  const [serviceCharge, setServiceCharge] = useState('')
  const [heatingCosts, setHeatingCosts] = useState('')
  const [totalAdditionalCosts, setTotalAdditionalCosts] = useState('')
  const [hoaFee, setHoaFee] = useState('')
  const [garagePrice, setGaragePrice] = useState('')
  const [deposit, setDeposit] = useState('')
  const [priceOnRequest, setPriceOnRequest] = useState(false)

  const [availability, setAvailability] = useState('')
  const [takeoverType, setTakeoverType] = useState<'nach_vereinbarung' | 'sofort' | 'ab_datum'>('nach_vereinbarung')
  const [takeoverDate, setTakeoverDate] = useState('')

  const [isFurnished, setIsFurnished] = useState(false)

  const [contactName, setContactName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [contactMobile, setContactMobile] = useState('')

  const [showName, setShowName] = useState(true)
  const [showPhone, setShowPhone] = useState(true)
  const [showMobile, setShowMobile] = useState(true)
  const [noAgentRequests, setNoAgentRequests] = useState(true)

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

  // Beim Öffnen mit ?listing=ID bestehenden Datensatz laden und Formular befüllen
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
        setOfferType((listing.offerType as OfferType) || 'private')

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

        setObjectSubtype(listing.objectSubtype || '')

        setTitle(listing.title || '')
        setDescription(listing.description || '')

        // Adresse
        setStreet(listing.street || '')
        setHouseNumber(listing.houseNumber || '')
        setPostalCode(listing.postalCode || '')
        setCity(listing.city || '')
        setCountry(listing.country || 'Deutschland')
        setArrivalNote(listing.arrivalNote || '')
        setHideStreet(!!listing.hideStreet)

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
        setCondition(listing.condition || '')
        setIsCurrentlyRented(!!listing.isCurrentlyRented)

        // Energie
        setEnergyCertificateAvailable(
          (listing.energyCertificateAvailable as EnergyCertificateAvailable) ||
            'yes'
        )
        setEnergyCertificateType(
          (listing.energyCertificateType as EnergyCertificateType) || ''
        )
        setEnergyEfficiencyClass(listing.energyEfficiencyClass || '')
        setEnergyConsumption(
          listing.energyConsumption !== null &&
          listing.energyConsumption !== undefined
            ? String(listing.energyConsumption)
            : ''
        )
        setPrimaryEnergySource(listing.primaryEnergySource || '')
        setHeatingType(listing.heatingType || '')
        setFiringType(listing.firingType || '')
        setEnergyCertificateIssueDate(
          listing.energyCertificateIssueDate || ''
        )
        setEnergyCertificateValidUntil(
          listing.energyCertificateValidUntil || ''
        )

        // Ausstattung
        setHasBalcony(!!listing.hasBalcony)
        setHasTerrace(!!listing.hasTerrace)
        setHasGarden(!!listing.hasGarden)
        setHasBuiltinKitchen(!!listing.hasBuiltinKitchen)
        setHasElevator(!!listing.hasElevator)
        setHasCellar(!!listing.hasCellar)
        setIsBarrierFree(!!listing.isBarrierFree)
        setHasGuestWC(!!listing.hasGuestWC)
        setHasParkingSpace(!!listing.hasParkingSpace)
        setParkingSpaces(
          listing.parkingSpaces !== null &&
          listing.parkingSpaces !== undefined
            ? String(listing.parkingSpaces)
            : ''
        )
        setParkingSpacePrice(
          listing.parkingSpacePrice !== null &&
          listing.parkingSpacePrice !== undefined
            ? String(listing.parkingSpacePrice)
            : ''
        )

        // Medien
        setPhotos(
          Array.isArray(listing.photos) && listing.photos.length > 0
            ? listing.photos
            : ['']
        )
        setFloorplans(
          Array.isArray(listing.floorplans) && listing.floorplans.length > 0
            ? listing.floorplans
            : ['']
        )
        setDocuments(
          Array.isArray(listing.documents) && listing.documents.length > 0
            ? listing.documents
            : ['']
        )

        // Preis & Kontakt
        setPrice(
          listing.price !== null && listing.price !== undefined
            ? String(listing.price)
            : ''
        )
        setCurrency(listing.currency || 'EUR')
        setServiceCharge(
          listing.serviceCharge !== null &&
          listing.serviceCharge !== undefined
            ? String(listing.serviceCharge)
            : ''
        )
        setHeatingCosts(
          listing.heatingCosts !== null &&
          listing.heatingCosts !== undefined
            ? String(listing.heatingCosts)
            : ''
        )
        setTotalAdditionalCosts(
          listing.totalAdditionalCosts !== null &&
          listing.totalAdditionalCosts !== undefined
            ? String(listing.totalAdditionalCosts)
            : ''
        )
        setHoaFee(
          listing.hoaFee !== null && listing.hoaFee !== undefined
            ? String(listing.hoaFee)
            : ''
        )
        setGaragePrice(
          listing.garagePrice !== null && listing.garagePrice !== undefined
            ? String(listing.garagePrice)
            : ''
        )
        setDeposit(
          listing.deposit !== null && listing.deposit !== undefined
            ? String(listing.deposit)
            : ''
        )
        setPriceOnRequest(!!listing.priceOnRequest)

        setAvailability(listing.availability || '')
        setTakeoverType(
          (listing.takeoverType as 'nach_vereinbarung' | 'sofort' | 'ab_datum') ||
            'nach_vereinbarung'
        )
        setTakeoverDate(listing.takeoverDate || '')

        setIsFurnished(!!listing.isFurnished)

        setContactName(listing.contactName || '')
        setContactEmail(listing.contactEmail || '')
        setContactPhone(listing.contactPhone || '')
        setContactMobile(listing.contactMobile || '')

        setShowName(
          listing.showName === null || listing.showName === undefined
            ? true
            : !!listing.showName
        )
        setShowPhone(
          listing.showPhone === null || listing.showPhone === undefined
            ? true
            : !!listing.showPhone
        )
        setShowMobile(
          listing.showMobile === null || listing.showMobile === undefined
            ? true
            : !!listing.showMobile
        )
        setNoAgentRequests(
          listing.noAgentRequests === null ||
          listing.noAgentRequests === undefined
            ? true
            : !!listing.noAgentRequests
        )

        // Einwilligungen NICHT aus DB setzen, Nutzer soll aktiv bestätigen
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
  // 👇 Objektart bestimmen (Haus / Wohnung / Grundstück / …)
  const category =
    transactionType === 'sale' ? saleCategory : rentCategory

  const isLand =
    category === 'Grundstück' ||
    category === 'Land- / Forstwirtschaftliches Objekt'

  const isGarage = category === 'Garagen, Stellplätze'

  // Grundstück: mindestens Grundstücksfläche
  if (isLand) {
    return landArea.trim().length > 0
  }

  // Garagen/Stellplätze: mind. irgendeine Flächenangabe
  if (isGarage) {
    return (
      livingArea.trim().length > 0 ||
      landArea.trim().length > 0
    )
  }

  // Standard (Haus, Wohnung, Büro, etc.): Wohn-/Nutzfläche + Zimmer
  return livingArea.trim().length > 0 && rooms.trim().length > 0
}

    if (step === 3) {
      // Ausstattung & Energie: wir verlangen min. Auswahl, aber sind großzügig
      return !!energyCertificateAvailable
    }
    if (step === 4) {
      // Medien: optional, blockiert nicht
      return true
    }
    if (step === 5) {
      return (
        (price.trim().length > 0 || priceOnRequest) &&
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
    offerType,
    saleCategory,
    rentCategory,
    objectCategory:
      transactionType === 'sale' ? saleCategory : rentCategory,
    objectSubtype,
    title,
    description,

    street,
    houseNumber,
    postalCode,
    city,
    country,
    arrivalNote,
    hideStreet,

    livingArea,
    landArea,
    rooms,
    floor,
    totalFloors,
    yearBuilt,
    condition,
    isCurrentlyRented,

    energyCertificateAvailable,
    energyCertificateType,
    energyEfficiencyClass,
    energyConsumption,
    primaryEnergySource,
    heatingType,
    firingType,
    energyCertificateIssueDate,
    energyCertificateValidUntil,

    hasBalcony,
    hasTerrace,
    hasGarden,
    hasBuiltinKitchen,
    hasElevator,
    hasCellar,
    isBarrierFree,
    hasGuestWC,
    hasParkingSpace,
    parkingSpaces,
    parkingSpacePrice,

    photos,
    floorplans,
    documents,

    price,
    currency,
    serviceCharge,
    heatingCosts,
    totalAdditionalCosts,
    hoaFee,
    garagePrice,
    deposit,
    priceOnRequest,

    availability,
    takeoverType,
    takeoverDate,
    isFurnished,

    contactName,
    contactEmail,
    contactPhone,
    contactMobile,

    showName,
    showPhone,
    showMobile,
    noAgentRequests,

    status,
  })

  // Entwurf speichern – arbeitet mit bestehendem Listing, wenn vorhanden
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
    <section className="mx-auto max-w space-y-6 px-4 pb-10 pt-4">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Immobilie inserieren
          </h1>
          <p className="text-sm text-slate-600">
            Erstelle Schritt für Schritt dein Exposé. Die Objektadresse wird
            für die Portale verwendet, deine Rechnungsdaten kommen aus deinem
            Profil.
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
            {usageType === 'residential' ? 'Wohnen' : 'Gewerbe'} ·{' '}
            {offerType === 'private' ? 'privat' : 'gewerblich'}
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
              offerType={offerType}
              setOfferType={setOfferType}
              saleCategory={saleCategory}
              setSaleCategory={setSaleCategory}
              rentCategory={rentCategory}
              setRentCategory={setRentCategory}
              objectSubtype={objectSubtype}
              setObjectSubtype={setObjectSubtype}
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
              arrivalNote={arrivalNote}
              setArrivalNote={setArrivalNote}
              hideStreet={hideStreet}
              setHideStreet={setHideStreet}
            />
          )}

          {step === 2 && (
            <StepDetails
            objectCategory={transactionType === 'sale' ? saleCategory : rentCategory}
    usageType={usageType}
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
              condition={condition}
              setCondition={setCondition}
              isCurrentlyRented={isCurrentlyRented}
              setIsCurrentlyRented={setIsCurrentlyRented}
            />
          )}

          {step === 3 && (
            <StepAusstattungEnergie
              hasBalcony={hasBalcony}
              setHasBalcony={setHasBalcony}
              hasTerrace={hasTerrace}
              setHasTerrace={setHasTerrace}
              hasGarden={hasGarden}
              setHasGarden={setHasGarden}
              hasBuiltinKitchen={hasBuiltinKitchen}
              setHasBuiltinKitchen={setHasBuiltinKitchen}
              hasElevator={hasElevator}
              setHasElevator={setHasElevator}
              hasCellar={hasCellar}
              setHasCellar={setHasCellar}
              isBarrierFree={isBarrierFree}
              setIsBarrierFree={setIsBarrierFree}
              hasGuestWC={hasGuestWC}
              setHasGuestWC={setHasGuestWC}
              hasParkingSpace={hasParkingSpace}
              setHasParkingSpace={setHasParkingSpace}
              parkingSpaces={parkingSpaces}
              setParkingSpaces={setParkingSpaces}
              parkingSpacePrice={parkingSpacePrice}
              setParkingSpacePrice={setParkingSpacePrice}
              energyCertificateAvailable={energyCertificateAvailable}
              setEnergyCertificateAvailable={setEnergyCertificateAvailable}
              energyCertificateType={energyCertificateType}
              setEnergyCertificateType={setEnergyCertificateType}
              energyEfficiencyClass={energyEfficiencyClass}
              setEnergyEfficiencyClass={setEnergyEfficiencyClass}
              energyConsumption={energyConsumption}
              setEnergyConsumption={setEnergyConsumption}
              primaryEnergySource={primaryEnergySource}
              setPrimaryEnergySource={setPrimaryEnergySource}
              heatingType={heatingType}
              setHeatingType={setHeatingType}
              firingType={firingType}
              setFiringType={setFiringType}
              energyCertificateIssueDate={energyCertificateIssueDate}
              setEnergyCertificateIssueDate={
                setEnergyCertificateIssueDate
              }
              energyCertificateValidUntil={energyCertificateValidUntil}
              setEnergyCertificateValidUntil={
                setEnergyCertificateValidUntil
              }
            />
          )}

          {step === 4 && (
            <StepMedien
              photos={photos}
              setPhotos={setPhotos}
              floorplans={floorplans}
              setFloorplans={setFloorplans}
              documents={documents}
              setDocuments={setDocuments}
            />
          )}

          {step === 5 && (
            <StepPreisKontakt
              transactionType={transactionType}
              price={price}
              setPrice={setPrice}
              currency={currency}
              setCurrency={setCurrency}
              serviceCharge={serviceCharge}
              setServiceCharge={setServiceCharge}
              heatingCosts={heatingCosts}
              setHeatingCosts={setHeatingCosts}
              totalAdditionalCosts={totalAdditionalCosts}
              setTotalAdditionalCosts={setTotalAdditionalCosts}
              hoaFee={hoaFee}
              setHoaFee={setHoaFee}
              garagePrice={garagePrice}
              setGaragePrice={setGaragePrice}
              deposit={deposit}
              setDeposit={setDeposit}
              priceOnRequest={priceOnRequest}
              setPriceOnRequest={setPriceOnRequest}
              availability={availability}
              setAvailability={setAvailability}
              takeoverType={takeoverType}
              setTakeoverType={setTakeoverType}
              takeoverDate={takeoverDate}
              setTakeoverDate={setTakeoverDate}
              isFurnished={isFurnished}
              setIsFurnished={setIsFurnished}
              contactName={contactName}
              setContactName={setContactName}
              contactEmail={contactEmail}
              setContactEmail={setContactEmail}
              contactPhone={contactPhone}
              setContactPhone={setContactPhone}
              contactMobile={contactMobile}
              setContactMobile={setContactMobile}
              showName={showName}
              setShowName={setShowName}
              showPhone={showPhone}
              setShowPhone={setShowPhone}
              showMobile={showMobile}
              setShowMobile={setShowMobile}
              noAgentRequests={noAgentRequests}
              setNoAgentRequests={setNoAgentRequests}
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
                  {submitting ? 'Speichere...' : 'Inserat speichern & Paket wählen'}
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
              Die genaue Darstellung hängt vom jeweiligen Portal ab.
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
                {priceOnRequest
                  ? 'Preis auf Anfrage'
                  : price
                  ? new Intl.NumberFormat('de-DE', {
                      style: 'currency',
                      currency: currency || 'EUR',
                    }).format(Number(price))
                  : 'Preis/Miete'}
                {transactionType === 'rent' && !priceOnRequest && ' / Monat'}
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

function StepBasis(props: StepBasisProps) {
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
        <h2 className="text-sm font-medium text-slate-900">
          Basisangaben
        </h2>
        <p className="text-xs text-slate-500">
          Hier legst du fest, ob du vermietest oder verkaufst, ob es sich um
          eine Wohn- oder Gewerbeimmobilie handelt und wie dein Angebot
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
          Entspricht der Objektart-Auswahl bei ImmoScout (Haus, Wohnung, Büro
          &amp; Praxis, …).
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
            <option value="">
              Bitte zuerst eine Objektart wählen
            </option>
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
              <option value="Sonstiger Objekttyp">
                Sonstiger Objekttyp
              </option>
            </>
          )}
        </select>
        <p className="text-[11px] text-slate-500">
          Die Auswahl richtet sich nach der Objektart. Wenn nichts exakt passt,
          wähle „Sonstiger Objekttyp“.
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
  arrivalNote: string
  setArrivalNote: (v: string) => void
  hideStreet: boolean
  setHideStreet: (v: boolean) => void
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

type StepDetailsProps = {
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

function StepDetails({
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
  // 👇 Objektart-Logik
  const category = objectCategory || ''

  const isLand =
    category === 'Grundstück' ||
    category === 'Land- / Forstwirtschaftliches Objekt'

  const isGarage = category === 'Garagen, Stellplätze'

  const isResidential = usageType === 'residential'

  const showLivingArea = !isLand && !isGarage
  const livingAreaLabel = isResidential ? 'Wohnfläche (m²)' : 'Nutzfläche (m²)'

  const showLandArea =
    isLand || category === 'Haus' || category === 'Land- / Forstwirtschaftliches Objekt'
  const landAreaLabel = isLand ? 'Grundstücksfläche (m²)' : 'Grundstück (m²)'

  const showRooms = isResidential && !isLand && !isGarage

  const showFloorAndFloors = !isLand && !isGarage
  const showYearBuilt = !isLand

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-sm font-medium text-slate-900">
          Eckdaten der Immobilie
        </h2>
<p className="text-xs text-slate-500">
  Fläche, Baujahr und Zustand sind die wichtigsten Kennzahlen. Die
  Felder passen sich automatisch an die gewählte Objektart an
  (z.&nbsp;B. Grundstücksfläche statt Wohnfläche bei Grundstücken).
</p>
      </div>

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
  )}
</div>


<div className="grid gap-3 sm:grid-cols-3">
  {showFloorAndFloors && (
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
  )}

  {showFloorAndFloors && (
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

type StepAusstattungEnergieProps = {
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

function StepAusstattungEnergie({
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
              onClick={() => setEnergyCertificateAvailable('not_required')}
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
                  onChange={(e) =>
                    setEnergyEfficiencyClass(e.target.value)
                  }
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

type StepMedienProps = {
  photos: string[]
  setPhotos: (v: string[]) => void
  floorplans: string[]
  setFloorplans: (v: string[]) => void
  documents: string[]
  setDocuments: (v: string[]) => void
}

function StepMedien({
  photos,
  setPhotos,
  floorplans,
  setFloorplans,
  documents,
  setDocuments,
}: StepMedienProps) {
  const updateArray = (
    arr: string[],
    index: number,
    value: string,
    setter: (v: string[]) => void
  ) => {
    const copy = [...arr]
    copy[index] = value
    setter(copy)
  }

  const addRow = (arr: string[], setter: (v: string[]) => void) => {
    setter([...arr, ''])
  }

  const removeRow = (
    arr: string[],
    index: number,
    setter: (v: string[]) => void
  ) => {
    const copy = [...arr]
    copy.splice(index, 1)
    if (copy.length === 0) copy.push('')
    setter(copy)
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-sm font-medium text-slate-900">
          Medien & Dokumente
        </h2>
        <p className="text-xs text-slate-500">
          Hier kannst du Links zu Bildern, Grundrissen und Dokumenten hinterlegen
          (z.B. CDN, Cloud-Speicher). Die Maklernull Bridge kann diese später an
          die Portale übergeben. Ein eigener Datei-Upload kann zusätzlich noch
          eingebaut werden.
        </p>
      </div>

      {/* Fotos */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-slate-700">
          Fotos (Bild-URLs)
        </label>
        <div className="space-y-2">
          {photos.map((url, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="text"
                className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 shadow-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                placeholder="https://… (Bild-URL)"
                value={url}
                onChange={(e) =>
                  updateArray(photos, i, e.target.value, setPhotos)
                }
              />
              <button
                type="button"
                onClick={() => removeRow(photos, i, setPhotos)}
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-600 shadow-sm hover:border-slate-300 hover:bg-slate-50"
              >
                –
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => addRow(photos, setPhotos)}
          className="mt-1 inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-medium text-slate-700 shadow-sm hover:border-slate-300 hover:bg-slate-50"
        >
          + weiteres Foto
        </button>
      </div>

      {/* Grundrisse */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-slate-700">
          Grundrisse (Bild- oder PDF-URLs)
        </label>
        <div className="space-y-2">
          {floorplans.map((url, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="text"
                className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 shadow-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                placeholder="https://… (Grundriss-URL)"
                value={url}
                onChange={(e) =>
                  updateArray(
                    floorplans,
                    i,
                    e.target.value,
                    setFloorplans
                  )
                }
              />
              <button
                type="button"
                onClick={() => removeRow(floorplans, i, setFloorplans)}
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-600 shadow-sm hover:border-slate-300 hover:bg-slate-50"
              >
                –
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => addRow(floorplans, setFloorplans)}
          className="mt-1 inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-medium text-slate-700 shadow-sm hover:border-slate-300 hover:bg-slate-50"
        >
          + weiterer Grundriss
        </button>
      </div>

      {/* Dokumente */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-slate-700">
          Dokumente (PDF-URLs, z.B. Exposé, Energieausweis)
        </label>
        <div className="space-y-2">
          {documents.map((url, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="text"
                className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 shadow-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                placeholder="https://… (Dokument-URL)"
                value={url}
                onChange={(e) =>
                  updateArray(
                    documents,
                    i,
                    e.target.value,
                    setDocuments
                  )
                }
              />
              <button
                type="button"
                onClick={() =>
                  removeRow(documents, i, setDocuments)
                }
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-600 shadow-sm hover:border-slate-300 hover:bg-slate-50"
              >
                –
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => addRow(documents, setDocuments)}
          className="mt-1 inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-medium text-slate-700 shadow-sm hover:border-slate-300 hover:bg-slate-50"
        >
          + weiteres Dokument
        </button>
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

function StepPreisKontakt({
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
                e.target.value as 'nach_vereinbarung' | 'sofort' | 'ab_datum'
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
