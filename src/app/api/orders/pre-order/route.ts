import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { rateLimit } from "@/lib/rate-limit";

const preOrderSchema = z.object({
  name: z.string().min(2),
  company: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  productName: z.string().min(2),
  quantity: z.number().int().positive(),
  preferredDate: z.string().optional(),
  notes: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      "unknown";
    const { ok: allowed } = rateLimit(`pre-order:${ip}`, {
      limit: 5,
      windowMs: 60_000,
    });
    if (!allowed) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Çok fazla istek gönderdiniz. Lütfen biraz bekleyip tekrar deneyin.",
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = preOrderSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message ?? "Geçersiz veri.";
      return NextResponse.json(
        { success: false, error: firstError },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Log the pre-order (Supabase insert as future enhancement)
    console.log("[Pre-Order] New pre-order received:", {
      name: data.name,
      company: data.company,
      email: data.email,
      phone: data.phone,
      productName: data.productName,
      quantity: data.quantity,
      preferredDate: data.preferredDate || null,
      notes: data.notes || null,
      status: "pending",
      createdAt: new Date().toISOString(),
    });

    // TODO: Insert into Supabase pre_orders table when migration is applied
    // const supabase = getSupabase();
    // const { error: insertError } = await supabase.from("pre_orders").insert({
    //   name: data.name,
    //   company: data.company,
    //   email: data.email,
    //   phone: data.phone,
    //   product_name: data.productName,
    //   quantity: data.quantity,
    //   preferred_date: data.preferredDate || null,
    //   notes: data.notes || null,
    //   status: "pending",
    // });

    return NextResponse.json({
      success: true,
      message:
        "Ön siparişiniz başarıyla alındı. En kısa sürede sizinle iletişime geçeceğiz.",
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Bir hata oluştu. Lütfen tekrar deneyin." },
      { status: 500 }
    );
  }
}
