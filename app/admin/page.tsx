'use client'
import { useEffect, useState } from 'react'
import { supabase, Property } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function AdminDashboard() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [checking, setChecking] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function check() {
      const isAdmin = localStorage.getItem('navigui_admin')
      if (!isAdmin) {
        router.replace('/admin/login')
        return
      }
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        localStorage.removeItem('navigui_admin')
        router.replace('/admin/login')
        return
      }
      setChecking(false)
      loadProperties()
    }
    check()
  }, [router])

  async function loadProperties() {
    const { data } = await supabase.from('properties').select('*').order('created_at', { ascending: false })
    setProperties(data || [])
    setLoading(false)
  }

  async function deleteProperty(id: string) {
    if (!confirm('Supprimer cet appartement ?')) return
    await supabase.from('properties').delete().eq('id', id)
    setProperties(prev => prev.filter(p => p.id !== id))
  }

  async function logout() {
    localStorage.removeItem('navigui_admin')
    await supabase.auth.signOut()
    router.replace('/')
  }

  // Afficher rien pendant la vérification
  if (checking) {
    return (
      <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--gray-bg)' }}>
        <div style={{ color: 'var(--text-secondary)', fontSize: 15 }}>Vérification...</div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--gray-bg)', paddingBottom: 20 }}>
      <header className="top-header">
        <span className="logo">navigui admin</span>
        <button onClick={logout} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: 13, fontWeight: 500 }}>
          Déconnexion
        </button>
      </header>

      <div style={{ padding: '72px 16px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700 }}>Mes appartements</h1>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{properties.length} publication{properties.length !== 1 ? 's' : ''}</p>
          </div>
          <a href="/admin/add" style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--blue)', color: 'white', padding: '10px 16px', borderRadius: 10, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Ajouter
          </a>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-secondary)' }}>Chargement...</div>
        ) : properties.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-secondary)' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="48" height="48" style={{ marginBottom: 12, opacity: 0.4 }}><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M12 8v8M8 12h8"/></svg>
            <p style={{ fontSize: 16, marginBottom: 16 }}>Aucun appartement publié</p>
            <a href="/admin/add" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--blue)', color: 'white', padding: '12px 24px', borderRadius: 10, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
              Publier votre premier appartement
            </a>
          </div>
        ) : (
          properties.map(p => (
            <div key={p.id} className="admin-card">
              {p.images?.[0] && (
                <img src={p.images[0]} alt={p.title} style={{ width: '100%', height: 180, objectFit: 'cover' }} />
              )}
              <div className="admin-card-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div style={{ flex: 1, marginRight: 12 }}>
                    <div className="admin-card-title">{p.title}</div>
                    <div className="admin-card-sub">{p.location} · {p.bedrooms} ch · {p.max_persons} pers</div>
                  </div>
                  <div className="admin-card-price">{p.price_per_night?.toLocaleString('fr-DZ')} DA<span style={{ fontSize: 11, fontWeight: 400, color: 'var(--text-secondary)' }}>/nuit</span></div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn-edit" style={{ flex: 1 }} onClick={() => router.push(`/admin/edit/${p.id}`)}>
                    ✏️ Modifier
                  </button>
                  <button className="btn-delete" style={{ flex: 1 }} onClick={() => deleteProperty(p.id)}>
                    🗑️ Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
