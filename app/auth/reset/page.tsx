'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function ResetPassword() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [ready, setReady] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Supabase met les tokens dans le hash de l'URL
    const hash = window.location.hash
    if (hash && hash.includes('access_token')) {
      // Supabase Auth va automatiquement lire le hash et créer une session
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          setReady(true)
        }
      })
    } else {
      // Essayer quand même
      setTimeout(() => setReady(true), 1000)
    }
  }, [])

  async function handleReset(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirm) {
      setError('Les mots de passe ne correspondent pas')
      return
    }
    if (password.length < 6) {
      setError('Le mot de passe doit avoir au moins 6 caractères')
      return
    }
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
      setError('Erreur : ' + error.message)
    } else {
      setSuccess(true)
      setTimeout(() => router.push('/admin/login'), 2000)
    }
    setLoading(false)
  }

  if (success) {
    return (
      <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '24px 20px', background: 'var(--gray-bg)' }}>
        <div style={{ background: '#F0FDF4', border: '1px solid #86EFAC', borderRadius: 16, padding: '24px 32px', textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#166534', marginBottom: 8 }}>Mot de passe changé !</h2>
          <p style={{ color: '#166534', fontSize: 14 }}>Redirection vers la connexion...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '24px 20px', background: 'var(--gray-bg)' }}>
      <div style={{ marginBottom: 40, textAlign: 'center' }}>
        <div className="logo" style={{ fontSize: 32, marginBottom: 8 }}>navigui</div>
        <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>Nouveau mot de passe</p>
      </div>

      <div style={{ background: 'white', borderRadius: 20, padding: '28px 20px', boxShadow: '0 2px 20px rgba(0,0,0,0.06)', border: '1px solid var(--gray-border)' }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>Réinitialiser</h1>

        {error && (
          <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, padding: '12px 14px', marginBottom: 16, color: '#DC2626', fontSize: 14 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleReset}>
          <div className="form-group">
            <label className="form-label">Nouveau mot de passe</label>
            <input
              className="form-input"
              type="password"
              placeholder="Minimum 6 caractères"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Confirmer le mot de passe</label>
            <input
              className="form-input"
              type="password"
              placeholder="Répéter le mot de passe"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? 'Enregistrement...' : 'Changer le mot de passe'}
          </button>
        </form>
      </div>
    </div>
  )
}
