import { prisma } from "@/lib/prisma";
import { Plus, Gift, Box } from "lucide-react";

export default async function AdminMarketingPage() {
  const drops = await prisma.dropCode.findMany({ include: { product: true } });
  const gifts = await prisma.giftCode.findMany();

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-white mb-2">Marketing e Eventos</h1>
          <p className="text-[#9ca3af]">Crie Drops (Produtos) ou Gifts (Saldo) para os clientes resgatarem.</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 border border-yellow-500/20 px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2">
            <Gift size={16} /> Novo Gift (Saldo)
          </button>
          <button className="bg-white hover:bg-gray-200 text-black px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2">
            <Box size={16} /> Novo Drop (Produto)
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Drops Table */}
        <div className="bg-[#181a20] border border-[#262933] rounded-xl overflow-hidden">
          <div className="p-4 border-b border-[#262933] bg-[#1f2229]">
            <h2 className="text-white font-bold">Drops (Produtos Grátis)</h2>
          </div>
          <div className="p-4">
            {drops.length === 0 ? (
              <p className="text-sm text-[#6b7280]">Nenhum drop criado.</p>
            ) : (
              <ul className="space-y-3">
                {drops.map(drop => (
                  <li key={drop.id} className="flex justify-between items-center text-sm">
                    <span className="text-white font-mono bg-[#262933] px-2 py-1 rounded">{drop.code}</span>
                    <span className="text-[#9ca3af]">{drop.product.name}</span>
                    <span className="text-xs bg-[#262933] px-2 py-1 rounded">{drop.used}/{drop.maxUses}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Gifts Table */}
        <div className="bg-[#181a20] border border-[#262933] rounded-xl overflow-hidden">
          <div className="p-4 border-b border-[#262933] bg-[#1f2229]">
            <h2 className="text-white font-bold">Gifts (Saldo em Dinheiro)</h2>
          </div>
          <div className="p-4">
            {gifts.length === 0 ? (
              <p className="text-sm text-[#6b7280]">Nenhum gift code criado.</p>
            ) : (
              <ul className="space-y-3">
                {gifts.map(gift => (
                  <li key={gift.id} className="flex justify-between items-center text-sm">
                    <span className="text-white font-mono bg-[#262933] px-2 py-1 rounded">{gift.code}</span>
                    <span className="text-green-500 font-bold">R$ {gift.amount}</span>
                    <span className="text-xs bg-[#262933] px-2 py-1 rounded">{gift.used}/{gift.maxUses}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
