"use client";

import { useState } from "react";
import { User, Key, Shield, MessageSquare, CheckCircle2, AlertCircle, Copy, Check, Loader2 } from "lucide-react";
import { changePassword, logoutOtherDevices, linkDiscord, sendDiscordVerificationCode, verifyDiscordCode, checkBooster } from "./actions";

export function SettingsClient({ user, stats }: any) {
  const [activeTab, setActiveTab] = useState("profile");
  
  // Profile
  const [name, setName] = useState(user.name || "");
  
  // Password
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  
  // Discord
  const [discordId, setDiscordId] = useState(user.discordId || "");
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [showCodeInput, setShowCodeInput] = useState(false);
  
  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      alert("As senhas não coincidem.");
      return;
    }
    setPasswordLoading(true);
    const formData = new FormData();
    formData.append("currentPassword", currentPassword);
    formData.append("newPassword", newPassword);
    
    const res = await changePassword(formData);
    setPasswordLoading(false);
    
    if (res.success) {
      alert("Senha atualizada com sucesso.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      alert(res.error || "Erro ao atualizar senha.");
    }
  };

  const handleSendCode = async () => {
    if (!discordId) return;
    setIsVerifying(true);
    const res = await sendDiscordVerificationCode(discordId);
    setIsVerifying(false);
    if (res.success) {
      setShowCodeInput(true);
      alert("Código enviado para sua DM no Discord!");
    } else {
      alert(res.error || "Erro ao enviar código. Seu ID está correto e DMs estão abertas?");
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode) return;
    setIsVerifying(true);
    const res = await verifyDiscordCode(discordId, verificationCode);
    setIsVerifying(false);
    if (res.success) {
      alert("Discord verificado com sucesso!");
      window.location.reload();
    } else {
      alert(res.error || "Código inválido.");
    }
  };

  const handleCheckBooster = async () => {
    setIsVerifying(true);
    const res = await checkBooster();
    setIsVerifying(false);
    if (res.success) {
      alert("Status Booster verificado e atualizado!");
      window.location.reload();
    } else {
      alert(res.error || "Você não é Booster do servidor.");
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
                <h2 className="text-lg font-bold text-white mb-2">Sessões Ativas</h2>
                <p className="text-sm text-[#9ca3af] mb-4">Gerencie os dispositivos conectados à sua conta.</p>
                <div className="flex items-center justify-between p-4 bg-[#1f2229] border border-[#333845] rounded-lg">
                  <div>
                    <p className="font-bold text-white text-sm">Este dispositivo</p>
                    <p className="text-xs text-green-500 mt-1 flex items-center gap-1"><CheckCircle2 size={12} /> Ativo agora</p>
                  </div>
                  <button onClick={async () => { await logoutOtherDevices(); alert("Outros dispositivos desconectados."); }} className="text-xs font-bold text-red-500 hover:text-red-400 bg-red-500/10 px-3 py-1.5 rounded-md transition-colors">
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
                    <p className="text-sm text-[#9ca3af]">Vincule seu Discord para receber cargos e drops exclusivos.</p>
                  </div>
                </div>

                {!user.discordId ? (
                  !showCodeInput ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-[#9ca3af] mb-1.5">Seu ID do Discord</label>
                        <input 
                          type="text" 
                          placeholder="Ex: 123456789012345678" 
                          value={discordId}
                          onChange={e => setDiscordId(e.target.value)}
                          className="w-full bg-[#1f2229] border border-[#333845] rounded-lg px-4 py-2.5 text-white focus:border-[#5865F2] focus:outline-none transition-colors" 
                        />
                        <p className="text-xs text-[#6b7280] mt-1.5 flex items-center gap-1">
                          <AlertCircle size={12} /> Ative as DMs para receber o código.
                        </p>
                      </div>
                      <button 
                        onClick={handleSendCode} 
                        disabled={isVerifying}
                        className="bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold text-sm px-6 py-2.5 rounded-lg transition-colors flex items-center gap-2"
                      >
                        {isVerifying ? <Loader2 className="h-4 w-4 animate-spin" /> : "Enviar Código"}
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4 p-4 border border-[#5865F2]/30 bg-[#5865F2]/5 rounded-lg">
                      <div>
                        <label className="block text-sm font-medium text-[#9ca3af] mb-1.5">Código de Verificação</label>
                        <input 
                          type="text" 
                          placeholder="Digite o código recebido na DM" 
                          value={verificationCode}
                          onChange={e => setVerificationCode(e.target.value)}
                          className="w-full bg-[#1f2229] border border-[#333845] rounded-lg px-4 py-2.5 text-white focus:border-[#5865F2] focus:outline-none transition-colors text-center font-mono tracking-widest" 
                        />
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={handleVerifyCode} 
                          disabled={isVerifying}
                          className="flex-1 bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold text-sm py-2.5 rounded-lg transition-colors flex justify-center items-center gap-2"
                        >
                          {isVerifying ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verificar"}
                        </button>
                        <button 
                          onClick={() => setShowCodeInput(false)} 
                          className="px-4 border border-[#333845] text-[#9ca3af] hover:text-white rounded-lg transition-colors"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  )
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
