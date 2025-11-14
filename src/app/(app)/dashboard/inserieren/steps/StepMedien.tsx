// src/app/dashboard/inserieren/steps/StepMedien.tsx

'use client'

export type StepMedienProps = {
  // Bilder (mehrere Dateien)
  imageFiles: File[]
  setImageFiles: (files: File[]) => void

  // Energieausweis (eine Datei)
  energyCertificateFile: File | null
  setEnergyCertificateFile: (file: File | null) => void

  // Weitere Dokumente (mehrere Dateien)
  documentFiles: File[]
  setDocumentFiles: (files: File[]) => void

  // Exposé (eine Datei) ODER KI-Generierung
  exposeFile: File | null
  setExposeFile: (file: File | null) => void
  autoGenerateExpose: boolean
  setAutoGenerateExpose: (v: boolean) => void
}

export function StepMedien({
  imageFiles,
  setImageFiles,
  energyCertificateFile,
  setEnergyCertificateFile,
  documentFiles,
  setDocumentFiles,
  exposeFile,
  setExposeFile,
  autoGenerateExpose,
  setAutoGenerateExpose,
}: StepMedienProps) {
  /* ------------------------- Helper für Upload-Handling ------------------------- */

  const handleAddImages = (files: FileList | null) => {
    if (!files || files.length === 0) return
    const asArray = Array.from(files)
    setImageFiles([...imageFiles, ...asArray])
  }

  const handleRemoveImage = (index: number) => {
    const copy = [...imageFiles]
    copy.splice(index, 1)
    setImageFiles(copy)
  }

  const handleEnergyCertificateChange = (files: FileList | null) => {
    if (!files || files.length === 0) return
    setEnergyCertificateFile(files[0])
  }

  const handleRemoveEnergyCertificate = () => {
    setEnergyCertificateFile(null)
  }

  const handleAddDocuments = (files: FileList | null) => {
    if (!files || files.length === 0) return
    const asArray = Array.from(files)
    setDocumentFiles([...documentFiles, ...asArray])
  }

  const handleRemoveDocument = (index: number) => {
    const copy = [...documentFiles]
    copy.splice(index, 1)
    setDocumentFiles(copy)
  }

  const handleExposeChange = (files: FileList | null) => {
    if (!files || files.length === 0) return
    setExposeFile(files[0])
  }

  const handleRemoveExpose = () => {
    setExposeFile(null)
  }

  /* --------------------------------- Render ---------------------------------- */

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-sm font-medium text-slate-900">Medien & Dokumente</h2>
        <p className="text-xs text-slate-500">
          Lade hier Bilder, Energieausweis, weitere Unterlagen und – falls vorhanden – ein fertiges
          Exposé hoch. Intern landen die Dateien später im Supabase-Bucket
          <span className="font-mono"> inserat/…</span> in den Bereichen{' '}
          <span className="font-mono">bilder</span>, <span className="font-mono">dokumente</span>,{' '}
          <span className="font-mono">energieausweis</span> und{' '}
          <span className="font-mono">expose</span>.
        </p>
      </div>

      {/* ----------------------------- Bilder Upload ----------------------------- */}
      <div className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-xs font-medium text-slate-700">
              Bilder der Immobilie (mehrere)
            </h3>
            <p className="text-[11px] text-slate-500">
              Hochformat & Querformat, max. 10–15 Bilder empfohlen. Diese erscheinen später als
              Galerie in den Portalen.
            </p>
          </div>

          <label className="inline-flex cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50">
            Dateien auswählen
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleAddImages(e.target.files)}
            />
          </label>
        </div>

        {/* Liste der ausgewählten Bilder */}
        {imageFiles.length > 0 ? (
          <ul className="mt-2 space-y-1 text-[11px] text-slate-700">
            {imageFiles.map((file, index) => (
              <li
                key={`${file.name}-${index}`}
                className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 bg-white/80 px-3 py-1.5 shadow-sm"
              >
                <div className="truncate">
                  <span className="font-medium">{file.name}</span>
                  <span className="ml-1 text-slate-400">
                    ({Math.round(file.size / 1024)} kB)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="text-[11px] text-slate-500 hover:text-rose-500"
                >
                  Entfernen
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-1 text-[11px] text-slate-400">
            Noch keine Bilder ausgewählt.
          </p>
        )}
      </div>

      {/* --------------------------- Energieausweis --------------------------- */}
      <div className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-xs font-medium text-slate-700">
              Energieausweis (PDF oder Bild)
            </h3>
            <p className="text-[11px] text-slate-500">
              Wird später in <span className="font-mono">inserat/energieausweis</span> abgelegt und
              an die Portale übertragen, sofern unterstützt.
            </p>
          </div>

          <label className="inline-flex cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50">
            Datei auswählen
            <input
              type="file"
              accept="application/pdf,image/*"
              className="hidden"
              onChange={(e) => handleEnergyCertificateChange(e.target.files)}
            />
          </label>
        </div>

        {energyCertificateFile ? (
          <div className="mt-2 flex items-center justify-between gap-2 rounded-xl border border-slate-100 bg-white/80 px-3 py-1.5 text-[11px] text-slate-700 shadow-sm">
            <div className="truncate">
              <span className="font-medium">{energyCertificateFile.name}</span>
              <span className="ml-1 text-slate-400">
                ({Math.round(energyCertificateFile.size / 1024)} kB)
              </span>
            </div>
            <button
              type="button"
              onClick={handleRemoveEnergyCertificate}
              className="text-[11px] text-slate-500 hover:text-rose-500"
            >
              Entfernen
            </button>
          </div>
        ) : (
          <p className="mt-1 text-[11px] text-slate-400">
            Noch kein Energieausweis ausgewählt.
          </p>
        )}
      </div>

      {/* --------------------------- Weitere Dokumente --------------------------- */}
      <div className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-xs font-medium text-slate-700">
              Weitere Dokumente (z. B. Grundbuch, Teilungserklärung)
            </h3>
            <p className="text-[11px] text-slate-500">
              Allgemeine Unterlagen, die später in{' '}
              <span className="font-mono">inserat/dokumente</span> landen.
            </p>
          </div>

          <label className="inline-flex cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50">
            Dateien auswählen
            <input
              type="file"
              multiple
              className="hidden"
              onChange={(e) => handleAddDocuments(e.target.files)}
            />
          </label>
        </div>

        {documentFiles.length > 0 ? (
          <ul className="mt-2 space-y-1 text-[11px] text-slate-700">
            {documentFiles.map((file, index) => (
              <li
                key={`${file.name}-${index}`}
                className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 bg-white/80 px-3 py-1.5 shadow-sm"
              >
                <div className="truncate">
                  <span className="font-medium">{file.name}</span>
                  <span className="ml-1 text-slate-400">
                    ({Math.round(file.size / 1024)} kB)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveDocument(index)}
                  className="text-[11px] text-slate-500 hover:text-rose-500"
                >
                  Entfernen
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-1 text-[11px] text-slate-400">
            Noch keine Dokumente ausgewählt.
          </p>
        )}
      </div>

      {/* ----------------------------- Exposé / KI ----------------------------- */}
      <div className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-xs font-medium text-slate-700">
              Exposé
            </h3>
            <p className="text-[11px] text-slate-500">
              Lade ein vorhandenes Exposé hoch (PDF), oder lasse es später von der
              <strong> Maklernull-KI</strong> aus deinen Angaben generieren.
            </p>
          </div>

          <div className="flex flex-col items-start gap-2 text-[11px] sm:items-end">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-200"
                checked={autoGenerateExpose}
                onChange={(e) => {
                  const checked = e.target.checked
                  setAutoGenerateExpose(checked)
                  if (checked) {
                    // Exposé-Datei zurücksetzen, wenn KI-Option aktiv ist
                    setExposeFile(null)
                  }
                }}
              />
              <span>Exposé von der Maklernull-KI generieren lassen</span>
            </label>

            <label
              className={[
                'inline-flex items-center justify-center rounded-full border px-3 py-1.5 text-[11px] font-medium shadow-sm transition',
                autoGenerateExpose
                  ? 'cursor-not-allowed border-slate-100 bg-slate-100 text-slate-400'
                  : 'cursor-pointer border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50',
              ].join(' ')}
            >
              Exposé-Datei wählen
              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                disabled={autoGenerateExpose}
                onChange={(e) => handleExposeChange(e.target.files)}
              />
            </label>
          </div>
        </div>

        <div
          className={[
            'mt-2 rounded-xl border px-3 py-1.5 text-[11px] shadow-sm',
            autoGenerateExpose
              ? 'border-dashed border-slate-200 bg-slate-100/80 text-slate-400'
              : 'border-slate-100 bg-white/80 text-slate-700',
          ].join(' ')}
        >
          {autoGenerateExpose ? (
            <p>
              Die Exposé-Erstellung übernimmt später die Maklernull-KI. Du musst hier keine Datei
              hochladen.
            </p>
          ) : exposeFile ? (
            <div className="flex items-center justify-between gap-2">
              <div className="truncate">
                <span className="font-medium">{exposeFile.name}</span>
                <span className="ml-1 text-slate-400">
                  ({Math.round(exposeFile.size / 1024)} kB)
                </span>
              </div>
              <button
                type="button"
                onClick={handleRemoveExpose}
                className="text-[11px] text-slate-500 hover:text-rose-500"
              >
                Entfernen
              </button>
            </div>
          ) : (
            <p className="text-slate-400">
              Noch kein Exposé hochgeladen.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
