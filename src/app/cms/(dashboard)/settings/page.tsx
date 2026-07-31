import { Topbar } from "@/components/cms/Topbar";
import { SettingsForm } from "@/components/cms/SettingsForm";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const settings = await getSettings();

  return (
    <div>
      <Topbar title="Settings" subtitle="Instantly update landing page copywriting, titles, stats, and images." />
      <div className="p-8">
        <SettingsForm initial={settings} />
      </div>
    </div>
  );
}
