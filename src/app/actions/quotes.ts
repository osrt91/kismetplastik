"use server"

import { z } from "zod/v4"
import { createSupabaseServerClient } from "@/lib/supabase-server"

const quoteItemSchema = z.object({
  productId: z.string().uuid(),
  productName: z.string().min(1),
  quantity: z.number().int().positive(),
  notes: z.string().optional(),
})

const createQuoteSchema = z.object({
  companyName: z.string().min(1, "Firma adı zorunludur"),
  contactName: z.string().min(1, "İletişim kişisi zorunludur"),
  email: z.email("Geçerli bir e-posta adresi giriniz"),
  phone: z.string().optional(),
  message: z.string().optional(),
  items: z.array(quoteItemSchema).min(1, "En az bir ürün eklenmelidir"),
})

export type CreateQuoteInput = z.infer<typeof createQuoteSchema>

export type QuoteResult = {
  success: true
  quoteId: string
} | {
  success: false
  error: string
}

export async function createQuoteRequest(data: CreateQuoteInput): Promise<QuoteResult> {
  // Validate input
  const parsed = createQuoteSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message }
  }

  const supabase = await createSupabaseServerClient()
  const validData = parsed.data

  // Check if user is logged in (optional for quotes)
  const { data: { user } } = await supabase.auth.getUser()

  // Create quote request
  const { data: quote, error: quoteError } = await supabase
    .from("quote_requests")
    .insert({
      profile_id: user?.id || null,
      company_name: validData.companyName,
      contact_name: validData.contactName,
      email: validData.email,
      phone: validData.phone || null,
      message: validData.message || null,
      status: "pending",
    })
    .select("id")
    .single()

  if (quoteError || !quote) {
    return { success: false, error: "Teklif talebi oluşturulamadı." }
  }

  // Create quote items
  const quoteItems = validData.items.map((item) => ({
    quote_request_id: quote.id,
    product_id: item.productId,
    product_name: item.productName,
    quantity: item.quantity,
    notes: item.notes || null,
  }))

  const { error: itemsError } = await supabase
    .from("quote_items")
    .insert(quoteItems)

  if (itemsError) {
    return { success: false, error: "Teklif kalemleri eklenemedi." }
  }

  return {
    success: true,
    quoteId: quote.id,
  }
}
