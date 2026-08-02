import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/site/Container";
import { SectionHeading } from "@/components/site/SectionHeading";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return { title: t("eyebrow"), description: t("intro") };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");

  const values = [t("value1"), t("value2"), t("value3"), t("value4")];

  return (
    <>
      <section className="bg-bordo-950 py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow={t("eyebrow")} title={t("title")} light />
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container className="max-w-3xl">
          <p className="text-lg leading-relaxed text-ink/75">{t("intro")}</p>

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

          <div className="mt-14">
            <h2 className="font-serif text-2xl text-bordo-950">
              {t("teamTitle")}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink/70">
              {t("teamBody")}
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
