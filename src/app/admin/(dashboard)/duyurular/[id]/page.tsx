import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AnnouncementForm } from "../AnnouncementForm";
import { updateAnnouncement } from "../actions";

export const metadata = { title: "Duyuruyu Düzenle" };

export default async function EditAnnouncementPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: announcement } = await supabase
    .from("announcements")
    .select("*")
    .eq("id", id)
    .single();

  if (!announcement) notFound();

  return (
    <div>
      <h1 className="font-serif text-2xl text-bordo-950">Duyuruyu Düzenle</h1>
      <div className="mt-6">
        <AnnouncementForm
          initial={announcement}
          onSubmit={updateAnnouncement.bind(null, id)}
        />
      </div>
    </div>
  );
}
