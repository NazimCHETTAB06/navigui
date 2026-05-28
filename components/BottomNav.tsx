'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const ITEMS = [
  { href: '/', label: 'ACCUEIL', icon: 'home' },
  { href: '/saved', label: 'ENREGISTRÉS', icon: 'bookmark' },
  { href: '/assistant', label: 'ASSISTANT', icon: 'assistant' },
  { href: '/profil', label: 'PROFIL', icon: 'profile' },
] as const

function NavIcon({ type }: { type: string }) {
  if (type === 'home') {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" stroke="none">
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
      </svg>
    )
  }
  if (type === 'bookmark') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
    )
  }
  if (type === 'assistant') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <rect x="3" y="11" width="18" height="10" rx="2" />
        <circle cx="12" cy="5" r="2" />
        <path d="M12 7v4" />
        <line x1="8" y1="16" x2="8" y2="16" />
        <line x1="16" y1="16" x2="16" y2="16" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="bottom-nav">
      {ITEMS.map(item => {
        const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
        return (
          <Link key={item.href} href={item.href} className={`nav-item ${active ? 'active' : ''}`}>
            <NavIcon type={item.icon} />
            <span>{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
