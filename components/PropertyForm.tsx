'use client'
import { useState } from 'react'
import { supabase, Property } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const AMENITIES = ['WiFi', 'Parking', 'Climatisation', 'Cuisine', 'Vue mer', 'Piscine', 'Jardin', 'Barbecue', 'Lave-linge', 'Télévision']
const AMENITY_ICONS: Record<string, string> = {
  'WiFi': '📶', 'Parking': '🅿️', 'Climatisation': '❄️', 'Cuisine': '🍴',
  'Vue mer': '🌊', 'Piscine': '🏊', 'Jardin': '🌿', 'Barbecue': '🔥',
  'Lave-linge': '🧺', 'Télévision': '📺'
}

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
    bedrooms: initial?.bedrooms?.toString() || '',
    bathrooms: initial?.bathrooms?.toString() || '',
    max_persons: initial?.max_persons?.toString() || '',
    phone: initial?.phone || '0664864918',
    whatsapp: initial?.whatsapp || '213664864918',
    amenities: initial?.amenities || [],
    rating: initial?.rating?.toString() || '5.0',
    reviews_count: initial?.reviews_count?.toString() || '0',
    verified: initial?.verified ?? true,
  })
  const [images, setImages] = useState<string[]>(initial?.images || [])
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function toggleAmenity(a: string) {
    setForm(f => ({
      ...f,
      amenities: f.amenities.includes(a) ? f.amenities.filter(x => x !== a) : [...f.amenities, a]
    }))
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    setUploading(true)
    const urls: string[] = []
    for (const file of files) {
      const ext = file.name.split('.').pop()
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { data, error } = await supabase.storage.from('property-images').upload(filename, file, { upsert: false })
      if (!error && data) {
        const { data: { publicUrl } } = supabase.storage.from('property-images').getPublicUrl(data.path)
        urls.push(publicUrl)
      }
    }
    setImages(prev => [...prev, ...urls])
    setUploading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    const payload = {
      title: form.title,
      description: form.description,
      price_per_night: Number(form.price_per_night),
      location: form.location,
      bedrooms: Number(form.bedrooms),
      bathrooms: Number(form.bathrooms),
      max_persons: Number(form.max_persons),
      phone: form.phone,
      whatsapp: form.whatsapp,
      amenities: form.amenities,
      images,
      rating: Number(form.rating),
      reviews_count: Number(form.reviews_count),
      verified: form.verified,
    }
    let err
    if (propertyId) {
      const res = await supabase.from('properties').update(payload).eq('id', propertyId)
      err = res.error
    } else {
      const res = await supabase.from('properties').insert([payload])
      err = res.error
    }
    if (err) {
      setError(err.message)
    } else {
      router.push('/admin')
    }
    setSaving(false)
  }

  return (
    <form onSubmit={handleSubmit} style={{ padding: '72px 16px 40px' }}>
      {error && (
        <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, padding: '12px 14px', marginBottom: 16, color: '#DC2626', fontSize: 14 }}>
          {error}
        </div>
      )}

      <div className="form-group">
        <label className="form-label">Titre *</label>
        <input className="form-input" placeholder="Villa moderne avec vue sur mer" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
      </div>

      <div className="form-group">
        <label className="form-label">Prix par nuit (DA) *</label>
        <input className="form-input" type="number" placeholder="7500" value={form.price_per_night} onChange={e => setForm(f => ({ ...f, price_per_night: e.target.value }))} required />
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
        <label className="form-label">Téléphone</label>
        <input className="form-input" type="tel" placeholder="0664864918" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} required />
      </div>

      <div className="form-group">
        <label className="form-label">Numéro WhatsApp (avec indicatif 213...)</label>
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
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--gray-bg)', border: '1.5px dashed var(--gray-border)', borderRadius: 10, padding: '12px 14px', cursor: 'pointer', fontSize: 14, color: 'var(--text-secondary)' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          {uploading ? 'Upload en cours...' : 'Ajouter des photos depuis ma galerie'}
          <input type="file" accept="image/*" multiple onChange={handleImageUpload} style={{ display: 'none' }} disabled={uploading} />
        </label>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, padding: '12px 14px', background: 'var(--gray-bg)', borderRadius: 10 }}>
        <input type="checkbox" id="verified" checked={form.verified} onChange={e => setForm(f => ({ ...f, verified: e.target.checked }))} style={{ width: 18, height: 18, accentColor: 'var(--blue)' }} />
        <label htmlFor="verified" style={{ fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>✅ Marquer comme vérifié</label>
      </div>

      <button className="btn-primary" type="submit" disabled={saving || uploading}>
        {saving ? 'Enregistrement...' : propertyId ? '✓ Enregistrer les modifications' : '+ Publier l\'appartement'}
      </button>
    </form>
  )
}
