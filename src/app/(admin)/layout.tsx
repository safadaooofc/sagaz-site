import Link from "next/link";
import { ShieldAlert, Users, ShoppingCart, Tag, Settings, ArrowLeft, Gift, MessageSquare } from "lucide-react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const role = (session?.user as any)?.role;

  if (role !== "ADMIN") {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-[#0f1115] flex font-sans">
      {/* Sidebar Admin */}
      <aside className="w-[280px] bg-[#181a20] border-r border-[#262933] flex flex-col">
        <div className="p-6 border-b border-[#262933]">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center font-black text-white">
              <ShieldAlert size={16} />
            </div>
            <span className="font-black text-lg text-white tracking-tight">KNIGHT ADMIN</span>
          </div>
          <Link href="/dashboard" className="flex items-center gap-2 text-xs text-[#9ca3af] hover:text-white transition-colors">
            <ArrowLeft size={14} /> Voltar para o site
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <div className="text-[11px] font-bold text-[#4b5563] uppercase tracking-wider mb-2 mt-4 px-3">Gestão</div>
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#9ca3af] hover:text-white hover:bg-[#1f2229] transition-all">
            <ShoppingCart size={18} /> Visão Geral
          </Link>
          <Link href="/admin/users" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#9ca3af] hover:text-white hover:bg-[#1f2229] transition-all">
            <Users size={18} /> Usuários
          </Link>
          <Link href="/admin/products" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#9ca3af] hover:text-white hover:bg-[#1f2229] transition-all">
            <Tag size={18} /> Produtos & Estoque
          </Link>
          <Link href="/admin/coupons" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#9ca3af] hover:text-white hover:bg-[#1f2229] transition-all">
            <Tag size={18} /> Cupons de Desconto
          </Link>

          <div className="text-[11px] font-bold text-[#4b5563] uppercase tracking-wider mb-2 mt-8 px-3">Marketing & Social</div>
          <Link href="/admin/marketing" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#9ca3af] hover:text-white hover:bg-[#1f2229] transition-all">
            <Gift size={18} /> Drops & Gifts
          </Link>
          <Link href="/admin/reviews" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#9ca3af] hover:text-white hover:bg-[#1f2229] transition-all">
            <MessageSquare size={18} /> Avaliações
          </Link>

          {role === "SUPERADMIN" && (
            <>
              <div className="text-[11px] font-bold text-[#4b5563] uppercase tracking-wider mb-2 mt-8 px-3">Segurança</div>
              <Link href="/admin/security" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-500 hover:text-red-400 hover:bg-red-500/10 transition-all">
                <ShieldAlert size={18} /> Monitoramento de IP
              </Link>
            </>
          )}

          <div className="text-[11px] font-bold text-[#4b5563] uppercase tracking-wider mb-2 mt-8 px-3">Sistema</div>
          <Link href="/admin/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#9ca3af] hover:text-white hover:bg-[#1f2229] transition-all">
            <Settings size={18} /> Configurações Gerais
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <div className="flex-1 overflow-y-auto bg-[#0f1115]">
          <div className="max-w-6xl mx-auto p-8">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
