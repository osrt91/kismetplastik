import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Prefix a path with the Next.js basePath so client-side fetch works. */
export function apiUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? process.env.__NEXT_ROUTER_BASEPATH ?? "";
  return `${base}${path}`;
}

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
