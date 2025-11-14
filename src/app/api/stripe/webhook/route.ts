// src/app/api/stripe/webhook/route.ts
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/* -------------------------------------------------------------------------- */
/*                    Helper: Zahlung für Inserat (Listing)                   */
/* -------------------------------------------------------------------------- */

async function handleListingPayment(session: Stripe.Checkout.Session) {
  const listingId = session.metadata?.listing_id
  if (!listingId) {
    console.warn('[webhook] Listing payment without listing_id in metadata')
    return
  }

  const paymentIntentId =
    typeof session.payment_intent === 'string'
      ? session.payment_intent
      : session.payment_intent?.id ?? null

  // runtime_months zuerst aus Metadata lesen
  let runtimeMonths: number | null = null

  const metaRuntime = session.metadata?.runtime_months
  if (metaRuntime) {
    const n = Number(metaRuntime)
    if (!Number.isNaN(n) && n > 0) {
      runtimeMonths = n
    }
  }

  // falls nicht in metadata → aus DB holen
  if (runtimeMonths === null) {
    const { data: listing, error } = await admin
      .from('listings')
      .select('runtime_months')
      .eq('id', listingId)
      .maybeSingle()

    if (error) {
      console.error('[webhook] Error getting listing for runtime_months:', error)
    }

    if (listing?.runtime_months) {
      const n = Number(listing.runtime_months)
      if (!Number.isNaN(n) && n > 0) {
        runtimeMonths = n
      }
    }
  }

  // Fallback: 1 Monat
  if (runtimeMonths === null || runtimeMonths <= 0) {
    runtimeMonths = 1
  }

  const now = new Date()
  const activeFrom = now.toISOString()
  const end = new Date(now)
  end.setMonth(end.getMonth() + runtimeMonths)
  const activeUntil = end.toISOString()

  const { error: updateError } = await admin
    .from('listings')
    .update({
      status: 'active', // 👈 Inserat nach Zahlung aktiv
      stripe_payment_intent_id: paymentIntentId,
      active_from: activeFrom,
      active_until: activeUntil,
    })
    .eq('id', listingId)

  if (updateError) {
    console.error('[webhook] Error updating listing after payment:', updateError)
  }

  // 🔜 Später: hier kannst du EstateSync einhängen (Property + Listings anlegen)
}

/* -------------------------------------------------------------------------- */
/*                                   Handler                                  */
/* -------------------------------------------------------------------------- */

export async function POST(req: Request) {
  const raw = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(raw, sig, webhookSecret)
  } catch (err: any) {
    console.error('[webhook] signature error:', err?.message)
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const sess = event.data.object as Stripe.Checkout.Session

        // Nur Einmalzahlungen für Inserate interessieren uns
        if (sess.mode === 'payment' && sess.metadata?.kind === 'listing') {
          await handleListingPayment(sess)
        }

        break
      }

      default:
        // andere Events aktuell ignorieren
        break
    }
  } catch (e) {
    console.error('[webhook] handler error:', e)
    return new NextResponse('Webhook handler error', { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
