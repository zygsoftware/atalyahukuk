import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/site/Container";
import { SectionHeading } from "@/components/site/SectionHeading";
import { GalleryClient } from "@/components/site/GalleryClient";
import { getActiveGalleryImages } from "@/lib/data/gallery";
import { GALLERY_CATEGORIES } from "@/lib/constants";
import type { GalleryCategory } from "@/lib/supabase/types";
import { buildAlternates } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "gallery" });
  return {
    title: t("title"),
    description: t("subtitle"),
    alternates: buildAlternates(locale, "/galeri"),
  };
}

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [t, images] = await Promise.all([
    getTranslations("gallery"),
    getActiveGalleryImages(),
  ]);

  const categoryLabels = Object.fromEntries(
    GALLERY_CATEGORIES.map((cat) => [cat, t(`categories.${cat}`)]),
  ) as Record<GalleryCategory, string>;

  const items = images.map((img) => ({
    id: img.id,
    imageUrl: img.image_url,
    caption: locale === "tr" ? img.caption_tr : (img.caption_en ?? img.caption_tr),
    category: img.category,
  }));

  return (
    <>
      <section className="relative overflow-hidden bg-bordo-950 py-16 sm:py-20">
        <Image
          src="/images/stock/hukuk-burosu-ekip-calisma-ortami.jpg"
          alt="Atalya Hukuk Bürosu ekip çalışma ortamı galerisi"
          fill
          sizes="100vw"
          className="absolute inset-0 z-0 object-cover opacity-25"
        />
        <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-bordo-950/90 via-bordo-950/85 to-bordo-950" />
        <div className="pointer-events-none absolute -right-20 -top-24 z-0 h-72 w-72 rounded-full bg-gold-600/10 blur-3xl" />
        <Container className="relative z-10">
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
          {items.length === 0 ? (
            <p className="text-center text-ink/60">{t("empty")}</p>
          ) : (
            <GalleryClient
              images={items}
              categoryLabels={categoryLabels}
              allLabel={t("filterAll")}
              fallbackAlt={t("imageAlt")}
              closeLabel={t("close")}
              previousLabel={t("previous")}
              nextLabel={t("next")}
            />
          )}
        </Container>
      </section>
    </>
  );
}
