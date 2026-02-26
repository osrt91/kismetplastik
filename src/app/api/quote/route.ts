import { NextRequest, NextResponse } from "next/server";
import { sendQuoteEmail } from "@/lib/email";
import { rateLimit } from "@/lib/rate-limit";

interface QuoteFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  address?: string;
  category: string;
  productInterest?: string;
  quantity?: string;
  deliveryDate?: string;
  message?: string;
}

function validate(data: QuoteFormData): string | null {
  if (!data.name?.trim()) return "Ad Soyad alanı zorunludur.";
  if (!data.email?.trim()) return "E-posta alanı zorunludur.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return "Geçerli bir e-posta adresi giriniz.";
  if (!data.phone?.trim()) return "Telefon alanı zorunludur.";
  if (!data.company?.trim()) return "Firma adı zorunludur.";
  if (!data.category?.trim()) return "Ürün kategorisi seçimi zorunludur.";
  return null;
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const { ok: allowed } = rateLimit(`quote:${ip}`, { limit: 3, windowMs: 60_000 });
    if (!allowed) {
      return NextResponse.json(
        { success: false, error: "Çok fazla istek gönderdiniz. Lütfen biraz bekleyip tekrar deneyin." },
        { status: 429 }
      );
    }

    const body = (await request.json()) as QuoteFormData;
    const error = validate(body);

    if (error) {
      return NextResponse.json({ success: false, error }, { status: 400 });
    }

    const result = await sendQuoteEmail(body);
    if (!result.ok) {
      console.error("[Quote Request] Email failed:", result.error);
      return NextResponse.json(
        { success: false, error: "Teklif talebi gönderilemedi. Lütfen tekrar deneyin veya doğrudan arayın." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Teklif talebiniz alındı. En kısa sürede sizinle iletişime geçeceğiz.",
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Bir hata oluştu. Lütfen tekrar deneyin." },
      { status: 500 }
    );
  }
}
