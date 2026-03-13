/**
 * Seed script: certificates, trade_shows, resources, faq_items, references, milestones
 * Reads from static data files and upserts into their respective Supabase tables.
 *
 * Usage:  node scripts/seed-cms-static-data.mjs
 */
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ─── CERTIFICATES ────────────────────────────────────────────────────────────

const certificates = [
  {
    name_tr: "ISO 9001:2015 Kalite Yönetim Sistemi",
    name_en: "ISO 9001:2015 Quality Management System",
    description_tr: "Ürün ve hizmetlerin müşteri beklentilerini karşılamasını sağlayan uluslararası kalite yönetim standardı. Sürekli iyileştirme ve müşteri memnuniyetine odaklanır.",
    description_en: "International quality management standard ensuring products and services meet customer expectations. Focuses on continuous improvement and customer satisfaction.",
    icon: "Shield",
    pdf_url: "/sertifikalar/ISO-9001.pdf",
    issuer: "TSE - Türk Standartları Enstitüsü",
    valid_until: "2027-12-31",
    is_active: true,
    display_order: 1,
  },
  {
    name_tr: "ISO 22000:2018 Gıda Güvenliği Yönetim Sistemi",
    name_en: "ISO 22000:2018 Food Safety Management System",
    description_tr: "Gıda zincirindeki tüm kuruluşlar için gıda güvenliği yönetim sistemi standardı. Kozmetik ambalajda ürün güvenliğini garanti eder.",
    description_en: "Food safety management system standard for all organizations in the food chain. Guarantees product safety in cosmetic packaging.",
    icon: "ShieldCheck",
    pdf_url: "/sertifikalar/ISO-22000.pdf",
    issuer: "Bureau Veritas",
    valid_until: "2027-06-30",
    is_active: true,
    display_order: 2,
  },
  {
    name_tr: "FSSC 22000 Gıda Güvenliği Sertifikası",
    name_en: "FSSC 22000 Food Safety Certification",
    description_tr: "Gıda ile temas eden ambalaj malzemelerinin güvenliğini sağlayan ileri düzey sertifikasyon. GFSI tarafından tanınmış bir standarttır.",
    description_en: "Advanced certification ensuring the safety of food contact packaging materials. A GFSI-recognized standard.",
    icon: "BadgeCheck",
    pdf_url: "/sertifikalar/FSSC-22000.pdf",
    issuer: "SGS",
    valid_until: "2027-09-15",
    is_active: true,
    display_order: 3,
  },
  {
    name_tr: "TSE Belgesi",
    name_en: "TSE Certificate",
    description_tr: "Türk Standartları Enstitüsü tarafından verilen ürün uygunluk belgesi. Ürünlerin Türk standartlarına uygunluğunu belgeler.",
    description_en: "Product conformity certificate issued by the Turkish Standards Institution. Certifies that products comply with Turkish standards.",
    icon: "Award",
    pdf_url: "/sertifikalar/TSE.pdf",
    issuer: "TSE - Türk Standartları Enstitüsü",
    valid_until: "2027-03-31",
    is_active: true,
    display_order: 4,
  },
  {
    name_tr: "CE İşareti Uygunluk Belgesi",
    name_en: "CE Marking Certificate of Conformity",
    description_tr: "Ürünlerin Avrupa Birliği sağlık, güvenlik ve çevre koruma standartlarına uygunluğunu gösteren zorunlu belge.",
    description_en: "Mandatory certificate indicating product compliance with European Union health, safety, and environmental protection standards.",
    icon: "CheckCircle",
    pdf_url: "/sertifikalar/CE.pdf",
    issuer: "Notified Body EU",
    valid_until: "2028-01-15",
    is_active: true,
    display_order: 5,
  },
  {
    name_tr: "GMP - İyi Üretim Uygulamaları",
    name_en: "GMP - Good Manufacturing Practices",
    description_tr: "Kozmetik ambalaj üretiminde hijyen, kalite ve tutarlılığı sağlayan uluslararası üretim standardı. ISO 22716 kapsamında belgelenmiştir.",
    description_en: "International manufacturing standard ensuring hygiene, quality, and consistency in cosmetic packaging production. Certified under ISO 22716.",
    icon: "FlaskConical",
    pdf_url: "/sertifikalar/GMP.pdf",
    issuer: "TÜV SÜD",
    valid_until: "2027-11-30",
    is_active: true,
    display_order: 6,
  },
];

// ─── TRADE SHOWS ─────────────────────────────────────────────────────────────

const tradeShows = [
  {
    name_tr: "Beautyworld Middle East 2026",
    name_en: "Beautyworld Middle East 2026",
    description_tr: "Orta Doğu'nun en büyük güzellik ve kozmetik fuarı. Kısmet Plastik olarak en yeni PET şişe ve ambalaj çözümlerimizi sergileyeceğiz. Bölgedeki distribütörlük fırsatları için standımızı ziyaret edin.",
    description_en: "The largest beauty and cosmetics trade fair in the Middle East. Kismet Plastik will showcase our latest PET bottle and packaging solutions. Visit our booth for distribution opportunities in the region.",
    location_tr: "Dubai World Trade Centre, Dubai, BAE",
    location_en: "Dubai World Trade Centre, Dubai, UAE",
    start_date: "2026-10-05",
    end_date: "2026-10-07",
    booth: "Hall 3, Stand B42",
    website: "https://www.beautyworldme.com",
    status: "upcoming",
    is_active: true,
  },
  {
    name_tr: "Cosmoprof Worldwide Bologna 2026",
    name_en: "Cosmoprof Worldwide Bologna 2026",
    description_tr: "Dünyanın en prestijli kozmetik ambalaj fuarı. Sürdürülebilir ambalaj çözümlerimizi ve yeni ürün serilerimizi tanıtmak için Bologna'dayız. Avrupa pazarı için iş birliği fırsatları için bekliyoruz.",
    description_en: "The world's most prestigious cosmetic packaging trade fair. We will be in Bologna to present our sustainable packaging solutions and new product lines. We look forward to collaboration opportunities for the European market.",
    location_tr: "BolognaFiere, Bologna, İtalya",
    location_en: "BolognaFiere, Bologna, Italy",
    start_date: "2026-04-23",
    end_date: "2026-04-25",
    booth: "Pavilion 20, Stand C18",
    website: "https://www.cosmoprof.com",
    status: "upcoming",
    is_active: true,
  },
  {
    name_tr: "İstanbul Ambalaj Fuarı 2025",
    name_en: "Istanbul Packaging Fair 2025",
    description_tr: "Türkiye'nin en büyük ambalaj ve plastik fuarı. PET şişe, kapak, pompa ve tetikli püskürtücü ürünlerimizi sergiledik. Yurt içi ve yurt dışı müşterilerimizle verimli görüşmeler gerçekleştirdik.",
    description_en: "Turkey's largest packaging and plastics fair. We exhibited our PET bottles, caps, pumps, and trigger sprayer products. We held productive meetings with our domestic and international customers.",
    location_tr: "TÜYAP Fuar ve Kongre Merkezi, İstanbul, Türkiye",
    location_en: "TUYAP Fair and Congress Center, Istanbul, Turkey",
    start_date: "2025-09-17",
    end_date: "2025-09-20",
    booth: "Hall 5, Stand D10",
    website: "https://www.istanbulambalajfuari.com",
    status: "past",
    is_active: true,
  },
];

// ─── RESOURCES ───────────────────────────────────────────────────────────────

const resources = [
  {
    title_tr: "Kozmetik Ambalaj Seçim Rehberi",
    title_en: "Cosmetic Packaging Selection Guide",
    description_tr: "PET, HDPE, PP ve cam alternatiflerini karşılaştıran, hacim seçimi, ağız çapı uyumluluğu ve maliyet analizi içeren kapsamlı rehber. Kozmetik markalar için doğru ambalaj seçiminin tüm adımları.",
    description_en: "A comprehensive guide comparing PET, HDPE, PP and glass alternatives, including volume selection, neck finish compatibility and cost analysis. All steps for choosing the right packaging for cosmetic brands.",
    category_tr: "Rehber",
    category_en: "Guide",
    file_url: "/docs/kozmetik-ambalaj-secim-rehberi.pdf",
    page_count: 24,
    is_active: true,
    display_order: 1,
  },
  {
    title_tr: "PET Şişe Teknik Spesifikasyonları",
    title_en: "PET Bottle Technical Specifications",
    description_tr: "PET şişe üretim parametreleri, malzeme özellikleri, basınç dayanım değerleri, boyutsal toleranslar ve kalıp teknik çizimleri. Mühendisler ve üretim yöneticileri için teknik referans dokümanı.",
    description_en: "PET bottle production parameters, material properties, pressure resistance values, dimensional tolerances and mold technical drawings. Technical reference document for engineers and production managers.",
    category_tr: "Teknik Doküman",
    category_en: "Technical Document",
    file_url: "/docs/pet-sise-teknik-spesifikasyonlari.pdf",
    page_count: 36,
    is_active: true,
    display_order: 2,
  },
  {
    title_tr: "Sürdürülebilir Ambalaj Trendleri",
    title_en: "Sustainable Packaging Trends",
    description_tr: "rPET kullanımı, biyobozunur malzemeler, karbon ayak izi azaltma stratejileri ve AB ambalaj yönetmelikleri. 2026 yılı sürdürülebilirlik hedefleri ve sektör analizleri.",
    description_en: "rPET usage, biodegradable materials, carbon footprint reduction strategies and EU packaging regulations. 2026 sustainability targets and industry analyses.",
    category_tr: "Rapor",
    category_en: "Report",
    file_url: "/docs/surdurulebilir-ambalaj-trendleri.pdf",
    page_count: 18,
    is_active: true,
    display_order: 3,
  },
  {
    title_tr: "Kalite Kontrol Prosedürleri",
    title_en: "Quality Control Procedures",
    description_tr: "ISO 9001 ve FSSC 22000 standartlarına uygun kalite kontrol adımları, test yöntemleri, kabul kriterleri ve raporlama süreçleri. Tedarikçi değerlendirme ve denetim rehberi.",
    description_en: "Quality control steps compliant with ISO 9001 and FSSC 22000 standards, test methods, acceptance criteria and reporting processes. Supplier evaluation and audit guide.",
    category_tr: "Kalite",
    category_en: "Quality",
    file_url: "/docs/kalite-kontrol-prosedurleri.pdf",
    page_count: 28,
    is_active: true,
    display_order: 4,
  },
];

// ─── FAQ ITEMS ───────────────────────────────────────────────────────────────
// Extracted from src/app/[locale]/sss/page.tsx faqData array
// Note: English translations are provided for DB migration; the component
//       currently shows Turkish only.

const faqItems = [
  {
    question_tr: "Kısmet Plastik hangi ürünleri üretiyor?",
    question_en: "What products does Kısmet Plastik manufacture?",
    answer_tr: "PET şişeler, plastik şişeler, kolonya şişeleri, sprey ambalajlar, oda parfümü şişeleri, sıvı sabun şişeleri, kapaklar ve özel üretim kozmetik ambalaj ürünleri üretmekteyiz. Kozmetik, kişisel bakım ve parfümeri sektörlerine yönelik geniş bir ürün yelpazemiz bulunmaktadır.",
    answer_en: "We manufacture PET bottles, plastic bottles, cologne bottles, spray packaging, room fragrance bottles, liquid soap bottles, caps and custom-made cosmetic packaging products. We have a wide product range for the cosmetics, personal care and perfumery sectors.",
    category: "Genel",
    display_order: 1,
    is_active: true,
  },
  {
    question_tr: "Hangi sektörlere hizmet veriyorsunuz?",
    question_en: "Which sectors do you serve?",
    answer_tr: "Kozmetik, parfümeri, kişisel bakım, temizlik, otelcilik sektörlerine hizmet vermekteyiz. Her sektörün standartlarına uygun ürünler sunuyoruz.",
    answer_en: "We serve the cosmetics, perfumery, personal care, cleaning, and hospitality sectors. We offer products that meet the standards of each sector.",
    category: "Genel",
    display_order: 2,
    is_active: true,
  },
  {
    question_tr: "Minimum sipariş miktarı nedir?",
    question_en: "What is the minimum order quantity?",
    answer_tr: "Minimum sipariş miktarları ürüne göre değişmektedir. PET ve plastik şişelerde genellikle 5.000-20.000 adet, kapaklarda 20.000-50.000 adet minimum sipariş alıyoruz. Detaylı bilgi için teklif formumuzu doldurabilirsiniz.",
    answer_en: "Minimum order quantities vary by product. For PET and plastic bottles, we generally accept minimum orders of 5,000-20,000 pieces, and for caps, 20,000-50,000 pieces. For detailed information, you can fill out our quote form.",
    category: "Sipariş",
    display_order: 3,
    is_active: true,
  },
  {
    question_tr: "Sipariş süreci nasıl işliyor?",
    question_en: "How does the order process work?",
    answer_tr: "Teklif formumuzu doldurmanız veya bizi aramanız yeterlidir. Uzman ekibimiz ihtiyaçlarınızı değerlendirir, size özel bir teklif hazırlar. Onayınızın ardından üretim planlanır ve belirtilen sürede teslimat yapılır.",
    answer_en: "Simply fill out our quote form or call us. Our expert team evaluates your needs and prepares a custom quote. After your approval, production is planned and delivery is made within the specified time.",
    category: "Sipariş",
    display_order: 4,
    is_active: true,
  },
  {
    question_tr: "Teslimat süreleri ne kadardır?",
    question_en: "What are the delivery times?",
    answer_tr: "Standart ürünlerde stoktan 3-5 iş günü, özel üretim siparişlerde 15-30 iş günü içinde teslimat yapılmaktadır. Sipariş miktarına ve ürün özelliklerine göre bu süreler değişebilir.",
    answer_en: "Standard products are delivered from stock within 3-5 business days, and custom production orders within 15-30 business days. These times may vary depending on order quantity and product specifications.",
    category: "Sipariş",
    display_order: 5,
    is_active: true,
  },
  {
    question_tr: "Ödeme koşulları nelerdir?",
    question_en: "What are the payment terms?",
    answer_tr: "Kurumsal müşterilerimize vadeli ödeme, çek, havale/EFT ve kredi kartı ile ödeme seçenekleri sunmaktayız. Yeni müşterilerimiz için ilk siparişte peşin veya kapıda ödeme şartı uygulanabilir.",
    answer_en: "We offer deferred payment, check, bank transfer/EFT and credit card payment options to our corporate customers. Cash on delivery or advance payment may apply for the first order of new customers.",
    category: "Sipariş",
    display_order: 6,
    is_active: true,
  },
  {
    question_tr: "Özel tasarım ürün yaptırabilir miyim?",
    question_en: "Can I get custom-designed products made?",
    answer_tr: "Evet, markanıza özel kalıp tasarımı ve ürün geliştirme hizmeti sunuyoruz. Kalıp maliyeti ve üretim süreci hakkında detaylı bilgi almak için bizimle iletişime geçebilirsiniz.",
    answer_en: "Yes, we offer custom mold design and product development services for your brand. Contact us for detailed information about mold costs and the production process.",
    category: "Ürün",
    display_order: 7,
    is_active: true,
  },
  {
    question_tr: "Ürünleriniz kozmetik sektörüne uygun mu?",
    question_en: "Are your products suitable for the cosmetic industry?",
    answer_tr: "Evet, tüm ürünlerimiz kozmetik sektörü standartlarına uygun olarak üretilmektedir. ISO 9001 kalite yönetim sistemi çerçevesinde üretilen ürünlerimiz için ilgili test raporları ve uygunluk sertifikaları mevcuttur.",
    answer_en: "Yes, all our products are manufactured in compliance with cosmetic industry standards. Relevant test reports and compliance certificates are available for our products manufactured under the ISO 9001 quality management system.",
    category: "Ürün",
    display_order: 8,
    is_active: true,
  },
  {
    question_tr: "Ürünleriniz geri dönüştürülebilir mi?",
    question_en: "Are your products recyclable?",
    answer_tr: "PET (Polietilen Tereftalat) %100 geri dönüştürülebilir bir malzemedir. Tüm ürünlerimiz geri dönüşüm kodlamasına sahiptir ve çevreye duyarlı üretim anlayışımızla sürdürülebilirliğe katkıda bulunuyoruz.",
    answer_en: "PET (Polyethylene Terephthalate) is a 100% recyclable material. All our products have recycling codes and we contribute to sustainability with our environmentally conscious production approach.",
    category: "Ürün",
    display_order: 9,
    is_active: true,
  },
  {
    question_tr: "Hangi kalite sertifikalarına sahipsiniz?",
    question_en: "What quality certifications do you have?",
    answer_tr: "ISO 9001 (Kalite Yönetimi), ISO 14001 (Çevre Yönetimi), ISO 45001 (İSG), ISO 10002 (Müşteri Memnuniyeti), ISO/IEC 27001 (Bilgi Güvenliği) ve CE sertifikalarına sahibiz.",
    answer_en: "We hold ISO 9001 (Quality Management), ISO 14001 (Environmental Management), ISO 45001 (OHS), ISO 10002 (Customer Satisfaction), ISO/IEC 27001 (Information Security) and CE certifications.",
    category: "Kalite",
    display_order: 10,
    is_active: true,
  },
  {
    question_tr: "Kalite kontrol süreciniz nasıldır?",
    question_en: "What is your quality control process?",
    answer_tr: "4 aşamalı kalite kontrol sürecimiz: Hammadde kontrolü, üretim süreç kontrolü, ürün testleri ve son kontrol & sevkiyat aşamalarından oluşur. Modern laboratuvarımızda boyutsal ölçüm, basınç dayanım, sızdırmazlık ve kozmetik uygunluk testleri yapılmaktadır.",
    answer_en: "Our 4-stage quality control process consists of: raw material control, production process control, product testing, and final inspection & shipment stages. Dimensional measurement, pressure resistance, leak and cosmetic compliance tests are performed in our modern laboratory.",
    category: "Kalite",
    display_order: 11,
    is_active: true,
  },
  {
    question_tr: "Bayi olmak için ne gerekiyor?",
    question_en: "What is required to become a dealer?",
    answer_tr: "Bayilik başvurusu için ticaret sicil belgesi, vergi levhası ve firma bilgileriniz ile bize başvurmanız yeterlidir. Değerlendirme sonucunda bölgesel bayilik veya yetkili satıcılık sözleşmesi yapılmaktadır.",
    answer_en: "To apply for dealership, simply contact us with your trade registry certificate, tax plate and company information. After evaluation, a regional dealership or authorized dealer agreement is made.",
    category: "Bayi",
    display_order: 12,
    is_active: true,
  },
];

// ─── REFERENCES ──────────────────────────────────────────────────────────────

const references = [
  { name: "Atelier Kozmetik", logo_url: "/references/atelier.svg", sector_tr: "Kozmetik", sector_en: "Cosmetics", website: null, is_active: true, display_order: 1 },
  { name: "Orient Parfüm", logo_url: "/references/orient.svg", sector_tr: "Parfümeri", sector_en: "Perfumery", website: null, is_active: true, display_order: 2 },
  { name: "Demir Kozmetik", logo_url: "/references/demir.svg", sector_tr: "Kozmetik", sector_en: "Cosmetics", website: null, is_active: true, display_order: 3 },
  { name: "Anadolu Temizlik", logo_url: "/references/anadolu.svg", sector_tr: "Temizlik", sector_en: "Cleaning", website: null, is_active: true, display_order: 4 },
  { name: "Bella Beauty", logo_url: "/references/bella.svg", sector_tr: "Güzellik", sector_en: "Beauty", website: null, is_active: true, display_order: 5 },
  { name: "Star Otel Grubu", logo_url: "/references/star.svg", sector_tr: "Otelcilik", sector_en: "Hospitality", website: null, is_active: true, display_order: 6 },
  { name: "Green Nature", logo_url: "/references/green.svg", sector_tr: "Doğal Kozmetik", sector_en: "Natural Cosmetics", website: null, is_active: true, display_order: 7 },
  { name: "Premium Care", logo_url: "/references/premium.svg", sector_tr: "Kişisel Bakım", sector_en: "Personal Care", website: null, is_active: true, display_order: 8 },
];

// ─── MILESTONES ──────────────────────────────────────────────────────────────

const milestones = [
  {
    year: 1969,
    title_tr: "Kuruluş",
    title_en: "Foundation",
    description_tr: "Kısmet Plastik, İstanbul'da küçük bir atölye olarak kuruldu. Kozmetik ambalaj sektöründe ilk adımlarımızı attık.",
    description_en: "Kismet Plastik was founded as a small workshop in Istanbul. We took our first steps in the cosmetic packaging industry.",
    icon: "Flag",
    display_order: 1,
  },
  {
    year: 1980,
    title_tr: "İlk Fabrika",
    title_en: "First Factory",
    description_tr: "Artan talep doğrultusunda ilk fabrikamızı açarak üretim kapasitemizi önemli ölçüde artırdık.",
    description_en: "In response to growing demand, we opened our first factory and significantly increased our production capacity.",
    icon: "Building",
    display_order: 2,
  },
  {
    year: 1995,
    title_tr: "ISO 9001 Sertifikası",
    title_en: "ISO 9001 Certification",
    description_tr: "Uluslararası kalite standartlarına uygunluğumuz ISO 9001 sertifikası ile tescillendi.",
    description_en: "Our compliance with international quality standards was certified with ISO 9001 certification.",
    icon: "Award",
    display_order: 3,
  },
  {
    year: 2005,
    title_tr: "Yeni Üretim Hattı",
    title_en: "New Production Line",
    description_tr: "Son teknoloji enjeksiyon ve şişme kalıplama makineleriyle donattık, üretim hattı yenilendi.",
    description_en: "We equipped our facility with state-of-the-art injection and blow molding machines, renewing our production line.",
    icon: "Cog",
    display_order: 4,
  },
  {
    year: 2010,
    title_tr: "İhracat Başlangıcı",
    title_en: "Export Launch",
    description_tr: "Avrupa ve Orta Doğu pazarlarına ihracata başlayarak global bir marka olmaya doğru ilerledik.",
    description_en: "We began exporting to European and Middle Eastern markets, moving toward becoming a global brand.",
    icon: "Globe",
    display_order: 5,
  },
  {
    year: 2015,
    title_tr: "Yeni Tesis",
    title_en: "New Facility",
    description_tr: "15.000 m2 kapalı alana sahip modern üretim tesisimiz hizmete girdi. Üretim kapasitemiz iki katına çıktı.",
    description_en: "Our modern production facility with 15,000 m2 of enclosed space was opened. Our production capacity doubled.",
    icon: "Factory",
    display_order: 6,
  },
  {
    year: 2020,
    title_tr: "500+ Ürün",
    title_en: "500+ Products",
    description_tr: "Ürün portföyümüz 500'ü aşarak sektörün en geniş ürün yelpazesine sahip firmalardan biri olduk.",
    description_en: "Our product portfolio exceeded 500, making us one of the companies with the widest product range in the industry.",
    icon: "Package",
    display_order: 7,
  },
  {
    year: 2026,
    title_tr: "B2B Dijital Platform",
    title_en: "B2B Digital Platform",
    description_tr: "Dijital dönüşüm vizyonumuz doğrultusunda B2B e-ticaret platformumuzu hayata geçirdik.",
    description_en: "In line with our digital transformation vision, we launched our B2B e-commerce platform.",
    icon: "Monitor",
    display_order: 8,
  },
];

// ─── SEED FUNCTIONS ──────────────────────────────────────────────────────────

async function seedCertificates() {
  console.log("Seeding certificates...");
  const { data, error } = await supabase
    .from("certificates")
    .upsert(certificates, { onConflict: "name_tr" })
    .select();

  if (error) {
    console.error("  Error:", error.message);
    // Try insert if upsert fails (no unique constraint on name_tr)
    const { count } = await supabase.from("certificates").select("*", { count: "exact", head: true });
    if (count && count > 0) {
      console.log(`  Skipping — ${count} certificates already exist.`);
      return;
    }
    const { data: insertData, error: insertError } = await supabase
      .from("certificates")
      .insert(certificates)
      .select();
    if (insertError) {
      console.error("  Insert also failed:", insertError.message);
      return;
    }
    console.log(`  Inserted ${insertData.length} certificates.`);
    return;
  }
  console.log(`  Upserted ${data.length} certificates.`);
}

async function seedTradeShows() {
  console.log("Seeding trade_shows...");
  const { data, error } = await supabase
    .from("trade_shows")
    .upsert(tradeShows, { onConflict: "name_tr" })
    .select();

  if (error) {
    const { count } = await supabase.from("trade_shows").select("*", { count: "exact", head: true });
    if (count && count > 0) {
      console.log(`  Skipping — ${count} trade shows already exist.`);
      return;
    }
    const { data: insertData, error: insertError } = await supabase
      .from("trade_shows")
      .insert(tradeShows)
      .select();
    if (insertError) {
      console.error("  Insert failed:", insertError.message);
      return;
    }
    console.log(`  Inserted ${insertData.length} trade shows.`);
    return;
  }
  console.log(`  Upserted ${data.length} trade shows.`);
}

async function seedResources() {
  console.log("Seeding resources...");
  const { data, error } = await supabase
    .from("resources")
    .upsert(resources, { onConflict: "title_tr" })
    .select();

  if (error) {
    const { count } = await supabase.from("resources").select("*", { count: "exact", head: true });
    if (count && count > 0) {
      console.log(`  Skipping — ${count} resources already exist.`);
      return;
    }
    const { data: insertData, error: insertError } = await supabase
      .from("resources")
      .insert(resources)
      .select();
    if (insertError) {
      console.error("  Insert failed:", insertError.message);
      return;
    }
    console.log(`  Inserted ${insertData.length} resources.`);
    return;
  }
  console.log(`  Upserted ${data.length} resources.`);
}

async function seedFaqItems() {
  console.log("Seeding faq_items...");
  const { data, error } = await supabase
    .from("faq_items")
    .upsert(faqItems, { onConflict: "question_tr" })
    .select();

  if (error) {
    const { count } = await supabase.from("faq_items").select("*", { count: "exact", head: true });
    if (count && count > 0) {
      console.log(`  Skipping — ${count} FAQ items already exist.`);
      return;
    }
    const { data: insertData, error: insertError } = await supabase
      .from("faq_items")
      .insert(faqItems)
      .select();
    if (insertError) {
      console.error("  Insert failed:", insertError.message);
      return;
    }
    console.log(`  Inserted ${insertData.length} FAQ items.`);
    return;
  }
  console.log(`  Upserted ${data.length} FAQ items.`);
}

async function seedReferences() {
  console.log("Seeding references...");
  const { data, error } = await supabase
    .from("references")
    .upsert(references, { onConflict: "name" })
    .select();

  if (error) {
    const { count } = await supabase.from("references").select("*", { count: "exact", head: true });
    if (count && count > 0) {
      console.log(`  Skipping — ${count} references already exist.`);
      return;
    }
    const { data: insertData, error: insertError } = await supabase
      .from("references")
      .insert(references)
      .select();
    if (insertError) {
      console.error("  Insert failed:", insertError.message);
      return;
    }
    console.log(`  Inserted ${insertData.length} references.`);
    return;
  }
  console.log(`  Upserted ${data.length} references.`);
}

async function seedMilestones() {
  console.log("Seeding milestones...");
  const { data, error } = await supabase
    .from("milestones")
    .upsert(milestones, { onConflict: "year" })
    .select();

  if (error) {
    const { count } = await supabase.from("milestones").select("*", { count: "exact", head: true });
    if (count && count > 0) {
      console.log(`  Skipping — ${count} milestones already exist.`);
      return;
    }
    const { data: insertData, error: insertError } = await supabase
      .from("milestones")
      .insert(milestones)
      .select();
    if (insertError) {
      console.error("  Insert failed:", insertError.message);
      return;
    }
    console.log(`  Inserted ${insertData.length} milestones.`);
    return;
  }
  console.log(`  Upserted ${data.length} milestones.`);
}

// ─── MAIN ────────────────────────────────────────────────────────────────────

async function main() {
  console.log("Seeding static data tables...\n");

  await seedCertificates();
  await seedTradeShows();
  await seedResources();
  await seedFaqItems();
  await seedReferences();
  await seedMilestones();

  console.log("\nAll static data seeded.");
}

main();
