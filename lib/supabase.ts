import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

export function isSupabaseConfigured(): boolean {
  return (
    supabaseUrl.startsWith('https://') &&
    supabaseUrl.includes('supabase.co') &&
    supabaseAnonKey.length > 20
  )
}

export function getSupabaseConfigError(): string | null {
  if (!supabaseUrl || !supabaseAnonKey) {
    return 'Configuration Supabase manquante. Définissez NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY dans Vercel (Settings → Environment Variables) puis redéployez.'
  }
  if (!supabaseUrl.includes('supabase.co')) {
    return 'NEXT_PUBLIC_SUPABASE_URL est invalide. Utilisez l’URL du projet Supabase (https://xxxx.supabase.co).'
  }
  return null
}

export const supabase: SupabaseClient = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
)

export function formatSupabaseError(message: string): string {
  if (message.includes('Invalid path specified')) {
    return 'Erreur Supabase : URL ou bucket Storage invalide. Vérifiez les variables d’environnement sur Vercel et exécutez supabase-setup.sql (bucket property-images).'
  }
  if (message.includes('row-level security') || message.includes('JWT')) {
    return 'Accès refusé. Connectez-vous sur /admin/login avant d’ajouter un appartement.'
  }
  if (message.includes('relation') && message.includes('does not exist')) {
    return 'Table properties introuvable. Exécutez le script supabase-setup.sql dans Supabase → SQL Editor.'
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
