export interface Certificate {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  icon: string;
  pdfUrl: string;
  issuer: string;
  validUntil: string;
}

export const certificates: Certificate[] = [
  {
    id: "iso-9001",
    name: "ISO 9001:2015 Kalite Yönetim Sistemi",
    nameEn: "ISO 9001:2015 Quality Management System",
    description:
      "Ürün ve hizmetlerin müşteri beklentilerini karşılamasını sağlayan uluslararası kalite yönetim standardı. Sürekli iyileştirme ve müşteri memnuniyetine odaklanır.",
    descriptionEn:
      "International quality management standard ensuring products and services meet customer expectations. Focuses on continuous improvement and customer satisfaction.",
    icon: "Shield",
    pdfUrl: "/sertifikalar/ISO-9001.pdf",
    issuer: "TSE - Türk Standartları Enstitüsü",
    validUntil: "2027-12-31",
  },
  {
    id: "iso-22000",
    name: "ISO 22000:2018 Gıda Güvenliği Yönetim Sistemi",
    nameEn: "ISO 22000:2018 Food Safety Management System",
    description:
      "Gıda zincirindeki tüm kuruluşlar için gıda güvenliği yönetim sistemi standardı. Kozmetik ambalajda ürün güvenliğini garanti eder.",
    descriptionEn:
      "Food safety management system standard for all organizations in the food chain. Guarantees product safety in cosmetic packaging.",
    icon: "ShieldCheck",
    pdfUrl: "/sertifikalar/ISO-22000.pdf",
    issuer: "Bureau Veritas",
    validUntil: "2027-06-30",
  },
  {
    id: "fssc-22000",
    name: "FSSC 22000 Gıda Güvenliği Sertifikası",
    nameEn: "FSSC 22000 Food Safety Certification",
    description:
      "Gıda ile temas eden ambalaj malzemelerinin güvenliğini sağlayan ileri düzey sertifikasyon. GFSI tarafından tanınmış bir standarttır.",
    descriptionEn:
      "Advanced certification ensuring the safety of food contact packaging materials. A GFSI-recognized standard.",
    icon: "BadgeCheck",
    pdfUrl: "/sertifikalar/FSSC-22000.pdf",
    issuer: "SGS",
    validUntil: "2027-09-15",
  },
  {
    id: "tse",
    name: "TSE Belgesi",
    nameEn: "TSE Certificate",
    description:
      "Türk Standartları Enstitüsü tarafından verilen ürün uygunluk belgesi. Ürünlerin Türk standartlarına uygunluğunu belgeler.",
    descriptionEn:
      "Product conformity certificate issued by the Turkish Standards Institution. Certifies that products comply with Turkish standards.",
    icon: "Award",
    pdfUrl: "/sertifikalar/TSE.pdf",
    issuer: "TSE - Türk Standartları Enstitüsü",
    validUntil: "2027-03-31",
  },
  {
    id: "ce",
    name: "CE İşareti Uygunluk Belgesi",
    nameEn: "CE Marking Certificate of Conformity",
    description:
      "Ürünlerin Avrupa Birliği sağlık, güvenlik ve çevre koruma standartlarına uygunluğunu gösteren zorunlu belge.",
    descriptionEn:
      "Mandatory certificate indicating product compliance with European Union health, safety, and environmental protection standards.",
    icon: "CheckCircle",
    pdfUrl: "/sertifikalar/CE.pdf",
    issuer: "Notified Body EU",
    validUntil: "2028-01-15",
  },
  {
    id: "gmp",
    name: "GMP - İyi Üretim Uygulamaları",
    nameEn: "GMP - Good Manufacturing Practices",
    description:
      "Kozmetik ambalaj üretiminde hijyen, kalite ve tutarlılığı sağlayan uluslararası üretim standardı. ISO 22716 kapsamında belgelenmiştir.",
    descriptionEn:
      "International manufacturing standard ensuring hygiene, quality, and consistency in cosmetic packaging production. Certified under ISO 22716.",
    icon: "FlaskConical",
    pdfUrl: "/sertifikalar/GMP.pdf",
    issuer: "TÜV SÜD",
    validUntil: "2027-11-30",
  },
];
