import { NextRequest, NextResponse } from "next/server";
import { timingSafeCompare } from "@/lib/auth";

/**
 * POST /api/admin/auth
 *
 * Authenticates admin login by comparing the provided password against
 * ADMIN_SECRET using timing-safe comparison. Sets an httpOnly cookie on success.
 *
 * @body {{ password: string }}
 * @returns {{ success: boolean, error?: string }}
 */
export async function POST(request: NextRequest) {
  const { password } = await request.json();
  const secret = process.env.ADMIN_SECRET;

  if (!secret) {
    return NextResponse.json(
      { error: "ADMIN_SECRET ortam değişkeni tanımlı değil" },
      { status: 500 }
    );
  }

  if (!password || typeof password !== "string" || !timingSafeCompare(password, secret)) {
    return NextResponse.json({ error: "Geçersiz şifre" }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set("admin-token", secret, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  });
  return response;
}

/**
 * DELETE /api/admin/auth
 *
 * Logs out the admin by deleting the admin-token cookie.
 *
 * @returns {{ success: boolean }}
 */
export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete("admin-token");
  return response;
}
