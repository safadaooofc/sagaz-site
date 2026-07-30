"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, CheckCircle, Info } from "lucide-react";

type Notification = {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
};

export function NotificationsMenu({ initialNotifications, unreadCount }: { initialNotifications: Notification[], unreadCount: number }) {
  const [isOpen, setIsOpen] = useState(false);
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

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative text-[#9ca3af] hover:text-white transition-colors"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white border-2 border-[#0f1115]">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-4 w-80 bg-[#181a20] border border-[#262933] rounded-xl shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-200">
          <div className="p-4 border-b border-[#262933] flex items-center justify-between">
            <h3 className="text-white font-bold text-sm">Notificações</h3>
            <span className="text-xs text-[#9ca3af] cursor-pointer hover:text-white transition-colors">Marcar como lidas</span>
          </div>

          <div className="max-h-80 overflow-y-auto p-2">
            {initialNotifications.length === 0 ? (
              <div className="py-8 flex flex-col items-center justify-center text-center gap-2">
                <CheckCircle size={32} className="text-[#333845]" />
                <p className="text-[#9ca3af] text-sm">Nenhuma notificação no momento</p>
              </div>
            ) : (
              initialNotifications.map((n) => (
                <div key={n.id} className="flex gap-3 p-3 rounded-lg hover:bg-[#262933] transition-colors cursor-pointer">
                  <div className="mt-1">
                    <Info size={16} className="text-[#eab308]" />
                  </div>
                  <div>
                    <h4 className={`text-sm ${n.isRead ? 'text-[#9ca3af]' : 'text-white font-bold'}`}>{n.title}</h4>
                    <p className="text-xs text-[#9ca3af] mt-1 line-clamp-2">{n.message}</p>
                    <span className="text-[10px] text-[#4b5563] mt-2 block">
                      {new Date(n.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
