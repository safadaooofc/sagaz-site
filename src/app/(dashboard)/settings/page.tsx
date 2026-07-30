import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { LogOut, Link as LinkIcon, Shield, Key } from "lucide-react";
import { generateReferralCode, changePassword, logoutOtherDevices } from "./actions";

export default async function SettingsPage() {
  const session = await auth();
  const user = await prisma.user.findUnique({
    where: { id: session?.user?.id },
    include: { deviceSessions: true }
  });

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-black text-white mb-2">Configurações da Conta</h1>
      <p className="text-[#9ca3af] mb-8">Gerencie sua segurança, perfil e links de indicação.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Coluna Principal */}
        <div className="md:col-span-2 space-y-8">
          
          {/* Card Segurança (Senha) */}
          <div className="bg-[#181a20] border border-[#262933] rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Key size={20} className="text-blue-500" /> Segurança
            </h2>
            <form action={changePassword} className="space-y-4">
              <div>
                <label className="text-sm text-[#9ca3af] font-bold block mb-1">Senha Atual</label>
                <input name="currentPassword" type="password" required className="w-full bg-[#0f1115] border border-[#262933] rounded-lg px-4 py-2 text-white focus:border-blue-500 outline-none" />
              </div>
              <div>
                <label className="text-sm text-[#9ca3af] font-bold block mb-1">Nova Senha</label>
                <input name="newPassword" type="password" required className="w-full bg-[#0f1115] border border-[#262933] rounded-lg px-4 py-2 text-white focus:border-blue-500 outline-none" />
              </div>
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-lg transition-colors">
                Alterar Senha
              </button>
            </form>
          </div>

          {/* Card Sessões Ativas */}
          <div className="bg-[#181a20] border border-[#262933] rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Shield size={20} className="text-green-500" /> Sessões Ativas
              </h2>
              <form action={logoutOtherDevices}>
                <button type="submit" className="text-xs bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold px-3 py-1.5 rounded-lg flex items-center gap-2 transition-colors">
                  <LogOut size={14} /> Deslogar Todos
                </button>
              </form>
            </div>
            
            <p className="text-sm text-[#9ca3af] mb-4">
              Abaixo estão os dispositivos recentes que acessaram sua conta. Se você não reconhece algum, deslogue todos os dispositivos imediatamente.
            </p>

            <div className="space-y-3">
              {user.deviceSessions.length === 0 ? (
                <div className="text-sm text-[#6b7280] italic">Apenas a sessão atual registrada.</div>
              ) : (
                user.deviceSessions.map(sess => (
                  <div key={sess.id} className="flex justify-between items-center bg-[#1f2229] p-3 rounded-lg border border-[#262933]">
                    <div>
                      <div className="text-white font-bold text-sm">{sess.browser} - {sess.os}</div>
                      <div className="text-xs text-[#6b7280]">IP: {sess.ip}</div>
                    </div>
                    <div className="text-xs text-[#9ca3af]">
                      {new Date(sess.lastSeen).toLocaleDateString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Coluna Lateral */}
        <div className="space-y-8">
          
          {/* Card Indicações */}
          <div className="bg-[#181a20] border border-[#262933] rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <LinkIcon size={20} className="text-yellow-500" /> Indicações
            </h2>
            <p className="text-sm text-[#9ca3af] mb-4">
              Compartilhe seu link e todos que se cadastrarem ganham automaticamente <strong className="text-white">5% de desconto</strong> na primeira compra.
            </p>

            {user.referralCode ? (
              <div className="bg-[#0f1115] border border-[#262933] rounded-lg p-3 text-center">
                <div className="text-xs text-[#6b7280] mb-1">Seu link:</div>
                <div className="text-yellow-500 font-mono font-bold text-sm break-all">
                  site.com/register?ref={user.referralCode}
                </div>
              </div>
            ) : (
              <form action={generateReferralCode}>
                <button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-black px-4 py-2 rounded-lg transition-colors text-sm">
                  Gerar Meu Link
                </button>
              </form>
            )}
          </div>

          {/* Card Perfil Discord */}
          <div className="bg-[#181a20] border border-[#262933] rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Integração Discord</h2>
            <p className="text-sm text-[#9ca3af] mb-4">
              Conecte seu Discord para sincronizar sua foto de perfil e ganhar acesso automático ao nosso servidor vip.
            </p>
            <form action={async () => {
              "use server";
              const { signIn } = await import("@/auth");
              await signIn("discord", { redirectTo: "/settings" });
            }}>
              <button type="submit" className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold px-4 py-2 rounded-lg transition-colors text-sm flex justify-center items-center gap-2">
                Conectar Discord
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
