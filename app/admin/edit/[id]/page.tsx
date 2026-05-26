'use client'
import { useEffect, useState } from 'react'
import { supabase, Property } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import PropertyForm from '@/components/PropertyForm'

export default function EditProperty({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.push('/admin/login'); return }
      loadProperty()
    })
  }, [])

  async function loadProperty() {
    const { data } = await supabase.from('properties').select('*').eq('id', params.id).single()
    setProperty(data)
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--gray-bg)' }}>
      <header className="top-header">
        <button onClick={() => router.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-primary)', fontSize: 15, fontWeight: 500 }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><polyline points="15 18 9 12 15 6"/></svg>
          Retour
        </button>
        <span style={{ fontSize: 16, fontWeight: 700 }}>Modifier</span>
        <div style={{ width: 60 }} />
      </header>
      {loading ? (
        <div style={{ textAlign: 'center', padding: '100px 0', color: 'var(--text-secondary)' }}>Chargement...</div>
      ) : property ? (
        <PropertyForm initial={property} propertyId={params.id} />
      ) : (
        <div style={{ textAlign: 'center', padding: '100px 0', color: 'var(--text-secondary)' }}>Appartement introuvable</div>
      )}
    </div>
  )
}
