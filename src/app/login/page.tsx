"use client";
import Link from "next/link";
import {
  ArrowLeft,
  Loader2,
  CheckCircle2,
  ShieldCheck,
  Wifi,
  ArrowRight,
} from "lucide-react";
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
  const [method2FA, setMethod2FA] = useState("EMAIL");
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

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

      if (data.requires2FA === false) {
        // Direct login
        const resLogin = await signIn("credentials", {
          email,
          password,
          code: "NONE",
          redirect: false,
        });
        if (resLogin?.error) throw new Error(resLogin.error);
        router.push("/dashboard");
        router.refresh();
        return;
      }

      setMethod2FA(data.method || "EMAIL");
      if (data.method === "APP") {
        setSuccess("Abra seu aplicativo Authenticator e digite o código.");
      } else {
        setSuccess("Código enviado com sucesso para o seu e-mail!");
      }
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

    try {
      const res = await sendPasswordResetOtp(email);
      setLoading(false);

      if (res?.error) {
        setError(res.error);
      } else {
        setSuccess(
          "Se o e-mail existir, um código foi enviado para recuperação.",
        );
        setStep(4);
      }
    } catch (err: any) {
      setLoading(false);
      setError("Ocorreu um erro inesperado ao conectar com o servidor.");
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
    <div className="min-h-screen bg-[#050505] flex w-full font-sans text-white overflow-hidden">
      {/* Left Column (Form) */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12 relative z-10">
        <Link
          href="/"
          className="absolute top-8 left-8 flex items-center gap-2 text-[#71717a] hover:text-white transition-colors text-sm font-medium"
        >
          <ArrowLeft size={16} /> Voltar para o início
        </Link>

        <div className="w-full max-w-[420px] bg-[#121214] rounded-2xl p-8 sm:p-10 border border-[#27272a] shadow-2xl relative">
          <div className="mb-8 text-center sm:text-left">
            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
              {step === 1 && "Bem-vindo de volta!"}
              {step === 2 && "Verificação de Segurança"}
              {step === 3 && "Recuperar Senha"}
              {step === 4 && "Nova Senha"}
            </h1>
            <p className="text-[#a1a1aa] text-sm">
              {step === 1 && "Entre com suas credenciais para acessar"}
              {step === 2 &&
                (method2FA === "APP"
                  ? "Digite o código do seu Authenticator"
                  : "Digite o código enviado ao seu e-mail")}
              {step === 3 && "Digite seu e-mail para enviarmos um código"}
              {step === 4 && "Insira o código e defina sua nova senha"}
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm mb-6 text-center backdrop-blur-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-3 rounded-lg text-sm mb-6 text-center backdrop-blur-sm">
              {success}
            </div>
          )}

          {step === 1 && (
            <form className="space-y-4" onSubmit={handleSendOtp}>
              <div>
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setIsPasswordFocused(false)}
                  className="w-full bg-[#18181b] border border-[#27272a] rounded-lg px-4 py-3 text-white placeholder-[#52525b] focus:outline-none focus:border-[#52525b] focus:ring-1 focus:ring-[#52525b] transition-all"
                  placeholder="E-mail ou Usuário"
                />
              </div>
              <div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                  className="w-full bg-[#18181b] border border-[#27272a] rounded-lg px-4 py-3 text-white placeholder-[#52525b] focus:outline-none focus:border-[#52525b] focus:ring-1 focus:ring-[#52525b] transition-all tracking-widest"
                  placeholder="Senha (••••••••)"
                />
              </div>

              {/* Simulated Captcha */}
              <div className="flex items-center gap-3 bg-[#0a0a0a] border border-[#27272a] rounded-lg p-3 mt-4">
                <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                </div>
                <span className="text-[#a1a1aa] text-sm font-medium">
                  Sucesso!
                </span>
                <div className="ml-auto flex items-center gap-1.5 opacity-60">
                  <ShieldCheck className="w-4 h-4 text-[#71717a]" />
                  <span className="text-[10px] text-[#71717a] uppercase tracking-wider font-bold">
                    Secured
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !email || !password}
                className="w-full bg-gradient-to-r from-[#52525b] to-[#3f3f46] hover:from-[#71717a] hover:to-[#52525b] text-white font-bold text-sm py-4 rounded-lg transition-all flex justify-center items-center gap-2 mt-2 disabled:opacity-50 shadow-lg shadow-black/20"
              >
                {loading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  "Entrar"
                )}
              </button>

              <div className="flex items-center justify-between mt-6 pt-6 border-t border-[#27272a]">
                <button
                  type="button"
                  onClick={() => {
                    setStep(3);
                    setError("");
                    setSuccess("");
                  }}
                  className="text-sm text-[#71717a] hover:text-[#d4d4d8] transition-colors"
                >
                  Esqueci a senha
                </button>
                <Link
                  href="/register"
                  className="text-sm text-[#71717a] hover:text-[#d4d4d8] transition-colors flex items-center gap-1"
                >
                  Criar conta <ArrowRight size={14} />
                </Link>
              </div>
            </form>
          )}

          {step === 2 && (
            <form className="space-y-4" onSubmit={handleLogin}>
              <div>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full bg-[#18181b] border border-[#27272a] rounded-lg px-4 py-3 text-white placeholder-[#52525b] focus:outline-none focus:border-[#52525b] focus:ring-1 focus:ring-[#52525b] transition-all text-center text-xl tracking-[0.5em]"
                  placeholder="000000"
                />
              </div>

              <button
                type="submit"
                disabled={loading || code.length !== 6}
                className="w-full bg-gradient-to-r from-[#52525b] to-[#3f3f46] hover:from-[#71717a] hover:to-[#52525b] text-white font-bold text-sm py-4 rounded-lg transition-all flex justify-center items-center gap-2 disabled:opacity-50 shadow-lg"
              >
                {loading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  "Validar e Entrar"
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setSuccess("");
                  setCode("");
                }}
                className="w-full bg-transparent text-[#71717a] hover:text-white font-medium text-sm py-2 transition-colors mt-2"
              >
                Voltar e usar outra senha
              </button>
            </form>
          )}

          {step === 3 && (
            <form className="space-y-4" onSubmit={handleForgotSendOtp}>
              <div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#18181b] border border-[#27272a] rounded-lg px-4 py-3 text-white placeholder-[#52525b] focus:outline-none focus:border-[#52525b] focus:ring-1 focus:ring-[#52525b] transition-all"
                  placeholder="E-mail cadastrado"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !email}
                className="w-full bg-gradient-to-r from-[#52525b] to-[#3f3f46] hover:from-[#71717a] hover:to-[#52525b] text-white font-bold text-sm py-4 rounded-lg transition-all flex justify-center items-center gap-2 mt-2 disabled:opacity-50 shadow-lg"
              >
                {loading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  "Enviar Código"
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setError("");
                }}
                className="w-full bg-transparent text-[#71717a] hover:text-white font-medium text-sm py-2 transition-colors mt-2"
              >
                Lembrou a senha? Voltar ao login
              </button>
            </form>
          )}

          {step === 4 && (
            <form className="space-y-4" onSubmit={handleResetPassword}>
              <div>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full bg-[#18181b] border border-[#27272a] rounded-lg px-4 py-3 text-white placeholder-[#52525b] focus:outline-none focus:border-[#52525b] focus:ring-1 focus:ring-[#52525b] transition-all text-center text-xl tracking-[0.5em] mb-4"
                  placeholder="000000"
                />
              </div>
              <div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                  className="w-full bg-[#18181b] border border-[#27272a] rounded-lg px-4 py-3 text-white placeholder-[#52525b] focus:outline-none focus:border-[#52525b] focus:ring-1 focus:ring-[#52525b] transition-all tracking-widest"
                  placeholder="Nova Senha (••••••••)"
                />
              </div>

              <button
                type="submit"
                disabled={loading || code.length !== 6 || password.length < 6}
                className="w-full bg-gradient-to-r from-[#52525b] to-[#3f3f46] hover:from-[#71717a] hover:to-[#52525b] text-white font-bold text-sm py-4 rounded-lg transition-all flex justify-center items-center gap-2 mt-2 disabled:opacity-50 shadow-lg"
              >
                {loading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  "Confirmar Nova Senha"
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep(3);
                  setError("");
                  setSuccess("");
                }}
                className="w-full bg-transparent text-[#71717a] hover:text-white font-medium text-sm py-2 transition-colors mt-2"
              >
                Reenviar código
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Right Column (Visual) */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#050505] relative overflow-hidden items-center justify-center border-l border-[#1a1a1a]">
        {/* Abstract circular shapes */}
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-blue-900/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-900/10 blur-[120px]" />
        <div className="absolute top-[40%] left-[50%] w-[300px] h-[300px] rounded-full bg-purple-900/5 blur-[80px]" />

        {/* Credit Cards Illustration */}
        <div className="relative w-full max-w-lg aspect-square perspective-[1500px] flex items-center justify-center">
          {/* Back Card Wrapper */}
          <div className="absolute inset-0 flex items-center justify-center animate-float-delayed pointer-events-none z-0">
            {/* Back Card (Static) - Platinum Style */}
            <div className="absolute w-80 h-48 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-300 rounded-2xl border border-gray-400 shadow-[0_30px_60px_rgba(30,27,75,0.6)] transform -rotate-12 translate-x-[-15%] translate-y-[15%] p-5 flex flex-col justify-between backdrop-blur-md z-10 transition-transform duration-700">
              <div className="absolute inset-1 border border-gray-400/40 rounded-xl pointer-events-none" />
              <div className="flex justify-between items-start relative z-10">
                <div className="w-10 h-7 rounded-md bg-gradient-to-br from-yellow-100 to-yellow-500 border border-yellow-600/30 opacity-80 shadow-sm" />
                <div className="text-[11px] font-black text-gray-800 tracking-[0.2em] uppercase">
                  SAGAZzz Express
                </div>
              </div>
              <div className="space-y-4 relative z-10">
                <div className="text-gray-800 font-mono tracking-[0.15em] text-base font-semibold drop-shadow-sm">
                  3759 876543 21001
                </div>
                <div className="flex justify-between text-[9px] text-gray-700 uppercase tracking-widest font-bold">
                  <div className="flex flex-col">
                    <span className="text-[7px] text-gray-500 leading-none mb-1">
                      Member Since
                    </span>
                    <span>22</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[7px] text-gray-500 leading-none mb-1">
                      Valid Thru
                    </span>
                    <span>12/28</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Front Card Wrapper */}
          <div className="absolute inset-0 flex items-center justify-center animate-float pointer-events-none z-10">
              {/* Front Card (Flipping) - Black Card Style */}
              <div
                className={`absolute w-80 h-48 z-20 transition-all duration-700 [transform-style:preserve-3d] pointer-events-auto ${
                  isPasswordFocused
                    ? "translate-x-[15%] translate-y-[-15%] [transform:rotateY(180deg)_rotateZ(0deg)_scale(1.1)] shadow-[0_40px_80px_rgba(0,0,0,0.9)]"
                    : "translate-x-[15%] translate-y-[-15%] [transform:rotateY(0deg)_rotateZ(12deg)] hover:rotate-6 hover:scale-105 shadow-[0_30px_60px_rgba(0,0,0,0.8)]"
                }`}
              >
                {/* Front Side */}
                <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] bg-gradient-to-br from-zinc-900 via-black to-zinc-900 rounded-2xl border border-zinc-700 p-5 flex flex-col justify-between backdrop-blur-md">
                  <div className="absolute inset-1 border-2 border-dashed border-zinc-600/30 rounded-xl pointer-events-none" />
                  <div className="absolute inset-1.5 border border-zinc-700/50 rounded-lg pointer-events-none" />

                  <div className="flex justify-between items-start relative z-10">
                    <div className="w-10 h-7 rounded-md bg-gradient-to-br from-yellow-200 to-yellow-600 border border-yellow-700/50 shadow-sm" />
                    <div className="text-[11px] font-black text-zinc-300 tracking-[0.2em] uppercase">
                      SAGAZzz Express
                    </div>
                  </div>
                  <div className="space-y-4 relative z-10">
                    <div className="text-zinc-300 font-mono tracking-[0.1em] text-sm shadow-sm truncate max-w-[250px] drop-shadow-md">
                      {email || "seu@email.com"}
                    </div>
                    <div className="flex justify-between text-[9px] text-zinc-400 uppercase tracking-widest font-bold">
                      <div className="flex flex-col">
                        <span className="text-[7px] text-zinc-500 leading-none mb-1">
                          Member Since
                        </span>
                        <span className="truncate max-w-[120px]">
                          Premium Black
                        </span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[7px] text-zinc-500 leading-none mb-1">
                          Valid Thru
                        </span>
                        <span>09/27</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Back Side */}
                <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] bg-gradient-to-br from-zinc-900 via-black to-zinc-900 rounded-2xl border border-zinc-700 p-0 flex flex-col shadow-[0_30px_60px_rgba(0,0,0,0.8)] overflow-hidden">
                  <div className="w-full h-12 bg-black mt-6 shadow-inner" />
                  <div className="px-6 mt-4 w-full flex justify-end">
                    <div className="bg-gray-200 w-full max-w-[200px] h-10 rounded-sm flex items-center justify-end px-4 overflow-hidden border border-gray-300">
                      <span className="text-black font-mono font-bold tracking-[0.3em] text-xl transform translate-y-1">
                        {password
                          ? "•".repeat(Math.min(password.length, 12))
                          : "••••••••"}
                      </span>
                    </div>
                  </div>
                  <div className="px-6 mt-auto mb-4 text-[9px] text-zinc-500 text-right uppercase tracking-wider">
                    SAGAZzz Express - Authorized Signature
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
