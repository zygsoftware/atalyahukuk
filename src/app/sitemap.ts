import type { MetadataRoute } from "next";
import { SITE_URL, SERVICE_SLUGS } from "@/lib/constants";
import { routing } from "@/i18n/routing";
import { getPathname } from "@/i18n/navigation";
import { getPublishedPostSlugs } from "@/lib/data/posts";
import { getActiveAnnouncementSlugs } from "@/lib/data/announcements";

type Href = Parameters<typeof getPathname>[0]["href"];

function absolute(locale: (typeof routing.locales)[number], href: Href) {
  return `${SITE_URL}${getPathname({ locale, href })}`;
}

function buildLanguageAlternates(href: Href) {
  const languages: Record<string, string> = {};
  for (const locale of routing.locales) {
    languages[locale] = absolute(locale, href);
  }
  return languages;
}

function buildEntries(
  href: Href,
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>,
  priority: number,
  lastModified: Date,
): MetadataRoute.Sitemap {
  const languages = buildLanguageAlternates(href);
  return routing.locales.map((locale) => ({
    url: absolute(locale, href),
    lastModified,
    changeFrequency,
    priority,
    alternates: { languages },
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPaths = [
    "/",
    "/hakkimizda",
    "/hizmetler",
    "/galeri",
    "/blog",
    "/duyurular",
    "/iletisim",
  ] as const;

  const [postSlugs, announcementSlugs] = await Promise.all([
    getPublishedPostSlugs(),
    getActiveAnnouncementSlugs(),
  ]);

  const entries: MetadataRoute.Sitemap = [];

  for (const path of staticPaths) {
    entries.push(
      ...buildEntries(path, path === "/" ? "weekly" : "monthly", path === "/" ? 1 : 0.7, now),
    );
  }

  for (const slug of SERVICE_SLUGS) {
    entries.push(
      ...buildEntries(
        { pathname: "/hizmetler/[slug]", params: { slug } },
        "monthly",
        0.6,
        now,
      ),
    );
  }

  for (const slug of postSlugs) {
    entries.push(
      ...buildEntries({ pathname: "/blog/[slug]", params: { slug } }, "yearly", 0.5, now),
    );
  }

  for (const slug of announcementSlugs) {
    entries.push(
      ...buildEntries(
        { pathname: "/duyurular/[slug]", params: { slug } },
        "yearly",
        0.4,
        now,
      ),
    );
  }

  return entries;
}
