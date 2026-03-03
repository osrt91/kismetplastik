-- Migration 004: saved_designs table for 2D/3D visualizer
-- Stores user-customized product designs (color, logo, text overlays)

CREATE TABLE IF NOT EXISTS saved_designs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  name TEXT NOT NULL DEFAULT 'Untitled Design',
  design_data JSONB NOT NULL DEFAULT '{}',
  preview_url TEXT,
  is_public BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_saved_designs_user ON saved_designs(user_id);
CREATE INDEX idx_saved_designs_product ON saved_designs(product_id);
CREATE INDEX idx_saved_designs_public ON saved_designs(is_public) WHERE is_public = true;
CREATE INDEX idx_saved_designs_created ON saved_designs(created_at DESC);

-- Enable RLS
ALTER TABLE saved_designs ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can read own designs"
  ON saved_designs FOR SELECT
  USING (auth.uid() = user_id OR is_public = true);

CREATE POLICY "Users can create own designs"
  ON saved_designs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own designs"
  ON saved_designs FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own designs"
  ON saved_designs FOR DELETE
  USING (auth.uid() = user_id);

-- Admin full access
CREATE POLICY "Admins can manage all designs"
  ON saved_designs FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Auto-update updated_at
CREATE TRIGGER set_saved_designs_updated_at
  BEFORE UPDATE ON saved_designs
  FOR EACH ROW
  EXECUTE FUNCTION moddatetime(updated_at);
