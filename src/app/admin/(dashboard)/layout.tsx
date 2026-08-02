import { requireStaff } from "@/lib/supabase/auth-helpers";
import { Sidebar } from "@/components/admin/Sidebar";
import { Topbar } from "@/components/admin/Topbar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const staff = await requireStaff();

  return (
    <div className="flex min-h-screen">
      <Sidebar role={staff.role} />
      <div className="flex flex-1 flex-col">
        <Topbar fullName={staff.fullName} role={staff.role} />
        <main className="flex-1 bg-cream px-8 py-8">{children}</main>
      </div>
    </div>
  );
}
