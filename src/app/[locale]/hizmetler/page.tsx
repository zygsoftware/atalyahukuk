import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/site/Container";
import { SectionHeading } from "@/components/site/SectionHeading";
import { ServiceCard } from "@/components/site/ServiceCard";
import { SERVICE_SLUGS } from "@/lib/constants";
import { buildAlternates } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "services" });
  return {
    title: t("title"),
    description: t("subtitle"),
    alternates: buildAlternates(locale, "/hizmetler"),
  };
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("services");

  return (
    <>
      <section className="relative overflow-hidden bg-bordo-950 py-16 sm:py-20">
        <Image
          src="/images/stock/hukuk-hizmetleri-adalet-terazisi.jpg"
          alt="Atalya Hukuk Bürosu hukuki hizmet alanları — adalet terazisi"
          fill
          sizes="100vw"
          className="absolute inset-0 z-0 object-cover opacity-25"
        />
        <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-br from-bordo-950/90 via-bordo-950/85 to-bordo-950" />
        <div className="pointer-events-none absolute -right-10 top-10 z-0 h-36 w-36 rotate-12 rounded-3xl border border-gold-400/25 sm:h-52 sm:w-52" />
        <div className="pointer-events-none absolute right-16 top-24 z-0 h-20 w-20 -rotate-6 rounded-2xl border border-gold-400/15 sm:h-28 sm:w-28" />
        <div className="pointer-events-none absolute -bottom-28 -right-10 z-0 h-72 w-72 rounded-full bg-bordo-500/25 blur-3xl" />
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
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICE_SLUGS.map((slug) => (
              <ServiceCard
                key={slug}
                slug={slug}
                title={t(`items.${slug}.title`)}
                description={t(`items.${slug}.shortDescription`)}
                cta={t("detailCta")}
              />
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
