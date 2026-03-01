-- Kismet Plastik - Products & Categories Migration
-- Bu SQL dosyasini Supabase SQL Editor'de calistirin.

-- ================================================
-- 1. Kategoriler Tablosu
-- ================================================
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  description text DEFAULT '',
  icon text,
  display_order int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read categories"
  ON categories FOR SELECT
  USING (true);

-- ================================================
-- 2. Urunler Tablosu
-- ================================================
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  category_slug text NOT NULL REFERENCES categories(slug) ON DELETE RESTRICT,
  description text DEFAULT '',
  short_description text DEFAULT '',
  volume text,
  weight text,
  neck_diameter text,
  height text,
  diameter text,
  material text DEFAULT 'PET',
  colors text[] DEFAULT '{}',
  model text,
  shape text,
  surface_type text,
  min_order int DEFAULT 10000,
  in_stock boolean DEFAULT true,
  featured boolean DEFAULT false,
  specs jsonb DEFAULT '[]',
  image_url text,
  images text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read products"
  ON products FOR SELECT
  USING (true);

CREATE INDEX idx_products_category ON products(category_slug);
CREATE INDEX idx_products_featured ON products(featured) WHERE featured = true;
CREATE INDEX idx_products_in_stock ON products(in_stock);
CREATE INDEX idx_products_material ON products(material);

-- ================================================
-- 3. Newsletter Subscribers Tablosu
-- ================================================
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  subscribed_at timestamptz DEFAULT now(),
  is_active boolean DEFAULT true
);

ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- ================================================
-- 4. Updated_at Trigger
-- ================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_products_updated
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_categories_updated
  BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ================================================
-- 5. Seed Data: Kategoriler
-- ================================================
INSERT INTO categories (slug, name, description, display_order) VALUES
  ('pet-siseler', 'PET Şişeler', 'Kozmetik, kolonya ve kişisel bakım ürünleri için farklı hacim ve tasarımlarda PET şişeler.', 1),
  ('plastik-siseler', 'Plastik Şişeler', 'HDPE, PP ve LDPE hammaddeli dayanıklı plastik şişe çeşitleri.', 2),
  ('kapaklar', 'Kapaklar', 'Vidalı, flip-top ve özel tasarım kapak çeşitleri.', 3),
  ('tipalar', 'Tıpalar', 'İç tıpa, damlatıcı tıpa ve sızdırmazlık tıpaları.', 4),
  ('parmak-spreyler', 'Parmak Spreyler', 'Kozmetik ve kolonya ürünleri için parmak sprey mekanizmaları.', 5),
  ('pompalar', 'Pompalar', 'Losyon pompası, köpük pompası ve krem dozajlama pompaları.', 6),
  ('tetikli-pusturtuculer', 'Tetikli Püskürtücüler', 'Temizlik ve bakım ürünleri için tetikli püskürtme sistemleri.', 7),
  ('huniler', 'Huniler', 'Dolum sürecinde kullanılan plastik huniler.', 8)
ON CONFLICT (slug) DO NOTHING;

-- ================================================
-- 6. Seed Data: Urunler
-- ================================================
INSERT INTO products (slug, name, category_slug, description, short_description, volume, weight, neck_diameter, height, diameter, material, colors, model, shape, min_order, in_stock, featured, specs) VALUES
  ('pet-sise-50ml-damla', 'PET Şişe 50ml Damla', 'pet-siseler', '50ml damla model PET şişe. Serum, cilt bakım yağı ve göz çevresi bakım ürünleri için kompakt tasarım. 18mm ağız çapı ile damlalık veya mini pompa uyumlu.', '50ml damla model kozmetik şişe', '50ml', '8g', '18mm', '105mm', '35mm', 'PET', ARRAY['Şeffaf','Amber','Füme','Beyaz'], 'Damla', 'silindir', 20000, true, true, '[{"label":"Hacim","value":"50ml"},{"label":"Ağırlık","value":"8g"},{"label":"Ağız","value":"18mm"},{"label":"Yükseklik","value":"105mm"},{"label":"Çap","value":"35mm"},{"label":"Hammadde","value":"PET"},{"label":"Model","value":"Damla"}]'::jsonb),
  ('pet-sise-100ml-silindir', 'PET Şişe 100ml Silindir', 'pet-siseler', '100ml silindir model PET şişe. Kolonya, parfüm ve kişisel bakım ürünleri için zarif silindirik tasarım. 20mm ağız çapı.', '100ml silindir kozmetik şişe', '100ml', '15g', '20mm', '130mm', '42mm', 'PET', ARRAY['Şeffaf','Amber','Mavi','Füme'], 'Silindir', 'silindir', 15000, true, true, '[{"label":"Hacim","value":"100ml"},{"label":"Ağırlık","value":"15g"},{"label":"Ağız","value":"20mm"},{"label":"Yükseklik","value":"130mm"},{"label":"Çap","value":"42mm"},{"label":"Hammadde","value":"PET"},{"label":"Model","value":"Silindir"}]'::jsonb),
  ('pet-sise-250ml-kristal', 'PET Şişe 250ml Kristal', 'pet-siseler', '250ml kristal model PET şişe. Şampuan, duş jeli ve kişisel bakım ürünleri için şık kristal desen. 24mm Modern ağız.', '250ml kristal model şişe', '250ml', '24g', '24mm Modern', '175mm', '58mm', 'PET', ARRAY['Şeffaf','Yeşil','Mavi','Altın Yaldız'], 'Kristal', 'silindir', 10000, true, true, '[{"label":"Hacim","value":"250ml"},{"label":"Ağırlık","value":"24g"},{"label":"Ağız","value":"24mm Modern"},{"label":"Yükseklik","value":"175mm"},{"label":"Çap","value":"58mm"},{"label":"Hammadde","value":"PET"},{"label":"Model","value":"Kristal"}]'::jsonb),
  ('pet-sise-500ml-duz', 'PET Şişe 500ml Düz', 'pet-siseler', '500ml düz model PET şişe. Şampuan, saç kremi ve sıvı sabun için yüksek hacimli düz tasarım. 28mm ağız çapı.', '500ml düz model kozmetik şişe', '500ml', '32g', '28mm', '210mm', '68mm', 'PET', ARRAY['Şeffaf','Beyaz','Siyah','Gümüş'], 'Düz', 'silindir', 5000, true, false, '[{"label":"Hacim","value":"500ml"},{"label":"Ağırlık","value":"32g"},{"label":"Ağız","value":"28mm"},{"label":"Yükseklik","value":"210mm"},{"label":"Çap","value":"68mm"},{"label":"Hammadde","value":"PET"},{"label":"Model","value":"Düz"}]'::jsonb),
  ('hdpe-sise-200ml-silindir', 'HDPE Şişe 200ml Silindir', 'plastik-siseler', '200ml HDPE silindir şişe. Losyon, krem ve vücut sütü ambalajı için dayanıklı, opak yapı. 24mm Klasik ağız.', '200ml HDPE silindir şişe', '200ml', '21g', '24mm Klasik', '155mm', '52mm', 'HDPE', ARRAY['Beyaz','Pembe','Mavi','Yeşil'], 'Silindir', 'silindir', 10000, true, true, '[{"label":"Hacim","value":"200ml"},{"label":"Ağırlık","value":"21g"},{"label":"Ağız","value":"24mm Klasik"},{"label":"Yükseklik","value":"155mm"},{"label":"Çap","value":"52mm"},{"label":"Hammadde","value":"HDPE"},{"label":"Model","value":"Silindir"}]'::jsonb),
  ('pp-sise-300ml-oval', 'PP Şişe 300ml Oval', 'plastik-siseler', '300ml PP oval şişe. Şampuan ve saç bakım ürünleri için esnek, sıkılabilir oval form. 24mm Modern ağız.', '300ml PP oval şişe', '300ml', '25.5g', '24mm Modern', '170mm', '60mm', 'PP', ARRAY['Beyaz','Siyah','Gümüş'], 'Oval', 'oval', 8000, true, false, '[{"label":"Hacim","value":"300ml"},{"label":"Ağırlık","value":"25.5g"},{"label":"Ağız","value":"24mm Modern"},{"label":"Yükseklik","value":"170mm"},{"label":"Çap","value":"60mm"},{"label":"Hammadde","value":"PP"},{"label":"Model","value":"Oval"}]'::jsonb),
  ('hdpe-sise-500ml-kare', 'HDPE Şişe 500ml Kare', 'plastik-siseler', '500ml HDPE kare şişe. Şampuan, duş jeli ve sıvı sabun ürünleri için modern kare form. 28mm ağız çapı.', '500ml HDPE kare şişe', '500ml', '32g', '28mm', '200mm', '70mm', 'HDPE', ARRAY['Beyaz','Siyah','Füme'], 'Kare', 'düz', 5000, true, true, '[{"label":"Hacim","value":"500ml"},{"label":"Ağırlık","value":"32g"},{"label":"Ağız","value":"28mm"},{"label":"Yükseklik","value":"200mm"},{"label":"Çap","value":"70mm"},{"label":"Hammadde","value":"HDPE"},{"label":"Model","value":"Kare"}]'::jsonb),
  ('kapak-18mm-vidali', 'Kapak 18mm Vidalı', 'kapaklar', '18mm vidalı kapak. Serum, esansiyel yağ ve küçük kozmetik şişeler için standart vidalı kapak.', '18mm vidalı kozmetik kapak', NULL, '1.5g', '18mm', NULL, NULL, 'PP', ARRAY['Beyaz','Siyah','Altın Yaldız','Gümüş'], NULL, NULL, 50000, true, false, '[{"label":"Çap","value":"18mm"},{"label":"Ağırlık","value":"1.5g"},{"label":"Hammadde","value":"PP"},{"label":"Tip","value":"Vidalı"}]'::jsonb),
  ('kapak-24mm-flip-top', 'Kapak 24mm Flip-Top', 'kapaklar', '24mm flip-top kapak. Şampuan, losyon ve kozmetik şişeler için tek elle açılabilen pratik kapak.', '24mm flip-top kozmetik kapak', NULL, '3g', '24mm Klasik', NULL, NULL, 'PP', ARRAY['Beyaz','Siyah','Pembe','Mavi','Şeffaf'], NULL, NULL, 30000, true, true, '[{"label":"Çap","value":"24mm"},{"label":"Ağırlık","value":"3g"},{"label":"Hammadde","value":"PP"},{"label":"Tip","value":"Flip-Top"},{"label":"Uyumluluk","value":"24mm Klasik / Modern"}]'::jsonb),
  ('kapak-24mm-disc-top', 'Kapak 24mm Disc-Top', 'kapaklar', '24mm disc-top kapak. Şampuan, duş jeli ve losyon şişeleri için basmalı disc-top açma sistemi.', '24mm disc-top kozmetik kapak', NULL, '3.5g', '24mm Modern', NULL, NULL, 'PP', ARRAY['Beyaz','Siyah','Şeffaf'], NULL, NULL, 30000, true, false, '[{"label":"Çap","value":"24mm"},{"label":"Ağırlık","value":"3.5g"},{"label":"Hammadde","value":"PP"},{"label":"Tip","value":"Disc-Top"},{"label":"Uyumluluk","value":"24mm Modern"}]'::jsonb),
  ('ic-tipa-18mm', 'İç Tıpa 18mm', 'tipalar', '18mm iç tıpa. Serum, esansiyel yağ ve kolonya şişeleri için sızdırmazlık sağlayan PE iç tıpa.', '18mm PE iç tıpa', NULL, '0.5g', '18mm', NULL, NULL, 'PE', ARRAY['Beyaz','Şeffaf'], NULL, NULL, 100000, true, true, '[{"label":"Çap","value":"18mm"},{"label":"Ağırlık","value":"0.5g"},{"label":"Hammadde","value":"PE"},{"label":"Tip","value":"İç Tıpa"}]'::jsonb),
  ('damlatici-tipa-20mm', 'Damlatıcı Tıpa 20mm', 'tipalar', '20mm damlatıcı tıpa. Serum, göz damlası ve esansiyel yağ şişeleri için kontrollü damlatma.', '20mm damlatıcı tıpa', NULL, '0.8g', '20mm', NULL, NULL, 'PE', ARRAY['Beyaz','Şeffaf'], NULL, NULL, 80000, true, true, '[{"label":"Çap","value":"20mm"},{"label":"Ağırlık","value":"0.8g"},{"label":"Hammadde","value":"PE"},{"label":"Tip","value":"Damlatıcı"},{"label":"Delik","value":"1mm kontrollü akış"}]'::jsonb),
  ('sizdirmazlik-tipasi-24mm', 'Sızdırmazlık Tıpası 24mm', 'tipalar', '24mm sızdırmazlık tıpası. Losyon, şampuan ve kozmetik şişeler için sızdırmazlık elemanı.', '24mm sızdırmazlık tıpası', NULL, '1g', '24mm Klasik', NULL, NULL, 'PE', ARRAY['Beyaz','Şeffaf'], NULL, NULL, 80000, true, false, '[{"label":"Çap","value":"24mm"},{"label":"Ağırlık","value":"1g"},{"label":"Hammadde","value":"PE"},{"label":"Tip","value":"Sızdırmazlık"},{"label":"Uyumluluk","value":"24mm Klasik / Modern"}]'::jsonb),
  ('parmak-sprey-18mm-ince-sis', 'Parmak Sprey 18mm İnce Sis', 'parmak-spreyler', '18mm parmak sprey mekanizması, ince sis tipi. Parfüm, kolonya ve küçük kozmetik şişeler için.', '18mm ince sis parmak sprey', NULL, '3.5g', '18mm', NULL, NULL, 'PP', ARRAY['Beyaz','Siyah','Altın Yaldız','Gümüş'], NULL, NULL, 30000, true, true, '[{"label":"Çap","value":"18mm"},{"label":"Ağırlık","value":"3.5g"},{"label":"Hammadde","value":"PP"},{"label":"Sprey Tipi","value":"İnce sis"},{"label":"Dozaj","value":"0.1ml / basım"}]'::jsonb),
  ('parmak-sprey-20mm-standart', 'Parmak Sprey 20mm Standart', 'parmak-spreyler', '20mm parmak sprey mekanizması. Kolonya, vücut spreyi ve oda parfümü şişeleri için.', '20mm standart parmak sprey', NULL, '4g', '20mm', NULL, NULL, 'PP', ARRAY['Beyaz','Siyah','Gümüş','Altın Yaldız'], NULL, NULL, 25000, true, true, '[{"label":"Çap","value":"20mm"},{"label":"Ağırlık","value":"4g"},{"label":"Hammadde","value":"PP"},{"label":"Sprey Tipi","value":"Standart sis"},{"label":"Dozaj","value":"0.15ml / basım"}]'::jsonb),
  ('parmak-sprey-24mm-parfum', 'Parmak Sprey 24mm Parfüm', 'parmak-spreyler', '24mm parmak sprey mekanizması, parfüm tipi. Büyük hacimli kolonya ve kozmetik sprey şişeleri için.', '24mm parfüm tipi parmak sprey', NULL, '5g', '24mm Klasik', NULL, NULL, 'PP', ARRAY['Beyaz','Siyah','Gümüş'], NULL, NULL, 20000, true, false, '[{"label":"Çap","value":"24mm"},{"label":"Ağırlık","value":"5g"},{"label":"Hammadde","value":"PP"},{"label":"Sprey Tipi","value":"Parfüm"},{"label":"Dozaj","value":"0.2ml / basım"}]'::jsonb),
  ('losyon-pompasi-28mm', 'Losyon Pompası 28mm', 'pompalar', '28mm losyon pompası. Sıvı sabun, losyon ve şampuan şişeleri için dozajlı pompa mekanizması.', '28mm losyon dozajlama pompası', NULL, '8g', '28mm', NULL, NULL, 'PP', ARRAY['Beyaz','Siyah','Gümüş','Altın Yaldız'], NULL, NULL, 20000, true, true, '[{"label":"Çap","value":"28mm"},{"label":"Ağırlık","value":"8g"},{"label":"Hammadde","value":"PP"},{"label":"Tip","value":"Losyon Pompası"},{"label":"Dozaj","value":"1ml / basım"},{"label":"Boru Uzunluğu","value":"195mm"}]'::jsonb),
  ('kopuk-pompasi-28mm', 'Köpük Pompası 28mm', 'pompalar', '28mm köpük pompası. El yıkama sıvısı ve yüz temizleme köpüğü şişeleri için hava karışımlı köpük üreten pompa.', '28mm köpük üretim pompası', NULL, '10g', '28mm', NULL, NULL, 'PP', ARRAY['Beyaz','Siyah','Şeffaf'], NULL, NULL, 15000, true, true, '[{"label":"Çap","value":"28mm"},{"label":"Ağırlık","value":"10g"},{"label":"Hammadde","value":"PP"},{"label":"Tip","value":"Köpük Pompası"},{"label":"Dozaj","value":"0.8ml / basım"},{"label":"Mesh","value":"Çift filtreli"}]'::jsonb),
  ('krem-pompasi-24mm', 'Krem Pompası 24mm', 'pompalar', '24mm krem dozajlama pompası. Yoğun kıvamlı losyon, krem ve saç bakım ürünleri için güçlü pompa.', '24mm krem dozajlama pompası', NULL, '7g', '24mm Modern', NULL, NULL, 'PP', ARRAY['Beyaz','Siyah','Gümüş'], NULL, NULL, 20000, true, false, '[{"label":"Çap","value":"24mm"},{"label":"Ağırlık","value":"7g"},{"label":"Hammadde","value":"PP"},{"label":"Tip","value":"Krem Pompası"},{"label":"Dozaj","value":"1.5ml / basım"},{"label":"Boru Uzunluğu","value":"165mm"}]'::jsonb),
  ('tetikli-puskurtucu-28mm-standart', 'Tetikli Püskürtücü 28mm Standart', 'tetikli-pusturtuculer', '28mm standart tetikli püskürtücü. Temizlik sıvıları, cam silici ve çok amaçlı sprey ürünleri için.', '28mm standart tetikli püskürtücü', NULL, '25g', '28mm', NULL, NULL, 'PP', ARRAY['Beyaz','Siyah','Mavi','Yeşil'], NULL, NULL, 10000, true, true, '[{"label":"Çap","value":"28mm"},{"label":"Ağırlık","value":"25g"},{"label":"Hammadde","value":"PP"},{"label":"Tip","value":"Standart Tetikli"},{"label":"Dozaj","value":"1.2ml / basım"},{"label":"Mod","value":"Sis / Jet / Kapalı"}]'::jsonb),
  ('tetikli-puskurtucu-28mm-kopuklu', 'Tetikli Püskürtücü 28mm Köpüklü', 'tetikli-pusturtuculer', '28mm köpüklü tetikli püskürtücü. Banyo ve mutfak temizleyicileri için köpük modlu tetik mekanizması.', '28mm köpüklü tetikli püskürtücü', NULL, '28g', '28mm', NULL, NULL, 'PP', ARRAY['Beyaz','Siyah','Mavi'], NULL, NULL, 10000, true, true, '[{"label":"Çap","value":"28mm"},{"label":"Ağırlık","value":"28g"},{"label":"Hammadde","value":"PP"},{"label":"Tip","value":"Köpüklü Tetikli"},{"label":"Dozaj","value":"1.5ml / basım"},{"label":"Mod","value":"Köpük / Jet / Kapalı"}]'::jsonb),
  ('plastik-huni-30mm', 'Plastik Huni 30mm', 'huniler', '30mm ağız çaplı plastik huni. Küçük hacimli kozmetik, parfüm ve serum şişelerine dolum işlemleri için ideal.', '30mm kozmetik dolum hunisi', NULL, '2g', NULL, NULL, '30mm', 'PP', ARRAY['Beyaz','Şeffaf'], NULL, NULL, 50000, true, true, '[{"label":"Ağız Çapı","value":"30mm"},{"label":"Ağırlık","value":"2g"},{"label":"Hammadde","value":"PP"},{"label":"Tip","value":"Mini Huni"}]'::jsonb),
  ('plastik-huni-50mm', 'Plastik Huni 50mm', 'huniler', '50mm ağız çaplı plastik huni. Orta ve büyük hacimli şişelere dolum işlemleri için geniş ağızlı tasarım.', '50mm geniş ağızlı dolum hunisi', NULL, '4g', NULL, NULL, '50mm', 'PP', ARRAY['Beyaz','Şeffaf'], NULL, NULL, 30000, true, false, '[{"label":"Ağız Çapı","value":"50mm"},{"label":"Ağırlık","value":"4g"},{"label":"Hammadde","value":"PP"},{"label":"Tip","value":"Standart Huni"}]'::jsonb)
ON CONFLICT (slug) DO NOTHING;

-- ================================================
-- 7. Storage Bucket
-- ================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read product images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'products');

CREATE POLICY "Admin upload product images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'products');

CREATE POLICY "Admin delete product images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'products');
