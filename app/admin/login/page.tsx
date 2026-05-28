'use client'
import { useState } from 'react'
import { supabase, getSupabaseConfigError } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const ADMIN_PHONE = '0664864918'
const ADMIN_PASSWORD = 'nazim06'
const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@navigui.com'

export default function AdminLogin() {
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (phone.replace(/\D/g, '') !== ADMIN_PHONE.replace(/\D/g, '') || password !== ADMIN_PASSWORD) {
      setError('Téléphone ou mot de passe incorrect')
      setLoading(false)
      return
    }

    const configErr = getSupabaseConfigError()
    if (configErr) {
      setError(configErr)
      setLoading(false)
      return
    }

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: ADMIN_EMAIL,
      password,
    })

    if (authError) {
      setError(
        'Compte Supabase introuvable. Créez un utilisateur admin@navigui.com dans Supabase → Authentication, avec le même mot de passe.',
      )
      setLoading(false)
      return
    }

    localStorage.setItem('navigui_admin', 'true')
    router.push('/admin')
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '24px 20px', background: 'var(--gray-bg)' }}>
      <div style={{ marginBottom: 40, textAlign: 'center' }}>
        <div className="logo" style={{ fontSize: 32, marginBottom: 8 }}>navigui</div>
        <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>Accès administrateur</p>
      </div>

      <div style={{ background: 'white', borderRadius: 20, padding: '28px 20px', boxShadow: '0 2px 20px rgba(0,0,0,0.06)', border: '1px solid var(--gray-border)' }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>Connexion</h1>

        {error && (
          <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, padding: '12px 14px', marginBottom: 16, color: '#DC2626', fontSize: 14 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Téléphone</label>
            <input
              className="form-input"
              type="tel"
              placeholder="0664864918"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Mot de passe</label>
            <input
              className="form-input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      </div>

      <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--text-secondary)' }}>
        <a href="/" style={{ color: 'var(--blue)' }}>← Retour au site</a>
      </p>
    </div>
  )
}
