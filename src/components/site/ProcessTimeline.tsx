"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

export interface ProcessStep {
  title: string;
  body: string;
}

/** Sabitlenmiş bölümün her adım için ne kadar scroll mesafesi kaplayacağı (vh). */
const SEGMENT_VH = 70;

export function ProcessTimeline({ steps }: { steps: ProcessStep[] }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function onScroll() {
      const el = wrapperRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      if (total <= 0) return;
      const p = Math.min(1, Math.max(0, -rect.top / total));
      setProgress(p);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const activeIndex = Math.min(
    steps.length - 1,
    Math.floor(progress * steps.length),
  );

  return (
    <>
      {/* Mobil / tablet: basit, dikey zaman çizelgesi (scroll kilitleme yok) */}
      <div className="space-y-10 lg:hidden">
        {steps.map((step, i) => (
          <Reveal key={step.title} delay={i * 80}>
            <div className="relative flex gap-5">
              {i < steps.length - 1 && (
                <span className="absolute top-14 left-7 h-[calc(100%+1.5rem)] w-px bg-bordo-100" />
              )}
              <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-bordo-500 ring-2 ring-gold-400">
                <span className="font-serif text-xl text-cream">{i + 1}</span>
              </div>
              <div className="pt-1.5">
                <h3 className="font-serif text-lg text-bordo-950">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/65">
                  {step.body}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Masaüstü: scroll ile ekrana kilitlenen, ilerleme çizgili zaman çizelgesi */}
      <div
        ref={wrapperRef}
        className="relative hidden lg:block"
        style={{ height: `${steps.length * SEGMENT_VH}vh` }}
      >
        <div className="sticky top-28 flex h-[60vh] items-center overflow-hidden">
          <div className="w-full">
            <div className="relative pt-7">
              <div className="absolute inset-x-0 top-7 h-px bg-bordo-100" />
              <div
                className="absolute top-7 left-0 h-px bg-gold-400 transition-[width] duration-150 ease-out"
                style={{ width: `${progress * 100}%` }}
              />
              <div
                className="grid gap-10"
                style={{
                  gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))`,
                }}
              >
                {steps.map((step, i) => {
                  const reached = i <= activeIndex;
                  return (
                    <div
                      key={step.title}
                      className={cn(
                        "relative text-center transition-all duration-500",
                        reached
                          ? "translate-y-0 opacity-100"
                          : "translate-y-6 opacity-30",
                      )}
                    >
                      <div
                        className={cn(
                          "relative z-10 mx-auto flex h-14 w-14 items-center justify-center rounded-full ring-2 transition-colors duration-500",
                          reached
                            ? "bg-bordo-500 ring-gold-400"
                            : "bg-cream ring-bordo-200",
                        )}
                      >
                        <span
                          className={cn(
                            "font-serif text-xl transition-colors",
                            reached ? "text-cream" : "text-bordo-500",
                          )}
                        >
                          {i + 1}
                        </span>
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

            <div className="mt-10 flex justify-center gap-1.5">
              {steps.map((step, i) => (
                <span
                  key={step.title}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    i <= activeIndex
                      ? "w-6 bg-gold-500"
                      : "w-1.5 bg-bordo-100",
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
