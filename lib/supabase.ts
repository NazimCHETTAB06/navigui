import { createClient, SupabaseClient } from '@supabase/supabase-js'

/** Nettoie l’URL copiée depuis Vercel / Supabase (espaces, guillemets, suffixes en trop). */
export function normalizeSupabaseUrl(raw: string): string {
  let url = raw.trim().replace(/^['"]|['"]$/g, '')
  if (!url) return ''

  const dashboard = url.match(/project\/([a-z0-9]+)/i)
  if (dashboard) {
    url = `https://${dashboard[1]}.supabase.co`
  }

  if (!url.startsWith('http')) {
    url = `https://${url}`
  }

  url = url.replace(/\/(auth|rest|storage)\/v1\/?$/i, '')
  url = url.replace(/\/$/, '')

  return url
}

function normalizeKey(raw: string): string {
  return raw.trim().replace(/^['"]|['"]$/g, '')
}

const supabaseUrl = normalizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL ?? '')
const supabaseAnonKey = normalizeKey(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '')

const SUPABASE_URL_PATTERN = /^https:\/\/[a-z0-9-]+\.supabase\.co$/i

export function isSupabaseConfigured(): boolean {
  return SUPABASE_URL_PATTERN.test(supabaseUrl) && supabaseAnonKey.length > 20
}

export function getSupabaseConfigError(): string | null {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? ''
  if (!rawUrl || !supabaseAnonKey) {
    return 'Configuration Supabase manquante. Ajoutez NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY sur Vercel, puis redéployez.'
  }
  if (!SUPABASE_URL_PATTERN.test(supabaseUrl)) {
    return `URL Supabase invalide : « ${rawUrl.slice(0, 60)}${rawUrl.length > 60 ? '…' : ''} ». Valeur attendue : https://VOTRE_REF.supabase.co (Project Settings → API → Project URL).`
  }
  return null
}

export const supabase: SupabaseClient = createClient(
  supabaseUrl || 'https://invalid.supabase.co',
  supabaseAnonKey || 'invalid-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  },
)

export function formatSupabaseError(message: string): string {
  if (message.includes('Invalid path specified') || message.includes('requested path is invalid')) {
    return 'URL Supabase incorrecte sur Vercel. Vérifiez NEXT_PUBLIC_SUPABASE_URL = https://dcponrhichuvjcbnlojp.supabase.co (sans /auth/v1 à la fin), puis Redeploy.'
  }
  if (message.includes('row-level security') || message.includes('JWT')) {
    return 'Accès refusé. Connectez-vous sur /admin/login.'
  }
  if (message.includes('relation') && message.includes('does not exist')) {
    return 'Table properties introuvable. Exécutez supabase-setup.sql dans Supabase.'
  }
  return message
}

export type Property = {
  id: string
  title: string
  description: string
  price_per_night: number
  location: string
  bedrooms: number
  bathrooms: number
  max_persons: number
  phone: string
  whatsapp: string
  images: string[]
  amenities: string[]
  rating: number
  reviews_count: number
  verified: boolean
  created_at: string
}
