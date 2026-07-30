import { DollarSign, TrendingUp, Link as LinkIcon, CheckCircle2, UserPlus, CreditCard } from "lucide-react";
import { CopyLinkButton } from "@/components/CopyLinkButton";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function ReferralsPage() {
  const session = await auth();
  
  let referralCode = "";
  let totalReferrals = 0;
  let totalEarned = 0;
  let recentReferrals: any[] = [];
  
  if (session?.user?.id) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { referralCode: true, id: true }
    });
    
    // If no code, we fallback to user ID
    referralCode = user?.referralCode || user?.id || "";
    
    totalReferrals = await prisma.user.count({
      where: { referredById: session.user.id }
    });
    
    const earnings = await prisma.balanceMovement.aggregate({
      _sum: { amount: true },
      where: {
        userId: session.user.id,
        type: "REFERRAL_BONUS"
      }
    });
    
    totalEarned = earnings._sum.amount || 0;
    
    recentReferrals = await prisma.user.findMany({
      where: { referredById: session.user.id },
      select: { name: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      take: 5
    });
  }

  const formatCurrency = (val: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val);

  return (
    <div className="font-sans">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Sistema de Indicação</h1>
        <p className="text-sm text-[#9ca3af]">Acompanhe suas indicações e ganhos</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-[#181a20] border border-[#262933] rounded-lg p-5 flex justify-between items-start">
          <div>
            <p className="text-[13px] font-bold text-white mb-1">Total de Indicações</p>
            <h3 className="text-2xl font-bold text-white mb-1">{totalReferrals}</h3>
            <p className="text-[11px] text-[#6b7280]">Pessoas que você indicou</p>
          </div>
          <UserPlus size={16} className="text-[#4b5563]" />
        </div>
        
        <div className="bg-[#181a20] border border-[#262933] rounded-lg p-5 flex justify-between items-start">
          <div>
            <p className="text-[13px] font-bold text-white mb-1">Total de Ganhos</p>
            <h3 className="text-2xl font-bold text-white mb-1">{formatCurrency(totalEarned)}</h3>
            <p className="text-[11px] text-[#6b7280]">5% de comissão sobre recargas</p>
          </div>
          <DollarSign size={16} className="text-[#4b5563]" />
        </div>

        <div className="bg-[#181a20] border border-[#262933] rounded-lg p-5 flex justify-between items-start">
          <div>
            <p className="text-[13px] font-bold text-white mb-1">Taxa de Comissão</p>
            <h3 className="text-2xl font-bold text-white mb-1">5%</h3>
            <p className="text-[11px] text-[#6b7280]">Por cada recarga realizada</p>
          </div>
          <TrendingUp size={16} className="text-[#4b5563]" />
        </div>
      </div>

      <div className="bg-[#181a20] border border-[#262933] rounded-lg p-6 mb-8">
        <div className="flex items-center gap-2 mb-2">
          <LinkIcon size={18} className="text-white" />
          <h3 className="font-bold text-white text-[15px]">Link de Indicação</h3>
        </div>
        <p className="text-[13px] text-[#9ca3af] mb-4">Compartilhe este link para indicar novos usuários e ganhar 5% de comissão sempre que recarregarem.</p>
        
        <CopyLinkButton link={`/registrar?code=${referralCode}`} />
        
        <div className="flex items-center gap-2 text-[13px] text-[#9ca3af]">
          <CheckCircle2 size={16} className="text-[#22c55e]" />
          <span>Você ganha 5% de comissão sempre que um indicado recarregar sua conta. Eles ganham +10% de Bônus em todas as recargas!</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        <div className="bg-[#181a20] border border-[#262933] rounded-lg p-6 min-h-[250px] flex flex-col">
          <div className="flex items-center gap-2 mb-2">
            <UserPlus size={18} className="text-white" />
            <h3 className="font-bold text-white text-[15px]">Últimas Indicações</h3>
          </div>
          <p className="text-[13px] text-[#9ca3af] mb-6">Pessoas que se cadastraram usando seu link</p>
          
          <div className="flex-1 flex flex-col">
            {recentReferrals.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <UserPlus size={32} className="text-[#2c303a] mb-4" />
                <p className="text-[13px] font-bold text-[#6b7280] mb-1">Nenhuma indicação ainda</p>
                <p className="text-[11px] text-[#4b5563]">Compartilhe seu link para começar a ganhar!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentReferrals.map((r, i) => (
                  <div key={i} className="flex justify-between items-center bg-[#1f2229] p-3 rounded-lg border border-[#2c303a]">
                    <span className="text-sm font-bold text-white">{r.name || "Usuário"}</span>
                    <span className="text-xs text-[#9ca3af]">{new Date(r.createdAt).toLocaleDateString('pt-BR')}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-[#181a20] border border-[#262933] rounded-lg p-6 min-h-[250px] flex flex-col">
          <div className="flex items-center gap-2 mb-2">
            <CreditCard size={18} className="text-white" />
            <h3 className="font-bold text-white text-[15px]">Benefícios</h3>
          </div>
          <p className="text-[13px] text-[#9ca3af] mb-6">Como funciona a nossa divisão</p>
          
          <div className="flex-1 flex flex-col justify-center space-y-4">
            <div className="bg-[#2c303a]/20 p-4 rounded-lg border border-[#2c303a]">
              <p className="text-sm font-bold text-green-400 mb-1">Para quem foi convidado:</p>
              <p className="text-xs text-[#9ca3af]">+10% de Bônus em todas as recargas que fizer no site.</p>
            </div>
            <div className="bg-[#2c303a]/20 p-4 rounded-lg border border-[#2c303a]">
              <p className="text-sm font-bold text-yellow-500 mb-1">Para quem convidou (você):</p>
              <p className="text-xs text-[#9ca3af]">5% de comissão em cima de todas as recargas que o convidado fizer, direto no seu saldo.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
