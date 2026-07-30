import { prisma } from "@/lib/prisma";
import { Gift, Package, Plus } from "lucide-react";
import { createBalanceGift, createProductDrop } from "./actions";

export default async function AdminGiftsPage() {
  const products = await prisma.product.findMany({ select: { id: true, name: true } });
  
  const balanceGifts = await prisma.giftCode.findMany({
    orderBy: { createdAt: "desc" }
  });

  const dropGifts = await prisma.dropCode.findMany({
    include: { product: { select: { name: true } } },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-white">Gifts e Drops</h1>
        <p className="text-[#9ca3af] text-sm mt-1">Crie códigos de resgate de saldo ou produtos gratuitos.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Form Saldo */}
        <div className="bg-[#181a20] border border-[#262933] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 text-blue-500 flex items-center justify-center">
              <Gift size={20} />
            </div>
            <h2 className="text-lg font-bold text-white">Novo Gift de Saldo</h2>
          </div>
          
          <form action={createBalanceGift} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#9ca3af] uppercase tracking-wider mb-2">Código (Ex: BEMVINDO10)</label>
              <input name="code" type="text" required className="w-full bg-[#0f1115] border border-[#262933] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" placeholder="Digite o código" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#9ca3af] uppercase tracking-wider mb-2">Valor (R$)</label>
                <input name="amount" type="number" step="0.01" required className="w-full bg-[#0f1115] border border-[#262933] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" placeholder="0.00" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#9ca3af] uppercase tracking-wider mb-2">Máx. Usos</label>
                <input name="maxUses" type="number" required defaultValue={1} className="w-full bg-[#0f1115] border border-[#262933] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" />
              </div>
            </div>
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors">
              <Plus size={18} /> Criar Gift de Saldo
            </button>
          </form>
        </div>

        {/* Form Produto */}
        <div className="bg-[#181a20] border border-[#262933] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 text-purple-500 flex items-center justify-center">
              <Package size={20} />
            </div>
            <h2 className="text-lg font-bold text-white">Novo Drop de Produto</h2>
          </div>
          
          <form action={createProductDrop} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#9ca3af] uppercase tracking-wider mb-2">Código (Ex: JOGOGRATIS)</label>
              <input name="code" type="text" required className="w-full bg-[#0f1115] border border-[#262933] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors" placeholder="Digite o código" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#9ca3af] uppercase tracking-wider mb-2">Produto Vinculado</label>
                <select name="productId" required className="w-full bg-[#0f1115] border border-[#262933] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors">
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#9ca3af] uppercase tracking-wider mb-2">Máx. Usos</label>
                <input name="maxUses" type="number" required defaultValue={1} className="w-full bg-[#0f1115] border border-[#262933] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors" />
              </div>
            </div>
            <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors">
              <Plus size={18} /> Criar Drop de Produto
            </button>
          </form>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[#181a20] border border-[#262933] rounded-xl overflow-hidden">
          <div className="p-4 border-b border-[#262933]">
            <h3 className="font-bold text-white">Histórico de Gifts (Saldo)</h3>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#1f2229] border-b border-[#262933]">
                <th className="p-4 text-xs font-bold text-[#9ca3af] uppercase">Código</th>
                <th className="p-4 text-xs font-bold text-[#9ca3af] uppercase">Valor</th>
                <th className="p-4 text-xs font-bold text-[#9ca3af] uppercase">Usos</th>
              </tr>
            </thead>
            <tbody>
              {balanceGifts.map(g => (
                <tr key={g.id} className="border-b border-[#262933]">
                  <td className="p-4 font-bold text-white">{g.code}</td>
                  <td className="p-4 text-green-500 font-bold">R$ {g.amount.toFixed(2)}</td>
                  <td className="p-4 text-[#9ca3af]">{g.used} / {g.maxUses}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-[#181a20] border border-[#262933] rounded-xl overflow-hidden">
          <div className="p-4 border-b border-[#262933]">
            <h3 className="font-bold text-white">Histórico de Drops (Produto)</h3>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#1f2229] border-b border-[#262933]">
                <th className="p-4 text-xs font-bold text-[#9ca3af] uppercase">Código</th>
                <th className="p-4 text-xs font-bold text-[#9ca3af] uppercase">Produto</th>
                <th className="p-4 text-xs font-bold text-[#9ca3af] uppercase">Usos</th>
              </tr>
            </thead>
            <tbody>
              {dropGifts.map(g => (
                <tr key={g.id} className="border-b border-[#262933]">
                  <td className="p-4 font-bold text-white">{g.code}</td>
                  <td className="p-4 text-purple-400 font-bold">{g.product.name}</td>
                  <td className="p-4 text-[#9ca3af]">{g.used} / {g.maxUses}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
