import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";

export function timingSafeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

const TOKEN_PREFIX = "kp_admin_";

export function generateAdminToken(secret: string): string {
  const hash = createHmac("sha256", secret)
    .update("kismetplastik-admin-session")
    .digest("hex");
  return TOKEN_PREFIX + hash;
}

export function verifyAdminToken(token: string, secret: string): boolean {
  const expected = generateAdminToken(secret);
  return timingSafeCompare(token, expected);
}

export function checkAuth(request: NextRequest): NextResponse | null {
  const token = request.cookies.get("admin-token")?.value;
  const secret = process.env.ADMIN_SECRET;
  if (!token || !secret || !verifyAdminToken(token, secret)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export function sanitizeSearchInput(input: string): string {
  return input.replace(/[%_\\'"()]/g, "");
}
