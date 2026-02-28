-- Kısmet Plastik B2B — Migration 002: Bayi Portal & Sipariş Sistemi
-- Bu SQL'i Supabase Dashboard > SQL Editor'a yapıştırın.

-- Rol enum'u
CREATE TYPE user_role AS ENUM ('admin', 'dealer', 'customer');
CREATE TYPE quote_status AS ENUM ('pending', 'reviewing', 'quoted', 'accepted', 'rejected');
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'production', 'shipping', 'delivered', 'cancelled');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'partial', 'refunded');

-- Kullanıcı profilleri (Supabase Auth ile bağlantılı)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL DEFAULT '',
  phone TEXT,
  company_name TEXT,
  tax_number TEXT,
  tax_office TEXT,
  company_address TEXT,
  city TEXT,
  district TEXT,
  role user_role NOT NULL DEFAULT 'customer',
  is_approved BOOLEAN NOT NULL DEFAULT false,
  avatar_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Teklif talepleri
CREATE TABLE IF NOT EXISTS quote_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  company_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  message TEXT,
  status quote_status NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  total_amount NUMERIC(12,2),
  valid_until DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Teklif kalemleri
CREATE TABLE IF NOT EXISTS quote_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_request_id UUID NOT NULL REFERENCES quote_requests(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC(12,2),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Siparişler
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  order_number TEXT UNIQUE NOT NULL,
  status order_status NOT NULL DEFAULT 'pending',
  shipping_address JSONB,
  billing_address JSONB,
  subtotal NUMERIC(12,2) NOT NULL DEFAULT 0,
  tax_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  shipping_cost NUMERIC(12,2) NOT NULL DEFAULT 0,
  total_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  payment_method TEXT,
  payment_status payment_status NOT NULL DEFAULT 'pending',
  tracking_number TEXT,
  estimated_delivery DATE,
  notes TEXT,
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Sipariş kalemleri
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC(12,2) NOT NULL DEFAULT 0,
  total_price NUMERIC(12,2) NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- İletişim mesajları
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Katalog indirme takibi
CREATE TABLE IF NOT EXISTS catalog_downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  email TEXT NOT NULL,
  company TEXT,
  phone TEXT,
  downloaded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Sipariş durum geçmişi
CREATE TABLE IF NOT EXISTS order_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  old_status order_status,
  new_status order_status NOT NULL,
  changed_by UUID REFERENCES profiles(id),
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Trigger: updated_at otomatik güncelleme
CREATE OR REPLACE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE OR REPLACE TRIGGER quote_requests_updated_at
  BEFORE UPDATE ON quote_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE OR REPLACE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Sipariş numarası otomatik oluşturma
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.order_number := 'KP-' || to_char(now(), 'YYMM') || '-' || lpad(nextval('order_number_seq')::text, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1;

CREATE OR REPLACE TRIGGER orders_generate_number
  BEFORE INSERT ON orders FOR EACH ROW
  WHEN (NEW.order_number IS NULL OR NEW.order_number = '')
  EXECUTE FUNCTION generate_order_number();

-- Yeni kullanıcı profili otomatik oluşturma
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- İndeksler
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_approved ON profiles(is_approved);
CREATE INDEX IF NOT EXISTS idx_quote_requests_status ON quote_requests(status);
CREATE INDEX IF NOT EXISTS idx_quote_requests_profile ON quote_requests(profile_id);
CREATE INDEX IF NOT EXISTS idx_orders_profile ON orders(profile_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_contact_messages_read ON contact_messages(is_read);

-- Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE catalog_downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;

-- Profil: Kullanıcı kendi profilini okuyabilir/güncelleyebilir
CREATE POLICY "Users read own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Service manage profiles" ON profiles
  FOR ALL USING (true) WITH CHECK (true);

-- Teklifler: Kullanıcı kendi tekliflerini görebilir, herkes teklif gönderebilir
CREATE POLICY "Users read own quotes" ON quote_requests
  FOR SELECT USING (auth.uid() = profile_id);
CREATE POLICY "Anyone insert quotes" ON quote_requests
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Service manage quotes" ON quote_requests
  FOR ALL USING (true) WITH CHECK (true);

-- Teklif kalemleri
CREATE POLICY "Users read own quote items" ON quote_items
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM quote_requests WHERE id = quote_items.quote_request_id AND profile_id = auth.uid())
  );
CREATE POLICY "Anyone insert quote items" ON quote_items
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Service manage quote items" ON quote_items
  FOR ALL USING (true) WITH CHECK (true);

-- Siparişler: Kullanıcı kendi siparişlerini görebilir
CREATE POLICY "Users read own orders" ON orders
  FOR SELECT USING (auth.uid() = profile_id);
CREATE POLICY "Users insert own orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = profile_id);
CREATE POLICY "Service manage orders" ON orders
  FOR ALL USING (true) WITH CHECK (true);

-- Sipariş kalemleri
CREATE POLICY "Users read own order items" ON order_items
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM orders WHERE id = order_items.order_id AND profile_id = auth.uid())
  );
CREATE POLICY "Service manage order items" ON order_items
  FOR ALL USING (true) WITH CHECK (true);

-- İletişim mesajları: Herkes gönderebilir, sadece service okuyabilir
CREATE POLICY "Anyone insert contact" ON contact_messages
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Service manage contacts" ON contact_messages
  FOR ALL USING (true) WITH CHECK (true);

-- Katalog indirme: Herkes kaydedebilir
CREATE POLICY "Anyone insert download" ON catalog_downloads
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Service manage downloads" ON catalog_downloads
  FOR ALL USING (true) WITH CHECK (true);

-- Sipariş durum geçmişi
CREATE POLICY "Users read own order history" ON order_status_history
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM orders WHERE id = order_status_history.order_id AND profile_id = auth.uid())
  );
CREATE POLICY "Service manage order history" ON order_status_history
  FOR ALL USING (true) WITH CHECK (true);
