import { createClient } from "@/lib/supabase/server";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { setMessageRead, deleteMessage } from "./actions";

export const metadata = { title: "Mesajlar" };

export default async function AdminMessagesPage() {
  const supabase = await createClient();
  const { data: messages } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-serif text-2xl text-bordo-950">Mesajlar</h1>
      <p className="mt-1 text-sm text-ink/60">
        İletişim formundan gelen mesajlar
      </p>

      <div className="mt-6 space-y-4">
        {(messages ?? []).map((message) => (
          <details
            key={message.id}
            className={`rounded-2xl border bg-white p-5 ${
              message.is_read ? "border-bordo-100" : "border-gold-400"
            }`}
          >
            <summary className="flex cursor-pointer flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                {!message.is_read && (
                  <span className="h-2 w-2 rounded-full bg-gold-500" />
                )}
                <span className="font-medium text-ink">{message.name}</span>
                <span className="text-sm text-ink/50">{message.email}</span>
              </div>
              <span className="text-xs text-ink/40">
                {new Date(message.created_at).toLocaleString("tr-TR")}
              </span>
            </summary>

            <div className="mt-4 space-y-4 border-t border-bordo-50 pt-4">
              {message.phone && (
                <p className="text-sm text-ink/70">
                  <span className="font-medium">Telefon:</span> {message.phone}
                </p>
              )}
              <p className="whitespace-pre-wrap text-sm text-ink/80">
                {message.message}
              </p>

              <div className="flex items-center gap-4">
                <form action={setMessageRead.bind(null, message.id, !message.is_read)}>
                  <button
                    type="submit"
                    className="text-xs font-semibold text-bordo-500 hover:text-bordo-700"
                  >
                    {message.is_read
                      ? "Okunmadı Olarak İşaretle"
                      : "Okundu Olarak İşaretle"}
                  </button>
                </form>
                <DeleteButton action={deleteMessage.bind(null, message.id)} />
              </div>
            </div>
          </details>
        ))}

        {(messages ?? []).length === 0 && (
          <p className="rounded-2xl border border-bordo-100 bg-white p-10 text-center text-ink/50">
            Henüz mesaj bulunmuyor.
          </p>
        )}
      </div>
    </div>
  );
}
