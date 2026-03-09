-- Dealer-DIA Cari Mapping
-- Links Supabase dealer profiles to DIA cari accounts

CREATE TABLE IF NOT EXISTS dealer_cari_mappings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  dia_cari_kodu VARCHAR(50) NOT NULL,
  dia_cari_unvan VARCHAR(255),
  is_approved BOOLEAN DEFAULT false,
  price_type VARCHAR(20) DEFAULT 'standard',  -- 'standard', 'pesin', 'vadeli', 'ozel'
  can_direct_order BOOLEAN DEFAULT false,      -- true = skip admin approval
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(profile_id),
  UNIQUE(dia_cari_kodu)
);

-- RLS
ALTER TABLE dealer_cari_mappings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Dealers can read their own mapping"
  ON dealer_cari_mappings FOR SELECT
  USING (profile_id = auth.uid());

CREATE POLICY "Admins can manage all mappings"
  ON dealer_cari_mappings FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Index
CREATE INDEX idx_dealer_cari_profile ON dealer_cari_mappings(profile_id);
CREATE INDEX idx_dealer_cari_kodu ON dealer_cari_mappings(dia_cari_kodu);
