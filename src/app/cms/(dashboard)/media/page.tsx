import { prisma } from "@/lib/prisma";
import { Topbar } from "@/components/cms/Topbar";
import { MediaLibraryClient } from "@/components/cms/MediaLibraryClient";

export const dynamic = "force-dynamic";

export default async function MediaLibraryPage() {
  const media = await prisma.media.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <Topbar title="Media Library" subtitle="Upload and manage photographs, banners, and icons." />
      <MediaLibraryClient
        initialMedia={media.map((m) => ({ ...m, createdAt: m.createdAt.toISOString() }))}
      />
    </div>
  );
}
