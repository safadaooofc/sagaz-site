import { Gift, ShieldCheck, Diamond, MessageSquare, ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function DropsPage() {
  return (
    <div className="font-sans">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Drops Disponíveis</h1>
        <p className="text-sm text-[#9ca3af]">Resgate cartões grátis dropados pela equipe</p>
      </div>

      <div className="bg-[#181a20] border border-[#262933] rounded-lg p-12 flex flex-col items-center justify-center text-center mb-8 min-h-[300px]">
        <Gift size={40} className="text-[#4b5563] mb-4" />
        <h3 className="font-bold text-[15px] text-[#6b7280] mb-1">Nenhum drop disponível</h3>
        <p className="text-[13px] text-[#4b5563]">Fique de olho! Novos drops aparecem regularmente.</p>
      </div>

      <div className="bg-[#181a20] border border-[#262933] rounded-lg p-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-5 h-5 rounded-full border-2 border-[#eab308] text-[#eab308] flex items-center justify-center font-bold text-xs shrink-0">i</div>
          <h2 className="text-lg font-bold text-white">Como Funcionam os Drops?</h2>
        </div>
        <p className="text-[13px] text-[#9ca3af] mb-8">Tudo que você precisa saber sobre os drops de cartões gratuitos</p>

        <div className="space-y-6 mb-8">
          <div className="flex gap-4">
            <Gift size={20} className="text-[#22c55e] shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-[14px] text-white mb-1">Drops Gratuitos</h4>
              <p className="text-[12px] text-[#9ca3af]">A equipe dropa cartões gratuitos regularmente. Quando um drop estiver ativo, você pode resgatar e ver todos os cartões.</p>
            </div>
          </div>

          <div className="flex gap-4">
            <ShieldCheck size={20} className="text-[#3b82f6] shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-[14px] text-white mb-1">Verificação Necessária</h4>
              <p className="text-[12px] text-[#9ca3af]">Para resgatar drops, você precisa estar verificado no servidor Discord. Vá em <a href="#" className="text-[#eab308] hover:underline font-bold">Configurações</a> para vincular e verificar.</p>
            </div>
          </div>
        </div>

        <div className="bg-[#2a1331] border border-[#482054] rounded-lg p-4 flex gap-4 mb-8">
          <Diamond size={20} className="text-[#c084fc] shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-[14px] text-white mb-1">Drops Exclusivos para Boosters</h4>
            <p className="text-[12px] text-[#c084fc] opacity-80">Os melhores drops são exclusivos para membros Booster! Se você tem Discord Nitro, dê boost no servidor para ter acesso a drops premium com cartões de maior qualidade.</p>
          </div>
        </div>

        <div className="bg-[#1f1e16] border border-[#3f3b1b] rounded-lg p-5">
          <div className="flex items-center gap-2 mb-4">
            <ShieldAlert size={16} className="text-[#eab308]" />
            <span className="text-[13px] font-bold text-white">Para garantir que você não perca nenhum drop:</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a href="https://discord.gg/seu-link-aqui" target="_blank" rel="noopener noreferrer" className="bg-[#181a20] hover:bg-[#1f2229] border border-[#262933] text-white py-3 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2">
              <MessageSquare size={16} /> Entrar no Discord
            </a>
            <Link href="/settings" className="bg-[#181a20] hover:bg-[#1f2229] border border-[#262933] text-white py-3 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2">
              <ShieldCheck size={16} /> Verificar Conta
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
