import Link from "next/link";
import { ArrowLeft, Eye } from "lucide-react";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-[#0f1115] flex flex-col items-center justify-center p-4 relative font-sans">
      <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-[#9ca3af] hover:text-white transition-colors text-sm font-medium">
        <ArrowLeft size={16} />
        Voltar
      </Link>
      
      <div className="w-full max-w-[400px] my-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Criar sua conta</h1>
          <p className="text-sm text-[#9ca3af]">Digite seus dados para criar uma conta na KNIGHT</p>
        </div>
        
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-white mb-2">Nome completo</label>
            <input 
              type="text" 
              className="w-full bg-[#181a20] border border-transparent rounded-lg px-4 py-3 text-white placeholder-[#4b5563] focus:outline-none focus:border-[#eab308] transition-colors"
              placeholder="Digite seu nome completo"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-white mb-2">Email</label>
            <input 
              type="email" 
              className="w-full bg-[#181a20] border border-transparent rounded-lg px-4 py-3 text-white placeholder-[#4b5563] focus:outline-none focus:border-[#eab308] transition-colors"
              placeholder="seu@email.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-white mb-2">Senha</label>
            <div className="relative">
              <input 
                type="password" 
                className="w-full bg-[#181a20] border border-transparent rounded-lg px-4 py-3 text-white placeholder-[#4b5563] focus:outline-none focus:border-[#eab308] transition-colors pr-10"
                placeholder="Digite sua senha"
              />
              <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4b5563] hover:text-[#9ca3af]">
                <Eye size={18} />
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-bold text-white mb-2">Confirmar senha</label>
            <div className="relative">
              <input 
                type="password" 
                className="w-full bg-[#181a20] border border-transparent rounded-lg px-4 py-3 text-white placeholder-[#4b5563] focus:outline-none focus:border-[#eab308] transition-colors pr-10"
                placeholder="Confirme sua senha"
              />
              <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4b5563] hover:text-[#9ca3af]">
                <Eye size={18} />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-white mb-2">ID de indicação (opcional)</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                className="flex-1 bg-[#181a20] border border-transparent rounded-lg px-4 py-3 text-white placeholder-[#4b5563] focus:outline-none focus:border-[#eab308] transition-colors"
                placeholder="Cole o ID de indicação aqui"
              />
              <button type="button" className="bg-[#181a20] text-[#4b5563] font-bold px-4 rounded-lg">
                Validar
              </button>
            </div>
            <p className="text-[11px] text-[#4b5563] mt-1">Se alguém te indicou, cole o ID de indicação aqui.</p>
          </div>

          <div>
            <label className="block text-sm font-bold text-white mb-2">Verificação de segurança</label>
            <div className="w-full bg-[#181a20] border border-transparent rounded-lg p-4 flex justify-center">
              {/* reCAPTCHA mockup */}
              <div className="w-[300px] h-[74px] bg-[#222222] border border-[#333333] rounded-[3px] flex items-center px-3 justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 bg-white border-2 border-[#c1c1c1] rounded-[2px] flex items-center justify-center">
                    {/* Checkmark would go here */}
                  </div>
                  <span className="text-[14px] text-white">Não sou um robô</span>
                </div>
                <div className="flex flex-col items-center">
                  <img src="https://www.gstatic.com/recaptcha/api2/logo_48.png" alt="reCAPTCHA" className="w-8 opacity-90" />
                  <span className="text-[10px] text-[#9ca3af] mt-1">reCAPTCHA</span>
                  <div className="text-[8px] text-[#9ca3af] flex gap-1">
                    <span>Privacidade</span>-<span>Termos</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <button type="button" className="w-full bg-[#181a20] text-[#9ca3af] font-bold text-sm py-3.5 rounded-lg transition-colors mt-2 cursor-not-allowed">
            Criar conta
          </button>
        </form>
        
        <div className="mt-6 text-center text-sm text-[#9ca3af]">
          Já tem uma conta? <Link href="/login" className="text-white hover:underline font-medium underline">Fazer login</Link>
        </div>
      </div>
    </div>
  );
}
