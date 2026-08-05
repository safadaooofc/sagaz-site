"use client";

import { useState, useEffect } from "react";
import { User, Key, Shield, MessageSquare, CheckCircle2, AlertCircle, Copy, Check, Loader2, Smartphone, Mail, Lock } from "lucide-react";
import { changePassword, logoutOtherDevices, checkBooster } from "./actions";
import { generate2FASecret, verifyAndEnableApp2FA, change2FAMethod } from "./2fa-actions";
import { signIn } from "next-auth/react";

import { toast } from "sonner";

export function SettingsClient({ user, stats }: any) {
  const [activeTab, setActiveTab] = useState("profile");
  
  // Profile
  const [name, setName] = useState(user.name || "");
  
  // Password
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  
  // 2FA State
  const [twoFactorMethod, setTwoFactorMethod] = useState(user.twoFactorMethod || "EMAIL");
  const [setup2FA, setSetup2FA] = useState(false);
  const [qrCodeData, setQrCodeData] = useState("");
  const [secret2FA, setSecret2FA] = useState("");
  const [code2FA, setCode2FA] = useState("");
  const [isVerifying2FA, setIsVerifying2FA] = useState(false);
  
  // Discord
  const [discordId, setDiscordId] = useState(user.discordId || "");
  const [isVerifying, setIsVerifying] = useState(false);
  
  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("As senhas não coincidem.");
      return;
    }
    setPasswordLoading(true);
    const formData = new FormData();
    formData.append("currentPassword", currentPassword);
    formData.append("newPassword", newPassword);
    
    const res = await changePassword(formData);
    setPasswordLoading(false);
    
    if (res.success) {
      toast.success("Senha atualizada com sucesso.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      toast.error(res.error || "Erro ao atualizar senha.");
    }
  };

  const handleBeginApp2FA = async () => {
    setIsVerifying2FA(true);
    const res = await generate2FASecret();
    setIsVerifying2FA(false);
    if (res.success && res.secret && res.qrCodeDataUrl) {
      setSecret2FA(res.secret);
      setQrCodeData(res.qrCodeDataUrl);
      setSetup2FA(true);
    } else {
      toast.error(res.error || "Erro ao gerar 2FA.");
    }
  };

  const handleConfirmApp2FA = async () => {
    if (!currentPassword) {
      toast.error("Digite sua senha atual para confirmar.");
      return;
    }
    if (code2FA.length !== 6) {
      toast.error("Código deve ter 6 dígitos.");
      return;
    }
    setIsVerifying2FA(true);
    const res = await verifyAndEnableApp2FA(secret2FA, code2FA, currentPassword);
    setIsVerifying2FA(false);
    
    if (res.success) {
      toast.success("Autenticador configurado com sucesso!");
      setTwoFactorMethod("APP");
      setSetup2FA(false);
      setCurrentPassword("");
      setCode2FA("");
    } else {
      toast.error(res.error || "Erro ao ativar.");
    }
  };

  const handleChangeMethod = async (method: "NONE" | "EMAIL") => {
    if (!currentPassword) {
      toast.error("Digite sua senha atual para confirmar a mudança de segurança.");
      return;
    }
    setIsVerifying2FA(true);
    const res = await change2FAMethod(method, currentPassword);
    setIsVerifying2FA(false);
    
    if (res.success) {
      toast.success(`Método de 2FA alterado para ${method === "NONE" ? "Nenhum" : "E-mail"}`);
      setTwoFactorMethod(method);
      setCurrentPassword("");
    } else {
      toast.error(res.error || "Erro ao alterar.");
    }
  };

  const handleCheckBooster = async () => {
    setIsVerifying(true);
    const res = await checkBooster();
    setIsVerifying(false);
    if (res.success) {
      toast.success("Status Booster verificado e atualizado!");
      window.location.reload();
    } else {
      toast.error(res.error || "Você não é Booster do servidor.");
    }
  };

  return (
    <div className="font-sans max-w-4xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Configurações</h1>
        <p className="text-sm text-[#9ca3af]">Gerencie sua conta, segurança e conexões</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-64 space-y-2">
          <button onClick={() => setActiveTab("profile")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'profile' ? 'bg-[#eab308] text-black' : 'text-[#9ca3af] hover:bg-[#1f2229] hover:text-white'}`}>
            <User size={18} /> Perfil
          </button>
          <button onClick={() => setActiveTab("security")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'security' ? 'bg-[#eab308] text-black' : 'text-[#9ca3af] hover:bg-[#1f2229] hover:text-white'}`}>
            <Key size={18} /> Segurança
          </button>
          <button onClick={() => setActiveTab("connections")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'connections' ? 'bg-[#eab308] text-black' : 'text-[#9ca3af] hover:bg-[#1f2229] hover:text-white'}`}>
            <Shield size={18} /> Conexões
          </button>
        </div>

        <div className="flex-1">
          {activeTab === "profile" && (
            <div className="space-y-6 animate-in fade-in">
              <div className="bg-[#181a20] border border-[#262933] rounded-xl p-6">
                <h2 className="text-lg font-bold text-white mb-4">Informações Pessoais</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#9ca3af] mb-1.5">E-mail</label>
                    <input type="email" disabled value={user.email || ""} className="w-full bg-[#0f1115] border border-[#262933] rounded-lg px-4 py-2.5 text-[#6b7280] cursor-not-allowed" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#9ca3af] mb-1.5">Nome</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-[#1f2229] border border-[#333845] rounded-lg px-4 py-2.5 text-white placeholder-[#4b5563] focus:border-[#eab308] focus:outline-none transition-colors" />
                  </div>
                  <button className="bg-[#eab308] hover:bg-[#ca8a04] text-black font-bold text-sm px-6 py-2.5 rounded-lg transition-colors">
                    Salvar Alterações
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#181a20] border border-[#262933] rounded-xl p-5">
                  <p className="text-sm text-[#9ca3af] mb-1">Total Gasto</p>
                  <p className="text-2xl font-bold text-white">R$ {stats.totalSpent.toFixed(2)}</p>
                </div>
                <div className="bg-[#181a20] border border-[#262933] rounded-xl p-5">
                  <p className="text-sm text-[#9ca3af] mb-1">Data de Cadastro</p>
                  <p className="text-lg font-bold text-white">{new Date(user.createdAt).toLocaleDateString("pt-BR")}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-6 animate-in fade-in">
              <div className="bg-[#181a20] border border-[#262933] rounded-xl p-6">
                <h2 className="text-lg font-bold text-white mb-4">Trocar Senha</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#9ca3af] mb-1.5">Senha Atual</label>
                    <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="w-full bg-[#1f2229] border border-[#333845] rounded-lg px-4 py-2.5 text-white focus:border-[#eab308] focus:outline-none transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#9ca3af] mb-1.5">Nova Senha</label>
                    <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full bg-[#1f2229] border border-[#333845] rounded-lg px-4 py-2.5 text-white focus:border-[#eab308] focus:outline-none transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#9ca3af] mb-1.5">Confirmar Nova Senha</label>
                    <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full bg-[#1f2229] border border-[#333845] rounded-lg px-4 py-2.5 text-white focus:border-[#eab308] focus:outline-none transition-colors" />
                  </div>
                  <button onClick={handleUpdatePassword} disabled={passwordLoading} className="bg-[#1f2229] border border-[#333845] hover:border-[#eab308] text-white hover:text-[#eab308] font-bold text-sm px-6 py-2.5 rounded-lg transition-colors flex items-center justify-center min-w-[150px]">
                    {passwordLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Atualizar Senha"}
                  </button>
                </div>
              </div>
              <div className="bg-[#181a20] border border-[#262933] rounded-xl p-6">
                <h2 className="text-lg font-bold text-white mb-2">Autenticação em Duas Etapas (2FA)</h2>
                <p className="text-sm text-[#9ca3af] mb-4">Adicione uma camada extra de segurança à sua conta.</p>

                <div className="space-y-4">
                  <div className="flex flex-col gap-3">
                    <button 
                      onClick={() => twoFactorMethod !== "EMAIL" ? handleChangeMethod("EMAIL") : null}
                      className={`w-full flex items-center justify-between p-4 border rounded-lg transition-colors ${twoFactorMethod === "EMAIL" ? "bg-[#eab308]/10 border-[#eab308]" : "bg-[#1f2229] border-[#333845] hover:border-white"}`}
                    >
                      <div className="flex items-center gap-3 text-left">
                        <Mail className={twoFactorMethod === "EMAIL" ? "text-[#eab308]" : "text-[#9ca3af]"} />
                        <div>
                          <p className={`font-bold text-sm ${twoFactorMethod === "EMAIL" ? "text-white" : "text-[#9ca3af]"}`}>Código por E-mail (Padrão)</p>
                          <p className="text-xs text-[#6b7280]">Receba um código no seu e-mail ao logar.</p>
                        </div>
                      </div>
                      {twoFactorMethod === "EMAIL" && <CheckCircle2 className="text-[#eab308]" />}
                    </button>

                    <button 
                      onClick={() => twoFactorMethod !== "APP" ? handleBeginApp2FA() : null}
                      className={`w-full flex items-center justify-between p-4 border rounded-lg transition-colors ${twoFactorMethod === "APP" ? "bg-blue-500/10 border-blue-500" : "bg-[#1f2229] border-[#333845] hover:border-white"}`}
                    >
                      <div className="flex items-center gap-3 text-left">
                        <Smartphone className={twoFactorMethod === "APP" ? "text-blue-500" : "text-[#9ca3af]"} />
                        <div>
                          <p className={`font-bold text-sm ${twoFactorMethod === "APP" ? "text-white" : "text-[#9ca3af]"}`}>Aplicativo Authenticator</p>
                          <p className="text-xs text-[#6b7280]">Use o Google Authenticator ou Authy.</p>
                        </div>
                      </div>
                      {twoFactorMethod === "APP" && <CheckCircle2 className="text-blue-500" />}
                    </button>

                    <button 
                      onClick={() => twoFactorMethod !== "NONE" ? handleChangeMethod("NONE") : null}
                      className={`w-full flex items-center justify-between p-4 border rounded-lg transition-colors ${twoFactorMethod === "NONE" ? "bg-red-500/10 border-red-500" : "bg-[#1f2229] border-[#333845] hover:border-white"}`}
                    >
                      <div className="flex items-center gap-3 text-left">
                        <Lock className={twoFactorMethod === "NONE" ? "text-red-500" : "text-[#9ca3af]"} />
                        <div>
                          <p className={`font-bold text-sm ${twoFactorMethod === "NONE" ? "text-white" : "text-[#9ca3af]"}`}>Sem 2FA (Inseguro)</p>
                          <p className="text-xs text-[#6b7280]">Logar apenas com senha.</p>
                        </div>
                      </div>
                      {twoFactorMethod === "NONE" && <CheckCircle2 className="text-red-500" />}
                    </button>
                  </div>

                  {setup2FA && (
                    <div className="p-4 bg-[#1f2229] border border-[#333845] rounded-lg mt-4 animate-in fade-in">
                      <p className="text-sm text-white font-bold mb-2">Configure seu Authenticator</p>
                      <p className="text-xs text-[#9ca3af] mb-4">1. Escaneie o QR Code abaixo usando seu aplicativo.</p>
                      <div className="bg-white p-2 w-max rounded-lg mb-4">
                        <img src={qrCodeData} alt="QR Code 2FA" className="w-32 h-32" />
                      </div>
                      <p className="text-xs text-[#9ca3af] mb-4">2. Digite sua senha e o código gerado no app para confirmar.</p>
                      <div className="space-y-3">
                        <input type="password" placeholder="Sua senha atual" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="w-full bg-[#0f1115] border border-[#262933] rounded-lg px-4 py-2.5 text-white" />
                        <input type="text" placeholder="Código de 6 dígitos" value={code2FA} onChange={e => setCode2FA(e.target.value)} maxLength={6} className="w-full bg-[#0f1115] border border-[#262933] rounded-lg px-4 py-2.5 text-white font-mono tracking-widest text-center" />
                        <div className="flex gap-2">
                          <button onClick={handleConfirmApp2FA} disabled={isVerifying2FA} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-lg text-sm">
                            Confirmar
                          </button>
                          <button onClick={() => setSetup2FA(false)} className="px-4 text-[#9ca3af] hover:text-white border border-[#333845] rounded-lg text-sm">
                            Cancelar
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {!setup2FA && (
                    <div className="mt-4 pt-4 border-t border-[#262933]">
                      <p className="text-xs text-[#9ca3af] mb-2">Para alterar a segurança (remover 2FA ou voltar pro e-mail), digite sua senha atual nos inputs acima e clique na opção desejada.</p>
                      <input type="password" placeholder="Sua senha atual" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="w-full bg-[#0f1115] border border-[#262933] rounded-lg px-4 py-2.5 text-white" />
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-[#181a20] border border-[#262933] rounded-xl p-6">
                <h2 className="text-lg font-bold text-white mb-2">Sessões Ativas</h2>
                <p className="text-sm text-[#9ca3af] mb-4">Gerencie os dispositivos conectados à sua conta.</p>
                <div className="flex items-center justify-between p-4 bg-[#1f2229] border border-[#333845] rounded-lg">
                  <div>
                    <p className="font-bold text-white text-sm">Este dispositivo</p>
                    <p className="text-xs text-green-500 mt-1 flex items-center gap-1"><CheckCircle2 size={12} /> Ativo agora</p>
                  </div>
                  <button onClick={async () => { await logoutOtherDevices(); toast.success("Outros dispositivos desconectados."); }} className="text-xs font-bold text-red-500 hover:text-red-400 bg-red-500/10 px-3 py-1.5 rounded-md transition-colors">
                    Desconectar Outros
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "connections" && (
            <div className="space-y-6 animate-in fade-in">
              <div className="bg-[#181a20] border border-[#262933] rounded-xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-[#5865F2]/10 flex items-center justify-center">
                    <MessageSquare size={24} className="text-[#5865F2]" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white leading-none mb-1">Verificação Discord</h2>
                    <p className="text-sm text-[#9ca3af]">Vincule seu Discord para maior segurança na sua conta.</p>
                  </div>
                </div>

                {!user.discordId ? (
                  <div className="space-y-4">
                    <p className="text-sm text-[#9ca3af]">
                      Conecte sua conta do Discord e entre automaticamente no nosso servidor para liberar acesso a benefícios exclusivos!
                    </p>
                    <button 
                      onClick={() => signIn("discord", { callbackUrl: "/settings" })} 
                      className="bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold text-sm px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-3 w-full sm:w-auto"
                    >
                      <MessageSquare size={18} /> Conectar com Discord
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-[#1f2229] border border-[#333845] rounded-lg">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 size={20} className="text-green-500" />
                        <div>
                          <p className="font-bold text-white text-sm">Discord Vinculado</p>
                          <p className="text-xs text-[#9ca3af]">ID: {user.discordId}</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded">Verificado</span>
                    </div>

                    <div className="pt-4 border-t border-[#262933]">
                      <h3 className="text-sm font-bold text-white mb-2">Vantagens de Servidor</h3>
                      <p className="text-xs text-[#9ca3af] mb-4">Sincronize seus cargos do Discord para obter benefícios na plataforma.</p>
                      
                      <button 
                        onClick={handleCheckBooster}
                        disabled={isVerifying}
                        className="w-full sm:w-auto bg-[#1f2229] border border-[#333845] hover:border-[#f47b90] hover:text-[#f47b90] text-white font-bold text-sm px-4 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        {isVerifying ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verificar Status Booster"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
