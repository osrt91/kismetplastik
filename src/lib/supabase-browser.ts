import { createBrowserClient } from "@supabase/ssr";

let client: ReturnType<typeof createBrowserClient> | null = null;

/**
 * Returns a singleton Supabase browser client with SSR cookie support.
 * Use this in Client Components (`"use client"`) where user session
 * context is needed.
 *
 * @returns Supabase browser SSR client
 */
export function getSupabaseBrowser() {
  if (client) return client;

  client = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  return client;
}
