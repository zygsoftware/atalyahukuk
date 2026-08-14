import Image from "next/image";
import { InstagramIcon, LinkedinIcon, FacebookIcon } from "./SocialIcons";
import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { NAV_ITEMS } from "@/lib/constants";
import { getSiteSettings } from "@/lib/data/site-settings";
import { toTelHref } from "@/lib/utils";
import { Container } from "./Container";

export async function Footer() {
  const [t, tContact, locale, settings] = await Promise.all([
    getTranslations("footer"),
    getTranslations("contact"),
    getLocale(),
    getSiteSettings(),
  ]);
  const tNav = await getTranslations("nav");

  const address =
    (locale === "tr" ? settings?.address_tr : settings?.address_en) ??
    tContact("addressPlaceholder");
  const hours =
    (locale === "tr" ? settings?.working_hours_tr : settings?.working_hours_en) ??
    tContact("hoursPlaceholder");
  const phone = settings?.phone ?? tContact("phonePlaceholder");
  const email = settings?.email ?? tContact("emailPlaceholder");

  return (
    <footer className="border-t border-bordo-100 bg-bordo-950 text-cream/90">
      <Container className="grid gap-10 py-14 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-cream p-1.5 shadow-sm">
              <Image
                src="/logo-mark.png"
                alt="Atalya Hukuk Bürosu"
                width={40}
                height={40}
                className="h-full w-full"
              />
            </div>
            <span className="font-serif text-lg tracking-wide text-gold-300">
              ATALYA
            </span>
          </div>
          <p className="mt-4 max-w-xs text-sm text-cream/70">{t("tagline")}</p>
          {(settings?.instagram_url ||
            settings?.linkedin_url ||
            settings?.facebook_url) && (
            <div className="mt-5 flex items-center gap-3">
              {settings?.facebook_url && (
                <a
                  href={settings.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-cream/20 text-cream/70 transition hover:border-gold-400 hover:text-gold-300"
                >
                  <FacebookIcon className="h-4 w-4" />
                </a>
              )}
              {settings?.instagram_url && (
                <a
                  href={settings.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-cream/20 text-cream/70 transition hover:border-gold-400 hover:text-gold-300"
                >
                  <InstagramIcon className="h-4 w-4" />
                </a>
              )}
              {settings?.linkedin_url && (
                <a
                  href={settings.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-cream/20 text-cream/70 transition hover:border-gold-400 hover:text-gold-300"
                >
                  <LinkedinIcon className="h-4 w-4" />
                </a>
              )}
            </div>
          )}
        </div>

        <div>
          <h3 className="font-serif text-base text-gold-300">
            {t("quickLinksTitle")}
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            {NAV_ITEMS.map((item) => (
              <li key={item.key}>
                <Link
                  href={item.href}
                  className="text-cream/70 transition hover:text-cream"
                >
                  {tNav(item.key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-serif text-base text-gold-300">
            {t("contactTitle")}
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-cream/70">
            <li>{address}</li>
            <li>
              <a href={toTelHref(phone)} className="hover:text-cream">
                {phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${email}`} className="hover:text-cream">
                {email}
              </a>
            </li>
            <li>{hours}</li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-cream/10 py-5">
        <Container className="flex flex-col items-center justify-between gap-2 text-xs text-cream/50 md:flex-row">
          <p>
            © {new Date().getFullYear()} Atalya Hukuk Bürosu. {t("rights")}
          </p>
        </Container>
      </div>
    </footer>
  );
}
