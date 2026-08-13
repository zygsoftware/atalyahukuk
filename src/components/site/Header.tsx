import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { NAV_ITEMS } from "@/lib/constants";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { MobileNav } from "./MobileNav";
import { StickyHeader } from "./StickyHeader";

export async function Header() {
  const t = await getTranslations("nav");

  const labels = Object.fromEntries(
    NAV_ITEMS.map((item) => [item.key, t(item.key)]),
  );

  return (
    <StickyHeader>
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-6 py-2.5 lg:px-8">
        <Link href="/" className="group flex shrink-0 items-center gap-3">
          <Image
            src="/logo-mark.png"
            alt="Atalya Hukuk Bürosu"
            width={68}
            height={68}
            priority
            className="h-14 w-14 shrink-0 transition-transform duration-300 group-hover:scale-105 sm:h-16 sm:w-16"
          />
          <span className="flex flex-col leading-none">
            <span className="font-serif text-xl tracking-[0.1em] text-bordo-500 sm:text-2xl">
              ATALYA
            </span>
            <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-gold-600">
              Hukuk Bürosu
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-4 xl:flex 2xl:gap-6">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className="group relative shrink-0 whitespace-nowrap text-sm font-medium text-ink/80 transition hover:text-bordo-500"
            >
              {labels[item.key]}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-gold-500 transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        <div className="hidden shrink-0 items-center gap-4 xl:flex">
          <LocaleSwitcher />
          <Link
            href="/iletisim"
            className="shrink-0 whitespace-nowrap rounded-full bg-bordo-500 px-5 py-2.5 text-sm font-medium text-cream transition-all duration-300 hover:scale-105 hover:bg-bordo-600 hover:shadow-lg hover:shadow-bordo-500/30 active:scale-95"
          >
            {t("callToAction")}
          </Link>
        </div>

        <div className="flex items-center gap-3 xl:hidden">
          <LocaleSwitcher />
          <MobileNav
            labels={labels}
            ctaLabel={t("callToAction")}
            menuLabel={t("menu")}
          />
        </div>
      </div>
    </StickyHeader>
  );
}
