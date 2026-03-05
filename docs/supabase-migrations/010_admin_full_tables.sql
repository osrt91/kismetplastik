-- =====================================================
-- Migration 010: Full Admin Panel Tables
-- All tables needed for complete admin management
-- =====================================================

-- 1. Add new columns to existing tables
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published'));

ALTER TABLE products ADD COLUMN IF NOT EXISTS image_url TEXT;

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

ALTER TABLE quote_requests ADD COLUMN IF NOT EXISTS response_message TEXT;

ALTER TABLE pre_orders ADD COLUMN IF NOT EXISTS admin_notes TEXT;

ALTER TABLE webhook_events ADD COLUMN IF NOT EXISTS retry_count INTEGER DEFAULT 0;

ALTER TABLE sample_requests ADD COLUMN IF NOT EXISTS admin_notes TEXT;

-- 2. Order status history
CREATE TABLE IF NOT EXISTS order_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  old_status TEXT,
  new_status TEXT NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Contact messages
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied')),
  reply_message TEXT,
  replied_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Resources (catalogs, documents)
CREATE TABLE IF NOT EXISTS resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_tr TEXT NOT NULL,
  title_en TEXT NOT NULL,
  description_tr TEXT NOT NULL DEFAULT '',
  description_en TEXT NOT NULL DEFAULT '',
  category_tr TEXT NOT NULL DEFAULT '',
  category_en TEXT NOT NULL DEFAULT '',
  file_url TEXT NOT NULL,
  storage_path TEXT,
  cover_image TEXT,
  page_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  download_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Catalog downloads tracking
CREATE TABLE IF NOT EXISTS catalog_downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id UUID REFERENCES resources(id) ON DELETE SET NULL,
  company_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Certificates
CREATE TABLE IF NOT EXISTS certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_tr TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_tr TEXT NOT NULL DEFAULT '',
  description_en TEXT NOT NULL DEFAULT '',
  icon TEXT DEFAULT 'Shield',
  pdf_url TEXT NOT NULL,
  storage_path TEXT,
  issuer TEXT NOT NULL DEFAULT '',
  valid_until TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Trade shows
CREATE TABLE IF NOT EXISTS trade_shows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_tr TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_tr TEXT NOT NULL DEFAULT '',
  description_en TEXT NOT NULL DEFAULT '',
  location_tr TEXT NOT NULL DEFAULT '',
  location_en TEXT NOT NULL DEFAULT '',
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  booth TEXT,
  website TEXT,
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'active', 'past')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 8. References
CREATE TABLE IF NOT EXISTS "references" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  logo_url TEXT NOT NULL DEFAULT '',
  storage_path TEXT,
  website TEXT,
  sector_tr TEXT NOT NULL DEFAULT '',
  sector_en TEXT NOT NULL DEFAULT '',
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 9. Milestones
CREATE TABLE IF NOT EXISTS milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  year INTEGER NOT NULL,
  title_tr TEXT NOT NULL,
  title_en TEXT NOT NULL,
  description_tr TEXT NOT NULL DEFAULT '',
  description_en TEXT NOT NULL DEFAULT '',
  icon TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 10. SEO settings
CREATE TABLE IF NOT EXISTS seo_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path TEXT UNIQUE NOT NULL,
  meta_title_tr TEXT,
  meta_title_en TEXT,
  meta_description_tr TEXT,
  meta_description_en TEXT,
  og_image TEXT,
  canonical_url TEXT,
  no_index BOOLEAN DEFAULT false,
  json_ld JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 11. Site settings (key-value pairs)
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL DEFAULT '',
  "group" TEXT NOT NULL DEFAULT 'general',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Insert default site settings
INSERT INTO site_settings (key, value, "group") VALUES
  ('company_name', 'Kısmet Plastik', 'company'),
  ('company_address', 'İstanbul, Türkiye', 'company'),
  ('company_phone', '+90 212 000 0000', 'company'),
  ('company_email', 'bilgi@kismetplastik.com', 'company'),
  ('company_tax_number', '', 'company'),
  ('company_tax_office', '', 'company'),
  ('social_instagram', '', 'social'),
  ('social_linkedin', '', 'social'),
  ('social_facebook', '', 'social'),
  ('social_youtube', '', 'social'),
  ('social_twitter', '', 'social'),
  ('whatsapp_number', '', 'contact'),
  ('whatsapp_hours', '09:00-18:00', 'contact'),
  ('google_analytics_id', '', 'analytics'),
  ('maintenance_mode', 'false', 'system'),
  ('logo_url', '', 'branding')
ON CONFLICT (key) DO NOTHING;

-- 12. Content sections (homepage, hero, stats etc.)
CREATE TABLE IF NOT EXISTS content_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key TEXT UNIQUE NOT NULL,
  title_tr TEXT,
  title_en TEXT,
  subtitle_tr TEXT,
  subtitle_en TEXT,
  content_tr TEXT,
  content_en TEXT,
  cta_text_tr TEXT,
  cta_text_en TEXT,
  cta_url TEXT,
  image_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 13. FAQ items
CREATE TABLE IF NOT EXISTS faq_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_tr TEXT NOT NULL,
  question_en TEXT NOT NULL,
  answer_tr TEXT NOT NULL,
  answer_en TEXT NOT NULL,
  category TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 14. Career listings
CREATE TABLE IF NOT EXISTS career_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_tr TEXT NOT NULL,
  title_en TEXT NOT NULL,
  description_tr TEXT NOT NULL DEFAULT '',
  description_en TEXT NOT NULL DEFAULT '',
  department TEXT NOT NULL DEFAULT '',
  location TEXT NOT NULL DEFAULT '',
  type TEXT NOT NULL DEFAULT 'full-time',
  requirements_tr TEXT[] DEFAULT '{}',
  requirements_en TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 15. Notification settings
CREATE TABLE IF NOT EXISTS notification_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT UNIQUE NOT NULL,
  email_enabled BOOLEAN DEFAULT true,
  email_recipients TEXT[] DEFAULT '{}',
  webhook_enabled BOOLEAN DEFAULT false,
  webhook_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Insert default notification settings
INSERT INTO notification_settings (event_type, email_enabled, email_recipients) VALUES
  ('new_order', true, ARRAY['bilgi@kismetplastik.com']),
  ('new_quote', true, ARRAY['bilgi@kismetplastik.com']),
  ('new_contact', true, ARRAY['bilgi@kismetplastik.com']),
  ('new_sample_request', true, ARRAY['bilgi@kismetplastik.com']),
  ('new_dealer', true, ARRAY['bilgi@kismetplastik.com']),
  ('order_status_change', true, ARRAY['bilgi@kismetplastik.com'])
ON CONFLICT (event_type) DO NOTHING;

-- =====================================================
-- RLS Policies (public read for some tables)
-- =====================================================

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE catalog_downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE trade_shows ENABLE ROW LEVEL SECURITY;
ALTER TABLE "references" ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;

-- Public read for certain tables (drop first to avoid conflicts)
DROP POLICY IF EXISTS "Public read certificates" ON certificates;
CREATE POLICY "Public read certificates" ON certificates FOR SELECT USING (is_active = true);
DROP POLICY IF EXISTS "Public read trade_shows" ON trade_shows;
CREATE POLICY "Public read trade_shows" ON trade_shows FOR SELECT USING (is_active = true);
DROP POLICY IF EXISTS "Public read references" ON "references";
CREATE POLICY "Public read references" ON "references" FOR SELECT USING (is_active = true);
DROP POLICY IF EXISTS "Public read milestones" ON milestones;
CREATE POLICY "Public read milestones" ON milestones FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public read resources" ON resources;
CREATE POLICY "Public read resources" ON resources FOR SELECT USING (is_active = true);
DROP POLICY IF EXISTS "Public read site_settings" ON site_settings;
CREATE POLICY "Public read site_settings" ON site_settings FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public read content_sections" ON content_sections;
CREATE POLICY "Public read content_sections" ON content_sections FOR SELECT USING (is_active = true);
DROP POLICY IF EXISTS "Public read faq_items" ON faq_items;
CREATE POLICY "Public read faq_items" ON faq_items FOR SELECT USING (is_active = true);
DROP POLICY IF EXISTS "Public read career_listings" ON career_listings;
CREATE POLICY "Public read career_listings" ON career_listings FOR SELECT USING (is_active = true);
DROP POLICY IF EXISTS "Public read seo_settings" ON seo_settings;
CREATE POLICY "Public read seo_settings" ON seo_settings FOR SELECT USING (true);

-- =====================================================
-- Indexes
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_order_status_history_order_id ON order_status_history(order_id);
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_resources_display_order ON resources(display_order);
CREATE INDEX IF NOT EXISTS idx_certificates_display_order ON certificates(display_order);
CREATE INDEX IF NOT EXISTS idx_trade_shows_start_date ON trade_shows(start_date);
CREATE INDEX IF NOT EXISTS idx_references_display_order ON "references"(display_order);
CREATE INDEX IF NOT EXISTS idx_milestones_year ON milestones(year);
CREATE INDEX IF NOT EXISTS idx_seo_settings_page_path ON seo_settings(page_path);
CREATE INDEX IF NOT EXISTS idx_site_settings_key ON site_settings(key);
CREATE INDEX IF NOT EXISTS idx_content_sections_section_key ON content_sections(section_key);
CREATE INDEX IF NOT EXISTS idx_faq_items_display_order ON faq_items(display_order);
CREATE INDEX IF NOT EXISTS idx_catalog_downloads_resource_id ON catalog_downloads(resource_id);
CREATE INDEX IF NOT EXISTS idx_webhook_events_status ON webhook_events(status);
