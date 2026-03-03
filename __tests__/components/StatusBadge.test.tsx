import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { StatusBadge, type OrderStatus } from "@/components/ui/StatusBadge"

const allStatuses: { status: OrderStatus; label: string }[] = [
  { status: "pending", label: "Beklemede" },
  { status: "confirmed", label: "Onaylandı" },
  { status: "processing", label: "Hazırlanıyor" },
  { status: "shipped", label: "Kargoda" },
  { status: "delivered", label: "Teslim Edildi" },
  { status: "cancelled", label: "İptal Edildi" },
]

describe("StatusBadge", () => {
  allStatuses.forEach(({ status, label }) => {
    it(`"${status}" durumu için "${label}" metnini gösterir`, () => {
      render(<StatusBadge status={status} />)
      expect(screen.getByText(label)).toBeInTheDocument()
    })
  })

  allStatuses.forEach(({ status }) => {
    it(`"${status}" durumu için doğru data-status attribute'u olur`, () => {
      const { container } = render(<StatusBadge status={status} />)
      const badge = container.querySelector("[data-slot='status-badge']")
      expect(badge).toHaveAttribute("data-status", status)
    })
  })

  it("custom label verildiğinde varsayılan yerine onu gösterir", () => {
    render(<StatusBadge status="pending" label="Özel Durum" />)
    expect(screen.getByText("Özel Durum")).toBeInTheDocument()
    expect(screen.queryByText("Beklemede")).not.toBeInTheDocument()
  })

  it("status dot span'ı render eder", () => {
    const { container } = render(<StatusBadge status="confirmed" />)
    const dot = container.querySelector(".size-1\\.5")
    expect(dot).toBeInTheDocument()
  })

  it("ek className uygulanır", () => {
    const { container } = render(
      <StatusBadge status="pending" className="test-custom-class" />
    )
    const badge = container.querySelector("[data-slot='status-badge']")
    expect(badge).toHaveClass("test-custom-class")
  })

  it("inline-flex ve rounded-full class'ları her zaman bulunur", () => {
    const { container } = render(<StatusBadge status="delivered" />)
    const badge = container.querySelector("[data-slot='status-badge']")
    expect(badge).toHaveClass("inline-flex")
    expect(badge).toHaveClass("rounded-full")
  })
})
