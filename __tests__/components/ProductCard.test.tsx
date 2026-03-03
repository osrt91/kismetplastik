import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import type { Product } from "@/types/product"

// Mock LocaleContext
vi.mock("@/contexts/LocaleContext", () => ({
  useLocale: () => ({
    locale: "tr" as const,
    setLocale: vi.fn(),
    dict: {
      components: {
        featuredBadge: "Öne Çıkan",
        outOfStock: "Stokta Yok",
        viewDetails: "Detayları Gör",
        colors: "Renkler:",
        minOrderText: "Min. {count} adet",
        detail: "Detay",
      },
    },
  }),
}))

// Mock LocaleLink
vi.mock("@/components/ui/LocaleLink", () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode
    href: string
    [key: string]: unknown
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

// Import after mocks
const { default: ProductCard } = await import("@/components/ui/ProductCard")

const baseProduct: Product = {
  id: "1",
  slug: "pet-sise-500ml",
  name: "PET Şişe 500ml",
  category: "pet-siseler",
  description: "Test açıklama",
  shortDescription: "Şeffaf PET şişe, 500ml hacim",
  volume: "500ml",
  weight: "25g",
  neckDiameter: "28mm",
  material: "PET",
  colors: ["Şeffaf", "Mavi", "Yeşil"],
  minOrder: 5000,
  inStock: true,
  featured: false,
  specs: [],
}

describe("ProductCard", () => {
  it("ürün adını gösterir", () => {
    render(<ProductCard product={baseProduct} />)
    expect(screen.getByText("PET Şişe 500ml")).toBeInTheDocument()
  })

  it("kısa açıklamayı gösterir", () => {
    render(<ProductCard product={baseProduct} />)
    expect(screen.getByText("Şeffaf PET şişe, 500ml hacim")).toBeInTheDocument()
  })

  it("öne çıkan ürün badge'ini gösterir", () => {
    render(<ProductCard product={{ ...baseProduct, featured: true }} />)
    expect(screen.getByText("Öne Çıkan")).toBeInTheDocument()
  })

  it("featured=false olduğunda öne çıkan badge göstermez", () => {
    render(<ProductCard product={baseProduct} />)
    expect(screen.queryByText("Öne Çıkan")).not.toBeInTheDocument()
  })

  it("stokta yok badge'ini gösterir", () => {
    render(<ProductCard product={{ ...baseProduct, inStock: false }} />)
    expect(screen.getByText("Stokta Yok")).toBeInTheDocument()
  })

  it("stokta olan ürün için stokta yok badge göstermez", () => {
    render(<ProductCard product={baseProduct} />)
    expect(screen.queryByText("Stokta Yok")).not.toBeInTheDocument()
  })

  it("renk swatch'lerini gösterir", () => {
    const { container } = render(<ProductCard product={baseProduct} />)
    const swatches = container.querySelectorAll("span[title]")
    expect(swatches).toHaveLength(3) // Şeffaf, Mavi, Yeşil
  })

  it("5'ten fazla renk olduğunda +N gösterir", () => {
    const manyColors = ["Şeffaf", "Mavi", "Yeşil", "Amber", "Beyaz", "Siyah", "Kırmızı"]
    render(<ProductCard product={{ ...baseProduct, colors: manyColors }} />)
    expect(screen.getByText("+2")).toBeInTheDocument()
  })

  it("hacim spec'ini gösterir", () => {
    render(<ProductCard product={baseProduct} />)
    expect(screen.getByText("500ml")).toBeInTheDocument()
  })

  it("ağırlık spec'ini gösterir", () => {
    render(<ProductCard product={baseProduct} />)
    expect(screen.getByText("25g")).toBeInTheDocument()
  })

  it("boyun çapı spec'ini gösterir", () => {
    render(<ProductCard product={baseProduct} />)
    expect(screen.getByText("Ø28mm")).toBeInTheDocument()
  })

  it("minimum sipariş miktarını gösterir", () => {
    render(<ProductCard product={baseProduct} />)
    expect(screen.getByText("Min. 5.000 adet")).toBeInTheDocument()
  })

  it("doğru link href'i oluşturur", () => {
    const { container } = render(<ProductCard product={baseProduct} />)
    const link = container.querySelector("a")
    expect(link).toHaveAttribute(
      "href",
      "/urunler/pet-siseler/pet-sise-500ml"
    )
  })

  it("kategori badge'ini gösterir", () => {
    render(<ProductCard product={baseProduct} />)
    expect(screen.getByText("PET Şişeler")).toBeInTheDocument()
  })

  it("spec'leri olmayan ürünü render eder", () => {
    const noSpecProduct: Product = {
      ...baseProduct,
      volume: undefined,
      weight: undefined,
      neckDiameter: undefined,
    }
    const { container } = render(<ProductCard product={noSpecProduct} />)
    expect(container.querySelector("a")).toBeInTheDocument()
  })
})
