import { supabase } from '@/lib/supabase'

const ALLOWED_EXT = new Set(['jpg', 'jpeg', 'png', 'webp', 'gif'])
const MAX_WIDTH = 1600
const JPEG_QUALITY = 0.82

export function safeStoragePath(file: File): string {
  const raw = file.name.split('.').pop()?.toLowerCase() ?? ''
  const ext = ALLOWED_EXT.has(raw) ? raw : 'jpg'
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
  return `uploads/${id}.${ext === 'jpeg' ? 'jpg' : ext}`
}

/** Réduit la taille avant upload pour un affichage plus rapide. */
export async function compressImage(file: File): Promise<File> {
  if (!file.type.startsWith('image/') || file.size < 400_000) return file

  try {
    const bitmap = await createImageBitmap(file)
    const scale = Math.min(1, MAX_WIDTH / bitmap.width)
    const w = Math.round(bitmap.width * scale)
    const h = Math.round(bitmap.height * scale)
    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')
    if (!ctx) return file
    ctx.drawImage(bitmap, 0, 0, w, h)
    bitmap.close()

    const blob = await new Promise<Blob | null>(resolve =>
      canvas.toBlob(resolve, 'image/jpeg', JPEG_QUALITY),
    )
    if (!blob) return file

    const name = file.name.replace(/\.[^.]+$/, '.jpg')
    return new File([blob], name, { type: 'image/jpeg' })
  } catch {
    return file
  }
}

export async function uploadPropertyImage(file: File): Promise<{ url?: string; error?: string }> {
  const compressed = await compressImage(file)
  const path = safeStoragePath(compressed)
  const { data, error } = await supabase.storage
    .from('property-images')
    .upload(path, compressed, { upsert: false, contentType: 'image/jpeg' })

  if (error) {
    return { error: error.message }
  }

  const { data: urlData } = supabase.storage.from('property-images').getPublicUrl(data.path)
  return { url: urlData.publicUrl }
}
