import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteAnnouncement } from "./actions";

export const metadata = { title: "Duyurular" };

export default async function AdminAnnouncementsListPage() {
  const supabase = await createClient();
  const { data: announcements } = await supabase
    .from("announcements")
    .select("id, title_tr, is_pinned, is_active, published_at")
    .order("published_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl text-bordo-950">Duyurular</h1>
        <Link
          href="/admin/duyurular/new"
          className="rounded-full bg-bordo-500 px-5 py-2.5 text-sm font-semibold text-cream transition hover:bg-bordo-600"
        >
          + Yeni Duyuru
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-bordo-100 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-bordo-50/60 text-xs uppercase tracking-wide text-ink/50">
            <tr>
              <th className="px-5 py-3">Başlık</th>
              <th className="px-5 py-3">Durum</th>
              <th className="px-5 py-3">Tarih</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {(announcements ?? []).map((item) => (
              <tr key={item.id} className="border-t border-bordo-50">
                <td className="px-5 py-3 font-medium text-ink">
                  {item.is_pinned && (
                    <span className="mr-2 rounded-full bg-gold-100 px-2 py-0.5 text-[10px] font-semibold text-gold-700">
                      SABİT
                    </span>
                  )}
                  {item.title_tr}
                </td>
                <td className="px-5 py-3">
                  <span
                    className={
                      item.is_active
                        ? "rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700"
                        : "rounded-full bg-ink/10 px-2.5 py-1 text-xs font-medium text-ink/60"
                    }
                  >
                    {item.is_active ? "Aktif" : "Pasif"}
                  </span>
                </td>
                <td className="px-5 py-3 text-ink/60">
                  {new Date(item.published_at).toLocaleDateString("tr-TR")}
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-end gap-4">
                    <Link
                      href={`/admin/duyurular/${item.id}`}
                      className="text-xs font-semibold text-bordo-500 hover:text-bordo-700"
                    >
                      Düzenle
                    </Link>
                    <DeleteButton
                      action={deleteAnnouncement.bind(null, item.id)}
                    />
                  </div>
                </td>
              </tr>
            ))}
            {(announcements ?? []).length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-10 text-center text-ink/50">
                  Henüz duyuru eklenmemiş.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
