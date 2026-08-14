"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

export const COOKIE_CONSENT_KEY = "atalya_cookie_consent";
export const COOKIE_CONSENT_EVENT = "atalya-cookie-consent-change";

export function CookieConsent() {
  const t = useTranslations("cookieConsent");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
    // localStorage sunucuda yok — hydration uyumsuzluğunu önlemek için
    // banner'ı yalnızca mount sonrası, istemcide kontrol edip gösteriyoruz.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!stored) setVisible(true);
  }, []);

  function handle(choice: "granted" | "denied") {
    localStorage.setItem(COOKIE_CONSENT_KEY, choice);
    window.dispatchEvent(new CustomEvent(COOKIE_CONSENT_EVENT, { detail: choice }));
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-bordo-100 bg-cream/98 p-4 shadow-[0_-8px_30px_-10px_rgba(0,0,0,0.15)] backdrop-blur sm:p-5">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 sm:flex-row sm:justify-between">
        <p className="text-center text-sm leading-relaxed text-ink/75 sm:text-left">
          {t("message")}
        </p>
        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            onClick={() => handle("denied")}
            className="rounded-full border border-bordo-200 px-5 py-2.5 text-sm font-medium text-ink/70 transition hover:bg-bordo-50"
          >
            {t("decline")}
          </button>
          <button
            type="button"
            onClick={() => handle("granted")}
            className="rounded-full bg-bordo-500 px-5 py-2.5 text-sm font-semibold text-cream transition hover:bg-bordo-600"
          >
            {t("accept")}
          </button>
        </div>
      </div>
    </div>
  );
}
