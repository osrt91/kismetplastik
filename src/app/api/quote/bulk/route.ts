import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sendBulkQuoteEmail } from "@/lib/email";
import { rateLimit } from "@/lib/rate-limit";

const bulkQuoteSchema = z.object({
  name: z.string().min(1, "Ad Soyad alanı zorunludur."),
  email: z.string().email("Geçerli bir e-posta adresi giriniz."),
  phone: z.string().min(1, "Telefon alanı zorunludur."),
  company: z.string().min(1, "Firma adı zorunludur."),
  message: z.string().optional(),
  products: z
    .array(
      z.object({
        productId: z.string(),
        productName: z.string(),
        category: z.string(),
        quantity: z.number().int().min(1),
        notes: z.string(),
      })
    )
    .min(1, "En az bir ürün seçilmelidir."),
});

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const { ok: allowed } = rateLimit(`bulk-quote:${ip}`, {
      limit: 3,
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
    const parsed = bulkQuoteSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message ?? "Geçersiz veri.";
      return NextResponse.json(
        { success: false, error: firstError },
        { status: 400 }
      );
    }

    const result = await sendBulkQuoteEmail(parsed.data);
    if (!result.ok) {
      console.error("[Bulk Quote] Email failed:", result.error);
      return NextResponse.json(
        {
          success: false,
          error:
            "Teklif talebi gönderilemedi. Lütfen tekrar deneyin veya doğrudan arayın.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "Toplu teklif talebiniz alındı. En kısa sürede sizinle iletişime geçeceğiz.",
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Bir hata oluştu. Lütfen tekrar deneyin." },
      { status: 500 }
    );
  }
}
