import { NextRequest, NextResponse } from "next/server";
import { sendQuoteEmail } from "@/lib/email";
import { getSupabase } from "@/lib/supabase";
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

/**
 * Build a combined message string from the form data.
 * The quote_requests table has a single `message` TEXT column,
 * so we pack category, product interest, quantity, delivery date,
 * address, and user message into one structured string.
 */
function buildMessage(data: QuoteFormData): string {
  const parts: string[] = [];
  parts.push(`Kategori: ${data.category}`);
  if (data.productInterest?.trim()) parts.push(`Ürün: ${data.productInterest.trim()}`);
  if (data.quantity?.trim()) parts.push(`Miktar: ${data.quantity.trim()}`);
  if (data.deliveryDate?.trim()) parts.push(`Teslimat: ${data.deliveryDate.trim()}`);
  if (data.address?.trim()) parts.push(`Adres: ${data.address.trim()}`);
  if (data.message?.trim()) parts.push(`Not: ${data.message.trim()}`);
  return parts.join("\n");
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

    // Store in Supabase first — this is the source of truth
    const supabase = getSupabase();
    const { error: dbError } = await supabase.from("quote_requests").insert({
      company_name: body.company.trim(),
      contact_name: body.name.trim(),
      email: body.email.trim(),
      phone: body.phone.trim(),
      message: buildMessage(body),
      status: "pending",
    });

    if (dbError) {
      console.error("[Quote Request] DB insert failed:", dbError);
      return NextResponse.json(
        { success: false, error: "Teklif talebi kaydedilemedi. Lütfen tekrar deneyin veya doğrudan arayın." },
        { status: 500 }
      );
    }

    // Send notification email — best-effort, do not fail the request
    try {
      const result = await sendQuoteEmail(body);
      if (!result.ok) {
        console.warn("[Quote Request] Email send failed (data saved):", result.error);
      }
    } catch (emailErr) {
      console.warn("[Quote Request] Email exception (data saved):", emailErr);
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
