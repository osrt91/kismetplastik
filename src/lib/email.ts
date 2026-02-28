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

type OrderStatus = "confirmed" | "production" | "shipping" | "delivered" | "cancelled";

interface OrderStatusEmailPayload {
  recipientEmail: string;
  recipientName: string;
  orderNumber: string;
  newStatus: OrderStatus;
  trackingNumber?: string;
}

const STATUS_MAP: Record<OrderStatus, { subject: string; label: string; message: string; color: string }> = {
  confirmed: {
    subject: "Siparişiniz Onaylandı",
    label: "Onaylandı",
    message: "Siparişiniz başarıyla onaylanmıştır ve en kısa sürede hazırlanacaktır.",
    color: "#16a34a",
  },
  production: {
    subject: "Siparişiniz Üretimde",
    label: "Üretimde",
    message: "Siparişiniz üretime alınmıştır. Üretim tamamlandığında bilgilendirileceksiniz.",
    color: "#d97706",
  },
  shipping: {
    subject: "Siparişiniz Kargoya Verildi",
    label: "Kargoda",
    message: "Siparişiniz kargoya verilmiştir.",
    color: "#2563eb",
  },
  delivered: {
    subject: "Siparişiniz Teslim Edildi",
    label: "Teslim Edildi",
    message: "Siparişiniz başarıyla teslim edilmiştir. Bizi tercih ettiğiniz için teşekkür ederiz.",
    color: "#16a34a",
  },
  cancelled: {
    subject: "Siparişiniz İptal Edildi",
    label: "İptal Edildi",
    message: "Siparişiniz iptal edilmiştir. Sorularınız için bizimle iletişime geçebilirsiniz.",
    color: "#dc2626",
  },
};

export async function sendOrderStatusEmail(
  payload: OrderStatusEmailPayload
): Promise<{ ok: boolean; error?: string }> {
  if (!resend) {
    console.log("[Order Status Email - no RESEND_API_KEY]", payload);
    return { ok: true };
  }

  const config = STATUS_MAP[payload.newStatus];
  if (!config) return { ok: false, error: "Unknown status" };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kismetplastik.com";
  const ordersUrl = `${siteUrl}/bayi/siparisler`;

  const trackingRow =
    payload.newStatus === "shipping" && payload.trackingNumber
      ? `<tr>
          <td style="padding:4px 0;font-size:14px;color:#666;">Takip No</td>
          <td style="padding:4px 0;font-size:14px;color:#1a1a1a;font-weight:600;text-align:right;">${escapeHtml(payload.trackingNumber)}</td>
        </tr>`
      : "";

  const html = `
<div style="max-width:600px;margin:0 auto;font-family:'Segoe UI',Arial,sans-serif;background:#f0f2f5;">
  <div style="background:#002060;padding:28px 24px;text-align:center;">
    <h1 style="color:#f2b300;margin:0;font-size:26px;font-weight:700;letter-spacing:0.5px;">Kısmet Plastik</h1>
  </div>
  <div style="padding:32px 28px;background:#ffffff;">
    <p style="font-size:16px;color:#1a1a1a;margin:0 0 8px;">Sayın <strong>${escapeHtml(payload.recipientName)}</strong>,</p>
    <p style="font-size:15px;color:#444;margin:0 0 28px;line-height:1.6;">${config.message}</p>
    <div style="background:#f8f9fb;border-left:4px solid ${config.color};padding:20px 24px;border-radius:0 8px 8px 0;margin:0 0 28px;">
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:4px 0;font-size:14px;color:#666;">Sipariş No</td>
          <td style="padding:4px 0;font-size:14px;color:#1a1a1a;font-weight:600;text-align:right;">#${escapeHtml(payload.orderNumber)}</td>
        </tr>
        <tr>
          <td style="padding:4px 0;font-size:14px;color:#666;">Durum</td>
          <td style="padding:4px 0;text-align:right;">
            <span style="display:inline-block;background:${config.color};color:#fff;padding:3px 14px;border-radius:12px;font-size:13px;font-weight:600;">${config.label}</span>
          </td>
        </tr>
        ${trackingRow}
      </table>
    </div>
    <div style="text-align:center;margin:0 0 8px;">
      <a href="${ordersUrl}" style="display:inline-block;background:#002060;color:#ffffff;text-decoration:none;padding:14px 36px;border-radius:6px;font-size:15px;font-weight:600;">Siparişlerinizi Görüntüleyin</a>
    </div>
  </div>
  <div style="background:#002060;padding:20px 24px;text-align:center;">
    <p style="color:rgba(255,255,255,0.6);margin:0;font-size:12px;">&copy; ${new Date().getFullYear()} Kısmet Plastik. Tüm hakları saklıdır.</p>
  </div>
</div>`;

  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to: payload.recipientEmail,
      subject: `${config.subject} - #${payload.orderNumber}`,
      html,
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
