import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { createReminder, toggleReminderDone, deleteReminder } from "./actions";
import { toTRDateKey, TR_TIME_ZONE } from "@/lib/timezone";

export const metadata = { title: "Takvim" };

const WEEKDAYS = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];
const MONTH_NAMES = [
  "Ocak",
  "Şubat",
  "Mart",
  "Nisan",
  "Mayıs",
  "Haziran",
  "Temmuz",
  "Ağustos",
  "Eylül",
  "Ekim",
  "Kasım",
  "Aralık",
];

function parseMonth(month: string | undefined) {
  if (month && /^\d{4}-\d{2}$/.test(month)) {
    const [y, m] = month.split("-").map(Number);
    return { year: y, monthIndex: m - 1 };
  }
  const now = new Date();
  return { year: now.getFullYear(), monthIndex: now.getMonth() };
}

function monthKey(year: number, monthIndex: number) {
  return `${year}-${String(monthIndex + 1).padStart(2, "0")}`;
}

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const { month: monthParam } = await searchParams;
  const { year, monthIndex } = parseMonth(monthParam);
  const month = monthKey(year, monthIndex);

  const firstOfMonth = new Date(year, monthIndex, 1);
  const lastOfMonth = new Date(year, monthIndex + 1, 0);
  const startOffset = (firstOfMonth.getDay() + 6) % 7;
  const endOffset = (7 - ((lastOfMonth.getDay() + 6) % 7) - 1) % 7;
  const gridStart = addDays(firstOfMonth, -startOffset);
  const gridEnd = addDays(lastOfMonth, endOffset);
  const gridEndExclusive = addDays(gridEnd, 1);

  const prevMonthIndex = monthIndex === 0 ? 11 : monthIndex - 1;
  const prevYear = monthIndex === 0 ? year - 1 : year;
  const nextMonthIndex = monthIndex === 11 ? 0 : monthIndex + 1;
  const nextYear = monthIndex === 11 ? year + 1 : year;

  const supabase = await createClient();
  const nowISO = new Date().toISOString();

  const [
    { data: hearingsInRange },
    { data: remindersInRange },
    { data: upcomingHearings },
    { data: openReminders },
    { data: clients },
  ] = await Promise.all([
    supabase
      .from("hearings")
      .select("id, hearing_date, title, status, case_id")
      .gte("hearing_date", gridStart.toISOString())
      .lt("hearing_date", gridEndExclusive.toISOString())
      .order("hearing_date", { ascending: true }),
    supabase
      .from("reminders")
      .select("id, due_date, title, is_done, client_id, case_id")
      .gte("due_date", gridStart.toISOString())
      .lt("due_date", gridEndExclusive.toISOString())
      .order("due_date", { ascending: true }),
    supabase
      .from("hearings")
      .select("id, hearing_date, title, status, case_id")
      .gte("hearing_date", nowISO)
      .eq("status", "planlandi")
      .order("hearing_date", { ascending: true })
      .limit(6),
    supabase
      .from("reminders")
      .select("id, due_date, title, description, client_id, case_id")
      .eq("is_done", false)
      .order("due_date", { ascending: true })
      .limit(20),
    supabase.from("clients").select("id, full_name").order("full_name"),
  ]);

  const caseIds = Array.from(
    new Set(
      [...(hearingsInRange ?? []), ...(upcomingHearings ?? [])].map(
        (h) => h.case_id,
      ),
    ),
  );
  const { data: cases } =
    caseIds.length > 0
      ? await supabase
          .from("cases")
          .select("id, title, client_id")
          .in("id", caseIds)
      : { data: [] as { id: string; title: string; client_id: string }[] };

  const clientMap = new Map((clients ?? []).map((c) => [c.id, c.full_name]));
  const caseMap = new Map(
    (cases ?? []).map((c) => [
      c.id,
      { title: c.title, clientName: clientMap.get(c.client_id) ?? "" },
    ]),
  );

  const hearingsByDay = new Map<string, typeof hearingsInRange>();
  for (const h of hearingsInRange ?? []) {
    const key = toTRDateKey(h.hearing_date);
    if (!hearingsByDay.has(key)) hearingsByDay.set(key, []);
    hearingsByDay.get(key)!.push(h);
  }

  const remindersByDay = new Map<string, typeof remindersInRange>();
  for (const r of remindersInRange ?? []) {
    const key = toTRDateKey(r.due_date);
    if (!remindersByDay.has(key)) remindersByDay.set(key, []);
    remindersByDay.get(key)!.push(r);
  }

  const totalDays =
    Math.round(
      (gridEndExclusive.getTime() - gridStart.getTime()) / 86400000,
    ) || 0;
  const days = Array.from({ length: totalDays }, (_, i) =>
    addDays(gridStart, i),
  );
  const todayKey = toTRDateKey(new Date());

  return (
    <div>
      <h1 className="font-serif text-2xl text-bordo-950">Takvim</h1>
      <p className="mt-1 text-sm text-ink/60">
        Duruşmalar ve hatırlatmaların genel görünümü
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-bordo-100 bg-white p-5">
          <h2 className="font-serif text-lg text-bordo-950">
            Yaklaşan Duruşmalar
          </h2>
          <div className="mt-3 space-y-3">
            {(upcomingHearings ?? []).length === 0 && (
              <p className="text-sm text-ink/50">Yaklaşan duruşma yok.</p>
            )}
            {(upcomingHearings ?? []).map((h) => {
              const c = caseMap.get(h.case_id);
              return (
                <Link
                  key={h.id}
                  href={
                    c
                      ? `/admin/muvekkiller/${cases?.find((cs) => cs.id === h.case_id)?.client_id}/dosyalar/${h.case_id}`
                      : "#"
                  }
                  className="block rounded-lg border border-bordo-50 px-3 py-2.5 text-sm transition hover:border-bordo-200 hover:bg-bordo-50"
                >
                  <p className="font-medium text-ink">
                    {new Date(h.hearing_date).toLocaleString("tr-TR", {
                      dateStyle: "medium",
                      timeStyle: "short",
                      timeZone: TR_TIME_ZONE,
                    })}
                  </p>
                  <p className="mt-0.5 text-xs text-ink/60">
                    {c ? `${c.clientName} · ${c.title}` : h.title}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-bordo-100 bg-white p-5">
          <h2 className="font-serif text-lg text-bordo-950">
            Açık Hatırlatmalar
          </h2>
          <div className="mt-3 space-y-3">
            {(openReminders ?? []).length === 0 && (
              <p className="text-sm text-ink/50">Açık hatırlatma yok.</p>
            )}
            {(openReminders ?? []).map((r) => (
              <div
                key={r.id}
                className="flex items-start justify-between gap-3 rounded-lg border border-bordo-50 px-3 py-2.5 text-sm"
              >
                <div>
                  <p className="font-medium text-ink">{r.title}</p>
                  <p className="mt-0.5 text-xs text-ink/60">
                    {new Date(r.due_date).toLocaleString("tr-TR", {
                      dateStyle: "medium",
                      timeStyle: "short",
                      timeZone: TR_TIME_ZONE,
                    })}
                    {r.client_id && clientMap.get(r.client_id)
                      ? ` · ${clientMap.get(r.client_id)}`
                      : ""}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <form
                    action={toggleReminderDone.bind(null, r.id, true, month)}
                  >
                    <button
                      type="submit"
                      className="text-xs font-semibold text-bordo-500 hover:text-bordo-700"
                    >
                      Tamamlandı
                    </button>
                  </form>
                  <DeleteButton
                    action={deleteReminder.bind(null, r.id, month)}
                    confirmMessage="Bu hatırlatmayı silmek istediğinizden emin misiniz?"
                  />
                </div>
              </div>
            ))}
          </div>

          <form
            action={createReminder}
            className="mt-5 space-y-3 border-t border-bordo-50 pt-4"
          >
            <input type="hidden" name="month" value={month} />
            <p className="text-sm font-semibold text-ink">
              + Hatırlatma Ekle
            </p>
            <input
              required
              name="title"
              placeholder="Başlık"
              className="w-full rounded-lg border border-bordo-100 px-3 py-2 text-sm outline-none focus:border-bordo-400"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                required
                type="date"
                name="due_date"
                className="w-full rounded-lg border border-bordo-100 px-3 py-2 text-sm outline-none focus:border-bordo-400"
              />
              <input
                type="time"
                name="due_time"
                defaultValue="09:00"
                className="w-full rounded-lg border border-bordo-100 px-3 py-2 text-sm outline-none focus:border-bordo-400"
              />
            </div>
            <select
              name="client_id"
              defaultValue=""
              className="w-full rounded-lg border border-bordo-100 px-3 py-2 text-sm outline-none focus:border-bordo-400"
            >
              <option value="">Müvekkil seçilmedi (genel)</option>
              {(clients ?? []).map((c) => (
                <option key={c.id} value={c.id}>
                  {c.full_name}
                </option>
              ))}
            </select>
            <textarea
              name="description"
              rows={2}
              placeholder="Açıklama (opsiyonel)"
              className="w-full rounded-lg border border-bordo-100 px-3 py-2 text-sm outline-none focus:border-bordo-400"
            />
            <button
              type="submit"
              className="rounded-full bg-bordo-500 px-6 py-2.5 text-sm font-semibold text-cream transition hover:bg-bordo-600"
            >
              Ekle
            </button>
          </form>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-bordo-100 bg-white p-5">
        <div className="flex items-center justify-between">
          <Link
            href={`/admin/takvim?month=${monthKey(prevYear, prevMonthIndex)}`}
            className="rounded-full border border-bordo-100 px-4 py-1.5 text-sm font-medium text-ink/70 transition hover:border-bordo-300"
          >
            ← Önceki
          </Link>
          <h2 className="font-serif text-lg text-bordo-950">
            {MONTH_NAMES[monthIndex]} {year}
          </h2>
          <Link
            href={`/admin/takvim?month=${monthKey(nextYear, nextMonthIndex)}`}
            className="rounded-full border border-bordo-100 px-4 py-1.5 text-sm font-medium text-ink/70 transition hover:border-bordo-300"
          >
            Sonraki →
          </Link>
        </div>

        <div className="mt-5 grid grid-cols-7 gap-px overflow-hidden rounded-xl border border-bordo-100 bg-bordo-100 text-xs">
          {WEEKDAYS.map((w) => (
            <div
              key={w}
              className="bg-bordo-50 px-2 py-2 text-center font-semibold text-bordo-700"
            >
              {w}
            </div>
          ))}
          {days.map((day) => {
            const key = toTRDateKey(day);
            const isCurrentMonth = day.getMonth() === monthIndex;
            const dayHearings = hearingsByDay.get(key) ?? [];
            const dayReminders = remindersByDay.get(key) ?? [];
            return (
              <div
                key={key}
                className={`min-h-24 bg-white p-1.5 ${
                  isCurrentMonth ? "" : "bg-cream/60 text-ink/30"
                }`}
              >
                <p
                  className={`text-right text-xs font-medium ${
                    key === todayKey
                      ? "inline-block rounded-full bg-bordo-500 px-1.5 text-cream"
                      : "text-ink/50"
                  }`}
                >
                  {day.getDate()}
                </p>
                <div className="mt-1 space-y-0.5">
                  {dayHearings.slice(0, 3).map((h) => (
                    <p
                      key={h.id}
                      className="truncate rounded bg-bordo-100 px-1 py-0.5 text-[11px] text-bordo-800"
                      title={h.title ?? ""}
                    >
                      {new Date(h.hearing_date).toLocaleTimeString("tr-TR", {
                        hour: "2-digit",
                        minute: "2-digit",
                        timeZone: TR_TIME_ZONE,
                      })}{" "}
                      {caseMap.get(h.case_id)?.title ?? h.title ?? "Duruşma"}
                    </p>
                  ))}
                  {dayReminders.slice(0, 2).map((r) => (
                    <p
                      key={r.id}
                      className="truncate rounded bg-gold-100 px-1 py-0.5 text-[11px] text-gold-800"
                      title={r.title}
                    >
                      {r.title}
                    </p>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
