import { Users, DollarSign, TrendingUp, Link as LinkIcon, Copy, CheckCircle2, UserPlus, CreditCard } from "lucide-react";

export default function ReferralsPage() {
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
            <h3 className="text-2xl font-bold text-white mb-1">0</h3>
            <p className="text-[11px] text-[#6b7280]">Pessoas que você indicou</p>
          </div>
          <UserPlus size={16} className="text-[#4b5563]" />
        </div>
        
        <div className="bg-[#181a20] border border-[#262933] rounded-lg p-5 flex justify-between items-start">
          <div>
            <p className="text-[13px] font-bold text-white mb-1">Total de Ganhos</p>
            <h3 className="text-2xl font-bold text-white mb-1">R$ 0,00</h3>
            <p className="text-[11px] text-[#6b7280]">15% de comissão sobre recargas</p>
          </div>
          <DollarSign size={16} className="text-[#4b5563]" />
        </div>

        <div className="bg-[#181a20] border border-[#262933] rounded-lg p-5 flex justify-between items-start">
          <div>
            <p className="text-[13px] font-bold text-white mb-1">Taxa de Comissão</p>
            <h3 className="text-2xl font-bold text-white mb-1">15%</h3>
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
        <p className="text-[13px] text-[#9ca3af] mb-4">Compartilhe este link para indicar novos usuários e ganhar 15% de comissão</p>
        
        <div className="flex gap-2 mb-4">
          <div className="flex-1 bg-[#1f2229] border border-[#2c303a] rounded-md px-4 py-3 flex items-center overflow-hidden">
            <span className="text-[13px] text-white font-mono truncate">https://knight.com/registrar?code=69c5cb2ff8a6f791db6f9180</span>
          </div>
          <button className="bg-[#eab308] hover:bg-[#ca8a04] text-[#0f1115] p-3 rounded-md transition-colors shrink-0">
            <Copy size={20} />
          </button>
        </div>
        
        <div className="flex items-center gap-2 text-[13px] text-[#9ca3af]">
          <CheckCircle2 size={16} className="text-[#22c55e]" />
          <span>Você ganha 15% de comissão sempre que um indicado recarregar sua conta</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        <div className="bg-[#181a20] border border-[#262933] rounded-lg p-6 min-h-[250px] flex flex-col">
          <div className="flex items-center gap-2 mb-2">
            <UserPlus size={18} className="text-white" />
            <h3 className="font-bold text-white text-[15px]">Últimas Indicações</h3>
          </div>
          <p className="text-[13px] text-[#9ca3af] mb-6">Pessoas que se cadastraram usando seu link</p>
          
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <UserPlus size={32} className="text-[#2c303a] mb-4" />
            <p className="text-[13px] font-bold text-[#6b7280] mb-1">Nenhuma indicação ainda</p>
            <p className="text-[11px] text-[#4b5563]">Compartilhe seu link para começar a ganhar!</p>
          </div>
        </div>

        <div className="bg-[#181a20] border border-[#262933] rounded-lg p-6 min-h-[250px] flex flex-col">
          <div className="flex items-center gap-2 mb-2">
            <CreditCard size={18} className="text-white" />
            <h3 className="font-bold text-white text-[15px]">Últimos Ganhos</h3>
          </div>
          <p className="text-[13px] text-[#9ca3af] mb-6">Comissões recebidas por recargas de indicados</p>
          
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <CreditCard size={32} className="text-[#2c303a] mb-4" />
            <p className="text-[13px] font-bold text-[#6b7280] mb-1">Nenhum ganho ainda</p>
            <p className="text-[11px] text-[#4b5563]">Aguarde seus indicados recarregarem!</p>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-bold text-white mb-1">Sistema de Indicação</h2>
        <p className="text-[#9ca3af] text-[13px] mb-6">Entenda como funciona e como ganhar com indicações</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="flex items-center gap-2 font-bold text-[15px] text-white mb-2">
              <span className="w-5 h-5 rounded-full bg-[#eab308] text-[#0f1115] flex items-center justify-center text-[11px] font-black">1</span>
              Compartilhe
            </h4>
            <p className="text-[12px] text-[#9ca3af] leading-relaxed">Compartilhe seu link de indicação com amigos e conhecidos</p>
          </div>
          <div>
            <h4 className="flex items-center gap-2 font-bold text-[15px] text-white mb-2">
              <span className="w-5 h-5 rounded-full bg-[#eab308] text-[#0f1115] flex items-center justify-center text-[11px] font-black">2</span>
              Eles se Cadastram
            </h4>
            <p className="text-[12px] text-[#9ca3af] leading-relaxed">Quando alguém se cadastra usando seu link, fica vinculado a você</p>
          </div>
          <div>
            <h4 className="flex items-center gap-2 font-bold text-[15px] text-white mb-2">
              <span className="w-5 h-5 rounded-full bg-[#eab308] text-[#0f1115] flex items-center justify-center text-[11px] font-black">3</span>
              Você Ganha
            </h4>
            <p className="text-[12px] text-[#9ca3af] leading-relaxed">Ganhe 15% de comissão sempre que um indicado recarregar</p>
          </div>
        </div>
      </div>
    </div>
  );
}
