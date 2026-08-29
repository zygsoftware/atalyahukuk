"use client";

import { memo, useEffect, useRef, useState } from "react";
import { slugify } from "@/lib/utils";

type TocItem = { id: string; text: string; level: 2 | 3 };

// Makale gövdesi ayrı ve memo'lu bir bileşen: `html` değişmediği sürece bir
// daha asla yeniden render edilmez. Bu şart olmazsa, üst bileşende TOC'u
// göstermek için tetiklenen setToc(...) yeniden render'ı bu div'i de
// yeniden işler ve biraz önce başlıklara eklediğimiz id/class'ları siler.
const ArticleBody = memo(function ArticleBody({
  html,
  onTocReady,
}: {
  html: string;
  onTocReady: (items: TocItem[]) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const headings = Array.from(
      container.querySelectorAll<HTMLHeadingElement>("h2, h3"),
    );
    const usedIds = new Set<string>();
    const items: TocItem[] = headings.map((heading) => {
      const text = heading.textContent?.trim() ?? "";
      const base = heading.id || slugify(text) || "bolum";
      let id = base;
      let suffix = 2;
      while (usedIds.has(id)) {
        id = `${base}-${suffix}`;
        suffix += 1;
      }
      usedIds.add(id);
      heading.id = id;
      heading.classList.add("scroll-mt-28");
      return {
        id,
        text,
        level: heading.tagName === "H3" ? 3 : 2,
      };
    });

    onTocReady(items);
  }, [html, onTocReady]);

  return (
    <div
      ref={containerRef}
      className="article-prose prose prose-neutral mt-10 max-w-none prose-headings:font-serif prose-headings:text-bordo-950 prose-a:text-bordo-500"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
});

export function ArticleContent({
  html,
  tocLabel,
}: {
  html: string;
  tocLabel: string;
}) {
  const [toc, setToc] = useState<TocItem[]>([]);

  return (
    <>
      {toc.length >= 3 && (
        <nav
          aria-label={tocLabel}
          className="mt-10 rounded-2xl border border-bordo-100 bg-bordo-50/50 p-6"
        >
          <p className="font-serif text-lg text-bordo-950">{tocLabel}</p>
          <ol className="mt-4 space-y-2 text-sm">
            {toc.map((item) => (
              <li
                key={item.id}
                className={item.level === 3 ? "ml-4" : undefined}
              >
                <a
                  href={`#${item.id}`}
                  className="text-ink/70 transition hover:text-bordo-500 hover:underline"
                >
                  {item.text}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      )}

      <ArticleBody html={html} onTocReady={setToc} />
    </>
  );
}
