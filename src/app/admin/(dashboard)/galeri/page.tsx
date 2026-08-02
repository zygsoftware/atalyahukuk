import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { toggleGalleryImageActive, deleteGalleryImage } from "./actions";

export const metadata = { title: "Galeri" };

const CATEGORY_LABELS: Record<string, string> = {
  ofis: "Ofis",
  ekip: "Ekip",
  etkinlik: "Etkinlik",
  diger: "Diğer",
};

export default async function AdminGalleryListPage() {
  const supabase = await createClient();
  const { data: images } = await supabase
    .from("gallery_images")
    .select("id, image_url, caption_tr, category, is_active, sort_order, created_at")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl text-bordo-950">Galeri</h1>
        <Link
          href="/admin/galeri/new"
          className="rounded-full bg-bordo-500 px-5 py-2.5 text-sm font-semibold text-cream transition hover:bg-bordo-600"
        >
          + Yeni Görsel
        </Link>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {(images ?? []).map((img) => (
          <div
            key={img.id}
            className="overflow-hidden rounded-2xl border border-bordo-100 bg-white"
          >
            <div className="relative aspect-square bg-bordo-50">
              <Image
                src={img.image_url}
                alt={img.caption_tr ?? ""}
                fill
                sizes="25vw"
                className="object-cover"
              />
              <span
                className={
                  img.is_active
                    ? "absolute left-2 top-2 rounded-full bg-green-100 px-2.5 py-1 text-[10px] font-semibold text-green-700"
                    : "absolute left-2 top-2 rounded-full bg-ink/10 px-2.5 py-1 text-[10px] font-semibold text-ink/60"
                }
              >
                {img.is_active ? "Yayında" : "Gizli"}
              </span>
            </div>
            <div className="p-4">
              <p className="truncate text-sm font-medium text-ink">
                {img.caption_tr || "—"}
              </p>
              <p className="mt-0.5 text-xs text-ink/50">
                {CATEGORY_LABELS[img.category] ?? img.category}
              </p>
              <div className="mt-3 flex items-center justify-between">
                <form
                  action={toggleGalleryImageActive.bind(
                    null,
                    img.id,
                    !img.is_active,
                  )}
                >
                  <button
                    type="submit"
                    className="text-xs font-semibold text-bordo-500 hover:text-bordo-700"
                  >
                    {img.is_active ? "Gizle" : "Yayınla"}
                  </button>
                </form>
                <DeleteButton action={deleteGalleryImage.bind(null, img.id)} />
              </div>
            </div>
          </div>
        ))}

        {(images ?? []).length === 0 && (
          <p className="col-span-full py-10 text-center text-ink/50">
            Henüz galeri görseli eklenmemiş.
          </p>
        )}
      </div>
    </div>
  );
}
