# CLAUDE.md — Kısmet Plastik B2B Web App

## Project Overview

Kısmet Plastik is a **B2B cosmetic packaging** company website and dealer portal built with **Next.js 16** (App Router). The site supports **11 locales** (Turkish primary, English secondary, + ar, ru, fr, de, es, zh, ja, ko, pt via Google Translate API). Self-hosted on a **Hostinger VPS** (Ubuntu 24.04) with **self-hosted Supabase** (Docker), and also packaged as an Android TWA for the Google Play Store. **Vercel is not used.**

**Production URL:** `https://www.kismetplastik.com`

## Codebase Overview

Next.js 16 App Router application with ~334 source files across 30+ locale-scoped pages (11 locales), 81 API route handlers, a 20+ module admin panel, and a dealer B2B portal. Data is served from Supabase PostgreSQL (30+ tables with RLS) — all content is admin-managed via CMS. Two auth systems coexist: cookie-based admin auth (timing-safe) and Supabase Auth for dealers. DIA ERP integration provides stock/customer sync. Locale configuration is centralized in `src/lib/locales.ts`.

**Key modules:** `src/lib/` (20+ utilities incl. `locales.ts` SSOT, DIA client, Halkbank POS, invoice PDF), `src/components/` (73+ components), `src/app/api/` (81 route handlers across 8 functional areas), `src/app/admin/` (34 files, 20+ management modules), `src/data/` (2 data modules — products, blog).

For detailed architecture, module guide, data flow diagrams, and navigation guide, see [docs/CODEBASE_MAP.md](docs/CODEBASE_MAP.md).

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16.1.6 (App Router, React 19, Webpack dev) |
| Language | TypeScript 5 (strict mode) |
| Styling | Tailwind CSS 4, CSS custom properties, `tw-animate-css` |
| Components | shadcn/ui (new-york style, Radix UI primitives) |
| State | Zustand 5 (client state), Zod 3 (validation) |
| Database | Self-hosted Supabase (PostgreSQL with RLS, Docker on VPS) |
| Auth | Supabase Auth (dealers) + cookie-based admin token |
| Email | Resend |
| Notifications | Sonner (toast notifications) |
| AI | OpenAI (chatbot, currently disabled) |
| 3D | Three.js / React Three Fiber + Drei |
| Animations | Framer Motion, CSS scroll-driven animations |
| Icons | Lucide React, Phosphor Icons, React Icons |
| Testing | Playwright (E2E), ESLint (linting) |
| Deployment | Hostinger VPS (PM2 + Docker + Traefik) + Android TWA (Bubblewrap) |

## Quick Commands

```bash
npm run dev          # Start development server (Webpack)
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint (eslint src/)
npm run test:e2e     # Run Playwright E2E tests
npm run test:e2e:ui  # Playwright E2E with UI mode
```

E2E tests via Playwright (4 specs: homepage, admin-login, navigation, seo). No unit/integration tests.

## Project Structure

```
├── docs/                    # Supabase SQL migration files
│   ├── supabase-schema.sql          # Initial schema (categories, products, blog_posts)
│   ├── supabase-migration-002.sql   # B2B portal (profiles, orders, quotes)
│   └── supabase-migration-003.sql   # Gallery system
├── public/                  # Static assets
│   ├── fonts/               # Myriad Pro (woff2 + fallbacks)
│   ├── sertifikalar/        # ISO certificate PDFs
│   ├── .well-known/         # Android asset links (TWA)
│   ├── manifest.json        # PWA manifest
│   └── sw.js                # Service worker
├── scripts/
│   └── import-data.mjs      # Seed script for Supabase data
├── src/
│   ├── app/
│   │   ├── layout.tsx       # Root layout (minimal wrapper)
│   │   ├── globals.css      # Global styles, CSS variables, animations
│   │   ├── sitemap.ts       # Dynamic sitemap generation
│   │   ├── robots.ts        # Robots.txt generation
│   │   ├── [locale]/        # Locale-scoped pages (11 locales)
│   │   │   ├── (public)/    # Public pages (Header+Footer layout)
│   │   │   ├── (portal)/    # B2B portal pages (Sidebar layout, auth required)
│   │   │   └── (auth)/      # Auth pages (minimal centered layout)
│   │   ├── admin/           # Admin panel (Turkish-only, 20+ modules)
│   │   └── api/             # API routes (81 handlers)
│   ├── components/
│   │   ├── layout/          # Header, Footer
│   │   ├── sections/        # Homepage sections (Hero, Categories, Stats, etc.)
│   │   ├── pages/           # Client-side page components (BlogDetail, Category, ProductDetail)
│   │   ├── portal/          # B2B portal-specific components
│   │   ├── public/          # Public page components
│   │   ├── shared/          # Shared components (used by both public and portal)
│   │   ├── analytics/       # Analytics components (WebVitals)
│   │   ├── seo/             # JSON-LD structured data
│   │   └── ui/              # Reusable UI components (shadcn/ui + custom)
│   ├── contexts/            # React Context providers (Locale, Theme)
│   ├── data/                # Static/seed data (products, blog)
│   ├── hooks/               # Custom hooks (useRecentProducts, useScrollAnimation)
│   ├── lib/                 # Utility modules (20+ files)
│   │   ├── supabase.ts          # Singleton Supabase client (general)
│   │   ├── supabase-browser.ts  # Browser-side SSR client
│   │   ├── supabase-server.ts   # Server-side SSR client (async cookies)
│   │   ├── supabase-admin.ts    # Admin client variant
│   │   ├── auth.ts              # Admin auth helpers, timing-safe compare
│   │   ├── email.ts             # Resend email service
│   │   ├── i18n.ts              # Dictionary-based i18n
│   │   ├── locales.ts           # SSOT: 11 locales, names, directions
│   │   ├── content.ts           # CMS content fetchers (getSettings, getPageContent)
│   │   ├── translate.ts         # Google Translate API wrapper
│   │   ├── dia-client.ts        # DIA ERP API client
│   │   ├── dia-services.ts      # DIA business logic (stock/customer sync)
│   │   ├── dia-cache.ts         # DIA caching layer
│   │   ├── halkbank-pos.ts      # Halkbank payment integration
│   │   ├── invoice-pdf.ts       # Invoice PDF generation
│   │   ├── product-i18n.ts      # Product translation helpers
│   │   ├── rate-limit.ts        # In-memory rate limiting
│   │   └── utils.ts             # cn() class merge utility
│   ├── locales/             # Translation JSON files (tr.json, en.json)
│   ├── types/               # TypeScript type definitions
│   │   ├── database.ts          # Supabase DB row types
│   │   └── product.ts           # Product/category/filter types
│   └── proxy.ts             # Next.js 16 middleware (locale routing + admin guard)
├── twa/                     # Android TWA config and deployment guide
└── components.json          # shadcn/ui configuration
```

## Architecture & Key Patterns

### Routing & i18n

- Uses **Next.js App Router** with a `[locale]` dynamic segment: `/[locale]/urunler`, `/[locale]/blog`, etc.
- Supported locales: 11 total (`tr`, `en`, `ar`, `ru`, `fr`, `de`, `es`, `zh`, `ja`, `ko`, `pt`) — SSOT in `src/lib/locales.ts`
- Middleware in `src/proxy.ts` redirects bare URLs to `/tr/...` and protects `/admin/*` routes
- i18n uses a **dictionary-based approach** (no i18next): `src/lib/i18n.ts` loads `src/locales/tr.json` or `en.json`
- Access translations via the `useLocale()` hook which returns `{ locale, dict, setLocale }`
- Use `LocaleLink` component (`src/components/ui/LocaleLink.tsx`) for locale-aware navigation

### Import Path Alias

- `@/*` maps to `./src/*` (configured in tsconfig.json)
- Always use `@/` imports, never relative `../` imports across directories

### Component Patterns

- **Server Components** are the default; use `"use client"` only when needed
- **Dynamic imports** for non-critical UI: WhatsAppButton, ScrollToTop, CookieBanner, InstallPrompt
- **shadcn/ui** components live in `src/components/ui/` (button, badge, input, dialog, sheet, select, etc.)
- Custom components use the same directory; shadcn components are lowercase (`button.tsx`), custom are PascalCase (`ProductCard.tsx`)
- Sections for the homepage are in `src/components/sections/`
- Page-level client components are in `src/components/pages/`

### Styling Conventions

- **Tailwind CSS 4** with CSS custom properties defined in `globals.css`
- Brand colors: primary palette (blues, `--primary-900: #002060`), accent (gold, `--accent-500: #f2b300`)
- Dark mode via `.dark` class and `data-theme="dark"` attribute on `<html>`
- Use `cn()` from `@/lib/utils` to merge Tailwind classes
- Custom font: Myriad Pro (woff2) loaded via `@font-face` in globals.css
- Custom CSS classes: `.glass` (glassmorphism), `.card-border-gradient`, `.scroll-progress-bar`
- Respects `prefers-reduced-motion` — animations are disabled when user prefers reduced motion

### Supabase Integration

- Three client variants depending on context:
  - `src/lib/supabase.ts` — singleton, general use (no auth persistence)
  - `src/lib/supabase-browser.ts` — browser client with SSR cookie support
  - `src/lib/supabase-server.ts` — server client with async cookie handling
- DB schema defined in `docs/supabase-schema.sql` + migration files
- Core tables: `categories`, `products`, `blog_posts`, `profiles`, `orders`, `quote_requests`, `gallery_images`
- All public data uses RLS policies for read-only access
- Remote image patterns: `**.supabase.co/storage/v1/object/public/**`
- **Self-hosted**: Supabase runs as 8 Docker containers on Hostinger VPS (not Supabase Cloud)

### Authentication

- **Admin panel**: cookie-based (`admin-token`) checked via `src/proxy.ts` middleware and `src/lib/auth.ts`
- **Dealer/Customer**: Supabase Auth with role-based profiles (admin, dealer, customer)
- Admin login: POST to `/api/admin/auth` with password, sets httpOnly cookie
- Timing-safe comparison used for all token checks

### API Routes

All API routes are in `src/app/api/`:

| Route | Purpose |
|-------|---------|
| `/api/contact` | Contact form (rate-limited, validates, sends via Resend) |
| `/api/quote` | Quote request form |
| `/api/quotes` | Quote listing (dealer portal) |
| `/api/orders/*` | Order CRUD |
| `/api/gallery/*` | Gallery image management |
| `/api/chat` | AI chatbot endpoint (OpenAI) |
| `/api/auth/login` | Dealer/customer login |
| `/api/auth/register` | Dealer/customer registration |
| `/api/admin/auth` | Admin login/logout |
| `/api/admin/products/*` | Admin product CRUD |
| `/api/admin/blog/*` | Admin blog CRUD |

API conventions:
- Return `{ success: true/false, error?: string, message?: string }`
- Rate limiting via `src/lib/rate-limit.ts` on public form endpoints
- HTML content is escaped with `escapeHtml()` before including in emails
- Input validation is done inline in each route handler

### Pages (Turkish URL Slugs)

Pages use Turkish URL paths:
- `/urunler` — Products listing
- `/urunler/[category]/[slug]` — Product detail
- `/hakkimizda` — About
- `/kalite` — Quality
- `/uretim` — Production
- `/iletisim` — Contact
- `/teklif-al` — Quote request
- `/katalog` — Catalog
- `/blog` — Blog
- `/sss` — FAQ
- `/kariyer` — Career
- `/bayi-girisi` — Dealer login
- `/bayi-panel` — Dealer dashboard
- `/galeri` — Gallery
- `/sektorler` — Sectors
- `/fuarlar` — Trade fairs
- `/surdurulebilirlik` — Sustainability
- `/ambalaj-sozlugu` — Packaging glossary
- `/kvkk` — Privacy/KVKK
- `/vizyon-misyon` — Vision & Mission
- `/referanslar` — References
- `/arge` — R&D
- `/numune-talep` — Sample request
- `/urun-olustur` — Product builder

### Product Categories (8 total)

1. `pet-siseler` — PET Bottles
2. `plastik-siseler` — Plastic Bottles (HDPE, PP, LDPE)
3. `kapaklar` — Caps
4. `tipalar` — Stoppers
5. `parmak-spreyler` — Finger Sprays
6. `pompalar` — Pumps
7. `tetikli-pusturtuculer` — Trigger Sprayers
8. `huniler` — Funnels

## Environment Variables

Copy `.env.example` to `.env.local`:

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Self-hosted Supabase URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase service role key (server-side admin ops) |
| `ADMIN_SECRET` | Yes | Admin password (min 32 chars) |
| `NEXT_PUBLIC_BASE_URL` | Yes | Site URL (e.g. `https://www.kismetplastik.com`) |
| `RESEND_API_KEY` | No | Resend email API key (forms log to console without it) |
| `EMAIL_FROM` | No | Sender email address |
| `EMAIL_TO` | No | Recipient email (default: bilgi@kismetplastik.com) |
| `OPENAI_API_KEY` | No | OpenAI API key for chatbot |
| `NEXT_PUBLIC_GA_ID` | No | Google Analytics ID |
| `GOOGLE_TRANSLATE_API_KEY` | No | Google Translate API v2 (auto-translate 9 locales) |
| `DIA_API_URL` | No | DIA ERP API endpoint |
| `DIA_USERNAME` | No | DIA ERP username |
| `DIA_PASSWORD` | No | DIA ERP password |
| `DIA_FIRMA_KODU` | No | DIA company code |
| `DIA_DONEM_KODU` | No | DIA period code |
| `HALKBANK_MERCHANT_ID` | No | Halkbank POS merchant ID |
| `HALKBANK_STORE_KEY` | No | Halkbank POS store key |
| `HALKBANK_TERMINAL_ID` | No | Halkbank POS terminal ID |
| `CRON_SECRET` | No | Secret for scheduled cron endpoints |

## Security

- Security headers configured in `next.config.ts` (X-Frame-Options, CSP-related, etc.)
- `poweredByHeader: false` in Next.js config
- Timing-safe string comparison for auth tokens (`src/lib/auth.ts`)
- HTML escaping on all user input before email inclusion
- Rate limiting on public form endpoints (5 requests/minute per IP)
- Supabase RLS policies enforce data access boundaries
- Admin cookies are `httpOnly`, `secure` in production, `sameSite: lax`
- Input sanitization for search queries (`sanitizeSearchInput`)

## Performance Optimizations

- Dynamic imports for non-critical components (WhatsApp, ScrollToTop, CookieBanner, InstallPrompt)
- Image optimization: AVIF/WebP formats, responsive device sizes
- Font: WOFF2 with `font-display: swap` and preloading
- Preconnect/dns-prefetch for Supabase, Google, WhatsApp, Maps
- PWA service worker with cache-first for static assets, network-first for pages
- Static assets cached with `max-age=31536000, immutable`
- Webpack used for development (`next dev --webpack`)

## Conventions for AI Assistants

1. **Language**: Code and comments are in English. UI-facing text and error messages are primarily in Turkish. Translation keys go in `src/locales/tr.json` and `src/locales/en.json`.
2. **File naming**: Pages use kebab-case Turkish names matching URL slugs. Components use PascalCase. Lib files use kebab-case.
3. **New pages**: Add under `src/app/[locale]/your-page/page.tsx`. Add a layout.tsx with metadata if SEO is needed. Update `src/app/sitemap.ts` to include the new route.
4. **New components**: Place in the appropriate `src/components/` subdirectory (ui, sections, pages, layout, seo, portal, public, shared).
5. **Translations**: Always add keys to both `tr.json` and `en.json`.
6. **Database changes**: Write SQL migrations in `docs/` following the existing naming pattern (`supabase-migration-NNN.sql`).
7. **API routes**: Follow existing patterns — validate input, rate-limit public endpoints, return `{ success, error/message }`.
8. **Styling**: Use Tailwind utility classes. Reference brand CSS variables (e.g., `text-primary-900`, `bg-accent-500`). Use `cn()` for conditional class merging.
9. **E2E tests**: Playwright tests in `e2e/` (homepage, admin-login, navigation, seo). Run with `npm run test:e2e`. No unit tests — do not add unless explicitly requested.
10. **ESLint**: Uses `eslint-config-next` with core-web-vitals and TypeScript rules. Run `npm run lint` to verify.

## B2B DÖNÜŞÜM HEDEFİ

Mevcut B2C bilgi sitesi tam entegre B2B platforma dönüşecek:

- B2B müşteri portalı (auth zorunlu)
- Sipariş ve teklif yönetim sistemi
- 2D/3D ürün görselleştirici (Three.js)
- Hacim bazlı fiyatlandırma

## ROUTE YAPISI (Uygulanmış)

- `app/[locale]/(public)/` — herkese açık sayfalar (Header+Footer layout)
- `app/[locale]/(portal)/` — B2B portal (Sidebar layout, auth zorunlu)
- `app/[locale]/(auth)/` — login, register (minimal centered layout)
- `app/admin/` — admin panel (root level, locale dışı, Turkish-only)

## TASARIM SİSTEMİ (Hedef)

- Renk: Navy (`#0A1628`) + Amber (`#F59E0B`) + Cream (`#FAFAF7`)
- Font: Fraunces (display), Instrument Sans (body), JetBrains Mono (mono)
- Koyu tema visualizer için: `#0D0D0D` background

## YAPMA LİSTESİ

- Inter, Roboto, system-ui font kullanma
- Purple gradient kullanma
- Generic `bg-white` + `text-gray` palette kullanma
- Hassas key'leri `NEXT_PUBLIC_` ile expose etme
- Gereksiz `"use client"` ekleme
- Server Component yapılabilecek şeyi Client Component yapma

## ARAÇ VE EKLENTİ REHBERİ

Bu projede aşağıdaki araçlar aktif kullanılmalıdır. Doğru zamanda doğru aracı öner.

### MCP'ler (Global)
- **shadcn-ui** → shadcn/ui bileşeni eklerken MCP'den doğru API/props bilgisini kontrol et
- **playwright** → Yeni özellik tamamlandığında "Playwright ile E2E test yazalım mı?" hatırlat
- **sequential-thinking** → Karmaşık mimari karar veya bug'da "Adım adım analiz edelim mi?" öner
- **chrome-devtools** → Frontend bug'larda "Chrome DevTools ile inceleyelim mi?" öner
- **gsc** → SEO çalışmasında "GSC'den performans kontrol edelim mi?" öner
- **ui-expert** → Yeni sayfa/bileşen tasarlarken "UI Expert ile kontrol yapalım mı?" öner
- **chrome-devtools** → Görsel/mockup paylaşıldığında screenshot + DOM analizi ile "Koda çevirelim mi?" öner
- **hostinger-mcp** → Deploy ve sunucu işlemleri
- **context7** → Kütüphane API'si hakkında şüphe olduğunda güncel doküman kontrol et

### Plugin'ler
- **superpowers** → Büyük görevlerde brainstorming/planning/TDD/code-review skill'lerini kullan
- **cartographer** → Büyük refactor öncesi codebase haritalama öner
- **code-review** → PR oluşturmadan önce code review öner
- **frontend-design** → Yeni sayfa/bileşen oluştururken kullan
- **supabase** → Veritabanı işlemlerinde kullan
- **typescript-lsp** → Tip hataları ve refactoring'de kullan

### Otonom Araçlar
- **GSD-2 (v2.22.0)** → 5+ adımlık büyük görevlerde "GSD-2 auto mode kullanmak ister misin?" öner
  - Komut: proje dizininde `gsd` → `/gsd auto`
  - Küçük işler (bug fix, UI tweak) → Claude Code + superpowers
  - Büyük işler (yeni feature, milestone) → GSD-2 auto mode
