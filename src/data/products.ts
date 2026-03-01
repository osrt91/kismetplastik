import { Product, Category, CategorySlug } from "@/types/product";

export const categories: Category[] = [
  { slug: "pet-siseler", name: "PET Şişeler", description: "Kozmetik, kolonya ve kişisel bakım ürünleri için farklı hacim ve tasarımlarda PET şişeler.", productCount: 15 },
  { slug: "plastik-siseler", name: "Plastik Şişeler", description: "HDPE, PP ve LDPE hammaddeli dayanıklı plastik şişe çeşitleri.", productCount: 10 },
  { slug: "kapaklar", name: "Kapaklar", description: "Vidalı, flip-top ve özel tasarım kapak çeşitleri.", productCount: 8 },
  { slug: "tipalar", name: "Tıpalar", description: "İç tıpa, damlatıcı tıpa ve sızdırmazlık tıpaları.", productCount: 6 },
  { slug: "parmak-spreyler", name: "Parmak Spreyler", description: "Kozmetik ve kolonya ürünleri için parmak sprey mekanizmaları.", productCount: 5 },
  { slug: "diger-urunler", name: "Diğer Ürünler", description: "Pompalar, tetikli püskürtücüler, huniler ve diğer ambalaj aksesuarları.", productCount: 10 },
];

export const products: Product[] = [
  // ── PET Şişeler (1 ürün) ─────────────────────────────────────
  {
    id: "pet-001",
    slug: "pet-sise-100ml-silindir",
    name: "PET Şişe 100ml Silindir",
    category: "pet-siseler",
    description: "100ml silindir model PET şişe. Kolonya, parfüm ve kişisel bakım ürünleri için zarif silindirik tasarım. 20mm ağız çapı. ISO 9001 kalite güvencesi ile üretilmektedir.",
    shortDescription: "100ml silindir kozmetik şişe",
    volume: "100ml",
    weight: "15g",
    neckDiameter: "20mm",
    height: "130mm",
    diameter: "42mm",
    material: "PET",
    colors: ["Şeffaf", "Amber", "Mavi", "Füme"],
    model: "Silindir",
    shape: "silindir",
    minOrder: 15000,
    inStock: true,
    featured: true,
    specs: [
      { label: "Hacim", value: "100ml" },
      { label: "Ağırlık", value: "15g" },
      { label: "Ağız", value: "20mm" },
      { label: "Yükseklik", value: "130mm" },
      { label: "Çap", value: "42mm" },
      { label: "Hammadde", value: "PET" },
      { label: "Model", value: "Silindir" },
    ],
  },

  // ── Plastik Şişeler (1 ürün) ─────────────────────────────────
  {
    id: "pls-001",
    slug: "hdpe-sise-200ml-silindir",
    name: "HDPE Şişe 200ml Silindir",
    category: "plastik-siseler",
    description: "200ml HDPE silindir şişe. Losyon, krem ve vücut sütü ambalajı için dayanıklı, opak yapı. 24mm Klasik ağız. Çevre dostu, geri dönüştürülebilir hammadde kullanılmaktadır.",
    shortDescription: "200ml HDPE silindir şişe",
    volume: "200ml",
    weight: "21g",
    neckDiameter: "24mm Klasik",
    height: "155mm",
    diameter: "52mm",
    material: "HDPE",
    colors: ["Beyaz", "Pembe", "Mavi", "Yeşil"],
    model: "Silindir",
    shape: "silindir",
    minOrder: 10000,
    inStock: true,
    featured: true,
    specs: [
      { label: "Hacim", value: "200ml" },
      { label: "Ağırlık", value: "21g" },
      { label: "Ağız", value: "24mm Klasik" },
      { label: "Yükseklik", value: "155mm" },
      { label: "Çap", value: "52mm" },
      { label: "Hammadde", value: "HDPE" },
      { label: "Model", value: "Silindir" },
    ],
  },

  // ── Kapaklar (1 ürün) ────────────────────────────────────────
  {
    id: "kpk-001",
    slug: "kapak-24mm-flip-top",
    name: "Kapak 24mm Flip-Top",
    category: "kapaklar",
    description: "24mm flip-top kapak. Şampuan, losyon ve kozmetik şişeler için tek elle açılabilen pratik kapak. Klasik ve Modern ağız uyumlu. Kalite garantili üretim.",
    shortDescription: "24mm flip-top kozmetik kapak",
    neckDiameter: "24mm Klasik",
    weight: "3g",
    material: "PP",
    colors: ["Beyaz", "Siyah", "Pembe", "Mavi", "Şeffaf"],
    minOrder: 30000,
    inStock: true,
    featured: true,
    specs: [
      { label: "Çap", value: "24mm" },
      { label: "Ağırlık", value: "3g" },
      { label: "Hammadde", value: "PP" },
      { label: "Tip", value: "Flip-Top" },
      { label: "Uyumluluk", value: "24mm Klasik / Modern" },
    ],
  },

  // ── Tıpalar (1 ürün) ────────────────────────────────────────
  {
    id: "tip-001",
    slug: "ic-tipa-18mm",
    name: "İç Tıpa 18mm",
    category: "tipalar",
    description: "18mm iç tıpa. Serum, esansiyel yağ ve kolonya şişeleri için sızdırmazlık sağlayan PE iç tıpa. Sprey ve damlalık kapak altında kullanılır. Uzman ekibimiz tarafından kalite kontrollü üretilmektedir.",
    shortDescription: "18mm PE iç tıpa",
    neckDiameter: "18mm",
    weight: "0.5g",
    material: "PE",
    colors: ["Beyaz", "Şeffaf"],
    minOrder: 100000,
    inStock: true,
    featured: true,
    specs: [
      { label: "Çap", value: "18mm" },
      { label: "Ağırlık", value: "0.5g" },
      { label: "Hammadde", value: "PE" },
      { label: "Tip", value: "İç Tıpa" },
    ],
  },

  // ── Parmak Spreyler (1 ürün) ─────────────────────────────────
  {
    id: "psp-001",
    slug: "parmak-sprey-18mm-ince-sis",
    name: "Parmak Sprey 18mm İnce Sis",
    category: "parmak-spreyler",
    description: "18mm parmak sprey mekanizması, ince sis tipi. Parfüm, kolonya ve küçük kozmetik şişeler için hassas püskürtme sağlar. ISO sertifikalı üretim süreçlerimiz ile kalite garantisi sunulmaktadır.",
    shortDescription: "18mm ince sis parmak sprey",
    neckDiameter: "18mm",
    weight: "3.5g",
    material: "PP",
    colors: ["Beyaz", "Siyah", "Altın Yaldız", "Gümüş"],
    minOrder: 30000,
    inStock: true,
    featured: true,
    specs: [
      { label: "Çap", value: "18mm" },
      { label: "Ağırlık", value: "3.5g" },
      { label: "Hammadde", value: "PP" },
      { label: "Sprey Tipi", value: "İnce sis" },
      { label: "Dozaj", value: "0.1ml / basım" },
    ],
  },

  // ── Diğer Ürünler (pompa, tetikli, huni) ────────────────────
  {
    id: "dg-001",
    slug: "losyon-pompasi-28mm",
    name: "Losyon Pompası 28mm",
    category: "diger-urunler",
    description: "28mm losyon pompası. Sıvı sabun, losyon ve şampuan şişeleri için dozajlı pompa mekanizması. Uzun borusu ile 500ml şişeye kadar uyumlu.",
    shortDescription: "28mm losyon dozajlama pompası",
    neckDiameter: "28mm",
    weight: "8g",
    material: "PP",
    colors: ["Beyaz", "Siyah", "Gümüş", "Altın Yaldız"],
    minOrder: 20000,
    inStock: true,
    featured: true,
    specs: [
      { label: "Çap", value: "28mm" },
      { label: "Ağırlık", value: "8g" },
      { label: "Hammadde", value: "PP" },
      { label: "Tip", value: "Losyon Pompası" },
      { label: "Dozaj", value: "1ml / basım" },
      { label: "Boru Uzunluğu", value: "195mm" },
    ],
  },
  {
    id: "dg-002",
    slug: "tetikli-puskurtucu-28mm-standart",
    name: "Tetikli Püskürtücü 28mm Standart",
    category: "diger-urunler",
    description: "28mm standart tetikli püskürtücü. Temizlik sıvıları, cam silici ve çok amaçlı sprey ürünleri için ayarlanabilir nozul ile sis ve jet modları.",
    shortDescription: "28mm standart tetikli püskürtücü",
    neckDiameter: "28mm",
    weight: "25g",
    material: "PP",
    colors: ["Beyaz", "Siyah", "Mavi", "Yeşil"],
    minOrder: 10000,
    inStock: true,
    featured: true,
    specs: [
      { label: "Çap", value: "28mm" },
      { label: "Ağırlık", value: "25g" },
      { label: "Hammadde", value: "PP" },
      { label: "Tip", value: "Standart Tetikli" },
      { label: "Dozaj", value: "1.2ml / basım" },
      { label: "Mod", value: "Sis / Jet / Kapalı" },
    ],
  },
  {
    id: "dg-003",
    slug: "plastik-huni-30mm",
    name: "Plastik Huni 30mm",
    category: "diger-urunler",
    description: "30mm ağız çaplı plastik huni. Küçük hacimli kozmetik, parfüm ve serum şişelerine dolum işlemleri için ideal. PP hammaddeli, tekrar kullanılabilir.",
    shortDescription: "30mm kozmetik dolum hunisi",
    diameter: "30mm",
    weight: "2g",
    material: "PP",
    colors: ["Beyaz", "Şeffaf"],
    minOrder: 50000,
    inStock: true,
    featured: true,
    specs: [
      { label: "Ağız Çapı", value: "30mm" },
      { label: "Ağırlık", value: "2g" },
      { label: "Hammadde", value: "PP" },
      { label: "Tip", value: "Mini Huni" },
    ],
  },
];

export function getProductsByCategory(category: CategorySlug): Product[] {
  return products.filter((p) => p.category === category);
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured);
}

export function getAllMaterials(): string[] {
  return [...new Set(products.map((p) => p.material))];
}

export function getAllColors(): string[] {
  return [...new Set(products.flatMap((p) => p.colors))].sort((a, b) => a.localeCompare(b, "tr"));
}

export function getAllVolumes(): string[] {
  return [...new Set(products.filter((p) => p.volume).map((p) => p.volume!))].sort(
    (a, b) => (parseInt(a) || 0) - (parseInt(b) || 0)
  );
}

export function getAllWeights(): string[] {
  return [...new Set(products.filter((p) => p.weight).map((p) => p.weight!))].sort(
    (a, b) => (parseFloat(a) || 0) - (parseFloat(b) || 0)
  );
}

export function getAllNeckDiameters(): string[] {
  return [...new Set(products.filter((p) => p.neckDiameter).map((p) => p.neckDiameter!))].sort(
    (a, b) => (parseInt(a) || 0) - (parseInt(b) || 0)
  );
}
