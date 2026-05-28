'use client'
import { useState } from 'react'
import SiteHeader from '@/components/SiteHeader'

const FAQ = [
  { q: 'Comment réserver un logement ?', a: 'Choisissez un bien sur l’accueil, puis contactez le propriétaire par téléphone ou WhatsApp.' },
  { q: 'Où se trouvent les logements ?', a: 'À Béni Ksila et environs, wilaya de Béjaïa.' },
  { q: 'Les annonces sont-elles vérifiées ?', a: 'Les biens marqués « Vérifié » ont été validés par l’équipe Navigui.' },
  { q: 'Comment publier mon appartement ?', a: 'Profil → Administration → ajoutez votre annonce avec photos.' },
]

export default function AssistantPage() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <>
      <SiteHeader />
      <main className="page-main">
        <h1 className="page-title">Assistant</h1>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 20 }}>Questions fréquentes</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {FAQ.map((item, i) => (
            <div key={i} className="admin-card">
              <button type="button" onClick={() => setOpen(open === i ? null : i)} className="faq-btn">
                {item.q}
                <span>{open === i ? '−' : '+'}</span>
              </button>
              {open === i && <p className="faq-answer">{item.a}</p>}
            </div>
          ))}
        </div>
      </main>
    </>
  )
}
