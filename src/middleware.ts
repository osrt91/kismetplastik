import { NextRequest, NextResponse } from "next/server";
import { timingSafeCompare } from "@/lib/auth";

export const locales = ["tr", "en"] as const;
export const defaultLocale = "tr";

export function middleware(request: NextRequest) {
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

  if (pathnameHasLocale) return;

  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon\\.ico|images|fonts|sertifikalar|manifest\\.json|robots\\.txt|sitemap\\.xml|.*\\..*).*)",
  ],
};
