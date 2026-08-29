"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { PostCard } from "@/components/site/PostCard";
import type { PostCategory } from "@/lib/supabase/types";

export interface BlogListItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  coverImageUrl: string | null;
  publishedAt: string | null;
  isPinned: boolean;
  category: PostCategory;
}

export function BlogListClient({
  posts,
  locale,
  allLabel,
  blogLabel,
  duyuruLabel,
  pinnedLabel,
  readMoreLabel,
  emptyLabel,
}: {
  posts: BlogListItem[];
  locale: string;
  allLabel: string;
  blogLabel: string;
  duyuruLabel: string;
  pinnedLabel: string;
  readMoreLabel: string;
  emptyLabel: string;
}) {
  const [activeCategory, setActiveCategory] = useState<PostCategory | "all">(
    "all",
  );

  const categoryLabels: Record<PostCategory, string> = {
    blog: blogLabel,
    duyuru: duyuruLabel,
  };

  const presentCategories = useMemo(
    () =>
      (["blog", "duyuru"] as PostCategory[]).filter((cat) =>
        posts.some((p) => p.category === cat),
      ),
    [posts],
  );

  const filtered = useMemo(
    () =>
      activeCategory === "all"
        ? posts
        : posts.filter((p) => p.category === activeCategory),
    [posts, activeCategory],
  );

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

      {filtered.length === 0 ? (
        <p className="mt-10 text-center text-ink/60">{emptyLabel}</p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post) => (
            <PostCard
              key={post.id}
              slug={post.slug}
              title={post.title}
              excerpt={post.excerpt}
              coverImageUrl={post.coverImageUrl}
              publishedAt={post.publishedAt}
              isPinned={post.isPinned}
              pinnedLabel={pinnedLabel}
              categoryLabel={categoryLabels[post.category]}
              isAnnouncement={post.category === "duyuru"}
              locale={locale}
              readMoreLabel={readMoreLabel}
            />
          ))}
        </div>
      )}
    </div>
  );
}
