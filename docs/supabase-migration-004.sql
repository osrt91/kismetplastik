-- site_content table: stores all editable page content as JSON
CREATE TABLE IF NOT EXISTS site_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_key TEXT UNIQUE NOT NULL,
  content JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_site_content_page ON site_content(page_key);

-- Auto-update trigger
CREATE OR REPLACE TRIGGER site_content_updated_at
  BEFORE UPDATE ON site_content FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "site_content_public_read" ON site_content FOR SELECT USING (true);
CREATE POLICY "site_content_admin_write" ON site_content FOR ALL USING (true) WITH CHECK (true);

-- Seed with default content for all pages
INSERT INTO site_content (page_key, content) VALUES
('hero', '{"title_tr": "Kozmetik Ambalajın Güvenilir Adresi", "title_en": "Your Trusted Partner in Cosmetic Packaging", "subtitle_tr": "1969 yılından bu yana kozmetik sektörüne özel PET şişe, kapak, sprey ve pompa üretimi", "subtitle_en": "Manufacturing PET bottles, caps, sprays and pumps for cosmetics since 1969", "cta_text_tr": "Ürünleri İncele", "cta_text_en": "Browse Products", "cta_link": "/urunler"}'),
('stats', '{"items": [{"value": "55+", "label_tr": "Yıllık Tecrübe", "label_en": "Years Experience"}, {"value": "500+", "label_tr": "Ürün Çeşidi", "label_en": "Product Varieties"}, {"value": "50+", "label_tr": "Ülkeye İhracat", "label_en": "Export Countries"}, {"value": "10M+", "label_tr": "Aylık Üretim", "label_en": "Monthly Production"}]}'),
('about', '{"title_tr": "Hakkımızda", "title_en": "About Us", "content_tr": "Kısmet Plastik, 1969 yılında İstanbul''da kurulmuştur. Yarım asrı aşan tecrübemizle kozmetik, kişisel bakım ve endüstriyel ambalaj sektöründe faaliyet göstermekteyiz.", "content_en": "Kısmet Plastik was founded in Istanbul in 1969. With over half a century of experience, we operate in cosmetic, personal care and industrial packaging sectors.", "mission_tr": "Müşterilerimize en kaliteli ambalaj çözümlerini sunmak.", "mission_en": "To provide our customers with the highest quality packaging solutions.", "vision_tr": "Sürdürülebilir ambalaj çözümlerinde Türkiye''nin lider firması olmak.", "vision_en": "To be Turkey''s leading company in sustainable packaging solutions."}'),
('contact', '{"phone": "+90 212 485 00 00", "email": "bilgi@kismetplastik.com", "address_tr": "Kısmet Plastik San. ve Tic. A.Ş., Hadımköy, İstanbul", "address_en": "Kısmet Plastik San. ve Tic. A.Ş., Hadımköy, Istanbul", "whatsapp": "+905321234567", "maps_embed": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3008.159!2d28.707!3d41.094!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0:0x0!2zNDHCsDA1JzMwLjAiTiAyOMKwNDInMjUuMiJF!5e0!3m2!1sen!2str!4v1234567890", "working_hours_tr": "Pazartesi - Cuma: 08:00 - 18:00", "working_hours_en": "Monday - Friday: 08:00 - 18:00"}'),
('social', '{"facebook": "https://facebook.com/kismetplastik", "instagram": "https://instagram.com/kismetplastik", "linkedin": "https://linkedin.com/company/kismetplastik", "youtube": ""}'),
('faq', '{"items": [{"q_tr": "Minimum sipariş miktarı nedir?", "q_en": "What is the minimum order quantity?", "a_tr": "Ürün tipine göre minimum sipariş miktarımız 5.000 - 100.000 adet arasında değişmektedir.", "a_en": "Our minimum order quantity varies between 5,000 - 100,000 pieces depending on the product type."}, {"q_tr": "Teslimat süresi ne kadardır?", "q_en": "What is the delivery time?", "a_tr": "Standart ürünlerde 7-15 iş günü, özel kalıp ürünlerde 30-45 iş günüdür.", "a_en": "7-15 business days for standard products, 30-45 business days for custom mold products."}, {"q_tr": "Numune gönderebilir misiniz?", "q_en": "Can you send samples?", "a_tr": "Evet, stoğumuzda bulunan ürünlerden ücretsiz numune gönderiyoruz.", "a_en": "Yes, we send free samples from our stock products."}, {"q_tr": "Özel kalıp üretimi yapıyor musunuz?", "q_en": "Do you manufacture custom molds?", "a_tr": "Evet, müşterilerimizin tasarımına göre özel kalıp üretimi yapıyoruz.", "a_en": "Yes, we manufacture custom molds according to our customers'' designs."}, {"q_tr": "Hangi sertifikalara sahipsiniz?", "q_en": "What certifications do you have?", "a_tr": "ISO 9001, ISO 14001 ve FSSC 22000 sertifikalarına sahibiz.", "a_en": "We hold ISO 9001, ISO 14001 and FSSC 22000 certifications."}]}')
ON CONFLICT (page_key) DO NOTHING;
