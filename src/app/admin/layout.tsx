import type { Metadata } from "next";
import { inter, playfair } from "@/lib/fonts";
import "../globals.css";

export const metadata: Metadata = {
  title: "Yönetim Paneli | Atalya Hukuk Bürosu",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen bg-cream font-sans text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
