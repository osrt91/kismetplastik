"use server"

import { z } from "zod/v4"
import { createSupabaseServerClient } from "@/lib/supabase-server"

const addressSchema = z.object({
  fullName: z.string().min(1),
  address: z.string().min(1),
  city: z.string().min(1),
  district: z.string().optional(),
  postalCode: z.string().optional(),
  phone: z.string().optional(),
})

const orderItemSchema = z.object({
  productId: z.string().uuid(),
  productName: z.string().min(1),
  quantity: z.number().int().positive(),
  unitPrice: z.number().positive(),
})

const createOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1, "En az bir ürün eklenmelidir"),
  shippingAddress: addressSchema.optional(),
  billingAddress: addressSchema.optional(),
  notes: z.string().optional(),
})

export type CreateOrderInput = z.infer<typeof createOrderSchema>

export type OrderResult = {
  success: true
  orderId: string
  orderNumber: string
} | {
  success: false
  error: string
}

export async function createOrder(data: CreateOrderInput): Promise<OrderResult> {
  // Validate input
  const parsed = createOrderSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message }
  }

  const supabase = await createSupabaseServerClient()

  // Auth check
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { success: false, error: "Yetkilendirme hatası. Lütfen giriş yapın." }
  }

  // Get user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, company_id, is_approved")
    .eq("id", user.id)
    .single()

  if (!profile || !profile.is_approved) {
    return { success: false, error: "Hesabınız henüz onaylanmamış." }
  }

  const validData = parsed.data

  // Calculate totals
  const subtotal = validData.items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  )
  const taxRate = 0.2
  const taxAmount = subtotal * taxRate
  const totalAmount = subtotal + taxAmount

  // Create order
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      profile_id: user.id,
      status: "pending",
      subtotal,
      tax_amount: taxAmount,
      total_amount: totalAmount,
      shipping_address: validData.shippingAddress || null,
      billing_address: validData.billingAddress || null,
      notes: validData.notes || null,
      payment_status: "pending",
    })
    .select("id, order_number")
    .single()

  if (orderError || !order) {
    return { success: false, error: "Sipariş oluşturulamadı. Lütfen tekrar deneyin." }
  }

  // Create order items
  const orderItems = validData.items.map((item) => ({
    order_id: order.id,
    product_id: item.productId,
    product_name: item.productName,
    quantity: item.quantity,
    unit_price: item.unitPrice,
    total_price: item.unitPrice * item.quantity,
  }))

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems)

  if (itemsError) {
    return { success: false, error: "Sipariş kalemleri eklenemedi." }
  }

  // Add status history
  await supabase.from("order_status_history").insert({
    order_id: order.id,
    old_status: null,
    new_status: "pending",
    changed_by: user.id,
    note: "Sipariş oluşturuldu",
  })

  return {
    success: true,
    orderId: order.id,
    orderNumber: order.order_number,
  }
}
