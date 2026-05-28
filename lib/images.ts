/** URL allégée pour affichage rapide (Supabase transform ou paramètres Unsplash). */
export function optimizeImageUrl(url: string, width = 800, quality = 75): string {
  if (!url) return url

  try {
    const u = new URL(url)

    if (u.hostname.includes('supabase.co') && u.pathname.includes('/storage/v1/object/public/')) {
      const renderPath = u.pathname.replace(
        '/storage/v1/object/public/',
        '/storage/v1/render/image/public/',
      )
      return `${u.origin}${renderPath}?width=${width}&quality=${quality}&resize=cover`
    }

    if (u.hostname.includes('unsplash.com')) {
      u.searchParams.set('w', String(width))
      u.searchParams.set('q', String(quality))
      u.searchParams.set('auto', 'format')
      return u.toString()
    }
  } catch {
    return url
  }

  return url
}
