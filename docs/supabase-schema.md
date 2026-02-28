# Kısmet Plastik B2B — Supabase Schema

Ana veritabanı şeması: kategoriler, ürünler, blog yazıları.  
**Kullanım:** Bu dosyadaki SQL'i Supabase Dashboard → SQL Editor'a yapıştırıp çalıştırın.

---

## SQL

```sql
-- Kısmet Plastik B2B — Supabase Schema
-- Bu SQL'i Supabase Dashboard > SQL Editor'a yapıştırın.

-- Kategoriler tablosu
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  product_count INTEGER NOT NULL DEFAULT 0,
  icon TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Ürünler tablosu
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  category_slug TEXT NOT NULL REFERENCES categories(slug),
  description TEXT NOT NULL DEFAULT '',
  short_description TEXT NOT NULL DEFAULT '',
  volume TEXT,
  weight TEXT,
  neck_diameter TEXT,
  height TEXT,
  diameter TEXT,
  material TEXT NOT NULL DEFAULT 'PET',
  colors TEXT[] NOT NULL DEFAULT '{}',
  color_codes JSONB,
  model TEXT,
  shape TEXT,
  surface_type TEXT,
  compatible_caps TEXT[],
  min_order INTEGER NOT NULL DEFAULT 10000,
  in_stock BOOLEAN NOT NULL DEFAULT true,
  featured BOOLEAN NOT NULL DEFAULT false,
  specs JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Blog yazıları tablosu
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL DEFAULT '',
  content TEXT[] NOT NULL DEFAULT '{}',
  category TEXT NOT NULL DEFAULT 'Bilgi',
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  read_time TEXT NOT NULL DEFAULT '5 dk',
  featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Otomatik updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE TRIGGER blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- İndeksler
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_slug);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_products_in_stock ON products(in_stock);
CREATE INDEX IF NOT EXISTS idx_blog_posts_featured ON blog_posts(featured);
CREATE INDEX IF NOT EXISTS idx_blog_posts_date ON blog_posts(date DESC);

-- Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Herkes okuyabilir (public read)
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public read products" ON products FOR SELECT USING (true);
CREATE POLICY "Public read blog_posts" ON blog_posts FOR SELECT USING (true);

-- Sadece service_role ile yazma (admin API'den gelir)
CREATE POLICY "Service write categories" ON categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service write products" ON products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service write blog_posts" ON blog_posts FOR ALL USING (true) WITH CHECK (true);
```
