/**
 * Invoice HTML generation utility
 * Generates a printable HTML invoice that can be saved as PDF via browser print
 */

import { toIntlLocale } from "@/lib/locales";

export interface InvoiceLineItem {
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface InvoiceData {
  invoiceNumber: string;
  issuedAt: string;
  companyName: string;
  companyAddress: string | null;
  taxNumber: string | null;
  taxOffice: string | null;
  items: InvoiceLineItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  totalAmount: number;
  locale?: string;
}

function formatCurrency(amount: number, locale = "tr"): string {
  return new Intl.NumberFormat(toIntlLocale(locale), {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 2,
  }).format(amount);
}

function formatDate(dateStr: string, locale = "tr"): string {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat(toIntlLocale(locale), {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function generateInvoiceHTML(invoice: InvoiceData): string {
  const loc = invoice.locale || "tr";
  const itemRows = invoice.items
    .map(
      (item, index) => `
      <tr>
        <td style="padding: 10px 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${index + 1}</td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #e5e7eb;">${escapeHtml(item.productName)}</td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity.toLocaleString(toIntlLocale(loc))}</td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">${formatCurrency(item.unitPrice, loc)}</td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">${formatCurrency(item.totalPrice, loc)}</td>
      </tr>`
    )
    .join("\n");

  return `<!DOCTYPE html>
<html lang="${loc}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Fatura - ${escapeHtml(invoice.invoiceNumber)}</title>
  <style>
    @media print {
      body { margin: 0; padding: 20px; }
      .no-print { display: none !important; }
      @page { margin: 15mm; size: A4; }
    }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      color: #1a1a1a;
      line-height: 1.5;
      background: #fff;
      margin: 0;
      padding: 40px;
    }
    .invoice-container {
      max-width: 800px;
      margin: 0 auto;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 3px solid #002060;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .company-info h1 {
      font-size: 24px;
      color: #002060;
      margin: 0 0 4px 0;
    }
    .company-info p {
      margin: 2px 0;
      font-size: 13px;
      color: #555;
    }
    .invoice-title {
      text-align: right;
    }
    .invoice-title h2 {
      font-size: 28px;
      color: #002060;
      margin: 0 0 8px 0;
      text-transform: uppercase;
      letter-spacing: 2px;
    }
    .invoice-title .meta {
      font-size: 13px;
      color: #555;
    }
    .invoice-title .meta strong {
      color: #1a1a1a;
    }
    .parties {
      display: flex;
      justify-content: space-between;
      margin-bottom: 30px;
      gap: 40px;
    }
    .party {
      flex: 1;
    }
    .party h3 {
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #002060;
      margin: 0 0 8px 0;
      padding-bottom: 6px;
      border-bottom: 1px solid #e5e7eb;
    }
    .party p {
      margin: 3px 0;
      font-size: 14px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 30px;
    }
    thead th {
      background: #002060;
      color: #fff;
      padding: 10px 12px;
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    thead th:first-child { border-radius: 4px 0 0 0; }
    thead th:last-child { border-radius: 0 4px 0 0; }
    tbody td {
      font-size: 14px;
    }
    .totals {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 40px;
    }
    .totals-table {
      width: 300px;
    }
    .totals-table .row {
      display: flex;
      justify-content: space-between;
      padding: 6px 0;
      font-size: 14px;
    }
    .totals-table .row.grand-total {
      border-top: 2px solid #002060;
      margin-top: 4px;
      padding-top: 10px;
      font-size: 18px;
      font-weight: bold;
      color: #002060;
    }
    .footer {
      text-align: center;
      font-size: 12px;
      color: #888;
      border-top: 1px solid #e5e7eb;
      padding-top: 20px;
    }
    .print-btn {
      display: block;
      margin: 20px auto;
      padding: 12px 32px;
      background: #002060;
      color: #fff;
      border: none;
      border-radius: 6px;
      font-size: 15px;
      cursor: pointer;
    }
    .print-btn:hover {
      background: #001040;
    }
  </style>
</head>
<body>
  <div class="invoice-container">
    <div class="header">
      <div class="company-info">
        <h1>KISMET PLASTIK</h1>
        <p>Kozmetik Ambalaj Sanayi ve Ticaret A.Ş.</p>
        <p>Organize Sanayi Bölgesi, İstanbul / Türkiye</p>
        <p>Tel: +90 212 XXX XX XX</p>
        <p>info@kismetplastik.com</p>
      </div>
      <div class="invoice-title">
        <h2>Fatura</h2>
        <p class="meta"><strong>Fatura No:</strong> ${escapeHtml(invoice.invoiceNumber)}</p>
        <p class="meta"><strong>Tarih:</strong> ${formatDate(invoice.issuedAt, loc)}</p>
      </div>
    </div>

    <div class="parties">
      <div class="party">
        <h3>Fatura Edilen</h3>
        <p><strong>${escapeHtml(invoice.companyName)}</strong></p>
        ${invoice.companyAddress ? `<p>${escapeHtml(invoice.companyAddress)}</p>` : ""}
        ${invoice.taxOffice ? `<p>Vergi Dairesi: ${escapeHtml(invoice.taxOffice)}</p>` : ""}
        ${invoice.taxNumber ? `<p>Vergi No: ${escapeHtml(invoice.taxNumber)}</p>` : ""}
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th style="width: 50px; text-align: center;">#</th>
          <th style="text-align: left;">Ürün / Hizmet</th>
          <th style="width: 80px; text-align: center;">Miktar</th>
          <th style="width: 120px; text-align: right;">Birim Fiyat</th>
          <th style="width: 120px; text-align: right;">Toplam</th>
        </tr>
      </thead>
      <tbody>
        ${itemRows}
      </tbody>
    </table>

    <div class="totals">
      <div class="totals-table">
        <div class="row">
          <span>Ara Toplam:</span>
          <span>${formatCurrency(invoice.subtotal, loc)}</span>
        </div>
        <div class="row">
          <span>KDV (%${invoice.taxRate}):</span>
          <span>${formatCurrency(invoice.taxAmount, loc)}</span>
        </div>
        <div class="row grand-total">
          <span>Genel Toplam:</span>
          <span>${formatCurrency(invoice.totalAmount, loc)}</span>
        </div>
      </div>
    </div>

    <div class="footer">
      <p>Bu fatura elektronik ortamda oluşturulmuştur.</p>
      <p>Kısmet Plastik Kozmetik Ambalaj San. ve Tic. A.Ş.</p>
    </div>

    <button class="print-btn no-print" onclick="window.print()">Yazdır / PDF Olarak Kaydet</button>
  </div>
</body>
</html>`;
}
