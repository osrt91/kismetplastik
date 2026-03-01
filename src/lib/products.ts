import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import {
  products as staticProducts,
  categories as staticCategories,
  getProductsByCategory as staticByCategory,
  getProductBySlug as staticBySlug,
  getCategoryBySlug as staticCategoryBySlug,
  getFeaturedProducts as staticFeatured,
  getAllMaterials as staticMaterials,
  getAllColors as staticColors,
  getAllVolumes as staticVolumes,
  getAllWeights as staticWeights,
  getAllNeckDiameters as staticNeckDiameters,
} from "@/data/products";
import type { Product, Category, CategorySlug } from "@/types/product";

interface SupabaseProduct {
  id: string;
  slug: string;
  name: string;
  category_slug: string;
  description: string;
  short_description: string;
  volume: string | null;
  weight: string | null;
  neck_diameter: string | null;
  height: string | null;
  diameter: string | null;
  material: string;
  colors: string[];
  model: string | null;
  shape: string | null;
  surface_type: string | null;
  min_order: number;
  in_stock: boolean;
  featured: boolean;
  specs: Array<{ label: string; value: string }>;
  image_url: string | null;
  images: string[];
}

function mapSupabaseProduct(row: SupabaseProduct): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category_slug as CategorySlug,
    description: row.description,
    shortDescription: row.short_description,
    volume: row.volume ?? undefined,
    weight: row.weight ?? undefined,
    neckDiameter: row.neck_diameter ?? undefined,
    height: row.height ?? undefined,
    diameter: row.diameter ?? undefined,
    material: row.material,
    colors: row.colors ?? [],
    model: row.model ?? undefined,
    shape: row.shape as Product["shape"],
    surfaceType: row.surface_type as Product["surfaceType"],
    minOrder: row.min_order,
    inStock: row.in_stock,
    featured: row.featured,
    specs: row.specs ?? [],
  };
}

export async function getProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured()) return staticProducts;

  try {
    const { data, error } = await getSupabase()
      .from("products")
      .select("*")
      .order("name");

    if (error || !data) return staticProducts;
    return data.map(mapSupabaseProduct);
  } catch {
    return staticProducts;
  }
}

export async function getCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured()) return staticCategories;

  try {
    const { data, error } = await getSupabase()
      .from("categories")
      .select("*")
      .order("display_order");

    if (error || !data) return staticCategories;

    const { data: countData } = await getSupabase()
      .from("products")
      .select("category_slug");

    const counts: Record<string, number> = {};
    if (countData) {
      for (const row of countData) {
        counts[row.category_slug] = (counts[row.category_slug] || 0) + 1;
      }
    }

    return data.map((row) => ({
      slug: row.slug as CategorySlug,
      name: row.name,
      description: row.description || "",
      productCount: counts[row.slug] || 0,
      icon: row.icon ?? undefined,
    }));
  } catch {
    return staticCategories;
  }
}

export async function getProductsByCategory(category: CategorySlug): Promise<Product[]> {
  if (!isSupabaseConfigured()) return staticByCategory(category);

  try {
    const { data, error } = await getSupabase()
      .from("products")
      .select("*")
      .eq("category_slug", category)
      .order("name");

    if (error || !data) return staticByCategory(category);
    return data.map(mapSupabaseProduct);
  } catch {
    return staticByCategory(category);
  }
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  if (!isSupabaseConfigured()) return staticBySlug(slug);

  try {
    const { data, error } = await getSupabase()
      .from("products")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error || !data) return staticBySlug(slug);
    return mapSupabaseProduct(data);
  } catch {
    return staticBySlug(slug);
  }
}

export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  if (!isSupabaseConfigured()) return staticCategoryBySlug(slug);

  try {
    const { data, error } = await getSupabase()
      .from("categories")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error || !data) return staticCategoryBySlug(slug);

    const { count } = await getSupabase()
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("category_slug", slug);

    return {
      slug: data.slug as CategorySlug,
      name: data.name,
      description: data.description || "",
      productCount: count || 0,
      icon: data.icon ?? undefined,
    };
  } catch {
    return staticCategoryBySlug(slug);
  }
}

export async function getFeaturedProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured()) return staticFeatured();

  try {
    const { data, error } = await getSupabase()
      .from("products")
      .select("*")
      .eq("featured", true)
      .order("name");

    if (error || !data) return staticFeatured();
    return data.map(mapSupabaseProduct);
  } catch {
    return staticFeatured();
  }
}

export { staticMaterials as getAllMaterials };
export { staticColors as getAllColors };
export { staticVolumes as getAllVolumes };
export { staticWeights as getAllWeights };
export { staticNeckDiameters as getAllNeckDiameters };
