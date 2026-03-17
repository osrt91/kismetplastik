import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _supabase: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (_supabase) return _supabase;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  try {
    new URL(url);
  } catch {
    throw new Error(`Invalid NEXT_PUBLIC_SUPABASE_URL: ${url}`);
  }

  _supabase = createClient(url, key, {
    auth: { persistSession: false },
  });
  return _supabase;
}

/**
 * Returns a Supabase client or null if not configured.
 * Use this in build-time / static-generation contexts where
 * Supabase may be unavailable (e.g. CI builds).
 */
export function getSupabaseSafe(): SupabaseClient | null {
  if (_supabase) return _supabase;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return null;

  try {
    new URL(url);
  } catch {
    return null;
  }

  _supabase = createClient(url, key, {
    auth: { persistSession: false },
  });
  return _supabase;
}

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
