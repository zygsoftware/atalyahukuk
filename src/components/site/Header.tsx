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
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-3 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo-mark.png"
            alt="Atalya Hukuk Bürosu"
            width={44}
            height={44}
            priority
            className="h-11 w-11"
          />
          <span className="font-serif text-xl tracking-wide text-bordo-500">
            ATALYA
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
