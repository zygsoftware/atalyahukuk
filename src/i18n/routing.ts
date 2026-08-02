import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["tr", "en"],
  defaultLocale: "tr",
  localePrefix: "always",
  pathnames: {
    "/": "/",
    "/hakkimizda": {
      tr: "/hakkimizda",
      en: "/about",
    },
    "/hizmetler": {
      tr: "/hizmetler",
      en: "/practice-areas",
    },
    "/hizmetler/[slug]": {
      tr: "/hizmetler/[slug]",
      en: "/practice-areas/[slug]",
    },
    "/blog": {
      tr: "/blog",
      en: "/blog",
    },
    "/blog/[slug]": {
      tr: "/blog/[slug]",
      en: "/blog/[slug]",
    },
    "/duyurular": {
      tr: "/duyurular",
      en: "/announcements",
    },
    "/duyurular/[slug]": {
      tr: "/duyurular/[slug]",
      en: "/announcements/[slug]",
    },
    "/iletisim": {
      tr: "/iletisim",
      en: "/contact",
    },
  },
});

export type AppLocale = (typeof routing.locales)[number];
