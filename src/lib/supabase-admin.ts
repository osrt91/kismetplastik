import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

let _supabaseAdmin: SupabaseClient | null = null;

/**
 * Returns a Supabase client with the service_role key (bypasses RLS).
 * Falls back to the anon key if service_role is not set.
 * Returns null if no Supabase config is available at all.
 */
export function getSupabaseAdmin(): SupabaseClient {
  if (_supabaseAdmin) return _supabaseAdmin;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!serviceKey) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "[supabase-admin] SUPABASE_SERVICE_ROLE_KEY is missing in production. Admin operations must not use anon key. Set SUPABASE_SERVICE_ROLE_KEY in environment variables."
      );
    }
    if (anonKey) {
      console.warn("[supabase-admin] SUPABASE_SERVICE_ROLE_KEY is missing, falling back to anon key. Admin operations may be restricted by RLS.");
    }
  }
  const key = serviceKey || anonKey;

  if (!url || !key) {
    throw new Error(
      "Supabase yapılandırılmamış. .env.local dosyasına NEXT_PUBLIC_SUPABASE_URL ve SUPABASE_SERVICE_ROLE_KEY ekleyin."
    );
  }

  _supabaseAdmin = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return _supabaseAdmin;
}

export function isSupabaseAdminConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  );
}

/**
 * Returns a 503 JSON response if Supabase is not configured.
 * Use as a guard at the top of admin API handlers:
 *   const notReady = requireSupabase();
 *   if (notReady) return notReady;
 */
export function requireSupabase(): NextResponse | null {
  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json(
      {
        success: false,
        error: "Supabase yapılandırılmamış. .env.local dosyasına NEXT_PUBLIC_SUPABASE_URL ve SUPABASE_SERVICE_ROLE_KEY ekleyin.",
      },
      { status: 503 }
    );
  }
  return null;
}
