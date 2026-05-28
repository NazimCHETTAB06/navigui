'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const TABS = [
  { href: '/', label: 'ACCUEIL', icon: 'home' },
  { href: '/saved', label: 'ENREGISTRÉS', icon: 'bookmark' },
  { href: '/assistant', label: 'ASSISTANT', icon: 'bot' },
  { href: '/profil', label: 'PROFIL', icon: 'user' },
] as const

function TabIcon({ type, active }: { type: string; active: boolean }) {
  const c = active ? 'var(--blue)' : 'var(--text-primary)'
  if (type === 'home') {
    return (
      <svg viewBox="0 0 24 24" width="22" height="22" fill={active ? c : 'none'} stroke={c} strokeWidth="1.8">
        <path d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V9.5z" />
      </svg>
    )
  }
  if (type === 'bookmark') {
    return (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke={c} strokeWidth="1.8">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
    )
  }
  if (type === 'bot') {
    return (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke={c} strokeWidth="1.8">
        <rect x="4" y="10" width="16" height="10" rx="2" />
        <circle cx="9" cy="15" r="1" fill={c} />
        <circle cx="15" cy="15" r="1" fill={c} />
        <path d="M12 10V6M8 6h8" />
        <circle cx="12" cy="4" r="2" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke={c} strokeWidth="1.8">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

export default function SiteHeader({ onSearchClick }: { onSearchClick?: () => void }) {
  const pathname = usePathname()

  return (
    <header className="site-header">
      <div className="site-header-top">
        <Link href="/" className="logo">navigui</Link>
        {onSearchClick ? (
          <button type="button" className="header-search-btn" onClick={onSearchClick} aria-label="Rechercher">
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--text-primary)" strokeWidth="2" width="22" height="22">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
          </button>
        ) : (
          <div style={{ width: 40 }} />
        )}
      </div>
      <nav className="site-tabs">
        {TABS.map(tab => {
          const active = tab.href === '/' ? pathname === '/' : pathname.startsWith(tab.href)
          return (
            <Link key={tab.href} href={tab.href} className={`site-tab ${active ? 'active' : ''}`}>
              <TabIcon type={tab.icon} active={active} />
              <span>{tab.label}</span>
            </Link>
          )
        })}
      </nav>
    </header>
  )
}
