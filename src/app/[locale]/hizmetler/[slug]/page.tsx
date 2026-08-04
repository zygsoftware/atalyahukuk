import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CheckCircle2 } from "lucide-react";
import { Link, getPathname } from "@/i18n/navigation";
import { Container } from "@/components/site/Container";
import { SectionHeading } from "@/components/site/SectionHeading";
import { JsonLd } from "@/components/site/JsonLd";
import { ServiceCard } from "@/components/site/ServiceCard";
import { SERVICE_SLUGS, type ServiceSlug, SITE_URL } from "@/lib/constants";
import { SERVICE_ICONS } from "@/lib/service-icons";
import { buildBreadcrumbJsonLd } from "@/lib/breadcrumb";
import { buildAlternates } from "@/lib/seo";

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
    alternates: buildAlternates(locale, {
      pathname: "/hizmetler/[slug]",
      params: { slug },
    }),
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

  const Icon = SERVICE_ICONS[slug];
  const benefits = t.raw(`items.${slug}.benefits`) as string[];
  const relatedSlugs = SERVICE_SLUGS.filter((s) => s !== slug).slice(0, 3);

  const tNav = await getTranslations("nav");
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: tNav("home"), path: getPathname({ locale, href: "/" }) },
    {
      name: tNav("services"),
      path: getPathname({ locale, href: "/hizmetler" }),
    },
    {
      name: t(`items.${slug}.title`),
      path: getPathname({
        locale,
        href: { pathname: "/hizmetler/[slug]", params: { slug } },
      }),
    },
  ]);

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
      <JsonLd data={breadcrumbJsonLd} />

      <section className="relative overflow-hidden bg-bordo-950 py-16 sm:py-20">
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-gold-600/10 blur-3xl" />
        <Container className="relative">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-500/15 text-gold-300 ring-1 ring-gold-400/30">
            <Icon className="h-7 w-7" strokeWidth={1.75} />
          </div>
          <p className="mt-5 text-sm font-semibold uppercase tracking-[0.2em] text-gold-300">
            {t("eyebrow")}
          </p>
          <h1 className="mt-3 font-serif text-3xl text-cream sm:text-4xl">
            {t(`items.${slug}.title`)}
          </h1>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container className="grid gap-14 lg:grid-cols-[1.3fr_1fr]">
          <div>
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
          </div>

          <div className="rounded-2xl border border-bordo-100 bg-bordo-50/50 p-8">
            <h2 className="font-serif text-xl text-bordo-950">
              {t("benefitsTitle")}
            </h2>
            <ul className="mt-5 space-y-4">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3">
                  <CheckCircle2
                    className="mt-0.5 h-5 w-5 shrink-0 text-gold-600"
                    strokeWidth={1.75}
                  />
                  <span className="text-sm leading-relaxed text-ink/75">
                    {benefit}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <section className="bg-bordo-50/60 py-16 sm:py-20">
        <Container>
          <SectionHeading title={t("relatedTitle")} />
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {relatedSlugs.map((relatedSlug) => (
              <ServiceCard
                key={relatedSlug}
                slug={relatedSlug}
                title={t(`items.${relatedSlug}.title`)}
                description={t(`items.${relatedSlug}.shortDescription`)}
                cta={t("detailCta")}
              />
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
