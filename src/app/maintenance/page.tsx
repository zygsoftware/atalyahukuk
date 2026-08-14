import type { Metadata } from "next";
import Image from "next/image";
import { inter, playfair } from "@/lib/fonts";
import { SITE_NAME } from "@/lib/constants";
import { getSiteSettings } from "@/lib/data/site-settings";
import { toTelHref } from "@/lib/utils";
import "../globals.css";

export const metadata: Metadata = {
  title: `Bakım Çalışması | ${SITE_NAME}`,
  robots: { index: false, follow: false },
};

export default async function MaintenancePage() {
  const settings = await getSiteSettings();
  const phone = settings?.phone ?? "+90 (000) 000 00 00";
  const email = settings?.email ?? "info@atalyahukuk.com";
  const phoneHref = toTelHref(phone);

  return (
    <html lang="tr" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased">
        <section className="relative flex min-h-screen items-center overflow-hidden bg-bordo-950">
          <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-gold-600/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 left-1/4 h-96 w-96 rounded-full bg-bordo-500/20 blur-3xl" />
          <div className="relative mx-auto flex w-full max-w-xl flex-col items-center px-6 py-24 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-cream p-2 shadow-lg shadow-black/20">
              <Image
                src="/logo-mark.png"
                alt={SITE_NAME}
                width={72}
                height={72}
                className="h-full w-full"
                priority
              />
            </div>
            <span className="mt-8 font-serif text-lg tracking-wide text-gold-300">
              ATALYA
            </span>

            <div className="mt-8 flex h-14 w-14 items-center justify-center rounded-full bg-gold-500/15 ring-1 ring-gold-400/30">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-7 w-7 text-gold-300"
              >
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
              </svg>
            </div>

            <h1 className="mt-6 font-serif text-2xl text-cream sm:text-3xl">
              Bakım Çalışması Yapıyoruz
            </h1>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-cream/70">
              Sitemizde kısa süreli bir bakım çalışması yürütüyoruz. En kısa
              sürede tekrar hizmetinizdeyiz.
              <br />
              <span className="text-cream/50">
                We&rsquo;re currently performing scheduled maintenance and
                will be back shortly.
              </span>
            </p>

            <div className="mt-10 flex flex-col items-center gap-2 text-sm text-cream/60">
              <a href={phoneHref} className="hover:text-cream">
                {phone}
              </a>
              <a href={`mailto:${email}`} className="hover:text-cream">
                {email}
              </a>
            </div>
          </div>
        </section>
      </body>
    </html>
  );
}
