import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link, getPathname } from "@/i18n/navigation";
import { Container } from "@/components/site/Container";
import { JsonLd } from "@/components/site/JsonLd";
import { ArticleContent } from "@/components/site/ArticleContent";
import { AuthorByline } from "@/components/site/AuthorByline";
import { ShareButtons } from "@/components/site/ShareButtons";
import { RelatedArticleCard } from "@/components/site/RelatedArticleCard";
import {
  getActiveAnnouncementBySlug,
  getActiveAnnouncementSlugs,
  getRelatedAnnouncements,
} from "@/lib/data/announcements";
import { formatDate } from "@/lib/utils";
import { SITE_URL } from "@/lib/constants";
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

  const relatedAnnouncements = await getRelatedAnnouncements(slug, 3);

  const title =
    locale === "tr"
      ? announcement.title_tr
      : (announcement.title_en ?? announcement.title_tr);
  const content =
    locale === "tr"
      ? announcement.content_tr
      : (announcement.content_en ?? announcement.content_tr);
  const canonicalUrl = `${SITE_URL}${getPathname({
    locale,
    href: { pathname: "/duyurular/[slug]", params: { slug } },
  })}`;

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

        <ArticleContent html={content} tocLabel={t("tableOfContents")} />

        <ShareButtons
          url={canonicalUrl}
          title={title}
          label={t("shareLabel")}
          copyLabel={t("copyLink")}
          copiedLabel={t("linkCopied")}
        />

        <AuthorByline
          text={t("authorByline")}
          linkLabel={t("authorLinkLabel")}
        />
      </Container>

      {relatedAnnouncements.length > 0 && (
        <Container className="mt-16 max-w-5xl">
          <h2 className="font-serif text-2xl text-bordo-950">
            {t("relatedTitle")}
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedAnnouncements.map((related) => (
              <RelatedArticleCard
                key={related.id}
                hrefPathname="/duyurular/[slug]"
                slug={related.slug}
                title={
                  locale === "tr"
                    ? related.title_tr
                    : (related.title_en ?? related.title_tr)
                }
                excerpt={
                  locale === "tr"
                    ? related.excerpt_tr
                    : (related.excerpt_en ?? related.excerpt_tr)
                }
                coverImageUrl={related.cover_image_url}
                publishedAt={related.published_at}
                locale={locale}
                readMoreLabel={t("readMore")}
              />
            ))}
          </div>
        </Container>
      )}
    </article>
  );
}
