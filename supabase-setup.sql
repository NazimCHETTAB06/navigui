-- ============================================================
-- NAVIGUI - Script SQL Supabase
-- Copier-coller ce code dans Supabase > SQL Editor > New Query
-- ============================================================

-- 1. Créer la table properties
CREATE TABLE IF NOT EXISTS properties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price_per_night INTEGER NOT NULL,
  location TEXT DEFAULT 'Béni Ksila, Béjaïa',
  bedrooms INTEGER DEFAULT 1,
  bathrooms INTEGER DEFAULT 1,
  max_persons INTEGER DEFAULT 2,
  phone TEXT,
  whatsapp TEXT,
  images TEXT[] DEFAULT '{}',
  amenities TEXT[] DEFAULT '{}',
  rating NUMERIC(2,1) DEFAULT 5.0,
  reviews_count INTEGER DEFAULT 0,
  verified BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Activer Row Level Security
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- 3. Politique : tout le monde peut LIRE
CREATE POLICY "Public read" ON properties
  FOR SELECT USING (true);

-- 4. Politique : seul l'admin connecté peut ÉCRIRE/MODIFIER/SUPPRIMER
CREATE POLICY "Admin insert" ON properties
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin update" ON properties
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin delete" ON properties
  FOR DELETE USING (auth.role() = 'authenticated');

-- 5. Créer le bucket pour les photos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('property-images', 'property-images', true)
ON CONFLICT (id) DO NOTHING;

-- 6. Politique storage : lecture publique
CREATE POLICY "Public image read" ON storage.objects
  FOR SELECT USING (bucket_id = 'property-images');

-- 7. Politique storage : upload par admin seulement
CREATE POLICY "Admin image upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'property-images' AND auth.role() = 'authenticated');

CREATE POLICY "Admin image delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'property-images' AND auth.role() = 'authenticated');

-- ============================================================
-- APRÈS avoir exécuté ce script :
-- 1. Aller dans Supabase > Authentication > Users
-- 2. Cliquer "Add User" (Invite User)
-- 3. Email : admin@navigui.com
-- 4. Password : nazim06
-- 5. Confirmer
-- ============================================================
