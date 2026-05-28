'use client'
import { AMENITY_ICONS } from '@/lib/constants'

export type Filters = {
  minPrice: string
  maxPrice: string
  bedrooms: string
  amenity: string
}

export default function SearchPanel({
  filters,
  setFilters,
  onClose,
  onApply,
}: {
  filters: Filters
  setFilters: React.Dispatch<React.SetStateAction<Filters>>
  onClose: () => void
  onApply: () => void
}) {
  return (
    <div className="search-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="search-panel">
        <div className="search-handle" />
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Filtres</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Prix min (DA)</label>
            <input className="form-input" type="number" placeholder="0" value={filters.minPrice} onChange={e => setFilters(f => ({ ...f, minPrice: e.target.value }))} />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Prix max (DA)</label>
            <input className="form-input" type="number" placeholder="20000" value={filters.maxPrice} onChange={e => setFilters(f => ({ ...f, maxPrice: e.target.value }))} />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Chambres minimum</label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {['1', '2', '3', '4', '5+'].map(n => (
              <button
                key={n}
                type="button"
                className={`filter-pill ${filters.bedrooms === n ? 'active' : ''}`}
                onClick={() => setFilters(f => ({ ...f, bedrooms: f.bedrooms === n ? '' : n }))}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Équipements</label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {Object.entries(AMENITY_ICONS).map(([name, icon]) => (
              <button
                key={name}
                type="button"
                className={`filter-pill ${filters.amenity === name ? 'active' : ''}`}
                onClick={() => setFilters(f => ({ ...f, amenity: f.amenity === name ? '' : name }))}
              >
                {icon} {name}
              </button>
            ))}
          </div>
        </div>

        <button type="button" className="btn-primary" onClick={onApply}>
          Rechercher
        </button>
      </div>
    </div>
  )
}
