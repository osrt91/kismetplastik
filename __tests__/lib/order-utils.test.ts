import { describe, it, expect } from "vitest"
import { generateB2BOrderNumber } from "@/lib/order-utils"

describe("generateB2BOrderNumber", () => {
  it("KP-YYMM-NNNN formatında üretir", () => {
    const result = generateB2BOrderNumber(1)
    expect(result).toMatch(/^KP-\d{4}-\d{4}$/)
  })

  it("belirtilen tarihe göre doğru yıl/ay kullanır", () => {
    const date = new Date(2026, 2, 15) // Mart 2026
    const result = generateB2BOrderNumber(42, date)
    expect(result).toBe("KP-2603-0042")
  })

  it("sequence'ı 4 haneye pad eder", () => {
    const date = new Date(2026, 0, 1) // Ocak 2026
    expect(generateB2BOrderNumber(1, date)).toBe("KP-2601-0001")
    expect(generateB2BOrderNumber(42, date)).toBe("KP-2601-0042")
    expect(generateB2BOrderNumber(999, date)).toBe("KP-2601-0999")
    expect(generateB2BOrderNumber(9999, date)).toBe("KP-2601-9999")
  })

  it("Ocak ayını 01 olarak formatlar", () => {
    const date = new Date(2026, 0, 1) // Ocak
    expect(generateB2BOrderNumber(1, date)).toContain("2601")
  })

  it("Aralık ayını 12 olarak formatlar", () => {
    const date = new Date(2026, 11, 1) // Aralık
    expect(generateB2BOrderNumber(1, date)).toContain("2612")
  })

  it("0 sequence için hata fırlatır", () => {
    expect(() => generateB2BOrderNumber(0)).toThrow("Sequence must be a positive integer")
  })

  it("negatif sequence için hata fırlatır", () => {
    expect(() => generateB2BOrderNumber(-5)).toThrow("Sequence must be a positive integer")
  })

  it("ondalıklı sequence için hata fırlatır", () => {
    expect(() => generateB2BOrderNumber(1.5)).toThrow("Sequence must be a positive integer")
  })

  it("9999'dan büyük sequence için hata fırlatır", () => {
    expect(() => generateB2BOrderNumber(10000)).toThrow("Sequence exceeds maximum value")
  })

  it("varsayılan olarak güncel tarihi kullanır", () => {
    const now = new Date()
    const yy = now.getFullYear().toString().slice(-2)
    const mm = (now.getMonth() + 1).toString().padStart(2, "0")
    const result = generateB2BOrderNumber(1)
    expect(result).toContain(`KP-${yy}${mm}-`)
  })
})
