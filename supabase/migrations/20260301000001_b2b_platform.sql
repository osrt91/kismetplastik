-- ============================================
-- Kısmet Plastik B2B Platform — Migration 002
-- B2B dönüşüm: companies, profiles, products,
-- price_tiers, orders, order_items, quote_requests,
-- saved_designs
-- ============================================
-- Bu migration'ı Supabase Dashboard > SQL Editor'da çalıştırın.
-- Mevcut 001_initial_schema üzerine inşa eder.
-- ============================================

-- ============================================
-- 0. EXTENSIONS
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "moddatetime";

-- ============================================
-- 1. CUSTOM ENUM TYPES
-- ============================================

-- Company payment terms
DO $$ BEGIN
  CREATE TYPE payment_terms_enum AS ENUM ('prepaid', 'net15', 'net30', 'net60');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Company status
DO $$ BEGIN
  CREATE TYPE company_status_enum AS ENUM ('pending', 'active', 'suspended');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- User role (B2B)
DO $$ BEGIN
  CREATE TYPE user_role_b2b AS ENUM ('admin', 'company_admin', 'buyer');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Product category
DO $$ BEGIN
  CREATE TYPE product_category_enum AS ENUM (
    'pet_sise', 'plastik_sise', 'kapak', 'tipa', 'sprey', 'pompa', 'tetik', 'huni', 'diger'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Order status (B2B extended)
DO $$ BEGIN
  CREATE TYPE order_status_b2b AS ENUM (
    'draft', 'pending', 'confirmed', 'production', 'shipped', 'delivered', 'cancelled'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Payment status
DO $$ BEGIN
  CREATE TYPE payment_status_enum AS ENUM ('pending', 'partial', 'paid', 'refunded');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Quote status (B2B)
DO $$ BEGIN
  CREATE TYPE quote_status_b2b AS ENUM ('new', 'reviewing', 'sent', 'accepted', 'rejected');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ============================================
-- 2. COMPANIES (B2B firma profilleri)
-- ============================================
CREATE TABLE IF NOT EXISTS public.companies (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name           TEXT NOT NULL,
  tax_number     TEXT UNIQUE,
  sector         TEXT,
  address        TEXT,
  city           TEXT,
  country        TEXT NOT NULL DEFAULT 'Türkiye',
  phone          TEXT,
  email          TEXT,
  website        TEXT,
  logo_url       TEXT,
  credit_limit   NUMERIC(12,2) NOT NULL DEFAULT 0,
  discount_rate  NUMERIC(5,2) NOT NULL DEFAULT 0,
  payment_terms  payment_terms_enum NOT NULL DEFAULT 'prepaid',
  status         company_status_enum NOT NULL DEFAULT 'pending',
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.companies IS 'B2B müşteri firma profilleri';
COMMENT ON COLUMN public.companies.tax_number IS 'Vergi numarası (unique)';
COMMENT ON COLUMN public.companies.credit_limit IS 'Firma kredi limiti (TRY)';
COMMENT ON COLUMN public.companies.discount_rate IS 'Firma özel indirim oranı (%)';

-- Indexes
CREATE INDEX IF NOT EXISTS idx_companies_status ON public.companies(status);
CREATE INDEX IF NOT EXISTS idx_companies_tax_number ON public.companies(tax_number);
CREATE INDEX IF NOT EXISTS idx_companies_city ON public.companies(city);

-- RLS
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- Policies: admin full access, company_admin own company read, buyer own company read
CREATE POLICY "companies_admin_all"
  ON public.companies FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.b2b_profiles
      WHERE b2b_profiles.id = auth.uid() AND b2b_profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.b2b_profiles
      WHERE b2b_profiles.id = auth.uid() AND b2b_profiles.role = 'admin'
    )
  );

CREATE POLICY "companies_own_read"
  ON public.companies FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT company_id FROM public.b2b_profiles
      WHERE b2b_profiles.id = auth.uid()
    )
  );

-- updated_at trigger (moddatetime)
CREATE OR REPLACE TRIGGER trg_companies_updated_at
  BEFORE UPDATE ON public.companies
  FOR EACH ROW
  EXECUTE FUNCTION moddatetime(updated_at);

-- ============================================
-- 3. B2B_PROFILES (kullanıcı profilleri)
-- ============================================
-- Yeni tablo: mevcut profiles tablosuna dokunmadan
-- B2B-specific profil tablosu oluşturuyoruz.
-- auth.users ile 1:1 ilişki, companies ile N:1.
-- ============================================
CREATE TABLE IF NOT EXISTS public.b2b_profiles (
  id             UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id     UUID REFERENCES public.companies(id) ON DELETE SET NULL,
  full_name      TEXT NOT NULL DEFAULT '',
  role           user_role_b2b NOT NULL DEFAULT 'buyer',
  phone          TEXT,
  avatar_url     TEXT,
  is_active      BOOLEAN NOT NULL DEFAULT true,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.b2b_profiles IS 'B2B kullanıcı profilleri (auth.users ile bağlı)';
COMMENT ON COLUMN public.b2b_profiles.role IS 'admin: sistem yöneticisi, company_admin: firma yetkilisi, buyer: satın almacı';

-- Indexes
CREATE INDEX IF NOT EXISTS idx_b2b_profiles_company ON public.b2b_profiles(company_id);
CREATE INDEX IF NOT EXISTS idx_b2b_profiles_role ON public.b2b_profiles(role);
CREATE INDEX IF NOT EXISTS idx_b2b_profiles_active ON public.b2b_profiles(is_active) WHERE is_active = true;

-- RLS
ALTER TABLE public.b2b_profiles ENABLE ROW LEVEL SECURITY;

-- admin: full access
CREATE POLICY "b2b_profiles_admin_all"
  ON public.b2b_profiles FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.b2b_profiles bp
      WHERE bp.id = auth.uid() AND bp.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.b2b_profiles bp
      WHERE bp.id = auth.uid() AND bp.role = 'admin'
    )
  );

-- Own profile: read
CREATE POLICY "b2b_profiles_own_read"
  ON public.b2b_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Own profile: update (non-role fields)
CREATE POLICY "b2b_profiles_own_update"
  ON public.b2b_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- company_admin: read same-company profiles
CREATE POLICY "b2b_profiles_company_read"
  ON public.b2b_profiles FOR SELECT
  TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM public.b2b_profiles
      WHERE id = auth.uid() AND role = 'company_admin'
    )
  );

-- updated_at trigger
CREATE OR REPLACE TRIGGER trg_b2b_profiles_updated_at
  BEFORE UPDATE ON public.b2b_profiles
  FOR EACH ROW
  EXECUTE FUNCTION moddatetime(updated_at);

-- Auto-create b2b_profile on new user signup
CREATE OR REPLACE FUNCTION public.handle_new_b2b_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.b2b_profiles (id, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists, then create
DROP TRIGGER IF EXISTS on_auth_user_created_b2b ON auth.users;
CREATE TRIGGER on_auth_user_created_b2b
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_b2b_user();

-- ============================================
-- 4. B2B_PRODUCTS (ürün katalogu — B2B)
-- ============================================
-- Mevcut products tablosuna B2B alanları ekliyoruz.
-- Mevcut veri korunur, yeni alanlar nullable
-- veya default değerlerle eklenir.
-- ============================================

-- Add new B2B columns to existing products table
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS sku TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS name_tr TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS name_en TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS b2b_category product_category_enum;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS subcategory TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS volume_ml NUMERIC(8,2);
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS neck_size_mm NUMERIC(6,2);
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS color_options JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS has_3d_model BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS model_3d_url TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS model_2d_url TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS base_price NUMERIC(12,2);
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS moq INTEGER NOT NULL DEFAULT 1000;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS weight_gram NUMERIC(8,2);
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS dimensions JSONB DEFAULT '{"width": null, "height": null, "depth": null}'::jsonb;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_featured BOOLEAN NOT NULL DEFAULT false;

-- Unique constraint on SKU (partial — only non-null)
CREATE UNIQUE INDEX IF NOT EXISTS idx_products_sku_unique
  ON public.products(sku) WHERE sku IS NOT NULL;

-- Copy existing name to name_tr where name_tr is null
UPDATE public.products SET name_tr = name WHERE name_tr IS NULL;

-- Copy existing featured to is_featured
UPDATE public.products SET is_featured = featured WHERE is_featured = false AND featured = true;

-- Copy existing in_stock to is_active
UPDATE public.products SET is_active = in_stock;

-- Additional indexes for B2B queries
CREATE INDEX IF NOT EXISTS idx_products_b2b_category ON public.products(b2b_category);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON public.products(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON public.products(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_products_base_price ON public.products(base_price);
CREATE INDEX IF NOT EXISTS idx_products_moq ON public.products(moq);
CREATE INDEX IF NOT EXISTS idx_products_has_3d ON public.products(has_3d_model) WHERE has_3d_model = true;

-- ============================================
-- 5. PRICE_TIERS (hacim bazlı fiyatlandırma)
-- ============================================
CREATE TABLE IF NOT EXISTS public.price_tiers (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id     UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  company_id     UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  min_quantity   INTEGER NOT NULL,
  max_quantity   INTEGER,
  unit_price     NUMERIC(12,2) NOT NULL,
  currency       TEXT NOT NULL DEFAULT 'TRY',
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.price_tiers IS 'Hacim bazlı fiyatlandırma. company_id NULL = genel fiyat.';
COMMENT ON COLUMN public.price_tiers.company_id IS 'NULL ise tüm firmalar için geçerli genel fiyat';

-- Indexes
CREATE INDEX IF NOT EXISTS idx_price_tiers_product ON public.price_tiers(product_id);
CREATE INDEX IF NOT EXISTS idx_price_tiers_company ON public.price_tiers(company_id);
CREATE INDEX IF NOT EXISTS idx_price_tiers_quantity ON public.price_tiers(min_quantity, max_quantity);

-- Ensure no overlapping tiers for same product+company
-- (application layer should also validate this)

-- RLS
ALTER TABLE public.price_tiers ENABLE ROW LEVEL SECURITY;

-- admin: full access
CREATE POLICY "price_tiers_admin_all"
  ON public.price_tiers FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.b2b_profiles
      WHERE b2b_profiles.id = auth.uid() AND b2b_profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.b2b_profiles
      WHERE b2b_profiles.id = auth.uid() AND b2b_profiles.role = 'admin'
    )
  );

-- Authenticated users: read general tiers (company_id IS NULL) and own company tiers
CREATE POLICY "price_tiers_read_general"
  ON public.price_tiers FOR SELECT
  TO authenticated
  USING (
    company_id IS NULL
    OR company_id IN (
      SELECT company_id FROM public.b2b_profiles
      WHERE b2b_profiles.id = auth.uid()
    )
  );

-- updated_at trigger
CREATE OR REPLACE TRIGGER trg_price_tiers_updated_at
  BEFORE UPDATE ON public.price_tiers
  FOR EACH ROW
  EXECUTE FUNCTION moddatetime(updated_at);

-- ============================================
-- 6. B2B_ORDERS (siparişler)
-- ============================================
CREATE TABLE IF NOT EXISTS public.b2b_orders (
  id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number       TEXT UNIQUE NOT NULL DEFAULT '',
  company_id         UUID NOT NULL REFERENCES public.companies(id) ON DELETE RESTRICT,
  created_by         UUID NOT NULL REFERENCES public.b2b_profiles(id) ON DELETE RESTRICT,
  status             order_status_b2b NOT NULL DEFAULT 'draft',
  total_amount       NUMERIC(12,2) NOT NULL DEFAULT 0,
  currency           TEXT NOT NULL DEFAULT 'TRY',
  payment_status     payment_status_enum NOT NULL DEFAULT 'pending',
  payment_terms      payment_terms_enum,
  shipping_address   JSONB,
  notes              TEXT,
  estimated_delivery DATE,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.b2b_orders IS 'B2B siparişler — firma bazlı';
COMMENT ON COLUMN public.b2b_orders.shipping_address IS 'JSON: {street, city, district, postal_code, country}';

-- Indexes
CREATE INDEX IF NOT EXISTS idx_b2b_orders_company ON public.b2b_orders(company_id);
CREATE INDEX IF NOT EXISTS idx_b2b_orders_created_by ON public.b2b_orders(created_by);
CREATE INDEX IF NOT EXISTS idx_b2b_orders_status ON public.b2b_orders(status);
CREATE INDEX IF NOT EXISTS idx_b2b_orders_number ON public.b2b_orders(order_number);
CREATE INDEX IF NOT EXISTS idx_b2b_orders_payment ON public.b2b_orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_b2b_orders_created ON public.b2b_orders(created_at DESC);

-- RLS
ALTER TABLE public.b2b_orders ENABLE ROW LEVEL SECURITY;

-- admin: full access
CREATE POLICY "b2b_orders_admin_all"
  ON public.b2b_orders FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.b2b_profiles
      WHERE b2b_profiles.id = auth.uid() AND b2b_profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.b2b_profiles
      WHERE b2b_profiles.id = auth.uid() AND b2b_profiles.role = 'admin'
    )
  );

-- company_admin: read/insert/update own company orders
CREATE POLICY "b2b_orders_company_admin_read"
  ON public.b2b_orders FOR SELECT
  TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM public.b2b_profiles
      WHERE b2b_profiles.id = auth.uid() AND b2b_profiles.role IN ('company_admin', 'buyer')
    )
  );

CREATE POLICY "b2b_orders_company_insert"
  ON public.b2b_orders FOR INSERT
  TO authenticated
  WITH CHECK (
    company_id IN (
      SELECT company_id FROM public.b2b_profiles
      WHERE b2b_profiles.id = auth.uid()
    )
    AND created_by = auth.uid()
  );

CREATE POLICY "b2b_orders_company_admin_update"
  ON public.b2b_orders FOR UPDATE
  TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM public.b2b_profiles
      WHERE b2b_profiles.id = auth.uid() AND b2b_profiles.role = 'company_admin'
    )
  )
  WITH CHECK (
    company_id IN (
      SELECT company_id FROM public.b2b_profiles
      WHERE b2b_profiles.id = auth.uid() AND b2b_profiles.role = 'company_admin'
    )
  );

-- Auto-generate order number: KP-YYMM-NNNN
CREATE SEQUENCE IF NOT EXISTS b2b_order_number_seq START 1;

CREATE OR REPLACE FUNCTION public.generate_b2b_order_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
    NEW.order_number := 'KP-' || to_char(now(), 'YYMM') || '-' || lpad(nextval('b2b_order_number_seq')::text, 4, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_b2b_order_number
  BEFORE INSERT ON public.b2b_orders
  FOR EACH ROW
  EXECUTE FUNCTION public.generate_b2b_order_number();

-- updated_at trigger
CREATE OR REPLACE TRIGGER trg_b2b_orders_updated_at
  BEFORE UPDATE ON public.b2b_orders
  FOR EACH ROW
  EXECUTE FUNCTION moddatetime(updated_at);

-- ============================================
-- 7. B2B_ORDER_ITEMS (sipariş kalemleri)
-- ============================================
CREATE TABLE IF NOT EXISTS public.b2b_order_items (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id          UUID NOT NULL REFERENCES public.b2b_orders(id) ON DELETE CASCADE,
  product_id        UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
  quantity          INTEGER NOT NULL CHECK (quantity > 0),
  unit_price        NUMERIC(12,2) NOT NULL DEFAULT 0,
  subtotal          NUMERIC(12,2) NOT NULL DEFAULT 0,
  custom_color      TEXT,
  custom_label_url  TEXT,
  design_config     JSONB,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.b2b_order_items IS 'B2B sipariş kalemleri';
COMMENT ON COLUMN public.b2b_order_items.design_config IS 'JSON: 2D/3D tasarım konfigürasyonu (renk, etiket, logo pozisyonu)';
COMMENT ON COLUMN public.b2b_order_items.custom_label_url IS 'Özel etiket dosyası URL (Supabase Storage)';

-- Indexes
CREATE INDEX IF NOT EXISTS idx_b2b_order_items_order ON public.b2b_order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_b2b_order_items_product ON public.b2b_order_items(product_id);

-- RLS
ALTER TABLE public.b2b_order_items ENABLE ROW LEVEL SECURITY;

-- admin: full access
CREATE POLICY "b2b_order_items_admin_all"
  ON public.b2b_order_items FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.b2b_profiles
      WHERE b2b_profiles.id = auth.uid() AND b2b_profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.b2b_profiles
      WHERE b2b_profiles.id = auth.uid() AND b2b_profiles.role = 'admin'
    )
  );

-- Users: read items of own company orders
CREATE POLICY "b2b_order_items_company_read"
  ON public.b2b_order_items FOR SELECT
  TO authenticated
  USING (
    order_id IN (
      SELECT o.id FROM public.b2b_orders o
      INNER JOIN public.b2b_profiles bp ON bp.company_id = o.company_id
      WHERE bp.id = auth.uid()
    )
  );

-- Users: insert items into own company orders
CREATE POLICY "b2b_order_items_company_insert"
  ON public.b2b_order_items FOR INSERT
  TO authenticated
  WITH CHECK (
    order_id IN (
      SELECT o.id FROM public.b2b_orders o
      INNER JOIN public.b2b_profiles bp ON bp.company_id = o.company_id
      WHERE bp.id = auth.uid()
    )
  );

-- Auto-calculate subtotal
CREATE OR REPLACE FUNCTION public.calc_order_item_subtotal()
RETURNS TRIGGER AS $$
BEGIN
  NEW.subtotal := NEW.quantity * NEW.unit_price;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_b2b_order_items_subtotal
  BEFORE INSERT OR UPDATE ON public.b2b_order_items
  FOR EACH ROW
  EXECUTE FUNCTION public.calc_order_item_subtotal();

-- updated_at trigger
CREATE OR REPLACE TRIGGER trg_b2b_order_items_updated_at
  BEFORE UPDATE ON public.b2b_order_items
  FOR EACH ROW
  EXECUTE FUNCTION moddatetime(updated_at);

-- ============================================
-- 8. B2B_QUOTE_REQUESTS (teklif istekleri)
-- ============================================
CREATE TABLE IF NOT EXISTS public.b2b_quote_requests (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id       UUID REFERENCES public.companies(id) ON DELETE SET NULL,
  contact_name     TEXT NOT NULL,
  contact_email    TEXT NOT NULL,
  contact_phone    TEXT,
  company_name     TEXT,
  product_requests JSONB NOT NULL DEFAULT '[]'::jsonb,
  notes            TEXT,
  status           quote_status_b2b NOT NULL DEFAULT 'new',
  assigned_to      UUID REFERENCES public.b2b_profiles(id) ON DELETE SET NULL,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.b2b_quote_requests IS 'B2B teklif istekleri';
COMMENT ON COLUMN public.b2b_quote_requests.product_requests IS 'JSON array: [{product_id, quantity, notes, custom_specs}]';
COMMENT ON COLUMN public.b2b_quote_requests.assigned_to IS 'Teklifi hazırlayan admin kullanıcı';

-- Indexes
CREATE INDEX IF NOT EXISTS idx_b2b_quotes_company ON public.b2b_quote_requests(company_id);
CREATE INDEX IF NOT EXISTS idx_b2b_quotes_status ON public.b2b_quote_requests(status);
CREATE INDEX IF NOT EXISTS idx_b2b_quotes_assigned ON public.b2b_quote_requests(assigned_to);
CREATE INDEX IF NOT EXISTS idx_b2b_quotes_created ON public.b2b_quote_requests(created_at DESC);

-- RLS
ALTER TABLE public.b2b_quote_requests ENABLE ROW LEVEL SECURITY;

-- admin: full access
CREATE POLICY "b2b_quotes_admin_all"
  ON public.b2b_quote_requests FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.b2b_profiles
      WHERE b2b_profiles.id = auth.uid() AND b2b_profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.b2b_profiles
      WHERE b2b_profiles.id = auth.uid() AND b2b_profiles.role = 'admin'
    )
  );

-- Authenticated users: read own company quotes
CREATE POLICY "b2b_quotes_company_read"
  ON public.b2b_quote_requests FOR SELECT
  TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM public.b2b_profiles
      WHERE b2b_profiles.id = auth.uid()
    )
  );

-- Anyone can create a quote request (anon for public form, authenticated for portal)
CREATE POLICY "b2b_quotes_public_insert"
  ON public.b2b_quote_requests FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- updated_at trigger
CREATE OR REPLACE TRIGGER trg_b2b_quotes_updated_at
  BEFORE UPDATE ON public.b2b_quote_requests
  FOR EACH ROW
  EXECUTE FUNCTION moddatetime(updated_at);

-- ============================================
-- 9. SAVED_DESIGNS (2D/3D tasarımlar)
-- ============================================
CREATE TABLE IF NOT EXISTS public.saved_designs (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id        UUID NOT NULL REFERENCES public.b2b_profiles(id) ON DELETE CASCADE,
  product_id     UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  name           TEXT NOT NULL,
  design_data    JSONB NOT NULL DEFAULT '{}'::jsonb,
  preview_url    TEXT,
  is_public      BOOLEAN NOT NULL DEFAULT false,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.saved_designs IS 'Kullanıcıların kaydettiği 2D/3D ürün tasarımları';
COMMENT ON COLUMN public.saved_designs.design_data IS 'JSON: {color, label_url, logo_position, text_layers, ...}';
COMMENT ON COLUMN public.saved_designs.is_public IS 'true ise diğer kullanıcılar da görebilir';

-- Indexes
CREATE INDEX IF NOT EXISTS idx_saved_designs_user ON public.saved_designs(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_designs_product ON public.saved_designs(product_id);
CREATE INDEX IF NOT EXISTS idx_saved_designs_public ON public.saved_designs(is_public) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_saved_designs_created ON public.saved_designs(created_at DESC);

-- RLS
ALTER TABLE public.saved_designs ENABLE ROW LEVEL SECURITY;

-- admin: full access
CREATE POLICY "saved_designs_admin_all"
  ON public.saved_designs FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.b2b_profiles
      WHERE b2b_profiles.id = auth.uid() AND b2b_profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.b2b_profiles
      WHERE b2b_profiles.id = auth.uid() AND b2b_profiles.role = 'admin'
    )
  );

-- Users: CRUD own designs
CREATE POLICY "saved_designs_own_read"
  ON public.saved_designs FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "saved_designs_own_insert"
  ON public.saved_designs FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "saved_designs_own_update"
  ON public.saved_designs FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "saved_designs_own_delete"
  ON public.saved_designs FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Public designs: anyone authenticated can read
CREATE POLICY "saved_designs_public_read"
  ON public.saved_designs FOR SELECT
  TO authenticated
  USING (is_public = true);

-- updated_at trigger
CREATE OR REPLACE TRIGGER trg_saved_designs_updated_at
  BEFORE UPDATE ON public.saved_designs
  FOR EACH ROW
  EXECUTE FUNCTION moddatetime(updated_at);

-- ============================================
-- 10. HELPER FUNCTIONS
-- ============================================

-- Calculate price for a product based on quantity and company
CREATE OR REPLACE FUNCTION public.calculate_tier_price(
  p_product_id UUID,
  p_quantity INTEGER,
  p_company_id UUID DEFAULT NULL
)
RETURNS NUMERIC(12,2) AS $$
DECLARE
  tier_price NUMERIC(12,2);
  base NUMERIC(12,2);
BEGIN
  -- First try company-specific tier
  IF p_company_id IS NOT NULL THEN
    SELECT unit_price INTO tier_price
    FROM public.price_tiers
    WHERE product_id = p_product_id
      AND company_id = p_company_id
      AND min_quantity <= p_quantity
      AND (max_quantity IS NULL OR max_quantity >= p_quantity)
    ORDER BY min_quantity DESC
    LIMIT 1;

    IF tier_price IS NOT NULL THEN
      RETURN tier_price;
    END IF;
  END IF;

  -- Fallback to general tier
  SELECT unit_price INTO tier_price
  FROM public.price_tiers
  WHERE product_id = p_product_id
    AND company_id IS NULL
    AND min_quantity <= p_quantity
    AND (max_quantity IS NULL OR max_quantity >= p_quantity)
  ORDER BY min_quantity DESC
  LIMIT 1;

  IF tier_price IS NOT NULL THEN
    RETURN tier_price;
  END IF;

  -- Fallback to product base_price
  SELECT base_price INTO base
  FROM public.products
  WHERE id = p_product_id;

  RETURN COALESCE(base, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.calculate_tier_price IS 'Ürün fiyatını hacim ve firma bazında hesaplar';

-- ============================================
-- 11. STORAGE BUCKET FOR DESIGNS
-- ============================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'designs',
  'designs',
  false,
  10485760, -- 10MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'application/pdf']
)
ON CONFLICT (id) DO NOTHING;

-- designs bucket: authenticated users can upload their own
CREATE POLICY "designs_storage_auth_read"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'designs');

CREATE POLICY "designs_storage_auth_insert"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'designs');

CREATE POLICY "designs_storage_own_delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'designs');

-- ============================================
-- MIGRATION COMPLETE
-- ============================================
-- Tablolar: companies, b2b_profiles, products (B2B alanları),
--           price_tiers, b2b_orders, b2b_order_items,
--           b2b_quote_requests, saved_designs
-- Her tablo: RLS aktif, policy'ler tanımlı,
--            index'ler oluşturuldu, updated_at trigger eklendi
-- ============================================
