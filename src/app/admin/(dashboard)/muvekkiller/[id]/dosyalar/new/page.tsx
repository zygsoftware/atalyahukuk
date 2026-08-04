import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CaseForm } from "../CaseForm";
import { createCase } from "../actions";

export const metadata = { title: "Yeni Dosya" };

export default async function NewCasePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: client } = await supabase
    .from("clients")
    .select("id, full_name")
    .eq("id", id)
    .single();

  if (!client) notFound();

  return (
    <div>
      <p className="text-sm font-medium text-bordo-500">{client.full_name}</p>
      <h1 className="mt-1 font-serif text-2xl text-bordo-950">Yeni Dosya</h1>
      <div className="mt-6">
        <CaseForm onSubmit={createCase.bind(null, id)} />
      </div>
    </div>
  );
}
