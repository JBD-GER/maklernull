// app/api/listings/route.ts
export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

/* ----------------------- Status-Mapping DB <-> UI ----------------------- */

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
      // alle anderen (pending_sync, archived, deleted, …) unverändert zurückgeben
      return status
  }
}

function mapUiStatusToDb(status: string | null): DbStatus | null {
  if (!status) return null
  const s = status.toLowerCase()

  // Falls Frontend direkt DB-Codes schicken würde:
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

  // Mapping Deutsch -> Englisch
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

/* ----------------------- Mapper DB -> API (camelCase) ----------------------- */

function mapDbRowToApi(row: any) {
  if (!row) return null
  return {
    id: row.id,
    // Status: in der API geben wir den "UI-Status" zurück (z.B. "entwurf")
    status: mapDbStatusToUi(row.status),
    created_at: row.created_at,
    updated_at: row.updated_at,

    transactionType: row.transaction_type,
    usageType: row.usage_type,

    // wir haben nur eine object_category in der DB
    objectCategory: row.object_category,
    // optional zur Bequemlichkeit, falls du im Frontend getrennt arbeitest
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

/* ----------------------- Mapper Body -> DB ----------------------- */

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

  // Kategorie: egal ob aus saleCategory, rentCategory oder direkt objectCategory
  const category =
    objectCategory ??
    saleCategory ??
    rentCategory ??
    null

  const payload: any = {
    transaction_type: normalizeNullable(transactionType),
    usage_type: normalizeNullable(usageType),
    object_category: normalizeNullable(category),
    title: normalizeNullable(title),
    description: normalizeNullable(description),
    street: normalizeNullable(street),
    house_number: normalizeNullable(houseNumber),
    postal_code: normalizeNullable(postalCode),
    city: normalizeNullable(city),
    country: normalizeNullable(country ?? 'Deutschland'),

    living_area: normalizeNumeric(livingArea),
    land_area: normalizeNumeric(landArea),
    rooms: normalizeNumeric(rooms),
    floor: normalizeNullable(floor),
    total_floors: normalizeNullable(totalFloors),
    year_built: normalizeNumeric(yearBuilt),

    price: normalizeNumeric(price),
    currency: normalizeNullable(currency ?? 'EUR'),
    availability: normalizeDateLike(availability),
    is_furnished: isFurnished ?? false,

    contact_name: normalizeNullable(contactName),
    contact_email: normalizeNullable(contactEmail),
    contact_phone: normalizeNullable(contactPhone),

    package_code: normalizeNullable(packageCode),
    runtime_months: normalizeNumeric(runtimeMonths),
    active_from: normalizeDateLike(activeFrom),
    active_until: normalizeDateLike(activeUntil),
  }

  // UI-Status (de) -> DB-Status (en)
  const dbStatus = mapUiStatusToDb(status ?? null)
  if (dbStatus) {
    payload.status = dbStatus
  }

  return payload
}

/* ----------------------- GET /api/listings ----------------------- */
/**
 * → Alle Inserate des aktuellen Users
 */
export async function GET(_req: NextRequest) {
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
      .select(
        [
          'id',
          'status',
          'created_at',
          'updated_at',
          'transaction_type',
          'usage_type',
          'object_category',
          'title',
          'description',
          'street',
          'house_number',
          'postal_code',
          'city',
          'country',
          'living_area',
          'land_area',
          'rooms',
          'floor',
          'total_floors',
          'year_built',
          'price',
          'currency',
          'availability',
          'is_furnished',
          'contact_name',
          'contact_email',
          'contact_phone',
          'estatesync_property_id',
          'estatesync_listing_id',
          'stripe_payment_intent_id',
          'raw',
          'package_code',
          'runtime_months',
          'active_from',
          'active_until',
        ].join(',')
      )
      .eq('user_id', user.id) // 🔥 wichtig: user_id statt owner_id
      .order('created_at', { ascending: false })

    if (error) {
      console.error('[GET /api/listings] DB-Error:', error)
      return NextResponse.json(
        { error: 'Fehler beim Laden der Inserate' },
        { status: 500 }
      )
    }

    const listings = (data || []).map(mapDbRowToApi)
    return NextResponse.json({ listings })
  } catch (err) {
    console.error('[GET /api/listings] Error:', err)
    return NextResponse.json(
      { error: 'Unerwarteter Fehler beim Laden der Inserate' },
      { status: 500 }
    )
  }
}

/* ----------------------- POST /api/listings ----------------------- */
/**
 * → Neues Inserat anlegen
 *   Status in der DB standardmäßig: "draft"
 */
export async function POST(req: NextRequest) {
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

    if (!body.title || typeof body.title !== 'string') {
      return NextResponse.json(
        { error: 'Titel ist erforderlich' },
        { status: 400 }
      )
    }

    if (!body.transactionType || !['sale', 'rent'].includes(body.transactionType)) {
      return NextResponse.json(
        { error: 'Ungültiger oder fehlender transactionType (sale|rent)' },
        { status: 400 }
      )
    }

    if (
      !body.usageType ||
      !['residential', 'commercial'].includes(body.usageType)
    ) {
      return NextResponse.json(
        { error: 'Ungültiger oder fehlender usageType (residential|commercial)' },
        { status: 400 }
      )
    }

    const insertPayload = mapBodyToDb(body)
    insertPayload.user_id = user.id

    // Default-Status in der DB: draft
    if (!insertPayload.status) {
      insertPayload.status = 'draft'
    }

    const { data, error } = await supabase
      .from('listings')
      .insert(insertPayload)
      .select('*')
      .single()

    if (error) {
      console.error('[POST /api/listings] DB-Error:', error)
      return NextResponse.json(
        { error: 'Fehler beim Speichern des Inserats' },
        { status: 500 }
      )
    }

    const listing = mapDbRowToApi(data)
    return NextResponse.json({ listing }, { status: 201 })
  } catch (err) {
    console.error('[POST /api/listings] Error:', err)
    return NextResponse.json(
      { error: 'Unerwarteter Fehler beim Speichern des Inserats' },
      { status: 500 }
    )
  }
}
