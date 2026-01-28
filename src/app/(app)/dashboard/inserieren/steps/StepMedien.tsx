'use client'

import { useEffect, useState } from 'react'

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
  /* ------------------------- Lokaler State für Vorschaubild ------------------------- */

  const [coverIndex, setCoverIndex] = useState<number | null>(null)
  const [imagePreviews, setImagePreviews] = useState<string[]>([])

  useEffect(() => {
    const urls = imageFiles.map((file) => URL.createObjectURL(file))
    setImagePreviews(urls)

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [imageFiles])

  useEffect(() => {
    if (imageFiles.length === 0) {
      setCoverIndex(null)
      return
    }
    if (coverIndex === null || coverIndex >= imageFiles.length) {
      setCoverIndex(0)
    }
  }, [imageFiles, coverIndex])

  const currentCoverPreview =
    coverIndex !== null && imagePreviews[coverIndex]
      ? imagePreviews[coverIndex]
      : null

  /* ------------------------- Helper für Upload-Handling ------------------------- */

  const handleAddImages = (files: FileList | null) => {
    if (!files || files.length === 0) return
    const asArray = Array.from(files)
    const newFiles = [...imageFiles, ...asArray]
    setImageFiles(newFiles)

    if (coverIndex === null && newFiles.length > 0) {
      setCoverIndex(0)
    }
  }

  const handleRemoveImage = (index: number) => {
    const copy = [...imageFiles]
    copy.splice(index, 1)
    setImageFiles(copy)

    if (coverIndex === null) return

    if (index === coverIndex) {
      if (copy.length === 0) {
        setCoverIndex(null)
      } else {
        setCoverIndex(0)
      }
    } else if (index < coverIndex) {
      setCoverIndex(coverIndex - 1)
    }
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
        <h2 className="text-sm font-medium text-slate-900">
          Medien & Dokumente
        </h2>
        <p className="text-xs text-slate-500">
          Lade hier Bilder, Grundrisse, Energieausweis, weitere Unterlagen
          und – falls vorhanden – ein fertiges Exposé hoch. Später landen
          die Dateien im Supabase-Bucket{' '}
          <span className="font-mono">inserat/…</span> in den Bereichen{' '}
          <span className="font-mono">vorschaubild</span>,{' '}
          <span className="font-mono">bilder</span>,{' '}
          <span className="font-mono">grundrisse</span>,{' '}
          <span className="font-mono">dokumente</span> und{' '}
          <span className="font-mono">expose</span>.
        </p>
      </div>

      {/* ----------------------------- Vorschaubild ----------------------------- */}
      <div className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-xs font-medium text-slate-700">
              Vorschaubild (Titelbild)
            </h3>
            <p className="text-[11px] text-slate-500">
              Dieses Bild wird als erstes angezeigt und als Titelbild in der
              Galerie genutzt. Wenn du kein Bild auswählst, verwenden wir
              automatisch das erste hochgeladene Bild.
            </p>
          </div>

          <div className="flex flex-col items-start gap-2 text-[11px] sm:items-end">
            <label className="inline-flex cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white px-3 py-1.5 font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50">
              Bild hochladen
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleAddImages(e.target.files)}
              />
            </label>
            <p className="text-[10px] text-slate-400">
              Du kannst später unten weitere Bilder ergänzen.
            </p>
          </div>
        </div>

        {/* Preview + kleine Galerie rechts */}
        <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-start">
          {/* Haupt-Preview – bewusst klein gehalten */}
          <div className="flex flex-1 justify-center md:justify-start">
            <div className="relative w-full max-w-sm overflow-hidden rounded-xl border border-slate-100 bg-slate-100/80 shadow-sm aspect-[4/3]">
              {currentCoverPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={currentCoverPreview}
                  alt="Vorschaubild"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center px-4 text-center text-[11px] text-slate-400">
                  Noch kein Vorschaubild gewählt.
                  <br />
                  Lade oben ein Bild hoch oder wähle eines aus der Galerie.
                </div>
              )}
            </div>
          </div>

          {/* Galerie rechts – quadratische Thumbnails */}
          {imageFiles.length > 0 && (
            <div className="w-full max-w-[150px] space-y-2 md:w-40">
              <p className="text-[11px] font-medium text-slate-600">
                Aus Galerie wählen
              </p>
              <div className="grid max-h-56 grid-cols-3 gap-2 overflow-y-auto md:grid-cols-2">
                {imagePreviews.map((url, idx) => (
                  <button
                    key={`${url}-${idx}`}
                    type="button"
                    onClick={() => setCoverIndex(idx)}
                    className={[
                      'relative overflow-hidden rounded-lg border transition',
                      coverIndex === idx
                        ? 'border-slate-900 ring-2 ring-slate-900/40'
                        : 'border-slate-200 hover:border-slate-400',
                    ].join(' ')}
                  >
                    <div className="aspect-square">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={url}
                        alt={imageFiles[idx]?.name || 'Vorschau'}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    {coverIndex === idx && (
                      <span className="absolute bottom-0 left-0 right-0 bg-slate-900/80 px-1 py-0.5 text-[9px] font-medium text-white">
                        Vorschaubild
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ----------------------------- Bilder (Galerie) ----------------------------- */}
      <div className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-xs font-medium text-slate-700">
              Bilder der Immobilie (Galerie)
            </h3>
            <p className="text-[11px] text-slate-500">
              Hochformat & Querformat, max. 10–15 Bilder empfohlen. Diese
              erscheinen später als Galerie in den Portalen.
            </p>
          </div>

        <label className="inline-flex cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50">
          Weitere Bilder
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleAddImages(e.target.files)}
          />
        </label>
        </div>

        {imageFiles.length > 0 ? (
          <>
            <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
              {imagePreviews.map((url, index) => (
                <div
                  key={`${url}-${index}`}
                  className="group relative overflow-hidden rounded-xl border border-slate-100 bg-white/80 shadow-sm"
                >
                  <div className="aspect-square">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={url}
                      alt={imageFiles[index]?.name || 'Bild'}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="absolute inset-x-1 bottom-1 flex items-center justify-between gap-1 rounded-full bg-black/55 px-1.5 py-0.5">
                    <button
                      type="button"
                      onClick={() => setCoverIndex(index)}
                      className={[
                        'rounded-full px-2 py-0.5 text-[9px] font-medium',
                        coverIndex === index
                          ? 'bg-white text-slate-900'
                          : 'bg-black/0 text-white hover:bg-black/30',
                      ].join(' ')}
                    >
                      {coverIndex === index ? 'Titel' : 'Titelbild'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="rounded-full bg-black/0 px-1.5 py-0.5 text-[9px] text-white hover:bg-black/30"
                    >
                      Entfernen
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-1 text-[10px] text-slate-400">
              Die Reihenfolge der Bilder wird später für die Portale
              übernommen (erstes Bild oben, Vorschaubild zuerst).
            </p>
          </>
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
              Wird später als Nachweis mit übertragen, sofern die Portale
              das unterstützen.
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
              <span className="font-medium">
                {energyCertificateFile.name}
              </span>
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
              Grundrisse & weitere Dokumente
            </h3>
            <p className="text-[11px] text-slate-500">
              Hier kannst du Grundrisse, Teilungserklärung, Grundbuchauszug
              oder andere Unterlagen hochladen (PDF oder Bilder).
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
              Lade ein vorhandenes Exposé hoch (PDF), oder lasse es später
              von der <strong>Maklernull-KI</strong> aus deinen Angaben
              generieren.
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
              Die Exposé-Erstellung übernimmt später die Maklernull-KI. Du
              musst hier keine Datei hochladen.
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
