// src/app/api/billing/bookings/route.ts
export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { supabaseServer } from '@/lib/supabase-server'
import Stripe from 'stripe'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY!
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY!

const adminClient = createClient(SUPABASE_URL, SERVICE_ROLE)
const stripe = new Stripe(STRIPE_SECRET_KEY, {
  // ggf. an deine Version anpassen
  apiVersion: '2024-06-20' as any,
})

type RawBooking = {
  id: string
  created_at: string
  product_name: string
  description: string | null
  gross_amount: number
  currency: string
  status: 'paid' | 'open' | 'refunded' | 'failed'
  invoice_number: string | null
  invoice_url: string | null
  period_from: string | null
  period_to: string | null
  listing_id: string | null
}

export async function GET() {
  try {
    const supabase = await supabaseServer()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 1) Stripe Customer ID aus profiles holen
    const { data: profile, error: profileError } = await adminClient
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error('Error loading profile', profileError)
      return NextResponse.json(
        { error: 'Profil konnte nicht geladen werden.' },
        { status: 500 }
      )
    }

    const stripeCustomerId = profile?.stripe_customer_id as string | null

    if (!stripeCustomerId) {
      // kein Stripe-Kunde → keine Buchungen
      return NextResponse.json({ bookings: [] })
    }

    // 2) Rechnungen vom Kunden holen
    const invoices = await stripe.invoices.list({
      customer: stripeCustomerId,
      limit: 100,
      expand: ['data.lines'],
    })

    // 3) Mapping: Stripe → RawBooking inkl. listing_id aus metadata
    const rawBookings: RawBooking[] = invoices.data.map((inv): RawBooking => {
      const createdAtIso = new Date(inv.created * 1000).toISOString()
      const line = inv.lines.data[0]

      // Produktname / Beschreibung
      const productName =
        line?.description ||
        inv.description ||
        `Buchung ${inv.number || inv.id}`

      const description =
        inv.description ||
        (line?.metadata?.description as string | undefined) ||
        null

      // Betrag (total in Cent → Euro)
      const grossAmount = ((inv.total ?? 0) / 100) as number
      const currency = (inv.currency?.toUpperCase() || 'EUR') as string

      // Status-Mapping nur über inv.status (nicht inv.paid)
      let status: RawBooking['status'] = 'open'
      switch (inv.status) {
        case 'paid':
          status = 'paid'
          break
        case 'open':
          status = 'open'
          break
        case 'void':
          status = 'refunded'
          break
        case 'uncollectible':
          status = 'failed'
          break
        default:
          status = 'open'
      }

      // Rechnungslinks
      const invoiceNumber = (inv.number as string | null) || null
      const invoiceUrl =
        (inv.hosted_invoice_url as string | null) ||
        (inv.invoice_pdf as string | null) ||
        null

      // Zeitraum (falls Subscriptions / period gesetzt)
      let periodFrom: string | null = null
      let periodTo: string | null = null
      if (line?.period) {
        if (line.period.start) {
          periodFrom = new Date(line.period.start * 1000).toISOString()
        }
        if (line.period.end) {
          periodTo = new Date(line.period.end * 1000).toISOString()
        }
      }

      // Immobilie aus Metadata (Invoice oder Line)
      const listingId =
        (inv.metadata?.listing_id as string | undefined) ||
        (line?.metadata?.listing_id as string | undefined) ||
        null

      return {
        id: inv.id as string, // <-- explizit casten, damit TS nicht rummeckert
        created_at: createdAtIso,
        product_name: productName,
        description,
        gross_amount: grossAmount,
        currency,
        status,
        invoice_number: invoiceNumber,
        invoice_url: invoiceUrl,
        period_from: periodFrom,
        period_to: periodTo,
        listing_id: listingId,
      }
    })

    // 4) Listing-Infos aus Supabase holen (für Immobilientitel)
    const listingIds = Array.from(
      new Set(
        rawBookings
          .map((b) => b.listing_id)
          .filter((id): id is string => !!id)
      )
    )

    let listingMap: Record<string, { title: string }> = {}

    if (listingIds.length > 0) {
      const { data: listings, error: listingError } = await adminClient
        .from('listings')
        .select('id, title')
        .in('id', listingIds)

      if (listingError) {
        console.error('Error loading listings for bookings', listingError)
      } else {
        listingMap = (listings ?? []).reduce(
          (acc: Record<string, { title: string }>, l: any) => {
            acc[l.id] = { title: l.title as string }
            return acc
          },
          {}
        )
      }
    }

    // 5) Finale Booking-Objekte mit listing_title
    const bookings = rawBookings.map((b) => ({
      ...b,
      listing_title: b.listing_id ? listingMap[b.listing_id]?.title ?? null : null,
    }))

    // Neueste oben
    bookings.sort((a, b) =>
      a.created_at < b.created_at ? 1 : -1
    )

    return NextResponse.json({ bookings })
  } catch (e) {
    console.error(e)
    return NextResponse.json(
      { error: 'Buchungen konnten nicht geladen werden.' },
      { status: 500 }
    )
  }
}
