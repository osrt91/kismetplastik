import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { checkAuth } from "@/lib/auth";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM = process.env.EMAIL_FROM ?? "noreply@onboarding.resend.dev";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = checkAuth(request);
  if (authError) return authError;

  const { id } = await params;

  let body: { message?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Geçersiz JSON" },
      { status: 400 }
    );
  }

  const { message } = body;
  if (!message || typeof message !== "string" || !message.trim()) {
    return NextResponse.json(
      { success: false, error: "Yanıt mesajı boş olamaz" },
      { status: 400 }
    );
  }

  const supabase = getSupabaseAdmin();

  // Fetch the quote request to get customer email and info
  const { data: quote, error: fetchError } = await supabase
    .from("quote_requests")
    .select("id, email, contact_name, company_name")
    .eq("id", id)
    .single();

  if (fetchError || !quote) {
    return NextResponse.json(
      { success: false, error: "Teklif bulunamadı" },
      { status: 404 }
    );
  }

  // Send the email
  if (resend) {
    try {
      const { error: emailError } = await resend.emails.send({
        from: FROM,
        to: quote.email,
        subject: `Teklif Yanıtınız — Kısmet Plastik`,
        html: `
          <h2>Sayın ${escapeHtml(quote.contact_name)},</h2>
          <p>Kısmet Plastik olarak teklif talebinizi inceledik. Aşağıda yanıtımızı bulabilirsiniz:</p>
          <hr />
          <p>${escapeHtml(message).replace(/\n/g, "<br />")}</p>
          <hr />
          <p style="color:#666;font-size:12px;">
            Bu e-posta Kısmet Plastik admin panelinden gönderilmiştir.<br />
            Firma: ${escapeHtml(quote.company_name)}
          </p>
        `,
      });

      if (emailError) {
        console.error("[Admin Quotes Respond - email error]", emailError);
        return NextResponse.json(
          { success: false, error: `E-posta gönderilemedi: ${emailError.message}` },
          { status: 500 }
        );
      }
    } catch (e) {
      const err = e instanceof Error ? e.message : String(e);
      console.error("[Admin Quotes Respond - email exception]", err);
      return NextResponse.json(
        { success: false, error: `E-posta gönderilemedi: ${err}` },
        { status: 500 }
      );
    }
  } else {
    console.log("[Admin Quotes Respond - no RESEND_API_KEY] Would send to:", quote.email, message);
  }

  // Update quote status to "quoted" and store response_message
  const { data: updated, error: updateError } = await supabase
    .from("quote_requests")
    .update({
      status: "quoted",
      response_message: message.trim(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (updateError) {
    console.error("[Admin Quotes Respond - update error]", updateError);
    return NextResponse.json(
      { success: false, error: updateError.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, data: updated });
}
