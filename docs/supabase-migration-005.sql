-- Migration 005: Invoices table
-- Fatura sistemi icin tablo ve politikalar

CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL,
  invoice_number TEXT UNIQUE NOT NULL,
  company_name TEXT NOT NULL,
  company_address TEXT,
  tax_number TEXT,
  tax_office TEXT,
  subtotal NUMERIC(12,2) NOT NULL,
  tax_rate NUMERIC(5,2) DEFAULT 20.00,
  tax_amount NUMERIC(12,2) NOT NULL,
  total_amount NUMERIC(12,2) NOT NULL,
  pdf_url TEXT,
  storage_path TEXT,
  status TEXT DEFAULT 'issued' CHECK (status IN ('draft','issued','paid','cancelled')),
  issued_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Dealers can read their own invoices
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Dealers can read own invoices' AND tablename = 'invoices'
  ) THEN
    CREATE POLICY "Dealers can read own invoices" ON invoices
      FOR SELECT USING (auth.uid() = profile_id);
  END IF;
END $$;

-- Admin full access
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Admin full access on invoices' AND tablename = 'invoices'
  ) THEN
    CREATE POLICY "Admin full access on invoices" ON invoices
      FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
      );
  END IF;
END $$;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_invoices_order_id ON invoices(order_id);
CREATE INDEX IF NOT EXISTS idx_invoices_profile_id ON invoices(profile_id);
CREATE INDEX IF NOT EXISTS idx_invoices_invoice_number ON invoices(invoice_number);
