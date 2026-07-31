import { Topbar } from "@/components/cms/Topbar";
import { ResourceForm } from "@/components/cms/ResourceForm";
import { RESOURCE_TYPES, type ResourceType } from "@/lib/types";

export default async function NewResourcePage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  const defaultType = (RESOURCE_TYPES as readonly string[]).includes(type ?? "")
    ? (type as ResourceType)
    : "BOOK";

  return (
    <div>
      <Topbar title="Create New Resource" subtitle="Draft and publish books, articles, and devotionals" />
      <div className="p-8">
        <ResourceForm defaultType={defaultType} />
      </div>
    </div>
  );
}
