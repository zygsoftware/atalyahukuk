import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link, getPathname } from "@/i18n/navigation";
import { Container } from "@/components/site/Container";
import { JsonLd } from "@/components/site/JsonLd";
import {
  getActiveAnnouncementBySlug,
  getActiveAnnouncementSlugs,
} from "@/lib/data/announcements";
import { formatDate } from "@/lib/utils";
import { buildBreadcrumbJsonLd } from "@/lib/breadcrumb";
import { buildAlternates } from "@/lib/seo";

export async function generateStaticParams() {
  const slugs = await getActiveAnnouncementSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const announcement = await getActiveAnnouncementBySlug(slug);
  if (!announcement) return {};
  const content =
    locale === "tr"
      ? announcement.content_tr
      : (announcement.content_en ?? announcement.content_tr);
  return {
    title:
      locale === "tr"
        ? announcement.title_tr
        : (announcement.title_en ?? announcement.title_tr),
    description: content
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 160),
    alternates: buildAlternates(locale, {
      pathname: "/duyurular/[slug]",
      params: { slug },
    }),
  };
}

export default async function AnnouncementDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const [t, announcement] = await Promise.all([
    getTranslations("announcements"),
    getActiveAnnouncementBySlug(slug),
  ]);

  if (!announcement) notFound();

  const title =
    locale === "tr"
      ? announcement.title_tr
      : (announcement.title_en ?? announcement.title_tr);
  const content =
    locale === "tr"
      ? announcement.content_tr
      : (announcement.content_en ?? announcement.content_tr);

  const tNav = await getTranslations("nav");
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: tNav("home"), path: getPathname({ locale, href: "/" }) },
    {
      name: tNav("announcements"),
      path: getPathname({ locale, href: "/duyurular" }),
    },
    {
      name: title,
      path: getPathname({
        locale,
        href: { pathname: "/duyurular/[slug]", params: { slug } },
      }),
    },
  ]);

  return (
    <article className="py-16 sm:py-20">
      <JsonLd data={breadcrumbJsonLd} />
      <Container className="max-w-3xl">
        <Link
          href="/duyurular"
          className="text-sm font-medium text-bordo-500 hover:text-gold-600"
        >
          ← {t("backToList")}
        </Link>

        <p className="mt-6 text-xs font-medium uppercase tracking-wide text-gold-600">
          {formatDate(announcement.published_at, locale)}
        </p>
        <h1 className="mt-3 font-serif text-3xl text-bordo-950 sm:text-4xl">
          {title}
        </h1>

        <div
          className="prose prose-neutral mt-10 max-w-none prose-headings:font-serif prose-headings:text-bordo-950 prose-a:text-bordo-500"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </Container>
    </article>
  );
}
