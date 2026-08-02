"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { GalleryCategory } from "@/lib/supabase/types";

export interface GalleryImageItem {
  id: string;
  imageUrl: string;
  caption: string | null;
  category: GalleryCategory;
}

export function GalleryClient({
  images,
  categoryLabels,
  allLabel,
}: {
  images: GalleryImageItem[];
  categoryLabels: Record<GalleryCategory, string>;
  allLabel: string;
}) {
  const [activeCategory, setActiveCategory] = useState<GalleryCategory | "all">(
    "all",
  );
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const presentCategories = useMemo(
    () =>
      (Object.keys(categoryLabels) as GalleryCategory[]).filter((cat) =>
        images.some((img) => img.category === cat),
      ),
    [images, categoryLabels],
  );

  const filtered = useMemo(
    () =>
      activeCategory === "all"
        ? images
        : images.filter((img) => img.category === activeCategory),
    [images, activeCategory],
  );

  useEffect(() => {
    if (lightboxIndex === null) return;

    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowRight")
        setLightboxIndex((i) => (i === null ? null : (i + 1) % filtered.length));
      if (e.key === "ArrowLeft")
        setLightboxIndex((i) =>
          i === null ? null : (i - 1 + filtered.length) % filtered.length,
        );
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxIndex, filtered.length]);

  const activeImage = lightboxIndex !== null ? filtered[lightboxIndex] : null;

  return (
    <div>
      {presentCategories.length > 1 && (
        <div className="flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={() => setActiveCategory("all")}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition",
              activeCategory === "all"
                ? "bg-bordo-500 text-cream"
                : "bg-white text-ink/70 ring-1 ring-bordo-100 hover:text-bordo-500",
            )}
          >
            {allLabel}
          </button>
          {presentCategories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition",
                activeCategory === cat
                  ? "bg-bordo-500 text-cream"
                  : "bg-white text-ink/70 ring-1 ring-bordo-100 hover:text-bordo-500",
              )}
            >
              {categoryLabels[cat]}
            </button>
          ))}
        </div>
      )}

      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {filtered.map((img, index) => (
          <button
            key={img.id}
            type="button"
            onClick={() => setLightboxIndex(index)}
            className="group relative aspect-square overflow-hidden rounded-xl bg-bordo-50"
          >
            <Image
              src={img.imageUrl}
              alt={img.caption ?? ""}
              fill
              sizes="(min-width: 1024px) 25vw, 50vw"
              className="object-cover transition duration-500 group-hover:scale-105"
            />
            {img.caption && (
              <span className="absolute inset-x-0 bottom-0 translate-y-full bg-bordo-950/80 px-3 py-2 text-left text-xs text-cream transition group-hover:translate-y-0">
                {img.caption}
              </span>
            )}
          </button>
        ))}
      </div>

      {activeImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-bordo-950/95 p-4 sm:p-10"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            type="button"
            onClick={() => setLightboxIndex(null)}
            aria-label="Kapat"
            className="absolute right-5 top-5 text-3xl leading-none text-cream/80 hover:text-cream"
          >
            &times;
          </button>

          {filtered.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((i) =>
                    i === null ? null : (i - 1 + filtered.length) % filtered.length,
                  );
                }}
                aria-label="Önceki"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-4xl text-cream/70 hover:text-cream sm:left-6"
              >
                &#8249;
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((i) =>
                    i === null ? null : (i + 1) % filtered.length,
                  );
                }}
                aria-label="Sonraki"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-4xl text-cream/70 hover:text-cream sm:right-6"
              >
                &#8250;
              </button>
            </>
          )}

          <div
            className="relative flex max-h-full max-w-4xl flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-[70vh] w-[85vw] max-w-4xl">
              <Image
                src={activeImage.imageUrl}
                alt={activeImage.caption ?? ""}
                fill
                sizes="90vw"
                className="object-contain"
              />
            </div>
            {activeImage.caption && (
              <p className="mt-4 text-center text-sm text-cream/80">
                {activeImage.caption}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
