'use client'
import { useEffect, useState, useRef } from 'react'
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

  function handleSave(id: string) {
    const next = toggleSavedId(id)
    setSavedIds(new Set(next))
  }

  const filtered = filterProperties(properties, filters)

  useEffect(() => {
    containerRef.current?.scrollTo({ top: 0 })
  }, [filters])

  return (
    <>
      <SiteHeader onSearchClick={() => setShowSearch(true)} />

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
