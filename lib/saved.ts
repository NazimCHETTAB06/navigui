const STORAGE_KEY = 'navigui-saved'

export function getSavedIds(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as string[]) : []
  } catch {
    return []
  }
}

export function setSavedIds(ids: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
}

export function toggleSavedId(id: string): string[] {
  const ids = getSavedIds()
  const next = ids.includes(id) ? ids.filter(x => x !== id) : [...ids, id]
  setSavedIds(next)
  return next
}
