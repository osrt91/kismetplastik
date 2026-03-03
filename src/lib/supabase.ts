import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _supabase: SupabaseClient | null = null;

/**
 * Returns a singleton Supabase client for general use (API routes, server-side).
 * Auth session persistence is disabled — use `getSupabaseBrowser()` for
 * client components or `createSupabaseServerClient()` for server components
 * that need user session context.
 *
 * @returns Supabase client instance
 * @throws {Error} If NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is missing
 */
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
 * Checks whether Supabase environment variables are configured.
 *
 * @returns true if both NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
