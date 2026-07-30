import { Bell, ChevronRight, PanelLeft } from "lucide-react";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function Topbar() {
  const session = await auth();
  
  let unreadCount = 0;
  if (session?.user?.id) {
    unreadCount = await prisma.notification.count({
      where: { userId: session.user.id, isRead: false }
    });
  }

  return (
    <header className="h-[72px] bg-[#0f1115] border-b border-[#262933] flex items-center justify-between px-8 shrink-0 font-sans">
      <div className="flex items-center gap-4">
        <button className="text-[#9ca3af] hover:text-white transition-colors">
          <PanelLeft size={20} />
        </button>
        <div className="w-[1px] h-6 bg-[#262933]"></div>
        <div className="flex items-center gap-2 text-[13px] font-medium text-[#9ca3af]">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight size={14} />
          <span className="text-white">Dashboard</span>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <Link href="/notifications" className="relative text-[#9ca3af] hover:text-white transition-colors">
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white border-2 border-[#0f1115]">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Link>
        <div className="w-8 h-8 rounded-full bg-[#181a20] border border-[#262933] flex items-center justify-center overflow-hidden">
          {session?.user?.image ? (
            <img src={session.user.image} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <span className="font-bold text-white text-sm">
              {session?.user?.name?.charAt(0).toUpperCase() || "U"}
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
