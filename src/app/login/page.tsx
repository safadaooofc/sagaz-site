import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#0f1115] flex flex-col items-center justify-center p-4 relative font-sans">
      <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-[#9ca3af] hover:text-white transition-colors text-sm font-medium">
        <ArrowLeft size={16} />
        Voltar
      </Link>
      
      <div className="w-full max-w-[400px]">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Entre na sua conta</h1>
          <p className="text-sm text-[#9ca3af]">Digite seu email e senha para acessar o KNIGHT</p>
        </div>
        
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-white mb-2">Email</label>
            <input 
              type="email" 
              className="w-full bg-[#181a20] border border-transparent rounded-lg px-4 py-3 text-white placeholder-[#4b5563] focus:outline-none focus:border-[#eab308] transition-colors"
              placeholder="seu@email.com"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-bold text-white">Senha</label>
              <a href="#" className="text-xs text-[#9ca3af] hover:text-white transition-colors">Esqueceu sua senha?</a>
            </div>
            <input 
              type="password" 
              className="w-full bg-[#181a20] border border-transparent rounded-lg px-4 py-3 text-white placeholder-[#4b5563] focus:outline-none focus:border-[#eab308] transition-colors tracking-widest"
              placeholder="••••••••"
            />
          </div>
          
          <div className="py-2 flex justify-center">
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
          
          <button type="button" className="w-full bg-[#181a20] text-[#9ca3af] font-bold text-sm py-3.5 rounded-lg transition-colors mt-2 cursor-not-allowed">
            Entrar
          </button>
        </form>
        
        <div className="mt-6 text-center text-sm text-[#9ca3af]">
          Não tem uma conta? <Link href="/register" className="text-white hover:underline font-medium underline">Criar conta</Link>
        </div>
      </div>
    </div>
  );
}
