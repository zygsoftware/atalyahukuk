import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["tr", "en", "ru", "de"],
  defaultLocale: "tr",
  localePrefix: "as-needed",
  pathnames: {
    "/": "/",
    "/hakkimizda": {
      tr: "/hakkimizda",
      en: "/about",
      ru: "/o-nas",
      de: "/ueber-uns",
    },
    "/hizmetler": {
      tr: "/hizmetler",
      en: "/practice-areas",
      ru: "/uslugi",
      de: "/leistungen",
    },
    "/hizmetler/[slug]": {
      tr: "/hizmetler/[slug]",
      en: "/practice-areas/[slug]",
      ru: "/uslugi/[slug]",
      de: "/leistungen/[slug]",
    },
    "/galeri": {
      tr: "/galeri",
      en: "/gallery",
      ru: "/galereya",
      de: "/galerie",
    },
    "/blog": {
      tr: "/blog",
      en: "/blog",
      ru: "/blog",
      de: "/blog",
    },
    "/blog/[slug]": {
      tr: "/blog/[slug]",
      en: "/blog/[slug]",
      ru: "/blog/[slug]",
      de: "/blog/[slug]",
    },
    "/iletisim": {
      tr: "/iletisim",
      en: "/contact",
      ru: "/kontakty",
      de: "/kontakt",
    },
  },
});

export type AppLocale = (typeof routing.locales)[number];
