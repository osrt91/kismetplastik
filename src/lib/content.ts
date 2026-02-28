import { getSupabase, isSupabaseConfigured } from "./supabase";

const contentCache = new Map<string, { data: Record<string, unknown>; timestamp: number }>();
const CACHE_TTL = 60_000;

export async function getPageContent(pageKey: string): Promise<Record<string, unknown>> {
  const cached = contentCache.get(pageKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) return cached.data;

  if (!isSupabaseConfigured()) return {};

  try {
    const supabase = getSupabase();
    const { data } = await supabase
      .from("site_content")
      .select("content")
      .eq("page_key", pageKey)
      .single();

    const content = (data?.content as Record<string, unknown>) || {};
    contentCache.set(pageKey, { data: content, timestamp: Date.now() });
    return content;
  } catch {
    return {};
  }
}

export async function getAllContent(): Promise<Record<string, Record<string, unknown>>> {
  if (!isSupabaseConfigured()) return {};

  try {
    const supabase = getSupabase();
    const { data } = await supabase.from("site_content").select("page_key, content");

    const result: Record<string, Record<string, unknown>> = {};
    data?.forEach((row: { page_key: string; content: Record<string, unknown> }) => {
      result[row.page_key] = row.content;
    });
    return result;
  } catch {
    return {};
  }
}
