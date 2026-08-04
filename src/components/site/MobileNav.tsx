"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { NAV_ITEMS } from "@/lib/constants";

export function MobileNav({
  labels,
  ctaLabel,
}: {
  labels: Record<string, string>;
  ctaLabel: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="xl:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="Menü"
        className="flex h-10 w-10 flex-col items-center justify-center gap-1.5"
      >
        <span
          className={`h-0.5 w-6 bg-ink transition ${open ? "translate-y-2 rotate-45" : ""}`}
        />
        <span
          className={`h-0.5 w-6 bg-ink transition ${open ? "opacity-0" : ""}`}
        />
        <span
          className={`h-0.5 w-6 bg-ink transition ${open ? "-translate-y-2 -rotate-45" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute inset-x-0 top-full border-t border-bordo-100 bg-cream shadow-lg">
          <nav className="flex flex-col px-6 py-4">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => setOpen(false)}
                className="border-b border-bordo-100/60 py-3 font-serif text-lg text-ink last:border-none"
              >
                {labels[item.key]}
              </Link>
            ))}
            <Link
              href="/iletisim"
              onClick={() => setOpen(false)}
              className="mt-4 rounded-full bg-bordo-500 px-5 py-3 text-center font-medium text-cream"
            >
              {ctaLabel}
            </Link>
          </nav>
        </div>
      )}
    </div>
  );
}
