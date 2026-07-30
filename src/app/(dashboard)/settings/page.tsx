import { Settings, Shield, Bell, User, Key, CheckCircle2 } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="font-sans max-w-[800px]">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Configurações</h1>
        <p className="text-sm text-[#9ca3af]">Gerencie sua conta e preferências</p>
      </div>

      <div className="grid gap-6">
        {/* Perfil */}
        <div className="bg-[#181a20] border border-[#1f2229] rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <User size={18} className="text-[#eab308]" />
            <h2 className="text-lg font-bold text-white">Perfil</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#9ca3af] mb-1.5">E-mail</label>
              <input type="email" disabled value="usuario@email.com" className="w-full bg-[#0f1115] border border-[#1f2229] rounded-lg px-4 py-2.5 text-white/50 cursor-not-allowed" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#9ca3af] mb-1.5">Nome de Usuário</label>
              <input type="text" placeholder="Seu nome" className="w-full bg-[#0f1115] border border-[#1f2229] rounded-lg px-4 py-2.5 text-white placeholder-[#4b5563] focus:border-[#eab308] focus:outline-none transition-colors" />
            </div>
            <button className="bg-[#eab308] hover:bg-[#ca8a04] text-[#0f1115] font-bold text-sm px-6 py-2.5 rounded-lg transition-colors">
              Salvar Alterações
            </button>
          </div>
        </div>

        {/* Segurança */}
        <div className="bg-[#181a20] border border-[#1f2229] rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Key size={18} className="text-[#eab308]" />
            <h2 className="text-lg font-bold text-white">Segurança</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#9ca3af] mb-1.5">Senha Atual</label>
              <input type="password" placeholder="••••••••" className="w-full bg-[#0f1115] border border-[#1f2229] rounded-lg px-4 py-2.5 text-white placeholder-[#4b5563] focus:border-[#eab308] focus:outline-none transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#9ca3af] mb-1.5">Nova Senha</label>
              <input type="password" placeholder="Mínimo 6 caracteres" className="w-full bg-[#0f1115] border border-[#1f2229] rounded-lg px-4 py-2.5 text-white placeholder-[#4b5563] focus:border-[#eab308] focus:outline-none transition-colors" />
            </div>
            <button className="bg-[#1f2229] hover:bg-[#262933] border border-[#262933] text-white font-bold text-sm px-6 py-2.5 rounded-lg transition-colors">
              Atualizar Senha
            </button>
          </div>
        </div>

        {/* Conexões */}
        <div className="bg-[#181a20] border border-[#1f2229] rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield size={18} className="text-[#eab308]" />
            <h2 className="text-lg font-bold text-white">Conexões Sociais</h2>
          </div>
          <div className="flex items-center justify-between p-4 bg-[#0f1115] border border-[#1f2229] rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#5865F2]/10 flex items-center justify-center">
                <span className="font-bold text-[#5865F2] text-xl">D</span>
              </div>
              <div>
                <p className="font-bold text-white text-sm mb-0.5">Discord</p>
                <p className="text-xs text-[#9ca3af]">Vincule para resgatar drops exclusivos.</p>
              </div>
            </div>
            <button className="bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold text-[13px] px-4 py-2 rounded-md transition-colors">
              Vincular
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
