import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM = process.env.EMAIL_FROM ?? "noreply@onboarding.resend.dev";
const TO = process.env.EMAIL_TO ?? "info@kismetplastik.com";

export interface ContactPayload {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject: string;
  message: string;
}

export interface QuotePayload {
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

export async function sendContactEmail(data: ContactPayload): Promise<{ ok: boolean; error?: string }> {
  if (!resend) {
    console.log("[Contact Form - no RESEND_API_KEY]", data);
    return { ok: true };
  }
  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to: TO,
      replyTo: data.email,
      subject: `İletişim Formu: ${data.subject}`,
      html: `
        <h2>Yeni iletişim formu</h2>
        <p><strong>Ad Soyad:</strong> ${escapeHtml(data.name)}</p>
        <p><strong>E-posta:</strong> ${escapeHtml(data.email)}</p>
        ${data.phone ? `<p><strong>Telefon:</strong> ${escapeHtml(data.phone)}</p>` : ""}
        ${data.company ? `<p><strong>Firma:</strong> ${escapeHtml(data.company)}</p>` : ""}
        <p><strong>Konu:</strong> ${escapeHtml(data.subject)}</p>
        <p><strong>Mesaj:</strong></p>
        <p>${escapeHtml(data.message)}</p>
      `,
    });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (e) {
    const err = e instanceof Error ? e.message : String(e);
    return { ok: false, error: err };
  }
}

export async function sendQuoteEmail(data: QuotePayload): Promise<{ ok: boolean; error?: string }> {
  if (!resend) {
    console.log("[Quote Request - no RESEND_API_KEY]", data);
    return { ok: true };
  }
  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to: TO,
      replyTo: data.email,
      subject: `Teklif Talebi: ${data.category} - ${data.company}`,
      html: `
        <h2>Yeni teklif talebi</h2>
        <p><strong>Ad Soyad:</strong> ${escapeHtml(data.name)}</p>
        <p><strong>E-posta:</strong> ${escapeHtml(data.email)}</p>
        <p><strong>Telefon:</strong> ${escapeHtml(data.phone)}</p>
        <p><strong>Firma:</strong> ${escapeHtml(data.company)}</p>
        ${data.address ? `<p><strong>Adres:</strong> ${escapeHtml(data.address)}</p>` : ""}
        <p><strong>Kategori:</strong> ${escapeHtml(data.category)}</p>
        ${data.productInterest ? `<p><strong>Ürün:</strong> ${escapeHtml(data.productInterest)}</p>` : ""}
        ${data.quantity ? `<p><strong>Miktar:</strong> ${escapeHtml(data.quantity)}</p>` : ""}
        ${data.deliveryDate ? `<p><strong>Teslimat:</strong> ${escapeHtml(data.deliveryDate)}</p>` : ""}
        ${data.message ? `<p><strong>Not:</strong> ${escapeHtml(data.message)}</p>` : ""}
      `,
    });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (e) {
    const err = e instanceof Error ? e.message : String(e);
    return { ok: false, error: err };
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
