export interface Resource {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  category: string;
  categoryEn: string;
  fileUrl: string;
  coverImage?: string;
  pageCount: number;
}

export const resources: Resource[] = [
  {
    id: "kozmetik-ambalaj-secim-rehberi",
    title: "Kozmetik Ambalaj Seçim Rehberi",
    titleEn: "Cosmetic Packaging Selection Guide",
    description:
      "PET, HDPE, PP ve cam alternatiflerini karşılaştıran, hacim seçimi, ağız çapı uyumluluğu ve maliyet analizi içeren kapsamlı rehber. Kozmetik markalar için doğru ambalaj seçiminin tüm adımları.",
    descriptionEn:
      "A comprehensive guide comparing PET, HDPE, PP and glass alternatives, including volume selection, neck finish compatibility and cost analysis. All steps for choosing the right packaging for cosmetic brands.",
    category: "Rehber",
    categoryEn: "Guide",
    fileUrl: "/docs/kozmetik-ambalaj-secim-rehberi.pdf",
    pageCount: 24,
  },
  {
    id: "pet-sise-teknik-spesifikasyonlari",
    title: "PET Şişe Teknik Spesifikasyonları",
    titleEn: "PET Bottle Technical Specifications",
    description:
      "PET şişe üretim parametreleri, malzeme özellikleri, basınç dayanım değerleri, boyutsal toleranslar ve kalıp teknik çizimleri. Mühendisler ve üretim yöneticileri için teknik referans dokümanı.",
    descriptionEn:
      "PET bottle production parameters, material properties, pressure resistance values, dimensional tolerances and mold technical drawings. Technical reference document for engineers and production managers.",
    category: "Teknik Doküman",
    categoryEn: "Technical Document",
    fileUrl: "/docs/pet-sise-teknik-spesifikasyonlari.pdf",
    pageCount: 36,
  },
  {
    id: "surdurulebilir-ambalaj-trendleri",
    title: "Sürdürülebilir Ambalaj Trendleri",
    titleEn: "Sustainable Packaging Trends",
    description:
      "rPET kullanımı, biyobozunur malzemeler, karbon ayak izi azaltma stratejileri ve AB ambalaj yönetmelikleri. 2026 yılı sürdürülebilirlik hedefleri ve sektör analizleri.",
    descriptionEn:
      "rPET usage, biodegradable materials, carbon footprint reduction strategies and EU packaging regulations. 2026 sustainability targets and industry analyses.",
    category: "Rapor",
    categoryEn: "Report",
    fileUrl: "/docs/surdurulebilir-ambalaj-trendleri.pdf",
    pageCount: 18,
  },
  {
    id: "kalite-kontrol-prosedurleri",
    title: "Kalite Kontrol Prosedürleri",
    titleEn: "Quality Control Procedures",
    description:
      "ISO 9001 ve FSSC 22000 standartlarına uygun kalite kontrol adımları, test yöntemleri, kabul kriterleri ve raporlama süreçleri. Tedarikçi değerlendirme ve denetim rehberi.",
    descriptionEn:
      "Quality control steps compliant with ISO 9001 and FSSC 22000 standards, test methods, acceptance criteria and reporting processes. Supplier evaluation and audit guide.",
    category: "Kalite",
    categoryEn: "Quality",
    fileUrl: "/docs/kalite-kontrol-prosedurleri.pdf",
    pageCount: 28,
  },
];
