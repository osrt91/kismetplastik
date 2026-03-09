-- Product Compatibility Rules
-- Defines which products are compatible (e.g., bottle -> matching caps/stoppers)

CREATE TABLE IF NOT EXISTS product_compatibility (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  source_stock_kodu VARCHAR(50) NOT NULL,
  source_category VARCHAR(50) NOT NULL,
  compatible_stock_kodu VARCHAR(50) NOT NULL,
  compatible_category VARCHAR(50) NOT NULL,
  compatibility_type VARCHAR(30) DEFAULT 'fits',
  notes TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE product_compatibility ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read compatibility"
  ON product_compatibility FOR SELECT USING (true);

CREATE POLICY "Admins can manage compatibility"
  ON product_compatibility FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE INDEX idx_compat_source ON product_compatibility(source_stock_kodu);
CREATE INDEX idx_compat_target ON product_compatibility(compatible_stock_kodu);
CREATE INDEX idx_compat_category ON product_compatibility(source_category, compatible_category);
