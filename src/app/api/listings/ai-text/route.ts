// src/app/api/listings/ai-text/route.ts
export const runtime = 'nodejs'

import { NextResponse } from 'next/server'

const OPENAI_API_KEY = process.env.OPENAI_API_KEY

export async function POST(req: Request) {
  if (!OPENAI_API_KEY) {
    return NextResponse.json(
      { error: 'OPENAI_API_KEY ist nicht gesetzt.' },
      { status: 500 }
    )
  }

  try {
    const body = await req.json()

    // Wir bauen aus den Daten einen kompakten Prompt
    const {
      transactionType,
      usageType,
      offerType,
      saleCategory,
      rentCategory,
      objectSubtype,
      title,
      description,

      street,
      houseNumber,
      postalCode,
      city,
      country,
      arrivalNote,
      hideStreet,

      livingArea,
      landArea,
      rooms,
      floor,
      totalFloors,
      yearBuilt,
      condition,
      isCurrentlyRented,

      hasBalcony,
      hasTerrace,
      hasGarden,
      hasBuiltinKitchen,
      hasElevator,
      hasCellar,
      isBarrierFree,
      hasGuestWC,
      hasParkingSpace,
      parkingSpaces,
      parkingSpacePrice,
      energyCertificateAvailable,
      energyCertificateType,
      energyEfficiencyClass,
      energyConsumption,
      primaryEnergySource,
      heatingType,
      firingType,
      energyCertificateIssueDate,
      energyCertificateValidUntil,

      price,
      currency,
      serviceCharge,
      heatingCosts,
      totalAdditionalCosts,
      hoaFee,
      garagePrice,
      deposit,
      priceOnRequest,
      availability,
      takeoverType,
      takeoverDate,
      isFurnished,

      imageFilesCount,
      documentFilesCount,
    } = body

    const category = transactionType === 'sale' ? saleCategory : rentCategory

    const systemPrompt =
      'Du bist ein professioneller deutscher Immobilientexter. ' +
      'Du schreibst hochwertige, aber gut lesbare Exposé-Texte im Sie-Stil für Immobilienportale. ' +
      'Nutze alle übergebenen Daten, übertreibe nicht, erfinde nichts und vermeide Floskeln wie „Top-Lage“ ohne Begründung. ' +
      'Die Texte sollen realistisch, verkaufsstark und juristisch unkritisch sein.'

    const userPrompt = `
Erzeuge auf Basis der folgenden Daten einer Immobilie vier Textbausteine auf Deutsch:

1) "descriptionText" – Objektbeschreibung (2–4 Absätze, kurze Sätze, Fokus auf Nutzung & Zielgruppe)
2) "locationText" – Lagebeschreibung (Umgebung, Infrastruktur, Erreichbarkeit)
3) "equipmentText" – Ausstattung (Innenausstattung, Modernisierungen, energetische Aspekte)
4) "highlightsText" – Highlights & Sonstiges (Besonderheiten, ideal für wen, ggf. rechtliche Hinweise wie vermietet/leerstehend)

Schreibe im Sie-Stil und nutze ein neutrales, professionelles Wording. Keine Emojis.
Antworte ausschließlich als JSON-Objekt mit genau diesen Keys:
{
  "descriptionText": "...",
  "locationText": "...",
  "equipmentText": "...",
  "highlightsText": "..."
}

Daten der Immobilie (teilweise können Felder leer sein):

- Angebot: ${transactionType || ''} (sale/rent), Nutzung: ${usageType || ''}, Angebotsart: ${offerType || ''}
- Kategorie: ${category || ''}, Objekttyp: ${objectSubtype || ''}
- Titel: ${title || ''}
- Kurzbeschreibung Nutzer: ${description || ''}

- Adresse: ${street || ''} ${houseNumber || ''}, ${postalCode || ''} ${city || ''}, ${country || ''}
  (Straße ausblenden: ${hideStreet ? 'ja' : 'nein'})
  Hinweis Anfahrt: ${arrivalNote || ''}

- Wohn-/Nutzfläche: ${livingArea || ''} m²
- Grundstück: ${landArea || ''} m²
- Zimmer: ${rooms || ''}
- Etage / Etagen gesamt: ${floor || ''} / ${totalFloors || ''}
- Baujahr: ${yearBuilt || ''}, Zustand: ${condition || ''}
- Aktuell vermietet: ${isCurrentlyRented ? 'ja' : 'nein'}

- Ausstattung:
  Balkon: ${hasBalcony ? 'ja' : 'nein'},
  Terrasse: ${hasTerrace ? 'ja' : 'nein'},
  Garten: ${hasGarden ? 'ja' : 'nein'},
  Einbauküche: ${hasBuiltinKitchen ? 'ja' : 'nein'},
  Aufzug: ${hasElevator ? 'ja' : 'nein'},
  Keller: ${hasCellar ? 'ja' : 'nein'},
  Barrierefrei: ${isBarrierFree ? 'ja' : 'nein'},
  Gäste-WC: ${hasGuestWC ? 'ja' : 'nein'},
  Stellplatz vorhanden: ${hasParkingSpace ? 'ja' : 'nein'},
  Stellplätze: ${parkingSpaces || ''},
  Preis je Stellplatz: ${parkingSpacePrice || ''}

- Energie:
  Energieausweis: ${energyCertificateAvailable || ''},
  Typ: ${energyCertificateType || ''},
  Effizienzklasse: ${energyEfficiencyClass || ''},
  Verbrauch/Bedarf: ${energyConsumption || ''} kWh/(m²·a),
  Hauptenergieträger: ${primaryEnergySource || ''},
  Heizungsart: ${heatingType || ''},
  Befeuerungsart: ${firingType || ''},
  Ausgestellt am: ${energyCertificateIssueDate || ''},
  Gültig bis: ${energyCertificateValidUntil || ''}

- Preis:
  Preis: ${priceOnRequest ? 'Preis auf Anfrage' : `${price || ''} ${currency || ''}`},
  Nebenkosten: ${serviceCharge || ''},
  Heizkosten: ${heatingCosts || ''},
  Gesamt-NK: ${totalAdditionalCosts || ''},
  Hausgeld: ${hoaFee || ''},
  Garage/Stellplatzpreis: ${garagePrice || ''},
  Kaution: ${deposit || ''}

- Verfügbarkeit:
  Verfügbar ab: ${availability || ''},
  Übernahme: ${takeoverType || ''},
  Übernahmedatum (falls gesetzt): ${takeoverDate || ''},
  Möbliert: ${isFurnished ? 'ja' : 'nein'}

- Medien: ${imageFilesCount || 0} Bilder, ${documentFilesCount || 0} Dokumente
    `.trim()

    const openAiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
      }),
    })

    if (!openAiRes.ok) {
      const err = await openAiRes.text()
      console.error('OpenAI-Error:', err)
      return NextResponse.json(
        { error: 'Fehler beim Aufruf des KI-Dienstes' },
        { status: 500 }
      )
    }

    const completion = await openAiRes.json()
    const content = completion?.choices?.[0]?.message?.content

    let parsed: any = {}
    try {
      parsed = content ? JSON.parse(content) : {}
    } catch (e) {
      console.error('JSON-Parse-Fehler bei KI-Antwort:', e)
    }

    return NextResponse.json({
      descriptionText: parsed.descriptionText || '',
      locationText: parsed.locationText || '',
      equipmentText: parsed.equipmentText || '',
      highlightsText: parsed.highlightsText || '',
    })
  } catch (error: any) {
    console.error(error)
    return NextResponse.json(
      { error: error?.message || 'Unbekannter Fehler' },
      { status: 500 }
    )
  }
}
