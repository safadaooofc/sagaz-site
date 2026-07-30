import { prisma } from "@/lib/prisma";
import { DollarSign, ArrowUpRight, ArrowDownRight, Gift, ShoppingCart, Info } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export default async function FinancePage() {
  const movements = await prisma.balanceMovement.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: { user: { select: { name: true, email: true } } }
  });

  const totals = await prisma.balanceMovement.groupBy({
    by: ['type'],
    _sum: { amount: true }
  });

  const getAmountByType = (type: string) => {
    return totals.find(t => t.type === type)?._sum.amount || 0;
  };

  const totalRecharges = getAmountByType("RECHARGE");
  const totalReferrals = getAmountByType("REFERRAL_REWARD");
  const totalGifts = getAmountByType("GIFT_CODE");

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "RECHARGE": return <DollarSign size={16} className="text-green-500" />;
      case "REFERRAL_REWARD": return <Gift size={16} className="text-yellow-500" />;
      case "GIFT_CODE": return <Gift size={16} className="text-blue-500" />;
      case "PURCHASE": return <ShoppingCart size={16} className="text-red-500" />;
      default: return <Info size={16} className="text-gray-500" />;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-black text-white">Extrato e Movimentações</h1>
          <p className="text-[#9ca3af] text-sm mt-1">Histórico global de entrada e saída de saldos</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#181a20] border border-[#262933] rounded-xl p-6">
          <p className="text-sm font-bold text-[#9ca3af] mb-1">Total Recarregado (PIX/Crypto)</p>
          <h3 className="text-3xl font-black text-green-500">R$ {totalRecharges.toFixed(2)}</h3>
        </div>
        <div className="bg-[#181a20] border border-[#262933] rounded-xl p-6">
          <p className="text-sm font-bold text-[#9ca3af] mb-1">Total Dado em Convites</p>
          <h3 className="text-3xl font-black text-yellow-500">R$ {totalReferrals.toFixed(2)}</h3>
        </div>
        <div className="bg-[#181a20] border border-[#262933] rounded-xl p-6">
          <p className="text-sm font-bold text-[#9ca3af] mb-1">Total em Gift Codes</p>
          <h3 className="text-3xl font-black text-blue-500">R$ {totalGifts.toFixed(2)}</h3>
        </div>
      </div>

      <div className="bg-[#181a20] border border-[#262933] rounded-xl overflow-hidden">
        <div className="p-4 border-b border-[#262933]">
          <h3 className="text-lg font-bold text-white">Últimas 50 Movimentações</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#1f2229] border-b border-[#262933]">
                <th className="p-4 text-xs font-bold text-[#9ca3af] uppercase tracking-wider">Tipo</th>
                <th className="p-4 text-xs font-bold text-[#9ca3af] uppercase tracking-wider">Usuário</th>
                <th className="p-4 text-xs font-bold text-[#9ca3af] uppercase tracking-wider">Descrição</th>
                <th className="p-4 text-xs font-bold text-[#9ca3af] uppercase tracking-wider">Valor</th>
                <th className="p-4 text-xs font-bold text-[#9ca3af] uppercase tracking-wider">Data</th>
              </tr>
            </thead>
            <tbody>
              {movements.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-[#9ca3af] text-sm">
                    Nenhuma movimentação financeira registrada ainda.
                  </td>
                </tr>
              )}
              {movements.map(mov => (
                <tr key={mov.id} className="border-b border-[#262933] hover:bg-[#1f2229]/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-[#0f1115] border border-[#262933] flex items-center justify-center">
                        {getTypeIcon(mov.type)}
                      </div>
                      <span className="text-xs font-bold text-[#9ca3af]">{mov.type}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm font-bold text-white">{mov.user.name}</div>
                    <div className="text-xs text-[#6b7280]">{mov.user.email}</div>
                  </td>
                  <td className="p-4 text-sm text-[#9ca3af]">{mov.description || "-"}</td>
                  <td className="p-4">
                    <span className={`font-black text-sm flex items-center gap-1 ${mov.amount >= 0 ? "text-green-500" : "text-red-500"}`}>
                      {mov.amount >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                      R$ {Math.abs(mov.amount).toFixed(2)}
                    </span>
                  </td>
                  <td className="p-4 text-xs text-[#6b7280]">
                    {formatDistanceToNow(new Date(mov.createdAt), { addSuffix: true, locale: ptBR })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
