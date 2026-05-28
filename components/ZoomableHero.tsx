'use client'
import { useRef, useState, useCallback } from 'react'
import { optimizeImageUrl } from '@/lib/images'

export default function ZoomableHero({
  src,
  alt,
  priority,
}: {
  src: string
  alt: string
  priority?: boolean
}) {
  const [zoomOpen, setZoomOpen] = useState(false)
  const [scale, setScale] = useState(1)
  const pinchRef = useRef<{ dist: number; scale: number } | null>(null)
  const fullSrc = optimizeImageUrl(src, 1400, 80)

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const d = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY,
      )
      pinchRef.current = { dist: d, scale }
    }
  }, [scale])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2 && pinchRef.current) {
      const d = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY,
      )
      setScale(Math.min(4, Math.max(1, pinchRef.current.scale * (d / pinchRef.current.dist))))
    }
  }, [])

  const handleTouchEnd = useCallback(() => {
    pinchRef.current = null
    if (scale < 1.1) setScale(1)
  }, [scale])

  if (zoomOpen) {
    return (
      <div
        className="zoom-overlay"
        onClick={() => { setZoomOpen(false); setScale(1) }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <button type="button" className="zoom-close" onClick={() => setZoomOpen(false)}>×</button>
        <img
          src={fullSrc}
          alt={alt}
          className="zoom-img"
          style={{ transform: `scale(${scale})` }}
          onClick={e => e.stopPropagation()}
          draggable={false}
        />
        <p className="zoom-hint">Pincez pour zoomer</p>
      </div>
    )
  }

  return (
    <button type="button" className="detail-gallery-inner" onClick={() => setZoomOpen(true)} aria-label="Agrandir">
      <img
        src={optimizeImageUrl(src, priority ? 800 : 640, 72)}
        alt={alt}
        className="detail-hero-img"
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
      />
    </button>
  )
}
