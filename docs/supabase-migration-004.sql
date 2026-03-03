-- Migration 004: Sample Requests table
-- Stores numune (sample) requests submitted via /numune-talep form

CREATE TABLE IF NOT EXISTS sample_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  company TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT,
  products TEXT[] NOT NULL,
  quantity TEXT,
  notes TEXT,
  delivery_address TEXT,
  urgency TEXT DEFAULT 'normal',
  preferred_date DATE,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE sample_requests ENABLE ROW LEVEL SECURITY;

-- Allow authenticated admins to read all sample requests
CREATE POLICY "Admins can view all sample requests"
  ON sample_requests
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Allow anonymous inserts (public form submissions)
CREATE POLICY "Anyone can insert sample requests"
  ON sample_requests
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Index for admin dashboard queries
CREATE INDEX idx_sample_requests_status ON sample_requests (status);
CREATE INDEX idx_sample_requests_created_at ON sample_requests (created_at DESC);
