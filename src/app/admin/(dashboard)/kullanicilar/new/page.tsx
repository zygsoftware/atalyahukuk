import { NewUserForm } from "./NewUserForm";

export const metadata = { title: "Yeni Kullanıcı" };

export default function NewUserPage() {
  return (
    <div>
      <h1 className="font-serif text-2xl text-bordo-950">Yeni Kullanıcı</h1>
      <div className="mt-6">
        <NewUserForm />
      </div>
    </div>
  );
}
