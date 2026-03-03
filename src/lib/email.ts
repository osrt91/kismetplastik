import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM = process.env.EMAIL_FROM ?? "noreply@onboarding.resend.dev";
const TO = process.env.EMAIL_TO ?? "bilgi@kismetplastik.com";

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

export interface BulkQuoteProduct {
  productId: string;
  productName: string;
  category: string;
  quantity: number;
  notes: string;
}

export interface BulkQuotePayload {
  name: string;
  email: string;
  phone: string;
  company: string;
  message?: string;
  products: BulkQuoteProduct[];
}

export async function sendBulkQuoteEmail(data: BulkQuotePayload): Promise<{ ok: boolean; error?: string }> {
  if (!resend) {
    console.log("[Bulk Quote Request - no RESEND_API_KEY]", data);
    return { ok: true };
  }
  try {
    const productRows = data.products
      .map(
        (p) =>
          `<tr>
            <td style="padding:8px;border:1px solid #e5e7eb">${escapeHtml(p.productName)}</td>
            <td style="padding:8px;border:1px solid #e5e7eb">${escapeHtml(p.category)}</td>
            <td style="padding:8px;border:1px solid #e5e7eb;text-align:center">${p.quantity}</td>
            <td style="padding:8px;border:1px solid #e5e7eb">${p.notes ? escapeHtml(p.notes) : "-"}</td>
          </tr>`
      )
      .join("");

    const { error } = await resend.emails.send({
      from: FROM,
      to: TO,
      replyTo: data.email,
      subject: `Toplu Teklif Talebi: ${data.products.length} ürün - ${data.company}`,
      html: `
        <h2>Yeni toplu teklif talebi</h2>
        <p><strong>Ad Soyad:</strong> ${escapeHtml(data.name)}</p>
        <p><strong>E-posta:</strong> ${escapeHtml(data.email)}</p>
        <p><strong>Telefon:</strong> ${escapeHtml(data.phone)}</p>
        <p><strong>Firma:</strong> ${escapeHtml(data.company)}</p>
        ${data.message ? `<p><strong>Mesaj:</strong> ${escapeHtml(data.message)}</p>` : ""}
        <h3>Seçilen Ürünler (${data.products.length} adet)</h3>
        <table style="border-collapse:collapse;width:100%">
          <thead>
            <tr style="background:#0A1628;color:white">
              <th style="padding:8px;text-align:left">Ürün</th>
              <th style="padding:8px;text-align:left">Kategori</th>
              <th style="padding:8px;text-align:center">Miktar</th>
              <th style="padding:8px;text-align:left">Not</th>
            </tr>
          </thead>
          <tbody>${productRows}</tbody>
        </table>
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
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
