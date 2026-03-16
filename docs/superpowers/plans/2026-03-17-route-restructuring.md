# Route Restructuring Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reorganize flat `src/app/[locale]/` into `(public)`, `(portal)`, `(auth)` route groups with dedicated layouts.

**Architecture:** Next.js route groups don't affect URLs — they only provide organizational structure and per-group layouts. The root locale layout keeps shared concerns (fonts, providers, analytics). Each group gets its own layout: public (Header+Footer), portal (Sidebar), auth (minimal).

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript 5

**Spec:** `docs/superpowers/specs/2026-03-17-route-restructuring-design.md`

---

## Chunk 1: Create Route Groups and Layouts

### Task 1: Create route group directories

**Files:**
- Create: `src/app/[locale]/(public)/` (directory)
- Create: `src/app/[locale]/(portal)/` (directory)
- Create: `src/app/[locale]/(auth)/` (directory)

- [ ] **Step 1: Create the three route group directories**

```bash
mkdir -p "src/app/[locale]/(public)"
mkdir -p "src/app/[locale]/(portal)"
mkdir -p "src/app/[locale]/(auth)"
```

---

### Task 2: Refactor root locale layout — remove UI, keep infrastructure

**Files:**
- Modify: `src/app/[locale]/layout.tsx`

The current layout has everything: fonts, providers, Header, Footer, WhatsApp, etc. We split it so this root layout ONLY keeps shared infrastructure. UI elements move to the public layout in Task 3.

- [ ] **Step 1: Rewrite `src/app/[locale]/layout.tsx`**

Remove these imports and JSX from the root layout:
- `Header`, `Footer`
- `WhatsAppButton`, `ScrollToTop`
- `LocalBusinessJsonLd`, `OrganizationJsonLd`
- `getSettings` (no longer needed at root level)
- Skip-to-content `<a>` link
- `<div className="scroll-progress-bar" />`

Keep these in the root layout:
- Font loading (Fraunces, Instrument Sans, JetBrains Mono)
- `generateStaticParams()`, `generateMetadata()`
- HTML/body structure with lang, font variables, dir, suppressHydrationWarning
- `<head>` contents: service worker, font preloads, preconnects, manifest, theme-color
- Theme init script in `<body>`
- Providers: `MotionConfigProvider`, `ThemeProvider`, `LocaleProvider`
- `GoogleAnalytics`, `WebVitals`
- `CookieBanner`, `InstallPrompt`
- `Toaster`

The `<body>` should render:
```tsx
<body className="antialiased" dir={locale === "ar" ? "rtl" : "ltr"} suppressHydrationWarning>
  {/* theme init script */}
  <GoogleAnalytics />
  <WebVitals />
  <MotionConfigProvider reducedMotion="user">
    <ThemeProvider>
      <LocaleProvider>
        {children}
        <InstallPrompt />
        <CookieBanner />
        <Toaster position="top-right" richColors />
      </LocaleProvider>
    </ThemeProvider>
  </MotionConfigProvider>
</body>
```

- [ ] **Step 2: Verify the edit compiles**

```bash
npx tsc --noEmit 2>&1 | head -20
```

---

### Task 3: Create public layout

**Files:**
- Create: `src/app/[locale]/(public)/layout.tsx`

This layout wraps all public-facing pages with Header, Footer, and public-only UI elements.

- [ ] **Step 1: Write `src/app/[locale]/(public)/layout.tsx`**

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
      <a
        href="#main-content"
        className="fixed left-4 top-4 z-[100] -translate-y-20 rounded-lg bg-primary-900 px-4 py-2 text-sm font-bold text-white shadow-lg transition-transform focus:translate-y-0"
      >
        İçeriğe atla
      </a>
      <div className="scroll-progress-bar" />
      <Header />
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
      <Footer settings={settings} />
      <WhatsAppButton />
      <ScrollToTop />
    </>
  );
}
```

Note: The skip-to-content link in current layout uses locale for text. Since this is in the public layout which is inside `[locale]`, we can access locale from the URL if needed. For simplicity and since the site is primarily Turkish, we use the Turkish text. The individual page layouts already handle locale-specific metadata.

---

### Task 4: Create portal layout

**Files:**
- Create: `src/app/[locale]/(portal)/layout.tsx`
- Move: `src/app/[locale]/bayi-panel/client-layout.tsx` → stays in place (referenced by portal layout)

- [ ] **Step 1: Write `src/app/[locale]/(portal)/layout.tsx`**

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return children;
}
```

Note: The bayi-panel directory already has its own layout.tsx that renders `BayiPanelClientLayout` (sidebar + portal header). That nested layout stays as-is. The portal route group layout just adds the noindex metadata and acts as the group boundary.

---

### Task 5: Create auth layout

**Files:**
- Create: `src/app/[locale]/(auth)/layout.tsx`

- [ ] **Step 1: Write `src/app/[locale]/(auth)/layout.tsx`**

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

- [ ] **Step 2: Commit chunk 1**

```bash
git add -A
git commit -m "refactor: create route group layouts (public, portal, auth)"
```

---

## Chunk 2: Move Pages Into Route Groups

### Task 6: Move public pages into (public)/

**Files:** Move 28 directories + homepage page.tsx

- [ ] **Step 1: Move homepage**

```bash
mv "src/app/[locale]/page.tsx" "src/app/[locale]/(public)/page.tsx"
```

- [ ] **Step 2: Move all public page directories**

```bash
for dir in ambalaj-sozlugu arge blog fabrika fuarlar galeri hakkimizda iletisim kalite kariyer karsilastir katalog kaynaklar kvkk numune-talep on-siparis referanslar sektorler sertifikalar sss surdurulebilirlik tarihce teklif-al uretim urun-olustur urunler vizyon-misyon; do
  mv "src/app/[locale]/$dir" "src/app/[locale]/(public)/$dir"
done
```

---

### Task 7: Move portal pages into (portal)/

**Files:** Move bayi-panel/ directory

- [ ] **Step 1: Move bayi-panel**

```bash
mv "src/app/[locale]/bayi-panel" "src/app/[locale]/(portal)/bayi-panel"
```

---

### Task 8: Move auth pages into (auth)/

**Files:** Move bayi-girisi/ and bayi-kayit/

- [ ] **Step 1: Move auth directories**

```bash
mv "src/app/[locale]/bayi-girisi" "src/app/[locale]/(auth)/bayi-girisi"
mv "src/app/[locale]/bayi-kayit" "src/app/[locale]/(auth)/bayi-kayit"
```

- [ ] **Step 2: Remove bayi-girisi layout.tsx (auth layout replaces it)**

The `bayi-girisi/layout.tsx` only adds metadata and passes children through. The metadata can be kept, but the layout wrapper is now handled by the auth group layout. Check if metadata needs preserving — if so, keep the file. If it's just a passthrough, it can be simplified or the metadata moved to page-level.

Review: `src/app/[locale]/(auth)/bayi-girisi/layout.tsx` — it has SEO metadata for "Bayi Girişi". Since auth pages are noindex (set in auth layout), this metadata is less critical. Keep the file for now since it has specific OG metadata.

- [ ] **Step 3: Commit chunk 2**

```bash
git add -A
git commit -m "refactor: move pages into (public), (portal), (auth) route groups"
```

---

## Chunk 3: Fix References and Verify

### Task 9: Check and fix import paths

**Files:** Check all moved files for relative imports that might break

- [ ] **Step 1: Search for relative imports in moved files**

```bash
grep -r "from '\.\./\.\." "src/app/[locale]/(public)" "src/app/[locale]/(portal)" "src/app/[locale]/(auth)" --include="*.tsx" --include="*.ts" | head -30
```

All imports should use `@/` aliases. If any relative imports exist, fix them.

- [ ] **Step 2: Check portal client-layout.tsx import in portal layout**

The `(portal)/bayi-panel/layout.tsx` imports `./client-layout` — this file moved with bayi-panel, so the relative import is still valid.

Verify:
```bash
cat "src/app/[locale]/(portal)/bayi-panel/layout.tsx"
```

---

### Task 10: Build verification

- [ ] **Step 1: Run lint**

```bash
npm run lint 2>&1 | tail -20
```

Expected: No errors related to the restructuring.

- [ ] **Step 2: Run production build**

```bash
npm run build 2>&1 | tail -40
```

Expected: Build succeeds. All routes appear in the output. Routes should still show the same URL paths (route groups don't appear in URLs).

- [ ] **Step 3: Verify route output**

Check that the build output lists these paths:
- `/[locale]` (homepage)
- `/[locale]/urunler`
- `/[locale]/bayi-panel`
- `/[locale]/bayi-girisi`
- `/[locale]/blog`

The presence of route groups should NOT change any URLs.

---

### Task 11: Final commit and push

- [ ] **Step 1: Commit if any fixes were made**

```bash
git add -A
git commit -m "refactor: fix imports and verify route group restructuring"
```

- [ ] **Step 2: Push to origin**

```bash
git push origin master
```

---

## Verification Checklist

After all tasks complete:

- [ ] `npm run build` succeeds with no errors
- [ ] `npm run lint` passes
- [ ] Route group directories exist: `(public)/`, `(portal)/`, `(auth)/`
- [ ] No pages remain directly under `[locale]/` (except layout, loading, error, not-found)
- [ ] All public pages are under `(public)/`
- [ ] `bayi-panel/` is under `(portal)/`
- [ ] `bayi-girisi/` and `bayi-kayit/` are under `(auth)/`
- [ ] `src/app/admin/` unchanged
- [ ] `src/app/api/` unchanged
- [ ] `src/proxy.ts` unchanged
- [ ] URLs haven't changed (route groups are invisible in URLs)
