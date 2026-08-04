import { routing } from "@/i18n/routing";
import { getPathname } from "@/i18n/navigation";

type Href = Parameters<typeof getPathname>[0]["href"];

/**
 * Her sayfanın kendi canonical URL'sini ve doğru hreflang alternatiflerini
 * bildirmesi için — aksi halde tüm sayfalar layout'tan miras kalan
 * "/" canonical'ını kullanır (yanlış, indekslemeyi bozar).
 */
export function buildAlternates(locale: string, href: Href) {
  const languages: Record<string, string> = {};
  for (const loc of routing.locales) {
    languages[loc] = getPathname({ locale: loc, href });
  }

  return {
    canonical: getPathname({ locale, href }),
    languages,
  };
}
