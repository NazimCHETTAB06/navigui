'use client'
import { useEffect, useState } from 'react'
import { supabase, Property, isSupabaseConfigured } from '@/lib/supabase'
import { SAMPLE_PROPERTIES } from '@/lib/sample-properties'
import { getSavedIds } from '@/lib/saved'
import BottomNav from '@/components/BottomNav'
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
    localStorage.setItem('navigui-saved', JSON.stringify(next))
  }

  return (
    <>
      <header className="top-header">
        <span className="logo">navigui</span>
        <div style={{ width: 40 }} />
      </header>

      <main className="page-main">
        <h1 className="page-title">Enregistrés</h1>
        {properties.length === 0 ? (
          <div className="feed-empty" style={{ minHeight: '50vh' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="48" height="48">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
            <p>Aucun logement enregistré</p>
            <a href="/" className="btn-edit" style={{ textDecoration: 'none' }}>Parcourir les annonces</a>
          </div>
        ) : (
          properties.map(p => (
            <div key={p.id} style={{ marginBottom: 24 }}>
              <PropertyDetail property={p} saved onSave={() => handleUnsave(p.id)} />
            </div>
          ))
        )}
      </main>

      <BottomNav />
    </>
  )
}
