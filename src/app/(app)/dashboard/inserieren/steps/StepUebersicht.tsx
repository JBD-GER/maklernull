// src/app/dashboard/inserieren/steps/StepUebersicht.tsx
'use client'

import { StepBasis, StepBasisProps } from './StepBasis'
import { StepAdresse, StepAdresseProps } from './StepAdresse'
import { StepDetails, StepDetailsProps } from './StepDetails'
import { StepAusstattungEnergie, StepAusstattungEnergieProps } from './StepAusstattungEnergie'
import { StepMedien, StepMedienProps } from './StepMedien'
import { StepPreisKontakt, StepPreisKontaktProps } from './StepPreisKontakt'

type OverviewProps = StepBasisProps &
  StepAdresseProps &
  StepDetailsProps &
  StepAusstattungEnergieProps &
  StepMedienProps &
  StepPreisKontaktProps

type SectionProps = {
  title: string
  description?: string
  children: React.ReactNode
}

function OverviewSection({ title, description, children }: SectionProps) {
  return (
    <section className="space-y-3 rounded-3xl border border-white/60 bg-white/80 p-4 shadow-sm backdrop-blur-xl sm:p-5">
      <div>
        <h3 className="text-sm font-medium text-slate-900">{title}</h3>
        {description && (
          <p className="mt-1 text-[11px] text-slate-500">{description}</p>
        )}
      </div>
      <div className="border-t border-slate-100 pt-3">{children}</div>
    </section>
  )
}

export function StepUebersicht(props: OverviewProps) {
  return (
    <div className="space-y-6">
      {/* Headline für den Gesamt-Step */}
      <div>
        <h2 className="text-sm font-medium text-slate-900">
          Gesamtübersicht & Feinschliff
        </h2>
        <p className="text-xs text-slate-500">
          Hier siehst du alle Angaben deines Inserats auf einen Blick.
          Du kannst jede Sektion direkt bearbeiten, ohne zwischen den
          Schritten wechseln zu müssen.
        </p>
      </div>

      {/* Basisangaben */}
      <OverviewSection
        title="Basisangaben & Objektart"
        description="Art des Angebots, Nutzung, Objektart und dein Exposé-Titel."
      >
        <StepBasis {...props} />
      </OverviewSection>

      {/* Adresse */}
      <OverviewSection
        title="Objektadresse"
        description="Adresse für die Portale. Rechnungsdaten kommen weiterhin aus deinem Profil."
      >
        <StepAdresse {...props} />
      </OverviewSection>

      {/* Details */}
      <OverviewSection
        title="Eckdaten der Immobilie"
        description="Flächen, Zimmer, Baujahr, Zustand – je nach Objektart angepasst."
      >
        <StepDetails {...props} />
      </OverviewSection>

      {/* Ausstattung & Energie */}
      <OverviewSection
        title="Ausstattung & Energie"
        description="Ausstattungsmerkmale, Stellplätze und Energieausweisdaten."
      >
        <StepAusstattungEnergie {...props} />
      </OverviewSection>

      {/* Medien */}
      <OverviewSection
        title="Medien & Dokumente"
        description="Bilder, Grundrisse, Dokumente und Energieausweis-Unterlagen."
      >
        <StepMedien {...props} />
      </OverviewSection>

      {/* Preis & Kontakt */}
      <OverviewSection
        title="Preis & Kontakt"
        description="Preis-/Mietangaben, Verfügbarkeit und Ansprechpartner*in."
      >
        <StepPreisKontakt {...props} />
      </OverviewSection>
    </div>
  )
}
