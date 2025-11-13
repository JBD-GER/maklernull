// src/app/api/estatesync/account/route.ts
import { NextResponse } from 'next/server'
import { esGetAccount } from '@/lib/estatesync'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const account = await esGetAccount()
    return NextResponse.json({ ok: true, account })
  } catch (err: any) {
    console.error('Error fetching EstateSync account:', err)
    return NextResponse.json(
      { ok: false, error: err.message || 'Unknown error' },
      { status: 500 }
    )
  }
}
