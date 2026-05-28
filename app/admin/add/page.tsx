'use client'
import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import PropertyForm from '@/components/PropertyForm'

export default function AddProperty() {
  const router = useRouter()

  useEffect(() => {
    async function check() {
      const isAdmin = localStorage.getItem('navigui_admin')
      if (!isAdmin) {
        router.push('/admin/login')
        return
      }
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) router.push('/admin/login')
    }
    check()
  }, [router])

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--gray-bg)' }}>
      <header className="top-header">
        <button type="button" onClick={() => router.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-primary)', fontSize: 15, fontWeight: 500 }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><polyline points="15 18 9 12 15 6"/></svg>
          Retour
        </button>
        <span style={{ fontSize: 16, fontWeight: 700 }}>Nouvel appartement</span>
        <div style={{ width: 60 }} />
      </header>
      <PropertyForm />
    </div>
  )
}
