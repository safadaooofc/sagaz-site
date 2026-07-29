import { Zap, ShoppingCart } from "lucide-react";

export function Feed() {
  const sales = [
    { id: 1, user: "j***", product: "Cartão Mix", price: "R$ 25,00", time: "1h" },
    { id: 2, user: "j***", product: "Cartão Mix", price: "R$ 25,00", time: "1h" },
    { id: 3, user: "Z***", product: "Cartão Mix", price: "R$ 25,00", time: "4h" },
    { id: 4, user: "A***", product: "Cartão Mix", price: "R$ 25,00", time: "4h" },
    { id: 5, user: "7***", product: "Cartão Mix", price: "R$ 25,00", time: "5h" },
    { id: 6, user: "7***", product: "Cartão Mix", price: "R$ 25,00", time: "5h" },
  ];

  return (
    <div className="bg-[#181a20] border border-[#262933] rounded-lg p-5 flex flex-col h-full font-sans">
      <div className="flex items-center gap-2 mb-6">
        <Zap size={18} className="text-[#eab308]" fill="currentColor" />
        <h3 className="font-bold text-[15px] text-white">Vendas recentes</h3>
      </div>
      
      <div className="flex-1 space-y-4">
        {sales.map((sale) => (
          <div key={sale.id} className="flex items-start gap-4 p-2 rounded hover:bg-[#1a1c23] transition-colors">
            <div className="w-8 h-8 rounded bg-[#1f2229] border border-[#2c303a] flex items-center justify-center shrink-0 text-[#6b7280]">
              <ShoppingCart size={14} />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-0.5">
                <span className="text-[13px] font-bold text-white">{sale.user}<span className="text-[#4b5563]">*****************</span></span>
                <span className="text-[13px] font-bold text-white">{sale.price}</span>
              </div>
              <div className="flex justify-between items-center text-[#9ca3af] text-[11px]">
                <span>{sale.product}</span>
                <span>{sale.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
