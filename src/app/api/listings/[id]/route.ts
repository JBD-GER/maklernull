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

/* ----------------------- DB -> API ----------------------- */

function mapDbRowToApi(row: any) {
  if (!row) return null
  return {
    id: row.id,
    status: mapDbStatusToUi(row.status),
    created_at: row.created_at,
    updated_at: row.updated_at,

    transactionType: row.transaction_type,
    usageType: row.usage_type,

    objectCategory: row.object_category,
    saleCategory: row.object_category,
    rentCategory: row.object_category,

    title: row.title,
    description: row.description,

    street: row.street,
    houseNumber: row.house_number,
    postalCode: row.postal_code,
    city: row.city,
    country: row.country,

    livingArea: row.living_area,
    landArea: row.land_area,
    rooms: row.rooms,
    floor: row.floor,
    totalFloors: row.total_floors,
    yearBuilt: row.year_built,

    price: row.price,
    currency: row.currency,
    availability: row.availability,
    isFurnished: row.is_furnished,

    contactName: row.contact_name,
    contactEmail: row.contact_email,
    contactPhone: row.contact_phone,

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

/* ----------------------- Body -> DB (nur Felder, die mitkommen) ----------------------- */

function mapBodyToDb(body: any) {
  const {
    transactionType,
    usageType,
    saleCategory,
    rentCategory,
    objectCategory,
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

  const category =
    objectCategory ??
    saleCategory ??
    rentCategory ??
    undefined

  if (category !== undefined)
    payload.object_category = normalizeNullable(category)

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

  if (price !== undefined)
    payload.price = normalizeNumeric(price)
  if (currency !== undefined)
    payload.currency = normalizeNullable(currency)
  if (availability !== undefined)
    payload.availability = normalizeDateLike(availability)
  if (isFurnished !== undefined)
    payload.is_furnished = isFurnished

  if (contactName !== undefined)
    payload.contact_name = normalizeNullable(contactName)
  if (contactEmail !== undefined)
    payload.contact_email = normalizeNullable(contactEmail)
  if (contactPhone !== undefined)
    payload.contact_phone = normalizeNullable(contactPhone)

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

    // Erst Datensatz holen, um Status zu prüfen
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

    // 🔥 pending_payment wird ebenfalls zu "entwurf" gemappt und ist damit löschbar
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
