import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deletePost } from "./actions";

export const metadata = { title: "Blog / Makale" };

export default async function AdminBlogListPage() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("posts")
    .select("id, slug, title_tr, status, category, is_pinned, published_at, created_at")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl text-bordo-950">Blog / Makale</h1>
        <Link
          href="/admin/blog/new"
          className="rounded-full bg-bordo-500 px-5 py-2.5 text-sm font-semibold text-cream transition hover:bg-bordo-600"
        >
          + Yeni Yazı
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-bordo-100 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-bordo-50/60 text-xs uppercase tracking-wide text-ink/50">
            <tr>
              <th className="px-5 py-3">Başlık</th>
              <th className="px-5 py-3">Tür</th>
              <th className="px-5 py-3">Durum</th>
              <th className="px-5 py-3">Yayın Tarihi</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {(posts ?? []).map((post) => (
              <tr key={post.id} className="border-t border-bordo-50">
                <td className="px-5 py-3 font-medium text-ink">
                  {post.title_tr}
                  {post.is_pinned && (
                    <span className="ml-2 rounded-full bg-gold-100 px-2 py-0.5 text-[10px] font-semibold text-gold-700">
                      SABİT
                    </span>
                  )}
                </td>
                <td className="px-5 py-3">
                  <span
                    className={
                      post.category === "duyuru"
                        ? "rounded-full bg-bordo-50 px-2.5 py-1 text-xs font-medium text-bordo-600"
                        : "rounded-full bg-gold-50 px-2.5 py-1 text-xs font-medium text-gold-700"
                    }
                  >
                    {post.category === "duyuru" ? "Duyuru" : "Blog"}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <span
                    className={
                      post.status === "published"
                        ? "rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700"
                        : "rounded-full bg-ink/10 px-2.5 py-1 text-xs font-medium text-ink/60"
                    }
                  >
                    {post.status === "published" ? "Yayında" : "Taslak"}
                  </span>
                </td>
                <td className="px-5 py-3 text-ink/60">
                  {post.published_at
                    ? new Date(post.published_at).toLocaleDateString("tr-TR")
                    : "—"}
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-end gap-4">
                    <Link
                      href={`/admin/blog/${post.id}`}
                      className="text-xs font-semibold text-bordo-500 hover:text-bordo-700"
                    >
                      Düzenle
                    </Link>
                    <DeleteButton action={deletePost.bind(null, post.id)} />
                  </div>
                </td>
              </tr>
            ))}
            {(posts ?? []).length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-ink/50">
                  Henüz blog yazısı eklenmemiş.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
