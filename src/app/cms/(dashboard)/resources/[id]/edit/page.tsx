import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Topbar } from "@/components/cms/Topbar";
import { ResourceForm } from "@/components/cms/ResourceForm";
import type { ResourceStatus, ResourceType, Visibility } from "@/lib/types";

function toDatetimeLocal(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(
    date.getMinutes()
  )}`;
}

export default async function EditResourcePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const resource = await prisma.resource.findUnique({ where: { id } });
  if (!resource) notFound();

  return (
    <div>
      <Topbar title={`Edit: ${resource.title}`} subtitle="Update this resource's content and status" />
      <div className="p-8">
        <ResourceForm
          initial={{
            id: resource.id,
            type: resource.type as ResourceType,
            title: resource.title,
            author: resource.author,
            category: resource.category,
            tags: resource.tags,
            coverImageUrl: resource.coverImageUrl ?? "",
            pdfUrl: resource.pdfUrl ?? "",
            body: resource.body,
            excerpt: resource.excerpt,
            publishAt: toDatetimeLocal(resource.publishAt),
            visibility: resource.visibility as Visibility,
            status: resource.status as ResourceStatus,
            slug: resource.slug,
          }}
        />
      </div>
    </div>
  );
}
