"use client";

import { useState, useTransition } from "react";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { GALLERY_CATEGORIES } from "@/lib/constants";
import { createGalleryImage } from "./actions";

const CATEGORY_LABELS: Record<string, string> = {
  ofis: "Ofis",
  ekip: "Ekip",
  etkinlik: "Etkinlik",
  diger: "Diğer",
};

export function NewImageForm() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [captionTr, setCaptionTr] = useState("");
  const [captionEn, setCaptionEn] = useState("");
  const [category, setCategory] = useState("diger");
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!imageUrl) {
      setError("Lütfen önce bir görsel yükleyin.");
      return;
    }

    const formData = new FormData();
    formData.set("image_url", imageUrl);
    formData.set("caption_tr", captionTr);
    formData.set("caption_en", captionEn);
    formData.set("category", category);
    if (isActive) formData.set("is_active", "on");

    startTransition(async () => {
      try {
        await createGalleryImage(formData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Bir hata oluştu.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <div>
        <label className="text-sm font-medium text-ink/80">Görsel *</label>
        <div className="mt-2">
          <ImageUpload value={imageUrl} onChange={setImageUrl} folder="gallery" />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-ink/80">
            Açıklama (TR)
          </label>
          <input
            value={captionTr}
            onChange={(e) => setCaptionTr(e.target.value)}
            className="mt-2 w-full rounded-lg border border-bordo-100 px-4 py-2.5 text-sm outline-none focus:border-bordo-400"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-ink/80">
            Açıklama (EN)
          </label>
          <input
            value={captionEn}
            onChange={(e) => setCaptionEn(e.target.value)}
            className="mt-2 w-full rounded-lg border border-bordo-100 px-4 py-2.5 text-sm outline-none focus:border-bordo-400"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-6">
        <div>
          <label className="text-sm font-medium text-ink/80">Kategori</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-2 block w-44 rounded-lg border border-bordo-100 px-4 py-2.5 text-sm outline-none focus:border-bordo-400"
          >
            {GALLERY_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {CATEGORY_LABELS[cat]}
              </option>
            ))}
          </select>
        </div>

        <label className="flex items-center gap-2 pb-2.5 text-sm font-medium text-ink/80">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="h-4 w-4 rounded border-bordo-300"
          />
          Yayında (galeride görünsün)
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
