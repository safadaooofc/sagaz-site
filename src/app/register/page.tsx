"use client";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, isRegister: true }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao solicitar código");
      
      setSuccess("Código enviado com sucesso para o seu e-mail!");
      setStep(2);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterAndLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await signIn("credentials", {
        email,
        password,
        code,
        name,
        inviteCode,
        isRegister: "true",
        redirect: false,
      });

      if (res?.error) {
        throw new Error(res.error);
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1115] flex flex-col items-center justify-center p-4 relative font-sans">
      <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-[#9ca3af] hover:text-white transition-colors text-sm font-medium">
        <ArrowLeft size={16} /> Voltar
      </Link>
      
      <div className="w-full max-w-[400px]">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">{step === 1 ? "Crie sua conta" : "Verificação de Segurança"}</h1>
          <p className="text-sm text-[#9ca3af]">
            {step === 1 ? "Preencha os dados abaixo para se cadastrar" : "Digite o código de 6 dígitos que enviamos para o seu e-mail"}
          </p>
        </div>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm mb-4 text-center">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-3 rounded-lg text-sm mb-4 text-center">
            {success}
          </div>
        )}
        
        {step === 1 ? (
          <form className="space-y-4" onSubmit={handleSendOtp}>
            <div>
              <label className="block text-sm font-bold text-white mb-2">Nome de Usuário</label>
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#181a20] border border-transparent rounded-lg px-4 py-3 text-white placeholder-[#4b5563] focus:outline-none focus:border-[#eab308] transition-colors"
                placeholder="Seu nome"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-white mb-2">Email</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#181a20] border border-transparent rounded-lg px-4 py-3 text-white placeholder-[#4b5563] focus:outline-none focus:border-[#eab308] transition-colors"
                placeholder="seu@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-white mb-2">Senha</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#181a20] border border-transparent rounded-lg px-4 py-3 text-white placeholder-[#4b5563] focus:outline-none focus:border-[#eab308] transition-colors tracking-widest"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-white mb-2 flex justify-between">
                <span>Código de Convite</span>
                <span className="text-[#9ca3af] font-normal text-xs">(Opcional)</span>
              </label>
              <input 
                type="text"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                className="w-full bg-[#181a20] border border-transparent rounded-lg px-4 py-3 text-white placeholder-[#4b5563] focus:outline-none focus:border-[#eab308] transition-colors"
                placeholder="Ex: XYZ123"
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loading || !email || !password || !name}
              className="w-full bg-white hover:bg-gray-200 text-black font-bold text-sm py-3.5 rounded-lg transition-colors flex justify-center items-center gap-2 mt-4 disabled:opacity-50"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : "Criar conta e Continuar"}
            </button>
          </form>
        ) : (
          <form className="space-y-4" onSubmit={handleRegisterAndLogin}>
            <div>
              <label className="block text-sm font-bold text-white mb-2">Código de 6 dígitos</label>
              <input 
                type="text" 
                required
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full bg-[#181a20] border border-transparent rounded-lg px-4 py-3 text-white placeholder-[#4b5563] focus:outline-none focus:border-[#eab308] transition-colors text-center text-xl tracking-[0.5em]"
                placeholder="000000"
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loading || code.length !== 6}
              className="w-full bg-white hover:bg-gray-200 text-black font-bold text-sm py-3.5 rounded-lg transition-colors flex justify-center items-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : "Validar Código"}
            </button>

            <button 
              type="button"
              onClick={() => {
                setStep(1);
                setSuccess("");
                setCode("");
              }}
              className="w-full bg-transparent text-[#9ca3af] hover:text-white font-medium text-sm py-2 transition-colors"
            >
              Voltar e corrigir dados
            </button>
          </form>
        )}
        
        {step === 1 && (
          <div className="mt-6 text-center text-sm text-[#9ca3af]">
            Já tem uma conta? <Link href="/login" className="text-white hover:underline font-medium underline">Fazer login</Link>
          </div>
        )}
      </div>
    </div>
  );
}
