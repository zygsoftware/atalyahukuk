import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/site/Container";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Link } from "@/i18n/navigation";
import { getActiveAnnouncements } from "@/lib/data/announcements";
import { formatDate } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "announcements" });
  return { title: t("title") };
}

export default async function AnnouncementsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [t, announcements] = await Promise.all([
    getTranslations("announcements"),
    getActiveAnnouncements(),
  ]);

  return (
    <>
      <section className="bg-bordo-950 py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow={t("eyebrow")}
            title={t("title")}
            subtitle={t("subtitle")}
            light
          />
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container className="max-w-3xl">
          {announcements.length === 0 ? (
            <p className="text-center text-ink/60">{t("empty")}</p>
          ) : (
            <ul className="space-y-4">
              {announcements.map((item) => (
                <li key={item.id}>
                  <Link
                    href={{
                      pathname: "/duyurular/[slug]",
                      params: { slug: item.slug },
                    }}
                    className="flex flex-col gap-2 rounded-2xl border border-bordo-100 bg-white p-6 transition hover:border-gold-300 hover:shadow-sm sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      {item.is_pinned && (
                        <span className="mb-2 inline-block rounded-full bg-gold-100 px-3 py-1 text-xs font-semibold text-gold-700">
                          {t("pinned")}
                        </span>
                      )}
                      <h2 className="font-serif text-lg text-bordo-950">
                        {locale === "tr"
                          ? item.title_tr
                          : (item.title_en ?? item.title_tr)}
                      </h2>
                    </div>
                    <span className="shrink-0 text-xs font-medium uppercase tracking-wide text-gold-600">
                      {formatDate(item.published_at, locale)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Container>
      </section>
    </>
  );
}
