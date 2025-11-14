// src/app/dashboard/inserieren/steps/types.ts

// Grundtypen für das Inserat
export type TransactionType = 'sale' | 'rent'
export type UsageType = 'residential' | 'commercial'
export type OfferType = 'private' | 'commercial'

export type EnergyCertificateAvailable = 'yes' | 'no' | 'not_required'
export type EnergyCertificateType = 'consumption' | 'demand' | ''

// Objektkategorien Verkauf
export const SALE_CATEGORIES: string[] = [
  'Haus',
  'Wohnung',
  'Grundstück',
  'WG-Zimmer',
  'Büro & Praxis',
  'Einzelhandel',
  'Gastronomie / Beherbergung',
  'Gewerbliche Freizeitimmobilie',
  'Land- / Forstwirtschaftliches Objekt',
  'Produktions- / Lager- / Gewerbehalle',
  'Zinshaus oder Renditeobjekt',
  'Garagen, Stellplätze',
]

// Objektkategorien Vermietung
export const RENT_CATEGORIES: string[] = [
  'Haus',
  'Wohnung',
  'Grundstück',
  'WG-Zimmer',
  'Büro & Praxis',
  'Einzelhandel',
  'Gastronomie / Beherbergung',
  'Gewerbliche Freizeitimmobilie',
  'Land- / Forstwirtschaftliches Objekt',
  'Produktions- / Lager- / Gewerbehalle',
  'Zinshaus oder Renditeobjekt',
  'Garagen, Stellplätze',
]

// Abhängige Objekttypen je Objektart
export const SUBTYPE_OPTIONS: Record<string, string[]> = {
  Haus: [
    'Einfamilienhaus (freistehend)',
    'Doppelhaushälfte',
    'Reihenhaus',
    'Reihenendhaus',
    'Mehrfamilienhaus',
    'Bungalow',
    'Villa',
    'Resthof / Bauernhaus',
    'Sonstiges Haus',
  ],
  Wohnung: [
    'Etagenwohnung',
    'Erdgeschosswohnung',
    'Dachgeschosswohnung',
    'Maisonette',
    'Souterrain',
    'Loft / Studio',
    'Penthouse',
    'Apartment',
    'Sonstige Wohnung',
  ],
  Grundstück: [
    'Wohngrundstück',
    'Gewerbegrundstück',
    'Mischgebiet',
    'Bauerwartungsland',
    'Land- / Forstwirtschaft',
    'Sonstiges Grundstück',
  ],
  'WG-Zimmer': ['WG-Zimmer'],
  'Büro & Praxis': [
    'Bürofläche',
    'Bürohaus',
    'Praxisfläche',
    'Büroetage',
  'Sonstige Büro-/Praxisfläche',
  ],
  Einzelhandel: [
    'Ladenlokal',
    'Einkaufszentrum',
    'Verkaufsfläche',
    'Sonstige Einzelhandelsfläche',
  ],
  'Gastronomie / Beherbergung': [
    'Restaurant',
    'Café / Bistro',
    'Hotel',
    'Pension',
    'Sonstige Gastro-/Beherbergung',
  ],
  'Gewerbliche Freizeitimmobilie': [
    'Freizeitanlage',
    'Sportanlage',
    'Sonstige Freizeitimmobilie',
  ],
  'Land- / Forstwirtschaftliches Objekt': [
    'Ackerbau',
    'Forstwirtschaft',
    'Weide / Wiese',
    'Sonstiges land-/forstw. Objekt',
  ],
  'Produktions- / Lager- / Gewerbehalle': [
    'Lagerhalle',
    'Produktion',
    'Logistikfläche',
    'Sonstige Halle / Lager',
  ],
  'Zinshaus oder Renditeobjekt': [
    'Wohn- und Geschäftshaus',
    'Mehrfamilienhaus (Rendite)',
    'Gewerbeobjekt (Rendite)',
    'Sonstiges Renditeobjekt',
  ],
  'Garagen, Stellplätze': [
    'Tiefgaragenstellplatz',
    'Außenstellplatz',
    'Garage',
    'Carport',
    'Sonstiger Stellplatz',
  ],
}
