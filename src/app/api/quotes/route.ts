import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { checkAuth } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";
import { quoteRequestSchema, getZodErrorMessage } from "@/lib/validations";

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const { ok: allowed } = rateLimit(`quotes:${ip}`, { limit: 3, windowMs: 60_000 });
    if (!allowed) {
      return NextResponse.json(
        { success: false, error: "Çok fazla istek. Lütfen bekleyip tekrar deneyin." },
        { status: 429 }
      );
    }

    const raw = await request.json();
    const parsed = quoteRequestSchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: getZodErrorMessage(parsed.error) }, { status: 400 });
    }

    const body = parsed.data;

    const supabase = getSupabase();

    const { data: quote, error: quoteError } = await supabase
      .from("quote_requests")
      .insert({
        company_name: body.company_name.trim(),
        contact_name: body.contact_name.trim(),
        email: body.email.trim(),
        phone: body.phone.trim(),
        message: body.message?.trim() || null,
        status: "pending",
      })
      .select("id")
      .single();

    if (quoteError || !quote) {
      console.error("[Quotes API] Insert failed:", quoteError);
      return NextResponse.json(
        { success: false, error: "Teklif talebi oluşturulamadı." },
        { status: 500 }
      );
    }

    const items = body.items.map((item) => ({
      quote_request_id: quote.id,
      product_id: item.product_id || null,
      product_name: item.product_name.trim(),
      quantity: item.quantity,
      notes: item.notes?.trim() || null,
    }));

    const { error: itemsError } = await supabase.from("quote_items").insert(items);

    if (itemsError) {
      console.error("[Quotes API] Items insert failed:", itemsError);
    }

    return NextResponse.json({
      success: true,
      data: { id: quote.id },
      message: "Teklif talebiniz alındı. En kısa sürede size dönüş yapacağız.",
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Bir hata oluştu." },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const authError = checkAuth(request);
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 50);
    const offset = (page - 1) * limit;

    const supabase = getSupabase();

    let query = supabase
      .from("quote_requests")
      .select("*, quote_items(*)", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) {
      query = query.eq("status", status);
    }

    const { data, count, error } = await query;

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Bir hata oluştu." },
      { status: 500 }
    );
  }
}
