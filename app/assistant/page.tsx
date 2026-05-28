'use client'
import { useState } from 'react'
import BottomNav from '@/components/BottomNav'

const FAQ = [
  {
    q: 'Comment réserver un logement ?',
    a: 'Choisissez un bien sur l’accueil, puis contactez le propriétaire par téléphone ou WhatsApp. La réservation se fait directement avec lui.',
  },
  {
    q: 'Où se trouvent les logements ?',
    a: 'Tous les biens listés sont à Béni Ksila et environs, wilaya de Béjaïa.',
  },
  {
    q: 'Les annonces sont-elles vérifiées ?',
    a: 'Les biens marqués « Vérifié » ont été validés par l’équipe Navigui.',
  },
  {
    q: 'Comment publier mon appartement ?',
    a: 'Connectez-vous à l’espace admin via Profil → Administration, puis ajoutez votre annonce avec photos et description.',
  },
]

export default function AssistantPage() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <>
      <header className="top-header">
        <span className="logo">navigui</span>
        <div style={{ width: 40 }} />
      </header>

      <main className="page-main">
        <h1 className="page-title">Assistant</h1>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 20 }}>
          Réponses aux questions fréquentes sur Navigui.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {FAQ.map((item, i) => (
            <div key={i} className="admin-card">
              <button
                type="button"
                onClick={() => setOpen(open === i ? null : i)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '14px 16px',
                  background: 'none',
                  border: 'none',
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                {item.q}
                <span style={{ color: 'var(--blue)', fontSize: 18 }}>{open === i ? '−' : '+'}</span>
              </button>
              {open === i && (
                <p style={{ padding: '0 16px 14px', fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {item.a}
                </p>
              )}
            </div>
          ))}
        </div>

        <div style={{ marginTop: 24, padding: 16, background: 'var(--blue-light)', borderRadius: 12 }}>
          <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Besoin d’aide ?</p>
          <a href="https://wa.me/213664864918" target="_blank" rel="noreferrer" className="btn-primary" style={{ textDecoration: 'none' }}>
            Contacter sur WhatsApp
          </a>
        </div>
      </main>

      <BottomNav />
    </>
  )
}
