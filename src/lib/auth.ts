import { NextRequest, NextResponse } from "next/server";
import { createHash, timingSafeEqual } from "crypto";

export function timingSafeCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

/**
 * Computes a SHA-256 hex digest of the given secret.
 * Used to derive the admin-token cookie value so the raw
 * ADMIN_SECRET is never stored client-side.
 */
export function hashSecret(secret: string): string {
  return createHash("sha256").update(secret).digest("hex");
}

export function checkAuth(request: NextRequest): NextResponse | null {
  const token = request.cookies.get("admin-token")?.value;
  const secret = process.env.ADMIN_SECRET;
  if (!token || !secret || !timingSafeCompare(token, hashSecret(secret))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

/**
 * Sanitize search input to prevent SQL/filter injection.
 * Uses an allowlist approach: only permits alphanumeric characters (including
 * Turkish: ğüşıöçĞÜŞİÖÇ), spaces, hyphens, dots, and forward slashes.
 * Everything else is stripped. The result is also truncated to 100 characters
 * to prevent excessively long filter strings.
 */
export function sanitizeSearchInput(input: string): string {
  // Allowlist: letters (incl. Turkish), digits, spaces, hyphens, dots, forward slashes
  const sanitized = input.replace(/[^a-zA-Z0-9\s\-./ğüşıöçĞÜŞİÖÇ]/g, "");
  return sanitized.slice(0, 100);
}
