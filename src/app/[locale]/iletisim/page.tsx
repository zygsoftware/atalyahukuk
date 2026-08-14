import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/site/Container";
import { SectionHeading } from "@/components/site/SectionHeading";
import { ContactForm } from "@/components/site/ContactForm";
import { getSiteSettings } from "@/lib/data/site-settings";
import { buildAlternates } from "@/lib/seo";
import { toTelHref } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return {
    title: t("title"),
    description: t("subtitle"),
    alternates: buildAlternates(locale, "/iletisim"),
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [t, settings] = await Promise.all([
    getTranslations("contact"),
    getSiteSettings(),
  ]);

  const address =
    (locale === "tr" ? settings?.address_tr : settings?.address_en) ??
    t("addressPlaceholder");
  const hours =
    (locale === "tr"
      ? settings?.working_hours_tr
      : settings?.working_hours_en) ?? t("hoursPlaceholder");
  const phone = settings?.phone ?? t("phonePlaceholder");
  const email = settings?.email ?? t("emailPlaceholder");

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
        <Container className="grid gap-14 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <h2 className="font-serif text-2xl text-bordo-950">
              {t("officeTitle")}
            </h2>
            <dl className="mt-6 space-y-5 text-sm">
              <div>
                <dt className="font-medium text-gold-600">
                  {t("addressLabel")}
                </dt>
                <dd className="mt-1 text-ink/70">{address}</dd>
              </div>
              <div>
                <dt className="font-medium text-gold-600">
                  {t("phoneLabel")}
                </dt>
                <dd className="mt-1 text-ink/70">
                  <a href={toTelHref(phone)}>{phone}</a>
                </dd>
              </div>
              <div>
                <dt className="font-medium text-gold-600">
                  {t("emailLabel")}
                </dt>
                <dd className="mt-1 text-ink/70">
                  <a href={`mailto:${email}`}>{email}</a>
                </dd>
              </div>
              <div>
                <dt className="font-medium text-gold-600">
                  {t("hoursLabel")}
                </dt>
                <dd className="mt-1 text-ink/70">{hours}</dd>
              </div>
            </dl>

            <div className="relative mt-8 aspect-[4/3] overflow-hidden rounded-2xl border border-bordo-100">
              <iframe
                src={`https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`}
                title={t("mapTitle")}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 h-full w-full grayscale-[15%]"
              />
            </div>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center text-sm font-semibold text-bordo-500 transition hover:text-gold-600"
            >
              {t("openInMaps")} →
            </a>
          </div>

          <div className="rounded-2xl border border-bordo-100 bg-white p-7 sm:p-9">
            <ContactForm
              labels={{
                name: t("formName"),
                email: t("formEmail"),
                phone: t("formPhone"),
                message: t("formMessage"),
                submit: t("formSubmit"),
                sending: t("formSending"),
                success: t("formSuccess"),
                error: t("formError"),
              }}
            />
          </div>
        </Container>
      </section>
    </>
  );
}
