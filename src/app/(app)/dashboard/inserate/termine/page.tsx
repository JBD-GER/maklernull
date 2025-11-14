// src/app/dashboard/termine/page.tsx
import { redirect } from 'next/navigation'
import { supabaseServer } from '@/lib/supabase-server'
import AppointmentCalendar from './AppointmentCalendar'

export default async function TerminePage() {
  const supabase = await supabaseServer()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">
          Terminkalender
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl">
          Plane Besichtigungen, Telefonate und Vertrags­termine direkt zu deinen aktiven
          Immobilien. Klicke auf ein Datum, um einen neuen Termin anzulegen, oder wähle
          einen bestehenden Termin zur Bearbeitung aus.
        </p>
      </div>

      {/* 👉 Reiner Frontend-Kalender, Backend/API kommt später */}
      <AppointmentCalendar />
    </section>
  )
}
