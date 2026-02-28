# Kısmet Plastik — Migration 003: Galeri Sistemi

Galeri görselleri tablosu, storage bucket ve RLS.  
**Kullanım:** Migration 002 çalıştırılmış olmalı (profiles tablosu gerekli). Bu SQL'i Supabase Dashboard → SQL Editor'a yapıştırıp çalıştırın.

---

## SQL

```sql
-- Kısmet Plastik — Migration 003: Galeri Sistemi
-- Bu SQL'i Supabase Dashboard > SQL Editor'a yapıştırın.

-- Galeri kategorisi enum'u
CREATE TYPE gallery_category AS ENUM ('uretim', 'urunler', 'etkinlikler');

-- Galeri görselleri tablosu
CREATE TABLE IF NOT EXISTS gallery_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category gallery_category NOT NULL DEFAULT 'uretim',
  title_tr TEXT NOT NULL DEFAULT '',
  title_en TEXT NOT NULL DEFAULT '',
  description_tr TEXT,
  description_en TEXT,
  image_url TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  display_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_gallery_category ON gallery_images(category);
CREATE INDEX idx_gallery_active ON gallery_images(is_active);
CREATE INDEX idx_gallery_order ON gallery_images(display_order);

-- updated_at trigger
CREATE OR REPLACE FUNCTION update_gallery_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_gallery_updated_at
  BEFORE UPDATE ON gallery_images
  FOR EACH ROW
  EXECUTE FUNCTION update_gallery_updated_at();

-- RLS
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "gallery_public_read"
  ON gallery_images FOR SELECT
  USING (is_active = true);

CREATE POLICY "gallery_admin_all"
  ON gallery_images FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'gallery',
  'gallery',
  true,
  10485760, -- 10MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "gallery_storage_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'gallery');

CREATE POLICY "gallery_storage_admin_insert"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'gallery'
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "gallery_storage_admin_delete"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'gallery'
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Alternatif: service_role ile çalışacaksan RLS devre dışı bırakabilirsin:
-- ALTER TABLE gallery_images DISABLE ROW LEVEL SECURITY;
```
