import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/Card"

describe("Card", () => {
  it("default variant ile render eder", () => {
    const { container } = render(<Card>İçerik</Card>)
    const card = container.querySelector("[data-slot='card']")
    expect(card).toBeInTheDocument()
    expect(card).toHaveAttribute("data-variant", "default")
  })

  it("elevated variant ile render eder", () => {
    const { container } = render(<Card variant="elevated">İçerik</Card>)
    const card = container.querySelector("[data-slot='card']")
    expect(card).toHaveAttribute("data-variant", "elevated")
  })

  it("interactive variant cursor-pointer class'ı içerir", () => {
    const { container } = render(<Card variant="interactive">İçerik</Card>)
    const card = container.querySelector("[data-slot='card']")
    expect(card).toHaveAttribute("data-variant", "interactive")
    expect(card).toHaveClass("cursor-pointer")
  })

  it("ek className uygulanır", () => {
    const { container } = render(<Card className="my-custom-class">İçerik</Card>)
    const card = container.querySelector("[data-slot='card']")
    expect(card).toHaveClass("my-custom-class")
  })
})

describe("CardHeader", () => {
  it("data-slot='card-header' attribute'u ile render eder", () => {
    const { container } = render(<CardHeader>Başlık</CardHeader>)
    const header = container.querySelector("[data-slot='card-header']")
    expect(header).toBeInTheDocument()
  })
})

describe("CardTitle", () => {
  it("h3 elementi olarak render eder", () => {
    render(<CardTitle>Test Başlık</CardTitle>)
    const heading = screen.getByRole("heading", { level: 3 })
    expect(heading).toHaveTextContent("Test Başlık")
  })

  it("data-slot='card-title' attribute'u olur", () => {
    const { container } = render(<CardTitle>Başlık</CardTitle>)
    const title = container.querySelector("[data-slot='card-title']")
    expect(title).toBeInTheDocument()
  })
})

describe("CardDescription", () => {
  it("p elementi olarak render eder", () => {
    const { container } = render(<CardDescription>Açıklama</CardDescription>)
    const desc = container.querySelector("[data-slot='card-description']")
    expect(desc).toBeInTheDocument()
    expect(desc?.tagName).toBe("P")
    expect(desc).toHaveTextContent("Açıklama")
  })
})

describe("CardContent", () => {
  it("data-slot='card-content' ile render eder", () => {
    const { container } = render(<CardContent>İçerik</CardContent>)
    const content = container.querySelector("[data-slot='card-content']")
    expect(content).toBeInTheDocument()
  })
})

describe("CardFooter", () => {
  it("data-slot='card-footer' ile render eder", () => {
    const { container } = render(<CardFooter>Alt</CardFooter>)
    const footer = container.querySelector("[data-slot='card-footer']")
    expect(footer).toBeInTheDocument()
  })
})

describe("Card composition", () => {
  it("tüm alt bileşenlerle birlikte çalışır", () => {
    const { container } = render(
      <Card>
        <CardHeader>
          <CardTitle>Sipariş Özeti</CardTitle>
          <CardDescription>Son siparişleriniz</CardDescription>
        </CardHeader>
        <CardContent>
          <p>İçerik buraya gelir</p>
        </CardContent>
        <CardFooter>
          <button>Devam Et</button>
        </CardFooter>
      </Card>
    )

    expect(container.querySelector("[data-slot='card']")).toBeInTheDocument()
    expect(container.querySelector("[data-slot='card-header']")).toBeInTheDocument()
    expect(container.querySelector("[data-slot='card-title']")).toHaveTextContent("Sipariş Özeti")
    expect(container.querySelector("[data-slot='card-description']")).toHaveTextContent("Son siparişleriniz")
    expect(container.querySelector("[data-slot='card-content']")).toBeInTheDocument()
    expect(container.querySelector("[data-slot='card-footer']")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Devam Et" })).toBeInTheDocument()
  })
})
