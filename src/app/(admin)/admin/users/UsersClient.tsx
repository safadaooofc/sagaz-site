"use client";

import { useState } from "react";
import { ShieldAlert, User as UserIcon, ShieldCheck, Edit, Trash, Plus, Search, Check } from "lucide-react";
import { toast } from "sonner";
import { createAdminLogin, updateUserRole } from "./actions";

export function UsersClient({ users, currentUser }: { users: any[], currentUser: any }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  
  // Forms
  const [adminName, setAdminName] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");
  
  const [editingUser, setEditingUser] = useState<any>(null);
  const [newRole, setNewRole] = useState("");

  const filteredUsers = users.filter(u => 
    (u.name && u.name.toLowerCase().includes(searchTerm.toLowerCase())) || 
    (u.email && u.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const res = await createAdminLogin(currentUser.id, adminName);
    if (res.success) {
      toast.success("Admin criado com sucesso!");
      setNewAdminPassword(res.password || "");
    } else {
      toast.error(res.error || "Erro ao criar admin");
    }
    setIsLoading(false);
  };

  const openEditModal = (user: any) => {
    setEditingUser(user);
    setNewRole(user.role);
    setIsEditModalOpen(true);
  };

  const handleEditRole = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const res = await updateUserRole(currentUser.id, editingUser.id, newRole);
    if (res.success) {
      toast.success("Cargo alterado com sucesso!");
      setIsEditModalOpen(false);
    } else {
      toast.error(res.error || "Erro ao alterar cargo");
    }
    setIsLoading(false);
  };

  return (
    <div className="font-sans">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-white mb-2">Usuários e Permissões</h1>
          <p className="text-[#9ca3af]">Gerencie acessos e contas administrativas da plataforma.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]" />
            <input 
              type="text" 
              placeholder="Buscar por nick ou email..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="bg-[#181a20] border border-[#262933] rounded-lg pl-9 pr-4 py-2 text-sm text-white outline-none focus:border-[#eab308] transition-colors w-64"
            />
          </div>
          {currentUser.role === "OWNER" && (
            <button 
              onClick={() => { setAdminName(""); setNewAdminPassword(""); setIsCreateModalOpen(true); }}
              className="bg-[#262933] hover:bg-[#374151] border border-[#374151] text-white px-4 py-2 rounded-md text-sm font-bold transition-colors flex items-center gap-2"
            >
              <Plus size={16} /> Criar Admin
            </button>
          )}
        </div>
      </div>
      
      <div className="bg-[#181a20] border border-[#262933] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[#9ca3af]">
            <thead className="bg-[#1f2229] border-b border-[#262933]">
              <tr>
                <th className="px-6 py-4 font-bold text-white">Usuário</th>
                <th className="px-6 py-4 font-bold text-white">Data de Registro</th>
                <th className="px-6 py-4 font-bold text-white">Status/Role</th>
                <th className="px-6 py-4 font-bold text-white text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id} className="border-b border-[#262933] hover:bg-[#1f2229]/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-[#262933] shrink-0">
                        {user.image ? <img src={user.image} alt={user.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xs font-bold text-white">{user.name?.charAt(0) || "U"}</div>}
                      </div>
                      <div>
                        <div className="text-white font-bold">{user.name || "Sem Nome"}</div>
                        <div className="text-xs">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{new Date(user.createdAt).toLocaleDateString('pt-BR')}</td>
                  <td className="px-6 py-4">
                    {user.role === "OWNER" && <span className="inline-flex items-center gap-1 text-[#eab308] bg-[#eab308]/10 border border-[#eab308]/20 px-2 py-1 rounded-md text-[11px] font-bold uppercase"><ShieldAlert size={12}/> Dono</span>}
                    {user.role === "SUPERADMIN" && <span className="inline-flex items-center gap-1 text-red-500 bg-red-500/10 border border-red-500/20 px-2 py-1 rounded-md text-[11px] font-bold uppercase"><ShieldAlert size={12}/> Super Admin</span>}
                    {user.role === "ADMIN" && <span className="inline-flex items-center gap-1 text-red-500 bg-red-500/10 border border-red-500/20 px-2 py-1 rounded-md text-[11px] font-bold uppercase"><ShieldAlert size={12}/> Admin</span>}
                    {user.role === "MODERATOR" && <span className="inline-flex items-center gap-1 text-orange-500 bg-orange-500/10 border border-orange-500/20 px-2 py-1 rounded-md text-[11px] font-bold uppercase"><ShieldCheck size={12}/> Moderador</span>}
                    {user.role === "RESELLER" && <span className="inline-flex items-center gap-1 text-purple-500 bg-purple-500/10 border border-purple-500/20 px-2 py-1 rounded-md text-[11px] font-bold uppercase"><ShieldCheck size={12}/> Revendedor</span>}
                    {user.role === "USER" && <span className="inline-flex items-center gap-1 text-blue-500 bg-blue-500/10 border border-blue-500/20 px-2 py-1 rounded-md text-[11px] font-bold uppercase"><UserIcon size={12}/> Cliente</span>}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEditModal(user)} className="text-[11px] text-[#9ca3af] font-bold bg-[#0f1115] hover:bg-[#262933] border border-[#262933] transition-colors px-3 py-1.5 rounded-md flex items-center gap-1">
                        <Edit size={12} /> Editar
                      </button>
                      <button className="text-[11px] text-red-400 font-bold bg-[#0f1115] hover:bg-red-500/10 border border-[#262933] hover:border-red-500/30 transition-colors px-3 py-1.5 rounded-md flex items-center gap-1">
                        <Trash size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-[#9ca3af]">Nenhum usuário encontrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Criar Admin */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#181a20] border border-[#262933] rounded-2xl w-full max-w-sm overflow-hidden">
            <div className="p-4 border-b border-[#262933] flex justify-between items-center">
              <h2 className="font-bold text-white text-lg">Criar Login Admin</h2>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-[#9ca3af] hover:text-white">&times;</button>
            </div>
            
            {!newAdminPassword ? (
              <form onSubmit={handleCreateAdmin} className="p-4 space-y-4">
                <p className="text-xs text-[#9ca3af]">Crie uma conta administrativa apenas com o Nickname. A senha será gerada automaticamente.</p>
                <div>
                  <label className="block text-xs font-bold text-[#9ca3af] mb-1">Nickname</label>
                  <input required type="text" value={adminName} onChange={e => setAdminName(e.target.value)} placeholder="Ex: Moderador123" className="w-full bg-[#0f1115] border border-[#262933] rounded-lg px-3 py-2 text-white outline-none focus:border-[#eab308] transition-colors" />
                </div>
                <button disabled={isLoading} type="submit" className="w-full bg-[#eab308] hover:bg-[#ca8a04] text-black font-bold py-2 rounded-lg transition-colors disabled:opacity-50">
                  {isLoading ? "Criando..." : "Criar Admin"}
                </button>
              </form>
            ) : (
              <div className="p-4 space-y-4">
                <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-lg text-center">
                  <Check size={24} className="text-green-500 mx-auto mb-2" />
                  <p className="text-sm font-bold text-green-500 mb-1">Conta Criada!</p>
                  <p className="text-xs text-[#9ca3af]">Copie os dados abaixo e envie para o novo administrador.</p>
                </div>
                <div className="bg-[#0f1115] p-3 rounded-lg border border-[#262933] font-mono text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[#9ca3af]">Email/Login:</span>
                    <span className="text-white">{adminName.toLowerCase().replace(/\s+/g, '')}@admin.local</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#9ca3af]">Senha:</span>
                    <span className="text-[#eab308] font-bold">{newAdminPassword}</span>
                  </div>
                </div>
                <button onClick={() => setIsCreateModalOpen(false)} className="w-full bg-[#262933] hover:bg-[#374151] text-white font-bold py-2 rounded-lg transition-colors">
                  Fechar
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal Editar Cargo */}
      {isEditModalOpen && editingUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#181a20] border border-[#262933] rounded-2xl w-full max-w-sm overflow-hidden">
            <div className="p-4 border-b border-[#262933] flex justify-between items-center">
              <h2 className="font-bold text-white text-lg">Alterar Permissões</h2>
              <button onClick={() => setIsEditModalOpen(false)} className="text-[#9ca3af] hover:text-white">&times;</button>
            </div>
            <form onSubmit={handleEditRole} className="p-4 space-y-4">
              <div className="bg-[#0f1115] p-3 rounded-lg flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#262933] flex items-center justify-center font-bold text-white">
                  {editingUser.name?.charAt(0) || "U"}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{editingUser.name || "Sem Nome"}</p>
                  <p className="text-xs text-[#9ca3af]">{editingUser.email}</p>
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-[#9ca3af] mb-1">Cargo</label>
                <select 
                  value={newRole} 
                  onChange={e => setNewRole(e.target.value)}
                  disabled={currentUser.role !== "OWNER"}
                  className="w-full bg-[#0f1115] border border-[#262933] rounded-lg px-3 py-2 text-white outline-none focus:border-[#eab308] transition-colors appearance-none disabled:opacity-50"
                >
                  <option value="USER">Cliente</option>
                  <option value="RESELLER">Revendedor</option>
                  <option value="MODERATOR">Moderador</option>
                  <option value="ADMIN">Administrador</option>
                  <option value="SUPERADMIN">Super Administrador</option>
                  {currentUser.role === "OWNER" && <option value="OWNER">Dono (Perigoso)</option>}
                </select>
                {currentUser.role !== "OWNER" && <p className="text-xs text-red-500 mt-1">Apenas o Dono pode alterar cargos.</p>}
              </div>

              <button disabled={isLoading || currentUser.role !== "OWNER"} type="submit" className="w-full bg-[#eab308] hover:bg-[#ca8a04] text-black font-bold py-2 rounded-lg transition-colors disabled:opacity-50">
                {isLoading ? "Salvando..." : "Salvar Cargo"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
