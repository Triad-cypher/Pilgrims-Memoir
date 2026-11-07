"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Archive, BookCheck, Image as ImageIcon, Inbox, LayoutDashboard, LogOut, MessageCircle, Settings } from "lucide-react";

const NAV = [
  { href: "/cms", label: "Dashboard", icon: LayoutDashboard },
  { href: "/cms/media", label: "Media", icon: ImageIcon },
  { href: "/cms/resources", label: "Resources & Posts", icon: Archive },
  { href: "/cms/comments", label: "Comments", icon: MessageCircle },
  { href: "/cms/messages", label: "Messages", icon: Inbox },
  { href: "/cms/settings", label: "Settings", icon: Settings },
];

export function Sidebar({ adminName, avatarUrl }: { adminName: string; avatarUrl?: string | null }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/cms/login");
    router.refresh();
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex h-screen w-[260px] flex-col justify-between overflow-y-auto bg-[#111F16] p-6 text-white">
      <div>
        <div className="mb-8 flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-500">
            <BookCheck size={16} />
          </span>
          <span className="font-display text-base font-bold">Pilgrim&apos;s CMS</span>
        </div>

        <nav className="space-y-2">
          {NAV.map((item) => {
            const active = item.href === "/cms" ? pathname === "/cms" : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
                  active ? "bg-brand-500 text-white" : "text-[#8C9C92] hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-white/10 pt-4">
        <div className="flex items-center gap-3">
          <img
            src={avatarUrl ?? "/images/figma/admin-avatar.png"}
            alt={adminName}
            className="h-9 w-9 rounded-full object-cover"
          />
          <div className="flex-1 leading-tight">
            <p className="text-[13px] font-semibold">{adminName}</p>
            <p className="text-[11px] text-[#8C9C92]">Administrator</p>
          </div>
          <button
            onClick={logout}
            title="Sign out"
            className="rounded-lg p-1.5 text-[#8C9C92] hover:bg-white/10 hover:text-white"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
