import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";

export function timingSafeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
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

export function sanitizeSearchInput(input: string): string {
  return input.replace(/[%_\\'"()]/g, "");
}
