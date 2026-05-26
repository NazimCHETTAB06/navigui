import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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
