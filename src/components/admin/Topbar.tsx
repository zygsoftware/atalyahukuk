import { signOut } from "@/app/admin/(dashboard)/actions";

export function Topbar({
  fullName,
  role,
}: {
  fullName: string;
  role: string;
}) {
  return (
    <header className="flex items-center justify-between border-b border-bordo-100 bg-white px-8 py-4">
      <div />
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium text-ink">{fullName}</p>
          <p className="text-xs capitalize text-ink/50">
            {role === "admin" ? "Yönetici" : "Editör"}
          </p>
        </div>
        <form action={signOut}>
          <button
            type="submit"
            className="rounded-full border border-bordo-200 px-4 py-2 text-xs font-semibold text-bordo-500 transition hover:bg-bordo-50"
          >
            Çıkış Yap
          </button>
        </form>
      </div>
    </header>
  );
}
