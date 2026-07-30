"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Wallet, CreditCard, Key, Users, Gift, Star, Settings, HelpCircle, MessageSquare } from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();

  const getLinkClass = (path: string) => {
    const isActive = pathname === path;
    return isActive
      ? "flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#eab308] text-[#0f1115] font-bold text-sm"
      : "flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#9ca3af] hover:text-white hover:bg-[#181a20] transition-colors font-medium text-sm";
  };

  return (
    <aside className="w-64 bg-[#0f1115] h-full hidden md:flex flex-col border-r border-[#1f2229] shrink-0 font-sans z-50">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-[#eab308] rounded flex items-center justify-center font-black text-2xl text-black">K</div>
        <span className="font-black text-xl text-white tracking-tight leading-tight">KNIGHT<br/><span className="text-[11px] text-[#9ca3af] font-normal tracking-normal">Cartões Digitais</span></span>
      </div>

      <div className="flex-1 overflow-y-auto hide-scrollbar px-4 py-2 space-y-6">
        <div>
          <h3 className="text-[10px] font-bold text-[#4b5563] mb-3 uppercase tracking-widest px-2">Plataforma</h3>
          <nav className="space-y-1">
            <Link href="/dashboard" className={getLinkClass("/dashboard")}>
              <LayoutDashboard size={16} />
              Dashboard
            </Link>
            <Link href="/recharge" className={getLinkClass("/recharge")}>
              <Wallet size={16} />
              Recarga de Saldo
            </Link>
            <Link href="/buy/cards" className={getLinkClass("/buy/cards")}>
              <CreditCard size={16} />
              Comprar Cartões
            </Link>
            <Link href="/buy/logins" className={getLinkClass("/buy/logins")}>
              <Key size={16} />
              Comprar Logins
            </Link>
          </nav>
        </div>

        <div>
          <h3 className="text-[10px] font-bold text-[#4b5563] mb-3 uppercase tracking-widest px-2">Recursos</h3>
          <nav className="space-y-1">
            <Link href="/referrals" className={getLinkClass("/referrals")}>
              <Users size={16} />
              Indicação
            </Link>
            <Link href="/drops" className={getLinkClass("/drops")}>
              <Gift size={16} />
              Drops
            </Link>
            <Link href="/reviews" className={getLinkClass("/reviews")}>
              <Star size={16} />
              Avaliações
            </Link>
          </nav>
        </div>

        <div>
          <h3 className="text-[10px] font-bold text-[#4b5563] mb-3 uppercase tracking-widest px-2">Conta e Suporte</h3>
          <nav className="space-y-1">
            <Link href="/settings" className={getLinkClass("/settings")}>
              <Settings size={16} />
              Configurações
            </Link>
            <Link href="/redeem" className={getLinkClass("/redeem")}>
              <Gift size={16} />
              Resgatar Gift
            </Link>
            <Link href="/faq" className={getLinkClass("/faq")}>
              <HelpCircle size={16} />
              Dúvidas e termos
            </Link>
          </nav>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <a href="#" className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-full font-bold text-sm transition-colors">
          <MessageSquare size={16} /> Entrar no Discord
        </a>
        <div className="flex items-center gap-3 mt-4 pt-4">
          <div className="w-10 h-10 rounded-full bg-[#181a20] border border-[#1f2229] flex items-center justify-center font-bold text-white text-lg">a</div>
          <div className="overflow-hidden leading-tight">
            <p className="text-sm font-medium text-[#9ca3af] truncate">awd</p>
            <p className="text-[11px] text-[#4b5563] truncate">p*********@gmail.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
