# Route Restructuring Design

## Goal

Reorganize `src/app/[locale]/` flat structure into Next.js route groups for clear separation of public, portal, and auth pages. Each group gets its own layout. URLs remain unchanged.

## Current State

All 39 page directories live flat under `src/app/[locale]/`. A single `layout.tsx` renders Header + Footer + providers + analytics for every page, including the dealer portal which has its own nested sidebar layout.

## Target Structure

```
src/app/[locale]/
├── layout.tsx              ← ROOT: fonts, providers, analytics, toaster (NO Header/Footer)
├── loading.tsx
├── error.tsx
├── not-found.tsx
├── (public)/
│   ├── layout.tsx          ← Header + Footer + WhatsApp + ScrollToTop + JSON-LD
│   ├── page.tsx            ← Homepage
│   ├── urunler/
│   ├── blog/
│   ├── hakkimizda/
│   ├── kalite/
│   ├── uretim/
│   ├── iletisim/
│   ├── teklif-al/
│   ├── katalog/
│   ├── sss/
│   ├── kariyer/
│   ├── galeri/
│   ├── sektorler/
│   ├── surdurulebilirlik/
│   ├── ambalaj-sozlugu/
│   ├── kvkk/
│   ├── vizyon-misyon/
│   ├── referanslar/
│   ├── arge/
│   ├── numune-talep/
│   ├── urun-olustur/
│   ├── sertifikalar/
│   ├── fuarlar/
│   ├── kaynaklar/
│   ├── tarihce/
│   ├── fabrika/
│   ├── karsilastir/
│   └── on-siparis/
├── (portal)/
│   ├── layout.tsx          ← Sidebar + Portal Header (from client-layout.tsx), noindex
│   └── bayi-panel/
│       ├── page.tsx
│       ├── faturalarim/
│       ├── hizli-siparis/
│       ├── odeme/
│       ├── profilim/
│       ├── siparislerim/
│       ├── tekliflerim/
│       └── urunler/
└── (auth)/
    ├── layout.tsx          ← Minimal centered layout, no Header/Footer
    ├── bayi-girisi/
    └── bayi-kayit/
```

## Layout Split

### Root Locale Layout (`[locale]/layout.tsx`)

Keeps:
- Font loading (Fraunces, Instrument Sans, JetBrains Mono)
- `generateMetadata()` and `generateStaticParams()`
- HTML structure with lang, font variables, suppressHydrationWarning
- `<head>`: service worker, font preloads, preconnects, manifest, theme-color
- `<body>`: theme init script, dir attribute
- Providers: MotionConfig, ThemeProvider, LocaleProvider
- GoogleAnalytics, WebVitals (tracking on all pages)
- CookieBanner (legal on all pages)
- InstallPrompt (PWA on all pages)
- Toaster (notifications on all pages)

Removes:
- Header, Footer
- WhatsApp, ScrollToTop
- Skip-to-content link, scroll-progress-bar
- JSON-LD components

### Public Layout (`[locale]/(public)/layout.tsx`)

```tsx
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import dynamic from "next/dynamic";
import { LocalBusinessJsonLd, OrganizationJsonLd } from "@/components/seo/JsonLd";
import { getSettings } from "@/lib/content";

const WhatsAppButton = dynamic(() => import("@/components/ui/WhatsAppButton"));
const ScrollToTop = dynamic(() => import("@/components/ui/ScrollToTop"));

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  return (
    <>
      <LocalBusinessJsonLd />
      <OrganizationJsonLd />
      <a href="#main-content" className="...skip-link-styles...">Skip to content</a>
      <div className="scroll-progress-bar" />
      <Header />
      <main id="main-content" tabIndex={-1}>{children}</main>
      <Footer settings={settings} />
      <WhatsAppButton />
      <ScrollToTop />
    </>
  );
}
```

### Portal Layout (`[locale]/(portal)/layout.tsx`)

```tsx
import type { Metadata } from "next";
import BayiPanelClientLayout from "./bayi-panel/client-layout";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return <BayiPanelClientLayout>{children}</BayiPanelClientLayout>;
}
```

Note: `client-layout.tsx` moves from `bayi-panel/` to `(portal)/` since it wraps all portal pages.

### Auth Layout (`[locale]/(auth)/layout.tsx`)

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
      {children}
    </div>
  );
}
```

## Unchanged

- `src/app/admin/` — stays as-is (Turkish-only, cookie auth)
- `src/app/api/` — stays as-is (92 route handlers)
- `src/proxy.ts` — middleware checks URL paths, route groups don't affect URLs
- `src/app/sitemap.ts` — URLs unchanged, no updates needed
- `src/app/robots.ts` — no changes needed

## Risks & Mitigations

1. **Path conflicts**: Route groups don't create URL segments, so `/tr/urunler` still resolves correctly. Only one group contains each path.
2. **Import breakage**: No component imports reference `[locale]/` paths directly — they use `@/components/` and `@/lib/`. Page files themselves just move into subdirectories.
3. **Middleware**: `src/proxy.ts` checks `pathname.includes("/bayi-panel")` — still works since URLs are unchanged.
4. **Build verification**: Run `npm run build` after restructuring to catch any issues.

## Verification

- [ ] `npm run build` succeeds
- [ ] `npm run lint` passes
- [ ] All public pages render with Header + Footer
- [ ] Portal pages render with Sidebar, no Header/Footer
- [ ] Auth pages render with minimal layout
- [ ] Middleware auth redirects still work
- [ ] URLs unchanged (no 404s on existing paths)
