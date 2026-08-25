import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CheckCircle2 } from "lucide-react";
import { Link, getPathname } from "@/i18n/navigation";
import { Container } from "@/components/site/Container";
import { SectionHeading } from "@/components/site/SectionHeading";
import { JsonLd } from "@/components/site/JsonLd";
import { ServiceCard } from "@/components/site/ServiceCard";
import { FaqAccordion } from "@/components/site/FaqAccordion";
import {
  SERVICE_IMAGES,
  SERVICE_SLUGS,
  type ServiceSlug,
  SITE_URL,
} from "@/lib/constants";
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
  const topics = t.raw(`items.${slug}.topics`) as string[];
  const faqItems = t.raw(`items.${slug}.faq`) as {
    question: string;
    answer: string;
  }[];
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
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqItems.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.answer,
            },
          })),
        }}
      />

      <section className="relative overflow-hidden bg-bordo-950 py-16 sm:py-20">
        <Image
          src={SERVICE_IMAGES[slug]}
          alt={t(`items.${slug}.title`)}
          fill
          sizes="100vw"
          priority
          className="absolute inset-0 z-0 object-cover opacity-25"
        />
        <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-br from-bordo-950/90 via-bordo-950/85 to-bordo-950" />
        <div className="pointer-events-none absolute -right-20 -top-20 z-0 h-72 w-72 rounded-full bg-gold-600/10 blur-3xl" />
        <Container className="relative z-10">
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
            <div className="relative aspect-[16/9] overflow-hidden rounded-2xl">
              <Image
                src={SERVICE_IMAGES[slug]}
                alt={t(`items.${slug}.title`)}
                fill
                sizes="(min-width: 1024px) 700px, 100vw"
                className="object-cover"
              />
            </div>

            <p className="mt-10 text-lg leading-relaxed text-ink/75">
              {t(`items.${slug}.description`)}
            </p>
            <p className="mt-5 leading-relaxed text-ink/70">
              {t(`items.${slug}.detailBody`)}
            </p>

            <h2 className="mt-12 font-serif text-xl text-bordo-950">
              {t("topicsTitle")}
            </h2>
            <ul className="mt-5 grid gap-x-6 gap-y-3 sm:grid-cols-2">
              {topics.map((topic) => (
                <li
                  key={topic}
                  className="flex items-start gap-2.5 text-sm leading-relaxed text-ink/75"
                >
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" />
                  {topic}
                </li>
              ))}
            </ul>

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

      <section className="py-16 sm:py-20">
        <Container className="max-w-3xl">
          <SectionHeading align="center" title={t("faqTitle")} className="mx-auto" />
          <div className="mt-10">
            <FaqAccordion
              items={faqItems.map((item, i) => ({
                id: `${slug}-faq-${i}`,
                question: item.question,
                answer: item.answer,
              }))}
            />
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
