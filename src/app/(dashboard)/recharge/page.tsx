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

      <RechargeForm balance={user?.balance || 0} isEligibleForReferralBonus={isEligibleForReferralBonus || false} />
    </div>
  );
}
