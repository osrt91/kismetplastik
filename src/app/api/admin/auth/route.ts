import { NextRequest, NextResponse } from "next/server";
import { timingSafeCompare, generateAdminToken } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { ok: allowed } = rateLimit(`admin-auth:${ip}`, { limit: 5, windowMs: 300_000 });
  if (!allowed) {
    return NextResponse.json(
      { error: "Çok fazla giriş denemesi. 5 dakika bekleyip tekrar deneyin." },
      { status: 429 }
    );
  }

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

  const token = generateAdminToken(secret);
  const response = NextResponse.json({ success: true });
  response.cookies.set("admin-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete("admin-token");
  return response;
}
