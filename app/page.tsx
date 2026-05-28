'use client'
import { useEffect, useState, useRef } from 'react'
import { supabase, Property, isSupabaseConfigured } from '@/lib/supabase'
import { SAMPLE_PROPERTIES, filterProperties } from '@/lib/sample-properties'
import { getSavedIds, toggleSavedId } from '@/lib/saved'
import BottomNav from '@/components/BottomNav'
import PropertyDetail from '@/components/PropertyDetail'
import SearchPanel, { Filters } from '@/components/SearchPanel'

export default function Home() {
  const [properties, setProperties] = useState<Property[]>(SAMPLE_PROPERTIES)
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set())
  const [showSearch, setShowSearch] = useState(false)
  const [filters, setFilters] = useState<Filters>({ minPrice: '', maxPrice: '', bedrooms: '', amenity: '' })
  const [currentIndex, setCurrentIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setSavedIds(new Set(getSavedIds()))
    loadProperties()
  }, [])

  async function loadProperties() {
    if (!isSupabaseConfigured()) return
    const { data, error } = await supabase.from('properties').select('*').order('created_at', { ascending: false })
    if (!error && data && data.length > 0) setProperties(data)
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

  function handleSave(id: string) {
    const next = toggleSavedId(id)
    setSavedIds(new Set(next))
  }

  const filtered = filterProperties(properties, filters)

  useEffect(() => {
    setCurrentIndex(0)
    containerRef.current?.scrollTo({ top: 0 })
  }, [filters])

  return (
    <>
      <header className="top-header">
        <span className="logo">navigui</span>
        <button type="button" onClick={() => setShowSearch(true)} className="header-search-btn" aria-label="Rechercher">
          <svg viewBox="0 0 24 24" fill="none" stroke="var(--text-primary)" strokeWidth="2" width="22" height="22">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
        </button>
      </header>

      <div className="scroll-progress">
        {filtered.map((_, i) => (
          <div key={i} className={`progress-dot ${i === currentIndex ? 'active' : ''}`} />
        ))}
      </div>

      <div className="feed-container" ref={containerRef}>
        {filtered.length === 0 ? (
          <div className="feed-empty">
            <p>Aucun logement trouvé</p>
            <button type="button" className="btn-edit" onClick={() => setFilters({ minPrice: '', maxPrice: '', bedrooms: '', amenity: '' })}>
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          filtered.map(p => (
            <section key={p.id} className="feed-card">
              <PropertyDetail property={p} saved={savedIds.has(p.id)} onSave={() => handleSave(p.id)} />
            </section>
          ))
        )}
      </div>

      <BottomNav />

      {showSearch && (
        <SearchPanel
          filters={filters}
          setFilters={setFilters}
          onClose={() => setShowSearch(false)}
          onApply={() => setShowSearch(false)}
        />
      )}
    </>
  )
}
