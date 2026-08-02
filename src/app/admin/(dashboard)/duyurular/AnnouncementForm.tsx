"use client";

import { useState, useTransition } from "react";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { slugify } from "@/lib/utils";
import type { Database } from "@/lib/supabase/types";

type Announcement = Database["public"]["Tables"]["announcements"]["Row"];

export function AnnouncementForm({
  initial,
  onSubmit,
}: {
  initial?: Announcement;
  onSubmit: (formData: FormData) => Promise<void>;
}) {
  const [titleTr, setTitleTr] = useState(initial?.title_tr ?? "");
  const [titleEn, setTitleEn] = useState(initial?.title_en ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initial));
  const [contentTr, setContentTr] = useState(initial?.content_tr ?? "");
  const [contentEn, setContentEn] = useState(initial?.content_en ?? "");
  const [isPinned, setIsPinned] = useState(initial?.is_pinned ?? false);
  const [isActive, setIsActive] = useState(initial?.is_active ?? true);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleTitleTrChange(value: string) {
    setTitleTr(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const formData = new FormData();
    formData.set("title_tr", titleTr);
    formData.set("title_en", titleEn ?? "");
    formData.set("slug", slug);
    formData.set("content_tr", contentTr);
    formData.set("content_en", contentEn ?? "");
    if (isPinned) formData.set("is_pinned", "on");
    if (isActive) formData.set("is_active", "on");

    startTransition(async () => {
      try {
        await onSubmit(formData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Bir hata oluştu.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-8">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-ink/80">
            Başlık (TR) *
          </label>
          <input
            required
            value={titleTr}
            onChange={(e) => handleTitleTrChange(e.target.value)}
            className="mt-2 w-full rounded-lg border border-bordo-100 px-4 py-2.5 text-sm outline-none focus:border-bordo-400"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-ink/80">
            Başlık (EN)
          </label>
          <input
            value={titleEn ?? ""}
            onChange={(e) => setTitleEn(e.target.value)}
            className="mt-2 w-full rounded-lg border border-bordo-100 px-4 py-2.5 text-sm outline-none focus:border-bordo-400"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-ink/80">Slug (URL) *</label>
        <input
          required
          value={slug}
          onChange={(e) => {
            setSlugTouched(true);
            setSlug(slugify(e.target.value));
          }}
          className="mt-2 w-full rounded-lg border border-bordo-100 px-4 py-2.5 text-sm outline-none focus:border-bordo-400"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-ink/80">İçerik (TR) *</label>
        <div className="mt-2">
          <RichTextEditor value={contentTr} onChange={setContentTr} />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-ink/80">İçerik (EN)</label>
        <div className="mt-2">
          <RichTextEditor value={contentEn ?? ""} onChange={setContentEn} />
        </div>
      </div>

      <div className="flex gap-8">
        <label className="flex items-center gap-2 text-sm font-medium text-ink/80">
          <input
            type="checkbox"
            checked={isPinned}
            onChange={(e) => setIsPinned(e.target.checked)}
            className="h-4 w-4 rounded border-bordo-300"
          />
          Sabitlenmiş
        </label>
        <label className="flex items-center gap-2 text-sm font-medium text-ink/80">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="h-4 w-4 rounded border-bordo-300"
          />
          Aktif (yayında)
        </label>
      </div>

      {error && <p className="text-sm font-medium text-bordo-600">{error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-bordo-500 px-7 py-3 text-sm font-semibold text-cream transition hover:bg-bordo-600 disabled:opacity-60"
      >
        {pending ? "Kaydediliyor..." : "Kaydet"}
      </button>
    </form>
  );
}
