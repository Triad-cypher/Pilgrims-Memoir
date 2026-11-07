import { prisma } from "@/lib/prisma";
import { Topbar } from "@/components/cms/Topbar";
import { MessagesManagerClient } from "@/components/cms/MessagesManagerClient";

export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <Topbar title="Messages" subtitle="Inquiries, book orders and testimonies sent through the contact form" />
      <MessagesManagerClient
        initialMessages={messages.map((m) => ({
          id: m.id,
          name: m.name,
          email: m.email,
          phone: m.phone,
          country: m.country,
          inquiryType: m.inquiryType,
          message: m.message,
          createdAt: m.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
