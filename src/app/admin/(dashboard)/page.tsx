import Link from "next/link";
import { requireStaff } from "@/lib/supabase/auth-helpers";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Panel" };

export default async function AdminDashboardPage() {
  const staff = await requireStaff();
  const supabase = await createClient();

  const [
    postsCount,
    announcementsCount,
    unreadMessagesCount,
    galleryCount,
    clientsCount,
  ] = await Promise.all([
    supabase.from("posts").select("id", { count: "exact", head: true }),
    supabase
      .from("announcements")
      .select("id", { count: "exact", head: true })
      .eq("is_active", true),
    supabase
      .from("contact_messages")
      .select("id", { count: "exact", head: true })
      .eq("is_read", false),
    supabase
      .from("gallery_images")
      .select("id", { count: "exact", head: true })
      .eq("is_active", true),
    staff.role === "admin"
      ? supabase
          .from("clients")
          .select("id", { count: "exact", head: true })
          .eq("status", "aktif")
      : Promise.resolve({ count: null }),
  ]);

  const cards = [
    { label: "Toplam Blog Yazısı", value: postsCount.count ?? 0, href: "/admin/blog" },
    {
      label: "Aktif Duyuru",
      value: announcementsCount.count ?? 0,
      href: "/admin/duyurular",
    },
    {
      label: "Okunmamış Mesaj",
      value: unreadMessagesCount.count ?? 0,
      href: "/admin/mesajlar",
    },
    {
      label: "Galeri Görseli",
      value: galleryCount.count ?? 0,
      href: "/admin/galeri",
    },
    ...(staff.role === "admin"
      ? [
          {
            label: "Aktif Müvekkil",
            value: clientsCount.count ?? 0,
            href: "/admin/muvekkiller",
          },
        ]
      : []),
  ];

  return (
    <div>
      <h1 className="font-serif text-2xl text-bordo-950">
        Hoş geldiniz, {staff.fullName.split(" ")[0]}
      </h1>
      <p className="mt-1 text-sm text-ink/60">
        Yönetim paneli genel görünümü
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-2xl border border-bordo-100 bg-white p-6 transition hover:border-gold-300 hover:shadow-sm"
          >
            <p className="font-serif text-3xl text-bordo-500">
              {card.value}
            </p>
            <p className="mt-2 text-sm text-ink/60">{card.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
