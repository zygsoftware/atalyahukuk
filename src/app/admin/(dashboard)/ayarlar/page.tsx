import { createClient } from "@/lib/supabase/server";
import { SettingsForm } from "./SettingsForm";
import { updateSiteSettings } from "./actions";

export const metadata = { title: "Site Ayarları" };

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: settings } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .single();

  return (
    <div>
      <h1 className="font-serif text-2xl text-bordo-950">Site Ayarları</h1>
      <p className="mt-1 text-sm text-ink/60">
        İletişim bilgileri, sosyal medya bağlantıları ve bakım modu
      </p>
      <div className="mt-6">
        {settings && (
          <SettingsForm initial={settings} onSubmit={updateSiteSettings} />
        )}
      </div>
    </div>
  );
}
