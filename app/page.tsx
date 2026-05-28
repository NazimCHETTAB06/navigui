'use client'
import { useEffect, useState, useRef, useCallback } from 'react'
import { supabase, Property, isSupabaseConfigured } from '@/lib/supabase'
import { SAMPLE_PROPERTIES, filterProperties } from '@/lib/sample-properties'
import { getSavedIds, toggleSavedId } from '@/lib/saved'
import SiteHeader from '@/components/SiteHeader'
import PropertyDetail from '@/components/PropertyDetail'
import SearchPanel, { Filters } from '@/components/SearchPanel'

export default function Home() {
  const [properties, setProperties] = useState<Property[]>(SAMPLE_PROPERTIES)
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set())
  const [showSearch, setShowSearch] = useState(false)
  const [filters, setFilters] = useState<Filters>({ minPrice: '', maxPrice: '', bedrooms: '', amenity: '' })
  const [activeIdx, setActiveIdx] = useState(0)
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

  const filtered = filterProperties(properties, filters)

  const updateActiveIndex = useCallback(() => {
    const el = containerRef.current
    if (!el || !filtered.length) return
    const slideH = el.clientHeight
    if (!slideH) return
    const idx = Math.round(el.scrollTop / slideH)
    setActiveIdx(Math.min(idx, filtered.length - 1))
  }, [filtered.length])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    el.addEventListener('scroll', updateActiveIndex, { passive: true })
    return () => el.removeEventListener('scroll', updateActiveIndex)
  }, [updateActiveIndex])

  useEffect(() => {
    setActiveIdx(0)
    containerRef.current?.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [filters])

  function handleSave(id: string) {
    setSavedIds(new Set(toggleSavedId(id)))
  }

  return (
    <>
      <SiteHeader onSearchClick={() => setShowSearch(true)} />

      <div className="tiktok-feed" ref={containerRef}>
        {filtered.length === 0 ? (
          <div className="tiktok-slide feed-empty">
            <p>Aucun logement trouvé</p>
            <button type="button" className="btn-edit" onClick={() => setFilters({ minPrice: '', maxPrice: '', bedrooms: '', amenity: '' })}>
              Réinitialiser
            </button>
          </div>
        ) : (
          filtered.map((p, i) => {
            const render = Math.abs(i - activeIdx) <= 1
            return (
              <section key={p.id} className="tiktok-slide">
                {render ? (
                  <PropertyDetail
                    property={p}
                    saved={savedIds.has(p.id)}
                    onSave={() => handleSave(p.id)}
                    isActive={i === activeIdx}
                  />
                ) : (
                  <div className="tiktok-slide-placeholder" />
                )}
              </section>
            )
          })
        )}
      </div>

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
