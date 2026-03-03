import { NextRequest, NextResponse } from "next/server";

/**
 * Performs timing-safe string comparison to prevent timing attacks.
 * Used for admin token verification against ADMIN_SECRET.
 *
 * @param a - First string to compare
 * @param b - Second string to compare
 * @returns true if strings are identical, false otherwise
 *
 * @example
 * ```ts
 * timingSafeCompare(cookieToken, process.env.ADMIN_SECRET!)
 * ```
 */
export function timingSafeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

/**
 * Validates admin authentication by checking the admin-token cookie
 * against the ADMIN_SECRET environment variable.
 *
 * @param request - The incoming Next.js request
 * @returns null if authenticated, or a 401 JSON response if not
 *
 * @example
 * ```ts
 * const authError = checkAuth(request);
 * if (authError) return authError;
 * ```
 */
export function checkAuth(request: NextRequest): NextResponse | null {
  const token = request.cookies.get("admin-token")?.value;
  const secret = process.env.ADMIN_SECRET;
  if (!token || !secret || !timingSafeCompare(token, secret)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

/**
 * Sanitizes user search input by removing characters that could be
 * used for SQL injection or LIKE pattern abuse.
 * Strips: % _ \ ' " ( )
 *
 * @param input - Raw user search string
 * @returns Sanitized string safe for database queries
 */
export function sanitizeSearchInput(input: string): string {
  return input.replace(/[%_\\'"()]/g, "");
}
