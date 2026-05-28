'use client'
import { useEffect, useState } from 'react'
import { supabase, Property, isSupabaseConfigured } from '@/lib/supabase'
import { SAMPLE_PROPERTIES } from '@/lib/sample-properties'
import { getSavedIds, toggleSavedId } from '@/lib/saved'
import SiteHeader from '@/components/SiteHeader'
import PropertyDetail from '@/components/PropertyDetail'

export default function SavedPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [savedIds, setSavedIds] = useState<string[]>([])

  useEffect(() => {
    const ids = getSavedIds()
    setSavedIds(ids)
    load(ids)
  }, [])

  async function load(ids: string[]) {
    if (!ids.length) {
      setProperties([])
      return
    }
    if (isSupabaseConfigured()) {
      const { data } = await supabase.from('properties').select('*').in('id', ids)
      if (data?.length) {
        setProperties(data.filter(p => ids.includes(p.id)))
        return
      }
    }
    setProperties(SAMPLE_PROPERTIES.filter(p => ids.includes(p.id)))
  }

  function handleUnsave(id: string) {
    const next = savedIds.filter(x => x !== id)
    setSavedIds(next)
    setProperties(prev => prev.filter(p => p.id !== id))
    toggleSavedId(id)
  }

  return (
    <>
      <SiteHeader />
      <main className="feed-container feed-container-static">
        {properties.length === 0 ? (
          <div className="feed-empty">
            <p>Aucun logement enregistré</p>
            <a href="/" className="btn-edit" style={{ textDecoration: 'none' }}>Parcourir les annonces</a>
          </div>
        ) : (
          properties.map(p => (
            <section key={p.id} className="feed-card">
              <PropertyDetail property={p} saved onSave={() => handleUnsave(p.id)} />
            </section>
          ))
        )}
      </main>
    </>
  )
}
