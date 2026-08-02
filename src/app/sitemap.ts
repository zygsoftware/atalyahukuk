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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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
    for (const locale of routing.locales) {
      entries.push({
        url: absolute(locale, path),
        changeFrequency: path === "/" ? "weekly" : "monthly",
        priority: path === "/" ? 1 : 0.7,
      });
    }
  }

  for (const slug of SERVICE_SLUGS) {
    for (const locale of routing.locales) {
      entries.push({
        url: absolute(locale, { pathname: "/hizmetler/[slug]", params: { slug } }),
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  for (const slug of postSlugs) {
    for (const locale of routing.locales) {
      entries.push({
        url: absolute(locale, { pathname: "/blog/[slug]", params: { slug } }),
        changeFrequency: "yearly",
        priority: 0.5,
      });
    }
  }

  for (const slug of announcementSlugs) {
    for (const locale of routing.locales) {
      entries.push({
        url: absolute(locale, {
          pathname: "/duyurular/[slug]",
          params: { slug },
        }),
        changeFrequency: "yearly",
        priority: 0.4,
      });
    }
  }

  return entries;
}
