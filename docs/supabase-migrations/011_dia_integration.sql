-- Migration 011: DIA ERP Integration Tables

-- Stock mapping: DIA stock code <-> site product slug
CREATE TABLE IF NOT EXISTS dia_stock_mappings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dia_stock_code TEXT NOT NULL,
  dia_stock_id INTEGER NOT NULL,
  product_slug TEXT NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT true,
  last_synced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_dia_stock_mappings_code ON dia_stock_mappings(dia_stock_code);
CREATE INDEX IF NOT EXISTS idx_dia_stock_mappings_slug ON dia_stock_mappings(product_slug);

-- Sync logs
CREATE TABLE IF NOT EXISTS dia_sync_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sync_type TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'success', 'failed')),
  records_synced INTEGER DEFAULT 0,
  records_failed INTEGER DEFAULT 0,
  error_details TEXT[],
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_dia_sync_logs_type ON dia_sync_logs(sync_type);
CREATE INDEX IF NOT EXISTS idx_dia_sync_logs_created ON dia_sync_logs(created_at DESC);

-- RLS
ALTER TABLE dia_stock_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE dia_sync_logs ENABLE ROW LEVEL SECURITY;

-- Add DIA settings to site_settings defaults
INSERT INTO site_settings (key, value, "group") VALUES
  ('dia_api_url', '', 'dia'),
  ('dia_company_code', '', 'dia'),
  ('dia_username', '', 'dia'),
  ('dia_password', '', 'dia'),
  ('dia_firm_id', '1', 'dia'),
  ('dia_period_id', '1', 'dia'),
  ('dia_last_stock_sync', '', 'dia'),
  ('dia_last_cari_sync', '', 'dia')
ON CONFLICT (key) DO NOTHING;
