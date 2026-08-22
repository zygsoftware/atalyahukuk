"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { ProfileRole } from "@/lib/supabase/types";

const NAV = [
  { href: "/admin", label: "Panel", exact: true, roles: ["admin", "editor"] },
  {
    href: "/admin/blog",
    label: "Blog / Makale",
    exact: false,
    roles: ["admin", "editor"],
  },
  {
    href: "/admin/duyurular",
    label: "Duyurular",
    exact: false,
    roles: ["admin", "editor"],
  },
  {
    href: "/admin/galeri",
    label: "Galeri",
    exact: false,
    roles: ["admin", "editor"],
  },
  {
    href: "/admin/mesajlar",
    label: "Mesajlar",
    exact: false,
    roles: ["admin", "editor"],
  },
  {
    href: "/admin/takvim",
    label: "Takvim",
    exact: false,
    roles: ["admin"],
  },
  {
    href: "/admin/muvekkiller",
    label: "Müvekkiller",
    exact: false,
    roles: ["admin"],
  },
  {
    href: "/admin/dosyalar",
    label: "Dosyalar",
    exact: false,
    roles: ["admin"],
  },
  {
    href: "/admin/kullanicilar",
    label: "Kullanıcılar",
    exact: false,
    roles: ["admin"],
  },
  {
    href: "/admin/ayarlar",
    label: "Ayarlar",
    exact: false,
    roles: ["admin"],
  },
] as const;

export function Sidebar({ role }: { role: ProfileRole }) {
  const pathname = usePathname();

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-bordo-100 bg-white">
      <div className="flex items-center gap-3 border-b border-bordo-100 px-6 py-5">
        <Image
          src="/logo-mark.png"
          alt="Atalya Hukuk Bürosu"
          width={32}
          height={32}
          className="h-8 w-8"
        />
        <span className="font-serif text-lg text-bordo-500">ATALYA</span>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-5">
        {NAV.filter((item) => (item.roles as readonly string[]).includes(role)).map(
          (item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "block rounded-lg px-4 py-2.5 text-sm font-medium transition",
                  isActive
                    ? "bg-bordo-500 text-cream"
                    : "text-ink/70 hover:bg-bordo-50",
                )}
              >
                {item.label}
              </Link>
            );
          },
        )}
      </nav>

      <div className="border-t border-bordo-100 px-6 py-4">
        <Link
          href="/"
          target="_blank"
          className="text-xs font-medium text-ink/50 hover:text-bordo-500"
        >
          ↗ Siteyi Görüntüle
        </Link>
      </div>
    </aside>
  );
}
