import { DollarSign, ShoppingCart, Shield, Search, ChevronDown, Calendar, CreditCard, Building2 } from "lucide-react";

export default function BuyCardsPage() {
  const cards = [
    { bin: "4 2 3 0 7 2", brand: "VISA", valid: "0*/2*", level: "Infinite • CREDIT", bank: "Banco Do Brasil, S.A.", price: "R$ 65,00" },
    { bin: "4 2 2 0 0 7", brand: "VISA", valid: "1*/3*", level: "Infinite • CREDIT", bank: "Itau Unibanco Holding, S.A.", price: "R$ 65,00" },
    { bin: "4 5 3 2 1 1", brand: "VISA", valid: "1*/2*", level: "Platinum • CREDIT", bank: "Banco Bradesco Sa", price: "R$ 40,00" },
    { bin: "4 9 8 4 0 1", brand: "VISA", valid: "0*/2*", level: "Platinum • CREDIT", bank: "Banco Do Brasil, S.A.", price: "R$ 40,00" },
    { bin: "6 5 5 0 0 3", brand: "MASTERCARD", valid: "0*/3*", level: "Platinum • CREDIT", bank: "Banco Do Brasil Sa", price: "R$ 40,00", brandIcon: true },
    { bin: "4 3 8 9 0 0", brand: "VISA", valid: "1*/2*", level: "Classic • CREDIT", bank: "Dock Instituicao De Pagamento, S.A.", price: "R$ 25,00" },
  ];

  return (
    <div className="font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        <div className="bg-[#181a20] border border-[#262933] rounded-lg p-5 flex justify-between items-start">
          <div>
            <p className="text-[13px] font-bold text-white mb-1">Saldo disponível</p>
            <h3 className="text-2xl font-bold text-white mb-1">R$ 0,00</h3>
            <p className="text-[11px] text-[#6b7280]">Atualizado em tempo real após cada compra</p>
          </div>
          <span className="text-[#4b5563] font-black text-lg">$</span>
        </div>
        
        <div className="bg-[#181a20] border border-[#262933] rounded-lg p-5 flex justify-between items-start">
          <div>
            <p className="text-[13px] font-bold text-white mb-1">Cartões disponíveis</p>
            <h3 className="text-2xl font-bold text-white mb-1">6</h3>
            <p className="text-[11px] text-[#6b7280]">Reservamos cada cartão exclusivamente para você</p>
          </div>
          <ShoppingCart size={18} className="text-[#4b5563]" />
        </div>

        <div className="bg-[#181a20] border border-[#262933] rounded-lg p-5 flex justify-between items-start">
          <div>
            <p className="text-[13px] font-bold text-white mb-1">Segurança reforçada</p>
            <p className="text-[11px] text-[#9ca3af] leading-relaxed pr-6 mt-2">Exibimos apenas informações essenciais: bin, prévia da validade, nível e banco emissor. Os dados completos ficam disponíveis imediatamente após a compra.</p>
          </div>
          <Shield size={18} className="text-[#4b5563] shrink-0" />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4b5563]" />
          <input 
            type="text"
            placeholder="Pesquisar por banco, nível, BIN..."
            className="w-full bg-[#181a20] border border-[#1f2229] rounded-lg pl-10 pr-4 py-3 text-sm text-white placeholder-[#4b5563] focus:outline-none focus:border-[#eab308] transition-colors"
          />
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <select className="appearance-none bg-[#181a20] border border-[#1f2229] text-white px-4 py-3 pr-10 rounded-lg text-sm font-bold transition-colors focus:outline-none focus:border-[#eab308]">
              <option value="all">Todos os níveis</option>
              <option value="black">Black</option>
              <option value="business">Business</option>
              <option value="classic">Classic</option>
              <option value="gold">Gold</option>
              <option value="infinite">Infinite</option>
              <option value="platinum">Platinum</option>
            </select>
            <ChevronDown size={16} className="text-[#4b5563] absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          
          <div className="relative">
            <select className="appearance-none bg-[#181a20] border border-[#1f2229] text-white px-4 py-3 pr-10 rounded-lg text-sm font-bold transition-colors focus:outline-none focus:border-[#eab308]">
              <option value="all">Todas as modalidades</option>
              <option value="credit">Credit</option>
            </select>
            <ChevronDown size={16} className="text-[#4b5563] absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="flex justify-between items-end mb-4">
        <div>
          <h2 className="text-[15px] font-bold text-white">Cartões disponíveis</h2>
          <p className="text-xs text-[#9ca3af]">Cada compra entrega um cartão único.</p>
        </div>
        <div className="text-[11px] font-bold text-[#eab308]">
          6 Cartões Listados • 6 No Total
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card, i) => (
          <div key={i} className="bg-[#181a20] border border-[#262933] rounded-lg p-5 flex flex-col justify-between hover:border-[#3f3b1b] transition-colors group">
            <div className="mb-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-[10px] font-bold text-[#6b7280] mb-0.5">BIN</p>
                  <p className="font-mono text-white text-[15px] tracking-widest font-bold">
                    {card.bin} <span className="text-[#4b5563] tracking-widest">. . . . . . . .</span>
                  </p>
                </div>
                {card.brandIcon ? (
                  <div className="flex -space-x-1">
                    <div className="w-3 h-3 rounded-full bg-[#eb001b] mix-blend-screen"></div>
                    <div className="w-3 h-3 rounded-full bg-[#f79e1b] mix-blend-screen"></div>
                  </div>
                ) : (
                  <span className="font-bold text-white text-sm">{card.brand}</span>
                )}
              </div>

              <div className="space-y-2 text-[11px] text-[#9ca3af] font-medium">
                <div className="flex items-center gap-2">
                  <Calendar size={12} className="text-[#4b5563]" />
                  <span>Validade {card.valid}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard size={12} className="text-[#4b5563]" />
                  <span>{card.level}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 size={12} className="text-[#4b5563]" />
                  <span className="truncate">{card.bank}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#262933]">
              <div>
                <p className="text-[10px] font-bold text-[#6b7280] mb-0.5">VALOR</p>
                <p className="font-bold text-white text-[15px]">{card.price}</p>
              </div>
              <button className="bg-transparent text-[#6b7280] font-bold text-[13px] flex items-center gap-2 group-hover:text-white transition-colors">
                <ShoppingCart size={14} /> Saldo insuficiente
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
