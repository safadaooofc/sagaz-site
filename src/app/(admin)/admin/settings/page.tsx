import { ShieldAlert, PowerOff } from "lucide-react";

export default async function AdminSettingsPage() {
  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-black text-white mb-2">Configurações e Sistemas</h1>
      <p className="text-[#9ca3af] mb-8">Ative ou desative módulos inteiros da plataforma rapidamente.</p>
      
      <div className="space-y-4">
        {/* Card 1 */}
        <div className="bg-[#181a20] border border-[#262933] rounded-xl p-5 flex items-center justify-between">
          <div>
            <h3 className="text-white font-bold mb-1">Modo Manutenção</h3>
            <p className="text-sm text-[#6b7280]">Bloqueia o site para todos os usuários (exceto admins).</p>
          </div>
          <button className="w-12 h-6 bg-[#262933] rounded-full relative transition-colors">
            <div className="w-4 h-4 bg-white rounded-full absolute left-1 top-1"></div>
          </button>
        </div>

        {/* Card 2 */}
        <div className="bg-[#181a20] border border-[#262933] rounded-xl p-5 flex items-center justify-between">
          <div>
            <h3 className="text-white font-bold mb-1">Novos Cadastros</h3>
            <p className="text-sm text-[#6b7280]">Permitir que novas pessoas criem contas no site.</p>
          </div>
          <button className="w-12 h-6 bg-green-500 rounded-full relative transition-colors">
            <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
          </button>
        </div>

        {/* Card 3 */}
        <div className="bg-[#181a20] border border-[#262933] rounded-xl p-5 flex items-center justify-between">
          <div>
            <h3 className="text-white font-bold mb-1">Sistema de Vendas</h3>
            <p className="text-sm text-[#6b7280]">Pausar todas as vendas e checkout temporariamente.</p>
          </div>
          <button className="w-12 h-6 bg-green-500 rounded-full relative transition-colors">
            <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
          </button>
        </div>
      </div>

      <div className="mt-8 bg-red-500/10 border border-red-500/20 rounded-xl p-5">
        <div className="flex items-center gap-2 text-red-500 font-bold mb-2">
          <ShieldAlert size={18} /> Área de Perigo
        </div>
        <p className="text-sm text-red-400/80 mb-4">Ações irreversíveis do sistema.</p>
        
        <button className="bg-red-500/20 hover:bg-red-500/30 text-red-500 px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2">
          <PowerOff size={16} /> Limpar Logs do Sistema
        </button>
      </div>
    </div>
  );
}
