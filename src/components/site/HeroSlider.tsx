"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface HeroSlide {
  src: string;
  alt: string;
  /** "logo" -> açık (cream) zeminde ortalanmış logo; "photo" -> kartı dolduran fotoğraf. */
  type: "logo" | "photo";
}

const INTERVAL_MS = 4500;

export function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % slides.length),
      INTERVAL_MS,
    );
    return () => clearInterval(id);
  }, [slides.length]);

  return (
    <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.55)] ring-1 ring-gold-400/40">
      {slides.map((slide, i) => (
        <div
          key={slide.src}
          aria-hidden={i !== index}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000 ease-in-out",
            i === index ? "opacity-100" : "pointer-events-none opacity-0",
          )}
        >
          {slide.type === "logo" ? (
            <div className="flex h-full w-full items-center justify-center bg-cream">
              <Image
                src={slide.src}
                alt={slide.alt}
                width={280}
                height={280}
                priority={i === 0}
                className="w-[55%]"
              />
            </div>
          ) : (
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              sizes="(min-width: 1024px) 420px, 90vw"
              className="object-cover"
              priority={i === 0}
            />
          )}
        </div>
      ))}

      <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2">
        {slides.map((slide, i) => (
          <span
            key={slide.src}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              i === index ? "w-6 bg-gold-400" : "w-1.5 bg-cream/50",
            )}
          />
        ))}
      </div>
    </div>
  );
}
