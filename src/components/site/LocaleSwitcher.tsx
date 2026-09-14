"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type AppLocale } from "@/i18n/routing";
import { useParams } from "next/navigation";
import { Flag } from "./Flag";

const LOCALE_META: Record<AppLocale, { label: string }> = {
  tr: { label: "Türkçe" },
  en: { label: "English" },
  ru: { label: "Русский" },
  de: { label: "Deutsch" },
};

export function LocaleSwitcher() {
  const locale = useLocale() as AppLocale;
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(e: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  function selectLocale(loc: AppLocale) {
    setOpen(false);
    if (loc === locale) return;
    router.replace(
      // @ts-expect-error -- next-intl dinamik pathname tipini daraltamıyor
      { pathname, params },
      { locale: loc },
    );
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center gap-1.5 rounded-full px-2.5 py-2 text-sm font-medium text-ink/80 transition hover:bg-bordo-50 hover:text-bordo-500"
      >
        <Flag locale={locale} />
        <span className="hidden sm:inline">{locale.toUpperCase()}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <div
        role="listbox"
        className={
          "absolute right-0 top-full z-50 mt-2 w-44 origin-top-right overflow-hidden rounded-2xl border border-bordo-100 bg-white py-1.5 shadow-xl shadow-bordo-950/10 transition-all duration-150 " +
          (open
            ? "pointer-events-auto scale-100 opacity-100"
            : "pointer-events-none scale-95 opacity-0")
        }
      >
        {routing.locales.map((loc) => {
          const meta = LOCALE_META[loc];
          const active = loc === locale;
          return (
            <button
              key={loc}
              type="button"
              role="option"
              aria-selected={active}
              onClick={() => selectLocale(loc)}
              className={
                "flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition " +
                (active
                  ? "bg-bordo-50 font-semibold text-bordo-600"
                  : "text-ink/80 hover:bg-bordo-50/60 hover:text-bordo-500")
              }
            >
              <Flag locale={loc} className="h-4 w-6" />
              <span>{meta.label}</span>
              {active && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-bordo-500" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
