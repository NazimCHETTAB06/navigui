import { Property } from '@/lib/supabase'

export const SAMPLE_PROPERTIES: Property[] = [
  {
    id: 'sample-1',
    title: 'Villa moderne avec vue sur mer',
    description: 'Magnifique villa moderne avec une vue imprenable sur la mer. Idéal pour les familles et groupes. Proche de la plage. Quartier calme et sécurisé.',
    price_per_night: 7500,
    location: 'Béni Ksila, Béjaïa',
    bedrooms: 5,
    bathrooms: 3,
    max_persons: 12,
    phone: '0555123456',
    whatsapp: '213555123456',
    images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80'],
    amenities: ['WiFi', 'Parking', 'Climatisation', 'Cuisine', 'Vue mer', 'Piscine'],
    rating: 4.9,
    reviews_count: 48,
    verified: true,
    created_at: '',
  },
  {
    id: 'sample-2',
    title: 'Appartement cosy près de la plage',
    description: 'Bel appartement lumineux à 5 minutes de la plage. Terrasse avec vue panoramique.',
    price_per_night: 4500,
    location: 'Béni Ksila, Béjaïa',
    bedrooms: 2,
    bathrooms: 1,
    max_persons: 4,
    phone: '0555123456',
    whatsapp: '213555123456',
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80'],
    amenities: ['WiFi', 'Climatisation', 'Vue mer'],
    rating: 4.7,
    reviews_count: 36,
    verified: true,
    created_at: '',
  },
  {
    id: 'sample-3',
    title: 'Studio avec terrasse et vue mer',
    description: 'Studio moderne avec grande terrasse. Vue imprenable sur la mer Méditerranée.',
    price_per_night: 3800,
    location: 'Béni Ksila, Béjaïa',
    bedrooms: 1,
    bathrooms: 1,
    max_persons: 2,
    phone: '0555123456',
    whatsapp: '213555123456',
    images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80'],
    amenities: ['WiFi', 'Vue mer', 'Climatisation'],
    rating: 4.6,
    reviews_count: 22,
    verified: false,
    created_at: '',
  },
]

export function filterProperties(
  properties: Property[],
  filters: { minPrice: string; maxPrice: string; bedrooms: string; amenity: string },
) {
  return properties.filter(p => {
    if (filters.minPrice && p.price_per_night < Number(filters.minPrice)) return false
    if (filters.maxPrice && p.price_per_night > Number(filters.maxPrice)) return false
    if (filters.bedrooms) {
      const min = filters.bedrooms === '5+' ? 5 : Number(filters.bedrooms)
      if (p.bedrooms < min) return false
    }
    if (filters.amenity && !p.amenities.includes(filters.amenity)) return false
    return true
  })
}
