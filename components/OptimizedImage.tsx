'use client'
import { useState } from 'react'
import { optimizeImageUrl } from '@/lib/images'

export default function OptimizedImage({
  src,
  alt,
  className,
  width = 800,
  priority = false,
}: {
  src: string
  alt: string
  className?: string
  width?: number
  priority?: boolean
}) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)
  const optimized = optimizeImageUrl(src, width, 72)

  const imgClass = className ? `${className} ${loaded ? '' : 'opt-img-loading'}` : undefined

  return (
    <div className={`opt-img-wrap ${loaded ? 'loaded' : ''}`} style={{ width: '100%', height: '100%' }}>
      {!loaded && !error && <div className="opt-img-skeleton" aria-hidden />}
      <img
        src={error ? src : optimized}
        alt={alt}
        className={imgClass}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => {
          if (!error) setError(true)
          else setLoaded(true)
        }}
      />
    </div>
  )
}
