"use client";

import { useState, useTransition } from "react";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { slugify } from "@/lib/utils";
import type { Database } from "@/lib/supabase/types";

type Post = Database["public"]["Tables"]["posts"]["Row"];

export function PostForm({
  initial,
  onSubmit,
}: {
  initial?: Post;
  onSubmit: (formData: FormData) => Promise<void>;
}) {
  const [titleTr, setTitleTr] = useState(initial?.title_tr ?? "");
  const [titleEn, setTitleEn] = useState(initial?.title_en ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initial));
  const [excerptTr, setExcerptTr] = useState(initial?.excerpt_tr ?? "");
  const [excerptEn, setExcerptEn] = useState(initial?.excerpt_en ?? "");
  const [contentTr, setContentTr] = useState(initial?.content_tr ?? "");
  const [contentEn, setContentEn] = useState(initial?.content_en ?? "");
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(
    initial?.cover_image_url ?? null,
  );
  const [status, setStatus] = useState(initial?.status ?? "draft");
  const [metaTitle, setMetaTitle] = useState(initial?.meta_title ?? "");
  const [metaDescription, setMetaDescription] = useState(
    initial?.meta_description ?? "",
  );
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
    formData.set("excerpt_tr", excerptTr ?? "");
    formData.set("excerpt_en", excerptEn ?? "");
    formData.set("content_tr", contentTr);
    formData.set("content_en", contentEn ?? "");
    formData.set("cover_image_url", coverImageUrl ?? "");
    formData.set("status", status);
    formData.set("meta_title", metaTitle ?? "");
    formData.set("meta_description", metaDescription ?? "");

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
        <label className="text-sm font-medium text-ink/80">
          Kapak Görseli
        </label>
        <div className="mt-2">
          <ImageUpload
            value={coverImageUrl}
            onChange={setCoverImageUrl}
            folder="posts"
          />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-ink/80">
            Özet (TR)
          </label>
          <textarea
            rows={3}
            value={excerptTr ?? ""}
            onChange={(e) => setExcerptTr(e.target.value)}
            className="mt-2 w-full rounded-lg border border-bordo-100 px-4 py-2.5 text-sm outline-none focus:border-bordo-400"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-ink/80">
            Özet (EN)
          </label>
          <textarea
            rows={3}
            value={excerptEn ?? ""}
            onChange={(e) => setExcerptEn(e.target.value)}
            className="mt-2 w-full rounded-lg border border-bordo-100 px-4 py-2.5 text-sm outline-none focus:border-bordo-400"
          />
        </div>
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

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-ink/80">
            SEO Başlığı
          </label>
          <input
            value={metaTitle ?? ""}
            onChange={(e) => setMetaTitle(e.target.value)}
            className="mt-2 w-full rounded-lg border border-bordo-100 px-4 py-2.5 text-sm outline-none focus:border-bordo-400"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-ink/80">
            SEO Açıklaması
          </label>
          <input
            value={metaDescription ?? ""}
            onChange={(e) => setMetaDescription(e.target.value)}
            className="mt-2 w-full rounded-lg border border-bordo-100 px-4 py-2.5 text-sm outline-none focus:border-bordo-400"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-ink/80">Durum</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as "draft" | "published")}
          className="mt-2 block w-48 rounded-lg border border-bordo-100 px-4 py-2.5 text-sm outline-none focus:border-bordo-400"
        >
          <option value="draft">Taslak</option>
          <option value="published">Yayında</option>
        </select>
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
