import { supabase } from '@/lib/supabase'

const ADMIN_PHONE_DIGITS = '0664864918'
const DEFAULT_ADMIN_EMAIL = 'admin@navigui.com'

/** Email ou téléphone admin → email Supabase */
export function resolveLoginEmail(identifier: string): string {
  const trimmed = identifier.trim()
  if (trimmed.includes('@')) return trimmed.toLowerCase()
  const digits = trimmed.replace(/\D/g, '')
  if (digits === ADMIN_PHONE_DIGITS || digits === `213${ADMIN_PHONE_DIGITS.slice(1)}`) {
    return process.env.NEXT_PUBLIC_ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL
  }
  return trimmed
}

export function formatAuthError(message: string): string {
  if (message.includes('Invalid path specified') || message.includes('requested path is invalid')) {
    return 'URL Supabase invalide sur Vercel. Project Settings → API → copiez « Project URL » exactement (ex. https://dcponrhichuvjcbnlojp.supabase.co), sans guillemets ni /auth/v1, puis Redeploy.'
  }
  if (message.includes('Invalid login credentials')) {
    return 'Email ou mot de passe incorrect. Utilisez le mot de passe défini dans Supabase → Authentication → Users.'
  }
  if (message.includes('Email not confirmed')) {
    return 'Email non confirmé. Dans Supabase → Users, confirmez l’utilisateur ou désactivez « Confirm email ».'
  }
  return message
}

export async function getAdminSession() {
  const { data: { session } } = await supabase.auth.getSession()
  return session
}
