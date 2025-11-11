'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DeleteAccountButton() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleDelete = async () => {
    setError(null)

    const confirmed = window.confirm(
      'Sind Sie sicher, dass Sie Ihr Konto dauerhaft löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.'
    )
    if (!confirmed) return

    setLoading(true)
    try {
      const res = await fetch('/api/account/delete', {
        method: 'POST',
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok || !data?.success) {
        throw new Error(data?.error || 'Löschen fehlgeschlagen.')
      }

      router.push('/')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Fehler beim Löschen des Kontos.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-4 rounded-2xl border border-red-100 bg-red-50/90 p-4">
      <h2 className="text-sm font-semibold text-red-800 mb-1">
        Konto dauerhaft löschen
      </h2>
      <p className="text-xs text-red-700 mb-3">
        Diese Aktion entfernt Ihr Benutzerkonto dauerhaft. Verbundene Daten
        können unwiderruflich verloren gehen.
      </p>

      {error && (
        <p className="mb-2 text-xs text-red-600">
          {error}
        </p>
      )}

      <button
        onClick={handleDelete}
        disabled={loading}
        className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-xs font-semibold
                   border border-red-300 bg-red-600 text-white
                   hover:bg-red-700 hover:border-red-400
                   transition-all disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? 'Wird gelöscht…' : 'Konto löschen'}
      </button>
    </div>
  )
}
