import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link, getPathname } from "@/i18n/navigation";
import { Container } from "@/components/site/Container";
import { JsonLd } from "@/components/site/JsonLd";
import { getPublishedPostBySlug, getPublishedPostSlugs } from "@/lib/data/posts";
import { formatDate } from "@/lib/utils";
import { SITE_URL, SITE_NAME } from "@/lib/constants";
import { buildBreadcrumbJsonLd } from "@/lib/breadcrumb";
import { buildAlternates } from "@/lib/seo";

export async function generateStaticParams() {
  const slugs = await getPublishedPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) return {};

  const title =
    post.meta_title ?? (locale === "tr" ? post.title_tr : (post.title_en ?? post.title_tr));
  const description =
    post.meta_description ??
    (locale === "tr" ? post.excerpt_tr : (post.excerpt_en ?? post.excerpt_tr)) ??
    undefined;

  return {
    title,
    description,
    alternates: buildAlternates(locale, {
      pathname: "/blog/[slug]",
      params: { slug },
    }),
    openGraph: post.cover_image_url
      ? { images: [{ url: post.cover_image_url }] }
      : undefined,
  };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const [t, post] = await Promise.all([
    getTranslations("blog"),
    getPublishedPostBySlug(slug),
  ]);

  if (!post) notFound();

  const title = locale === "tr" ? post.title_tr : (post.title_en ?? post.title_tr);
  const content =
    locale === "tr" ? post.content_tr : (post.content_en ?? post.content_tr);

  const tNav = await getTranslations("nav");
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: tNav("home"), path: getPathname({ locale, href: "/" }) },
    { name: tNav("blog"), path: getPathname({ locale, href: "/blog" }) },
    {
      name: title,
      path: getPathname({
        locale,
        href: { pathname: "/blog/[slug]", params: { slug } },
      }),
    },
  ]);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: title,
          image: post.cover_image_url ? [post.cover_image_url] : undefined,
          datePublished: post.published_at,
          dateModified: post.updated_at,
          publisher: {
            "@type": "Organization",
            name: SITE_NAME,
            url: SITE_URL,
          },
        }}
      />
      <JsonLd data={breadcrumbJsonLd} />

      <article className="py-16 sm:py-20">
        <Container className="max-w-3xl">
          <Link
            href="/blog"
            className="text-sm font-medium text-bordo-500 hover:text-gold-600"
          >
            ← {t("backToList")}
          </Link>

          {post.published_at && (
            <p className="mt-6 text-xs font-medium uppercase tracking-wide text-gold-600">
              {t("publishedOn")} {formatDate(post.published_at, locale)}
            </p>
          )}
          <h1 className="mt-3 font-serif text-3xl text-bordo-950 sm:text-4xl">
            {title}
          </h1>

          {post.cover_image_url && (
            <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl">
              <Image
                src={post.cover_image_url}
                alt={title}
                fill
                sizes="768px"
                className="object-cover"
                priority
              />
            </div>
          )}

          <div
            className="prose prose-neutral mt-10 max-w-none prose-headings:font-serif prose-headings:text-bordo-950 prose-a:text-bordo-500"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </Container>
      </article>
    </>
  );
}
