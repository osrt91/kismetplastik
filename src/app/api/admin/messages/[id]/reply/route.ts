import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getSupabaseAdmin, requireSupabase } from "@/lib/supabase-admin";
import { checkAuth } from "@/lib/auth";
import { escapeHtml } from "@/lib/utils";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = checkAuth(request);
  if (authError) return authError;

  const sbError = requireSupabase();
  if (sbError) return sbError;

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

  const replyMessage = body.message?.trim();
  if (!replyMessage) {
    return NextResponse.json(
      { success: false, error: "Yanıt mesajı boş olamaz" },
      { status: 400 }
    );
  }

  try {
    const supabase = getSupabaseAdmin();

    // Fetch the original message to get recipient email and subject
    const { data: message, error: fetchError } = await supabase
      .from("contact_messages")
      .select("id, name, email, subject")
      .eq("id", id)
      .single();

    if (fetchError || !message) {
      return NextResponse.json(
        { success: false, error: "Mesaj bulunamadı" },
        { status: 404 }
      );
    }

    const resend = process.env.RESEND_API_KEY
      ? new Resend(process.env.RESEND_API_KEY)
      : null;

    const FROM = process.env.EMAIL_FROM ?? "noreply@onboarding.resend.dev";

    if (!resend) {
      console.warn("[Admin Messages Reply - no RESEND_API_KEY]", {
        to: message.email,
        subject: `Re: ${message.subject}`,
        message: replyMessage,
      });
    } else {
      const { error: emailError } = await resend.emails.send({
        from: FROM,
        to: message.email,
        subject: `Re: ${escapeHtml(message.subject)}`,
        html: `
          <p>Sayın ${escapeHtml(message.name)},</p>
          <p>${escapeHtml(replyMessage).replace(/\n/g, "<br/>")}</p>
          <br/>
          <p>Saygılarımızla,<br/>Kısmet Plastik</p>
        `,
      });

      if (emailError) {
        console.error("[Admin Messages Reply - email error]", emailError);
        return NextResponse.json(
          { success: false, error: `E-posta gönderilemedi: ${emailError.message}` },
          { status: 500 }
        );
      }
    }

    // Update the message record with reply info
    const now = new Date().toISOString();
    const { data, error: updateError } = await supabase
      .from("contact_messages")
      .update({
        status: "replied",
        reply_message: replyMessage,
        replied_at: now,
      })
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      console.error("[Admin Messages Reply - update error]", updateError);
      return NextResponse.json(
        { success: false, error: "Durum güncellenemedi" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Yanıt gönderildi",
      data,
    });
  } catch (err) {
    console.error("[Admin Messages Reply]", err);
    return NextResponse.json(
      { success: false, error: "Sunucu hatası" },
      { status: 500 }
    );
  }
}
