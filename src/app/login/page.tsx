"use client";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { sendPasswordResetOtp, resetPasswordWithOtp } from "./actions";

export default function LoginPage() {
  const router = useRouter();
  // step 1: login form, step 2: otp for login, step 3: forgot password email, step 4: forgot password otp & new pass
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
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
        body: JSON.stringify({ email, password, isRegister: false }),
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await signIn("credentials", {
        email,
        password,
        code,
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

  const handleForgotSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const res = await sendPasswordResetOtp(email);
    setLoading(false);

    if (res.error) {
      setError(res.error);
    } else {
      setSuccess("Se o e-mail existir, um código foi enviado para recuperação.");
      setStep(4);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const res = await resetPasswordWithOtp(email, code, password);
    setLoading(false);

    if (res.error) {
      setError(res.error);
    } else {
      setSuccess("Senha alterada com sucesso! Você pode fazer o login.");
      setCode("");
      setPassword("");
      setStep(1);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1115] flex flex-col items-center justify-center p-4 relative font-sans">
      <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-[#9ca3af] hover:text-white transition-colors text-sm font-medium">
        <ArrowLeft size={16} /> Voltar
      </Link>
      
      <div className="w-full max-w-[400px]">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            {step === 1 && "Entre na sua conta"}
            {step === 2 && "Verificação de Segurança"}
            {step === 3 && "Esqueceu a Senha?"}
            {step === 4 && "Criar Nova Senha"}
          </h1>
          <p className="text-sm text-[#9ca3af]">
            {step === 1 && "Digite seu email e senha para acessar o KNIGHT"}
            {step === 2 && "Digite o código de 6 dígitos que enviamos para o seu e-mail"}
            {step === 3 && "Digite seu e-mail para enviarmos um código de recuperação"}
            {step === 4 && "Digite o código recebido no e-mail e a sua nova senha"}
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
        
        {step === 1 && (
          <form className="space-y-4" onSubmit={handleSendOtp}>
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
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-bold text-white">Senha</label>
                <button type="button" onClick={() => { setStep(3); setError(""); setSuccess(""); }} className="text-xs text-[#9ca3af] hover:text-white transition-colors">Esqueceu sua senha?</button>
              </div>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#181a20] border border-transparent rounded-lg px-4 py-3 text-white placeholder-[#4b5563] focus:outline-none focus:border-[#eab308] transition-colors tracking-widest"
                placeholder="••••••••"
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loading || !email || !password}
              className="w-full bg-white hover:bg-gray-200 text-black font-bold text-sm py-3.5 rounded-lg transition-colors flex justify-center items-center gap-2 mt-2 disabled:opacity-50"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : "Continuar"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form className="space-y-4" onSubmit={handleLogin}>
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
              {loading ? <Loader2 size={16} className="animate-spin" /> : "Validar e Entrar"}
            </button>

            <button 
              type="button"
              onClick={() => { setStep(1); setSuccess(""); setCode(""); }}
              className="w-full bg-transparent text-[#9ca3af] hover:text-white font-medium text-sm py-2 transition-colors"
            >
              Voltar e usar outra senha
            </button>
          </form>
        )}

        {step === 3 && (
          <form className="space-y-4" onSubmit={handleForgotSendOtp}>
            <div>
              <label className="block text-sm font-bold text-white mb-2">Email cadastrado</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#181a20] border border-transparent rounded-lg px-4 py-3 text-white placeholder-[#4b5563] focus:outline-none focus:border-[#eab308] transition-colors"
                placeholder="seu@email.com"
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loading || !email}
              className="w-full bg-white hover:bg-gray-200 text-black font-bold text-sm py-3.5 rounded-lg transition-colors flex justify-center items-center gap-2 mt-2 disabled:opacity-50"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : "Enviar Código"}
            </button>

            <button 
              type="button"
              onClick={() => { setStep(1); setError(""); }}
              className="w-full bg-transparent text-[#9ca3af] hover:text-white font-medium text-sm py-2 transition-colors mt-2"
            >
              Lembrou a senha? Voltar ao login
            </button>
          </form>
        )}

        {step === 4 && (
          <form className="space-y-4" onSubmit={handleResetPassword}>
            <div>
              <label className="block text-sm font-bold text-white mb-2">Código recebido no Email</label>
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
            <div>
              <label className="block text-sm font-bold text-white mb-2">Nova Senha</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#181a20] border border-transparent rounded-lg px-4 py-3 text-white placeholder-[#4b5563] focus:outline-none focus:border-[#eab308] transition-colors tracking-widest"
                placeholder="••••••••"
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loading || code.length !== 6 || password.length < 6}
              className="w-full bg-white hover:bg-gray-200 text-black font-bold text-sm py-3.5 rounded-lg transition-colors flex justify-center items-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : "Confirmar Nova Senha"}
            </button>

            <button 
              type="button"
              onClick={() => { setStep(3); setError(""); setSuccess(""); }}
              className="w-full bg-transparent text-[#9ca3af] hover:text-white font-medium text-sm py-2 transition-colors mt-2"
            >
              Reenviar código
            </button>
          </form>
        )}
        
        {step === 1 && (
          <div className="mt-6 text-center text-sm text-[#9ca3af]">
            Não tem uma conta? <Link href="/register" className="text-white hover:underline font-medium underline">Criar conta</Link>
          </div>
        )}
      </div>
    </div>
  );
}
