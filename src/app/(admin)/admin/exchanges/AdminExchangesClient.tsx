"use client";

import { useState } from "react";
import { RefreshCw, Search, Check, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { processExchangeRequest } from "./actions";

export function AdminExchangesClient({ initialRequests }: { initialRequests: any[] }) {
  const [requests, setRequests] = useState(initialRequests);
  const [search, setSearch] = useState("");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});

  const handleProcess = async (id: string, action: "APPROVE" | "REJECT") => {
    if (!confirm(`Tem certeza que deseja ${action === "APPROVE" ? "APROVAR (adicionará saldo)" : "REJEITAR"} esta solicitação?`)) return;
    
    setLoadingId(id);
    const res = await processExchangeRequest(id, action, notes[id] || undefined) as any;
    if (res.success) {
      toast.success(`Solicitação ${action === "APPROVE" ? "aprovada" : "rejeitada"}!`);
      window.location.reload();
    } else {
      toast.error(res.error);
    }
    setLoadingId(null);
  };

  const filteredRequests = requests.filter(r => 
    r.giftCardCode.toLowerCase().includes(search.toLowerCase()) || 
    r.user.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="font-sans space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-white mb-2 flex items-center gap-3">
            <RefreshCw className="text-[#eab308]" /> Trocas (Exchanges)
          </h1>
          <p className="text-[#9ca3af]">Aprove ou rejeite solicitações de troca de Gift Cards por saldo.</p>
        </div>
      </div>

      <div className="bg-[#13151a] border border-[#262933] rounded-xl overflow-hidden">
        <div className="p-4 border-b border-[#262933] flex items-center justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7280]" size={16} />
            <input 
              type="text" 
              placeholder="Buscar por código ou email..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-[#0f1115] border border-[#262933] rounded-lg pl-10 pr-4 py-2 text-sm text-white outline-none focus:border-[#eab308]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#181a20] border-b border-[#262933] text-[#9ca3af]">
              <tr>
                <th className="px-6 py-4 font-bold">Usuário</th>
                <th className="px-6 py-4 font-bold">Código Gift Card</th>
                <th className="px-6 py-4 font-bold">Valor Solicitado</th>
                <th className="px-6 py-4 font-bold">Data</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262933]">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-[#6b7280]">
                    Nenhuma solicitação encontrada.
                  </td>
                </tr>
              ) : (
                filteredRequests.map(req => (
                  <tr key={req.id} className="hover:bg-[#181a20]/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-white font-bold">{req.user.name || "Sem nome"}</div>
                      <div className="text-[#6b7280] text-xs">{req.user.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <code className="text-[#eab308] bg-[#eab308]/10 px-2 py-1 rounded">{req.giftCardCode}</code>
                    </td>
                    <td className="px-6 py-4 text-white font-bold">
                      R$ {req.requestedValue.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-[#9ca3af]">
                      {new Date(req.createdAt).toLocaleString('pt-BR')}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] px-2 py-1 rounded font-bold uppercase ${
                        req.status === 'APPROVED' ? 'bg-green-500/20 text-green-500' : 
                        req.status === 'REJECTED' ? 'bg-red-500/20 text-red-500' : 
                        'bg-orange-500/20 text-orange-500'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {req.status === "PENDING" ? (
                        <div className="flex flex-col gap-2">
                          <input 
                            type="text"
                            placeholder="Nota do admin (opcional)"
                            value={notes[req.id] || ""}
                            onChange={(e) => setNotes({ ...notes, [req.id]: e.target.value })}
                            className="bg-[#0f1115] border border-[#262933] rounded px-2 py-1 text-xs text-white"
                          />
                          <div className="flex justify-center gap-2">
                            <button 
                              onClick={() => handleProcess(req.id, "APPROVE")}
                              disabled={loadingId === req.id}
                              className="bg-green-500 hover:bg-green-600 text-white p-2 rounded transition-colors"
                              title="Aprovar e Adicionar Saldo"
                            >
                              {loadingId === req.id ? <Loader2 className="animate-spin" size={16} /> : <Check size={16} />}
                            </button>
                            <button 
                              onClick={() => handleProcess(req.id, "REJECT")}
                              disabled={loadingId === req.id}
                              className="bg-red-500 hover:bg-red-600 text-white p-2 rounded transition-colors"
                              title="Rejeitar Solicitação"
                            >
                              {loadingId === req.id ? <Loader2 className="animate-spin" size={16} /> : <X size={16} />}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center text-[#6b7280] text-xs">
                          {req.adminNotes ? `Nota: ${req.adminNotes}` : "Sem notas"}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
