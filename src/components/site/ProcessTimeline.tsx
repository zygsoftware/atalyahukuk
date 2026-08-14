"use client";

import { useEffect, useRef, useState } from "react";
import {
  MessageCircle,
  FileSearch,
  ClipboardList,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Server Component'ten Client Component'e fonksiyon (ikon bileşeni)
 * doğrudan geçirilemez — bu yüzden anahtar (string) geçirilip ikon burada
 * çözülüyor.
 */
const ICONS: Record<string, LucideIcon> = {
  "message-circle": MessageCircle,
  "file-search": FileSearch,
  "clipboard-list": ClipboardList,
  "check-circle": CheckCircle2,
};

export interface ProcessStep {
  title: string;
  body: string;
  icon: keyof typeof ICONS;
}

/**
 * Scroll ile içeri giren, adım adım (staggered) beliren zaman çizelgesi.
 *
 * Not: Daha önceki sürüm scroll'u ekrana "kilitleyen" (position: sticky +
 * uzun bir spacer) bir teknik kullanıyordu; sticky elemanın kendi yüksekliği
 * viewport'tan küçük olduğu için elemanın koptuğu an ile spacer'ın bittiği
 * an arasında kaçınılmaz olarak boş bir alan oluşuyordu. Bu sürüm normal
 * akışta kalıp IntersectionObserver ile tetiklenen bir reveal kullanıyor —
 * hem bu riski taşımıyor hem de mobil/masaüstü aynı, tutarlı bir deneyim.
 */
export function ProcessTimeline({ steps }: { steps: ProcessStep[] }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -80px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={sectionRef} className="relative">
      {/* Masaüstü: yatay, çizgi çizilerek beliren zaman çizelgesi */}
      <div className="hidden lg:block">
        <div className="relative">
          <div className="absolute inset-x-0 top-9 h-px bg-bordo-100" />
          <div
            className="absolute top-9 left-0 h-px origin-left bg-gradient-to-r from-gold-400 via-gold-500 to-bordo-500 transition-transform duration-[1400ms] ease-out"
            style={{
              width: "100%",
              transform: visible ? "scaleX(1)" : "scaleX(0)",
            }}
          />
          <div
            className="grid gap-8"
            style={{
              gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))`,
            }}
          >
            {steps.map((step, i) => {
              const Icon = ICONS[step.icon];
              return (
                <div
                  key={step.title}
                  className={cn(
                    "group relative rounded-2xl border border-transparent p-3 text-center transition-all duration-700 ease-out hover:border-gold-200 hover:bg-white hover:shadow-lg hover:shadow-bordo-900/5",
                    visible
                      ? "translate-y-0 opacity-100"
                      : "translate-y-8 opacity-0",
                  )}
                  style={{ transitionDelay: visible ? `${i * 150}ms` : "0ms" }}
                >
                  <p className="text-[11px] font-semibold tracking-[0.2em] text-gold-500">
                    ADIM {String(i + 1).padStart(2, "0")}
                  </p>
                  <div className="relative z-10 mx-auto mt-3 flex h-[72px] w-[72px] items-center justify-center rounded-full bg-gradient-to-br from-bordo-500 to-bordo-800 shadow-lg shadow-bordo-900/20 ring-4 ring-cream transition-transform duration-500 group-hover:scale-110">
                    <Icon
                      className="h-7 w-7 text-cream"
                      strokeWidth={1.6}
                    />
                  </div>
                  <h3 className="mt-5 font-serif text-lg text-bordo-950">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink/65">
                    {step.body}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobil / tablet: dikey zaman çizelgesi */}
      <div className="space-y-8 lg:hidden">
        {steps.map((step, i) => {
          const Icon = ICONS[step.icon];
          return (
            <div
              key={step.title}
              className={cn(
                "relative flex gap-5 transition-all duration-700 ease-out",
                visible
                  ? "translate-x-0 opacity-100"
                  : "-translate-x-6 opacity-0",
              )}
              style={{ transitionDelay: visible ? `${i * 130}ms` : "0ms" }}
            >
              {i < steps.length - 1 && (
                <span className="absolute top-16 left-8 h-[calc(100%+0.5rem)] w-px bg-gradient-to-b from-gold-400 to-bordo-100" />
              )}
              <div className="relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-bordo-500 to-bordo-800 shadow-lg shadow-bordo-900/20 ring-4 ring-cream">
                <Icon className="h-6 w-6 text-cream" strokeWidth={1.6} />
              </div>
              <div className="pt-1.5">
                <p className="text-[11px] font-semibold tracking-[0.2em] text-gold-500">
                  ADIM {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-1 font-serif text-lg text-bordo-950">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/65">
                  {step.body}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
