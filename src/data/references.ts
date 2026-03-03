export interface Reference {
  id: string;
  name: string;
  logo: string; // path to SVG in /public/references/
  website?: string;
  sector: string;
  sectorEn: string;
}

export const references: Reference[] = [
  {
    id: "ref1",
    name: "Atelier Kozmetik",
    logo: "/references/atelier.svg",
    sector: "Kozmetik",
    sectorEn: "Cosmetics",
  },
  {
    id: "ref2",
    name: "Orient Parfüm",
    logo: "/references/orient.svg",
    sector: "Parfümeri",
    sectorEn: "Perfumery",
  },
  {
    id: "ref3",
    name: "Demir Kozmetik",
    logo: "/references/demir.svg",
    sector: "Kozmetik",
    sectorEn: "Cosmetics",
  },
  {
    id: "ref4",
    name: "Anadolu Temizlik",
    logo: "/references/anadolu.svg",
    sector: "Temizlik",
    sectorEn: "Cleaning",
  },
  {
    id: "ref5",
    name: "Bella Beauty",
    logo: "/references/bella.svg",
    sector: "Güzellik",
    sectorEn: "Beauty",
  },
  {
    id: "ref6",
    name: "Star Otel Grubu",
    logo: "/references/star.svg",
    sector: "Otelcilik",
    sectorEn: "Hospitality",
  },
  {
    id: "ref7",
    name: "Green Nature",
    logo: "/references/green.svg",
    sector: "Doğal Kozmetik",
    sectorEn: "Natural Cosmetics",
  },
  {
    id: "ref8",
    name: "Premium Care",
    logo: "/references/premium.svg",
    sector: "Kişisel Bakım",
    sectorEn: "Personal Care",
  },
];
