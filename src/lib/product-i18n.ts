/**
 * Product i18n helper — translates product names, descriptions, specs, colors, and categories
 * using the locale dictionary. Falls back to original Turkish data if no translation exists.
 */

import type { Product, Category, ProductSpec } from "@/types/product";
import type { Dictionary } from "@/lib/i18n";

interface ProductTranslation {
  name?: string;
  shortDescription?: string;
  description?: string;
}

interface CategoryTranslation {
  name?: string;
  description?: string;
}

type ProductTranslations = Record<string, ProductTranslation>;
type CategoryTranslations = Record<string, CategoryTranslation>;
type SpecTranslations = Record<string, string>;
type ColorTranslations = Record<string, string>;

/** Helper to safely access nested dict keys — checks productData first, then productCatalog */
function getDictSection<T>(dict: Dictionary, key: string): T | undefined {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const d = dict as any;
  return (d?.productData?.[key] ?? d?.productCatalog?.[key]) as T | undefined;
}

/** Get translated product name, shortDescription, description */
export function getProductTranslation(
  product: Product,
  dict: Dictionary
): { name: string; shortDescription: string; description: string } {
  const translations = getDictSection<ProductTranslations>(dict, "bySlug");
  const t = translations?.[product.slug];

  return {
    name: t?.name || product.name,
    shortDescription: t?.shortDescription || product.shortDescription,
    description: t?.description || product.description,
  };
}

/** Get translated category name and description */
export function getCategoryTranslation(
  category: Category,
  dict: Dictionary
): { name: string; description: string } {
  const translations = getDictSection<CategoryTranslations>(dict, "categories");
  const t = translations?.[category.slug];

  return {
    name: t?.name || category.name,
    description: t?.description || category.description,
  };
}

/** Get translated spec label */
export function getSpecTranslation(
  spec: ProductSpec,
  dict: Dictionary
): ProductSpec {
  const translations = getDictSection<SpecTranslations>(dict, "specs");
  return {
    label: translations?.[spec.label] || spec.label,
    value: spec.value,
  };
}

/** Get translated color name */
export function getColorTranslation(
  color: string,
  dict: Dictionary
): string {
  const translations = getDictSection<ColorTranslations>(dict, "colors");
  return translations?.[color] || color;
}

/** Get translated category name by slug (for use in product cards) */
export function getCategoryNameBySlug(
  slug: string,
  dict: Dictionary
): string | undefined {
  const translations = getDictSection<CategoryTranslations>(dict, "categories");
  return translations?.[slug]?.name;
}
