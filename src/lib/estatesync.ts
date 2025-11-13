// src/lib/estatesync.ts

const ESTATESYNC_API_KEY = process.env.ESTATESYNC_API_KEY
const ESTATESYNC_BASE_URL =
  process.env.ESTATESYNC_BASE_URL || 'https://api.estatesync.com'

if (!ESTATESYNC_API_KEY) {
  throw new Error('ESTATESYNC_API_KEY is not set in environment variables')
}

type EstateSyncPropertyType =
  | 'apartmentBuy'
  | 'apartmentRent'
  | 'houseBuy'
  | 'houseRent'
  // du kannst hier später weitere Typen ergänzen...

export type EstateSyncAddress = {
  street: string
  streetNumber: string
  postalCode: string
  city: string
  region?: string
  country?: string
  publish?: boolean
}

export type EstateSyncAttachment = {
  type: string // z.B. "image/jpeg"
  url: string
  watermarkUrl?: string
  watermarkCaption?: string
  title?: string
  isBlueprint?: boolean
}

export type EstateSyncCreatePropertyPayload = {
  type: EstateSyncPropertyType
  fields: {
    title: string
    description?: string
    address: EstateSyncAddress
    livingArea?: number
    numberOfRooms?: number
    purchasePrice?: number
    baseRent?: number
    // hier können wir nach und nach alles ergänzen,
    // was du für deine Inserate brauchst
  } & Record<string, any>
  attachments?: EstateSyncAttachment[]
  links?: { title: string; url: string }[]
  contactId?: string
  externalId?: string
}

export type EstateSyncPropertyResponse = {
  id: string
  type: EstateSyncPropertyType
  fields: any
  attachments?: EstateSyncAttachment[]
  links?: { title: string; url: string }[]
  contactId?: string
  externalId?: string
  createdAt: string
  updatedAt: string
}

export type EstateSyncTarget = {
  id: string
  type: string // z.B. "immobilienscout-24", "immowelt", "kleinanzeigen"
  emailId?: string
  createdAt: string
  updatedAt: string
  authorizationStatus?: string
}

export type EstateSyncListing = {
  id: string
  propertyId: string
  targetId: string
  createdAt: string
  // published-Flag kommt nur über Webhook, das bauen wir später
}

async function estatesyncRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${ESTATESYNC_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ESTATESYNC_API_KEY}`,
      ...(options.headers || {}),
    },
    cache: 'no-store',
  })

  if (!res.ok) {
    const text = await res.text()
    console.error('EstateSync error:', res.status, text)
    throw new Error(`EstateSync error ${res.status}: ${text}`)
  }

  return res.json() as Promise<T>
}

/* ------------------------------- Public API ------------------------------ */

export async function esGetAccount() {
  return estatesyncRequest('/account')
}

export async function esListTargets(): Promise<{ data: EstateSyncTarget[] }> {
  return estatesyncRequest('/targets')
}

export async function esCreateProperty(
  payload: EstateSyncCreatePropertyPayload
): Promise<EstateSyncPropertyResponse> {
  return estatesyncRequest('/properties', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function esCreateListing(params: {
  propertyId: string
  targetId: string
}): Promise<EstateSyncListing> {
  return estatesyncRequest('/listings', {
    method: 'POST',
    body: JSON.stringify({
      propertyId: params.propertyId,
      targetId: params.targetId,
    }),
  })
}

export async function esListListings(): Promise<{ data: EstateSyncListing[] }> {
  return estatesyncRequest('/listings')
}
