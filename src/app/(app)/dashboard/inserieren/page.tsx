// src/app/dashboard/inserieren/page.tsx
'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import {
  TransactionType,
  UsageType,
  OfferType,
  EnergyCertificateAvailable,
  EnergyCertificateType,
} from './steps/types'

import { StepBasis } from './steps/StepBasis'
import { StepAdresse } from './steps/StepAdresse'
import { StepDetails } from './steps/StepDetails'
import { StepAusstattungEnergie } from './steps/StepAusstattungEnergie'
import { StepMedien } from './steps/StepMedien'
import { StepPreisKontakt } from './steps/StepPreisKontakt'
import { StepUebersicht } from './steps/StepUebersicht'
import { StepKiTexte } from './steps/StepKiTexte'

type StepKey =
  | 'basis'
  | 'adresse'
  | 'details'
  | 'ausstattung'
  | 'medien'
  | 'preis'
  | 'ki'  
  | 'uebersicht'

const STEPS: { id: number; key: StepKey; label: string }[] = [
  { id: 1, key: 'basis', label: 'Basisangaben' },
  { id: 2, key: 'adresse', label: 'Adresse' },
  { id: 3, key: 'details', label: 'Eckdaten' },
  { id: 4, key: 'ausstattung', label: 'Ausstattung & Energie' },
  { id: 5, key: 'medien', label: 'Medien' },
  { id: 6, key: 'preis', label: 'Preis & Kontakt' },
  { id: 7, key: 'ki', label: 'KI-Texte' },   
  { id: 8, key: 'uebersicht', label: 'Übersicht' },
]

export default function InserierenPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  /* ----------------------------- Basis / Objekt ----------------------------- */

  const [transactionType, setTransactionType] =
    useState<TransactionType>('sale') // verkaufen als Default
  const [usageType, setUsageType] = useState<UsageType>('residential')
  const [offerType, setOfferType] = useState<OfferType>('commercial')

  const [saleCategory, setSaleCategory] = useState('')
  const [rentCategory, setRentCategory] = useState('')
  const [objectSubtype, setObjectSubtype] = useState('')

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  /* -------------------------------- Adresse -------------------------------- */

  const [street, setStreet] = useState('')
  const [houseNumber, setHouseNumber] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [city, setCity] = useState('')
  const [country, setCountry] = useState('Deutschland')
  const [arrivalNote, setArrivalNote] = useState('')
  const [hideStreet, setHideStreet] = useState(false)

  /* -------------------------------- Details -------------------------------- */

  const [livingArea, setLivingArea] = useState('')
  const [landArea, setLandArea] = useState('')
  const [rooms, setRooms] = useState('')
  const [floor, setFloor] = useState('')
  const [totalFloors, setTotalFloors] = useState('')
  const [yearBuilt, setYearBuilt] = useState('')
  const [condition, setCondition] = useState('')
  const [isCurrentlyRented, setIsCurrentlyRented] = useState(false)

  const objectCategory = useMemo(
    () => (transactionType === 'sale' ? saleCategory : rentCategory),
    [transactionType, saleCategory, rentCategory]
  )

  /* ------------------------- Ausstattung & Energie ------------------------- */

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

  const [energyCertificateAvailable, setEnergyCertificateAvailable] =
    useState<EnergyCertificateAvailable>('no')
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

  /* --------------------------------- Medien -------------------------------- */

  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [energyCertificateFile, setEnergyCertificateFile] =
    useState<File | null>(null)
  const [documentFiles, setDocumentFiles] = useState<File[]>([])
  const [exposeFile, setExposeFile] = useState<File | null>(null)
  const [autoGenerateExpose, setAutoGenerateExpose] = useState(false)

  /* ----------------------------- Preis & Kontakt ---------------------------- */

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
  const [takeoverType, setTakeoverType] =
    useState<'nach_vereinbarung' | 'sofort' | 'ab_datum'>(
      'nach_vereinbarung'
    )
  const [takeoverDate, setTakeoverDate] = useState('')
  const [isFurnished, setIsFurnished] = useState(false)

  const [contactName, setContactName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [contactMobile, setContactMobile] = useState('')
  const [showName, setShowName] = useState(true)
  const [showPhone, setShowPhone] = useState(true)
  const [showMobile, setShowMobile] = useState(false)
  const [noAgentRequests, setNoAgentRequests] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [acceptPrivacy, setAcceptPrivacy] = useState(false)

  /* ----------------------------- KI-Texte ----------------------------- */

  const [aiLocationText, setAiLocationText] = useState('')
  const [aiDescriptionText, setAiDescriptionText] = useState('')
  const [aiEquipmentText, setAiEquipmentText] = useState('')
  const [aiHighlightsText, setAiHighlightsText] = useState('')

  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState<string | null>(null)

  /* -------------------------- Draft / Status / API -------------------------- */

  const [listingId, setListingId] = useState<string | null>(null)
  const [initialLoading, setInitialLoading] = useState(false)
  const [savingDraft, setSavingDraft] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [status, setStatus] = useState<string>('entwurf')

  /* ----------------------------- Step Navigation ---------------------------- */

  const [currentStep, setCurrentStep] = useState<number>(1)
  const [maxVisitedStep, setMaxVisitedStep] = useState<number>(1)

  const stepDef = STEPS[currentStep - 1]
  const isLastStep = currentStep === STEPS.length

  const goToStep = (step: number) => {
    if (step < 1 || step > STEPS.length) return
    if (step > maxVisitedStep) return
    setCurrentStep(step)
  }

  const handleNext = () => {
    if (currentStep >= STEPS.length) return
    const next = currentStep + 1
    setCurrentStep(next)
    setMaxVisitedStep((prev) => Math.max(prev, next))
  }

  const handleBack = () => {
    if (currentStep <= 1) return
    setCurrentStep((s) => s - 1)
  }

  /* ----------------------------- Status-Badge ----------------------------- */

  const statusChip = (() => {
    const normalized = (status || 'entwurf').toLowerCase()
    if (normalized === 'aktiv') {
      return {
        label: 'Aktiv',
        className: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
      }
    }
    if (normalized === 'deaktiviert') {
      return {
        label: 'Deaktiviert',
        className: 'bg-slate-50 text-slate-600 ring-slate-200',
      }
    }
    if (normalized === 'vermarktet') {
      return {
        label: 'Vermarktet',
        className: 'bg-indigo-50 text-indigo-700 ring-indigo-200',
      }
    }
    return {
      label: 'Entwurf',
      className: 'bg-amber-50 text-amber-700 ring-amber-200',
    }
  })()

  /* -------------------- Bestehendes Inserat (Bearbeiten) -------------------- */

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
          throw new Error(
            data.error || 'Inserat konnte nicht geladen werden.'
          )
        }

        const { listing } = await res.json()

        if (!listing) {
          throw new Error('Inserat nicht gefunden.')
        }

        setListingId(listing.id)
        setStatus(listing.status || 'entwurf')

        // Basis
        setTransactionType(
          (listing.transactionType as TransactionType) || 'sale'
        )
        setUsageType(
          (listing.usageType as UsageType) || 'residential'
        )
        setOfferType(
          (listing.offerType as OfferType) || 'commercial'
        )

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

        // Details (numerics -> string)
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
            'no'
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

        // Medien: aktuell noch nicht aus DB in File-Objekte mappen
        setImageFiles([])
        setDocumentFiles([])
        setEnergyCertificateFile(null)
        setExposeFile(null)
        setAutoGenerateExpose(false)

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
          listing.garagePrice !== null &&
          listing.garagePrice !== undefined
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
            ? false
            : !!listing.showMobile
        )
        setNoAgentRequests(
          listing.noAgentRequests === null ||
          listing.noAgentRequests === undefined
            ? false
            : !!listing.noAgentRequests
        )

        // Einwilligungen: bewusst nicht vorausfüllen
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

  /* ----------------------- Payload für API zusammenbauen ----------------------- */

  const buildPayload = (statusOverride?: 'draft' | 'pending_payment') => ({
    transactionType,
    usageType,
    offerType,
    saleCategory,
    rentCategory,
    objectCategory,
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

    // Medien – aktuell noch Platzhalter, bis der Upload fertig ist
    photos: [] as string[],
    floorplans: [] as string[],
    documents: [] as string[],

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

    status: statusOverride,
  })

  /* ------------------------------- Entwurf speichern ------------------------------- */

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
        throw new Error(
          data.error || 'Fehler beim Speichern des Entwurfs'
        )
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

  /* --------------------------------- Final submit --------------------------------- */

  const handleSubmit = async () => {
    if (submitting) return
    if (!acceptTerms || !acceptPrivacy) return

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

      router.push(
        `/dashboard/inserieren/paket?listing=${listing.id}&kind=${transactionType}`
      )
    } catch (e: any) {
      setError(e.message || 'Unbekannter Fehler')
      setSubmitting(false)
    }
  }

    const generateAiTexts = async () => {
    if (aiLoading) return
    setAiLoading(true)
    setAiError(null)

    try {
      const res = await fetch('/api/listings/ai-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // Basis
          transactionType,
          usageType,
          offerType,
          saleCategory,
          rentCategory,
          objectSubtype,
          title,
          description,

          // Adresse
          street,
          houseNumber,
          postalCode,
          city,
          country,
          arrivalNote,
          hideStreet,

          // Details
          objectCategory,
          livingArea,
          landArea,
          rooms,
          floor,
          totalFloors,
          yearBuilt,
          condition,
          isCurrentlyRented,

          // Ausstattung & Energie
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
          energyCertificateAvailable,
          energyCertificateType,
          energyEfficiencyClass,
          energyConsumption,
          primaryEnergySource,
          heatingType,
          firingType,
          energyCertificateIssueDate,
          energyCertificateValidUntil,

          // Medien (nur Info für die KI, nicht kritisch)
          imageFilesCount: imageFiles.length,
          documentFilesCount: documentFiles.length,

          // Preis & Verfügbarkeit
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
          cityForLocation: city,
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Fehler bei der KI-Textgenerierung')
      }

      const data = await res.json()

      setAiLocationText(data.locationText || '')
      setAiDescriptionText(data.descriptionText || '')
      setAiEquipmentText(data.equipmentText || '')
      setAiHighlightsText(data.highlightsText || '')
    } catch (e: any) {
      console.error(e)
      setAiError(
        e.message || 'Unbekannter Fehler bei der KI-Textgenerierung'
      )
    } finally {
      setAiLoading(false)
    }
  }


  /* ------------------------------ Render Step-Content ------------------------------ */

  const renderStepContent = () => {
    switch (stepDef.key) {
      case 'basis':
        return (
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
        )

      case 'adresse':
        return (
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
        )

      case 'details':
        return (
          <StepDetails
            objectCategory={objectCategory}
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
        )

      case 'ausstattung':
        return (
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
            energyCertificateValidUntil={
              energyCertificateValidUntil
            }
            setEnergyCertificateValidUntil={
              setEnergyCertificateValidUntil
            }
          />
        )

      case 'medien':
        return (
          <StepMedien
            imageFiles={imageFiles}
            setImageFiles={setImageFiles}
            energyCertificateFile={energyCertificateFile}
            setEnergyCertificateFile={setEnergyCertificateFile}
            documentFiles={documentFiles}
            setDocumentFiles={setDocumentFiles}
            exposeFile={exposeFile}
            setExposeFile={setExposeFile}
            autoGenerateExpose={autoGenerateExpose}
            setAutoGenerateExpose={setAutoGenerateExpose}
          />
        )

      case 'preis':
        return (
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
        )

        case 'ki':
        return (
          <StepKiTexte
            aiLocationText={aiLocationText}
            setAiLocationText={setAiLocationText}
            aiDescriptionText={aiDescriptionText}
            setAiDescriptionText={setAiDescriptionText}
            aiEquipmentText={aiEquipmentText}
            setAiEquipmentText={setAiEquipmentText}
            aiHighlightsText={aiHighlightsText}
            setAiHighlightsText={setAiHighlightsText}
            aiLoading={aiLoading}
            aiError={aiError}
            onGenerate={generateAiTexts}
          />
        )

      case 'uebersicht':
        return (
          <StepUebersicht
            /* Basis */
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
            /* Adresse */
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
            /* Details */
            objectCategory={objectCategory}
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
            /* Ausstattung & Energie */
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
            energyCertificateValidUntil={
              energyCertificateValidUntil
            }
            setEnergyCertificateValidUntil={
              setEnergyCertificateValidUntil
            }
            /* Medien */
            imageFiles={imageFiles}
            setImageFiles={setImageFiles}
            energyCertificateFile={energyCertificateFile}
            setEnergyCertificateFile={setEnergyCertificateFile}
            documentFiles={documentFiles}
            setDocumentFiles={setDocumentFiles}
            exposeFile={exposeFile}
            setExposeFile={setExposeFile}
            autoGenerateExpose={autoGenerateExpose}
            setAutoGenerateExpose={setAutoGenerateExpose}
            /* Preis & Kontakt */
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
        )

      default:
        return null
    }
  }

  /* ---------------------------------- UI ----------------------------------- */

  return (
    <section className="space-y-6">
      {/* Kopfbereich */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">
            Immobilie inserieren
          </h1>
          <p className="text-xs text-slate-500">
            Erfasse Schritt für Schritt alle Daten – ähnlich wie bei
            ImmoScout. Am Ende erhältst du eine Gesamtübersicht, bevor du
            die Portale und dein Paket auswählst.
          </p>
          {initialLoading && (
            <p className="mt-1 text-[11px] text-slate-500">
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

      {/* Stepper */}
      <div className="rounded-3xl border border-white/70 bg-white/80 px-3 py-3 shadow-sm backdrop-blur-xl sm:px-4">
        <ol className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-600">
          {STEPS.map((s, idx) => {
            const isActive = s.id === currentStep
            const isDone = s.id < currentStep
            const isClickable = s.id <= maxVisitedStep

            return (
              <li
                key={s.key}
                className="flex flex-1 items-center gap-2 min-w-[90px]"
              >
                <button
                  type="button"
                  onClick={() =>
                    isClickable ? goToStep(s.id) : undefined
                  }
                  className={[
                    'inline-flex items-center gap-2 rounded-full border px-2.5 py-1 transition',
                    isActive
                      ? 'border-slate-900 bg-slate-900 text-white'
                      : isDone
                      ? 'border-emerald-400/70 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50',
                    !isClickable && !isActive ? 'cursor-default' : '',
                  ].join(' ')}
                >
                  <span
                    className={[
                      'flex h-4 w-4 items-center justify-center rounded-full text-[10px]',
                      isActive || isDone
                        ? 'bg-white/90 text-slate-900'
                        : 'bg-slate-100 text-slate-500',
                    ].join(' ')}
                  >
                    {s.id}
                  </span>
                  <span className="truncate">{s.label}</span>
                </button>

                {idx < STEPS.length - 1 && (
                  <span className="hidden flex-1 border-t border-dashed border-slate-200 sm:block" />
                )}
              </li>
            )
          })}
        </ol>
      </div>

      {/* Inhalt + Sidebar */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.1fr)]">
        {/* Hauptformular */}
        <div className="rounded-3xl border border-white/70 bg-white/80 p-4 shadow-sm backdrop-blur-xl sm:p-5">
          {renderStepContent()}
        </div>

        {/* Sidebar Vorschau / Hinweis */}
        <aside className="space-y-4">
          <div className="rounded-3xl border border-white/60 bg-white/80 p-4 shadow-sm backdrop-blur-xl">
            <h2 className="text-sm font-medium text-slate-900">
              Kurzvorschau deines Exposés
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              So ähnlich könnte dein Inserat später auf den Portalen
              aussehen. Die genaue Darstellung hängt vom jeweiligen Portal
              ab.
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
                {transactionType === 'rent' && !priceOnRequest && price
                  ? ' / Monat'
                  : ''}
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
              <li>
                Veröffentlichung auf ImmoScout24, Immowelt & Kleinanzeigen
              </li>
            </ol>
          </div>
        </aside>
      </div>

      {/* Navigation unten */}
      <div className="flex flex-col-reverse items-stretch justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          {currentStep > 1 && (
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
            >
              Zurück
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Entwurf speichern */}
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={savingDraft || initialLoading}
            className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {savingDraft ? 'Speichere Entwurf…' : 'Als Entwurf speichern'}
          </button>

          {!isLastStep && (
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center rounded-full border border-slate-900 bg-slate-900 px-4 py-2 text-xs font-medium text-white shadow-sm transition hover:bg-slate-800"
            >
              Weiter
            </button>
          )}

          {isLastStep && (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={
                submitting || !acceptTerms || !acceptPrivacy || initialLoading
              }
              className="inline-flex items-center rounded-full border border-slate-900 bg-slate-900 px-4 py-2 text-xs font-medium text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:border-slate-300 disabled:bg-slate-300"
            >
              {submitting
                ? 'Wird gespeichert…'
                : 'Inserat speichern & Paket wählen'}
            </button>
          )}
        </div>
      </div>

      {error && (
        <p className="text-xs text-rose-600">
          {error}
        </p>
      )}
      {success && (
        <p className="text-xs text-emerald-600">
          {success}
        </p>
      )}
    </section>
  )
}
