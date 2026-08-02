import { ClientForm } from "../ClientForm";
import { createClientRecord } from "../actions";

export const metadata = { title: "Yeni Müvekkil" };

export default function NewClientPage() {
  return (
    <div>
      <h1 className="font-serif text-2xl text-bordo-950">Yeni Müvekkil</h1>
      <div className="mt-6">
        <ClientForm onSubmit={createClientRecord} />
      </div>
    </div>
  );
}
