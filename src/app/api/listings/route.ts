// src/app/api/listings/route.ts
import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

type TransactionType = 'sale' | 'rent'
type UsageType = 'residential' | 'commercial'

export async function POST(req: Request) {
  const supabase = await supabaseServer()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })
  }

  const body = await req.json()

  const {
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
  } = body

  const objectCategory = (transactionType === 'sale' ? saleCategory : rentCategory) || null

  const { data, error } = await supabase
    .from('listings')
    .insert({
      user_id: user.id,
      status: 'pending_payment', // 💡 Bezahlen ist der nächste Schritt
      transaction_type: transactionType as TransactionType,
      usage_type: usageType as UsageType,
      object_category: objectCategory,
      title,
      description,
      street,
      house_number: houseNumber,
      postal_code: postalCode,
      city,
      country,
      living_area: livingArea ? Number(livingArea) : null,
      land_area: landArea ? Number(landArea) : null,
      rooms: rooms ? Number(rooms) : null,
      floor,
      total_floors: totalFloors,
      year_built: yearBuilt ? Number(yearBuilt) : null,
      price: price ? Number(price) : null,
      currency: currency || 'EUR',
      availability: availability || null,
      is_furnished: !!isFurnished,
      contact_name: contactName,
      contact_email: contactEmail,
      contact_phone: contactPhone,
      raw: body,
    })
    .select()
    .single()

  if (error) {
    console.error('Error inserting listing', error)
    return NextResponse.json(
      { error: 'Fehler beim Speichern des Inserats', details: error.message },
      { status: 500 },
    )
  }

  return NextResponse.json({ listing: data }, { status: 201 })
}
