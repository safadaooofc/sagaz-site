import { prisma } from "@/lib/prisma";
import { Plus } from "lucide-react";

export default async function AdminCouponsPage() {
  const coupons = await prisma.coupon.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-white mb-2">Cupons de Desconto</h1>
          <p className="text-[#9ca3af]">Crie e gerencie códigos promocionais.</p>
        </div>
        <button className="bg-white hover:bg-gray-200 text-black px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2">
          <Plus size={16} /> Novo Cupom
        </button>
      </div>
      
      <div className="bg-[#181a20] border border-[#262933] rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm text-[#9ca3af]">
          <thead className="bg-[#1f2229] border-b border-[#262933]">
            <tr>
              <th className="px-6 py-4 font-bold text-white">Código</th>
              <th className="px-6 py-4 font-bold text-white">Desconto</th>
              <th className="px-6 py-4 font-bold text-white text-center">Usos</th>
              <th className="px-6 py-4 font-bold text-white text-center">Status</th>
              <th className="px-6 py-4 font-bold text-white text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map(coupon => (
              <tr key={coupon.id} className="border-b border-[#262933] hover:bg-[#1f2229]/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="inline-block bg-[#262933] text-white px-2 py-1 rounded font-mono text-sm tracking-widest">{coupon.code}</div>
                </td>
                <td className="px-6 py-4 text-white font-medium">
                  {coupon.discountPercent ? `${coupon.discountPercent}%` : `R$ ${coupon.discountFixed}`}
                </td>
                <td className="px-6 py-4 text-center">
                  {coupon.used} / {coupon.maxUses === 0 ? "Ilimitado" : coupon.maxUses}
                </td>
                <td className="px-6 py-4 text-center">
                  {coupon.active ? (
                    <span className="text-green-500 bg-green-500/10 px-2 py-1 rounded-md text-xs font-bold">Ativo</span>
                  ) : (
                    <span className="text-red-500 bg-red-500/10 px-2 py-1 rounded-md text-xs font-bold">Inativo</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-xs text-white font-medium bg-[#262933] hover:bg-[#374151] transition-colors px-3 py-1.5 rounded-md">
                    Editar
                  </button>
                </td>
              </tr>
            ))}
            {coupons.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center">Nenhum cupom ativo.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
