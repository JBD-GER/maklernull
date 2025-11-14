// app/api/listings/[id]/route.ts
export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

type UiStatus = 'entwurf' | 'aktiv' | 'deaktiviert' | 'vermarktet'
type DbStatus =
  | 'draft'
  | 'pending_payment'
  | 'pending_sync'
  | 'active'
  | 'deactivated'
  | 'marketed'
  | 'archived'
  | 'deleted'

function mapDbStatusToUi(status: string | null): string | null {
  if (!status) return null
  const s = status.toLowerCase() as DbStatus

  switch (s) {
    case 'draft':
      return 'entwurf'
    case 'pending_payment':
      // 🔥 Im UI weiterhin "Entwurf"
      return 'entwurf'
    case 'active':
      return 'aktiv'
    case 'deactivated':
      return 'deaktiviert'
    case 'marketed':
      return 'vermarktet'
    default:
      return status
  }
}

function mapUiStatusToDb(status: string | null): DbStatus | null {
  if (!status) return null
  const s = status.toLowerCase()

  const direct: DbStatus[] = [
    'draft',
    'pending_payment',
    'pending_sync',
    'active',
    'deactivated',
    'marketed',
    'archived',
    'deleted',
  ]
  if (direct.includes(s as DbStatus)) return s as DbStatus

  const map: Record<UiStatus, DbStatus> = {
    entwurf: 'draft',
    aktiv: 'active',
    deaktiviert: 'deactivated',
    vermarktet: 'marketed',
  }

  if ((map as any)[s]) return (map as any)[s] as DbStatus
  return null
}

/* ----------------------- Helper für leere Strings ----------------------- */

function normalizeNullable(value: any) {
  return value === '' || value === undefined ? null : value
}

function normalizeNumeric(value: any) {
  if (value === '' || value === undefined || value === null) return null
  return value
}

function normalizeDateLike(value: any) {
  if (value === '' || value === undefined || value === null) return null
  return value
}

/* ----------------------- DB -> API (ALLE Felder) ----------------------- */

function mapDbRowToApi(row: any) {
  if (!row) return null
  return {
    id: row.id,
    // Status ins UI-Format
    status: mapDbStatusToUi(row.status),
    created_at: row.created_at,
    updated_at: row.updated_at,

    transactionType: row.transaction_type,
    usageType: row.usage_type,
    offerType: row.offer_type,

    objectCategory: row.object_category,
    saleCategory: row.object_category,
    rentCategory: row.object_category,
    objectSubtype: row.object_subtype,

    title: row.title,
    description: row.description,

    street: row.street,
    houseNumber: row.house_number,
    postalCode: row.postal_code,
    city: row.city,
    country: row.country,
    arrivalNote: row.arrival_note,
    hideStreet: row.hide_street,

    livingArea: row.living_area,
    landArea: row.land_area,
    rooms: row.rooms,
    floor: row.floor,
    totalFloors: row.total_floors,
    yearBuilt: row.year_built,
    condition: row.condition,
    isCurrentlyRented: row.is_currently_rented,

    price: row.price,
    currency: row.currency,
    serviceCharge: row.service_charge,
    heatingCosts: row.heating_costs,
    totalAdditionalCosts: row.total_additional_costs,
    hoaFee: row.hoa_fee,
    garagePrice: row.garage_price,
    deposit: row.deposit,
    priceOnRequest: row.price_on_request,

    availability: row.availability,
    takeoverType: row.takeover_type,
    takeoverDate: row.takeover_date,
    isFurnished: row.is_furnished,

    contactName: row.contact_name,
    contactEmail: row.contact_email,
    contactPhone: row.contact_phone,
    contactMobile: row.contact_mobile,

    showName: row.show_name,
    showPhone: row.show_phone,
    showMobile: row.show_mobile,
    noAgentRequests: row.no_agent_requests,

    energyCertificateAvailable: row.energy_certificate_available,
    energyCertificateType: row.energy_certificate_type,
    energyEfficiencyClass: row.energy_efficiency_class,
    energyConsumption: row.energy_consumption,
    primaryEnergySource: row.primary_energy_source,
    heatingType: row.heating_type,
    firingType: row.firing_type,
    energyCertificateIssueDate: row.energy_certificate_issue_date,
    energyCertificateValidUntil: row.energy_certificate_valid_until,

    hasBalcony: row.has_balcony,
    hasTerrace: row.has_terrace,
    hasGarden: row.has_garden,
    hasBuiltinKitchen: row.has_builtin_kitchen,
    hasElevator: row.has_elevator,
    hasCellar: row.has_cellar,
    isBarrierFree: row.is_barrier_free,
    hasGuestWC: row.has_guest_wc,
    hasParkingSpace: row.has_parking_space,
    parkingSpaces: row.parking_spaces,
    parkingSpacePrice: row.parking_space_price,

    photos: row.photos || [],
    floorplans: row.floorplans || [],
    documents: row.documents || [],

    estatesyncPropertyId: row.estatesync_property_id,
    estatesyncListingId: row.estatesync_listing_id,
    stripePaymentIntentId: row.stripe_payment_intent_id,
    raw: row.raw,
    packageCode: row.package_code,
    runtimeMonths: row.runtime_months,
    activeFrom: row.active_from,
    activeUntil: row.active_until,
  }
}

/* ---------------- Body -> DB (PARTIAL Update, aber ALLE Felder möglich) ---------------- */

function mapBodyToDb(body: any) {
  const {
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
    status,
    packageCode,
    runtimeMonths,
    activeFrom,
    activeUntil,
  } = body || {}

  const payload: any = {}

  if (transactionType !== undefined)
    payload.transaction_type = normalizeNullable(transactionType)
  if (usageType !== undefined)
    payload.usage_type = normalizeNullable(usageType)
  if (offerType !== undefined)
    payload.offer_type = normalizeNullable(offerType)

  const category =
    objectCategory ??
    saleCategory ??
    rentCategory ??
    undefined
  if (category !== undefined)
    payload.object_category = normalizeNullable(category)

  if (objectSubtype !== undefined)
    payload.object_subtype = normalizeNullable(objectSubtype)

  if (title !== undefined)
    payload.title = normalizeNullable(title)
  if (description !== undefined)
    payload.description = normalizeNullable(description)

  if (street !== undefined)
    payload.street = normalizeNullable(street)
  if (houseNumber !== undefined)
    payload.house_number = normalizeNullable(houseNumber)
  if (postalCode !== undefined)
    payload.postal_code = normalizeNullable(postalCode)
  if (city !== undefined)
    payload.city = normalizeNullable(city)
  if (country !== undefined)
    payload.country = normalizeNullable(country)
  if (arrivalNote !== undefined)
    payload.arrival_note = normalizeNullable(arrivalNote)
  if (hideStreet !== undefined)
    payload.hide_street = hideStreet

  if (livingArea !== undefined)
    payload.living_area = normalizeNumeric(livingArea)
  if (landArea !== undefined)
    payload.land_area = normalizeNumeric(landArea)
  if (rooms !== undefined)
    payload.rooms = normalizeNumeric(rooms)
  if (floor !== undefined)
    payload.floor = normalizeNullable(floor)
  if (totalFloors !== undefined)
    payload.total_floors = normalizeNullable(totalFloors)
  if (yearBuilt !== undefined)
    payload.year_built = normalizeNumeric(yearBuilt)
  if (condition !== undefined)
    payload.condition = normalizeNullable(condition)
  if (isCurrentlyRented !== undefined)
    payload.is_currently_rented = isCurrentlyRented

  if (price !== undefined)
    payload.price = normalizeNumeric(price)
  if (currency !== undefined)
    payload.currency = normalizeNullable(currency)
  if (serviceCharge !== undefined)
    payload.service_charge = normalizeNumeric(serviceCharge)
  if (heatingCosts !== undefined)
    payload.heating_costs = normalizeNumeric(heatingCosts)
  if (totalAdditionalCosts !== undefined)
    payload.total_additional_costs = normalizeNumeric(totalAdditionalCosts)
  if (hoaFee !== undefined)
    payload.hoa_fee = normalizeNumeric(hoaFee)
  if (garagePrice !== undefined)
    payload.garage_price = normalizeNumeric(garagePrice)
  if (deposit !== undefined)
    payload.deposit = normalizeNumeric(deposit)
  if (priceOnRequest !== undefined)
    payload.price_on_request = priceOnRequest

  if (availability !== undefined)
    payload.availability = normalizeDateLike(availability)
  if (takeoverType !== undefined)
    payload.takeover_type = normalizeNullable(takeoverType)
  if (takeoverDate !== undefined)
    payload.takeover_date = normalizeDateLike(takeoverDate)
  if (isFurnished !== undefined)
    payload.is_furnished = isFurnished

  if (contactName !== undefined)
    payload.contact_name = normalizeNullable(contactName)
  if (contactEmail !== undefined)
    payload.contact_email = normalizeNullable(contactEmail)
  if (contactPhone !== undefined)
    payload.contact_phone = normalizeNullable(contactPhone)
  if (contactMobile !== undefined)
    payload.contact_mobile = normalizeNullable(contactMobile)

  if (showName !== undefined)
    payload.show_name = showName
  if (showPhone !== undefined)
    payload.show_phone = showPhone
  if (showMobile !== undefined)
    payload.show_mobile = showMobile
  if (noAgentRequests !== undefined)
    payload.no_agent_requests = noAgentRequests

  if (energyCertificateAvailable !== undefined)
    payload.energy_certificate_available = normalizeNullable(energyCertificateAvailable)
  if (energyCertificateType !== undefined)
    payload.energy_certificate_type = normalizeNullable(energyCertificateType)
  if (energyEfficiencyClass !== undefined)
    payload.energy_efficiency_class = normalizeNullable(energyEfficiencyClass)
  if (energyConsumption !== undefined)
    payload.energy_consumption = normalizeNumeric(energyConsumption)
  if (primaryEnergySource !== undefined)
    payload.primary_energy_source = normalizeNullable(primaryEnergySource)
  if (heatingType !== undefined)
    payload.heating_type = normalizeNullable(heatingType)
  if (firingType !== undefined)
    payload.firing_type = normalizeNullable(firingType)
  if (energyCertificateIssueDate !== undefined)
    payload.energy_certificate_issue_date = normalizeDateLike(energyCertificateIssueDate)
  if (energyCertificateValidUntil !== undefined)
    payload.energy_certificate_valid_until = normalizeDateLike(energyCertificateValidUntil)

  if (hasBalcony !== undefined)
    payload.has_balcony = hasBalcony
  if (hasTerrace !== undefined)
    payload.has_terrace = hasTerrace
  if (hasGarden !== undefined)
    payload.has_garden = hasGarden
  if (hasBuiltinKitchen !== undefined)
    payload.has_builtin_kitchen = hasBuiltinKitchen
  if (hasElevator !== undefined)
    payload.has_elevator = hasElevator
  if (hasCellar !== undefined)
    payload.has_cellar = hasCellar
  if (isBarrierFree !== undefined)
    payload.is_barrier_free = isBarrierFree
  if (hasGuestWC !== undefined)
    payload.has_guest_wc = hasGuestWC
  if (hasParkingSpace !== undefined)
    payload.has_parking_space = hasParkingSpace
  if (parkingSpaces !== undefined)
    payload.parking_spaces = normalizeNumeric(parkingSpaces)
  if (parkingSpacePrice !== undefined)
    payload.parking_space_price = normalizeNumeric(parkingSpacePrice)

  if (photos !== undefined) {
    payload.photos = Array.isArray(photos)
      ? photos.filter((x: any) => !!x)
      : null
  }
  if (floorplans !== undefined) {
    payload.floorplans = Array.isArray(floorplans)
      ? floorplans.filter((x: any) => !!x)
      : null
  }
  if (documents !== undefined) {
    payload.documents = Array.isArray(documents)
      ? documents.filter((x: any) => !!x)
      : null
  }

  if (packageCode !== undefined)
    payload.package_code = normalizeNullable(packageCode)
  if (runtimeMonths !== undefined)
    payload.runtime_months = normalizeNumeric(runtimeMonths)
  if (activeFrom !== undefined)
    payload.active_from = normalizeDateLike(activeFrom)
  if (activeUntil !== undefined)
    payload.active_until = normalizeDateLike(activeUntil)

  if (status !== undefined && typeof status === 'string') {
    const dbStatus = mapUiStatusToDb(status)
    if (dbStatus) payload.status = dbStatus
  }

  return payload
}

/* ----------------------- GET /api/listings/[id] ----------------------- */

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params

  try {
    const supabase = await supabaseServer()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 })
    }

    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (error) {
      if (error.code === 'PGRST116' || error.message?.includes('No rows')) {
        return NextResponse.json({ error: 'Inserat nicht gefunden' }, { status: 404 })
      }
      console.error('[GET /api/listings/:id] DB-Error:', error)
      return NextResponse.json(
        { error: 'Fehler beim Laden des Inserats' },
        { status: 500 }
      )
    }

    if (!data) {
      return NextResponse.json({ error: 'Inserat nicht gefunden' }, { status: 404 })
    }

    const listing = mapDbRowToApi(data)
    return NextResponse.json({ listing })
  } catch (err) {
    console.error('[GET /api/listings/:id] Error:', err)
    return NextResponse.json(
      { error: 'Unerwarteter Fehler beim Laden des Inserats' },
      { status: 500 }
    )
  }
}

/* ----------------------- PUT /api/listings/[id] ----------------------- */

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params

  try {
    const supabase = await supabaseServer()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 })
    }

    const body = await req.json().catch(() => null)
    if (!body) {
      return NextResponse.json(
        { error: 'Ungültiger Request-Body' },
        { status: 400 }
      )
    }

    const updatePayload = mapBodyToDb(body)
    if (Object.keys(updatePayload).length === 0) {
      return NextResponse.json(
        { error: 'Keine Felder zum Aktualisieren übergeben' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('listings')
      .update(updatePayload)
      .eq('id', id)
      .eq('user_id', user.id)
      .select('*')
      .single()

    if (error) {
      console.error('[PUT /api/listings/:id] DB-Error:', error)
      return NextResponse.json(
        { error: 'Fehler beim Aktualisieren des Inserats' },
        { status: 500 }
      )
    }

    if (!data) {
      return NextResponse.json({ error: 'Inserat nicht gefunden' }, { status: 404 })
    }

    const listing = mapDbRowToApi(data)
    return NextResponse.json({ listing })
  } catch (err) {
    console.error('[PUT /api/listings/:id] Error:', err)
    return NextResponse.json(
      { error: 'Unerwarteter Fehler beim Aktualisieren des Inserats' },
      { status: 500 }
    )
  }
}

/* ----------------------- DELETE /api/listings/[id] ----------------------- */

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params

  try {
    const supabase = await supabaseServer()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 })
    }

    const { data: existing, error: fetchError } = await supabase
      .from('listings')
      .select('id, status, user_id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (fetchError || !existing) {
      return NextResponse.json({ error: 'Inserat nicht gefunden' }, { status: 404 })
    }

    const uiStatus = mapDbStatusToUi(existing.status) || ''

    if (uiStatus.toLowerCase() !== 'entwurf') {
      return NextResponse.json(
        { error: 'Nur Entwürfe können gelöscht werden.' },
        { status: 400 }
      )
    }

    const { error: deleteError } = await supabase
      .from('listings')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (deleteError) {
      console.error('[DELETE /api/listings/:id] DB-Error:', deleteError)
      return NextResponse.json(
        { error: 'Fehler beim Löschen des Inserats' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[DELETE /api/listings/:id] Error:', err)
    return NextResponse.json(
      { error: 'Unerwarteter Fehler beim Löschen des Inserats' },
      { status: 500 }
    )
  }
}
