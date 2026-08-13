import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { updateSession } from "@/lib/supabase/middleware";

const intlMiddleware = createMiddleware(routing);

const ADMIN_ONLY_PREFIXES = [
  "/admin/muvekkiller",
  "/admin/kullanicilar",
  "/admin/takvim",
  "/admin/ayarlar",
];

// Acil durum "hard kill switch" — ortam değişkeninde true ise veritabanı
// durumuna bakılmaksızın bakım modu zorla açılır. Normal kullanımda bu
// false/tanımsız bırakılır ve gerçek durum admin panelindeki (Ayarlar)
// veritabanı alanından okunur — anında etkili olur, deploy gerekmez.
const MAINTENANCE_MODE_ENV_OVERRIDE = process.env.MAINTENANCE_MODE === "true";
const MAINTENANCE_BYPASS_TOKEN = process.env.MAINTENANCE_BYPASS_TOKEN;
const BYPASS_COOKIE = "atalya_bypass";

let cachedMaintenanceMode: { value: boolean; fetchedAt: number } | null = null;
const MAINTENANCE_CACHE_TTL_MS = 15_000;

async function isMaintenanceModeOn(): Promise<boolean> {
  if (MAINTENANCE_MODE_ENV_OVERRIDE) return true;

  if (
    cachedMaintenanceMode &&
    Date.now() - cachedMaintenanceMode.fetchedAt < MAINTENANCE_CACHE_TTL_MS
  ) {
    return cachedMaintenanceMode.value;
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/site_settings?id=eq.1&select=maintenance_mode`,
      {
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        },
      },
    );
    const data = (await res.json()) as { maintenance_mode?: boolean }[];
    const value = data?.[0]?.maintenance_mode === true;
    cachedMaintenanceMode = { value, fetchedAt: Date.now() };
    return value;
  } catch {
    return false;
  }
}

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

/** Bakım modu açıkken devrede kalması gereken yollar (admin paneli ve API her zaman erişilebilir olmalı). */
function isExemptFromMaintenance(pathname: string) {
  return (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/maintenance")
  );
}

function hasValidBypass(request: NextRequest) {
  if (!MAINTENANCE_BYPASS_TOKEN) return false;
  const queryToken = request.nextUrl.searchParams.get("bypass");
  const cookieToken = request.cookies.get(BYPASS_COOKIE)?.value;
  return (
    queryToken === MAINTENANCE_BYPASS_TOKEN ||
    cookieToken === MAINTENANCE_BYPASS_TOKEN
  );
}

function grantsNewBypass(request: NextRequest) {
  return (
    Boolean(MAINTENANCE_BYPASS_TOKEN) &&
    request.nextUrl.searchParams.get("bypass") === MAINTENANCE_BYPASS_TOKEN
  );
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    !isExemptFromMaintenance(pathname) &&
    !hasValidBypass(request) &&
    (await isMaintenanceModeOn())
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/maintenance";
    url.search = "";
    return NextResponse.rewrite(url, { status: 503 });
  }

  let response: NextResponse;
  if (pathname.startsWith("/admin")) {
    response = await handleAdmin(request);
  } else if (pathname.startsWith("/api")) {
    response = NextResponse.next();
  } else {
    response = intlMiddleware(request);
  }

  if (grantsNewBypass(request)) {
    response.cookies.set(BYPASS_COOKIE, MAINTENANCE_BYPASS_TOKEN!, {
      maxAge: 60 * 60 * 24,
      httpOnly: true,
      sameSite: "lax",
    });
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};
