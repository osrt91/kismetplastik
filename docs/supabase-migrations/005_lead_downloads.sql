-- Lead downloads table for resource download tracking
-- Stores lead information captured when users download resources/guides

CREATE TABLE IF NOT EXISTS lead_downloads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  resource_id TEXT NOT NULL,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE lead_downloads ENABLE ROW LEVEL SECURITY;

-- Only admins can read lead data; no public access
CREATE POLICY "Admins can read lead_downloads"
  ON lead_downloads
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Service role (API routes) can insert lead data
CREATE POLICY "Service can insert lead_downloads"
  ON lead_downloads
  FOR INSERT
  WITH CHECK (true);

-- Index on email for analytics queries
CREATE INDEX IF NOT EXISTS idx_lead_downloads_email ON lead_downloads (email);

-- Index on resource_id for per-resource analytics
CREATE INDEX IF NOT EXISTS idx_lead_downloads_resource_id ON lead_downloads (resource_id);

-- Index on created_at for time-based reporting
CREATE INDEX IF NOT EXISTS idx_lead_downloads_created_at ON lead_downloads (created_at DESC);
