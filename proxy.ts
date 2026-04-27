import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["en", "ar", "fr", "de"] as const;
const defaultLocale = "en";

function getLocale(request: NextRequest): string {
  const acceptLang = request.headers.get("accept-language") ?? "";
  for (const part of acceptLang.split(",")) {
    const tag = part.split(";")[0].trim().toLowerCase();
    const lang = tag.split("-")[0];
    if ((locales as readonly string[]).includes(lang)) return lang;
  }
  return defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasLocale = locales.some(
    (l) => pathname.startsWith(`/${l}/`) || pathname === `/${l}`
  );

  if (hasLocale) return;

  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon|.*\\..*).*)"],
};
