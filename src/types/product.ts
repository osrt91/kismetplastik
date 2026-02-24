export type CategorySlug =
  | "pet-siseler"
  | "kavanozlar"
  | "kapaklar"
  | "preformlar"
  | "ozel-uretim"
  | "ambalaj-setleri";

export type ShapeType = "düz" | "oval" | "silindir" | "yuvarlak";

export type SurfaceType = "düz" | "kare" | "özel";

export type MaterialType = "PET" | "HDPE" | "PP" | "LDPE" | "PP / Metal" | "PET / Cam" | "PET + PP" | "PET + Metal" | "PET / rPET";

export type NeckSize = "18mm" | "20mm" | "24mm" | "24mm-klasik" | "24mm-modern" | "28mm" | "38mm" | "48mm" | "53mm" | "63mm" | "89mm";

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
