"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { useParams } from "next/navigation";

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  return (
    <div className="flex items-center gap-1 text-sm font-medium">
      {routing.locales.map((loc) => (
        <button
          key={loc}
          onClick={() =>
            router.replace(
              // @ts-expect-error -- next-intl dinamik pathname tipini daraltamıyor
              { pathname, params },
              { locale: loc },
            )
          }
          aria-current={locale === loc}
          className={
            locale === loc
              ? "rounded-full bg-bordo-500 px-3 py-2 text-cream"
              : "rounded-full px-3 py-2 text-ink/80 hover:text-bordo-500"
          }
        >
          {loc.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
