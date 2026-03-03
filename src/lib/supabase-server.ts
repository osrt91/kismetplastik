import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Creates a Supabase server client with async cookie handling.
 * Use this in Server Components and Server Actions where user session
 * context is needed. Cookie writes may silently fail in read-only
 * Server Component contexts (expected behavior).
 *
 * @returns Supabase server client with cookie-based session management
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Component'te cookie set edilemez, ignore
          }
        },
      },
    }
  );
}
