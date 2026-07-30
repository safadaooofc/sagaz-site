import { DollarSign, CheckCircle2, Gift } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ReferralModal } from "./ReferralModal";

export default async function RechargePage() {
  const session = await auth();
  const user = session?.user?.id ? await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { referredById: true, referralRewardGiven: true }
  }) : null;

  const isEligibleForReferralBonus = user?.referredById && !user?.referralRewardGiven;

  return (
    <div className="max-w-[800px] mx-auto py-8 font-sans relative">
      {isEligibleForReferralBonus && <ReferralModal />}
      
      <div className="text-center mb-10">
        <h1 className="text-2xl font-bold text-white flex items-center justify-center gap-2 mb-2">
          <span className="text-[#eab308] font-black">$</span> Recarregar Saldo
        </h1>
        <p className="text-[#9ca3af] text-sm">Siga os passos abaixo para adicionar créditos à sua conta</p>
        
        <div className="flex items-center justify-center gap-8 mt-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#eab308] text-[#0f1115] flex items-center justify-center text-xs font-bold">1</div>
            <span className="text-white text-sm font-bold">Valor</span>
          </div>
          <div className="w-8 h-[1px] bg-[#262933]"></div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#181a20] border border-[#262933] text-[#4b5563] flex items-center justify-center text-xs font-bold">2</div>
            <span className="text-[#4b5563] text-sm font-bold">Método</span>
          </div>
          <div className="w-8 h-[1px] bg-[#262933]"></div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#181a20] border border-[#262933] text-[#4b5563] flex items-center justify-center text-xs font-bold">3</div>
            <span className="text-[#4b5563] text-sm font-bold">Confirmação</span>
          </div>
        </div>
      </div>

      {isEligibleForReferralBonus && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6 mb-8 flex items-start gap-4">
          <div className="bg-yellow-500/20 text-yellow-500 p-3 rounded-full shrink-0">
            <Gift size={24} />
          </div>
          <div>
            <h3 className="text-yellow-500 font-bold text-lg mb-1">🎁 Bônus de Indicação Ativo</h3>
            <p className="text-yellow-500/80 text-sm leading-relaxed">
              Complete sua primeira recarga de <strong>R$ 10,00 ou mais</strong> para desbloquear <strong>5% de Desconto Vitalício</strong> na loja automaticamente!
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-[#181a20] border border-[#262933] rounded-lg p-5 flex justify-between items-start">
          <div>
            <p className="text-sm font-bold text-white mb-1">Saldo Atual</p>
            <h3 className="text-3xl font-bold text-white">R$ 0,00</h3>
            <p className="text-[11px] text-[#6b7280] mt-1">Disponível na conta</p>
          </div>
          <span className="text-[#4b5563] font-black text-xl">$</span>
        </div>
        <div className="bg-[#181a20] border border-[#22c55e] rounded-lg p-5 flex justify-between items-start">
          <div>
            <p className="text-sm font-bold text-white mb-1">Saldo Após Recarga</p>
            <h3 className="text-3xl font-bold text-[#22c55e]">R$ 118,80</h3>
            <p className="text-[11px] text-[#22c55e] mt-1">+R$ 108,00 + R$ 10,80 bônus (10%)</p>
          </div>
          <CheckCircle2 className="text-[#22c55e]" size={20} />
        </div>
      </div>

      <div className="bg-[#181a20] border border-[#262933] rounded-lg p-6">
        <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
          <span className="text-[#eab308]">$</span> Etapa 1: Escolha o valor
        </h2>
        <p className="text-[#9ca3af] text-sm mb-6">Selecione quanto deseja recarregar</p>

        <div className="bg-[#1f2229] border border-[#3f3b1b] rounded-lg p-6 text-center mb-8">
          <h3 className="text-3xl font-bold text-[#eab308] mb-1">R$ 108,00</h3>
          <p className="text-[#6b7280] text-sm mb-2">Valor selecionado</p>
          <div className="flex items-center justify-center gap-1 text-[#22c55e] text-xs font-bold">
            <CheckCircle2 size={12} /> Bônus de 10% ativo!
          </div>
        </div>

        <div className="mb-6">
          <p className="text-sm font-bold text-white mb-4">Valores Rápidos</p>
          <div className="grid grid-cols-3 gap-3">
            {['10', '25', '50', '100', '200', '500'].map((val) => (
              <button key={val} className="bg-[#0f1115] border border-[#262933] hover:border-[#eab308] text-white py-3 rounded-lg text-sm font-bold transition-colors">
                R$ {val}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-bold text-white">Ou ajuste o valor</p>
          </div>
          <div className="relative pt-2 pb-6">
            <input 
              type="range" 
              min="10" 
              max="500" 
              className="w-full h-1 bg-[#262933] rounded-lg appearance-none cursor-pointer accent-[#eab308]"
            />
            <div className="flex justify-between text-[#6b7280] text-[11px] mt-2 font-bold">
              <span>R$ 10</span>
              <span>R$ 500</span>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <label className="block text-sm font-bold text-white mb-2">Valor personalizado</label>
          <input 
            type="text" 
            className="w-full bg-[#0f1115] border border-[#262933] rounded-lg px-4 py-3 text-white placeholder-[#4b5563] focus:outline-none focus:border-[#eab308] transition-colors"
            placeholder="Ex: 50,00"
          />
          <p className="text-[11px] text-[#6b7280] mt-2">Mínimo: R$ 10,00 • Máximo: R$ 500,00</p>
        </div>

        <button className="w-full bg-[#eab308] hover:bg-[#ca8a04] text-[#0f1115] font-bold text-[15px] py-4 rounded-lg transition-colors flex items-center justify-center gap-2">
          Continuar <span className="text-xl leading-none">›</span>
        </button>
      </div>
    </div>
  );
}
