import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { rateLimit } from "@/lib/rate-limit";

/* ------------------------------------------------------------------ */
/*  Zod schema                                                        */
/* ------------------------------------------------------------------ */
const sampleRequestSchema = z.object({
  name: z.string().min(1, "Ad Soyad zorunludur."),
  company: z.string().min(1, "Firma adı zorunludur."),
  email: z.string().email("Geçerli bir e-posta adresi giriniz."),
  phone: z.string().min(7, "Geçerli bir telefon numarası giriniz."),
  address: z.string().optional().default(""),
  products: z.array(z.string()).min(1, "En az bir ürün kategorisi seçiniz."),
  quantity: z.string().optional().default(""),
  notes: z.string().optional().default(""),
  deliveryAddress: z.string().optional().default(""),
  urgency: z.enum(["normal", "urgent", "planned"]).default("normal"),
  preferredDate: z.string().optional().default(""),
});

/* ------------------------------------------------------------------ */
/*  HTML escape                                                       */
/* ------------------------------------------------------------------ */
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/* ------------------------------------------------------------------ */
/*  Email sender                                                      */
/* ------------------------------------------------------------------ */
async function sendSampleRequestEmail(
  data: z.infer<typeof sampleRequestSchema>
): Promise<{ ok: boolean; error?: string }> {
  // Dynamic import to avoid issues if resend is not configured
  let resend: import("resend").Resend | null = null;

  if (process.env.RESEND_API_KEY) {
    const { Resend } = await import("resend");
    resend = new Resend(process.env.RESEND_API_KEY);
  }

  const FROM = process.env.EMAIL_FROM ?? "noreply@onboarding.resend.dev";
  const TO = process.env.EMAIL_TO ?? "bilgi@kismetplastik.com";

  const urgencyLabels: Record<string, string> = {
    normal: "Normal",
    urgent: "Acil",
    planned: "Planlı",
  };

  const html = `
    <h2>Yeni Numune Talebi</h2>
    <hr />
    <h3>Firma Bilgileri</h3>
    <p><strong>Ad Soyad:</strong> ${escapeHtml(data.name)}</p>
    <p><strong>Firma:</strong> ${escapeHtml(data.company)}</p>
    <p><strong>E-posta:</strong> ${escapeHtml(data.email)}</p>
    <p><strong>Telefon:</strong> ${escapeHtml(data.phone)}</p>
    ${data.address ? `<p><strong>Firma Adresi:</strong> ${escapeHtml(data.address)}</p>` : ""}
    <hr />
    <h3>Numune Bilgileri</h3>
    <p><strong>Seçilen Kategoriler:</strong> ${data.products.map(escapeHtml).join(", ")}</p>
    ${data.quantity ? `<p><strong>Tahmini Miktar:</strong> ${escapeHtml(data.quantity)}</p>` : ""}
    ${data.notes ? `<p><strong>Ek Notlar:</strong> ${escapeHtml(data.notes)}</p>` : ""}
    <hr />
    <h3>Teslimat Bilgileri</h3>
    ${data.deliveryAddress ? `<p><strong>Teslimat Adresi:</strong> ${escapeHtml(data.deliveryAddress)}</p>` : ""}
    <p><strong>Aciliyet:</strong> ${urgencyLabels[data.urgency] ?? data.urgency}</p>
    ${data.preferredDate ? `<p><strong>Tercih Edilen Tarih:</strong> ${escapeHtml(data.preferredDate)}</p>` : ""}
  `;

  if (!resend) {
    console.log("[Sample Request - no RESEND_API_KEY]", data);
    return { ok: true };
  }

  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to: TO,
      replyTo: data.email,
      subject: `Numune Talebi: ${data.company} - ${data.products.join(", ")}`,
      html,
    });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (e) {
    const err = e instanceof Error ? e.message : String(e);
    return { ok: false, error: err };
  }
}

/* ------------------------------------------------------------------ */
/*  POST handler                                                      */
/* ------------------------------------------------------------------ */
export async function POST(request: NextRequest) {
  try {
    /* Rate limiting */
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      "unknown";
    const { ok: allowed } = rateLimit(`sample-request:${ip}`, {
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

    /* Parse & validate */
    const body = await request.json();
    const parsed = sampleRequestSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message ?? "Geçersiz veri.";
      return NextResponse.json(
        { success: false, error: firstError },
        { status: 400 }
      );
    }

    /* Send email */
    const result = await sendSampleRequestEmail(parsed.data);

    if (!result.ok) {
      console.error("[Sample Request] Email failed:", result.error);
      return NextResponse.json(
        {
          success: false,
          error:
            "E-posta gönderilemedi. Lütfen tekrar deneyin veya doğrudan arayın.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "Numune talebiniz başarıyla alındı. En kısa sürede size dönüş yapacağız.",
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Bir hata oluştu. Lütfen tekrar deneyin." },
      { status: 500 }
    );
  }
}
