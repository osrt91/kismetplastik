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
    title: "Kozmetik Ambalaj Secim Rehberi",
    titleEn: "Cosmetic Packaging Selection Guide",
    description:
      "PET, HDPE, PP ve cam alternatiflerini karsilastiran, hacim secimi, agiz capi uyumlulugu ve maliyet analizi iceren kapsamli rehber. Kozmetik markalar icin dogru ambalaj seciminin tum adimlari.",
    descriptionEn:
      "A comprehensive guide comparing PET, HDPE, PP and glass alternatives, including volume selection, neck finish compatibility and cost analysis. All steps for choosing the right packaging for cosmetic brands.",
    category: "Rehber",
    categoryEn: "Guide",
    fileUrl: "/docs/kozmetik-ambalaj-secim-rehberi.pdf",
    pageCount: 24,
  },
  {
    id: "pet-sise-teknik-spesifikasyonlari",
    title: "PET Sise Teknik Spesifikasyonlari",
    titleEn: "PET Bottle Technical Specifications",
    description:
      "PET sise uretim parametreleri, malzeme ozellikleri, basinc dayanim degerleri, boyutsal toleranslar ve kalip teknik cizimleri. Muhendisler ve uretim yoneticileri icin teknik referans dokumani.",
    descriptionEn:
      "PET bottle production parameters, material properties, pressure resistance values, dimensional tolerances and mold technical drawings. Technical reference document for engineers and production managers.",
    category: "Teknik Dokuman",
    categoryEn: "Technical Document",
    fileUrl: "/docs/pet-sise-teknik-spesifikasyonlari.pdf",
    pageCount: 36,
  },
  {
    id: "surdurulebilir-ambalaj-trendleri",
    title: "Surdurulebilir Ambalaj Trendleri",
    titleEn: "Sustainable Packaging Trends",
    description:
      "rPET kullanimi, biyobozunur malzemeler, karbon ayak izi azaltma stratejileri ve AB ambalaj yonetmelikleri. 2026 yili surdurulebilirlik hedefleri ve sektor analizleri.",
    descriptionEn:
      "rPET usage, biodegradable materials, carbon footprint reduction strategies and EU packaging regulations. 2026 sustainability targets and industry analyses.",
    category: "Rapor",
    categoryEn: "Report",
    fileUrl: "/docs/surdurulebilir-ambalaj-trendleri.pdf",
    pageCount: 18,
  },
  {
    id: "kalite-kontrol-prosedurleri",
    title: "Kalite Kontrol Prosedurleri",
    titleEn: "Quality Control Procedures",
    description:
      "ISO 9001 ve FSSC 22000 standartlarina uygun kalite kontrol adimlari, test yontemleri, kabul kriterleri ve raporlama surecleri. Tedarikci degerlendirme ve denetim rehberi.",
    descriptionEn:
      "Quality control steps compliant with ISO 9001 and FSSC 22000 standards, test methods, acceptance criteria and reporting processes. Supplier evaluation and audit guide.",
    category: "Kalite",
    categoryEn: "Quality",
    fileUrl: "/docs/kalite-kontrol-prosedurleri.pdf",
    pageCount: 28,
  },
];
