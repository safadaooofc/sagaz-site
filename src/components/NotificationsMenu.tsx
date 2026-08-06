"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Bell, CheckCircle, Info, Loader2 } from "lucide-react";
import { markAllNotificationsAsRead } from "@/app/(dashboard)/notifications/actions";

type Notification = {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
};

export function NotificationsMenu({ initialNotifications, unreadCount: initialUnreadCount }: { initialNotifications: Notification[], unreadCount: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [unreadCount, setUnreadCount] = useState(initialUnreadCount);
  const [isMarking, setIsMarking] = useState(false);
  const [isAnimatingBell, setIsAnimatingBell] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Fecha ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAsRead = async () => {
    if (unreadCount === 0 || isMarking) return;
    
    setIsMarking(true);
    setIsAnimatingBell(true);
    
    // Animação instantânea (Optimistic UI)
    setUnreadCount(0);
    setNotifications(prev => prev.map(n => ({...n, isRead: true})));
    
    await markAllNotificationsAsRead();
    
    setTimeout(() => {
      setIsMarking(false);
      setIsAnimatingBell(false);
    }, 500);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`relative text-[#9ca3af] hover:text-white transition-colors ${isAnimatingBell ? 'animate-bounce' : ''}`}
      >
        <Bell size={20} className={isAnimatingBell ? 'text-white' : ''} />
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white border-2 border-[#0f1115] animate-in zoom-in duration-300">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-4 w-80 bg-[#181a20] border border-[#262933] rounded-xl shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-200">
          <div className="p-4 border-b border-[#262933] flex items-center justify-between">
            <h3 className="text-white font-bold text-sm">Notificações</h3>
            <button 
              onClick={handleMarkAsRead}
              disabled={isMarking || unreadCount === 0}
              className={`text-xs flex items-center gap-1 transition-colors ${unreadCount === 0 ? 'text-[#4b5563] cursor-not-allowed' : 'text-[#9ca3af] cursor-pointer hover:text-white'}`}
            >
              {isMarking && <Loader2 size={12} className="animate-spin" />}
              Marcar como lidas
            </button>
          </div>

          <div className="max-h-80 overflow-y-auto p-2">
            {notifications.length === 0 ? (
              <div className="py-8 flex flex-col items-center justify-center text-center gap-2">
                <CheckCircle size={32} className="text-[#333845]" />
                <p className="text-[#9ca3af] text-sm">Nenhuma notificação no momento</p>
              </div>
            ) : (
              notifications.map((n) => {
                let actionUrl = "/dashboard";
                if (n.title.toLowerCase().includes("discord")) actionUrl = "/settings";
                if (n.title.toLowerCase().includes("recarga")) actionUrl = "/recharge";

                return (
                  <Link 
                    href={actionUrl}
                    onClick={() => setIsOpen(false)}
                    key={n.id} 
                    className={`flex gap-3 p-3 rounded-lg transition-all cursor-pointer ${n.isRead ? 'hover:bg-[#1f2229] opacity-75' : 'bg-[#1f2229]/50 hover:bg-[#262933]'}`}
                  >
                    <div className="mt-1">
                      <Info size={16} className={n.isRead ? "text-[#4b5563]" : "text-[#eab308]"} />
                    </div>
                    <div>
                      <h4 className={`text-sm ${n.isRead ? 'text-[#9ca3af]' : 'text-white font-bold'}`}>{n.title}</h4>
                      <p className="text-xs text-[#9ca3af] mt-1 line-clamp-2">{n.message}</p>
                      <span className="text-[10px] text-[#4b5563] mt-2 block">
                        {new Date(n.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
