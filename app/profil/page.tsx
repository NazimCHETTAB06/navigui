'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import SiteHeader from '@/components/SiteHeader'

export default function ProfilPage() {
  const router = useRouter()
  const [email, setEmail] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setEmail(session?.user?.email ?? null)
      setLoading(false)
    })
  }, [])

  async function logout() {
    await supabase.auth.signOut()
    setEmail(null)
    router.refresh()
  }

  return (
    <>
      <SiteHeader />
      <main className="page-main">
        <h1 className="page-title">Profil</h1>
        {loading ? (
          <p style={{ color: 'var(--text-secondary)' }}>Chargement...</p>
        ) : email ? (
          <div className="admin-card" style={{ padding: 16, marginBottom: 16 }}>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 4 }}>Connecté en tant que</p>
            <p style={{ fontWeight: 600, marginBottom: 16 }}>{email}</p>
            <Link href="/admin" className="btn-primary" style={{ display: 'block', textAlign: 'center', textDecoration: 'none', marginBottom: 10 }}>
              Gérer mes annonces
            </Link>
            <button type="button" className="btn-delete" style={{ width: '100%' }} onClick={logout}>
              Déconnexion
            </button>
          </div>
        ) : (
          <div className="admin-card" style={{ padding: 16, marginBottom: 16 }}>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 16 }}>
              Connectez-vous pour publier des annonces.
            </p>
            <Link href="/admin/login" className="btn-primary" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>
              Connexion administrateur
            </Link>
          </div>
        )}
      </main>
    </>
  )
}
