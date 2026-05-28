'use client'
import { useEffect } from 'react'
import OptimizedImage from '@/components/OptimizedImage'

/** Bandeau horizontal des photos restantes (pas de grille). */
export default function PhotoStripModal({
  images,
  startIndex,
  onSelect,
  onClose,
}: {
  images: string[]
  startIndex: number
  onSelect: (index: number) => void
  onClose: () => void
}) {
  const rest = images.slice(startIndex)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <div className="photo-strip-modal" role="dialog" aria-modal="true">
      <button type="button" className="photo-strip-backdrop" onClick={onClose} aria-label="Fermer" />
      <div className="photo-strip-panel">
        <div className="photo-strip-header">
          <span>{rest.length} photos</span>
          <button type="button" onClick={onClose}>Fermer</button>
        </div>
        <div className="photo-strip-scroll">
          {rest.map((src, i) => {
            const globalIdx = startIndex + i
            return (
              <button
                key={globalIdx}
                type="button"
                className="photo-strip-item"
                onClick={() => { onSelect(globalIdx); onClose() }}
              >
                <OptimizedImage src={src} alt="" width={280} />
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
