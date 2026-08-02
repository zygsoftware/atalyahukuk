import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ClientForm } from "../ClientForm";
import { updateClientRecord } from "../actions";

export const metadata = { title: "Müvekkili Düzenle" };

export default async function EditClientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: client } = await supabase
    .from("clients")
    .select("*")
    .eq("id", id)
    .single();

  if (!client) notFound();

  return (
    <div>
      <h1 className="font-serif text-2xl text-bordo-950">Müvekkili Düzenle</h1>
      <div className="mt-6">
        <ClientForm
          initial={client}
          onSubmit={updateClientRecord.bind(null, id)}
        />
      </div>
    </div>
  );
}
