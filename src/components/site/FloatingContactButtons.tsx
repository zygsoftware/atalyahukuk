import { getTranslations } from "next-intl/server";
import { getSiteSettings } from "@/lib/data/site-settings";
import { toE164Digits } from "@/lib/utils";
import { MailIcon, TelegramIcon } from "@/components/site/SocialIcons";

export async function FloatingContactButtons() {
  const [settings, t] = await Promise.all([
    getSiteSettings(),
    getTranslations("floatingContact"),
  ]);

  const whatsappNumber = settings?.phone ? toE164Digits(settings.phone) : null;
  const email = settings?.email || null;
  const telegramUrl = settings?.telegram_url || null;

  if (!whatsappNumber && !email && !telegramUrl) return null;

  const whatsappMessage = encodeURIComponent(t("whatsappPrefilledMessage"));

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {telegramUrl && (
        <a
          href={telegramUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t("telegramAriaLabel")}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-[#229ED9] text-white shadow-lg shadow-black/20 transition-all duration-300 hover:scale-110 active:scale-95"
        >
          <TelegramIcon className="h-5 w-5" />
        </a>
      )}

      {email && (
        <a
          href={`mailto:${email}`}
          aria-label={t("emailAriaLabel")}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-bordo-500 text-cream shadow-lg shadow-black/20 transition-all duration-300 hover:scale-110 active:scale-95"
        >
          <MailIcon className="h-5 w-5" />
        </a>
      )}

      {whatsappNumber && (
        <div className="flex items-center gap-3">
          <span className="whitespace-nowrap rounded-full bg-white px-4 py-2 text-xs font-semibold text-ink shadow-lg shadow-black/10 sm:text-sm">
            {t("whatsappLabel")}
          </span>
          <a
            href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t("whatsappAriaLabel")}
            className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg shadow-black/20 transition-all duration-300 hover:scale-110 hover:shadow-xl active:scale-95"
          >
            <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366]/60 opacity-0 group-hover:opacity-100" />
            <svg
              viewBox="0 0 32 32"
              fill="currentColor"
              className="relative h-7 w-7 text-white"
              aria-hidden="true"
            >
              <path d="M16.004 3C9.376 3 4 8.373 4 15c0 2.34.653 4.527 1.786 6.393L4 29l7.83-1.746A11.94 11.94 0 0 0 16.004 27C22.63 27 28 21.627 28 15S22.63 3 16.004 3Zm6.998 16.98c-.293.828-1.462 1.552-2.36 1.746-.61.13-1.406.234-4.09-.878-3.44-1.424-5.652-4.905-5.826-5.135-.166-.23-1.394-1.855-1.394-3.538s.885-2.511 1.2-2.856c.293-.32.64-.4.854-.4.213 0 .427.002.613.011.196.01.46-.075.72.548.293.71.996 2.394 1.084 2.568.088.174.146.377.03.607-.117.23-.176.373-.352.573-.176.2-.372.446-.53.6-.176.174-.36.362-.155.71.205.35.912 1.507 1.958 2.44 1.345 1.2 2.478 1.573 2.827 1.75.35.174.554.145.76-.084.205-.23.883-1.03 1.117-1.383.235-.353.47-.29.79-.174.322.117 2.047.966 2.398 1.14.352.174.585.26.672.406.088.146.088.85-.205 1.68Z" />
            </svg>
          </a>
        </div>
      )}
    </div>
  );
}
