export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabaseServer } from '@/lib/supabase-server'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/* ----------------- Helpers ----------------- */

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

// prod_ → default_price (price_) auflösen – gleiches Prinzip wie in deiner billing-Route
async function resolvePriceId(id: string) {
  if (!id) throw new Error('Price-ID fehlt')
  if (id.startsWith('price_')) return id
  if (id.startsWith('prod_')) {
    const product = await stripe.products.retrieve(id, { expand: ['default_price'] })
    const dp = product.default_price as string | Stripe.Price | null
    const priceId = typeof dp === 'string' ? dp : dp?.id
    if (!priceId) {
      throw new Error(`Product ${id} hat keinen default_price hinterlegt.`)
    }
    return priceId
  }
  throw new Error('Ungültige Stripe-ID: muss mit price_ oder prod_ beginnen')
}

// Mapping: Paket-Code → ENV-Variable
// (VK/VM + BASIS/PREMIUM/TOP + 1/2/3 Monate)
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

/* ----------------- Handler ----------------- */

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
  const { data: listing, error } = await admin
    .from('listings')
    .select('*')
    .eq('id', listingId)
    .eq('user_id', user.id)
    .single()

  if (error || !listing) {
    return NextResponse.json(
      { error: 'Inserat nicht gefunden' },
      { status: 404 }
    )
  }

  // 2) Paket & Laufzeit im Listing speichern
  await admin
    .from('listings')
    .update({
      package_code: packageCode,
      runtime_months: runtimeMonths ?? null,
      status: 'pending_payment',
    })
    .eq('id', listingId)

  // 3) Passende Stripe-Price-ID ermitteln (prod_ → price_, falls nötig)
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

  // 4) Checkout-Session (mode: payment) erstellen
  try {
    const session = await stripe.checkout.sessions.create({
  mode: 'payment',
  line_items: [{ price: priceId, quantity: 1 }],
  customer_email:
    listing.contact_email || user.email || undefined,
  metadata: {
    kind: 'listing',
    listing_id: listing.id,
    package_code: packageCode,
    runtime_months: runtimeMonths ? String(runtimeMonths) : '',
  },
  payment_intent_data: {
    metadata: {
      kind: 'listing',
      listing_id: listing.id,
      package_code: packageCode,
      runtime_months: runtimeMonths ? String(runtimeMonths) : '',
    },
  },
  // ⬇️ HIER neu:
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
