import { ShoppingCart, Shield, Search, ChevronDown, Gamepad2, Star, Globe } from "lucide-react";

export default function BuyLoginsPage() {
  const accounts = [
    { type: "Valorant NFA", region: "BR", rank: "Platina 2", details: "15-30 Skins", price: "R$ 20,00" },
    { type: "Valorant NFA", region: "NA", rank: "Diamante 1", details: "40+ Skins", price: "R$ 35,00" },
    { type: "League of Legends", region: "BR", rank: "Ouro 4", details: "100+ Skins", price: "R$ 25,00" },
    { type: "Minecraft NFA", region: "Global", rank: "Acesso Client", details: "Acesso ao launcher", price: "R$ 10,00" },
    { type: "Steam", region: "Global", rank: "CS2 Prime", details: "Sem restrições (VAC)", price: "R$ 45,00" },
    { type: "Crunchyroll Premium", region: "Global", rank: "Mensal", details: "Acesso compartilhado", price: "R$ 5,00" },
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
            <p className="text-[13px] font-bold text-white mb-1">Contas disponíveis</p>
            <h3 className="text-2xl font-bold text-white mb-1">6</h3>
            <p className="text-[11px] text-[#6b7280]">Reservamos cada conta exclusivamente para você</p>
          </div>
          <ShoppingCart size={18} className="text-[#4b5563]" />
        </div>

        <div className="bg-[#181a20] border border-[#262933] rounded-lg p-5 flex justify-between items-start">
          <div>
            <p className="text-[13px] font-bold text-white mb-1">Entrega Imediata</p>
            <p className="text-[11px] text-[#9ca3af] leading-relaxed pr-6 mt-2">Você receberá o formato "login:senha" imediatamente após a confirmação do pagamento. Lembre-se que contas NFA não permitem troca de dados.</p>
          </div>
          <Shield size={18} className="text-[#4b5563] shrink-0" />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4b5563]" />
          <input 
            type="text"
            placeholder="Pesquisar por jogo, serviço, rank..."
            className="w-full bg-[#181a20] border border-transparent rounded-lg pl-10 pr-4 py-3 text-sm text-white placeholder-[#4b5563] focus:outline-none focus:border-[#262933] transition-colors"
          />
        </div>
        <div className="flex gap-4">
          <button className="bg-[#181a20] border border-transparent hover:border-[#262933] text-white px-4 py-3 rounded-lg text-sm font-bold transition-colors flex items-center gap-2">
            Todas as categorias <ChevronDown size={16} className="text-[#4b5563]" />
          </button>
        </div>
      </div>

      <div className="flex justify-between items-end mb-4">
        <div>
          <h2 className="text-[15px] font-bold text-white">Contas e Logins</h2>
          <p className="text-xs text-[#9ca3af]">Acesso imediato após a compra.</p>
        </div>
        <div className="text-[11px] font-bold text-[#eab308]">
          6 Listadas • 6 No Total
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {accounts.map((acc, i) => (
          <div key={i} className="bg-[#181a20] border border-[#262933] rounded-lg p-5 flex flex-col justify-between hover:border-[#3f3b1b] transition-colors group">
            <div className="mb-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-[10px] font-bold text-[#6b7280] mb-0.5">TIPO</p>
                  <p className="text-white text-[15px] font-bold">
                    {acc.type}
                  </p>
                </div>
                <Gamepad2 size={20} className="text-[#4b5563]" />
              </div>

              <div className="space-y-2 text-[11px] text-[#9ca3af] font-medium">
                <div className="flex items-center gap-2">
                  <Globe size={12} className="text-[#4b5563]" />
                  <span>Região: {acc.region}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star size={12} className="text-[#4b5563]" />
                  <span>{acc.rank}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield size={12} className="text-[#4b5563]" />
                  <span className="truncate">{acc.details}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#262933]">
              <div>
                <p className="text-[10px] font-bold text-[#6b7280] mb-0.5">VALOR</p>
                <p className="font-bold text-white text-[15px]">{acc.price}</p>
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
