import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { ok: allowed } = rateLimit(`newsletter:${ip}`, { limit: 3, windowMs: 60_000 });
  if (!allowed) {
    return NextResponse.json(
      { success: false, error: "Çok fazla istek. Lütfen biraz bekleyin." },
      { status: 429 }
    );
  }

  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string" || !isValidEmail(email.trim())) {
      return NextResponse.json(
        { success: false, error: "Geçerli bir e-posta adresi giriniz." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (!isSupabaseConfigured()) {
      return NextResponse.json({ success: true });
    }

    const supabase = getSupabase();

    const { data: existing } = await supabase
      .from("newsletter_subscribers")
      .select("id")
      .eq("email", normalizedEmail)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ success: true });
    }

    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert({ email: normalizedEmail, subscribed_at: new Date().toISOString() });

    if (error) {
      console.error("[Newsletter] Supabase insert error:", error);
      return NextResponse.json(
        { success: false, error: "Kayıt sırasında bir hata oluştu." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: "Bir hata oluştu." },
      { status: 500 }
    );
  }
}
