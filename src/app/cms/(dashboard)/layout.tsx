import { redirect } from "next/navigation";
import { getSession } from "@/lib/getSession";
import { Sidebar } from "@/components/cms/Sidebar";
import { IdleTimeout } from "@/components/cms/IdleTimeout";
import { prisma } from "@/lib/prisma";

export default async function CmsDashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) {
    redirect("/cms/login");
  }

  const admin = await prisma.admin.findUnique({ where: { id: session.adminId } });

  return (
    <div className="min-h-screen bg-cream">
      <Sidebar adminName={session.name} avatarUrl={admin?.avatarUrl} />
      <div className="ml-[260px] min-h-screen">{children}</div>
      <IdleTimeout />
    </div>
  );
}
