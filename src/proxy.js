import { NextResponse } from "next/server";

import { DEFAULT_LOCALE, LOCALE_COOKIE, LOCALES } from "@/i18n/config";

/** Host of an Origin header; null for "null" (sandboxed/opaque origins) or garbage, which then counts as cross-site. */
function hostOf(origin) {
  try {
    return new URL(origin).host;
  } catch {
    return null;
  }
}

/** Cookie choice first, then the browser's Accept-Language, then English. */
function preferredLocale(request) {
  const saved = request.cookies.get(LOCALE_COOKIE)?.value;
  if (LOCALES.includes(saved)) return saved;

  const ranked = (request.headers.get("accept-language") ?? "")
    .split(",")
    .map((part) => {
      const [tag, quality] = part.trim().split(";q=");
      return { lang: tag.toLowerCase().split("-")[0], q: quality ? Number.parseFloat(quality) : 1 };
    })
    .sort((a, b) => b.q - a.q);

  return ranked.find((entry) => LOCALES.includes(entry.lang))?.lang ?? DEFAULT_LOCALE;
}

/**
 * Pages live under app/[lang], but URLs stay clean (/shop, not /en/shop):
 * - "/ur/shop" saves Urdu as the preference and redirects to "/shop"
 * - "/shop" is rewritten internally to "/{preferred}/shop"
 */
export function proxy(request) {
  const { pathname } = request.nextUrl;

  // API: block cross-site state-changing requests (CSRF defence on top of SameSite cookies).
  if (pathname.startsWith("/api/")) {
    const origin = request.headers.get("origin");
    const unsafe = !["GET", "HEAD", "OPTIONS"].includes(request.method);
    if (unsafe && origin && hostOf(origin) !== request.headers.get("host")) {
      return Response.json({ error: "forbidden" }, { status: 403 });
    }
    return NextResponse.next();
  }

  const first = pathname.split("/")[1];

  if (LOCALES.includes(first)) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(first.length + 1) || "/";
    const response = NextResponse.redirect(url);
    response.cookies.set(LOCALE_COOKIE, first, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
    return response;
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${preferredLocale(request)}${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // Pages (minus Next internals, metadata images and files with an extension) + the API for the CSRF check.
  matcher: ["/((?!api|_next|_vercel|opengraph-image|icon|.*\\..*).*)", "/api/:path*"],
};
