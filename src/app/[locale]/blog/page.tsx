import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/site/Container";
import { SectionHeading } from "@/components/site/SectionHeading";
import { PostCard } from "@/components/site/PostCard";
import { getPublishedPosts } from "@/lib/data/posts";
import { buildAlternates } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });
  return {
    title: t("title"),
    description: t("subtitle"),
    alternates: buildAlternates(locale, "/blog"),
  };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [t, posts] = await Promise.all([
    getTranslations("blog"),
    getPublishedPosts(),
  ]);

  return (
    <>
      <section className="relative overflow-hidden bg-bordo-950 py-16 sm:py-20">
        <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-gold-600/10 blur-3xl" />
        <Container className="relative">
          <SectionHeading
            eyebrow={t("eyebrow")}
            title={t("title")}
            subtitle={t("subtitle")}
            light
            level={1}
          />
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          {posts.length === 0 ? (
            <p className="text-center text-ink/60">{t("empty")}</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  slug={post.slug}
                  title={
                    locale === "tr"
                      ? post.title_tr
                      : (post.title_en ?? post.title_tr)
                  }
                  excerpt={
                    locale === "tr"
                      ? post.excerpt_tr
                      : (post.excerpt_en ?? post.excerpt_tr)
                  }
                  coverImageUrl={post.cover_image_url}
                  publishedAt={post.published_at}
                  locale={locale}
                  readMoreLabel={t("readMore")}
                />
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
