"use client";

import { useState } from "react";
import { MessageSquare, Send, Loader2, Lock, Search } from "lucide-react";
import { toast } from "sonner";
import { adminReplyTicket, closeTicket } from "./actions";

export function AdminSuporteClient({ initialTickets }: { initialTickets: any[] }) {
  const [tickets, setTickets] = useState(initialTickets);
  const [activeTicket, setActiveTicket] = useState<any | null>(null);
  
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [closing, setClosing] = useState(false);
  
  const [search, setSearch] = useState("");

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTicket) return;
    setLoading(true);
    const res = await adminReplyTicket(activeTicket.id, reply);
    if (res.success) {
      toast.success("Mensagem enviada!");
      setReply("");
      window.location.reload();
    } else {
      toast.error(res.error);
    }
    setLoading(false);
  };

  const handleClose = async () => {
    if (!activeTicket) return;
    if (!confirm("Tem certeza que deseja encerrar este ticket? O usuário não poderá mais responder.")) return;
    
    setClosing(true);
    const res = await closeTicket(activeTicket.id);
    if (res.success) {
      toast.success("Ticket fechado!");
      window.location.reload();
    } else {
      toast.error(res.error);
    }
    setClosing(false);
  };

  const filteredTickets = tickets.filter(t => 
    t.subject.toLowerCase().includes(search.toLowerCase()) || 
    t.user.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="font-sans space-y-6 max-w-7xl mx-auto h-[80vh] flex flex-col">
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-3xl font-black text-white mb-2 flex items-center gap-3">
            <MessageSquare className="text-cyan-400" /> Gerenciamento de Tickets
          </h1>
          <p className="text-[#9ca3af]">Responda e gerencie as dúvidas dos usuários.</p>
        </div>
      </div>

      <div className="flex gap-6 h-full overflow-hidden shrink-0 min-h-[500px]">
        {/* Ticket List */}
        <div className="w-1/3 bg-[#13151a] border border-[#262933] rounded-xl flex flex-col">
          <div className="p-4 border-b border-[#262933]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7280]" size={16} />
              <input 
                type="text" 
                placeholder="Buscar por email ou assunto..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-[#0f1115] border border-[#262933] rounded-lg pl-10 pr-4 py-2 text-sm text-white outline-none focus:border-cyan-500"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {filteredTickets.length === 0 ? (
              <div className="p-8 text-center text-[#6b7280]">
                <p>Nenhum ticket encontrado.</p>
              </div>
            ) : (
              <div className="flex flex-col">
                {filteredTickets.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTicket(t)}
                    className={`p-4 text-left border-b border-[#262933] transition-colors ${
                      activeTicket?.id === t.id ? "bg-[#181a20] border-l-4 border-l-cyan-500" : "hover:bg-[#181a20]"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="font-bold text-white truncate pr-4 text-sm">{t.subject}</h3>
                      <span className={`text-[10px] px-2 py-1 rounded font-bold uppercase shrink-0 ${t.status === 'OPEN' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                        {t.status}
                      </span>
                    </div>
                    <p className="text-xs text-[#9ca3af] mb-1">{t.user.email || t.user.name}</p>
                    <p className="text-xs text-[#6b7280] truncate">{t.messages[t.messages.length - 1]?.content}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Ticket Content */}
        <div className="flex-1 bg-[#13151a] border border-[#262933] rounded-xl flex flex-col overflow-hidden relative">
          {activeTicket ? (
            <>
              <div className="p-6 border-b border-[#262933] bg-[#0f1115] flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-white">{activeTicket.subject}</h2>
                  <p className="text-sm text-[#6b7280]">
                    Usuário: {activeTicket.user.email} | Criado em {new Date(activeTicket.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                {activeTicket.status === 'OPEN' && (
                  <button 
                    onClick={handleClose}
                    disabled={closing}
                    className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/50 px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-colors"
                  >
                    {closing ? <Loader2 className="animate-spin" size={16} /> : <Lock size={16} />} Encerrar Ticket
                  </button>
                )}
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {activeTicket.messages.map((m: any) => (
                  <div key={m.id} className={`flex ${!m.isAdmin ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-[70%] rounded-2xl p-4 ${
                      !m.isAdmin 
                        ? 'bg-[#262933] text-white rounded-tl-none' 
                        : 'bg-cyan-500 text-white rounded-tr-none'
                    }`}>
                      <p className="text-[15px] whitespace-pre-wrap leading-relaxed">{m.content}</p>
                      <span className={`text-[10px] mt-2 block ${!m.isAdmin ? 'text-[#9ca3af]' : 'text-cyan-200'}`}>
                        {new Date(m.createdAt).toLocaleString('pt-BR')} {!m.isAdmin ? '- Cliente' : '- Você (Admin)'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {activeTicket.status === 'OPEN' ? (
                <form onSubmit={handleReply} className="p-4 border-t border-[#262933] bg-[#0f1115] flex gap-4">
                  <input 
                    type="text" 
                    value={reply}
                    onChange={e => setReply(e.target.value)}
                    placeholder="Digite sua resposta como administrador..."
                    className="flex-1 bg-[#181a20] border border-[#262933] rounded-full px-6 text-white outline-none focus:border-cyan-500"
                  />
                  <button type="submit" disabled={loading || !reply.trim()} className="w-12 h-12 rounded-full bg-cyan-500 hover:bg-cyan-600 flex items-center justify-center text-white disabled:opacity-50 shrink-0">
                    {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                  </button>
                </form>
              ) : (
                <div className="p-4 border-t border-[#262933] bg-[#0f1115] text-center text-[#6b7280] text-sm">
                  Ticket encerrado.
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-[#6b7280]">
              <MessageSquare size={64} className="mb-4 opacity-20" />
              <p>Selecione um ticket na lista ao lado.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
