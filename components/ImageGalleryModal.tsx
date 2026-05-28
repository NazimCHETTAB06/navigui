'use client'
import { useEffect, useState } from 'react'
import OptimizedImage from '@/components/OptimizedImage'

export default function ImageGalleryModal({
  images,
  initialIndex,
  onClose,
}: {
  images: string[]
  initialIndex: number
  onClose: () => void
}) {
  const [index, setIndex] = useState(initialIndex)
  const [view, setView] = useState<'slide' | 'grid'>('slide')

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') setIndex(i => Math.min(images.length - 1, i + 1))
      if (e.key === 'ArrowLeft') setIndex(i => Math.max(0, i - 1))
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [images.length, onClose])

  return (
    <div className="gallery-modal" role="dialog" aria-modal="true">
      <div className="gallery-modal-backdrop" onClick={onClose} />
      <div className="gallery-modal-panel">
        <div className="gallery-modal-header">
          <span>{index + 1} / {images.length}</span>
          <div className="gallery-modal-actions">
            <button type="button" onClick={() => setView(v => (v === 'slide' ? 'grid' : 'slide'))}>
              {view === 'slide' ? 'Grille' : 'Diaporama'}
            </button>
            <button type="button" className="gallery-close" onClick={onClose} aria-label="Fermer">×</button>
          </div>
        </div>

        {view === 'slide' ? (
          <div className="gallery-slide">
            <button type="button" className="gallery-arrow gallery-arrow-left" disabled={index === 0} onClick={() => setIndex(i => i - 1)}>‹</button>
            <OptimizedImage src={images[index]} alt="" className="gallery-slide-img" width={1200} priority />
            <button type="button" className="gallery-arrow gallery-arrow-right" disabled={index === images.length - 1} onClick={() => setIndex(i => i + 1)}>›</button>
          </div>
        ) : (
          <div className="gallery-grid">
            {images.map((src, i) => (
              <button key={i} type="button" className={`gallery-grid-item ${i === index ? 'active' : ''}`} onClick={() => { setIndex(i); setView('slide') }}>
                <OptimizedImage src={src} alt="" width={200} />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
