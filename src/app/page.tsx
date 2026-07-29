import Link from "next/link";
import { CreditCard, Zap, Users, ArrowRight, User2 } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0f1115] font-sans flex flex-col">
      {/* Header */}
      <header className="border-b border-[#181a20] py-4 px-6 sm:px-12 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#181a20] rounded flex items-center justify-center font-black text-white">K</div>
          <span className="font-black text-lg text-white tracking-tight">KNIGHT</span>
        </div>
        <div>
          <Link href="/dashboard" className="flex items-center gap-2 bg-[#181a20] hover:bg-[#1f2229] border border-[#262933] text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors">
            <User2 size={16} /> awd
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-20 text-center">
        <div className="inline-flex items-center gap-2 bg-[#181a20] border border-[#262933] rounded-full px-4 py-1.5 mb-8">
          <CreditCard size={14} className="text-[#9ca3af]" />
          <span className="text-xs text-[#9ca3af] font-medium">Cartões com qualidade <strong className="text-white">garantida</strong></span>
        </div>

        <h1 className="text-6xl sm:text-8xl font-black text-white tracking-tighter mb-8">
          KNIGHT
        </h1>

        <h2 className="text-xl sm:text-2xl text-[#9ca3af] mb-4">
          A plataforma mais confiável para <strong className="text-white">cartões digitais</strong>
        </h2>

        <p className="max-w-xl text-sm sm:text-base text-[#6b7280] mb-8 leading-relaxed">
          Compre cartões de forma simples, segura e instantânea. Entrega em segundos, suporte 24/7 e garantia total.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-8 mb-12">
          <div className="flex items-center gap-2 text-[#eab308] text-sm font-medium">
            <Zap size={16} /> Entrega Instantânea
          </div>
          <div className="flex items-center gap-2 text-[#eab308] text-sm font-medium">
            <Users size={16} /> +10.000 Clientes
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/dashboard" className="flex items-center justify-center gap-2 bg-[#181a20] hover:bg-[#1f2229] border border-[#262933] text-white px-6 py-3 rounded-lg font-bold transition-colors">
            <ArrowRight size={18} /> Ir para Dashboard
          </Link>
          <Link href="/buy/cards" className="flex items-center justify-center gap-2 bg-white hover:bg-gray-200 text-black px-6 py-3 rounded-lg font-bold transition-colors">
            Comprar Cartões
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#181a20] pt-16 pb-8 px-6 sm:px-12 mt-auto">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          <div className="max-w-sm">
            <h3 className="text-white font-black text-lg mb-4">KNIGHT</h3>
            <p className="text-[13px] text-[#6b7280] leading-relaxed mb-6">
              A plataforma mais confiável para compra de cartões digitais. Segurança, velocidade e qualidade garantidas.
            </p>
            <div className="flex items-center gap-2 text-[#eab308] text-[13px] font-bold">
              <Zap size={14} fill="currentColor" /> Entrega automática
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-bold text-[15px] mb-4">Navegação</h4>
            <ul className="space-y-3">
              <li><Link href="/dashboard" className="text-[13px] text-[#6b7280] hover:text-white transition-colors">Dashboard</Link></li>
              <li><Link href="/buy/cards" className="text-[13px] text-[#6b7280] hover:text-white transition-colors">Comprar Cartões</Link></li>
              <li><Link href="/recharge" className="text-[13px] text-[#6b7280] hover:text-white transition-colors">Recarregar Saldo</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-[15px] mb-4">Ajuda</h4>
            <ul className="space-y-3">
              <li><Link href="/faq" className="text-[13px] text-[#6b7280] hover:text-white transition-colors">Dúvidas e termos</Link></li>
            </ul>
          </div>
        </div>

        <div className="max-w-6xl mx-auto pt-8 border-t border-[#181a20] text-center">
          <p className="text-[12px] text-[#4b5563]">
            © 2026 KNIGHT. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
