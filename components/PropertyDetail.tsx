'use client'
import { useState, useEffect } from 'react'
import { Property } from '@/lib/supabase'
import { MAP_URL } from '@/lib/constants'
import { optimizeImageUrl } from '@/lib/images'
import ZoomableHero from '@/components/ZoomableHero'
import OptimizedImage from '@/components/OptimizedImage'
import { IconBed, IconBath, IconPeople, AmenityIcon } from '@/components/PropertyIcons'

const FALLBACK = 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=70'

function formatPhone(phone: string) {
  const d = phone.replace(/\D/g, '')
  if (d.length === 10) return `${d.slice(0, 4)} ${d.slice(4, 6)} ${d.slice(6, 8)} ${d.slice(8)}`
  return phone
}

export default function PropertyDetail({
  property: p,
  saved,
  onSave,
  isActive = true,
}: {
  property: Property
  saved: boolean
  onSave: () => void
  isActive?: boolean
}) {
  const [imgIdx, setImgIdx] = useState(0)
  const imgs = p.images?.length ? p.images : [FALLBACK]
  const extraCount = Math.max(0, imgs.length - 5)

  useEffect(() => {
    if (!isActive) return
    const next = imgs[imgIdx + 1]
    if (next) {
      const img = new Image()
      img.src = optimizeImageUrl(next, 720, 70)
    }
  }, [imgIdx, imgs, isActive])

  return (
    <article className="detail-page">
      <div className="detail-gallery-wrap">
        <div className="detail-gallery">
          <ZoomableHero src={imgs[imgIdx]} alt={p.title} priority={isActive && imgIdx === 0} />
          {p.verified && (
            <div className="detail-verified">
              <svg viewBox="0 0 24 24" fill="currentColor" width="13" height="13">
                <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Vérifié
            </div>
          )}
          <div className="detail-img-counter">{imgIdx + 1} / {imgs.length}</div>
          {imgs.length > 1 && (
            <>
              <button type="button" className="detail-nav-zone detail-nav-left" aria-label="Précédent" onClick={e => { e.stopPropagation(); setImgIdx(i => Math.max(0, i - 1)) }} />
              <button type="button" className="detail-nav-zone detail-nav-right" aria-label="Suivant" onClick={e => { e.stopPropagation(); setImgIdx(i => Math.min(imgs.length - 1, i + 1)) }} />
            </>
          )}
        </div>
      </div>

      <div className="detail-thumbs-grid">
        {imgs.slice(0, 5).map((src, i) => (
          <button key={i} type="button" className={`detail-thumb-grid ${imgIdx === i ? 'active' : ''}`} onClick={() => setImgIdx(i)}>
            <OptimizedImage src={src} alt="" width={120} />
          </button>
        ))}
        {extraCount > 0 && (
          <div className="detail-thumb-grid" style={{ position: 'relative' }}>
            <OptimizedImage src={imgs[5]} alt="" width={120} />
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '14px',
              fontWeight: '700'
            }}>
              +{extraCount}
            </div>
          </div>
        )}
      </div>

      <div className="detail-body">
        <div className="detail-price-block">
          <div>
            <div className="detail-price">
              {p.price_per_night.toLocaleString('fr-DZ')} DA <span>/ nuit</span>
            </div>
            <div className="detail-rating">
              <span className="detail-rating-num">{p.rating}</span>
              <svg viewBox="0 0 24 24" fill="var(--blue)" width="14" height="14"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
              <span className="detail-reviews">({p.reviews_count} avis)</span>
            </div>
          </div>
          <button type="button" className={`detail-save-btn ${saved ? 'saved' : ''}`} onClick={onSave} aria-label="Enregistrer">
            <svg viewBox="0 0 24 24" fill={saved ? 'var(--blue)' : 'none'} stroke="currentColor" strokeWidth="2" width="22" height="22">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
          </button>
        </div>

        <h1 className="detail-title">{p.title}</h1>

        <div className="detail-location-row">
          <span className="detail-location">
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2" width="15" height="15">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
            </svg>
            {p.location}
          </span>
          <span className="detail-location-sep" />
          <a href={MAP_URL} target="_blank" rel="noreferrer" className="detail-map-link">
            Voir sur la carte
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>
        </div>

        <div className="detail-specs">
          <span className="detail-spec"><IconBed />{p.bedrooms} chambres</span>
          <span className="detail-spec-dot">•</span>
          <span className="detail-spec"><IconBath />{p.bathrooms} salles de bain</span>
          <span className="detail-spec-dot">•</span>
          <span className="detail-spec"><IconPeople />{p.max_persons} personnes</span>
        </div>

        <div className="detail-contact-box">
          <a href={`tel:${p.phone}`} className="detail-contact-call">
            <span className="detail-contact-icon detail-contact-icon-phone">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" width="20" height="20">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13 19.79 19.79 0 0 1 1.61 4.48 2 2 0 0 1 3.58 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.08 6.08l1.48-1.48a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </span>
            <div><strong>{formatPhone(p.phone)}</strong><span>Appel direct</span></div>
          </a>
          <div className="detail-contact-divider" />
          <a href={`https://wa.me/${(p.whatsapp || p.phone).replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="detail-contact-wa">
            <span className="detail-contact-icon detail-contact-icon-wa">
              <svg viewBox="0 0 24 24" fill="white" width="20" height="20">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
              </svg>
            </span>
            <div><strong>Contacter sur WhatsApp</strong><span>Réponse rapide</span></div>
          </a>
        </div>

        {p.description && <p className="detail-description">{p.description}</p>}

        {p.amenities?.length > 0 && (
          <div className="detail-amenities-box">
            <div className="detail-amenities">
              {p.amenities.map(a => (
                <div key={a} className="detail-amenity">
                  <span className="detail-amenity-icon"><AmenityIcon name={a} /></span>
                  <span>{a.toUpperCase()}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  )
}
