import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { MobileMenu } from "./MobileMenu";
import { NotificationsMenu } from "./NotificationsMenu";

export async function Topbar() {
  const session = await auth();
  
  let unreadCount = 0;
  let notifications: any[] = [];
  
  if (session?.user?.id) {
    notifications = await prisma.notification.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 5
    });
    unreadCount = notifications.filter(n => !n.isRead).length;
  }

  return (
    <header className="h-[72px] bg-[#0f1115] border-b border-[#262933] flex items-center justify-between px-4 md:px-8 shrink-0 font-sans">
      <div className="flex items-center gap-4">
        <MobileMenu />
        
        <div className="hidden md:block w-[1px] h-6 bg-[#262933]"></div>
        
        <div className="hidden sm:flex items-center gap-2 text-[13px] font-medium text-[#9ca3af]">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight size={14} />
          <span className="text-white">Dashboard</span>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <NotificationsMenu initialNotifications={notifications} unreadCount={unreadCount} />
        
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
