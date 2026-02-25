export type CategorySlug =
  | "pet-siseler"
  | "plastik-siseler"
  | "kolonya"
  | "sprey"
  | "oda-parfumu"
  | "sivi-sabun"
  | "kapaklar"
  | "ozel-uretim";

export type ShapeType = "düz" | "oval" | "silindir" | "yuvarlak";

export type SurfaceType = "düz" | "kare" | "özel";

export type MaterialType = "PET" | "HDPE" | "PP" | "LDPE";

export type NeckSize = "18mm" | "20mm" | "24mm Klasik" | "24mm Modern" | "28mm";

export interface ProductSpec {
  label: string;
  value: string;
}

export interface CompatibleCap {
  id: string;
  name: string;
  neckDiameter: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: CategorySlug;
  description: string;
  shortDescription: string;
  volume?: string;
  weight?: string;
  neckDiameter?: string;
  height?: string;
  diameter?: string;
  material: string;
  colors: string[];
  colorCodes?: Record<string, string>;
  shapes?: ShapeType[];
  model?: string;
  surfaceType?: SurfaceType;
  shape?: ShapeType;
  compatibleCaps?: string[];
  minOrder: number;
  inStock: boolean;
  featured: boolean;
  specs: ProductSpec[];
}

export interface Category {
  slug: CategorySlug;
  name: string;
  description: string;
  productCount: number;
  icon?: string;
}

export type SortOption = "name-asc" | "name-desc" | "volume-asc" | "volume-desc" | "weight-asc" | "weight-desc";

export interface FilterState {
  category: CategorySlug | "all";
  material: string;
  color: string;
  search: string;
  sort: SortOption;
  neckDiameter: string;
  shape: string;
  model: string;
  surfaceType: string;
  volumeRange: [number, number] | null;
  weightRange: [number, number] | null;
}
