"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { LayoutDashboard, ShoppingBag, RefreshCw, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

interface UserMenuProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
  };
}

export function UserMenu({ user }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setIsOpen((prev) => !prev);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const firstLetter = user?.name?.charAt(0).toUpperCase() || "U";

  return (
    <div className="relative font-sans" ref={menuRef}>
      <button 
        onClick={toggleMenu}
        className="w-10 h-10 rounded-full bg-[#181a20] border border-[#262933] flex items-center justify-center overflow-hidden hover:border-[#4b5563] transition-colors focus:outline-none"
      >
        {user?.image ? (
          <img src={user.image} alt="Avatar" className="w-full h-full object-cover" />
        ) : (
          <span className="font-bold text-white text-sm">{firstLetter}</span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-[#181a20] border border-[#262933] rounded-xl shadow-2xl overflow-hidden z-50">
          {/* Header do Menu */}
          <div className="p-4 flex items-center gap-3 border-b border-[#262933]">
            <div className="w-10 h-10 rounded-full bg-[#262933] flex items-center justify-center shrink-0">
              <span className="font-bold text-white text-sm">{firstLetter}</span>
            </div>
            <div className="overflow-hidden">
              <p className="font-bold text-sm text-white truncate">{user?.name || "Usuário"}</p>
              <p className="text-xs text-[#9ca3af] truncate">{user?.email || "email@desconhecido.com"}</p>
            </div>
          </div>

          <div className="p-2 space-y-1">
            <div className="px-3 pt-2 pb-1">
              <p className="text-[10px] font-bold text-[#4b5563] uppercase tracking-widest">Navegação</p>
              <p className="text-[11px] text-[#9ca3af]">Acesso rápido às páginas</p>
            </div>

            <Link 
              href="/dashboard" 
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#262933] text-[#9ca3af] hover:text-white transition-colors"
            >
              <LayoutDashboard size={16} />
              <span className="text-sm font-medium">Dashboard</span>
            </Link>

            {user?.role && ["ADMIN", "SUPERADMIN", "MODERATOR", "OWNER"].includes(user.role) && (
              <Link 
                href="/admin" 
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#262933] text-[#9ca3af] hover:text-white transition-colors"
              >
                <LayoutDashboard size={16} />
                <span className="text-sm font-medium">Painel Admin</span>
              </Link>
            )}

            <Link 
              href="/buy/cards" 
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#262933] text-[#9ca3af] hover:text-white transition-colors"
            >
              <ShoppingBag size={16} />
              <span className="text-sm font-medium">Comprar Cartões</span>
            </Link>

            <Link 
              href="/recharge" 
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#262933] text-[#9ca3af] hover:text-white transition-colors"
            >
              <RefreshCw size={16} />
              <span className="text-sm font-medium">Recarregar Saldo</span>
            </Link>
          </div>

          <div className="p-2 border-t border-[#262933]">
            <button 
              onClick={() => signOut({ callbackUrl: '/' })}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors"
            >
              <LogOut size={16} />
              <span className="text-sm font-medium">Sair</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
