/**
 * Seed script: content_sections table
 * Extracts all page content from locale JSON files and components,
 * then upserts into the content_sections Supabase table.
 *
 * Usage:  node scripts/seed-cms-content.mjs
 */
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Helper: create a content section row
function section(section_key, opts = {}) {
  return {
    section_key,
    title_tr: opts.title_tr || null,
    title_en: opts.title_en || null,
    subtitle_tr: opts.subtitle_tr || null,
    subtitle_en: opts.subtitle_en || null,
    content_tr: opts.content_tr || null,
    content_en: opts.content_en || null,
    cta_text_tr: opts.cta_text_tr || null,
    cta_text_en: opts.cta_text_en || null,
    cta_url: opts.cta_url || null,
    image_url: opts.image_url || null,
    display_order: opts.display_order ?? 0,
    is_active: opts.is_active !== undefined ? opts.is_active : true,
    metadata: opts.metadata || null,
  };
}

// ─── HOMEPAGE ────────────────────────────────────────────────────────────────

const homeContent = [
  section("home_hero", {
    title_tr: "57 Yıldır Ambalajın Geleceğini Şekillendiriyoruz",
    title_en: "Shaping the Future of Packaging for 57 Years",
    subtitle_tr: "Kozmetik sektörüne özel PET şişe, plastik ambalaj ve kapak çözümlerinde Türkiye'nin güvenilir B2B partneri.",
    subtitle_en: "Turkey's trusted B2B partner for PET bottles, plastic packaging and cap solutions for the cosmetics industry.",
    content_tr: "1969'dan bu yana kozmetik sektörüne özel yüksek kaliteli PET şişe, plastik şişe, sprey ambalaj, pompa ve kapak üretimi. Özel tasarım ve toptan satış avantajlarıyla hizmetinizdeyiz.",
    content_en: "Since 1969, high-quality PET bottles, plastic bottles, spray packaging, pumps, and caps for the cosmetics sector. Custom design and wholesale solutions at your service.",
    cta_text_tr: "Ürünleri İncele",
    cta_text_en: "View Products",
    cta_url: "/urunler",
    display_order: 1,
    metadata: {
      badge_tr: "B2B Kozmetik Ambalaj Çözümleri",
      badge_en: "B2B Cosmetic Packaging Solutions",
      words_tr: ["Güvenilir", "Kaliteli", "Yenilikçi"],
      words_en: ["Reliable", "Quality", "Innovative"],
      highlight1_tr: "ISO 9001 Sertifikalı",
      highlight1_en: "ISO 9001 Certified",
      highlight2_tr: "Türkiye Geneli Teslimat",
      highlight2_en: "Nationwide Delivery",
      highlight3_tr: "55+ Yıllık Tecrübe",
      highlight3_en: "55+ Years of Experience",
    },
  }),

  // WhyUs / Features
  section("home_feature_1", {
    title_tr: "Modern Üretim Tesisi",
    title_en: "Modern Production Facility",
    content_tr: "Son teknoloji makinelerle donatılmış üretim tesisimizde yüksek kapasiteli üretim yapıyoruz.",
    content_en: "High-capacity production at our facility equipped with state-of-the-art machinery.",
    display_order: 10,
    metadata: { icon: "Factory" },
  }),
  section("home_feature_2", {
    title_tr: "Kalite Garantisi",
    title_en: "Quality Assurance",
    content_tr: "ISO 9001, ISO 22000 ve FSSC 22000 sertifikaları ile uluslararası kalite standartlarında üretim.",
    content_en: "Production to international quality standards with ISO 9001, ISO 22000 and FSSC 22000 certifications.",
    display_order: 11,
    metadata: { icon: "ShieldCheck" },
  }),
  section("home_feature_3", {
    title_tr: "Çevre Dostu Üretim",
    title_en: "Eco-Friendly Production",
    content_tr: "Geri dönüştürülebilir malzemeler ve sürdürülebilir üretim süreçleriyle çevreye duyarlı yaklaşım.",
    content_en: "Environmentally conscious approach with recyclable materials and sustainable production processes.",
    display_order: 12,
    metadata: { icon: "Leaf" },
  }),
  section("home_feature_4", {
    title_tr: "Hızlı Teslimat",
    title_en: "Fast Delivery",
    content_tr: "Türkiye genelinde hızlı ve güvenli lojistik ağ ile siparişlerinizi zamanında teslim ediyoruz.",
    content_en: "On-time delivery of your orders with our fast and secure nationwide logistics network.",
    display_order: 13,
    metadata: { icon: "Truck" },
  }),
  section("home_feature_5", {
    title_tr: "Yüksek Kapasite",
    title_en: "High Capacity",
    content_tr: "Aylık milyonlarca adet üretim kapasitesiyle büyük ölçekli siparişleri karşılıyoruz.",
    content_en: "We meet large-scale orders with monthly production capacity in the millions.",
    display_order: 14,
    metadata: { icon: "BarChart" },
  }),
  section("home_feature_6", {
    title_tr: "7/24 Müşteri Desteği",
    title_en: "24/7 Customer Support",
    content_tr: "Uzman ekibimiz satış öncesi ve sonrası her aşamada yanınızdadır.",
    content_en: "Our expert team is with you at every stage, before and after sales.",
    display_order: 15,
    metadata: { icon: "Headphones" },
  }),

  // Strengths (about section on homepage)
  section("home_strength_1", {
    title_tr: "Türkiye'nin önde gelen kozmetik ambalaj üreticisi",
    title_en: "Turkey's leading cosmetic packaging producer",
    display_order: 20,
  }),
  section("home_strength_2", {
    title_tr: "ISO 9001, ISO 22000, FSSC 22000 sertifikaları",
    title_en: "ISO 9001, ISO 22000, FSSC 22000 certifications",
    display_order: 21,
  }),
  section("home_strength_3", {
    title_tr: "1969'dan bu yana kozmetik sektöründe 55+ yıllık uzmanlık",
    title_en: "55+ years of expertise in cosmetic sector since 1969",
    display_order: 22,
  }),
  section("home_strength_4", {
    title_tr: "Kalıp tasarımı ve özel üretim imkânı",
    title_en: "Mold design and custom production capability",
    display_order: 23,
  }),
  section("home_strength_5", {
    title_tr: "Çevreci ve sürdürülebilir üretim anlayışı",
    title_en: "Eco-friendly and sustainable production approach",
    display_order: 24,
  }),
  section("home_strength_6", {
    title_tr: "Rekabetçi fiyat ve esnek ödeme seçenekleri",
    title_en: "Competitive pricing and flexible payment options",
    display_order: 25,
  }),

  // Sectors on homepage
  section("home_sector_1", {
    title_tr: "Kozmetik & Güzellik",
    title_en: "Cosmetics & Beauty",
    content_tr: "Şampuan, losyon, krem, parfüm ve makyaj ürünleri için estetik tasarımlı ambalajlar.",
    content_en: "Aesthetically designed packaging for shampoo, lotion, cream, perfume and makeup products.",
    display_order: 30,
    metadata: { icon: "Sparkles" },
  }),
  section("home_sector_2", {
    title_tr: "Kolonya & Parfümeri",
    title_en: "Cologne & Perfumery",
    content_tr: "Kolonya, oda parfümü ve koku ürünleri için özel tasarımlı şişe çözümleri.",
    content_en: "Custom-designed bottle solutions for cologne, room fragrance and scent products.",
    display_order: 31,
    metadata: { icon: "FlaskConical" },
  }),
  section("home_sector_3", {
    title_tr: "Kişisel Bakım",
    title_en: "Personal Care",
    content_tr: "Vücut bakımı, saç bakımı, cilt bakımı ve hijyen ürünleri için modern tasarımlar.",
    content_en: "Modern designs for body care, hair care, skin care and hygiene products.",
    display_order: 32,
    metadata: { icon: "Heart" },
  }),
  section("home_sector_4", {
    title_tr: "Temizlik & Hijyen",
    title_en: "Cleaning & Hygiene",
    content_tr: "Sıvı sabun, el dezenfektanı ve temizlik ürünleri için dayanıklı ambalaj çözümleri.",
    content_en: "Durable packaging solutions for liquid soap, hand sanitizer and cleaning products.",
    display_order: 33,
    metadata: { icon: "Droplets" },
  }),
  section("home_sector_5", {
    title_tr: "Otelcilik & HoReCa",
    title_en: "Hospitality & HoReCa",
    content_tr: "Otel, restoran ve kafe işletmeleri için mini boy ve özel ambalaj çözümleri.",
    content_en: "Mini-size and custom packaging solutions for hotels, restaurants and cafes.",
    display_order: 34,
    metadata: { icon: "Building" },
  }),
  section("home_sector_6", {
    title_tr: "Özel Kalıplama",
    title_en: "Custom Molding",
    content_tr: "Markanıza özel kalıp tasarımı ve kişiselleştirilmiş kozmetik ambalaj üretimi.",
    content_en: "Custom mold design and personalized cosmetic packaging production for brands.",
    display_order: 35,
    metadata: { icon: "Cog" },
  }),

  // Homepage categories section header
  section("home_categories", {
    title_tr: "Geniş Ürün Yelpazemiz",
    title_en: "Wide Product Range",
    subtitle_tr: "Her sektöre uygun, yüksek kaliteli kozmetik ambalaj çözümlerimizi keşfedin. Standart ürünlerden özel tasarıma kadar geniş bir yelpaze sunuyoruz.",
    subtitle_en: "Discover our high-quality cosmetic packaging solutions for every sector. From standard products to custom design.",
    display_order: 40,
    metadata: {
      overline_tr: "Ürün Kategorileri",
      overline_en: "Product Categories",
    },
  }),

  // Homepage about section
  section("home_about", {
    title_tr: "Kozmetik Ambalaj Sektöründe Güvenin Adı",
    title_en: "The Name You Trust in Cosmetic Packaging",
    content_tr: "Kısmet Plastik olarak, 1969'dan bu yana kozmetik ambalaj üretiminde kalite ve güveni bir arada sunuyoruz. Geniş ürün yelpazemizle kozmetik sektörünün tüm ihtiyaçlarını karşılayabiliyoruz.\n\nPET şişeler, plastik şişeler, kolonya şişeleri, sprey ambalajlar, oda parfümü şişeleri, sıvı sabun şişeleri ve kapaklar dahil olmak üzere birçok kozmetik ambalaj çözümüyle B2B müşterilerimize hizmet veriyoruz.",
    content_en: "Since 1969, Kısmet Plastik has been offering quality and trust in cosmetic packaging production. With our wide product range, we can meet all the needs of the cosmetics sector.\n\nWe serve our B2B customers with many cosmetic packaging solutions including PET bottles, plastic bottles, cologne bottles, spray packaging, room fragrance bottles, liquid soap bottles and caps.",
    cta_text_tr: "Daha Fazla Bilgi",
    cta_text_en: "Learn More",
    cta_url: "/hakkimizda",
    display_order: 50,
    metadata: {
      overline_tr: "Hakkımızda",
      overline_en: "About Us",
    },
  }),

  // Homepage CTA section
  section("home_cta", {
    title_tr: "Projeniz İçin Özel Teklif Alın",
    title_en: "Get a Custom Quote for Your Project",
    subtitle_tr: "İhtiyacınıza uygun kozmetik ambalaj çözümleri için hemen bizimle iletişime geçin. Uzman ekibimiz size en uygun çözümü sunacaktır.",
    subtitle_en: "Contact us for cosmetic packaging solutions that meet your needs. Our expert team will offer you the best solution.",
    cta_text_tr: "Teklif Formu",
    cta_text_en: "Quote Form",
    cta_url: "/teklif-al",
    display_order: 60,
    metadata: {
      cta2_text_tr: "Hemen Arayın",
      cta2_text_en: "Call Now",
      note_tr: "Ücretsiz teklif ve danışmanlık hizmeti",
      note_en: "Free quote and consultancy",
    },
  }),

  // Homepage stats section header
  section("home_stats", {
    title_tr: "Güvenilir Üretim Gücü",
    title_en: "Trusted Manufacturing Power",
    display_order: 5,
    metadata: {
      overline_tr: "Rakamlarla Biz",
      overline_en: "By the Numbers",
      stats: [
        { key: "experience", label_tr: "Yıllık Tecrübe", label_en: "Years of Experience", value: "57" },
        { key: "products", label_tr: "Ürün Çeşidi", label_en: "Product Varieties", value: "500+" },
        { key: "customers", label_tr: "Mutlu Müşteri", label_en: "Happy Customers", value: "1000+" },
        { key: "capacity", label_tr: "Aylık Üretim Kapasitesi", label_en: "Monthly Production Capacity", value: "50M+" },
      ],
    },
  }),

  // WhyUs section header
  section("home_whyus", {
    title_tr: "Kısmet Plastik Farkı",
    title_en: "The Kısmet Plastik Difference",
    subtitle_tr: "Sektörün önde gelen firmaları arasında yer almamızın arkasındaki değerlerimiz ve avantajlarımız.",
    subtitle_en: "The values and advantages behind our position among the industry's leading companies.",
    display_order: 9,
    metadata: {
      overline_tr: "Neden Biz?",
      overline_en: "Why Us?",
    },
  }),

  // Sectors section header
  section("home_sectors", {
    title_tr: "Her Sektöre Uygun Çözümler",
    title_en: "Solutions for Every Sector",
    subtitle_tr: "Farklı sektör ihtiyaçlarına özel, standartlara uygun kozmetik ambalaj çözümleri sunuyoruz.",
    subtitle_en: "We offer standards-compliant cosmetic packaging solutions tailored to different sector needs.",
    display_order: 29,
    metadata: {
      overline_tr: "Hizmet Verdiğimiz Sektörler",
      overline_en: "Sectors We Serve",
    },
  }),
];

// ─── ABOUT PAGE ──────────────────────────────────────────────────────────────

const aboutContent = [
  section("about_hero", {
    title_tr: "Hakkımızda",
    title_en: "About Us",
    subtitle_tr: "Kozmetik ambalaj sektöründe 55 yılı aşkın tecrübemizle kalite ve güvenin adresi.",
    subtitle_en: "The address of quality and trust with over 55 years of experience in the cosmetic packaging sector.",
    display_order: 1,
  }),
  section("about_story", {
    title_tr: "Kozmetik Ambalajda Güvenin Adı",
    title_en: "The Name You Trust in Cosmetic Packaging",
    content_tr: "Kısmet Plastik, 1969 yılında İstanbul'un Fatih İlçesi'nin Vefa semtinde kozmetik ambalaj üretimine odaklanarak kuruldu. Bugün Türkiye'nin önde gelen kozmetik ambalaj üreticilerinden biri olmanın gururunu yaşamaktadır.\n\n55 yılı aşkın tecrübemizle, en son teknolojiyi kullanarak, en kaliteli kozmetik ambalaj ürünlerini en uygun maliyetle müşterilerimize sunmaya odaklanıyoruz. Müşteri memnuniyetini her şeyin üzerinde tutarak, dürüst ve dinamik bir çalışma anlayışıyla sektörde fark yaratmaya devam ediyoruz.",
    content_en: "Kısmet Plastik was founded in 1969 in the Vefa district of Fatih, İstanbul, focusing on cosmetic packaging production. Today, we are proud to be one of Turkey's leading cosmetic packaging manufacturers.\n\nWith over 55 years of experience, we focus on providing our customers with the highest quality cosmetic packaging products at the most affordable cost, always using the latest technology. We continue to make a difference in the sector with our honest and dynamic work approach, keeping customer satisfaction above all.",
    display_order: 2,
    metadata: {
      overline_tr: "Hikayemiz",
      overline_en: "Our Story",
    },
  }),
  section("about_mission", {
    title_tr: "Misyonumuz",
    title_en: "Our Mission",
    content_tr: "Kozmetik markalarının ihtiyaç ve beklentilerini en iyi şekilde karşılamak, en son teknolojiyi kullanarak en kaliteli kozmetik ambalaj ürünlerini en uygun maliyetle sunmak, sürekli gelişmeyi ve yenilikçiliği ilke edinmek.",
    content_en: "To best meet the needs and expectations of cosmetic brands, to offer the highest quality cosmetic packaging products at the most affordable cost using the latest technology, and to embrace continuous development and innovation.",
    display_order: 3,
  }),
  section("about_vision", {
    title_tr: "Vizyonumuz",
    title_en: "Our Vision",
    content_tr: "Kozmetik ambalaj sektöründe Türkiye'nin lider kuruluşu olmak, uluslararası pazarda önemli bir oyuncu haline gelmek ve sürdürülebilir bir geleceğe katkıda bulunmak.",
    content_en: "To be Turkey's leading organization in the cosmetic packaging sector, to become an important player in the international market, and to contribute to a sustainable future.",
    display_order: 4,
  }),
  section("about_value_1", {
    title_tr: "Kalite",
    title_en: "Quality",
    content_tr: "ISO 9001, ISO 22000 ve FSSC 22000 sertifikaları ile uluslararası standartlarda üretim.",
    content_en: "Production to international standards with ISO 9001, ISO 22000 and FSSC 22000 certifications.",
    display_order: 10,
    metadata: { icon: "Shield" },
  }),
  section("about_value_2", {
    title_tr: "Sürdürülebilirlik",
    title_en: "Sustainability",
    content_tr: "Geri dönüştürülebilir malzemeler ve çevreye duyarlı üretim süreçleri.",
    content_en: "Recyclable materials and environmentally conscious production processes.",
    display_order: 11,
    metadata: { icon: "Leaf" },
  }),
  section("about_value_3", {
    title_tr: "Yenilik",
    title_en: "Innovation",
    content_tr: "Son teknoloji makineler ve sürekli gelişen ürün portföyü.",
    content_en: "State-of-the-art machinery and constantly evolving product portfolio.",
    display_order: 12,
    metadata: { icon: "Lightbulb" },
  }),
  section("about_value_4", {
    title_tr: "Müşteri Odaklılık",
    title_en: "Customer Focus",
    content_tr: "Satış öncesi ve sonrası teknik destek, özel tasarım ve esnek çözümler.",
    content_en: "Pre and post-sales technical support, custom design and flexible solutions.",
    display_order: 13,
    metadata: { icon: "Users" },
  }),
];

// ─── QUALITY PAGE ────────────────────────────────────────────────────────────

const qualityContent = [
  section("quality_hero", {
    title_tr: "Kalite & Sertifikalar",
    title_en: "Quality & Certifications",
    subtitle_tr: "Uluslararası standartlarda üretim yapıyor, her aşamada kaliteyi garanti ediyoruz.",
    subtitle_en: "We produce to international standards and guarantee quality at every stage.",
    display_order: 1,
  }),
  section("quality_process", {
    title_tr: "4 Aşamalı Kalite Kontrol",
    title_en: "4-Stage Quality Control",
    subtitle_tr: "Hammaddeden sevkiyata kadar her aşamada titiz kalite kontrol süreçleri uyguluyoruz.",
    subtitle_en: "We apply rigorous quality control processes at every stage from raw materials to shipment.",
    display_order: 2,
    metadata: {
      overline_tr: "Kalite Sürecimiz",
      overline_en: "Our Quality Process",
    },
  }),
  section("quality_step_1", {
    title_tr: "Hammadde Kontrolü",
    title_en: "Raw Material Control",
    content_tr: "Tedarikçilerden gelen tüm hammaddeler laboratuvar testlerinden geçirilir.",
    content_en: "All raw materials from suppliers undergo laboratory testing.",
    display_order: 10,
  }),
  section("quality_step_2", {
    title_tr: "Üretim Süreç Kontrolü",
    title_en: "Production Process Control",
    content_tr: "Her üretim aşamasında kalite parametreleri sürekli izlenir ve kayıt altına alınır.",
    content_en: "Quality parameters are continuously monitored and recorded at every production stage.",
    display_order: 11,
  }),
  section("quality_step_3", {
    title_tr: "Ürün Testleri",
    title_en: "Product Testing",
    content_tr: "Bitmiş ürünler basınç, sızdırmazlık, boyut ve görsel testlerden geçirilir.",
    content_en: "Finished products undergo pressure, leak, dimensional and visual tests.",
    display_order: 12,
  }),
  section("quality_step_4", {
    title_tr: "Son Kontrol & Sevkiyat",
    title_en: "Final Inspection & Shipment",
    content_tr: "Paketleme öncesi son kalite kontrolü yapılır ve uygun koşullarda sevk edilir.",
    content_en: "Final quality control before packaging, shipped under appropriate conditions.",
    display_order: 13,
  }),
  section("quality_lab", {
    title_tr: "Kapsamlı Test & Analiz",
    title_en: "Comprehensive Testing & Analysis",
    content_tr: "Modern laboratuvarımızda gerçekleştirdiğimiz testlerle ürünlerimizin kalitesini ve güvenliğini garanti altına alıyoruz.",
    content_en: "We guarantee the quality and safety of our products through tests conducted in our modern laboratory.",
    cta_text_tr: "Test Raporu Talep Et",
    cta_text_en: "Request Test Report",
    cta_url: "/iletisim",
    display_order: 20,
    metadata: {
      overline_tr: "Laboratuvar",
      overline_en: "Laboratory",
    },
  }),
];

// ─── PRODUCTION PAGE ─────────────────────────────────────────────────────────

const productionContent = [
  section("production_hero", {
    title_tr: "Üretim Tesisimiz",
    title_en: "Production Facility",
    subtitle_tr: "Son teknoloji makineler ve deneyimli ekibimiz ile yüksek kapasiteli, kaliteli üretim yapıyoruz.",
    subtitle_en: "High-capacity, quality production with state-of-the-art machinery and experienced team.",
    display_order: 1,
  }),
  section("production_process", {
    title_tr: "Hammaddeden Ürüne",
    title_en: "From Raw Material to Product",
    subtitle_tr: "Üretim sürecimizin her aşamasında kalite ve verimlilik ön plandadır.",
    subtitle_en: "Quality and efficiency are at the forefront at every stage of our production process.",
    display_order: 2,
    metadata: {
      overline_tr: "Üretim Süreci",
      overline_en: "Production Process",
    },
  }),
  section("production_step_1", {
    title_tr: "Hammadde Secimi",
    title_en: "Raw Material Selection",
    content_tr: "En kaliteli PET, HDPE ve PP hammaddeleri titizlikle seciyoruz. Uluslararasi standartlara uygun, guvenilir tedarikcilerle calisiyoruz.",
    content_en: "We carefully select the highest quality PET, HDPE, and PP raw materials. We work with reliable suppliers that meet international standards.",
    display_order: 10,
  }),
  section("production_step_2", {
    title_tr: "Uretim",
    title_en: "Production",
    content_tr: "Son teknoloji enjeksiyon ve sisme kaliplama makineleriyle yuksek kapasiteli, hassas uretim gerceklestiriyoruz.",
    content_en: "We perform high-capacity, precision manufacturing with state-of-the-art injection and blow molding machines.",
    display_order: 11,
  }),
  section("production_step_3", {
    title_tr: "Kalite Kontrol",
    title_en: "Quality Control",
    content_tr: "ISO 9001, ISO 22000 ve FSSC 22000 standartlarinda kapsamli test ve kontrol sureclerimizle kaliteyi garanti ediyoruz.",
    content_en: "We guarantee quality through comprehensive testing and control processes under ISO 9001, ISO 22000 and FSSC 22000 standards.",
    display_order: 12,
  }),
  section("production_step_4", {
    title_tr: "Teslimat",
    title_en: "Delivery",
    content_tr: "Turkiye genelinde hizli ve guvenli lojistik agimizla siparislerinizi zamaninda teslim ediyoruz.",
    content_en: "We deliver your orders on time with our fast and secure logistics network across Turkey.",
    display_order: 13,
  }),
];

// ─── CONTACT PAGE ────────────────────────────────────────────────────────────

const contactContent = [
  section("contact_hero", {
    title_tr: "İletişim",
    title_en: "Contact",
    subtitle_tr: "Sorularınız veya teklif talepleriniz için bizimle iletişime geçin. Uzman ekibimiz en kısa sürede size dönüş yapacaktır.",
    subtitle_en: "Contact us for your questions or quote requests. Our expert team will get back to you as soon as possible.",
    display_order: 1,
  }),
];

// ─── VISION & MISSION PAGE ──────────────────────────────────────────────────

const visionContent = [
  section("vision_hero", {
    title_tr: "Vizyon & Misyon",
    title_en: "Vision & Mission",
    subtitle_tr: "Kozmetik ambalaj sektöründe geleceği şekillendiren vizyonumuz ve misyonumuz.",
    subtitle_en: "Our vision and mission shaping the future in the cosmetic packaging sector.",
    display_order: 1,
  }),
  section("vision_vision", {
    title_tr: "Vizyonumuz",
    title_en: "Our Vision",
    content_tr: "Kozmetik ambalaj sektöründe Türkiye'nin lider kuruluşu olmak, uluslararası pazarda önemli bir oyuncu haline gelmek ve sürdürülebilir bir geleceğe katkıda bulunmak.",
    content_en: "To be Turkey's leading organization in the cosmetic packaging sector, to become an important player in the international market, and to contribute to a sustainable future.",
    display_order: 2,
  }),
  section("vision_mission", {
    title_tr: "Misyonumuz",
    title_en: "Our Mission",
    content_tr: "Kozmetik markalarının ihtiyaç ve beklentilerini en iyi şekilde karşılamak, en son teknolojiyi kullanarak en kaliteli kozmetik ambalaj ürünlerini en uygun maliyetle sunmak, sürekli gelişmeyi ve yenilikçiliği ilke edinmek.",
    content_en: "To best meet the needs and expectations of cosmetic brands, to offer the highest quality cosmetic packaging products at the most affordable cost using the latest technology, and to embrace continuous development and innovation.",
    display_order: 3,
  }),
];

// ─── SUSTAINABILITY PAGE ────────────────────────────────────────────────────

const sustainabilityContent = [
  section("sustainability_hero", {
    title_tr: "Sürdürülebilirlik",
    title_en: "Sustainability",
    subtitle_tr: "Geri dönüştürülebilir malzemeler ve çevreye duyarlı üretim süreçleriyle geleceğe yatırım yapıyoruz.",
    subtitle_en: "We invest in the future with recyclable materials and environmentally conscious production processes.",
    display_order: 1,
  }),
];

// ─── KVKK PAGE ──────────────────────────────────────────────────────────────

const kvkkContent = [
  section("kvkk_content", {
    title_tr: "KVKK Aydınlatma Metni",
    title_en: "Privacy Policy (KVKK)",
    subtitle_tr: "Kişisel Verilerin Korunması Kanunu kapsamında aydınlatma metni.",
    subtitle_en: "Disclosure text within the scope of the Personal Data Protection Law.",
    display_order: 1,
  }),
];

// ─── HISTORY PAGE ───────────────────────────────────────────────────────────

const historyContent = [
  section("history_hero", {
    title_tr: "Tarihçemiz",
    title_en: "Our History",
    subtitle_tr: "1969'dan günümüze Kısmet Plastik'in hikayesi.",
    subtitle_en: "The story of Kısmet Plastik from 1969 to today.",
    display_order: 1,
  }),
];

// ─── R&D PAGE ───────────────────────────────────────────────────────────────

const rndContent = [
  section("rnd_hero", {
    title_tr: "Ar-Ge",
    title_en: "R&D",
    subtitle_tr: "Yenilikçi ürün tasarımı ve malzeme araştırma merkezi.",
    subtitle_en: "Innovative product design and material research center.",
    display_order: 1,
  }),
];

// ─── SECTORS PAGE ───────────────────────────────────────────────────────────

const sectorsContent = [
  section("sectors_hero", {
    title_tr: "Sektörler",
    title_en: "Sectors",
    subtitle_tr: "Farklı sektör ihtiyaçlarına özel, standartlara uygun kozmetik ambalaj çözümleri sunuyoruz.",
    subtitle_en: "We offer standards-compliant cosmetic packaging solutions tailored to different sector needs.",
    display_order: 1,
  }),
  section("sectors_sector_1", {
    title_tr: "Kozmetik & Güzellik",
    title_en: "Cosmetics & Beauty",
    content_tr: "Şampuan, losyon, krem, parfüm ve makyaj ürünleri için estetik tasarımlı ambalajlar.",
    content_en: "Aesthetically designed packaging for shampoo, lotion, cream, perfume and makeup products.",
    display_order: 10,
    metadata: { icon: "Sparkles" },
  }),
  section("sectors_sector_2", {
    title_tr: "Kolonya & Parfümeri",
    title_en: "Cologne & Perfumery",
    content_tr: "Kolonya, oda parfümü ve koku ürünleri için özel tasarımlı şişe çözümleri.",
    content_en: "Custom-designed bottle solutions for cologne, room fragrance and scent products.",
    display_order: 11,
    metadata: { icon: "FlaskConical" },
  }),
  section("sectors_sector_3", {
    title_tr: "Kişisel Bakım",
    title_en: "Personal Care",
    content_tr: "Vücut bakımı, saç bakımı, cilt bakımı ve hijyen ürünleri için modern tasarımlar.",
    content_en: "Modern designs for body care, hair care, skin care and hygiene products.",
    display_order: 12,
    metadata: { icon: "Heart" },
  }),
  section("sectors_sector_4", {
    title_tr: "Temizlik & Hijyen",
    title_en: "Cleaning & Hygiene",
    content_tr: "Sıvı sabun, el dezenfektanı ve temizlik ürünleri için dayanıklı ambalaj çözümleri.",
    content_en: "Durable packaging solutions for liquid soap, hand sanitizer and cleaning products.",
    display_order: 13,
    metadata: { icon: "Droplets" },
  }),
  section("sectors_sector_5", {
    title_tr: "Otelcilik & HoReCa",
    title_en: "Hospitality & HoReCa",
    content_tr: "Otel, restoran ve kafe işletmeleri için mini boy ve özel ambalaj çözümleri.",
    content_en: "Mini-size and custom packaging solutions for hotels, restaurants and cafes.",
    display_order: 14,
    metadata: { icon: "Building" },
  }),
  section("sectors_sector_6", {
    title_tr: "Özel Kalıplama",
    title_en: "Custom Molding",
    content_tr: "Markanıza özel kalıp tasarımı ve kişiselleştirilmiş kozmetik ambalaj üretimi.",
    content_en: "Custom mold design and personalized cosmetic packaging production for brands.",
    display_order: 15,
    metadata: { icon: "Cog" },
  }),
];

// ─── CAREER PAGE ────────────────────────────────────────────────────────────

const careerContent = [
  section("career_hero", {
    title_tr: "Kariyer Fırsatları",
    title_en: "Career Opportunities",
    subtitle_tr: "Kısmet Plastik ailesine katılın. Büyüyen ekibimizde yerinizi alın ve kariyerinizi bizimle şekillendirin.",
    subtitle_en: "Join the Kısmet Plastik family. Take your place in our growing team and shape your career with us.",
    display_order: 1,
  }),
  section("career_perk_1", {
    title_tr: "Sağlık Sigortası",
    title_en: "Health Insurance",
    content_tr: "Özel sağlık sigortası",
    content_en: "Private health insurance",
    display_order: 10,
    metadata: { icon: "Heart" },
  }),
  section("career_perk_2", {
    title_tr: "Yemek & Servis",
    title_en: "Meals & Transport",
    content_tr: "Ücretsiz yemek ve personel servisi",
    content_en: "Free meals and staff transportation",
    display_order: 11,
    metadata: { icon: "Coffee" },
  }),
  section("career_perk_3", {
    title_tr: "Eğitim",
    title_en: "Training",
    content_tr: "Sürekli mesleki gelişim programları",
    content_en: "Continuous professional development programs",
    display_order: 12,
    metadata: { icon: "GraduationCap" },
  }),
  section("career_perk_4", {
    title_tr: "Takım Ruhu",
    title_en: "Team Spirit",
    content_tr: "Sosyal etkinlikler ve takım aktiviteleri",
    content_en: "Social events and team activities",
    display_order: 13,
    metadata: { icon: "Users" },
  }),
];

// ─── CATALOG PAGE ───────────────────────────────────────────────────────────

const catalogContent = [
  section("catalog_hero", {
    title_tr: "Katalog İndir",
    title_en: "Download Catalog",
    subtitle_tr: "Ürün kataloglarımızı indirerek tüm ürün yelpazemizi detaylı inceleyebilirsiniz.",
    subtitle_en: "Download our product catalogs to review our full product range in detail.",
    cta_text_tr: "Kataloğu İndir",
    cta_text_en: "Download Catalog",
    display_order: 1,
  }),
];

// ─── REFERENCES PAGE ────────────────────────────────────────────────────────

const referencesContent = [
  section("references_hero", {
    title_tr: "Referanslar",
    title_en: "References",
    subtitle_tr: "500+ firma tarafından tercih edilen Kısmet Plastik ile güvenle çalışın.",
    subtitle_en: "Work confidently with Kısmet Plastik, trusted by 500+ companies.",
    display_order: 1,
  }),
  section("references_stats", {
    title_tr: "Rakamlarla Referanslarımız",
    title_en: "Our References in Numbers",
    display_order: 2,
    metadata: {
      stats: [
        { label_tr: "Aktif Müşteri", label_en: "Active Customers", value: "500+" },
        { label_tr: "İhracat Ülkesi", label_en: "Export Countries", value: "15+" },
        { label_tr: "Sektör", label_en: "Sectors", value: "6+" },
      ],
    },
  }),
];

// ─── FACTORY PAGE ───────────────────────────────────────────────────────────

const factoryContent = [
  section("factory_hero", {
    title_tr: "Üretim Tesisi",
    title_en: "Production Facility",
    subtitle_tr: "15.000 m2 kapalı alana sahip modern üretim tesisimizi keşfedin.",
    subtitle_en: "Discover our modern production facility with 15,000 m2 of enclosed space.",
    display_order: 1,
  }),
];

// ─── QUOTE PAGE ─────────────────────────────────────────────────────────────

const quoteContent = [
  section("quote_hero", {
    title_tr: "Teklif Talebi",
    title_en: "Quote Request",
    subtitle_tr: "İhtiyacınıza uygun kozmetik ambalaj çözümleri için ücretsiz teklif alın. Formu doldurun, uzman ekibimiz en kısa sürede size dönüş yapsın.",
    subtitle_en: "Get a free quote for cosmetic packaging solutions that meet your needs. Fill out the form and our expert team will get back to you.",
    display_order: 1,
  }),
];

// ─── SAMPLE REQUEST PAGE ────────────────────────────────────────────────────

const sampleContent = [
  section("sample_hero", {
    title_tr: "Numune Talep Formu",
    title_en: "Sample Request Form",
    subtitle_tr: "Ürünlerimizi yakından incelemek için numune talep edin. Formu doldurun, uzman ekibimiz en kısa sürede hazırlık sürecini başlatsın.",
    subtitle_en: "Request samples to closely examine our products. Fill out the form and our expert team will start the preparation process.",
    display_order: 1,
  }),
];

// ─── PREORDER PAGE ──────────────────────────────────────────────────────────

const preorderContent = [
  section("preorder_hero", {
    title_tr: "Ön Sipariş",
    title_en: "Pre-Order",
    subtitle_tr: "Yeni ürünlerimiz için ön sipariş verin, ilk siz teslim alın.",
    subtitle_en: "Pre-order our new products and be the first to receive them.",
    display_order: 1,
  }),
];

// ─── COMBINE ALL ─────────────────────────────────────────────────────────────

const allContent = [
  ...homeContent,
  ...aboutContent,
  ...qualityContent,
  ...productionContent,
  ...contactContent,
  ...visionContent,
  ...sustainabilityContent,
  ...kvkkContent,
  ...historyContent,
  ...rndContent,
  ...sectorsContent,
  ...careerContent,
  ...catalogContent,
  ...referencesContent,
  ...factoryContent,
  ...quoteContent,
  ...sampleContent,
  ...preorderContent,
];

async function main() {
  console.log(`Seeding content_sections (${allContent.length} rows)...`);

  // Upsert in batches of 50 to avoid payload size issues
  const batchSize = 50;
  let totalUpserted = 0;

  for (let i = 0; i < allContent.length; i += batchSize) {
    const batch = allContent.slice(i, i + batchSize);
    const { data, error } = await supabase
      .from("content_sections")
      .upsert(batch, { onConflict: "section_key" })
      .select();

    if (error) {
      console.error(`Error upserting batch ${i / batchSize + 1}:`, error.message);
      process.exit(1);
    }

    totalUpserted += data.length;
    console.log(`  Batch ${Math.floor(i / batchSize) + 1}: ${data.length} rows upserted`);
  }

  console.log(`Total: ${totalUpserted} content sections upserted.`);
  console.log("Done.");
}

main();
