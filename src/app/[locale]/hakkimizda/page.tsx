import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/site/Container";
import { SectionHeading } from "@/components/site/SectionHeading";
import { TeamCard } from "@/components/site/TeamCard";
import { Reveal } from "@/components/site/Reveal";
import { Link } from "@/i18n/navigation";
import { TEAM_MEMBER_KEYS, TEAM_PHOTOS } from "@/lib/constants";
import { buildAlternates } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return {
    title: t("eyebrow"),
    description: t("metaDescription"),
    alternates: buildAlternates(locale, "/hakkimizda"),
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [t, tTeam] = await Promise.all([
    getTranslations("about"),
    getTranslations("team"),
  ]);

  const values = [t("value1"), t("value2"), t("value3"), t("value4")];

  return (
    <>
      <section className="relative overflow-hidden bg-bordo-950 py-16 sm:py-20">
        <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-gold-600/10 blur-3xl" />
        <Container className="relative">
          <SectionHeading
            eyebrow={t("eyebrow")}
            title={t("title")}
            light
            level={1}
          />
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container className="max-w-4xl">
          <div className="relative aspect-[21/9] overflow-hidden rounded-3xl">
            <Image
              src="/images/stock/atalya-hukuk-burosu-antalya-ofis.jpg"
              alt="Atalya Hukuk Bürosu Antalya ofisinde müvekkil görüşmesi"
              fill
              sizes="(min-width: 1024px) 900px, 100vw"
              className="object-cover"
            />
          </div>
        </Container>
      </section>

      <section className="pb-16 sm:pb-20">
        <Container className="max-w-3xl">
          <p className="text-lg leading-relaxed text-ink/75">{t("intro")}</p>

          <div className="mt-14">
            <h2 className="font-serif text-2xl text-bordo-950">
              {t("approachTitle")}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink/70">
              {t("approachBody")}
            </p>
          </div>

          <div className="mt-14 rounded-2xl border border-bordo-100 bg-bordo-50/50 p-7 sm:p-9">
            <h2 className="font-serif text-2xl text-bordo-950">
              {t("localTitle")}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink/70">
              {t("localBody")}
            </p>
          </div>

          <div className="relative mt-14 aspect-[16/9] overflow-hidden rounded-2xl">
            <Image
              src="/images/stock/hukuk-sozlesme-imza-belge.jpg"
              alt="Hukuki sözleşme ve belge imza süreci"
              fill
              sizes="(min-width: 1024px) 768px, 100vw"
              className="object-cover"
            />
          </div>

          <div className="mt-14">
            <h2 className="font-serif text-2xl text-bordo-950">
              {t("expertiseTitle")}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink/70">
              {t("expertiseBody")}
            </p>
            <Link
              href="/hizmetler"
              className="mt-4 inline-block text-sm font-semibold text-bordo-500 transition hover:text-gold-600"
            >
              {t("expertiseCta")} →
            </Link>
          </div>

          <div className="mt-14 grid gap-10 sm:grid-cols-2">
            <div>
              <h2 className="font-serif text-2xl text-bordo-950">
                {t("missionTitle")}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-ink/70">
                {t("missionBody")}
              </p>
            </div>
            <div>
              <h2 className="font-serif text-2xl text-bordo-950">
                {t("visionTitle")}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-ink/70">
                {t("visionBody")}
              </p>
            </div>
          </div>

          <div className="mt-14">
            <h2 className="font-serif text-2xl text-bordo-950">
              {t("valuesTitle")}
            </h2>
            <ul className="mt-5 grid gap-4 sm:grid-cols-2">
              {values.map((value) => (
                <li
                  key={value}
                  className="flex items-center gap-3 rounded-xl border border-bordo-100 bg-white px-5 py-4 text-sm font-medium text-ink/80"
                >
                  <span className="h-2 w-2 shrink-0 rounded-full bg-gold-500" />
                  {value}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <section className="bg-bordo-50/60 py-16 sm:py-20">
        <Reveal>
        <Container>
          <SectionHeading
            align="center"
            title={t("teamTitle")}
            subtitle={t("teamBody")}
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

      <section className="pb-16 sm:pb-20">
        <Container className="max-w-4xl">
          <div className="relative aspect-[21/9] overflow-hidden rounded-3xl">
            <Image
              src="/images/stock/musteri-danisman-belge-inceleme.jpg"
              alt="Müvekkil ve danışman birlikte dosya inceliyor"
              fill
              sizes="(min-width: 1024px) 900px, 100vw"
              className="object-cover"
            />
          </div>
        </Container>
      </section>
    </>
  );
}
