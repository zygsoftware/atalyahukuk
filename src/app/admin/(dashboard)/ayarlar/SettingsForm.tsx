"use client";

import { useState, useTransition } from "react";
import type { Database } from "@/lib/supabase/types";

type Settings = Database["public"]["Tables"]["site_settings"]["Row"];

export function SettingsForm({
  initial,
  onSubmit,
}: {
  initial: Settings;
  onSubmit: (formData: FormData) => Promise<void>;
}) {
  const [phone, setPhone] = useState(initial.phone ?? "");
  const [email, setEmail] = useState(initial.email ?? "");
  const [addressTr, setAddressTr] = useState(initial.address_tr ?? "");
  const [addressEn, setAddressEn] = useState(initial.address_en ?? "");
  const [hoursTr, setHoursTr] = useState(initial.working_hours_tr ?? "");
  const [hoursEn, setHoursEn] = useState(initial.working_hours_en ?? "");
  const [facebook, setFacebook] = useState(initial.facebook_url ?? "");
  const [instagram, setInstagram] = useState(initial.instagram_url ?? "");
  const [linkedin, setLinkedin] = useState(initial.linkedin_url ?? "");
  const [telegram, setTelegram] = useState(initial.telegram_url ?? "");
  const [maintenanceMode, setMaintenanceMode] = useState(
    initial.maintenance_mode,
  );
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaved(false);

    const formData = new FormData();
    formData.set("phone", phone);
    formData.set("email", email);
    formData.set("address_tr", addressTr);
    formData.set("address_en", addressEn);
    formData.set("working_hours_tr", hoursTr);
    formData.set("working_hours_en", hoursEn);
    formData.set("facebook_url", facebook);
    formData.set("instagram_url", instagram);
    formData.set("linkedin_url", linkedin);
    formData.set("telegram_url", telegram);
    if (maintenanceMode) formData.set("maintenance_mode", "on");

    startTransition(async () => {
      try {
        await onSubmit(formData);
        setSaved(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Bir hata oluştu.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-10">
      <div
        className={`rounded-2xl border p-5 transition ${
          maintenanceMode
            ? "border-gold-400 bg-gold-50"
            : "border-bordo-100 bg-white"
        }`}
      >
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={maintenanceMode}
            onChange={(e) => setMaintenanceMode(e.target.checked)}
            className="mt-1 h-5 w-5 accent-bordo-500"
          />
          <span>
            <span className="block text-sm font-semibold text-ink">
              Bakım Modu
            </span>
            <span className="mt-1 block text-sm text-ink/60">
              Açıldığında ziyaretçiler site yerine bakım sayfasını görür.
              Admin paneli ve API her zaman erişilebilir kalır. &quot;Kaydet&quot;e
              basar basmaz anında etkili olur, yeniden deploy gerekmez.
            </span>
          </span>
        </label>
      </div>

      <div>
        <h2 className="font-serif text-lg text-bordo-950">
          İletişim Bilgileri
        </h2>
        <div className="mt-4 grid gap-6 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-ink/80">
              Telefon (WhatsApp dahil)
            </label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0505 600 46 07"
              className="mt-2 w-full rounded-lg border border-bordo-100 px-4 py-2.5 text-sm outline-none focus:border-bordo-400"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-ink/80">
              E-posta
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-lg border border-bordo-100 px-4 py-2.5 text-sm outline-none focus:border-bordo-400"
            />
          </div>
        </div>
      </div>

      <div>
        <h2 className="font-serif text-lg text-bordo-950">Adres</h2>
        <div className="mt-4 grid gap-6 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-ink/80">
              Adres (TR)
            </label>
            <textarea
              rows={3}
              value={addressTr}
              onChange={(e) => setAddressTr(e.target.value)}
              className="mt-2 w-full rounded-lg border border-bordo-100 px-4 py-2.5 text-sm outline-none focus:border-bordo-400"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-ink/80">
              Adres (EN)
            </label>
            <textarea
              rows={3}
              value={addressEn}
              onChange={(e) => setAddressEn(e.target.value)}
              className="mt-2 w-full rounded-lg border border-bordo-100 px-4 py-2.5 text-sm outline-none focus:border-bordo-400"
            />
          </div>
        </div>
      </div>

      <div>
        <h2 className="font-serif text-lg text-bordo-950">
          Çalışma Saatleri
        </h2>
        <div className="mt-4 grid gap-6 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-ink/80">
              Çalışma Saatleri (TR)
            </label>
            <input
              value={hoursTr}
              onChange={(e) => setHoursTr(e.target.value)}
              className="mt-2 w-full rounded-lg border border-bordo-100 px-4 py-2.5 text-sm outline-none focus:border-bordo-400"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-ink/80">
              Çalışma Saatleri (EN)
            </label>
            <input
              value={hoursEn}
              onChange={(e) => setHoursEn(e.target.value)}
              className="mt-2 w-full rounded-lg border border-bordo-100 px-4 py-2.5 text-sm outline-none focus:border-bordo-400"
            />
          </div>
        </div>
      </div>

      <div>
        <h2 className="font-serif text-lg text-bordo-950">Sosyal Medya</h2>
        <div className="mt-4 grid gap-6 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-ink/80">
              Facebook URL
            </label>
            <input
              value={facebook}
              onChange={(e) => setFacebook(e.target.value)}
              placeholder="https://facebook.com/..."
              className="mt-2 w-full rounded-lg border border-bordo-100 px-4 py-2.5 text-sm outline-none focus:border-bordo-400"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-ink/80">
              Instagram URL
            </label>
            <input
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              placeholder="https://instagram.com/..."
              className="mt-2 w-full rounded-lg border border-bordo-100 px-4 py-2.5 text-sm outline-none focus:border-bordo-400"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-ink/80">
              LinkedIn URL
            </label>
            <input
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              placeholder="https://linkedin.com/..."
              className="mt-2 w-full rounded-lg border border-bordo-100 px-4 py-2.5 text-sm outline-none focus:border-bordo-400"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-ink/80">
              Telegram URL
            </label>
            <input
              value={telegram}
              onChange={(e) => setTelegram(e.target.value)}
              placeholder="https://t.me/kullaniciadi"
              className="mt-2 w-full rounded-lg border border-bordo-100 px-4 py-2.5 text-sm outline-none focus:border-bordo-400"
            />
          </div>
        </div>
      </div>

      {error && <p className="text-sm font-medium text-bordo-600">{error}</p>}
      {saved && !error && (
        <p className="text-sm font-medium text-emerald-600">Kaydedildi.</p>
      )}

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
