import { NextRequest, NextResponse } from "next/server";
import { timingSafeCompare } from "@/lib/auth";

export const locales = ["tr", "en", "ar", "ru", "fr", "de", "es", "zh", "ja", "ko", "pt"] as const;
export const defaultLocale = "tr";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") return;
    const token = request.cookies.get("admin-token")?.value;
    const secret = process.env.ADMIN_SECRET;
    if (!token || !secret || !timingSafeCompare(token, secret)) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
    return;
  }

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    // Protect /[locale]/bayi-panel routes — require Supabase auth cookie
    const isBayiPanel = locales.some(
      (locale) => pathname.startsWith(`/${locale}/bayi-panel`)
    );
    if (isBayiPanel) {
      const hasAuthCookie =
        request.cookies.has("sb-access-token") ||
        request.cookies.has("sb-refresh-token") ||
        Array.from(request.cookies.getAll()).some((c) => c.name.startsWith("sb-") && c.name.endsWith("-auth-token"));
      if (!hasAuthCookie) {
        const locale = locales.find(
          (l) => pathname.startsWith(`/${l}/`) || pathname === `/${l}`
        ) || defaultLocale;
        const url = request.nextUrl.clone();
        url.pathname = `/${locale}/bayi-girisi`;
        return NextResponse.redirect(url);
      }
    }
    return;
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon\\.ico|images|fonts|sertifikalar|manifest\\.json|robots\\.txt|sitemap\\.xml|.*\\..*).*)",
  ],
};
