import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/site/Container";
import { JsonLd } from "@/components/site/JsonLd";
import { SERVICE_SLUGS, type ServiceSlug, SITE_URL } from "@/lib/constants";

export function generateStaticParams() {
  return SERVICE_SLUGS.map((slug) => ({ slug }));
}

function isServiceSlug(slug: string): slug is ServiceSlug {
  return (SERVICE_SLUGS as readonly string[]).includes(slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isServiceSlug(slug)) return {};
  const t = await getTranslations({ locale, namespace: "services" });
  return {
    title: t(`items.${slug}.title`),
    description: t(`items.${slug}.shortDescription`),
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isServiceSlug(slug)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations("services");

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          serviceType: t(`items.${slug}.title`),
          provider: {
            "@type": "LegalService",
            name: "Atalya Hukuk Bürosu",
            url: SITE_URL,
          },
          description: t(`items.${slug}.description`),
        }}
      />

      <section className="bg-bordo-950 py-16 sm:py-20">
        <Container>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-300">
            {t("eyebrow")}
          </p>
          <h1 className="mt-3 font-serif text-3xl text-cream sm:text-4xl">
            {t(`items.${slug}.title`)}
          </h1>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container className="max-w-3xl">
          <p className="text-lg leading-relaxed text-ink/75">
            {t(`items.${slug}.description`)}
          </p>

          <div className="mt-12 flex flex-wrap gap-4">
            <Link
              href="/iletisim"
              className="rounded-full bg-bordo-500 px-6 py-3 text-sm font-semibold text-cream transition hover:bg-bordo-600"
            >
              {t("contactCta")}
            </Link>
            <Link
              href="/hizmetler"
              className="rounded-full border border-bordo-300 px-6 py-3 text-sm font-semibold text-bordo-500 transition hover:bg-bordo-50"
            >
              {t("backToList")}
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
