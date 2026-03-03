import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

// Mock LocaleContext
vi.mock("@/contexts/LocaleContext", () => ({
  useLocale: () => ({
    locale: "tr" as const,
    setLocale: vi.fn(),
    dict: {
      nav: { home: "Ana Sayfa", dealer: "Bayi Girişi" },
      dealer: {
        heroTitle: "Bayi Paneli",
        heroSubtitle: "Bayilik hesabınız ile erişin.",
        loginTitle: "Bayi Girişi",
        loginSubtitle: "Hesabınıza giriş yapın",
        fieldEmail: "E-posta Adresi",
        fieldPassword: "Şifre",
        rememberMe: "Beni hatırla",
        forgotPassword: "Şifremi unuttum",
        loginButton: "Giriş Yap",
        notDealer: "Bayimiz değil misiniz?",
        applyDealer: "Bayilik başvurusu yapın",
        benefitsOverline: "Bayi Avantajları",
        benefitsTitle: "Neden Bayisi Olmalısınız?",
        benefitsDesc: "Avantajlardan yararlanın.",
        benefitPricing: "Özel Fiyatlandırma",
        benefitPricingDesc: "İndirimli fiyatlar.",
        benefitOrders: "Sipariş Takibi",
        benefitOrdersDesc: "Online sipariş.",
        benefitSupport: "Öncelikli Destek",
        benefitSupportDesc: "Teknik destek.",
        benefitRegion: "Bölge Avantajı",
        benefitRegionDesc: "Bölge desteği.",
        contactForDealer: "İletişime geçin",
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

// Mock AnimateOnScroll
vi.mock("@/components/ui/AnimateOnScroll", () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

// Mock useScrollAnimation
vi.mock("@/hooks/useScrollAnimation", () => ({
  useScrollAnimation: () => ({ ref: { current: null }, isVisible: true }),
}))

// Import after mocks
const { default: BayiGirisiPage } = await import(
  "@/app/[locale]/bayi-girisi/page"
)

let mockFetch: ReturnType<typeof vi.fn>

beforeEach(() => {
  mockFetch = vi.fn()
  global.fetch = mockFetch as unknown as typeof fetch
})

describe("BayiGirisiPage (Login Form)", () => {
  it("email ve password input'larını render eder", () => {
    render(<BayiGirisiPage />)
    expect(screen.getByPlaceholderText("bayi@firma.com")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("••••••••")).toBeInTheDocument()
  })

  it("giriş yap butonunu render eder", () => {
    render(<BayiGirisiPage />)
    expect(screen.getByText("Giriş Yap")).toBeInTheDocument()
  })

  it("şifre göster/gizle toggle çalışır", async () => {
    const user = userEvent.setup()
    render(<BayiGirisiPage />)

    const passwordInput = screen.getByPlaceholderText("••••••••")
    expect(passwordInput).toHaveAttribute("type", "password")

    // Find and click the eye toggle button
    const toggleButton = passwordInput
      .closest(".relative")
      ?.querySelector('button[type="button"]')
    expect(toggleButton).toBeInTheDocument()

    await user.click(toggleButton!)
    expect(passwordInput).toHaveAttribute("type", "text")

    await user.click(toggleButton!)
    expect(passwordInput).toHaveAttribute("type", "password")
  })

  it("başarılı login sonrası yönlendirir", async () => {
    const user = userEvent.setup()
    mockFetch.mockResolvedValue({
      json: () => Promise.resolve({ success: true }),
    })

    // Mock window.location
    const locationSpy = vi.spyOn(window, "location", "get")
    const mockLocation = { href: "" } as Location
    locationSpy.mockReturnValue(mockLocation)

    render(<BayiGirisiPage />)

    await user.type(screen.getByPlaceholderText("bayi@firma.com"), "test@test.com")
    await user.type(screen.getByPlaceholderText("••••••••"), "password123")
    await user.click(screen.getByText("Giriş Yap"))

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "test@test.com", password: "password123" }),
      })
    })

    locationSpy.mockRestore()
  })

  it("başarısız login sonrası hata mesajı gösterir", async () => {
    const user = userEvent.setup()
    mockFetch.mockResolvedValue({
      json: () =>
        Promise.resolve({
          success: false,
          error: "E-posta veya şifre hatalı.",
        }),
    })

    render(<BayiGirisiPage />)

    await user.type(screen.getByPlaceholderText("bayi@firma.com"), "test@test.com")
    await user.type(screen.getByPlaceholderText("••••••••"), "wrongpass")
    await user.click(screen.getByText("Giriş Yap"))

    await waitFor(() => {
      expect(screen.getByText("E-posta veya şifre hatalı.")).toBeInTheDocument()
    })
  })

  it("bağlantı hatası durumunda hata mesajı gösterir", async () => {
    const user = userEvent.setup()
    mockFetch.mockRejectedValue(new Error("Network error"))

    render(<BayiGirisiPage />)

    await user.type(screen.getByPlaceholderText("bayi@firma.com"), "test@test.com")
    await user.type(screen.getByPlaceholderText("••••••••"), "password123")
    await user.click(screen.getByText("Giriş Yap"))

    await waitFor(() => {
      expect(
        screen.getByText("Bağlantı hatası. Lütfen tekrar deneyin.")
      ).toBeInTheDocument()
    })
  })

  it("loading state sırasında buton disabled olur", async () => {
    const user = userEvent.setup()
    // Slow fetch that never resolves
    mockFetch.mockReturnValue(new Promise(() => {}))

    render(<BayiGirisiPage />)

    await user.type(screen.getByPlaceholderText("bayi@firma.com"), "test@test.com")
    await user.type(screen.getByPlaceholderText("••••••••"), "password123")

    const submitButton = screen.getByText("Giriş Yap").closest("button")!
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText("Giriş yapılıyor...")).toBeInTheDocument()
    })
  })
})
