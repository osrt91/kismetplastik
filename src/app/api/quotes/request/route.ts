import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/rate-limit";

interface QuoteRequestItem {
  product_name: string;
  quantity: number;
  notes?: string;
}

interface QuoteRequestBody {
  items: QuoteRequestItem[];
  message?: string;
}

function validateItems(items: QuoteRequestItem[]): string | null {
  if (!Array.isArray(items) || items.length === 0) {
    return "En az bir ürün eklenmelidir.";
  }
  for (const item of items) {
    if (!item.product_name?.trim()) return "Ürün adı zorunludur.";
    if (!item.quantity || item.quantity < 1) return "Miktar en az 1 olmalıdır.";
  }
  return null;
}

export async function POST(request: NextRequest) {
  try {
    // Rate limit
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const { ok: allowed } = rateLimit(`quote-request:${ip}`, {
      limit: 5,
      windowMs: 60_000,
    });
    if (!allowed) {
      return NextResponse.json(
        { success: false, error: "Çok fazla istek. Lütfen bekleyip tekrar deneyin." },
        { status: 429 }
      );
    }

    // Auth check
    const supabase = await supabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Yetkisiz erişim." },
        { status: 401 }
      );
    }

    // Parse and validate body
    const body = (await request.json()) as QuoteRequestBody;
    const validationError = validateItems(body.items);
    if (validationError) {
      return NextResponse.json(
        { success: false, error: validationError },
        { status: 400 }
      );
    }

    // Get user profile for company info
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, company_name, phone, email")
      .eq("id", user.id)
      .single();

    if (!profile) {
      return NextResponse.json(
        { success: false, error: "Profil bulunamadı." },
        { status: 404 }
      );
    }

    // Create quote request
    const { data: quote, error: quoteError } = await supabase
      .from("quote_requests")
      .insert({
        profile_id: user.id,
        company_name: profile.company_name ?? "",
        contact_name: profile.full_name,
        email: profile.email,
        phone: profile.phone ?? "",
        message: body.message?.trim() || null,
        status: "pending" as const,
      })
      .select("id")
      .single();

    if (quoteError || !quote) {
      console.error("[Quote Request API] Insert failed:", quoteError);
      return NextResponse.json(
        { success: false, error: "Teklif talebi oluşturulamadı." },
        { status: 500 }
      );
    }

    // Insert quote items
    const items = body.items.map((item) => ({
      quote_request_id: quote.id,
      product_name: item.product_name.trim(),
      quantity: item.quantity,
      notes: item.notes?.trim() || null,
    }));

    const { error: itemsError } = await supabase
      .from("quote_items")
      .insert(items);

    if (itemsError) {
      console.error("[Quote Request API] Items insert failed:", itemsError);
    }

    return NextResponse.json({
      success: true,
      data: { quoteId: quote.id },
      message: "Teklif talebiniz alındı. En kısa sürede dönüş yapılacaktır.",
    });
  } catch (err) {
    console.error("[Quote Request API]", err);
    return NextResponse.json(
      { success: false, error: "Bir hata oluştu. Lütfen tekrar deneyin." },
      { status: 500 }
    );
  }
}
