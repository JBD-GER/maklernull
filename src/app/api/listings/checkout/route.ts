// src/app/api/listings/checkout/route.ts
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabaseServer } from '@/lib/supabase-server'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

// Service-Role-Client für DB-Schreibzugriffe
const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/* -------------------------------------------------------------------------- */
/*                                Helper-Funktionen                           */
/* -------------------------------------------------------------------------- */

function getBaseUrl(req: Request) {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL
  if (envUrl) return envUrl

  const host =
    req.headers.get('x-forwarded-host') ??
    req.headers.get('host') ??
    'localhost:3000'

  const proto =
    req.headers.get('x-forwarded-proto') ??
    (host.startsWith('localhost') ? 'http' : 'https')

  return `${proto}://${host}`
}

// prod_ → default_price (price_) auflösen
async function resolvePriceId(id: string) {
  if (!id) throw new Error('Price-ID fehlt')

  if (id.startsWith('price_')) return id

  if (id.startsWith('prod_')) {
    const product = await stripe.products.retrieve(id, {
      expand: ['default_price'],
    })
    const dp = product.default_price as string | Stripe.Price | null
    const priceId = typeof dp === 'string' ? dp : dp?.id
    if (!priceId) {
      throw new Error(`Product ${id} hat keinen default_price hinterlegt.`)
    }
    return priceId
  }

  throw new Error('Ungültige Stripe-ID: muss mit price_ oder prod_ beginnen')
}

// Mapping: Paket-Code → ENV-Variable (price_ oder prod_)
const LISTING_PRODUCT_IDS: Record<string, string | undefined> = {
  // Verkauf
  VK_BASIS_1: process.env.STRIPE_PRICE_VK_BASIS_1,
  VK_BASIS_2: process.env.STRIPE_PRICE_VK_BASIS_2,
  VK_BASIS_3: process.env.STRIPE_PRICE_VK_BASIS_3,

  VK_PREMIUM_1: process.env.STRIPE_PRICE_VK_PREMIUM_1,
  VK_PREMIUM_2: process.env.STRIPE_PRICE_VK_PREMIUM_2,
  VK_PREMIUM_3: process.env.STRIPE_PRICE_VK_PREMIUM_3,

  VK_TOP_1: process.env.STRIPE_PRICE_VK_TOP_1,
  VK_TOP_2: process.env.STRIPE_PRICE_VK_TOP_2,
  VK_TOP_3: process.env.STRIPE_PRICE_VK_TOP_3,

  // Vermietung
  VM_BASIS_1: process.env.STRIPE_PRICE_VM_BASIS_1,
  VM_BASIS_2: process.env.STRIPE_PRICE_VM_BASIS_2,
  VM_BASIS_3: process.env.STRIPE_PRICE_VM_BASIS_3,

  VM_PREMIUM_1: process.env.STRIPE_PRICE_VM_PREMIUM_1,
  VM_PREMIUM_2: process.env.STRIPE_PRICE_VM_PREMIUM_2,
  VM_PREMIUM_3: process.env.STRIPE_PRICE_VM_PREMIUM_3,

  VM_TOP_1: process.env.STRIPE_PRICE_VM_TOP_1,
  VM_TOP_2: process.env.STRIPE_PRICE_VM_TOP_2,
  VM_TOP_3: process.env.STRIPE_PRICE_VM_TOP_3,

  // Optionale Testcodes – nur zum Workflow-Testen
  TEST_1: process.env.STRIPE_PRICE_TEST_1,
  TEST_2: process.env.STRIPE_PRICE_TEST_2,
  TEST_3: process.env.STRIPE_PRICE_TEST_3,
}

async function getListingStripePriceId(packageCode: string): Promise<string> {
  const productOrPriceId = LISTING_PRODUCT_IDS[packageCode]
  if (!productOrPriceId) {
    throw new Error(
      `Für packageCode "${packageCode}" ist keine ENV-Variable gesetzt.`
    )
  }
  return resolvePriceId(productOrPriceId)
}

/* -------- Profil → Stripe-Customer (für Rechnung) -------- */

function toIso2(country?: string | null): string | undefined {
  if (!country) return undefined
  const c = country.trim().toLowerCase()
  const map: Record<string, string> = {
    de: 'DE',
    deu: 'DE',
    deutschland: 'DE',
    germany: 'DE',
    at: 'AT',
    aut: 'AT',
    österreich: 'AT',
    oesterreich: 'AT',
    austria: 'AT',
    ch: 'CH',
    che: 'CH',
    schweiz: 'CH',
    switzerland: 'CH',
  }
  if (map[c]) return map[c]
  if (/^[A-Za-z]{2}$/.test(country)) return country.toUpperCase()
  return undefined
}

type ProfileForStripe = {
  email?: string | null
  first_name?: string | null
  last_name?: string | null
  company_name?: string | null
  street?: string | null
  house_number?: string | null
  postal_code?: string | null
  city?: string | null
  country?: string | null
  vat_number?: string | null
  stripe_customer_id?: string | null
}

async function syncCustomerDataToStripe(customerId: string, p: ProfileForStripe) {
  const iso = toIso2(p.country)
  const line1 =
    [p.street, p.house_number].filter(Boolean).join(' ').trim() || undefined

  const addr: Stripe.AddressParam | undefined =
    iso && (line1 || p.postal_code || p.city)
      ? {
          line1,
          postal_code: p.postal_code || undefined,
          city: p.city || undefined,
          country: iso,
        }
      : undefined

  const contactName =
    [p.first_name, p.last_name].filter(Boolean).join(' ').trim() || undefined

  const displayName =
    p.company_name && p.company_name.trim().length > 1
      ? p.company_name
      : contactName || undefined

  await stripe.customers.update(customerId, {
    name: displayName,
    email: p.email || undefined,
    address: addr,
    shipping:
      addr && contactName ? { name: contactName, address: addr } : undefined,
    invoice_settings:
      p.company_name && contactName
        ? { custom_fields: [{ name: 'Kontakt', value: contactName }] }
        : undefined,
    metadata: {
      contact_name: contactName || '',
      company_name: p.company_name || '',
    },
  })

  // VAT als Tax ID
  if (p.vat_number && p.vat_number.trim()) {
    const vat = p.vat_number.trim()
    try {
      const existing = await stripe.customers.listTaxIds(customerId, {
        limit: 20,
      })
      const same = existing.data.find(
        (t) =>
          t.type === 'eu_vat' && t.value?.toUpperCase() === vat.toUpperCase()
      )
      if (!same) {
        await stripe.customers.createTaxId(customerId, {
          type: 'eu_vat',
          value: vat,
        })
      }
    } catch (e) {
      console.warn('[stripe] createTaxId failed (ignored):', (e as any)?.message)
    }
  }
}

/* -------------------------------------------------------------------------- */
/*                                   Handler                                  */
/* -------------------------------------------------------------------------- */

export async function POST(req: Request) {
  const supabase = await supabaseServer()
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })
  }

  const { listingId, packageCode, runtimeMonths } = await req.json()

  if (!listingId || !packageCode) {
    return NextResponse.json(
      { error: 'listingId oder packageCode fehlt' },
      { status: 400 }
    )
  }

  // 1) Listing holen & Ownership checken
  const { data: listing, error: listingError } = await admin
    .from('listings')
    .select('*')
    .eq('id', listingId)
    .eq('user_id', user.id)
    .single()

  if (listingError || !listing) {
    return NextResponse.json(
      { error: 'Inserat nicht gefunden' },
      { status: 404 }
    )
  }

  // 2) Profil holen → für Rechnung / Customer-Daten
  const { data: profile, error: profileError } = await admin
    .from('profiles')
    .select(
      `
      email,
      first_name,
      last_name,
      company_name,
      street,
      house_number,
      postal_code,
      city,
      country,
      vat_number,
      stripe_customer_id
    `
    )
    .eq('id', user.id)
    .single()

  if (profileError || !profile) {
    return NextResponse.json(
      {
        error:
          'Profil nicht gefunden – bitte Profil zuerst im Bereich "Einstellungen" vervollständigen.',
      },
      { status: 400 }
    )
  }

  // 3) Stripe-Customer sicherstellen
  let customerId: string | null = profile.stripe_customer_id || null

  if (!customerId) {
    const cust = await stripe.customers.create({
      email: profile.email || undefined,
      metadata: { supabase_user_id: user.id },
    })
    customerId = cust.id

    await admin
      .from('profiles')
      .update({ stripe_customer_id: customerId })
      .eq('id', user.id)
  } else {
    // sicherheitshalber User-ID mitschreiben
    try {
      await stripe.customers.update(customerId, {
        metadata: { supabase_user_id: user.id },
      })
    } catch {
      // ignore
    }
  }

  // 4) Profil-Daten (Name, Firma, Adresse, USt) zum Customer schieben
  await syncCustomerDataToStripe(customerId!, profile as ProfileForStripe)

  // 5) Paket & Laufzeit im Listing speichern
  await admin
    .from('listings')
    .update({
      package_code: packageCode,
      runtime_months: runtimeMonths ?? null,
      status: 'pending_payment', // Zahlung ist der nächste Schritt
    })
    .eq('id', listingId)

  // 6) Passende Stripe-Price-ID ermitteln
  let priceId: string
  try {
    priceId = await getListingStripePriceId(packageCode)
  } catch (e: any) {
    console.error('[listings/checkout] getListingStripePriceId error:', e)
    return NextResponse.json(
      { error: e.message || 'Preis-Konfiguration fehlerhaft' },
      { status: 500 }
    )
  }

  const baseUrl = getBaseUrl(req)

  // 7) Checkout-Session (mode: payment) erstellen – EINMALZAHLUNG fürs Inserat
  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer: customerId!,
      line_items: [{ price: priceId, quantity: 1 }],

      // Rechnung automatisch erstellen lassen
      invoice_creation: {
        enabled: true,
        invoice_data: {
          description: `Maklernull Inseratspaket (${packageCode}) für Listing #${listing.id}`,
          metadata: {
            kind: 'listing',
            listing_id: listing.id,
            package_code: packageCode,
            user_id: user.id,
          },
        },
      },

      // Meta für PaymentIntent / Webhook
      metadata: {
        kind: 'listing',
        listing_id: listing.id,
        package_code: packageCode,
        runtime_months: runtimeMonths ? String(runtimeMonths) : '',
        user_id: user.id,
      },
      payment_intent_data: {
        metadata: {
          kind: 'listing',
          listing_id: listing.id,
          package_code: packageCode,
          runtime_months: runtimeMonths ? String(runtimeMonths) : '',
          user_id: user.id,
        },
      },

      billing_address_collection: 'auto',
      customer_update: {
        address: 'auto',
        name: 'auto',
      },

      success_url: `${baseUrl}/dashboard/inserieren/erfolg?listing=${listing.id}`,
      cancel_url: `${baseUrl}/dashboard/inserieren?payment=cancel&listing=${listing.id}`,
    })

    return NextResponse.json({ url: session.url }, { status: 200 })
  } catch (e: any) {
    console.error('[listings/checkout] Stripe error:', e)
    return NextResponse.json(
      {
        error: 'Fehler beim Erstellen der Stripe-Session',
        details: e.message,
      },
      { status: 500 }
    )
  }
}
