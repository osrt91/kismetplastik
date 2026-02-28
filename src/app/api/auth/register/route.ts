import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { ok: allowed } = rateLimit(`register:${ip}`, { limit: 3, windowMs: 300_000 });
  if (!allowed) {
    return NextResponse.json(
      { success: false, error: "Çok fazla kayıt denemesi. 5 dakika bekleyip tekrar deneyin." },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const { email, password, full_name, phone, company_name, tax_number, tax_office, company_address, city, district } = body;

    if (!email || !password || !full_name || !company_name) {
      return NextResponse.json(
        { success: false, error: "E-posta, şifre, ad soyad ve firma adı zorunludur." },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { success: false, error: "Şifre en az 8 karakter olmalıdır." },
        { status: 400 }
      );
    }

    const response = NextResponse.json({ success: true });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options);
            });
          },
        },
      }
    );

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name },
      },
    });

    if (error) {
      if (error.message.includes("already registered")) {
        return NextResponse.json(
          { success: false, error: "Bu e-posta adresi zaten kayıtlı." },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    if (data.user) {
      await supabase.from("profiles").update({
        full_name,
        phone: phone || null,
        company_name,
        tax_number: tax_number || null,
        tax_office: tax_office || null,
        company_address: company_address || null,
        city: city || null,
        district: district || null,
        role: "dealer",
        is_approved: false,
      }).eq("id", data.user.id);
    }

    return NextResponse.json({
      success: true,
      message: "Bayilik başvurunuz alındı. Başvurunuz onaylandığında size e-posta ile bilgi verilecektir.",
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Bir hata oluştu." },
      { status: 500 }
    );
  }
}
