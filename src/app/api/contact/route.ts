import { NextRequest, NextResponse } from "next/server";
import { sendContactEmail } from "@/lib/email";
import { rateLimit } from "@/lib/rate-limit";
import { contactSchema, getZodErrorMessage } from "@/lib/validations";

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

    const raw = await request.json();
    const parsed = contactSchema.safeParse(raw);

    if (!parsed.success) {
      return NextResponse.json({ success: false, error: getZodErrorMessage(parsed.error) }, { status: 400 });
    }

    const body = parsed.data;

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
