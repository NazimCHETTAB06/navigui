'use client'
import { useState } from 'react'
import { supabase, Property, getSupabaseConfigError, formatSupabaseError, isSupabaseConfigured } from '@/lib/supabase'
import { uploadPropertyImage } from '@/lib/upload'
import { AMENITIES, AMENITY_ICONS } from '@/lib/constants'
import { useRouter } from 'next/navigation'

type FormData = {
  title: string
  description: string
  price_per_night: string
  location: string
  bedrooms: string
  bathrooms: string
  max_persons: string
  phone: string
  whatsapp: string
  amenities: string[]
  rating: string
  reviews_count: string
  verified: boolean
}

export default function PropertyForm({ initial, propertyId }: { initial?: Partial<Property>; propertyId?: string }) {
  const router = useRouter()
  const [form, setForm] = useState<FormData>({
    title: initial?.title || '',
    description: initial?.description || '',
    price_per_night: initial?.price_per_night?.toString() || '',
    location: initial?.location || 'Béni Ksila, Béjaïa',
    bedrooms: initial?.bedrooms?.toString() || '1',
    bathrooms: initial?.bathrooms?.toString() || '1',
    max_persons: initial?.max_persons?.toString() || '2',
    phone: initial?.phone || '',
    whatsapp: initial?.whatsapp || '',
    amenities: initial?.amenities || [],
    rating: initial?.rating?.toString() || '5.0',
    reviews_count: initial?.reviews_count?.toString() || '0',
    verified: initial?.verified ?? true,
  })
  const [images, setImages] = useState<string[]>(initial?.images || [])
  const [imageUrlInput, setImageUrlInput] = useState('')
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [uploadWarning, setUploadWarning] = useState('')

  function toggleAmenity(a: string) {
    setForm(f => ({
      ...f,
      amenities: f.amenities.includes(a) ? f.amenities.filter(x => x !== a) : [...f.amenities, a],
    }))
  }

  function addImageUrl() {
    const url = imageUrlInput.trim()
    if (!url) return
    try {
      new URL(url)
      setImages(prev => [...prev, url])
      setImageUrlInput('')
      setUploadWarning('')
    } catch {
      setUploadWarning('URL invalide. Exemple : https://images.unsplash.com/photo-...')
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    if (!files.length) return

    const configErr = getSupabaseConfigError()
    if (configErr) {
      setError(configErr)
      return
    }

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      setError('Session expirée. Reconnectez-vous sur /admin/login.')
      return
    }

    setUploading(true)
    setUploadWarning('')
    const urls: string[] = []
    const failures: string[] = []

    for (const file of files) {
      const { url, error: uploadErr } = await uploadPropertyImage(file)
      if (url) urls.push(url)
      else failures.push(uploadErr || 'Échec upload')
    }

    if (urls.length) setImages(prev => [...prev, ...urls])
    if (failures.length) {
      setUploadWarning(
        failures.length === files.length
          ? `Upload impossible : ${formatSupabaseError(failures[0])}. Collez des liens URL ci-dessous ou exécutez supabase-setup.sql.`
          : `${failures.length} photo(s) non uploadée(s). Les autres ont été ajoutées.`,
      )
    }
    setUploading(false)
    e.target.value = ''
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')

    const configErr = getSupabaseConfigError()
    if (configErr) {
      setError(configErr)
      setSaving(false)
      return
    }

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      setError('Vous devez être connecté. Allez sur /admin/login.')
      setSaving(false)
      return
    }

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      price_per_night: Number(form.price_per_night),
      location: form.location.trim(),
      bedrooms: Number(form.bedrooms),
      bathrooms: Number(form.bathrooms),
      max_persons: Number(form.max_persons),
      phone: form.phone.trim(),
      whatsapp: form.whatsapp.trim() || form.phone.replace(/\D/g, ''),
      amenities: form.amenities,
      images,
      rating: Number(form.rating) || 5,
      reviews_count: Number(form.reviews_count) || 0,
      verified: form.verified,
    }

    const res = propertyId
      ? await supabase.from('properties').update(payload).eq('id', propertyId)
      : await supabase.from('properties').insert([payload])

    if (res.error) {
      setError(formatSupabaseError(res.error.message))
    } else {
      router.push('/admin')
    }
    setSaving(false)
  }

  return (
    <form onSubmit={handleSubmit} style={{ padding: '72px 16px 40px' }}>
      {!isSupabaseConfigured() && (
        <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 10, padding: '12px 14px', marginBottom: 16, color: '#92400E', fontSize: 13 }}>
          {getSupabaseConfigError()}
        </div>
      )}

      {error && (
        <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, padding: '12px 14px', marginBottom: 16, color: '#DC2626', fontSize: 14 }}>
          {error}
        </div>
      )}

      {uploadWarning && (
        <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 10, padding: '12px 14px', marginBottom: 16, color: '#92400E', fontSize: 13 }}>
          {uploadWarning}
        </div>
      )}

      <div className="form-group">
        <label className="form-label">Titre *</label>
        <input className="form-input" placeholder="Villa moderne avec vue sur mer" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
      </div>

      <div className="form-group">
        <label className="form-label">Prix par nuit (DA) *</label>
        <input className="form-input" type="number" min="0" placeholder="7500" value={form.price_per_night} onChange={e => setForm(f => ({ ...f, price_per_night: e.target.value }))} required />
      </div>

      <div className="form-group">
        <label className="form-label">Description *</label>
        <textarea className="form-textarea" placeholder="Décrivez votre bien..." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} required />
      </div>

      <div className="form-group">
        <label className="form-label">Localisation</label>
        <input className="form-input" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 16 }}>
        <div>
          <label className="form-label">Chambres</label>
          <input className="form-input" type="number" min="1" value={form.bedrooms} onChange={e => setForm(f => ({ ...f, bedrooms: e.target.value }))} required />
        </div>
        <div>
          <label className="form-label">SDB</label>
          <input className="form-input" type="number" min="1" value={form.bathrooms} onChange={e => setForm(f => ({ ...f, bathrooms: e.target.value }))} required />
        </div>
        <div>
          <label className="form-label">Personnes</label>
          <input className="form-input" type="number" min="1" value={form.max_persons} onChange={e => setForm(f => ({ ...f, max_persons: e.target.value }))} required />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Téléphone *</label>
        <input className="form-input" type="tel" placeholder="0664864918" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} required />
      </div>

      <div className="form-group">
        <label className="form-label">Numéro WhatsApp (indicatif 213...)</label>
        <input className="form-input" type="tel" placeholder="213664864918" value={form.whatsapp} onChange={e => setForm(f => ({ ...f, whatsapp: e.target.value }))} />
      </div>

      <div className="form-group">
        <label className="form-label">Équipements</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {AMENITIES.map(a => (
            <div key={a}>
              <input type="checkbox" className="amenity-checkbox" id={`am-${a}`} checked={form.amenities.includes(a)} onChange={() => toggleAmenity(a)} />
              <label className="amenity-label" htmlFor={`am-${a}`}>{AMENITY_ICONS[a]} {a}</label>
            </div>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Photos</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 10 }}>
          {images.map((url, i) => (
            <div key={i} style={{ position: 'relative' }}>
              <img src={url} alt="" style={{ width: '100%', height: 90, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--gray-border)' }} />
              <button type="button" onClick={() => setImages(imgs => imgs.filter((_, j) => j !== i))}
                style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', borderRadius: '50%', width: 22, height: 22, cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                ×
              </button>
            </div>
          ))}
        </div>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--gray-bg)', border: '1.5px dashed var(--gray-border)', borderRadius: 10, padding: '12px 14px', cursor: 'pointer', fontSize: 14, color: 'var(--text-secondary)', marginBottom: 10 }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          {uploading ? 'Upload en cours...' : 'Ajouter des photos depuis ma galerie'}
          <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple onChange={handleImageUpload} style={{ display: 'none' }} disabled={uploading} />
        </label>
        <div style={{ display: 'flex', gap: 8 }}>
          <input className="form-input" placeholder="https://... (lien image)" value={imageUrlInput} onChange={e => setImageUrlInput(e.target.value)} style={{ flex: 1 }} />
          <button type="button" className="btn-edit" onClick={addImageUrl}>Ajouter URL</button>
        </div>
        <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 6 }}>Les photos sont optionnelles. Vous pouvez publier sans image ou coller un lien Unsplash.</p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, padding: '12px 14px', background: 'var(--gray-bg)', borderRadius: 10 }}>
        <input type="checkbox" id="verified" checked={form.verified} onChange={e => setForm(f => ({ ...f, verified: e.target.checked }))} style={{ width: 18, height: 18, accentColor: 'var(--blue)' }} />
        <label htmlFor="verified" style={{ fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Marquer comme vérifié</label>
      </div>

      <button className="btn-primary" type="submit" disabled={saving || uploading}>
        {saving ? 'Enregistrement...' : propertyId ? 'Enregistrer les modifications' : '+ Publier l\'appartement'}
      </button>
    </form>
  )
}
