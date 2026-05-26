'use client'
import { useEffect, useState, useRef } from 'react'
import { supabase, Property } from '@/lib/supabase'
import Link from 'next/link'

const AMENITY_ICONS: Record<string, string> = {
  'WiFi': '📶', 'Parking': '🅿️', 'Climatisation': '❄️', 'Cuisine': '🍴',
  'Vue mer': '🌊', 'Piscine': '🏊', 'Jardin': '🌿', 'Barbecue': '🔥',
  'Lave-linge': '🧺', 'Télévision': '📺'
}

const SAMPLE_PROPERTIES: Property[] = [
  {
    id: '1', title: 'Villa moderne avec vue sur mer', description: 'Magnifique villa moderne avec une vue imprenable sur la mer. Idéal pour les familles et groupes. Proche de la plage. Quartier calme et sécurisé.',
    price_per_night: 7500, location: 'Béni Ksila, Béjaïa', bedrooms: 5, bathrooms: 3, max_persons: 12,
    phone: '0555123456', whatsapp: '213555123456',
    images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800'],
    amenities: ['WiFi', 'Parking', 'Climatisation', 'Cuisine', 'Vue mer', 'Piscine'],
    rating: 4.9, reviews_count: 48, verified: true, created_at: ''
  },
  {
    id: '2', title: 'Appartement cosy près de la plage', description: 'Bel appartement lumineux à 5 minutes de la plage. Terrasse avec vue panoramique.',
    price_per_night: 4500, location: 'Béni Ksila, Béjaïa', bedrooms: 2, bathrooms: 1, max_persons: 4,
    phone: '0555123456', whatsapp: '213555123456',
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'],
    amenities: ['WiFi', 'Climatisation', 'Vue mer'],
    rating: 4.7, reviews_count: 36, verified: true, created_at: ''
  },
  {
    id: '3', title: 'Studio avec terrasse et vue mer', description: 'Studio moderne avec grande terrasse. Vue imprenable sur la mer Méditerranée.',
    price_per_night: 3800, location: 'Béni Ksila, Béjaïa', bedrooms: 1, bathrooms: 1, max_persons: 2,
    phone: '0555123456', whatsapp: '213555123456',
    images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'],
    amenities: ['WiFi', 'Vue mer', 'Climatisation'],
    rating: 4.6, reviews_count: 22, verified: false, created_at: ''
  }
]

export default function Home() {
  const [properties, setProperties] = useState<Property[]>(SAMPLE_PROPERTIES)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showSearch, setShowSearch] = useState(false)
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set())
  const [filters, setFilters] = useState({ minPrice: '', maxPrice: '', bedrooms: '', amenity: '' })
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadProperties()
  }, [])

  async function loadProperties() {
    const { data } = await supabase.from('properties').select('*').order('created_at', { ascending: false })
    if (data && data.length > 0) setProperties(data)
  }

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const onScroll = () => {
      const idx = Math.round(container.scrollTop / container.clientHeight)
      setCurrentIndex(idx)
    }
    container.addEventListener('scroll', onScroll, { passive: true })
    return () => container.removeEventListener('scroll', onScroll)
  }, [])

  function toggleSave(id: string) {
    setSavedIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function applyFilters() {
    setShowSearch(false)
  }

  const filtered = properties.filter(p => {
    if (filters.minPrice && p.price_per_night < Number(filters.minPrice)) return false
    if (filters.maxPrice && p.price_per_night > Number(filters.maxPrice)) return false
    if (filters.bedrooms && p.bedrooms < Number(filters.bedrooms)) return false
    if (filters.amenity && !p.amenities.includes(filters.amenity)) return false
    return true
  })

  return (
    <>
      {/* Top header */}
      <header className="top-header">
        <span className="logo">navigui</span>
        <button onClick={() => setShowSearch(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="var(--text-primary)" strokeWidth="2" width="22" height="22">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
        </button>
      </header>

      {/* Scroll progress */}
      <div className="scroll-progress">
        {filtered.map((_, i) => (
          <div key={i} className={`progress-dot ${i === currentIndex ? 'active' : ''}`} />
        ))}
      </div>

      {/* Main TikTok scroll */}
      <div className="scroll-container" ref={containerRef} style={{ paddingTop: 0 }}>
        {filtered.length === 0 ? (
          <div style={{ height: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12, color: 'var(--text-secondary)', paddingTop: 56 }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="48" height="48"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            <p style={{ fontSize: 16 }}>Aucun logement trouvé</p>
            <button className="btn-edit" onClick={() => { setFilters({ minPrice: '', maxPrice: '', bedrooms: '', amenity: '' }) }}>Réinitialiser les filtres</button>
          </div>
        ) : filtered.map((p, i) => (
          <PropertyCard key={p.id} property={p} saved={savedIds.has(p.id)} onSave={() => toggleSave(p.id)} />
        ))}
      </div>

      {/* Bottom nav */}
      <nav className="bottom-nav">
        <a className="nav-item active" href="/">
          <svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
          <span>ACCUEIL</span>
        </a>
        <a className="nav-item" href="/saved">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
          <span>ENREGISTRÉS</span>
        </a>
        <a className="nav-item" href="/assistant">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
          <span>ASSISTANT</span>
        </a>
        <a className="nav-item" href="/admin/login">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          <span>PROFIL</span>
        </a>
      </nav>

      {/* Search panel */}
      {showSearch && (
        <div className="search-overlay" onClick={(e) => { if (e.target === e.currentTarget) setShowSearch(false) }}>
          <div className="search-panel">
            <div className="search-handle" />
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Filtres</h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Prix min (DA)</label>
                <input className="form-input" type="number" placeholder="0" value={filters.minPrice} onChange={e => setFilters(f => ({ ...f, minPrice: e.target.value }))} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Prix max (DA)</label>
                <input className="form-input" type="number" placeholder="20000" value={filters.maxPrice} onChange={e => setFilters(f => ({ ...f, maxPrice: e.target.value }))} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Chambres minimum</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {['1', '2', '3', '4', '5+'].map(n => (
                  <button key={n} className={`filter-pill ${filters.bedrooms === n ? 'active' : ''}`} onClick={() => setFilters(f => ({ ...f, bedrooms: f.bedrooms === n ? '' : n }))}>
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Équipements</label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {Object.entries(AMENITY_ICONS).map(([name, icon]) => (
                  <button key={name} className={`filter-pill ${filters.amenity === name ? 'active' : ''}`} onClick={() => setFilters(f => ({ ...f, amenity: f.amenity === name ? '' : name }))}>
                    {icon} {name}
                  </button>
                ))}
              </div>
            </div>

            <button className="btn-primary" onClick={applyFilters}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              Rechercher
            </button>
          </div>
        </div>
      )}
    </>
  )
}

function PropertyCard({ property: p, saved, onSave }: { property: Property; saved: boolean; onSave: () => void }) {
  const [imgIdx, setImgIdx] = useState(0)
  const imgs = p.images?.length ? p.images : ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800']

  return (
    <div className="scroll-card">
      {/* Background image */}
      <div className="property-bg">
        <img src={imgs[imgIdx]} alt={p.title} loading="lazy" />
      </div>
      <div className="property-gradient" />

      {/* Image counter */}
      {imgs.length > 1 && (
        <div className="img-counter">{imgIdx + 1} / {imgs.length}</div>
      )}

      {/* Image navigation tap zones */}
      <div style={{ position: 'absolute', top: 56, left: 0, width: '40%', bottom: 200, zIndex: 10 }}
        onClick={() => setImgIdx(i => Math.max(0, i - 1))} />
      <div style={{ position: 'absolute', top: 56, right: 0, width: '40%', bottom: 200, zIndex: 10 }}
        onClick={() => setImgIdx(i => Math.min(imgs.length - 1, i + 1))} />

      {/* Bookmark */}
      <button className="bookmark-btn" onClick={onSave} style={{ zIndex: 20 }}>
        <svg viewBox="0 0 24 24" fill={saved ? 'white' : 'none'} stroke="white" strokeWidth="2" width="20" height="20">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
        </svg>
      </button>

      {/* Content */}
      <div className="property-content">
        {p.verified && (
          <div className="verified-badge">
            <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
            Vérifié
          </div>
        )}

        <div className="property-price">
          {p.price_per_night.toLocaleString('fr-DZ')} DA <span>/ nuit</span>
        </div>

        <div className="property-rating">
          <svg viewBox="0 0 24 24" fill="#FBBF24" width="14" height="14"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          <span style={{ fontWeight: 600 }}>{p.rating}</span>
          <span style={{ opacity: 0.7 }}>({p.reviews_count} avis)</span>
        </div>

        <div className="property-title">{p.title}</div>

        <div className="property-location">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          {p.location}
        </div>

        <div className="property-details">
          <div className="property-detail">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16"><path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/></svg>
            {p.bedrooms} chambres
          </div>
          <span>•</span>
          <div className="property-detail">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16"><path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5"/><line x1="10" y1="5" x2="8" y2="7"/><line x1="2" y1="12" x2="22" y2="12"/></svg>
            {p.bathrooms} SDB
          </div>
          <span>•</span>
          <div className="property-detail">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            {p.max_persons} personnes
          </div>
        </div>

        {p.amenities?.length > 0 && (
          <div className="amenities-row">
            {p.amenities.slice(0, 5).map(a => (
              <div key={a} className="amenity-chip">{AMENITY_ICONS[a] || '✓'} {a}</div>
            ))}
          </div>
        )}

        <div className="contact-buttons">
          <a href={`tel:${p.phone}`} className="btn-call">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13 19.79 19.79 0 0 1 1.61 4.48 2 2 0 0 1 3.58 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.08 6.08l1.48-1.48a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            {p.phone}
          </a>
          <a href={`https://wa.me/${p.whatsapp}`} target="_blank" rel="noreferrer" className="btn-whatsapp">
            <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
            Contacter sur WhatsApp
          </a>
        </div>
      </div>
    </div>
  )
}
