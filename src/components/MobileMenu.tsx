"use client";

import { useState } from "react";
import { Menu, X, LayoutDashboard, Wallet, CreditCard, Key, Users, Gift, Star, Settings, HelpCircle, MessageSquare } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const getLinkClass = (path: string) => {
    const isActive = pathname === path;
    return isActive
      ? "flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#eab308] text-[#0f1115] font-bold text-sm"
      : "flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#9ca3af] hover:text-white hover:bg-[#181a20] transition-colors font-medium text-sm";
  };

  const closeMenu = () => setIsOpen(false);

  return (
    <div className="md:hidden">
      <button 
        onClick={() => setIsOpen(true)}
        className="text-[#9ca3af] hover:text-white transition-colors"
      >
        <Menu size={24} />
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm transition-opacity"
          onClick={closeMenu}
        />
      )}

      {/* Drawer */}
      <div 
        className={`fixed inset-y-0 left-0 w-64 bg-[#0f1115] border-r border-[#1f2229] z-50 transform transition-transform duration-300 flex flex-col font-sans ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#eab308] rounded flex items-center justify-center font-black text-2xl text-black">K</div>
            <span className="font-black text-xl text-white tracking-tight leading-tight">KNIGHT<br/><span className="text-[11px] text-[#9ca3af] font-normal tracking-normal">Cartões</span></span>
          </div>
          <button onClick={closeMenu} className="text-[#9ca3af] hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-6">
          <div>
            <h3 className="text-[10px] font-bold text-[#4b5563] mb-3 uppercase tracking-widest px-2">Plataforma</h3>
            <nav className="space-y-1">
              <Link href="/dashboard" onClick={closeMenu} className={getLinkClass("/dashboard")}>
                <LayoutDashboard size={16} /> Dashboard
              </Link>
              <Link href="/recharge" onClick={closeMenu} className={getLinkClass("/recharge")}>
                <Wallet size={16} /> Recarga de Saldo
              </Link>
              <Link href="/buy/cards" onClick={closeMenu} className={getLinkClass("/buy/cards")}>
                <CreditCard size={16} /> Comprar Cartões
              </Link>
              <Link href="/buy/logins" onClick={closeMenu} className={getLinkClass("/buy/logins")}>
                <Key size={16} /> Comprar Logins
              </Link>
            </nav>
          </div>

          <div>
            <h3 className="text-[10px] font-bold text-[#4b5563] mb-3 uppercase tracking-widest px-2">Recursos</h3>
            <nav className="space-y-1">
              <Link href="/referrals" onClick={closeMenu} className={getLinkClass("/referrals")}>
                <Users size={16} /> Indicação
              </Link>
              <Link href="/drops" onClick={closeMenu} className={getLinkClass("/drops")}>
                <Gift size={16} /> Drops
              </Link>
              <Link href="/reviews" onClick={closeMenu} className={getLinkClass("/reviews")}>
                <Star size={16} /> Avaliações
              </Link>
            </nav>
          </div>

          <div>
            <h3 className="text-[10px] font-bold text-[#4b5563] mb-3 uppercase tracking-widest px-2">Conta e Suporte</h3>
            <nav className="space-y-1">
              <Link href="/settings" onClick={closeMenu} className={getLinkClass("/settings")}>
                <Settings size={16} /> Configurações
              </Link>
              <Link href="/redeem" onClick={closeMenu} className={getLinkClass("/redeem")}>
                <Gift size={16} /> Resgatar Gift
              </Link>
              <Link href="/faq" onClick={closeMenu} className={getLinkClass("/faq")}>
                <HelpCircle size={16} /> Dúvidas e termos
              </Link>
            </nav>
          </div>
        </div>

        <div className="p-4 border-t border-[#1f2229]">
          <a href="https://discord.gg/sagaz" target="_blank" className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-full font-bold text-sm transition-colors">
            <MessageSquare size={18} />
            Juntar-se ao Discord
          </a>
        </div>
      </div>
    </div>
  );
}
