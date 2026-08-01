import { redirect } from "next/navigation";
import { Topbar } from "@/components/cms/Topbar";
import { SettingsForm } from "@/components/cms/SettingsForm";
import { ProfileForm } from "@/components/cms/ProfileForm";
import { getSettings } from "@/lib/settings";
import { getSession } from "@/lib/getSession";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const session = await getSession();
  if (!session) redirect("/cms/login");

  const [settings, admin] = await Promise.all([
    getSettings(),
    prisma.admin.findUnique({ where: { id: session.adminId } }),
  ]);

  return (
    <div>
      <Topbar title="Settings" subtitle="Instantly update landing page copywriting, titles, stats, and images." />
      <div className="p-8">
        <ProfileForm initialAvatarUrl={admin?.avatarUrl ?? null} />
        <SettingsForm initial={settings} />
      </div>
    </div>
  );
}
