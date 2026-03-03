import { describe, it, expect, vi, beforeEach } from "vitest"

// Mock Supabase
const mockInsert = vi.fn()
const mockSelect = vi.fn()
const mockSingle = vi.fn()
const mockEq = vi.fn()
const mockGetUser = vi.fn()

const mockFrom = vi.fn()

vi.mock("@/lib/supabase-server", () => ({
  createSupabaseServerClient: vi.fn(async () => ({
    from: mockFrom,
    auth: {
      getUser: mockGetUser,
    },
  })),
}))

const { createOrder } = await import("@/app/actions/orders")

const VALID_UUID = "550e8400-e29b-41d4-a716-446655440000"
const USER_ID = "770e8400-e29b-41d4-a716-446655440002"

const validOrderInput = {
  items: [
    {
      productId: VALID_UUID,
      productName: "PET Şişe 500ml",
      quantity: 1000,
      unitPrice: 3.5,
    },
  ],
  notes: "Acil teslimat",
}

beforeEach(() => {
  vi.clearAllMocks()

  // Default: authenticated user with approved profile
  mockGetUser.mockResolvedValue({
    data: { user: { id: USER_ID } },
    error: null,
  })

  // Default chain for profile query
  mockFrom.mockImplementation((table: string) => {
    if (table === "profiles") {
      return {
        select: () => ({
          eq: () => ({
            single: () =>
              Promise.resolve({
                data: { id: USER_ID, company_id: "company-1", is_approved: true },
                error: null,
              }),
          }),
        }),
      }
    }
    if (table === "orders") {
      return {
        insert: () => ({
          select: () => ({
            single: () =>
              Promise.resolve({
                data: { id: "order-1", order_number: "KP-2603-0001" },
                error: null,
              }),
          }),
        }),
      }
    }
    if (table === "order_items") {
      return {
        insert: () => Promise.resolve({ error: null }),
      }
    }
    if (table === "order_status_history") {
      return {
        insert: () => Promise.resolve({ error: null }),
      }
    }
    return { insert: () => Promise.resolve({ error: null }) }
  })
})

describe("createOrder", () => {
  it("başarılı sipariş oluşturur", async () => {
    const result = await createOrder(validOrderInput)

    expect(result).toEqual({
      success: true,
      orderId: "order-1",
      orderNumber: "KP-2603-0001",
    })
  })

  it("boş items array ile validation hatası döner", async () => {
    const result = await createOrder({ items: [] })

    expect(result).toEqual({
      success: false,
      error: expect.stringContaining("En az bir ürün"),
    })
  })

  it("geçersiz item yapısında validation hatası döner", async () => {
    const result = await createOrder({
      items: [
        {
          productId: "not-uuid",
          productName: "",
          quantity: -1,
          unitPrice: 0,
        },
      ],
    })

    expect(result).toEqual({
      success: false,
      error: expect.any(String),
    })
  })

  it("giriş yapmamış kullanıcı için auth hatası döner", async () => {
    mockGetUser.mockResolvedValue({
      data: { user: null },
      error: { message: "No session" },
    })

    const result = await createOrder(validOrderInput)

    expect(result).toEqual({
      success: false,
      error: expect.stringContaining("Yetkilendirme"),
    })
  })

  it("onaylanmamış hesap için hata döner", async () => {
    mockFrom.mockImplementation((table: string) => {
      if (table === "profiles") {
        return {
          select: () => ({
            eq: () => ({
              single: () =>
                Promise.resolve({
                  data: { id: USER_ID, company_id: "c1", is_approved: false },
                  error: null,
                }),
            }),
          }),
        }
      }
      return { insert: () => Promise.resolve({ error: null }) }
    })

    const result = await createOrder(validOrderInput)

    expect(result).toEqual({
      success: false,
      error: expect.stringContaining("onaylanmamış"),
    })
  })

  it("subtotal ve vergi doğru hesaplanır", async () => {
    // Track what's inserted to orders
    let insertedOrder: Record<string, unknown> = {}
    mockFrom.mockImplementation((table: string) => {
      if (table === "profiles") {
        return {
          select: () => ({
            eq: () => ({
              single: () =>
                Promise.resolve({
                  data: { id: USER_ID, company_id: "c1", is_approved: true },
                  error: null,
                }),
            }),
          }),
        }
      }
      if (table === "orders") {
        return {
          insert: (data: Record<string, unknown>) => {
            insertedOrder = data
            return {
              select: () => ({
                single: () =>
                  Promise.resolve({
                    data: { id: "order-1", order_number: "KP-2603-0001" },
                    error: null,
                  }),
              }),
            }
          },
        }
      }
      return { insert: () => Promise.resolve({ error: null }) }
    })

    await createOrder({
      items: [
        { productId: VALID_UUID, productName: "Ürün A", quantity: 100, unitPrice: 10 },
        { productId: VALID_UUID, productName: "Ürün B", quantity: 50, unitPrice: 20 },
      ],
    })

    // 100*10 + 50*20 = 2000 subtotal
    expect(insertedOrder.subtotal).toBe(2000)
    // %20 vergi = 400
    expect(insertedOrder.tax_amount).toBe(400)
    // Toplam = 2400
    expect(insertedOrder.total_amount).toBe(2400)
  })
})
