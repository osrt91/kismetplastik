"use client";

import NextLink from "next/link";
import { useParams } from "next/navigation";
import type { ComponentProps } from "react";

export default function LocaleLink({
  href,
  ...props
}: ComponentProps<typeof NextLink>) {
  const params = useParams();
  const locale = (params?.locale as string) ?? "tr";

  if (typeof href === "string") {
    const shouldPrefix =
      href.startsWith("/") &&
      !href.startsWith(`/${locale}/`) &&
      !href.startsWith("/api/") &&
      !href.startsWith("/#");
    return (
      <NextLink href={shouldPrefix ? `/${locale}${href}` : href} {...props} />
    );
  }

  if (typeof href === "object" && href.pathname?.startsWith("/")) {
    const shouldPrefix =
      !href.pathname.startsWith(`/${locale}/`) &&
      !href.pathname.startsWith("/api/");
    return (
      <NextLink
        href={
          shouldPrefix ? { ...href, pathname: `/${locale}${href.pathname}` } : href
        }
        {...props}
      />
    );
  }

  return <NextLink href={href} {...props} />;
}
