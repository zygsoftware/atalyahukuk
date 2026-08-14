import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/site/Container";
import { SectionHeading } from "@/components/site/SectionHeading";
import { ServiceCard } from "@/components/site/ServiceCard";
import { PostCard } from "@/components/site/PostCard";
import { TeamCard } from "@/components/site/TeamCard";
import { HeroSlider } from "@/components/site/HeroSlider";
import { TestimonialCard } from "@/components/site/TestimonialCard";
import { FaqAccordion } from "@/components/site/FaqAccordion";
import { Reveal } from "@/components/site/Reveal";
import { JsonLd } from "@/components/site/JsonLd";
import {
  SERVICE_SLUGS,
  TEAM_MEMBER_KEYS,
  TEAM_PHOTOS,
  PROCESS_STEP_KEYS,
  TESTIMONIAL_KEYS,
  FAQ_KEYS,
} from "@/lib/constants";
import { getPublishedPosts } from "@/lib/data/posts";
import { getActiveGalleryImages } from "@/lib/data/gallery";
import { getSiteSettings } from "@/lib/data/site-settings";
import { SITE_URL, SITE_NAME } from "@/lib/constants";
import { buildAlternates } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });
  const tMeta = await getTranslations({ locale, namespace: "meta" });
  return {
    title: t("heroTitle"),
    description: tMeta("defaultDescription"),
    alternates: buildAlternates(locale, "/"),
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [
    t,
    tServices,
    tBlog,
    tTeam,
    tProcess,
    tTestimonials,
    tGallery,
    tFaq,
    posts,
    galleryImages,
    settings,
  ] = await Promise.all([
    getTranslations("home"),
    getTranslations("services"),
    getTranslations("blog"),
    getTranslations("team"),
    getTranslations("process"),
    getTranslations("testimonials"),
    getTranslations("gallery"),
    getTranslations("faq"),
    getPublishedPosts(),
    getActiveGalleryImages(),
    getSiteSettings(),
  ]);

  const featuredServices = SERVICE_SLUGS.slice(0, 6);
  const latestPosts = posts.slice(0, 3);
  const featuredGalleryImages = galleryImages.slice(0, 4);

  const address = locale === "tr" ? settings?.address_tr : settings?.address_en;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "LegalService",
          "@id": `${SITE_URL}/#organization`,
          name: SITE_NAME,
          url: SITE_URL,
          image: `${SITE_URL}/logo.png`,
          logo: `${SITE_URL}/logo.png`,
          priceRange: "$$",
          areaServed: "Antalya, Türkiye",
          telephone: settings?.phone || undefined,
          email: settings?.email || undefined,
          address: {
            "@type": "PostalAddress",
            streetAddress: address || undefined,
            addressLocality: "Antalya",
            addressCountry: "TR",
          },
          sameAs: [settings?.instagram_url, settings?.linkedin_url].filter(
            Boolean,
          ),
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQ_KEYS.map((key) => ({
            "@type": "Question",
            name: tFaq(`items.${key}.question`),
            acceptedAnswer: {
              "@type": "Answer",
              text: tFaq(`items.${key}.answer`),
            },
          })),
        }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-bordo-950">
        <Image
          src="/images/stock/antalya-hukuk-burosu-danismanlik-hero.jpg"
          alt="Antalya'da hukuki danışmanlık veren Atalya Hukuk Bürosu avukatları"
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 z-0 object-cover opacity-30"
        />
        <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-bordo-950/92 via-bordo-950/90 to-bordo-950" />
        <div className="pointer-events-none absolute -right-24 -top-24 z-0 h-96 w-96 rounded-full bg-gold-600/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 left-1/3 z-0 h-96 w-96 rounded-full bg-bordo-500/20 blur-3xl" />
        <Container className="relative z-10 grid gap-12 py-20 sm:py-28 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="animate-hero-in">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gold-300">
              {t("heroEyebrow")}
            </p>
            <h1 className="mt-4 font-serif text-4xl leading-tight text-cream sm:text-5xl lg:text-6xl">
              {t("heroTitle")}
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-cream/75 sm:text-lg">
              {t("heroSubtitle")}
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href="/iletisim"
                className="rounded-full bg-gold-500 px-7 py-3.5 text-sm font-semibold text-bordo-950 transition-all duration-300 hover:scale-105 hover:bg-gold-400 hover:shadow-lg hover:shadow-gold-500/30 active:scale-95"
              >
                {t("heroPrimaryCta")}
              </Link>
              <Link
                href="/hizmetler"
                className="rounded-full border border-cream/30 px-7 py-3.5 text-sm font-semibold text-cream transition-all duration-300 hover:scale-105 hover:border-cream hover:bg-cream/5 active:scale-95"
              >
                {t("heroSecondaryCta")}
              </Link>
            </div>
          </div>
          <div
            className="relative mx-auto w-full max-w-sm animate-hero-in"
            style={{ animationDelay: "150ms" }}
          >
            <HeroSlider
              slides={[
                {
                  type: "logo",
                  src: "/logo-mark.png",
                  alt: SITE_NAME,
                  radius: "50%",
                },
                {
                  type: "photo",
                  src: "/images/stock/atalya-hukuk-burosu-musteri-gorusmesi.jpg",
                  alt: "Atalya Hukuk Bürosu ekibi müvekkil görüşmesinde",
                  radius: "3rem",
                },
                {
                  type: "photo",
                  src: "/images/stock/musteri-danisman-belge-inceleme.jpg",
                  alt: "Müvekkil ve danışman birlikte dosya inceliyor",
                  radius: "60% 40% 55% 45% / 55% 45% 60% 40%",
                },
                {
                  type: "photo",
                  src: "/images/stock/hukuk-sozlesme-imza-belge.jpg",
                  alt: "Hukuki sözleşme ve belge imza süreci",
                  radius: "1rem 4rem 1rem 4rem",
                },
              ]}
            />
          </div>
        </Container>

        <Container className="relative grid grid-cols-2 gap-6 border-t border-cream/10 py-10 sm:grid-cols-4">
          {[
            [t("statsExperience"), "10+"],
            [t("statsCases"), "500+"],
            [t("statsClients"), "300+"],
            [t("statsAreas"), "8"],
          ].map(([label, value]) => (
            <div key={label} className="text-center sm:text-left">
              <p className="font-serif text-3xl text-gold-300">{value}</p>
              <p className="mt-1 text-xs uppercase tracking-wide text-cream/60">
                {label}
              </p>
            </div>
          ))}
        </Container>
      </section>

      {/* Hakkımızda teaser */}
      <section className="py-20 sm:py-24">
        <Reveal>
        <Container className="grid items-center gap-12 lg:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
            <Image
              src="/images/stock/atalya-hukuk-burosu-musteri-gorusmesi.jpg"
              alt="Atalya Hukuk Bürosu ekibi müvekkil görüşmesinde"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div>
            <SectionHeading
              eyebrow={t("heroEyebrow")}
              title={t("aboutTeaserTitle")}
              subtitle={t("aboutTeaserBody")}
            />
            <Link
              href="/hakkimizda"
              className="mt-6 inline-block text-sm font-semibold text-bordo-500 hover:text-gold-600"
            >
              {t("aboutTeaserCta")} →
            </Link>
          </div>
        </Container>
        </Reveal>
      </section>

      {/* Hizmetler teaser */}
      <section className="bg-bordo-50/60 py-20 sm:py-24">
        <Reveal>
        <Container>
          <SectionHeading
            align="center"
            eyebrow={tServices("eyebrow")}
            title={t("servicesTeaserTitle")}
            subtitle={t("servicesTeaserSubtitle")}
            className="mx-auto"
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredServices.map((slug) => (
              <ServiceCard
                key={slug}
                slug={slug}
                title={tServices(`items.${slug}.title`)}
                description={tServices(`items.${slug}.shortDescription`)}
                cta={tServices("detailCta")}
              />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/hizmetler"
              className="inline-block rounded-full border border-bordo-300 px-6 py-3 text-sm font-semibold text-bordo-500 transition-all duration-300 hover:scale-105 hover:bg-bordo-500 hover:text-cream active:scale-95"
            >
              {t("servicesTeaserCta")}
            </Link>
          </div>
        </Container>
        </Reveal>
      </section>

      {/* Nasıl Çalışıyoruz */}
      <section className="py-20 sm:py-24">
        <Reveal>
        <Container>
          <SectionHeading
            align="center"
            title={t("processTitle")}
            subtitle={t("processSubtitle")}
            className="mx-auto"
          />
          <div className="relative mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div className="pointer-events-none absolute top-7 right-0 left-0 hidden border-t border-dashed border-gold-300 lg:block" />
            {PROCESS_STEP_KEYS.map((key, index) => (
              <div key={key} className="relative text-center">
                <div className="relative z-10 mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-cream ring-2 ring-bordo-500">
                  <span className="font-serif text-xl text-bordo-500">
                    {index + 1}
                  </span>
                </div>
                <h3 className="mt-5 font-serif text-lg text-bordo-950">
                  {tProcess(`steps.${key}.title`)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/65">
                  {tProcess(`steps.${key}.body`)}
                </p>
              </div>
            ))}
          </div>
        </Container>
        </Reveal>
      </section>

      {/* Neden biz */}
      <section className="bg-bordo-50/60 py-20 sm:py-24">
        <Reveal>
        <Container>
          <SectionHeading
            align="center"
            title={t("whyUsTitle")}
            className="mx-auto"
          />
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-bordo-500 font-serif text-xl text-cream">
                  {i}
                </div>
                <h3 className="mt-5 font-serif text-lg text-bordo-950">
                  {t(`whyUsItem${i}Title` as "whyUsItem1Title")}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/65">
                  {t(`whyUsItem${i}Body` as "whyUsItem1Body")}
                </p>
              </div>
            ))}
          </div>
        </Container>
        </Reveal>
      </section>

      {/* Ekibimiz */}
      <section className="py-20 sm:py-24">
        <Reveal>
        <Container>
          <SectionHeading
            align="center"
            title={t("teamTitle")}
            subtitle={t("teamSubtitle")}
            className="mx-auto"
          />
          <div className="mx-auto mt-12 grid max-w-xl gap-6 sm:grid-cols-2">
            {TEAM_MEMBER_KEYS.map((key) => (
              <TeamCard
                key={key}
                name={tTeam(`members.${key}.name`)}
                title={tTeam(`members.${key}.title`)}
                photoUrl={TEAM_PHOTOS[key]}
              />
            ))}
          </div>
        </Container>
        </Reveal>
      </section>

      {/* Müvekkil yorumları */}
      <section className="bg-bordo-50/60 py-20 sm:py-24">
        <Reveal>
        <Container>
          <SectionHeading
            align="center"
            title={t("testimonialsTitle")}
            subtitle={t("testimonialsSubtitle")}
            className="mx-auto"
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {TESTIMONIAL_KEYS.map((key) => (
              <TestimonialCard
                key={key}
                quote={tTestimonials(`items.${key}.quote`)}
                name={tTestimonials(`items.${key}.name`)}
                role={tTestimonials(`items.${key}.role`)}
              />
            ))}
          </div>
        </Container>
        </Reveal>
      </section>

      {/* SSS */}
      <section className="py-20 sm:py-24">
        <Reveal>
        <Container className="max-w-3xl">
          <SectionHeading
            align="center"
            title={t("faqTitle")}
            subtitle={t("faqSubtitle")}
            className="mx-auto"
          />
          <div className="mt-12">
            <FaqAccordion
              items={FAQ_KEYS.map((key) => ({
                id: key,
                question: tFaq(`items.${key}.question`),
                answer: tFaq(`items.${key}.answer`),
              }))}
            />
          </div>
        </Container>
        </Reveal>
      </section>

      {/* Galeri teaser */}
      {featuredGalleryImages.length > 0 && (
        <section className="py-20 sm:py-24">
          <Reveal>
          <Container>
            <SectionHeading
              align="center"
              eyebrow={tGallery("eyebrow")}
              title={tGallery("title")}
              subtitle={tGallery("subtitle")}
              className="mx-auto"
            />
            <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
              {featuredGalleryImages.map((img) => (
                <Link
                  key={img.id}
                  href="/galeri"
                  className="group relative aspect-square overflow-hidden rounded-xl bg-bordo-50"
                >
                  <Image
                    src={img.image_url}
                    alt={
                      (locale === "tr" ? img.caption_tr : img.caption_en) ??
                      tGallery("imageAlt")
                    }
                    fill
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                </Link>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link
                href="/galeri"
                className="inline-block rounded-full border border-bordo-300 px-6 py-3 text-sm font-semibold text-bordo-500 transition-all duration-300 hover:scale-105 hover:bg-bordo-500 hover:text-cream active:scale-95"
              >
                {tGallery("title")} →
              </Link>
            </div>
          </Container>
          </Reveal>
        </section>
      )}

      {/* Blog teaser */}
      {latestPosts.length > 0 && (
        <section className="bg-bordo-50/60 py-20 sm:py-24">
          <Reveal>
          <Container>
            <SectionHeading
              align="center"
              eyebrow={tBlog("eyebrow")}
              title={t("blogTeaserTitle")}
              subtitle={t("blogTeaserSubtitle")}
              className="mx-auto"
            />
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {latestPosts.map((post) => (
                <PostCard
                  key={post.id}
                  slug={post.slug}
                  title={locale === "tr" ? post.title_tr : (post.title_en ?? post.title_tr)}
                  excerpt={
                    locale === "tr"
                      ? post.excerpt_tr
                      : (post.excerpt_en ?? post.excerpt_tr)
                  }
                  coverImageUrl={post.cover_image_url}
                  publishedAt={post.published_at}
                  locale={locale}
                  readMoreLabel={tBlog("readMore")}
                />
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link
                href="/blog"
                className="inline-block rounded-full border border-bordo-300 px-6 py-3 text-sm font-semibold text-bordo-500 transition-all duration-300 hover:scale-105 hover:bg-bordo-500 hover:text-cream active:scale-95"
              >
                {t("blogTeaserCta")}
              </Link>
            </div>
          </Container>
          </Reveal>
        </section>
      )}

      {/* CTA */}
      <section className="relative overflow-hidden bg-bordo-950 py-20 sm:py-24">
        <div className="pointer-events-none absolute -left-24 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-gold-600/10 blur-3xl" />
        <Reveal>
        <Container className="relative text-center">
          <SectionHeading
            align="center"
            title={t("ctaTitle")}
            subtitle={t("ctaSubtitle")}
            light
            className="mx-auto"
          />
          <Link
            href="/iletisim"
            className="mt-8 inline-block rounded-full bg-gold-500 px-8 py-4 text-sm font-semibold text-bordo-950 transition-all duration-300 hover:scale-105 hover:bg-gold-400 hover:shadow-lg hover:shadow-gold-500/30 active:scale-95"
          >
            {t("ctaButton")}
          </Link>
        </Container>
        </Reveal>
      </section>
    </>
  );
}
