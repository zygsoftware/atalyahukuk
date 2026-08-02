import Image from "next/image";
import Link from "next/link";
import { inter, playfair } from "@/lib/fonts";
import { SITE_NAME } from "@/lib/constants";
import "./globals.css";

export default function RootNotFound() {
  return (
    <html lang="tr" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased">
        <section className="relative flex min-h-screen items-center overflow-hidden bg-bordo-950">
          <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-gold-600/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 left-1/4 h-96 w-96 rounded-full bg-bordo-500/20 blur-3xl" />
          <div className="relative mx-auto flex w-full max-w-xl flex-col items-center px-6 py-24 text-center">
            <Image
              src="/logo-mark.png"
              alt={SITE_NAME}
              width={72}
              height={72}
              className="h-16 w-16 opacity-90"
            />
            <p className="mt-8 font-serif text-7xl text-gold-300 sm:text-8xl">
              404
            </p>
            <h1 className="mt-4 font-serif text-2xl text-cream sm:text-3xl">
              Sayfa Bulunamadı
            </h1>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-cream/70">
              Aradığınız sayfa taşınmış, kaldırılmış ya da hiç var olmamış
              olabilir.
              <br />
              <span className="text-cream/50">
                The page you&rsquo;re looking for could not be found.
              </span>
            </p>
            <Link
              href="/"
              className="mt-9 rounded-full bg-gold-500 px-7 py-3.5 text-sm font-semibold text-bordo-950 transition hover:bg-gold-400"
            >
              Ana Sayfaya Dön
            </Link>
          </div>
        </section>
      </body>
    </html>
  );
}
