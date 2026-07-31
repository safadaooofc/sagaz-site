"use client";

import { useState } from "react";
import { MessageSquare, Plus, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createTicket, replyTicket } from "./actions";

export function SuporteClient({ initialTickets }: { initialTickets: any[] }) {
  const [tickets, setTickets] = useState(initialTickets);
  const [activeTicket, setActiveTicket] = useState<any | null>(initialTickets[0] || null);
  
  const [isCreating, setIsCreating] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [reply, setReply] = useState("");
  const [replying, setReplying] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await createTicket(subject, message);
    if (res.success) {
      toast.success("Ticket criado com sucesso!");
      setIsCreating(false);
      setSubject("");
      setMessage("");
      // Real app should refresh or optimistically update
      window.location.reload(); 
    } else {
      toast.error(res.error);
    }
    setLoading(false);
  };

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTicket) return;
    setReplying(true);
    const res = await replyTicket(activeTicket.id, reply);
    if (res.success) {
      toast.success("Mensagem enviada!");
      setReply("");
      window.location.reload();
    } else {
      toast.error(res.error);
    }
    setReplying(false);
  };

  return (
    <div className="font-sans space-y-6 max-w-6xl mx-auto h-[80vh] flex flex-col">
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-3xl font-black text-white mb-2 flex items-center gap-3">
            <MessageSquare className="text-cyan-400" /> Central de Suporte
          </h1>
          <p className="text-[#9ca3af]">Abra um ticket para falar diretamente com a administração.</p>
        </div>
        <button 
          onClick={() => setIsCreating(true)}
          className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold px-6 py-3 rounded-lg flex items-center gap-2 transition-colors shadow-[0_0_15px_rgba(6,182,212,0.3)]"
        >
          <Plus size={20} /> Novo Ticket
        </button>
      </div>

      <div className="flex gap-6 h-full overflow-hidden shrink-0 min-h-[500px]">
        {/* Ticket List */}
        <div className="w-1/3 bg-[#13151a] border border-[#262933] rounded-xl overflow-y-auto hidden md:block">
          {tickets.length === 0 ? (
            <div className="p-8 text-center text-[#6b7280]">
              <MessageSquare size={48} className="mx-auto mb-4 opacity-20" />
              <p>Nenhum ticket aberto.</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {tickets.map(t => (
                <button
                  key={t.id}
                  onClick={() => { setActiveTicket(t); setIsCreating(false); }}
                  className={`p-4 text-left border-b border-[#262933] transition-colors ${
                    activeTicket?.id === t.id ? "bg-[#181a20] border-l-4 border-l-cyan-500" : "hover:bg-[#181a20]"
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-bold text-white truncate pr-4">{t.subject}</h3>
                    <span className={`text-[10px] px-2 py-1 rounded font-bold uppercase ${t.status === 'OPEN' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                      {t.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#6b7280] truncate">{t.messages[t.messages.length - 1]?.content}</p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Ticket Content or Create Form */}
        <div className="flex-1 bg-[#13151a] border border-[#262933] rounded-xl flex flex-col overflow-hidden relative">
          {isCreating ? (
            <div className="p-8 overflow-y-auto h-full">
              <h2 className="text-xl font-bold text-white mb-6">Criar Novo Ticket</h2>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-[#9ca3af] mb-2">Assunto</label>
                  <input 
                    type="text" 
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    required
                    placeholder="Ex: Problema com o pedido #123"
                    className="w-full bg-[#0f1115] border border-[#262933] rounded-lg px-4 py-3 text-white outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#9ca3af] mb-2">Mensagem</label>
                  <textarea 
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    required
                    rows={6}
                    placeholder="Descreva seu problema com detalhes..."
                    className="w-full bg-[#0f1115] border border-[#262933] rounded-lg px-4 py-3 text-white outline-none focus:border-cyan-500 resize-none"
                  ></textarea>
                </div>
                <div className="flex gap-4">
                  <button type="submit" disabled={loading} className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold px-6 py-3 rounded-lg flex items-center gap-2 transition-colors flex-1 justify-center">
                    {loading ? <Loader2 className="animate-spin" /> : "Enviar Ticket"}
                  </button>
                  <button type="button" onClick={() => setIsCreating(false)} className="bg-[#262933] hover:bg-[#374151] text-white font-bold px-6 py-3 rounded-lg transition-colors">
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          ) : activeTicket ? (
            <>
              <div className="p-6 border-b border-[#262933] bg-[#0f1115]">
                <h2 className="text-xl font-bold text-white">{activeTicket.subject}</h2>
                <p className="text-sm text-[#6b7280]">Criado em {new Date(activeTicket.createdAt).toLocaleDateString('pt-BR')} - {activeTicket.status === 'OPEN' ? 'Aberto' : 'Fechado'}</p>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {activeTicket.messages.map((m: any) => (
                  <div key={m.id} className={`flex ${m.isAdmin ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-[70%] rounded-2xl p-4 ${
                      m.isAdmin 
                        ? 'bg-[#262933] text-white rounded-tl-none' 
                        : 'bg-cyan-500 text-white rounded-tr-none'
                    }`}>
                      <p className="text-[15px] whitespace-pre-wrap leading-relaxed">{m.content}</p>
                      <span className={`text-[10px] mt-2 block ${m.isAdmin ? 'text-[#9ca3af]' : 'text-cyan-200'}`}>
                        {new Date(m.createdAt).toLocaleString('pt-BR')} {m.isAdmin ? '- Staff' : '- Você'}
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
                    placeholder="Digite sua resposta..."
                    className="flex-1 bg-[#181a20] border border-[#262933] rounded-full px-6 text-white outline-none focus:border-cyan-500"
                  />
                  <button type="submit" disabled={replying || !reply.trim()} className="w-12 h-12 rounded-full bg-cyan-500 hover:bg-cyan-600 flex items-center justify-center text-white disabled:opacity-50 shrink-0">
                    {replying ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                  </button>
                </form>
              ) : (
                <div className="p-4 border-t border-[#262933] bg-[#0f1115] text-center text-[#6b7280] text-sm">
                  Este ticket foi fechado e não pode receber novas mensagens.
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-[#6b7280]">
              <MessageSquare size={64} className="mb-4 opacity-20" />
              <p>Selecione um ticket na lista ou crie um novo.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
