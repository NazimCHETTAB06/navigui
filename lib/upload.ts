import { supabase } from '@/lib/supabase'

const ALLOWED_EXT = new Set(['jpg', 'jpeg', 'png', 'webp', 'gif'])

export function safeStoragePath(file: File): string {
  const raw = file.name.split('.').pop()?.toLowerCase() ?? ''
  const ext = ALLOWED_EXT.has(raw) ? raw : 'jpg'
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
  return `uploads/${id}.${ext}`
}

export async function uploadPropertyImage(file: File): Promise<{ url?: string; error?: string }> {
  const path = safeStoragePath(file)
  const { data, error } = await supabase.storage
    .from('property-images')
    .upload(path, file, { upsert: false, contentType: file.type || undefined })

  if (error) {
    return { error: error.message }
  }

  const { data: urlData } = supabase.storage.from('property-images').getPublicUrl(data.path)
  return { url: urlData.publicUrl }
}
