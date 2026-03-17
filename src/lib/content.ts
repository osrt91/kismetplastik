import { getSupabaseSafe } from "@/lib/supabase";
import type { DbContentSection, DbSiteSetting, DbCertificate, DbTradeShow, DbResource, DbFaqItem, DbCareerListing, DbReference, DbMilestone, GlossaryTerm } from "@/types/database";

// ─── Site Settings ─────────────────────────────────────────────

/**
 * Fetch all site_settings as a key-value map.
 * Returns empty map if Supabase is not configured (e.g. CI builds).
 */
export async function getSettings(): Promise<Record<string, string>> {
  const supabase = getSupabaseSafe();
  if (!supabase) return {};

  const { data } = await supabase
    .from("site_settings")
    .select("key, value");

  const map: Record<string, string> = {};
  (data ?? []).forEach((s: Pick<DbSiteSetting, "key" | "value">) => {
    map[s.key] = s.value;
  });
  return map;
}

// ─── Page Content ──────────────────────────────────────────────

/**
 * Fetch all content_sections for a page prefix.
 * E.g. getPageContent("home") returns all rows where section_key LIKE 'home_%'
 * Returns empty map if Supabase is not configured (e.g. CI builds).
 */
export async function getPageContent(
  pagePrefix: string
): Promise<Record<string, DbContentSection>> {
  const supabase = getSupabaseSafe();
  if (!supabase) return {};

  const { data } = await supabase
    .from("content_sections")
    .select("*")
    .like("section_key", `${pagePrefix}_%`)
    .eq("is_active", true)
    .order("display_order");

  const map: Record<string, DbContentSection> = {};
  (data ?? []).forEach((s: DbContentSection) => {
    map[s.section_key] = s;
  });
  return map;
}

// ─── Localized Field Helper ────────────────────────────────────

/**
 * Synchronous version for client components (TR/EN only, no DB lookup).
 * Use this in "use client" components.
 */
export function getLocalizedFieldSync(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  item: Record<string, unknown> | DbContentSection | any | null | undefined,
  field: string,
  locale: string
): string {
  if (!item) return "";
  const obj = item as Record<string, unknown>;
  if (locale === "tr") return (obj[`${field}_tr`] as string) ?? "";
  if (locale === "en") return (obj[`${field}_en`] as string) ?? "";
  return (obj[`${field}_en`] as string) ?? (obj[`${field}_tr`] as string) ?? "";
}

/**
 * Async version for server components (all 11 locales, with translations table lookup).
 * For TR/EN returns directly. For other locales checks translations table.
 */
export async function getLocalizedField(
  item: Record<string, unknown> | null | undefined,
  field: string,
  locale: string,
  sourceTable?: string
): Promise<string> {
  if (!item) return "";
  if (locale === "tr") return (item[`${field}_tr`] as string) ?? "";
  if (locale === "en") return (item[`${field}_en`] as string) ?? "";

  // Check translations table for other locales
  if (sourceTable && item.id) {
    const supabase = getSupabaseSafe();
    if (supabase) {
      const { data } = await supabase
        .from("translations")
        .select("translated_text")
        .eq("source_table", sourceTable)
        .eq("source_id", item.id as string)
        .eq("field_name", field)
        .eq("locale", locale)
        .single();

      if (data?.translated_text) return data.translated_text;
    }
  }

  // Fallback to EN
  return (item[`${field}_en`] as string) ?? (item[`${field}_tr`] as string) ?? "";
}

// ─── Static Data Fetchers ──────────────────────────────────────

export async function getCertificates(): Promise<DbCertificate[]> {
  const supabase = getSupabaseSafe();
  if (!supabase) return [];

  const { data } = await supabase
    .from("certificates")
    .select("*")
    .eq("is_active", true)
    .order("display_order");
  return data ?? [];
}

export async function getTradeShows(): Promise<DbTradeShow[]> {
  const supabase = getSupabaseSafe();
  if (!supabase) return [];

  const { data } = await supabase
    .from("trade_shows")
    .select("*")
    .eq("is_active", true)
    .order("start_date", { ascending: false });
  return data ?? [];
}

export async function getResources(): Promise<DbResource[]> {
  const supabase = getSupabaseSafe();
  if (!supabase) return [];

  const { data } = await supabase
    .from("resources")
    .select("*")
    .eq("is_active", true)
    .order("display_order");
  return data ?? [];
}

export async function getFaqItems(): Promise<DbFaqItem[]> {
  const supabase = getSupabaseSafe();
  if (!supabase) return [];

  const { data } = await supabase
    .from("faq_items")
    .select("*")
    .eq("is_active", true)
    .order("display_order");
  return data ?? [];
}

export async function getCareerListings(): Promise<DbCareerListing[]> {
  const supabase = getSupabaseSafe();
  if (!supabase) return [];

  const { data } = await supabase
    .from("career_listings")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getReferences(): Promise<DbReference[]> {
  const supabase = getSupabaseSafe();
  if (!supabase) return [];

  const { data } = await supabase
    .from("references")
    .select("*")
    .eq("is_active", true)
    .order("display_order");
  return data ?? [];
}

export async function getMilestones(): Promise<DbMilestone[]> {
  const supabase = getSupabaseSafe();
  if (!supabase) return [];

  const { data } = await supabase
    .from("milestones")
    .select("*")
    .order("year", { ascending: true });
  return data ?? [];
}

export async function getGlossaryTerms(): Promise<GlossaryTerm[]> {
  const supabase = getSupabaseSafe();
  if (!supabase) return [];

  const { data } = await supabase
    .from("glossary_terms")
    .select("*")
    .eq("is_active", true)
    .order("display_order");
  return data ?? [];
}
