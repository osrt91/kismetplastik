import { NextRequest, NextResponse } from "next/server";
import { sendContactEmail } from "@/lib/email";
import { rateLimit } from "@/lib/rate-limit";

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject: string;
  message: string;
}

function validate(data: ContactFormData): string | null {
  if (!data.name?.trim()) return "Ad Soyad alanı zorunludur.";
  if (!data.email?.trim()) return "E-posta alanı zorunludur.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return "Geçerli bir e-posta adresi giriniz.";
  if (!data.subject?.trim()) return "Konu seçimi zorunludur.";
  if (!data.message?.trim()) return "Mesaj alanı zorunludur.";
  if (data.message.trim().length < 10) return "Mesaj en az 10 karakter olmalıdır.";
  return null;
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const { ok: allowed } = rateLimit(`contact:${ip}`, { limit: 5, windowMs: 60_000 });
    if (!allowed) {
      return NextResponse.json(
        { success: false, error: "Çok fazla istek gönderdiniz. Lütfen biraz bekleyip tekrar deneyin." },
        { status: 429 }
      );
    }

    const body = (await request.json()) as ContactFormData;
    const error = validate(body);

    if (error) {
      return NextResponse.json({ success: false, error }, { status: 400 });
    }

    const result = await sendContactEmail(body);
    if (!result.ok) {
      console.error("[Contact Form] Email failed:", result.error);
      return NextResponse.json(
        { success: false, error: "E-posta gönderilemedi. Lütfen tekrar deneyin veya doğrudan arayın." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Mesajınız başarıyla alındı. En kısa sürede size dönüş yapacağız.",
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Bir hata oluştu. Lütfen tekrar deneyin." },
      { status: 500 }
    );
  }
}
