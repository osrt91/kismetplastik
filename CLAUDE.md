# CLAUDE.md — Kısmet Plastik B2B Web App

## Project Overview

Kısmet Plastik is a **B2B cosmetic packaging** company website and dealer portal built with **Next.js 16** (App Router). The site is bilingual (Turkish primary, English secondary), deployed on **Vercel** (region: `fra1`), and also packaged as an Android TWA for the Google Play Store.

**Production URL:** `https://www.kismetplastik.com`

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16.1.6 (App Router, React 19, Turbopack) |
| Language | TypeScript 5 (strict mode) |
| Styling | Tailwind CSS 4, CSS custom properties, `tw-animate-css` |
| Components | shadcn/ui (new-york style, Radix UI primitives) |
| Database | Supabase (PostgreSQL with RLS) |
| Auth | Supabase Auth (dealers) + cookie-based admin token |
| Email | Resend |
| AI | OpenAI (chatbot, currently disabled) |
| 3D | Three.js / React Three Fiber + Drei |
| Animations | Framer Motion, CSS scroll-driven animations |
| Icons | Lucide React, Phosphor Icons, React Icons |
| Deployment | Vercel + Android TWA (Bubblewrap) |

## Quick Commands

```bash
npm run dev      # Start development server (Turbopack)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint (next lint)
```

There are no test scripts configured. Linting is the only verification step.

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
│   │   ├── [locale]/        # Locale-scoped pages (tr/en)
│   │   ├── admin/           # Admin panel (products, blog, gallery)
│   │   └── api/             # API routes
│   ├── components/
│   │   ├── layout/          # Header, Footer
│   │   ├── sections/        # Homepage sections (Hero, Categories, Stats, etc.)
│   │   ├── pages/           # Client-side page components (BlogDetail, Category, ProductDetail)
│   │   ├── seo/             # JSON-LD structured data
│   │   └── ui/              # Reusable UI components (shadcn/ui + custom)
│   ├── contexts/            # React Context providers (Locale, Theme)
│   ├── data/                # Static/seed data (products, blog)
│   ├── hooks/               # Custom hooks (useRecentProducts, useScrollAnimation)
│   ├── lib/                 # Utility modules
│   │   ├── supabase.ts          # Singleton Supabase client (general)
│   │   ├── supabase-browser.ts  # Browser-side SSR client
│   │   ├── supabase-server.ts   # Server-side SSR client (async cookies)
│   │   ├── auth.ts              # Admin auth helpers, timing-safe compare
│   │   ├── email.ts             # Resend email service
│   │   ├── i18n.ts              # Dictionary-based i18n
│   │   ├── rate-limit.ts        # In-memory rate limiting
│   │   └── utils.ts             # cn() class merge utility
│   ├── locales/             # Translation JSON files (tr.json, en.json)
│   ├── types/               # TypeScript type definitions
│   │   ├── database.ts          # Supabase DB row types
│   │   └── product.ts           # Product/category/filter types
│   └── proxy.ts             # Next.js 16 middleware (locale routing + admin guard)
├── twa/                     # Android TWA config and deployment guide
├── vercel.json              # Vercel deployment config
└── components.json          # shadcn/ui configuration
```

## Architecture & Key Patterns

### Routing & i18n

- Uses **Next.js App Router** with a `[locale]` dynamic segment: `/[locale]/urunler`, `/[locale]/blog`, etc.
- Supported locales: `tr` (default), `en` — defined in `src/proxy.ts`
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
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anonymous key |
| `ADMIN_SECRET` | Yes | Admin password (min 32 chars) |
| `RESEND_API_KEY` | No | Resend email API key (forms log to console without it) |
| `EMAIL_FROM` | No | Sender email address |
| `EMAIL_TO` | No | Recipient email (default: bilgi@kismetplastik.com) |
| `OPENAI_API_KEY` | No | OpenAI API key for chatbot |
| `NEXT_PUBLIC_GA_ID` | No | Google Analytics ID |

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
- Turbopack enabled for development

## Conventions for AI Assistants

1. **Language**: Code and comments are in English. UI-facing text and error messages are primarily in Turkish. Translation keys go in `src/locales/tr.json` and `src/locales/en.json`.
2. **File naming**: Pages use kebab-case Turkish names matching URL slugs. Components use PascalCase. Lib files use kebab-case.
3. **New pages**: Add under `src/app/[locale]/your-page/page.tsx`. Add a layout.tsx with metadata if SEO is needed. Update `src/app/sitemap.ts` to include the new route.
4. **New components**: Place in the appropriate `src/components/` subdirectory (ui, sections, pages, layout, seo).
5. **Translations**: Always add keys to both `tr.json` and `en.json`.
6. **Database changes**: Write SQL migrations in `docs/` following the existing naming pattern (`supabase-migration-NNN.sql`).
7. **API routes**: Follow existing patterns — validate input, rate-limit public endpoints, return `{ success, error/message }`.
8. **Styling**: Use Tailwind utility classes. Reference brand CSS variables (e.g., `text-primary-900`, `bg-accent-500`). Use `cn()` for conditional class merging.
9. **No test suite**: There are no tests currently. Do not add test files unless explicitly requested.
10. **ESLint**: Uses `eslint-config-next` with core-web-vitals and TypeScript rules. Run `npm run lint` to verify.
