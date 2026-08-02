import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { updateSession } from "@/lib/supabase/middleware";

const intlMiddleware = createMiddleware(routing);

const ADMIN_ONLY_PREFIXES = ["/admin/muvekkiller", "/admin/kullanicilar"];

async function handleAdmin(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const { supabaseResponse, user, role } = await updateSession(request);
  const isLoginPage = pathname === "/admin/login";

  if (!user) {
    if (isLoginPage) return supabaseResponse;
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (isLoginPage) {
    const dashboardUrl = new URL("/admin", request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  const isAdminOnlyPath = ADMIN_ONLY_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix),
  );
  if (isAdminOnlyPath && role !== "admin") {
    const dashboardUrl = new URL("/admin", request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return supabaseResponse;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    return handleAdmin(request);
  }

  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};
