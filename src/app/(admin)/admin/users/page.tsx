import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ShieldAlert, User, ShieldCheck } from "lucide-react";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div>
      <h1 className="text-3xl font-black text-white mb-2">Usuários e Revendedores</h1>
      <p className="text-[#9ca3af] mb-8">Gerencie permissões e contas da plataforma.</p>
      
      <div className="bg-[#181a20] border border-[#262933] rounded-xl overflow-hidden">
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
            {users.map(user => (
              <tr key={user.id} className="border-b border-[#262933] hover:bg-[#1f2229]/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="text-white font-bold">{user.name || "Sem Nome"}</div>
                  <div className="text-xs">{user.email}</div>
                  {user.role === "RESELLER" && <div className="text-xs text-yellow-500 mt-1">Desconto: {user.resellerDiscount}%</div>}
                </td>
                <td className="px-6 py-4">{new Date(user.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  {user.role === "SUPERADMIN" && <span className="inline-flex items-center gap-1 text-red-500 bg-red-500/10 px-2 py-1 rounded-md text-[11px] font-bold uppercase"><ShieldAlert size={12}/> Super Admin</span>}
                  {user.role === "ADMIN" && <span className="inline-flex items-center gap-1 text-red-500 bg-red-500/10 px-2 py-1 rounded-md text-[11px] font-bold uppercase"><ShieldAlert size={12}/> Admin</span>}
                  {user.role === "MODERATOR" && <span className="inline-flex items-center gap-1 text-orange-500 bg-orange-500/10 px-2 py-1 rounded-md text-[11px] font-bold uppercase"><ShieldCheck size={12}/> Moderador</span>}
                  {user.role === "RESELLER" && <span className="inline-flex items-center gap-1 text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded-md text-[11px] font-bold uppercase"><ShieldCheck size={12}/> Revendedor</span>}
                  {user.role === "USER" && <span className="inline-flex items-center gap-1 text-blue-500 bg-blue-500/10 px-2 py-1 rounded-md text-[11px] font-bold uppercase"><User size={12}/> Cliente</span>}
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button className="text-[11px] text-white font-bold bg-[#262933] hover:bg-[#374151] transition-colors px-3 py-1.5 rounded-md">
                    Editar / Cargo
                  </button>
                  <button className="text-[11px] text-green-500 font-bold bg-green-500/10 hover:bg-green-500/20 transition-colors px-3 py-1.5 rounded-md">
                    Enviar Produto
                  </button>
                  <button className="text-[11px] text-red-500 font-bold bg-red-500/10 hover:bg-red-500/20 transition-colors px-3 py-1.5 rounded-md">
                    Deletar
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center">Nenhum usuário encontrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
