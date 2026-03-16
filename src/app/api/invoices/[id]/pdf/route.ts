import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { generateInvoiceHTML, type InvoiceLineItem } from "@/lib/invoice-pdf";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await supabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Yetkilendirme gerekli." },
        { status: 401 }
      );
    }

    const { id } = await params;

    const { data: invoice, error } = await supabase
      .from("invoices")
      .select("*")
      .eq("id", id)
      .eq("profile_id", user.id)
      .single();

    if (error || !invoice) {
      return NextResponse.json(
        { success: false, error: "Fatura bulunamadı." },
        { status: 404 }
      );
    }

    // If a pre-generated PDF exists in storage, redirect to it
    if (invoice.pdf_url) {
      return NextResponse.redirect(invoice.pdf_url);
    }

    // Fetch related order and order items for PDF generation
    const { data: order } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .eq("id", invoice.order_id)
      .single();

    const items: InvoiceLineItem[] = (order?.order_items || []).map(
      (item: { product_name: string; quantity: number; unit_price: number; total_price: number }) => ({
        productName: item.product_name,
        quantity: item.quantity,
        unitPrice: item.unit_price,
        totalPrice: item.total_price,
      })
    );

    const locale = request.nextUrl.searchParams.get("locale") || "tr";

    const html = generateInvoiceHTML({
      invoiceNumber: invoice.invoice_number,
      issuedAt: invoice.issued_at,
      companyName: invoice.company_name,
      companyAddress: invoice.company_address || null,
      taxNumber: invoice.tax_number || null,
      taxOffice: invoice.tax_office || null,
      items,
      subtotal: invoice.subtotal,
      taxRate: invoice.tax_rate,
      taxAmount: invoice.tax_amount,
      totalAmount: invoice.total_amount,
      locale,
    });

    return new NextResponse(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Disposition": `inline; filename="fatura-${invoice.invoice_number}.html"`,
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Bir hata oluştu." },
      { status: 500 }
    );
  }
}
