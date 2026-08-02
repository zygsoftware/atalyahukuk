import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { NAV_ITEMS } from "@/lib/constants";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { MobileNav } from "./MobileNav";

export async function Header() {
  const t = await getTranslations("nav");

  const labels = Object.fromEntries(
    NAV_ITEMS.map((item) => [item.key, t(item.key)]),
  );

  return (
    <header className="relative z-40 border-b border-bordo-100 bg-cream/95 backdrop-blur supports-[backdrop-filter]:bg-cream/80">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-2.5 lg:px-8">
        <Link href="/" className="flex items-center gap-3.5">
          <Image
            src="/logo-mark.png"
            alt="Atalya Hukuk Bürosu"
            width={68}
            height={68}
            priority
            className="h-16 w-16 shrink-0 sm:h-[68px] sm:w-[68px]"
          />
          <span className="flex flex-col leading-none">
            <span className="font-serif text-2xl tracking-[0.12em] text-bordo-500 sm:text-[28px]">
              ATALYA
            </span>
            <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.35em] text-gold-600">
              Hukuk Bürosu
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className="text-sm font-medium text-ink/80 transition hover:text-bordo-500"
            >
              {labels[item.key]}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-5 md:flex">
          <LocaleSwitcher />
          <Link
            href="/iletisim"
            className="rounded-full bg-bordo-500 px-5 py-2.5 text-sm font-medium text-cream transition hover:bg-bordo-600"
          >
            {t("callToAction")}
          </Link>
        </div>

        <div className="flex items-center gap-3 md:hidden">
          <LocaleSwitcher />
          <MobileNav labels={labels} ctaLabel={t("callToAction")} />
        </div>
      </div>
    </header>
  );
}
