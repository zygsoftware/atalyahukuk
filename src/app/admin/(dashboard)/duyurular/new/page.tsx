import { AnnouncementForm } from "../AnnouncementForm";
import { createAnnouncement } from "../actions";

export const metadata = { title: "Yeni Duyuru" };

export default function NewAnnouncementPage() {
  return (
    <div>
      <h1 className="font-serif text-2xl text-bordo-950">Yeni Duyuru</h1>
      <div className="mt-6">
        <AnnouncementForm onSubmit={createAnnouncement} />
      </div>
    </div>
  );
}
