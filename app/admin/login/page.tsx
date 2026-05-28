'use client'
import { useState } from 'react'
import { supabase, getSupabaseConfigError } from '@/lib/supabase'
import { resolveLoginEmail, formatAuthError } from '@/lib/auth'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const configErr = getSupabaseConfigError()
    if (configErr) {
      setError(configErr)
      setLoading(false)
      return
    }

    const email = resolveLoginEmail(identifier)
    if (!email.includes('@')) {
      setError('Entrez votre email (ex. admin@navigui.com) ou le téléphone 0664864918.')
      setLoading(false)
      return
    }

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError) {
      setError(formatAuthError(authError.message))
      setLoading(false)
      return
    }

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
            <label className="form-label">Email ou téléphone</label>
            <input
              className="form-input"
              type="text"
              placeholder="admin@navigui.com"
              value={identifier}
              onChange={e => setIdentifier(e.target.value)}
              autoComplete="username"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Mot de passe</label>
            <input
              className="form-input"
              type="password"
              placeholder="Mot de passe Supabase"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>
          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 14, lineHeight: 1.45 }}>
          Utilisez le compte créé dans Supabase → Authentication (ex. admin@navigui.com ou n_chettab@estin.dz).
        </p>
      </div>

      <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--text-secondary)' }}>
        <a href="/" style={{ color: 'var(--blue)' }}>← Retour au site</a>
      </p>
    </div>
  )
}
