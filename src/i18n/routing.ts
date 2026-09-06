import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["tr", "en", "ru"],
  defaultLocale: "tr",
  localePrefix: "as-needed",
  pathnames: {
    "/": "/",
    "/hakkimizda": {
      tr: "/hakkimizda",
      en: "/about",
      ru: "/o-nas",
    },
    "/hizmetler": {
      tr: "/hizmetler",
      en: "/practice-areas",
      ru: "/uslugi",
    },
    "/hizmetler/[slug]": {
      tr: "/hizmetler/[slug]",
      en: "/practice-areas/[slug]",
      ru: "/uslugi/[slug]",
    },
    "/galeri": {
      tr: "/galeri",
      en: "/gallery",
      ru: "/galereya",
    },
    "/blog": {
      tr: "/blog",
      en: "/blog",
      ru: "/blog",
    },
    "/blog/[slug]": {
      tr: "/blog/[slug]",
      en: "/blog/[slug]",
      ru: "/blog/[slug]",
    },
    "/iletisim": {
      tr: "/iletisim",
      en: "/contact",
      ru: "/kontakty",
    },
  },
});

export type AppLocale = (typeof routing.locales)[number];
