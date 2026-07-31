import { prisma } from "@/lib/prisma";
import { Topbar } from "@/components/cms/Topbar";
import { CommentsManagerClient } from "@/components/cms/CommentsManagerClient";

export const dynamic = "force-dynamic";

export default async function CommentsManagerPage() {
  const comments = await prisma.comment.findMany({
    orderBy: { createdAt: "desc" },
    include: { resource: true },
  });

  return (
    <div>
      <Topbar title="Comments Manager" subtitle="Manage and moderate reader comments" />
      <CommentsManagerClient
        initialComments={comments.map((c) => ({
          id: c.id,
          commenterName: c.commenterName,
          commenterEmail: c.commenterEmail,
          body: c.body,
          reply: c.reply,
          status: c.status as "PENDING" | "APPROVED" | "REJECTED",
          createdAt: c.createdAt.toISOString(),
          resourceTitle: c.resource.title,
        }))}
      />
    </div>
  );
}
